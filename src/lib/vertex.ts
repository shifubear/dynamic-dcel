import { vec2 } from 'gl-matrix';

import { HalfEdge } from './halfedge';

/**
 * Represents a vertex in the plane.
 * @constructor
 * @param {number} id - The unique ID of this vertex
 * @param {vec2} position - A 2 dimensional vector representing the position of this vertex
 * @param {HalfEdge} halfedge - Reference to a halfedge that is rooted at this vertex
 */
export class Vertex {
  id: number;
  position: vec2;
  halfedge: HalfEdge;

  constructor(id: number, pos: vec2) {
    this.id = id;
    this.position = pos;
    this.halfedge = null;
  }
}
