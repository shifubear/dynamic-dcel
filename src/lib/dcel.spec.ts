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
  dcel.addVertex([1, 3]);
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
});
