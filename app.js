const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

// import routes
const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const users = require('./api/routes/users')

//connect db

mongoose.connect('mongodb://127.0.0.1:27017/myDB')

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH')
        res.status(200).json({});
    }
    next(); 
// all middleware should have next as long as it is not ending in res or req or the next middleware will not execute.
// speed is everything, his code is faster than mine?
})

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json());


app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use(express.static('uploads'));
app.use('/users', users)

// Error Handling

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    res.json({
        err : error.message,
        staus : error.status
    })
    next(error);
})

// Handle all errors, the top plus plus from database

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error : {
            message : err.message
        }
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });