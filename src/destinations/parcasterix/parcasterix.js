import fs from "fs";
import path from "path";
import axios from "axios";
import { tmpdir } from "os";
import AdmZip from "adm-zip";
import Database from "better-sqlite3";
import moment from "moment-timezone";

import ParkBase from "../../core/ParkBase.js";
import { mapTags } from "../../core/mappers/mapTags.js";
import { TAGS } from "../../core/tagsConfig.js";
import { entityType } from "../../core/entityType.js";

const GRAPHQL_URL = "https://api.middleware.parcasterix.fr/graphql";
const PACKAGE_VERSION = "1.1.29";
const CACHE_DIR = path.resolve("./cache");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);

/**
 * Class representing Parc Astérix park
 * @extends ParkBase
 */
export default class ParcAsterix extends ParkBase {
  /**
   * Create a ParcAsterix instance
   * @param {Object} [options={}] - Optional configuration
   * @param {string} [options.timezone] - Timezone to use, default "Europe/Paris"
   */
  constructor(options = {}) {
    super({
      parkId: "parcasterix",
      name: "Parc Astérix",
      destination: null,
      apiConfig: { baseUrl: GRAPHQL_URL },
      timezone: options.timezone || "Europe/Paris",
    });

    this.config = { ...options };
    this.packageVersion = null;
    this.sqliteFile = null;
  }

  // ───────────── GraphQL Helper ─────────────

  /**
   * Make a GraphQL query to the Parc Astérix middleware API
   * @param {string} query - GraphQL query string
   * @param {Object} [variables={}] - Optional query variables
   * @returns {Promise<Object>} - Response data
   * @throws {Error} - Throws if GraphQL returns errors
   */
  async makeGraphQLQuery(query, variables = {}) {
    const resp = await axios.post(
      GRAPHQL_URL,
      { query, variables },
      { headers: { "Content-Type": "application/json" } }
    );
    if (resp.data.errors) {
      throw new Error(`GraphQL error: ${JSON.stringify(resp.data.errors)}`);
    }
    return resp.data.data;
  }

  // ───────────── Download Offline Package ─────────────

  /**
   * Download the latest offline package from Parc Astérix API and extract SQLite file
   * @returns {Promise<void>}
   * @throws {Error} - Throws if package or SQLite file not found
   */
  async downloadOfflinePackage() {
    const resp = await axios.post(
      GRAPHQL_URL,
      { query: `query { offlinePackageLast { id version url } }` },
      {
        headers: {
          "x-package-version": PACKAGE_VERSION,
          "Content-Type": "application/json",
        },
      }
    );

    const pkg = resp.data.data.offlinePackageLast;
    if (!pkg) throw new Error("Geen offline package gevonden");

    if (
      pkg.version === this.packageVersion &&
      this.sqliteFile &&
      fs.existsSync(this.sqliteFile)
    )
      return;

    this.packageVersion = pkg.version;
    const zipPath = path.join(CACHE_DIR, "parcasterix.zip");

    const zipResp = await axios.get(pkg.url, { responseType: "arraybuffer" });
    fs.writeFileSync(zipPath, zipResp.data);

    const zip = new AdmZip(zipPath);
    const sqliteEntry = zip.getEntries().find((e) =>
      e.entryName.endsWith(".sqlite")
    );
    if (!sqliteEntry) throw new Error("SQLite file niet gevonden in zip");

    const tmpFile = path.join(tmpdir(), path.basename(sqliteEntry.entryName));
    fs.writeFileSync(tmpFile, sqliteEntry.getData());
    this.sqliteFile = tmpFile;
  }

  /**
   * Convert a string like "10h30" or "2:15 pm" to hour/minute numbers
   * @param {string} str - Time string
   * @returns {{hour: number, minute: number}|null}
   */
  stringHoursToNumbers(str) {
    if (!str) return null;
    const match = str.match(
      /(\d{1,2})(?:h|:)?(\d{1,2})?\s*(am|pm|a\.m|p\.m)?/i
    );
    if (!match) return null;

    let hour = parseInt(match[1], 10);
    let minute = match[2] ? parseInt(match[2], 10) : 0;
    const isPM = match[3] && match[3].toLowerCase().includes("p");

    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    return { hour, minute };
  }

  // ───────────── Load POI Database ─────────────

  /**
   * Load Points of Interest (POI) from the offline SQLite database
   * @returns {Promise<{poi: Array, calendar: Array}>} - POI and calendar data
   */
  async _loadPOIDatabase() {
    await this.downloadOfflinePackage();
    const db = new Database(this.sqliteFile, { readonly: true });

    const attractionData = db
      .prepare(`SELECT drupal_id, title, experience, latitude, longitude FROM attractions`)
      .all();

    const restaurantData = db
      .prepare(
        `SELECT drupal_id, title, meal_types, latitude, longitude, menu_url FROM restaurants`
      )
      .all();

    const showData = db
      .prepare(
        `SELECT drupal_id, title, duration, latitude, longitude FROM shows`
      )
      .all();

    const now = moment().tz(this.timezone).format("YYYY-MM-DD");
    const calendarItems = db
      .prepare("SELECT day, type FROM calendar_items WHERE day >= ?")
      .all(now);
    const labelsRaw = db
      .prepare(
        "SELECT key, value FROM labels WHERE key LIKE 'calendar.dateType.legend.%'"
      )
      .all();
    db.close();

    // map type -> intervals
    const typeMap = {};
    labelsRaw.forEach((l) => {
      const typeKey = l.key.replace("calendar.dateType.legend.", "");
      const matches = l.value
        .split("/")
        .map((s) => s.trim())
        .map((m) => {
          const [startStr, endStr] = m.split("-").map((s) => s.trim());
          const start = this.stringHoursToNumbers(startStr);
          const end = this.stringHoursToNumbers(endStr);
          if (!start || !end) return null;
          return { start, end };
        })
        .filter(Boolean);
      typeMap[typeKey] = matches.length ? matches : null;
    });

    const scheduleData = calendarItems.flatMap((c) => {
      const hours = typeMap[c.type];
      
      // Als er geen uren zijn, geef een lege speciale dag terug
      if (!hours) {
      const date = moment.tz(c.day, "YYYY-MM-DD", this.timezone);
        return [{
          date: date.format("YYYY-MM-DD"),
          openingTime: null,
          closingTime: null,
          type: "Closed",
          special: []
        }];
      }

      const date = moment.tz(c.day, "YYYY-MM-DD", this.timezone);

      return hours.map((h) => ({
        date: date.format("YYYY-MM-DD"),
        openingTime: date
          .clone()
          .set("hour", h.start.hour)
          .set("minute", h.start.minute)
          .format(),
        closingTime: date
          .clone()
          .set("hour", h.end.hour)
          .set("minute", h.end.minute)
          .format(),
        type: "Operating",
        special: []
      }));
    });


    const addTypeToEntries = (entries, type) =>
      entries.map((x) => ({ ...x, _type: type }));

    return {
      poi: [
        ...addTypeToEntries(attractionData, "attraction"),
        ...addTypeToEntries(restaurantData, "restaurant"),
        ...addTypeToEntries(showData, "show"),
      ],
      calendar: scheduleData,
    };
  }

  // ───────────── POI Getters ─────────────

  /**
   * Get all attractions with live wait times
   * @returns {Promise<Array>} - Normalized attraction entities
   */
  async getAttractions() {
    const { poi } = await this._loadPOIDatabase();
    const liveData = await this.buildEntityLiveData();

    return poi
      .filter((p) => p._type === "attraction")
      .map((a) => {
        const live = liveData.find(
          (l) => l.id === `parcasterix-${a.drupal_id}`
        );
        return this.normalizeEntity({
          id: a.drupal_id,
          name: a.title,
          entityType: "ride",
          tags: mapTags(a, [
            { if: (src) => src.experience === "thrill", tag: TAGS.THRILL },
          ]),
          location: { lat: a.latitude, lng: a.longitude },
          waitTime: live?.waitTime ?? 0,
          status: live?.status ?? "Unknown",
          queues: live?.queues ?? [],
        });
      });
  }

  /**
   * Get all shows
   * @returns {Promise<Array>} - Normalized show entities
   */
  async getShows() {
    const { poi, calendar } = await this._loadPOIDatabase();
    return poi
      .filter((p) => p._type === "show")
      .map((s) =>
        this.normalizeEntity({
          id: `show-${s.drupal_id}`,
          name: s.title,
          entityType: "show",
          location: { lat: s.latitude, lng: s.longitude },
          tags: [],
          waitTime: null,
          status: "Operating",
          queues: [],
          schedules: calendar,
        })
      );
  }

  /**
   * Get all restaurants
   * @returns {Promise<Array>} - Normalized restaurant entities
   */
  async getRestaurants() {
    const { poi, calendar } = await this._loadPOIDatabase();
    return poi
      .filter((p) => p._type === "restaurant")
      .map((r) =>
        this.normalizeEntity({
          id: `restaurant-${r.drupal_id}`,
          name: r.title,
          entityType: "restaurant",
          location: { lat: r.latitude, lng: r.longitude },
          tags: mapTags(r, []),
          waitTime: null,
          status: "Operating",
          queues: [],
          schedules: calendar,
        })
      );
  }

    /**
     * Get opening times as a flat array
     * @returns {Promise<Array<{date: string, openingTime: string, closingTime: string, type: string, special: Array}>>}
     */
    async getOpeningTimes() {
      const { calendar } = await this._loadPOIDatabase();
      return calendar; // flat array, geen intervals
    }


  // ───────────── Live Wait Times ─────────────

  /**
   * Fetch raw wait time data from API
   * @returns {Promise<Object>} - Wait time GraphQL response
   */
  async getWaitTimeData() {
    const query = `query paxPolling {
      paxLatencies { drupalId latency isOpen }
    }`;
    return this.makeGraphQLQuery(query);
  }

  /**
   * Build live entity data including wait times and status
   * @returns {Promise<Array>} - Array of live entities
   */
  async buildEntityLiveData() {
    const waitTimes = await this.getWaitTimeData();
    return waitTimes.paxLatencies.map((x) => {
      const latency =
        x.latency != null && !isNaN(parseInt(x.latency, 10)) ?
          parseInt(x.latency, 10) :
          0;

      if (!x.isOpen) {
        return {
          id: `parcasterix-${x.drupalId}`,
          status: "Closed",
          waitTime: 0,
          queues: [this.normalizeQueue({ waitTime: 0, status: "Closed" })],
          lastUpdated: new Date().toISOString(),
        };
      }

      return {
        id: `parcasterix-${x.drupalId}`,
        status: "Operating",
        waitTime: latency,
        queues: [this.normalizeQueue({ waitTime: latency, status: "Operating" })],
        lastUpdated: new Date().toISOString(),
      };
    });
  }

  // ───────────── Destination & Park Entities ─────────────

  /**
   * Build the destination entity object
   * @returns {Promise<Object>} - Destination entity
   */
  async buildDestinationEntity() {
    return {
      ...this.getMetadata(),
      _id: "parcasterix",
      slug: "parcasterix",
      name: "Parc Astérix",
      entityType: entityType.destination,
      location: { longitude: 2.573816, latitude: 49.13675 },
    };
  }

  /**
   * Build the park entity object
   * @returns {Promise<Array<Object>>} - Array of park entities
   */
  async buildParkEntities() {
    return [
      {
        ...this.getMetadata(),
        _id: "parcasterixpark",
        _destinationId: "parcasterix",
        _parentId: "parcasterix",
        slug: "parcasterix-park",
        name: "Parc Astérix",
        entityType: entityType.park,
        location: { longitude: 2.573816, latitude: 49.13675 },
      },
    ];
  }
}

