const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
// signup and then legged user in directly
exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  const token = signToken(newUser._id);
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

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to delete this', 403));
    }
    next();
  };
};

// create forget password reset
exports.forgotPassword = catchAsync( async (req , res , next) =>{
  // get user based on post email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next (new AppError ('Please Provide email address' , 404));
    }
  // generate random web token and send it as an Email
  const resetToken = User.createPasswordResetToken();
  await user.save();
});
exports.resetPassword = (req , res , next) =>{

}