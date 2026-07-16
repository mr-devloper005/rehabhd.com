import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowUpRight, Bookmark, CheckCircle2, Download, ExternalLink, FileText, Globe, Layers,
  Mail, MapPin, Phone, ShieldCheck, Tag, UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { taskThemeStyle } from '@/editable/theme/task-themes'
import { getTaskDisplayLabel, isUiHiddenTask } from '@/editable/content/global.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({
  task,
  params,
}: {
  task: TaskKey
  params: Promise<{ slug?: string; username?: string }>
}) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  // Hidden tasks (e.g. curators) never fetch related — no cross-promotion.
  const related = isUiHiddenTask(task)
    ? []
    : (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar', 'cover'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || ''
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_m, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_m, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_m, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatBody = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')
const tagsOf = (post: SitePost) => {
  const primary = Array.isArray(post.tags) ? post.tags.filter(Boolean) : []
  const content = getContent(post)
  const extra = Array.isArray(content.tags) ? (content.tags as unknown[]).filter((t): t is string => typeof t === 'string') : []
  return Array.from(new Set([...primary, ...extra])).slice(0, 8)
}

export function TaskDetailView({
  task, post, related, comments = [],
}: {
  task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
        {task === 'listing' ? <GenericDetail task={task} post={post} related={related} /> : null}
        {task === 'classified' ? <GenericDetail task={task} post={post} related={related} /> : null}
        {task === 'image' ? <GenericDetail task={task} post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* ============================================================
   BOOKMARK DETAIL — the flagship public detail page.
   No hero image · no date · premium hero band with domain chip
   and Visit CTA · quick-facts strip · body with tag chips ·
   sticky sidebar (resource card + Visit CTA + trust panel) ·
   one sidebar ad · "More from this collection" strip.
   ============================================================ */

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  const domain = website ? cleanDomain(website) : ''
  const category = categoryOf(post, 'Collection')
  const verified = !!getField(post, ['verified', 'trusted']) || !!website
  const tags = tagsOf(post)
  const body = getBody(post)
  const sidebarAdSize = pickRandom(getSlotSizes('sidebar'))
  const collectionHref = `/sbm?category=${encodeURIComponent((getField(post, ['category']) || '').toLowerCase().replace(/\s+/g, '-'))}`

  return (
    <>
      {/* Hero band — orange glow, big display h1, chip + CTA. Never an image. */}
      <section className="relative overflow-hidden border-b border-[var(--tk-line)]">
        <div className="pointer-events-none absolute inset-x-0 -top-32 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--tk-glow),transparent_70%)]" />
        <div className="relative mx-auto w-full max-w-[var(--editable-container)] px-5 pb-16 pt-16 sm:px-8 sm:pt-24 lg:px-10">
          <EditableReveal>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/sbm" className="inline-flex items-center gap-1.5 rounded-[var(--editable-radius-pill)] border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-muted)] transition-colors hover:border-[var(--tk-text)] hover:text-[var(--tk-text)]">
                <Bookmark className="h-3 w-3 text-[var(--tk-accent)]" /> The Library
              </Link>
              <span className="inline-flex items-center rounded-[var(--editable-radius-pill)] bg-[var(--tk-accent-soft)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-accent)]">
                {category}
              </span>
              {domain ? (
                <span className="inline-flex items-center gap-1.5 rounded-[var(--editable-radius-pill)] border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[11px] font-medium text-[var(--tk-muted)]">
                  <Globe className="h-3 w-3 text-[var(--tk-accent)]" /> {domain}
                </span>
              ) : null}
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className="editable-display mt-7 max-w-4xl text-balance text-5xl font-bold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[4.5rem]">
              {post.title}
            </h1>
          </EditableReveal>
          {leadText(post) ? (
            <EditableReveal index={2}>
              <p className="mt-7 max-w-2xl text-xl leading-[1.55] text-[var(--tk-muted)]">
                {leadText(post)}
              </p>
            </EditableReveal>
          ) : null}
          {website ? (
            <EditableReveal index={3}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  href={website}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] bg-[var(--tk-accent)] px-7 py-3.5 text-sm font-semibold text-[var(--tk-on-accent)] transition-transform duration-500 hover:-translate-y-0.5"
                >
                  Visit resource <ExternalLink className="h-4 w-4" />
                </Link>
                <Link
                  href={collectionHref}
                  className="inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] border border-[var(--tk-line)] px-6 py-3.5 text-sm font-semibold text-[var(--tk-text)] transition-colors duration-300 hover:border-[var(--tk-text)] hover:bg-[var(--tk-text)] hover:text-[var(--tk-bg)]"
                >
                  Browse the {category.toLowerCase()} shelf
                </Link>
              </div>
            </EditableReveal>
          ) : null}
        </div>
      </section>

      {/* Quick-facts strip */}
      <section className="border-b border-[var(--tk-line)] bg-[var(--tk-raised)]">
        <div className="mx-auto grid w-full max-w-[var(--editable-container)] grid-cols-1 divide-y divide-[var(--tk-line)] px-5 py-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-10">
          <QuickFact icon={Layers} label="Collection" value={category} />
          <QuickFact icon={Globe} label="Domain" value={domain || 'On the library'} mono />
          <QuickFact icon={ShieldCheck} label="Verified" value={verified ? 'Curator-vetted' : 'Community submission'} />
        </div>
      </section>

      {/* Body + sticky sidebar */}
      <section className="mx-auto grid w-full max-w-[var(--editable-container)] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16 lg:px-10 lg:py-24">
        <article className="min-w-0">
          <EditableReveal>
            {body ? (
              <div
                className="article-content max-w-none text-[1.0625rem] leading-[1.85] text-[var(--tk-text)]"
                dangerouslySetInnerHTML={{ __html: formatBody(body) }}
              />
            ) : (
              <p className="text-lg leading-[1.7] text-[var(--tk-muted)]">
                A short note about this resource will land here as soon as a curator writes one.
              </p>
            )}
          </EditableReveal>

          {tags.length ? (
            <EditableReveal index={1}>
              <div className="mt-14 border-t border-[var(--tk-line)] pt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-muted)]">Filed under</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="inline-flex items-center gap-1.5 rounded-[var(--editable-radius-pill)] border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--tk-text)] transition-colors hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]"
                    >
                      <Tag className="h-3 w-3" /> {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </EditableReveal>
          ) : null}
        </article>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <EditableReveal className="space-y-6">
            {/* Resource card */}
            <div className="overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
              <div className="flex items-center gap-3 border-b border-[var(--tk-line)] p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-[var(--editable-radius-md)] bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
                  <Bookmark className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-muted)]">Resource</p>
                  <p className="editable-display truncate text-sm font-bold">{domain || post.title}</p>
                </div>
              </div>
              <div className="p-5">
                <p className="line-clamp-3 text-sm leading-6 text-[var(--tk-muted)]">
                  {leadText(post) || stripHtml(body).slice(0, 160) || 'Filed on the library shelf. Follow the link to open the source.'}
                </p>
                {website ? (
                  <Link
                    href={website}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[var(--editable-radius-pill)] bg-[var(--tk-accent)] px-5 py-3 text-sm font-semibold text-[var(--tk-on-accent)] transition-transform duration-500 hover:-translate-y-0.5"
                  >
                    Visit resource <ExternalLink className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </div>

            {/* Trust panel */}
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-accent)]">Why it's here</p>
              <ul className="mt-4 grid gap-3 text-sm text-[var(--tk-text)]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" /> Curator-reviewed before it went on the shelf.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" /> Direct link — never a redirect or wrapper.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" /> Kept in the {category} collection.
                </li>
              </ul>
            </div>

            <Ads slot="sidebar" size={sidebarAdSize} showLabel className="w-full" />
          </EditableReveal>
        </aside>
      </section>

      {/* More from this collection */}
      {related.length ? (
        <section className="border-t border-[var(--tk-line)] bg-[var(--tk-raised)] py-20 sm:py-24">
          <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10">
            <EditableReveal>
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--tk-accent)]">Same shelf</span>
                  <h2 className="editable-display mt-3 text-3xl font-bold tracking-[-0.025em] sm:text-4xl">More from this collection</h2>
                </div>
                <Link href={collectionHref} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--tk-text)] hover:opacity-70">
                  Open the shelf <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </EditableReveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item, i) => (
                <EditableReveal key={item.id || item.slug} index={i} step={80}>
                  <RelatedResource post={item} />
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

function QuickFact({ icon: Icon, label, value, mono = false }: { icon: typeof Layers; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-4 px-2 py-4 sm:px-6">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-muted)]">{label}</p>
        <p className={`mt-1 truncate text-sm font-semibold text-[var(--tk-text)] ${mono ? 'font-mono tracking-tight' : ''}`}>{value}</p>
      </div>
    </div>
  )
}

function RelatedResource({ post }: { post: SitePost }) {
  const image = getImages(post)[0]
  const category = categoryOf(post, 'Collection')
  return (
    <Link
      href={`/sbm/${post.slug}`}
      className="group block h-full overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1"
    >
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
          <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        </div>
      ) : null}
      <div className="p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-accent)]">{category}</p>
        <h3 className="editable-display mt-2 line-clamp-2 text-base font-bold leading-snug tracking-[-0.02em] text-[var(--tk-text)]">{post.title}</h3>
      </div>
    </Link>
  )
}

/* ============================================================
   PROFILE DETAIL — direct-URL only, never promoted.
   Identity hero (cover band + overlapping avatar) · name h1
   · role · bio · contact/links rows · their content · identity
   info sidebar. No date, no back-to-archive link, no more-
   profiles strip.
   ============================================================ */

function ProfileDetail({ post }: { post: SitePost }) {
  const images = getImages(post)
  const avatar = images[0]
  const role = getField(post, ['role', 'designation', 'company'])
  const location = getField(post, ['location', 'city', 'country'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const twitter = getField(post, ['twitter', 'x'])
  const linkedin = getField(post, ['linkedin'])
  const github = getField(post, ['github'])
  const body = getBody(post)
  const initials = post.title?.split(/\s+/).map((s) => s.charAt(0)).slice(0, 2).join('').toUpperCase() || 'CU'
  const contentImages = images.slice(1)

  return (
    <>
      {/* Cover band with overlapping avatar */}
      <section className="relative">
        <div className="h-56 w-full bg-[linear-gradient(120deg,var(--tk-text)_0%,#1a3341_60%,var(--tk-accent)_140%)] sm:h-72 lg:h-80" />
        <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10">
          <div className="relative -mt-20 flex flex-col items-start gap-6 sm:-mt-24 sm:flex-row sm:items-end">
            <div className="relative">
              {avatar ? (
                <img src={avatar} alt="" className="h-36 w-36 rounded-full border-4 border-[var(--tk-bg)] object-cover shadow-[var(--editable-shadow-lift)] sm:h-40 sm:w-40" />
              ) : (
                <span className="editable-display flex h-36 w-36 items-center justify-center rounded-full border-4 border-[var(--tk-bg)] bg-[var(--tk-surface)] text-4xl font-bold tracking-[-0.02em] text-[var(--tk-text)] shadow-[var(--editable-shadow-lift)] sm:h-40 sm:w-40">
                  {initials}
                </span>
              )}
              <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--tk-bg)] bg-[var(--tk-accent)] text-[var(--tk-on-accent)]">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>
            <div className="min-w-0 flex-1 pb-2">
              <h1 className="editable-display text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-[var(--tk-text)] sm:text-5xl">
                {post.title}
              </h1>
              {role ? <p className="mt-2 text-base font-medium text-[var(--tk-muted)]">{role}{location ? ` · ${location}` : ''}</p> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[var(--editable-container)] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14 lg:px-10 lg:py-20">
        <article className="min-w-0">
          <EditableReveal>
            {leadText(post) ? (
              <p className="text-xl leading-[1.55] text-[var(--tk-text)]">{leadText(post)}</p>
            ) : null}
            {body ? (
              <div
                className="article-content mt-8 max-w-none text-[1.0625rem] leading-[1.85] text-[var(--tk-text)]"
                dangerouslySetInnerHTML={{ __html: formatBody(body) }}
              />
            ) : null}
          </EditableReveal>

          {/* Their content */}
          {contentImages.length ? (
            <EditableReveal index={1}>
              <section className="mt-16">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--tk-accent)]">Their work</p>
                <h2 className="editable-display mt-3 text-2xl font-bold tracking-[-0.02em] sm:text-3xl">Selected pieces</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {contentImages.slice(0, 6).map((image, i) => (
                    <figure key={`${image}-${i}`} className="overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)]">
                      <img src={image} alt="" className="aspect-[4/3] w-full object-cover" />
                    </figure>
                  ))}
                </div>
              </section>
            </EditableReveal>
          ) : null}
        </article>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <EditableReveal className="space-y-6">
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-muted)]">Identity</p>
              <dl className="mt-4 grid gap-3 text-sm">
                <IdentityRow label="Name" value={post.title} />
                {role ? <IdentityRow label="Role" value={role} /> : null}
                {location ? <IdentityRow label="Based in" value={location} icon={MapPin} /> : null}
              </dl>
            </div>

            {(website || email || phone || twitter || linkedin || github) ? (
              <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-accent)]">Reach out</p>
                <ul className="mt-4 grid gap-2.5 text-sm">
                  {website ? <ContactLink href={website} icon={Globe} label={cleanDomain(website)} external /> : null}
                  {email ? <ContactLink href={`mailto:${email}`} icon={Mail} label={email} /> : null}
                  {phone ? <ContactLink href={`tel:${phone}`} icon={Phone} label={phone} /> : null}
                  {twitter ? <ContactLink href={twitter.startsWith('http') ? twitter : `https://x.com/${twitter.replace(/^@/, '')}`} icon={ExternalLink} label={`X · ${twitter.replace(/^@/, '')}`} external /> : null}
                  {linkedin ? <ContactLink href={linkedin} icon={ExternalLink} label="LinkedIn" external /> : null}
                  {github ? <ContactLink href={github.startsWith('http') ? github : `https://github.com/${github}`} icon={ExternalLink} label={`GitHub · ${github.replace('https://github.com/', '')}`} external /> : null}
                </ul>
              </div>
            ) : null}

            <div className="rounded-[var(--tk-radius)] border border-dashed border-[var(--tk-line)] p-6 text-sm text-[var(--tk-muted)]">
              This page is reached by direct link — the curator's own address on the library.
            </div>
          </EditableReveal>
        </aside>
      </section>
    </>
  )
}

function IdentityRow({ label, value, icon: Icon }: { label: string; value: string; icon?: typeof MapPin }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--tk-line)] pb-3 last:border-b-0 last:pb-0">
      <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">
        {Icon ? <Icon className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> : null} {label}
      </dt>
      <dd className="text-right text-sm font-semibold text-[var(--tk-text)]">{value}</dd>
    </div>
  )
}

function ContactLink({ href, icon: Icon, label, external = false }: { href: string; icon: typeof Globe; label: string; external?: boolean }) {
  return (
    <li>
      <Link
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'nofollow noopener noreferrer' : undefined}
        className="flex items-center justify-between gap-3 rounded-[var(--editable-radius-md)] border border-transparent px-2 py-2 text-[var(--tk-text)] transition-colors hover:border-[var(--tk-line)] hover:bg-[var(--tk-raised)]"
      >
        <span className="inline-flex items-center gap-2 truncate">
          <Icon className="h-4 w-4 text-[var(--tk-accent)]" /> <span className="truncate">{label}</span>
        </span>
        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[var(--tk-muted)]" />
      </Link>
    </li>
  )
}

/* ============================================================
   ARTICLE / PDF / GENERIC — task lanes that aren't enabled in
   the public UI but still need to render if reached by URL.
   All share the same premium, dateless base.
   ============================================================ */

function ArticleDetail({
  post, related, comments,
}: {
  post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const body = getBody(post)
  const tags = tagsOf(post)
  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--tk-accent)]">{categoryOf(post, 'Notes')}</p>
      <h1 className="editable-display mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[3.5rem]">{post.title}</h1>
      {leadText(post) ? <p className="mt-6 text-xl leading-[1.55] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
      <div className="article-content mt-10 max-w-none text-[1.0625rem] leading-[1.85] text-[var(--tk-text)]" dangerouslySetInnerHTML={{ __html: formatBody(body) }} />
      {tags.length ? (
        <div className="mt-12 flex flex-wrap gap-2 border-t border-[var(--tk-line)] pt-6">
          {tags.map((t) => (
            <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="inline-flex items-center gap-1 rounded-[var(--editable-radius-pill)] border border-[var(--tk-line)] px-3 py-1 text-xs text-[var(--tk-muted)] hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]">
              <Tag className="h-3 w-3" /> {t}
            </Link>
          ))}
        </div>
      ) : null}
      <EditableArticleComments slug={post.slug} comments={comments} />
      {related.length ? <RelatedStrip task="article" related={related} /> : null}
    </article>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto grid w-full max-w-[var(--editable-container)] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-10">
      <article className="min-w-0">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-[var(--tk-radius)] bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><FileText className="h-7 w-7" /></span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--tk-accent)]">{categoryOf(post, 'Document')}</p>
            <h1 className="editable-display mt-2 text-3xl font-bold tracking-[-0.025em] sm:text-4xl">{post.title}</h1>
          </div>
        </div>
        <div className="article-content mt-10 max-w-none text-[1.0625rem] leading-[1.85]" dangerouslySetInnerHTML={{ __html: formatBody(getBody(post)) }} />
        {fileUrl ? (
          <iframe src={`${fileUrl}#toolbar=0`} title={post.title} className="mt-10 h-[72vh] w-full rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-raised)]" />
        ) : null}
      </article>
      <aside className="lg:sticky lg:top-28 lg:self-start">
        {fileUrl ? (
          <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
            <p className="text-sm font-semibold">Get the document</p>
            <Link href={fileUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[var(--editable-radius-pill)] bg-[var(--tk-accent)] px-5 py-3 text-sm font-semibold text-[var(--tk-on-accent)]">Download <Download className="h-4 w-4" /></Link>
          </div>
        ) : null}
        {related.length ? <RelatedPanel task="pdf" related={related} /> : null}
      </aside>
    </section>
  )
}

function GenericDetail({ task, post, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const label = getTaskDisplayLabel(task, getTaskConfig(task)?.label || task)
  const website = getField(post, ['website', 'url', 'link'])
  const images = getImages(post)
  return (
    <section className="mx-auto grid w-full max-w-[var(--editable-container)] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-10">
      <article className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--tk-accent)]">{label}</p>
        <h1 className="editable-display mt-4 text-4xl font-bold leading-[1.05] tracking-[-0.025em] sm:text-5xl">{post.title}</h1>
        {leadText(post) ? <p className="mt-6 text-lg leading-[1.65] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
        {images[0] ? <img src={images[0]} alt="" className="mt-10 w-full rounded-[var(--tk-radius)] border border-[var(--tk-line)] object-cover" /> : null}
        <div className="article-content mt-10 max-w-none text-[1.0625rem] leading-[1.85]" dangerouslySetInnerHTML={{ __html: formatBody(getBody(post)) }} />
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] bg-[var(--tk-accent)] px-6 py-3 text-sm font-semibold text-[var(--tk-on-accent)]">
            Open link <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
      </article>
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <RelatedPanel task={task} related={related} />
      </aside>
    </section>
  )
}

function RelatedPanel({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  const label = getTaskDisplayLabel(task, taskConfig?.label || task)
  return (
    <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
      <div className="flex items-center justify-between">
        <h3 className="editable-display text-lg font-bold tracking-[-0.02em]">More {label.toLowerCase()}</h3>
        {taskConfig?.route ? <Link href={taskConfig.route} className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--tk-accent)]">View all</Link> : null}
      </div>
      <ul className="mt-4 grid gap-3">
        {related.map((post) => (
          <li key={post.id || post.slug}>
            <Link href={`${taskConfig?.route || `/${task}`}/${post.slug}`} className="flex items-start gap-3 rounded-[var(--editable-radius-md)] p-2 hover:bg-[var(--tk-raised)]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--editable-radius-sm)] bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
                <UserRound className="h-4 w-4" />
              </span>
              <span className="line-clamp-2 text-sm font-medium leading-snug text-[var(--tk-text)]">{post.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  const label = getTaskDisplayLabel(task, taskConfig?.label || task)
  return (
    <section className="mt-20 border-t border-[var(--tk-line)] pt-10">
      <div className="flex items-center justify-between">
        <h2 className="editable-display text-2xl font-bold tracking-[-0.02em]">More {label.toLowerCase()}</h2>
        {taskConfig?.route ? <Link href={taskConfig.route} className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--tk-accent)]">View all <ArrowUpRight className="h-4 w-4" /></Link> : null}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((post) => (
          <Link key={post.id || post.slug} href={`${taskConfig?.route || `/${task}`}/${post.slug}`} className="group block rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-4 transition-transform duration-500 hover:-translate-y-1">
            <h3 className="editable-display line-clamp-3 text-base font-bold leading-snug tracking-[-0.015em]">{post.title}</h3>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--tk-accent)]">Open <ArrowUpRight className="h-3 w-3" /></span>
          </Link>
        ))}
      </div>
    </section>
  )
}

