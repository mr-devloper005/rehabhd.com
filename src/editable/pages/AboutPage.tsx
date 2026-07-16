import Link from 'next/link'
import { ArrowUpRight, BookMarked, Compass, Feather, Library } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

const chapters = [
  { icon: Library, title: 'A library, not a feed', body: 'Every resource earns a shelf. Nothing infinite-scroll, nothing throwaway.' },
  { icon: BookMarked, title: 'Curated by hand', body: 'The collections are shaped, edited and pruned by curators who read what they file.' },
  { icon: Compass, title: 'Made to be walked', body: 'Move between subjects the way you actually browse — one shelf to the next.' },
  { icon: Feather, title: 'Kept, not consumed', body: 'Built for readers who want to return to something later, not just keep scrolling.' },
]

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main>
        <section className="relative overflow-hidden pt-24 sm:pt-28 lg:pt-32">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(252,103,54,0.10),transparent_70%)]" />
          <div className="relative mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10">
            <EditableReveal>
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.about.badge}</span>
              <h1 className="editable-display mt-5 max-w-4xl text-balance text-5xl font-bold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[4.5rem]">
                About {SITE_CONFIG.name}
              </h1>
            </EditableReveal>
            <EditableReveal index={1}>
              <p className="mt-8 max-w-2xl text-xl leading-[1.55] text-[var(--slot4-muted-text)]">
                {pagesContent.about.description}
              </p>
            </EditableReveal>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-[var(--editable-container)] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-32">
          <EditableReveal>
            <div className="space-y-6 text-lg leading-[1.75] text-[var(--slot4-muted-text)]">
              {pagesContent.about.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/sbm" className="inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] bg-[var(--slot4-page-text)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-cream)] transition-transform duration-500 hover:-translate-y-0.5">
                Enter the library <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] border border-[var(--editable-border-strong)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-page-text)] transition-colors hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-cream)]">
                Talk to a curator
              </Link>
            </div>
          </EditableReveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {chapters.map((c, i) => {
              const Icon = c.icon
              return (
                <EditableReveal key={c.title} index={i} step={70}>
                  <div className="h-full rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]"><Icon className="h-5 w-5" /></span>
                    <h2 className="editable-display mt-5 text-xl font-bold tracking-[-0.02em]">{c.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-[var(--slot4-muted-text)]">{c.body}</p>
                  </div>
                </EditableReveal>
              )
            })}
            {pagesContent.about.values.map((v, i) => (
              <EditableReveal key={v.title} index={i + chapters.length} step={70}>
                <div className="h-full rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-warm)] p-6">
                  <h2 className="editable-display text-xl font-bold tracking-[-0.02em]">{v.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--slot4-muted-text)]">{v.description}</p>
                </div>
              </EditableReveal>
            ))}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
