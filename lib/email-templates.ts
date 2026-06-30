/* ═══════════════════════════════════════════════════════════════════════════
   Secciones de correo VMC Subastas — layout original + estilo Concorde
   Tokens y distancias según patrones.md. Acento naranja solo en palabras clave.
   Marcadores de resaltado: **acento 800** · [[número morado 800]]
   Los merge tags {{variable}} pasan LITERALES (no se tocan) para tu plataforma de envío.
   ═══════════════════════════════════════════════════════════════════════════ */

const FONT_BODY = "'Plus Jakarta Sans', Arial, Helvetica, sans-serif";
const FONT_HEADING = "'Plus Jakarta Sans', Arial, Helvetica, sans-serif";
const FONT_NUMBER = "'Poppins', 'Plus Jakarta Sans', Arial, Helvetica, sans-serif"; // números
const C = {
  purple: '#3b1782', dark: '#0E016C', body: '#5a4d75',
  lavender: '#f5f3fe', accent: '#ed8936', divider: '#d5cfe8',
  navy: '#00005E', footerLink: '#A298B3', white: '#FFFFFF', bg: '#FAFAFA',
  border: '#e7e1f7',
};
const G_VAULT = 'linear-gradient(135deg,#8460e5 0%,#3b1782 100%)';   // badges (vault)
const G_PRIMARY = 'linear-gradient(135deg,#ed8936 0%,#8460e5 100%)'; // botón Concorde (orange→vault)
const G_PANEL = 'linear-gradient(135deg,#f6f3fe 0%,#efe9fb 100%)';
const GLOSS = 'inset 0 1px 0 rgba(255,255,255,0.35)';
const CONTAINER_W = '600';

export interface Section {
  id: string;
  type: 'title' | 'text' | 'panel' | 'features' | 'icon-text' | 'stats' | 'cta' | 'image' | 'spacer' | 'table' | 'details' | 'divider' | 'note';
  content: Record<string, string>;
}

export const SECTION_LABELS: Record<Section['type'], string> = {
  title: 'Título',
  text: 'Párrafo',
  panel: 'Panel card',
  features: 'Fila de 3 features',
  'icon-text': 'Icono + texto',
  stats: 'Estadísticas',
  cta: 'Botón CTA',
  image: 'Imagen',
  spacer: 'Espaciador',
  table: 'Tabla datos',
  details: 'Lista de datos',
  divider: 'Divisor',
  note: 'Nota / aviso',
};

export function createSection(type: Section['type']): Section {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const defaults: Record<Section['type'], Record<string, string>> = {
    title: { eyebrow: '', text: 'Título de la sección' },
    text: { text: 'Escribe tu contenido aquí. Usa **palabra** para acento o [[123]] para número.' },
    panel: { title: 'Título del panel', body: 'Contenido del panel.', iconUrl: '', badge: '', imageUrl: '', imageW: '85', imageH: '57' },
    features: { heading: '¿Qué debes tener en cuenta?', i1: '', t1: 'Texto 1', i2: '', t2: 'Texto 2', i3: '', t3: 'Texto 3' },
    'icon-text': { icon: '📌', title: 'Título del item', text: 'Descripción del item.' },
    stats: { s1v: '99', s1l: 'Etiqueta 1', s2v: '99', s2l: 'Etiqueta 2', s3v: '99', s3l: 'Etiqueta 3' },
    cta: { text: 'Click aquí', url: 'https://' },
    image: { url: 'https://', alt: 'Imagen' },
    spacer: { height: '20' },
    table: { r1k: 'Concepto 1', r1v: 'Valor 1', r2k: 'Concepto 2', r2v: 'Valor 2', r3k: 'Concepto 3', r3v: 'Valor 3' },
    details: { l1: 'Etiqueta 1:', v1: 'Valor 1', l2: 'Etiqueta 2:', v2: 'Valor 2', l3: '', v3: '' },
    divider: {},
    note: { title: 'Recuerda:', body: 'Texto del aviso importante para el usuario.' },
  };
  return { id, type, content: { ...defaults[type] } };
}

function esc(s: string) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

/** Escapa y aplica resaltado: **acento naranja 800** · __negrita oscura 700__ · [[número Poppins 800]].
    Los merge tags {{variable}} quedan intactos. */
function hl(s: string): string {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, `<strong style="font-weight:800;color:${C.accent};">$1</strong>`)
    .replace(/__(.+?)__/g, `<strong style="font-weight:700;color:${C.dark};">$1</strong>`)
    .replace(/\[\[(.+?)\]\]/g, `<strong style="font-weight:800;color:${C.purple};font-family:${FONT_NUMBER};">$1</strong>`);
}

// panel lavanda Concorde (gradiente + borde + radio) — patrones: max-width 500
const panelOpen = `<table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" bgcolor="${C.lavender}" style="border-radius:14px;border:1px solid ${C.border};background-image:${G_PANEL};max-width:500px;"><tr><td style="padding:16px 16px;">`;
const panelClose = `</td></tr></table>`;

function badgeCell(iconUrl: string, white: boolean): string {
  const box = white
    ? `bgcolor="#FFFFFF" style="border-radius:50%;border:1px solid ${C.border};box-shadow:inset 0 1px 0 rgba(255,255,255,0.6);"`
    : `bgcolor="${C.purple}" style="border-radius:50%;background-image:${G_VAULT};box-shadow:${GLOSS};"`;
  return `<td width="48" valign="middle"><table border="0" cellpadding="0" cellspacing="0" width="48" height="48" ${box}><tr><td align="center" valign="middle" width="48" height="48"><img src="${esc(iconUrl)}" width="30" height="30" alt="" border="0" style="display:block;"></td></tr></table></td>`;
}

function chipCell(iconUrl: string): string {
  return `<td width="32%" align="center" style="padding:0 6px;"><table border="0" cellpadding="0" cellspacing="0" width="58" height="58" align="center" bgcolor="${C.lavender}" style="border-radius:50%;border:1px solid ${C.border};"><tr><td align="center" valign="middle" width="58" height="58"><img src="${esc(iconUrl)}" width="34" height="34" alt="" border="0" style="display:block;margin:0 auto;"></td></tr></table></td>`;
}

const vDivider = `<table border="0" cellpadding="0" cellspacing="0" width="1" height="40" bgcolor="${C.divider}"><tr><td></td></tr></table>`;

function renderSection(s: Section): string {
  const c = s.content;
  switch (s.type) {
    case 'title': {
      const eyebrow = c.eyebrow
        ? `<tr><td align="center" style="padding:0 16px 12px;font-family:${FONT_HEADING};"><table border="0" cellpadding="0" cellspacing="0" align="center"><tr><td bgcolor="#fdeee0" style="border-radius:9999px;padding:5px 13px;"><span style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${C.accent};font-family:${FONT_HEADING};">${esc(c.eyebrow)}</span></td></tr></table></td></tr>`
        : '';
      return `${eyebrow}<tr><td align="center" style="font-size:24px;font-weight:800;line-height:1.25;color:${C.purple};letter-spacing:-0.02em;font-family:${FONT_HEADING};padding:0 16px;"><b>${esc(c.text)}</b></td></tr>`;
    }
    case 'text':
      return `<tr><td align="left" style="font-size:14px;font-family:${FONT_BODY};line-height:22px;color:${C.dark};padding:0 16px;">${hl(c.text)}</td></tr>`;
    case 'panel': {
      const titleP = c.title ? `<p style="margin:0${(c.body || c.iconUrl || c.imageUrl) ? ' 0 12px' : ''};font-size:14px;font-weight:700;line-height:1.35;color:${C.purple};font-family:${FONT_HEADING};">${hl(c.title)}</p>` : '';
      const bodyP = `<p style="margin:0;font-size:14px;line-height:1.45;color:${C.body};font-family:${FONT_HEADING};">${hl(c.body)}</p>`;
      const inner = (c.iconUrl || c.imageUrl)
        ? `${titleP}<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>${c.iconUrl ? badgeCell(c.iconUrl, c.badge === 'white') + '<td width="14"></td>' : ''}<td valign="middle">${bodyP}</td>${c.imageUrl ? `<td width="8"></td><td width="${esc(c.imageW || '85')}" valign="middle" align="right"><img src="${esc(c.imageUrl)}" width="${esc(c.imageW || '85')}" height="${esc(c.imageH || '57')}" alt="" border="0" style="display:block;"></td>` : ''}</tr></table>`
        : `${titleP}${bodyP}`;
      return `<tr><td align="center" style="padding:0 16px;font-family:${FONT_HEADING};">${panelOpen}${inner}${panelClose}</td></tr>`;
    }
    case 'features':
      return `<tr><td align="center" style="padding:4px 16px 0;font-family:${FONT_HEADING};">
<table border="0" cellpadding="0" cellspacing="0" width="100%" align="center">
<tr><td align="center" style="padding-bottom:14px;"><span style="font-size:14px;font-weight:800;line-height:1.3;color:${C.purple};font-family:${FONT_HEADING};"><b>${esc(c.heading)}</b></span></td></tr>
<tr><td><table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>${chipCell(c.i1)}<td width="2%"></td>${chipCell(c.i2)}<td width="2%"></td>${chipCell(c.i3)}</tr>
<tr><td height="12" colspan="5"></td></tr>
<tr>
<td width="32%" align="center" valign="top" style="padding:0 6px;font-size:12px;line-height:1.35;color:${C.body};font-family:${FONT_HEADING};">${hl(c.t1)}</td>
<td width="2%" align="center" valign="top">${vDivider}</td>
<td width="32%" align="center" valign="top" style="padding:0 6px;font-size:12px;line-height:1.35;color:${C.body};font-family:${FONT_HEADING};">${hl(c.t2)}</td>
<td width="2%" align="center" valign="top">${vDivider}</td>
<td width="32%" align="center" valign="top" style="padding:0 6px;font-size:12px;line-height:1.35;color:${C.body};font-family:${FONT_HEADING};">${hl(c.t3)}</td>
</tr></table></td></tr></table></td></tr>`;
    case 'icon-text':
      return `<tr><td align="center" style="padding:0 16px;font-family:${FONT_HEADING};">${panelOpen}
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr><td width="48" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="48" height="48" bgcolor="${C.purple}" style="border-radius:50%;background-image:${G_VAULT};box-shadow:${GLOSS};"><tr><td align="center" valign="middle"><span style="font-size:22px;">${esc(c.icon)}</span></td></tr></table></td>
<td width="14"></td>
<td valign="top"><p style="margin:0;font-size:14px;line-height:1.45;color:${C.body};font-family:${FONT_HEADING};"><b style="color:${C.purple};">${esc(c.title)}</b><br>${hl(c.text)}</p></td>
</tr></table>${panelClose}</td></tr>`;
    case 'stats':
      return `<tr><td align="center" style="padding:0 16px;font-family:${FONT_HEADING};">${panelOpen}
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td width="32%" align="center"><span style="display:block;font-size:20px;font-weight:800;color:${C.purple};font-family:${FONT_NUMBER};">${esc(c.s1v)}</span><span style="font-size:10px;color:${C.body};text-transform:uppercase;">${esc(c.s1l)}</span></td>
<td width="2%">${vDivider}</td>
<td width="32%" align="center"><span style="display:block;font-size:20px;font-weight:800;color:${C.purple};font-family:${FONT_NUMBER};">${esc(c.s2v)}</span><span style="font-size:10px;color:${C.body};text-transform:uppercase;">${esc(c.s2l)}</span></td>
<td width="2%">${vDivider}</td>
<td width="32%" align="center"><span style="display:block;font-size:20px;font-weight:800;color:${C.purple};font-family:${FONT_NUMBER};">${esc(c.s3v)}</span><span style="font-size:10px;color:${C.body};text-transform:uppercase;">${esc(c.s3l)}</span></td>
</tr></table>${panelClose}</td></tr>`;
    case 'cta':
      return `<tr><td align="center"><a href="${esc(c.url)}" target="_blank" style="display:inline-block;background:${C.purple};background-image:${G_PRIMARY};color:${C.white};border-radius:9999px;padding:13px 44px;font-family:${FONT_HEADING};font-size:15px;font-weight:700;text-decoration:none;box-shadow:inset 0 1px 0 rgba(255,255,255,0.30);">${esc(c.text)}</a></td></tr>`;
    case 'image':
      return `<tr><td align="center" style="padding:0 16px;"><img src="${esc(c.url)}" alt="${esc(c.alt)}" style="display:block;margin:0 auto;max-width:100%;height:auto;border-radius:12px;"></td></tr>`;
    case 'spacer':
      return `<tr><td height="${esc(c.height)}"></td></tr>`;
    case 'table':
      return `<tr><td align="center" style="padding:0 16px;">${panelOpen}
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr><td style="font-size:12px;color:${C.body};padding-bottom:8px;border-bottom:1px solid ${C.divider};font-family:${FONT_HEADING};">${esc(c.r1k)}</td><td style="font-size:12px;color:${C.purple};text-align:right;font-weight:700;padding-bottom:8px;border-bottom:1px solid ${C.divider};font-family:${FONT_NUMBER};">${esc(c.r1v)}</td></tr>
<tr><td style="font-size:12px;color:${C.body};padding:8px 0;border-bottom:1px solid ${C.divider};font-family:${FONT_HEADING};">${esc(c.r2k)}</td><td style="font-size:12px;color:${C.purple};text-align:right;font-weight:700;padding:8px 0;border-bottom:1px solid ${C.divider};font-family:${FONT_NUMBER};">${esc(c.r2v)}</td></tr>
<tr><td style="font-size:12px;color:${C.body};padding-top:8px;font-family:${FONT_HEADING};">${esc(c.r3k)}</td><td style="font-size:12px;color:${C.purple};text-align:right;font-weight:700;padding-top:8px;font-family:${FONT_NUMBER};">${esc(c.r3v)}</td></tr>
</table>${panelClose}</td></tr>`;
    case 'details': {
      const row = (l: string, v: string) => (l || v)
        ? `<tr><td valign="top" width="38%" style="font-size:14px;font-weight:600;color:${C.accent};font-family:${FONT_HEADING};padding:7px 12px 7px 0;line-height:1.4;">${esc(l)}</td><td valign="top" style="font-size:14px;font-weight:700;color:${C.purple};font-family:${FONT_HEADING};padding:7px 0;line-height:1.4;">${hl(v)}</td></tr>`
        : '';
      return `<tr><td align="center" style="padding:0 16px;font-family:${FONT_HEADING};"><table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" style="max-width:500px;">${row(c.l1, c.v1)}${row(c.l2, c.v2)}${row(c.l3, c.v3)}</table></td></tr>`;
    }
    case 'divider':
      return `<tr><td align="center" style="padding:0 16px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" style="max-width:500px;"><tr><td style="border-top:1px solid ${C.border};font-size:1px;line-height:1px;height:1px;">&nbsp;</td></tr></table></td></tr>`;
    case 'note':
      return `<tr><td align="center" style="padding:0 16px;font-family:${FONT_HEADING};">
<table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" bgcolor="#FFFFFF" style="max-width:500px;border:1px solid ${C.border};border-radius:12px;"><tr><td style="padding:14px 14px;">
<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>
<td width="32" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="30" height="30" bgcolor="#fdeee0" style="border-radius:8px;"><tr><td align="center" valign="middle" width="30" height="30" style="font-size:17px;font-weight:800;color:${C.accent};font-family:${FONT_HEADING};line-height:1;">!</td></tr></table></td>
<td width="10"></td>
<td valign="middle"><p style="margin:0;font-size:13px;line-height:1.5;color:${C.body};font-family:${FONT_HEADING};">${c.title ? `<b style="color:${C.purple};">${esc(c.title)}</b> ` : ''}${hl(c.body)}</p></td>
</tr></table></td></tr></table></td></tr>`;
    default: return '';
  }
}

// ─── Header glass (gradiente vault + panel translúcido, fallback bgcolor) ───
function glassHeader(): string {
  return `<tr><td align="center" valign="middle" bgcolor="${C.purple}" style="background-color:${C.purple};background-image:linear-gradient(135deg,#8460e5 0%,#3b1782 52%,#22005c 100%);padding:32px 24px;">
<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" valign="middle" style="border-radius:18px;border:1px solid rgba(255,255,255,0.24);background-color:rgba(255,255,255,0.10);box-shadow:inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -1px 0 rgba(0,0,0,0.10);padding:24px 22px;">
<img src="https://cdn.vmcsubastas.com/services/mailing/images/vmcsubastas-mail-header.png" style="display:block;margin:0 auto;max-width:100%;height:auto;" alt="VMC Subastas">
</td></tr></table></td></tr>`;
}

// ─── Pre-footer glass + footer completo (layout original) ───────────────────
function glassFooter(): string {
  return `<tr><td align="center" width="600">
<table border="0" width="600" cellspacing="0" cellpadding="0" align="center"><tr>
<td width="300" height="223" align="center" valign="middle" bgcolor="${C.purple}" style="background-color:${C.purple};background-image:linear-gradient(135deg,#8460e5 0%,#3b1782 52%,#22005c 100%);padding:18px;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" height="187"><tr><td align="center" valign="middle" height="187" style="border-radius:18px;border:1px solid rgba(255,255,255,0.24);background-color:rgba(255,255,255,0.10);box-shadow:inset 0 1px 0 rgba(255,255,255,0.30);padding:18px 16px;">
<table border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
<tr><td align="center" style="font-family:${FONT_HEADING};font-size:22px;font-weight:800;letter-spacing:-0.01em;line-height:1.2;color:#FFFFFF;">VMC Subastas</td></tr>
<tr><td height="6"></td></tr>
<tr><td align="center" style="font-family:${FONT_HEADING};font-size:14px;font-weight:500;line-height:1.4;color:#d8d2ec;">¡Despierta al cazador de ofertas que hay en ti!</td></tr>
<tr><td height="14"></td></tr>
<tr><td align="center"><img src="https://cdn.vmcsubastas.com/services/mailing/inhabilitacion-cuenta/con-todo-footer.png" width="200" height="74" alt="VMC Subastas" style="border:0;display:block;margin:0 auto;max-width:100%;height:auto;"></td></tr>
</table></td></tr></table></td>
<td width="300" height="223" bgcolor="${C.navy}" style="background-color:${C.navy};background-image:linear-gradient(135deg,#22005c 0%,#00005E 62%,#000042 100%);padding:18px;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" height="187"><tr><td align="center" valign="middle" height="187" style="border-radius:18px;border:1px solid rgba(255,255,255,0.24);background-color:rgba(255,255,255,0.10);box-shadow:inset 0 1px 0 rgba(255,255,255,0.30);padding:18px 16px;">
<table border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
<tr><td align="center" style="font-family:${FONT_HEADING};font-size:22px;font-weight:800;letter-spacing:-0.01em;line-height:1.25;color:#FFFFFF;">¿Quieres saber más?</td></tr>
<tr><td height="8"></td></tr>
<tr><td align="center" style="font-family:${FONT_HEADING};font-size:13px;font-weight:500;line-height:1.45;color:#d8d2ec;">¡Visita nuestro <b style="color:#FFFFFF;">Centro de Ayuda!</b></td></tr>
<tr><td height="18"></td></tr>
<tr><td align="center"><a href="https://ayuda.vmcsubastas.com/es/collections/3079940-centro-de-ayuda-comprador" target="_blank" style="text-decoration:none;"><table border="0" width="160" cellspacing="0" cellpadding="0" align="center"><tr><td width="160" height="42" bgcolor="#3b1782" style="border-radius:9999px;background-image:${G_PRIMARY};box-shadow:inset 0 1px 0 rgba(255,255,255,0.30);font-family:${FONT_HEADING};font-size:14px;font-weight:700;color:#FFFFFF;" align="center" valign="middle"><b>¡Vamos!</b></td></tr></table></a></td></tr>
</table></td></tr></table></td>
</tr></table></td></tr>
<tr bgcolor="#FFFFFF"><td align="center" width="600">
<table border="0" cellpadding="0" cellspacing="0" width="600" align="center"><tr><td width="28"></td><td>
<table border="0" cellpadding="0" cellspacing="0" width="100%" align="center">
<tr><td height="26"></td></tr>
<tr><td align="center"><a href="https://www.vmcsubastas.com/" target="_blank" style="font-size:24px;font-family:${FONT_BODY};line-height:28px;color:${C.footerLink};text-decoration:none;"><b>www.vmcsubastas.com</b></a></td></tr>
<tr><td height="20"></td></tr>
<tr><td><table width="100%" cellpadding="0" cellspacing="0"><tr>
<td valign="top"><table cellpadding="0" cellspacing="0">
<tr><td><a href="https://www.subascars.com/quienes-somos" target="_blank" style="font-size:9px;font-family:${FONT_BODY};line-height:22px;color:${C.dark};text-decoration:none;font-weight:700;">Quienes somos</a></td></tr>
<tr><td><a href="https://www.subascars.com/" target="_blank" style="font-size:9px;font-family:${FONT_BODY};line-height:22px;color:${C.dark};text-decoration:none;font-weight:700;">SubasCars</a></td></tr>
<tr><td><a href="https://www.subascars.com/como-vender-mi-auto-en-peru" target="_blank" style="font-size:9px;font-family:${FONT_BODY};line-height:22px;color:${C.dark};text-decoration:none;font-weight:700;">¿Cómo vender?</a></td></tr>
<tr><td><a href="https://www.vmcsubastas.com/login?redirect_after_to=/zona" target="_blank" style="font-size:9px;font-family:${FONT_BODY};line-height:22px;color:${C.dark};text-decoration:none;font-weight:700;">¿Cómo obtener acceso ilimitado a las subastas?</a></td></tr>
<tr><td><a href="https://blog.subascars.com/" target="_blank" style="font-size:9px;font-family:${FONT_BODY};line-height:22px;color:${C.dark};text-decoration:none;font-weight:700;">SubasBlog: La guía definitiva de subastas y venta de autos</a></td></tr>
</table></td>
<td width="15%"></td>
<td valign="top"><table cellpadding="0" cellspacing="0">
<tr><td align="right"><a href="https://ayuda.vmcsubastas.com/es/collections/3079940-centro-de-ayuda-comprador" target="_blank" style="font-size:9px;font-family:${FONT_BODY};line-height:28px;color:${C.dark};text-decoration:none;font-weight:700;">Contáctanos</a></td></tr>
<tr><td align="right"><a href="https://www.vmcsubastas.com/condiciones-y-terminos" target="_blank" style="font-size:9px;font-family:${FONT_BODY};line-height:28px;color:${C.dark};text-decoration:none;font-weight:700;">Condiciones y Términos</a></td></tr>
<tr><td align="center" style="font-size:9px;font-family:${FONT_BODY};line-height:22px;color:${C.dark};font-weight:400;">Encuéntranos en:</td></tr>
<tr align="right"><td>
<a href="https://www.facebook.com/vmcsubastas" target="_blank"><img src="https://cdn.vmcsubastas.com/services/boletin/2025-09-08/assets/facebook.png" style="max-width:20px;height:auto;margin-right:5px;" alt="VMC"></a>
<a href="https://www.youtube.com/channel/UCedBvYb6zP27x2u-t-Wk-qQ" target="_blank"><img src="https://cdn.vmcsubastas.com/services/boletin/2025-09-08/assets/youtube.png" style="max-width:20px;height:auto;margin-right:5px;" alt="VMC"></a>
<a href="https://x.com/vmcsubastas" target="_blank"><img src="https://cdn.vmcsubastas.com/services/boletin/2025-09-08/assets/twitter.png" style="max-width:20px;height:auto;margin-right:5px;" alt="VMC"></a>
<a href="https://www.instagram.com/vmcsubastas/" target="_blank"><img src="https://cdn.vmcsubastas.com/services/boletin/2025-09-08/assets/instagram.png" style="max-width:20px;height:auto;" alt="VMC"></a>
</td></tr>
</table></td>
</tr></table></td></tr>
<tr><td height="20"></td></tr>
<tr><td align="center" style="font-size:8px;font-family:${FONT_BODY};line-height:13px;color:${C.dark};">El presente correo se envía de acuerdo a la Ley N° 28493 que regula el Uso de Correo Comercial sin ser solicitado y su reglamento. Si deseas dejar de recibir estos correos, haz clic en: <a href="https://services.subastop.com/subscribers/unsubscribe" style="font-weight:bold;text-decoration:none;color:${C.dark};" target="_blank">REMOVER SUSCRIPCIÓN</a></td></tr>
<tr><td height="8"></td></tr>
<tr><td align="center" style="font-size:8px;font-family:${FONT_BODY};line-height:22px;color:${C.dark};">2026 VMC Subastas. Todos los derechos reservados.</td></tr>
<tr><td height="24"></td></tr>
</table></td><td width="28"></td></tr></table></td></tr>`;
}

export function generateEmail(sections: Section[], title: string = 'VMC Subastas'): string {
  const body = sections.map(renderSection).join('\n');
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta property="og:title" content="${esc(title)}">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
</head>
<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="background-color:${C.bg}!important;margin:0;padding:0;">
<center>
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0;padding:0;width:100%;">
<tr><td align="center" valign="top">
<table border="0" width="${CONTAINER_W}" cellspacing="0" cellpadding="0" align="center" bgcolor="${C.white}" style="padding:20px;">
${glassHeader()}
<tr><td height="20"></td></tr>
${body}
${glassFooter()}
</table>
</td></tr>
</table>
</center>
</body>
</html>`;
}
