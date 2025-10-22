import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

var RefreshTokens = [];

const SECRET = process.env.APP_SECRET;
const FRONT = process.env.FRONT_URL;


const authController = {
   /**
   * Register a new user.
   * @param {Object} req - Request body containing user data (email, password, etc.)
   * @param {Object} res - Response object
   */
  registerUser: async (req, res) => {
    try {
      const password = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        ...req.body,
        password
      });
      await newUser.save();
      res.status(201).json({ status: 201, msg: "User Created Successfully!" });

    } catch (error) {
      res.status(406).json({ status: 406, msg: error.message });
    }
  },

   /**
   * Log in a user.
   * @param {Object} req - Request body with email and password
   * @param {Object} res - Response object
   */
  logIn: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        email: req.body.email,
      });
      if (!user) {
        res.status(404).json({
          status: 404,
          msg: "email not found !",
        });
      } else {
        const passwordCompare = bcrypt.compareSync(password, user.password); 
        if (!passwordCompare) {
          return res.status(406).json({
            status: 406,
            msg: "password Incorrect !",
          });
        }
        const token = jwt.sign(
          {
            id: user._id,
            user: user,
          },
          process.env.APP_SECRET,
          {
            expiresIn: "1 h",
          }

        );

        var refreshToken = jwt.sign({ id: user._id }, process.env.APP_SECRET, {
          expiresIn: 86400,
        });
        RefreshTokens[refreshToken] = user._id;

        const result = {
          email: user.email,
          user: user,
          token: token,
          expiresIn: 1,
          refreshToken: refreshToken,
        };
        res.status(200).json({
          ...result,
          msg: "you are connected",
          success: true,
        });
      }
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },

  /**
   * Refresh access token.
   * @param {Object} req - Request body with refreshToken
   * @param {Object} res - Response object
   */
  refreshToken: async (req, res) => {
    try {
      var refreshToken = req.body.refreshToken;
      if (refreshToken in RefreshTokens) {
        const token = jwt.sign(
          {
            user: req.user,
          },
          process.env.APP_SECRET,
          {
            expiresIn: "7 h",
          }
        );
        var refreshToken = jwt.sign({ id: req.user }, process.env.APP_SECRET, {
          expiresIn: 86400,
        });
        RefreshTokens[refreshToken] = req.user;
        res.status(200).json({
          accesstoken: token,
          refreshToken: refreshToken,
        });
      } else {
        res.status(406).json({ msg: "token not found" });
      }
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
};
export default authController;

