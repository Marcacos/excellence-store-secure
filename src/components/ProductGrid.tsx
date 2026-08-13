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
    <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
      {produtos.map((p) => (
        <article key={p.id} className="group">
          <button onClick={() => onSelecionar(p)} className="block w-full text-left">
            <div className="overflow-hidden rounded-md bg-secondary">
              {p.imagem ? (
                <img
                  src={p.imagem}
                  alt={p.nome}
                  loading="lazy"
                  className="aspect-[9/11] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="aspect-[9/11] w-full" />
              )}
            </div>
            <h3 className="mt-3 text-sm font-medium text-foreground">{p.nome}</h3>
            <p className="text-sm text-muted-foreground">{brl(p.preco)}</p>
          </button>
          <Button variant="outline" className="mt-3 w-full" onClick={() => onSelecionar(p)}>
            Selecionar opções
          </Button>
        </article>
      ))}
    </div>
  );
}
