import express from 'express';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import { generateToken, isAuth } from '../utils.js';

const router = express.Router();
//DB에 User collection을 생성하고 유저 정보를 넣는 코드
router.get('/createadmin', expressAsyncHandler( async (req, res) => {
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

router.post('/signup', expressAsyncHandler( async (req, res) => {
  const user = new User({
    name: req.body.name, 
    email: req.body.email, // get info from frontend side
    password: req.body.password
  }); 
  const createdUser = await user.save();
  if(!createdUser) {
    res.status(401).send({
      message: 'Invalid User Data',
    });
  } else { //if your signin user exists in collection in DB
    res.send({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      token: generateToken(createdUser),

    })
  } 
}));
//frontend에서 보낸 정보가 DB에 있는 지 확인 후 토큰을 생성하는 코드
router.post('/signin', expressAsyncHandler( async (req, res) => {
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
      token: generateToken(signinUser),

    })
  } 
}));

router.put('/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).send({
        message: 'User Not Found',
      });
    } else {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    }
  })
);

export default router;