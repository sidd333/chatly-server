import express from "express";
import { fetchuser } from "../../middlewares/fetchUser";
import { allMessages, sendMessage } from "../../controllers/messageController";

const Router = express.Router();

Router.route("/").post(fetchuser, sendMessage);
Router.route("/:chatId").get(fetchuser, allMessages);

export default Router;
