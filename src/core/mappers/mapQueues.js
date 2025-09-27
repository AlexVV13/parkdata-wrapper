// core/mappers/mapQueues.js
import { QUEUE_TYPES } from "../queueTypes.js";

/**
 * Zet park-specifieke queue data om naar universele structuur
 * @param {object} source - ruwe data van provider
 * @param {object} options - mapping instructies per park
 */
export function mapQueues(source, options = {}) {
  const queues = {};

  // standby
  if (options.standby) {
    queues[QUEUE_TYPES.STANDBY] = {
      available: Boolean(source[options.standby.available]),
      waitTime: source[options.standby.waitTime] ?? null
    };
  }

  // single rider
  if (options.singleRider) {
    queues[QUEUE_TYPES.SINGLE_RIDER] = {
      available: Boolean(source[options.singleRider.available])
    };
  }

  // fastpass
  if (options.fastpass) {
    queues[QUEUE_TYPES.FASTPASS] = {
      available: Boolean(source[options.fastpass.available])
    };
  }

  // virtual queue
  if (options.virtual) {
    queues[QUEUE_TYPES.VIRTUAL] = {
      available: Boolean(source[options.virtual.available])
    };
  }

  return queues;
}
