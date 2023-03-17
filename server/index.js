const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');

const app = express();
const port = 5000;
const { auth } = require('./middleware/auth');
const { User } = require('./models/User');


app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(config.mongoURI)
.then(()=> console.log('MongoDB Connecting!'))
.catch(err => console.log(err));

app.get('/', (req, res) => res.send('TESTING!'));

app.get('/api/hello', (req, res)=>{
    res.send("안녕하세요")
})

// 회원가입
app.post('/api/users/register',(req,res)=>{   
    //회원가입할 시 필요한 정보들을 client에서 가져와 그 정보들을 DB로 이동
    const user = new User(req.body);
    //user모델에 정보가 저장됨
    user.save()
    .then(()=>{
        res.status(200).json({success:true})
        //console.log('req.user', user._id)
    })
    .catch((err)=>{
        //실패 시, 실패한 정보를 보내줌
        res.json({success:false,err}) 
    })
})


// findOne promise 사용
// 로그인
app.post('/api/users/login',(req, res) =>{
    // 요청된 이메일을 데이터베이스 찾기
    
    User.findOne({email: req.body.email})
    .then(docs=>{
        if(!docs){
            return res.json({
                loginSuccess: false,
                messsage: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        docs.comparePassword(req.body.password, (err, doMatch) => {
            if(!doMatch) return res.json({loginSuccess: false, messsage: "비밀번호가 틀렸습니다."})
    // Password가 일치하다면 토큰 생성
            docs.generateToken((err, user)=>{
                if(err) return res.status(400).send(err);
                // 토큰을 저장
                res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess: true, userId: user._id})
                //console.log('req.user', user._id)
            })
        })
    })
    .catch((err)=>{
        return res.status(400).send(err);
    })
    
})

// 인증된 유저
app.get('/api/users/auth', auth, (req, res) => {
    //여기 까지 미들웨어를 통과해 왔다는 얘기는  Authentication 이 True 라는 말.
    res.status(200).json({
      _id: req.user._id,
      isAdmin: req.user.role === 0 ? false : true,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname,
      role: req.user.role,
      image: req.user.image
    })
  })

// 로그 아웃
// app.get('/api/users/logout', auth, (req, res)=>{
//     User.findOneAndUpdate({_id: req.user._id},
//         {token: "" })
//     .then(()=>{
//         return res.status(200).send({
//             success: true
//         })
//     })
//     .catch((err)=>{
//         return res.json({
//             success: false, 
//             err
//         })
//     })
// })
// app.get('/api/users/logout', auth, (req, res) => {
//     // console.log('req.user', req.user)
//     User.findOneAndUpdate({ _id: req.user._id} , {token: ""})
//        .then(()=> {
//         res.status(200).send({
//           success: true
//         })
//       })
//       .catch((err)=>{
//         res.json({ success: false, err });
//       })
// })
  
app.get('/api/users/logout', auth, (req, res) => {
    
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
       .then(() => {
        console.log(req.user._id);
        res.status(200).send({success: true})
      })
      .catch((err)=>{
        res.json({ success: false, err });
      })
    
})


  

app.listen(port, () => console.log(`Example app listening on port ${port}!`));