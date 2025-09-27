// core/mappers/mapTags.js
import { TAGS } from "../tagsConfig.js";

/**
 * Zet park-specifieke tags om naar universele tags
 * @param {object} source - ruwe data van provider
 * @param {Array} rules - lijst met { if: (src) => bool, tag: TAGS.X }
 */
export function mapTags(source, rules = []) {
  const tags = [];

  for (const rule of rules) {
    try {
      if (rule.if(source)) {
        tags.push(rule.tag);
      }
    } catch {
      // fout in rule? negeren
    }
  }

  return tags;
}
