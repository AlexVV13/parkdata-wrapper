// test/parcAsterix.test.js
import ParcAsterix from "../src/destinations/parcasterix/parcasterix.js";

describe("ParcAsterix class", () => {
  let parc;

  beforeAll(() => {
    parc = new ParcAsterix();
  });

  describe("Destination entity", () => {
    test("buildDestinationEntity geeft de juiste structuur terug", async () => {
      const dest = await parc.buildDestinationEntity();
      expect(dest).toHaveProperty("_id", "parcasterix");
      expect(dest).toHaveProperty("slug", "parcasterix");
      expect(dest).toHaveProperty("name", "Parc Astérix");
      expect(dest).toHaveProperty("entityType");
      expect(dest).toHaveProperty("location");
      expect(dest.location).toHaveProperty("longitude");
      expect(dest.location).toHaveProperty("latitude");
    });
  });

  describe("Park entities", () => {
    test("buildParkEntities retourneert een array met één park", async () => {
      const parks = await parc.buildParkEntities();
      expect(Array.isArray(parks)).toBe(true);
      expect(parks.length).toBe(1);
      const park = parks[0];
      expect(park).toHaveProperty("_id");
      expect(park).toHaveProperty("_destinationId", "parcasterix");
      expect(park).toHaveProperty("slug");
      expect(park).toHaveProperty("name");
      expect(park).toHaveProperty("entityType");
      expect(park).toHaveProperty("location");
    });
  });

  describe("Openingstijden", () => {
    test("getOpeningTimes geeft een array van {date, intervals}", async () => {
      const openingTimes = await parc.getOpeningTimes();
      expect(Array.isArray(openingTimes)).toBe(true);
      if (openingTimes.length > 0) {
        const entry = openingTimes[0];
        expect(entry).toHaveProperty("date");
        expect(Array.isArray(entry.intervals)).toBe(true);
      }
    });
  });

  describe("Attracties", () => {
    test("getAttractions retourneert genormaliseerde attracties", async () => {
      const attractions = await parc.getAttractions();
      expect(Array.isArray(attractions)).toBe(true);
      if (attractions.length > 0) {
        const a = attractions[0];
        expect(a).toHaveProperty("id");
        expect(a).toHaveProperty("name");
        expect(a).toHaveProperty("entityType");
        expect(a).toHaveProperty("status");
        expect(a).toHaveProperty("queues");
        expect(a).toHaveProperty("lastUpdated");
        if (a.location) {
          expect(a.location).toHaveProperty("lat");
          expect(a.location).toHaveProperty("lng");
        }
      }
    });
  });

  describe("Restaurants", () => {
    test("getRestaurants retourneert genormaliseerde restaurant entities", async () => {
      const restaurants = await parc.getRestaurants();
      expect(Array.isArray(restaurants)).toBe(true);
      if (restaurants.length > 0) {
        const r = restaurants[0];
        expect(r).toHaveProperty("id");
        expect(r).toHaveProperty("name");
        expect(r).toHaveProperty("entityType", "restaurant");
        expect(r).toHaveProperty("status");
        expect(r).toHaveProperty("queues");
        expect(r).toHaveProperty("lastUpdated");
      }
    });
  });

  describe("Live data", () => {
    test("buildEntityLiveData geeft entities met queues en status", async () => {
      const live = await parc.buildEntityLiveData();
      expect(Array.isArray(live)).toBe(true);
      if (live.length > 0) {
        const l = live[0];
        expect(l).toHaveProperty("id");
        expect(l).toHaveProperty("status");
        expect(l).toHaveProperty("queues");
        expect(Array.isArray(l.queues)).toBe(true);
      }
    });
  });
});

