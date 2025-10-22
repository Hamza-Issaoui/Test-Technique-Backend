import User from "../Models/User.js";

const userController = {

   /**
   * Get all users.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  GetAllUsers: async (req, res) => {
    try {
      const listUsers = await User.find();
      res.status(200).json({ listUsers });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },

  /**
   * Get a user by ID.
   * @param {Object} req - Request params containing user ID
   * @param {Object} res - Response object
   */
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

  
  /**
   * Update a user by ID.
   * @param {Object} req - Request params containing user ID and body with updates
   * @param {Object} res - Response object
   */
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

    /**
   * Delete a user by ID.
   * @param {Object} req - Request params containing user ID
   * @param {Object} res - Response object
   */
  DeleteUser: async (req, res) => {
    try {
      await User.deleteOne({ _id: req.params.id });
      res.status(200).json({ msg: "User deleted" });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
};

export default userController;
