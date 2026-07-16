import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { toPlainText } from '@/editable/cards/PostCards'
import { pagesContent } from '@/editable/content/pages.content'
import { getTaskDisplayLabel, isUiHiddenTask } from '@/editable/content/global.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''

const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}

const summaryOf = (post: SitePost) =>
  toPlainText(
    (typeof post.summary === 'string' && post.summary) ||
    compactRaw(getContent(post).description) ||
    compactRaw(getContent(post).excerpt) ||
    compactRaw(getContent(post).body) ||
    '',
  )

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  // Hidden tasks (curators) never appear in public search results.
  if (isUiHiddenTask(String(derivedTask))) return false
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const derivedTask = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === derivedTask)?.route
  const href = `${taskRoute || `/${derivedTask || 'sbm'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const rawLabel = SITE_CONFIG.tasks.find((item) => item.key === derivedTask)?.label || 'Entry'
  const label = derivedTask ? getTaskDisplayLabel(derivedTask, rawLabel) : rawLabel
  const strong = index % 5 === 0

  return (
    <Link
      href={href}
      className={`group block h-full overflow-hidden rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-1 hover:shadow-[var(--editable-shadow-lift)] ${strong ? 'md:col-span-2' : ''}`}
    >
      {image ? (
        <div className={`relative overflow-hidden bg-[var(--slot4-media-bg)] ${strong ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
          <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <span className="absolute left-4 top-4 rounded-[var(--editable-radius-pill)] bg-[var(--slot4-cream)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)]">
            {label}
          </span>
        </div>
      ) : null}
      <div className="p-6">
        {!image ? (
          <span className="inline-block rounded-[var(--editable-radius-pill)] bg-[var(--slot4-page-text)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-cream)]">
            {label}
          </span>
        ) : null}
        <h2 className="editable-display mt-4 line-clamp-3 text-2xl font-bold leading-[1.1] tracking-[-0.025em] text-[var(--slot4-page-text)]">
          {post.title}
        </h2>
        {summary ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--slot4-muted-text)]">{summary}</p> : null}
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-accent)]">
          Open <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const requestedTask = (resolved.task || '').trim().toLowerCase()
  const task = requestedTask && isUiHiddenTask(requestedTask) ? '' : requestedTask
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const rawPosts = feed?.posts?.length
    ? feed.posts
    : useMaster
      ? []
      : SITE_CONFIG.tasks.filter((item) => item.enabled && !isUiHiddenTask(item.key)).flatMap((item) => getMockPostsForTask(item.key))
  const results = rawPosts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled && !isUiHiddenTask(item.key))
  const footerAdSize = pickRandom(getSlotSizes('footer'))

  return (
    <EditableSiteShell>
      <main>
        <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <EditableReveal>
            <div className="grid gap-8 rounded-[var(--editable-radius-xl)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 shadow-[var(--editable-shadow-soft)] md:grid-cols-[0.85fr_1.15fr] lg:p-10">
              <div>
                <span className="inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] border border-[var(--editable-border)] bg-[var(--slot4-warm)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-page-text)]">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {pagesContent.search.hero.badge}
                </span>
                <h1 className="editable-display mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{pagesContent.search.hero.title}</h1>
                <p className="mt-5 max-w-md text-base leading-[1.65] text-[var(--slot4-muted-text)]">{pagesContent.search.hero.description}</p>
              </div>
              <form action="/search" className="self-end rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-warm)] p-4 sm:p-5">
                <input type="hidden" name="master" value="1" />
                <label className="flex items-center gap-3 rounded-[var(--editable-radius-pill)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3">
                  <Search className="h-5 w-5 shrink-0 text-[var(--slot4-muted-text)]" />
                  <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 rounded-[var(--editable-radius-pill)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-3">
                    <Filter className="h-4 w-4 shrink-0 text-[var(--slot4-muted-text)]" />
                    <input name="category" defaultValue={category} placeholder="Collection" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
                  </label>
                  <select name="task" defaultValue={task} className="rounded-[var(--editable-radius-pill)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-3 text-sm font-semibold text-[var(--slot4-page-text)] outline-none">
                    <option value="">All shelves</option>
                    {enabledTasks.map((item) => (
                      <option key={item.key} value={item.key}>{getTaskDisplayLabel(item.key, item.label)}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[var(--editable-radius-pill)] bg-[var(--slot4-page-text)] px-6 text-sm font-semibold text-[var(--slot4-cream)] transition-transform duration-500 hover:-translate-y-0.5">
                  Search the library <ArrowUpRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </EditableReveal>

          <div className="mt-14 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{results.length} results</p>
              <h2 className="editable-display mt-2 text-3xl font-bold tracking-[-0.025em] sm:text-4xl">{query ? `Results for “${query}”` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/sbm" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-page-text)] hover:opacity-70">
              Browse the library <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {results.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, i) => (
                <EditableReveal key={post.id || post.slug} index={i % 9} step={60}>
                  <SearchResultCard post={post} index={i} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[var(--editable-radius-xl)] border border-dashed border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-16 text-center">
              <p className="editable-display text-2xl font-bold tracking-[-0.025em]">No matching resources.</p>
              <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">Try a different keyword, another collection, or a broader shelf.</p>
            </div>
          )}

          <div className="mt-16">
            <Ads slot="footer" size={footerAdSize} showLabel className="mx-auto w-full" />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
