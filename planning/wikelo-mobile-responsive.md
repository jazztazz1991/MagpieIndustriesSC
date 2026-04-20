# Wikelo Tracker Mobile Responsiveness

## Summary

Make the Wikelo tracker usable on phones (≤480px). Current layout
works fine on desktop but several rows/headers overflow on narrow
screens, squishing item names and making buttons hard to tap.

## Problem areas

1. **Shopping list item rows** — 4 buttons + 2 numeric columns leave
   ~100px for item names. Long names like "Irradiated Valakkar Pearl
   (Grade AAA)" get truncated or wrap badly.
2. **Project material rows (expanded view)** — same issue, 4 buttons per row.
3. **Group header** — invite code, leave button, members list on one
   flex row wraps awkwardly.
4. **Conversion materials** — "Have: X/Y (N more needed)" + 5 buttons
   is too wide for mobile.
5. **Drag-to-reorder** — doesn't work on touch; need an alternate
   mechanism OR just hide the drag hint on mobile (user can reorder
   from desktop).
6. **View toggle buttons** — "Projects / Who Has What / Activity Log"
   may wrap onto two lines — that's fine, just make sure they don't
   overlap.

## Approach

Add a small global media query helper. For each problem row:

- **Shopping list + material rows**: below 480px, switch from grid to
  a column layout — item name on one line, count + buttons on the next line.
- **Group header**: wrap the invite/leave controls under the name on narrow screens.
- **Conversion materials**: stack the "Have" label, count, and buttons vertically.
- **Drag hint**: hide `Drag to reorder priority` text on mobile (touch
  can't drag easily with this implementation).

No dedicated mobile tests — we're just adjusting CSS. Verify manually
in browser dev tools at 360px and 480px widths.

## Files Modified

- `client/src/app/tools/tools.module.css` — add `.shoppingRow`, `.materialRow`, `.conversionRow` with mobile breakpoints
- `client/src/app/tools/wikelo-tracker/page.tsx` — use new class names
- `client/src/app/tools/wikelo-tracker/group/[id]/page.tsx` — same + header stacking
- `client/src/app/tools/wikelo-tracker/[id]/page.tsx` — use material row class

## Checklist

- [ ] Add responsive classes to tools.module.css
- [ ] Update shopping list rows (personal + group)
- [ ] Update project material rows (personal detail + group expanded view)
- [ ] Stack group header controls on narrow screens
- [ ] Stack conversion materials row on narrow screens
- [ ] Type-check and visual verify at 360px
