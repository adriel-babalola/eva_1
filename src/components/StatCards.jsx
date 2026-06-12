import { summary as defaultSummary } from '../data/mockData'

export default function StatCards({ summary: propSummary }) {
  const activeSummary = propSummary || defaultSummary
  const fmt = n => n.toLocaleString('en-NG')

  const CARDS = [
    {
      id: 'registered',
      label: 'Registered Voters',
      value: fmt(activeSummary.registered),
      sub: 'Total eligible',
      accent: '#00C896',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: 'accredited',
      label: 'Accredited Voters',
      value: fmt(activeSummary.accredited),
      sub: `${((activeSummary.accredited / activeSummary.registered) * 100).toFixed(1)}% of registered`,
      accent: '#3B82F6',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <polyline points="16 11 18 13 22 9" />
        </svg>
      ),
    },
    {
      id: 'valid',
      label: 'Valid Votes Cast',
      value: fmt(activeSummary.valid),
      sub: `${((activeSummary.valid / activeSummary.accredited) * 100).toFixed(1)}% acceptance rate`,
      accent: '#00C896',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      id: 'rejected',
      label: 'Rejected Votes',
      value: fmt(activeSummary.rejected),
      sub: 'Invalid ballots',
      accent: '#FF3B5C',
      danger: true,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6M9 9l6 6" />
        </svg>
      ),
    },
    {
      id: 'turnout',
      label: 'Voter Turnout',
      value: `${activeSummary.turnout}%`,
      sub: 'Of registered voters',
      accent: '#F59E0B',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
      {CARDS.map((c, i) => (
        <div
          key={c.id}
          className={`
            panel corner-bracket relative flex flex-col gap-3 p-4
            animate-card-entrance
            transition-all duration-200
            hover:panel-active hover:border-border-strong
            ${i === 4 ? 'col-span-2 md:col-span-1' : ''}
          `}
          style={{
            animationDelay: `${i * 60}ms`,
            animationFillMode: 'both',
            borderLeft: `2px solid ${c.accent}`,
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <span className="section-label leading-tight">{c.label}</span>
            <div
              className="w-7 h-7 flex items-center justify-center flex-shrink-0"
              style={{ color: c.accent, background: `${c.accent}12` }}
            >
              {c.icon}
            </div>
          </div>

          {/* Value */}
          <div className="flex flex-col gap-0.5">
            <span
              className="value-display text-[22px] font-bold leading-none tracking-tight"
              style={{ color: c.danger ? '#FF3B5C' : '#E8F0EC' }}
            >
              {c.value}
            </span>
            <span className="text-[10px] font-mono text-text-tertiary mt-0.5">{c.sub}</span>
          </div>

          {/* Bottom accent bar */}
          <div className="h-[1px] w-full overflow-hidden" style={{ background: 'rgba(0,200,150,0.08)' }}>
            <div
              className="h-full animate-bar"
              style={{ width: '100%', background: `linear-gradient(90deg, ${c.accent}, transparent)` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
