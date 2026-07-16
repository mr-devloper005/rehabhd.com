import { Fragment } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Bookmark, ChevronDown, Globe, Layers, Sparkles } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { getTaskDisplayLabel, isUiHiddenTask } from '@/editable/content/global.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback

const stripHtml = (value: string) => value
  .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&quot;/gi, '"')
  .replace(/&#0?39;|&apos;/gi, "'")
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return (
    <TaskArchiveView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath || taskConfig?.route || `/${task}`}
    />
  )
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  if (isUiHiddenTask(task)) {
    return (
      <HiddenTaskShell task={task} posts={posts} basePath={basePath} pagination={pagination} category={category} />
    )
  }
  return (
    <LibraryShelfView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath}
    />
  )
}

/* ----------------------------------------------------------------
   Premium SBM shelf — the archive layout the whole library uses.
   ---------------------------------------------------------------- */

function LibraryShelfView({
  task, posts, pagination, category, basePath,
}: {
  task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string
}) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const label = getTaskDisplayLabel(task, taskConfig?.label || task)
  const categoryLabel = category === 'all' ? 'All collections' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const totalCount = typeof pagination.total === 'number' ? pagination.total : posts.length
  const highlightCollections = CATEGORY_OPTIONS.slice(0, 10)

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        <header className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 -top-40 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--tk-glow),transparent_70%)]" />
          <div className={`relative mx-auto w-full max-w-[var(--editable-container)] px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-24 lg:px-10`}>
            <EditableReveal>
              <span className="inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] border border-[var(--tk-line)] bg-[var(--tk-surface)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--tk-text)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {theme.kicker}
              </span>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-6 max-w-4xl text-balance text-5xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[4.5rem]">
                {voice?.headline || `Browse ${label}`}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="mt-6 max-w-2xl text-lg leading-[1.7] text-[var(--tk-muted)]">
                {voice?.description || theme.note}
              </p>
            </EditableReveal>

            <EditableReveal index={3}>
              <div className="mt-10 flex flex-wrap items-center gap-2">
                <Link
                  href={basePath}
                  className={`inline-flex items-center gap-1.5 rounded-[var(--editable-radius-pill)] border px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition-colors duration-300 ${
                    category === 'all'
                      ? 'border-[var(--tk-text)] bg-[var(--tk-text)] text-[var(--tk-bg)]'
                      : 'border-[var(--tk-line)] text-[var(--tk-muted)] hover:border-[var(--tk-text)] hover:text-[var(--tk-text)]'
                  }`}
                >
                  All collections
                </Link>
                {highlightCollections.map((c) => {
                  const active = c.slug === category
                  return (
                    <Link
                      key={c.slug}
                      href={`${basePath}?category=${c.slug}`}
                      className={`inline-flex items-center gap-1.5 rounded-[var(--editable-radius-pill)] border px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition-colors duration-300 ${
                        active
                          ? 'border-[var(--tk-accent)] bg-[var(--tk-accent)] text-[var(--tk-on-accent)]'
                          : 'border-[var(--tk-line)] text-[var(--tk-muted)] hover:border-[var(--tk-text)] hover:text-[var(--tk-text)]'
                      }`}
                    >
                      {c.name}
                    </Link>
                  )
                })}
              </div>
            </EditableReveal>

            <div className="mt-12 flex flex-col gap-4 border-t border-[var(--tk-line)] pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--tk-muted)]">
                <span className="editable-display text-lg font-bold text-[var(--tk-text)]">{totalCount}</span>{' '}
                {totalCount === 1 ? 'resource' : 'resources'} · {categoryLabel} · Page {page}
                {pagination.totalPages ? ` of ${pagination.totalPages}` : ''}
              </p>
              <form action={basePath} className="flex items-center gap-2.5">
                <div className="relative">
                  <select
                    name="category"
                    defaultValue={category}
                    className="h-11 appearance-none rounded-[var(--editable-radius-pill)] border border-[var(--tk-line)] bg-[var(--tk-surface)] pl-5 pr-10 text-sm font-medium text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-accent)]"
                    aria-label={voice?.filterLabel || 'Filter collection'}
                  >
                    <option value="all">All collections</option>
                    {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                </div>
                <button className="inline-flex h-11 items-center rounded-[var(--editable-radius-pill)] bg-[var(--tk-accent)] px-5 text-sm font-semibold text-[var(--tk-on-accent)] transition-transform duration-500 hover:-translate-y-0.5">
                  Filter
                </button>
              </form>
            </div>
          </div>
        </header>

        <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 pb-24 sm:px-8 sm:pb-28 lg:px-10 lg:pb-32">
          {posts.length ? (
            <ShelfGrid posts={posts} basePath={basePath} />
          ) : (
            <EmptyShelf label={label} />
          )}

          {posts.length ? (
            <nav className="mt-16 flex items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? (
                <Link href={pageHref(basePath, category, page - 1)} className="rounded-[var(--editable-radius-pill)] border border-[var(--tk-line)] px-5 py-2.5 font-semibold transition hover:border-[var(--tk-text)]">
                  ← Previous
                </Link>
              ) : null}
              <span className="rounded-[var(--editable-radius-pill)] border border-[var(--tk-line)] bg-[var(--tk-surface)] px-5 py-2.5 font-medium text-[var(--tk-muted)]">
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link href={pageHref(basePath, category, page + 1)} className="rounded-[var(--editable-radius-pill)] border border-[var(--tk-line)] px-5 py-2.5 font-semibold transition hover:border-[var(--tk-text)]">
                  Next →
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ShelfGrid({ posts, basePath }: { posts: SitePost[]; basePath: string }) {
  const adAfter = Math.min(6, Math.max(3, Math.floor(posts.length / 3)))
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, i) => (
        <Fragment key={post.id || post.slug || `p-${i}`}>
          <EditableReveal index={i % 6} step={70}>
            <BookmarkShelfCard post={post} href={`${basePath}/${post.slug}`} index={i} />
          </EditableReveal>
          {i === adAfter ? (
            <EditableReveal className="md:col-span-2 lg:col-span-3">
              <Ads slot="in-feed" size={pickRandom(getSlotSizes('in-feed'))} showLabel className="mx-auto w-full" />
            </EditableReveal>
          ) : null}
        </Fragment>
      ))}
    </div>
  )
}

function BookmarkShelfCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  const domain = website ? cleanDomain(website) : ''
  const image = getImage(post)
  const category = getCategory(post, 'Collection')
  const isTextOnly = image === placeholder
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1 hover:shadow-[var(--editable-shadow-lift)]"
    >
      {!isTextOnly ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
          <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <span className="absolute left-4 top-4 rounded-[var(--editable-radius-pill)] bg-[var(--tk-bg)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-text)]">
            {category}
          </span>
          <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--tk-bg)] text-[var(--tk-text)]">
            <Bookmark className="h-4 w-4" />
          </span>
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        {isTextOnly ? (
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-[var(--editable-radius-pill)] bg-[var(--tk-accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-accent)]">
              {category}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--tk-muted)]">№&nbsp;{String(index + 1).padStart(3, '0')}</span>
          </div>
        ) : null}
        <h2 className="editable-display line-clamp-2 text-xl font-bold leading-snug tracking-[-0.02em] text-[var(--tk-text)] group-hover:text-[var(--tk-accent)]">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
        <div className="mt-5 flex items-center justify-between border-t border-[var(--tk-line)] pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--tk-muted)]">
            <Globe className="h-3.5 w-3.5" /> {domain || 'library'}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--tk-accent)]">
            Open <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function EmptyShelf({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-xl rounded-[var(--tk-radius)] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] px-8 py-20 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
        <Layers className="h-6 w-6" />
      </span>
      <h2 className="editable-display mt-6 text-2xl font-bold tracking-[-0.02em]">This shelf is quiet — for now.</h2>
      <p className="mt-3 text-sm leading-6 text-[var(--tk-muted)]">
        Nothing has landed here yet. Try another collection, or check back after the curators file new {label.toLowerCase()}.
      </p>
      <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] bg-[var(--tk-text)] px-5 py-2.5 text-sm font-semibold text-[var(--tk-bg)]">
        Back to the library
      </Link>
    </div>
  )
}

/* ----------------------------------------------------------------
   Hidden task (curators) — no promo styling. Direct URL only.
   ---------------------------------------------------------------- */

function HiddenTaskShell({
  task, posts, basePath, pagination, category,
}: {
  task: TaskKey; posts: SitePost[]; basePath: string; pagination: SiteFeedPagination; category: string
}) {
  const page = pagination.page || 1
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        <section className="mx-auto w-full max-w-3xl px-5 py-24 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--tk-muted)]">Private index</p>
          <h1 className="editable-display mt-4 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
            An internal index — reached by direct link only.
          </h1>
          <p className="mt-4 text-sm leading-6 text-[var(--tk-muted)]">
            This surface exists so bookmarked pages keep resolving. It isn't part of the public library. Return
            to <Link href="/" className="text-[var(--tk-accent)] underline">the library home</Link>.
          </p>
          {posts.length ? (
            <ul className="mt-10 divide-y divide-[var(--tk-line)] rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`${basePath}/${post.slug}`} className="flex items-center justify-between gap-4 p-4 text-sm hover:bg-[var(--tk-raised)]">
                    <span className="truncate">{post.title}</span>
                    <ArrowUpRight className="h-4 w-4 text-[var(--tk-muted)]" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 text-sm text-[var(--tk-muted)]">Empty.</p>
          )}
          {pagination.totalPages && pagination.totalPages > 1 ? (
            <p className="mt-6 text-xs text-[var(--tk-muted)]">Page {page} of {pagination.totalPages} · Category {category}</p>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}
