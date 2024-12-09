import paazmaya from 'eslint-config-paazmaya';

export default [
  paazmaya,
  {
    languageOptions: {
    globals: {
      MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: 'readonly',
      MAIN_WINDOW_WEBPACK_ENTRY: 'readonly',
    },
  },
    extends: [
      'eslint:recommended',
      'plugin:import/recommended',
      'plugin:import/electron',
    ],
    parserOptions: {
      ecmaVersion: 'latest',
      ecmaFeatures: {
        jsx: true,
      },
    },
  }
];