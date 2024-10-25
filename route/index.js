const express = require('express');
const { ensureAuthentication } = require('../config/off');
const bcrypt = require('bcryptjs')
const router = express.Router();

const User = require('../models/Users');

router.get('/', (req, res) => {
    res.render("wel")
})

router.get('/dashboard', ensureAuthentication, (req, res) => {
    res.render("dashboard", {
        name: req.user.name
    })

})

router.get('/chartPage', ensureAuthentication, (req, res) => {
    res.render("chartPage", {
        name: req.user.name
    })

})

router.get('/historicdata', ensureAuthentication, (req, res) => {
    res.render("historicdata", {
        name: req.user.name
    })

})

router.get('/profilePage', ensureAuthentication, (req, res) => {
    res.render("profilePage", {
        name: req.user.name
    })

})

router.get('/statsPage', ensureAuthentication, (req, res) => {
    res.render("statsPage", {
        name: req.user.name
    })
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



router.get('/userprofile', ensureAuthentication, (req, res) => {
    res.render("userprofile")
})

router.post('/userprofile', async (req, res) => {
    const Password = req.body.password
    const email = req.body.email
    const { emails } = req.body
    const name = req.body.name
    const usernamess = req.body.username
    const { usernames } = req.body
    const confirm_password = req.body.confirm_password
    let c=0;
    let oldemail=""
    let sets = ""
    try {
        if(emails!==undefined){
            oldemail=emails
        }
        console.log(oldemail)
        const findemail = await User.findOne({ email: oldemail })
        if (findemail !== undefined) {
            sets = "true"
        }
        console.log(sets)
        if (sets === "true") {
            // console.log(username)
            if (usernamess !== undefined) {
                // console.log(username)
                const updateusername = await User.findOneAndUpdate({ email: oldemail }, { $set: { username: usernamess } })
                console.log(updateusername)
                if (updateusername) {
                    console.log("username updated sucessfully", updateusername)
                }
                else {
                    console.log('cannot update the username')
                }
            }
            else {
                console.log("username is undefined")
            }
        }
        else {
            console.log("email not found")
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;
