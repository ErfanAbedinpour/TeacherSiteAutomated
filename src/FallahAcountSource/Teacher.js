const superagent = require("superagent");
const { JSDOM } = require("jsdom");

//Teacher Entity
class Teacher {
  constructor() {
    this.email = "fallah@aram.khd";
    this.password = "12345608";
    this.coockie = null;
  }

  //Return Coockie
  async Get_Coockie() {
    var Response = await superagent.post("http://baazmooon.ir/signup_sub.php");
    return await Response.headers["set-cookie"][0].split(";")[0];
  }

  //Login in Fallah Account
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
        usr: "2",
      });

    const dom = new JSDOM(Response.text);
    const tags = dom.window.document.querySelector("ul");
    const Name = tags.textContent.match(/\(\w.+\)/);
    var err =
      "Faild To Login please Check Email or password \nor Turn off VPN or any ipChanger";
    if (Name != null) {
      callback((err = null), Name[0], this.coockie);
    } else {
      callback((err = new Error(err)));
    }
  }

  //retuen Quiz Answer
  async Answer(course, pdmn, callback) {
    this.Login(async (err, name, coockie) => {
      if (err) {
        throw err;
      }
      console.log("sucsesfully Login in Fallah Account");
      var Response = await superagent
        .post("http://baazmooon.ir/addquestion.php")
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
        .set("Referer", "http://baazmooon.ir/azmoon.php")
        .set("Upgrade-Insecure-Requests", "1")
        .type("form")
        .send({
          cat: String(course),
          pdmn: String(pdmn),
        });

      const dom = new JSDOM(Response.text);
      const tags = dom.window.document.querySelectorAll("td");
      const result = [];
      let answer = 3;
      for (let id = 0; id < tags.length; id += 6) {
        var CreateObject = {};
        CreateObject["id"] = tags[id].textContent;
        CreateObject["answer"] = +tags[answer].textContent;
        result.push({ ...CreateObject });
        answer += 6;
      }
      if (result[0]) {
        callback((err = null), result);
      } else {
        callback((err = new Error("Not Found Any Quiz")));
      }
    });
  }

  //Find email And Password
  async FindEmailAndPassword(name, callback) {
    console.log("Process Loading...");
    this.Login(async (Name, coockie) => {
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
          break;
        }
      }
    });
  }
}

const t = new Teacher();
t.Answer(2, 2, (err, res) => {
  console.log(res);
});
module.exports = Teacher;
