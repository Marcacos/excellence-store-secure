import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Line, LineChart, Pie, PieChart, Cell, Tooltip, XAxis, ResponsiveContainer } from "recharts";
import { TrendingUp, Package, Star, Users } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { Input } from "@/components/ui/input";
import { brl } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dashboard de Métricas — Excellence Store" },
      { name: "description", content: "Vendas, pedidos e desempenho real da loja em um só painel." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Dashboard — Excellence Store" },
      { property: "og:description", content: "Painel privado de métricas da Excellence Store." },
    ],
  }),
  component: Dashboard,
});

const FATIAS = ["oklch(0.35 0 0)", "oklch(0.55 0 0)", "oklch(0.72 0 0)", "oklch(0.85 0 0)"];
const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

type Pedido = {
  id: string;
  cliente_nome: string;
  total: number;
  status: string;
  created_at: string;
};

type Item = { nome: string; qtd: number };

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

function useMetricas() {
  return useQuery({
    queryKey: ["admin-metricas"],
    queryFn: async () => {
      const [pedidosRes, itensRes, visitasRes] = await Promise.all([
        supabase
          .from("orders")
          .select("id, cliente_nome, total, status, created_at")
          .order("created_at", { ascending: false }),
        supabase.from("order_items").select("nome, qtd"),
        supabase.from("site_visits").select("id", { count: "exact", head: true }),
      ]);
      if (pedidosRes.error) throw pedidosRes.error;
      if (itensRes.error) throw itensRes.error;
      return {
        pedidos: (pedidosRes.data ?? []) as Pedido[],
        itens: (itensRes.data ?? []) as Item[],
        visitas: visitasRes.count ?? 0,
      };
    },
  });
}

function Dashboard() {
  const [busca, setBusca] = useState("");
  const { data, isLoading } = useMetricas();

  const pedidos = useMemo(() => data?.pedidos ?? [], [data]);

  const vendasPorMes = useMemo(() => {
    const agora = new Date();
    const buckets: { mes: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
      buckets.push({ mes: MESES[d.getMonth()]!, total: 0 });
    }
    for (const p of pedidos) {
      const d = new Date(p.created_at);
      const diff =
        (agora.getFullYear() - d.getFullYear()) * 12 + (agora.getMonth() - d.getMonth());
      if (diff >= 0 && diff <= 5) buckets[5 - diff]!.total += Number(p.total);
    }
    return buckets;
  }, [pedidos]);

  const porStatus = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of pedidos) m.set(p.status, (m.get(p.status) ?? 0) + 1);
    return [...m].map(([status, valor]) => ({ status, valor }));
  }, [pedidos]);

  const maisVendidos = useMemo(() => {
    const m = new Map<string, number>();
    for (const i of data?.itens ?? []) m.set(i.nome, (m.get(i.nome) ?? 0) + i.qtd);
    return [...m]
      .map(([nome, unidades]) => ({ nome, unidades }))
      .sort((a, b) => b.unidades - a.unidades);
  }, [data]);

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return pedidos;
    return pedidos.filter((p) =>
      [p.id, p.cliente_nome, p.status].some((c) => c.toLowerCase().includes(q)),
    );
  }, [busca, pedidos]);

  const totalVendas = pedidos.reduce((s, p) => s + Number(p.total), 0);

  return (
    <AdminShell>
      <h1 className="text-xl font-semibold tracking-tight">Dashboard de Métricas</h1>
      {isLoading && <p className="mt-3 text-sm text-muted-foreground">Carregando dados reais...</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card titulo="Vendas totais" valor={brl(totalVendas)} icone={<TrendingUp className="h-4 w-4" />}>
          <div className="mt-3 h-18 w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vendasPorMes} margin={{ top: 4, bottom: 4, left: 0, right: 0 }}>
                <XAxis dataKey="mes" hide />
                <Tooltip formatter={(v: number) => brl(v)} />
                <Line type="monotone" dataKey="total" stroke="oklch(0.3 0 0)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card titulo="Pedidos" valor={String(pedidos.length)} icone={<Package className="h-4 w-4" />}>
          <div className="mt-3 h-20 w-full overflow-hidden">
            {porStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Pie data={porStatus} dataKey="valor" nameKey="status" cx="50%" cy="50%" innerRadius={18} outerRadius={38}>
                    {porStatus.map((_, i) => (
                      <Cell key={i} fill={FATIAS[i % FATIAS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-muted-foreground">Nenhum pedido ainda.</p>
            )}
          </div>
        </Card>

        <Card
          titulo="Mais vendidos"
          valor={maisVendidos[0] ? `${maisVendidos[0].unidades} un.` : "—"}
          icone={<Star className="h-4 w-4" />}
        >
          <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
            {maisVendidos.slice(0, 3).map((m) => (
              <li key={m.nome} className="flex justify-between gap-2">
                <span className="truncate">{m.nome}</span>
                <span>{m.unidades}</span>
              </li>
            ))}
            {maisVendidos.length === 0 && <li>Sem vendas registradas.</li>}
          </ul>
        </Card>

        <Card
          titulo="Visitas ao site"
          valor={(data?.visitas ?? 0).toLocaleString("pt-BR")}
          icone={<Users className="h-4 w-4" />}
        >
          <p className="mt-3 text-xs text-muted-foreground">Acessos registrados nas páginas da loja</p>
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
              {filtrados.slice(0, 20).map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium">#{p.id.slice(0, 8)}</td>
                  <td className="px-5 py-3">{p.cliente_nome}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-5 py-3">{brl(Number(p.total))}</td>
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
