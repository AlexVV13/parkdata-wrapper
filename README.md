# parkData

Een Node.js-module voor het ophalen van parkgegevens, zoals attracties, restaurants, shows, openingstijden en wachttijden, voor verschillende pretparken en resorts.

## Installatie

```bash
npm install parkdata
````

## Importeren

```
import parkData from 'parkdata';

// Of als je specifieke bestemming wilt importeren
import { parcAsterix } from 'parkdata/dist/destinations/index.js';
```

## Gebruik

```
import { parkData } from '@alexvv13/parkData';

async function main() {
  // Alle bestemmingen
  console.log(parkData.destinations);

  // Een specifiek park
  const parcAsterix = parkData.destinations.parcAsterix;
  const attractions = await parcAsterix.getAttractions();
  console.log(attractions);

  const openingTimes = await parcAsterix.getOpeningTimes();
  console.log(openingTimes);
}
main();
```

## Structuur van parkData

```
parkData
│
└───destinations
    │
    ├── parcAsterix
        └── Parc Asterix (park)
            ├── Attractions
            ├── Restaurants
            ├── Shows
            └── OpeningTimes
```

## Ondersteunde bestemmingen

| Slug             | Naam              | Type   | Locatie (Lat,Lon)   |
| ---------------- | ----------------- | ------ | ------------------- |
| parcAsterix      | Parc Asterix      | Park   | 49.136750, 2.573816 |

> **Opmerking:** Als een bestemming een resort is, worden de individuele parken binnen het resort automatisch weergegeven. Bijvoorbeeld: `Universal Orlando -> Universal Islands of Adventure`.

## Functionaliteit

* `getAttractions()` - Haalt alle attracties op.
* `getRestaurants()` - Haalt alle restaurants op.
* `getShows()` - Haalt alle shows op.
* `getOpeningTimes()` - Haalt de openingstijden van het park op.
* `getWaitTimeData()` - Haalt live wachttijden op voor attracties.

## Licentie

MIT

