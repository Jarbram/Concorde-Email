import { colors } from '@/lib/colors';

interface Stat {
  value: string;
  label: string;
}

interface Props {
  stats: Stat[];
}

export function EmailStats({ stats }: Props) {
  const count = stats.length;
  const width = count <= 2 ? '48%' : count === 3 ? '32%' : '24%';
  const padding = count <= 2 ? '0 4px' : '0 4px';

  return (
    <tr>
      <td style={{ paddingBottom: '28px' }}>
        <table width="100%" cellPadding={0} cellSpacing={0}>
          <tr>
            {stats.map((s, i) => (
              <td key={i} width={width} style={{ padding }}>
                <table
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{
                    background: colors.surface.tint,
                    borderRadius: '8px',
                  }}
                >
                  <tr>
                    <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'block',
                          fontSize: '22px',
                          fontWeight: 700,
                          color: colors.text.purple,
                          paddingBottom: '4px',
                        }}
                      >
                        {s.value}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          color: colors.text.muted,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {s.label}
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            ))}
          </tr>
        </table>
      </td>
    </tr>
  );
}
