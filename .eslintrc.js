module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb',
    'airbnb/hooks',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    // Your custom rules here
    'import/no-unresolved': [
      'error',
      { 
        commonjs: true, 
        amd: true,
        ignore: ['^src/', '^components/'],
      }
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      }
    ],
  },
  ignorePatterns: [
    'node_modules/',
    'build/',
    'dist/',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
