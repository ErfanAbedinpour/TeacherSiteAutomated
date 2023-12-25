const User = require("../../FallahAcountSource/User");

const user = new User();
const Login = async (req, res) => {
  const body = req.body;
  try {
    const [Name] = await user.Login(body.email, body.password);
    res.status(201).send(`sucesfully to ${Name} Account`);
  } catch (err) {
    res.status(400).send(err);
  }
};

const Azmon = async (req, res) => {
  const body = req.body;
  try {
    const result = await user.Azmon(body.course, body.pdmn);
    res.status(201).send(result);
  } catch (err) {
    res.status(401).send(err);
  }
};

module.exports = {
  Login,
  Azmon,
};
