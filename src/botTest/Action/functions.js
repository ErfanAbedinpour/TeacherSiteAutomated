const bot = require("../start");
const User = require("../../FallahAcountSource/User");
let email = "";
let password = "";
let isGetEmail = false;
let IsLogin = false;
let course = 0;
let pdmn = 0;
const waitChat = []

const emailRegex = /(\w).*@(\w.+)/;

const courses = {
  1: "تجارت الکترونیک امنیت شبکه",
  2: "تجهیزات شبکه",
  3: "وب",
  4: "پیاده سازی و برنامه سازی",
};


const user = new User();

const Login = (msg, _) => {
  bot.sendMessage(msg.chat.id, "email: ");
  bot.on("message", async (message, chat) => {
    const text = message.text;
    if (text.match(emailRegex)) {
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

const azmon = async(msg, _) => {
  let coursCodes = "";
  const msg_id = msg.chat.id;
  for (let i in courses) {
    coursCodes+=`code:${i}:${course[i]}`
  }
  bot.sendMessage(msg_id, "لطفا کد درس مورد نظر را وارو کنید")
  if(waitChat.includes(msg_id)===-1)
  bot.on('message', async(message, _) => {
    const text = message.text
    if (!course) {
      if (text in courses) {
        course = text
        bot.sendMessage(msg_id, "لطفا پودمان مورد نظر را وارد کنید")  
      } else {
        bot.sendMessage(msg_id, `لطفا کد درس  معتبر وارد کتید \n${coursCodes}‍‍‍‍‍`)  
      }
    } else {
      if (['1', "2", "3", "4", "5"].indexOf(text) != -1) {
        pdmn = text
        const { QuizCount, Currect_Answer, Result } = await user.Azmon(course, pdmn)
        course = "";
        pdmn = "";
        return bot.sendMessage(msg_id, `‍‍‍‍‍تعداد سوال${QuizCount}\nجواب درست${Currect_Answer}\nدرصد${Result}`)

      } else {
        bot.sendMessage(msg_id,"پودمان معتبر وارد کنید")  
      }
        
    }
  })
  return 0;
};

const Logout = async(msg, chat) => { 
  try {
    if (IsLogin) {
      const Result = await user.LogOut()
      bot.sendMessage(msg.chat.id, 'با موفقیت خارج شدید')
    }
  } catch (err) {
    bot.sendMessage(msg.chat.id, 'برای خروج خطایی رخ داد')
  }
}

module.exports = {
  Login,
  azmon,
};
