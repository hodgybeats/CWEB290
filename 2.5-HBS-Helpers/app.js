const express = require('express');
const exphbs = require('express-handlebars');
const { circumference } = require('../2.1-Modules/circle');
const app = express();
const PORT = 8080;
const { PI } = Math;
const hbs = exphbs.create({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    helpers: {
        isEqual: (a, b, options) => {
            return a === b ? options.fn(this) : options.inverse(this);
        },
        multiply: (a, b) => a * b,
        formatDecimal: (price) => `${price.toFixed(3)}`,
        area: (r) => PI * r ** 2,
        circumference: (r) => 2 * PI * r
    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get('/status', (req, res) => {
    res.render('status', {
        title: 'User Status',
        userRole: 'admin'
    });
});

app.get('/cart', (req, res) => {
    res.render('cart', {
        title: 'Shopping Cart',
        items: [
            { name: 'Book', price: 10, quantity: 2 },
            { name: 'Pen', price: 2, quantity: 5 }
        ]
    });
});

app.get('/circle', (req, res) => {
    res.render('circle', {
        title: 'Area of a circle',
        radius1: 13,
        radius2: 4
    });
});
    
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});