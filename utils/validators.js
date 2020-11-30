const { body } = require('express-validator');
const User = require('../models/user');
exports.registerValidators = [
  body('email')
    .isEmail()
    .withMessage('Enter correct Email')
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject('Email already exists');
        }
      } catch (e) {
        console.log(e);
      }
    }),
  body('password', 'Password must have min length of 6 symbols')
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body('confirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords are not matching');
      }
      return true;
    })
    .trim(),
  body('name')
    .isLength({ min: 3 })
    .withMessage('Name must have min length of 3 symbols')
    .trim(),
];

exports.loginValidators = [
  body('email')
    .isEmail()
    .withMessage('Enter correct Email')
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (!user) {
          return Promise.reject('Email or password is wrong');
        }
      } catch (e) {
        console.log(e);
      }
    })
];

exports.courseValidators = [
  body('title')
    .isLength({ min: 3 })
    .withMessage('Title shoudl contains at least 3 symbols')
    .trim(),
  body('price').isNumeric().withMessage('Price shoudl be a number'),
  body('img', 'Enter correct ULR').isURL(),
];
