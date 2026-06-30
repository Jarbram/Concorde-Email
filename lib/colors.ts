export const colors = {
  vault: {
    400: '#ae8eff',
    500: '#8460e5',
    600: '#5a35c2',
    700: '#3b1782',
    800: '#340091',
    900: '#22005c',
    950: '#140046',
  },
  orange: {
    400: '#fbc47d',
    600: '#ed8936',
    700: '#d46e20',
  },
  teal: {
    400: '#00cccc',
    500: '#00aeb1',
    600: '#009095',
    700: '#008688',
  },
  live: {
    from: '#ff9639',
    mid: '#ef852e',
    to: '#be3d00',
  },
  header: {
    from: '#5F3ED8',
    mid: '#340091',
    to: '#140046',
  },
  white: '#ffffff',
  text: {
    primary: '#191C1C',
    secondary: '#4a4a4a',
    muted: '#6b6b7b',
    purple: '#4C1EBC',
  },
  surface: {
    tint: '#f8f6ff',
    border: '#f0edf7',
    disabled: '#e1e3e2',
    neutral: '#99a1af',
  },
  gradient: {
    primary: 'linear-gradient(135deg, #ed8936 0%, #ed8936 40%, #8460e5 100%)',
    secondary: 'linear-gradient(135deg, #8460e5 0%, #3b1782 100%)',
    negotiable: 'linear-gradient(135deg, #00aeb1 0%, #00aeb1 40%, #8460e5 100%)',
    header: 'linear-gradient(157deg, #5F3ED8 0%, #340091 50%, #140046 100%)',
    live: 'linear-gradient(90deg, #ff9639 0%, #ef852e 50%, #be3d00 100%)',
    teal: 'linear-gradient(90deg, #00DAE0 0%, #008688 100%)',
    ctaShadow: '0 1px 0 2px rgba(255,255,255,0.28) inset, 0 2px 6px rgba(237,137,54,0.3)',
    tealShadow: '0 1px 0 2px rgba(255,255,255,0.28) inset, 0 2px 6px rgba(0,174,177,0.35)',
    cardShadow: '0 0 16px 4px rgba(0,0,0,0.10)',
  },
} as const;

export type ColorKey = keyof typeof colors;
