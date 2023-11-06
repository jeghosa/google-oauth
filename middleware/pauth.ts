export{}

const {Request, Response}= require("express")
type Next= ()=> void | Promise<void>
const authenticated= (req:any, res:any, next:Next)=>{
    if (req.isAuthenticated()) {
        return next()
        
    }
     return res.redirect("/")
}

module.exports= authenticated