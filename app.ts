export{}
const express = require("express")
const {Request, Response}= require("express")
const app = express()
const cookieSession = require("cookie-session");
const path= require ("path")
const conect = require("./db/connect")
require("dotenv").config()
const session = require("express-session")

const passport = require('passport');
const mongoose= require("mongoose")
const MongoStore= require("connect-mongo")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User= require("./db/uerm")
const Post= require("./db/postschma")
const cors= require("cors")
const pauth= require("./middleware/pauth")
const unauth= require("./middleware/unauth")
app.set("view-engine", "ejs")
// app.set('views', path.join(__dirname, 'views'));
type Tpost= {comment:string}
let post:Tpost

type Profile={id:string,displayName:string}


  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4600/auth/google/redirect"
  },
  async (accessToken:string, refreshToken:string, profile:Profile, done:any)=> {
   const user= await User.findOne({ googleId: profile.id })
          
          if (!user) {
            // Create a new user
           await User.create(
              {
                googleId: profile.id,
                displayName: profile.displayName,
                // Add more user data as needed
              }
              
              // (err:Error, result:any) => {
              //   if (err) return done(err);
              //   return done(null, result.ops[0]);
              // }
            );
          } else {
            return done(null, user);
          }
        ;
      }
    )
   
)

 passport.serializeUser((user:Profile, done:any) => {
    done(null, user.id);
  });

  passport.deserializeUser(async(id:Profile, done:any) => {
    const user= await User.findById(id
      // ,(err:Error,user:Profile)=> done(null, user)
    )
    done(null, user)
    ;
  });

app.use(express.json());
// app.use(cors())
// app.use(
//   cookieSession({
//     name:"session",
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: ["jsasjshsksjhs353" ]
//   })
// );
  app.use(express.urlencoded({ extended: false }));
  app.use(require('express-session')({ secret: 'secret', resave: false, saveUninitialized: false,
store: MongoStore.create({ mongoUrl:process.env.MONGO_URI}) }));
app.use(passport.session())

  app.use(passport.initialize());
  ;

app.get("/", unauth,(req:Request,res:any)=>{

 res.render("index.ejs")
})

// app.get("/login", (req:Request,res:any)=>{


//     res.render("login.ejs")
// })

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
  app.get(
    '/auth/google/redirect',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req:Request, res:any) => {
    res.redirect('/posts')}

  );

  app.post('/logout', function(req:any, res:any, next:()=> void | Promise<void>){
  req.logout(function(err:Error) {
    if (err) { return next(); }
   return res.redirect('/');
  });
})



  app.get('/posts',pauth, (req:any, res:any) => {
    
    // res.redirect('/l');
  res.render("posts.ejs",{post})
  });
  app.post('/posts', async(req:any, res:any) => {
    
    req.body.createdby = req.user.id
    post= await Post.create(req.body)
  res.send(post)

  });





const port= process.env.PORT || 4600
const start= async()=>{
    await conect(process.env.MONGO_URI)
    app.listen(4600, ()=>console.log(`app listening on port ${port}`))
}

start()
