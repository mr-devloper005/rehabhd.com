import Link from 'next/link'
import { ArrowUpRight, Bookmark, Globe } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function toPlainText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
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
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Collection'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

function domainOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const url = (typeof content.website === 'string' && content.website) ||
    (typeof content.url === 'string' && content.url) ||
    (typeof content.link === 'string' && content.link) || ''
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')
}

/* Big feature: dark canvas, oversized title, no date. */
export function EditorialFeatureCard({ post, href, label = 'Featured this week' }: { post: SitePost; href: string; label?: string }) {
  const image = getEditablePostImage(post)
  const domain = domainOf(post)
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden ${dc.surface.dark} ${dc.motion.tilt}`}>
      <div className="relative min-h-[520px] p-8 sm:p-10 lg:min-h-[600px]">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-700 group-hover:scale-105 group-hover:opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,30,39,0.2),rgba(11,30,39,0.85))]" />
        <div className="relative z-10 flex h-full min-h-[460px] flex-col justify-end lg:min-h-[540px]">
          <span className="inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] border border-white/25 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80 w-fit">
            {label}
          </span>
          <h3 className="editable-display mt-6 max-w-3xl text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
            {post.title}
          </h3>
          <p className="mt-5 max-w-2xl text-base leading-[1.75] text-white/70">{getEditableExcerpt(post, 200)}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] bg-[var(--slot4-accent)] px-6 py-3 text-sm font-semibold text-[var(--slot4-on-accent)]">
              Open resource <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
            {domain ? <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">{domain}</span> : null}
          </div>
        </div>
      </div>
    </Link>
  )
}

/* Rail card: reference tilt-card style — cream surface, orange chip, no date. */
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getEditablePostImage(post)
  const category = getEditableCategory(post)
  const domain = domainOf(post)
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.tilt}`}>
      <div className={`${dc.media.frame} ${dc.media.ratioWide}`}>
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
        <span className="absolute left-4 top-4 rounded-[var(--editable-radius-pill)] bg-[var(--slot4-cream)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)]">
          №&nbsp;{String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--slot4-accent)]">{category}</p>
        <h3 className={`editable-display mt-3 line-clamp-2 text-xl font-bold leading-snug tracking-[-0.02em] ${pal.panelText}`}>{post.title}</h3>
        <p className={`mt-3 line-clamp-2 text-sm leading-[1.7] ${pal.mutedText}`}>{getEditableExcerpt(post, 120)}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--slot4-muted-text)]"><Globe className="h-3.5 w-3.5" /> {domain || 'On the library'}</span>
          <ArrowUpRight className="h-4 w-4 text-[var(--slot4-accent)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  )
}

/* Compact index row: no image — for text-dense lists. */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const category = getEditableCategory(post)
  const domain = domainOf(post)
  return (
    <Link href={href} className={`group block min-w-0 ${dc.surface.card} p-6 ${dc.motion.tilt}`}>
      <div className="flex items-start gap-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-sm font-bold text-[var(--slot4-accent)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
            <Bookmark className="h-3.5 w-3.5" /> {category}
          </p>
          <h3 className={`editable-display mt-2.5 line-clamp-2 text-lg font-bold leading-snug tracking-[-0.02em] ${pal.panelText}`}>{post.title}</h3>
          <p className={`mt-2 line-clamp-2 text-sm leading-6 ${pal.mutedText}`}>{getEditableExcerpt(post, 110)}</p>
          {domain ? <p className="mt-3 truncate text-xs font-medium text-[var(--slot4-muted-text)]">{domain}</p> : null}
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--slot4-muted-text)] transition group-hover:text-[var(--slot4-accent)]" />
      </div>
    </Link>
  )
}

/* Horizontal list card with image — long-form archive row. */
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getEditablePostImage(post)
  const category = getEditableCategory(post)
  return (
    <Link href={href} className={`group grid min-w-0 gap-6 overflow-hidden ${dc.surface.card} p-5 ${dc.motion.tilt} sm:grid-cols-[240px_minmax(0,1fr)]`}>
      <div className={`${dc.media.frame} ${dc.media.ratioWide} sm:aspect-auto sm:min-h-[200px]`}>
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="min-w-0 py-2 sm:py-4 sm:pr-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--slot4-accent)]">
          {category} · №&nbsp;{String(index + 1).padStart(2, '0')}
        </p>
        <h2 className={`editable-display mt-3 line-clamp-3 text-2xl font-bold leading-[1.1] tracking-[-0.025em] ${pal.panelText} sm:text-3xl`}>{post.title}</h2>
        <p className={`mt-4 line-clamp-2 text-sm leading-[1.7] ${pal.mutedText}`}>{getEditableExcerpt(post, 180)}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-page-text)]">
          Open resource <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}
