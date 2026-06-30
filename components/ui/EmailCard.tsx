import type { ReactNode } from 'react';
import { colors } from '@/lib/colors';

interface Props {
  children: ReactNode;
  borderColor?: string;
  padding?: string;
}

export function EmailCard({ children, borderColor, padding = '20px 24px' }: Props) {
  return (
    <table
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      style={{
        background: colors.surface.tint,
        borderRadius: '8px',
        ...(borderColor ? { borderLeft: `4px solid ${borderColor}` } : {}),
      }}
    >
      <tr>
        <td style={{ padding }}>{children}</td>
      </tr>
    </table>
  );
}
