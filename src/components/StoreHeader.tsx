import { Link } from "@tanstack/react-router";
import { ShoppingBag, Menu } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/excellence-logo.jpg.asset.json";
import { useCart } from "@/lib/cart";

const links = [
  { label: "Novidades", to: "/" },
  { label: "Masculino", to: "/" },
  { label: "Feminino", to: "/" },
  { label: "Acessórios", to: "/" },
] as const;

export function StoreHeader() {
  const { quantidade } = useCart();
  const [aberto, setAberto] = useState(false);

  return (
    <header className="sticky top-0 z-40 silver-bar text-silver-foreground shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center" aria-label="Excellence Store — início">
          <img src={logo.url} alt="Excellence Store" className="h-9 w-auto rounded-sm" />
        </Link>

        <nav className="ml-6 hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="text-sm font-medium tracking-wide text-silver-foreground/80 transition-colors hover:text-silver-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link
            to="/carrinho"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-foreground/5"
            aria-label="Carrinho de compras"
          >
            <ShoppingBag className="h-5 w-5" />
            {quantidade > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background">
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
        <nav className="border-t border-foreground/10 silver-bar px-4 pb-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
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
