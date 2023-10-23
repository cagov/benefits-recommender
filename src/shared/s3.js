const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({});

/**
 * @typedef Definitions
 * @type {object}
 * @property {string} name
 * @property {string} description
 * @property {string} updated
 * @property {Target[]} targets
 * @property {Throttle[]} throttles
 * @property {Host[]} hosts
 */

/**
 * @typedef Target
 * @type {object}
 * @property {string} id
 * @property {object.<string, Translation>} translations
 * @property {string[]} throttle_ids
 */

/**
 * @typedef Translation
 * @type {object}
 * @property {string} id
 * @property {string} url
 * @property {string} icon
 * @property {string} analytics
 * @property {string} lead
 * @property {string} catalyst
 */

/**
 * @typedef Throttle
 * @type {object}
 * @property {string} id
 * @property {number} [limit]
 * @property {string} [start]
 * @property {string} [end]
 * @property {string[]} urls
 * @property {boolean} [exceeded]
 */

/**
 * @typedef Host
 * @type {object}
 * @property {string} id
 * @property {string[]} urls
 */

/** Grab the definitions file from S3.
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
