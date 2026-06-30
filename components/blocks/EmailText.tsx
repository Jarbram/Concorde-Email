import { colors } from '@/lib/colors';

interface Props {
  text: string;
  align?: 'left' | 'center';
  size?: 'body' | 'caption';
}

export function EmailText({ text, align = 'left', size = 'body' }: Props) {
  const fontSize = size === 'caption' ? '13px' : '15px';
  const color = size === 'caption' ? colors.surface.neutral : colors.text.secondary;

  return (
    <tr>
      <td
        style={{
          fontSize,
          color,
          lineHeight: 1.65,
          paddingBottom: '16px',
          textAlign: align,
        }}
      >
        {text}
      </td>
    </tr>
  );
}
