const Telegram = require("node-telegram-bot-api");
require('dotenv').config
const bot = new Telegram(process.env['BotToken'], {
  polling: true,
});

module.exports = bot;
