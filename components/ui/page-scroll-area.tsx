'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { usePathname } from 'next/navigation';
import * as React from 'react';

/**
 * The single page scroller. The document itself never scrolls, so there are
 * no native scrollbars anywhere.
 *
 * Pages opt into full-screen snapping on mobile by putting `data-mobile-snap`
 * on their root element.
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
      className="h-dvh"
      viewportProps={{
        ref: viewportRef,
        // Focusable for keyboard scrolling, but not a tab stop. It is the
        // page itself, so it gets no focus ring.
        tabIndex: -1,
        className:
          'focus-visible:ring-0 focus-visible:outline-none max-md:has-data-mobile-snap:snap-y max-md:has-data-mobile-snap:snap-mandatory',
      }}
    >
      {children}
    </ScrollArea>
  );
}
