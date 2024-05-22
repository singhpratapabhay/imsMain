const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json({ extended: true, limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(cors());

// Connect to database
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Database connection error:', err));

// Import routes
const employer = require('./route/userRoute');
const supplier = require('./route/supplierRoute');
const userTime = require('./route/userActiveTimeRoute');
const category = require('./route/categoryRoutes');
const product = require('./route/productRoute');
const productDetails = require('./route/productDetailsRoute');
const customer = require('./route/customerRoute');
const invoice = require('./route/invoiceRoute');
const hsn = require('./route/hsnRoute');
const noOfUnit = require('./route/noOfRoute');
const tax = require('./route/taxRoutes');

// Use routes
app.use('/user', employer);
app.use('/supplier', supplier);
app.use('/product', product);
app.use('/userTime', userTime);
app.use('/client', customer);
app.use('/product_details', productDetails);
app.use('/category', category);
app.use('/invoice', invoice);
app.use('/hsn', hsn);
app.use('/noOfUnit', noOfUnit);
app.use('/tax', tax);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all route to handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
