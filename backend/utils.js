import jwt from "jsonwebtoken";
import config from "./config.js"

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    config.JWT_SECRET
  );
};

export const isAuth = (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    res.status(401).send({ message: 'Token is not supplied' });
  } else { // 토큰이 있다면
    const token = bearerToken.slice(7, bearerToken.length); // 구성: bearer 12343424 토큰만 잘라온다
    jwt.verify(token, config.JWT_SECRET, (err, data) => {
      if(err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = data; // user fills with data (decoded token(user name, email, isAdmin etc.. ))
        next();
      }
    })
  }
}

export const isAdmin = (req, res, next) => {
  if(req.user && req.user.isAdmin) { //frontend에서 요청 받은 유저가 있고 그 유저가 어드민이면
    next();
  } else { // 유저가 없거나 어드민이 아닌 경우
    res.stauts(401).send({ message: 'Token is not vaild for admin user.' })
  }
}