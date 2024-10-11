const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")

const stripe = require("stripe")(process.env.stripe_secret_key)


const clientsRoutes = require('./api/routes/clients')
const usersRoutes = require('./api/routes/users')
const productsRoutes = require('./api/routes/products')
const packagesRoutes = require('./api/routes/packages')
const checkoutRoutes = require('./api/routes/checkout')




mongoose.connect('mongodb+srv://triobusiness0:76nFVAGbj7yrrarY@trio.am7gb.mongodb.net/')
mongoose.Promise = global.Promise



app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next( )
}) 



// Routes Requests

app.use('/clients', clientsRoutes)
app.use('/users', usersRoutes)
app.use('/products', productsRoutes)
app.use('/packages', packagesRoutes)
app.use('/checkout', checkoutRoutes)


app.use('/uploads', express.static('Uploads'))
app.use('/assets', express.static('View/assets'))



// Server Pages

const path = require('path');

app.use('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, './View/index.html'))
})

app.use((req, res, next) => {
    const error = new Error('Not fount')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app

// triobusiness0  76nFVAGbj7yrrarY
// sk_test_51Q8qAoJ2dBuX1qSz5ffpsybWwHV7T3UhDEJHmb6YMeOVjnSqdVOWaqGLz0iRAY5H6kqH386hdNqgt0aAnOEEoxXH00mCApkapX