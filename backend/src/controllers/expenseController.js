const Expense = require('../models/Expense');
const mongoose = require('mongoose');

exports.createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, type, date } = req.body;

    const expense = await Expense.create({
      ...req.body,
      amount: Number(amount),
      user: req.user.id,
    });

    res.status(201).json({ expense });
  } catch (error) {
    next(error);
  }
};

// GET /api/expenses
exports.getExpenses = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(
      1,
      Math.min(100, parseInt(req.query.limit) || 10)
    );

    const skip = (page - 1) * limit;

    const { search, category, type, sort } = req.query;

    const filter = {
      user: new mongoose.Types.ObjectId(req.user.id),
    };

    if (search) {
      filter.title = {
        $regex: search,
        $options: 'i',
      };
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (type && type !== 'All') {
      filter.type = type;
    }

    let query = Expense.find(filter);

    switch (sort) {
      case 'latest':
        query = query.sort({ date: -1 });
        break;

      case 'oldest':
        query = query.sort({ date: 1 });
        break;

      case 'highest':
        query = query.sort({ amount: -1 });
        break;

      case 'lowest':
        query = query.sort({ amount: 1 });
        break;

      default:
        query = query.sort({ createdAt: -1 });
    }

    const total = await Expense.countDocuments(filter);

    const expenses = await query
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    res.status(200).json({
      expenses,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }

    const expense = await Expense.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(req.params.id),
        user: new mongoose.Types.ObjectId(req.user.id),
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ expense });
  } catch (error) {
    next(error);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }

    const expense = await Expense.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(req.params.id),
      user: new mongoose.Types.ObjectId(req.user.id),
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getExpenseStats = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const totals = await Expense.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $group: {
          _id: '$type',
          total: {
            $sum: '$amount',
          },
        },
      },
    ]);

    const totalIncome =
      totals.find((t) => t._id === 'income')?.total || 0;

    const totalExpense =
      totals.find((t) => t._id === 'expense')?.total || 0;

    const balance = totalIncome - totalExpense;

    const categoryTotals = await Expense.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
        },
      },
      {
        $group: {
          _id: '$category',
          total: {
            $sum: '$amount',
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: 1,
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
    ]);

    const now = new Date();

    const yearAgo = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      1
    );

    const monthly = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: {
            $gte: yearAgo,
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: {
            $sum: '$amount',
          },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance,
      categoryTotals,
      monthly,
    });
  } catch (error) {
    next(error);
  }
};