import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import hero from "@/assets/hero-tshirts.jpg";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { Button } from "@/components/ui/button";
import { produtos, brl, type Product } from "@/lib/products";
import { ProductQuickView } from "@/components/ProductQuickView";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Excellence Store — Coleção Stam de Camisetas Premium" },
      {
        name: "description",
        content:
          "Camisetas premium em algodão da nova coleção Stam. Minimalismo, qualidade e entrega rápida na Excellence Store.",
      },
      { property: "og:title", content: "Excellence Store — Coleção Stam" },
      {
        property: "og:description",
        content: "Nova coleção de camisetas Stam: algodão premium, caimento impecável.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [selecionado, setSelecionado] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main>
        <section className="relative border-b border-border">
          <img
            src={hero}
            alt="Nova coleção de camisetas Stam"
            width={1600}
            height={900}
            className="h-[52vh] min-h-70 w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-6xl px-4">
              <div className="max-w-md">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Novidades
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  Nova Coleção de Camisetas Stam
                </h1>
                <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                  Algodão premium, caimento reto e acabamento impecável.
                </p>
                <Button asChild className="mt-6">
                  <a href="#vitrine">Ver coleção</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="vitrine" className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-xl font-semibold tracking-tight">Vitrine</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {produtos.map((p) => (
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
                  <h3 className="mt-3 text-sm font-medium text-foreground">{p.nome}</h3>
                  <p className="text-sm text-muted-foreground">{brl(p.preco)}</p>
                </button>
                <Button variant="outline" className="mt-3 w-full" onClick={() => setSelecionado(p)}>
                  Selecionar opções
                </Button>
              </article>
            ))}
          </div>
        </section>
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
