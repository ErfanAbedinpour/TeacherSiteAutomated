const Telegram = require("node-telegram-bot-api");
require('dotenv').config()
// const { Connect } = require("./proxy");
// Connect();

const bot = new Telegram("6928944262:AAF5qpQ7uKHJsGtZ4Lw1C5LNl9BpzW51syE", {
  polling: true,
});

module.exports = bot;
