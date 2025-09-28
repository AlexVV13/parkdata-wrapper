import ParcAsterix from './parcasterix/parcasterix.js';

/**
 * Alle ondersteunde bestemmingen / resorts.
 * Resorts bevatten meerdere parken, losse parken bevatten enkel zichzelf.
 *
 * @type {Object.<string, Object>}
 * @property {Object} parcAsterix - Parc Asterix park instance
 *
 * @example
 * import destinations from './src/index.js';
 * const parc = destinations.parcAsterix;
 * const attractions = await parc.getAttractions();
 */
export const destinations = {
    // Resort voorbeeld (Universal / Disney etc.)
    // universalOrlando: {
    //   name: "Universal Orlando",
    //   parks: {
    //     islandsOfAdventure: new UniversalIslandsOfAdventure(),
    //     universalStudios: new UniversalStudiosFlorida(),
    //   }
    // },

    // Los park (geen resort)
    parcAsterix: new ParcAsterix(),
};

export default destinations;

