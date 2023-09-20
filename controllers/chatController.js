import Chat from "../src/database/models/Chat";
import { User } from "../src/database/models/User";

const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.sendStatus(400);
    }

    //find the correct chat and populate the users
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        {
          users: { $elemMatch: { $eq: req.user.id } },
        },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      let chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user.id, userId],
      };
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.send(FullChat);
    }
  } catch (error) {
    res.send(error.stack);
  }
};

const fetchChat = async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user.id } },
    })
      .populate("users", "-password")
      .populate("admin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name,email",
    });

    res.send(chats);
  } catch (error) {
    res.send(error);
  }
};

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "fill up the fiels" });
  }
  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res.status(400).send("invalid user count");
  }
  users.push(req.user.id);
  const chatData = {
    isGroupChat: true,
    admin: req.user.id,
    users: users,
    chatName: req.body.name,
  };
  const createdChat = await Chat.create(chatData);
  const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
    "users",
    "-password"
  );
  res.send(FullChat);
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  const data = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("admin", "-password");

  if (!data) {
    res.status(404);
    throw new Error("chat Not FounD");
  } else {
    res.send(data);
  }
};

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("admin", "-password");

  if (!added) {
    res.send("not found");
  } else {
    res.json(added);
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("admin", "-password");

  if (!added) {
    res.send("not found");
  } else {
    res.json(added);
  }
};

export {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
