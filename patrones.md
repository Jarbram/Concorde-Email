# Patrones — Plantilla de Email (VMC Subastas)

Sistema de diseño extraído del correo `2026-06-25.html`. Sirve como guía/tokens para construir nuevos HTMLs de email con el mismo lenguaje visual.

---

## 1. Paleta de colores (tokens)

| Token            | Hex       | Uso en el correo                                              |
|------------------|-----------|--------------------------------------------------------------|
| `--purple-900`   | `#391383` | Header, títulos, badges sólidos, pre-footer izq.             |
| `--indigo-900`   | `#0E016C` | Texto de cuerpo y footer                                     |
| `--navy-900`     | `#00005E` | Pre-footer derecho, texto del botón                          |
| `--coral-accent` | `#f1705d` | Resaltado de palabras clave (*1 de Julio*, *Fee*, *SIN FEE*) |
| `--purple-text`  | `#5a4d75` | Texto secundario dentro de paneles                          |
| `--lavender-100` | `#f5f3fe` | Fondo de paneles/cards                                       |
| `--lavender-300` | `#d5cfe8` | Divisores (líneas verticales)                                |
| `--gray-link`    | `#A298B3` | Link `www.vmcsubastas.com` del footer                        |
| `--bg`           | `#FAFAFA` | Fondo del email / texto sobre morado                         |
| `--white`        | `#FFFFFF` | Fondo del contenedor, badges blancos                         |

**Regla de acento:** el coral `#f1705d` SIEMPRE va en `font-weight:700–800` y solo sobre 1–3 palabras clave por bloque. Nunca en frases completas.

---

## 2. Tipografía

**Familias (3 stacks, por zona):**

- `'Plus Jakarta Sans', Arial, Helvetica, sans-serif` → titulares y paneles (contenido "nuevo")
- `'Buenos Aires', Arial, helvetica, Calibri` → cuerpo y footer
- `'Poppins', Helvetica, Arial, sans-serif` → pre-footer (bloque de marca/CTA)

**Escala de tamaños por rol:**

| Rol                       | Size   | Weight | Line-height    | Letter-spacing | Color     |
|---------------------------|--------|--------|----------------|----------------|-----------|
| **H1** (título principal) | `24px` | 800    | `1.25`         | `-0.02em`      | `#391383` |
| **H2** (heading sección)  | `14px` | 800    | `1.3`          | —              | `#391383` |
| **Panel título**          | `14px` | 700    | `1.35`         | —              | `#391383` |
| **Body**                  | `14px` | 400    | `22px` (≈1.57) | —              | `#0E016C` |
| **Panel texto**           | `14px` | 400    | `1.45`         | —              | `#5a4d75` |
| **Feature 3-col**         | `12px` | 400    | `1.35`         | —              | `#5a4d75` |
| **Footer link**           | `9px`  | 700    | `22px`         | —              | `#0E016C` |
| **Legal**                 | `8px`  | 400    | `13px`         | —              | `#0E016C` |
| Pre-footer marca          | `21px` | 600    | `1.5`          | —              | `#FAFAFA` |
| Pre-footer tagline        | `16px` | 400    | `1.5`          | —              | `#FAFAFA` |
| Botón pill                | `13px` | 600    | `1.5`          | —              | `#00005E` |
| Footer www                | `24px` | 700    | `28px`         | —              | `#A298B3` |

**Patrones detectados:**

- El `letter-spacing:-0.02em` aparece **solo en el H1**. Todo lo demás usa tracking normal.
- Jerarquía por **peso + color**, no por tamaño: H1 y H2 comparten color `#391383` y weight 800; el H1 se distingue por 24px vs 14px.
- Tamaños usados: `24 / 21 / 16 / 14 / 13 / 12 / 9 / 8`. No hay valores intermedios → escala discreta.

---

## 3. Espaciado vertical (spacer rows `<td height>`)

Valores usados: **`6 · 8 · 20 · 21 · 26 · 30`** px

| Distancia      | Cuándo                                                              |
|----------------|--------------------------------------------------------------------|
| `30px`         | Antes/después de secciones mayores (título↔cuerpo, panel↔pre-footer) |
| `20px`         | Separador estándar entre bloques                                   |
| `8px` / `6px`  | Micro-espaciado dentro de un componente                            |

Padding interno: paneles `14px 12px`, secciones full `0 16px 14px`, header del contenedor `20px`.

---

## 4. Componentes recurrentes

**Panel lavanda (card)**
```
bgcolor=#f5f3fe · border-radius:8px · max-width:500px · padding:14px 12px
```

**Badge circular**
```
48×48 · border-radius:50% · bg #391383 (sólido) ó #FFFFFF (variante) · icono 30–38px centrado
```

**Divisor vertical** (entre columnas de features)
```html
<table width="1" height="40" bgcolor="#d5cfe8"><tr><td></td></tr></table>
```

**Botón pill**
```
144×34 · border-radius:9999px · bg #FAFAFA · texto #00005E 13px/600
```

**Layout maestro:** contenedor `600px` centrado, `bgcolor #ffffff`, todo en tablas anidadas (email-safe), imágenes `display:block`, ancho `width` explícito en cada celda.

---

## 5. Esqueleto de la plantilla

```
┌─ HEADER (bgcolor #391383, logo centrado) ──────────────┐
│ [spacer 20]                                            │
│ H1  (24/800, #391383, -0.02em, centrado)               │
│ [spacer 30]                                            │
│ BODY párrafo (14/400, #0E016C, align left)             │
│ [spacer 20]                                            │
│ PANEL lavanda  → badge + texto                         │
│ [spacer 20]                                            │
│ H2 sección + fila de 3 features (icono+texto+divisor)  │
│ [spacer 20]                                            │
│ PANEL lavanda (variante badge blanco)                  │
│ [spacer 30]                                            │
├─ PRE-FOOTER (2 col 320×223: #391383 | #00005E + CTA) ──┤
├─ FOOTER (#FFFFFF: www link, links 9px, social, legal) ─┤
└────────────────────────────────────────────────────────┘
```

---

## 6. Reglas rápidas (checklist)

- [ ] Contenedor `600px`, centrado, `bgcolor #ffffff`, padding `20px`.
- [ ] Maquetar con **tablas anidadas** (no flex/grid) — email-safe.
- [ ] Imágenes con `display:block`, `width`/`height` explícitos y `alt`.
- [ ] H1 único por correo: `24px/800`, `#391383`, `-0.02em`, centrado.
- [ ] Acento coral `#f1705d` solo en palabras clave + weight 700–800.
- [ ] Espaciado en múltiplos del set `6/8/20/30`; usar `<td height="N">`.
- [ ] Paneles: `#f5f3fe`, `radius 8px`, `max-width 500px`, `padding 14px 12px`.
- [ ] Footer legal `8px` + link "REMOVER SUSCRIPCIÓN" (Ley N° 28493).
- [ ] Codificar tildes/ñ (`UTF-8`) — el archivo original tiene mojibake (`Ã³`, `Â¿`).
