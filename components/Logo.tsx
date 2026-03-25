export default function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{filter: 'drop-shadow(0 0 6px rgba(132,204,22,0.7)) drop-shadow(0 0 12px rgba(132,204,22,0.4))'}}>
      {/* Megaphone body */}
      <path d="M25 35 L55 20 L55 70 L25 55 Z" fill="#84CC16"/>
      {/* Megaphone bell */}
      <path d="M55 15 Q80 10 85 5 L85 85 Q80 80 55 75 Z" fill="#84CC16"/>
      {/* Megaphone handle */}
      <rect x="15" y="38" width="12" height="14" rx="3" fill="#65A30D"/>
      {/* Cross on megaphone */}
      <rect x="66" y="28" width="5" height="34" rx="1" fill="#FFFFFF"/>
      <rect x="56" y="40" width="25" height="5" rx="1" fill="#FFFFFF"/>
      {/* Sound waves */}
      <path d="M88 30 Q95 45 88 60" stroke="#84CC16" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M93 22 Q102 45 93 68" stroke="#84CC16" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6"/>
    </svg>
  )
}
