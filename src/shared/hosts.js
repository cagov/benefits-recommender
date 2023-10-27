const url = require("./url");

/**
 * Find the host definition for a given host url.
 * We want to match up the origin of the request (host) with our own metadata (hostDefs).
 * @param {string} host
 * The host page, as a URL (string), from which the widget sent this request.
 * @param {import('./s3.js').Host[]} hostDefs
 * A list of host objects from the Airtable-derived definitions.
 * @returns {import('./s3.js').Host|undefined}
 * A matching host definition, or undefined if none are found.
 */
exports.matchHostDef = (host, hostDefs) => {
  const pHostUrl = url.parse(host);

  if (pHostUrl && hostDefs) {
    return hostDefs.find((hostDef) =>
      hostDef.urls.some((hostDefUrl) => {
        const pHostDefUrl = url.parse(hostDefUrl);
        return pHostDefUrl.hostname === pHostUrl.hostname;
      })
    );
  } else {
    return undefined;
  }
};
