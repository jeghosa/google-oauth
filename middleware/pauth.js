"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Request, Response } = require("express");
const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/");
};
module.exports = authenticated;
