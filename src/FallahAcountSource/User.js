//Modules
const { JSDOM } = require("jsdom");
const superagent = require("superagent");
const Teacher = require("./Teacher");

//User Entity
class User {
  //retuen Coockie
  async Get_Coockie() {
    var Response = await superagent.post("http://baazmooon.ir/signup_sub.php");
    return Response.headers["set-cookie"][0].split(";")[0];
  }

  //Login on Fallah Account
  Login(email, pass) {
    this.email = email;
    this.password = pass;
    return new Promise(async (resolve, reject) => {
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
          email: email,
          pass: pass,
          usr: "1",
        });
      var err =
        "Faild To Login please Check Email or password \nor Turn off VPN or any IpChanger";
      const dom = new JSDOM(Response.text);
      const tags = dom.window.document.querySelectorAll("li");
      const Name = tags[5].textContent
        .replace(")", "")
        .replace("(", "")
        .replace("خروج از سایت", "");

      if (!Name.includes("توسعه برنامه سازی")) {
        resolve([Name, this.coockie]);
      } else {
        resolve(false);
      }
    });
  }

  //LogOut From Account

  async LogOut() {
    return new Promise(async (resolve, reject) => {
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

      resolve("LogOutSucsesfully");
    });
  }

  //this is AutoMatic Resolve Azmon

  async Azmon(course, pdmn) {
    //chooise Teacher For Quiz
    return new Promise(async (resolve, reject) => {
      try {
        const teacher = new Teacher();
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

        const Response = await superagent
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

        const data = {};
        const dom = new JSDOM(Response.text);
        const Tags = dom.window.document.querySelectorAll("b");
        const answer = await teacher.Answer(course, pdmn);
        Tags.forEach((i) => {
          const quiz = i.textContent.replace("سوال", "").split("  ")[0].trim();
          data[quiz] = String(answer[quiz]);
        });
        const result = await this.SendAnswer(data);
        resolve(result);
      } catch {
        reject("Your Must Login First");
      }
    });
  }

  //Send Azmoon Answer For Get Result
  async SendAnswer(data) {
    let Count = 1;
    return new Promise(async (resolve, reject) => {
      if (Count <= 5) {
        const Response = await superagent
          .post("http://baazmooon.ir/answer.php")
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
          .set("Referer", "http://baazmooon.ir/qus_show.php")
          .set("Upgrade-Insecure-Requests", "1")
          .set(
            "User-Agent",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          )
          .type("form")
          .send(data);

        const dom = new JSDOM(Response.text);
        const Tags = await dom.window.document.querySelectorAll("th");
        resolve({
          QuizCount: Tags[2].textContent.trim(),
          Currect_Answer: Tags[4].textContent.trim(),
          Result: Tags[10].textContent.trim(),
          Count,
        });
        Count += 1;
      } else {
        reject("you can only use 5 times for any podman");
      }
    });
  }
}

//Exports Modules
module.exports = User;
