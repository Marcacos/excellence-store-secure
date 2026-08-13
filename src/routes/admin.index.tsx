import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { TrendingUp, Package, Star, Users } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { Input } from "@/components/ui/input";
import { brl } from "@/lib/products";
import { vendasPorMes, pedidosPorStatus, maisVendidos, pedidos } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard de Métricas — Excellence Store" },
      { name: "description", content: "Vendas, pedidos e desempenho da loja em um só painel." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Dashboard — Excellence Store" },
      { property: "og:description", content: "Painel privado de métricas da Excellence Store." },
    ],
  }),
  component: Dashboard,
});

const FATIAS = ["oklch(0.35 0 0)", "oklch(0.55 0 0)", "oklch(0.72 0 0)", "oklch(0.85 0 0)"];

function Card({
  titulo,
  valor,
  icone,
  children,
}: {
  titulo: string;
  valor: string;
  icone: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs font-medium uppercase tracking-wide">{titulo}</span>
        {icone}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{valor}</p>
      {children}
    </div>
  );
}

function Dashboard() {
  const [busca, setBusca] = useState("");
  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return pedidos;
    return pedidos.filter((p) =>
      [p.id, p.cliente, p.data, p.status].some((c) => c.toLowerCase().includes(q)),
    );
  }, [busca]);

  const totalVendas = vendasPorMes.reduce((s, v) => s + v.total, 0);

  return (
    <AdminShell>
      <h1 className="text-xl font-semibold tracking-tight">Dashboard de Métricas</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card titulo="Vendas totais" valor={brl(totalVendas)} icone={<TrendingUp className="h-4 w-4" />}>
          <div className="mt-3 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vendasPorMes} margin={{ top: 4, bottom: 4, left: 0, right: 0 }}>
                <XAxis dataKey="mes" hide />
                <Tooltip formatter={(v: number) => brl(v)} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="oklch(0.3 0 0)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card titulo="Novos pedidos" valor="128" icone={<Package className="h-4 w-4" />}>
          <div className="mt-3 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Pie data={pedidosPorStatus} dataKey="valor" nameKey="status" innerRadius={18} outerRadius={38}>
                  {pedidosPorStatus.map((_, i) => (
                    <Cell key={i} fill={FATIAS[i % FATIAS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card titulo="Mais vendidos" valor={`${maisVendidos[0]!.unidades} un.`} icone={<Star className="h-4 w-4" />}>
          <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
            {maisVendidos.slice(0, 3).map((m) => (
              <li key={m.nome} className="flex justify-between gap-2">
                <span className="truncate">{m.nome}</span>
                <span>{m.unidades}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card titulo="Visitantes do site" valor="24.318" icone={<Users className="h-4 w-4" />}>
          <p className="mt-3 text-xs text-muted-foreground">+12,4% vs. mês anterior</p>
        </Card>
      </div>

      <section className="mt-10 rounded-lg border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold">Pedidos recentes</h2>
          <Input
            value={busca}
            maxLength={60}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por ID, cliente ou status"
            className="sm:w-72"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Data</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium">{p.id}</td>
                  <td className="px-5 py-3">{p.cliente}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.data}</td>
                  <td className="px-5 py-3">{brl(p.total)}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs">{p.status}</span>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
