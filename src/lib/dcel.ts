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
  }

  // addEdge(startID: number, endID: number) {
  //   // Add pair of halfedges to the halfedge record
  //   const start: Vertex = this.vertexRecord[startID];
  //   const end: Vertex = this.vertexRecord[endID];
  //   const h1: HalfEdge = new HalfEdge(this.halfedgeRecord.length, start, end);
  //   const h2: HalfEdge = new HalfEdge(
  //     this.halfedgeRecord.length + 1,
  //     end,
  //     start
  //   );
  //   // Assign each other as twins
  //   h1.twin = h2;
  //   h2.twin = h1;
  //   // Store the halfedges to update with
  //   let prevmax: HalfEdge = null;
  //   let prevmin: HalfEdge = null;
  //   let nextmax: HalfEdge = null;
  //   let nextmin: HalfEdge = null;
  //   // Handle the edge relations around the end vertex
  //   if (end.halfedge == null) {
  //     // If the end vertex has no edges, then h1.next is h2
  //     h1.next = h2;
  //     h2.prev = h1;
  //     end.halfedge = h2;
  //   } else {
  //     // Otherwise determine which halfedge is prev of h2
  //     const s = end.halfedge;
  //     let iter = s;
  //     let max: HalfEdge = s;
  //     let min: HalfEdge = s;
  //     let maxAngle = h2.cwAngle(max);
  //     let minAngle = h2.cwAngle(min);
  //     do {
  //       if (h2.cwAngle(iter) > maxAngle) {
  //         max = iter;
  //         maxAngle = h2.cwAngle(iter);
  //       }
  //       if (h2.cwAngle(iter) < minAngle) {
  //         min = iter;
  //         minAngle = h2.cwAngle(iter);
  //       }
  //       iter = iter.twin.next;
  //     } while (iter.id !== s.id);
  //     prevmax = max;
  //     prevmin = min;
  //   }
  //   // Handle the edge relations around the start vertex
  //   if (start.halfedge == null) {
  //     // If the start vertex has no edges, then h1.prev is h2
  //     h1.prev = h2;
  //     h2.next = h1;
  //     start.halfedge = h1;
  //   } else {
  //     // Otherwise determine which halfedge is prev of h1
  //     const s = start.halfedge;
  //     let iter: HalfEdge = s;
  //     let max: HalfEdge = s;
  //     let min: HalfEdge = s;
  //     let maxAngle: number = h1.cwAngle(max);
  //     let minAngle: number = h1.cwAngle(min);
  //     do {
  //       if (h1.cwAngle(iter) > maxAngle) {
  //         max = iter;
  //         maxAngle = h1.cwAngle(iter);
  //       }
  //       if (h1.cwAngle(iter) < minAngle) {
  //         min = iter;
  //         minAngle = h1.cwAngle(iter);
  //       }
  //       iter = iter.twin.next;
  //     } while (iter.id !== s.id);
  //     nextmax = max;
  //     nextmin = min;
  //   }
  //   if (end.halfedge != null) {
  //     h2.prev = prevmax;
  //     prevmax.next = h2;
  //     h1.next = prevmin;
  //     prevmin.prev = h1;
  //   }
  //   if (start.halfedge != null) {
  //     h2.next = nextmax;
  //     nextmax.prev = h2;
  //     h1.prev = nextmin;
  //     nextmin.next = h1;
  //   }
  //   // Determine if new faces were formed or not
  //   if (h1.next.id !== h2.id && h2.next.id !== h1.id) {
  //     // Full search
  //   } else if (h1.next.id !== h2.id && h2.next.id === h1.id) {
  //     h1.face = h1.next.face;
  //     h2.face = h1.face;
  //   } else if (h1.next.id === h2.id && h2.next.id !== h1.id) {
  //     h2.face = h2.next.face;
  //     h1.face = h2.face;
  //   } else {
  //     // Point location query to find face start belongs to
  //     // f = this.faceOf(start);
  //     // h1.face = f; h2.face = f;
  //   }
  //   // Add the halfedges to the record
  //   this.halfedgeRecord.push(h1);
  //   this.halfedgeRecord.push(h2);
  // }
}
