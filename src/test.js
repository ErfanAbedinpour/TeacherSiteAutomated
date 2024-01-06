const bot = require("./bot/start");

const regex = new RegExp(/[a-z]/);
bot.hears(regex, (c) => {
  c.reply("Hello");
});

bot.launch();
