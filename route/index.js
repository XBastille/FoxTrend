const express = require('express');
const { ensureAuthentication } = require('../config/off');
const bcrypt = require('bcryptjs')
const router = express.Router();
const { spawn } = require('child_process');

const User = require('../models/Users');

router.get('/', (req, res) => {
    res.render("wel")
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
    const args = [numCompanies, val, start, end];
    const dashboard = await runpython(args)
    if (dashboard) {
        return res.json({ sucess: "true" })
    }
})

router.get('/dashboard', ensureAuthentication, (req, res) => {
    res.render("dashboard", {
        name: req.user.name,
        username: req.user.username,
    })

})

const runpython = (args) => {
    return new Promise((resolve, reject) => {
        let data1 = '';


        console.log("Arguments :" + args)

        const pyone = spawn('python', ['./main.py', ...args]);
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
    const dashboard = await runpython(args)
    if (dashboard) {
        return res.json({ sucess: "true" })
    }
})


router.post('/dashboard', (req, res) => {
    const numCompanies = 1;
    const { val } = req.body
    const { start } = req.body
    const { end } = req.body
    console.log(val)
    console.log(start)
    console.log(end)
    const loadinganimation = { numCompanies, val, start, end }
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
    const dashboard = await runpython(args)
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
    const dashboard = await runpython(args)
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
    const dashboard = await runpython(args)
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



