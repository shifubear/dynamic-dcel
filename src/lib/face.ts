import { HalfEdge } from './halfedge';

/**
 * Represents a face in the DCEL structure.
 * @constructor
 *
 * @param {number} id - The unique id of this face
 * @param {HalfEdge} outer - Reference to a halfedge on the outer boundary of this face
 * @param {HalfEdge} inner - Reference to a halfedge on the inner boundary of this face
 * @param {boolean} bounded - A boolean value representing whether this face is bounded or not
 */
export class Face {
  id: number;
  outer: HalfEdge;
  inner: HalfEdge;

  constructor(id: number) {
    this.id = id;
    this.outer = null;
    this.inner = null;
  }
}
