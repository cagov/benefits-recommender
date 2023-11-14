const arc = require("@architect/functions");
const { assembleLinks } = require("@architect/shared/links");
const { applyRules } = require("@architect/shared/rules");
const { getDefinitions } = require("@architect/shared/s3");
const { generateHtml } = require("@architect/shared/templates");
const { matchHostDef } = require("@architect/shared/hosts");
const { getThrottles } = require("@architect/shared/throttles");
const { assembleSnippets } = require("@architect/shared/snippets.js");

/**
 * Parses Chinese language codes to determine the best available script.
 * @param {string} langQuery The language code
 * @returns
 */
const parseZh = (langQuery = "") => {
  if (langQuery.toLowerCase() === "zh") return "zh-Hans";
  if (langQuery.toLowerCase().startsWith("zh-hans")) return "zh-Hans";
  if (langQuery.toLowerCase().startsWith("zh-hant")) return "zh-Hant";
  return langQuery;
};

// Definitions will be loaded from benefits-recs-defs.json in S3.
// We keep it outside the handler to cache it between Lambda runs.
/** @type {import('./node_modules/@architect/shared/s3.js').Definitions} */
let definitions = {};

/** Core function for get-benefits. */
exports.handler = arc.http.async(async (req) => {
  // If definitions is empty, fetch it from S3.
  if (Object.keys(definitions).length === 0) {
    console.log("Definitions cache is cold. Fetching definitions from S3.");
    definitions = await getDefinitions();
  }

  const {
    targets: targetDefs = [],
    hosts: hostDefs = [],
    throttles: throttleDefs = [],
    snippets: snippetDefs = [],
  } = definitions;

  // Grab data from headers and URL query parameters.
  const hostQuery = decodeURIComponent(req.query.host || "");
  const langQuery = req.query.language || "en";
  const acceptHeader = req.headers?.accept;

  // Unless it's Chinese, strip the language code down to two characters.
  // We need to preserve the Chinese code to display Traditional vs. Simplified.
  const language = langQuery.startsWith("zh")
    ? parseZh(langQuery)
    : langQuery.slice(0, 2).toLowerCase();

  // Process metadata.
  const hostDef = matchHostDef(hostQuery, hostDefs);
  const throttles = await getThrottles(throttleDefs);
  const snippets = assembleSnippets(snippetDefs, language, hostDef);

  // Create target links.
  const allLinks = assembleLinks(targetDefs, language, hostDef);
  const links = await applyRules(throttles, allLinks, hostDef);

  // If we don't have any links, exit now with no content.
  if (links.length === 0) {
    return {
      cors: true,
      statusCode: 204,
    };
  }

  const data = {
    header: snippets.header || "Apply for more benefits!",
    tagline: snippets.tagline || "You might be able to get:",
    experimentName: snippets.experimentName || "2023-08-01-resume-tracking",
    experimentVariation: links.map((link) => link.id).join("-"),
    links,
  };

  // If the client wants HTML, send it.
  if (acceptHeader === "text/html") {
    return {
      cors: true,
      html: generateHtml(data, hostDef),
    };
  }

  // Otherwise, default to JSON.
  return {
    cors: true,
    json: JSON.stringify(data),
  };
});
