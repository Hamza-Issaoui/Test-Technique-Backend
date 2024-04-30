const User = require("../Models/User");

module.exports = {

  GetAllUsers: async (req, res) => {
    try {
      const listUsers = await User.find();
      res.status(200).json({ listUsers });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  GetUserById: async (req, res) => {
    try {
      const user = await User.findById({
        _id: req.params.id,
      });
      res.status(200).json({
        user,
      });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  UpdateUser: async (req, res) => {
    try {
      await User.updateOne(
        {
          _id: req.params.id,
        },
        req.body
      );
      res.status(200).json({ msg: "User Updated" });
    } catch (error) {
      res.status(406).json({ status: 406, msg: error.message });
    }
  },
  DeleteUser: async (req, res) => {
    try {
      await User.deleteOne({ _id: req.params.id });
      res.status(200).json({ msg: "User deleted" });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
};

