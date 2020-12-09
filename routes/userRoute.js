const express = require('express');
const userRoute = express.Router();
const passport=require('passport');
const bcrypt=require('bcryptjs');
const path=require('path');

let User = require('../database/schema/user');

//dang nhap co authentication
userRoute.route('/login').post(function (req, res,next) {
    passport.authenticate("local", (err, user, info) => {

        if (err) throw err;
        if (!user) res.send("Không có tài khoản này");
        else {
            req.logIn(user, (err) => {
                if (err) throw err;
                res.send(req.user);
                //console.log(req.user);
            });
        }
    })(req, res, next);
});


//dang ky
userRoute.route('/register').post((req, res) => {
    User.findOne({ username: req.body.username }, async (err, doc) => {
        if (err) throw err;
        if (doc) res.send("Tài khoản đã tồn tại");
        if (!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newUser = new User({
                username: req.body.username,
                password: hashedPassword,
                email:req.body.email,
                phone:req.body.phone,
                address:req.body.address
            });
            await newUser.save();
            //console.log(newUser);
            res.send(newUser);
        }
    });
});

//lay thong tin 1 nguoi dung
userRoute.route('/:userID').get( (req, res) => {
    let id=req.params.userID;
    User.findById(id, function (err, user){
        res.json(user);
    });

});

//cap nhat thong tin nguoi dung
userRoute.route('/:userID').post( (req, res) => {
    User.findById(req.params.userID,(err,user)=>{
        if(!user) res.send("User is not found");
        else {
            console.log(user);
            user.username=req.body.username;
            user.email=req.body.email;
            user.phone=req.body.phone;
            user.address=req.body.address;
            user.save().then(business=>{
                res.send("Update complete");
                console.log(user);
            }).catch(err=>{
                res.send("Unable to update database");
            })
        }
    })
});

//logout
userRoute.route('/:userID/logout').get( (req, res) => {
    req.logout();
    res.send(req.user);

});


module.exports = userRoute;