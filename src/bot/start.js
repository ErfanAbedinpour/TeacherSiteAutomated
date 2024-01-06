const { Telegraf } = require("telegraf");
const { Connect } = require("./proxy");
Connect();

const bot = new Telegraf("6928944262:AAF5qpQ7uKHJsGtZ4Lw1C5LNl9BpzW51syE");

module.exports = bot;
