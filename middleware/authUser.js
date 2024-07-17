const jwt = require("jsonwebtoken");

const secret = "Vikash94304";

async function Auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = await jwt.verify(token, secret);
    req.user = decode;
    next();
  } catch (error) {
    return res.status(500).send({ msg: "Authentication failed" });
  }
}

module.exports = Auth;
