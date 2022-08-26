const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const IndexRoute = require('./Routers/index');
const customErrorHandler = require('./Middlewares/Errors/customErrorHandler');
const connectDatabase = require('./Helpers/database/connectDatabase');

const PORT = process.env.PORT || 5000;

dotenv.config({
  path: '.env'
});

connectDatabase();
const app = express();

app.use(express.json());
app.use(cors());
app.use('/', IndexRoute);
app.use(customErrorHandler);
app.use(express.static(path.join(__dirname, 'public') ));

const server = app.listen(PORT, () => {
  console.log(`Server running on port  ${PORT}`);
  console.log(`MONGO URI: ${process.env.NODE_ENV} ${process.env.MONGO_URI}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Logged Error : ${err}`);
  server.close(() => process.exit(1));
});