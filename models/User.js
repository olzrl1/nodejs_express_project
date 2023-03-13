const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1 //중복방지
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    // 관리자 or 일반유저 분류
    role: {
        type: Number,
        default: 0
    },
    image: String,
    // 토큰을 이용해 유효성
    tokken: {
        type: String 
    },
    // 토큰의 유효기간
    tokkenExp: {
        type: Number
    }
})

const User = mongoose.model('User', userSchema)
module.exports = { User }