/**
 * Beschikbare entity types voor parkdata.
 * @enum {string}
 */
export const entityType = Object.freeze({
  /** Een resort of bestemming, bv. "Universal Orlando" */
  destination: 'destination',

  /** Een enkel park binnen een bestemming, bv. "Islands of Adventure" */
  park: 'park',

  /** Attractie / rit binnen een park */
  attraction: 'attraction',

  /** Restaurant binnen een park */
  restaurant: 'restaurant',

  /** Show of voorstelling binnen een park */
  show: 'show',
});

