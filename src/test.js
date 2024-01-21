const fs = require("fs");
const t = require("./FallahAcountSource/Teacher");

const te = new t();

(async () => {
  let count = 0;
  const result = await te.Answer(2, 2);
  let Res = "";
  for (let i in result) {
    if (count <= 10) {
      Res += `${i}:${result[i]} || `;
      count += 1;
    } else {
      count = 0;
      Res += "\n";
    }
  }
  fs.writeFile("./answer.txt", Res, () => {
    console.log("ok");
  });
})();
