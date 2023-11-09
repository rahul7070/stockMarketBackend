const mongoose = require("mongoose")


const monthlyStockSchema = new mongoose.Schema({
    month: Number,
    company: String,
    averagePrice: Number,
});

const MonthlyStock = mongoose.model('MonthlyStock', monthlyStockSchema);

module.exports = {MonthlyStock};

