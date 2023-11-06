export{}
const mongoose = require("mongoose")


const pschema= new mongoose.Schema({comment:{type:String,reuired:true},
    createdby:{type:mongoose.Types.ObjectId,
    ref:"User"}
    
})
module.exports= mongoose.model("Post", pschema)