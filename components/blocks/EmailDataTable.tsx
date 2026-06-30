import { colors } from '@/lib/colors';

interface Row {
  label: string;
  value: string;
}

interface Props {
  rows: Row[];
}

export function EmailDataTable({ rows }: Props) {
  const sharedStyle = {
    fontSize: '13px',
    paddingBottom: '6px',
  };

  return (
    <tr>
      <td style={{ paddingBottom: '24px' }}>
        <table width="100%" cellPadding={0} cellSpacing={0}>
          {rows.map((row, i) => (
            <tr key={i}>
              <td style={{ ...sharedStyle, color: colors.text.muted }}>
                {row.label}
              </td>
              <td
                style={{
                  ...sharedStyle,
                  color: colors.text.purple,
                  textAlign: 'right',
                }}
              >
                {row.value}
              </td>
            </tr>
          ))}
        </table>
      </td>
    </tr>
  );
}
