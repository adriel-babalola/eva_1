import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import StatCards from './components/StatCards'
import PartyStandings from './components/PartyStandings'
import ReportingStatus from './components/ReportingStatus'
import ResultsTable from './components/ResultsTable'
import LeadingSummary from './components/LeadingSummary'
import CollationProgress from './components/CollationProgress'
import WardMapView from './components/WardMap/WardMapView'
import { stateData } from './data/mockData'

const ELECTION_TYPES = ['Presidential', 'Governorship', 'Senate', 'House of Representatives', 'House of Assembly']
const STATES = [
  'Osun State', 'Abia State', 'Adamawa State', 'Akwa Ibom State', 'Anambra State',
  'Bauchi State', 'Bayelsa State', 'Benue State', 'Borno State', 'Cross River State',
  'Delta State', 'Ebonyi State', 'Edo State', 'Ekiti State', 'Enugu State',
  'Gombe State', 'Imo State', 'Jigawa State', 'Kaduna State', 'Kano State',
  'Katsina State', 'Kebbi State', 'Kogi State', 'Kwara State', 'Lagos State',
  'Nasarawa State', 'Niger State', 'Ogun State', 'Ondo State', 'Oyo State',
  'Plateau State', 'Rivers State', 'Sokoto State', 'Taraba State', 'Yobe State',
  'Zamfara State'
]

export default function App() {
  const [activePage, setActivePage] = useState('home')
  const [electionType, setElectionType] = useState('Presidential')
  const [state, setState] = useState('Osun State')
  const [time, setTime] = useState(new Date())
  const [theme, setTheme] = useState('dark')

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const activeStateData = stateData[state] || stateData['Osun State']
  const activeSummary = activeStateData.summary
  const activeParties = activeStateData.parties

  const lgaPct = Math.round((activeSummary.lgasReported / activeSummary.lgasTotal) * 100)

  const sortedParties = [...activeParties].sort((a, b) => b.votes - a.votes)
  const leaderParty = sortedParties[0]
  const runnerParty = sortedParties[1]
  const marginOfLead = leaderParty.votes - runnerParty.votes

  const keyStats = [
    { label: 'Total LGAs',     value: activeSummary.lgasTotal,                           sub: `${activeSummary.lgasReported} reported` },
    { label: 'Polling Units',   value: activeSummary.unitsTotal.toLocaleString(),         sub: `${activeSummary.unitsReported.toLocaleString()} submitted` },
    { label: 'Voter Turnout',   value: `${activeSummary.turnout}%`,                       sub: `${activeSummary.accredited.toLocaleString()} accredited` },
    { label: 'Verified Pct',    value: `${activeSummary.verifiedPct}%`,                   sub: 'of submitted results' },
    { label: 'Valid Votes',     value: activeSummary.valid.toLocaleString(),              sub: `${((activeSummary.valid / activeSummary.accredited) * 100).toFixed(1)}% of accredited` },
    { label: 'Rejected Ballots',value: activeSummary.rejected.toLocaleString(),           sub: `${((activeSummary.rejected / (activeSummary.valid + activeSummary.rejected)) * 100).toFixed(1)}% of cast` },
    { label: 'Margin of Lead',  value: marginOfLead.toLocaleString(),                     sub: `${leaderParty.name} leads ${runnerParty.name}` },
    { label: 'Active Observers',value: '1,420',                                           sub: '100% accredited coverage' },
  ]

  return (
    <div className="min-h-screen bg-bg font-sans text-text-primary flex" style={{ background: 'var(--color-bg)' }}>

      {/* Sidebar */}
      <Navbar active={activePage} setActive={setActivePage} theme={theme} setTheme={setTheme} electionType={electionType} setElectionType={setElectionType} state={state} setState={setState} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: '64px' }}>

        {/* Top command bar */}
        <header className="sticky top-0 z-40 border-b border-border-strong" style={{ background: 'var(--color-surface)' }}>

          {/* Top accent strip */}
          <div className="w-full h-[1px] bg-primary" />

          <div className="flex items-center justify-between px-6 py-0 h-[50px]">

            {/* Left: System ID + selects */}
            <div className="flex items-center gap-0 divide-x divide-border h-full">
              {/* System ID */}
              <div className="flex items-center gap-2.5 pr-5 h-full">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="1.6" strokeLinecap="square">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span className="font-mono text-[11px] font-bold text-primary tracking-[0.12em] uppercase">EVA-1</span>
                <span className="font-mono text-[11px] text-text-tertiary">·</span>
                <span className="font-mono text-[11px] text-text-tertiary tracking-wide">Election Verification Authority</span>
              </div>

              {/* Election type */}
              <div className="flex items-center gap-2 px-5 h-full">
                <span className="section-label">Type</span>
                <select
                  id="election-type-select"
                  value={electionType}
                  onChange={e => setElectionType(e.target.value)}
                  className="font-mono text-[11px] font-medium text-text-primary bg-transparent border-0 cursor-pointer transition-all duration-150 outline-none focus:text-primary"
                >
                  {ELECTION_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* State */}
              <div className="flex items-center gap-2 px-5 h-full">
                <span className="section-label">State</span>
                <select
                  id="state-select"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="font-mono text-[11px] font-medium text-text-primary bg-transparent border-0 cursor-pointer transition-all duration-150 outline-none focus:text-primary"
                >
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Right: Status indicators */}
            <div className="flex items-center gap-0 divide-x divide-border h-full">

              {/* LGA progress */}
              <div className="flex items-center gap-3 px-5 h-full">
                <span className="section-label">LGA Coverage</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-[2px] bg-surface-raised overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${lgaPct}%` }}
                    />
                  </div>
                  <span className="value-display text-[11px] font-semibold text-primary">{lgaPct}%</span>
                </div>
              </div>

              {/* Clock */}
              <div className="flex items-center gap-2 px-5 h-full">
                <span className="section-label">WAT</span>
                <span className="value-display text-[12px] font-semibold text-text-primary">
                  {time.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>

              {/* Live badge */}
              <div className="flex items-center gap-2 px-5 h-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full bg-success opacity-60" />
                  <span className="relative inline-flex h-2 w-2 bg-success animate-live-glow" />
                </span>
                <span className="font-mono text-[10px] font-bold text-success tracking-[0.12em] uppercase">Live</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-6 py-5 flex flex-col gap-6">
          {activePage === 'home' ? (
            <>
              {/* Page title bar */}
              <div className="flex items-end justify-between animate-card-entrance" style={{ animationFillMode: 'both' }}>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="section-label">Dashboard · {electionType}</span>
                  </div>
                  <h1 id="page-title" className="font-sans font-bold text-[28px] leading-none tracking-tight text-text-primary">
                    {state} <span className="text-gradient-green">Results</span>
                  </h1>
                </div>

                {/* LGA mini-stat */}
                <div className="flex items-center gap-6 pb-0.5">
                  <div className="text-right">
                    <div className="value-display text-[20px] font-bold text-text-primary leading-none">
                      {activeSummary.lgasReported}
                      <span className="text-text-tertiary text-[14px] font-normal"> / {activeSummary.lgasTotal}</span>
                    </div>
                    <div className="section-label mt-0.5">LGAs Reported</div>
                  </div>
                  <div className="text-right">
                    <div className="value-display text-[20px] font-bold text-text-primary leading-none">
                      {activeSummary.turnout}%
                    </div>
                    <div className="section-label mt-0.5">Turnout</div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="sep-h flex-shrink-0" />

              {/* Stat cards row */}
              <StatCards summary={activeSummary} />

              {/* Party standings + reporting status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2"><PartyStandings parties={activeParties} summary={activeSummary} /></div>
                <div><ReportingStatus summary={activeSummary} /></div>
              </div>

              {/* Results table */}
              <ResultsTable />

              {/* Bottom row: leading + key stats + collation */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Leading party */}
                <div><LeadingSummary parties={activeParties} summary={activeSummary} /></div>

                {/* Key stats */}
                <div className="lg:col-span-3">
                  <div className="panel corner-bracket relative animate-card-entrance h-full" style={{ animationDelay: '160ms', animationFillMode: 'both' }}>
                    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border">
                      <div className="w-[3px] h-4 bg-primary flex-shrink-0" />
                      <h2 className="font-sans text-[13px] font-semibold text-text-primary tracking-wide uppercase">Key Statistics</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/20 overflow-hidden h-full">
                      {keyStats.map((item, i) => (
                        <div key={item.label} className="flex flex-col justify-center gap-1.5 p-6 bg-[#0E1520]/60 hover:bg-[#0E1520]/80 transition-colors duration-150">
                          <span className="section-label">{item.label}</span>
                          <span className="value-display text-[24px] font-bold leading-none text-text-primary">{item.value}</span>
                          <span className="font-mono text-[10px] text-text-tertiary mt-0.5">{item.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Collation progress */}
              <CollationProgress summary={activeSummary} />
            </>
          ) : activePage === 'map' ? (
            <>
              {/* Page title bar */}
              <div className="flex items-end justify-between animate-card-entrance" style={{ animationFillMode: 'both' }}>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="section-label">Interactive Map · Osun State</span>
                  </div>
                  <h1 id="page-title" className="font-sans font-bold text-[28px] leading-none tracking-tight text-text-primary">
                    Osun State <span className="text-gradient-green">Ward Map</span>
                  </h1>
                </div>
              </div>

              {/* Divider */}
              <div className="sep-h flex-shrink-0" />

              {/* Ward Map View component */}
              <WardMapView theme={theme} />
            </>
          ) : (
            <div className="panel p-8 text-center text-text-tertiary font-mono text-[12px] animate-card-entrance">
              PAGE "{activePage.toUpperCase()}" IS UNDER DEVELOPMENT
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-auto" style={{ background: 'var(--color-surface)' }}>
          <div className="px-6 py-3.5 flex flex-col md:flex-row justify-between items-center gap-1 text-[10px] text-text-tertiary font-mono">
            <div className="flex items-center gap-3">
              <span className="text-primary font-bold tracking-widest">EVA-1</span>
              <span>·</span>
              <span>© {new Date().getFullYear()} INEC Nigeria</span>
              <span>·</span>
              <span>Transparency in Democracy</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors duration-150">Data Methodology</a>
              <a href="#" className="hover:text-primary transition-colors duration-150">Terms of Use</a>
              <a href="#" className="hover:text-primary transition-colors duration-150">Audit Log</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
