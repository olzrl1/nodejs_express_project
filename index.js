const express = require('express');
const mongoose = require('mongoose');
const { User } = require('./models/User');
const bodyParser = require('body-parser');
const config = require('./config/key');
const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

mongoose.connect(config.mongoURI)
.then(()=> console.log('MongoDB Connecting!'))
.catch(err => console.log(err));

app.get('/', (req, res) => res.send('TESTING!'));
app.post('/register',(req,res)=>{   
    //회원가입할 시 필요한 정보들을 client에서 가져와 그 정보들을 DB로 이동
    const user = new User(req.body);
    //user모델에 정보가 저장됨
    user.save()
    .then(()=>{
        res.status(200).json({success:true})
    })
    .catch((err)=>{
        //실패 시, 실패한 정보를 보내줌
        return res.json({success:false,err}) 
    })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`));