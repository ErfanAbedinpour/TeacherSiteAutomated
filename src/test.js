const bot = require("./bot/start");

bot.entity("salam", (ctx) => {
  ctx.reply("salam");
});

bot.launch();
