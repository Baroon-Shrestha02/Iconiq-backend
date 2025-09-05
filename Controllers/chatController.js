const ChatMessage = require("../Models/ChatMessage");
const SessionInfo = require("../Models/SessionInfo");
// Admin: Get all chat messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error in getAllMessages:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Get list of session IDs
const getAllSessions = async (req, res) => {
  try {
    const sessions = await ChatMessage.aggregate([
      { $group: { _id: "$sessionId" } },
      { $sort: { _id: -1 } },
    ]);
    res.status(200).json(sessions.map((s) => s._id));
  } catch (err) {
    console.error("Error in getAllSessions:", err.message);
    res.status(500).json({ message: "Error fetching sessions" });
  }
};

const getAllSessionsWithUsernames = async (req, res) => {
  try {
    const sessions = await SessionInfo.find().sort({ createdAt: -1 });
    res.status(200).json(sessions);
  } catch (err) {
    console.error("Error in getAllSessionsWithUsernames:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Get all messages for a session
const getMessagesBySession = async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId || sessionId.length < 8) {
    return res.status(400).json({ message: "Invalid session ID" });
  }

  try {
    const messages = await ChatMessage.find({ sessionId }).sort({
      timestamp: 1,
    });
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error in getMessagesBySession:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllMessages,
  getAllSessions,
  getMessagesBySession,
  getAllSessionsWithUsernames,
};
