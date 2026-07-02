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
