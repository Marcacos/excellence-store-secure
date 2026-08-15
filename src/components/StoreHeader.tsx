import { Link } from "@tanstack/react-router";
import { ShoppingBag, Menu, User } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/excellence-logo.png.asset.json";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { SearchDialog } from "@/components/SearchDialog";

const links = [
  { label: "Novidades", slug: "novidades" },
  { label: "Masculino", slug: "masculino" },
  { label: "Feminino", slug: "feminino" },
  { label: "Acessórios", slug: "acessorios" },
] as const;

export function StoreHeader() {
  const { quantidade } = useCart();
  const { user } = useAuth();
  const [aberto, setAberto] = useState(false);

  return (
    <header className="sticky top-0 z-40 silver-bar text-silver-foreground shadow-[0_1px_0_0_oklch(0_0_0/8%),0_8px_20px_-12px_oklch(0_0_0/45%)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center transition-opacity hover:opacity-90" aria-label="Excellence Store — início">
          <img src={logo.url} alt="Excellence Store" className="h-7 w-auto" />
        </Link>

        <nav className="ml-8 hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to="/categoria/$slug"
              params={{ slug: l.slug }}
              activeProps={{ className: "text-silver-foreground after:scale-x-100" }}
              className="group relative py-1 text-sm font-medium tracking-wide text-silver-foreground/75 transition-colors hover:text-silver-foreground after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-silver-foreground after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-0.5">
          <SearchDialog />
          <Link
            to="/conta"
            search={{}}
            className="inline-flex h-10 items-center gap-1.5 rounded-md px-2.5 text-sm transition-colors hover:bg-silver-foreground/10"
            aria-label={user ? "Minha conta" : "Criar conta ou entrar"}
          >
            <User className="h-5 w-5" />
            <span className="hidden sm:inline">{user ? "Minha conta" : "Criar conta"}</span>
          </Link>
          <Link
            to="/carrinho"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-silver-foreground/10"
            aria-label="Carrinho de compras"
          >
            <ShoppingBag className="h-5 w-5" />
            {quantidade > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-silver-foreground px-1 text-[10px] font-semibold text-silver shadow-sm">
                {quantidade}
              </span>
            )}
          </Link>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-silver-foreground/10 md:hidden"
            onClick={() => setAberto((v) => !v)}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {aberto && (
        <nav className="animate-in fade-in slide-in-from-top-2 border-t border-silver-foreground/15 silver-bar px-4 pb-3 duration-200 md:hidden">
          {links.map((l) => (
            <Link
              key={l.label}
              to="/categoria/$slug"
              params={{ slug: l.slug }}
              onClick={() => setAberto(false)}
              className="block border-b border-silver-foreground/10 py-3 text-sm font-medium text-silver-foreground/85 last:border-none"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
