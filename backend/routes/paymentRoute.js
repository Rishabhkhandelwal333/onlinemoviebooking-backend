const express =  require("express");
const { processPayment, sendStripeApiKey } = require("../controllers/paymentContoller");
const router = express.Router();
const {isAuthenticatedUser} = require("../midlleware/auth");


router.route("/payment/process").post(isAuthenticatedUser,processPayment);

router.route("/stripeapikey").get(isAuthenticatedUser,sendStripeApiKey);
module.exports=router;