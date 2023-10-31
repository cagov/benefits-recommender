const icons = require("./icons");
const url = require("./url");

const AnalyticEngines = {
  GA: "ga",
  PIWIK: "piwik",
};

/**
 * Add query string parameters for the target site's analytics engine.
 * @param {string} linkUrl
 * The target link's URL as string.
 * @param {string} analytics
 * The target site's analytics engine, represented by a short code. @see AnalyticEngines
 * @param {import('./s3.js').Host} hostDef
 * A host object from the Airtable-derived definitions.
 * @returns {string}
 * A modified target link URL, including analytics query parameters if relevant.
 */
const addAnalytics = (linkUrl, analytics, hostDef) => {
  const pUrl = url.parse(linkUrl);

  if (pUrl && hostDef) {
    if (hostDef && analytics === AnalyticEngines.GA) {
      pUrl.searchParams.append("utm_source", hostDef.id);
      pUrl.searchParams.append("utm_medium", "referral");
      pUrl.searchParams.append("utm_campaign", "odibr");
    }

    return pUrl.href;
  } else {
    return linkUrl;
  }
};

/**
 * @typedef TargetLink
 * @type {object}
 * @property {string} id
 * The id of this target link.
 * @property {string} language
 * The language for this target link.
 * @property {string} lead
 * The "lead text" of this target link.
 * @property {string} catalyst
 * The "call to action" text of this target link.
 * @property {string} url
 * The URL of this target link, as a string.
 * @property {string} graphic
 * The SVG icon for this target link, as a string.
 */

/**
 * From the list of target definitions, construct link objects for the given language and host.
 * @param {import('./s3.js').Target[]} targets
 * Target definitions from the Airtable-derived `benefits-recs-defs.json` file.
 * @param {string} language
 * The language for this request, as an ISO 639-1 code.
 * @param {import('./s3.js').Host} hostDef
 * The host page, as a URL (string), from which the widget sent this request.
 * @returns {TargetLink[]}
 * A processed list of target links in the requested language.
 */
exports.assembleLinks = (targets, language, hostDef) => {
  // Return a single set of values for each link, based on language.
  // Default to English where values are unavailable.
  const links = targets.map((target) => {
    const { id, translations } = target;

    const translation = translations[language];
    const { en } = translations;

    // Get the SVG markup for the icon.
    const iconKey = translation?.icon || en.icon;
    const graphic = icons[iconKey];

    const lead = translation?.lead || en.lead || "";
    const catalyst = translation?.catalyst || en.catalyst || "";
    const linkUrl = translation?.url || en.url || "";
    const analytics = translation?.analytics || en.analytics || "";
    const urlWithAnalytics = addAnalytics(linkUrl, analytics, hostDef);

    return {
      lead,
      catalyst,
      url: urlWithAnalytics,
      graphic,
      language,
      id,
    };
  });

  return links;
};
