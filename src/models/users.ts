import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
    },
    emailVerified:{
        type:Boolean,
    }
})

const Users = models.Users || mongoose.model("Users",userSchema)
export default Users;