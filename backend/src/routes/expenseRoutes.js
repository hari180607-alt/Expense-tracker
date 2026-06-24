const express = require('express');
const { body, param } = require('express-validator');
const {
  createExpense,
  getExpenses,
  getExpenseStats,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

const expenseValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('category')
    .isIn(['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Salary', 'Freelance', 'Other'])
    .withMessage('Invalid category'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('date').isISO8601().toDate().withMessage('Valid date is required')
];

router.use(auth);
router.get('/stats', getExpenseStats);
router.get('/', getExpenses);
router.post('/', expenseValidation, validate, createExpense);
router.put('/:id', [param('id').isMongoId(), ...expenseValidation], validate, updateExpense);
router.delete('/:id', [param('id').isMongoId()], validate, deleteExpense);

module.exports = router;
