import { Button } from "@/components/ui/button";
import { brl, type Product } from "@/lib/products";

export function ProductGrid({
  produtos,
  onSelecionar,
}: {
  produtos: Product[];
  onSelecionar: (p: Product) => void;
}) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
      {produtos.map((p) => (
        <article key={p.id} className="store-card store-card-hover group overflow-hidden">
          <button onClick={() => onSelecionar(p)} className="block w-full text-left">
            <div className="overflow-hidden bg-secondary">
              {p.imagem ? (
                <img
                  src={p.imagem}
                  alt={p.nome}
                  loading="lazy"
                  className="aspect-[9/11] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="aspect-[9/11] w-full" />
              )}
            </div>
            <div className="px-3 pt-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {p.categoria}
              </p>
              <h3 className="mt-1 text-sm font-medium leading-snug text-foreground">{p.nome}</h3>
              <p className="mt-1 text-sm font-semibold text-foreground">{brl(p.preco)}</p>
            </div>
          </button>
          <div className="p-3 pt-3">
            <Button variant="outline" className="w-full" onClick={() => onSelecionar(p)}>
              Selecionar opções
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
