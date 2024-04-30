const jwt = require("jsonwebtoken");
const SECRET = process.env.APP_SECRET;

check_auth = async (req, res, next) => {
    try {
        const token = req.headers["authorization"];

        if (!token) {
            return res.status(403).json({ msg: "No token" });
        }

        jwt.verify(token, SECRET, (err, decoder) => {
            if (err) {
                return res.status(401).json({ status: 401, msg: "Auth failed" + err });
            }
            req.user = decoder;
            next();
        });
    } catch (error) {
        res.status(404).json({ msg: "Auth failed" + error.message });
    }
};

module.exports = check_auth;

