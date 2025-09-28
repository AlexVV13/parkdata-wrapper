// src/core/ParkBase.js
import { cached } from "./cache.js";
import { QUEUE_TYPES } from "./queueTypes.js";
import { TAGS } from "./tagsConfig.js";

export default class ParkBase {
  constructor({ parkId, name, destination, apiConfig, timezone = "Europe/Paris" }) {
    this.parkId = parkId;
    this.name = name;
    this.destination = destination; // Resortnaam, of null
    this.apiConfig = apiConfig;
    this.timezone = timezone;
  }

  // -------------------
  // API Fetch helpers
  // -------------------
  async fetchRaw(endpoint) {
    const url = `${this.apiConfig.baseUrl}/${endpoint}`;
    const opts = this.apiConfig.options || {};
    const resp = await fetch(url, opts);
    if (!resp.ok) {
      throw new Error(`Failed to fetch ${url}: ${resp.status}`);
    }
    return resp.json();
  }

  async cachedFetch(key, ttl, fn) {
    return cached(`${this.parkId}:${key}`, ttl, fn);
  }

  // -------------------
  // Abstract data getters
  // -------------------
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

  // -------------------
  // Helpers & utilities
  // -------------------

  /**
   * Normaliseer wachtrijtijden.
   * Zorgt dat elk object hetzelfde formaat heeft.
   */
  normalizeQueue({ waitTime = null, status = "Closed", type = QUEUE_TYPES.STANDBY }) {
    return {
      queue_type: type,
      display_wait_time: waitTime,
      status,
    };
  }

  /**
   * Normaliseer entity (attractie, show, restaurant).
   */
  normalizeEntity({ id, name, entityType, tags = [], location = {}, waitTime = null, status = "Closed", queues = [] }) {
    return {
      id: `${this.parkId}-${id}`,
      name,
      entityType, // "ride", "show", "restaurant"
      destination: this.destination,
      park: this.name,
      tags,
      location, // bv. { lat, lng }
      status,
      waitTime,
      queues,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Bouw een standaard openingstijd object.
   */
  normalizeSchedule({ date, openingTime = null, closingTime = null, type = "OPERATING" }) {
    return {
      date,
      openingTime,
      closingTime,
      type,
    };
  }

  /**
   * Return metadata over dit park
   */
  getMetadata() {
    return {
      id: this.parkId,
      name: this.name,
      destination: this.destination,
      timezone: this.timezone,
      tags: TAGS[this.parkId] || [],
    };
  }
}

