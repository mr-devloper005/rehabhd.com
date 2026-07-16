import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Library } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Join', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main>
        <section className="relative mx-auto grid w-full max-w-[var(--editable-container)] items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[0.95fr_1fr] lg:px-10 lg:py-32">
          <EditableReveal>
            <div className="rounded-[var(--editable-radius-xl)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 shadow-[var(--editable-shadow-soft)] sm:p-10">
              <h1 className="editable-display text-2xl font-bold tracking-[-0.02em]">{pagesContent.auth.signup.formTitle}</h1>
              <EditableLocalSignupForm />
              <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                  {pagesContent.auth.signup.loginCta}
                </Link>
              </p>
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.auth.signup.badge}</span>
            <h2 className="editable-display mt-5 text-5xl font-bold leading-[1.02] tracking-[-0.035em] sm:text-6xl">{pagesContent.auth.signup.title}</h2>
            <p className="mt-6 max-w-lg text-lg leading-[1.65] text-[var(--slot4-muted-text)]">{pagesContent.auth.signup.description}</p>
            <Link href="/sbm" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-page-text)] hover:opacity-70">
              <Library className="h-4 w-4 text-[var(--slot4-accent)]" /> Browse the library instead <ArrowUpRight className="h-4 w-4" />
            </Link>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
