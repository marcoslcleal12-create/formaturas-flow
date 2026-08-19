import { jsPDF } from "jspdf";

export const EMPRESA = {
  nome: "JM Stúdio Fotográfico",
  cnpj: "45.124.637/0001-28",
  contato: "63 99206-0225 / @jm_studiofotografico / jmstudiofotograficoaraguaina@gmail.com",
  responsavel: "Marconde Ramos Borges",
  cidade: "Araguaína-TO",
};

export const FORMAS_PAGAMENTO = [
  { id: "boleto", label: "Boleto bancário" },
  { id: "pix", label: "Pix" },
  { id: "cartao_credito", label: "Cartão de Crédito" },
  { id: "cartao_debito", label: "Cartão de Débito" },
  { id: "dinheiro", label: "Dinheiro" },
] as const;

export function formaPagamentoLabel(id: string | null | undefined) {
  return FORMAS_PAGAMENTO.find((f) => f.id === id)?.label ?? "Boleto bancário";
}

export const CLAUSULAS_PADRAO = `1. OBJETO
O presente contrato tem como objeto a prestação de serviços de cobertura fotográfica com exclusividade nos eventos ou ensaios descritos pelo CONTRATANTE, incluindo captura, edição e entrega dos produtos contratados (digitais ou impressos).

2. PAGAMENTO E INADIMPLÊNCIA
2.1. O CONTRATANTE se compromete a efetuar o pagamento integral dos valores acordados, conforme prazos estabelecidos neste contrato.
2.2. O não pagamento de qualquer parcela na data do vencimento implicará na incidência de multa de 2% sobre o valor da parcela, juros de 2% ao mês e correção monetária pelo índice oficial.
2.3. A CONTRATADA poderá suspender a prestação de serviços e entrega de produtos até a quitação total do débito, sem prejuízo da cobrança judicial ou extrajudicial.
2.4. Todas as despesas de cobrança, incluindo honorários advocatícios de até 20% do valor devido, serão de responsabilidade do CONTRATANTE.
2.5. Pagamento à vista permite entrega imediata do produto após conclusão dos serviços, conforme prazos explícitos neste contrato.

3. RESCISÃO E DESISTÊNCIA
3.1. A desistência do CONTRATANTE não o exime do pagamento integral do contrato.
3.2. Em caso de rescisão motivada pelo CONTRATANTE, será aplicada multa de 30% do valor total do contrato, acrescida de quaisquer valores investidos em produtos ou serviços já entregues.
3.3. Se a rescisão ocorrer por descumprimento da CONTRATADA, esta devolverá apenas os valores pagos proporcionalmente aos serviços não executados.

4. PRAZOS DE ENTREGA
4.1. Disponibilização das fotos para seleção em até 25 dias após o evento, presencialmente ou via plataforma digital.
4.2. Produtos digitais: prazo de entrega de 30 a 45 dias após a escolha das fotos.
4.3. Produtos impressos ou encadernados: prazo máximo de 120 dias após aprovação da arte.
4.4. Produtos que dependem de aprovação só serão produzidos após aprovação formal do CONTRATANTE.
4.5. Correções ou reimpressões solicitadas após a entrega serão de responsabilidade financeira do CONTRATANTE.
4.6. Arquivos digitais serão mantidos pela CONTRATADA por 90 dias após a criação.
4.7. O CONTRATANTE deve finalizar a seleção das fotos em até 60 dias após o evento e aprovar a arte do álbum em até 50 dias após a conclusão da arte.
4.8. Atrasos na escolha ou aprovação implicam na cobrança do valor vigente do produto.
4.9. Produtos concluídos deverão ser retirados em até 30 dias, após o qual a CONTRATADA não se responsabiliza pelo armazenamento.

5. SERVIÇOS ADICIONAIS E HORAS EXTRAS
Acréscimo de horas na cobertura do evento será cobrado com 20% do valor da hora adicional previamente informado, mediante consulta e autorização prévia do CONTRATANTE.

6. DIREITOS AUTORAIS E USO DE IMAGEM
6.1. O CONTRATANTE não poderá alterar, reproduzir ou distribuir imagens sem autorização prévia da CONTRATADA.
6.2. A CONTRATADA mantém a propriedade intelectual de todas as imagens, mesmo após a entrega dos produtos.

7. RESPONSABILIDADE E FORÇA MAIOR
7.1. A CONTRATADA não se responsabiliza por atrasos ou falhas decorrentes de força maior, incluindo condições climáticas, falhas elétricas, acidentes, pandemias ou atrasos de convidados.
7.2. O CONTRATANTE é responsável por fornecer acesso e condições adequadas para a execução dos serviços.

8. COBRANÇA JUDICIAL E EXTRAJUDICIAL
8.1. Em caso de inadimplência, a CONTRATADA poderá protestar títulos, acionar cartórios e cobrar judicialmente o valor devido, acrescido de juros, multa e honorários advocatícios.
8.2. A cobrança extrajudicial (notificações e cartas) será considerada tentativa prévia antes de ação judicial.

9. RESPONSABILIDADE POR DANOS A EQUIPAMENTOS
O CONTRATANTE se responsabiliza integralmente por qualquer dano, quebra ou avaria nos equipamentos e materiais utilizados pela CONTRATADA, incluindo câmeras, tripés, iluminação, cenários e acessórios, causados por convidados, crianças ou terceiros presentes no evento, comprometendo-se a reembolsar integralmente o valor de reparo ou substituição.

10. FORO
Fica eleito o foro da comarca de Araguaína-TO para dirimir quaisquer controvérsias oriundas deste contrato, com renúncia a qualquer outro, por mais privilegiado que seja.`;

const money = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const dataBR = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR");

export type ParcelaPdf = {
  numero: number;
  valor: number;
  vencimento: string;
  status: string;
  data_pagamento: string | null;
  forma_pagamento: string | null;
};

export type ContratoPdfInput = {
  aluno: {
    nome_completo: string;
    cpf: string | null;
    endereco: string | null;
    cidade: string | null;
    telefone: string | null;
    email: string | null;
    turma_nome?: string | null;
  };
  contrato: {
    pacote: string;
    valor_total: number;
    desconto: number;
    valor_entrada: number;
    dia_vencimento: number;
    data_contrato: string;
    forma_pagamento: string;
    autoriza_imagem: boolean;
  };
  parcelas: ParcelaPdf[];
  texto: string;
};

export function gerarContratoPdf(input: ContratoPdfInput) {
  const { aluno, contrato, parcelas, texto } = input;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const marginX = 16;
  const largura = 210 - marginX * 2;
  let y = 16;

  const quebra = (altura = 6) => {
    if (y + altura > 282) {
      doc.addPage();
      y = 16;
    }
  };

  const linha = (
    txt: string,
    opts: { size?: number; bold?: boolean; align?: "left" | "center"; gap?: number } = {},
  ) => {
    const { size = 10, bold = false, align = "left", gap = 5 } = opts;
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    for (const parte of doc.splitTextToSize(txt, largura) as string[]) {
      quebra(gap);
      doc.text(parte, align === "center" ? 105 : marginX, y, { align });
      y += gap;
    }
  };

  linha("CONTRATO DE PRESTAÇÃO DE SERVIÇOS FOTOGRÁFICOS", { size: 13, bold: true, align: "center", gap: 6 });
  linha("INSTRUMENTO PARTICULAR DE TRABALHO", { size: 9, align: "center" });
  linha(`${EMPRESA.nome} — CNPJ: ${EMPRESA.cnpj}`, { size: 9, align: "center" });
  linha(EMPRESA.contato, { size: 8, align: "center", gap: 7 });

  doc.setDrawColor(200);
  quebra();
  doc.line(marginX, y - 2, 210 - marginX, y - 2);
  y += 3;

  if (aluno.turma_nome) {
    linha(`TURMA: ${aluno.turma_nome.toUpperCase()}`, { size: 11, bold: true });
  }
  linha("DADOS DO CONTRATANTE", { size: 10, bold: true });
  linha(`Nome: ${aluno.nome_completo}`);
  linha(`CPF: ${aluno.cpf ?? "—"}          Contato: ${aluno.telefone ?? "—"}`);
  linha(`Endereço: ${aluno.endereco ?? "—"}`);
  linha(`Cidade: ${aluno.cidade ?? "—"}          E-mail: ${aluno.email ?? "—"}`, { gap: 7 });

  linha(`PACOTE CONTRATADO: ${contrato.pacote}`, { size: 10, bold: true });
  const liquido = contrato.valor_total - contrato.desconto;
  linha(`Investimento: ${money(contrato.valor_total)}${contrato.desconto > 0 ? ` (desconto de ${money(contrato.desconto)} — total a pagar ${money(liquido)})` : ""}`);
  linha(`Forma de pagamento: ${formaPagamentoLabel(contrato.forma_pagamento)}`);
  linha(`Dia de vencimento escolhido: ${String(contrato.dia_vencimento).padStart(2, "0")}`, { gap: 7 });

  linha("PARCELAS", { size: 10, bold: true });
  doc.setFontSize(9);
  for (const p of parcelas) {
    quebra(5);
    doc.setFont("helvetica", "normal");
    const rotulo = p.numero === 0 ? "Entrada" : `Parcela ${p.numero}`;
    const pago =
      p.status === "pago"
        ? `Pago${p.data_pagamento ? ` em ${dataBR(p.data_pagamento)}` : ""}${p.forma_pagamento ? ` via ${p.forma_pagamento}` : ""}`
        : "Em aberto";
    doc.text(rotulo, marginX, y);
    doc.text(dataBR(p.vencimento), marginX + 34, y);
    doc.text(money(Number(p.valor)), marginX + 68, y);
    doc.text(pago, marginX + 105, y);
    y += 5;
  }
  y += 3;

  linha("Autorização de uso de imagem:", { size: 10, bold: true });
  linha(
    contrato.autoriza_imagem
      ? "( X ) Sim, autorizo a JM Formaturas & Eventos a utilizar minhas imagens em portfólio, redes sociais e materiais publicitários."
      : "( X ) Não autorizo o uso das minhas imagens em portfólio, redes sociais e materiais publicitários.",
    { size: 9, gap: 6 },
  );

  linha("CLÁUSULAS", { size: 10, bold: true, align: "center", gap: 7 });
  for (const paragrafo of texto.split("\n")) {
    if (!paragrafo.trim()) {
      y += 3;
      continue;
    }
    linha(paragrafo, { size: 9, gap: 4.4 });
  }

  y += 14;
  quebra(24);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("CONTRATANTE: ______________________________________", marginX, y);
  doc.text(`${EMPRESA.cidade}, ${dataBR(contrato.data_contrato)}`, 210 - marginX, y, { align: "right" });
  y += 8;
  doc.text(`${aluno.nome_completo} — CPF ${aluno.cpf ?? "—"}`, marginX, y);
  y += 10;
  doc.text(`CONTRATADO: ${EMPRESA.cnpj} — ${EMPRESA.responsavel}`, marginX, y);

  const arquivo = `contrato-${aluno.nome_completo.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;
  doc.save(arquivo);
}

export interface BoletoPdfInput {
  clienteNome: string;
  clienteCpf?: string | null | undefined;
  numeroParcela: number;
  valor: number;
  vencimento: string;
  pacote?: string | undefined;
}

export function gerarBoletoPdf(input: BoletoPdfInput) {
  const { clienteNome, clienteCpf, numeroParcela, valor, vencimento, pacote } = input;
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const marginX = 14;
  let y = 18;

  // Cabeçalho
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("BOLETO DE COBRANÇA BANCÁRIA", marginX, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`${EMPRESA.nome} — CNPJ: ${EMPRESA.cnpj}`, marginX, y);
  y += 8;

  // Linha Digitável
  const randomDigits = Math.abs(Math.sin((numeroParcela + 1) * 1000 + valor))
    .toString()
    .slice(2, 10);
  const linhaDigitavel = `34191.79001 01043.510047 91020.150008 1 ${randomDigits}0000${Math.round(valor * 100)}`;

  doc.setFillColor(240, 240, 245);
  doc.rect(marginX, y, 182, 10, "F");
  doc.setFont("courier", "bold");
  doc.setFontSize(11);
  doc.text(linhaDigitavel, marginX + 4, y + 6.5);
  y += 14;

  // Tabela
  doc.setDrawColor(180, 180, 180);

  // Beneficiário & Vencimento
  doc.rect(marginX, y, 120, 12);
  doc.rect(marginX + 120, y, 62, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Beneficiário / Cedente", marginX + 2, y + 4);
  doc.text("Vencimento", marginX + 122, y + 4);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`${EMPRESA.nome} (CNPJ: ${EMPRESA.cnpj})`, marginX + 2, y + 9);
  doc.text(new Date(`${vencimento}T12:00:00`).toLocaleDateString("pt-BR"), marginX + 122, y + 9);
  y += 12;

  // Pagador & Valor
  doc.rect(marginX, y, 120, 12);
  doc.rect(marginX + 120, y, 62, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Pagador / Sacado", marginX + 2, y + 4);
  doc.text("Valor do Documento", marginX + 122, y + 4);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`${clienteNome} - CPF: ${clienteCpf || "—"}`, marginX + 2, y + 9);
  doc.text(
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    marginX + 122,
    y + 9
  );
  y += 12;

  // Referência
  doc.rect(marginX, y, 182, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Demonstrativo / Referência", marginX + 2, y + 4);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(
    `Parcela nº ${numeroParcela === 0 ? "Entrada" : numeroParcela} referente a: ${pacote || "Contrato de Serviços Fotográficos"}`,
    marginX + 2,
    y + 9
  );
  y += 12;

  // Instruções
  doc.rect(marginX, y, 182, 28);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Instruções de Pagamento:", marginX + 2, y + 4);
  doc.text("- Pagável em qualquer agência bancária, internet banking ou casas lotéricas até o vencimento.", marginX + 4, y + 10);
  doc.text("- Após o vencimento, cobrar multa de 2% e juros de 1% ao mês conforme contrato.", marginX + 4, y + 15);
  doc.text("- Central de atendimento JM: " + EMPRESA.contato, marginX + 4, y + 20);
  doc.text("- Não receber após 30 dias do vencimento sem autorização do beneficiário.", marginX + 4, y + 25);
  y += 34;

  // Código de barras
  doc.setFont("courier", "bold");
  doc.setFontSize(16);
  doc.text("||| || ||||| | |||| |||| || | |||| ||||| || ||| ||||", marginX + 20, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Autenticação Mecânica / Ficha de Compensação", marginX, y + 16);

  const cleanName = clienteNome.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
  doc.save(`boleto-parcela-${numeroParcela}-${cleanName}.pdf`);
}

