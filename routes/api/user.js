const express = require('express');
const app = express();
const auth = require("../../middleware/auth")
const router = express.Router();
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')
const { check, validationResult } = require('express-validator')
const Player = require("../../models/Player")

router.post('/createuser', check("name", "name is required").not().isEmpty(), async (req, res) => {
    const validatorresult = validationResult(req);
    if (!validatorresult.isEmpty()) {
        return res.status(404).json({ err: validatorresult });
    }
    let player = await Player.findOne({ name: req.body.name })
    if (player) {
        return res.status(404).json({ err: "Player Present " });
    }
    player = new Player({
        name: req.body.name,
        age: req.body.age
    })
    await player.save();

    const payload = {
        user: {
            id: player.id
        }
    }

    const token = jwt.sign(payload, "SecretKeyAnna", { expiresIn: "7d" })
    player.token = token;
    await player.save();

    res.json({ token })

})
router.get('/getToken/:name', async (req, res) => {
    let player = await Player.findOne({ name: req.params.name })


    if (player.token) {
        try {
            jwt.verify(player.token, "SecretKeyAnna");
            return res.json({ token: player.token });
        } catch (err) {

        }
    }
    return res.json("gotilla")
})

module.exports = router;