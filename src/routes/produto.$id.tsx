import { createFileRoute, useNavigate, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { Button } from "@/components/ui/button";
import { getProduto, brl } from "@/lib/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/produto/$id")({
  loader: ({ params }) => {
    const produto = getProduto(params.id);
    if (!produto) throw notFound();
    return { produto };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Produto indisponível — Excellence Store" }, { name: "robots", content: "noindex" }],
      };
    }
    const { produto } = loaderData;
    return {
      meta: [
        { title: `${produto.nome} — Excellence Store` },
        { name: "description", content: produto.descricao },
        { property: "og:title", content: `${produto.nome} — Excellence Store` },
        { property: "og:description", content: produto.descricao },
      ],
    };
  },
  errorComponent: () => <Aviso texto="Não foi possível carregar este produto." />,
  notFoundComponent: () => <Aviso texto="Produto não encontrado." />,
  component: ProdutoPage,
});

function Aviso({ texto }: { texto: string }) {
  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <div className="mx-auto max-w-6xl px-4 py-24 text-center">
        <p className="text-muted-foreground">{texto}</p>
        <Button asChild className="mt-6">
          <Link to="/">Voltar à loja</Link>
        </Button>
      </div>
    </div>
  );
}

function ProdutoPage() {
  const { produto } = Route.useLoaderData();
  const { adicionar } = useCart();
  const navigate = useNavigate();
  const [tamanho, setTamanho] = useState(produto.tamanhos[1] ?? produto.tamanhos[0]!);
  const [zoom, setZoom] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2">
        <div className="overflow-hidden rounded-md bg-secondary">
          <img
            src={produto.imagem}
            alt={produto.nome}
            width={900}
            height={1100}
            onClick={() => setZoom((v) => !v)}
            className={`aspect-[9/11] w-full object-cover transition-transform duration-500 ${
              zoom ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
            }`}
          />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{produto.nome}</h1>
          <p className="mt-2 text-xl">{brl(produto.preco)}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{produto.descricao}</p>

          <h2 className="mt-8 text-sm font-semibold">Tamanho</h2>
          <div className="mt-2 flex gap-2">
            {produto.tamanhos.map((t) => (
              <button
                key={t}
                onClick={() => setTamanho(t)}
                className={`h-10 w-12 rounded-md border text-sm transition-colors ${
                  t === tamanho
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:bg-secondary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <h2 className="mt-8 text-sm font-semibold">Detalhes técnicos</h2>
          <p className="mt-1 text-sm text-muted-foreground">{produto.composicao}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              className="sm:flex-1"
              onClick={() => {
                adicionar(produto.id, tamanho);
                void navigate({ to: "/carrinho" });
              }}
            >
              Comprar agora
            </Button>
            <Button
              variant="outline"
              className="sm:flex-1"
              onClick={() => {
                adicionar(produto.id, tamanho);
                toast.success("Adicionado ao carrinho", { description: `${produto.nome} · ${tamanho}` });
              }}
            >
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}
