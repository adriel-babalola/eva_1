import { useState, Fragment } from 'react'
import { results } from '../data/mockData'
import StatusBadge from './StatusBadge'

const fmt = n => n.toLocaleString('en-NG')
const rowTotal = r => (r.ndc || 0) + (r.apc || 0) + (r.lp || 0) + (r.nnpp || 0)

const PARTY_COLS = [
  { key: 'ndc',  label: 'NDC',  color: '#00C896' },
  { key: 'apc',  label: 'APC',  color: '#3B82F6' },
  { key: 'lp',   label: 'LP',   color: '#FF3B5C' },
  { key: 'nnpp', label: 'NNPP', color: '#F59E0B' },
]

export default function ResultsTable() {
  const [expanded, setExpanded] = useState({})
  const [search, setSearch]     = useState('')

  const toggle = id => setExpanded(p => ({ ...p, [id]: !p[id] }))

  // Helper to dynamically calculate sums at Ward, LGA, and State levels based on PU data
  const rollUpTree = (stNode) => {
    const lgas = stNode.lgas.map(lga => {
      const wards = lga.wards.map(wd => {
        const registered = wd.pus.reduce((sum, pu) => sum + (pu.registered || 0), 0)
        const accredited = wd.pus.reduce((sum, pu) => sum + (pu.accredited || 0), 0)
        const casted = wd.pus.reduce((sum, pu) => sum + (pu.casted || 0), 0)
        const ndc = wd.pus.reduce((sum, pu) => sum + (pu.ndc || 0), 0)
        const apc = wd.pus.reduce((sum, pu) => sum + (pu.apc || 0), 0)
        const lp = wd.pus.reduce((sum, pu) => sum + (pu.lp || 0), 0)
        const nnpp = wd.pus.reduce((sum, pu) => sum + (pu.nnpp || 0), 0)
        const status = wd.pus.every(pu => pu.status === 'verified')
          ? 'verified'
          : wd.pus.some(pu => pu.status === 'verified' || pu.status === 'unverified')
            ? 'unverified'
            : 'pending'
        return { ...wd, registered, accredited, casted, ndc, apc, lp, nnpp, status }
      })
      const registered = wards.reduce((sum, wd) => sum + wd.registered, 0)
      const accredited = wards.reduce((sum, wd) => sum + wd.accredited, 0)
      const casted = wards.reduce((sum, wd) => sum + wd.casted, 0)
      const ndc = wards.reduce((sum, wd) => sum + wd.ndc, 0)
      const apc = wards.reduce((sum, wd) => sum + wd.apc, 0)
      const lp = wards.reduce((sum, wd) => sum + wd.lp, 0)
      const nnpp = wards.reduce((sum, wd) => sum + wd.nnpp, 0)
      const status = wards.every(wd => wd.status === 'verified')
        ? 'verified'
        : wards.some(wd => wd.status === 'verified' || wd.status === 'unverified')
          ? 'unverified'
          : 'pending'
      return { ...lga, wards, registered, accredited, casted, ndc, apc, lp, nnpp, status }
    })
    const registered = lgas.reduce((sum, lga) => sum + lga.registered, 0)
    const accredited = lgas.reduce((sum, lga) => sum + lga.accredited, 0)
    const casted = lgas.reduce((sum, lga) => sum + lga.casted, 0)
    const ndc = lgas.reduce((sum, lga) => sum + lga.ndc, 0)
    const apc = lgas.reduce((sum, lga) => sum + lga.apc, 0)
    const lp = lgas.reduce((sum, lga) => sum + lga.lp, 0)
    const nnpp = lgas.reduce((sum, lga) => sum + lga.nnpp, 0)
    const status = lgas.every(lga => lga.status === 'verified')
      ? 'verified'
      : lgas.some(lga => lga.status === 'verified' || lga.status === 'unverified')
        ? 'unverified'
        : 'pending'
    return { ...stNode, lgas, registered, accredited, casted, ndc, apc, lp, nnpp, status }
  }

  const processedResults = results.map(rollUpTree)

  // Compute Grand Total of all states combined
  const nationalTotals = processedResults.reduce(
    (totals, st) => {
      totals.registered += st.registered
      totals.accredited += st.accredited
      totals.casted += st.casted
      totals.ndc += st.ndc
      totals.apc += st.apc
      totals.lp += st.lp
      totals.nnpp += st.nnpp
      return totals
    },
    { registered: 0, accredited: 0, casted: 0, ndc: 0, apc: 0, lp: 0, nnpp: 0 }
  )

  // Filter tree and auto-expand matches
  const getFilteredTree = (states, query) => {
    if (!query.trim()) {
      return { filtered: states, autoExpanded: {} }
    }
    const q = query.trim().toLowerCase()
    const autoExpanded = {}
    const filtered = []

    states.forEach(st => {
      const matchedLgas = []
      st.lgas.forEach(lga => {
        const matchedWards = []
        lga.wards.forEach(wd => {
          const matchedPus = wd.pus.filter(pu =>
            pu.name.toLowerCase().includes(q)
          )
          const wardMatches = wd.name.toLowerCase().includes(q) || matchedPus.length > 0
          if (wardMatches) {
            matchedWards.push({
              ...wd,
              pus: matchedPus.length > 0 ? matchedPus : wd.pus
            })
            if (matchedPus.length > 0) {
              autoExpanded[wd.id] = true
            }
          }
        })
        const lgaMatches = lga.name.toLowerCase().includes(q) || matchedWards.length > 0
        if (lgaMatches) {
          matchedLgas.push({
            ...lga,
            wards: matchedWards.length > 0 ? matchedWards : lga.wards
          })
          if (matchedWards.length > 0) {
            autoExpanded[lga.id] = true
          }
        }
      })
      const stateMatches = st.name.toLowerCase().includes(q) || matchedLgas.length > 0
      if (stateMatches) {
        filtered.push({
          ...st,
          lgas: matchedLgas.length > 0 ? matchedLgas : st.lgas
        })
        if (matchedLgas.length > 0) {
          autoExpanded[st.id] = true
        }
      }
    })

    return { filtered, autoExpanded }
  }

  const { filtered, autoExpanded } = getFilteredTree(processedResults, search)

  const isExpanded = id => !!(expanded[id] || (search && autoExpanded[id]))

  return (
    <div className="panel corner-bracket relative animate-card-entrance overflow-hidden" style={{ animationDelay: '120ms', animationFillMode: 'both' }}>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface-raised/30">
        <div className="flex items-center gap-3">
          <div className="w-[3px] h-4 bg-primary flex-shrink-0" />
          <h2 className="font-sans text-[13px] font-semibold text-text-primary tracking-wide uppercase">Result in Nigeria across 36 states</h2>
          <span className="section-label ml-2 text-text-tertiary">
            {filtered.length} State{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            id="results-search"
            type="search"
            placeholder="Search state, LGA, ward, PU…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="font-mono text-[12px] text-text-primary bg-surface border border-border pl-8 pr-4 py-2 outline-none w-64 placeholder:text-text-tertiary transition-all duration-150 focus:border-border-bright"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]" role="treegrid">

          {/* Head */}
          <thead>
            <tr className="bg-surface-raised/40 border-b border-border-strong">
              <th className="text-left py-3 px-5 section-label">Area Hierarchy</th>
              <th className="text-right py-3 px-4 section-label">Voters Registered</th>
              <th className="text-right py-3 px-4 section-label">Accredited Voters</th>
              <th className="text-right py-3 px-4 section-label">Vote Casted</th>
              {PARTY_COLS.map(p => (
                <th key={p.key} className="text-right py-3 px-4 section-label">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5" style={{ background: p.color }} />
                    {p.label}
                  </span>
                </th>
              ))}
              <th className="text-right py-3 px-4 section-label border-l border-border">Total Valid</th>
              <th className="text-center py-3 px-5 section-label">Status</th>
            </tr>
          </thead>

          <tbody>
            {/* Grand Total row */}
            <tr className="border-b border-border-strong" style={{ background: 'linear-gradient(90deg, rgba(0,200,150,0.06), transparent)' }}>
              <td className="py-3.5 px-5 font-sans font-bold text-[13px]">
                <span className="text-gradient-green">Grand Collation Total (All States)</span>
              </td>
              <td className="py-3.5 px-4 value-display font-bold text-[13px] text-right text-text-primary">{fmt(nationalTotals.registered)}</td>
              <td className="py-3.5 px-4 value-display font-bold text-[13px] text-right text-text-primary">{fmt(nationalTotals.accredited)}</td>
              <td className="py-3.5 px-4 value-display font-bold text-[13px] text-right text-text-primary">{fmt(nationalTotals.casted)}</td>
              {PARTY_COLS.map(p => (
                <td key={p.key} className="py-3.5 px-4 value-display font-bold text-[13px] text-right text-text-primary">{fmt(nationalTotals[p.key])}</td>
              ))}
              <td className="py-3.5 px-4 value-display font-bold text-[13px] text-right border-l border-border text-primary">
                {fmt(rowTotal(nationalTotals))}
              </td>
              <td className="py-3.5 px-5 text-center"><StatusBadge status="progress" /></td>
            </tr>

            {/* Tree rendering */}
            {filtered.map(st => {
              const stExpanded = isExpanded(st.id)
              return (
                <Fragment key={st.id}>
                  {/* State Row */}
                  <tr
                    className="border-b border-border row-hover cursor-pointer group transition-colors duration-100"
                    onClick={() => toggle(st.id)}
                    style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.01), transparent)' }}
                  >
                    <td className="py-3 px-5 font-sans font-bold text-[13px] text-text-primary">
                      <div className="flex items-center gap-2.5">
                        <button
                          className={`
                            w-5 h-5 flex items-center justify-center border border-border-strong
                            transition-all duration-150
                            ${stExpanded
                              ? 'bg-primary/15 text-primary border-primary/30'
                              : 'text-text-tertiary group-hover:text-text-secondary'
                            }
                          `}
                          aria-label={stExpanded ? `Collapse ${st.name}` : `Expand ${st.name}`}
                          onClick={e => { e.stopPropagation(); toggle(st.id) }}
                        >
                          <svg
                            width="10" height="10" viewBox="0 0 10 10" fill="none"
                            className={`transition-transform duration-150 ${stExpanded ? 'rotate-90' : ''}`}
                          >
                            <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
                          </svg>
                        </button>
                        <span>{st.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 value-display font-semibold text-right text-text-secondary">{fmt(st.registered)}</td>
                    <td className="py-3 px-4 value-display font-semibold text-right text-text-secondary">{fmt(st.accredited)}</td>
                    <td className="py-3 px-4 value-display font-semibold text-right text-text-secondary">{fmt(st.casted)}</td>
                    {PARTY_COLS.map(p => (
                      <td key={p.key} className="py-3 px-4 value-display font-semibold text-right text-text-secondary">{fmt(st[p.key])}</td>
                    ))}
                    <td className="py-3 px-4 value-display font-semibold text-right text-text-primary border-l border-border">{fmt(rowTotal(st))}</td>
                    <td className="py-3 px-5 text-center"><StatusBadge status={st.status} /></td>
                  </tr>

                  {/* LGA Rows */}
                  {stExpanded && st.lgas.map(lga => {
                    const lgaExpanded = isExpanded(lga.id)
                    return (
                      <Fragment key={lga.id}>
                        <tr
                          className="border-b border-border row-hover cursor-pointer group transition-colors duration-100"
                          onClick={() => toggle(lga.id)}
                          style={{ background: 'rgba(255,255,255,0.003)' }}
                        >
                          <td className="py-2.5 pl-12 pr-4 font-sans font-semibold text-[12.5px] text-text-secondary relative">
                            {/* Vertical connector line from State to LGA level */}
                            <span className="absolute left-[30px] top-0 bottom-0 w-px bg-primary/10" />
                            {/* Horizontal connector line to LGA expander */}
                            <span className="absolute left-[30px] top-1/2 w-[18px] h-px bg-primary/10" />

                            <div className="flex items-center gap-2.5 relative z-10">
                              <button
                                className={`
                                  w-5 h-5 flex items-center justify-center border border-border-strong bg-bg
                                  transition-all duration-150
                                  ${lgaExpanded
                                    ? 'bg-primary/15 text-primary border-primary/30'
                                    : 'text-text-tertiary group-hover:text-text-secondary'
                                  }
                                `}
                                aria-label={lgaExpanded ? `Collapse ${lga.name}` : `Expand ${lga.name}`}
                                onClick={e => { e.stopPropagation(); toggle(lga.id) }}
                              >
                                <svg
                                  width="10" height="10" viewBox="0 0 10 10" fill="none"
                                  className={`transition-transform duration-150 ${lgaExpanded ? 'rotate-90' : ''}`}
                                >
                                  <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
                                </svg>
                              </button>
                              <span>{lga.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-4 value-display text-right text-text-secondary">{fmt(lga.registered)}</td>
                          <td className="py-2.5 px-4 value-display text-right text-text-secondary">{fmt(lga.accredited)}</td>
                          <td className="py-2.5 px-4 value-display text-right text-text-secondary">{fmt(lga.casted)}</td>
                          {PARTY_COLS.map(p => (
                            <td key={p.key} className="py-2.5 px-4 value-display text-right text-text-secondary">{fmt(lga[p.key])}</td>
                          ))}
                          <td className="py-2.5 px-4 value-display font-semibold text-right text-text-secondary border-l border-border">{fmt(rowTotal(lga))}</td>
                          <td className="py-2.5 px-5 text-center"><StatusBadge status={lga.status} /></td>
                        </tr>

                        {/* Ward Rows */}
                        {lgaExpanded && lga.wards.map(ward => {
                          const wardExpanded = isExpanded(ward.id)
                          return (
                            <Fragment key={ward.id}>
                              <tr
                                className="border-b border-border row-hover cursor-pointer group transition-colors duration-100"
                                onClick={() => toggle(ward.id)}
                                style={{ background: 'rgba(0,200,150,0.005)' }}
                              >
                                <td className="py-2.5 pl-[76px] pr-4 text-text-secondary text-[12px] relative">
                                  {/* Vertical connector lines */}
                                  <span className="absolute left-[30px] top-0 bottom-0 w-px bg-primary/10" />
                                  <span className="absolute left-[58px] top-0 bottom-0 w-px bg-primary/10" />
                                  {/* Horizontal connector line */}
                                  <span className="absolute left-[58px] top-1/2 w-[18px] h-px bg-primary/10" />

                                  <div className="flex items-center gap-2.5 relative z-10">
                                    <button
                                      className={`
                                        w-5 h-5 flex items-center justify-center border border-border-strong bg-bg
                                        transition-all duration-150
                                        ${wardExpanded
                                          ? 'bg-primary/15 text-primary border-primary/30'
                                          : 'text-text-tertiary group-hover:text-text-secondary'
                                        }
                                      `}
                                      aria-label={wardExpanded ? `Collapse ${ward.name}` : `Expand ${ward.name}`}
                                      onClick={e => { e.stopPropagation(); toggle(ward.id) }}
                                    >
                                      <svg
                                        width="10" height="10" viewBox="0 0 10 10" fill="none"
                                        className={`transition-transform duration-150 ${wardExpanded ? 'rotate-90' : ''}`}
                                      >
                                        <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
                                      </svg>
                                    </button>
                                    <span className="font-mono text-[11px] font-semibold text-text-secondary">{ward.name}</span>
                                  </div>
                                </td>
                                <td className="py-2.5 px-4 value-display text-[11px] text-right text-text-tertiary">{fmt(ward.registered)}</td>
                                <td className="py-2.5 px-4 value-display text-[11px] text-right text-text-tertiary">{fmt(ward.accredited)}</td>
                                <td className="py-2.5 px-4 value-display text-[11px] text-right text-text-tertiary">{fmt(ward.casted)}</td>
                                {PARTY_COLS.map(p => (
                                  <td key={p.key} className="py-2.5 px-4 value-display text-[11px] text-right text-text-tertiary">{fmt(ward[p.key])}</td>
                                ))}
                                <td className="py-2.5 px-4 value-display text-[11px] font-semibold text-right text-text-secondary border-l border-border">{fmt(rowTotal(ward))}</td>
                                <td className="py-2.5 px-5 text-center"><StatusBadge status={ward.status} /></td>
                              </tr>

                              {/* Polling Unit Rows */}
                              {wardExpanded && ward.pus.map(pu => (
                                <tr
                                  key={pu.id}
                                  className="border-b border-border/60 hover:bg-[#0E1520]/40 transition-colors duration-100"
                                  style={{ background: 'rgba(0,200,150,0.015)' }}
                                >
                                  <td className="py-2 pl-[104px] pr-4 text-text-tertiary text-[11px] relative">
                                    {/* Vertical connector lines */}
                                    <span className="absolute left-[30px] top-0 bottom-0 w-px bg-primary/10" />
                                    <span className="absolute left-[58px] top-0 bottom-0 w-px bg-primary/10" />
                                    <span className="absolute left-[86px] top-0 bottom-0 w-px bg-primary/10" />
                                    {/* Horizontal connector line */}
                                    <span className="absolute left-[86px] top-1/2 w-[18px] h-px bg-primary/10" />

                                    <span className="font-mono text-[11px] pl-1 relative z-10">{pu.name}</span>
                                  </td>
                                  <td className="py-2 px-4 value-display text-[11px] text-right text-text-tertiary">{fmt(pu.registered)}</td>
                                  <td className="py-2 px-4 value-display text-[11px] text-right text-text-tertiary">{fmt(pu.accredited)}</td>
                                  <td className="py-2 px-4 value-display text-[11px] text-right text-text-tertiary">{fmt(pu.casted)}</td>
                                  {PARTY_COLS.map(p => (
                                    <td key={p.key} className="py-2 px-4 value-display text-[11px] text-right text-text-tertiary">{fmt(pu[p.key])}</td>
                                  ))}
                                  <td className="py-2 px-4 value-display text-[11px] font-semibold text-right text-text-tertiary border-l border-border">{fmt(rowTotal(pu))}</td>
                                  <td className="py-2 px-5 text-center"><StatusBadge status={pu.status} /></td>
                                </tr>
                              ))}
                            </Fragment>
                          )
                        })}
                      </Fragment>
                    )
                  })}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
