import { colors } from '@/lib/colors';

type Variant = 'primary' | 'negotiable' | 'secondary' | 'outline' | 'ghost';

interface Props {
  variant?: Variant;
  href: string;
  label: string;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, { bg: string; color: string; border: string; shadow: string; textShadow: string }> = {
  primary: {
    bg: colors.gradient.primary,
    color: colors.white,
    border: '2px solid transparent',
    shadow: colors.gradient.ctaShadow,
    textShadow: '0 1px 3px rgba(0,0,0,0.25)',
  },
  negotiable: {
    bg: colors.gradient.negotiable,
    color: colors.white,
    border: '2px solid transparent',
    shadow: colors.gradient.tealShadow,
    textShadow: '0 1px 3px rgba(0,0,0,0.25)',
  },
  secondary: {
    bg: colors.gradient.secondary,
    color: colors.white,
    border: '2px solid transparent',
    shadow: colors.gradient.ctaShadow,
    textShadow: '0 1px 3px rgba(0,0,0,0.25)',
  },
  outline: {
    bg: `rgba(${parseInt(colors.vault[500].slice(1,3),16)},${parseInt(colors.vault[500].slice(3,5),16)},${parseInt(colors.vault[500].slice(5,7),16)},0.04)`,
    color: colors.vault[500],
    border: `2px solid ${colors.surface.border}`,
    shadow: 'none',
    textShadow: 'none',
  },
  ghost: {
    bg: 'transparent',
    color: colors.vault[500],
    border: `1.5px solid rgba(132,96,229,0.25)`,
    shadow: 'none',
    textShadow: 'none',
  },
};

export function EmailButton({ variant = 'primary', href, label, fullWidth }: Props) {
  const s = variantStyles[variant];
  return (
    <table width={fullWidth ? '100%' : 'auto'} cellPadding={0} cellSpacing={0}>
      <tr>
        <td align="center" style={{ paddingBottom: '16px' }}>
          <a
            href={href}
            style={{
              display: 'inline-block',
              background: s.bg,
              color: s.color,
              border: s.border,
              borderRadius: '9999px',
              padding: '14px 48px',
              fontSize: '16px',
              fontWeight: 600,
              textDecoration: 'none',
              textShadow: s.textShadow,
              boxShadow: s.shadow,
              fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
              letterSpacing: '0.01em',
            }}
          >
            {label}
          </a>
        </td>
      </tr>
    </table>
  );
}
