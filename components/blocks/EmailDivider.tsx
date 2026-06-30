import { colors } from '@/lib/colors';

export function EmailDivider() {
  return (
    <tr>
      <td
        style={{
          borderTop: `1px solid ${colors.surface.border}`,
          paddingTop: '24px',
        }}
      />
    </tr>
  );
}
