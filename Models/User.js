const mongoose = require("mongoose");
const schemaUser = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
     lastname: {
        type: String,
        required: true,
        trim: true,
     },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: Number,
    },
    role: {
         type: String,
         enum: ['admin', 'user', 'superviseur'], 
        },
    },
    {timestamps:true}
    );
    module.exports = mongoose.model("User", schemaUser);