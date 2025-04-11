const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/organizations', require('./routes/organizations'));
app.use('/api/users', require('./routes/users'));

app.listen(5000, () => console.log('Server running on port 5000'));
