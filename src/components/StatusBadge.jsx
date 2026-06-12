const CONFIG = {
  verified: {
    label: 'VERIFIED',
    color: '#00C896',
    bg:    'rgba(0,200,150,0.08)',
    border:'rgba(0,200,150,0.25)',
  },
  unverified: {
    label: 'UNVERIFIED',
    color: '#FF3B5C',
    bg:    'rgba(255,59,92,0.08)',
    border:'rgba(255,59,92,0.25)',
  },
  pending: {
    label: 'PENDING',
    color: '#7A9E8E',
    bg:    'rgba(122,158,142,0.08)',
    border:'rgba(122,158,142,0.20)',
  },
  progress: {
    label: 'IN PROGRESS',
    color: '#3B82F6',
    bg:    'rgba(59,130,246,0.08)',
    border:'rgba(59,130,246,0.25)',
  },
}

export default function StatusBadge({ status }) {
  const c = CONFIG[status] ?? CONFIG.pending
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-mono font-bold tracking-[0.10em] whitespace-nowrap"
      style={{
        color:           c.color,
        background:      c.bg,
        border:          `1px solid ${c.border}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 flex-shrink-0"
        style={{ background: c.color }}
      />
      {c.label}
    </span>
  )
}
