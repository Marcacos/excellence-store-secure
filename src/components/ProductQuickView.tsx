import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { brl, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

export function ProductQuickView({
  produto,
  aberto,
  onOpenChange,
}: {
  produto: Product | null;
  aberto: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { adicionar } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cor, setCor] = useState("");
  const [tamanho, setTamanho] = useState("");

  useEffect(() => {
    if (produto) {
      setCor(produto.cores[0]?.nome ?? "");
      setTamanho(produto.tamanhos[1] ?? produto.tamanhos[0] ?? "");
    }
  }, [produto]);

  if (!produto) return null;

  function exigirConta() {
    if (user) return false;
    onOpenChange(false);
    toast.info("Crie sua conta para continuar", {
      description: "É necessário ter uma conta para comprar na Excellence Store.",
    });
    void navigate({ to: "/conta" });
    return true;
  }

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{produto.nome}</DialogTitle>
          <DialogDescription>{produto.descricao}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 sm:grid-cols-[160px_1fr]">
          <img
            src={produto.imagem}
            alt={produto.nome}
            loading="lazy"
            width={900}
            height={1100}
            className="aspect-[9/11] w-full rounded-md object-cover"
          />

          <div>
            <p className="text-lg font-semibold">{brl(produto.preco)}</p>

            <h3 className="mt-5 text-sm font-semibold">Cor: {cor}</h3>
            <div className="mt-2 flex gap-2">
              {produto.cores.map((c) => (
                <button
                  key={c.nome}
                  onClick={() => setCor(c.nome)}
                  aria-label={`Cor ${c.nome}`}
                  aria-pressed={c.nome === cor}
                  className={`h-8 w-8 rounded-full border-2 transition-colors ${
                    c.nome === cor ? "border-foreground" : "border-border"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>

            <h3 className="mt-5 text-sm font-semibold">Tamanho</h3>
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

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="sm:flex-1"
                onClick={() => {
                  if (exigirConta()) return;
                  adicionar(produto.id, tamanho, cor);
                  toast.success("Adicionado ao carrinho", {
                    description: `${produto.nome} · ${cor} · ${tamanho}`,
                  });
                  onOpenChange(false);
                }}
              >
                Adicionar ao carrinho
              </Button>
              <Button
                className="sm:flex-1"
                onClick={() => {
                  if (exigirConta()) return;
                  adicionar(produto.id, tamanho, cor);
                  onOpenChange(false);
                  void navigate({ to: "/carrinho" });
                }}
              >
                Comprar agora
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">{produto.composicao}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
