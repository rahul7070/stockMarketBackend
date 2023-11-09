const mongoose = require("mongoose")

const dailyStockSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    company: String,
    price: Number,
});

const DailyStock = mongoose.model('DailyStock', dailyStockSchema);

module.exports = {DailyStock};