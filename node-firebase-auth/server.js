const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://new-pro-66d2c.firebaseio.com',
});

const app = express();
app.use(bodyParser.json());

// Serve Static Files from 'public' Folder
app.use(express.static(path.join(__dirname, 'public')));

// Firebase Auth Reference
const auth = admin.auth();

// ===============================
// User Registration API
// ===============================
app.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: username,
    });

    res.status(201).json({
      message: 'User registered successfully!',
      uid: userRecord.uid,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

// ===============================
// User Login API
// ===============================
app.post('/login', async (req, res) => {
  console.log('Login Request Body:', req.body);
  const { email } = req.body;

  try {
    // Check if the user exists in Firebase Auth
    const userRecord = await auth.getUserByEmail(email);

    if (userRecord) {
      res.status(200).json({
        message: 'User found!',
        uid: userRecord.uid,
        email: userRecord.email,
        username: userRecord.displayName || 'No username provided',
      });
    }
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      res.status(404).json({
        error: 'User not available!',
      });
    } else {
      res.status(500).json({
        error: error.message,
      });
    }
  }
});

// ===============================
// Admin: Fetch All Users from Firebase Auth
// ===============================
app.get('/getUsers', async (req, res) => {
  try {
    const listUsersResult = await auth.listUsers(1000); // Get up to 1000 users
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || 'N/A',
      createdAt: new Date(userRecord.metadata.creationTime).toLocaleString(),
    }));

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch users!',
      details: error.message,
    });
  }
});

// ===============================
// Admin Routes - Serve Admin Pages
// ===============================
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard-admin.html'));
});

// ===============================
// Start the Server
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
