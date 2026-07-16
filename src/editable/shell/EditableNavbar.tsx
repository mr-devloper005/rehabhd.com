'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, PlusCircle, Search, UserPlus, X, Menu } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Floating glass-pill navbar (reference: kren / vaboulus). No task links —
  the library, collections and any task lanes are discovered through the
  home hero, footer collections column, and /search. Only logo · About ·
  Contact · search icon · auth actions live here.
*/

const navLinks: Array<{ label: string; href: string }> = [
  { label: 'About', href: '/about' },
  { label: 'The Library', href: '/sbm' },
  { label: 'Contact', href: '/contact' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="pointer-events-none sticky top-0 z-50 px-4 pt-4 sm:pt-5">
      <nav
        className={`pointer-events-auto mx-auto flex w-full max-w-[var(--editable-container)] items-center gap-3 rounded-[var(--editable-radius-pill)] border border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-4 py-2.5 backdrop-blur-xl transition-shadow duration-500 sm:px-6 ${
          scrolled ? 'shadow-[var(--editable-shadow-soft)]' : 'shadow-none'
        }`}
      >
        <Link href="/" className="group flex items-center gap-2.5 pr-1">
          <span className="flex h-9 w-9 items-center justify-center  bg-[var(--slot4-page-text)] text-[var(--slot4-cream)]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-7 w-7 object-contain invert" />
          </span>
          <span className="editable-display hidden text-[15px] font-bold tracking-[-0.02em] text-[var(--slot4-page-text)] sm:block">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-[var(--editable-radius-pill)] px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                isActive(link.href)
                  ? 'text-[var(--slot4-page-text)]'
                  : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
              }`}
            >
              {link.label}
              {isActive(link.href) ? (
                <span className="absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full bg-[var(--slot4-accent)]" />
              ) : null}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-page-text)] transition-colors duration-300 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-cream)]"
          >
            <Search className="h-4 w-4" />
          </Link>
          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-1.5 rounded-[var(--editable-radius-pill)] bg-[var(--slot4-accent)] px-4 py-2 text-sm font-semibold text-[var(--slot4-on-accent)] transition-transform duration-500 hover:-translate-y-0.5 sm:inline-flex"
              >
                <PlusCircle className="h-4 w-4" /> Add resource
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden text-sm font-medium text-[var(--slot4-muted-text)] transition-colors hover:text-[var(--slot4-page-text)] sm:inline-flex sm:px-3"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-1.5 rounded-[var(--editable-radius-pill)] px-3 py-2 text-sm font-medium text-[var(--slot4-muted-text)] transition-colors hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-1.5 rounded-[var(--editable-radius-pill)] bg-[var(--slot4-page-text)] px-4 py-2 text-sm font-semibold text-[var(--slot4-cream)] transition-transform duration-500 hover:-translate-y-0.5 sm:inline-flex"
              >
                <UserPlus className="h-4 w-4" /> Join
              </Link>
            </>
          )}
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-page-text)] lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="pointer-events-auto mx-auto mt-2 w-full max-w-[var(--editable-container)] overflow-hidden rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-4 shadow-[var(--editable-shadow-lift)] lg:hidden">
          <div className="grid gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-[var(--editable-radius-md)] px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-[var(--slot4-page-text)] text-[var(--slot4-cream)]'
                    : 'text-[var(--slot4-page-text)] hover:bg-[var(--slot4-warm)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/search" className="rounded-[var(--editable-radius-md)] px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)] hover:bg-[var(--slot4-warm)]">Search</Link>
            <div className="mt-2 h-px bg-[var(--editable-border)]" />
            {session ? (
              <>
                <Link href="/create" className="mt-2 rounded-[var(--editable-radius-pill)] bg-[var(--slot4-accent)] px-4 py-3 text-center text-sm font-semibold text-[var(--slot4-on-accent)]">Add a resource</Link>
                <button type="button" onClick={logout} className="mt-2 rounded-[var(--editable-radius-md)] px-4 py-3 text-left text-sm font-medium text-[var(--slot4-muted-text)]">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="mt-2 rounded-[var(--editable-radius-md)] px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)] hover:bg-[var(--slot4-warm)]">Sign in</Link>
                <Link href="/signup" className="rounded-[var(--editable-radius-pill)] bg-[var(--slot4-page-text)] px-4 py-3 text-center text-sm font-semibold text-[var(--slot4-cream)]">Join</Link>
              </>
            )}
            {globalContent.nav.tagline ? (
              <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">{globalContent.nav.tagline}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
