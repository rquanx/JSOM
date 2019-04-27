let config = require("./config").config;
let deploy = require("../build/Deploy").Deploy.default;
deploy(config);
