import { User } from "../src/database/models/User";
import { fetchuser } from "../middlewares/fetchUser";

const getallusers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password");
  //
  res.send(users);
};

export { getallusers };
