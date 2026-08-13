import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useProdutos, brl } from "@/lib/products";

export function SearchDialog() {
  const [aberto, setAberto] = useState(false);
  const [termo, setTermo] = useState("");

  const { data: produtos } = useProdutos();

  const resultados = useMemo(() => {
    const lista = produtos ?? [];
    const t = termo.trim().toLowerCase();
    if (!t) return lista;
    return lista.filter(
      (p) => p.nome.toLowerCase().includes(t) || p.categoria.toLowerCase().includes(t),
    );
  }, [termo, produtos]);

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-silver-foreground/10"
        aria-label="Pesquisar produtos"
      >
        <Search className="h-5 w-5" />
      </button>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Pesquisar produtos</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Buscar por nome ou categoria..."
          />
          <div className="mt-2 max-h-80 space-y-2 overflow-y-auto">
            {resultados.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nenhum produto encontrado.
              </p>
            )}
            {resultados.map((p) => (
              <Link
                key={p.id}
                to="/produto/$id"
                params={{ id: p.id }}
                onClick={() => setAberto(false)}
                className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-secondary"
              >
                <img
                  src={p.imagem}
                  alt={p.nome}
                  loading="lazy"
                  className="h-14 w-12 rounded object-cover"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{p.nome}</span>
                  <span className="block text-sm text-muted-foreground">{brl(p.preco)}</span>
                </span>
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
