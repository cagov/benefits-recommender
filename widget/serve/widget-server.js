var express = require("express");
var path = require("path");

const widgetServer = (dir = "./") => {
  var app = express();
  // Serve only the directories the preview page needs, rather than the whole
  // widget folder, so unrelated files (server source, configs, node_modules)
  // aren't exposed. local.html lives under /preview and loads the widget from
  // /src; built bundles live under /dist.
  app.use("/preview", express.static(path.join(dir, "preview")));
  app.use("/src", express.static(path.join(dir, "src")));
  app.use("/dist", express.static(path.join(dir, "dist")));
  app.listen(8080);

  console.log("\nSimple widget file server started.");
  console.log("http://localhost:8080/preview/local.html");
  console.log("Press Ctrl-C to stop.\n");
};

module.exports = widgetServer;
