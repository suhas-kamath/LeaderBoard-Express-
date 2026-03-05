const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PostSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    token: {
        type: String
    }
})

module.exports = mongoose.model("player", PostSchema);