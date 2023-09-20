const express = require("express");
const { fetchuser } = require("../../middlewares/fetchUser");
const {
  allMessages,
  sendMessage,
} = require("../../controllers/messageController");

const Router = express.Router();

Router.route("/").post(fetchuser, sendMessage);
Router.route("/:chatId").get(fetchuser, allMessages);

module.exports = Router;
