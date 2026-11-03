// ============================================
// ARQUIVO PARA EDITAR E ATUALIZAR A LOJA
// ============================================

const CONFIG = {
  nomeLoja: "TILA",
  // WhatsApp com código do país + DDD + número, só números. Ex: 5531999999999
  whatsapp: "5531999999999",
  // Opcional: link de pagamento (Mercado Pago, Pix, etc). Deixe "" para não usar.
  linkPagamento: ""
};

// Para adicionar uma roupa, copie um bloco { ... } e mude os dados.
// - id: número único, não repita
// - imagem: coloque a foto na pasta "imagens" e escreva o nome do arquivo aqui
// - tamanhos: lista de tamanhos disponíveis
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
  },
  {
    id: 4,
    nome: "Saia Plissada",
    preco: 99.90,
    categoria: "Saias",
    tamanhos: ["P", "M", "G"],
    imagem: "imagens/saia-plissada.jpg"
  },
  {
    id: 5,
    nome: "Vestido Preto Básico",
    preco: 109.90,
    categoria: "Vestidos",
    tamanhos: ["P", "M", "G"],
    imagem: "imagens/vestido-preto.jpg"
  },
  {
    id: 6,
    nome: "Cropped Canelado",
    preco: 49.90,
    categoria: "Blusas",
    tamanhos: ["P", "M", "G"],
    imagem: "imagens/cropped.jpg"
  },
  {
    id: 1,
    nome: "Vestido Floral Midi",
    preco: 129.90,
    categoria: "Vestidos",
    tamanhos: ["P", "M", "G"],
    imagem: "imagens/vestido-floral.jpg"
  },
  {
    id: 1,
    nome: "Vestido Floral Midi",
    preco: 129.90,
    categoria: "Vestidos",
    tamanhos: ["P", "M", "G"],
    imagem: "imagens/vestido-floral.jpg"
  },
];
