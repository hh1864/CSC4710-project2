// Required dependencies
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware to parse JSON data and handle CORS (Cross-Origin Resource Sharing)
app.use(bodyParser.json());
app.use(cors());

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',  // Database host, usually 'localhost' in local development
  user: 'root',       // Default username in XAMPP
  password: '',       // Leave blank if no password is set in XAMPP
  database: 'jwt_auth_db',  // Database name
});

// Connect to the MySQL database
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Start the server and listen on port 5000
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

// User registration route
app.post('/register', async (req, res) => {
  const { firstname, lastname, address, creditcard, phonenumber, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password using bcrypt with 10 salt rounds

  // Insert the new user into the 'users' table
  db.query(
     'INSERT INTO Clients (firstname, lastname, address, creditcard, phonenumber, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
     [firstname, lastname, address, creditcard, phonenumber, email, hashedPassword],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'User registration failed', error: err });  // Send error response if registration fails
      }
      res.status(201).json({ message: 'User registered successfully' });  // Send success response
    }
  );
});

// User login route
app.post('/login', (req, res) => {
   const { email, password } = req.body;

   // Query the database for the client with the provided email
   db.query('SELECT * FROM Clients WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: 'User not found' });  // Send error response if user is not found
    }

    const client = results[0];  // Get the user record from the query result
    const passwordMatch = await bcrypt.compare(password, client.password);  // Compare the provided password with the hashed password

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });  // Send error response if the password does not match
    }

    // Generate a JWT token with the user ID and a secret key, valid for 3 hour
    const token = jwt.sign({ clientid: client.clientid }, 'your_jwt_secret', { expiresIn: '3h' });

    // Send the JWT token as the response
    res.json({ token });
  });
});

// Middleware function to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];  // Get the token from the 'Authorization' header

  if (!token) return res.status(401).json({ message: 'Access denied' });  // If no token is provided, deny access

  // Verify the JWT token
  jwt.verify(token, 'your_jwt_secret', (err, client) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });  // If the token is invalid, send a 403 error
    req.client = client;  // Store the decoded user data in the request object
    next();  // Proceed to the next middleware/route handler
  });
};

// Protected route that requires JWT authentication
app.get('/dashboard', authenticateToken, (req, res) => {
  res.json({ message: 'Welcome to the dashboard. You are authenticated!' });  // Send a success message if authentication is valid
});


app.get('/profile', authenticateToken, (req, res) => {
  const clientid = req.client.clientid;  // Extract userId from the decoded JWT token

  // Query the database to get the user data based on the userId
    db.query('SELECT firstname, lastname, email FROM Clients WHERE clientid = ?', [clientid], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ message: 'User not found' });  // Send error if user not found
    }

    // Send user profile data as response
    res.json({ firstname: result[0].firstname, lastname: result[0].lastname, email: result[0].email });
  });
});

// Route to create a new request
app.post('/requests', authenticateToken, (req, res) => {
    const { address, drivewaysize, price, note } = req.body;
    const clientId = req.client.clientId;

    db.query(
        'INSERT INTO Requests (clientid, address, drivewaysize, price, note, status) VALUES (?, ?, ?, ?, ?, ?)',
        [clientId, address, drivewaysize, price, note, 'pending'],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Request creation failed', error: err });
            }
            res.status(201).json({ message: 'Request created successfully', requestId: result.insertId });
        }
    );
});

// Route to get all requests for a client
app.get('/requests', authenticateToken, (req, res) => {
    const clientId = req.client.clientId;

    db.query('SELECT * FROM Requests WHERE clientid = ?', [clientId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to retrieve requests', error: err });
        }
        res.json(results);
    });
});

// Route to respond to a request
app.post('/responses', authenticateToken, (req, res) => {
    const { requestid, counterprice, timestart, timeend, responsenote } = req.body;

    db.query(
        'INSERT INTO Responses (requestid, counterprice, timestart, timeend, responsenote, status) VALUES (?, ?, ?, ?, ?, ?)',
        [requestid, counterprice, timestart, timeend, responsenote, 'pending'],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Response creation failed', error: err });
            }
            res.status(201).json({ message: 'Response created successfully', responseId: result.insertId });
        }
    );
});
