import { parties, summary } from '../data/mockData'

const fmt = n => n.toLocaleString('en-NG')

const PARTY_COLORS = {
  ndc:  { solid: '#00C896', bar: 'linear-gradient(90deg, #00C896, #00E5A8)', glow: 'rgba(0,200,150,0.25)' },
  apc:  { solid: '#3B82F6', bar: 'linear-gradient(90deg, #3B82F6, #60A5FA)', glow: 'rgba(59,130,246,0.25)' },
  lp:   { solid: '#FF3B5C', bar: 'linear-gradient(90deg, #FF3B5C, #FF6B82)', glow: 'rgba(255,59,92,0.25)' },
  nnpp: { solid: '#F59E0B', bar: 'linear-gradient(90deg, #F59E0B, #FBBF24)', glow: 'rgba(245,158,11,0.25)' },
}

export default function PartyStandings({ parties: propParties, summary: propSummary }) {
  const activeSummary = propSummary || summary
  const activeParties = propParties || parties
  const total = activeSummary.valid
  const sorted = [...activeParties].sort((a, b) => b.votes - a.votes)

  return (
    <div className="panel corner-bracket relative animate-card-entrance h-full" style={{ animationFillMode: 'both' }}>
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-[3px] h-4 bg-primary flex-shrink-0" />
          <h2 className="font-sans text-[13px] font-semibold text-text-primary tracking-wide uppercase">Party Standings</h2>
        </div>
        <span className="section-label">{fmt(total)} valid votes</span>
      </div>

      {/* Standings list */}
      <div className="flex flex-col divide-y divide-border px-0">
        {sorted.map((p, i) => {
          const pct = ((p.votes / total) * 100).toFixed(1)
          const isLeading = i === 0
          const colors = PARTY_COLORS[p.id] || { solid: p.color, bar: `linear-gradient(90deg, ${p.color}, ${p.color})`, glow: `${p.color}40` }

          return (
            <div
              key={p.id}
              className={`
                flex items-center gap-4 px-5 py-4
                transition-all duration-150 row-hover
                ${isLeading ? 'bg-primary/[0.04]' : ''}
              `}
            >
              {/* Rank */}
              <span className="value-display text-[11px] text-text-tertiary w-4 text-center flex-shrink-0">
                {i + 1}
              </span>

              {/* Party name */}
              <div className="w-12 flex-shrink-0">
                <div
                  className="inline-flex items-center px-1.5 py-0.5"
                  style={{ background: `${colors.solid}15`, border: `1px solid ${colors.solid}35` }}
                >
                  <span className="font-mono text-[11px] font-bold" style={{ color: colors.solid }}>{p.name}</span>
                </div>
              </div>

              {/* Bar */}
              <div className="flex-1 h-[6px] bg-surface-raised relative overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full animate-bar"
                  style={{
                    width: `${pct}%`,
                    background: colors.bar,
                    boxShadow: isLeading ? `0 0 8px ${colors.glow}` : 'none',
                    animationDelay: `${i * 120}ms`,
                  }}
                />
              </div>

              {/* Votes */}
              <span className="value-display text-[13px] font-semibold text-text-primary w-24 text-right flex-shrink-0">
                {fmt(p.votes)}
              </span>

              {/* Percentage */}
              <span
                className="value-display text-[12px] font-bold w-14 text-right flex-shrink-0"
                style={{ color: colors.solid }}
              >
                {pct}%
              </span>

              {/* Leading badge */}
              {isLeading && (
                <div className="flex-shrink-0">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-primary text-bg uppercase tracking-widest">
                    LEAD
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
