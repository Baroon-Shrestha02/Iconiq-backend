const express = require("express");
const { sendmail } = require("../Controllers/MailController");

const router = express.Router();

router.post("/send-mail", sendmail);

module.exports = router;
