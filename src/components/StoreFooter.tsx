import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import logo from "@/assets/excellence-logo.png.asset.json";

const colunas = [
  {
    titulo: "Categorias",
    links: [
      { label: "Novidades", slug: "novidades" },
      { label: "Masculino", slug: "masculino" },
      { label: "Feminino", slug: "feminino" },
      { label: "Acessórios", slug: "acessorios" },
    ],
  },
] as const;

export function StoreFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/20">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <img src={logo.url} alt="Excellence Store" className="h-6 w-auto opacity-90" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Camisetas premium com caimento impecável e acabamento de alta qualidade.
              Minimalista, profissional e confiável.
            </p>
          </div>

          {colunas.map((c) => (
            <div key={c.titulo}>
              <h3 className="text-sm font-semibold text-foreground">{c.titulo}</h3>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.slug}>
                    <Link
                      to="/categoria/$slug"
                      params={{ slug: l.slug }}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold text-foreground">Sua conta</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link to="/conta" search={{}} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Entrar ou criar conta
                </Link>
              </li>
              <li>
                <Link to="/carrinho" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Carrinho
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Excellence Store. Todos os direitos reservados.</p>
          <p className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Compra segura · Dados criptografados
          </p>
        </div>
      </div>
    </footer>
  );
}
