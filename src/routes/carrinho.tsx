import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Trash2, ShieldCheck } from "lucide-react";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { brl } from "@/lib/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Carrinho e Checkout — Excellence Store" },
      {
        name: "description",
        content: "Revise seus itens e finalize a compra em um checkout simples e seguro.",
      },
      { property: "og:title", content: "Carrinho e Checkout — Excellence Store" },
      { property: "og:description", content: "Checkout de página única, rápido e seguro." },
    ],
  }),
  component: Carrinho,
});

const checkoutSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome completo").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  endereco: z.string().trim().min(5, "Informe o endereço completo").max(200),
  cidade: z.string().trim().min(2, "Informe a cidade").max(80),
  cep: z.string().trim().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
});

function Carrinho() {
  const { itens, total, alterarQtd, remover, limpar } = useCart();
  const [erros, setErros] = useState<Record<string, string>>({});
  const [concluido, setConcluido] = useState(false);

  function finalizar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(e.currentTarget));
    const r = checkoutSchema.safeParse(dados);
    if (!r.success) {
      const map: Record<string, string> = {};
      for (const issue of r.error.issues) map[String(issue.path[0])] = issue.message;
      setErros(map);
      return;
    }
    setErros({});
    limpar();
    setConcluido(true);
    toast.success("Pedido confirmado!", { description: "Você receberá a confirmação por e-mail." });
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-2xl font-semibold tracking-tight">Carrinho e Checkout</h1>

        {concluido ? (
          <div className="mt-10 rounded-lg border border-border p-10 text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-foreground" />
            <p className="mt-4 text-lg font-medium">Pedido confirmado com sucesso</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Obrigado por comprar na Excellence Store.
            </p>
            <Button asChild className="mt-6">
              <Link to="/">Continuar comprando</Link>
            </Button>
          </div>
        ) : itens.length === 0 ? (
          <div className="mt-10 rounded-lg border border-border p-10 text-center">
            <p className="text-muted-foreground">Seu carrinho está vazio.</p>
            <Button asChild className="mt-6">
              <Link to="/">Ver produtos</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <ul className="divide-y divide-border">
              {itens.map((i) => (
                <li key={`${i.id}-${i.tamanho}`} className="flex gap-4 py-5">
                  <img
                    src={i.produto.imagem}
                    alt={i.produto.nome}
                    loading="lazy"
                    width={900}
                    height={1100}
                    className="h-24 w-20 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{i.produto.nome}</p>
                    <p className="text-xs text-muted-foreground">Tamanho {i.tamanho}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => alterarQtd(i.id, i.tamanho, i.qtd - 1)}
                        aria-label="Diminuir quantidade"
                      >
                        −
                      </Button>
                      <span className="w-6 text-center text-sm">{i.qtd}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => alterarQtd(i.id, i.tamanho, i.qtd + 1)}
                        aria-label="Aumentar quantidade"
                      >
                        +
                      </Button>
                      <button
                        onClick={() => remover(i.id, i.tamanho)}
                        className="ml-2 text-muted-foreground hover:text-destructive"
                        aria-label="Remover item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium">{brl(i.produto.preco * i.qtd)}</p>
                </li>
              ))}
            </ul>

            <form onSubmit={finalizar} className="rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold">Finalizar compra</h2>
              <div className="mt-5 space-y-4">
                {(
                  [
                    ["nome", "Nome completo", "text"],
                    ["email", "E-mail", "email"],
                    ["endereco", "Endereço", "text"],
                    ["cidade", "Cidade", "text"],
                    ["cep", "CEP", "text"],
                  ] as const
                ).map(([name, label, type]) => (
                  <div key={name}>
                    <Label htmlFor={name}>{label}</Label>
                    <Input id={name} name={name} type={type} maxLength={255} className="mt-1" />
                    {erros[name] && (
                      <p className="mt-1 text-xs text-destructive">{erros[name]}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-lg font-semibold">{brl(total)}</span>
              </div>
              <Button type="submit" className="mt-4 w-full">
                Pagar com segurança
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" /> Conexão criptografada e dados validados
              </p>
            </form>
          </div>
        )}
      </main>
      <StoreFooter />
    </div>
  );
}
