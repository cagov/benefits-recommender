const sandbox = require("@architect/sandbox");
const widgetServer = require("../widget/serve/widget-server.js");

widgetServer("./widget");
sandbox.start();
