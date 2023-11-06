export{}

const {Request, Response}= require("express")
type Next= ()=> void | Promise<void>
const unauthenticated= (req:any,res:any, next:Next)=>{
    if (req.isAuthenticated()) {
      return  res.redirect("/posts")
        
        
    }
    return next()
}

module.exports= unauthenticated