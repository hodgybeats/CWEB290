const express = require('express');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Route: Show form
app.get('/', (req, res) => {
  res.render('form', {
    //first time we visit the page there is no errors or previous data 
    errors: [], 
    oldInput: {} 
    });
});

// Route: Handle form submission with validation
app.post('/register',
  [
    // middleware - express-validator uses to create the "rules"
    body('email')
      .isEmail().withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('age')
      .isInt({ min: 18 }).withMessage('You must be at least 18 years old')
      // mix and match validator for the query, cookies, headers, params and above body
  ],
  (req, res) => {

    // ACTUALLY compare the user submitted against the "rules"
    const errors = validationResult(req);

    // ENFORCE the rules - otherwise why did you make the rules
    if (!errors.isEmpty()) {
      // Re-render form with errors and old input
      return res.render('form', { 
        errors: errors.array(), // send back and array of error objects
        oldInput: req.body // send back the data the user submitted
      });
    }

    // If valid → show success page
    res.render('success', { data: req.body });
  }
);