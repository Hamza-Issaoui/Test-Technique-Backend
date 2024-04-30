const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var RefreshTokens = [];

const SECRET = process.env.APP_SECRET;
const FRONT = process.env.FRONT_URL;


module.exports = {
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
        const passwordCompare = bcrypt.compareSync(password, user.password); // comparaison des deux password
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
          SECRET,
          {
            expiresIn: "1 m",
          }

        );

        var refreshToken = jwt.sign({ id: user._id }, SECRET, {
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
  refreshToken: async (req, res) => {
    try {
      var refreshToken = req.body.refreshToken;
      if (refreshToken in RefreshTokens) {
        const token = jwt.sign(
          {
            user: req.user,
          },
          SECRET,
          {
            expiresIn: "7 h",
          }
        );
        var refreshToken = jwt.sign({ id: req.user }, SECRET, {
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

