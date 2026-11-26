'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { usePathname } from 'next/navigation';
import * as React from 'react';

/**
 * The page scroller from md up: the document does not scroll there, so there
 * are no native scrollbars.
 *
 * Below md the viewport is switched off and the document scrolls natively.
 * Mobile Safari only collapses its toolbar and only draws the page underneath
 * its bars for a scrolling document; inside an inner scroller a `100dvh` hero
 * stops short of the screen edge. The matching rules (hidden native scrollbar,
 * `data-mobile-snap` snapping) are in globals.css.
 */
export function PageScrollArea({ children }: { children: React.ReactNode }) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Keyboard scrolling (arrows, space, page up/down) only reaches a scroller
  // that holds focus or contains it. With nothing focused the browser would
  // scroll the document, which is no longer scrollable, so hand focus to the
  // page scroller on load and whenever a navigation drops it back to <body>.
  React.useEffect(() => {
    const active = document.activeElement;
    if (active === null || active === document.body) {
      viewportRef.current?.focus({ preventScroll: true });
    }
  }, [pathname]);

  return (
    <ScrollArea
      className="md:h-dvh max-md:[&>[data-slot=scroll-area-scrollbar]]:hidden"
      viewportProps={{
        ref: viewportRef,
        // Focusable for keyboard scrolling, but not a tab stop. It is the
        // page itself, so it gets no focus ring.
        tabIndex: -1,
        // Radix sets overflow inline, hence the important modifier.
        className:
          'focus-visible:ring-0 focus-visible:outline-none max-md:overflow-visible!',
      }}
    >
      {children}
    </ScrollArea>
  );
}
