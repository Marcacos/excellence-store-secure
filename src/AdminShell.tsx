import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LayoutDashboard, ShieldCheck, Store, Shirt, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import logo from "@/assets/excellence-logo.png.asset.json";

export function AdminShell({ children }: { children: ReactNode }) {
  const { sair } = useAuth();
  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="sticky top-0 z-40 silver-bar text-silver-foreground shadow-[0_1px_0_0_oklch(0_0_0/8%),0_8px_20px_-12px_oklch(0_0_0/45%)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <img src={logo.url} alt="Excellence Store" className="h-6 w-auto shrink-0" />
          <span className="hidden shrink-0 text-sm font-medium md:inline">Painel do proprietário</span>
          <nav className="-mx-1 ml-auto flex items-center gap-0.5 overflow-x-auto px-1 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link
              to="/admin"
              activeOptions={{ exact: true }}
              activeProps={{ className: "bg-foreground/10" }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 hover:bg-foreground/5 sm:px-3"
            >
              <LayoutDashboard className="h-4 w-4" /> <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link
              to="/admin/produtos"
              activeProps={{ className: "bg-foreground/10" }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 hover:bg-foreground/5 sm:px-3"
            >
              <Shirt className="h-4 w-4" /> <span className="hidden sm:inline">Produtos</span>
            </Link>
            <Link
              to="/admin/seguranca"
              activeProps={{ className: "bg-foreground/10" }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 hover:bg-foreground/5 sm:px-3"
            >
              <ShieldCheck className="h-4 w-4" /> <span className="hidden sm:inline">Segurança</span>
            </Link>
            <Link
              to="/"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 hover:bg-foreground/5 sm:px-3"
            >
              <Store className="h-4 w-4" /> <span className="hidden sm:inline">Loja</span>
            </Link>
            <button
              onClick={() => void sair()}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 hover:bg-foreground/5 sm:px-3"
            >
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sair</span>
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
