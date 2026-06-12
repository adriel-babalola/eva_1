import { summary } from '../data/mockData'

const RINGS = [
  {
    label: 'LGA Reporting',
    getSub: s => `${s.lgasReported} of ${s.lgasTotal} LGAs`,
    getPct: s => s.lgasReported / s.lgasTotal,
    color:  '#00C896',
    glow:   'rgba(0,200,150,0.35)',
  },
  {
    label: 'Unit Submission',
    getSub: s => `${s.unitsReported.toLocaleString()} of ${s.unitsTotal.toLocaleString()}`,
    getPct: s => s.unitsReported / s.unitsTotal,
    color:  '#3B82F6',
    glow:   'rgba(59,130,246,0.35)',
  },
  {
    label: 'Verified Results',
    getSub: s => `${s.verifiedPct}% of submitted`,
    getPct: s => s.verifiedPct / 100,
    color:  '#00C896',
    glow:   'rgba(0,200,150,0.35)',
  },
]

export default function CollationProgress({ summary: propSummary }) {
  const activeSummary = propSummary || summary
  return (
    <div className="panel corner-bracket relative animate-card-entrance" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border">
        <div className="w-[3px] h-4 bg-primary flex-shrink-0" />
        <h2 className="font-sans text-[13px] font-semibold text-text-primary tracking-wide uppercase">Collation Progress</h2>
        <span className="section-label ml-auto">System Overview</span>
      </div>

      {/* Rings grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
        {RINGS.map((ring, i) => {
          const pct = ring.getPct(activeSummary)
          const pctDisplay = (pct * 100).toFixed(0)
          const r = 40
          const circ = 2 * Math.PI * r
          const dash = (pct * circ).toFixed(2)
          const gap  = (circ - dash).toFixed(2)

          return (
            <div
              key={ring.label}
              className="flex flex-col items-center gap-5 p-8 transition-colors duration-150 row-hover"
              style={{ animationDelay: `${i * 80 + 250}ms` }}
            >
              {/* Ring */}
              <div className="relative" style={{ width: 100, height: 100 }}>
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Track */}
                  <circle
                    cx="50" cy="50" r={r}
                    fill="none"
                    stroke="rgba(0,200,150,0.06)"
                    strokeWidth="5"
                  />
                  {/* Tick marks */}
                  {Array.from({ length: 40 }).map((_, ti) => {
                    const angle = (ti / 40) * 2 * Math.PI - Math.PI / 2
                    const inner = r - 3
                    const outer = r + 1
                    const x1 = 50 + inner * Math.cos(angle)
                    const y1 = 50 + inner * Math.sin(angle)
                    const x2 = 50 + outer * Math.cos(angle)
                    const y2 = 50 + outer * Math.sin(angle)
                    return (
                      <line
                        key={ti}
                        x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke="rgba(0,200,150,0.08)"
                        strokeWidth="0.5"
                      />
                    )
                  })}
                  {/* Progress arc */}
                  <circle
                    cx="50" cy="50" r={r}
                    fill="none"
                    stroke={ring.color}
                    strokeWidth="4"
                    strokeDasharray={`${dash} ${gap}`}
                    strokeLinecap="butt"
                    style={{
                      filter: `drop-shadow(0 0 5px ${ring.glow})`,
                      transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  />
                </svg>
                {/* Center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="value-display text-[20px] font-bold leading-none"
                    style={{ color: ring.color }}
                  >
                    {pctDisplay}%
                  </span>
                </div>
              </div>

              {/* Label */}
              <div className="text-center">
                <p className="font-sans text-[12px] font-semibold text-text-primary tracking-wide uppercase">{ring.label}</p>
                <p className="value-display text-[11px] text-text-tertiary mt-1">{ring.getSub(activeSummary)}</p>
              </div>

              {/* Linear progress */}
              <div className="w-full h-[2px] bg-surface-raised overflow-hidden">
                <div
                  className="h-full animate-bar"
                  style={{
                    width: `${pct * 100}%`,
                    background: ring.color,
                    boxShadow: `0 0 6px ${ring.glow}`,
                    animationDelay: `${i * 100 + 400}ms`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
