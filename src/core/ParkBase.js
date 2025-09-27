// src/core/ParkBase.js
import { cached } from "./cache.js";
import { QUEUE_TYPES } from "./queueTypes.js";
import { TAGS } from "./tagsConfig.js";

export default class ParkBase {
  constructor({ parkId, name, destination, apiConfig }) {
    this.parkId = parkId;
    this.name = name;
    this.destination = destination;
    this.apiConfig = apiConfig;
  }

  // Fetch raw data — te overschrijven door concrete park
  async fetchRaw(endpoint) {
    const url = `${this.apiConfig.baseUrl}/${endpoint}`;
    // eventueel headers / auth etc.
    const resp = await fetch(url);
    return resp.json();
  }

  // Entities moeten geconverteerd worden
  async getAttractions() {
    throw new Error("Must implement getAttractions()");
  }

  async getShows() {
    throw new Error("Must implement getShows()");
  }

  async getRestaurants() {
    throw new Error("Must implement getRestaurants()");
  }

  async getOpeningTimes() {
    throw new Error("Must implement getOpeningTimes()");
  }

  // Hulp: een cached fetch wrapper
  async cachedFetch(key, ttl, fn) {
    return cached(`${this.parkId}:${key}`, ttl, fn);
  }
}
