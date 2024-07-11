const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const Groq = require('groq-sdk');
const User = require('./models/User');
/*
  This class is where all the api is kept.
  Any info on the login and profile function can be added or fixed here
*/

dotenv.config();

mongoose.connect(process.env.MONGO_URL); // connect to the mongoose server
const jwtSecret = process.env.JWT_SECRET; // key
const bcryptSalt = bcrypt.genSaltSync(10); // generate salt for bcrypt
const groq = new Groq(); // initialize groq sdk

const app = express();
app.use(express.json()); // parse json requests
app.use(cookieParser()); // parse cookies
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL, // local host url
}));

// verify if server is running
app.get('/test', (req, res) => {
  res.json('test ok');
});

// Creates unique profile and saves with cookies
app.get('/profile', (req, res) => {
  const token = req.cookies?.token; // get token from cookies
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => { // token is verified
      if (err) return res.status(403).json('invalid token');
      res.json(userData); // if data is valid, send it
    });
  } else {
    res.status(401).json('no token'); // throws error
  }
});

// login and authenticate user
app.post('/login', async (req, res) => {
  const { username, password } = req.body; // get username and password
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (passOk) {
      jwt.sign({ userId: foundUser._id, username }, jwtSecret, {}, (err, token) => { // generate JWT token
        if (err) {
          return res.status(500).json({ error: 'Failed to generate token' });
        }
        res.cookie('token', token, { sameSite: 'none', secure: true }).json({
          id: foundUser._id,
        });
      });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});
// Register username and password
// Encrypts the unique ID
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
      username: username,
      password: hashedPassword,
    });
    jwt.sign({ userId: createdUser._id, username }, jwtSecret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
        id: createdUser._id,
      });
    });
  } catch (err) {
    if (err) throw err;
    res.status(500).json('error');
  }
});

/*
  Here is the logic for the chat bot using Groq AI, the code was taken from the website itself and edited to
  use what we needed it for.

  Below I provided the URL so you can look over it or edit the info:
  https://console.groq.com/docs/api-reference#chat-create
*/
app.post('/generate-recipe', async (req, res) => {
  const { ingredients } = req.body;

  const messages = [
    {
      role: "system",
      content: "You are a helpful assistant that provides recipes based on given ingredients. Please respond in the following format: \n\nTitle:\nIngredients:\n- List of ingredients\n\nSteps:\n1. Step one\n2. Step two\n\nNotes:\n- Any additional notes",
    },
    {
      role: "user",
      content: `Given the following ingredients: ${ingredients.join(', ')}, provide a recipe.`,
    },
  ];

  try {
    const response = await groq.chat.completions.create({
      messages,
      model: "llama3-8b-8192",
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      stop: null,
      stream: false,
    });

    const recipe = response.choices[0]?.message?.content.trim();
    res.json({ recipe });
  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});