import { colors } from '@/lib/colors';

type Variant = 'live' | 'proxima' | 'negotiable' | 'system' | 'success';

interface Props {
  variant: Variant;
  label: string;
  showDot?: boolean;
}

const variantStyles: Record<Variant, { bg: string; shadow: string }> = {
  live: {
    bg: 'linear-gradient(135deg, #ff9639 0%, #ef852e 40%, #be3d00 100%)',
    shadow: '0 2px 10px rgba(239,133,46,0.45), 0 1px 0 rgba(255,255,255,0.14) inset',
  },
  proxima: {
    bg: colors.gradient.secondary,
    shadow: '0 2px 10px rgba(32,0,104,0.5), 0 1px 0 rgba(255,255,255,0.1) inset',
  },
  negotiable: {
    bg: 'linear-gradient(135deg, #00aeb1 0%, #8460e5 100%)',
    shadow: '0 2px 10px rgba(0,174,177,0.4), 0 1px 0 rgba(255,255,255,0.12) inset',
  },
  system: {
    bg: colors.gradient.secondary,
    shadow: '0 2px 10px rgba(32,0,104,0.4), 0 1px 0 rgba(255,255,255,0.1) inset',
  },
  success: {
    bg: 'linear-gradient(135deg, #00aeb1 0%, #008688 100%)',
    shadow: '0 2px 10px rgba(0,174,177,0.4), 0 1px 0 rgba(255,255,255,0.12) inset',
  },
};

export function EmailBadge({ variant, label, showDot = false }: Props) {
  const s = variantStyles[variant];
  return (
    <span
      style={{
        display: 'inline-block',
        background: s.bg,
        border: '1px solid transparent',
        borderRadius: '9999px',
        padding: showDot ? '3px 10px 3px 8px' : '4px 12px',
        color: colors.white,
        fontSize: '9px',
        fontWeight: 700,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        boxShadow: s.shadow,
        whiteSpace: 'nowrap',
      }}
    >
      {showDot && (
        <span
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: colors.white,
            marginRight: '5px',
            verticalAlign: 'middle',
          }}
        />
      )}
      {label}
    </span>
  );
}
