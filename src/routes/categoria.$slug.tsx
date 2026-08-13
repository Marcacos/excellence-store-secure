import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductQuickView } from "@/components/ProductQuickView";
import { useProdutos, SLUG_CATEGORIA, type Product } from "@/lib/products";

export const Route = createFileRoute("/categoria/$slug")({
  beforeLoad: ({ params }) => {
    if (!SLUG_CATEGORIA[params.slug]) throw notFound();
  },
  head: ({ params }) => {
    const nome = SLUG_CATEGORIA[params.slug] ?? "Categoria";
    return {
      meta: [
        { title: `${nome} — Excellence Store` },
        { name: "description", content: `Camisetas e peças da categoria ${nome} na Excellence Store.` },
        { property: "og:title", content: `${nome} — Excellence Store` },
        { property: "og:description", content: `Confira as peças de ${nome} da coleção Stam.` },
      ],
    };
  },
  component: Categoria,
});

function Categoria() {
  const { slug } = Route.useParams();
  const nome = SLUG_CATEGORIA[slug] ?? "Categoria";
  const [selecionado, setSelecionado] = useState<Product | null>(null);
  const { data, isLoading } = useProdutos();
  const lista = (data ?? []).filter((p) => p.categoria === nome);

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-2xl font-semibold tracking-tight">{nome}</h1>

        {isLoading ? (
          <p className="mt-8 text-sm text-muted-foreground">Carregando produtos...</p>
        ) : lista.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">
            Nenhuma peça nesta categoria por enquanto. Em breve novidades!
          </p>
        ) : (
          <ProductGrid produtos={lista} onSelecionar={setSelecionado} />
        )}
      </main>

      <ProductQuickView
        produto={selecionado}
        aberto={selecionado !== null}
        onOpenChange={(v) => !v && setSelecionado(null)}
      />
      <StoreFooter />
    </div>
  );
}
