import { parkData } from "../index.js";

async function main() {
  console.log("Ondersteunde bestemmingen:");
  Object.keys(parkData.destinations).forEach(dest => {
    console.log(`- ${dest}`);
  });

  if (parkData.destinations.parcAsterix) {
    const parc = parkData.destinations.parcAsterix;
    const attractions = await parc.getAttractions();
    console.log("\nAttracties Parc Asterix:");
    attractions.forEach(a => {
      console.log(`${a.name} — Status: ${a.status}, WaitTime: ${a.waitTime ?? "n/a"} min`);
    });
  }
}

main().catch(err => {
  console.error("Fout bij ophalen parkdata:", err);
});
