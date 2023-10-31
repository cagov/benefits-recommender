/**
 * Assembles snippets for this request based on language and host.
 * @param {import('./s3.js').Snippet[]} snippetDefs
 * Raw snippet definitions from the S3 definitons file.
 * @param {string} language
 * The language code for this request.
 * @param {import('./s3.js').Host} hostDef
 * The identified host definition for this request.
 * @returns {object}
 */
exports.assembleSnippets = (snippetDefs, language, hostDef) => {
  // Sort all snippet definitions based on relevance to language and host.
  const sortedSnippetDefs = snippetDefs
    .map((snippetDef) => {
      // Let's rank 'em.
      let rank = 0;

      // Language supercedes all.
      if (language === snippetDef?.language) rank += 5;

      // Give non-host-specific snippets a small boost, to make them default.
      if (!snippetDef.host_ids) rank += 1;

      // Give host-match snippets a bigger boost, to overcome defaults.
      if (snippetDef?.host_ids?.includes(hostDef.id)) rank += 2;

      return { rank, snippetDef };
    })
    .sort((a, b) => b.rank - a.rank)
    .map((rankedSnippetDef) => rankedSnippetDef.snippetDef);

  // Find highest ranked snippet for each placement.

  const header = sortedSnippetDefs.find(
    (snippetDef) => snippetDef.placement === "header"
  ).text;

  const tagline = sortedSnippetDefs.find(
    (snippetDef) => snippetDef.placement === "tagline"
  ).text;

  const experimentName = sortedSnippetDefs.find(
    (snippetDef) => snippetDef.placement === "experiment_name"
  ).text;

  return { header, tagline, experimentName };
};
