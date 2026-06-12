export default function LgaStatsSidebar({ ward, stats, onClose }) {
  if (!stats) return null;

  const rows = [
    { label: 'Number of Wards', value: stats.wardCount },
    { label: 'Polling Units', value: stats.pollingUnitCount },
    { label: 'Votes Cast', value: stats.votesCast.toLocaleString('en-NG') },
    { label: 'Accredited Voters', value: stats.accreditedVoters.toLocaleString('en-NG') },
    { label: 'Registered Voters', value: stats.registeredVoters.toLocaleString('en-NG') },
  ];

  return (
    <div className="h-full p-6 flex flex-col gap-6 bg-surface-strong">
      {/* Header section */}
      <div className="flex items-start justify-between">
        <div>
          <span className="section-label">WARD DETAILS</span>
          <h3 className="font-sans font-bold text-[18px] text-text-primary leading-tight mt-1">
            {ward.name}
          </h3>
          <p className="font-mono text-[11px] text-text-tertiary mt-0.5">
            {ward.lga} LGA
          </p>
        </div>
        <button 
          onClick={onClose} 
          className="w-7 h-7 flex items-center justify-center border border-border-strong text-text-tertiary hover:text-primary hover:border-primary/30 transition-all duration-150"
          aria-label="Close details"
        >
          ✕
        </button>
      </div>

      <div className="sep-h flex-shrink-0" />

      {/* Stats section */}
      <div>
        <span className="section-label mb-3 block" style={{ color: '#00C896' }}>LGA AGGREGATE STATISTICS</span>
        <div className="flex flex-col divide-y divide-border/60">
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between items-center py-3">
              <span className="font-sans text-[12.5px] text-text-secondary">{r.label}</span>
              <span className="value-display text-[14px] font-bold text-text-primary tabular-nums">
                {r.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative footer status to match the tech style */}
      <div className="mt-auto pt-4 border-t border-border/40 flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full bg-success opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 bg-success" />
        </span>
        <span className="font-mono text-[9px] text-text-tertiary tracking-wider uppercase">DATA VERIFIED VIA GRID3</span>
      </div>
    </div>
  );
}
