module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: 'readonly',
    MAIN_WINDOW_WEBPACK_ENTRY: 'readonly',
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/electron',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
    },
  },
};
