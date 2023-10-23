const url = require("./url");
const { getThrottles } = require("./throttles");

/**
 * rules.js
 * Welcome to rules.
 * Rules alter which target links go down the wire to the widget.
 * Each rule is a function.
 * A rule takes a list of links.
 * A rule returns a modified list of links.
 * Rules are processed in a specific order.
 */

/**
 * @callback Rule
 * @param {import('./links.js').TargetLink[]} links
 * @param {object} params
 * @param {string} [params.host]
 * @param {import('./s3.js').Throttle[]} [params.throttles]
 * @returns {import('./links.js').TargetLink[]}
 */

/**
 * Remove links that have exceeded daily throttles.
 * @type {Rule}
 */
const removeThrottledLinks = (links, { throttles }) =>
  links.filter((link) => {
    const blockingThrottles = throttles.filter(
      (throttle) => url.findMatch(throttle.urls, link.url) && throttle.exceeded
    );

    // Allow the link if no blocking throttles found.
    return blockingThrottles.length < 1;
  });

/**
 * Remove links that point back to the same host site as the widget.
 * @type {Rule}
 */
const removeLinkBacks = (links, { host }) =>
  links.filter((link) => !url.matchHosts(host, link.url));

/**
 * Randomize the order of the links.
 * @type {Rule}
 */
const randomizeOrder = (links) =>
  links
    .map((link) => ({ link, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ link }) => link);

/**
 * Reduce the list of links to just the top three.
 * @type {Rule}
 */
const pickTopThree = (links) => links.slice(0, 3);

/**
 * Active rules, in order.
 * @type {Rule[]}
 */
const rules = [
  removeThrottledLinks,
  removeLinkBacks,
  randomizeOrder,
  pickTopThree,
];

/**
 * Apply the rules to the list of links.
 * @param {import('./s3.js').Definitions} definitions
 * @param {import('./links.js').TargetLink[]} allLinks
 * @param {string} host
 * @returns {Promise<import('./links.js').TargetLink[]>}
 */
const applyRules = async (definitions, allLinks, host) => {
  const throttles = await getThrottles(definitions);

  const params = {
    host,
    throttles,
  };

  return rules.reduce((links, rule) => {
    const newLinks = rule(links, params);
    return newLinks;
  }, allLinks);
};

exports.applyRules = applyRules;
