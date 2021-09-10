import test from 'ava';

import { Face } from './face';

test('Face: constructor', (t) => {
  const f = new Face(0);
  t.assert(f.id === 0);
  t.assert(f.outer === null);
  t.assert(f.inner === null);
});
