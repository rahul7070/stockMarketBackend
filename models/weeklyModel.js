
const mongoose = require("mongoose")


const weeklyStockSchema = new mongoose.Schema({
    week: Number,
    company: String,
    averagePrice: Number,
});


const WeeklyStock = mongoose.model('WeeklyStock', weeklyStockSchema);

module.exports = {WeeklyStock};
