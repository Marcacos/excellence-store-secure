import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isAdmin, carregando, papelCarregando } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (carregando) return;
    if (!user) void navigate({ to: "/conta", search: { redirect: "/admin" }, replace: true });
  }, [carregando, user, navigate]);

  if (carregando || !user || papelCarregando) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Verificando acesso...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center text-sm text-muted-foreground">
        Esta área é exclusiva do proprietário da loja.
      </div>
    );
  }

  return <Outlet />;
}
