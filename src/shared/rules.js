const url = require("./url");

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
 * A processed list of all target links in the user's requested language.
 * @param {object} params
 * A collection of parameters from the request to help inform the rule.
 * @param {import('./s3.js').Host} [params.hostDef]
 * The host partner from which the widget sent this request.
 * @param {import('./s3.js').Throttle[]} [params.throttles]
 * A processed list of target link throttles.
 * @param {string|null} [params.ruleset]
 * The custom rule set from the request.
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
const removeLinkBacks = (links, { hostDef }) =>
  links.filter((link) => !url.findHostMatch(hostDef?.urls || [], link.url));

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
 * Apply the rules to the given list of links.
 * @param {import('./s3.js').Throttle[]} throttles
 * Active throttles against target links.
 * @param {import('./links.js').TargetLink[]} allLinks
 * A processed list of all target links in the user's requested language.
 * @param {import('./s3.js').Host} hostDef
 * The identified host partner from which the widget sent this request.
 * @param {string|null} ruleset
 * The custom rule set from the request.
 * @returns {Promise<import('./links.js').TargetLink[]>}
 * A targetted list of target links.
 */
const applyRules = async (throttles, allLinks, hostDef, ruleset) => {
  const params = {
    hostDef,
    throttles,
    ruleset,
  };

  // The show-all "rule set" is useful for previewing.
  if (ruleset == "show-all") {
    return allLinks;
  }

  return rules.reduce((links, rule) => {
    const newLinks = rule(links, params);
    return newLinks;
  }, allLinks);
};

exports.applyRules = applyRules;
