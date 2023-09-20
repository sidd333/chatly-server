"use strict";

var _express = _interopRequireDefault(require("express"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _cors = _interopRequireDefault(require("cors"));
var _path = _interopRequireDefault(require("path"));
var _auth = _interopRequireDefault(require("./src/routes/auth"));
var _notes = _interopRequireDefault(require("./src/routes/notes"));
var _chat = _interopRequireDefault(require("./src/routes/chat"));
var _message = _interopRequireDefault(require("./src/routes/message"));
var _db = _interopRequireDefault(require("./src/database/db"));
var _socket = require("socket.io");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//routes

_dotenv.default.config();
(0, _db.default)();
const app = (0, _express.default)();
const port = 4000;
app.use((0, _cors.default)());
app.use(_express.default.json());
// app.use('/api/notes', notes);

app.use("/api/message", _message.default);
app.use("/api/chat", _chat.default);
app.use("/api/auth", _auth.default);
app.use("/api/notes", _notes.default);

// ---------------------deployment------------------

const __dirname1 = _path.default.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(_express.default.static(_path.default.join(__dirname1, "../notes/build")));
  app.get("*", (req, res) => {
    res.sendFile(_path.default.resolve(__dirname1, "../notes", "build", "index.html"));
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
const io = new _socket.Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});
io.on("connection", socket => {
  console.log("conn");
  socket.on("setup", userData => {
    socket.join(userData.id);
    socket.emit("connected");
  });
  socket.on("join chat", room => {
    socket.join(room);
    console.log("user joined room" + room);
  });
  socket.on("typing", room => {
    socket.in(room).emit("typing");
    console.log("typing");
  });
  socket.on("new message", newMessageReceived => {
    let chat = newMessageReceived.chat;
    if (!chat.users) return console.log("users not defined");
    chat.users.forEach(user => {
      if (user._id == newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived); //send inside setup room
    });
  });
});