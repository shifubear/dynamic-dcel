import { vec2 } from 'gl-matrix';

import { Face } from './face';
import { HalfEdge } from './halfedge';
import { Vertex } from './vertex';

/**
 * A class that implements a dynamic DCEL constrained to 2 dimensions.
 *
 * This DCEL can only store vertices at integer coordinates.
 *
 * ### Example (es imports)
 * ```js
 * import { DCEL } from 'dynamic-dcel'
 * dcel = new DCEL();
 * dcel.addVertex([0, 1]);
 * dcel.addVertex([1, 2]);
 * dcel.addEdge(0, 1);
 * ```
 *
 * @returns a Promise which should contain `['a','b','c']`
 */
export class DCEL {
  vertexRecord: Vertex[];
  halfedgeRecord: HalfEdge[];
  // edgeRecord: Edge[];
  faceRecord: Face[];

  constructor() {
    this.vertexRecord = [];
    this.halfedgeRecord = [];
    this.faceRecord = [new Face(0)];
  }

  /**
   * Adds a new vertex to the DCEL at position and adds it to the vertex record.
   *
   * @param {vec2} position - The position to create the new vertex at
   *
   * @throws Throws an error if a vertex exists in the position the new vertex is being added.
   * @throws Throws an error if the position doesn't have integer coordinates.
   *
   * @returns Returns the newly created vertex
   */
  addVertex(position: vec2) {
    if (!Number.isInteger(position[0]) || !Number.isInteger(position[1])) {
      throw Error('Vertices must have integer coordinates.');
    }
    for (const vert of this.vertexRecord) {
      if (vec2.equals(vert.position, position)) {
        throw Error('Vertex at ' + position + ' already exists.');
      }
    }
    const v = new Vertex(this.vertexRecord.length, position);
    this.vertexRecord.push(v);

    return v;
  }

  /**
   * Adds a new halfedge pair to the DCEL between vertices start and end
   * @param startID
   * @param endID
   *
   * @returns The pair of halfedges that define the newly created edge
   */
  addEdge(startID: number, endID: number) {
    const startV = this.vertexRecord[startID];
    const endV = this.vertexRecord[endID];

    const h1 = new HalfEdge(this.halfedgeRecord.length, startV, endV);
    const h2 = new HalfEdge(this.halfedgeRecord.length + 1, endV, startV);

    // Set the twin halfedges
    h1.twin = h2;
    h2.twin = h1;

    // Determine the relations around the end vertex
    if (endV.halfedge === null) {
      // If the end vertex has no halfedges
      h1.next = h2;
      h2.prev = h1;
      endV.halfedge = h2;
    } else {
      // Find the halfedge that is closest in the ccw direction
      const start: HalfEdge = endV.halfedge;
      let iter: HalfEdge = start;
      let min: HalfEdge = start;
      let max: HalfEdge = start;
      let minAngle: number = h2.cwAngle(iter);
      let maxAngle: number = h2.cwAngle(iter);

      do {
        iter = iter.twin.next;
        const angle: number = h2.cwAngle(iter);
        if (angle < minAngle) {
          min = iter;
          minAngle = angle;
        }
        if (angle > maxAngle) {
          max = iter;
          maxAngle = angle;
        }
      } while (iter.id !== start.id);

      h1.next = min;
      min.prev = h1;
      h2.prev = max.twin;
      max.twin.next = h2;
    }

    // Determine the relations around the start vertex
    if (startV.halfedge === null) {
      // If the start vertex has no halfedges
      h2.next = h1;
      h1.prev = h2;
      startV.halfedge = h1;
    } else {
      // Find the halfedge that is closest in the ccw direction
      const start: HalfEdge = startV.halfedge;
      let iter: HalfEdge = start;
      let min: HalfEdge = start;
      let max: HalfEdge = start;
      let minAngle: number = h1.cwAngle(iter);
      let maxAngle: number = h1.cwAngle(iter);
      do {
        iter = iter.twin.next;
        const angle: number = h1.cwAngle(iter);
        if (angle < minAngle) {
          minAngle = angle;
          min = iter;
        }
        if (angle > maxAngle) {
          maxAngle = angle;
          max = iter;
        }
      } while (iter.id !== start.id);

      h1.prev = max.twin;
      max.twin.next = h1;
      h2.next = min;
      min.prev = h2;
    }

    // Determine if any faces were created
    if (this.halfedgeRecord.length === 0) {
      // If this is the first edge added, no faces were created
      this.faceRecord[0].inner = h1;
      h1.face = this.faceRecord[0];
      h2.face = this.faceRecord[0];
    } else {
      // Traverse the edges using .next to see if a loop is formed
      let iter: HalfEdge = h1;
      let newFace = true;
      do {
        if (iter.id === h2.id) {
          // Not a closed face
          newFace = false;
          break;
        }
        iter = iter.next;
      } while (iter.id !== h1.id);

      if (newFace) {
        this.recomputeFaces();
      }
    }

    this.halfedgeRecord.push(h1);
    this.halfedgeRecord.push(h2);

    return { h1, h2 };
  }

  /**
   * Subroutine to recompute the faces in the DCEL.
   * Requires traversal of all halfedges O(|E|) time.
   */
  recomputeFaces() {
    // Compute all the existing loops in DCEL
    let checkedCount = this.halfedgeRecord.length;
    const checkedHE = Array(checkedCount).fill(false);
    const Cycles = [];
    let idx = -1;
    while (checkedCount > 0) {
      idx += 1;
      if (checkedHE[idx] === true) {
        continue;
      }

      const start: HalfEdge = this.halfedgeRecord[idx];
      let iter: HalfEdge = start;
      checkedHE[idx] = true;
      checkedCount -= 1;
      const Cycle = {
        id: Cycles.length,
        leftVertexID: -1,
      };
      let leftVertex: Vertex = iter.start;
      do {
        iter.cycleID = Cycle.id;
        checkedHE[iter.id] = true;
        checkedCount -= 1;

        iter = iter.next;
        if (iter.start.isLexicographicallyLessThan(leftVertex)) {
          leftVertex = iter.start;
        }
      } while (iter.id !== start.id);
      Cycle.leftVertexID = leftVertex.id;
      Cycles.push(Cycle);
    }
    console.log(Cycles);
  }
}
