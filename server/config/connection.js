require('dotenv').config();
const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;
console.log (uri);
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = mongoose.connection;
