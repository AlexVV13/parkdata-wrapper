import { QUEUE_TYPES } from "../queueTypes.js";

/**
 * Zet park-specifieke wachtrijdata om naar een universele structuur.
 * Dit maakt het makkelijker om verschillende API-formaten te standaardiseren.
 *
 * @param {Object} source - Ruwe data van de parkprovider.
 * @param {Object} options - Mapping instructies voor de specifieke wachtrijtypen van het park.
 * @param {Object} [options.standby] - Config voor standaard wachtrij.
 * @param {string} [options.standby.available] - Naam van property die beschikbaarheid aangeeft.
 * @param {string} [options.standby.waitTime] - Naam van property die wachttijd bevat.
 * @param {Object} [options.singleRider] - Config voor single rider wachtrij.
 * @param {string} [options.singleRider.available] - Naam van property die beschikbaarheid aangeeft.
 * @param {Object} [options.fastpass] - Config voor fastpass wachtrij.
 * @param {string} [options.fastpass.available] - Naam van property die beschikbaarheid aangeeft.
 * @param {Object} [options.virtual] - Config voor virtuele wachtrij.
 * @param {string} [options.virtual.available] - Naam van property die beschikbaarheid aangeeft.
 *
 * @returns {Object<string, Object>} Genormaliseerde wachtrijen met keys van QUEUE_TYPES.
 *
 * @example
 * const source = { openStandby: true, standbyWait: 25 };
 * const options = { standby: { available: 'openStandby', waitTime: 'standbyWait' } };
 * const queues = mapQueues(source, options);
 * // queues = { STANDBY: { available: true, waitTime: 25 } }
 */
export function mapQueues(source, options = {}) {
  const queues = {};

  // Standby wachtrij
  if (options.standby) {
    queues[QUEUE_TYPES.STANDBY] = {
      available: Boolean(source[options.standby.available]),
      waitTime: source[options.standby.waitTime] ?? null
    };
  }

  // Single Rider wachtrij
  if (options.singleRider) {
    queues[QUEUE_TYPES.SINGLE_RIDER] = {
      available: Boolean(source[options.singleRider.available])
    };
  }

  // Fastpass wachtrij
  if (options.fastpass) {
    queues[QUEUE_TYPES.FASTPASS] = {
      available: Boolean(source[options.fastpass.available])
    };
  }

  // Virtual wachtrij
  if (options.virtual) {
    queues[QUEUE_TYPES.VIRTUAL] = {
      available: Boolean(source[options.virtual.available])
    };
  }

  return queues;
}

