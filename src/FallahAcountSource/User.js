const { JSDOM } = require("jsdom");
const superagent = require("superagent");
// const Answer = require("./GetQuizAnswer");

class User {
  constructor(email, password) {
    this.email = email;
    this.password = password;
    this.coockie = null;
  }
  async Get_Coockie() {
    var Response = await superagent.post("http://baazmooon.ir/signup_sub.php");
    return await Response.headers["set-cookie"][0].split(";")[0];
  }

  //Login on Fallah Account
  async Login(callback) {
    this.coockie = await this.Get_Coockie();
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
      .set("Cookie", this.coockie)
      .set("Origin", "http://baazmooon.ir")
      .set("Referer", "http://baazmooon.ir/thbt.php")
      .set("Upgrade-Insecure-Requests", "1")
      .type("form")
      .send({
        email: this.email,
        pass: this.password,
        usr: "1",
      });

    const dom = new JSDOM(Response.text);
    const tags = dom.window.document.querySelector("ul");
    const Name = tags.textContent.match(/\(\w.+\)/);
    if (Name != null) {
      callback(Name[0], this.coockie);
    } else {
      const err =
        "Faild To Login please Check Email or password \nor Turn off VPN or any IpChanger";
      callback(err);
    }
  }

  //this is AutoMatic Resolve Azmon
  async Azmon(course, pdmn) {
    const Result = await superagent
      .post("http://baazmooon.ir/qus_show.php")
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
      .set("Cookie", this.coockie)
      .set("Origin", "http://baazmooon.ir")
      .set("Referer", "http://baazmooon.ir/azmoon.php")
      .set("Upgrade-Insecure-Requests", "1")
      .type("form")
      .send({
        cat: String(course),
        pdmn: String(pdmn),
      });

    console.log(Result.text);
  }
}

const user = new User("mmd@gmail.com", "1234");

user.Login(false, (name, coockie) => {
  console.log(name);
  console.log(coockie);
});

user.Answer(1, 1, (data) => {
  console.log(data);
});

// User.GetAnswer(1, 1);
module.exports = { Site: User };
