const fs = require("fs/promises");

const generate = (props) => {
  const { prNumber, endpointUrl, branchName } = props;

  const prLink = prNumber
    ? `(<a href="https://github.com/cagov/benefits-recommender/pull/${prNumber}">Pull Request #${props.prNumber}</a>)`
    : "";

  const endpointAttribute = endpointUrl ? `endpoint="${endpointUrl}"` : "";
  const branchNameAttribute = branchName ? `branch="${branchName}"` : "";

  return /* html */ `
    <!doctype html>
    <html lang="en-US">
      <head>
        <title>Benefits Recommender Preview</title>
        <link rel="icon" href="data:;base64,iVBORw0KGgo=">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script type="module" src="env-picker.js"></script>
        <link rel="stylesheet" href="preview.css" />
      </head>
      <body>
        <main>
          <hgroup>
            <h1>Benefits Recommender Preview!</h1>
            <p>Widget branch: ${branchName} ${prLink}</p>
            <env-picker ${endpointAttribute} ${branchNameAttribute}></env-picker>
          </hgroup>

          <p>Here's some test content.</p>
          <p>The widget follows.</p>

          <div id="widget-box">
            <cagov-benefits-recs ${endpointAttribute}></cagov-benefits-recs>
          </div>

          <p>Site content runs below the widget too.</p>

          <script type="module" async defer src="../cagov-benefits-recs.js"></script>
        </main>
      </body>
    </html>
  `;
};

(async () => {
  // CLI:
  // node generate.js GIT-BRANCH PR-NUMBER
  // node generate.js my-upcoming-change-branch 12
  const args = process.argv;

  const branchName = args[2] || "main";
  const prNumber = args[3] || undefined;
  const endpointUrl = args[4] || undefined;

  const html = generate({
    branchName,
    prNumber,
    endpointUrl,
  });

  await fs.mkdir("dist/preview", { recursive: true });

  await Promise.all([
    fs.writeFile("dist/preview/index.html", html),
    fs.copyFile("preview/env-picker.js", "dist/preview/env-picker.js"),
    fs.copyFile("preview/preview.css", "dist/preview/preview.css"),
  ]);

  console.log("Preview generated.");
})().catch((error) => console.log(error));
