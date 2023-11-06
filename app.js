"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { Request, Response } = require("express");
const app = express();
const cookieSession = require("cookie-session");
const path = require("path");
const conect = require("./db/connect");
require("dotenv").config();
const session = require("express-session");
const passport = require('passport');
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("./db/uerm");
const Post = require("./db/postschma");
const cors = require("cors");
const pauth = require("./middleware/pauth");
const unauth = require("./middleware/unauth");
app.set("view-engine", "ejs");
let post;
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4600/auth/google/redirect"
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({ googleId: profile.id });
    if (!user) {
        // Create a new user
        yield User.create({
            googleId: profile.id,
            displayName: profile.displayName,
            // Add more user data as needed
        }
        // (err:Error, result:any) => {
        //   if (err) return done(err);
        //   return done(null, result.ops[0]);
        // }
        );
    }
    else {
        return done(null, user);
    }
    ;
})));
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findById(id
    // ,(err:Error,user:Profile)=> done(null, user)
    );
    done(null, user);
}));
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
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }) }));
app.use(passport.session());
app.use(passport.initialize());
;
app.get("/", unauth, (req, res) => {
    res.render("index.ejs");
});
// app.get("/login", (req:Request,res:any)=>{
//     res.render("login.ejs")
// })
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
app.get('/auth/google/redirect', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/posts');
});
app.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next();
        }
        return res.redirect('/');
    });
});
app.get('/posts', pauth, (req, res) => {
    // res.redirect('/l');
    res.render("posts.ejs", { post });
});
app.post('/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.createdby = req.user.id;
    post = yield Post.create(req.body);
    res.send(post);
}));
const port = process.env.PORT || 4600;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    yield conect(process.env.MONGO_URI);
    app.listen(4600, () => console.log(`app listening on port ${port}`));
});
start();
