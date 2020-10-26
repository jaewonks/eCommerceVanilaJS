import express from 'express';
import User from '../models/userModel.js';
import expressAysncHandler from 'express-async-handler';
import { generateToken } from '../utils.js';

const router = express.Router();
//DB에 User collection을 생성하고 유저 정보를 넣는 코드
router.get('/createadmin', expressAysncHandler( async (req, res) => {
  try {
    const user = new User({
      name: 'admin',
      email: 'admin@fairnsquare.uk',
      password: '12345',
      isAdmin: true,
    })
    const createdUser = await user.save();
    res.send(createdUser);
  } catch(err) {
    res.status(500).send({ message: err.message })
  }
}));
//frontend에서 보낸 정보가 DB에 있는 지 확인 후 토큰을 생성하는 코드
router.post('/signin', expressAysncHandler( async (req, res) => {
  const signinUser = await User.findOne({
    email: req.body.email, // get info from frontend side
    password: req.body.password
  }); 
  if(!signinUser) {
    res.status(401).send({
      message: 'Invaild Email or Password'
    });
  } else { //if your signin user exists in collection in DB
    res.send({
      _id: signinUser._id,
      name: signinUser.name,
      email: signinUser.email,
      isAdmin: signinUser.isAdmin,
      toekn: generateToken(signinUser),

    })
  } 
}));

export default router;