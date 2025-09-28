# parkData

A Node.js wrapper for retrieving theme park data such as attractions, restaurants, shows, opening hours, and live wait times for various parks and resorts.

![Node.js CI](https://github.com/AlexVV13/parkdata-wrapper/actions/workflows/nodejs.yml/badge.svg)
![Documentation](https://github.com/AlexVV13/parkdata-wrapper/actions/workflows/jsdoc.yml/badge.svg)
![Dependabot Status](https://img.shields.io/badge/dependabot-up_to_date-brightgreen)
![License: Apache 2.0](https://img.shields.io/badge/license-Apache%20License%202.0-blue)

---

## 📦 Installation

```bash
npm install parkdata
```

---

## 📥 Importing

```js
import { parkData } from 'parkdata';

// Or import a specific destination
import { parcAsterix } from 'parkdata/src/destinations/index.js';
```

---

## 🚀 Usage

```js
import { parkData } from 'parkData';

async function main() {
  // All available destinations
  console.log(parkData.destinations);

  // Specific park
  const parcAsterix = parkData.destinations.parcAsterix;
  const attractions = await parcAsterix.getAttractions();
  console.log(attractions);

  const openingTimes = await parcAsterix.getOpeningTimes();
  console.log(openingTimes);
}

main();
```

---

## 🗂️ Structure

```
parkData
└───destinations
    └───parcAsterix
        ├── Attractions
        ├── Restaurants
        ├── Shows
        └── OpeningTimes
```

---

## 🎢 Supported Destinations

| Slug        | Name         | Type | Location (Lat, Lon)     |
|-------------|--------------|------|--------------------------|
| parcAsterix | Parc Asterix | Park | 49.136750, 2.573816      |

> ℹ️ **Note:** If a destination is a resort, its individual parks will be listed automatically. Example: `Universal Orlando → Universal Islands of Adventure`.

---

## 🔧 Features

- `getAttractions()` – Fetches all attractions.
- `getRestaurants()` – Fetches all restaurants.
- `getShows()` – Fetches all shows.
- `getOpeningTimes()` – Fetches park opening hours.
- `getWaitTimeData()` – Fetches live wait times for attractions.

---

## 📄 License

Licensed under the **Apache 2.0** license.
