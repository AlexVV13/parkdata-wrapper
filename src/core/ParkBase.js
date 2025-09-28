import { cached } from "./cache.js";
import { QUEUE_TYPES } from "./queueTypes.js";
import { TAGS } from "./tagsConfig.js";

/**
 * Abstract base class voor een attractiepark.
 * Wordt uitgebreid door concrete parkmodules.
 */
export default class ParkBase {
  /**
   * @param {Object} options
   * @param {string} options.parkId - Unieke ID van het park
   * @param {string} options.name - Naam van het park
   * @param {string|null} options.destination - Resortnaam of null
   * @param {Object} options.apiConfig - API configuratie { baseUrl, options }
   * @param {string} [options.timezone=Europe/Paris] - Tijdzone van het park
   */
  constructor({ parkId, name, destination, apiConfig, timezone = "Europe/Paris" }) {
    this.parkId = parkId;
    this.name = name;
    this.destination = destination;
    this.apiConfig = apiConfig;
    this.timezone = timezone;
  }

  // -------------------
  // API Fetch helpers
  // -------------------

  /**
   * Voer een raw fetch uit naar de API.
   * @param {string} endpoint - Endpoint achter baseUrl
   * @returns {Promise<any>} JSON response
   */
  async fetchRaw(endpoint) {
    const url = `${this.apiConfig.baseUrl}/${endpoint}`;
    const opts = this.apiConfig.options || {};
    const resp = await fetch(url, opts);
    if (!resp.ok) {
      throw new Error(`Failed to fetch ${url}: ${resp.status}`);
    }
    return resp.json();
  }

  /**
   * Cached fetch wrapper.
   * @param {string} key - Cache key
   * @param {number} ttl - Tijd in seconden
     * @param {() => Promise<*>} fn - Fetch functie
     * @returns {Promise<*>}
   */
  async cachedFetch(key, ttl, fn) {
    return cached(`${this.parkId}:${key}`, ttl, fn);
  }

  // -------------------
  // Abstract data getters
  // -------------------

  /**
   * Haal attracties op van het park.
   * @abstract
   * @returns {Promise<Array<Object>>}
   */
  async getAttractions() {
    throw new Error("Must implement getAttractions()");
  }

  /**
   * Haal shows op van het park.
   * @abstract
   * @returns {Promise<Array<Object>>}
   */
  async getShows() {
    throw new Error("Must implement getShows()");
  }

  /**
   * Haal restaurants op van het park.
   * @abstract
   * @returns {Promise<Array<Object>>}
   */
  async getRestaurants() {
    throw new Error("Must implement getRestaurants()");
  }

  /**
   * Haal openingstijden op van het park.
   * @abstract
   * @returns {Promise<Array<Object>>}
   */
  async getOpeningTimes() {
    throw new Error("Must implement getOpeningTimes()");
  }

  // -------------------
  // Helpers & utilities
  // -------------------

  /**
   * Normaliseer wachtrij data.
   * @param {Object} options
   * @param {number|null} [options.waitTime=null] - Wachttijd in minuten
   * @param {string} [options.status="Closed"] - Status van de wachtrij
   * @param {string} [options.type=QUEUE_TYPES.STANDBY] - Type wachtrij
   * @returns {Object} Genormaliseerd wachtrij object
   */
  normalizeQueue({ waitTime = null, status = "Closed", type = QUEUE_TYPES.STANDBY }) {
    return {
      queue_type: type,
      display_wait_time: waitTime,
      status,
    };
  }

  /**
   * Normaliseer entity data (attractie, show, restaurant).
   * @param {Object} options
   * @param {string} options.id - Unieke ID binnen het park
   * @param {string} options.name - Naam van de entity
   * @param {string} options.entityType - Type entity ("ride", "show", "restaurant")
   * @param {Array<string>} [options.tags=[]] - Tags
   * @param {Object} [options.location={}] - Locatie { lat, lng }
   * @param {number|null} [options.waitTime=null] - Wachttijd
   * @param {string} [options.status="Closed"] - Status
   * @param {Array<Object>} [options.queues=[]] - Queue data
   * @returns {Object} Genormaliseerd entity object
   */
  normalizeEntity({ id, name, entityType, tags = [], location = {}, waitTime = null, status = "Closed", queues = [] }) {
    return {
      id: `${this.parkId}-${id}`,
      name,
      entityType,
      destination: this.destination,
      park: this.name,
      tags,
      location,
      status,
      waitTime,
      queues,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Bouw een standaard openingstijd object.
   * @param {Object} options
   * @param {string} options.date - Datum in 'YYYY-MM-DD'
   * @param {string|null} [options.openingTime=null] - Openingstijd ISO
   * @param {string|null} [options.closingTime=null] - Sluitingstijd ISO
   * @param {string} [options.type="OPERATING"] - Type dag
   * @returns {Object} Genormaliseerd openingstijd object
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
   * Haal metadata op over dit park.
   * @returns {Object} Metadata object
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
