import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
        username: {
            type:String,
            required: true,
            min: 3,
            max: 20,
            unique: true
        },
        email:{
            type: String,
            required: true,
            max: 50,
            unique: true
        },
        firstname: {
            type:String,
            max: 25,
            default:""
        },
        lastname: {
            type:String,
            max: 25,
            default:""
        },
        password:{
            type: String,
            required: true,
            min: 8
        },
        profilePicture: {
            type:String,
            default:""
        },
        coverPicture: {
            type:String,
            default:""
        },
        folowers: {
            type:Array,
            default:[]
        },
        folowings: {
            type:Array,
            default:[]
        },
        created_date: {
            type:Date,
            default: current_date
        },
        last_login: {
            type:Date,
            default: current_date
        },
        isAdmin:{
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);