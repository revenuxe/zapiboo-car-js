import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../../src/lib/safe-redirect.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { safeRedirect } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('preserves local booking paths and query parameters', () => {
  assert.equal(safeRedirect('/pickup?bookingAuth=1'), '/pickup?bookingAuth=1');
  assert.equal(safeRedirect('/admin/dashboard'), '/admin/dashboard');
  assert.equal(safeRedirect('/materials#prices'), '/materials#prices');
});

test('rejects external, malformed, and script redirects', () => {
  for (const value of ['https://evil.example', '//evil.example', '/\\evil.example', 'javascript:alert(1)', '/\nevil', undefined, ['//evil.example']]) assert.equal(safeRedirect(value), '/account');
});
