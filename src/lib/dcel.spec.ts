import test from 'ava';
import { vec2 } from 'gl-matrix';

import { DCEL } from './dcel';

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

  // Testing situation as outlined in deBerg Figure 2.6
  // Component 1
  dcel.addVertex([-8, 0]);
  dcel.addVertex([-6, 3]);
  dcel.addVertex([-7, 7]);
  dcel.addVertex([-2, 7]);
  dcel.addVertex([2, 5]);
  dcel.addVertex([5, 6]);
  dcel.addVertex([9, 8]);
  dcel.addVertex([11, 2]);
  dcel.addVertex([10, -1]);
  dcel.addVertex([5, -4]);
  dcel.addVertex([-1, -1]);
  dcel.addVertex([-5, -2]);
  dcel.addEdge(0, 1);
  dcel.addEdge(1, 2);
  dcel.addEdge(2, 3);
  dcel.addEdge(3, 4);
  dcel.addEdge(4, 5);
  dcel.addEdge(5, 6);
  dcel.addEdge(6, 7);
  dcel.addEdge(7, 8);
  dcel.addEdge(8, 9);
  dcel.addEdge(9, 10);
  dcel.addEdge(10, 11);
  dcel.addEdge(11, 0);

  // Component 2
  dcel.addVertex([-3, 1]);
  dcel.addVertex([-4, 2]);
  dcel.addVertex([-3, 3]);
  dcel.addVertex([-4, 5]);
  dcel.addVertex([0, 4]);
  dcel.addVertex([-1, 1]);
  dcel.addEdge(12, 13);
  dcel.addEdge(13, 14);
  dcel.addEdge(14, 15);
  dcel.addEdge(15, 16);
  dcel.addEdge(16, 17);
  dcel.addEdge(17, 12);
  dcel.addEdge(14, 17);

  // Component 3
  dcel.addVertex([4, 0]);
  dcel.addVertex([2, 2]);
  dcel.addVertex([4, 4]);
  dcel.addVertex([8, 5]);
  dcel.addVertex([10, 3]);
  dcel.addVertex([8, 0]);
  dcel.addEdge(18, 19);
  dcel.addEdge(19, 20);
  dcel.addEdge(20, 21);
  dcel.addEdge(21, 22);
  dcel.addEdge(22, 23);
  dcel.addEdge(23, 18);

  // Outer cycle

  const cycles = dcel.recomputeFaces();

  t.assert(cycles.length === 8);
  // t.assert(cycles[0].id === 0);
  // t.assert(cycles[0].leftVertexID === 0);
  // t.assert(cycles[0].leftStart.id === 0);
  // t.assert(cycles[0].isBoundary === false);
  // t.assert(cycles[1].id === 1);
  // t.assert(cycles[1].leftVertexID === 0);
  // t.assert(cycles[1].leftStart.id === 7);
  // t.assert(cycles[1].isBoundary === true);
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
