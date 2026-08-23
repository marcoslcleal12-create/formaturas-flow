import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { apenasDigitos, cpfParaEmail } from "@/lib/aluno-login";

const schema = z.object({ alunoId: z.string().uuid() });

/** Cria o usuário de acesso do formando: login = CPF, senha = CPF. */
export const criarAcessoFormando = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { alunoId: string }) => schema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: isStaff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!isStaff) throw new Error("Apenas a equipe pode criar acessos.");

    const { data: aluno, error: alunoError } = await context.supabase
      .from("alunos")
      .select("id, nome_completo, cpf, user_id, login_usuario")
      .eq("id", data.alunoId)
      .maybeSingle();
    if (alunoError) throw alunoError;
    if (!aluno) throw new Error("Formando não encontrado.");
    if (aluno.user_id) throw new Error("Este formando já possui acesso.");

    const cpf = apenasDigitos(aluno.cpf ?? "");
    if (cpf.length !== 11) throw new Error("Cadastre um CPF válido (11 dígitos) antes de criar o acesso.");

    const email = cpfParaEmail(cpf);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: cpf,
      email_confirm: true,
      user_metadata: { full_name: aluno.nome_completo, aluno_id: aluno.id },
    });
    if (createError || !created.user) {
      throw new Error(
        createError?.message.includes("already")
          ? "Já existe um acesso com esse CPF."
          : (createError?.message ?? "Não foi possível criar o acesso."),
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("alunos")
      .update({ user_id: created.user.id, login_usuario: cpf })
      .eq("id", aluno.id);
    if (updateError) {
      await supabaseAdmin.auth.admin.deleteUser(created.user.id);
      throw updateError;
    }

    return { login: cpf, senhaTemporaria: cpf };
  });

const publicSchema = z.object({ alunoId: z.string().uuid(), cpf: z.string().min(11) });

/** Cria o acesso do formando a partir do portal de adesão pública. */
export const criarAcessoPublicoFormando = createServerFn({ method: "POST" })
  .validator((input: { alunoId: string; cpf: string }) => publicSchema.parse(input))
  .handler(async ({ data }) => {
    const cpf = apenasDigitos(data.cpf);
    if (cpf.length !== 11) throw new Error("CPF inválido.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Busca o aluno
    const { data: aluno, error: alunoError } = await supabaseAdmin
      .from("alunos")
      .select("id, nome_completo, cpf, user_id")
      .eq("id", data.alunoId)
      .maybeSingle();

    if (alunoError || !aluno) throw new Error("Formando não encontrado.");
    if (aluno.user_id) return { login: cpf }; // Já possui acesso cadastrado

    const email = cpfParaEmail(cpf);

    // Cria o usuário com o admin helper para confirmar o e-mail automaticamente
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: cpf,
      email_confirm: true,
      user_metadata: { full_name: aluno.nome_completo, aluno_id: aluno.id },
    });

    if (createError || !created.user) {
      if (createError?.message.includes("already")) {
        // Tenta encontrar o usuário na base auth se já existe
        const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
        const userMatched = userList?.users?.find((u) => u.email === email);
        if (userMatched) {
          const { error: updateError } = await supabaseAdmin
            .from("alunos")
            .update({ user_id: userMatched.id, login_usuario: cpf })
            .eq("id", aluno.id);
          if (updateError) throw updateError;
          return { login: cpf };
        }
        throw new Error("Já existe um acesso cadastrado com esse CPF.");
      }
      throw new Error(createError?.message ?? "Não foi possível liberar o acesso.");
    }

    // Vincula o user_id no cadastro do aluno
    const { error: updateError } = await supabaseAdmin
      .from("alunos")
      .update({ user_id: created.user.id, login_usuario: cpf })
      .eq("id", aluno.id);

    if (updateError) {
      await supabaseAdmin.auth.admin.deleteUser(created.user.id);
      throw updateError;
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

/** Realiza toda a adesão do aluno na retaguarda (bypassing RLS), inclusive gerando login automático. */
export const realizarAdesaoPublica = createServerFn({ method: "POST" })
  .validator((input: any) => adesaoSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const cpfLimpo = apenasDigitos(data.dadosPessoais.cpf);
    if (cpfLimpo.length !== 11) throw new Error("CPF deve ter 11 dígitos.");

    // 1. Busca se aluno já existe
    const { data: existingAluno, error: getAlunoError } = await supabaseAdmin
      .from("alunos")
      .select("id, user_id")
      .eq("cpf", cpfLimpo)
      .eq("turma_id", data.turmaId)
      .maybeSingle();

    if (getAlunoError) throw getAlunoError;

    let alunoId = "";
    if (existingAluno) {
      alunoId = existingAluno.id;
      // Atualiza os dados dele
      const { error: updateAlunoError } = await supabaseAdmin
        .from("alunos")
        .update({
          turma_id: data.turmaId,
          nome_completo: data.dadosPessoais.nome_completo.trim(),
          rg: data.dadosPessoais.rg?.trim() || null,
          telefone: data.dadosPessoais.telefone?.trim() || null,
          whatsapp: data.dadosPessoais.whatsapp.trim(),
          email: data.dadosPessoais.email.trim(),
          endereco: data.dadosPessoais.endereco.trim(),
          cidade: data.dadosPessoais.cidade.trim(),
          status: "ativo",
        })
        .eq("id", alunoId);

      if (updateAlunoError) throw updateAlunoError;
    } else {
      // Cria novo
      const { data: newAluno, error: insertAlunoError } = await supabaseAdmin
        .from("alunos")
        .insert({
          turma_id: data.turmaId,
          nome_completo: data.dadosPessoais.nome_completo.trim(),
          cpf: cpfLimpo,
          rg: data.dadosPessoais.rg?.trim() || null,
          telefone: data.dadosPessoais.telefone?.trim() || null,
          whatsapp: data.dadosPessoais.whatsapp.trim(),
          email: data.dadosPessoais.email.trim(),
          endereco: data.dadosPessoais.endereco.trim(),
          cidade: data.dadosPessoais.cidade.trim(),
          status: "ativo",
        })
        .select("id")
        .single();

      if (insertAlunoError) throw insertAlunoError;
      alunoId = newAluno.id;
    }

    // 2. Limpa contratos e parcelas anteriores para evitar duplicidade
    const { data: oldContratos } = await supabaseAdmin
      .from("contratos")
      .select("id")
      .eq("aluno_id", alunoId);

    if (oldContratos && oldContratos.length > 0) {
      const ids = oldContratos.map((c) => c.id);
      await supabaseAdmin.from("parcelas").delete().in("contrato_id", ids);
      await supabaseAdmin.from("contratos").delete().in("id", ids);
    }

    // 3. Cadastra o novo contrato
    const hojeIso = new Date().toISOString().slice(0, 10);
    const { data: contrato, error: contratoError } = await supabaseAdmin
      .from("contratos")
      .insert({
        aluno_id: alunoId,
        turma_id: data.turmaId,
        pacote: data.pacote,
        valor_total: data.valorTotal,
        desconto: 0,
        valor_entrada: 0,
        num_parcelas: data.numParcelas,
        dia_vencimento: data.diaVencimento,
        forma_pagamento: "boleto",
        autoriza_imagem: data.autorizaImagem,
        status: "ativo",
        data_contrato: hojeIso,
        texto_contrato: data.textoContratoCompleto,
      })
      .select("id")
      .single();

    if (contratoError) throw contratoError;

    // 4. Cadastra as parcelas
    const parcelasInsert = data.parcelas.map((p) => ({
      contrato_id: contrato.id,
      numero: p.numero,
      valor: p.valor,
      valor_pago: 0,
      vencimento: p.vencimento,
      status: "pendente",
      forma_pagamento: "boleto",
    }));

    const { error: parcelasError } = await supabaseAdmin
      .from("parcelas")
      .insert(parcelasInsert);

    if (parcelasError) throw parcelasError;

    // 5. Cadastra ou vincula o usuário no Auth
    const email = cpfParaEmail(cpfLimpo);
    let userId = existingAluno?.user_id;

    if (!userId) {
      const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: cpfLimpo,
        email_confirm: true,
        user_metadata: { full_name: data.dadosPessoais.nome_completo, aluno_id: alunoId },
      });

      if (createError) {
        if (createError.message.includes("already")) {
          const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
          const userMatched = userList?.users?.find((u) => u.email === email);
          if (userMatched) {
            userId = userMatched.id;
          }
        }
        if (!userId) {
          throw new Error(createError.message ?? "Erro ao criar login de acesso.");
        }
      } else if (created.user) {
        userId = created.user.id;
      }
    }

    if (userId) {
      const { error: updateError } = await supabaseAdmin
        .from("alunos")
        .update({ user_id: userId, login_usuario: cpfLimpo })
        .eq("id", alunoId);
      if (updateError) throw updateError;
    }

    return {
      alunoId,
      nome: data.dadosPessoais.nome_completo,
      email,
      cpf: cpfLimpo,
    };
  });

export const buscarTurmaPublica = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: turmaId }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("turmas")
      .select("*")
      .eq("id", turmaId)
      .maybeSingle();
      
    if (error) throw error;
    return data;
  });


