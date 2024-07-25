const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./db');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { verifyToken, authorizeRole } = require('./middleware');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Register Endpoint
app.post('/register', async (req, res) => {
    try {
      const { username, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword, role });
      await user.save();
      res.status(201).send('User registered');
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

// Login Endpoint
app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
  
      if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username: user.username, role: user.role }, 'secretKey', { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).send('Invalid credentials');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }

});

// Routes
const router = require('./routes');
app.use(router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});