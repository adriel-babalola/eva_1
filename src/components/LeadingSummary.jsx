import { parties, summary } from '../data/mockData'

const fmt = n => n.toLocaleString('en-NG')

const PARTY_COLORS = {
  ndc:  { solid: '#00C896', bar: 'linear-gradient(90deg, #00C896, #00E5A8)' },
  apc:  { solid: '#3B82F6', bar: 'linear-gradient(90deg, #3B82F6, #60A5FA)' },
  lp:   { solid: '#FF3B5C', bar: 'linear-gradient(90deg, #FF3B5C, #FF6B82)' },
  nnpp: { solid: '#F59E0B', bar: 'linear-gradient(90deg, #F59E0B, #FBBF24)' },
}

export default function LeadingSummary({ parties: propParties, summary: propSummary }) {
  const activeParties = propParties || parties
  const activeSummary = propSummary || summary
  const sorted = [...activeParties].sort((a, b) => b.votes - a.votes)
  const leader = sorted[0]
  const runner = sorted[1]
  const margin = leader.votes - runner.votes
  const leadPct = ((leader.votes / activeSummary.valid) * 100).toFixed(1)
  const lc = PARTY_COLORS[leader.id] || { solid: leader.color, bar: `linear-gradient(90deg, ${leader.color}, ${leader.color})` }

  return (
    <div className="panel corner-bracket relative flex flex-col animate-card-entrance" style={{ animationDelay: '80ms', animationFillMode: 'both' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border">
        <div className="w-[3px] h-4 bg-primary flex-shrink-0" />
        <h2 className="font-sans text-[13px] font-semibold text-text-primary tracking-wide uppercase">Leading Party</h2>
      </div>

      {/* Leader display */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          {/* Party tag */}
          <div
            className="w-14 h-14 flex items-center justify-center font-mono font-bold text-[16px] flex-shrink-0"
            style={{ background: lc.bar, color: '#080B0F' }}
          >
            {leader.name}
          </div>

          {/* Votes + pct */}
          <div className="flex flex-col gap-0.5">
            <span className="value-display text-[26px] font-bold leading-none text-text-primary">
              {fmt(leader.votes)}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className="text-[9px] font-mono font-bold px-1.5 py-0.5 text-bg"
                style={{ background: lc.solid }}
              >
                {leadPct}%
              </span>
              <span className="text-[11px] font-mono text-text-tertiary">of valid votes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Margin */}
      <div className="px-5 py-3.5 border-b border-border" style={{ background: 'rgba(0,200,150,0.03)' }}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-text-secondary">Margin over {runner.name}</span>
          <span className="value-display text-[16px] font-bold text-primary">+{fmt(margin)}</span>
        </div>
      </div>

      {/* Mini standings */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <span className="section-label">All parties</span>
        {sorted.map((p, i) => {
          const pct = ((p.votes / activeSummary.valid) * 100).toFixed(1)
          const colors = PARTY_COLORS[p.id] || { solid: p.color, bar: `linear-gradient(90deg, ${p.color}, ${p.color})` }

          return (
            <div key={p.id} className="flex items-center gap-2.5">
              <span
                className="font-mono text-[10px] font-bold w-10 flex-shrink-0"
                style={{ color: colors.solid }}
              >
                {p.name}
              </span>
              <div className="flex-1 h-[4px] bg-surface-raised overflow-hidden">
                <div
                  className="h-full animate-bar"
                  style={{
                    width: `${pct}%`,
                    background: colors.bar,
                    animationDelay: `${i * 80}ms`,
                  }}
                />
              </div>
              <span className="value-display text-[11px] text-text-tertiary w-12 text-right flex-shrink-0">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
