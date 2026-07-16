import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'The Library — a curated library of the internet',
      description: 'A public library of hand-picked resources and links, arranged into living collections you can browse, save, and return to.',
      openGraphTitle: 'The Library — a curated library of the internet',
      openGraphDescription: 'Explore living collections of resources, tools and references — kept by curators, made for readers.',
      keywords: ['library', 'resources', 'collections', 'bookmarks', 'curated links'],
    },
    hero: {
      badge: 'Now open · Public library',
      title: ['The library, made for the', 'internet you love.'],
      description:
        'A hand-tended library of resources, tools and references — arranged into living collections you can browse, save, and keep coming back to.',
      primaryCta: { label: 'Enter the library', href: '/sbm' },
      secondaryCta: { label: 'Suggest a resource', href: '/contact' },
      searchPlaceholder: 'Search collections, tools, references…',
      focusLabel: 'On the shelves',
      featureCardBadge: 'Fresh finds this week',
      featureCardTitle: 'Curated additions land on the shelves as soon as they earn their place.',
      featureCardDescription:
        'Every entry is reviewed by a curator before it goes on a shelf, and every shelf is a real subject you can walk through.',
    },
    intro: {
      badge: 'About the library',
      title: 'A shared library of the internet, one collection at a time.',
      paragraphs: [
        'The library keeps pages worth keeping — websites, essays, tools, references — filed into collections you can actually browse.',
        'Nothing algorithmic. Nothing throwaway. Just the good pages, kept on the right shelves.',
        'Sign in to build your own shelves; browse without signing in at all.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Living collections, curated by hand.',
        'Direct links — never redirects or wrappers.',
        'Search across every shelf in the library.',
        'Weekly digest of fresh arrivals, if you want it.',
      ],
      primaryLink: { label: 'Enter the library', href: '/sbm' },
      secondaryLink: { label: 'Suggest a resource', href: '/contact' },
    },
    cta: {
      badge: 'Start browsing',
      title: 'The internet, kept on a shelf, ready when you are.',
      description:
        'Open any collection to see what the curators have filed. Add your own shelves when you sign in.',
      primaryCta: { label: 'Enter the library', href: '/sbm' },
      secondaryCta: { label: 'Contact a curator', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Freshly filed on the library shelves.',
    },
  },
  about: {
    badge: 'The story',
    title: 'A calmer, quieter home for the internet worth keeping.',
    description: `${slot4BrandConfig.siteName} is a public library of resources, arranged into living collections and kept up by hand.`,
    paragraphs: [
      'The library exists because feeds forget and inboxes overflow. Good pages deserve somewhere permanent — a shelf, a room, a way back to them.',
      'Curators shape each collection by hand. Every entry has a reason for being here; when a page no longer holds up, we retire it.',
      'Readers can browse without an account. Sign in to build private shelves of your own.',
    ],
    values: [
      {
        title: 'A library, not a feed',
        description: 'Every resource earns a shelf. Nothing algorithmic, nothing infinite-scroll.',
      },
      {
        title: 'Curated by humans',
        description: 'The collections are shaped, edited and pruned by real curators who read what they file.',
      },
      {
        title: 'Kept, not consumed',
        description: 'Built for readers who want to return to something later — not just to keep scrolling.',
      },
    ],
  },
  contact: {
    eyebrow: `Talk to a curator`,
    title: 'Have a resource in mind, or a shelf we should build?',
    description:
      'Send a link, a question, or a suggestion. If it belongs on a shelf, we\'ll file it. If it needs a new one, we\'ll build it.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search the library',
      description: 'Search every collection, resource and reference in the library.',
    },
    hero: {
      badge: 'Search the library',
      title: 'Find any resource across every collection.',
      description: 'Search by keyword, collection or subject to walk any shelf in the library.',
      placeholder: 'Search resources, tools, collections…',
    },
    resultsTitle: 'Latest additions',
  },
  create: {
    metadata: {
      title: 'Add a resource',
      description: 'Submit a resource to the library.',
    },
    locked: {
      badge: 'Curator access',
      title: 'Sign in to add a resource.',
      description:
        'Use your account to open the curator workspace and file a new resource on the right shelf.',
    },
    hero: {
      badge: 'Curator workspace',
      title: 'File a new resource for the library.',
      description:
        'Pick a collection, add details and prepare a clean entry with a link, summary and notes.',
    },
    formTitle: 'Resource details',
    submitLabel: 'File on the shelf',
    successTitle: 'Filed on the shelf.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to the library.',
      badge: 'Curator access',
      title: 'Welcome back to the library.',
      description: 'Sign in to open your private shelves, add resources, and manage what you file.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched those details. Create one first, then sign in.',
      success: 'Signed in. Redirecting…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Join the library.',
      badge: 'Curator access',
      title: 'Join the library and start filing.',
      description:
        'Create an account to build your own shelves, file resources, and get the weekly digest of new arrivals.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Notes from the same shelf',
      fallbackTitle: 'A quiet note',
    },
    listing: {
      relatedTitle: 'From the same shelf',
      fallbackTitle: 'Entry details',
    },
    image: {
      relatedTitle: 'From the same shelf',
      fallbackTitle: 'Entry details',
    },
    profile: {
      relatedTitle: 'From the same shelf',
      fallbackDescription: 'Curator details land here on visit.',
      visitButton: 'Visit official site',
    },
  },
} as const
