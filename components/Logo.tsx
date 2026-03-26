export default function Logo({ color = 'lime' }: { color?: 'lime' | 'navy' } = {}) {
  const colors = {
    lime: {
      primary: '#84CC16',
      dark: '#65A30D',
      glow: 'rgba(132,204,22,0.7)',
      glowFade: 'rgba(132,204,22,0.4)',
    },
    navy: {
      primary: '#001F3F',
      dark: '#000E1F',
      glow: 'rgba(0,31,63,0.7)',
      glowFade: 'rgba(0,31,63,0.4)',
    },
  }
  
  const c = colors[color]
  
  return (
    <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{filter: `drop-shadow(0 0 6px ${c.glow}) drop-shadow(0 0 12px ${c.glowFade})`}}>
      {/* Megaphone body */}
      <path d="M25 35 L55 20 L55 70 L25 55 Z" fill={c.primary}/>
      {/* Megaphone bell */}
      <path d="M55 15 Q80 10 85 5 L85 85 Q80 80 55 75 Z" fill={c.primary}/>
      {/* Megaphone handle */}
      <rect x="15" y="38" width="12" height="14" rx="3" fill={c.dark}/>
      {/* Cross on megaphone */}
      <rect x="66" y="28" width="5" height="34" rx="1" fill="#FFFFFF"/>
      <rect x="56" y="40" width="25" height="5" rx="1" fill="#FFFFFF"/>
      {/* Sound waves */}
      <path d="M88 30 Q95 45 88 60" stroke={c.primary} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M93 22 Q102 45 93 68" stroke={c.primary} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6"/>
    </svg>
  )
}
