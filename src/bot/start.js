const Telegram = require("node-telegram-bot-api");
require('dotenv').config
const bot = new Telegram("", {
  polling: true,
});

module.exports = bot;
