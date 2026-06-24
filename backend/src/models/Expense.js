const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Salary', 'Freelance', 'Other']
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['income', 'expense']
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
    },
    note: {
      type: String,
      trim: true,
      default: ''
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
