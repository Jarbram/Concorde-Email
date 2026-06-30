import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function EmailBody({ children }: Props) {
  return (
    <tr>
      <td style={{ padding: '36px 40px' }}>
        <table width="100%" cellPadding={0} cellSpacing={0}>
          {children}
        </table>
      </td>
    </tr>
  );
}
