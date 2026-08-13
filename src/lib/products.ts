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
  },
];

export function getProduto(id: string) {
  return produtos.find((p) => p.id === id);
}

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
