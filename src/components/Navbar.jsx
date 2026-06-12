
const NAV_ITEMS = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
  },
  {
    id: 'map',
    label: 'Map View',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter">
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3ZM9 3v15M15 6v15" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
]

export default function Navbar({ active, setActive, theme, setTheme }) {
  return (
    <aside
      style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 64, zIndex: 2000, background: 'var(--color-bg-sidebar)', borderRight: '1px solid var(--color-border-strong)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {/* Top accent line — matches header's 1px strip exactly */}
      <div style={{ width: '100%', height: 1, background: '#00C896', flexShrink: 0 }} />

      {/* Logo block */}
      <div className="w-full flex flex-col items-center py-5 border-b border-border">
        <div className="w-9 h-9 bg-primary flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 11l3 3L22 4" stroke="#080B0F" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="#080B0F" strokeWidth="2" strokeLinecap="square" />
          </svg>
        </div>
        <span className="text-[8px] font-mono font-bold uppercase tracking-[0.15em] text-primary mt-2 opacity-70">EVA-1</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col items-center gap-0.5 w-full pt-3 px-2">
        {NAV_ITEMS.map(item => {
          const isActive = active === item.id
          return (
            <div key={item.id} className="relative group w-full">
              <button
                onClick={() => setActive(item.id)}
                className={`
                  w-full flex items-center justify-center h-10
                  transition-all duration-150 relative
                  ${isActive
                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                    : 'text-text-tertiary hover:text-text-secondary hover:bg-primary/5 border-l-2 border-transparent'
                  }
                `}
                aria-label={item.label}
              >
                {item.icon}
              </button>
              {/* Tooltip */}
              <div className="sidebar-tooltip absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 panel-raised border border-border-strong text-[11px] font-mono font-medium text-text-primary whitespace-nowrap z-50">
                {item.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[var(--color-surface-raised)]" />
              </div>
            </div>
          )
        })}
      </nav>

      {/* Bottom: Theme Toggle + System status + avatar */}
      <div className="w-full flex flex-col items-center gap-4 border-t border-border py-4 mt-auto">
        
        {/* Theme switcher */}
        <div className="relative group w-full flex justify-center">
          <button
            onClick={() => setTheme(p => p === 'dark' ? 'light' : 'dark')}
            className="w-8 h-8 rounded flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary/10 border border-border transition-all duration-150 bg-surface-raised"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              /* Sun icon for dark mode (to switch to light) */
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              /* Moon icon for light mode (to switch to dark) */
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <div className="sidebar-tooltip absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 panel-raised border border-border-strong text-[11px] font-mono font-medium text-text-primary whitespace-nowrap z-50">
            {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[var(--color-surface-raised)]" />
          </div>
        </div>

        {/* System online indicator */}
        <div className="relative group w-full flex justify-center py-1">
          <span className="flex h-2 w-2 relative cursor-pointer">
            <span className="animate-ping absolute inline-flex h-full w-full bg-success opacity-60" />
            <span className="relative inline-flex h-2 w-2 bg-success animate-live-glow" />
          </span>
          <div className="sidebar-tooltip absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 panel-raised border border-border-strong text-[11px] font-mono font-medium text-text-primary whitespace-nowrap z-50">
            System Online (Live)
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[var(--color-surface-raised)]" />
          </div>
        </div>

        {/* Avatar */}
        <div className="relative group w-full flex justify-center">
          <button className="w-8 h-8 bg-primary/15 border border-border-strong flex items-center justify-center text-primary text-[10px] font-mono font-bold transition-all duration-150 hover:bg-primary/25">
            NG
          </button>
          <div className="sidebar-tooltip absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 panel-raised border border-border-strong text-[11px] font-mono font-medium text-text-primary whitespace-nowrap z-50">
            INEC Admin
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[var(--color-surface-raised)]" />
          </div>
        </div>
      </div>
    </aside>
  )
}
