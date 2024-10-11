const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const User = require('../models/user')

router.get('/', (req, res, next) => {
    User.find()
        .select('_id fname lname email pass')
        .exec()
        .then(docs => {
            res.status(200).json(docs)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

router.post('/', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        pass: req.body.pass,
    })

    user.save()
        .then(docs => {
            res.status(201).json(docs)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
})

router.get('/getbyid/:userId', (req, res, next) => {
    const userId = req.params.userId

    User.find({_id: userId})
        .select("_id fname lname email pass")
        .exec()
        .then(docs => {
            res.status(200).json(docs)
        })
        .catch(err => {
            console.log(err),
            res.status(500).json({error: err})
        })
})

router.get('/getbyemail/:userEmail', (req, res, next) => {
    const userEmail = req.params.userEmail

    User.find({email: userEmail})
        .select("_id fname lname email pass profile")
        .exec()
        .then(docs => {
            res.status(200).json(docs)
        })
        .catch(err => {
            console.log(err),
            res.status(500).json({error: err})
        })
})

router.post('/login', (req, res, next) => {
    let email = req.body.email
    let pass = req.body.pass

    User.findOne({email: email, pass: pass})
        .select("_id fname lname email pass")
        .exec()
        .then(docs => {
            if(docs){
                res.status(200).json(docs)
            } else {
                res.status(500).json({error: docs})
            }
        })
        .catch(err => {
            console.log(err),
            res.status(500).json({error: err})
        })
})

router.patch('/:userId', (req, res, next) => {
    const userId = req.params.userId

    const UpdateUser = {
        email: req.body.email,
        pass: req.body.pass,
        fname: req.body.fname,
        lname: req.body.lname,
    }

    User.updateOne({_id: userId}, {$set: UpdateUser})
        .exec()
        .then(docs => {
            res.status(200).json(docs)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

router.delete('/:userId', (req, res, next) => {
    const userId = req.params.userId
   
    User.deleteOne({_id: userId})
        .exec()
        .then(result => {
            res.status(200).json(result)

            UserProfile.deleteMany({userId: userId})
                .exec()
                .then(result => {
                    res.status(200)
                })
                .catch(err => {
                    console.log("No Profile", err)
                    res.status(500).json({error: err})
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

router.delete('/', (req, res, next) => {
    User.deleteMany()
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router