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
            return res.status(400).json({message: 'User does not exist'});
        }
        else{
            const userFound = await bcrypt.compare(password,user.password)
            if (!userFound) {
                return res.status(400).json({message: 'Invalid password'});
            } else {
                const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN_SECRET, { expiresIn: '1h' });
                res.status(200).json({ message: 'Login successful', token, userId: user._id });

            }
        }
        
    } catch (error) {
        console.error(error);
        
    }

})

module.exports = router;