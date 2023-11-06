export {}
const mongoose = require("mongoose")
let {Document} = require("mongoose")
export interface Uschma extends Document  {
  googleId:String,  
displayName:String
}


const uschema= new mongoose.Schema({googleId:{type:String,reuired:true},displayName:{type:String,reuired:true}
    // firstName:{type:String,reuired:true},
// lastName:{type:String,reuired:true},
// email:{type:String,reuired:true},
// password:{type:String,reuired:true}
})
module.exports= mongoose.model("User", uschema)