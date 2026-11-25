import * as React from 'react';

/**
 * Radix dialogs only hand focus back to a `Dialog.Trigger`. Dialogs that are
 * opened from state have none, so focus would fall back to <body> on close.
 * Remembers what had focus when `open` became true and returns a handler for
 * `onCloseAutoFocus` that puts focus back there.
 */
export function useReturnFocus(open: boolean) {
  const returnTo = React.useRef<HTMLElement | null>(null);

  // Layout effect: runs before the dialog content mounts and steals focus.
  React.useLayoutEffect(() => {
    if (!open) return;
    const active = document.activeElement;
    returnTo.current =
      active instanceof HTMLElement && active !== document.body ? active : null;
  }, [open]);

  return React.useCallback((event: Event) => {
    const target = returnTo.current;
    returnTo.current = null;
    if (!target?.isConnected) return;
    event.preventDefault();
    target.focus();
  }, []);
}
