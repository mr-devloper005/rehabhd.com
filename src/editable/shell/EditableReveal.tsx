'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/*
  Reveal-on-scroll primitive. Hidden styles only apply after mount
  (`data-ready="true"`) so SSR paints the content — no flash of nothing for
  crawlers or slow JS. IntersectionObserver then toggles `data-visible`.
  `index` staggers a group of siblings so a row fades in one after another.
*/

type Props = {
  children: ReactNode
  index?: number
  as?: 'div' | 'section' | 'article' | 'header' | 'aside' | 'ul' | 'li'
  className?: string
  delay?: number
  step?: number
}

export function EditableReveal({
  children,
  index = 0,
  as = 'div',
  className = '',
  delay = 0,
  step = 90,
}: Props) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.setAttribute('data-ready', 'true')
    if (typeof IntersectionObserver === 'undefined') {
      el.setAttribute('data-visible', 'true')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-visible', 'true')
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const totalDelay = Math.max(0, delay + index * step)
  const Tag = as as 'div'
  return (
    <Tag
      ref={ref as never}
      className={`editable-reveal ${className}`}
      style={{ ['--reveal-delay' as string]: `${totalDelay}ms` }}
    >
      {children}
    </Tag>
  )
}
