/* Catálogo de correos ya armados. Sumar uno = agregar un objeto a EMAILS.
   Cada correo respeta el layout y distancias del original; el estilo (glass,
   gradientes, coral) lo aplica el render de secciones según patrones.md. */

import { Section } from './email-templates';

export interface EmailTemplate {
  id: string;        // slug para la URL
  name: string;      // nombre visible
  subject: string;   // asunto del correo
  desc: string;      // descripción corta para la card
  sections: Section[];
}

const ICON = {
  calendar: 'https://cdn.vmcsubastas.com/services/boletin/assets/icon-calendar.png',
  search: 'https://cdn.vmcsubastas.com/services/boletin/assets/icon-search.png',
  eye: 'https://cdn.vmcsubastas.com/services/boletin/assets/icon-eye.png',
  cards: 'https://cdn.vmcsubastas.com/services/boletin/assets/icon-cards.png',
  bank: 'https://cdn.vmcsubastas.com/services/boletin/assets/icon-bank-building.png',
  phone: 'https://cdn.vmcsubastas.com/services/boletin/assets/phone-bcp.png',
};

// helper local: no repetir id/type a mano
const S = (type: Section['type'], content: Record<string, string>): Section => ({
  id: `${type}-${Math.random().toString(36).slice(2, 7)}`, type, content,
});
const SP = (height: string) => S('spacer', { height });

export const EMAILS: EmailTemplate[] = [
  {
    id: 'fee-subascoins',
    name: 'Fee Notice — SubasCoins',
    subject: 'Información importante sobre tus adquisiciones de SubasCoins',
    desc: 'Announces the new gateway fee and the fee-free options (BCP / CUU).',
    sections: [
      // layout y distancias del correo original
      S('title', { eyebrow: '', text: 'Información importante sobre tus adquisiciones de SubasCoins' }),
      SP('30'),
      S('text', { text: 'Queremos contarte que hemos realizado una actualización en nuestros Términos y Condiciones relacionada con la adquisición de SubasCoins en plataforma.' }),
      SP('20'),
      S('panel', {
        title: 'A partir del **1 de Julio** del presente año',
        body: 'Las compras de SubasCoins realizadas a través de la plataforma utilizando tarjeta de Crédito o Débito podrán incluir un **Fee por uso de pasarela**, asociado al procesamiento de la transacción.',
        iconUrl: ICON.calendar, badge: '', imageUrl: '', imageW: '85', imageH: '57',
      }),
      SP('20'),
      S('features', {
        heading: '¿Qué debes tener en cuenta sobre este Fee?',
        i1: ICON.search, t1: 'El costo del fee equivale al [[3.9%]] del monto de tu adquisición de SubasCoins',
        i2: ICON.eye, t2: 'Se te mostrará de manera clara y desagregada antes de realizar el pago',
        i3: ICON.cards, t3: 'Si tu tarjeta es en soles, el tipo de cambio será determinado por tu proveedor',
      }),
      SP('20'),
      S('panel', {
        title: 'Opciones **SIN FEE** por uso de pasarela',
        body: 'Puedes realizar tu recarga de saldo en dólares a través de ventanilla, agente o app del banco BCP utilizando tu CUU. Esta operación carece del cobro de este Fee.',
        iconUrl: ICON.bank, badge: 'white', imageUrl: ICON.phone, imageW: '85', imageH: '57',
      }),
      SP('30'),
    ],
  },
  {
    id: 'listo-participar',
    name: 'Ready to Bid — Participation',
    subject: '¡Listo para participar en la oferta {{Toyota Hilux 2018}}!',
    desc: 'Confirms participation: details (date, seller, consignment) + live-room reminder.',
    sections: [
      // {{...}} = merge tags (se reemplazan en tu plataforma); **...** = acento
      S('title', { eyebrow: '', text: '¡Listo para participar en la oferta {{Toyota Hilux 2018}}!' }),
      SP('24'),
      S('text', { text: '{{Nombre usuario .Ejem: Gabriel Bruno}}, datos de tu participación:' }),
      SP('14'),
      S('details', {
        l1: 'Fecha y hora:', v1: 'Miércoles, 11 de octubre - 2:00 p.m.',
        l2: 'Vendedor:', v2: 'Financiera Automotriz',
        l3: 'Consignación:', v3: '50 SubasCoins',
      }),
      SP('16'),
      S('divider', {}),
      SP('16'),
      S('note', {
        title: 'Recuerda:',
        body: 'Al consignar, eres responsable de asegurar tu conexión a sala "En Vivo" y de participar enviando, al menos, un bid válido durante el proceso, o serás sancionado.',
      }),
      SP('30'),
    ],
  },
  {
    id: 'oportunidad-compra',
    name: 'Purchase Opportunity — 2nd/3rd Place',
    subject: '¡Tienes oportunidad de compra en la oferta {{Toyota Hilux 2018}}!',
    desc: 'Notifies 2nd/3rd-place bidders of a purchase opportunity and explains eligibility conditions.',
    sections: [
      S('title', { eyebrow: '', text: '¡Tienes oportunidad de compra en la oferta {{Toyota Hilux 2018}}!' }),
      SP('24'),
      S('text', { text: '{{Nombre usuario.Ejem: Gabriel Bruno}},' }),
      SP('14'),
      S('text', { text: '¡Felicidades estas entre los __3 mejores postores__! __Te notificaremos en caso se active tu oportunidad de compra.__' }),
      SP('16'),
      S('text', { text: '**Recuerda:** Tu garantía se mantendrá consignada hasta que el proceso de venta de la oferta haya finalizado. **¡Aún hay una oportunidad de ganar con VMC Subastas!**' }),
      SP('20'),
      S('divider', {}),
      SP('16'),
      S('text', { text: '**¿Qué es la oportunidad de compra?**' }),
      SP('12'),
      S('text', { text: 'La oportunidad de compra es __una condición obtenida por el mejor postor__ en una oferta \'En Vivo\' con reserva y por el __2do o 3er lugar en un proceso sin reserva__.' }),
      SP('12'),
      S('text', { text: 'En caso de **activarse la oportunidad de compra** el participante adquirirá las __responsabilidades de ganador directo habilitado__ siendo responsable de seguir con el proceso de compra, bajo pena de sanción en caso de incumplimiento.' }),
      SP('30'),
    ],
  },
  {
    id: 'ganador-directo',
    name: 'Direct Winner — Purchase',
    subject: '¡Eres el Ganador Directo en la oferta {{Toyota Hilux 2018}}!',
    desc: 'Notifies the direct winner, prompts to start the purchase, and states the sanctions.',
    sections: [
      S('title', { eyebrow: '', text: '¡Eres el Ganador Directo en la oferta {{Toyota Hilux 2018}}!' }),
      SP('24'),
      S('text', { text: '{{Nombre usuario .Ejem: Gabriel Bruno}},' }),
      SP('10'),
      S('text', { text: '¡Felicidades! Estás a un paso de cumplir tus metas. __Inicia el proceso de compra__ ingresando a tu zona de usuario.' }),
      SP('20'),
      S('cta', { text: 'VAMOS', url: 'https://www.vmcsubastas.com/login?redirect_after_to=/zona' }),
      SP('20'),
      S('divider', {}),
      SP('16'),
      S('text', { text: '**Recuerda:**' }),
      SP('8'),
      S('text', { text: 'En cualquier caso, cuando el ganador directo habilitado haya **incumplido con alguna de sus responsabilidades**, será sancionado con la pérdida de 75 Puntos.' }),
      SP('12'),
      S('text', { text: 'VMC SUBASTAS también procederá a exigir el **pago equivalente a la comisión** establecido como contraprestación por el uso de la Billetera brindada, detrayéndola si fuese posible de la Billetera automáticamente; cuando el usuario carezca de fondos suficientes para cubrir el total de la comisión, se procederá a amortizar de manera parcial la deuda correspondiente detrayendo el íntegro de los fondos en Billetera del ganador, por lo que su usuario mantendrá una deuda en plataforma y su cuenta permanecerá restringida.' }),
      SP('30'),
    ],
  },
];

export const getEmail = (id: string) => EMAILS.find((e) => e.id === id);
