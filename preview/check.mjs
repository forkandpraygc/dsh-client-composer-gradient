/**
 * Structural checks for the composer-gradient bundle: the scoped stylesheet is
 * injected, the marker attribute is set, and disposal removes both.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.join(here, '..', 'lib', 'client.js'), 'utf8');

let factory;
globalThis.window = {
  __ModuleLoader__: {
    load(def) {
      assert.equal(def.id, 'dsh-client-composer-gradient', 'bundle id must equal the package name');
      factory = def.factory;
    },
  },
};

const styles = [];
const attributes = new Set();
globalThis.document = {
  head: {
    appendChild(element) {
      styles.push(element);
      element.parent = globalThis.document.head;
    },
  },
  documentElement: {
    setAttribute(name) {
      attributes.add(name);
    },
    removeAttribute(name) {
      attributes.delete(name);
    },
    hasAttribute(name) {
      return attributes.has(name);
    },
  },
  createElement(tag) {
    const element = {
      tag,
      dataset: {},
      textContent: '',
      parent: null,
      remove() {
        const index = styles.indexOf(element);
        if (index >= 0) styles.splice(index, 1);
      },
    };
    return element;
  },
};

new Function('window', source)(globalThis.window);
assert.equal(typeof factory, 'function');

const mod = factory((id) => {
  throw new Error(`unexpected require(${id})`);
});

assert.equal(typeof mod.apply, 'function');
assert.match(mod.CSS, /\[data-composer-card\]/);
assert.match(mod.CSS, /linear-gradient/);
assert.match(mod.CSS, /conic-gradient/);
assert.match(mod.CSS, /background-size: 300% 300%/);
assert.match(mod.CSS, /@keyframes dsh-cg-pan/);
assert.match(mod.CSS, /@keyframes dsh-cg-spin/);
assert.match(mod.CSS, /prefers-reduced-motion/);

let dispose;
const ctx = {
  effect(callback) {
    dispose = callback();
    return dispose;
  },
};
mod.apply(ctx);

assert.equal(styles.length, 1, 'one stylesheet must be injected');
assert.equal(styles[0].dataset.plugin, mod.STYLE_ID);
assert.equal(styles[0].textContent, mod.CSS);
assert.equal(attributes.has(mod.ROOT_ATTRIBUTE), true, 'root marker must be set');

dispose();
assert.equal(styles.length, 0, 'stylesheet must be removed on dispose');
assert.equal(attributes.has(mod.ROOT_ATTRIBUTE), false, 'root marker must be removed');

console.log('ok: composer-gradient stylesheet injection and cleanup');
