const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');

const app = express();
connectDB();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/shelters', require('./routes/shelters'));
app.use('/api/users', require('./routes/users'));
app.use('/api/food-items', require('./routes/foodItems'));
app.use('/api/food-postings', require('./routes/foodPostings'));
app.use('/api/food-requests', require('./routes/foodRequests'));
app.use('/api/auth', require('./routes/auth'));

app.listen(5001, () => console.log('Server running on port 5001'));
