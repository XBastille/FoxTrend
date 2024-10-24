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
    const {emails}=req.body
    const name=req.body.name
    const username=req.body.username
    const{usernames}=req.body
    const confirm_password=req.body.confirm_password
    console.log(email)
    console.log(emails) 
    return;
})

module.exports = router;