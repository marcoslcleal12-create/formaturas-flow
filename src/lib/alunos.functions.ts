import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { apenasDigitos, cpfParaEmail } from "@/lib/aluno-login";

const schema = z.object({ alunoId: z.string().uuid() });

/** Cria o usuário de acesso do formando: login = CPF, senha = CPF. */
export const criarAcessoFormando = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { alunoId: string }) => schema.parse(input))
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
