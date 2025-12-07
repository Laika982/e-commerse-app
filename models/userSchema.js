const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: {
        type : String,
        unique:true,
    },
    secondary_email: {
        type:String,
        required:false,
    },
    password : {
        type:String,
        required :false
    },
    referalCode:{
        type:String,
        required: false,
        unique: true
    },
    displayName:{
        type:String,
        required: false,
    },
    full_name: {
        type: String,
        required: false
    },
    phone : {
        type : String,
        required: false,
        unique: false,
        sparse:true,
        default:null
        },
   isBlocked: {
    type : Boolean,
    required: false,
    default:false
    },
    isAdmin : {
    type: Boolean,
    required: false,
    default:false
    }
})

module.exports = mongoose.model("User",userSchema);
