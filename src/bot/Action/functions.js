const bot = require("../start");
const User = require("../../FallahAcountSource/User");

let [email,password,isGetEmail,IsLogin,course,pdmn,wrong] = ["","",false,false,0,0,0]

const emailRegex = /(\w).*@(\w.+)/;


const courses = {
  1: "تجارت الکترونیک امنیت شبکه",
  2: "تجهیزات شبکه",
  3: "وب",
  4: "پیاده سازی و برنامه سازی",
};

let coursCodes = "";
for (let i in courses) {
  coursCodes += `${i}:${courses[i]}\n`;
}

const user = new User();

const LoginListiner = async (message, chat) => {
  const text = message.text;
  if (message.entities[0]['type'] == 'bot_command') {
    return bot.removeListener('message', LoginListiner)
  }
    if (!isGetEmail) {
      if (text.match(emailRegex)) {
        email = text.trim();
        isGetEmail = true;
        return bot.sendMessage(message.chat.id, `پسورد سایت فلاح؟ `);  
      } else {
        
      }
    } if (isGetEmail) {
      password = text.trim();
      if (!IsLogin) {
        bot.sendMessage(message.chat.id, `لطفا صبر کنید`)
        const Name = (await user.Login(email, password))[0];
        if (Name) {
          IsLogin = true;
          bot.sendMessage(
            message.chat.id,
            `با موفیت به اکانت 
            ${Name}
            وارد شدید`
          );
          bot.sendMessage(message.chat.id, "از /azmon برای دادن ازمون استفاده کنید")
          return bot.removeListener('message', LoginListiner)
        }else {
        isGetEmail = false;
        bot.sendMessage(
          message.chat.id,
          `ایمیل یا پسورد برای ورود اشتباه هست
          لطفا ایمیل صحیح را وارد کنید`
        );
        return bot.removeListener('message', LoginListiner) 
      } 
    }
  }
}

const azmonListiner = async (message, chat) => {
  if (message.entities[0]['type'] === 'bot_command') {
    return bot.removeListener('message', azmonListiner)
  }
  if (!course) {
    if (message.text in courses) {
      course = message.text;
      return bot.sendMessage(message.chat.id, `لطفان پودمان معتبر نظر وارد کنید`);
    } else {
      bot.sendMessage(message.chat.id, `لطفا کد درس معتبر وارد کنید\n${coursCodes}`);
      return bot.removeListener('message', azmonListiner);
    }
  } else if(!pdmn){
    pdmn = message.text;
    if (["1", "2", "3", "4", "5"].indexOf(pdmn) != -1) {
      console.log(`course ${course}, pdmn ${pdmn}, wrong ${wrong}`);
      bot.sendMessage(message.chat.id, `برای شک نکردن دبیر (تعداد غلط؟) `);
    } else {
      bot.sendMessage(message.chat.id, `لطفا پودمان معتبر وارد کنید`);
      return bot.removeListener('message', azmonListiner);
    }
  } else {
    wrong = message.text;
    try {
      if (typeof +wrong != "number") {
         bot.sendMessage(message.chat.id, "لطفا عدد معتبر وارد کنید");
         return bot.removeListener('message', azmonListiner);
      }
      
        bot.sendMessage(message.chat.id, `صبر کنید لطفا`);
        const {QuizCount,Currect_Answer,Result} = await user.Azmon(course, pdmn,+wrong);
        bot.sendMessage(message.chat.id, `تعداد سوال
        ${QuizCount}
        جواب درست
        ${Currect_Answer}
        نتیجه
        ${Result}`);
        course = "";
        pdmn = "";
        wrong = 0;
        return bot.removeListener('message', azmonListiner);
      } catch (err) {
        bot.sendMessage(message.chat.id, `${err}`);
        course = ""
        pdmn=""
        return bot.removeListener('message', azmonListiner);
      }
  }
}
    
const Login = (msg, _) => {
  if (!IsLogin) {
    bot.sendMessage(msg.chat.id, "ایمیل سایت فلاح؟ ");
    bot.removeListener('message', azmonListiner)
    bot.removeListener('message', LoginListiner)
    bot.on("message",LoginListiner);  
  }else{
    return bot.sendMessage(msg.chat.id, "شما قبلان لاگین کرده اید\nبرای خروج از \n/logout استفاده کنید")
  }
  
};

const azmon = (msg, chat) => {
  bot.removeListener('message', LoginListiner)
  bot.removeListener('message', azmonListiner)
  if (IsLogin) {
    bot.sendMessage(msg.chat.id, `لطفا کد درس را وارد کنید\n\n${coursCodes}`);
    bot.on('message',azmonListiner);
  } else {
    return bot.sendMessage(msg.chat.id, "لطفا اول لاگین کنید");
  }
};

const Logout = async (msg, chat) => { 
  bot.removeListener('message', LoginListiner)
  bot.removeListener('message', azmonListiner)
  try {
    
    if (IsLogin) {
      await user.LogOut();
      [email,password,isGetEmail,IsLogin,course,pdmn] = ["","","","","",""]
      return bot.sendMessage(msg.chat.id, 'با موفقیت خارج شدید')
    }
  } catch (err) {
    bot.sendMessage(msg.chat.id, 'برای خروج خطایی رخ داد')
  }
}

const help = (msg, chat) => {
  bot.removeListener('message', LoginListiner)
  bot.removeListener('message', azmonListiner)
  bot.sendMessage(msg.from.id, `برای شروع ربات ایتدا لاگین کنید با درستور 
  /login
  بد از لاگین با دستور
  /azmon
  میتونید ازمون بد
  ید`);
}

const start = (msg, chat) => {
  bot.removeListener('message', LoginListiner)
  bot.removeListener('message', azmonListiner)
  bot.sendMessage(msg.from.id,"به ربات خوش امدید برای شروع از ربات /help را وارد کنید")
}
module.exports = {
  Login,
  Logout,
  azmon,
  start,
  help
};
