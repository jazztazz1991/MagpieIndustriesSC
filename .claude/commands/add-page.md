Scaffold a new tool page following the project's architecture rules.

Ask the user:
1. **Page name** (e.g. "salvage", "trade-routes") - used for the URL path
2. **Page title** (e.g. "Salvage Calculator", "Trade Route Finder")
3. **Brief description** of what the page does

Then create these files:

### 1. Page component: `client/src/app/tools/{name}/page.tsx`
```
"use client";

import styles from "../tools.module.css";

export default function {PascalName}() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{description}</p>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>TODO</h2>
        <p>Coming soon.</p>
      </div>
    </div>
  );
}
```

### 2. CSS Module (only if page-specific styles are needed): `client/src/app/tools/{name}/{name}.module.css`
Create with a minimal starter containing the page's root class.

### 3. Navigation link
Add a link to the new page in `client/src/components/nav/Navbar.tsx` in both desktop and mobile nav sections, under the Tools group.

Rules:
- All pages go under `client/src/app/tools/` (App Router)
- Use shared styles from `tools.module.css` first, only create page-specific CSS if needed
- Components are presentational only - domain logic goes in `client/src/domain/`
- Import shared styles as `styles` from `"../tools.module.css"`
- After creating, run `/verify` to confirm the page compiles
- Do NOT add business logic yet - just scaffold the page structure
