import { colors } from '@/lib/colors';

interface Props {
  message: string;
  variant?: 'teal' | 'vault' | 'warning';
}

const variantStyles: Record<string, { bg: string }> = {
  teal: { bg: colors.gradient.teal },
  vault: { bg: colors.gradient.secondary },
  warning: { bg: colors.gradient.live },
};

export function EmailBanner({ message, variant = 'teal' }: Props) {
  const s = variantStyles[variant];
  return (
    <tr>
      <td
        style={{
          background: s.bg,
          padding: '14px 24px',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            color: colors.white,
            fontSize: '14px',
            fontWeight: 700,
          }}
        >
          {message}
        </span>
      </td>
    </tr>
  );
}
