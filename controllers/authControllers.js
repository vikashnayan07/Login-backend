const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

const secret = process.env.JWT_SECRET;

const verifyUser = async (req, res, next) => {
  try {
    const { username } = req.method === "GET" ? req.query : req.body;
    const exist = await User.findOne({ username });
    if (!exist) return res.status(404).send({ msf: "Username not found" });
    next();
  } catch (error) {
    return res.status(500).send({ msg: "Authentication error" });
  }
};

const userRegister = async (req, res) => {
  try {
    const { username, password, email, profile } = req.body;

    // Check if username exists
    const existingUsername = await User.findOne({ username }).exec();
    const existingEmail = await User.findOne({ email }).exec();

    Promise.all([existingUsername, existingEmail])
      .then(([usernameExists, emailExists]) => {
        if (usernameExists) {
          return res.status(400).send({ error: "Username should be unique" });
        }

        if (emailExists) {
          return res.status(400).send({ error: "Email should be unique" });
        }

        if (password) {
          return bcrypt.hash(password, 12);
        } else {
          throw new Error("Password is required");
        }
      })
      .then((hashPassword) => {
        const user = new User({
          username,
          password: hashPassword,
          email,
          profile: profile || "",
        });

        return user.save();
      })
      .then((result) => {
        res.status(201).send({
          msg: "Register Successful",
        });
      })
      .catch((error) => {
        res
          .status(500)
          .send({ error: error.message || "Internal Server Error" });
      });
  } catch (error) {
    return res
      .status(500)
      .send({ error: error.message || "Internal Server Error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    await User.findOne({ username })
      .exec()
      .then((user) => {
        if (!user) {
          return res.status(401).send({ msg: "Username not found" });
        }
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck) {
              return res.status(401).send({ msg: "Incorrect password" });
            }
            // jwt token
            const token = jwt.sign(
              {
                userId: user._id,
                username: user.username,
              },
              secret,
              { expiresIn: "24h" }
            );
            return res.status(200).send({
              status: "success",
              username: user.username,
              token,
              msg: "Successfully logged in",
            });
          })
          .catch((error) => {
            console.error(error);
            return res.status(500).send({ msg: "Error comparing password" });
          });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send({ msg: "Error finding username" });
      });
  } catch (error) {
    return res.status(500).send({ msg: "Internal server error" });
  }
};

const getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ msg: "No user found" });
    }
    const { password, ...remain } = Object.assign({}, user.toJSON());
    return res.status(200).send(remain);
  } catch (error) {
    return res
      .status(500)
      .send({ msg: "Can't find username", error: error.message });
  }
};

const generateOTP = async (req, res) => {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  return res.status(201).send({ code: req.app.locals.OTP });
};

const verifyOTP = (req, res) => {
  const { code } = req.query;
  console.log(code);
  console.log(req.app.locals);
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(201).send({ msg: "OTP verify successfully" });
  }
  return res.status(401).send({ msg: "Invalid OTP" });
};

const createResetsession = (req, res) => {
  console.log("resetSession:", req.app.locals.resetSession);

  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
    console.log({ flag: req.app.locals.resetSession });
  }

  return res.status(401).send({ error: "Access denied..." });
};

const userProfileUpdate = async (req, res) => {
  try {
    const { userId } = req.user;

    if (userId) {
      const body = req.body;
      const updateUser = await User.updateOne({ _id: userId }, body);
      if (updateUser) {
        return res.status(201).send({ msg: "User Updated.." });
      }
    } else {
      return res.status(404).send({ msg: "User not found" });
    }
  } catch (error) {
    return res.status(500).send({ msg: "Internal server error", error });
  }
};

const userPasswordReset = async (req, res) => {
  try {
    console.log("Reset Session Status:", req.app.locals.resetSession);

    if (!req.app.locals.resetSession) {
      return res.status(401).send({ error: "Session expired" });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .send({ error: "Username and password are required" });
    }

    const user = await User.findOne({ username }).exec();

    if (!user) {
      return res.status(404).send({ error: "Username not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const update = await User.updateOne(
      { username: user.username },
      { password: hashedPassword }
    );

    if (update.nModified === 0) {
      return res.status(500).send({ error: "Failed to update password" });
    }

    req.app.locals.resetSession = false;

    return res.status(200).send({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in userPasswordReset:", error);
    return res.status(500).send({ error: "Server error" });
  }
};

module.exports = {
  userRegister,
  userLogin,
  getUserByUsername,
  generateOTP,
  verifyOTP,
  createResetsession,
  userProfileUpdate,
  userPasswordReset,
  verifyUser,
};
