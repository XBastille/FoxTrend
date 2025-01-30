const express = require('express');
const { ensureAuthentication } = require('../config/off');
const bcrypt = require('bcryptjs')
const router = express.Router();
const { spawn } = require('child_process');

const { User, CompanyDetails } = require('../models/Users');

router.get('/', (req, res) => {
    res.render("wel")
})

router.get('/Advance', ensureAuthentication, (req, res) => {
    res.render("Advance")
})

router.get('/selectcar', ensureAuthentication, (req, res) => {
    res.render("selectcar")
})

router.get('/selecthouse', ensureAuthentication, (req, res) => {
    res.render("selecthouse")
})

router.get('/selectloan', ensureAuthentication, (req, res) => {
    res.render("selectloan")
})

router.get('/predict', ensureAuthentication, (req, res) => {
    res.render('predict_stock')
})

router.get('/social' , ensureAuthentication, (req, res) => {
    res.render('social')  
})

router.get('/journey' , ensureAuthentication, (req, res) => {
    res.render('journey')  
})

router.post('/predict', async (req, res) => {
    const { val } = req.body
    const { days } = req.body
    const { trails } = req.body
    const args = [val, days, trails]
    filesnaming = './prediction.py'
    const dashboard = await runpython(args, filesnaming)
    if (dashboard) {
        return res.json({ sucess: 'true' })
    }
})

//Rendering loan ---------
router.get('/loan/IN', ensureAuthentication, (req, res) => {
    res.render("loan/IN/loan_IN")
})

router.post('/loan/IN', async (req, res) => {
    const { annual_income } = req.body
    const { applicant_age } = req.body
    const { work_experience } = req.body
    const { years_in_current_work } = req.body
    const { marital_status } = req.body
    const { house_ownership } = req.body
    const { vehical_ownership } = req.body
    const args = [annual_income, applicant_age, work_experience, years_in_current_work, marital_status, house_ownership, vehical_ownership];
    filesnaming = './python_files/ML_Models/Loan_Approval_Prediction_Model/Model_India.py'
    const dashboard = await runpython(args, filesnaming);
    // Check if the Python script returned the expected result
    console.log(dashboard);
    if (dashboard) {
        return res.json({ sucess: 'true', value: dashboard });
    }
})


router.get('/loan/UN', ensureAuthentication, (req, res) => {
    res.render("loan/UN/loan_UN")
})

router.post('/loan/UN', async (req, res) => {
    const { age } = req.body
    const { experience } = req.body
    const { income } = req.body
    const { family } = req.body
    const { ccavg } = req.body
    const { education } = req.body
    const { mortgage } = req.body
    const { cd_account } = req.body
    const { credit_card } = req.body
    const args = [age, experience, income, family, ccavg, education, mortgage, cd_account, credit_card];
    filesnaming = './python_files/ML_Models/Loan_Approval_Prediction_Model/Model_Universal.py'
    const dashboard = await runpython(args, filesnaming);
    // Check if the Python script returned the expected result
    console.log(dashboard);
    if (dashboard) {
        return res.json({ sucess: 'true', value: dashboard });
    }
})

//Rendering house -------------
router.get('/house/CA', ensureAuthentication, (req, res) => {
    res.render("house/CA/house_CA")
})


router.get('/house/US', ensureAuthentication, (req, res) => {
    res.render("house/US/house_US")
})

router.post('/house/US', async (req, res) => {
    const { bedrooms } = req.body
    const { bathrooms } = req.body
    const { acre_lot } = req.body
    const { zipcode } = req.body
    const { house_size } = req.body
    const { city } = req.body
    const { state } = req.body
    const args = [bedrooms, bathrooms, acre_lot, zipcode, house_size, city, state];
    filesnaming = './python_files/ML_Models/Housing_price_model/Model_US.py'
    const dashboard = await runpython(args, filesnaming);
    // Check if the Python script returned the expected result
    console.log(dashboard);
    if (dashboard) {
        return res.json({ sucess: 'true', value: dashboard });
    }
})

router.post('/house/CA', async (req, res) => {
    const { bedrooms } = req.body
    const { bathrooms } = req.body
    const { population } = req.body
    const { province } = req.body
    const { city } = req.body
    const { median_income } = req.body
    const args = [city, bedrooms, bathrooms, province, population, median_income];
    filesnaming = './python_files/ML_Models/Housing_price_model/Model_CA.py'
    const dashboard = await runpython(args, filesnaming);
    // Check if the Python script returned the expected result
    console.log(dashboard);
    if (dashboard) {
        return res.json({ sucess: 'true', value: dashboard });
    }
})

//Rendering car -----------------------
router.get('/car/AUS', ensureAuthentication, (req, res) => {
    res.render("car/AUS/car_AUS")
})

router.get('/car/CA', ensureAuthentication, (req, res) => {
    res.render("car/CA/car_CA")
})

router.get('/car/IN', ensureAuthentication, (req, res) => {
    res.render("car/IN/car_IN")
})

router.get('/car/UK', ensureAuthentication, (req, res) => {
    res.render("car/UK/car_UK")
})

router.get('/car/US', ensureAuthentication, (req, res) => {
    res.render("car/US/car_US")
})

//post route of car
router.post('/car/US', async (req, res) => {
    const { manufacturer } = req.body
    const { condition } = req.body
    const { cylinders } = req.body
    const { fuel } = req.body
    const { transmission } = req.body
    const { drive } = req.body
    const { type } = req.body
    const { paint_color } = req.body
    const { year } = req.body
    const { odometer } = req.body;
    console.log(year, manufacturer, condition, cylinders, fuel, odometer, transmission, drive, type, paint_color)
    const args = [year, manufacturer, condition, cylinders, fuel, odometer, transmission, drive, type, paint_color];
    filesnaming = './python_files/ML_Models/Used_car_price_prediction/Model_US.py'
    const dashboard = await runpython(args, filesnaming);
    // Check if the Python script returned the expected result
    console.log(dashboard);
    if (dashboard) {
        return res.json({ sucess: 'true', value: dashboard });
    }
})

router.post('/car/CA', async (req, res) => {
    const { make } = req.body
    const { model } = req.body
    const { body_type } = req.body
    const { drivetrain } = req.body
    const { transmission } = req.body
    const { engine_size } = req.body
    const { miles } = req.body
    const { fuel_type } = req.body
    const { year } = req.body
    const args = [year, make, model, body_type, drivetrain, transmission, fuel_type, miles, engine_size];
    filesnaming = './python_files/ML_Models/Used_car_price_prediction/Model_CA.py'
    const dashboard = await runpython(args, filesnaming);
    // Check if the Python script returned the expected result
    console.log(dashboard);
    if (dashboard) {
        return res.json({ sucess: 'true', value: dashboard });
    }
})


router.post('/car/UK', async (req, res) => {
    const { brand } = req.body
    const { engine } = req.body
    const { gearbox } = req.body
    const { body_type } = req.body
    const { emission_class } = req.body
    const { registration_year } = req.body
    const { mileage } = req.body
    const args = [registration_year, brand, emission_class, gearbox, mileage, engine, body_type];
    filesnaming = './python_files/ML_Models/Used_car_price_prediction/Model_UK.py'
    const dashboard = await runpython(args, filesnaming);
    // Check if the Python script returned the expected result
    console.log(dashboard);
    if (dashboard) {
        return res.json({ sucess: 'true', value: dashboard });
    }
})

router.post('/car/IN', async (req, res) => {
    const { brand } = req.body
    const { year } = req.body
    const { location } = req.body
    const { kilometers } = req.body
    const { fuel_type } = req.body
    const { transmission } = req.body
    const { owner_type } = req.body
    const { mileage } = req.body
    const { engine } = req.body
    const { power } = req.body
    const { seats } = req.body
    const args = [brand, year, kilometers, mileage, engine, power, seats, location, fuel_type, transmission, owner_type];
    filesnaming = './python_files/ML_Models/Used_car_price_prediction/Model_India.py'
    const dashboard = await runpython(args, filesnaming);
    // Check if the Python script returned the expected result
    console.log(dashboard);
    if (dashboard) {
        return res.json({ sucess: 'true', value: dashboard });
    }
})

router.post('/car/AUS', async (req, res) => {
    const { brand } = req.body
    const { year } = req.body
    const { engine } = req.body
    const { fuel_consumption } = req.body
    const { kilometers } = req.body
    const { cylinders } = req.body
    const { doors } = req.body
    const { seats } = req.body
    const { transmission } = req.body
    const { drive_type } = req.body
    const { fuel_type } = req.body
    const { body_type } = req.body
    const args = [brand, year, engine, fuel_consumption, kilometers, cylinders, doors, seats, transmission, drive_type, fuel_type, body_type];
    filesnaming = './python_files/ML_Models/Used_car_price_prediction/Model_AUS.py'
    const dashboard = await runpython(args, filesnaming);
    // Check if the Python script returned the expected result
    console.log(dashboard);
    if (dashboard) {
        return res.json({ sucess: 'true', value: dashboard });
    }
})


let filesnaming;
router.post('/Advance', async (req, res) => {
    const numCompanies = 1;
    const { val } = req.body
    const { start } = req.body
    const { end } = req.body
    const { searchbar } = req.body
    const { calender } = req.body;
    console.log(val)
    console.log(start)
    console.log(end)
    if (searchbar === 'searchbar') {
        filesnaming = './python_files/main_3.py'
    }
    const summaryanimation = { numCompanies, val, start, end }
    if (calender === 'true') {
        filesnaming = './python_files/main_4.py'
    }
    const args = [numCompanies, val, start, end];
    const dashboard = await runpython(args, filesnaming)
    if (dashboard) {
        return res.json({ sucess: "true" })
    }
})

router.get('/summary', ensureAuthentication, (req, res) => {
    res.render("summary")
})

router.post('/summary', async (req, res) => {
    const numCompanies = 1;
    const { val } = req.body
    const { start } = req.body
    const { end } = req.body
    console.log(val)
    console.log(start)
    console.log(end)
    const summaryanimation = { numCompanies, val, start, end }
    const filenaming = './main.py'
    const args = [numCompanies, val, start, end];
    const dashboard = await runpython(args, filenaming)
    if (dashboard) {
        return res.json({ sucess: "true" })
    }
})

router.get('/dashboard', ensureAuthentication, async (req, res) => {

    // const { page = 0, limit = 8 } = req.query
    // try {
    //     const comp = await CompanyDetails.find()
    //         .skip(page * limit)
    //         .limit(limit)
    //     const total = await CompanyDetails.countDocuments();
    //     return res.json({
    //         data: comp,
    //         total,
    //         totalPages: Math.ceil(total / limit),
    //         currentpage: page
    //     })
    // } catch (error) {
    //     console.log(error)
    // }
    res.render("dashboard")
})

const runpython = (args, filename) => {
    return new Promise((resolve, reject) => {
        let data1 = '';


        console.log("Arguments :" + args)
        console.log(filename)
        const pyone = spawn('python', [filename, ...args]);
        pyone.stdout.on('data', function (data) {
            data1 += data.toString();
            console.log(data1)
            
        });

        pyone.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);
            if (code === 0) {
                resolve(data1.trim());

            }
            else {
                //flash message dalana h idhar ki ticker not correct type ka
                console.log("eror message")
                reject(`code rejects with ${code}`)
            }
        });
    })
}

router.get('/loading', ensureAuthentication, (req, res) => {
    res.render("loading")
})
router.post('/loading', async (req, res) => {
    const { numCompanies, val, start, end } = req.body;
    const args = [numCompanies, val, start, end];
    console.log(args)
    const filenaming = './main.py'
    const dashboard = await runpython(args, filenaming)
    if (dashboard) {
        return res.json({ sucess: "true" })
    }
})


router.post('/dashboard', async (req, res) => {
    const numCompanies = 1;
    const { val } = req.body
    const { start } = req.body
    const { end } = req.body
    const { graphsignal } = req.body
    console.log(val)
    console.log(start)
    console.log(end)
    const loadinganimation = { numCompanies, val, start, end }
    if (graphsignal === 'doit') {
        const args = [numCompanies, val, start, end]
        const filenaming = './python_files/main_2.py'
        const graph_animation = await runpython(args, filenaming)
        if (graph_animation) {
            return res.json({ sucess: 'true' })
        }
    }
    return res.json({ sucess: 'true', loadinganimation })
})

router.get('/chartPage', ensureAuthentication, (req, res) => {
    res.render("chartPage", {
        name: req.user.name
    })
})

router.post('/chartPage', async (req, res) => {
    const numCompanies = 1;
    const { val } = req.body
    const { start } = req.body
    const { end } = req.body
    console.log(val)
    console.log(start)
    console.log(end)
    const summaryanimation = { numCompanies, val, start, end }
    const args = [numCompanies, val, start, end];
    const filenaming = './main.py'
    const dashboard = await runpython(args, filenaming)
    if (dashboard) {
        return res.json({ sucess: "true" })
    }
    return res.json({ sucess: 'true', summaryanimation })
})


router.get('/historicdata', ensureAuthentication, (req, res) => {
    res.render("historicdata", {
        name: req.user.name
    })

})

router.post('/historicdata', async (req, res) => {
    const numCompanies = 1;
    const { val } = req.body
    const { start } = req.body
    const { end } = req.body
    console.log(val)
    console.log(start)
    console.log(end)
    const summaryanimation = { numCompanies, val, start, end }
    const args = [numCompanies, val, start, end];
    const filenaming = './main.py'
    const dashboard = await runpython(args, filenaming)
    if (dashboard) {
        return res.json({ sucess: "true" })
    }
    return res.json({ sucess: 'true', summaryanimation })
})


router.get('/profilePage', ensureAuthentication, (req, res) => {
    res.render("profilePage", {
        name: req.user.name
    })

})

router.get('/statsPage', ensureAuthentication, async (req, res) => {
    res.render("statsPage", {
        name: req.user.name
    })
})
router.post('/statsPage', async (req, res) => {
    const numCompanies = 1;
    const { val } = req.body
    const { start } = req.body
    const { end } = req.body
    console.log(val)
    console.log(start)
    console.log(end)
    const summaryanimation = { numCompanies, val, start, end }
    const args = [numCompanies, val, start, end];
    const filenaming = './main.py'
    const dashboard = await runpython(args, filenaming)
    if (dashboard) {
        return res.json({ sucess: "true" })
    }
    return res.json({ sucess: 'true', summaryanimation })
})

router.get('/watch', ensureAuthentication, (req, res) => {
    res.render("watch", {
        name: req.user.name
    })
})

router.get('/yourList', ensureAuthentication, (req, res) => {
    res.render("yourList", {
        name: req.user.name
    })
})


router.get('/userprofile', ensureAuthentication, async (req, res) => {
    res.render("userprofile", {
        name: req.user.name,
        username: req.user.username,
        email: req.user.email,
        password: req.user.password
    })
})
let oldemail = ""
router.post('/userprofile', async (req, res) => {
    const Password = req.body.password
    const email = req.body.email
    const { emails } = req.body
    const name = req.body.name
    const usernamess = req.body.username
    const { usernames } = req.body
    const confirm_password = req.body.confirm_password
    let c = 0;
    let sets = ""
    try {
        if (emails !== undefined) {
            oldemail = emails
        }
        console.log(oldemail)
        const findemail = await User.findOne({ email: oldemail })
        if (findemail !== undefined) {
            sets = "true"
        }
        console.log(sets)
        if (sets === "true") {
            if (usernamess !== undefined) {
                console.log(usernamess)
                const usernameexist = await User.findOne({ username: usernamess })
                console.log(usernameexist)

                if (!usernameexist) {
                    const updateusername = await User.findOneAndUpdate({ email: oldemail }, { $set: { username: usernamess } })
                    if (updateusername) {
                        console.log("username updated sucessfully", updateusername)
                        return res.redirect('/userprofile')
                    }
                }
                else {
                    console.log("username already exixts")
                    return res.json({ sucess: "false" })
                }
            }
        }
        if (sets === 'true') {
            if (email !== undefined) {
                const updatemail = await User.findOneAndUpdate({ email: oldemail }, { $set: { email: email } })
                if (updatemail) {
                    console.log("email updated")
                }
            }
        }

        if (sets === 'true') {
            if (name !== undefined) {
                const updatname = await User.findOneAndUpdate({ email: oldemail }, { $set: { name: name } })
                if (updatname) {
                    console.log("name updated")
                }
            }
        }

        if (sets === 'true') {
            if (Password !== undefined && confirm_password !== undefined) {
                const salt = await bcrypt.genSalt(10);
                const hash1 = await bcrypt.hash(Password, salt);
                const hash2 = await bcrypt.hash(confirm_password, salt)
                if (hash1 === (hash2)) {
                    const updatepassword = await User.findOneAndUpdate({ email: oldemail }, { $set: { password: hash1 } })
                    if (updatepassword) {
                        console.log("password updated")
                    }
                }
            }
        }
        else {
            console.log("email not found")
        }
        // return res.redirect('/userprofile')
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;



