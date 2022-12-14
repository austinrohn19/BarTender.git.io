const User = require('../models/User');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
// const sendEmail = require('../utils/sendEmail');

const crypto = require('crypto');
const { send } = require('process');
const { restart } = require('nodemon');
// const cloudinary = require('cloudinary');

//register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  // const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //     folder: 'avatars',
  //     width: 150,
  //     crop: "scale"
  // })

  const {username, password, name, companyName, street, city, state, country, zipCode, fullName, email, number, barTypes, LED, Key, POS, POSBrand, vender, VenderIntergration, water, electric, wages, rent, FOH, BOH, taxes, Misc} = req.body;

  console.log(req.body);
  const user = await User.create({
    username,
    password,
    name,
    companyName,
    street,
    city,
    state,
    country,
    zipCode,
    fullName,
    email,
    number,
    barTypes,
    LED,
    Key,
    POS,
    POSBrand,
    vender,
    VenderIntergration,
    water,
    electric,
    wages,
    rent,
    FOH,
    BOH,
    taxes,
    Misc
    // avatar: {
    //     public_id: result.public_id,
    //     url: result.secure_url,
    // }
  });

  sendToken(user, 200, res);
});

// login user =>/api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  console.log(req.body);
  //checks if email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler('Please enter email and password.', 400));
  }

  //finding user in Database
  // we must use the .select method here because in the user model we have password set to select= false
  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    return next(new ErrorHandler('invalid Email, Please try again.', 401));
  }

  //check if password is correct or not.
  const isPasswordMatch = await user.checkPassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler('invalid Password, Please try again.', 401));
  }

  sendToken(user, 200, res);
});

//Forgot Password => /api/v1/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorHandler('user not found with this email address.', 404)
    );
  }

  //get reset Token

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //create reset password URL
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  //message int he email for the user to get.
  const message = `To reset your password, please press on the link that follow:\n\n${resetUrl}\n\nIf you have not requested this Email, then please ignore this email.`;

  try {
    //this is to send the email
    // await sendEmail({
    //     email: user.email,
    //     subject: 'Extreme Custom Karts Password Recovery',
    //     message
    // })

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset Password => /api/v1/Password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //Hash the URL token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler('Password reset token is invalid or has Expired', 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password doesnt Match', 400));
  }

  //setup the new Password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//get current logged in users details => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//update/change password for user => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  //finding the user by there is then also finding the password of that user.
  const user = await User.findById(req.user.id).select('+password');

  //check users previous password
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return next(
      new ErrorHandler('old Password is incorrect, Please try again!')
    );
  }

  //save the new password
  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

//update user profile Information => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  //getting the users olde data
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  //update avatar
  if (req.body.avatar !== '') {
    const user = await User.findById(req.user.id);

    const image_id = user.avatar.public_id;
    // const res = await cloudinary.v2.uploader.destroy(image_id);

    // const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //     folder: 'avatars',
    //     width: 150,
    //     crop: "scale"
    // })

    // newUserData.avatar = {
    //     public_id: result.public_id,
    //     url: result.secure_url
    // }
  }

  //updating the info of the user
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//logout user => /api/v1/logout

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    Success: true,
    message: 'You have Successfully Logged out, Please come again!',
  });
});

//Admin Routes

//Get all users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

//get user details => /api/v1/admin/user/:_id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User not found with id: ${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//update user profile Information => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  //getting the users old data
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  //updating the info of the user
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//delete user profile as Admin => /api/v1/admin/user/:_id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User not found with id: ${req.params.id}`));
  }

  //remove avatar from cloudiary - TODO

  await user.remove();

  res.status(200).json({
    success: true,
  });
});
