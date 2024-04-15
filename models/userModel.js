const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');


const Schema = mongoose.Schema;

const userSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }

});

userSchema.statics.signup = async function(email, username, password){
    if (!username || !email || !password ){
        throw Error ('Already fields are required');
    }

    if (!validator.isEmail(email)){
        throw Error ('Email is not valid');
    }

    if (!validator.isStrongPassword(password)){
        throw Error('Password not strong enough');
    }
    const checkEmail = await this.findOne({email});

    if (checkEmail) {
        throw Error ('Email already in use');
    }

    const checkUsername = await this.findOne({username});
    if (checkUsername) {
        throw Error ('Username already Taken');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await this.create({ username, email, password: hashedPassword });

    return newUser;
}

userSchema.statics.login = async function(email, password){
    if (!email || !password){
        throw Error ('Already fields are required');
    }

    const user = await this.findOne({email});

    if (!user){
        throw Error('Incorrect Email');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword){
        throw Error('Incorrect Password');
    }

    return user;
}

module.exports = mongoose.model('User', userSchema)
