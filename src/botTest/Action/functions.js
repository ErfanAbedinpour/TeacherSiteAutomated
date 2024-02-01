const bot = require("../start");
const User = require("../../FallahAcountSource/User");
let email = "";
let password = "";
let isGetEmail = false;
let IsLogin = false;
let IsCourseGet = false;
let course = 0;
let pdmn = 0;

const emailRegex = /(\w).*@(\w.+)/;

const courses = {
  1: "تجارت الکترونیک امنیت شبکه",
  2: "تجهیزات شبکه",
  3: "وب",
  4: "پیاده سازی و برنامه سازی",
};
const user = new User();

const Login = (msg, chat) => {
  bot.sendMessage(msg.chat.id, "email: ");
  bot.on("message", async (message, chat) => {
    const text = message.text;
    if (text.match(emailRegex)) {
      //GetPassword
      email = text.trim();
      isGetEmail = true;
      bot.sendMessage(msg.chat.id, `Password: `);
    } else if (isGetEmail) {
      password = text.trim();
      if (!IsLogin) {
        const Name = (await user.Login(email, password))[0];
        if (Name) {
          IsLogin = true;
          return bot.sendMessage(
            message.chat.id,
            `sucsesfully Login on ${Name}`
          );
        }
      } else {
        return 0;
      }
      isGetEmail = false;
      bot.sendMessage(
        message.chat.id,
        `incorect Login Please Enter Valid Email Or password`
      );
    }
  });
  return 0;
};

const azmon = (msg, chat) => {
  const msg_id = msg.chat.id;
  if (IsLogin) {
    let coursCodes = "";
    for (let i in courses) {
      coursCodes += `${i}:${courses[i]}\n`;
    }
    bot.sendMessage(msg_id, `لطفا کد درس را وارد کنید\n${coursCodes}`);
    bot.on("message", async (message, chat) => {
      if (!IsCourseGet) {
        if (message.text in courses) {
          course = message.text;
          IsCourseGet = true;
          bot.sendMessage(msg_id, `لطفان پودمان معتبر نظر وارد کنید`);
        } else {
          bot.sendMessage(msg_id, `لطفا کد درس معتبر وارد کنید\n${coursCodes}`);
        }
      } else {
        pdmn = message.text;
        if (["1", "2", "3", "4", "5"].indexOf(pdmn) != -1) {
          console.log(`course ${course}, pdmn ${pdmn}`);
          try {
            const Result = await user.Azmon(course, pdmn);
            console.log(Result);
            bot.sendMessage(msg_id, `${Result}`);
          } catch (err) {
            bot.sendMessage(msg_id, `${err}`);
          }
        } else {
          bot.sendMessage(msg_id, `لطفا پودمان معتبر وارد کنید`);
        }
      }
    });
  } else {
    return bot.sendMessage(msg_id, "لطفا اول لاگین کنید");
  }
};

module.exports = {
  Login,
  azmon,
};
