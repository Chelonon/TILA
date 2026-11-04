// Configurações da loja TILA
const CONFIG = {
  nomeLoja: "TILA",
  whatsapp: "5531983909760",
  // Depois de publicar o Cloudflare Worker, coloque aqui a URL dele.
  // Exemplo: https://tila-checkout.seuusuario.workers.dev/checkout
  apiCheckout: "https://tila-pagamentos.dmcheloni.workers.dev/checkout"
};

// O preço e os tamanhos também são conferidos no Worker (servidor).
// Ao adicionar/alterar produtos, atualize o catálogo nos dois lugares.
const PRODUTOS = [
  {
    id: 1,
    nome: "Vestido Floral Midi",
    preco: 129.90,
    categoria: "Vestidos",
    tamanhos: ["P", "M", "G"],
    imagem: "imagens/vestido-floral.jpg"
  },
  {
    id: 2,
    nome: "Blusa de Linho Branca",
    preco: 79.90,
    categoria: "Blusas",
    tamanhos: ["P", "M", "G", "GG"],
    imagem: "imagens/blusa-linho.jpg"
  },
  {
    id: 3,
    nome: "Calça Wide Leg",
    preco: 149.90,
    categoria: "Calças",
    tamanhos: ["36", "38", "40", "42"],
    imagem: "imagens/calca-wide.jpg"
  }
];
