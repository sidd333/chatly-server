import { mongoose, Schema } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chats",
    },
    content: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
