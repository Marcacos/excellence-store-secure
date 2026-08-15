import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/conta")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
    const r = search["redirect"];
    return typeof r === "string" && r.startsWith("/") ? { redirect: r } : {};
  },
  head: () => ({
    meta: [
      { title: "Criar conta ou entrar — Excellence Store" },
      {
        name: "description",
        content:
          "Crie sua conta na Excellence Store para finalizar compras com segurança e acompanhar seus pedidos.",
      },
      { property: "og:title", content: "Criar conta — Excellence Store" },
      {
        property: "og:description",
        content: "Conta gratuita para comprar com segurança na Excellence Store.",
      },
    ],
  }),
  component: ContaPage,
});

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100).optional(),
  email: z.string().trim().email("E-mail inválido").max(255),
  senha: z.string().min(6, "A senha precisa ter ao menos 6 caracteres").max(72),
});

function ContaPage() {
  const { user, isAdmin, sair, carregando, papelCarregando } = useAuth();
  const navigate = useNavigate();
  const { redirect: destino } = Route.useSearch();
  const [modo, setModo] = useState<"cadastro" | "login">("cadastro");
  const [erros, setErros] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(e.currentTarget));
    const r = schema.safeParse(dados);
    if (!r.success) {
      const map: Record<string, string> = {};
      for (const issue of r.error.issues) map[String(issue.path[0])] = issue.message;
      setErros(map);
      return;
    }
    setErros({});
    setEnviando(true);
    try {
      if (modo === "cadastro") {
        const { data: cadastro, error } = await supabase.auth.signUp({
          email: r.data.email,
          password: r.data.senha,
          options: {
            emailRedirectTo: `${window.location.origin}${destino ?? "/carrinho"}`,
            data: { nome: r.data.nome ?? "" },
          },
        });
        if (error) throw error;
        if (!cadastro.session) {
          // sem sessão automática: já entra com as mesmas credenciais
          const { error: erroLogin } = await supabase.auth.signInWithPassword({
            email: r.data.email,
            password: r.data.senha,
          });
          if (erroLogin) throw erroLogin;
        }
        toast.success("Conta criada!", { description: "Agora você já pode finalizar sua compra." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: r.data.email,
          password: r.data.senha,
        });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
      }

      const { data: sess } = await supabase.auth.getSession();
      const uid = sess.session?.user.id;
      if (uid) {
        const { data: papel } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", uid)
          .eq("role", "admin")
          .maybeSingle();
        if (papel) {
          void navigate({ to: "/admin" });
          return;
        }
      }
      void navigate({ to: destino ?? "/", replace: true });
    } catch (err) {
      toast.error("Não foi possível continuar", {
        description: err instanceof Error ? err.message : "Tente novamente.",
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main className="mx-auto max-w-md px-4 py-16 sm:py-20">
        {carregando ? (
          <div className="store-card animate-pulse p-8 shadow-sm">
            <div className="h-6 w-2/3 rounded bg-secondary" />
            <div className="mt-3 h-4 w-1/2 rounded bg-secondary" />
            <div className="mt-8 h-11 w-full rounded-md bg-secondary" />
          </div>
        ) : user ? (
          <div className="store-card p-8 text-center shadow-sm">
            <h1 className="text-xl font-semibold tracking-tight">Sua conta</h1>
            <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
            <Button asChild className="mt-6 w-full" disabled={papelCarregando}>
              {isAdmin ? <Link to="/admin">Ir para o painel</Link> : <Link to="/carrinho">Ir para o carrinho</Link>}
            </Button>
            <Button variant="outline" className="mt-3 w-full" onClick={() => void sair()}>
              Sair da conta
            </Button>
          </div>
        ) : (
          <div className="store-card p-8 shadow-sm">
            <h1 className="text-2xl font-semibold tracking-tight">
              {modo === "cadastro" ? "Criar conta" : "Entrar"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              É necessário ter uma conta para comprar na Excellence Store.
            </p>

            <form onSubmit={(e) => void enviar(e)} className="mt-8 space-y-4">
              {modo === "cadastro" && (
                <div>
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input id="nome" name="nome" maxLength={100} className="mt-1.5" />
                  {erros["nome"] && (
                    <p className="mt-1 text-xs text-destructive">{erros["nome"]}</p>
                  )}
                </div>
              )}
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" name="email" type="email" maxLength={255} className="mt-1.5" />
                {erros["email"] && (
                  <p className="mt-1 text-xs text-destructive">{erros["email"]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="senha">Senha</Label>
                <Input id="senha" name="senha" type="password" maxLength={72} className="mt-1.5" />
                {erros["senha"] && (
                  <p className="mt-1 text-xs text-destructive">{erros["senha"]}</p>
                )}
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={enviando}>
                {modo === "cadastro" ? "Criar conta" : "Entrar"}
              </Button>
            </form>

            <button
              onClick={() => setModo((m) => (m === "cadastro" ? "login" : "cadastro"))}
              className="mt-6 w-full text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              {modo === "cadastro" ? "Já tenho conta — entrar" : "Não tenho conta — criar agora"}
            </button>
          </div>
        )}
      </main>
      <StoreFooter />
    </div>
  );
}
