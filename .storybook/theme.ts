import { create } from '@storybook/theming/create';

export default create({
  base: 'dark',
  brandTitle: 'ProcureIQ Component Library',
  brandUrl: 'https://procureiq.internal',
  brandTarget: '_self',

  // Colors
  colorPrimary: '#0c8de9',
  colorSecondary: '#36a9f7',

  // UI
  appBg: '#0a0f18',
  appContentBg: '#0f172a',
  appPreviewBg: '#0f172a',
  appBorderColor: '#1e293b',
  appBorderRadius: 8,

  // Text colors
  textColor: '#f8fafc',
  textInverseColor: '#0f172a',

  // Toolbar default and active colors
  barTextColor: '#94a3b8',
  barSelectedColor: '#36a9f7',
  barHoverColor: '#e2e8f0',
  barBg: '#0f172a',

  // Form colors
  inputBg: '#1e293b',
  inputBorder: '#334155',
  inputTextColor: '#f8fafc',
  inputBorderRadius: 6,
});
