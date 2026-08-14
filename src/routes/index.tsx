import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import hero from "@/assets/hero-tshirts.jpg";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { Button } from "@/components/ui/button";
import { useProdutos, type Product } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductQuickView } from "@/components/ProductQuickView";

const vantagens = [
  { icon: Truck, texto: "Entrega rápida para todo o Brasil" },
  { icon: RefreshCcw, texto: "Troca facilitada em até 30 dias" },
  { icon: ShieldCheck, texto: "Pagamento 100% seguro e criptografado" },
] as const;

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
        <section className="relative overflow-hidden border-b border-border">
          <img
            src={hero}
            alt="Nova coleção de camisetas Stam"
            width={1600}
            height={900}
            className="h-[58vh] min-h-90 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/35 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-6xl px-4">
              <div className="max-w-md">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Novidades
                </p>
                <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
                  Nova Coleção de Camisetas Stam
                </h1>
                <p className="mt-4 text-sm text-muted-foreground sm:text-base">
                  Algodão premium, caimento reto e acabamento impecável — feita para durar.
                </p>
                <div className="mt-7 flex items-center gap-3">
                  <Button asChild size="lg" className="shadow-md">
                    <a href="#vitrine">Ver coleção</a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-foreground/15">
                    <a href="#vitrine">Novidades</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-secondary/30">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-3">
            {vantagens.map(({ icon: Icon, texto }) => (
              <div key={texto} className="flex items-center gap-3 text-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-muted-foreground">{texto}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="vitrine" className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Coleção completa
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">Vitrine</h2>
            </div>
            {(produtos?.length ?? 0) > 0 && (
              <p className="hidden text-sm text-muted-foreground sm:block">
                {produtos?.length} {produtos?.length === 1 ? "produto" : "produtos"}
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[9/11] w-full rounded-xl bg-secondary" />
                  <div className="mt-3 h-3.5 w-3/4 rounded bg-secondary" />
                  <div className="mt-2 h-3.5 w-1/3 rounded bg-secondary" />
                </div>
              ))}
            </div>
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
