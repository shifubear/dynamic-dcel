import test from 'ava';
import { vec2 } from 'gl-matrix';

import { HalfEdge } from './halfedge';
import { Vertex } from './vertex';

test('HalfEdge: constructor', (t) => {
  const v1 = new Vertex(0, [1, 3]);
  const v2 = new Vertex(1, [5, -2]);
  const he = new HalfEdge(0, v1, v2);

  t.assert(he.id === 0);
  t.assert(he.start.id === 0);
  t.assert(he.end.id === 1);
  t.assert(vec2.equals(he.start.position, [1, 3]));
  t.assert(vec2.equals(he.end.position, [5, -2]));
  t.assert(he.twin === null);
  t.assert(he.next === null);
  t.assert(he.prev === null);
  t.assert(he.face === null);

  t.assert(vec2.equals(he.vec, [4, -5]));
});

test('HalfEdge: cwAngle', (t) => {
  const v1 = new Vertex(0, [0, 0]);
  const v2 = new Vertex(1, [0, 1]);
  const v3 = new Vertex(2, [1, 0]);
  const v4 = new Vertex(3, [-1, -2]);
  const h1 = new HalfEdge(0, v1, v2);
  const h2 = new HalfEdge(1, v1, v3);
  const h3 = new HalfEdge(2, v2, v4);

  // Test 1: Computes the correct angles for different halfedges
  t.assert(
    Math.abs(h1.cwAngle(h2) - Math.PI / 2) < 0.001,
    "Doesn't compute the correct cwAngle"
  );
  t.assert(
    Math.abs(h2.cwAngle(h1) - (3 * Math.PI) / 2) < 0.001,
    "Doesn't compute the correct cwAngle"
  );

  // Test 2: Computes the correct angle between itself
  t.assert(h1.cwAngle(h1) === 0, 'Angle between itself should be 0');

  // Test 3: Properly throws an error if the start vertices are not the same
  const error = t.throws(
    () => {
      h1.cwAngle(h3);
    },
    { instanceOf: Error }
  );
  t.is(
    error.message,
    'cwAngle: The two halfedges ' +
      h1.id +
      ' and ' +
      h3.id +
      ' must share the same start vertex!'
  );
});
