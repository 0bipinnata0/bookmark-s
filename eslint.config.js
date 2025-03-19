import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    ignores: ['out/**', 'dist/**', '**/*.d.ts']
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      // ESLint 推荐规则
      'no-unused-vars': 'off', // 使用 TypeScript 的规则代替
      'no-undef': 'off', // TypeScript 已经处理这个

      // TypeScript 特定规则
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    }
  }
]; 