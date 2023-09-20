import express from "express";
import dotenv from "dotenv";
import cors from "cors";

//routes
import path from "path";
import auth from "./src/routes/auth";
import notes from "./src/routes/notes";
import chat from "./src/routes/chat";
import message from "./src/routes/message";

import connectToMongo from "./src/database/db";

import { Server } from "socket.io";

dotenv.config();
connectToMongo();

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
// app.use('/api/notes', notes);

app.use("/api/message", message);
app.use("/api/chat", chat);
app.use("/api/auth", auth);
app.use("/api/notes", notes);

// ---------------------deployment------------------

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "../notes/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "../notes", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("running successfully");
  });
}

// ---------------------deployment------------------

const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("conn");

  socket.on("setup", (userData) => {
    socket.join(userData.id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room" + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
    console.log("typing");
  });

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log("users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived); //send inside setup room
    });
  });
});
