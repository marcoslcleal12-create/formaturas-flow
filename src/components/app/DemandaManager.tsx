import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  DollarSign,
  Edit,
  Trash2,
  FileText,
  KeyRound,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  User,
  AlertCircle,
  FileDown,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, brl } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  loadDemandas,
  saveDemandas,
  calcularParcelas,
  formatarCpf,
  type DemandaItem,
  type ParcelaDemanda,
} from "@/lib/demandas-store";
import { apenasDigitos, cpfParaEmail } from "@/lib/aluno-login";
import { gerarContratoPdf } from "@/lib/contrato-modelo";

interface DemandaManagerProps {
  tipo: "casamento" | "festa-aniversario" | "ensaio";
  titulo: string;
  subtitulo: string;
  icon: React.ElementType;
  themeColor: "pink" | "purple" | "blue";
}

export function DemandaManager({
  tipo,
  titulo,
  subtitulo,
  icon: IconComponent,
  themeColor,
}: DemandaManagerProps) {
  const [demandas, setDemandas] = useState<DemandaItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  // Modal States
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [editingDemanda, setEditingDemanda] = useState<DemandaItem | null>(null);
  const [deletingDemanda, setDeletingDemanda] = useState<DemandaItem | null>(null);
  const [viewingContratoDemanda, setViewingContratoDemanda] = useState<DemandaItem | null>(null);

  // Form Fields
  const [cliente, setCliente] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [local, setLocal] = useState("");
  const [status, setStatus] = useState<DemandaItem["status"]>("confirmada");

  // Contract Fields
  const [pacote, setPacote] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [valorEntrada, setValorEntrada] = useState("");
  const [desconto, setDesconto] = useState("");
  const [numParcelas, setNumParcelas] = useState("6");
  const [diaVencimento, setDiaVencimento] = useState("10");
  const [primeiroVencimento, setPrimeiroVencimento] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("pix");
  const [observacoes, setObservacoes] = useState("");

  // Load Demands
  useEffect(() => {
    const all = loadDemandas();
    setDemandas(all.filter((d) => d.tipo === tipo));
  }, [tipo]);

  // Sync back to storage when demands change
  const persistDemandas = (updatedList: DemandaItem[]) => {
    setDemandas(updatedList);
    const all = loadDemandas();
    const otherTypes = all.filter((d) => d.tipo !== tipo);
    saveDemandas([...otherTypes, ...updatedList]);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setCliente("");
    setCpf("");
    setEmail("");
    setWhatsapp("");
    setDataEvento("");
    setLocal("");
    setStatus("confirmada");

    setPacote(
      tipo === "casamento"
        ? "Cobertura Completa Casamento (Foto + Vídeo + Álbum Luxo)"
        : tipo === "festa-aniversario"
        ? "Cobertura Aniversário / 15 Anos (Foto + Vídeo + Cabine)"
        : "Ensaio Fotográfico Professional (2h de sessão + 40 fotos)"
    );
    setValorTotal(tipo === "casamento" ? "12000" : tipo === "festa-aniversario" ? "6500" : "1500");
    setValorEntrada(tipo === "casamento" ? "2000" : tipo === "festa-aniversario" ? "1000" : "300");
    setDesconto("0");
    setNumParcelas("6");
    setDiaVencimento("10");
    setPrimeiroVencimento(new Date().toISOString().slice(0, 10));
    setFormaPagamento("pix");
    setObservacoes("");

    setOpenCreateModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (demanda: DemandaItem) => {
    setEditingDemanda(demanda);
    setCliente(demanda.cliente);
    setCpf(demanda.cpf);
    setEmail(demanda.email || "");
    setWhatsapp(demanda.whatsapp || "");
    setDataEvento(demanda.dataEvento);
    setLocal(demanda.local);
    setStatus(demanda.status);

    setPacote(demanda.pacote);
    setValorTotal(demanda.valorTotal.toString());
    setValorEntrada(demanda.valorEntrada.toString());
    setDesconto(demanda.desconto.toString());
    setNumParcelas(demanda.numParcelas.toString());
    setDiaVencimento(demanda.diaVencimento.toString());
    setPrimeiroVencimento(demanda.primeiroVencimento || demanda.dataEvento);
    setFormaPagamento(demanda.formaPagamento || "pix");
    setObservacoes(demanda.observacoes || "");
  };

  // Save Create or Edit
  const handleSaveDemanda = (e: React.FormEvent) => {
    e.preventDefault();
    const digitsCpf = apenasDigitos(cpf);
    if (!cliente.trim() || !dataEvento || !local.trim()) {
      toast.error("Preencha os campos obrigatórios (*)");
      return;
    }
    if (digitsCpf.length !== 11) {
      toast.error("Informe um CPF válido com 11 dígitos para gerar o acesso do cliente!");
      return;
    }

    const valTotal = parseFloat(valorTotal) || 0;
    const valEntrada = parseFloat(valorEntrada) || 0;
    const valDesc = parseFloat(desconto) || 0;
    const parcelasQtd = parseInt(numParcelas) || 1;
    const diaVenc = parseInt(diaVencimento) || 10;
    const primVenc = primeiroVencimento || dataEvento;

    const parcelas = calcularParcelas(
      valTotal,
      valEntrada,
      valDesc,
      parcelasQtd,
      diaVenc,
      primVenc
    );

    if (editingDemanda) {
      // UPDATE
      const updatedList = demandas.map((d) =>
        d.id === editingDemanda.id
          ? {
              ...d,
              cliente,
              cpf: digitsCpf,
              email,
              whatsapp,
              dataEvento,
              local,
              status,
              pacote,
              valorTotal: valTotal,
              valorEntrada: valEntrada,
              desconto: valDesc,
              numParcelas: parcelasQtd,
              diaVencimento: diaVenc,
              primeiroVencimento: primVenc,
              formaPagamento,
              observacoes,
              parcelas:
                d.numParcelas === parcelasQtd && d.valorTotal === valTotal
                  ? d.parcelas
                  : parcelas,
            }
          : d
      );
      persistDemandas(updatedList);
      toast.success("Demanda e Contrato atualizados com sucesso!");
      setEditingDemanda(null);
    } else {
      // CREATE
      const nova: DemandaItem = {
        id: `dem-${tipo.slice(0, 3)}-${Date.now()}`,
        tipo,
        cliente,
        cpf: digitsCpf,
        email,
        whatsapp,
        dataEvento,
        local,
        status,
        pacote,
        valorTotal: valTotal,
        valorEntrada: valEntrada,
        desconto: valDesc,
        numParcelas: parcelasQtd,
        diaVencimento: diaVenc,
        primeiroVencimento: primVenc,
        formaPagamento,
        observacoes,
        loginAtivo: true,
        parcelas,
        createdAt: new Date().toISOString(),
      };
      persistDemandas([nova, ...demandas]);
      toast.success(
        `Demanda cadastrada! Login por CPF gerado: ${formatarCpf(digitsCpf)}`,
        { duration: 6000 }
      );
      setOpenCreateModal(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deletingDemanda) return;
    const updated = demandas.filter((d) => d.id !== deletingDemanda.id);
    persistDemandas(updated);
    toast.success("Demanda excluída com sucesso.");
    setDeletingDemanda(null);
  };

  // Toggle Parcela Payment Status
  const handleToggleParcelaStatus = (demandaId: string, numeroParcela: number) => {
    const updatedList: DemandaItem[] = demandas.map((d) => {
      if (d.id !== demandaId) return d;
      const updatedParcelas: ParcelaDemanda[] = d.parcelas.map((p) => {
        if (p.numero !== numeroParcela) return p;
        const newStatus: ParcelaDemanda["status"] = p.status === "pago" ? "pendente" : "pago";
        return {
          ...p,
          status: newStatus,
          dataPagamento: newStatus === "pago" ? new Date().toISOString().slice(0, 10) : null,
        };
      });
      return { ...d, parcelas: updatedParcelas };
    });

    persistDemandas(updatedList);
    const itemAtualizado = updatedList.find((d) => d.id === demandaId);
    if (itemAtualizado && viewingContratoDemanda?.id === demandaId) {
      setViewingContratoDemanda(itemAtualizado);
    }
    toast.success(`Status da parcela ${numeroParcela} atualizado!`);
  };

  // Generate PDF Contract
  const handleGeneratePdf = (demanda: DemandaItem) => {
    gerarContratoPdf({
      aluno: {
        nome_completo: demanda.cliente,
        cpf: formatarCpf(demanda.cpf),
        endereco: demanda.local,
        cidade: demanda.local.split("-")[1]?.trim() || "São Paulo, SP",
        telefone: demanda.whatsapp || "—",
        email: demanda.email || cpfParaEmail(demanda.cpf),
      },
      contrato: {
        pacote: demanda.pacote,
        valor_total: demanda.valorTotal,
        desconto: demanda.desconto,
        valor_entrada: demanda.valorEntrada,
        dia_vencimento: demanda.diaVencimento,
        data_contrato: demanda.dataEvento,
        forma_pagamento: demanda.formaPagamento,
        autoriza_imagem: true,
      },
      parcelas: demanda.parcelas.map((p) => ({
        numero: p.numero,
        vencimento: p.vencimento,
        valor: p.valor,
        status: p.status,
        data_pagamento: p.dataPagamento ?? null,
        forma_pagamento: demanda.formaPagamento ?? null,
      })),
      texto: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS FOTOGRÁFICOS E EVENTOS

CONTRATANTE: ${demanda.cliente.toUpperCase()}, CPF nº ${formatarCpf(demanda.cpf)}.
EVENTO: ${titulo} — Local: ${demanda.local} — Data: ${demanda.dataEvento}.

CLÁUSULA 1ª — DO OBJETO:
O presente contrato tem por objeto a prestação de serviços de cobertura fotográfica e cinematográfica referente à demanda ${titulo}: "${demanda.pacote}".

CLÁUSULA 2ª — DO VALOR E PARCELAMENTO:
O valor total ajustado é de ${brl(demanda.valorTotal)}, com entrada de ${brl(demanda.valorEntrada)} e saldo parcelado em ${demanda.numParcelas}x com vencimento todo dia ${demanda.diaVencimento}.

CLÁUSULA 3ª — DO ACESSO DO CLIENTE:
O cliente terá acesso exclusivo à plataforma da JM Formaturas utilizando seu CPF (${formatarCpf(demanda.cpf)}) como login e senha de acesso inicial.`,
    });
  };

  // Filtering
  const filteredDemandas = demandas.filter((d) => {
    const matchText =
      d.cliente.toLowerCase().includes(search.toLowerCase()) ||
      d.local.toLowerCase().includes(search.toLowerCase()) ||
      d.cpf.includes(search);
    const matchStatus = statusFilter === "todos" || d.status === statusFilter;
    return matchText && matchStatus;
  });

  // Financial Stats
  const valorTotalGeral = demandas.reduce((acc, curr) => acc + curr.valorTotal, 0);
  const totalRecebido = demandas.reduce((acc, curr) => {
    const entradas = curr.valorEntrada;
    const pagas = curr.parcelas
      .filter((p) => p.status === "pago")
      .reduce((pAcc, pCurr) => pAcc + pCurr.valor, 0);
    return acc + entradas + pagas;
  }, 0);
  const aReceber = Math.max(0, valorTotalGeral - totalRecebido);

  // Styling helper
  const themeClasses = {
    pink: {
      bgIcon: "bg-pink-100 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400",
      badge: "bg-pink-600 hover:bg-pink-700",
      accentText: "text-pink-600 dark:text-pink-400",
    },
    purple: {
      bgIcon: "bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
      badge: "bg-purple-600 hover:bg-purple-700",
      accentText: "text-purple-600 dark:text-purple-400",
    },
    blue: {
      bgIcon: "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
      badge: "bg-blue-600 hover:bg-blue-700",
      accentText: "text-blue-600 dark:text-blue-400",
    },
  }[themeColor];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className={`flex size-10 items-center justify-center rounded-xl ${themeClasses.bgIcon} shadow-sm`}>
                <IconComponent className="size-6" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">DEMANDAS — {titulo}</h1>
                <p className="text-sm text-muted-foreground">{subtitulo}</p>
              </div>
            </div>
          </div>

          <Button onClick={handleOpenCreate} className="gap-2 shadow-sm">
            <Plus className="size-4" /> Nova Demanda ({titulo})
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${themeClasses.bgIcon}`}>
                <IconComponent className="size-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{demandas.length}</p>
                <p className="text-xs text-muted-foreground">Demandas de {titulo}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <CheckCircle2 className="size-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{brl(totalRecebido)}</p>
                <p className="text-xs text-muted-foreground">Total Recebido (Entrada + Parcelas)</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <DollarSign className="size-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{brl(aReceber)}</p>
                <p className="text-xs text-muted-foreground">Saldo A Receber</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente, CPF ou local do evento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="confirmada">Confirmada</SelectItem>
              <SelectItem value="em_negociacao">Em Negociação</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredDemandas.map((demanda) => {
            const pagas = demanda.parcelas.filter((p) => p.status === "pago").length;
            const contratadoLiquido = demanda.valorTotal - demanda.desconto;

            return (
              <Card key={demanda.id} className="hover:shadow-md transition-all flex flex-col justify-between border-border/80">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        {demanda.cliente}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1 font-mono">
                          <User className="size-3" /> CPF: {formatarCpf(demanda.cpf)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {new Date(demanda.dataEvento + "T00:00:00").toLocaleDateString("pt-BR")}
                        </span>
                      </p>
                    </div>

                    <Badge
                      className={
                        demanda.status === "confirmada"
                          ? themeClasses.badge
                          : demanda.status === "em_negociacao"
                          ? "bg-amber-500 hover:bg-amber-600"
                          : demanda.status === "concluida"
                          ? "bg-slate-600"
                          : "bg-destructive"
                      }
                    >
                      {demanda.status === "confirmada"
                        ? "Confirmada"
                        : demanda.status === "em_negociacao"
                        ? "Em Negociação"
                        : demanda.status === "concluida"
                        ? "Concluída"
                        : "Cancelada"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 text-sm flex-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <MapPin className={`size-4 shrink-0 ${themeClasses.accentText}`} />
                    <span className="truncate">{demanda.local}</span>
                  </div>

                  <div className="rounded-lg bg-muted/60 p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center font-medium">
                      <span>Pacote: {demanda.pacote}</span>
                      <span className="font-bold text-foreground text-sm">{brl(contratadoLiquido)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>
                        Entrada: {brl(demanda.valorEntrada)} + {demanda.numParcelas}x de {brl(demanda.parcelas[0]?.valor || 0)}
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {pagas}/{demanda.numParcelas} parcelas pagas
                      </span>
                    </div>
                  </div>

                  {/* Login credentials badge */}
                  <div className="flex items-center justify-between rounded-md border border-border/60 bg-background px-3 py-2 text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <KeyRound className="size-3.5 text-gold" />
                      Login CPF: <strong className="font-mono text-foreground">{formatarCpf(demanda.cpf)}</strong>
                    </span>
                    <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">
                      Login liberado
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingContratoDemanda(demanda)}
                      className="gap-1 text-xs"
                    >
                      <FileText className="size-3.5" /> Ver Contrato & Parcelas
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(demanda)}
                      className="gap-1 text-xs"
                    >
                      <Edit className="size-3.5" /> Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingDemanda(demanda)}
                      className="gap-1 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" /> Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredDemandas.length === 0 && (
            <div className="col-span-full py-16 text-center text-muted-foreground rounded-2xl border border-dashed p-8">
              <IconComponent className="mx-auto size-10 opacity-30 mb-2" />
              <p className="font-medium text-foreground">Nenhuma demanda de {titulo} encontrada.</p>
              <p className="text-xs mt-1">Clique em "Nova Demanda" para cadastrar um novo evento com CPF e contrato.</p>
            </div>
          )}
        </div>

        {/* MODAL: CREATE / EDIT DEMAND & CONTRACT */}
        <Dialog
          open={openCreateModal || !!editingDemanda}
          onOpenChange={(v) => {
            if (!v) {
              setOpenCreateModal(false);
              setEditingDemanda(null);
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSaveDemanda}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <IconComponent className={`size-5 ${themeClasses.accentText}`} />
                  {editingDemanda ? `EDITAR DEMANDA (${titulo.toUpperCase()})` : `NOVA DEMANDA (${titulo.toUpperCase()})`}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* 1. DADOS DO CLIENTE & ACESSO */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold border-b pb-1.5 flex items-center gap-2 text-foreground">
                    <User className="size-4 text-gold" /> Dados do Cliente & Acesso (Login CPF)
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="cliente">Nome Completo do Cliente / Noivos *</Label>
                      <Input
                        id="cliente"
                        placeholder="Ex: Mariana & Rodrigo"
                        value={cliente}
                        onChange={(e) => setCliente(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="cpf">CPF do Cliente (Login & Senha) *</Label>
                      <Input
                        id="cpf"
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        maxLength={14}
                        required
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Usado como login e senha inicial de acesso do cliente.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="whatsapp">WhatsApp / Telefone</Label>
                      <Input
                        id="whatsapp"
                        placeholder="(11) 99999-9999"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="cliente@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="dataEvento">Data do Evento *</Label>
                      <Input
                        id="dataEvento"
                        type="date"
                        value={dataEvento}
                        onChange={(e) => setDataEvento(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="status">Status da Demanda</Label>
                      <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmada">Confirmada</SelectItem>
                          <SelectItem value="em_negociacao">Em Negociação</SelectItem>
                          <SelectItem value="concluida">Concluída</SelectItem>
                          <SelectItem value="cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="local">Local do Evento *</Label>
                      <Input
                        id="local"
                        placeholder="Ex: Buffet Villa Regia - São Paulo, SP"
                        value={local}
                        onChange={(e) => setLocal(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 2. CONTRATO & PARCELAMENTO DE PAGAMENTOS */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-semibold border-b pb-1.5 flex items-center gap-2 text-foreground">
                    <CreditCard className="size-4 text-gold" /> Contrato & Parcelamento de Pagamentos
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="pacote">Pacote / Serviços Contratados *</Label>
                      <Input
                        id="pacote"
                        placeholder="Ex: Foto + Vídeo + Cabine de Fotos"
                        value={pacote}
                        onChange={(e) => setPacote(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="valorTotal">Valor Total do Contrato (R$) *</Label>
                      <Input
                        id="valorTotal"
                        type="number"
                        placeholder="10000"
                        value={valorTotal}
                        onChange={(e) => setValorTotal(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="valorEntrada">Valor de Entrada (R$)</Label>
                      <Input
                        id="valorEntrada"
                        type="number"
                        placeholder="2000"
                        value={valorEntrada}
                        onChange={(e) => setValorEntrada(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="desconto">Desconto (R$)</Label>
                      <Input
                        id="desconto"
                        type="number"
                        placeholder="0"
                        value={desconto}
                        onChange={(e) => setDesconto(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="numParcelas">Qtd. de Parcelas *</Label>
                      <Select value={numParcelas} onValueChange={setNumParcelas}>
                        <SelectTrigger id="numParcelas">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => (
                            <SelectItem key={n} value={n.toString()}>
                              {n}x {n === 1 ? "(À vista)" : "parcelas"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="diaVencimento">Dia de Vencimento Mensal</Label>
                      <Select value={diaVencimento} onValueChange={setDiaVencimento}>
                        <SelectTrigger id="diaVencimento">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 10, 15, 20, 25, 28].map((dia) => (
                            <SelectItem key={dia} value={dia.toString()}>
                              Todo dia {dia}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="primeiroVencimento">1º Vencimento de Parcela</Label>
                      <Input
                        id="primeiroVencimento"
                        type="date"
                        value={primeiroVencimento}
                        onChange={(e) => setPrimeiroVencimento(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="formaPagamento">Forma de Pagamento Principal</Label>
                      <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                        <SelectTrigger id="formaPagamento">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pix">PIX (Chave / QR Code)</SelectItem>
                          <SelectItem value="boleto">Boleto Bancário</SelectItem>
                          <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                          <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="observacoes">Observações do Contrato</Label>
                      <Textarea
                        id="observacoes"
                        placeholder="Detalhes adicionais do contrato ou preferências do cliente..."
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpenCreateModal(false);
                    setEditingDemanda(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingDemanda ? "Salvar Alterações" : "Gerar Contrato & Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* MODAL: VIEW CONTRATO & PARCELAS */}
        <Dialog
          open={!!viewingContratoDemanda}
          onOpenChange={(v) => {
            if (!v) setViewingContratoDemanda(null);
          }}
        >
          {viewingContratoDemanda && (
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="size-5 text-gold" /> Contrato & Parcelamento: {viewingContratoDemanda.cliente}
                  </span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4 text-sm">
                {/* Resumo do Contrato */}
                <div className="grid gap-4 sm:grid-cols-2 bg-muted/40 p-4 rounded-xl border">
                  <div>
                    <p className="text-xs text-muted-foreground">Cliente / Noivos</p>
                    <p className="font-semibold text-base">{viewingContratoDemanda.cliente}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      CPF: <strong className="font-mono">{formatarCpf(viewingContratoDemanda.cpf)}</strong>
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Evento & Local</p>
                    <p className="font-medium">{viewingContratoDemanda.local}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Data: {new Date(viewingContratoDemanda.dataEvento + "T00:00:00").toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <div className="sm:col-span-2 pt-2 border-t grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[11px] text-muted-foreground">Valor Total</p>
                      <p className="font-bold text-foreground">{brl(viewingContratoDemanda.valorTotal)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Entrada</p>
                      <p className="font-bold text-emerald-600">{brl(viewingContratoDemanda.valorEntrada)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Parcelas</p>
                      <p className="font-bold text-foreground">
                        {viewingContratoDemanda.numParcelas}x de {brl(viewingContratoDemanda.parcelas[0]?.valor || 0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Login de Acesso por CPF */}
                <div className="rounded-xl border bg-card p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <KeyRound className="size-4 text-gold" /> Credenciais de Acesso do Cliente
                    </h4>
                    <Badge className="bg-emerald-600">Ativo por CPF</Badge>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 text-xs bg-muted/60 p-3 rounded-lg font-mono">
                    <p>Login (CPF): <strong>{apenasDigitos(viewingContratoDemanda.cpf)}</strong></p>
                    <p>Senha Inicial: <strong>{apenasDigitos(viewingContratoDemanda.cpf)}</strong></p>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    O cliente pode entrar na área do formando utilizando seu CPF no login e senha.
                  </p>
                </div>

                {/* Tabela de Parcelamento */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Parcelamento de Pagamentos</h4>
                    <span className="text-xs text-muted-foreground">
                      Clique no status da parcela para alternar entre Pendente/Pago
                    </span>
                  </div>

                  <div className="rounded-xl border overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-muted text-muted-foreground border-b uppercase">
                        <tr>
                          <th className="px-3 py-2">Nº</th>
                          <th className="px-3 py-2">Vencimento</th>
                          <th className="px-3 py-2">Valor</th>
                          <th className="px-3 py-2">Status</th>
                          <th className="px-3 py-2 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {viewingContratoDemanda.parcelas.map((p) => (
                          <tr key={p.numero} className="hover:bg-muted/40 transition-colors">
                            <td className="px-3 py-2.5 font-medium">Parcela {p.numero}</td>
                            <td className="px-3 py-2.5 font-mono">
                              {new Date(p.vencimento + "T00:00:00").toLocaleDateString("pt-BR")}
                            </td>
                            <td className="px-3 py-2.5 font-bold">{brl(p.valor)}</td>
                            <td className="px-3 py-2.5">
                              <Badge
                                variant={p.status === "pago" ? "default" : p.status === "atrasado" ? "destructive" : "secondary"}
                                className={p.status === "pago" ? "bg-emerald-600" : ""}
                              >
                                {p.status === "pago" ? "Pago" : p.status === "atrasado" ? "Atrasado" : "Pendente"}
                              </Badge>
                            </td>
                            <td className="px-3 py-2.5 text-right">
                              <Button
                                size="sm"
                                variant={p.status === "pago" ? "outline" : "default"}
                                onClick={() => handleToggleParcelaStatus(viewingContratoDemanda.id, p.numero)}
                                className="h-7 text-[11px] px-2"
                              >
                                {p.status === "pago" ? "Desfazer Pago" : "Baixar Pagamento"}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex justify-between items-center sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => handleGeneratePdf(viewingContratoDemanda)}
                  className="gap-2"
                >
                  <FileDown className="size-4" /> Baixar Contrato em PDF
                </Button>
                <Button onClick={() => setViewingContratoDemanda(null)}>Fechar</Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>

        {/* ALERT DIALOG: DELETE CONFIRMATION */}
        <AlertDialog
          open={!!deletingDemanda}
          onOpenChange={(v) => {
            if (!v) setDeletingDemanda(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="size-5" /> Excluir Demanda
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a demanda <strong>{deletingDemanda?.cliente}</strong>?
                Esta ação não pode ser desfeita e removerá o contrato e parcelamentos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Sim, Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  );
}
