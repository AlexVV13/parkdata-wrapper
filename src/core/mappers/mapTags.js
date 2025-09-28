import { TAGS } from "../tagsConfig.js";

/**
 * Zet park-specifieke tags om naar universele tags.
 * Dit maakt het makkelijker om verschillende API-formaten te standaardiseren.
 *
 * @param {Object} source - Ruwe data van de parkprovider.
 * @param {Array<Object>} rules - Lijst met mapping regels.
 * @param {Function} rules[].if - Functie die true retourneert als de tag toegepast moet worden.
 * @param {string} rules[].tag - Tag die toegepast wordt wanneer if() true retourneert (bv. TAGS.THRILL).
 *
 * @returns {Array<string>} Lijst van toegepaste tags.
 *
 * @example
 * const source = { experience: 'thrill' };
 * const rules = [
 *   { if: src => src.experience === 'thrill', tag: TAGS.THRILL },
 *   { if: src => src.indoor === true, tag: TAGS.INDOOR }
 * ];
 * const tags = mapTags(source, rules);
 * // tags = ['thrill']
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

