import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';

const names = ['index', 'sell-used-car', 'materials', 'pickup', 'contact', 'privacy', 'terms', 'auth', 'account', 'admin.login', 'admin.dashboard'];
function markup(source, file) {
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const result = [];
  function visit(node) {
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxFragment(node)) {
      let text = node.getText(ast).replace(/\bto=/g, 'href=');
      text = text.replace(/navigate\(\{ to: ([^,}]+), replace: true \}\)/g, 'router.replace($1)').replace(/navigate\(\{ to: ([^}]+) \}\)/g, 'router.push($1)');
      text = text.replaceAll('.mutate(', '.run(');
      // The hero uses Next Image with the same dimensions, classes, and asset.
      text = text.replace(/<Image\b/g, '<img').replace(/\s+sizes="100vw"/g, '').replace(/\s+preload\b/g, '');
      result.push(text.replace(/\s+/g, ' ').trim());
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  return result;
}
for (const name of names) {
  const old = execFileSync('git', ['show', `bc9b500:src/routes/${name}.tsx`], { encoding: 'utf8' });
  const current = fs.readFileSync(`src/views/${name}.tsx`, 'utf8');
  assert.deepEqual(markup(current, name), markup(old, name), `Page markup changed: ${name}`);
  console.log(`Preserved page markup: ${name}`);
}
const css = execFileSync('git', ['show', 'bc9b500:src/styles.css'], { encoding: 'utf8' });
assert.equal(fs.readFileSync('src/styles.css', 'utf8').replaceAll('\r\n', '\n'), css.replaceAll('\r\n', '\n'));
console.log('Preserved complete stylesheet');
