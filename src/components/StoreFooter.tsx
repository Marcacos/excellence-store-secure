export function StoreFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Excellence Store. Todos os direitos reservados.</p>
        <p>Compra segura · Dados criptografados</p>
      </div>
    </footer>
  );
}
