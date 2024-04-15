const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const createToken = (_id) => {
     return jwt.sign({_id: _id}, process.env.JWT_SECRET, {expiresIn: '3d'});
}

const registerUser = async (req, res) => {
    const {username, email, password} = req.body;

    try {
       const user = await User.signup(email, username, password);

       const token = createToken(user._id);
       console.log(user._id);

        res.status(201).json({message: 'User registered successfully', username: user.username, token});
    } catch (error) {
        console.log('Error Signing up: ', error);
        res.status(500).json({error: error.message});
    }
};

const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);

        res.status(201).json({message: 'user loged in', username: user.username, token })
        
    } catch (error) {
        console.log('Error login in up: ', error);
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    registerUser,
    loginUser,
}