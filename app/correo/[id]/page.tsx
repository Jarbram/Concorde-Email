'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EMAILS, getEmail, CATEGORY_GRADIENT } from '@/lib/emails';
import { generateEmail } from '@/lib/email-templates';

const C = {
  purple: '#3b1782', body: '#5a4d75', lavender: '#f5f3fe', slate: '#6b6585',
  white: '#FFFFFF', bg: '#FAFAFA', divider: '#e7e1f7',
};

export default function CorreoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const email = getEmail(id);
  if (!email) notFound();

  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const html = generateEmail(email.sections, email.subject);
  const nextEmails = (email.leadsTo ?? [])
    .map((nextId) => EMAILS.find((e) => e.id === nextId))
    .filter((e): e is typeof EMAILS[number] => !!e);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => { setCopied(true); setTimeout(() => setCopied(false), 1800); },
      () => {
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); ta.remove();
        setCopied(true); setTimeout(() => setCopied(false), 1800);
      }
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* barra superior */}
      <header style={{ background: '#fff', borderBottom: `1px solid ${C.lavender}`, padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
          <Link href="/" style={{ color: C.body, fontSize: '15px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>← Back</Link>
          <div style={{ width: '1px', height: '20px', background: C.divider }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: C.purple, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email.name}</div>
            <div style={{ fontSize: '11px', color: C.body, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Subject: {email.subject}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button onClick={() => setShowCode(!showCode)} style={{ padding: '8px 18px', borderRadius: '9999px', border: `1px solid ${C.divider}`, background: showCode ? C.lavender : '#fff', color: C.purple, cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: 600 }}>
            {showCode ? 'Hide code' : 'View code'}
          </button>
          <button onClick={() => copy(html)} style={{ padding: '8px 24px', borderRadius: '9999px', border: 'none', background: copied ? '#00aeb1' : C.purple, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: 700, transition: 'background .2s' }}>
            {copied ? '✓ Copied!' : 'Copy HTML'}
          </button>
        </div>
      </header>

      {/* preview completo */}
      <main style={{ padding: '28px 16px 60px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '640px' }}>
          <div style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 6px 30px rgba(57,19,131,.12)', background: '#fff' }}>
            <iframe
              srcDoc={html}
              title={email.name}
              scrolling="no"
              style={{ border: 'none', width: '100%', display: 'block', background: '#fff' }}
              onLoad={(e) => {
                const f = e.currentTarget;
                try {
                  const doc = f.contentDocument || f.contentWindow?.document;
                  if (doc) f.style.height = `${doc.documentElement.scrollHeight}px`;
                } catch { f.style.height = '1600px'; }
              }}
            />
          </div>

          {email.category && (
            <div style={{ marginTop: '20px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: 700, color: C.slate, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 10px' }}>
                {nextEmails.length > 0 ? 'Sigue en el flujo' : 'Correo final de este flujo'}
              </h2>
              {nextEmails.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {nextEmails.map((next) => (
                    <Link
                      key={next.id}
                      href={`/correo/${next.id}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px',
                        border: `1px solid ${C.divider}`, background: '#fff', textDecoration: 'none',
                      }}
                    >
                      {next.category && next.stage && (
                        <span
                          style={{
                            flexShrink: 0, padding: '3px 9px', borderRadius: '9999px', fontSize: '10px', fontWeight: 700,
                            letterSpacing: '0.04em', textTransform: 'uppercase', color: '#fff',
                            ...(CATEGORY_GRADIENT[next.category] ? { backgroundImage: CATEGORY_GRADIENT[next.category] } : { backgroundColor: C.slate }),
                          }}
                        >
                          {next.stage}
                        </span>
                      )}
                      <span style={{ fontSize: '13px', fontWeight: 700, color: C.purple }}>{next.name}</span>
                      <span style={{ marginLeft: 'auto', color: C.slate, fontSize: '13px' }}>→</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {showCode && (
            <div style={{ marginTop: '20px', background: '#1a1a2e', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#ae8eff', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                  HTML ({html.length.toLocaleString()} bytes)
                </span>
                <button onClick={() => copy(html)} style={{ padding: '5px 14px', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#ae8eff', cursor: 'pointer', fontFamily: 'inherit', fontSize: '11px', fontWeight: 600 }}>
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre style={{ margin: 0, padding: '14px', fontSize: '11px', fontFamily: 'ui-monospace, Menlo, monospace', color: '#e1e1ec', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                {html}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
