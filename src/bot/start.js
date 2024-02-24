const Telegram = require("node-telegram-bot-api");
require('dotenv').config
const bot = new Telegram("6903234677:AAGMzTgveht0K0bkGXPrs8ToiKJUOmoXXwc", {
  polling: true,
});

module.exports = bot;
