import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../../src/lib/command-runner.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { createCommandRunner } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('prevents duplicate writes until save and refresh complete', async () => {
  const run = createCommandRunner();
  const events = [];
  let finish;
  const refresh = new Promise(resolve => { finish = resolve; });
  const command = {
    execute: async input => events.push(input),
    success: () => refresh,
    failure: error => { throw error; },
    pending: value => events.push(value),
  };
  const first = run('save', command);
  await run('duplicate', command);
  assert.deepEqual(events, [true, 'save']);
  finish();
  await first;
  assert.deepEqual(events, [true, 'save', false]);
  await run('next', { ...command, success: undefined });
  assert.deepEqual(events.slice(-3), [true, 'next', false]);
});

test('failed write reports an error, skips success and permits retry', async () => {
  const run = createCommandRunner();
  const events = [];
  await run(undefined, {
    execute: async () => { throw new Error('Permission denied'); },
    success: () => events.push('unexpected success'),
    failure: error => events.push(error.message),
    pending: value => events.push(value),
  });
  assert.deepEqual(events, [true, 'Permission denied', false]);
  await run(undefined, { execute: async () => events.push('retried'), failure: () => {}, pending: () => {} });
  assert.equal(events.at(-1), 'retried');
});
