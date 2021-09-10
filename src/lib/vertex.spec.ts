import test from 'ava';

import { Vertex } from './vertex';

test('Vertex: constructor', (t) => {
  const v: Vertex = new Vertex(0, [0, 2]);
  t.assert(v.id === 0);
  t.assert(v.position[0] === 0);
  t.assert(v.position[1] === 2);
  t.assert(v.halfedge === null);
});

test('Vertex: Lexicographic order', (t) => {
  const v1: Vertex = new Vertex(0, [0, 2]);
  const v2: Vertex = new Vertex(1, [-2, 5]);
  const v3: Vertex = new Vertex(2, [0, -3]);

  t.assert(v2.isLexicographicallyLessThan(v1));
  t.assert(v2.isLexicographicallyLessThan(v3));
  t.assert(v3.isLexicographicallyLessThan(v1));
});
