import { r as createServerFn, t as TSS_SERVER_FUNCTION } from "./server-D2jkvuIq.mjs";
import { a as requireSupabaseAuth, r as cpfParaEmail, t as apenasDigitos } from "./aluno-login-Bxk3uUlL.mjs";
import { a as object, i as number, n as boolean, o as string, t as array } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alunos.functions-CPxYQ3uh.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var schema = object({ alunoId: string().uuid() });
/** Cria o usuário de acesso do formando: login = CPF, senha = CPF. */
var criarAcessoFormando_createServerFn_handler = createServerRpc({
	id: "cdb9900ab9d24c2d9251c687a9cff613946f76e3495db63ce8c936313f2fc506",
	name: "criarAcessoFormando",
	filename: "src/lib/alunos.functions.ts"
}, (opts) => criarAcessoFormando.__executeServer(opts));
var criarAcessoFormando = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => schema.parse(input)).handler(criarAcessoFormando_createServerFn_handler, async ({ data, context }) => {
	const { data: isStaff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
	if (!isStaff) throw new Error("Apenas a equipe pode criar acessos.");
	const { data: aluno, error: alunoError } = await context.supabase.from("alunos").select("id, nome_completo, cpf, user_id, login_usuario").eq("id", data.alunoId).maybeSingle();
	if (alunoError) throw alunoError;
	if (!aluno) throw new Error("Formando não encontrado.");
	if (aluno.user_id) throw new Error("Este formando já possui acesso.");
	const cpf = apenasDigitos(aluno.cpf ?? "");
	if (cpf.length !== 11) throw new Error("Cadastre um CPF válido (11 dígitos) antes de criar o acesso.");
	const email = cpfParaEmail(cpf);
	const { supabaseAdmin } = await import("./client.server-D8wl7j42.mjs");
	const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
		email,
		password: cpf,
		email_confirm: true,
		user_metadata: {
			full_name: aluno.nome_completo,
			aluno_id: aluno.id
		}
	});
	if (createError || !created.user) throw new Error(createError?.message.includes("already") ? "Já existe um acesso com esse CPF." : createError?.message ?? "Não foi possível criar o acesso.");
	const { error: updateError } = await supabaseAdmin.from("alunos").update({
		user_id: created.user.id,
		login_usuario: cpf
	}).eq("id", aluno.id);
	if (updateError) {
		await supabaseAdmin.auth.admin.deleteUser(created.user.id);
		throw updateError;
	}
	return {
		login: cpf,
		senhaTemporaria: cpf
	};
});
var publicSchema = object({
	alunoId: string().uuid(),
	cpf: string().min(11)
});
/** Cria o acesso do formando a partir do portal de adesão pública. */
var criarAcessoPublicoFormando_createServerFn_handler = createServerRpc({
	id: "3e8dc7772233a14f8b0e5bb6fe383babac22c86af3a0657cf7baf54fa9ed1c70",
	name: "criarAcessoPublicoFormando",
	filename: "src/lib/alunos.functions.ts"
}, (opts) => criarAcessoPublicoFormando.__executeServer(opts));
var criarAcessoPublicoFormando = createServerFn({ method: "POST" }).inputValidator((input) => publicSchema.parse(input)).handler(criarAcessoPublicoFormando_createServerFn_handler, async ({ data }) => {
	const cpf = apenasDigitos(data.cpf);
	if (cpf.length !== 11) throw new Error("CPF inválido.");
	const { supabaseAdmin } = await import("./client.server-D8wl7j42.mjs");
	const { data: aluno, error: alunoError } = await supabaseAdmin.from("alunos").select("id, nome_completo, cpf, user_id").eq("id", data.alunoId).maybeSingle();
	if (alunoError || !aluno) throw new Error("Formando não encontrado.");
	if (aluno.user_id) return { login: cpf };
	const email = cpfParaEmail(cpf);
	const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
		email,
		password: cpf,
		email_confirm: true,
		user_metadata: {
			full_name: aluno.nome_completo,
			aluno_id: aluno.id
		}
	});
	if (createError || !created.user) {
		if (createError?.message.includes("already")) {
			const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
			const userMatched = userList?.users?.find((u) => u.email === email);
			if (userMatched) {
				const { error: updateError } = await supabaseAdmin.from("alunos").update({
					user_id: userMatched.id,
					login_usuario: cpf
				}).eq("id", aluno.id);
				if (updateError) throw updateError;
				return { login: cpf };
			}
			throw new Error("Já existe um acesso cadastrado com esse CPF.");
		}
		throw new Error(createError?.message ?? "Não foi possível liberar o acesso.");
	}
	const { error: updateError } = await supabaseAdmin.from("alunos").update({
		user_id: created.user.id,
		login_usuario: cpf
	}).eq("id", aluno.id);
	if (updateError) {
		await supabaseAdmin.auth.admin.deleteUser(created.user.id);
		throw updateError;
	}
	return { login: cpf };
});
var adesaoSchema = object({
	turmaId: string().uuid(),
	dadosPessoais: object({
		nome_completo: string(),
		cpf: string(),
		rg: string().optional(),
		telefone: string().optional(),
		whatsapp: string(),
		email: string(),
		endereco: string(),
		cidade: string(),
		cep: string().optional()
	}),
	pacote: string(),
	valorTotal: number(),
	numParcelas: number(),
	diaVencimento: number(),
	autorizaImagem: boolean(),
	textoContratoCompleto: string(),
	parcelas: array(object({
		numero: number(),
		valor: number(),
		vencimento: string()
	}))
});
/** Realiza toda a adesão do aluno na retaguarda (bypassing RLS), inclusive gerando login automático. */
var realizarAdesaoPublica_createServerFn_handler = createServerRpc({
	id: "db6405e0134e8a8f26038eeb3c80db4b699cbd2470df97c25001196f758d48d4",
	name: "realizarAdesaoPublica",
	filename: "src/lib/alunos.functions.ts"
}, (opts) => realizarAdesaoPublica.__executeServer(opts));
var realizarAdesaoPublica = createServerFn({ method: "POST" }).inputValidator((input) => adesaoSchema.parse(input)).handler(realizarAdesaoPublica_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-D8wl7j42.mjs");
	const cpfLimpo = apenasDigitos(data.dadosPessoais.cpf);
	if (cpfLimpo.length !== 11) throw new Error("CPF deve ter 11 dígitos.");
	const { data: existingAluno, error: getAlunoError } = await supabaseAdmin.from("alunos").select("id, user_id").eq("cpf", cpfLimpo).eq("turma_id", data.turmaId).maybeSingle();
	if (getAlunoError) throw getAlunoError;
	let alunoId = "";
	if (existingAluno) {
		alunoId = existingAluno.id;
		const { error: updateAlunoError } = await supabaseAdmin.from("alunos").update({
			turma_id: data.turmaId,
			nome_completo: data.dadosPessoais.nome_completo.trim(),
			rg: data.dadosPessoais.rg?.trim() || null,
			telefone: data.dadosPessoais.telefone?.trim() || null,
			whatsapp: data.dadosPessoais.whatsapp.trim(),
			email: data.dadosPessoais.email.trim(),
			endereco: data.dadosPessoais.endereco.trim(),
			cidade: data.dadosPessoais.cidade.trim(),
			status: "ativo"
		}).eq("id", alunoId);
		if (updateAlunoError) throw updateAlunoError;
	} else {
		const { data: newAluno, error: insertAlunoError } = await supabaseAdmin.from("alunos").insert({
			turma_id: data.turmaId,
			nome_completo: data.dadosPessoais.nome_completo.trim(),
			cpf: cpfLimpo,
			rg: data.dadosPessoais.rg?.trim() || null,
			telefone: data.dadosPessoais.telefone?.trim() || null,
			whatsapp: data.dadosPessoais.whatsapp.trim(),
			email: data.dadosPessoais.email.trim(),
			endereco: data.dadosPessoais.endereco.trim(),
			cidade: data.dadosPessoais.cidade.trim(),
			status: "ativo"
		}).select("id").single();
		if (insertAlunoError) throw insertAlunoError;
		alunoId = newAluno.id;
	}
	const { data: oldContratos } = await supabaseAdmin.from("contratos").select("id").eq("aluno_id", alunoId);
	if (oldContratos && oldContratos.length > 0) {
		const ids = oldContratos.map((c) => c.id);
		await supabaseAdmin.from("parcelas").delete().in("contrato_id", ids);
		await supabaseAdmin.from("contratos").delete().in("id", ids);
	}
	const hojeIso = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const { data: contrato, error: contratoError } = await supabaseAdmin.from("contratos").insert({
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
		texto_contrato: data.textoContratoCompleto
	}).select("id").single();
	if (contratoError) throw contratoError;
	const parcelasInsert = data.parcelas.map((p) => ({
		contrato_id: contrato.id,
		numero: p.numero,
		valor: p.valor,
		valor_pago: 0,
		vencimento: p.vencimento,
		status: "pendente",
		forma_pagamento: "boleto"
	}));
	const { error: parcelasError } = await supabaseAdmin.from("parcelas").insert(parcelasInsert);
	if (parcelasError) throw parcelasError;
	const email = cpfParaEmail(cpfLimpo);
	let userId = existingAluno?.user_id;
	if (!userId) {
		const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
			email,
			password: cpfLimpo,
			email_confirm: true,
			user_metadata: {
				full_name: data.dadosPessoais.nome_completo,
				aluno_id: alunoId
			}
		});
		if (createError) {
			if (createError.message.includes("already")) {
				const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
				const userMatched = userList?.users?.find((u) => u.email === email);
				if (userMatched) userId = userMatched.id;
			}
			if (!userId) throw new Error(createError.message ?? "Erro ao criar login de acesso.");
		} else if (created.user) userId = created.user.id;
	}
	if (userId) {
		const { error: updateError } = await supabaseAdmin.from("alunos").update({
			user_id: userId,
			login_usuario: cpfLimpo
		}).eq("id", alunoId);
		if (updateError) throw updateError;
	}
	return {
		alunoId,
		nome: data.dadosPessoais.nome_completo,
		email,
		cpf: cpfLimpo
	};
});
var buscarTurmaPublica_createServerFn_handler = createServerRpc({
	id: "9ce116639a964e50e38b6c4890b9f68879251b6b8a8ab255d8913d6411e3997d",
	name: "buscarTurmaPublica",
	filename: "src/lib/alunos.functions.ts"
}, (opts) => buscarTurmaPublica.__executeServer(opts));
var buscarTurmaPublica = createServerFn({ method: "GET" }).validator((id) => id).handler(buscarTurmaPublica_createServerFn_handler, async ({ data: turmaId }) => {
	const { supabaseAdmin } = await import("./client.server-D8wl7j42.mjs");
	const { data, error } = await supabaseAdmin.from("turmas").select("*").eq("id", turmaId).maybeSingle();
	if (error) throw error;
	return data;
});
//#endregion
export { buscarTurmaPublica_createServerFn_handler, criarAcessoFormando_createServerFn_handler, criarAcessoPublicoFormando_createServerFn_handler, realizarAdesaoPublica_createServerFn_handler };
