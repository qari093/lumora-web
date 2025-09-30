const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("[Lumora Live] User connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("[Lumora Live] User disconnected:", socket.id);
  });
});

app.get("/live/main-room", (req, res) => {
  res.send("<h1>🌟 Lumora Live Main Room is running!</h1>");
});

const PORT = process.env.LIVE_PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Lumora Live Server running at http://localhost:${PORT}/live/main-room`);
});
