const asyncErrorWrapper = require('express-async-handler');
const User = require('../Models/user');
const CustomError = require('../Helpers/error/CustomError');
const { sendToken } = require('../Helpers/auth/tokenHelpers');
const { validateUserInput, comparePassword } = require('../Helpers/input/inputHelpers');

const login  = asyncErrorWrapper (async(req, res, next) => {

  const {email, password} = req.body; 

  if(!validateUserInput(email, password)) {
    return next(new CustomError('Please check your inputs', 400));
  }

  const user = await User.findOne({email}).select('+password');

  if(!user) {    
    return next(new CustomError('Invalid credentials', 404));
  }

  if(!comparePassword(password, user.password)) {
    return next(new CustomError('Please chech your credentails', 404));
  }

  sendToken(user, 200, res);
    
});

const resetpassword  = asyncErrorWrapper(  async(req, res, next) => {

  const newPassword = req.body.newPassword || req.body.password;
  const {resetPasswordToken} = req.query;

  if(!resetPasswordToken) {
    return next(new CustomError('Please provide a valid token ', 400));
  }

  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });
    
  if(!user) {
    return next(new CustomError('Invalid token or Session Expired', 400));
  }

  user.password = newPassword; 
  user.resetPasswordToken = undefined; 
  user.resetPasswordExpire = undefined;

  await user.save(); 

  return res.status(200).json({
    success: true,
    message: 'Reset Password access successfull'
  });

});

const getPrivateData = asyncErrorWrapper((req, res, next) => {

  return res.status(200).json({
    success: true,
    message: 'You got access to the private data in this route ',
    user: req.user

  });

});

const register = asyncErrorWrapper (async(req, res, next) => {

  const { username, email, password} = req.body;
    
  const newUser = await User.create({
    username,
    email,
    password
  });
    
  sendToken(newUser, 201, res);
  
});

module.exports = {
  register,
  login,
  resetpassword,
  getPrivateData
};