const express = require('express');
const app = express();
const http = require('http');
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const path = require('path');
const { Server } = require('socket.io');
const SendScore = require('./routes/api/score');
const { router, GetLeaderBoard } = require('./routes/api/LeaderBoard');

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",  // allow your frontend
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    socket.on('submitScore', async ({ name, score }) => {
        await SendScore(name, score);
        const leaderboard = await GetLeaderBoard();
        io.emit('updateScore', leaderboard)
    })
})


require('dotenv').config();
const uri = process.env.MONGO_URI;;
mongoose.connect(uri).then(() => console.log("MongoDB Connected")).catch(err => console.error("MongoDB connection error:", err));


server.listen(PORT, () => {
    console.log("Listen port")
});


app.use(express.json());

app.use('/score', require('./routes/api/score'))
app.use('/user', require('./routes/api/user'))
app.use('/leaderBoard', router)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
})


