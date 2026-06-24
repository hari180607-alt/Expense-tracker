const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, updateMe } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validate,
  register
);

router.post(
  '/login',
  [body('email').isEmail().withMessage('Valid email is required'), body('password').notEmpty().withMessage('Password is required')],
  validate,
  login
);

router.get('/me', auth, getMe);

router.put(
  '/me',
  auth,
  [
    body('target').optional().isFloat({ min: 0 }).withMessage('Target must be a positive number'),
    body('preferences.theme').optional().isIn(['light', 'dark']).withMessage('Theme must be light or dark')
  ],
  validate,
  updateMe
);

module.exports = router;
