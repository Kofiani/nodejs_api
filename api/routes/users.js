const express = require('express');
const router = express.Router();
const { Types } = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Users = require('../models/user');
const { token } = require('morgan');
const secret = "something hidden"

router.post('/signup', (req, res, next) => {
    const { password, email } = req.body;
    Users.find({ email : email })
    .exec()
    .then( user => {
        if (user.length >= 1){
            return res.status(409).json({
                message : 'Account already exits'
            })
        } else {
            bcrypt.hash(password, 10)
            .then(hash => {
                    users = new Users({
                        _id : Types.ObjectId(),
                        email : email,
                        password : hash
                    })
                   return users.save()    
            })
            .then(() => {
                res.status(200).json({message : "User Created"})
            })
            .catch(error => res.status(500).json({error : error.message }))   
        }
    }).catch(error => res.status(500).json({error : error }))  
   
})

router.post('/login', (req, res, next) => {
    const {password, email } = req.body;
    Users.findOne({ email : email })
    .exec()
    .then(user => {
        if (!user) {
            return res.status(401).json({
                err : "login failed"
            })
        } else {
            bcrypt.compare(password, user.password)
            .then(result => {
                if (result) {
                    const token = jwt.sign({email : user.email, user: user._id }, secret, {expiresIn : '1h'})
                    res.status(200).json({
                        success : 'login successful',
                        token : token
                    })
                } else {
                    throw new Error('login failed')
                }
            })
            .catch((err) => {
                res.status(401).json({ err : err.message })
            })
        }
    })
    .catch(err => {
        console.log()
        res.status(500).json({
            error : "not sure why"
        })
    })
})

module.exports = router;