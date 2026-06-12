import { summary } from '../data/mockData'

const METRICS = [
  {
    label: 'LGAs Reported',
    getValue: s => `${s.lgasReported} / ${s.lgasTotal}`,
    getPct:   s => s.lgasReported / s.lgasTotal,
    color:    '#00C896',
    glow:     'rgba(0,200,150,0.3)',
  },
  {
    label: 'Units Submitted',
    getValue: s => `${s.unitsReported.toLocaleString()} / ${s.unitsTotal.toLocaleString()}`,
    getPct:   s => s.unitsReported / s.unitsTotal,
    color:    '#3B82F6',
    glow:     'rgba(59,130,246,0.3)',
  },
  {
    label: 'Results Verified',
    getValue: s => `${s.verifiedPct}%`,
    getPct:   s => s.verifiedPct / 100,
    color:    '#00C896',
    glow:     'rgba(0,200,150,0.3)',
  },
]

export default function ReportingStatus({ summary: propSummary }) {
  const activeSummary = propSummary || summary
  return (
    <div className="panel corner-bracket relative animate-card-entrance h-full flex flex-col" style={{ animationDelay: '80ms', animationFillMode: 'both' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border flex-shrink-0">
        <div className="w-[3px] h-4 bg-primary flex-shrink-0" />
        <h2 className="font-sans text-[13px] font-semibold text-text-primary tracking-wide uppercase">Reporting Status</h2>
      </div>

      {/* Metrics */}
      <div className="flex flex-col gap-0 flex-1 justify-center divide-y divide-border">
        {METRICS.map((m, i) => {
          const pct = m.getPct(activeSummary)
          const pctDisplay = (pct * 100).toFixed(0)
          const r = 20
          const circ = 2 * Math.PI * r
          const dash = (pct * circ).toFixed(2)
          const gap  = (circ - dash).toFixed(2)

          return (
            <div key={m.label} className="flex items-center gap-4 px-5 py-4">
              {/* SVG Ring */}
              <div className="relative w-[52px] h-[52px] flex-shrink-0">
                <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
                  {/* Track */}
                  <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(0,200,150,0.06)" strokeWidth="3" />
                  {/* Progress */}
                  <circle
                    cx="24" cy="24" r={r}
                    fill="none"
                    stroke={m.color}
                    strokeWidth="3"
                    strokeDasharray={`${dash} ${gap}`}
                    strokeLinecap="butt"
                    style={{
                      filter: `drop-shadow(0 0 3px ${m.glow})`,
                      transition: 'stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  />
                </svg>
                <span
                  className="absolute inset-0 flex items-center justify-center value-display text-[11px] font-bold"
                  style={{ color: m.color }}
                >
                  {pctDisplay}%
                </span>
              </div>

              {/* Label + bar */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-sans text-[12px] font-medium text-text-secondary">{m.label}</span>
                  <span className="value-display text-[12px] font-semibold text-text-primary">{m.getValue(activeSummary)}</span>
                </div>
                <div className="h-[3px] bg-surface-raised overflow-hidden">
                  <div
                    className="h-full animate-bar"
                    style={{
                      width: `${pct * 100}%`,
                      background: m.color,
                      boxShadow: `0 0 6px ${m.glow}`,
                      animationDelay: `${i * 150}ms`,
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
