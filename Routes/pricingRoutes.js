const express = require("express");
const { sendMail } = require("../Controllers/pricingMailController");

const router = express.Router();

router.post("/pricing-mail", sendMail);

module.exports = router;
