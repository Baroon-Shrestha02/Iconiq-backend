const ChatMessage = require("./Models/ChatMessage");

function setupSocket(io) {
  io.on("connection", (socket) => {
    const sessionId = socket.handshake.query.sessionId;
    console.log(`🟢 New connection: ${sessionId}`);

    // Join the socket to a room identified by sessionId
    socket.join(sessionId);

    // Handle message sending
    socket.on(
      "send_message",
      async ({ sessionId, senderId, receiverId, text }) => {
        if (!text || !senderId || !sessionId) return;

        const chat = new ChatMessage({
          sessionId,
          sender: senderId === "admin" ? "admin" : "user",
          message: text,
        });

        await chat.save();

        // Emit only to the room, not all clients
        io.to(sessionId).emit("receive_message", {
          sessionId,
          sender: chat.sender,
          text: chat.message,
          timestamp: chat.timestamp,
        });
      }
    );

    socket.on("disconnect", () => {
      console.log(`🔴 Disconnected: ${sessionId}`);
    });
  });
}

module.exports = { setupSocket };
