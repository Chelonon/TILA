// ============================================================
// FUNÇÕES AUXILIARES
// (a configuração da loja e o catálogo ficam em produtos.js)
// ============================================================
const dinheiro = (valor) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const $ = (id) => document.getElementById(id);
const produtoPorId = (id) => PRODUTOS.find((p) => p.id === id);

// A cesta fica salva no navegador, para não perder se recarregar a página
let cesta = [];
try {
  cesta = JSON.parse(localStorage.getItem("carrinho") || "[]");
  if (!Array.isArray(cesta)) cesta = [];
} catch (e) { cesta = []; }

const salvarCesta = () => {
  try { localStorage.setItem("carrinho", JSON.stringify(cesta)); } catch (e) {}
};

// ============================================================
// CATÁLOGO
// ============================================================
function mostrarCatalogo() {
  $("grade").innerHTML = PRODUTOS.map((p) => `
    <article class="produto" data-id="${p.id}">
      <div class="produto__foto"><img src="${p.imagens[0]}" alt="${p.nome}"></div>
      <div class="produto__info">
        <span>${p.nome}</span>
        <span class="produto__preco">${dinheiro(p.preco)}</span>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".produto").forEach((el) => {
    el.addEventListener("click", () => abrirPeca(Number(el.dataset.id)));
  });
}

// ============================================================
// PAINÉIS (abrir e fechar)
// ============================================================
function abrirPainel(id) {
  fecharPaineis();
  $(id).classList.add("ativo");
  $(id).setAttribute("aria-hidden", "false");
  $("fundo").classList.add("ativo");
}

function fecharPaineis() {
  document.querySelectorAll(".painel").forEach((p) => {
    p.classList.remove("ativo");
    p.setAttribute("aria-hidden", "true");
  });
  $("fundo").classList.remove("ativo");
}

$("fundo").addEventListener("click", fecharPaineis);
document.querySelectorAll("[data-fechar]").forEach((b) => b.addEventListener("click", fecharPaineis));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharPaineis(); });

// ============================================================
// PEÇA (painel com fotos e tamanhos)
// ============================================================
let pecaAtual = null;
let tamanhoEscolhido = null;

function abrirPeca(id) {
  pecaAtual = produtoPorId(id);
  tamanhoEscolhido = null;

  $("peca-imagem").src = pecaAtual.imagens[0];
  $("peca-imagem").alt = pecaAtual.nome;
  $("peca-nome").textContent = pecaAtual.nome;
  $("peca-preco").textContent = dinheiro(pecaAtual.preco);

  // Miniaturas (só aparecem se a peça tiver mais de uma foto)
  $("peca-miniaturas").innerHTML = pecaAtual.imagens.length > 1
    ? pecaAtual.imagens.map((img, i) =>
        `<img class="miniatura ${i === 0 ? "ativa" : ""}" src="${img}" alt="Foto ${i + 1} de ${pecaAtual.nome}" data-i="${i}">`
      ).join("")
    : "";
  document.querySelectorAll(".miniatura").forEach((m) => {
    m.addEventListener("click", () => {
      $("peca-imagem").src = pecaAtual.imagens[Number(m.dataset.i)];
      document.querySelectorAll(".miniatura").forEach((x) => x.classList.toggle("ativa", x === m));
    });
  });

  $("peca-tamanhos").innerHTML = pecaAtual.tamanhos
    .map((t) => `<button class="tamanho" data-tam="${t}">${t}</button>`)
    .join("");

  document.querySelectorAll(".tamanho").forEach((b) => {
    b.addEventListener("click", () => {
      tamanhoEscolhido = b.dataset.tam;
      document.querySelectorAll(".tamanho").forEach((x) => x.classList.remove("ativo"));
      b.classList.add("ativo");
      const aviso = document.querySelector(".aviso");
      if (aviso) aviso.remove();
    });
  });

  abrirPainel("painel-peca");
}

$("peca-adicionar").addEventListener("click", () => {
  if (!tamanhoEscolhido) {
    if (!document.querySelector(".aviso")) {
      $("peca-tamanhos").insertAdjacentHTML("afterend", '<p class="aviso">Escolha um tamanho.</p>');
    }
    return;
  }
  const existente = cesta.find((i) => i.id === pecaAtual.id && i.tamanho === tamanhoEscolhido);
  if (existente) existente.qtd += 1;
  else cesta.push({ id: pecaAtual.id, tamanho: tamanhoEscolhido, qtd: 1 });

  atualizar();
  abrirPainel("painel-cesta");
});

// ============================================================
// CESTA
// ============================================================
function mostrarCesta() {
  // remove da cesta peças que não existem mais no catálogo
  cesta = cesta.filter((i) => produtoPorId(i.id));

  const total = cesta.reduce((soma, i) => soma + produtoPorId(i.id).preco * i.qtd, 0);
  const quantidade = cesta.reduce((soma, i) => soma + i.qtd, 0);

  $("contador").textContent = quantidade;
  $("cesta-total").textContent = dinheiro(total);

  if (cesta.length === 0) {
    $("cesta-itens").innerHTML = '<p class="cesta__vazia">Sua cesta está vazia.</p>';
    return;
  }

  $("cesta-itens").innerHTML = cesta.map((i, pos) => {
    const p = produtoPorId(i.id);
    return `
      <div class="item">
        <img src="${p.imagens[0]}" alt="${p.nome}">
        <div>
          <p class="item__nome">${p.nome}</p>
          <p class="item__detalhe">Tamanho ${i.tamanho}</p>
          <div class="item__linha">
            <div class="item__qtd">
              <button data-menos="${pos}">−</button>
              <span>${i.qtd}</span>
              <button data-mais="${pos}">+</button>
            </div>
            <span>${dinheiro(p.preco * i.qtd)}</span>
          </div>
          <button class="item__remover" data-remover="${pos}">Remover</button>
        </div>
      </div>`;
  }).join("");

  document.querySelectorAll("[data-mais]").forEach((b) =>
    b.addEventListener("click", () => { cesta[b.dataset.mais].qtd += 1; atualizar(); }));
  document.querySelectorAll("[data-menos]").forEach((b) =>
    b.addEventListener("click", () => {
      const i = cesta[b.dataset.menos];
      i.qtd -= 1;
      if (i.qtd <= 0) cesta.splice(b.dataset.menos, 1);
      atualizar();
    }));
  document.querySelectorAll("[data-remover]").forEach((b) =>
    b.addEventListener("click", () => { cesta.splice(b.dataset.remover, 1); atualizar(); }));
}

function atualizar() {
  salvarCesta();
  mostrarCesta();
}

$("abrir-carrinho").addEventListener("click", () => abrirPainel("painel-cesta"));

// ============================================================
// FINALIZAR COMPRA (checkout único do Mercado Pago, via Worker)
// ============================================================
let finalizando = false;
$("finalizar").addEventListener("click", async () => {
  if (cesta.length === 0) {
    alert("Sua cesta está vazia.");
    return;
  }
  if (!CONFIG.apiCheckout || CONFIG.apiCheckout.includes("COLOQUE_A_URL")) {
    alert("A integração ainda não foi configurada. Falta inserir a URL do Cloudflare Worker em produtos.js.");
    return;
  }
  if (finalizando) return;

  finalizando = true;
  const botao = $("finalizar");
  const textoOriginal = botao.textContent;
  botao.disabled = true;
  botao.textContent = "PREPARANDO PAGAMENTO...";

  try {
    const resposta = await fetch(CONFIG.apiCheckout, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cesta.map((i) => ({ id: i.id, size: i.tamanho, quantity: i.qtd }))
      })
    });

    const dados = await resposta.json().catch(() => ({}));
    if (!resposta.ok) throw new Error(dados.error || "Não foi possível iniciar o pagamento.");
    if (!dados.checkout_url || !dados.checkout_url.startsWith("https://")) {
      throw new Error("O servidor não retornou um endereço de pagamento válido.");
    }

    cesta = [];
    atualizar();
    window.location.href = dados.checkout_url;
  } catch (erro) {
    console.error("Erro no checkout:", erro);
    alert(erro.message || "Ocorreu um erro ao preparar o pagamento. Tente novamente.");
  } finally {
    finalizando = false;
    botao.disabled = false;
    botao.textContent = textoOriginal;
  }
});

// ============================================================
// INÍCIO
// ============================================================
document.title = `${CONFIG.nomeLoja} | Moda Feminina`;
$("rodape-whats").href = `https://wa.me/${CONFIG.whatsapp}`;
$("rodape-copy").textContent = `© ${new Date().getFullYear()} ${CONFIG.nomeLoja}. Todos os direitos reservados.`;

mostrarCatalogo();
mostrarCesta();
