const { JSDOM } = require("jsdom");
const superagent = require("superagent");
// const Answer = require("./GetQuizAnswer");

//User Entity
class User {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  //retuen Coockie
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
    var err =
      "Faild To Login please Check Email or password \nor Turn off VPN or any IpChanger";
    const dom = new JSDOM(Response.text);
    const tags = dom.window.document.querySelector("ul");
    const Name = tags.textContent.match(/\(\w.+\)/);
    if (Name != null) {
      callback((err = null), Name[0], this.coockie);
    } else {
      callback((err = new Error(err)));
    }
  }

  //LogOut From Account

  async LogOut(callback) {
    await superagent
      .get("http://baazmooon.ir/logout.php")
      .set(
        "Accept",
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
      )
      .set(
        "Accept-Language",
        "fa-IR,fa;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5"
      )
      .set("Connection", "keep-alive")
      .set("Cookie", this.coockie)
      .set("Referer", "http://baazmooon.ir/azmoonnameteacher.php")
      .set("Upgrade-Insecure-Requests", "1")
      .set(
        "User-Agent",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      );

    callback("LogOut sucesfully");
  }

  //this is AutoMatic Resolve Azmon
  async Azmon(course, pdmn) {
    await superagent
      .post("http://baazmooon.ir/azmoon.php")
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
      .set("Referer", "http://baazmooon.ir/azmoonnameteacher.php")
      .set("Upgrade-Insecure-Requests", "1")
      .set(
        "User-Agent",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      )
      .type("form")
      .send({
        tchr: "1",
      });

    const result = await superagent
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
      .set(
        "User-Agent",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      )
      .type("form")
      .send({
        cat: String(course),
        pdmn: String(pdmn),
      });
    const dom = new JSDOM(result.text);
    const Tags = dom.window.document.querySelectorAll("b");
    Tags.forEach((i) => {
      const quiz = i.textContent.replace(/سوال \d/, "");
      console.log(quiz);
    });
    this.LogOut((r) => {
      console.log(r);
    });
  }
}

const user = new User("mmd@gmail.com", "1234");

setTimeout(async () => {
  await user.Login((err, name) => {
    console.log(name);
  });
  await user.Azmon(2, 2);
}, 1000);
