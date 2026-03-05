const express = require('express');
const app = express();
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')

function Authentication(req, res, next) {
    const token = req.header("auth-header");

    if (!token) {
        return res.status(401).json({ error: "No Header" });
    }

    try {
        const decode = jwt.verify(token, "SecretKeyAnna");
        req.user = decode.user;
        next();
    } catch (err) {
        console.log(err);
        res.json({ err: err })
    }

}

module.exports = Authentication;