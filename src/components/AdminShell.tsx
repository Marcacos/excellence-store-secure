import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LayoutDashboard, ShieldCheck, Store } from "lucide-react";
import logo from "@/assets/excellence-logo.jpg.asset.json";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="bg-silver text-silver-foreground shadow-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <img src={logo.url} alt="Excellence Store" className="h-8 w-auto rounded-sm" />
          <span className="text-sm font-medium">Painel do proprietário</span>
          <nav className="ml-auto flex items-center gap-1 text-sm">
            <Link
              to="/admin"
              activeOptions={{ exact: true }}
              activeProps={{ className: "bg-foreground/10" }}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 hover:bg-foreground/5"
            >
              <LayoutDashboard className="h-4 w-4" /> <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link
              to="/admin/seguranca"
              activeProps={{ className: "bg-foreground/10" }}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 hover:bg-foreground/5"
            >
              <ShieldCheck className="h-4 w-4" /> <span className="hidden sm:inline">Segurança</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 hover:bg-foreground/5"
            >
              <Store className="h-4 w-4" /> <span className="hidden sm:inline">Loja</span>
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
