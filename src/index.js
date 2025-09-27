// src/index.js
import ParcAsterix from "./destinations/parcasterix/parcasterix.js";

async function demo() {
  const efteling = new ParcAsterix();

  console.dir(await efteling.getAttractions(), { depth: null });
  //console.log(await efteling.getShows());
  // console.log(await efteling.getRestaurants());
  console.log(await efteling.getOpeningTimes());
}

demo();
