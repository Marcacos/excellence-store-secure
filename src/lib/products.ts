import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Cor = { nome: string; hex: string };

export type Product = {
  id: string;
  nome: string;
  preco: number;
  categoria: string;
  imagem: string;
  descricao: string;
  composicao: string;
  tamanhos: string[];
  cores: Cor[];
  ativo: boolean;
};

export const CATEGORIAS = ["Novidades", "Masculino", "Feminino", "Acessórios"] as const;

export const SLUG_CATEGORIA: Record<string, string> = {
  novidades: "Novidades",
  masculino: "Masculino",
  feminino: "Feminino",
  acessorios: "Acessórios",
};

type Row = {
  id: string;
  nome: string;
  preco: number | string;
  categoria: string;
  imagem_url: string;
  descricao: string;
  composicao: string;
  tamanhos: string[] | null;
  cores: unknown;
  ativo: boolean;
};

export function mapProduto(r: Row): Product {
  const cores = Array.isArray(r.cores) ? (r.cores as Cor[]) : [];
  return {
    id: r.id,
    nome: r.nome,
    preco: Number(r.preco),
    categoria: r.categoria,
    imagem: r.imagem_url,
    descricao: r.descricao,
    composicao: r.composicao,
    tamanhos: r.tamanhos ?? [],
    cores,
    ativo: r.ativo,
  };
}

export async function listarProdutos(incluirInativos = false): Promise<Product[]> {
  let q = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (!incluirInativos) q = q.eq("ativo", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((r) => mapProduto(r as unknown as Row));
}

export function useProdutos(incluirInativos = false) {
  return useQuery({
    queryKey: ["produtos", incluirInativos],
    queryFn: () => listarProdutos(incluirInativos),
  });
}

export function useProduto(id: string) {
  return useQuery({
    queryKey: ["produto", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? mapProduto(data as unknown as Row) : null;
    },
  });
}

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
