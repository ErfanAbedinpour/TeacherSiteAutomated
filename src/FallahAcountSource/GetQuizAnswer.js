const superagent = require("superagent");
const { JSDOM } = require("jsdom");
const Site = require("./Script");

//this function Take Dars And PDMN And Retuen Answer And QuizId
async function Answers(course = 1, pdmn = 1, callback) {
  const user = new Site();
  user.Login("fallah@aram.khd", "12345608", true, async (name, coockie) => {
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
    callback(result);
  });
}

module.exports = {
  getAnswer: Answers,
};
