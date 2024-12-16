// Required dependencies
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Allow requests from different origins
const upload = multer({ dest: 'pictures/' }); 

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'project2',
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

// JWT Secret
const JWT_SECRET = 'your_jwt_secret';

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
  } else {
    console.error('Server error:', err);
  }
});

// Register
app.post('/register', async (req, res) => {
  const { firstname, lastname, address, creditcard, phonenumber, email, password, role } = req.body;
  if (!firstname || !lastname || !address || !creditcard || !phonenumber || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO Clients (firstname, lastname, address, creditcard, phonenumber, email, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [firstname, lastname, address, creditcard, phonenumber, email, hashedPassword, role || 'client'];
    db.query(query, values, (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email is already registered.' });
        }
        return res.status(500).json({ message: 'Failed to register user.' });
      }
      res.status(201).json({ message: 'User registered successfully.' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM Clients WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    const client = results[0];
    const passwordMatch = await bcrypt.compare(password, client.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ clientid: client.clientid, role: client.role }, JWT_SECRET, { expiresIn: '3h' });
    res.json({ token });
  });
});

// Middleware for JWT Authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access denied.' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });
    req.client = decoded;
    next();
  });
};


// Endpoint to submit a new quote
app.post('/submit-quote', authenticateToken, upload.single('picture'), (req, res) => {
  console.log('Received body:', req.body);
  console.log('Received file:', req.file);
  const { address, drivewaysize, price, note } = req.body;
  const clientid = req.client.clientid; // Extract client ID from JWT token

  if (!address || !drivewaysize || !price) {
    console.warn('Missing fields:', { address, drivewaysize, price });
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const picturePath = req.file ? req.file.path : null;

  const query = `
    INSERT INTO Quotes (clientid, address, drivewaysize, price, note, status)
    VALUES (?, ?, ?, ?, ?, ?, 'pending')
  `;
  const values = [clientid, address, drivewaysize, price, note];

  db.query(query, values, (err) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ message: 'Failed to submit quote.' });
    }
    res.status(201).json({ message: 'Quote submitted successfully.' });
  });
});
