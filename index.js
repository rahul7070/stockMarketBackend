const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const {connection} = require("./configs/db");
const { DailyStock } = require('./models/dailyModel');
const { WeeklyStock } = require('./models/weeklyModel');
const { MonthlyStock } = require('./models/monthlyModel');
const { YearlyStock } = require('./models/yearlyModel');
const {
    calculateDailyAverage, 
    calculateYearlyAverage, 
    calculateMonthlyAverage, 
    getWeekNumber, calculateWeeklyAverage} = require("./controllers/stockController");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

connection();


// Socket.io for receiving stock data
io.on('connection', (socket) => {
    console.log('Socket connected');

    socket.on('stockData', (data) => {
        const dailyStock = new DailyStock(data);
        dailyStock.save();

        const weeklyAverage = calculateWeeklyAverage(data);
        const weeklyStock = new WeeklyStock({ week: getWeekNumber(), company: data.company, averagePrice: weeklyAverage });
        weeklyStock.save();

        const monthlyAverage = calculateMonthlyAverage(data);
        const monthlyStock = new MonthlyStock({ month: new Date().getMonth() + 1, company: data.company, averagePrice: monthlyAverage });
        monthlyStock.save();

        const yearlyAverage = calculateYearlyAverage(data);
        const yearlyStock = new YearlyStock({ year: new Date().getFullYear(), company: data.company, averagePrice: yearlyAverage });
        yearlyStock.save();
    });
});

// Data filtering and change tracking
app.use(express.json());

app.post('/compareDailyAverages', async (req, res) => {
    const todayAverage = await calculateDailyAverage(new Date());
    const yesterdayAverage = await calculateDailyAverage(new Date(new Date() - 86400000));

    const changeType = todayAverage > yesterdayAverage ? 'positive' : 'negative';
    const message = `Today's stock is ${changeType} different from yesterday.`;

    res.json({ message });
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
