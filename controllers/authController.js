const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id =>{
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}
// signup and then legged user in directly
exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  const token =signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

//login user
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body; // destructuring the object and get the email and password ES6
  // 1) check email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide Email & password', 400));
  }
  // 2) check if the user exist and password correct
  const user = await User.findOne({ email }).select('+password');
  //const correct = await user.correctPassword(password , user.password)
  // above commented line may be prevented app from working in case user not found , we need to move forward and put that line straight forward in the condition below
  if (!user || !(await user.correctPassword(password, user.password))) { // this way if user not found app going to continue working normally and send the Error
    return next(new AppError('user not found (Incorrect Email or password)', 401));
  }
  //3) send JWT to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});