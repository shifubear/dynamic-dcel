import { HalfEdge } from './halfedge';

/**
 * Represents a face in the DCEL structure.
 * @constructor
 *
 * @param {number} id - The unique id of this face
 * @param {HalfEdge} halfedge - Reference to a halfedge adjacent to this face
 * @param {boolean} bounded - A boolean value representing whether this face is bounded or not
 */
export class Face {
  id: number;
  halfedge: HalfEdge;
  bounded: boolean;

  constructor(id: number) {
    this.id = id;
    this.halfedge = null;
    this.bounded = false;
  }
}
