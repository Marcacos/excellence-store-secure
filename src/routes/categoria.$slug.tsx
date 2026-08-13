import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { Button } from "@/components/ui/button";
import { ProductQuickView } from "@/components/ProductQuickView";
import { produtos, brl, type Product } from "@/lib/products";

const categorias: Record<string, Product["categoria"]> = {
  novidades: "Novidades",
  masculino: "Masculino",
  feminino: "Feminino",
  acessorios: "Acessórios",
};

export const Route = createFileRoute("/categoria/$slug")({
  head: ({ params }) => {
    const nome = categorias[params.slug] ?? "Categoria";
    return {
      meta: [
        { title: `${nome} — Excellence Store` },
        {
          name: "description",
          content: `Peças da categoria ${nome} na Excellence Store: algodão premium e acabamento impecável.`,
        },
        { property: "og:title", content: `${nome} — Excellence Store` },
        {
          property: "og:description",
          content: `Confira as peças de ${nome} da Excellence Store.`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CategoriaPage,
});

function CategoriaPage() {
  const { slug } = Route.useParams();
  const [selecionado, setSelecionado] = useState<Product | null>(null);
  const nome = categorias[slug];
  const lista = nome ? produtos.filter((p) => p.categoria === nome) : [];

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-2xl font-semibold tracking-tight">{nome ?? "Categoria"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {lista.length} {lista.length === 1 ? "produto" : "produtos"}
        </p>

        {lista.length === 0 ? (
          <div className="mt-10 rounded-md border border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Ainda não temos peças nesta categoria. Em breve!
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/">Voltar à vitrine</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {lista.map((p) => (
              <article key={p.id} className="group">
                <button onClick={() => setSelecionado(p)} className="block w-full text-left">
                  <div className="overflow-hidden rounded-md bg-secondary">
                    <img
                      src={p.imagem}
                      alt={p.nome}
                      loading="lazy"
                      width={900}
                      height={1100}
                      className="aspect-[9/11] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <h2 className="mt-3 text-sm font-medium text-foreground">{p.nome}</h2>
                  <p className="text-sm text-muted-foreground">{brl(p.preco)}</p>
                </button>
                <Button variant="outline" className="mt-3 w-full" onClick={() => setSelecionado(p)}>
                  Selecionar opções
                </Button>
              </article>
            ))}
          </div>
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
