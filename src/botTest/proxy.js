const proxy = require("node-global-proxy").default;

const Connect = () => {
  proxy.setConfig({
    http: "http://localhost:2081",
  });
  proxy.start();
  console.log("Proxy Is Started");
};

module.exports = { Connect };
