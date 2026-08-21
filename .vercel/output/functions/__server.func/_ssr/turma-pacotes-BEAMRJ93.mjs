//#region node_modules/.nitro/vite/services/ssr/assets/turma-pacotes-BEAMRJ93.js
var PACOTES_PADRAO = [
	{
		id: "pacote-1",
		nome: "1º PACOTE - SOMENTE COLAÇÃO DE GRAU",
		material: "30 fotos editadas em mídia digitais, enviadas via link.",
		investimento: 870,
		ativo: true
	},
	{
		id: "pacote-2",
		nome: "2º PACOTE - ENSAIO + COLAÇÃO DE GRAU",
		material: "40 fotos editadas em mídia digitais, enviadas via link.",
		investimento: 1400,
		ativo: true
	},
	{
		id: "pacote-3",
		nome: "3º PACOTE - ENSAIO + COLAÇÃO DE GRAU (ALTA RESOLUÇÃO)",
		material: "Todas as fotos em alta resolução e enviadas via link.",
		investimento: 1740,
		ativo: true
	},
	{
		id: "pacote-4",
		nome: "4º PACOTE - ENSAIO + COLAÇÃO DE GRAU (ÁLBUM LUXO)",
		material: "1 Álbum encadernado luxo 20X30 com 60 fotos em 30 páginas, capa personalizada com foto.",
		investimento: 2200,
		ativo: true
	}
];
var DIAS_VENCIMENTO = [
	5,
	10,
	15,
	20,
	25,
	30
];
var NOMES_MESES = [
	"Janeiro",
	"Fevereiro",
	"Março",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro"
];
/**
* Calcula a grade de parcelas a partir de uma data de início / vencimento selecionado.
*/
function calcularParcelas(valorTotal, numParcelas, diaVencimento, dataInicio) {
	const parcelas = [];
	const qtd = Math.min(Math.max(1, numParcelas), 12);
	const valorParcela = Math.round(valorTotal / qtd * 100) / 100;
	const valorResidual = Math.round((valorTotal - valorParcela * qtd) * 100) / 100;
	const baseDate = dataInicio ? new Date(dataInicio) : /* @__PURE__ */ new Date();
	let mesInicial = baseDate.getMonth();
	let anoInicial = baseDate.getFullYear();
	if (baseDate.getDate() > diaVencimento - 5) {
		mesInicial += 1;
		if (mesInicial > 11) {
			mesInicial = 0;
			anoInicial += 1;
		}
	}
	for (let i = 0; i < qtd; i++) {
		const dataParcela = new Date(anoInicial, mesInicial + i, 1);
		const ano = dataParcela.getFullYear();
		const mes = dataParcela.getMonth();
		const ultimoDiaDoMes = new Date(ano, mes + 1, 0).getDate();
		const diaFormatado = String(Math.min(diaVencimento, ultimoDiaDoMes)).padStart(2, "0");
		const vencimentoIso = `${ano}-${String(mes + 1).padStart(2, "0")}-${diaFormatado}`;
		const valorFinal = i === 0 ? valorParcela + valorResidual : valorParcela;
		parcelas.push({
			numero: i + 1,
			valor: Math.round(valorFinal * 100) / 100,
			vencimento: vencimentoIso,
			mesAno: `${NOMES_MESES[mes]} ${ano}`
		});
	}
	return parcelas;
}
/**
* Extrai a lista de pacotes configurados para uma turma (ou retorna os pacotes padrão se nenhum estiver gravado)
*/
function extrairPacotesTurma(observacoes) {
	if (!observacoes) return PACOTES_PADRAO;
	try {
		const parsed = JSON.parse(observacoes);
		if (parsed && Array.isArray(parsed.pacotes) && parsed.pacotes.length > 0) return parsed.pacotes;
	} catch {}
	return PACOTES_PADRAO;
}
/**
* Serializa a lista de pacotes mantendo eventuais notas textuais existentes
*/
function serializarPacotesTurma(observacoesAtuais, novosPacotes) {
	let textoExtra = "";
	try {
		const parsed = JSON.parse(observacoesAtuais || "{}");
		if (parsed && typeof parsed.notas === "string") textoExtra = parsed.notas;
	} catch {
		textoExtra = observacoesAtuais || "";
	}
	return JSON.stringify({
		pacotes: novosPacotes,
		notas: textoExtra
	});
}
//#endregion
export { serializarPacotesTurma as a, extrairPacotesTurma as i, PACOTES_PADRAO as n, calcularParcelas as r, DIAS_VENCIMENTO as t };
