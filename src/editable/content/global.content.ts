import { slot4BrandConfig } from '@/editable/theme/brand.config'
import type { TaskKey } from '@/lib/site-config'

/*
  User-visible copy + task-visibility rules for the public shell.
  - `uiHiddenTaskKeys` marks tasks whose routes stay functional but must
     never appear in any public UI (nav, footer, home, search filter, create
     picker, stats). Curators (profiles) live here.
  - `getTaskDisplayLabel` lets any UI rename a task without touching keys or
     routes. That's how "sbm" is presented everywhere as "The Library".
*/

export const uiHiddenTaskKeys = ['profile'] as const
export const isUiHiddenTask = (key: string) =>
  (uiHiddenTaskKeys as readonly string[]).includes(key)

export const taskDisplayLabels: Partial<Record<TaskKey, string>> = {
  sbm: 'The Library',
  profile: 'Curator',
}

export const taskDisplayRoles: Partial<Record<TaskKey, string>> = {
  sbm: 'Curators',
  profile: 'Curator',
}

export function getTaskDisplayLabel(key: TaskKey, fallback = ''): string {
  return taskDisplayLabels[key] || fallback || key
}

export function getTaskDisplayRole(key: TaskKey, fallback = ''): string {
  return taskDisplayRoles[key] || fallback || key
}

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A shared library of resources, worth returning to.',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'The Library',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Browse the library', href: '/sbm' },
      secondary: { label: 'Suggest a resource', href: '/contact' },
    },
  },
  footer: {
    tagline: 'A shared library of the internet, one collection at a time.',
    description:
      'A public library of curated resources and links, arranged into collections you can browse, save, and return to.',
    collectionsTitle: 'Collections',
    exploreTitle: 'Explore',
    siteTitle: 'Site',
    bottomNote: 'Built for readers who like their bookmarks organised.',
    columns: [
      {
        title: 'Collections',
        links: [
          { label: 'Technology', href: '/sbm?category=technology' },
          { label: 'Business', href: '/sbm?category=business' },
          { label: 'Health', href: '/sbm?category=health' },
          { label: 'Travel', href: '/sbm?category=travel' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Search', href: '/search' },
        ],
      },
    ],
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View library',
    explore: 'Browse',
    latest: 'Fresh finds',
    related: 'From the same collection',
    published: 'Added',
    visit: 'Visit resource',
  },
} as const
