'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { EMAILS, CATEGORY_GRADIENT, STAGE_ORDER, type EmailTemplate } from '@/lib/emails';
import { generateEmail } from '@/lib/email-templates';
import { FlowDiagram } from './HomeFlowDiagram';

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

function groupBy<T>(items: T[], key: (item: T) => string): [string, T[]][] {
  const groups = items.reduce<Record<string, T[]>>((acc, item) => {
    const k = key(item);
    (acc[k] ??= []).push(item);
    return acc;
  }, {});
  return Object.entries(groups);
}

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

function EmailGrid({ emails }: { emails: EmailTemplate[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
      {emails.map((email) => <EmailCard key={email.id} email={email} />)}
    </div>
  );
}

function EmailCard({ email }: { email: EmailTemplate }) {
  const [copied, setCopied] = useState(false);
  const html = generateEmail(email.sections, email.subject);
  return (
    <div style={{ background: C.white, borderRadius: '16px', border: `1px solid ${C.divider}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Link href={`/correo/${email.id}`} style={{ display: 'block', position: 'relative', height: '260px', overflow: 'hidden', background: '#f6f5fa', borderBottom: `1px solid ${C.lavender}` }}>
        <iframe
          srcDoc={html}
          title={email.name}
          scrolling="no"
          tabIndex={-1}
          style={{ border: 'none', width: '600px', transform: 'scale(0.54)', transformOrigin: 'top center', height: '900px', display: 'block', margin: '0 auto', pointerEvents: 'none', background: '#fff' }}
        />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '70px', background: 'linear-gradient(180deg, rgba(246,245,250,0) 0%, #f6f5fa 90%)' }} />
      </Link>
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
        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
          <button
            onClick={() => copy(html, () => { setCopied(true); setTimeout(() => setCopied(false), 1800); })}
            style={{ flex: 1, padding: '9px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: copied ? '#00aeb1' : C.ink, color: '#fff', fontFamily: 'inherit', fontSize: '13px', fontWeight: 700, transition: 'background .2s' }}
          >
            {copied ? '✓ Copied' : 'Copy HTML'}
          </button>
          <Link href={`/correo/${email.id}`} style={{ padding: '9px 16px', borderRadius: '10px', border: `1px solid ${C.divider}`, background: '#fff', color: C.ink, fontFamily: 'inherit', fontSize: '13px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Open
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const categoryGroups = useMemo(() => {
    const groups = groupBy(EMAILS, (e) => e.category ?? 'General');
    return groups.sort((a, b) => (a[0] === 'General' ? 1 : b[0] === 'General' ? -1 : 0));
  }, []);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<{ category: string | null; stage: string | null }>({ category: null, stage: null });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EMAILS.filter((e) => {
      const matchesQuery = !q || e.name.toLowerCase().includes(q) || e.subject.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q);
      const matchesCategory = !active.category || (e.category ?? 'General') === active.category;
      const matchesStage = !active.stage || e.stage === active.stage;
      return matchesQuery && matchesCategory && matchesStage;
    });
  }, [query, active]);

  const filteredGroups = useMemo(() => {
    if (query.trim()) return null;
    const cats = active.category ? categoryGroups.filter(([c]) => c === active.category) : categoryGroups;
    return cats.map(([category]) => {
      const emails = filtered.filter((e) => (e.category ?? 'General') === category);
      const stages = groupBy(emails, (e) => e.stage ?? '').filter(([stage]) => stage);
      return { category, emails, stages };
    }).filter((g) => g.emails.length > 0);
  }, [filtered, categoryGroups, active, query]);

  const showDiagram = !!active.category && !!STAGE_ORDER[active.category] && !query.trim();

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <header style={{ padding: '56px 24px 40px', textAlign: 'center', borderBottom: `1px solid ${C.divider}` }}>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: C.ink, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 12px' }}>
          Ready-made emails for{' '}
          <span style={{
            background: 'linear-gradient(90deg, #ed8936 0%, #f1705d 42%, #8460e5 100%)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            WebkitTextFillColor: 'transparent', color: 'transparent',
          }}>
            Subastop
          </span>
        </h1>
        <p style={{ fontSize: '16px', color: C.slate, maxWidth: '520px', margin: '0 auto', lineHeight: 1.5, fontWeight: 500 }}>
          Pre-built templates with the Concorde style. Open, copy the HTML and send — zero friction.
        </p>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 80px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '40px', alignItems: 'start' }}>
        <Sidebar
          categoryGroups={categoryGroups}
          active={active}
          onSelect={(category, stage) => setActive({ category, stage })}
          query={query}
          onQuery={setQuery}
        />

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
      </div>

      <footer style={{ borderTop: `1px solid ${C.divider}`, padding: '24px', textAlign: 'center', background: C.white }}>
        <p style={{ fontSize: '11px', color: C.body, margin: 0 }}>VMC Subastas &middot; Concorde Design System</p>
      </footer>
    </div>
  );
}
