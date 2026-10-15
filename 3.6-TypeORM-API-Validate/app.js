const express = require('express');
const { AppDataSource } = require('./data-source');
const userRoutes = require('./user-routes');
const { UserController } = require('./controller/UserController');
const { User } = require('./entity/User');

const app = express();
const PORT = 5000;

app.use(express.json()); // for JSON requests
app.use(express.urlencoded({ extended: true })); // for form submissions

// Initialize TypeORM
AppDataSource.initialize()
.then(() => {
    console.log('Data Source has been initialized!');
    // Routes
    app.use('/users', userRoutes);

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
//add another .then to call saveAll in the next then console log the return from saveAll
.then(() => {
    console.log('Data Source has been initialized!');
    return UserController.saveAll(User)

})

.catch((err) => console.error('Error during Data Source initialization', err));

