"use strict";
const mongoose = require("mongoose");
const connectdb = (url) => {
    mongoose.connect(url);
};
module.exports = connectdb;
