/**
 * Ícones ilustrativos da landing — SVG inline no estilo flat/line, imitando
 * o pack que o cliente forneceu. São 3: Formandos (casal formando), Financeiro
 * (calculadora com moeda dourada) e Segurança (escudo verde com check).
 *
 * Assim que os PNGs originais estiverem em public/features/, os componentes
 * podem ser trocados por <img src="/features/{nome}.png" /> sem mexer no layout.
 */

type Props = { className?: string };

export function FormandosIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <rect x="8" y="102" width="112" height="16" rx="2" fill="#9C7361" stroke="#2A2A2A" strokeWidth="3" />
      <path d="M28 32 C22 42 22 60 24 74 L28 102 L60 102 L58 44 C56 34 42 24 28 32 Z"
        fill="#F58F3F" stroke="#2A2A2A" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="42" cy="52" r="18" fill="#FCD9BA" stroke="#2A2A2A" strokeWidth="3" />
      <path d="M28 42 C26 32 40 26 50 30 C56 26 62 34 60 48 C58 44 54 42 50 44 C46 40 32 42 28 50 Z"
        fill="#F58F3F" stroke="#2A2A2A" strokeWidth="3" strokeLinejoin="round" />
      <path d="M38 54 Q39 52 40 54 M46 54 Q47 52 48 54" stroke="#2A2A2A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M40 60 Q43 63 46 60" stroke="#2A2A2A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse cx="35" cy="58" rx="2.5" ry="2" fill="#F5B8A8" />
      <ellipse cx="52" cy="58" rx="2.5" ry="2" fill="#F5B8A8" />
      <path d="M30 70 L52 70 L58 102 L28 102 Z" fill="#F5F7FB" stroke="#2A2A2A" strokeWidth="3" strokeLinejoin="round" />
      <path d="M32 74 L52 74 L57 102 L28 102 Z" fill="#4E5DA3" stroke="#2A2A2A" strokeWidth="3" strokeLinejoin="round" />
      <path d="M36 74 L42 82 L48 74" stroke="#2A2A2A" strokeWidth="2" fill="none" />
      <path d="M42 82 L42 100" stroke="#2A2A2A" strokeWidth="1.5" fill="none" />
      <path d="M39 88 L42 91 L45 88 L42 85 Z" fill="#B76CB2" />
      <path d="M39 96 L42 99 L45 96 L42 93 Z" fill="#B76CB2" />
      <circle cx="86" cy="52" r="18" fill="#FCD9BA" stroke="#2A2A2A" strokeWidth="3" />
      <path d="M70 46 C68 34 82 24 100 30 C106 32 108 38 106 46 C102 40 92 38 84 44 C80 40 74 44 70 48 Z"
        fill="#7A5A4B" stroke="#2A2A2A" strokeWidth="3" strokeLinejoin="round" />
      <path d="M80 54 Q81 52 82 54 M90 54 Q91 52 92 54" stroke="#2A2A2A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M83 60 Q86 63 89 60" stroke="#2A2A2A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse cx="78" cy="58" rx="2.5" ry="2" fill="#F5B8A8" />
      <ellipse cx="94" cy="58" rx="2.5" ry="2" fill="#F5B8A8" />
      <path d="M74 70 L96 70 L102 102 L72 102 Z" fill="#F5F7FB" stroke="#2A2A2A" strokeWidth="3" strokeLinejoin="round" />
      <path d="M76 74 L96 74 L101 102 L72 102 Z" fill="#4E5DA3" stroke="#2A2A2A" strokeWidth="3" strokeLinejoin="round" />
      <path d="M80 74 L86 82 L92 74" stroke="#2A2A2A" strokeWidth="2" fill="none" />
      <path d="M86 82 L86 100" stroke="#2A2A2A" strokeWidth="1.5" fill="none" />
      <path d="M83 88 L86 91 L89 88 L86 85 Z" fill="#B76CB2" />
      <path d="M83 96 L86 99 L89 96 L86 93 Z" fill="#B76CB2" />
    </svg>
  );
}

export function FinanceiroIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <rect x="16" y="20" width="70" height="96" rx="10" fill="none" stroke="#1F1F1F" strokeWidth="6" />
      <rect x="26" y="30" width="50" height="18" rx="3" fill="#F4B851" />
      <g fill="none" stroke="#1F1F1F" strokeWidth="4" strokeLinecap="round">
        <rect x="26" y="56" width="12" height="12" rx="2" />
        <rect x="45" y="56" width="12" height="12" rx="2" />
        <rect x="64" y="56" width="12" height="12" rx="2" />
        <rect x="26" y="74" width="12" height="12" rx="2" />
        <rect x="45" y="74" width="12" height="12" rx="2" />
        <rect x="64" y="74" width="12" height="12" rx="2" />
        <rect x="26" y="92" width="12" height="12" rx="2" />
        <rect x="45" y="92" width="12" height="12" rx="2" />
        <rect x="64" y="92" width="12" height="12" rx="2" />
      </g>
      <circle cx="96" cy="34" r="22" fill="#F4B851" stroke="#1F1F1F" strokeWidth="5" />
      <text x="96" y="42" textAnchor="middle" fontSize="24" fontWeight="700" fill="#1F1F1F" fontFamily="Arial,sans-serif">$</text>
      <path d="M86 54 C82 68 84 82 96 90 C104 96 114 96 124 90 L124 116 L86 116 Z"
        fill="#FBE3B8" stroke="#1F1F1F" strokeWidth="5" strokeLinejoin="round" />
      <path d="M96 82 L98 76 L104 78 L108 74" stroke="#1F1F1F" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function SegurancaIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path d="M64 12 L108 26 L108 66 C108 92 88 110 64 118 C40 110 20 92 20 66 L20 26 Z"
        fill="#1FA84D" stroke="#0E4023" strokeWidth="5" strokeLinejoin="round" />
      <path d="M42 66 L58 82 L88 46"
        stroke="white" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
