const express = require("express");
const UserController = require("./controller/UserController");
const app = express();

app.use(express.json());

app.post("/api/Login", (req, res) => {
  UserController.Login(req, res);
});

app.post("/api/azmon", (req, res) => {
  UserController.Azmon(req, res);
});

app.listen(3000, () => {
  console.log("server is Running on 3000 PORT");
});
