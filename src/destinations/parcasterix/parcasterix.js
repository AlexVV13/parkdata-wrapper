// src/destinations/ParcAsterix.js
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { tmpdir } from 'os';
import AdmZip from 'adm-zip';
import Database from 'better-sqlite3';
import moment from 'moment-timezone';

import ParkBase from '../../core/ParkBase.js';
import { mapTags } from '../../core/mappers/mapTags.js';
import { TAGS } from '../../core/tagsConfig.js';
import { entityType } from '../../core/entityType.js';

// ───────────────────────────────────────────────
// Constants
// ───────────────────────────────────────────────
const GRAPHQL_URL = 'https://api.middleware.parcasterix.fr/graphql';
const PACKAGE_VERSION = '1.1.29';
const CACHE_DIR = path.resolve('./cache');
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);

// ───────────────────────────────────────────────
// Parc Asterix Class
// ───────────────────────────────────────────────
export default class ParcAsterix extends ParkBase {
  constructor(options = {}) {
    options.timezone = options.timezone || 'Europe/Paris';
    options.apiBase = options.apiBase || GRAPHQL_URL;
    options.language = options.language || 'en';
    options.cacheVersion = options.cacheVersion || 1;

    super(options);

    this.config = { ...options };
    if (!this.config.apiBase) {
      throw new Error('Missing apiBase');
    }

    this.packageVersion = null;
    this.sqliteFile = null;
  }

  // ───────────────────────────────────────────────
  // GraphQL Helpers
  // ───────────────────────────────────────────────
  async makeGraphQLQuery(query, variables = {}) {
    const resp = await axios.post(
      GRAPHQL_URL,
      { query, variables },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (resp.data.errors) {
      throw new Error(`GraphQL error: ${JSON.stringify(resp.data.errors)}`);
    }
    return resp.data.data;
  }

  // ───────────────────────────────────────────────
  // Offline Package (SQLite)
  // ───────────────────────────────────────────────
  async downloadOfflinePackage() {
    const resp = await axios.post(
      GRAPHQL_URL,
      { query: `query { offlinePackageLast { id version url } }`, variables: {} },
      { headers: { 'x-package-version': PACKAGE_VERSION, 'Content-Type': 'application/json' } }
    );

    const pkg = resp.data.data.offlinePackageLast;
    if (!pkg) throw new Error('Geen offline package gevonden');

    if (pkg.version === this.packageVersion && this.sqliteFile && fs.existsSync(this.sqliteFile)) {
      return;
    }

    this.packageVersion = pkg.version;

    // Download zip
    const zipPath = path.join(CACHE_DIR, 'parcasterix.zip');
    const zipResp = await axios.get(pkg.url, { responseType: 'arraybuffer' });
    fs.writeFileSync(zipPath, zipResp.data);

    // Unzip & detecteer SQLite bestand
    const zip = new AdmZip(zipPath);
    const sqliteEntry = zip.getEntries().find(e => e.entryName.endsWith('.sqlite'));
    if (!sqliteEntry) throw new Error('SQLite file niet gevonden in zip');

    // Tijdelijk bestand voor SQLite
    const tmpFile = path.join(tmpdir(), path.basename(sqliteEntry.entryName));
    fs.writeFileSync(tmpFile, sqliteEntry.getData());
    this.sqliteFile = tmpFile;

    console.log(`SQLite package uitgepakt naar ${this.sqliteFile}`);
  }

  // ───────────────────────────────────────────────
  // Helpers
  // ───────────────────────────────────────────────
  stringHoursToNumbers(str) {
    const match = str.match(/(\d+):?(\d+)?\s*(am|pm|a\.m|p\.m)?/i);
    if (!match) return null;

    let hour = parseInt(match[1], 10);
    let minute = match[2] ? parseInt(match[2], 10) : 0;

    const isPM = match[3] && match[3].toLowerCase().includes('p');
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    return { hour, minute };
  }

  async _loadPOIDatabase() {
    await this.downloadOfflinePackage();
    const db = new Database(this.sqliteFile, { readonly: true });

    const attractionData = db.prepare(`
      SELECT drupal_id, title, experience, latitude, longitude, min_age, min_size, min_size_unaccompanied
      FROM attractions
    `).all();

    const restaurantData = db.prepare(`
      SELECT drupal_id, title, meal_types, latitude, longitude, menu_url, mobile_url
      FROM restaurants
    `).all();

    const showData = db.prepare(`
      SELECT drupal_id, title, duration, latitude, longitude
      FROM shows
    `).all();

    const now = moment().tz(this.config.timezone).format('YYYY-MM-DD');
    const schedules = db.prepare('SELECT * FROM calendar_items WHERE day >= ?').all(now);
    const labels = db.prepare("SELECT key, value FROM labels WHERE key LIKE 'calendar.dateType.legend.%'").all();
    db.close();

    // Labels naar openingstijden
    const hoursMap = labels.reduce((acc, x) => {
      const times = x.value.match(/(\d{1,2}:?\d{0,2}\s*(?:am|pm|a\.m|p\.m)?)[\s-]+(\d{1,2}:?\d{0,2}\s*(?:am|pm|a\.m|p\.m)?)/gi);
      if (!times) return acc;

      acc[x.key.replace('calendar.dateType.legend.', '')] = times.map(t => {
        const [startStr, endStr] = t.split(/[-to]+/i).map(s => s.trim());
        return { start: this.stringHoursToNumbers(startStr), end: this.stringHoursToNumbers(endStr) };
      });
      return acc;
    }, {});

    // Schedule format
    const scheduleData = schedules.flatMap(x => {
      const hours = hoursMap[x.type];
      if (!hours) return [];
      const date = moment.tz(x.day, 'YYYY-MM-DD', this.config.timezone);

      return hours.map(h => {
        let openingTime = date.clone().set('hour', h.start.hour).set('minute', h.start.minute);
        let closingTime = date.clone().set('hour', h.end.hour).set('minute', h.end.minute);
        if (closingTime.isBefore(openingTime)) closingTime.add(1, 'day');
        return {
          date: date.format('YYYY-MM-DD'),
          openingTime: openingTime.format(),
          closingTime: closingTime.format(),
          type: 'OPERATING'
        };
      });
    });

    const addTypeToEntries = (entries, type) => entries.map(x => ({ ...x, _type: type }));

    return {
      poi: [
        ...addTypeToEntries(attractionData, 'attraction'),
        ...addTypeToEntries(restaurantData, 'restaurant'),
        ...addTypeToEntries(showData, 'show')
      ],
      calendar: scheduleData
    };
  }

  // ───────────────────────────────────────────────
  // Public: Static POI Data
  // ───────────────────────────────────────────────
  async getAttractions() {
    const { poi, calendar } = await this._loadPOIDatabase();
    const liveData = await this.buildEntityLiveData();

    return poi
      .filter(p => p._type === 'attraction')
      .map(a => {
        const live = liveData.find(l => l.id === `parcasterix-${a.drupal_id}`);
        return {
          id: `parcasterix-${a.drupal_id}`,
          name: a.title,
          type: 'attraction',
          location: { lat: a.latitude, lng: a.longitude },
          tags: mapTags(a, [
            { if: src => src.experience === 'thrill', tag: TAGS.THRILL }
          ]),
          schedules: calendar,
          status: live ? live.status : 'UNKNOWN',
          queue: live ? live.queue : {},
          lastUpdated: new Date().toISOString()
        };
      });
  }

  async getShows() {
    const { poi, calendar } = await this._loadPOIDatabase();
    return poi
      .filter(p => p._type === 'show')
      .map(s => ({
        id: `parcasterix-show-${s.drupal_id}`,
        name: s.title,
        type: 'show',
        location: { lat: s.latitude, lng: s.longitude },
        schedules: calendar,
        lastUpdated: new Date().toISOString()
      }));
  }

  async getRestaurants() {
    const { poi, calendar } = await this._loadPOIDatabase();
    return poi
      .filter(p => p._type === 'restaurant')
      .map(r => ({
        id: `parcasterix-restaurant-${r.drupal_id}`,
        name: r.title,
        type: 'restaurant',
        location: { lat: r.latitude, lng: r.longitude },
        menu: r.menu_url ? [r.menu_url] : [],
        tags: mapTags(r, []),
        schedules: calendar,
        lastUpdated: new Date().toISOString()
      }));
  }

  // ───────────────────────────────────────────────
  // Public: Live Wait Times
  // ───────────────────────────────────────────────
  async getWaitTimeData() {
    const query = `query paxPolling {
      paxLatencies {
        drupalId
        latency
        isOpen
        message
        openingTime
        closingTime
      }
      paxSchedules {
        drupalId
        times {
          at
          startAt
          endAt
        }
      }
      paxMessages {
        id
        type
        label
        modalText
        modalImage
        url
        updatedAt
      }
    }`;

    return this.makeGraphQLQuery(query);
  }

  async buildEntityLiveData() {
    const waitTimes = await this.getWaitTimeData();

    return waitTimes.paxLatencies.map(x => {
      const data = {
        id: `parcasterix-${x.drupalId}`,
        status: 'OPERATING',
        lastUpdated: new Date().toISOString()
      };

      if (x.isOpen === false) {
        data.status = 'CLOSED';
      } else {
        data.queue = { standby: { waitTime: null } };

        if (x.latency !== null) {
          if (!isNaN(x.latency)) {
            data.queue.standby.waitTime = x.latency;
          } else if (typeof x.latency === 'string' && x.latency.match(/^\d+$/)) {
            data.queue.standby.waitTime = parseInt(x.latency, 10);
          } else {
            data.status = 'CLOSED';
          }
        }
      }

      return data;
    });
  }
  
  /**
   * Build the destination entity representing this destination
   */
  async buildDestinationEntity() {
    return {
      ...this.buildBaseEntityObject(),
      _id: 'parcasterix',
      slug: 'parcasterix', // all destinations must have a unique slug
      name: 'Parc Asterix',
      entityType: entityType.destination,
      location: {
        longitude: 2.573816,
        latitude: 49.136750,
      },
    };
  }

  /**
   * Build the park entities for this destination
   */
  async buildParkEntities() {
    return [
      {
        ...this.buildBaseEntityObject(null),
        _id: 'parcasterixpark',
        _destinationId: 'parcasterix',
        _parentId: 'parcasterix',
        slug: 'ParcAsterixPark',
        name: 'Parc Asterix',
        entityType: entityType.park,
        location: {
          longitude: 2.573816,
          latitude: 49.136750,
        },
      }
    ];
  }
}

