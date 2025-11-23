
const express = require('express');
const cors=require('cors')
const colors=require('colors')
const morgan=require('morgan')
const dotenv=require('dotenv')
const path = require("path");
// const TestRoute=require('./routes/TestRoute')
const db=require('./config/db')
// const authRoute=require('./routes/AuthRoute')
const UserRoute=require('./routes/UserRoute')
const FoodRoute=require('./routes/FoodRoute')
const OrderRoute=require('./routes/OrderRoutes')
const CartRoute=require("./routes/CartRoute")



dotenv.config()
db()

//port 
const PORT = process.env.PORT || 5000 ;



//rest object
const app=express()


//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


//route
// app.use('/api/auth',authRoute)
// app.use('/food',TestRoute)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/app',UserRoute)
app.use('/food',FoodRoute)
app.use('/order',OrderRoute)
app.use("/cart",CartRoute)

app.get('/', (req, res) => {
    return res.status(200).send('<h1>Welcome to the server creating food app</h1>');
});


//listen
app.listen(PORT, () => {
    console.log(`Server started and running at http://localhost:${PORT}`.white.bgMagenta);
});


