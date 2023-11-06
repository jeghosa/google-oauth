const mongoose= require("mongoose")




const connectdb= (url:string)=>{
    mongoose.connect(url)
}

 module.exports = connectdb