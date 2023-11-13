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

    socket.on('stockData', async (data) => {
        const dailyStock = new DailyStock(data);
        await dailyStock.save();

        const allDailyStock = await DailyStock.find({company:data.company});
        const weeklyAverage = calculateWeeklyAverage(allDailyStock);
        const weeklyStock = new WeeklyStock({ week: getWeekNumber(), company: data.company, averagePrice: weeklyAverage });
        await weeklyStock.save();

        const monthlyAverage = calculateMonthlyAverage(allDailyStock);
        const monthlyStock = new MonthlyStock({ month: new Date().getMonth() + 1, company: data.company, averagePrice: monthlyAverage });
        await monthlyStock.save();

        const yearlyAverage = calculateYearlyAverage(monthlyAverage);
        const yearlyStock = new YearlyStock({ year: new Date().getFullYear(), company: data.company, averagePrice: yearlyAverage });
        await yearlyStock.save();

        const updatedData = {
            daily: allDailyStock,
            weekly: weeklyStock,
            monthly: monthlyStock,
            yearly: yearlyStock
        };

        socket.emit("updatedData", updatedData)

    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });
});

// Data filtering and change tracking
app.use(express.json());


// to add a stock data in dailystock 
app.post("/add", async(req, res)=>{
    try {
        let {company, price} = req.body;
        let payload = new DailyStock({company, price})
        await payload.save()
        res.send(payload)
    } catch (error) {
        console.log(error)
    }
})

app.post('/compareDailyAverages', async (req, res) => {
    const company = req.body.company;
    const todayAverage = await calculateDailyAverage({date:new Date(), company});
    const yesterdayAverage = await calculateDailyAverage({date:new Date(new Date() - 86400000), company});
    const changeType = todayAverage > yesterdayAverage ? 'positive' : 'negative';
    const message = `Today's stock is ${changeType} different from yesterday.`;

    res.json({ message });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
