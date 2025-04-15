const mongoose = require("mongoose");

const {Schema} = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
        trim: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 18
    },
    gender: {
        type: String,
        required: true,
        lowercase: true,
        validate: function(value) {
            if(!["male", "female", "others"].includes(value)) {
                throw new Error("Gender is incorrect")
            }
        }
    },
    profilePicture: {
        type: String,
        default: "https://example.com/default-profile-pic.jpg"
    },
    bio: {
        type: String,
        default: "This is my bio"
    },
    skills: {
        type: [String],
        default: []
    },
    location: {
        type: String,
        default: "Unknown"
    },
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);