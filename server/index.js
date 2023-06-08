const cors = require('cors')
const express = require('express')
const promisePool = require('../PromisePool').pool; 
const { body, check, param, validationResult } = require('express-validator')

const PORT = 80
const app = express()
const corsOptions = { origin: ['http://localhost:3000'], optionsSuccessStatus: 200 }

// Middleware...
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Your endpoints here..
app.get('/message', cors(corsOptions), async (req, res) => { 
    // const result = await mySqlProxy.<YOUR FUNCTION HERE>
    // const id = req.params['id']                  // Read parameters from URL.
    // const personType = req.query['personType']   // Read query parameters from URL.
    // const body = req.body                        // Read request body.
    // res.send(<YOUR OBJECT HERE>)
    res.send({message: 'Hello World'})
})

// Ex2 Cars
app.get('/cars/:id', cors(corsOptions), async (req, res) => {
    const carId = req.params['id'];
    // const car = await mySqlProxy.selectCarById(carId);
    const result = await promisePool.query(`SELECT * FROM car WHERE car_id = ?`, [carId])
    // console.log(result)
    // const body = result[0]
    // res.send(body);
    const body = result[0]
    res.send(body);
});

// Ex3 Get Car For Make
app.get('/cars', cors(corsOptions), async (req, res) => {
    const carMake = req.query['make'];
    const [result] = await promisePool.query(`SELECT * FROM car WHERE make =?`, [carMake,]);
    const body = result
    res.send(body);
}); 


app.listen(PORT, () => {
    console.log(`Express web API running on port: ${PORT}.`)
})
