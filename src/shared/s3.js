const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({});

/**
 * *Definitions* represents the latest content for the benefits recommender.
 * It's derived from Airtable, and lives in a file on S3 called `benefits-recs-defs.json`.
 * See the schedule/airtable job to understand how definitions are generated.
 * @typedef {object} Definitions
 * @property {string} name
 * The name of the definitions file.
 * @property {string} description
 * The description of the definitions file.
 * @property {string} updated
 * The date and time of last update for the definitions file.
 * @property {Target[]} targets
 * A list of active target links.
 * @property {Throttle[]} throttles
 * A list of active target link throttles.
 * @property {Host[]} hosts
 * A list of hosts where the widget is placed.
 */

/**
 * *Target* represents a target link in the widget.
 * Coming from the Airtable-derived definitons, this object includes all metadata and translations.
 * See shared/links.js to understand how these targets are processed by the API.
 * @typedef {object} Target
 * @property {string} id
 * The id of the target.
 * @property {object.<string, Translation>} translations
 * A list of translations to different languages for this target.
 * @property {string[]} throttle_ids
 * A list of IDs for applicable throttles.
 */

/**
 * The *Translation* provides a *Target* in a different language.
 * English language defaults are also included in a *Translation*.
 * @typedef {object} Translation
 * @property {string} id
 * The id of the translation.
 * @property {string} url
 * The URL of the target for the given language.
 * @property {string} icon
 * The icon code of the target for the given language. See shared/icons.js.
 * @property {string} analytics
 * A code for analytics engine on the target site. See shared/links.js.
 * @property {string} lead
 * The "lead text" for the target in the given language.
 * @property {string} catalyst
 * The "call to action" text for the target in the given language.
 */

/**
 * *Throttle* defines conditions for limiting display of a target.
 * @typedef {object} Throttle
 * @property {string} id
 * The id for the throttle.
 * @property {number} [limit]
 * A daily clickthrough limit for the target.
 * @property {string} [start]
 * A start date for the target.
 * @property {string} [end]
 * An end date for the target.
 * @property {string[]} urls
 * The URLs to be throttled.
 * @property {boolean} [exceeded]
 * Determines if the throttle has been exceeded, and the target should be throttled.
 * Unlink the other properties here, *exceeded* does not come from the definitions file.
 * We define it here in the API, based on the other properties, in real time.
 * See shared/throttles.js.
 */

/**
 * A *Host* is a collection of related pages where the widget is located.
 * @typedef {object} Host
 * @property {string} id
 * The id of the host.
 * @property {string[]} urls
 * The URLs associated with this host.
 */

/**
 * Grab the definitions file from S3.
 * @returns {Promise<Definitions>}
 */
exports.getDefinitions = async () => {
  const command = new GetObjectCommand({
    Bucket: "cdn.innovation.ca.gov",
    Key: "br/benefits-recs-defs.json",
  });

  return await s3
    .send(command)
    .then((res) => res.Body.transformToString())
    .then((json) => JSON.parse(json))
    .catch((error) => {
      console.log("Error fetching definitions from S3.");
      throw error;
    });
};
