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
    <header className="sticky top-0 z-40 silver-bar text-silver-foreground shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center" aria-label="Excellence Store — início">
          <img src={logo.url} alt="Excellence Store" className="h-7 w-auto" />
        </Link>

        <nav className="ml-6 hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to="/categoria/$slug"
              params={{ slug: l.slug }}
              activeProps={{ className: "text-silver-foreground" }}
              className="text-sm font-medium tracking-wide text-silver-foreground/80 transition-colors hover:text-silver-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <SearchDialog />
          <Link
            to="/conta"
            className="inline-flex h-10 items-center gap-1.5 rounded-md px-2 text-sm transition-colors hover:bg-silver-foreground/10"
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
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-silver-foreground px-1 text-[10px] font-semibold text-silver">
                {quantidade}
              </span>
            )}
          </Link>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md md:hidden"
            onClick={() => setAberto((v) => !v)}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {aberto && (
        <nav className="border-t border-silver-foreground/15 silver-bar px-4 pb-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.label}
              to="/categoria/$slug"
              params={{ slug: l.slug }}
              onClick={() => setAberto(false)}
              className="block py-2 text-sm font-medium text-silver-foreground/85"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
