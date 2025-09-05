const SessionInfo = require("../Models/SessionInfo");

const saveSessionInfo = async (req, res) => {
  const { sessionId, username } = req.body;

  if (!sessionId || !username) {
    return res
      .status(400)
      .json({ message: "Session ID and username are required." });
  }

  try {
    const existingSession = await SessionInfo.findOne({ sessionId });

    if (existingSession) {
      if (existingSession.username !== username) {
        existingSession.username = username;
        await existingSession.save();
        return res
          .status(200)
          .json({ message: "Username updated for session." });
      }
      return res.status(200).json({ message: "Session already exists." });
    }

    const newSession = new SessionInfo({ sessionId, username });
    await newSession.save();

    res.status(201).json({ message: "Session info saved successfully." });
  } catch (error) {
    console.error("Error saving session info:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { saveSessionInfo };
