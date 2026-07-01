# Home Flow Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the home page's flat category→stage sidebar with a category-only sidebar plus a per-category flow diagram (stages as columns, branch lines between related emails), and add a colored category/stage badge to each card in the grid.

**Architecture:** All data (new fields + lookup tables) lives in `lib/emails.ts`, the single source of truth already used by both `app/page.tsx` and `app/correo/[id]/page.tsx`. A new client component `app/HomeFlowDiagram.tsx` owns the diagram's layout/SVG logic in isolation. `app/page.tsx` is modified in place (its existing multi-component-per-file pattern — `Sidebar`, `EmailGrid`, `EmailCard`, `HomePage` — is kept; only the diagram, which is a genuinely separate self-contained unit with its own layout math, gets its own file).

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript (strict), inline `style={{}}` objects (no CSS modules / styled-components / Tailwind in this repo — don't introduce one).

## Global Constraints

- No new npm dependencies. Everything below uses only React/DOM APIs already available.
- This repo has no test framework (`package.json` has no `test` script, no jest/vitest). Do not add one for this change — it's a UI reshuffle, not new business logic. Verification per task = `npm run build` (TypeScript strict + Next build must succeed) and a manual check in the browser via `npm run dev`. Task 1 (pure data) additionally gets a one-off `grep`/`comm` integrity check (no permanent script).
- Follow the existing inline-style convention exactly as seen in `app/page.tsx` and `app/correo/[id]/page.tsx` — plain `style={{...}}` objects, no new styling system.
- Colors must reuse the exact values already established:
  - `En vivo` → `linear-gradient(135deg,#ed8936 0%,#8460e5 100%)` (`G_PRIMARY` in `lib/email-templates.ts`), solid accent `#ed8936`.
  - `Negociable` → `linear-gradient(125deg,#00aeb1 0%,#00aeb1 40%,#8460e5 100%)` (`G_NEGOTIABLE` in `lib/email-templates.ts`), solid accent `#00aeb1`.
  - These match `concorde/components/OfferCard.tsx`'s `live` (orange bar) / `negotiable` (teal bar) variants — do not invent new hexes.
- UI copy stays in Spanish, matching the rest of the home page.
- Spec: `docs/superpowers/specs/2026-07-01-home-flow-redesign-design.md`.

---

### Task 1: Data layer — `leadsTo`, `STAGE_ORDER`, category color tokens

**Files:**
- Modify: `lib/emails.ts`

**Interfaces:**
- Produces: `EmailTemplate.leadsTo?: string[]` field; `STAGE_ORDER: Record<string, string[]>`; `CATEGORY_GRADIENT: Record<string, string>`; `CATEGORY_SOLID: Record<string, string>` — all exported from `lib/emails.ts`, all consumed by later tasks.

- [ ] **Step 1: Add the `leadsTo` field to the `EmailTemplate` interface**

In `lib/emails.ts`, change:

```ts
export interface EmailTemplate {
  id: string;        // slug para la URL
  name: string;      // nombre visible
  subject: string;   // asunto del correo
  desc: string;      // descripción corta para la card
  category?: string; // agrupa la card en el catálogo (ej. "En vivo")
  stage?: string;     // paso dentro del flujo de la categoría (ej. "Negociación"), pinta el stepper
  sections: Section[];
}
```

to:

```ts
export interface EmailTemplate {
  id: string;        // slug para la URL
  name: string;      // nombre visible
  subject: string;   // asunto del correo
  desc: string;      // descripción corta para la card
  category?: string; // agrupa la card en el catálogo (ej. "En vivo")
  stage?: string;     // paso dentro del flujo de la categoría (ej. "Negociación"), pinta el stepper
  leadsTo?: string[]; // ids de correos a los que puede derivar (dibuja las líneas del diagrama de flujo)
  sections: Section[];
}
```

- [ ] **Step 2: Add `STAGE_ORDER`, `CATEGORY_GRADIENT`, `CATEGORY_SOLID` constants**

In `lib/emails.ts`, right after the `ICON` constant block (before `const DEMO_CAR = ...`), add:

```ts
// orden real del flujo de negocio por categoría — no depende del orden de inserción en EMAILS
export const STAGE_ORDER: Record<string, string[]> = {
  'En vivo': ['Inicio', 'Resultado', 'Negociación', 'Habilitación', 'Cierre'],
  'Negociable': ['Inicio', 'Negociación', 'Alertas', 'Resultado'],
};

// mismos gradientes que ya usan los CTA de email-templates.ts (G_PRIMARY / G_NEGOTIABLE),
// que a su vez vienen de concorde/components/OfferCard.tsx (barras live/negotiable)
export const CATEGORY_GRADIENT: Record<string, string> = {
  'En vivo': 'linear-gradient(135deg,#ed8936 0%,#8460e5 100%)',
  'Negociable': 'linear-gradient(125deg,#00aeb1 0%,#00aeb1 40%,#8460e5 100%)',
};

export const CATEGORY_SOLID: Record<string, string> = {
  'En vivo': '#ed8936',
  'Negociable': '#00aeb1',
};
```

- [ ] **Step 3: Add `leadsTo` to the 14 emails that have a known next step**

For each block below, find the exact existing lines (id + name + subject + desc + category + stage + `sections: [`) in `lib/emails.ts` and insert the `leadsTo:` line right after `stage:`. Leave every other email untouched (they're terminal — no `leadsTo`).

1. `listo-participar`:
```ts
    id: 'listo-participar',
    name: 'Ready to Bid — Participation',
    subject: '¡Listo para participar en la oferta {{Toyota Hilux 2018}}!',
    desc: 'Confirms participation: details (date, seller, consignment) + live-room reminder.',
    category: 'En vivo',
    stage: 'Inicio',
    leadsTo: ['mejor-postor', 'ganador-directo'],
    sections: [
```

2. `oportunidad-compra`:
```ts
    id: 'oportunidad-compra',
    name: 'Purchase Opportunity — 2nd/3rd Place',
    subject: '¡Tienes oportunidad de compra en la oferta {{Toyota Hilux 2018}}!',
    desc: 'Notifies 2nd/3rd-place bidders of a purchase opportunity and explains eligibility conditions.',
    category: 'En vivo',
    stage: 'Resultado',
    leadsTo: ['habilitado-comprar'],
    sections: [
```

3. `ganador-directo`:
```ts
    id: 'ganador-directo',
    name: 'Direct Winner — Purchase',
    subject: '¡Eres el Ganador Directo en la oferta {{Toyota Hilux 2018}}!',
    desc: 'Notifies the direct winner, prompts to start the purchase, and states the sanctions.',
    category: 'En vivo',
    stage: 'Resultado',
    leadsTo: ['habilitado-comprar'],
    sections: [
```

4. `mejor-postor`:
```ts
    id: 'mejor-postor',
    name: 'Best Bidder Notification',
    subject: '¡Eres el Mejor Postor en la oferta {{Toyota Hilux 2018}}!',
    desc: 'Notifies the current best bidder and explains what being top bidder means.',
    category: 'En vivo',
    stage: 'Resultado',
    leadsTo: ['contrapropuesta', 'opcion-compra', 'habilitado-comprar', 'oferta-terminada'],
    sections: [
```

5. `opcion-compra`:
```ts
    id: 'opcion-compra',
    name: 'Purchase Option Notification',
    subject: '¡Tienes opción de compra en la oferta {{Toyota Hilux 2018}}!',
    desc: 'Notifies the buyer the seller granted a purchase option and prompts them to accept it.',
    category: 'En vivo',
    stage: 'Resultado',
    leadsTo: ['habilitado-comprar'],
    sections: [
```

6. `contrapropuesta`:
```ts
    id: 'contrapropuesta',
    name: 'Counteroffer Notification',
    subject: '¡Recibiste una contrapropuesta en la oferta {{Toyota Hilux 2018}}!',
    desc: 'Notifies the top bidder of a seller counteroffer and explains the counteroffer mechanic.',
    category: 'En vivo',
    stage: 'Negociación',
    leadsTo: ['propuesta-rechazada', 'habilitado-comprar'],
    sections: [
```

7. `propuesta-rechazada`:
```ts
    id: 'propuesta-rechazada',
    name: 'Rejected Proposal Notification',
    subject: '¡Rechazaste la propuesta en la oferta {{Toyota Yaris 2018}}!',
    desc: 'Confirms the bidder rejected the seller counteroffer and their consignment was released.',
    category: 'En vivo',
    stage: 'Negociación',
    leadsTo: ['oferta-terminada-postor'],
    sections: [
```

8. `negociacion-iniciada`:
```ts
    id: 'negociacion-iniciada',
    name: 'Negotiation Started Notification',
    subject: '¡Negociación iniciada con éxito!',
    desc: 'Confirms the bidder started a negotiation with the seller and shows the proposal + guarantee.',
    category: 'Negociable',
    stage: 'Inicio',
    leadsTo: ['contrapropuesta-negociable', 'ganaste-oferta-negociable', 'negociacion-finalizada'],
    sections: [
```

9. `nueva-negociacion-vendedor`:
```ts
    id: 'nueva-negociacion-vendedor',
    name: 'New Negotiation Started — Seller',
    subject: '¡Nueva negociación iniciada!',
    desc: 'Notifies the seller a buyer started a new negotiation with a proposal, the expectation gap, and prompts a response.',
    category: 'Negociable',
    stage: 'Inicio',
    leadsTo: ['vendedor-acepta-propuesta', 'negociacion-finalizada'],
    sections: [
```

10. `contrapropuesta-negociable`:
```ts
    id: 'contrapropuesta-negociable',
    name: 'Negotiable Counteroffer Notification',
    subject: '¡Recibiste una contrapropuesta en {{Toyota Hilux 2018}}!',
    desc: 'Notifies the bidder of a seller counteroffer on a negotiable listing, with round comparison and deadline.',
    category: 'Negociable',
    stage: 'Negociación',
    leadsTo: ['contrapropuesta-hecha', 'contrapropuesta-aceptada-comprador', 'contrapropuesta-rechazada-comprador'],
    sections: [
```

11. `contrapropuesta-hecha`:
```ts
    id: 'contrapropuesta-hecha',
    name: 'Counteroffer Made — Buyer',
    subject: '¡Hiciste una contrapropuesta en {{Toyota Hilux 2018}}!',
    desc: 'Confirms the buyer made a counteroffer and is waiting for the seller response within the round deadline.',
    category: 'Negociable',
    stage: 'Negociación',
    leadsTo: ['contrapropuesta-negociable', 'contrapropuesta-aceptada-comprador'],
    sections: [
```

12. `propuesta-expirara-ultima-notificacion`:
```ts
    id: 'propuesta-expirara-ultima-notificacion',
    name: 'Proposal Expiring — Last Notice',
    subject: '¡Última notificación! ¡La propuesta expirará!',
    desc: 'Final reminder that a negotiable proposal is about to expire, with the deadline penalty if no response is sent.',
    category: 'Negociable',
    stage: 'Alertas',
    leadsTo: ['negociacion-expirada'],
    sections: [
```

13. `propuesta-expirara-hhmm`:
```ts
    id: 'propuesta-expirara-hhmm',
    name: 'Proposal Expiring — Reminder',
    subject: '¡Propuesta expirará {{hh:mm}}!',
    desc: 'Reminds the recipient a negotiable proposal is waiting and will expire, prompting a response.',
    category: 'Negociable',
    stage: 'Alertas',
    leadsTo: ['propuesta-expirara-ultima-notificacion'],
    sections: [
```

14. `propuesta-por-expirar-muy-importante`:
```ts
    id: 'propuesta-por-expirar-muy-importante',
    name: 'Proposal Expiring — Urgent',
    subject: '¡Muy importante! ¡Propuesta por expirar {{hh:mm}}!',
    desc: 'Urgent escalation that a negotiable proposal is about to expire, prompting an immediate response.',
    category: 'Negociable',
    stage: 'Alertas',
    leadsTo: ['negociacion-expirada'],
    sections: [
```

- [ ] **Step 4: Verify every `leadsTo` id exists in the catalog**

Run:
```bash
grep -oE "id: '[a-zA-Z0-9-]+'" lib/emails.ts | sed "s/id: '//;s/'//" | sort -u > /tmp/ids.txt
grep -oE "leadsTo: \[[^]]*\]" lib/emails.ts | grep -oE "'[a-zA-Z0-9-]+'" | sed "s/'//g" | sort -u > /tmp/leadsto_ids.txt
comm -23 /tmp/leadsto_ids.txt /tmp/ids.txt
```
Expected: no output (every id referenced in a `leadsTo` array exists as a real email id). If anything prints, fix the typo in `lib/emails.ts`.

- [ ] **Step 5: Run the build**

Run: `npm run build`
Expected: succeeds with no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add lib/emails.ts
git commit -m "feat: add leadsTo, STAGE_ORDER and category color tokens to email catalog"
```

---

### Task 2: Sidebar — drop the per-category stage sub-list

**Files:**
- Modify: `app/page.tsx` (the `Sidebar` function, roughly lines 29-80)

**Interfaces:**
- Consumes: nothing new (same props as before: `categoryGroups`, `active`, `onSelect`, `query`, `onQuery`).
- Produces: no change to `Sidebar`'s external props/behavior for category selection; removes its ability to set `active.stage` directly (stage selection moves to the diagram in Task 4).

- [ ] **Step 1: Replace the `Sidebar` function body**

Replace the whole `Sidebar` function in `app/page.tsx` with:

```tsx
function Sidebar({
  categoryGroups, active, onSelect, query, onQuery,
}: {
  categoryGroups: [string, EmailTemplate[]][];
  active: { category: string | null; stage: string | null };
  onSelect: (category: string | null, stage: string | null) => void;
  query: string;
  onQuery: (q: string) => void;
}) {
  const pillStyle = (isActive: boolean) => ({
    display: 'block', width: '100%', textAlign: 'left' as const, padding: '7px 10px', borderRadius: '8px',
    border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px',
    background: isActive ? C.purple : 'transparent', color: isActive ? '#fff' : C.body, fontWeight: isActive ? 700 : 600,
  });

  return (
    <div style={{ position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <input
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder="Buscar correo…"
        style={{
          padding: '10px 14px', borderRadius: '10px', border: `1px solid ${C.divider}`, fontFamily: 'inherit',
          fontSize: '13px', color: C.ink, marginBottom: '12px', outline: 'none',
        }}
      />
      <button onClick={() => onSelect(null, null)} style={pillStyle(!active.category)}>
        Todos <span style={{ opacity: 0.7 }}>· {EMAILS.length}</span>
      </button>
      {categoryGroups.map(([category, emails]) => (
        <button
          key={category}
          onClick={() => onSelect(category, null)}
          style={{ ...pillStyle(active.category === category), fontWeight: 700 }}
        >
          {category} <span style={{ opacity: 0.6, fontWeight: 600 }}>· {emails.length}</span>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Run the build**

Run: `npm run build`
Expected: succeeds. (The `groupBy` helper is still used elsewhere in the file, so no unused-import errors.)

- [ ] **Step 3: Manual check**

Run: `npm run dev`, open `http://localhost:3000`. Confirm the sidebar shows `Todos`, `En vivo`, `Negociable` as plain pills with no sub-list under them, and clicking a category still filters the grid below (grouped view, same as before this task — the diagram doesn't exist yet).

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: simplify sidebar to category-only pills"
```

---

### Task 3: Card badge — category/stage tag with real accent color

**Files:**
- Modify: `app/page.tsx` (import line ~5, and the `EmailCard` function, roughly lines 90-124)

**Interfaces:**
- Consumes: `CATEGORY_GRADIENT` from `lib/emails.ts` (produced in Task 1); `C.slate` (already defined in `app/page.tsx`'s `C` palette, line 9).

- [ ] **Step 1: Import `CATEGORY_GRADIENT`**

In `app/page.tsx`, change:

```tsx
import { EMAILS, type EmailTemplate } from '@/lib/emails';
```

to:

```tsx
import { EMAILS, CATEGORY_GRADIENT, type EmailTemplate } from '@/lib/emails';
```

- [ ] **Step 2: Add the badge to `EmailCard`**

In the `EmailCard` function, change:

```tsx
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.ink, margin: 0 }}>{email.name}</h3>
          <p style={{ fontSize: '12px', color: C.body, margin: '4px 0 0', lineHeight: 1.45 }}>{email.desc}</p>
        </div>
```

to:

```tsx
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        <div>
          {email.category && email.stage && (
            <span
              style={{
                display: 'inline-block', marginBottom: '6px', padding: '3px 9px', borderRadius: '9999px',
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#fff',
                ...(CATEGORY_GRADIENT[email.category]
                  ? { backgroundImage: CATEGORY_GRADIENT[email.category] }
                  : { backgroundColor: C.slate }),
              }}
            >
              {email.category} · {email.stage}
            </span>
          )}
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.ink, margin: 0 }}>{email.name}</h3>
          <p style={{ fontSize: '12px', color: C.body, margin: '4px 0 0', lineHeight: 1.45 }}>{email.desc}</p>
        </div>
```

- [ ] **Step 3: Run the build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Manual check**

Run: `npm run dev`, open `http://localhost:3000`. Confirm cards for `En vivo` emails (e.g. "Ready to Bid — Participation") show an orange→purple badge reading `En vivo · Inicio`, and `Negociable` cards (e.g. "Negotiation Started Notification") show a teal→purple badge reading `Negociable · Inicio`. The single email with no `category`/`stage` (`fee-subascoins`) shows no badge.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add category/stage badge to email cards"
```

---

### Task 4: `FlowDiagram` component (static columns) + wire into the home page

**Files:**
- Create: `app/HomeFlowDiagram.tsx`
- Modify: `app/page.tsx` (imports, `HomePage` function's `<main>` body, roughly lines 126-212)

**Interfaces:**
- Consumes: `STAGE_ORDER`, `CATEGORY_SOLID`, `EmailTemplate` from `lib/emails.ts` (Task 1).
- Produces: `FlowDiagram({ category, emails, activeStage, onSelectStage })` component, exported from `app/HomeFlowDiagram.tsx`, consumed by `app/page.tsx`'s `HomePage` and later extended in Task 5.

- [ ] **Step 1: Create `app/HomeFlowDiagram.tsx`**

```tsx
'use client';

import type { EmailTemplate } from '@/lib/emails';
import { STAGE_ORDER, CATEGORY_SOLID } from '@/lib/emails';

const INK = '#14122b';
const DIVIDER = '#e7e1f7';

export function FlowDiagram({
  category, emails, activeStage, onSelectStage,
}: {
  category: string;
  emails: EmailTemplate[];
  activeStage: string | null;
  onSelectStage: (stage: string | null) => void;
}) {
  const stages = (STAGE_ORDER[category] ?? []).filter((stage) => emails.some((e) => e.stage === stage));
  const accent = CATEGORY_SOLID[category] ?? INK;

  if (stages.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex', gap: '20px', padding: '20px', marginBottom: '32px',
        background: '#fbfaff', border: `1px solid ${DIVIDER}`, borderRadius: '16px', overflowX: 'auto',
      }}
    >
      {stages.map((stage) => {
        const stageEmails = emails.filter((e) => e.stage === stage);
        const isActiveStage = activeStage === stage;
        return (
          <div key={stage} style={{ flex: '0 0 180px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => onSelectStage(isActiveStage ? null : stage)}
              style={{
                textAlign: 'left', border: 'none', cursor: 'pointer', background: 'none', padding: 0,
                fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
                color: isActiveStage ? accent : INK,
              }}
            >
              {stage} <span style={{ opacity: 0.5, fontWeight: 600 }}>· {stageEmails.length}</span>
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {stageEmails.map((email) => (
                <button
                  key={email.id}
                  onClick={() => onSelectStage(isActiveStage ? null : stage)}
                  style={{
                    textAlign: 'left', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer',
                    border: `1px solid ${isActiveStage ? accent : DIVIDER}`, background: '#fff',
                    fontSize: '12px', fontWeight: 600, color: INK, lineHeight: 1.3,
                  }}
                >
                  {email.name}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Wire it into `app/page.tsx`**

Change the import line:

```tsx
import { EMAILS, CATEGORY_GRADIENT, type EmailTemplate } from '@/lib/emails';
```

to:

```tsx
import { EMAILS, CATEGORY_GRADIENT, STAGE_ORDER, type EmailTemplate } from '@/lib/emails';
import { FlowDiagram } from './HomeFlowDiagram';
```

In the `HomePage` function, add a `showDiagram` variable right after the `filteredGroups` `useMemo` block:

```tsx
  const showDiagram = !!active.category && !!STAGE_ORDER[active.category] && !query.trim();
```

Then replace the `<main>` block:

```tsx
        <main>
          <h2 style={{ fontSize: '13px', fontWeight: 700, color: C.purple, letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 20px' }}>
            {filtered.length} {filtered.length === 1 ? 'email' : 'emails'}
          </h2>

          {filtered.length === 0 && (
            <p style={{ color: C.body, fontSize: '14px' }}>Sin resultados para esta búsqueda.</p>
          )}

          {filteredGroups
            ? filteredGroups.map(({ category, emails, stages }) => (
                <div key={category} style={{ marginBottom: '44px' }}>
                  {(filteredGroups.length > 1 || !active.category) && (
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: C.ink, margin: '0 0 16px' }}>{category}</h3>
                  )}
                  {stages.length > 0
                    ? stages.map(([stage, stageEmails]) => (
                        <div key={stage} style={{ marginBottom: '28px' }}>
                          <h4 style={{ fontSize: '12px', fontWeight: 700, color: C.accent, letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 12px' }}>{stage}</h4>
                          <EmailGrid emails={stageEmails} />
                        </div>
                      ))
                    : <EmailGrid emails={emails} />}
                </div>
              ))
            : <EmailGrid emails={filtered} />}
        </main>
```

with:

```tsx
        <main>
          <h2 style={{ fontSize: '13px', fontWeight: 700, color: C.purple, letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 20px' }}>
            {filtered.length} {filtered.length === 1 ? 'email' : 'emails'}
          </h2>

          {showDiagram && (
            <FlowDiagram
              category={active.category!}
              emails={EMAILS.filter((e) => (e.category ?? 'General') === active.category)}
              activeStage={active.stage}
              onSelectStage={(stage) => setActive({ category: active.category, stage })}
            />
          )}

          {filtered.length === 0 && (
            <p style={{ color: C.body, fontSize: '14px' }}>Sin resultados para esta búsqueda.</p>
          )}

          {showDiagram ? (
            <EmailGrid emails={filtered} />
          ) : filteredGroups ? (
            filteredGroups.map(({ category, emails, stages }) => (
              <div key={category} style={{ marginBottom: '44px' }}>
                {(filteredGroups.length > 1 || !active.category) && (
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: C.ink, margin: '0 0 16px' }}>{category}</h3>
                )}
                {stages.length > 0
                  ? stages.map(([stage, stageEmails]) => (
                      <div key={stage} style={{ marginBottom: '28px' }}>
                        <h4 style={{ fontSize: '12px', fontWeight: 700, color: C.accent, letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 12px' }}>{stage}</h4>
                        <EmailGrid emails={stageEmails} />
                      </div>
                    ))
                  : <EmailGrid emails={emails} />}
              </div>
            ))
          ) : (
            <EmailGrid emails={filtered} />
          )}
        </main>
```

- [ ] **Step 3: Run the build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Manual check**

Run: `npm run dev`, open `http://localhost:3000`. Click `En vivo` in the sidebar: a horizontal diagram appears above the grid with columns `Inicio`, `Resultado`, `Negociación`, `Habilitación`, `Cierre` (in that order), each listing the right email names. Click a chip or column header: the grid below filters to that stage, and the clicked column/chip highlights in orange. Click `Todos`: diagram disappears, grid returns to the grouped-by-category-then-stage view exactly as before this task. Typing in the search box also hides the diagram.

- [ ] **Step 5: Commit**

```bash
git add app/HomeFlowDiagram.tsx app/page.tsx
git commit -m "feat: add per-category flow diagram to the home page"
```

---

### Task 5: Connector lines + hover highlight in `FlowDiagram`

**Files:**
- Modify: `app/HomeFlowDiagram.tsx`

**Interfaces:**
- Consumes: `EmailTemplate.leadsTo` (Task 1).
- Produces: no change to `FlowDiagram`'s external props — same signature as Task 4, purely a visual enhancement.

- [ ] **Step 1: Replace the whole file with the version that draws lines**

```tsx
'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import type { EmailTemplate } from '@/lib/emails';
import { STAGE_ORDER, CATEGORY_SOLID } from '@/lib/emails';

const INK = '#14122b';
const DIVIDER = '#e7e1f7';

interface Line {
  fromId: string;
  toId: string;
  x1: number; y1: number; x2: number; y2: number;
}

export function FlowDiagram({
  category, emails, activeStage, onSelectStage,
}: {
  category: string;
  emails: EmailTemplate[];
  activeStage: string | null;
  onSelectStage: (stage: string | null) => void;
}) {
  const stages = (STAGE_ORDER[category] ?? []).filter((stage) => emails.some((e) => e.stage === stage));
  const accent = CATEGORY_SOLID[category] ?? INK;

  const containerRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [lines, setLines] = useState<Line[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const compute = () => {
      const containerBox = container.getBoundingClientRect();
      const next: Line[] = [];
      emails.forEach((email) => {
        const fromEl = chipRefs.current[email.id];
        if (!fromEl || !email.leadsTo) return;
        const fromBox = fromEl.getBoundingClientRect();
        email.leadsTo.forEach((toId) => {
          const toEl = chipRefs.current[toId];
          if (!toEl) return;
          const toBox = toEl.getBoundingClientRect();
          next.push({
            fromId: email.id,
            toId,
            x1: fromBox.right - containerBox.left,
            y1: fromBox.top + fromBox.height / 2 - containerBox.top,
            x2: toBox.left - containerBox.left,
            y2: toBox.top + toBox.height / 2 - containerBox.top,
          });
        });
      });
      setLines(next);
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [emails, stages.length]);

  if (stages.length === 0) return null;

  const isRelated = (id: string) =>
    hoveredId === id
    || lines.some((l) => (l.fromId === hoveredId && l.toId === id) || (l.toId === hoveredId && l.fromId === id));

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative', display: 'flex', gap: '20px', padding: '20px', marginBottom: '32px',
        background: '#fbfaff', border: `1px solid ${DIVIDER}`, borderRadius: '16px', overflowX: 'auto',
      }}
    >
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {lines.map((l) => {
          const active = hoveredId !== null && (l.fromId === hoveredId || l.toId === hoveredId);
          return (
            <line
              key={`${l.fromId}-${l.toId}`}
              x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
              stroke={accent}
              strokeWidth={active ? 2 : 1}
              opacity={hoveredId === null ? 0 : active ? 0.9 : 0.05}
            />
          );
        })}
      </svg>

      {stages.map((stage) => {
        const stageEmails = emails.filter((e) => e.stage === stage);
        const isActiveStage = activeStage === stage;
        return (
          <div key={stage} style={{ flex: '0 0 180px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => onSelectStage(isActiveStage ? null : stage)}
              style={{
                textAlign: 'left', border: 'none', cursor: 'pointer', background: 'none', padding: 0,
                fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
                color: isActiveStage ? accent : INK,
              }}
            >
              {stage} <span style={{ opacity: 0.5, fontWeight: 600 }}>· {stageEmails.length}</span>
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {stageEmails.map((email) => (
                <button
                  key={email.id}
                  ref={(el) => { chipRefs.current[email.id] = el; }}
                  onClick={() => onSelectStage(isActiveStage ? null : stage)}
                  onMouseEnter={() => setHoveredId(email.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    textAlign: 'left', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer',
                    border: `1px solid ${isActiveStage ? accent : DIVIDER}`, background: '#fff',
                    fontSize: '12px', fontWeight: 600, color: INK, lineHeight: 1.3,
                    opacity: hoveredId === null || isRelated(email.id) ? 1 : 0.4,
                    transition: 'opacity .15s',
                  }}
                >
                  {email.name}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Run the build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Manual check**

Run: `npm run dev`, open `http://localhost:3000`, click `Negociable`. Confirm no lines are visible by default. Hover over "Negotiable Counteroffer Notification" (`contrapropuesta-negociable`, in the `Negociación` column): lines should appear connecting it to `Counteroffer Made — Buyer`, `Counteroffer Accepted — Buyer`, and `Counteroffer Rejected — Buyer` in the `Negociación`/`Resultado` columns, all other chips should dim slightly, and moving the mouse away should hide the lines again. Resize the browser window while hovering: lines should stay aligned with the chips (recomputed on resize).

- [ ] **Step 4: Commit**

```bash
git add app/HomeFlowDiagram.tsx
git commit -m "feat: draw hover-highlighted connector lines in the flow diagram"
```

---

## Self-Review

**Spec coverage:**
- Section A (sidebar simplified) → Task 2.
- Section B (flow diagram, stage order, click-to-filter, hover anti-clutter) → Tasks 4 and 5.
- Section C (card badge with real gradient) → Task 3.
- Section D (`leadsTo`, `STAGE_ORDER`, color tokens) → Task 1.
- Section E (search bypasses diagram) → handled by `showDiagram`'s `!query.trim()` check in Task 4.

**Placeholder scan:** none — every step has complete, runnable code or an exact command with expected output.

**Type consistency:** `FlowDiagram`'s props (`category: string; emails: EmailTemplate[]; activeStage: string | null; onSelectStage: (stage: string | null) => void`) are identical across Task 4 (creation) and Task 5 (enhancement), and match the call site in `app/page.tsx`. `CATEGORY_GRADIENT`/`CATEGORY_SOLID`/`STAGE_ORDER`/`leadsTo` are defined once in Task 1 and referenced with the same names everywhere else.
