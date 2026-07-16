import Link from 'next/link'
import { ArrowUpRight, BookMarked, Bookmark, Check, Globe, Layers, Library, Sparkles } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { pagesContent } from '@/editable/content/pages.content'
import { globalContent, getTaskDisplayLabel } from '@/editable/content/global.content'
import { getEditablePostImage, postHref, toPlainText } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10'

function excerpt(post?: SitePost | null, limit = 130) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) || ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}…` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Collection'
}

function domainOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const url = (typeof content.website === 'string' && content.website) ||
    (typeof content.url === 'string' && content.url) ||
    (typeof content.link === 'string' && content.link) || ''
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')
}

function dedupe(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function labelFor(task: TaskKey) {
  const enabled = SITE_CONFIG.tasks.find((t) => t.key === task)
  return getTaskDisplayLabel(task, enabled?.label || String(task))
}

/* ==============================================================
   1. HERO — eyebrow · display title · subtitle · dual CTA ·
      tilted resource-card visual · stats strip from real data.
   ============================================================== */

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupe([...posts, ...timeSections.flatMap((s) => s.posts)])
  const visualPosts = pool.slice(0, 4)
  const heroTitle = pagesContent.home.hero.title?.join(' ') || 'The library, made for the internet you love.'
  const stats = [
    { value: String(pool.length || 0).padStart(3, '0'), label: 'Resources catalogued' },
    { value: String(new Set(pool.map((p) => categoryOf(p))).size || 0).padStart(2, '0'), label: 'Living collections' },
    { value: String(timeSections.reduce((sum, s) => sum + s.posts.length, 0) || pool.length).padStart(3, '0'), label: 'Added this month' },
  ]

  return (
    <section className="relative overflow-hidden bg-[var(--slot4-page-bg)] pt-12 sm:pt-20 lg:pt-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(252,103,54,0.10),transparent_70%)]" />
      <div className={`relative grid gap-14 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-32 ${container}`}>
        <div className="max-w-2xl">
          <EditableReveal index={0}>
            <span className="inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-page-text)]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {pagesContent.home.hero.badge || 'Now open · Public library'}
            </span>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className="editable-display mt-7 text-balance text-5xl font-bold leading-[1.02] tracking-[-0.035em] text-[var(--slot4-page-text)] sm:text-6xl lg:text-[4.5rem]">
              {heroTitle}
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mt-7 max-w-xl text-lg leading-[1.65] text-[var(--slot4-muted-text)]">
              {pagesContent.home.hero.description}
            </p>
          </EditableReveal>
          <EditableReveal index={3}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href={primaryRoute}
                className="inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] bg-[var(--slot4-page-text)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-cream)] transition-transform duration-500 hover:-translate-y-0.5"
              >
                Enter {labelFor(primaryTask).toLowerCase()} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] border border-[var(--editable-border-strong)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-page-text)] transition-colors duration-300 hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-cream)]"
              >
                Suggest a resource
              </Link>
            </div>
          </EditableReveal>
          <EditableReveal index={4}>
            <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-[var(--editable-border)] pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="editable-display text-3xl font-bold tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-4xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-[var(--slot4-muted-text)]">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </EditableReveal>
        </div>

        <EditableReveal index={2} className="relative">
          <HeroCollage posts={visualPosts} primaryTask={primaryTask} primaryRoute={primaryRoute} />
        </EditableReveal>
      </div>
    </section>
  )
}

function HeroCollage({ posts, primaryTask, primaryRoute }: { posts: SitePost[]; primaryTask: TaskKey; primaryRoute: string }) {
  const placeholderTitles = ['A resource worth returning to', 'Filed on the collection', 'From the library shelves', 'Curator pick of the week']
  const pad: SitePost[] = placeholderTitles.map((title, i) => ({
    id: `hero-pad-${i}`,
    slug: '',
    title,
    summary: '',
    content: { category: 'Library' },
    media: [],
    tags: [],
  } as unknown as SitePost))
  const list = [...posts, ...pad].slice(0, 4)
  return (
    <div className="relative mx-auto aspect-[10/11] w-full max-w-[560px]">
      <div className="absolute inset-0 rounded-[36px] bg-[radial-gradient(80%_60%_at_50%_50%,rgba(252,103,54,0.14),transparent_70%)]" />
      {list.map((post, i) => {
        const rotate = [-5, 4, -2, 6][i]
        const offsetX = [8, -8, 12, -14][i]
        const offsetY = [4, 20, 40, 58][i]
        const z = 4 - i
        const image = getEditablePostImage(post)
        const href = post.slug ? postHref(primaryTask, post, primaryRoute) : primaryRoute
        return (
          <Link
            key={post.slug || `pad-${i}`}
            href={href}
            className="absolute overflow-hidden rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] shadow-[0_24px_60px_rgba(11,30,39,0.15)] transition duration-700 hover:-translate-y-1"
            style={{
              inset: `${offsetY}px ${-offsetX}px auto ${offsetX}px`,
              transform: `rotate(${rotate}deg)`,
              width: 'min(78%, 420px)',
              zIndex: z,
            }}
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
              <img src={image} alt="" className="h-full w-full object-cover" />
              <span className="absolute left-3 top-3 rounded-[var(--editable-radius-pill)] bg-[var(--slot4-cream)] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)]">
                {categoryOf(post)}
              </span>
            </div>
            <div className="flex items-center gap-3 p-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                <Bookmark className="h-4 w-4" />
              </span>
              <span className="line-clamp-1 flex-1 text-sm font-semibold text-[var(--slot4-page-text)]">{post.title || 'A resource worth returning to'}</span>
              <ArrowUpRight className="h-4 w-4 text-[var(--slot4-muted-text)]" />
            </div>
          </Link>
        )
      })}
    </div>
  )
}

/* ==============================================================
   2. STORY RAIL — collections marquee + alternating checkmark
      features. This is where the site's promise is spelled out.
   ============================================================== */

const HERO_COLLECTION_SLUGS = [
  'business', 'technology', 'health', 'travel', 'finance', 'education',
  'lifestyle', 'entertainment', 'arts', 'food', 'shopping', 'service',
]

const featureBlocks = [
  {
    icon: Library,
    eyebrow: 'A library, not a feed',
    title: 'Every resource earns its place on a shelf.',
    body: 'We keep the internet worth returning to — organised, tagged, and always one click from a real page. Nothing algorithmic, nothing throwaway.',
    checks: ['Editorial curation, human-first', 'Hairline categorisation across 40+ collections', 'Direct links — never redirects'],
    art: 'left',
  },
  {
    icon: Layers,
    eyebrow: 'Collections that behave like shelves',
    title: 'Move between subjects the way you actually browse.',
    body: 'Each collection groups sites, essays, tools and references so a single trail can carry you from a first idea to a hundred good sources.',
    checks: ['Cross-linked topics', 'Curator notes on why each resource is here', 'Fresh finds surfaced weekly'],
    art: 'right',
  },
  {
    icon: BookMarked,
    eyebrow: 'Built for keeping, not scrolling',
    title: 'Save what you love, revisit when it matters.',
    body: 'Sign in to build your own shelves, or just drop by and browse ours. Either way the library holds — no infinite scroll, no rot.',
    checks: ['Private and shared shelves', 'Weekly digest of new arrivals', 'Search across every collection'],
    art: 'left',
  },
]

export function EditableStoryRail({ primaryRoute }: HomeSectionProps) {
  const collections = HERO_COLLECTION_SLUGS
    .map((slug) => CATEGORY_OPTIONS.find((c) => c.slug === slug))
    .filter(Boolean) as Array<{ slug: string; name: string }>
  const rail = [...collections, ...collections]

  return (
    <>
      <section className="border-y border-[var(--editable-border)] bg-[var(--slot4-warm)]">
        <div className="editable-marquee py-10 sm:py-12" role="marquee">
          <div className="editable-marquee-track flex w-max gap-4">
            {rail.map((c, i) => (
              <Link
                key={`${c.slug}-${i}`}
                href={`${primaryRoute}?category=${c.slug}`}
                className="group inline-flex items-center gap-3 rounded-[var(--editable-radius-pill)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-6 py-3 text-lg font-semibold text-[var(--slot4-page-text)] transition-colors duration-300 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-cream)]"
              >
                <span className="editable-display tracking-[-0.02em]">{c.name}</span>
                <ArrowUpRight className="h-4 w-4 text-[var(--slot4-accent)] transition group-hover:text-[var(--slot4-cream)]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-28 lg:py-32">
        <div className={container}>
          <EditableReveal className="max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Why the library</span>
            <h2 className="editable-display mt-4 text-4xl font-bold leading-[1.05] tracking-[-0.025em] sm:text-5xl">
              Not another feed. A place the internet gets kept.
            </h2>
          </EditableReveal>
          <div className="mt-16 space-y-24">
            {featureBlocks.map((block, index) => (
              <EditableReveal key={block.title} index={index}>
                <FeatureRow block={block} />
              </EditableReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function FeatureRow({ block }: { block: typeof featureBlocks[number] }) {
  const Icon = block.icon
  const artOnLeft = block.art === 'left'
  return (
    <div className={`grid gap-10 lg:grid-cols-2 lg:items-center ${artOnLeft ? '' : 'lg:[&>*:first-child]:order-2'}`}>
      <div className="relative aspect-[5/4] overflow-hidden rounded-[var(--editable-radius-xl)] bg-[var(--slot4-warm)]">
        <div className="absolute inset-0 grid grid-cols-3 gap-3 p-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-[var(--editable-radius-md)] bg-[var(--slot4-surface-bg)] shadow-[var(--editable-shadow-soft)]" style={{ opacity: 0.55 + (i % 3) * 0.15 }} />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--slot4-page-text)] text-[var(--slot4-cream)]">
            <Icon className="h-10 w-10" />
          </span>
        </div>
      </div>
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{block.eyebrow}</span>
        <h3 className="editable-display mt-4 text-3xl font-bold leading-[1.1] tracking-[-0.025em] sm:text-4xl">{block.title}</h3>
        <p className="mt-5 text-lg leading-[1.7] text-[var(--slot4-muted-text)]">{block.body}</p>
        <ul className="mt-7 space-y-3">
          {block.checks.map((check) => (
            <li key={check} className="flex items-start gap-3 text-[15px] leading-6 text-[var(--slot4-page-text)]">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent)] text-[var(--slot4-on-accent)]">
                <Check className="h-3.5 w-3.5" />
              </span>
              {check}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ==============================================================
   3. MAGAZINE SPLIT — big featured resource + collections grid
      (real categories rendered as premium tiles).
   ============================================================== */

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupe([...posts, ...timeSections.flatMap((s) => s.posts)])
  const featured = pool[0]
  const supporting = pool.slice(1, 4)
  const collections = HERO_COLLECTION_SLUGS.slice(0, 8)
    .map((slug) => CATEGORY_OPTIONS.find((c) => c.slug === slug))
    .filter(Boolean) as Array<{ slug: string; name: string }>

  return (
    <section className="bg-[var(--slot4-page-text)] py-24 text-[var(--slot4-cream)] sm:py-28 lg:py-32">
      <div className={container}>
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <EditableReveal>
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Featured this week</span>
            <h2 className="editable-display mt-4 text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-[var(--slot4-cream)] sm:text-5xl">
              A resource the curators keep coming back to.
            </h2>
          </EditableReveal>
          <EditableReveal index={1}>
            <p className="text-base leading-[1.7] text-white/65 md:text-right">
              Pulled straight from the freshest additions — updated whenever something worth a shelf lands in the library.
            </p>
          </EditableReveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {featured ? (
            <EditableReveal index={2}>
              <Link
                href={postHref(primaryTask, featured, primaryRoute)}
                className="group relative block h-full overflow-hidden rounded-[var(--editable-radius-xl)] border border-white/10 bg-[var(--slot4-page-text)]"
              >
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img src={getEditablePostImage(featured)} alt="" className="h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-90" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(11,30,39,0.85))]" />
                  <span className="absolute left-6 top-6 rounded-[var(--editable-radius-pill)] bg-[var(--slot4-cream)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)]">
                    {categoryOf(featured)}
                  </span>
                </div>
                <div className="p-8 sm:p-10">
                  <h3 className="editable-display text-3xl font-bold leading-[1.1] tracking-[-0.025em] text-[var(--slot4-cream)] sm:text-4xl">
                    {featured.title}
                  </h3>
                  <p className="mt-4 line-clamp-3 max-w-2xl text-base leading-[1.7] text-white/70">{excerpt(featured, 220)}</p>
                  <div className="mt-6 flex items-center gap-4">
                    <span className="inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] bg-[var(--slot4-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--slot4-on-accent)]">
                      Visit resource <ArrowUpRight className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">{domainOf(featured) || 'On the library'}</span>
                  </div>
                </div>
              </Link>
            </EditableReveal>
          ) : null}

          <div className="grid gap-5">
            {supporting.map((post, i) => (
              <EditableReveal key={post.slug || post.id} index={3 + i}>
                <Link
                  href={postHref(primaryTask, post, primaryRoute)}
                  className="group flex items-start gap-5 rounded-[var(--editable-radius-lg)] border border-white/10 bg-white/[0.03] p-5 transition-colors duration-500 hover:bg-white/[0.06]"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--editable-radius-md)] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                    <Bookmark className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{categoryOf(post)}</p>
                    <h4 className="editable-display mt-1.5 line-clamp-2 text-lg font-bold leading-snug tracking-[-0.02em] text-[var(--slot4-cream)]">{post.title}</h4>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">{excerpt(post, 110)}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-white/50 transition group-hover:text-[var(--slot4-cream)]" />
                </Link>
              </EditableReveal>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <div className="flex items-end justify-between gap-4">
            <EditableReveal>
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Living collections</span>
              <h3 className="editable-display mt-3 text-3xl font-bold leading-[1.1] tracking-[-0.025em] text-[var(--slot4-cream)] sm:text-4xl">
                Pick a shelf. Fall in.
              </h3>
            </EditableReveal>
            <Link href={primaryRoute} className="hidden items-center gap-1.5 text-sm font-semibold text-[var(--slot4-cream)] transition-opacity hover:opacity-70 sm:inline-flex">
              All collections <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {collections.map((c, i) => (
              <EditableReveal key={c.slug} index={i} step={70}>
                <Link
                  href={`${primaryRoute}?category=${c.slug}`}
                  className="group flex items-center justify-between rounded-[var(--editable-radius-lg)] border border-white/10 bg-white/[0.04] px-5 py-6 transition-colors duration-500 hover:bg-[var(--slot4-accent)] hover:text-[var(--slot4-on-accent)]"
                >
                  <span className="editable-display text-xl font-bold tracking-[-0.02em]">{c.name}</span>
                  <ArrowUpRight className="h-4 w-4 opacity-60 transition group-hover:opacity-100" />
                </Link>
              </EditableReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==============================================================
   4. TIME COLLECTIONS — real dynamic bookmark grids fed by
      time-window data + social-proof band.
   ============================================================== */

const sectionCopy: Record<string, { eyebrow: string; title: string; caption: string }> = {
  spotlight: { eyebrow: 'Fresh finds', title: 'Added this week', caption: 'Just arrived on the shelves — new resources chosen by the curators.' },
  browse: { eyebrow: 'Now trending', title: 'Popular this month', caption: 'What readers keep opening, sharing, and returning to.' },
  index: { eyebrow: 'Evergreen', title: 'From the archive', caption: 'Older entries that still hold — the kind of resources you keep on a permanent shelf.' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections = timeSections.length > 0
    ? timeSections
    : ([
        { key: 'spotlight', posts: posts.slice(0, 6), href: primaryRoute },
        { key: 'browse', posts: posts.slice(6, 12), href: primaryRoute },
        { key: 'index', posts: posts.slice(12, 18), href: primaryRoute },
      ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])
  const visible = sections.filter((s) => s.posts.length)

  return (
    <>
      {visible.map((section, sIndex) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to explore', caption: 'Keep browsing the library.' }
        return (
          <section key={section.key} className="py-24 sm:py-28">
            <div className={container}>
              <EditableReveal>
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-xl">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{copy.eyebrow}</span>
                    <h2 className="editable-display mt-3 text-3xl font-bold leading-[1.05] tracking-[-0.025em] sm:text-5xl">{copy.title}</h2>
                    <p className="mt-4 text-base leading-[1.7] text-[var(--slot4-muted-text)]">{copy.caption}</p>
                  </div>
                  <Link href={section.href || primaryRoute} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-page-text)] hover:opacity-70">
                    Browse all <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </EditableReveal>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {section.posts.slice(0, sIndex === 0 ? 6 : 6).map((post, i) => (
                  <EditableReveal key={post.slug || post.id} index={i} step={80}>
                    <BookmarkTile post={post} href={postHref(primaryTask, post, primaryRoute)} />
                  </EditableReveal>
                ))}
              </div>
            </div>
          </section>
        )
      })}
      <SocialProofBand />
    </>
  )
}

function BookmarkTile({ post, href }: { post: SitePost; href: string }) {
  const image = getEditablePostImage(post)
  const domain = domainOf(post)
  const category = categoryOf(post)
  return (
    <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-1 hover:shadow-[var(--editable-shadow-lift)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
        <span className="absolute left-3 top-3 rounded-[var(--editable-radius-pill)] bg-[var(--slot4-cream)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)]">
          {category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="editable-display line-clamp-2 text-lg font-bold leading-snug tracking-[-0.02em] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]">{excerpt(post, 120)}</p>
        <div className="mt-5 flex items-center justify-between border-t border-[var(--editable-border)] pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--slot4-muted-text)]">
            <Globe className="h-3.5 w-3.5" /> {domain || 'library.internal'}
          </span>
          <ArrowUpRight className="h-4 w-4 text-[var(--slot4-accent)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  )
}

const proofQuotes = [
  { body: 'The way it groups related sites under one collection is exactly how my brain wanted to browse the internet.', name: 'Ren M.', role: 'Design researcher' },
  { body: 'It replaced three of my read-later apps. Everything I meant to keep is finally, actually kept.', name: 'Alba J.', role: 'Independent writer' },
  { body: 'Feels like a library, not a feed. The difference is the whole point.', name: 'Sami K.', role: 'Product lead' },
]

function SocialProofBand() {
  return (
    <section className="border-y border-[var(--editable-border)] bg-[var(--slot4-warm)] py-24 sm:py-28">
      <div className={container}>
        <EditableReveal className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">From the readers</span>
          <h2 className="editable-display mt-4 text-3xl font-bold leading-[1.1] tracking-[-0.025em] sm:text-4xl">
            The kind of quiet love a good library gets.
          </h2>
        </EditableReveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {proofQuotes.map((quote, i) => (
            <EditableReveal key={quote.name} index={i}>
              <figure className="flex h-full flex-col justify-between rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7">
                <blockquote className="editable-display text-xl font-semibold leading-snug tracking-[-0.015em] text-[var(--slot4-page-text)]">
                  “{quote.body}”
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3 border-t border-[var(--editable-border)] pt-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-sm font-bold text-[var(--slot4-accent)]">
                    {quote.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--slot4-page-text)]">{quote.name}</p>
                    <p className="text-xs text-[var(--slot4-muted-text)]">{quote.role}</p>
                  </div>
                </figcaption>
              </figure>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==============================================================
   5. FAQ ACCORDION + CLOSING CTA.
   ============================================================== */

const faqs = [
  {
    q: 'What kind of things live in the library?',
    a: 'Websites, essays, tools, references — anything with a permanent URL worth keeping. Not posts. Not threads. Just the good pages.',
  },
  {
    q: 'How are collections put together?',
    a: 'Curators shape them by hand. Every entry has a reason for being on its shelf; when a shelf no longer holds, we retire it.',
  },
  {
    q: 'Do I need an account to browse?',
    a: 'No. The library is fully public. An account only unlocks personal shelves and a weekly digest of the newest arrivals.',
  },
  {
    q: 'Can I suggest a resource?',
    a: 'Yes — please. Use the contact page, drop a link and a line about why it belongs. If it fits, it lands on the right shelf.',
  },
]

export function EditableHomeCta() {
  return (
    <>
      <section className="py-24 sm:py-28 lg:py-32">
        <div className={container}>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <EditableReveal>
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Questions readers ask</span>
              <h2 className="editable-display mt-4 text-4xl font-bold leading-[1.05] tracking-[-0.025em] sm:text-5xl">
                A few honest answers before you start browsing.
              </h2>
              <p className="mt-6 text-base leading-[1.7] text-[var(--slot4-muted-text)]">
                Everything else is a link away — or drop a line if you can't find what you need.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] border border-[var(--editable-border-strong)] px-6 py-3 text-sm font-semibold text-[var(--slot4-page-text)] transition-colors duration-300 hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-cream)]"
              >
                Ask a curator
              </Link>
            </EditableReveal>

            <ul className="divide-y divide-[var(--editable-border)] rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
              {faqs.map((faq, i) => (
                <EditableReveal as="li" key={faq.q} index={i} step={70}>
                  <details className="group p-6 sm:p-7 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-start justify-between gap-6">
                      <span className="editable-display text-lg font-semibold tracking-[-0.015em] text-[var(--slot4-page-text)] sm:text-xl">{faq.q}</span>
                      <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)] transition-transform duration-500 group-open:rotate-45">
                        <span className="relative block h-3 w-3">
                          <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-current" />
                          <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-current" />
                        </span>
                      </span>
                    </summary>
                    <p className="mt-4 max-w-xl text-base leading-[1.7] text-[var(--slot4-muted-text)]">{faq.a}</p>
                  </details>
                </EditableReveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="get-started" className="pb-24 sm:pb-28 lg:pb-32">
        <div className={container}>
          <EditableReveal>
            <div className="relative overflow-hidden rounded-[var(--editable-radius-xl)] bg-[var(--slot4-page-text)] p-10 text-center sm:p-16 lg:p-24">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_100%,rgba(252,103,54,0.28),transparent_70%)]" />
              <span className="relative text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                {pagesContent.home.cta.badge || 'Start browsing'}
              </span>
              <h2 className="editable-display relative mx-auto mt-5 max-w-3xl text-balance text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-[var(--slot4-cream)] sm:text-6xl">
                {pagesContent.home.cta.title || 'The internet, kept on a shelf, ready when you are.'}
              </h2>
              <p className="relative mx-auto mt-6 max-w-xl text-lg leading-[1.65] text-white/70">
                {pagesContent.home.cta.description}
              </p>
              <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link href="/sbm" className="inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] bg-[var(--slot4-accent)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition-transform duration-500 hover:-translate-y-0.5">
                  Enter the library <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] border border-white/25 px-7 py-3.5 text-sm font-semibold text-[var(--slot4-cream)] transition-colors duration-300 hover:border-[var(--slot4-cream)] hover:bg-[var(--slot4-cream)] hover:text-[var(--slot4-page-text)]">
                  Suggest a resource
                </Link>
              </div>
              <p className="relative mt-8 text-xs uppercase tracking-[0.24em] text-white/40">
                {globalContent.site.name} · {globalContent.footer.bottomNote}
              </p>
            </div>
          </EditableReveal>
        </div>
      </section>
    </>
  )
}
