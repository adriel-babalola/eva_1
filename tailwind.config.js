/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /* ── Core Backgrounds ── */
        bg:              '#080B0F',
        surface:         '#0C1018',
        'surface-raised':'#111820',
        'surface-muted': '#0E1520',
        'surface-active':'#162030',

        /* ── Primary: Command Green ── */
        primary: {
          DEFAULT: '#00C896',
          light:   'rgba(0,200,150,0.10)',
          mid:     '#00A87D',
          dark:    '#008A66',
          glow:    'rgba(0,200,150,0.20)',
          dim:     'rgba(0,200,150,0.06)',
        },

        /* ── Accent: Bright Emerald ── */
        accent: {
          DEFAULT: '#00E5A8',
          light:   'rgba(0,229,168,0.12)',
          muted:   '#00BF8C',
        },

        /* ── Status Colors ── */
        success: '#00C896',
        error:   '#FF3B5C',
        warning: '#F59E0B',
        info:    '#3B82F6',

        /* ── Text ── */
        text: {
          primary:   '#E8F0EC',
          secondary: '#7A9E8E',
          tertiary:  '#3D5A4E',
          inverse:   '#080B0F',
        },

        /* ── Borders ── */
        border: {
          DEFAULT: 'rgba(0,200,150,0.08)',
          strong:  'rgba(0,200,150,0.18)',
          bright:  'rgba(0,200,150,0.35)',
        },

        /* ── Party Colors ── */
        party: {
          apc:  '#3B82F6',
          pdp:  '#00C896',
          lp:   '#FF3B5C',
          nnpp: '#F59E0B',
        },

        /* ── Status Badges ── */
        status: {
          'verified-bg':     'rgba(0,200,150,0.10)',
          'verified-text':   '#00C896',
          'unverified-bg':   'rgba(255,59,92,0.10)',
          'unverified-text': '#FF3B5C',
          'pending-bg':      'rgba(61,90,78,0.20)',
          'pending-text':    '#7A9E8E',
          'progress-bg':     'rgba(59,130,246,0.10)',
          'progress-text':   '#3B82F6',
        },
      },

      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      /* ── Sharp edges: no roundness ── */
      borderRadius: {
        none:    '0px',
        sm:      '2px',
        DEFAULT: '3px',
        lg:      '4px',
        xl:      '4px',
        '2xl':   '4px',
        full:    '9999px',
      },

      boxShadow: {
        card:         '0 1px 4px rgba(0,0,0,0.5), 0 4px 24px rgba(0,0,0,0.3)',
        'card-hover': '0 0 0 1px rgba(0,200,150,0.25), 0 4px 20px rgba(0,200,150,0.08)',
        glow:         '0 0 24px rgba(0,200,150,0.25)',
        'glow-sm':    '0 0 12px rgba(0,200,150,0.18)',
        'glow-xs':    '0 0 6px rgba(0,200,150,0.15)',
        'inner-glow': 'inset 0 1px 0 rgba(0,200,150,0.06)',
        panel:        'inset 0 0 0 1px rgba(0,200,150,0.08)',
      },

      backgroundImage: {
        'gradient-primary':   'linear-gradient(135deg, #00C896, #00E5A8)',
        'gradient-secondary': 'linear-gradient(135deg, #F59E0B, #FBBF24)',
        'gradient-card':      'linear-gradient(135deg, rgba(0,200,150,0.04), rgba(0,229,168,0.01))',
        'gradient-surface':   'linear-gradient(180deg, #0C1018, #080B0F)',
        'scan-line':          'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,200,150,0.015) 2px, rgba(0,200,150,0.015) 4px)',
      },

      animation: {
        'live':           'livePulse 2s ease-in-out infinite',
        'live-glow':      'liveGlow 2s ease-in-out infinite',
        'bar':            'barGrow 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in':        'fadeIn 0.25s ease-out forwards',
        'card-entrance':  'cardEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in':       'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer':        'shimmer 2.5s infinite',
        'glow-pulse':     'glowPulse 3s ease-in-out infinite',
        'scan':           'scanLine 8s linear infinite',
        'blink':          'blink 1.2s step-end infinite',
      },

      keyframes: {
        livePulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.3', transform: 'scale(0.8)' },
        },
        liveGlow: {
          '0%, 100%': { boxShadow: '0 0 4px rgba(0,200,150,0.5)' },
          '50%':      { boxShadow: '0 0 16px rgba(0,200,150,0.9)' },
        },
        barGrow: {
          from: { width: '0%' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(-4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        cardEntrance: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-6px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '1' },
        },
        scanLine: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
