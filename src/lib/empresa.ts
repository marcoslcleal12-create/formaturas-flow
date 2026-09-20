export const EMPRESA = {
  nome: "JM Stúdio Fotográfico",
  cidade: "Araguaína-TO",
  whatsapp: "5563992060225",
  whatsappFormatado: "(63) 99206-0225",
  instagram: "@jm_studiofotografico",
  email: "jmstudiofotograficoaraguaina@gmail.com",
};

export function whatsappLink(mensagem: string): string {
  const texto = encodeURIComponent(mensagem);
  return `https://wa.me/${EMPRESA.whatsapp}?text=${texto}`;
}
