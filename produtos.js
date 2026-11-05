// Configurações da loja TILA
const CONFIG = {
  nomeLoja: "TILA",
  whatsapp: "5531983909760",
  // URL do Cloudflare Worker que cria o pagamento no Mercado Pago
  apiCheckout: "https://tila-pagamentos.dmcheloni.workers.dev/checkout"
};

// O preço e os tamanhos também são conferidos no Worker (servidor).
// Ao adicionar/alterar produtos, atualize o catálogo nos dois lugares.
// As fotos ficam só no site: "imagens" é uma lista, a primeira é a foto principal.
// (Por enquanto as 3 peças usam as mesmas 3 fotos de teste.)
const PRODUTOS = [
  {
    id: 1,
    nome: "Vestido Floral Midi",
    preco: 0.01,
    categoria: "Vestidos",
    tamanhos: ["P", "M", "G"],
    imagens: [
      "imagens/foto-1.jpeg",
      "imagens/foto-2.jpeg",
      "imagens/foto-3.jpeg"
    ]
  },
  {
    id: 2,
    nome: "Blusa de Linho Branca",
    preco: 79.90,
    categoria: "Blusas",
    tamanhos: ["P", "M", "G", "GG"],
    imagens: [
      "imagens/foto-2.jpeg",
      "imagens/foto-1.jpeg",
      "imagens/foto-3.jpeg"
    ]
  },
  {
    id: 3,
    nome: "Calça Wide Leg",
    preco: 149.90,
    categoria: "Calças",
    tamanhos: ["36", "38", "40", "42"],
    imagens: [
      "imagens/foto-3.jpeg",
      "imagens/foto-2.jpeg",
      "imagens/foto-1.jpeg"
    ]
  }
];
