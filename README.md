<body>

<h1>EasyCook</h1>

<p>EasyCook is a web application that helps users generate recipes based on the ingredients they have at home. It allows users to register, login, and save their generated recipe history.</p>

<h2>Table of Contents</h2>
<ul>
  <li><a href="#features">Features</a></li>
  <li><a href="#installation">Installation</a></li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#api-endpoints">API Endpoints</a></li>
  <li><a href="#technologies">Technologies</a></li>
</ul>

<h2 id="features">Features</h2>
<ul>
  <li>User authentication (registration, login, logout)</li>
  <li>Generate recipes based on given ingredients using Groq AI</li>
  <li>Save and view generated recipe history</li>
  <li>JWT-based authentication and secure data handling</li>
</ul>

<h2 id="installation">Installation</h2>

<h3>Whats Needed</h3>
<ul>
  <li>Node.js and npm installed</li>
  <li>MongoDB instance (local or MongoDB Atlas)</li>
  <li>Groq AI API key</li>
</ul>

<h2 id="usage">Usage</h2>
<ol>
  <li>Register a new account or login with an existing account.</li>
  <li>Enter the ingredients you have and click "Generate Recipe."</li>
  <li>View the generated recipe and save it to your history.</li>
  <li>Access your saved recipes anytime from the profile page.</li>
</ol>

<h2 id="api-endpoints">API Endpoints</h2>

<h3>Authentication</h3>
<ul>
  <li><code>POST /register</code>: Register a new user.</li>
  <li><code>POST /login</code>: Login with an existing user.</li>
  <li><code>POST /logout</code>: Logout the current user.</li>
  <li><code>GET /profile</code>: Get the current user's profile information.</li>
</ul>

<h3>Recipes</h3>
<ul>
  <li><code>POST /generate-recipe</code>: Generate a recipe based on given ingredients.</li>
  <li><code>GET /recipe-history</code>: Get the logged-in user's recipe history.</li>
</ul>

<h2 id="technologies">Technologies</h2>
<ul>
  <li><strong>Frontend</strong>: React, Axios, Context API</li>
  <li><strong>Backend</strong>: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt</li>
  <li><strong>AI Integration</strong>: Groq AI</li>
</ul>


</body>
</html>
