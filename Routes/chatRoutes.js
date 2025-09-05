const express = require("express");

const {
  getAllMessages,
  getMessagesBySession,
  getAllSessions,
  getAllSessionsWithUsernames,
} = require("../Controllers/chatController");
const { verifyAdmin } = require("../MIddlewares/verifyAdmin");

const router = express.Router();

router.get("/messages", verifyAdmin, getAllMessages);
router.get("/session/:sessionId", getMessagesBySession);
router.get("/users", verifyAdmin, getAllSessions);
router.get("/usernames", getAllSessionsWithUsernames);

module.exports = router;
