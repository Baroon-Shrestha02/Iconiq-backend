const mongoose = require("mongoose");

const sessionInfoSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  username: { type: String },
  createdAt: { type: Date, default: Date.now },
});
const SessionInfo = mongoose.model("SessionInfo", sessionInfoSchema);

module.exports = SessionInfo;
