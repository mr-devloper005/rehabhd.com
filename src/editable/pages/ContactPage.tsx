'use client'

import { BookMarked, Feather, Library, Mail, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

const lanes = [
  { icon: BookMarked, title: 'Suggest a resource', body: 'Send a link with a line about why it belongs on a shelf. If it holds up, we file it.' },
  { icon: Library, title: 'Propose a collection', body: 'Have a subject the library doesn\'t yet cover? Pitch a shelf and the first entries that would sit on it.' },
  { icon: Feather, title: 'Curator applications', body: 'Interested in tending a shelf? Tell us what you read, what you keep, and how you decide.' },
  { icon: Mail, title: 'Press and partnerships', body: 'Newsletter mentions, editorial collaborations, sponsorship of a shelf — all in this lane.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main>
        <section className="relative overflow-hidden pt-24 sm:pt-28 lg:pt-32">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(252,103,54,0.10),transparent_70%)]" />
          <div className="relative mx-auto grid w-full max-w-[var(--editable-container)] gap-14 px-5 pb-24 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:px-10 lg:pb-32">
            <EditableReveal>
              <span className="inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-page-text)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {pagesContent.contact.eyebrow}
              </span>
              <h1 className="editable-display mt-6 text-5xl font-bold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
                {pagesContent.contact.title}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-[1.65] text-[var(--slot4-muted-text)]">
                {pagesContent.contact.description}
              </p>
              <ul className="mt-10 space-y-4">
                {lanes.map((lane, i) => {
                  const Icon = lane.icon
                  return (
                    <EditableReveal as="li" key={lane.title} index={i} step={70}>
                      <div className="rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5">
                        <div className="flex items-start gap-4">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div>
                            <h2 className="editable-display text-lg font-bold tracking-[-0.02em]">{lane.title}</h2>
                            <p className="mt-1.5 text-sm leading-6 text-[var(--slot4-muted-text)]">{lane.body}</p>
                          </div>
                        </div>
                      </div>
                    </EditableReveal>
                  )
                })}
              </ul>
            </EditableReveal>

            <EditableReveal index={2}>
              <div className="rounded-[var(--editable-radius-xl)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 shadow-[var(--editable-shadow-soft)] sm:p-10">
                <h2 className="editable-display text-2xl font-bold tracking-[-0.02em]">{pagesContent.contact.formTitle}</h2>
                <EditableContactLeadForm />
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
