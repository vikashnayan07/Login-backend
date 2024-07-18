const express = require("express");
const {
  userRegister,
  userLogin,
  getUserByUsername,
  generateOTP,
  verifyOTP,
  createResetsession,
  userProfileUpdate,
  userPasswordReset,
  verifyUser,
} = require("../controllers/authControllers");
const { Auth, localVariable } = require("../middleware/authUser");
const registerToMail = require("../controllers/sendMail");

const router = express.Router();

//******POST ******//

router.route("/register").post(userRegister);

router.route("/registerMail").post(registerToMail);

router.route("/authenticate").post(verifyUser, (req, res) => res.end());
router.route("/login").post(verifyUser, userLogin);

// ********* GET **********/

router.route("/user/:username").get(getUserByUsername);
router.route("/generateOTP").get(verifyUser, localVariable, generateOTP);
router.route("/verifyOTP").get(verifyUser, verifyOTP);
router.route("/createResetsession").get(createResetsession);

// ********* PUT ********* //

router.route("/updateprofile").put(Auth, userProfileUpdate);
router.route("/resetPassword").put(verifyUser, userPasswordReset);

module.exports = router;
