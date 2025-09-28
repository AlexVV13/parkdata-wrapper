// src/index.js
import ParcAsterix from './parcasterix/parcasterix.js';

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

