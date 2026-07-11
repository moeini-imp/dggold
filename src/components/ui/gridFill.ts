/**
 * Responsive grid-row classes for `HScroller`: items evenly fill the row
 * (3 up on mobile, growing to 8 up on xl) at a uniform width; once there are
 * more items than fit, the row scrolls horizontally instead of wrapping.
 *
 * Lives in a plain (non-"use client") module so SERVER components can import
 * the real string — importing it from the client `HScroller.tsx` turned it
 * into a client-reference stub, so the string never reached the DOM.
 *
 * The `calc()` values use underscores for the spaces Tailwind requires: CSS
 * needs whitespace around the `-` operator (`100% - 2rem`), otherwise the
 * declaration is invalid and dropped, collapsing every column back to `auto`
 * (content width). gap = 1rem (`gap-4`); N columns → (N-1)rem of gaps.
 *
 * Column progression: 5 up on the smallest screens, growing to all 8 by `lg`.
 */
export const GRID_FILL_UP_TO_8 =
  "grid grid-flow-col auto-cols-[calc((100%_-_4rem)/5)] sm:auto-cols-[calc((100%_-_5rem)/6)] md:auto-cols-[calc((100%_-_6rem)/7)] lg:auto-cols-[calc((100%_-_7rem)/8)]";
