---
name: email-from-image
description: Convierte la captura/imagen de un correo VMC Subastas en un correo armado del catálogo (entrada en lib/emails.ts usando las secciones del motor). Úsala cuando el usuario pase una imagen de un email y pida "hagamos este correo", "nuevo mail", "arma este correo", o similar.
---

# Email desde imagen → catálogo

Convierte una imagen de un correo en una nueva entrada de `lib/emails.ts`. El header y el
pre-footer/footer glass son **automáticos** (los pone `generateEmail`): solo modelas el **cuerpo**
como una lista de secciones.

## Flujo

1. **Lee la imagen** y descompón el cuerpo (entre header y pre-footer) en bloques visuales, de arriba a abajo.
2. **Mapea cada bloque** a un tipo de sección (tabla abajo).
3. **Inserta los espaciadores** (`spacer`) entre bloques con las distancias del set patrones: `8 / 10 / 12 / 14 / 16 / 20 / 24 / 30`.
4. **Escribe el objeto** `EmailTemplate` y agrégalo al array `EMAILS` en `lib/emails.ts` (usa los helpers `S(type, content)` y `SP(height)` que ya existen ahí).
5. **Verifica**: `npx tsc --noEmit` (limpia `.next/types` si reaparece un error stale) y un smoke con `npm run dev` + `curl` al detalle `/correo/<id>`.

## Reglas de texto (críticas)

- `{{variable}}` → **merge tags**: déjalos LITERALES (los reemplaza la plataforma de envío). NO los marques.
- `**texto**` → acento naranja Concorde `#ed8936` (palabras clave; 1–3 por bloque, regla de patrones.md).
- `__texto__` → negrita oscura (énfasis tipo "Inicia el proceso de compra").
- `[[123]]` → número en Poppins morado (cifras destacadas: %, montos, conteos).
- Si una keyword es a la vez merge tag y acento: `**{{var}}**`.

## Tipos de sección (campos de `content`)

| Tipo | Campos | Para qué |
|------|--------|----------|
| `title` | `eyebrow`, `text` | H1 (24/800). `eyebrow:''` = sin pill. |
| `text` | `text` | Párrafo. Soporta los marcadores de arriba. |
| `panel` | `title`, `body`, `iconUrl?`, `badge?('white')`, `imageUrl?`, `imageW?`, `imageH?` | Tarjeta lavanda. Badge con ícono (vault o blanco) e imagen lateral opcional. |
| `features` | `heading`, `i1..i3` (url ícono), `t1..t3` | Fila de 3 columnas con chips + divisores. |
| `stats` | `s1v/s1l … s3v/s3l` | 3 cifras grandes (Poppins) + etiquetas. |
| `details` | `l1/v1 … l3/v3` | Lista clave-valor: etiqueta naranja izq + valor bold der. |
| `note` | `title`, `body` | Caja blanca con borde + badge "!" naranja (aviso/Recuerda en caja). |
| `divider` | — | Línea fina lavanda. |
| `cta` | `text`, `url` | Botón pill gradiente Concorde (orange→vault), centrado. |
| `table` | `r1k/r1v … r3k/r3v` | Tabla concepto/valor en panel lavanda (valores Poppins). |
| `image` | `url`, `alt` | Imagen ancho completo, esquinas redondeadas. |
| `spacer` | `height` | Espacio vertical (`SP('20')`). |

Nota: el "Recuerda" puede venir **en caja** (usa `note`) o como **texto plano** (usa `text` con
`**Recuerda:**` + párrafos). Mira la imagen para decidir.

## Estructura del objeto

```ts
{
  id: 'slug-url',                 // kebab-case, único; será /correo/<id>
  name: 'Nombre en inglés',       // UI del catálogo (en inglés)
  subject: 'Asunto real',         // en español; puede tener {{merge tags}}
  desc: 'Short English description.',
  sections: [
    S('title', { eyebrow: '', text: '…' }),
    SP('24'),
    // …secciones en orden…
  ],
}
```

## Recordatorios

- `name`/`desc` van en **inglés** (UI); `subject` y el contenido de las secciones en **español** (es lo que se envía).
- Imágenes/íconos: reutiliza las URLs del CDN `https://cdn.vmcsubastas.com/...` que ya aparecen en otros correos.
- No toques header ni footer: son del motor (`glassHeader`/`glassFooter` en `lib/email-templates.ts`).
- Si un bloque visual no encaja en ningún tipo, agrega un tipo nuevo a `email-templates.ts` (union + `SECTION_LABELS` + `createSection` defaults + un `case` en `renderSection`) y documéntalo aquí.
