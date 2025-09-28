import destinations from './src/destinations/index.js';

/**
 * Park data object met alle beschikbare bestemmingen en parken.
 * @typedef {Object} ParkData
 * @property {Object} destinations - Alle ondersteunde bestemmingen.
 */

/**
 * Het globale parkData object dat alle bestemmingen en parken bevat.
 * @type {ParkData}
 */
export const parkData = {
  destinations,
};

/**
 * Default export van de parkData module.
 * @type {ParkData}
 */
export default parkData;

