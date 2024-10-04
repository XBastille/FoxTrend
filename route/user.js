const express = require('express')
const bcrypt = require('bcryptjs')
const { spawn } = require('child_process');
const passport = require('passport')
const { promises } = require('dns');
const { resolve } = require('path');
const router = express.Router();

router.get('/login', (req, res) => {
  res.render("login")
})

router.get('/register', (req, res) => {
  res.render("register")
})

router.get('/forgot', (req, res) => {
  res.render("forgot")
})


const User = require('../models/Users');
require('../config/passport')(passport)

const runjava = (className, args) => {
  return new Promise((resolve, reject) => {
    const javaprocess = spawn("java", ["-cp", "C:/Program Files (x86)/MySQL/Connector J 8.0/mysql-connector-java-8.0.25.jar;jdbc/bin", className, ...args]);
    let data1 = "";
    javaprocess.stdout.on('data', (data) => {
      data1 += data.toString();
    })
    javaprocess.on('close', (code) => {
      if (code !== 0) {
        reject(`code rejects with ${code}`)
      }
      else {
        resolve(data1.trim());
      }
    })
  })
}


let c = 0;
router.post('/register', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const formdata = req.body
  const counts = req.body.img
  console.log(counts)
  const args1 = [formdata.username];
  const args2 = [formdata.email];
  let args3 = [];
  const args4 = [formdata.name, formdata.username, formdata.email, args3]
  try {
    if (counts === 0) {
      const result1 = await runjava("Auth", args1)
      if ((result1.trim().toLowerCase()) === ("Username exists").trim().toLowerCase()) {
        return res.json({ sucess: 'false', message: 'Username exists' })
      }
      if ((result1.trim().toLowerCase()) === ("Username does not exist").trim().toLowerCase()) {
        return res.json({ sucess: "true", message: 'Username added' })
      }
    }
    if (counts === 1) {
      if (formdata.email !== '') {
        const result2 = await runjava('email', args2);
        if ((result2.trim().toLowerCase()) === ("Email exists").trim().toLowerCase()) {
          return res.json({ sucess: 'false', message: 'Email exists' })
        }
        if ((result2.trim().toLowerCase()) === ("Email does not exists").trim().toLowerCase()) {
          c++;
          return res.json({ sucess: "true", message: 'Email added' })
        }
      }
    }
    if (counts === 2) {
      const salt = await bcrypt.genSalt(10);
      const hashpass = await bcrypt.hash(formdata.password, salt);
      args3 = hashpass
      return res.json({ sucess: 'true', message: 'Password added' })
    }
    if (counts === 3) {
      const existuser = await User.findOne({ email: email })
      if (!existuser) {
        const newUser = new User({
          name,
          email,
          password
        })
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newUser.password, salt);
        newUser.password = hash;

        await newUser.save();
        console.log("User saved in MongoDB");
      }
      const result3 = await runjava('finalinput', args4)
      console.log(result3)
      console.log("redirection is not working")
      return res.redirect("/user/login")
    }

  } catch (error) {
    console.log(error)
  }
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: "/dashboard",
    failureRedirect: "/user/login",
  })(req, res, next)
})

router.get('/logout', (req, res) => {
  req.logout(req.user, err => {
    if (err) {
      console.log(err)
    }
  })
  res.redirect('/user/login')
})


module.exports = router;