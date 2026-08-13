import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Lock, AlertTriangle, KeyRound } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { Switch } from "@/components/ui/switch";
import { auditoria } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/seguranca")({
  head: () => ({
    meta: [
      { title: "Configurações de Segurança — Excellence Store" },
      {
        name: "description",
        content: "Monitore o status de proteção e o registro de auditoria da loja.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Segurança — Excellence Store" },
      { property: "og:description", content: "Status de proteção e auditoria de acessos." },
    ],
  }),
  component: Seguranca,
});

const controles = [
  {
    titulo: "Proteção contra força bruta",
    descricao: "Bloqueio temporário após 5 tentativas de login malsucedidas.",
    ativo: true,
  },
  {
    titulo: "Sanitização de entrada (XSS / SQL)",
    descricao: "Toda entrada é validada por schema e as consultas usam parâmetros.",
    ativo: true,
  },
  {
    titulo: "Autenticação em duas etapas",
    descricao: "Código adicional por aplicativo autenticador no login do proprietário.",
    ativo: false,
  },
  {
    titulo: "Alertas de acesso suspeito",
    descricao: "Notificação por e-mail em logins de IPs desconhecidos.",
    ativo: true,
  },
];

function Seguranca() {
  return (
    <AdminShell>
      <h1 className="text-xl font-semibold tracking-tight">Configurações de Segurança</h1>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <ShieldCheck className="h-8 w-8 text-foreground" />
          </div>
          <p className="mt-4 text-lg font-semibold">Protegido</p>
          <p className="mt-1 text-sm text-muted-foreground">
            3 de 4 camadas de proteção ativas
          </p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-3/4 rounded-full bg-foreground" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card divide-y divide-border">
          {controles.map((c) => (
            <div key={c.titulo} className="flex items-start justify-between gap-4 p-5">
              <div>
                <p className="text-sm font-medium">{c.titulo}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.descricao}</p>
              </div>
              <Switch defaultChecked={c.ativo} aria-label={c.titulo} />
            </div>
          ))}
        </div>
      </div>

      <section className="mt-8 rounded-lg border border-border bg-card">
        <h2 className="border-b border-border p-5 text-sm font-semibold">Registro de auditoria</h2>
        <ul className="divide-y divide-border">
          {auditoria.map((a, i) => (
            <li key={i} className="flex items-center gap-3 p-5">
              {a.nivel === "critico" ? (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              ) : a.nivel === "alerta" ? (
                <KeyRound className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Lock className="h-4 w-4 text-muted-foreground" />
              )}
              <div className="flex-1">
                <p className="text-sm">
                  {a.evento} de IP {a.ip}
                </p>
                <p className="text-xs text-muted-foreground">{a.quando}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-6 text-xs text-muted-foreground">
        As métricas e eventos acima são de demonstração. Ative o Lovable Cloud para login real do
        proprietário, registro de auditoria persistido e limites de tentativa aplicados no servidor.
      </p>
    </AdminShell>
  );
}
