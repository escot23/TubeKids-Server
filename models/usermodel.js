const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pin: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 6
    },
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    country: String,
    birthdate: {
        type: Date,
        required: true
    }
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
