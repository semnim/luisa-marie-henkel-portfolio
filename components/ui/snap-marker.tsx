/**
 * Snap point at the top of a full-screen section, for phones (see the
 * `data-mobile-snap` rules in globals.css). The parent must be positioned.
 *
 * The marker is the snap area, not the section: a section may be taller than
 * the visible viewport (see `--screen`), and the browser lets a scroll come
 * to rest anywhere inside a snap area that is taller than the viewport. A
 * one-pixel area leaves the section top as the only resting place.
 */
export function SnapMarker() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 size-px snap-start"
    />
  );
}
