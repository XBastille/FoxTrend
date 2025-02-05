const exp = require('constants');
const express = require('express')
const path = require('path')
const passport = require('passport')
const session = require('express-session');
const cron = require('node-cron')
const { default: mongoose } = require('mongoose');
const { spawn } = require('child_process');
const csv = require('csv-parser')
const fs = require('fs')
const date = new Date();

const app = express()
const port = 3000;

const db = require('./config/key').MongoURI
const { CompanyStore, CompanyDetails } = require('./models/Users');


mongoose.connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log("Mongodb connected")
    })
    .catch(err => console.log(err))

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: false,
    cookie: { secure: process.env.ENV === 'PRODUCTION' } // production mai jab daalenge tab comment out kar denge
}));

app.use(passport.initialize());
app.use(passport.session());

//template engine
app.set('view engine', 'hbs');

app.use("/public", express.static(path.join(__dirname, 'public')));

app.set("/views", (path.join(__dirname, 'views')));

app.use(express.json());

// middleware
app.use(express.urlencoded({ extended: false }))



app.use('/', require('./route/index'))
app.use('/user', require('./route/user'))

//reading the all_ticker.csv using read file module------------------------------
fs.readFile('./public/textfile/all_ticker.txt', "utf8", async (err, data) => {
    if (err) {
        console.log(err);
    }
    try {
        const lines = data.split("\n").map(line => ({ company: line.trim() }));
        CompanyStore.insertMany(lines)
            .then(() => {
                console.log("data is sucessfully inserted")
            })
            .catch(err => {
                console.log(err);
            })
    } catch (error) {
        console.log(error);
    }
})

//storing the data in mongodb data of all_stock_data.csv------------------
const results = [];
fs.createReadStream('all_stock_data.csv')
    .pipe(csv())
    .on('data', (data) => {
        results.push({
            Ticker: data.Ticker,
            Price: data.Price,
            Change: data.Change,
            ChangePercentage: data['Change %'],
            Volume: data.Volume,
            MarketCap: data["Market Cap"],
            YearChange: data["52W Change"],
            beta: data.Beta

        })
    })
    .on("end", async () => {
        console.log("csv parsing is complete and is ready to store to your database")
        await alldatastoring();
    })

async function alldatastoring() {
    try {
        await CompanyDetails.insertMany(results)
            .then(() => {
                console.log("data is sucessfully pushed")
            })
            .catch(err => {
                console.log(err);
            })
    } catch (error) {
        console.log(error);
    }
}
//-----------------------------------------------------------------------------------------------
//calling python to make all_stock_data.csv and sorting_data.json
let data1 = '';
function python_script(args) {
    const pyone = spawn('python', [args]);
    pyone.stdout.on('data', function (data) {
        data1 += data.toString();
        console.log(data1)
    });

    pyone.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        if (code === 0) {
            console.log("csv file of all the data is ready for the day;")
            task.stop();
        }
    });
}
var task;
function callingfunc() {
    task = cron.schedule('* * * * *', () => {  //calling python file using child-process
        console.log("ready to launch the rocket at" + new Date());
        const args = ["./python_files/try.py"]
        python_script(args);
    })
}

function sortingdata() {
    task = cron.schedule('* * * * *', () => { //callling python files using child-process
        const args = ["./python_files/sortingdata.py"]
        python_script(args);
    })
}

cron.schedule('30 10 * * * ', () => {  //calling callingfunc function for calling python files
    console.log('hola amigo')
    callingfunc();
})

cron.schedule('0 11 * * *', () => {   //calling sortingdata function for calling python files
    console.log("sortingdata is running")
    sortingdata();
})
//-------------------------------------------------------------------------------------------------

app.listen(port, () => {
    console.log("app is listening to the port 3000")
})
