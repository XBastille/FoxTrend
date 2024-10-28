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

router.get('/statsPage', ensureAuthentication, async (req, res) => {
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
                const updateusername = await User.findOneAndUpdate({ email: oldemail }, { $set: { username: usernamess } })
                if (updateusername) {
                    console.log("username updated sucessfully", updateusername)
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
            // if (Password !== undefined) {
            //     const salt = await bcrypt.genSalt(10);
            //     const hash = await bcrypt.hash(Password, salt);
            //     const updatepassword = await User.findOneAndUpdate({ email: oldemail }, { $set: { password: hash } })
            //     if (updatepassword) {
            //         console.log("password updated")
            //     }
            // }

            if (Password !== undefined && confirm_password !== undefined) {
                const salt = await bcrypt.genSalt(10);
                const hash1 = await bcrypt.hash(Password, salt);
                const hash2 = await bcrypt.hash(confirm_password, salt)
                if (hash1 === (hash2)) {
                    const updatepassword = await User.findOneAndUpdate({ email: oldemail }, { $set: { password: hash1 } })
                    if (updatepassword) {
                        res.redirect('/userprofile')
                    }
                }
                else {
                    
                }
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