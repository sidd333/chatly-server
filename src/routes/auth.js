const express = require("express");
const { body, validationResult } = require("express-validator");
const { User } = require("../database/models/User");
const {
  signupValidate,
  signinValidate,
} = require("../validation/userValidation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getallusers } = require("../../controllers/userController");
const { fetchuser } = require("../../middlewares/fetchUser");

const Router = express.Router();

Router.post("/signup", signupValidate(), async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors });
  }
  try {
    const emailCheck = await User.findByEmail(req.body);
    if (emailCheck) {
      console.log("email exists already");
      return res.status(404).json({ error: "email exists already" });
    }
    const salt = await bcrypt.genSalt(10);
    const processedPassword = await bcrypt.hash(req.body.password, salt);

    User.create({
      name: req.body.name,
      email: req.body.email,
      password: processedPassword,
    });
    const user = await User.findOne({ email: req.body.email });
    const data = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(data, process.env.SECRET_KEY);
    success = true;
    res.send({
      success,
      token,
      userInfo: {
        userName: user.name,
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

Router.post("/signin", signinValidate(), async (req, res) => {
  const errors = validationResult(req);
  let success = false;
  if (!errors.isEmpty()) {
    return res.status(400).json(success, { errors: errors });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      success = false;
      return res.status(400).json({ success, error: "invalid credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({ success, error: "invalid credentials" });
    }

    const data = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(data, process.env.SECRET_KEY);
    success = true;

    res.json({
      success,
      token,

      userName: user.name,
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json("some error occured");
  }
});

Router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send({ user: user });
  } catch (error) {
    res.status(500).send("Internal server error: " + error.message);
  }
});

Router.get("/", fetchuser, getallusers);

module.exports = Router;
