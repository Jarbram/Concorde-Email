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
