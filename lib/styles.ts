import { CSSProperties } from 'react';
import { colors } from './colors';

export const emailBase: CSSProperties = {
  margin: 0,
  padding: 0,
  background: '#0a0a12',
  fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
};

export const container: CSSProperties = {
  width: '100%',
  maxWidth: '600px',
  background: colors.white,
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: colors.gradient.cardShadow,
};

export const headerBox: CSSProperties = {
  background: colors.gradient.header,
  padding: '48px 40px',
  textAlign: 'center',
};

export const bodyBox: CSSProperties = {
  padding: '40px',
};

export const footerBox: CSSProperties = {
  background: colors.surface.tint,
  padding: '24px 40px',
  textAlign: 'center',
};

export function px(n: number): string {
  return `${n}px`;
}

export function percent(n: number): string {
  return `${n}%`;
}

export const inlineEmail: CSSProperties = {
  margin: 0,
  padding: 0,
  background: '#0a0a12',
  paddingTop: px(40),
  paddingBottom: px(40),
};

export function centerTable(): CSSProperties {
  return { width: percent(100), textAlign: 'center' as const };
}
