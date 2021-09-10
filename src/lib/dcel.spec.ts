import test from 'ava';
import { vec2 } from 'gl-matrix';

import { DCEL } from './dcel';
import { HalfEdge } from './halfedge';
import { Vertex } from './vertex';

test('DCEL: Constructor', async (t) => {
  const dcel = new DCEL();

  t.assert(dcel.faceRecord.length == 1);
});

test('DCEL: addVertex', async (t) => {
  const dcel = new DCEL();

  // Test 0: Correctly initializes the vertex record
  t.assert(dcel.vertexRecord.length === 0);

  // Test 1: Correctly adds the vertex to the vertex record
  const v1 = dcel.addVertex([1, 3]);
  t.assert(dcel.vertexRecord.length === 1);
  t.assert(vec2.equals(dcel.vertexRecord[0].position, [1, 3]));

  // Test 2: Correctly throws an error if existing vertex is added
  const error = t.throws(
    () => {
      dcel.addVertex([1, 3]);
    },
    { instanceOf: Error }
  );
  t.is(error.message, 'Vertex at 1,3 already exists.');

  // Test 3: Correctly throws an error if non integer vertex is added
  const error2 = t.throws(
    () => {
      dcel.addVertex([1.3, 3.2]);
    },
    { instanceOf: Error },
    "Doesn't throw an error if non integer vertex is added!!"
  );
  t.is(error2.message, 'Vertices must have integer coordinates.');

  // Test 4: Correctly returns the ID of the created vertices
  const v2 = dcel.addVertex([2, 4]);
  t.assert(v1.id === 0);
  t.assert(v2.id === 1);
});

test('DCEL: recomputeFaces', async (t) => {
  const dcel = new DCEL();
  dcel.vertexRecord = [
    new Vertex(0, [0, 0]),
    new Vertex(1, [1, 2]),
    new Vertex(2, [3, 2]),
    new Vertex(3, [2, 0]),
  ];
  const h1 = new HalfEdge(0, dcel.vertexRecord[0], dcel.vertexRecord[1]);
  const h2 = new HalfEdge(1, dcel.vertexRecord[1], dcel.vertexRecord[0]);
  const h3 = new HalfEdge(2, dcel.vertexRecord[1], dcel.vertexRecord[2]);
  const h4 = new HalfEdge(3, dcel.vertexRecord[2], dcel.vertexRecord[1]);
  const h5 = new HalfEdge(4, dcel.vertexRecord[2], dcel.vertexRecord[3]);
  const h6 = new HalfEdge(5, dcel.vertexRecord[3], dcel.vertexRecord[2]);
  const h7 = new HalfEdge(6, dcel.vertexRecord[3], dcel.vertexRecord[0]);
  const h8 = new HalfEdge(7, dcel.vertexRecord[0], dcel.vertexRecord[3]);
  h1.twin = h2;
  h2.twin = h1;
  h3.twin = h4;
  h4.twin = h3;
  h5.twin = h6;
  h6.twin = h5;
  h7.twin = h8;
  h8.twin = h7;
  h1.next = h3;
  h3.next = h5;
  h5.next = h7;
  h7.next = h1;
  h1.prev = h7;
  h7.prev = h5;
  h5.prev = h3;
  h3.prev = h1;
  h2.next = h4;
  h4.next = h6;
  h6.next = h8;
  h8.next = h2;
  h2.prev = h8;
  h8.prev = h6;
  h6.prev = h4;
  h4.prev = h2;
  dcel.halfedgeRecord = [h1, h2, h3, h4, h5, h6, h7, h8];
  dcel.recomputeFaces();

  t.assert(dcel.faceRecord.length === 2);
  t.assert(dcel.faceRecord[0].outer === null);
  t.assert(dcel.faceRecord[0].inner.id === h8.id);
  t.assert(dcel.faceRecord[1].inner === null);
  t.assert(dcel.faceRecord[1].outer.id === h1.id);
});

test('DCEL: addEdge', async (t) => {
  const dcel = new DCEL();

  // Test 0: Correctly initializes the halfedge record
  t.assert(dcel.halfedgeRecord.length === 0);

  // Test 1: Correctly adds halfedge between two vertices
  const v1 = dcel.addVertex([0, 0]);
  const v2 = dcel.addVertex([5, 0]);
  dcel.addEdge(v1.id, v2.id);
  const h1 = dcel.halfedgeRecord[0];
  const h2 = dcel.halfedgeRecord[1];
  t.assert(dcel.halfedgeRecord.length === 2);
  t.assert(h1.twin.id === h2.id);
  t.assert(h2.twin.id === h1.id);
  t.assert(h1.next.id === h2.id);
  t.assert(h2.next.id === h1.id);
  t.assert(h1.prev.id === h2.id);
  t.assert(h2.prev.id === h1.id);
  t.assert(v1.halfedge.id === h1.id);
  t.assert(v2.halfedge.id === h2.id);
  t.assert(dcel.faceRecord[0].inner.id === h1.id);
  t.assert(h1.face.id === dcel.faceRecord[0].id);
  t.assert(h2.face.id === dcel.faceRecord[0].id);

  // Test 2: Correctly sets the relations around an "end" vertex
  const v3 = dcel.addVertex([0, 5]);
  dcel.addEdge(v3.id, v1.id);
  const h3 = dcel.halfedgeRecord[2];
  const h4 = dcel.halfedgeRecord[3];
  t.assert(dcel.halfedgeRecord.length === 4);
  t.assert(h3.twin.id === h4.id);
  t.assert(h4.twin.id === h3.id);
  t.assert(h3.next.id === h1.id);
  t.assert(h1.prev.id === h3.id);
  t.assert(h2.next.id === h4.id);
  t.assert(h4.prev.id === h2.id);
  t.assert(h4.next.id === h3.id);
  t.assert(h3.prev.id === h4.id);
  t.assert(v1.halfedge.id === h1.id);
  t.assert(v2.halfedge.id === h2.id);
  t.assert(v3.halfedge.id === h3.id);

  // Test 3: Correctly sets the relations around a "start" vertex

  const v4 = dcel.addVertex([5, 5]);
  dcel.addEdge(v2.id, v4.id);
  const h5 = dcel.halfedgeRecord[4];
  const h6 = dcel.halfedgeRecord[5];
  t.assert(dcel.halfedgeRecord.length === 6);
  t.assert(h5.twin.id === h6.id);
  t.assert(h6.twin.id === h5.id);
  t.assert(h5.next.id === h6.id);
  t.assert(h6.prev.id === h5.id);
  t.assert(h1.next.id === h5.id);
  t.assert(h5.prev.id === h1.id);
  t.assert(h6.next.id === h2.id);
  t.assert(h2.prev.id === h6.id);
  t.assert(v4.halfedge.id === h6.id);

  // Test 4: Correctly closes a face
  dcel.addEdge(v3.id, v4.id);
  const h7 = dcel.halfedgeRecord[6];
  const h8 = dcel.halfedgeRecord[7];
  t.assert(dcel.halfedgeRecord.length === 8);
  t.assert(h4.next.id === h7.id);
  t.assert(h7.prev.id === h4.id);
  t.assert(h7.next.id === h6.id);
  t.assert(h6.prev.id === h7.id);
  t.assert(h5.next.id === h8.id);
  t.assert(h8.prev.id === h5.id);
  t.assert(h8.next.id === h3.id);
  t.assert(h3.prev.id === h8.id);
  // t.assert(dcel.faceRecord.length == 2);
  // t.assert(dcel.faceRecord[0].inner.id === h7.id);
  // t.assert(dcel.faceRecord[1].outer.id === h8.id);
});
