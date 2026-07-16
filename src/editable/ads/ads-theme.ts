// ✏️ EDITABLE — theme only. Shape/fit stays locked in src/lib/ad-slots.ts.

import type { AdSkin } from '@/lib/ads/ad-frame'

export const adSkin: AdSkin = {
  radius: '20px',
  border: '1px solid rgba(11,30,39,0.10)',
  shadow: '0 4px 18px rgba(11,30,39,0.06)',
  background: '#FFFFFF',
  labelClassName: 'bg-[#0B1E27] text-[#F6F1EA]',
}

export const adSkinBySlot: Partial<Record<string, AdSkin>> = {
  sidebar: {
    radius: '20px',
    shadow: 'none',
    border: '1px solid rgba(11,30,39,0.10)',
    background: '#FFFFFF',
  },
  header: {
    radius: '20px',
    background: '#EFE7DC',
    border: '1px solid rgba(11,30,39,0.06)',
    shadow: 'none',
  },
  footer: {
    radius: '20px',
    background: '#FFFFFF',
    border: '1px solid rgba(11,30,39,0.10)',
    shadow: 'none',
  },
  rail: { radius: '20px' },
  feature: { radius: '24px' },
  popup: { radius: '24px' },
  interstitial: { radius: '24px', shadow: '0 24px 60px rgba(11,30,39,0.28)' },
  anchor: { radius: '16px', shadow: '0 8px 24px rgba(11,30,39,0.18)' },
}

export function skinFor(slot: string): AdSkin {
  return { ...adSkin, ...(adSkinBySlot[slot] ?? {}) }
}
