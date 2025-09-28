// test/test.js
import { parkData } from '../index.js';

async function main() {
  try {
    // Toon de ondersteunde bestemmingen
    console.log('Ondersteunde bestemmingen:');
    Object.keys(parkData.destinations).forEach(dest => {
      console.log(`- ${dest}`);
    });

    // Haal attracties van Parc Asterix op
    if (parkData.destinations.parcAsterix) {
      const parc = parkData.destinations.parcAsterix;
      const attractions = await parc.getAttractions();
      console.log('\nAttracties Parc Asterix:');
      attractions.forEach(a => {
        console.log(`${a.name} — Status: ${a.status}, WaitTime: ${a.waitTime ?? 'n/a'} min`);
      });
    }
  } catch (err) {
    console.error('Fout bij ophalen parkdata:', err);
  }
}

main();
