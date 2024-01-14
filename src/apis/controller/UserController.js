const User = require("../../FallahAcountSource/User");

const user = new User();
const Login = async (req, res) => {
  const body = req.body;
  try {
    const Name = await user.Login(body.email, body.password);
    if (Name[0]) {
      res
        .status(201)
        .send(JSON.stringify({ message: `sucesfully to ${Name} Account` }));
    } else {
      res.status(400).send(
        JSON.stringify({
          message: "Email Or Password incorrect",
        })
      );
    }
  } catch (err) {
    res
      .status(400)
      .send(
        JSON.stringify({ message: "Falid To Connect Please Try Again Later" })
      );
  }
};

const Azmon = async (req, res) => {
  const body = req.body;
  try {
    const result = await user.Azmon(body.course, body.pdmn);
    res.status(201).send(result);
  } catch (err) {
    res
      .status(401)
      .send(
        JSON.stringify({ message: "falid To Azmon Please Tyy Agein Later" })
      );
  }
};

module.exports = {
  Login,
  Azmon,
};
