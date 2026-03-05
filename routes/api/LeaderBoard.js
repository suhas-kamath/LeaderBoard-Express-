const express = require('express');

const router = express.Router();
const redis = require('../../config/redis')

const playerModel = require("../../models/Player")
router.get('/', async (req, res) => {
    const result = await GetLeaderBoard()

    return res.json(result);
});


async function GetLeaderBoard() {
    
    const playerIds = await redis.zRange("leaderboard", 0, -1);
    const leaderboard = await Promise.all(playerIds.map(async (playerid) => {
        const score = await redis.zScore("leaderboard", playerid)
        return {
            "score": score,
            "name": playerid
        }
    }));
    return leaderboard;
}

module.exports = module.exports = {
    router,
    GetLeaderBoard
};;