import teeBlack from "@/assets/tee-black.jpg";
import teeWhite from "@/assets/tee-white.jpg";
import teeGrey from "@/assets/tee-grey.jpg";
import teeNavy from "@/assets/tee-navy.jpg";

export type Product = {
  id: string;
  nome: string;
  preco: number;
  categoria: "Novidades" | "Masculino" | "Feminino" | "Acessórios";
  imagem: string;
  descricao: string;
  composicao: string;
  tamanhos: string[];
  cores: { nome: string; hex: string }[];
};

export const produtos: Product[] = [
  {
    id: "stam-preta",
    nome: "Camiseta Stam Preta",
    preco: 189.9,
    categoria: "Novidades",
    imagem: teeBlack,
    descricao:
      "Camiseta da nova coleção Stam em algodão pima de gramatura alta, com caimento reto e acabamento premium.",
    composicao: "100% algodão pima · 190 g/m² · Gola reforçada",
    tamanhos: ["P", "M", "G", "GG"],
    cores: [{ nome: "Preto", hex: "#111111" }, { nome: "Grafite", hex: "#3a3a3a" }, { nome: "Branco", hex: "#f5f5f5" }],
  },
  {
    id: "stam-branca",
    nome: "Camiseta Stam Branca",
    preco: 179.9,
    categoria: "Novidades",
    imagem: teeWhite,
    descricao:
      "O básico definitivo da coleção Stam: branco puro, toque macio e resistência à lavagem.",
    composicao: "100% algodão penteado · 180 g/m² · Costura dupla",
    tamanhos: ["P", "M", "G", "GG"],
    cores: [{ nome: "Branco", hex: "#f5f5f5" }, { nome: "Off-white", hex: "#e6e1d8" }, { nome: "Preto", hex: "#111111" }],
  },
  {
    id: "stam-cinza",
    nome: "Camiseta Stam Cinza Mescla",
    preco: 184.9,
    categoria: "Masculino",
    imagem: teeGrey,
    descricao:
      "Cinza mescla em fio penteado, versátil para o dia a dia com modelagem confortável.",
    composicao: "90% algodão / 10% viscose · 185 g/m²",
    tamanhos: ["P", "M", "G", "GG"],
    cores: [{ nome: "Cinza Mescla", hex: "#9a9a9a" }, { nome: "Chumbo", hex: "#4a4f55" }, { nome: "Preto", hex: "#111111" }],
  },
  {
    id: "stam-marinho",
    nome: "Camiseta Stam Azul Marinho",
    preco: 194.9,
    categoria: "Feminino",
    imagem: teeNavy,
    descricao:
      "Azul marinho profundo com tingimento reativo que preserva a cor por mais tempo.",
    composicao: "100% algodão · 190 g/m² · Tingimento reativo",
    tamanhos: ["PP", "P", "M", "G"],
    cores: [{ nome: "Azul Marinho", hex: "#1e2a44" }, { nome: "Azul Claro", hex: "#8fa8c8" }, { nome: "Branco", hex: "#f5f5f5" }],
  },
];

export function getProduto(id: string) {
  return produtos.find((p) => p.id === id);
}

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
