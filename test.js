const fs = require("fs");

fs.readFile("./REDME.md", { encoding: "utf-8" }, (err, data) => {
  console.log(err);
  console.log(data);
});
