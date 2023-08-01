module.exports = {
  env: {
    browser: true,
    commonjs: false,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'import',
  ],
  rules: {
    'linebreak-style': 0,
    camelCase: 'off',
    'import/extensions': ['error', 'always', {
      js: 'always',
      jsx: 'always',
      json: 'always',
      ts: 'always',
      tsx: 'always',
    }],
  },
};
