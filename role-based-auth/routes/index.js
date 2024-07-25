// routes/index.js
const express = require('express');
const { verifyToken, authorizeRole } = require('../middleware');

const router = express.Router();

router.post('/register', async (req, res) => {
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

router.post('/login', async (req, res) => {
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

router.get('/admin', verifyToken, authorizeRole(['admin']), (req, res) => {
  res.send('Welcome Admin');
});

router.get('/user', verifyToken, authorizeRole(['user', 'admin']), (req, res) => {
  res.send('Welcome User');
});

module.exports = router;
