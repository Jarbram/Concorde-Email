'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EMAILS, type EmailTemplate } from '@/lib/emails';
import { generateEmail } from '@/lib/email-templates';

const C = {
  ink: '#14122b', purple: '#3b1782', body: '#5a4d75', slate: '#6b6585',
  lavender: '#f5f3fe', accent: '#f1705d', white: '#FFFFFF', bg: '#FFFFFF', divider: '#e7e1f7',
};
function copy(text: string, done: () => void) {
  navigator.clipboard.writeText(text).then(done, () => {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); ta.remove(); done();
  });
}

function EmailCard({ email }: { email: EmailTemplate }) {
  const [copied, setCopied] = useState(false);
  const html = generateEmail(email.sections, email.subject);
  return (
    <div style={{ background: C.white, borderRadius: '16px', border: `1px solid ${C.divider}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Link href={`/correo/${email.id}`} style={{ display: 'block', position: 'relative', height: '300px', overflow: 'hidden', background: '#f6f5fa', borderBottom: `1px solid ${C.lavender}` }}>
        <iframe
          srcDoc={html}
          title={email.name}
          scrolling="no"
          tabIndex={-1}
          style={{ border: 'none', width: '600px', transform: 'scale(0.62)', transformOrigin: 'top center', height: '900px', display: 'block', margin: '0 auto', pointerEvents: 'none', background: '#fff' }}
        />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '80px', background: 'linear-gradient(180deg, rgba(246,245,250,0) 0%, #f6f5fa 90%)' }} />
      </Link>
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.ink, margin: 0 }}>{email.name}</h3>
          <p style={{ fontSize: '12px', color: C.body, margin: '4px 0 0', lineHeight: 1.45 }}>{email.desc}</p>
          <p style={{ fontSize: '11px', color: '#a89fc0', margin: '6px 0 0' }}>Subject: {email.subject}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
          <button
            onClick={() => copy(html, () => { setCopied(true); setTimeout(() => setCopied(false), 1800); })}
            style={{ flex: 1, padding: '9px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: copied ? '#00aeb1' : C.ink, color: '#fff', fontFamily: 'inherit', fontSize: '13px', fontWeight: 700, transition: 'background .2s' }}
          >
            {copied ? '✓ Copied' : 'Copy HTML'}
          </button>
          <Link href={`/correo/${email.id}`} style={{ padding: '9px 18px', borderRadius: '10px', border: `1px solid ${C.divider}`, background: '#fff', color: C.ink, fontFamily: 'inherit', fontSize: '13px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Open
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Hero claro estilo design system */}
      <header style={{ padding: '96px 24px 72px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(44px, 8vw, 88px)', fontWeight: 800, color: C.ink, letterSpacing: '-0.04em', lineHeight: 1.02, margin: '0 0 28px' }}>
          Ready-made emails<br />
          for{' '}
          <span style={{
            background: 'linear-gradient(90deg, #ed8936 0%, #f1705d 42%, #8460e5 100%)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            WebkitTextFillColor: 'transparent', color: 'transparent',
          }}>
            Subastop
          </span>
        </h1>
        <p style={{ fontSize: '19px', color: C.slate, maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.5, fontWeight: 500 }}>
          Pre-built templates with the Concorde style. Open, copy the HTML and send — zero friction.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#catalogo" style={{ padding: '14px 30px', borderRadius: '12px', background: C.ink, color: '#fff', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}>
            View emails
          </a>
          <a href="https://concorde-v2-theta.vercel.app" target="_blank" rel="noreferrer" style={{ padding: '14px 30px', borderRadius: '12px', background: '#fff', color: C.ink, border: `1px solid ${C.divider}`, fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}>
            Design system
          </a>
        </div>
      </header>

      {/* Catálogo */}
      <main id="catalogo" style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 24px 80px', scrollMarginTop: '24px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, color: C.purple, letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 24px' }}>
          {EMAILS.length} {EMAILS.length === 1 ? 'email' : 'emails'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {EMAILS.map((email) => <EmailCard key={email.id} email={email} />)}
        </div>
      </main>

      <footer style={{ borderTop: `1px solid ${C.divider}`, padding: '24px', textAlign: 'center', background: C.white }}>
        <p style={{ fontSize: '11px', color: C.body, margin: 0 }}>VMC Subastas &middot; Concorde Design System</p>
      </footer>
    </div>
  );
}
