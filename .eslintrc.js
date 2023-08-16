module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    // 'import/no-extraneous-dependencies': 'off',
    'no-underscore-dangle': 'off',
    // 'import/no-extraneous-dependencies': ['error', { packageDir: __dirname }],
  },
  // workingDirectories: [{ "mode": "auto" }],
};
