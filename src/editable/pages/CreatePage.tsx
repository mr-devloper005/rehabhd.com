'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Bookmark, CheckCircle2, Layers, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { getTaskDisplayLabel, isUiHiddenTask } from '@/editable/content/global.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass =
  'w-full rounded-[var(--editable-radius-md)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-page-text)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled && !isUiHiddenTask(task.key)),
    [],
  )
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'sbm') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]
  const activeLabel = activeTask ? getTaskDisplayLabel(activeTask.key, activeTask.label) : 'entry'

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorised',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle(''); setCategory(''); setSummary(''); setUrl(''); setImage(''); setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main>
          <section className="mx-auto grid w-full max-w-[var(--editable-container)] gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-10 lg:py-32">
            <EditableReveal>
              <div className="flex aspect-[4/3] items-center justify-center rounded-[var(--editable-radius-xl)] bg-[var(--slot4-page-text)] text-[var(--slot4-cream)]">
                <Lock className="h-20 w-20 opacity-70" />
              </div>
            </EditableReveal>
            <EditableReveal index={1}>
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.create.locked.badge}</span>
              <h1 className="editable-display mt-5 text-5xl font-bold leading-[1.02] tracking-[-0.035em] sm:text-6xl">{pagesContent.create.locked.title}</h1>
              <p className="mt-6 max-w-lg text-lg leading-[1.65] text-[var(--slot4-muted-text)]">{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] bg-[var(--slot4-page-text)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-cream)] transition-transform duration-500 hover:-translate-y-0.5">
                  Sign in <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] border border-[var(--editable-border-strong)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-page-text)] hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-cream)]">
                  Join the library
                </Link>
              </div>
            </EditableReveal>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main>
        <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <EditableReveal as="aside">
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.create.hero.badge}</span>
              <h1 className="editable-display mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{pagesContent.create.hero.title}</h1>
              <p className="mt-6 max-w-md text-base leading-[1.7] text-[var(--slot4-muted-text)]">{pagesContent.create.hero.description}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {enabledTasks.map((item) => {
                  const active = item.key === task
                  const label = getTaskDisplayLabel(item.key, item.label)
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTask(item.key)}
                      className={`rounded-[var(--editable-radius-lg)] border p-4 text-left transition-colors duration-300 ${
                        active
                          ? 'border-transparent bg-[var(--slot4-page-text)] text-[var(--slot4-cream)]'
                          : 'border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-page-text)] hover:border-[var(--slot4-page-text)]'
                      }`}
                    >
                      <span className={`flex h-9 w-9 items-center justify-center rounded-[var(--editable-radius-sm)] ${active ? 'bg-[var(--slot4-accent)] text-[var(--slot4-on-accent)]' : 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]'}`}>
                        {item.key === 'sbm' ? <Bookmark className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
                      </span>
                      <span className="editable-display mt-4 block text-base font-bold tracking-[-0.02em]">{label}</span>
                      <span className="mt-1 block text-xs leading-5 opacity-70">{item.description}</span>
                    </button>
                  )
                })}
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <form onSubmit={submit} className="rounded-[var(--editable-radius-xl)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 shadow-[var(--editable-shadow-soft)] sm:p-9">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-accent)]">File {activeLabel.toLowerCase()}</p>
                    <h2 className="editable-display mt-1 text-2xl font-bold tracking-[-0.02em]">{pagesContent.create.formTitle}</h2>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] bg-[var(--slot4-warm)] px-4 py-2 text-xs font-semibold text-[var(--slot4-page-text)]">
                    <span className="flex h-2 w-2 rounded-full bg-[var(--slot4-accent)]" /> {session.name}
                  </span>
                </div>

                <div className="mt-6 grid gap-4">
                  <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resource title" required />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input className={fieldClass} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Collection (e.g. technology)" />
                    <input className={fieldClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Source URL (https://…)" />
                  </div>
                  <input className={fieldClass} value={image} onChange={(e) => setImage(e.target.value)} placeholder="Cover image URL (optional)" />
                  <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short summary — why this belongs on the shelf" required />
                  <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Curator notes, context, quotes" required />
                </div>

                {created ? (
                  <div className="mt-5 flex items-start gap-3 rounded-[var(--editable-radius-md)] border border-[var(--slot4-accent-soft)] bg-[var(--slot4-accent-soft)] p-4 text-[var(--slot4-page-text)]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--slot4-accent)]" />
                    <div>
                      <p className="text-sm font-semibold">{pagesContent.create.successTitle}</p>
                      <p className="mt-0.5 text-sm text-[var(--slot4-muted-text)]">{created.title}</p>
                    </div>
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[var(--editable-radius-pill)] bg-[var(--slot4-page-text)] px-6 text-sm font-semibold text-[var(--slot4-cream)] transition-transform duration-500 hover:-translate-y-0.5"
                >
                  <Send className="h-4 w-4" /> {pagesContent.create.submitLabel} <ArrowUpRight className="h-4 w-4" />
                </button>
              </form>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
