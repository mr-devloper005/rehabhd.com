'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent, isUiHiddenTask } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Dark footer band, reference-inspired: oversized wordmark, four columns
  (brand · collections · explore · site), thin legal row. Collections column
  is the primary discovery surface for the library — links deep into /sbm
  filtered by category. No task-key links; profiles (hidden) never appear.
*/

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const sbmEnabled = SITE_CONFIG.tasks.some((t) => t.enabled && t.key === 'sbm' && !isUiHiddenTask(t.key))

  return (
    <footer className="mt-24 bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto w-full max-w-[var(--editable-container)] px-6 pb-10 pt-20 lg:px-10 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_0.75fr_0.75fr]">
          <div>
            <Link href="/" className="editable-display text-[13vw] font-bold leading-[0.9] tracking-[-0.05em] text-[var(--slot4-cream)] sm:text-8xl lg:text-[7.5rem]">
              {SITE_CONFIG.name}
            </Link>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/65">
              {globalContent.footer?.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {sbmEnabled ? (
                <Link
                  href="/sbm"
                  className="inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] bg-[var(--slot4-accent)] px-6 py-3 text-sm font-semibold text-[var(--slot4-on-accent)] transition-transform duration-500 hover:-translate-y-0.5"
                >
                  Enter the library <ArrowUpRight className="h-4 w-4" />
                </Link>
              ) : null}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-[var(--editable-radius-pill)] border border-white/20 bg-transparent px-6 py-3 text-sm font-semibold text-[var(--slot4-cream)] transition-colors duration-300 hover:border-[var(--slot4-cream)] hover:bg-[var(--slot4-cream)] hover:text-[var(--slot4-page-text)]"
              >
                Suggest a resource
              </Link>
            </div>
          </div>

          
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--slot4-accent)]">
              {globalContent.footer.exploreTitle}
            </h3>
            <ul className="mt-5 grid gap-2.5">
              <li><Link href="/about" className="text-sm text-white/70 transition-colors hover:text-[var(--slot4-cream)]">About</Link></li>
              <li><Link href="/contact" className="text-sm text-white/70 transition-colors hover:text-[var(--slot4-cream)]">Contact</Link></li>
              <li><Link href="/search" className="text-sm text-white/70 transition-colors hover:text-[var(--slot4-cream)]">Search</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--slot4-accent)]">
              {globalContent.footer.siteTitle}
            </h3>
            <ul className="mt-5 grid gap-2.5">
              {session ? (
                <>
                  <li><Link href="/create" className="text-sm text-white/70 transition-colors hover:text-[var(--slot4-cream)]">Add a resource</Link></li>
                  <li>
                    <button type="button" onClick={logout} className="text-left text-sm text-white/70 transition-colors hover:text-[var(--slot4-cream)]">
                      Sign out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link href="/login" className="text-sm text-white/70 transition-colors hover:text-[var(--slot4-cream)]">Sign in</Link></li>
                  <li><Link href="/signup" className="text-sm text-white/70 transition-colors hover:text-[var(--slot4-cream)]">Join</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {SITE_CONFIG.name}. {globalContent.footer.bottomNote}</p>
          <p className="uppercase tracking-[0.24em]">{globalContent.footer.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
