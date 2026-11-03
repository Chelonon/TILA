// ---------- Utilidades ----------
const moeda = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const $ = (id) => document.getElementById(id);

// ---------- Estado ----------
let categoriaAtual = "Todas";
let carrinho = [];

try {
  carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
} catch (e) {
  carrinho = [];
}

function salvar() {
  try { localStorage.setItem("carrinho", JSON.stringify(carrinho)); } catch (e) {}
}

function produtoPorId(id) {
  return PRODUTOS.find((p) => p.id === id);
}

// ---------- Imagem com fallback (se a foto não existir, mostra um fundo colorido) ----------
function imgFallback(img) {
  img.onerror = null;
  img.removeAttribute("src");
}

// ---------- Filtros ----------
function renderFiltros() {
  const categorias = ["Todas", ...new Set(PRODUTOS.map((p) => p.categoria))];
  $("filtros").innerHTML = categorias
    .map((c) => `<button class="${c === categoriaAtual ? "ativo" : ""}" data-cat="${c}">${c}</button>`)
    .join("");
}

$("filtros").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  categoriaAtual = btn.dataset.cat;
  renderFiltros();
  renderProdutos();
});

// ---------- Catálogo ----------
function renderProdutos() {
  const lista = PRODUTOS.filter((p) => categoriaAtual === "Todas" || p.categoria === categoriaAtual);

  $("grade").innerHTML = lista
    .map(
      (p) => `
    <article class="card">
      <img class="card-img" src="${p.imagem}" alt="${p.nome}" loading="lazy" onerror="imgFallback(this)">
      <div class="card-corpo">
        <div class="card-nome">${p.nome}</div>
        <div class="card-preco">${moeda(p.preco)}</div>
        <select id="tam-${p.id}" aria-label="Tamanho de ${p.nome}">
          ${p.tamanhos.map((t) => `<option value="${t}">Tamanho ${t}</option>`).join("")}
        </select>
        <button class="btn-principal" data-add="${p.id}">Adicionar ao carrinho</button>
      </div>
    </article>`
    )
    .join("");
}

$("grade").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (!btn) return;
  const id = Number(btn.dataset.add);
  const tamanho = $("tam-" + id).value;
  adicionar(id, tamanho);
});

// ---------- Carrinho ----------
function adicionar(id, tamanho) {
  const existente = carrinho.find((i) => i.id === id && i.tamanho === tamanho);
  if (existente) existente.qtd += 1;
  else carrinho.push({ id, tamanho, qtd: 1 });
  salvar();
  renderCarrinho();
  abrirCarrinho();
}

function alterarQtd(id, tamanho, delta) {
  const item = carrinho.find((i) => i.id === id && i.tamanho === tamanho);
  if (!item) return;
  item.qtd += delta;
  if (item.qtd <= 0) carrinho = carrinho.filter((i) => i !== item);
  salvar();
  renderCarrinho();
}

function remover(id, tamanho) {
  carrinho = carrinho.filter((i) => !(i.id === id && i.tamanho === tamanho));
  salvar();
  renderCarrinho();
}

function totalCarrinho() {
  return carrinho.reduce((soma, i) => {
    const p = produtoPorId(i.id);
    return p ? soma + p.preco * i.qtd : soma;
  }, 0);
}

function renderCarrinho() {
  // remove do carrinho produtos que não existem mais no catálogo
  carrinho = carrinho.filter((i) => produtoPorId(i.id));

  const qtdTotal = carrinho.reduce((s, i) => s + i.qtd, 0);
  $("contador").textContent = qtdTotal;
  $("total").textContent = moeda(totalCarrinho());

  if (carrinho.length === 0) {
    $("itensCarrinho").innerHTML = `<p class="vazio">Seu carrinho está vazio.</p>`;
    return;
  }

  $("itensCarrinho").innerHTML = carrinho
    .map((i) => {
      const p = produtoPorId(i.id);
      return `
      <div class="item">
        <img class="item-img" src="${p.imagem}" alt="${p.nome}" onerror="imgFallback(this)">
        <div class="item-info">
          <strong>${p.nome}</strong><br>
          <small>Tamanho ${i.tamanho} · ${moeda(p.preco)}</small>
          <div class="qtd">
            <button data-menos="${i.id}|${i.tamanho}">−</button>
            <span>${i.qtd}</span>
            <button data-mais="${i.id}|${i.tamanho}">+</button>
            <button class="remover" data-rem="${i.id}|${i.tamanho}">Remover</button>
          </div>
        </div>
      </div>`;
    })
    .join("");
}

$("itensCarrinho").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const leitura = (attr) => {
    const [id, tam] = b.dataset[attr].split("|");
    return [Number(id), tam];
  };
  if (b.dataset.menos) alterarQtd(...leitura("menos"), -1);
  if (b.dataset.mais) alterarQtd(...leitura("mais"), 1);
  if (b.dataset.rem) remover(...leitura("rem"));
});

// ---------- Abrir / fechar ----------
function abrirCarrinho() {
  $("carrinho").classList.add("aberto");
  $("fundo").classList.add("aberto");
}
function fecharCarrinho() {
  $("carrinho").classList.remove("aberto");
  $("fundo").classList.remove("aberto");
}
$("abrirCarrinho").addEventListener("click", abrirCarrinho);
$("fecharCarrinho").addEventListener("click", fecharCarrinho);
$("fundo").addEventListener("click", fecharCarrinho);

$("limpar").addEventListener("click", () => {
  carrinho = [];
  salvar();
  renderCarrinho();
});

// ---------- Finalizar pedido (via WhatsApp) ----------
$("finalizar").addEventListener("click", () => {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  const linhas = carrinho.map((i) => {
    const p = produtoPorId(i.id);
    return `• ${i.qtd}x ${p.nome} (tam. ${i.tamanho}) - ${moeda(p.preco * i.qtd)}`;
  });

  let msg = `Olá! Quero fazer um pedido na ${CONFIG.nomeLoja}:\n\n${linhas.join("\n")}\n\nTotal: ${moeda(totalCarrinho())}`;

  if (CONFIG.linkPagamento) {
    msg += `\n\n(Pagamento: ${CONFIG.linkPagamento})`;
  }

  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
});

// ---------- Início ----------
document.title = `${CONFIG.nomeLoja} | Moda Feminina`;
$("logo").textContent = CONFIG.nomeLoja;
$("rodapeTexto").textContent = `© ${new Date().getFullYear()} ${CONFIG.nomeLoja}. Todos os direitos reservados.`;
$("linkWhats").href = `https://wa.me/${CONFIG.whatsapp}`;

renderFiltros();
renderProdutos();
renderCarrinho();
