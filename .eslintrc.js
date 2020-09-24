module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  globals: {
    App: true,
    wx: true,
    Page: true,
    Component: true,
  },
  rules: {
    'linebreak-style': 'off',
    'import/prefer-default-export': 'off',
  },
};
