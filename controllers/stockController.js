const { DailyStock } = require("../models/dailyModel");


// Calculate weekly average from daily data
function calculateWeeklyAverage(data) {
    // Assuming data is an array of daily stock entries for the same company
    const weeklyData = [];
    let currentWeek = -1;
    let weekTotal = 0;
    let weekCount = 0;

    data.forEach((dailyEntry) => {
        const entryWeek = getWeekNumber(new Date(dailyEntry.date));

        if (currentWeek === -1) {
            currentWeek = entryWeek;
        }

        if (entryWeek === currentWeek) {
            weekTotal += dailyEntry.price;
            weekCount++;
        } else {
            const weeklyAverage = weekTotal / weekCount;
            weeklyData.push({ week: currentWeek, averagePrice: weeklyAverage });

            // Reset counters for the new week
            currentWeek = entryWeek;
            weekTotal = dailyEntry.price;
            weekCount = 1;
        }
    });

    // Add the last week's average
    const lastWeeklyAverage = weekTotal / weekCount;
    weeklyData.push({ week: currentWeek, averagePrice: lastWeeklyAverage });

    return weeklyData;
}

// Get the current week number
function getWeekNumber(date) {
    const currentDate = date || new Date();
    const currentYear = currentDate.getFullYear();
    const januaryFirst = new Date(currentYear, 0, 1);
    const days = Math.floor((currentDate - januaryFirst) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + januaryFirst.getDay() + 1) / 7);

    return weekNumber;
}

// Calculate monthly average from daily data
function calculateMonthlyAverage(data) {
    // Assuming data is an array of daily stock entries for the same company
    const monthlyData = [];
    let currentMonth = -1;
    let monthTotal = 0;
    let monthCount = 0;

    data.forEach((dailyEntry) => {
        const entryMonth = new Date(dailyEntry.date).getMonth() + 1; // Months are zero-based

        if (currentMonth === -1) {
            currentMonth = entryMonth;
        }

        if (entryMonth === currentMonth) {
            monthTotal += dailyEntry.price;
            monthCount++;
        } else {
            const monthlyAverage = monthTotal / monthCount;
            monthlyData.push({ month: currentMonth, averagePrice: monthlyAverage });

            // Reset counters for the new month
            currentMonth = entryMonth;
            monthTotal = dailyEntry.price;
            monthCount = 1;
        }
    });

    // Add the last month's average
    const lastMonthlyAverage = monthTotal / monthCount;
    monthlyData.push({ month: currentMonth, averagePrice: lastMonthlyAverage });

    return monthlyData;
}

// Calculate yearly average from monthly data
function calculateYearlyAverage(data) {
    // Assuming data is an array of monthly stock entries for the same company
    const yearlyData = [];
    let currentYear = -1;
    let yearTotal = 0;
    let yearCount = 0;

    data.forEach((monthlyEntry) => {
        const entryYear = new Date(monthlyEntry.month + '/1/' + new Date().getFullYear()).getFullYear();

        if (currentYear === -1) {
            currentYear = entryYear;
        }

        if (entryYear === currentYear) {
            yearTotal += monthlyEntry.averagePrice;
            yearCount++;
        } else {
            const yearlyAverage = yearTotal / yearCount;
            yearlyData.push({ year: currentYear, averagePrice: yearlyAverage });

            // Reset counters for the new year
            currentYear = entryYear;
            yearTotal = monthlyEntry.averagePrice;
            yearCount = 1;
        }
    });

    // Add the last year's average
    const lastYearlyAverage = yearTotal / yearCount;
    yearlyData.push({ year: currentYear, averagePrice: lastYearlyAverage });

    return yearlyData;
}


async function calculateDailyAverage({date, company}) {
    const dailyStocks = await DailyStock.find({company, date: { $gte: date.setHours(0, 0, 0, 0), $lt: date.setHours(23, 59, 59, 999) } });
    const total = dailyStocks.reduce((acc, stock) => acc + stock.price, 0);
    // console.log(total/dailyStocks.length)
    return total / dailyStocks.length;
}


module.exports = {calculateDailyAverage, calculateYearlyAverage, calculateMonthlyAverage, getWeekNumber, calculateWeeklyAverage}