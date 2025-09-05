const http = require("http");
const { Server } = require("socket.io");
const { database } = require("./Database/database");
const app = require("./app");
const { setupSocket } = require("./socket");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || "*"); // Allow any origin dynamically
    },
    credentials: true,
  })
);

setupSocket(io); // 💬 Register Socket.IO logic

// Connect DB and start server
database()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`🚀 Server + Socket.IO running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
  });
