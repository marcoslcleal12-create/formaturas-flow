import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { apiFetch } from "@/lib/api/client";
import { apenasDigitos } from "@/lib/aluno-login";

type TurmaPublica = {
  id: string;
  nome: string;
  curso?: string | null;
  faculdade?: string | null;
  instituicao?: string | null;
  cidade?: string | null;
  semestre?: string | null;
  anoFormatura?: number | null;
  previsaoFormatura?: string | null;
  tipoEvento: string;
  dataEvento?: string | null;
  status: string;
  observacoes?: string | null;
};

const criarAcessoSchema = z.object({ alunoId: z.string().uuid() });

export const criarAcessoFormando = createServerFn({ method: "POST" })
  .validator((input: { alunoId: string }) => criarAcessoSchema.parse(input))
  .handler(async ({ data }) => {
    const aluno = await apiFetch<{ id: string; nomeCompleto: string; cpf?: string | null; loginUsuario?: string | null; userId?: string | null }>({
      method: "GET",
      path: `/api/v1/alunos/${data.alunoId}`,
    });
    const cpf = apenasDigitos(aluno.cpf ?? "");
    if (cpf.length !== 11) throw new Error("Cadastre um CPF valido (11 digitos) antes de criar o acesso.");
    if (aluno.userId) throw new Error("Este formando ja possui acesso.");

    const email = `${cpf}@formandos.local`;
    await apiFetch({
      method: "POST",
      path: "/auth/register",
      body: { email, password: cpf, nomeCompleto: aluno.nomeCompleto },
    });

    return { login: cpf, senhaTemporaria: cpf };
  });

const publicSchema = z.object({ alunoId: z.string().uuid(), cpf: z.string().min(11) });

export const criarAcessoPublicoFormando = createServerFn({ method: "POST" })
  .validator((input: { alunoId: string; cpf: string }) => publicSchema.parse(input))
  .handler(async ({ data }) => {
    const cpf = apenasDigitos(data.cpf);
    if (cpf.length !== 11) throw new Error("CPF invalido.");
    const email = `${cpf}@formandos.local`;
    try {
      await apiFetch({
        method: "POST",
        path: "/auth/register",
        body: { email, password: cpf, nomeCompleto: `Formando ${cpf}` },
      });
    } catch {
      /* usuario ja existente e ok — a adesao apenas garante que login existe */
    }
    return { login: cpf };
  });

const adesaoSchema = z.object({
  turmaId: z.string().uuid(),
  dadosPessoais: z.object({
    nome_completo: z.string(),
    cpf: z.string(),
    rg: z.string().optional(),
    telefone: z.string().optional(),
    whatsapp: z.string(),
    email: z.string(),
    endereco: z.string(),
    cidade: z.string(),
    cep: z.string().optional(),
  }),
  pacote: z.string(),
  valorTotal: z.number(),
  numParcelas: z.number(),
  diaVencimento: z.number(),
  autorizaImagem: z.boolean(),
  textoContratoCompleto: z.string(),
  parcelas: z.array(
    z.object({
      numero: z.number(),
      valor: z.number(),
      vencimento: z.string(),
    })
  ),
});

export const realizarAdesaoPublica = createServerFn({ method: "POST" })
  .validator((input: any) => adesaoSchema.parse(input))
  .handler(async ({ data }) => {
    const cpfLimpo = apenasDigitos(data.dadosPessoais.cpf);
    if (cpfLimpo.length !== 11) throw new Error("CPF deve ter 11 digitos.");

    const resp = await apiFetch<{ alunoId: string; nome: string; cpf: string; loginUsuario: string }>({
      method: "POST",
      path: "/api/v1/public/adesao",
      body: {
        turmaId: data.turmaId,
        dadosPessoais: {
          nomeCompleto: data.dadosPessoais.nome_completo,
          cpf: cpfLimpo,
          rg: data.dadosPessoais.rg ?? null,
          telefone: data.dadosPessoais.telefone ?? null,
          whatsapp: data.dadosPessoais.whatsapp,
          email: data.dadosPessoais.email,
          endereco: data.dadosPessoais.endereco,
          cidade: data.dadosPessoais.cidade,
          cep: data.dadosPessoais.cep ?? null,
        },
        pacote: data.pacote,
        valorTotal: data.valorTotal,
        numParcelas: data.numParcelas,
        diaVencimento: data.diaVencimento,
        autorizaImagem: data.autorizaImagem,
        textoContratoCompleto: data.textoContratoCompleto,
        parcelas: data.parcelas,
      },
    });

    const email = `${cpfLimpo}@formandos.local`;
    try {
      await apiFetch({
        method: "POST",
        path: "/auth/register",
        body: { email, password: cpfLimpo, nomeCompleto: data.dadosPessoais.nome_completo },
      });
    } catch {
      /* usuario ja existente e ok — login continua sendo o CPF */
    }

    return {
      alunoId: resp.alunoId,
      nome: resp.nome,
      email,
      cpf: cpfLimpo,
    };
  });

export const buscarTurmaPublica = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: turmaId }) => {
    try {
      const t = await apiFetch<TurmaPublica>({ method: "GET", path: `/api/v1/public/turmas/${turmaId}` });
      return {
        id: t.id,
        nome: t.nome,
        curso: t.curso,
        faculdade: t.faculdade,
        instituicao: t.instituicao,
        cidade: t.cidade,
        semestre: t.semestre,
        ano_formatura: t.anoFormatura,
        previsao_formatura: t.previsaoFormatura,
        tipo_evento: t.tipoEvento,
        data_evento: t.dataEvento,
        status: t.status,
        observacoes: t.observacoes,
      };
    } catch {
      return null;
    }
  });
