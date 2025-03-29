const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');
const router = express.Router();


//http://localhost:5000/auth/signup
router.post('/signup',async(req,res)=>{
    try {
        const uname = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const existingUser = await authModel.findOne({email});

        if (existingUser) {
            return res.status(400).json({message: 'User already exists'});
        } else {
            const hashPassword = await bcrypt.hash(password,10);
            const newUser = new authModel({uname,email,password: hashPassword});
            await newUser.save();
        }
        
    } catch (error) {
        console.error(error);
        
    }
})

//http://localhost:5000/auth/login
router.post('/login', async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await authModel.findOne({email});

        if (!user) {
            return res.status(400).json({message: 'User not exist'});
        }
        else{
            const userFound = await bcrypt.compare(password,user.password)
            if (!userFound) {
                return res.status(400).json({message: 'Invalid password'});
            } else {
                const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN_SECRET, { expiresIn: '1h' });
                res.status(200).json({ message: 'Login success', token, userId: user._id });

            }
        }
    } catch (error) {
        console.error(error);   
    }
})

// http://localhost:3000/auth/resetpassword
router.post('/resetpassword',async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await authModel.findOne({email});

        if(!user){
            return res.json({message:'User not found'})
        }
        else{
            const hashPassword = await bcrypt.hash(password,10)
            user.password = hashPassword;
            await user.save();
            console.log('Pass updated')
        }

    } catch (error) {
        console.error(error);
        
    }
})


//http://localhost:3000/auth/fetchuser
router.post('/fetchuser',async(req,res)=>{
    const _id = req.body._id
    console.log(_id)

    try {
        // const users = await authModel.findById(_id)
        const users = await authModel.find()
        if(!users){
            console.log('User not found')
        }
        else{
            res.json(users)
        }
    } catch (error) {
        console.error(error);
        
    }
})

//http://localhost:3000/auth/updateuser/:id
router.put('/updateuser/:id',async(req,res)=>{
    const _id = req.body._id

    console.log(_id)
    
    try {
        const updatedUser = await authModel.findByIdAndUpdate(_id,{$set: req.body}, {new:true})
        res.json(updatedUser);

    } catch (error) {
        console.error(error);
    }
})



//http://localhost:3000/auth/deleteuser
router.delete('/deleteuser',async(req,res)=>{
    const email = req.body.email
    console.log(email)
    try {
        const users = await authModel.findOneAndDelete({email})
        console.log(users)
        if (!users) {
            console.log('Email not found')
            res.json({message:'Email not found'})
        } else {
            res.json(users)
        }
    } catch (error) {
        console.error(error)
    }
})

module.exports = router;