import { vec2 } from 'gl-matrix';

import { Face } from './face';
import { Vertex } from './vertex';

/**
 * Represents a halfedge in the DCEL structure.
 * @constructor
 *
 * @param {number} id - The unique ID of this halfedge
 * @param {Vertex} start - The start vertex of this halfedge
 * @param {Vertex} end - The ending vertex of this halfedge
 * @param {HalfEdge} twin - The twin of this halfedge
 * @param {HalfEdge} next - The next halfedge starting from end in the counter-clockwise direction
 * @param {HalfEdge} prev - The previous halfedge pointing to start
 * @param {Face} face - The face adjacent to this halfedge
 * @param {vec2} vec - A vector representing this halfedge
 */
export class HalfEdge {
  id: number;
  start: Vertex;
  end: Vertex;
  twin: HalfEdge;
  next: HalfEdge;
  prev: HalfEdge;
  face: Face;
  vec: vec2;
  cycleID: number;

  /**
   * Creates a new half edge with an id, as well as start and end vertices
   * @param id
   * @param start
   * @param end
   */
  constructor(id: number, start: Vertex, end: Vertex) {
    this.id = id;
    this.start = start;
    this.end = end;

    this.twin = null;
    this.next = null;
    this.prev = null;
    this.face = null;

    this.vec = vec2.create();
    vec2.subtract(this.vec, this.end.position, this.start.position);

    this.cycleID = -1;
  }

  /**
   * Computes the clockwise angle in radians between this halfedge and h2. Both halfedges must have the same start vertex.
   * @param h2  A halfedge that shares the same start vertex as this halfedge.
   */
  cwAngle(h2: HalfEdge) {
    if (this.start.id !== h2.start.id) {
      throw Error(
        'cwAngle: The two halfedges ' +
          this.id +
          ' and ' +
          h2.id +
          ' must share the same start vertex!'
      );
    }

    const dot = vec2.dot(h2.vec, this.vec);
    const det = h2.vec[0] * this.vec[1] - this.vec[0] * h2.vec[1];

    let angle = Math.atan2(det, dot);

    if (angle < 0) {
      angle = 2 * Math.PI + angle;
    }

    return angle;
  }
}
