const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const requireAuth = async (req, res, next) => {
    const {authorization} = req.headers

    if (!authorization) {
        return res.status(401).json({error: 'Authorization token required'});

    };

    const token = authorization.split(' ')[1];

    try {
       const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const {_id} = decodedToken;

        req.user = await User.findOne({_id}).select('_id');
        console.log('User ID added to request:', req.user._id);
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({error: 'Request is not Authorized'});
    }
};

module.exports = requireAuth ;
