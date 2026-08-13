import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./products";

export type CartLine = {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
  tamanho: string;
  cor: string;
  qtd: number;
};

type CartCtx = {
  itens: CartLine[];
  total: number;
  quantidade: number;
  adicionar: (produto: Product, tamanho: string, cor: string, qtd?: number) => void;
  remover: (id: string, tamanho: string, cor: string) => void;
  alterarQtd: (id: string, tamanho: string, cor: string, qtd: number) => void;
  limpar: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "excellence-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [linhas, setLinhas] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        setLinhas(parsed.filter((l) => typeof l?.preco === "number" && typeof l?.nome === "string"));
      }
    } catch {
      /* ignora storage inválido */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(linhas));
    } catch {
      /* storage indisponível */
    }
  }, [linhas]);

  const value = useMemo<CartCtx>(
    () => ({
      itens: linhas,
      total: linhas.reduce((s, i) => s + i.preco * i.qtd, 0),
      quantidade: linhas.reduce((s, i) => s + i.qtd, 0),
      adicionar: (produto, tamanho, cor, qtd = 1) =>
        setLinhas((prev) => {
          const igual = (l: CartLine) =>
            l.id === produto.id && l.tamanho === tamanho && l.cor === cor;
          if (!prev.some(igual))
            return [
              ...prev,
              {
                id: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                imagem: produto.imagem,
                tamanho,
                cor,
                qtd,
              },
            ];
          return prev.map((l) => (igual(l) ? { ...l, qtd: l.qtd + qtd } : l));
        }),
      remover: (id, tamanho, cor) =>
        setLinhas((prev) =>
          prev.filter((l) => !(l.id === id && l.tamanho === tamanho && l.cor === cor)),
        ),
      alterarQtd: (id, tamanho, cor, qtd) =>
        setLinhas((prev) =>
          prev
            .map((l) => (l.id === id && l.tamanho === tamanho && l.cor === cor ? { ...l, qtd } : l))
            .filter((l) => l.qtd > 0),
        ),
      limpar: () => setLinhas([]),
    }),
    [linhas],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
