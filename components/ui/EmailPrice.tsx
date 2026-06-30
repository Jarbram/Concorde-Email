import { colors } from '@/lib/colors';

interface Props {
  price: string;
  variant?: 'default' | 'large' | 'muted';
}

const variantStyles: Record<string, { fontSize: string; padding: string }> = {
  default: { fontSize: '18px', padding: '6px 18px 6px 8px' },
  large: { fontSize: '22px', padding: '8px 24px 8px 10px' },
  muted: { fontSize: '18px', padding: '6px 18px' },
};

export function EmailPrice({ price, variant = 'default' }: Props) {
  const s = variantStyles[variant];
  return (
    <span
      style={{
        display: 'inline-block',
        background: colors.gradient.secondary,
        borderRadius: '9999px',
        padding: s.padding,
        color: colors.white,
        fontSize: s.fontSize,
        fontWeight: 700,
        fontFamily: "'Roboto Mono', monospace",
        textShadow: '0 1px 2px rgba(0,0,0,0.18)',
        boxShadow: '0 2px 10px rgba(32,0,104,0.5), 0 1px 0 rgba(255,255,255,0.1) inset',
      }}
    >
      {price}
    </span>
  );
}
