"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Request, Response } = require("express");
const unauthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/posts");
    }
    return next();
};
module.exports = unauthenticated;
