'use client';
import { useEffect, useRef } from 'react';

const PUBLISHER_ID = 'ca-pub-8140114372302035';

// Manual placement slots only — NO auto ads
// Auto ads disabled in AdSense dashboard (Ads → By site → turn OFF Auto ads)
export const AD_SLOTS = {
  'auto-1':       '7364157724', // Top banner — tool pages
  'auto-2':       '7171066126', // Top banner — homepage
  'auto-relaxed': '8144024997', // Bottom of page — all pages
} as const;

export type SlotName = keyof typeof AD_SLOTS;

interface AdUnitProps {
  slot: SlotName;
  className?: string;
  center?: boolean;
}

export default function AdUnit({ slot, className = '', center = false }: AdUnitProps) {
  const slotId = AD_SLOTS[slot];
  const pushed  = useRef(false);

  useEffect(() => {
    // Only push once per mount — prevents duplicate ad calls on re-renders
    if (pushed.current) return;
    pushed.current = true;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  return (
    // Wrapper labelled "Advertisement" — required by Better Ads Standards
    <div
      className={`overflow-hidden ${center ? 'flex justify-center' : ''} ${className}`}
      role="complementary"
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '90px' }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slotId}
        data-ad-format={slot === 'auto-relaxed' ? 'auto' : 'horizontal'}
        data-full-width-responsive="true"
      />
    </div>
  );
}
