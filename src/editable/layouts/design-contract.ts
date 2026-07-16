import type { CSSProperties } from 'react'

/*
  Design contract — the whole site consumes tokens from here. Change values
  in editableRootStyle to re-skin every page. The reference language is a
  warm cream surface, deep-navy ink, orange accent, generous section rhythm,
  pill-shaped buttons, and 20px rounded cards.
*/

export const editableRootStyle = {
  '--slot4-page-bg': '#F6F1EA',
  '--slot4-page-text': '#0B1E27',
  '--slot4-panel-bg': '#FFFFFF',
  '--slot4-surface-bg': '#FFFFFF',
  '--slot4-muted-text': '#5B6870',
  '--slot4-soft-muted-text': '#8A96A0',
  '--slot4-accent': '#FC6736',
  '--slot4-accent-fill': '#FC6736',
  '--slot4-accent-soft': '#FFEDE4',
  '--slot4-on-accent': '#FFFFFF',
  '--slot4-dark-bg': '#0B1E27',
  '--slot4-dark-text': '#F6F1EA',
  '--slot4-media-bg': '#E8E1D4',
  '--slot4-cream': '#F6F1EA',
  '--slot4-warm': '#EFE7DC',
  '--slot4-lavender': '#FFFFFF',
  '--slot4-gray': '#EFE7DC',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#F6F1EA',
  '--editable-page-text': '#0B1E27',
  '--editable-container': '1240px',
  '--editable-border': 'rgba(11,30,39,0.10)',
  '--editable-border-strong': 'rgba(11,30,39,0.18)',
  '--editable-nav-bg': 'rgba(246,241,234,0.72)',
  '--editable-nav-text': '#0B1E27',
  '--editable-nav-active': '#FC6736',
  '--editable-nav-active-text': '#FFFFFF',
  '--editable-cta-bg': '#0B1E27',
  '--editable-cta-text': '#F6F1EA',
  '--editable-search-bg': '#FFFFFF',
  '--editable-footer-bg': '#0B1E27',
  '--editable-footer-text': '#F6F1EA',
  '--editable-radius-sm': '10px',
  '--editable-radius-md': '14px',
  '--editable-radius-lg': '20px',
  '--editable-radius-xl': '28px',
  '--editable-radius-pill': '999px',
  '--editable-shadow-soft': '0 4px 18px rgba(11,30,39,0.06)',
  '--editable-shadow-lift': '0 24px 60px rgba(11,30,39,0.10)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/12',
  shadow: 'shadow-[var(--editable-shadow-soft)]',
  shadowStrong: 'shadow-[var(--editable-shadow-lift)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(11,30,39,0.05),rgba(11,30,39,0.72))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10',
    sectionY: 'py-20 sm:py-24 lg:py-32',
    sectionYTight: 'py-14 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    eyebrow: 'inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]',
    heroTitle: 'editable-display text-[2.6rem] font-bold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[4.5rem]',
    sectionTitle: 'editable-display text-3xl font-bold leading-[1.05] tracking-[-0.025em] sm:text-4xl lg:text-5xl',
    body: 'text-base leading-[1.75] text-[var(--slot4-muted-text)]',
  },
  surface: {
    card: `rounded-[var(--editable-radius-lg)] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    soft: `rounded-[var(--editable-radius-lg)] border ${editablePalette.border} bg-[var(--slot4-warm)]`,
    dark: `rounded-[var(--editable-radius-lg)] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: 'group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[var(--editable-radius-pill)] bg-[var(--slot4-page-text)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-cream)] transition-transform duration-500 hover:-translate-y-0.5',
    secondary: 'inline-flex items-center justify-center gap-2 rounded-[var(--editable-radius-pill)] border border-[var(--editable-border-strong)] bg-transparent px-7 py-3.5 text-sm font-semibold text-[var(--slot4-page-text)] transition-colors duration-300 hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-cream)]',
    accent: 'inline-flex items-center justify-center gap-2 rounded-[var(--editable-radius-pill)] bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition-transform duration-500 hover:-translate-y-0.5',
    ghost: 'inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-page-text)] transition-opacity duration-300 hover:opacity-70',
  },
  media: {
    frame: `relative overflow-hidden rounded-[var(--editable-radius-lg)] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/5]',
    ratioWide: 'aspect-[16/10]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1',
    fade: 'transition duration-300 hover:opacity-70',
    tilt: 'transition duration-500 hover:-translate-y-1 hover:shadow-[var(--editable-shadow-lift)]',
  },
} as const

export const aiLayoutRules = [
  'Change site colors via editableRootStyle in this file — every page inherits from those CSS variables.',
  'Keep the reference rhythm: generous section padding (py-24+), pill buttons, 20px card radius, warm cream surface + navy ink + orange accent.',
  'Never hardcode reference colors or fonts in JSX. Consume tokens (--slot4-*, --tk-*, --editable-*) only.',
  'Wrap sections in <EditableReveal> so entry motion cascades across the page.',
  'Preserve data-fetching calls and prop shapes — only the JSX/classNames/copy are editable.',
] as const
