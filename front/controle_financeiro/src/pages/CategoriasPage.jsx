import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

// icons
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  Power,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Layers,
  Plus,
} from "lucide-react";

export default function CategoriasPage() {
  const [pag, setPag] = useState(0);
  const [size, setSize] = useState(10);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [dataPage, setDataPage] = useState(null);

  // criar
  const [novoNome, setNovoNome] = useState("");
  const [criando, setCriando] = useState(false);

  const categorias = useMemo(() => {
    if (!dataPage) return [];
    if (Array.isArray(dataPage)) return dataPage;
    return dataPage.content ?? [];
  }, [dataPage]);

  const totalPages = useMemo(() => {
    if (!dataPage || Array.isArray(dataPage)) return null;
    return dataPage.totalPages ?? null;
  }, [dataPage]);

  const podeVoltar = pag > 0;
  const podeAvancar =
    totalPages == null ? categorias.length === size : pag + 1 < totalPages;

  async function carregar() {
    try {
      setErro("");
      setLoading(true);

      const res = await api.get("/categorias/todas", {
        params: { pag, size },
      });

      setDataPage(res.data);
    } catch (e) {
      setErro(
        e?.response?.data?.message ||
          e?.response?.data ||
          "Não foi possível carregar as categorias."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pag, size]);

  async function criarCategoria(e) {
    e?.preventDefault?.();

    const nome = (novoNome || "").trim();
    if (!nome) {
      setErro("Informe o nome da categoria.");
      return;
    }

    try {
      setErro("");
      setCriando(true);

      // seu backend recebe CategoriaDTO; como você disse que só precisa de nome:
      await api.post("/categorias", { nome });

      setNovoNome("");

      // depois de criar, volta para primeira página para garantir que aparece
      setPag(0);
      await carregar();
    } catch (e2) {
      setErro(
        e2?.response?.data?.message ||
          e2?.response?.data ||
          "Falha ao criar categoria."
      );
    } finally {
      setCriando(false);
    }
  }

  async function ativar(id) {
    try {
      setErro("");
      await api.post(`/categorias/ativar/${id}`);
      await carregar();
    } catch (e) {
      setErro(
        e?.response?.data?.message ||
          e?.response?.data ||
          "Falha ao ativar categoria."
      );
    }
  }

  async function desativar(id) {
    try {
      setErro("");
      await api.post(`/categorias/desativar/${id}`);
      await carregar();
    } catch (e) {
      setErro(
        e?.response?.data?.message ||
          e?.response?.data ||
          "Falha ao desativar categoria."
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Top */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-700">
              <Layers className="h-5 w-5" />
              <span className="text-sm">Gestão</span>
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              Categorias
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Crie categorias, liste todas e altere o estado (ativa / desativada).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2">
              <span className="text-xs font-medium text-slate-600">
                Itens/página
              </span>
              <select
                className="bg-transparent text-sm font-semibold text-slate-900 outline-none"
                value={size}
                onChange={(e) => {
                  setPag(0);
                  setSize(Number(e.target.value));
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <Button
              variant="outline"
              onClick={carregar}
              disabled={loading}
              className="rounded-xl"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Atualizar
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        {erro ? (
          <Alert variant="destructive" className="rounded-2xl">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Ocorreu um erro</AlertTitle>
            <AlertDescription className="break-words">
              {String(erro)}
            </AlertDescription>
          </Alert>
        ) : null}

        {/* Criar categoria */}
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-900">
              Criar nova categoria
            </CardTitle>
            <p className="text-sm text-slate-600">
              Informe apenas o nome.
            </p>
          </CardHeader>

          <CardContent className="pt-0">
            <form
              onSubmit={criarCategoria}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <div className="flex-1">
                <Input
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: Fé, Amor, Esperança..."
                  className="h-11 rounded-xl"
                  maxLength={60}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Dica: evite nomes repetidos.
                </p>
              </div>

              <Button
                type="submit"
                disabled={criando}
                className="h-11 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                {criando ? "Criando..." : "Criar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista */}
        <Card className="mt-4 rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-900">
              Lista de categorias
            </CardTitle>
            <p className="text-sm text-slate-600">
              Clique em “Ativar” ou “Desativar” para alterar o estado.
            </p>
          </CardHeader>

          <CardContent className="pt-0">
            {/* header */}
            <div className="hidden grid-cols-12 gap-3 rounded-xl bg-slate-100/60 px-4 py-3 text-xs font-semibold text-slate-600 md:grid">
              <div className="col-span-6">Nome</div>
              <div className="col-span-3">Estado</div>
              <div className="col-span-3 text-right">Ações</div>
            </div>

            {loading ? (
              <div className="mt-3 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 md:grid-cols-12 md:items-center"
                  >
                    <div className="md:col-span-6">
                      <Skeleton className="h-4 w-56" />
                      <Skeleton className="mt-2 h-3 w-40" />
                    </div>
                    <div className="md:col-span-3">
                      <Skeleton className="h-7 w-28 rounded-full" />
                    </div>
                    <div className="md:col-span-3 md:justify-self-end">
                      <Skeleton className="h-9 w-32 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : categorias.length === 0 ? (
              <div className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
                <p className="text-sm font-medium text-slate-800">
                  Nenhuma categoria encontrada.
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Crie uma categoria acima para começar.
                </p>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                {categorias.map((c) => {
                  const id = c.id ?? c.categoriaId ?? c.categoria_id;
                  const nome = c.nome ?? c.name ?? "-";
                  const ativo = c.ativo ?? c.isAtivo ?? c.active;

                  return (
                    <div
                      key={id ?? nome}
                      className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 md:grid-cols-12 md:items-center"
                    >
                      <div className="md:col-span-6">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">
                            {nome}
                          </span>
                          {ativo ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-slate-500" />
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-600">
                          ID:{" "}
                          <span className="font-medium text-slate-700">
                            {id ?? "—"}
                          </span>
                        </p>
                      </div>

                      <div className="md:col-span-3">
                        {ativo ? (
                          <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                            Ativa
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100"
                          >
                            Desativada
                          </Badge>
                        )}
                      </div>

                      <div className="md:col-span-3 md:justify-self-end">
                        {ativo ? (
                          <Button
                            variant="outline"
                            className="w-full rounded-xl border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 md:w-auto"
                            onClick={() => desativar(id)}
                            disabled={!id}
                          >
                            <Power className="mr-2 h-4 w-4" />
                            Desativar
                          </Button>
                        ) : (
                          <Button
                            className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800 md:w-auto"
                            onClick={() => ativar(id)}
                            disabled={!id}
                          >
                            <Power className="mr-2 h-4 w-4" />
                            Ativar
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Paginação */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                Página{" "}
                <span className="font-semibold text-slate-900">{pag + 1}</span>
                {totalPages != null ? (
                  <>
                    {" "}
                    de{" "}
                    <span className="font-semibold text-slate-900">
                      {totalPages}
                    </span>
                  </>
                ) : null}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setPag((p) => Math.max(0, p - 1))}
                  disabled={!podeVoltar || loading}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>

                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setPag((p) => p + 1)}
                  disabled={!podeAvancar || loading}
                >
                  Próxima
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              O token é anexado automaticamente no header Authorization pelo interceptor do axios.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
//