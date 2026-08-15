import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { Button } from "@/components/ui/button";
import { useProduto, brl } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/produto/$id")({
  head: () => ({
    meta: [
      { title: "Produto — Excellence Store" },
      { name: "description", content: "Detalhes da peça da coleção Stam na Excellence Store." },
      { property: "og:title", content: "Produto — Excellence Store" },
      { property: "og:description", content: "Detalhes da peça da coleção Stam." },
    ],
  }),
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
  const { id } = Route.useParams();
  const { data: produto, isLoading } = useProduto(id);
  const { adicionar } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tamanho, setTamanho] = useState("");
  const [cor, setCor] = useState("");
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (produto) {
      setTamanho(produto.tamanhos[1] ?? produto.tamanhos[0] ?? "");
      setCor(produto.cores[0]?.nome ?? "");
    }
  }, [produto]);

  if (isLoading) {
    return <Aviso texto="Carregando produto..." />;
  }
  if (!produto) {
    return <Aviso texto="Produto não encontrado." />;
  }

  function exigirConta() {
    if (user) return false;
    toast.info("Crie sua conta para comprar");
    void navigate({ to: "/conta", search: { redirect: "/carrinho" } });
    return true;
  }

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

          <h2 className="mt-8 text-sm font-semibold">Cor: {cor}</h2>
          <div className="mt-2 flex gap-2">
            {produto.cores.map((c) => (
              <button
                key={c.nome}
                onClick={() => setCor(c.nome)}
                aria-label={`Cor ${c.nome}`}
                aria-pressed={c.nome === cor}
                className={`h-9 w-9 rounded-full border-2 transition-colors ${
                  c.nome === cor ? "border-foreground" : "border-border"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

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
                if (exigirConta()) return;
                adicionar(produto, tamanho, cor);
                void navigate({ to: "/carrinho" });
              }}
            >
              Comprar agora
            </Button>
            <Button
              variant="outline"
              className="sm:flex-1"
              onClick={() => {
                if (exigirConta()) return;
                adicionar(produto, tamanho, cor);
                toast.success("Adicionado ao carrinho", {
                  description: `${produto.nome} · ${cor} · ${tamanho}`,
                });
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
