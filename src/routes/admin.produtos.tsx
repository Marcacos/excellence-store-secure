import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { brl, useProdutos, CATEGORIAS, type Cor, type Product } from "@/lib/products";

export const Route = createFileRoute("/admin/produtos")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Gestão de Produtos — Excellence Store" },
      { name: "description", content: "Cadastre camisetas, cores, tamanhos e preços da loja." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Gestão de Produtos — Excellence Store" },
      { property: "og:description", content: "Painel privado de produtos da Excellence Store." },
    ],
  }),
  component: AdminProdutos,
});

type Form = {
  id?: string;
  nome: string;
  preco: string;
  categoria: string;
  descricao: string;
  composicao: string;
  imagem_url: string;
  tamanhos: string;
  cores: Cor[];
  ativo: boolean;
};

const vazio: Form = {
  nome: "",
  preco: "",
  categoria: "Novidades",
  descricao: "",
  composicao: "",
  imagem_url: "",
  tamanhos: "P, M, G, GG",
  cores: [{ nome: "Preto", hex: "#111111" }],
  ativo: true,
};

function AdminProdutos() {
  const { data: produtos, isLoading } = useProdutos(true);
  const qc = useQueryClient();
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState<Form>(vazio);
  const [salvando, setSalvando] = useState(false);
  const [enviandoImagem, setEnviandoImagem] = useState(false);

  function abrirNovo() {
    setForm(vazio);
    setAberto(true);
  }

  function abrirEdicao(p: Product) {
    setForm({
      id: p.id,
      nome: p.nome,
      preco: String(p.preco),
      categoria: p.categoria,
      descricao: p.descricao,
      composicao: p.composicao,
      imagem_url: p.imagem,
      tamanhos: p.tamanhos.join(", "),
      cores: p.cores.length ? p.cores : vazio.cores,
      ativo: p.ativo,
    });
    setAberto(true);
  }

  async function enviarImagem(file: File) {
    setEnviandoImagem(true);
    try {
      const caminho = `${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, "_")}`;
      const { error } = await supabase.storage.from("produtos").upload(caminho, file, {
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("produtos").getPublicUrl(caminho);
      setForm((f) => ({ ...f, imagem_url: data.publicUrl }));
      toast.success("Imagem enviada");
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível enviar a imagem");
    } finally {
      setEnviandoImagem(false);
    }
  }

  async function salvar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const preco = Number(form.preco.replace(",", "."));
    if (!form.nome.trim() || !Number.isFinite(preco) || preco <= 0) {
      toast.error("Informe nome e preço válidos");
      return;
    }
    const payload = {
      nome: form.nome.trim(),
      preco,
      categoria: form.categoria,
      descricao: form.descricao.trim(),
      composicao: form.composicao.trim(),
      imagem_url: form.imagem_url.trim(),
      tamanhos: form.tamanhos
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      cores: form.cores.filter((c) => c.nome.trim()),
      ativo: form.ativo,
    };
    setSalvando(true);
    try {
      const { error } = form.id
        ? await supabase.from("products").update(payload).eq("id", form.id)
        : await supabase.from("products").insert(payload);
      if (error) throw error;
      toast.success(form.id ? "Produto atualizado" : "Produto cadastrado");
      setAberto(false);
      void qc.invalidateQueries({ queryKey: ["produtos"] });
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível salvar o produto");
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(p: Product) {
    if (!confirm(`Excluir "${p.nome}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) {
      toast.error("Não foi possível excluir");
      return;
    }
    toast.success("Produto excluído");
    void qc.invalidateQueries({ queryKey: ["produtos"] });
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Produtos</h1>
        <Button onClick={abrirNovo}>
          <Plus className="mr-1.5 h-4 w-4" /> Novo produto
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-5 py-3 font-medium">Produto</th>
              <th className="px-5 py-3 font-medium">Categoria</th>
              <th className="px-5 py-3 font-medium">Preço</th>
              <th className="px-5 py-3 font-medium">Tamanhos</th>
              <th className="px-5 py-3 font-medium">Cores</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {(produtos ?? []).map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {p.imagem && (
                      <img src={p.imagem} alt={p.nome} className="h-10 w-9 rounded object-cover" />
                    )}
                    <span className="font-medium">{p.nome}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{p.categoria}</td>
                <td className="px-5 py-3">{brl(p.preco)}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.tamanhos.join(", ")}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-1">
                    {p.cores.map((c) => (
                      <span
                        key={c.nome}
                        title={c.nome}
                        className="h-4 w-4 rounded-full border border-border"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs">
                    {p.ativo ? "Ativo" : "Oculto"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => abrirEdicao(p)}
                    aria-label={`Editar ${p.nome}`}
                    className="mr-3 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => void excluir(p)}
                    aria-label={`Excluir ${p.nome}`}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {!isLoading && (produtos?.length ?? 0) === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                  Nenhum produto cadastrado. Clique em "Novo produto" para começar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? "Editar produto" : "Novo produto"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={(e) => void salvar(e)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={form.nome}
                  maxLength={120}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input
                  id="preco"
                  value={form.preco}
                  inputMode="decimal"
                  onChange={(e) => setForm({ ...form, preco: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <select
                id="categoria"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={form.descricao}
                maxLength={800}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="composicao">Composição / detalhes técnicos</Label>
              <Input
                id="composicao"
                value={form.composicao}
                maxLength={200}
                onChange={(e) => setForm({ ...form, composicao: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="tamanhos">Tamanhos disponíveis (separados por vírgula)</Label>
              <Input
                id="tamanhos"
                value={form.tamanhos}
                onChange={(e) => setForm({ ...form, tamanhos: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Cores</Label>
              <div className="mt-2 space-y-2">
                {form.cores.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={c.nome}
                      placeholder="Nome da cor"
                      onChange={(e) => {
                        const cores = [...form.cores];
                        cores[i] = { ...c, nome: e.target.value };
                        setForm({ ...form, cores });
                      }}
                    />
                    <input
                      type="color"
                      aria-label={`Tom da cor ${i + 1}`}
                      value={c.hex}
                      onChange={(e) => {
                        const cores = [...form.cores];
                        cores[i] = { ...c, hex: e.target.value };
                        setForm({ ...form, cores });
                      }}
                      className="h-10 w-12 rounded-md border border-input bg-background"
                    />
                    <button
                      type="button"
                      aria-label="Remover cor"
                      onClick={() =>
                        setForm({ ...form, cores: form.cores.filter((_, j) => j !== i) })
                      }
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setForm({ ...form, cores: [...form.cores, { nome: "", hex: "#000000" }] })
                  }
                >
                  <Plus className="mr-1 h-3.5 w-3.5" /> Adicionar cor
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="imagem">Imagem do produto</Label>
              <input
                id="imagem"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void enviarImagem(f);
                }}
                className="mt-1 block w-full text-sm"
              />
              {enviandoImagem && (
                <p className="mt-1 text-xs text-muted-foreground">Enviando imagem...</p>
              )}
              {form.imagem_url && (
                <img
                  src={form.imagem_url}
                  alt="Pré-visualização"
                  className="mt-3 h-28 w-24 rounded-md object-cover"
                />
              )}
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="ativo"
                checked={form.ativo}
                onCheckedChange={(v) => setForm({ ...form, ativo: v })}
              />
              <Label htmlFor="ativo">Visível na loja</Label>
            </div>

            <Button type="submit" className="w-full" disabled={salvando || enviandoImagem}>
              {salvando ? "Salvando..." : "Salvar produto"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
