function LogoIcon({ s }) {
  return (
    <svg width={s} height={s} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="16" fill="#00263E"/>
      <rect x="25" y="100" width="150" height="72" rx="3" fill="#0369EA"/>
      <rect x="38" y="68" width="20" height="38" rx="2" fill="#0369EA"/>
      <rect x="72" y="56" width="20" height="50" rx="2" fill="#0369EA"/>
      <rect x="108" y="72" width="20" height="34" rx="2" fill="#0369EA"/>
      <rect x="34" y="62" width="28" height="9" rx="2" fill="#1DCAD3"/>
      <rect x="68" y="50" width="28" height="9" rx="2" fill="#1DCAD3"/>
      <rect x="104" y="66" width="28" height="9" rx="2" fill="#1DCAD3"/>
      <circle cx="48" cy="52" r="5" fill="white" opacity="0.25"/>
      <circle cx="44" cy="42" r="3.5" fill="white" opacity="0.15"/>
      <circle cx="82" cy="38" r="6" fill="white" opacity="0.25"/>
      <circle cx="78" cy="26" r="4" fill="white" opacity="0.15"/>
      <circle cx="118" cy="56" r="4.5" fill="white" opacity="0.25"/>
      <rect x="36" y="112" width="22" height="18" rx="2" fill="white" opacity="0.9"/>
      <rect x="68" y="112" width="22" height="18" rx="2" fill="white" opacity="0.9"/>
      <rect x="100" y="112" width="22" height="18" rx="2" fill="white" opacity="0.9"/>
      <rect x="132" y="112" width="22" height="18" rx="2" fill="white" opacity="0.9"/>
      <rect x="83" y="138" width="34" height="34" rx="2" fill="#00263E"/>
      <circle cx="113" cy="156" r="3" fill="#1DCAD3"/>
      <rect x="25" y="166" width="150" height="6" rx="3" fill="#1DCAD3"/>
      <text x="140" y="88" fontFamily="Arial Black, sans-serif" fontSize="38" fontWeight="900" fill="#1DCAD3" textAnchor="middle">H</text>
    </svg>
  )
}

export default function Logo({ variant = 'full', size = 32, dark = false }) {
  if (variant === 'icon') {
    return <LogoIcon s={size} />
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <LogoIcon s={size} />
      <div style={{ lineHeight: 1 }}>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 800,
          fontSize: size * 0.5,
          color: dark ? '#fff' : '#00263E',
          letterSpacing: '-0.5px',
          lineHeight: 1.1,
        }}>
          H&D
        </div>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          fontSize: size * 0.3,
          color: dark ? 'rgba(255,255,255,0.65)' : '#475569',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          Factory
        </div>
      </div>
    </div>
  )
}
