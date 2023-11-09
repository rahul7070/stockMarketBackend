const mongoose = require("mongoose")


const yearlyStockSchema = new mongoose.Schema({
    year: Number,
    company: String,
    averagePrice: Number,
});

const YearlyStock = mongoose.model('YearlyStock', yearlyStockSchema);

module.exports = {YearlyStock};
