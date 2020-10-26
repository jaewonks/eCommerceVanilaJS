import jwt from "jsonwebtoken";
import config from "./config.js"

export const generateToken = (user) => {
  //토큰 생성
  return jwt.sign({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin
  },
  config.JWT_SECRET
  )
}