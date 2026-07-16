import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Per-task theme tokens (--tk-*). The public site only surfaces `sbm` (The
  Library) prominently; other task themes stay defined so the archive/detail
  routes keep rendering, but they inherit the shared premium base.
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif"
const BODY_FONT = "'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#F6F1EA',
  surface: '#FFFFFF',
  raised: '#EFE7DC',
  text: '#0B1E27',
  muted: '#5B6870',
  line: 'rgba(11,30,39,0.10)',
  accent: '#FC6736',
  accentSoft: '#FFEDE4',
  onAccent: '#FFFFFF',
  glow: 'rgba(252,103,54,0.14)',
  radius: '20px',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Notes', note: 'Long reads and companion writing from the library.' },
  listing: { ...base, kicker: 'Directory', note: 'Places worth pinning to a shelf.' },
  classified: { ...base, kicker: 'Notice', note: 'Fresh calls and open briefs from the community.' },
  image: { ...base, kicker: 'Gallery', note: 'Visual references, saved for the record.' },
  sbm: { ...base, kicker: 'The Library', note: 'Curated resources, tools, and links — organised into collections.' },
  pdf: { ...base, kicker: 'Documents', note: 'Downloadable guides, briefs and reports.' },
  profile: { ...base, kicker: 'Curator', note: 'A curator page in the library.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.sbm
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
