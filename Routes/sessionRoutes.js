const express = require("express");
const { saveSessionInfo } = require("../Controllers/sessionController");

const router = express.Router();

router.post("/save-session", saveSessionInfo);

module.exports = router;
