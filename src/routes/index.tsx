import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import hero from "@/assets/hero-tshirts.jpg";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { Button } from "@/components/ui/button";
import { useProdutos, type Product } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";
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
  const { data: produtos, isLoading } = useProdutos();

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

          {isLoading ? (
            <p className="mt-8 text-sm text-muted-foreground">Carregando produtos...</p>
          ) : (produtos?.length ?? 0) === 0 ? (
            <p className="mt-8 text-sm text-muted-foreground">
              Nenhum produto cadastrado ainda. Volte em breve!
            </p>
          ) : (
            <ProductGrid produtos={produtos ?? []} onSelecionar={setSelecionado} />
          )}
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
