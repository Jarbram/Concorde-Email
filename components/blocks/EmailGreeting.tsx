import { colors } from '@/lib/colors';

interface Props {
  name: string;
  message: string;
}

export function EmailGreeting({ name, message }: Props) {
  return (
    <>
      <tr>
        <td
          style={{
            fontSize: '15px',
            color: colors.white,
            lineHeight: 1.65,
            paddingBottom: '8px',
          }}
        >
          Hola{' '}
          <strong style={{ color: colors.text.purple }}>{name}</strong>,
        </td>
      </tr>
      <tr>
        <td
          style={{
            fontSize: '15px',
            color: colors.text.secondary,
            lineHeight: 1.65,
            paddingBottom: '24px',
          }}
        >
          {message}
        </td>
      </tr>
    </>
  );
}
