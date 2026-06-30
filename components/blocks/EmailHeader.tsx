import type { ReactNode } from 'react';
import { colors } from '@/lib/colors';

interface Props {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  image?: string;
  children?: ReactNode;
}

export function EmailHeader({ title, subtitle, badge, image, children }: Props) {
  return (
    <tr>
      <td
        style={{
          background: colors.gradient.header,
          padding: '40px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <table width="100%" cellPadding={0} cellSpacing={0}>
          {badge && (
            <tr>
              <td style={{ paddingBottom: '20px' }}>{badge}</td>
            </tr>
          )}
          <tr>
            <td
              style={{
                fontSize: '26px',
                fontWeight: 700,
                color: colors.white,
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
                paddingBottom: subtitle || children ? '8px' : '0px',
              }}
            >
              {title}
            </td>
          </tr>
          {subtitle && (
            <tr>
              <td
                style={{
                  fontSize: '15px',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.75)',
                  paddingBottom: image ? '24px' : '0px',
                }}
              >
                {subtitle}
              </td>
            </tr>
          )}
          {image && (
            <tr>
              <td>
                <img
                  src={image}
                  alt=""
                  style={{
                    width: '100%',
                    maxWidth: '400px',
                    borderRadius: '8px',
                    display: 'block',
                    margin: '0 auto',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  }}
                />
              </td>
            </tr>
          )}
          {children && (
            <tr>
              <td>{children}</td>
            </tr>
          )}
        </table>
      </td>
    </tr>
  );
}
