# Home flow redesign — spec

Date: 2026-07-01

## Problema

El home actual (`app/page.tsx`) tiene buscador + sidebar (categoría → etapa) + grid de cards.
Tres problemas concretos:

1. **No se ve el flujo del negocio.** Las etapas de una categoría (Inicio, Negociación,
   Resultado…) se listan planas en el sidebar; no comunican secuencia ni ramificaciones
   (ej. qué correo puede derivar en cuál otro).
2. **Las cards no distinguen variantes de un vistazo.** Un correo "Negociable" (CTA teal)
   y uno "En vivo" (CTA morado) se ven igual en la grilla hasta que abrís el preview.
3. **No se ve la relación entre correos.** Ej. `contrapropuesta-negociable` puede terminar en
   `contrapropuesta-aceptada-comprador`, `contrapropuesta-rechazada-comprador` o una nueva ronda —
   hoy esa ramificación no está representada en ningún lado.

## Diseño

### A. Sidebar simplificado

El sidebar pierde la sub-lista de etapas. Queda: buscador + lista plana de categorías
(`Todos`, `En vivo`, `Negociable`, + las que existan). Las etapas se mueven al diagrama (sección B).

### B. Diagrama de flujo por categoría

Al seleccionar una categoría (no aplica en "Todos"), arriba del grid aparece un diagrama
horizontal:

- Una columna por etapa, en **orden real de negocio** (fijo por código, no por orden de
  inserción en el array — ver `STAGE_ORDER` en sección D).
- Dentro de cada columna, los correos de esa etapa como chips apilados verticalmente.
- Líneas conectan un correo con los correos a los que puede derivar (`leadsTo`).
- **Anti-clutter:** las líneas no se muestran todas a la vez. Solo al hacer hover sobre un
  chip se resaltan sus conexiones directas (entrantes + salientes); el resto de líneas y
  chips no relacionados se atenúan (opacity baja).
- Click en un chip filtra el grid de abajo a la etapa de ese chip (mismo comportamiento que
  hoy tiene el sidebar de etapas).
- Con "Todos" seleccionado o con texto en el buscador, se mantiene el grid agrupado plano
  como hoy — el diagrama no aplica.

Implementación: columnas con CSS grid/flex; posiciones de los chips vía `ref` +
`getBoundingClientRect` relativo al contenedor; líneas dibujadas en un `<svg>` absoluto
superpuesto, recalculado en mount y en resize de ventana (sin `ResizeObserver`, es una
herramienta interna de bajo tráfico).

### C. Badge de variante en cada card

Cada card del grid gana un tag chico "Categoría · Etapa", coloreado con el acento real de
esa variante: morado (`#3b1782`) para `En vivo`, teal (mismo gradiente que ya usa el CTA
`variant: negotiable`, `G_NEGOTIABLE` en `email-templates.ts`) para `Negociable`.

### D. Cambios de datos (`lib/emails.ts`)

- Nuevo campo opcional `leadsTo?: string[]` en `EmailTemplate` (ids de correos a los que
  puede derivar), usado por el diagrama para dibujar líneas.
- Nueva constante `STAGE_ORDER: Record<string, string[]>` con el orden real de etapas por
  categoría:
  ```
  'En vivo':    ['Inicio', 'Resultado', 'Negociación', 'Habilitación', 'Cierre']
  'Negociable': ['Inicio', 'Negociación', 'Alertas', 'Resultado']
  ```
- Mapeo `leadsTo` **best-effort** (no conozco las reglas de negocio exactas de VMC —
  a corregir en la revisión de este spec):

  | id | leadsTo (borrador) |
  |---|---|
  | `listo-participar` | `mejor-postor`, `ganador-directo` |
  | `mejor-postor` | `contrapropuesta`, `opcion-compra`, `habilitado-comprar`, `oferta-terminada` |
  | `ganador-directo` | `habilitado-comprar` |
  | `oportunidad-compra` | `habilitado-comprar` |
  | `opcion-compra` | `habilitado-comprar` |
  | `contrapropuesta` | `propuesta-rechazada`, `habilitado-comprar` |
  | `propuesta-rechazada` | `oferta-terminada-postor` |
  | `negociacion-iniciada` | `contrapropuesta-negociable`, `ganaste-oferta-negociable`, `negociacion-finalizada` |
  | `nueva-negociacion-vendedor` | `vendedor-acepta-propuesta`, `negociacion-finalizada` |
  | `contrapropuesta-negociable` | `contrapropuesta-hecha`, `contrapropuesta-aceptada-comprador`, `contrapropuesta-rechazada-comprador` |
  | `contrapropuesta-hecha` | `contrapropuesta-negociable`, `contrapropuesta-aceptada-comprador` |
  | `propuesta-expirara-hhmm` | `propuesta-expirara-ultima-notificacion` |
  | `propuesta-expirara-ultima-notificacion` | `negociacion-expirada` |
  | `propuesta-por-expirar-muy-importante` | `negociacion-expirada` |

  Correos terminales sin `leadsTo`: `habilitado-comprar`, `oferta-terminada`,
  `oferta-terminada-postor`, `negociacion-finalizada`, `ganaste-oferta-negociable`,
  `negociacion-expirada`, `contrapropuesta-rechazada-comprador`,
  `contrapropuesta-aceptada-comprador`, `vendedor-acepta-propuesta`.

### E. Búsqueda

Sin cambios: escribir en el buscador sigue mostrando el grid plano filtrado (sin diagrama),
igual que hoy.

## Fuera de alcance

- No se toca `lib/email-templates.ts` (el motor de render de secciones).
- No se agregan nuevos correos al catálogo.
- No se cambia la página de detalle `/correo/[id]`.
