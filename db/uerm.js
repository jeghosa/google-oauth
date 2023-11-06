"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let { Document } = require("mongoose");
const uschema = new mongoose.Schema({ googleId: { type: String, reuired: true }, displayName: { type: String, reuired: true }
    // firstName:{type:String,reuired:true},
    // lastName:{type:String,reuired:true},
    // email:{type:String,reuired:true},
    // password:{type:String,reuired:true}
});
module.exports = mongoose.model("User", uschema);
