const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


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
    token: {
        type: String 
    },
    // 토큰의 유효기간
    tokenExp: {
        type: Number
    }
})
userSchema.pre('save',function(next){
    var user = this;
    //비밀번호를 암호화
    //비밀번호 변경이 있을 경우만 암호화
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
    
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else{
        next()
    }
})
userSchema.methods.comparePassword = function(plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err, DoMatch){
        if(err) return cb(err);
        cb(null, DoMatch);
    })
}

userSchema.methods.generateToken = function(cb){

    var user = this;

    //jsonwebtoken을 이용해 토큰 생성
    var token = jwt.sign(user._id.toHexString(), 'userToken')
    
    // user.token = token;
    // user.save(function(err, user){
    //     if(err) return cb(err);
    //     cb(null, user)
    // })
    user.token = token
    user.save()
    .then(()=>{
        cb(null, user)
    })
    .catch((err)=>{
        cb(err)
    })

}

userSchema.statics.findByToken = function(token, cb){
    var user = this;
    //user._id + '' == token
    // 토큰을 decode
    jwt.verify(token, 'userToken', function (err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾고
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token })
        .then(()=>{
            cb(null, user)
        })
        .catch((err)=>{
            cb(err);
        })
    })

}

const User = mongoose.model('User', userSchema)
module.exports = { User }