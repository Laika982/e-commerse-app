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
        sparse:true,
        default:null
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
        default:null
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

userSchema.set("autoIndex", false);
userSchema.set("autoCreate", false);

module.exports = mongoose.model("User",userSchema);
