import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

/*
  Voice per task lane. Public UI only surfaces `sbm` (The Library); other
  entries stay in place so any direct URL renders with dignity. Copy avoids
  the words "social bookmark" and "profile" on user-visible surfaces.
*/

export const taskPageVoices = {
  sbm: {
    eyebrow: 'The Library',
    headline: 'A library of resources — arranged into living collections.',
    description:
      'Each shelf is a subject the curators keep tending. Browse a collection, follow a link, come back for more.',
    filterLabel: 'Choose a collection',
    secondaryNote: 'Every resource earns its shelf. Nothing infinite-scroll, nothing throwaway.',
    chips: ['Curated', 'Living collections', 'Direct links'],
  },
  article: {
    eyebrow: 'Notes',
    headline: 'Longer reads from the library — the writing that pairs with a shelf.',
    description: 'Companion pieces to the collections. Read at your own pace.',
    filterLabel: 'Choose a subject',
    secondaryNote: 'Written to be kept, not scrolled past.',
    chips: ['Longform', 'Companion reads', 'Slow web'],
  },
  classified: {
    eyebrow: 'Notice',
    headline: 'Open calls and briefs from readers of the library.',
    description: 'Notices posted for the community — short-lived by design.',
    filterLabel: 'Choose a subject',
    secondaryNote: 'Kept short. Kept honest.',
    chips: ['Open calls', 'Community', 'Time-boxed'],
  },
  pdf: {
    eyebrow: 'Documents',
    headline: 'Downloadable references, briefs and reports — filed for keeping.',
    description: 'A shelf of full documents rather than links. Grab, save, read offline.',
    filterLabel: 'Choose a document type',
    secondaryNote: 'Documents earn a shelf when they hold up on second read.',
    chips: ['Downloadable', 'References', 'Briefs'],
  },
  listing: {
    eyebrow: 'Directory',
    headline: 'A directory of places worth pinning to a shelf.',
    description: 'Studios, shops, services — the kind of entries a reader might send to a friend.',
    filterLabel: 'Choose a category',
    secondaryNote: 'Directory entries stay hand-checked and up to date.',
    chips: ['Places', 'Kept-current', 'Reader-recommended'],
  },
  image: {
    eyebrow: 'Gallery',
    headline: 'Visual references filed onto the library shelves.',
    description: 'A gallery of images collected as references — used the way books use plates.',
    filterLabel: 'Choose a gallery',
    secondaryNote: 'Every image credits its source.',
    chips: ['Visual references', 'Plates', 'Credited'],
  },
  profile: {
    eyebrow: 'Curator',
    headline: 'A curator page in the library.',
    description: 'Reached by direct link — the address of a curator who keeps a shelf here.',
    filterLabel: 'Choose a curator',
    secondaryNote: 'Curator pages are not part of the public index.',
    chips: ['Direct link only'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
