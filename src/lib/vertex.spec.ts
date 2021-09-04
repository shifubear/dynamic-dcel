import test from 'ava';

import { Vertex } from './vertex';

test('Vertex: constructor', (t) => {
  const v: Vertex = new Vertex(0, [0, 2]);
  t.assert(v.id === 0);
  t.assert(v.position[0] === 0);
  t.assert(v.position[1] === 2);
  t.assert(v.halfedge === null);
});
