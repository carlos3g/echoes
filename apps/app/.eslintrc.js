// @ts-check

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  env: {
    es2021: true,
    jest: true,
  },
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    '@react-native',
    'plugin:react/jsx-runtime',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', '@tanstack/query'],
  overrides: [
    {
      files: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
      plugins: ['jest'],
      rules: {
        '@typescript-eslint/unbound-method': 0,
        'jest/unbound-method': 2,
      },
    },
    {
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    '@typescript-eslint/no-misused-promises': [
      2,
      {
        checksVoidReturn: false,
      },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'comma-dangle': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'react/style-prop-object': 0,
    'import/prefer-default-export': 0,
    '@typescript-eslint/unbound-method': 0,
    'global-require': 0,
    'react/jsx-props-no-spreading': 0,
    'react/require-default-props': 0,
    'react/no-unused-prop-types': 0,
    'no-void': 0,
    'no-useless-constructor': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/consistent-type-imports': 2,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.e2e-spec.ts', '**/*.spec.ts', 'src/test/**/*', 'tests/**/*'],
      },
    ],
  },
};
