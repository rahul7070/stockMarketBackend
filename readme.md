Stock Market Backend:

This is a MongoDB, Express.js, Node.js stack backend for a stock market application. The backend includes APIs to store and process stock data in distinct daily, weekly, monthly, and yearly formats within the database. Socket.io is used to trigger data generation and transmission in real-time.

Install dependencies:

npm install

Configure MongoDB connection:


Routes and Processing Methods:

Socket.io Data Emission
Event: stockData
Description: Emits stock data to the server.

Payload:
date (Date): Date of the stock data.
company (String): Name of the company.
price (Number): Stock price.

API Routes
Route: /compareDailyAverages

Method: POST
Description: Compares today's stock average with yesterday's and provides a change message.

Request Body:
No specific payload required.

Response:
message (String): Positive or negative change message.
Route: /weeklyAverages/:company

Method: GET
Description: Retrieves weekly average stock data for a specific company.
Response:
Array of objects containing:
week (Number): Week number.
averagePrice (Number): Weekly average stock price.
Route: /monthlyAverages/:company

Method: GET
Description: Retrieves monthly average stock data for a specific company.
Response:
Array of objects containing:
month (Number): Month number.
averagePrice (Number): Monthly average stock price.
Route: /yearlyAverages/:company

Method: GET
Description: Retrieves yearly average stock data for a specific company.
Response:
Array of objects containing:
year (Number): Year.
averagePrice (Number): Yearly average stock price.


Running the Server
npm run server 

