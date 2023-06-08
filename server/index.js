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

//Ex4 Post Car

app.post('/cars', cors(corsOptions), async (req, res) => {

    //Destructuring req.body

    const { make, model, color, price } = req.body;

    //Query to insert car on table

    const insertCar = await promisePool.query(

        `INSERT INTO car (make, model, price, color) VALUES (?,?,?,?)`,

        [make, model, price, color]

    );

    //Getting the Id from the newly inserted item

    const carId = insertCar[0].insertId;




    // Query to return the newly inserted item

    const [carInserted] = await promisePool.query(

        `SELECT * FROM car WHERE car_id = ? `,

        [carId]

    );

    res.send(carInserted);

});

//Ex5 Put Car

app.put('/cars/', cors(corsOptions), async (req, res) =>{

    const {model, make, color, price, car_id} = req.body;

    const result = await promisePool.query("UPDATE car set model = ?, make = ?, color = ?, price = ? where car_id = ?",

    [model, make, color, price, car_id]);

    res.send(result[0])

})

//Ex6

app.delete('/cars/:id', cors(corsOptions), async(req, res) => {
    let car_id = req.params['id'];
    const [result] = await promisePool.execute(`DELETE FROM car WHERE car_id = ?`, [car_id]);
    res.send(result);

}
)

app.listen(PORT, () => {
    console.log(`Express web API running on port: ${PORT}.`)
})
