const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(morgan('dev'));
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [process.env.CLIENT_URL, 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'].filter(Boolean);
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy error'));
      }
    },
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Expense Tracker API is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

app.use(errorMiddleware);

module.exports = app;
