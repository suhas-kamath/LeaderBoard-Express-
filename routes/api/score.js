const express = require('express');
const app = express();
const auth = require("../../middleware/auth")
const router = express.Router();
const { check, validationResult } = require('express-validator')
const redis = require('../../config/redis')


async function SendScore(name, score) {
    console.log(name)
    const rank = await redis.zRank("leaderboard", name);
    if (rank !== null) {
        await redis.zIncrBy("leaderboard", score, name);
    } else {
        await redis.zAdd("leaderboard", {
            score: score,
            value: name,
        });
    }
    
}



// router.post("/", [auth, [
//     check("score", "Score is Required").not().isEmpty()
// ]
// ], async (req, res) => {
//     const validation = validationResult(req);
//     if (!validation.isEmpty()) {
//         return res.json("Error").status(404);
//     }

//     const score = req.body.score;
//     const rank = await redis.zRank("leaderboard", req.user.id);



//     if (rank !== null) {
//         await redis.zIncrBy("leaderboard", score, req.user.id);
//     } else {
//         await redis.zAdd("leaderboard", {
//             score: score,
//             value: req.user.id,
//         });
//     }
//     const playerIds = await redis.zRange("leaderboard", 0, -1);

//     const playerlist = await Promise.all(
//         playerIds.map(async (playerId) => {
//             const score = await redis.zScore("leaderboard", playerId);
//             return { playerId, score: (score) };
//         })
//     );

//     return res.json(playerlist).status(200);
// })

module.exports = SendScore;