const express = require('express');
const router = express();


//user controler
const userController = require("../controllers/userController");

router.post("/signup", userController.signUp);
router.post("/signin", userController.validateAuthCredentials, userController.signIn);
router.post('/generateotp', userController.generateOtp)
router.post('/resetpassword', userController.resetPassword)

module.exports = router;

