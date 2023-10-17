var express = require("express");

const widgetServer = (dir = "./") => {
  var app = express();
  app.use(express.static(dir));
  app.listen(8080);

  console.log("\nSimple widget file server started.");
  console.log("http://localhost:8080/preview/local.html");
  console.log("Press Ctrl-C to stop.\n");
};

module.exports = widgetServer;
