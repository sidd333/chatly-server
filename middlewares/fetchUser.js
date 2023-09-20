const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res
      .status(401)
      .send({ error: "authentication with valid token required e1" });
  }
  try {
    const data = jwt.verify(token, process.env.SECRET_KEY);
    req.user = data.user;

    next();
  } catch (error) {
    res
      .status(401)
      .send({ error: "authentication with valid token required e2" });
  }
};

module.exports = fetchuser;
