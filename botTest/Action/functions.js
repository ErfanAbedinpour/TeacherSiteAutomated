const bot = require("../start");
const User = require("../../FallahAcountSource/User");

let [email,password,isGetEmail,IsLogin,course,pdmn] = ["","",false,false,0,0]
const waitChat = []

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
    if (!isGetEmail) {
      if (text.match(emailRegex)) {
        email = text.trim();
        isGetEmail = true;
        return bot.sendMessage(message.chat.id, `Password: `);  
      } else {
        return bot.sendMessage(message.chat.id, `ایمیل معتبر وارد کنید`);  
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
          return bot.removeListener('message', LoginListiner)
        }
      } else {
        return 0;
      }
      isGetEmail = false;
      bot.sendMessage(
        message.chat.id,
        `ایمیل یا پسورد برای ورود اشتباه هست
        لطفا ایمیل صحیح را وارد کنید`
      );
    }
}

const azmonListiner = async (message, chat) => {
  if (!course) {
    if (message.text in courses) {
      course = message.text;
      bot.sendMessage(message.chat.id, `لطفان پودمان معتبر نظر وارد کنید`);
    } else {
      bot.sendMessage(message.chat.id, `لطفا کد درس معتبر وارد کنید\n${coursCodes}`);
    }
  } else {
    pdmn = message.text;
    if (["1", "2", "3", "4", "5"].indexOf(pdmn) != -1) {
      console.log(`course ${course}, pdmn ${pdmn}`);
      try {
        bot.sendMessage(message.chat.id, `صبر کنید لطفا`);
        const {QuizCount,Currect_Answer,Result} = await user.Azmon(course, pdmn);
        bot.sendMessage(message.chat.id, `تعداد سوال
        ${QuizCount}
        جواب درست
        ${Currect_Answer}
        نتیجه
        ${Result}`);
        course = "";
        pdmn = "";
        return bot.removeListener('message', azmonListiner);
      } catch (err) {
        bot.sendMessage(message.chat.id, `${err}`);
        course = ""
        pdmn=""
        return bot.removeListener('message', azmonListiner);
      }
    } else {
      bot.sendMessage(message.chat.id, `لطفا پودمان معتبر وارد کنید`);
    }
  }
}
    
const Login = (msg, _) => {
  if (!IsLogin) {
    bot.sendMessage(msg.chat.id, "email: ");
    bot.on("message",LoginListiner );  
  }else{
    return bot.sendMessage(msg.chat.id, "شما قبلان لاگین کرده اید\nبرای خروج از \n/logout استفاده کنید")
  }
  
};

const azmon = (msg, chat) => {
  var msg_id = msg.chat.id;
  if (IsLogin) {
    bot.sendMessage(msg_id, `لطفا کد درس را وارد کنید\n\n${coursCodes}`);
    bot.on('message',azmonListiner);
  } else {
    return bot.sendMessage(msg_id, "لطفا اول لاگین کنید");
  }
};

const Logout = async(msg, chat) => { 
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

module.exports = {
  Login,
  Logout,
  azmon
};
