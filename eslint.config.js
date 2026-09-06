import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
export default tseslint.config(
  { ignores: ['node_modules/**', '.next/**', '.vercel/**', '.validation/**', 'supabase/**', 'test-results/**', 'playwright-report/**', 'next-env.d.ts'] },
  { files: ['src/**/*.{ts,tsx}'], extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { 'react-hooks': reactHooks },
    rules: { ...reactHooks.configs.recommended.rules, '@typescript-eslint/no-unused-vars': 'off', '@typescript-eslint/no-explicit-any': 'off', '@typescript-eslint/no-empty-object-type': 'off' }
  }
);
