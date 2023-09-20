const Chat = require("../src/database/models/Chat");
const Message = require("../src/database/models/Message");
const { User } = require("../src/database/models/User");

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invalid data");
    res.status(400);
  }
  let newMessage = {
    sender: req.user.id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "-password");
    message = await message.populate("chat");

    message = await User.populate(message, {
      path: "chat.users",
      select: "name email",
    });

    const chatUp = await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "-password")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    console.log(error.stack);
  }
};

module.exports = { sendMessage, allMessages };
