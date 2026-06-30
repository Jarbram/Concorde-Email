import { colors } from '@/lib/colors';

interface Props {
  brand?: string;
  info?: string;
  links?: { label: string; href: string }[];
}

export function EmailFooter({
  brand = 'Subastop — Subastas de vehículos',
  info,
  links,
}: Props) {
  return (
    <tr>
      <td
        style={{
          background: colors.surface.tint,
          padding: '24px 40px',
          textAlign: 'center',
        }}
      >
        <table width="100%" cellPadding={0} cellSpacing={0}>
          <tr>
            <td
              style={{
                fontSize: '12px',
                color: colors.surface.neutral,
                lineHeight: 1.6,
                paddingBottom: '8px',
              }}
            >
              {brand}
            </td>
          </tr>
          {info && (
            <tr>
              <td
                style={{
                  fontSize: '11px',
                  color: '#b8b8c8',
                  lineHeight: 1.6,
                }}
              >
                {info}
              </td>
            </tr>
          )}
          {links && links.length > 0 && (
            <tr>
              <td style={{ paddingTop: '8px' }}>
                {links.map((l, i) => (
                  <span key={i}>
                    {i > 0 && (
                      <span style={{ color: colors.surface.border }}>
                        {' '}
                        &middot;{' '}
                      </span>
                    )}
                    <a
                      href={l.href}
                      style={{ color: colors.vault[500], fontSize: '11px' }}
                    >
                      {l.label}
                    </a>
                  </span>
                ))}
              </td>
            </tr>
          )}
        </table>
      </td>
    </tr>
  );
}
