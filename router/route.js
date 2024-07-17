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

const router = express.Router();

//******POST ******//
router.route("/register").post(userRegister);

// router.route("/registerMail").post((req, res) => {
//   res.status(201).json({
//     status: "success",
//     message: "generateMail successfully",
//   });
// });
router.route("/authenticate").post((req, res) => res.end());
router.route("/login").post(verifyUser, userLogin);

// ********* GET **********/
router.route("/user/:username").get(getUserByUsername);
router.route("/generateOTP").get(verifyUser, localVariable, generateOTP);
router.route("/verifyOTP").get(verifyOTP);
router.route("/createResetsession").get(createResetsession);

// ********* PUT ********* //
router.route("/updateprofile").put(Auth, userProfileUpdate);
router.route("resetPassword").put(userPasswordReset);

module.exports = router;
