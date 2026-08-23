import { apenasDigitos, cpfParaEmail } from "@/lib/aluno-login";

export interface ParcelaDemanda {
  numero: number;
  vencimento: string; // YYYY-MM-DD
  valor: number;
  status: "pendente" | "pago" | "atrasado";
  dataPagamento?: string | null;
  formaPagamento?: string | null;
}

export interface DemandaItem {
  id: string;
  tipo: "casamento" | "festa-aniversario" | "ensaio";
  cliente: string;
  cpf: string;
  email?: string;
  whatsapp?: string;
  dataEvento: string;
  local: string;
  status: "confirmada" | "em_negociacao" | "concluida" | "cancelada";
  
  // Contrato & Parcelamento
  pacote: string;
  valorTotal: number;
  valorEntrada: number;
  desconto: number;
  numParcelas: number;
  diaVencimento: number;
  primeiroVencimento: string;
  formaPagamento: string;
  observacoes?: string;
  loginAtivo: boolean;
  parcelas: ParcelaDemanda[];
  createdAt: string;
}

const STORAGE_KEY = "jm_formaturas_demandas_v1";

export function calcularParcelas(
  valorTotal: number,
  valorEntrada: number,
  desconto: number,
  numParcelas: number,
  diaVencimento: number,
  primeiroVencimento: string
): ParcelaDemanda[] {
  const liquido = Math.max(0, valorTotal - desconto - valorEntrada);
  if (numParcelas <= 0 || liquido <= 0) return [];

  const valorParcela = Math.round((liquido / numParcelas) * 100) / 100;
  const dtInicial = primeiroVencimento ? new Date(primeiroVencimento + "T00:00:00") : new Date();
  
  const parcelas: ParcelaDemanda[] = [];
  const hoje = new Date().toISOString().slice(0, 10);

  for (let i = 0; i < numParcelas; i++) {
    const ano = dtInicial.getFullYear();
    const mes = dtInicial.getMonth() + i;
    const dia = Math.min(diaVencimento || 10, 28);
    const d = new Date(ano, mes, dia);
    const iso = d.toISOString().slice(0, 10);

    const status: ParcelaDemanda["status"] = iso < hoje ? "atrasado" : "pendente";

    parcelas.push({
      numero: i + 1,
      vencimento: iso,
      valor: i === numParcelas - 1 ? Math.round((liquido - valorParcela * (numParcelas - 1)) * 100) / 100 : valorParcela,
      status,
    });
  }

  return parcelas;
}

const initialDemoDemandas: DemandaItem[] = [];

export function loadDemandas(): DemandaItem[] {
  if (typeof window === "undefined") return initialDemoDemandas;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDemoDemandas));
      return initialDemoDemandas;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Erro ao carregar demandas:", e);
    return initialDemoDemandas;
  }
}

export function saveDemandas(items: DemandaItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Erro ao salvar demandas:", e);
  }
}

export function formatarCpf(cpfRaw: string): string {
  const digits = apenasDigitos(cpfRaw).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}
