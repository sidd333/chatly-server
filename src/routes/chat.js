const express = require("express");
const { fetchuser } = require("../../middlewares/fetchUser");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../../controllers/chatController");
const Router = express.Router();

Router.post("/", fetchuser, accessChat); // create chat if it does'nt exist and fetch one if it exists
Router.get("/", fetchuser, fetchChat); //get all chats of one user
Router.post("/group", fetchuser, createGroupChat);
Router.put("/rename", fetchuser, renameGroup);
Router.put("/addMember", fetchuser, addToGroup);
Router.delete("/removeMember", fetchuser, removeFromGroup);
export default Router;
