/***
 * This is a bad example of a controller
 *  it is too dependant to the express framework requested and response
 *  the functions should accept only the parameters needed to complete the tast (not req or res)
 * Also functions should return the object or a null if it fails (not call res.json)
 */

const { AppDataSource } = require('../data-source');
const { User } = require('../entity/User');
const { UserSchema } = require('./schema/UserSchema');

module.exports.UserController = new class {
    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    // framework agnostic
    async saveAll(users){ // array of users
        if (!Array.isArray(users)){
            return null; // signals that it failed
        }
        try{
            const results = []
            const errors = []


            for (let i = 0; i < users.length; i++)
            {
                const userData = users[i];
                const { error, value } = UserSchema.validate(body);
                if (error){
                    errors.push(error);
                }
                else{
                    const user = this.userRepository.create(userData);
                    const savedUser = await this.userRepository.save(user);
                    results.push(savedUser);
                }
            }
            // validate the items in the users array and save or error as needed
            // return the results and erros
            return { results, errors};
            // In app.js - call this function in a separate ".then"
            // In app.js - also console log the results and errors
            
        }catch(err){
            // console.log();
            return null;
        }
    }

    // GET /users
    async all(req, res) {
        try {
            const users = await this.userRepository.find();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // GET /users/:id
    async one(req, res) {
        try {
            const user = await this.userRepository.findOneBy({ id: parseInt(req.params.id) });
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // POST /users
    async create(req, res) {
        try {

            // STEP 2: CHECK FOR VIOLATIONS - Validate request body
            const { error, value } = UserSchema.validate(req.body);

            // STEP 3: ENFORCE THE RULES!!
            if (error) {
                return res.status(400).json({ error: error.details.map(d => d.message) });
            }

            // STEP 4: SAVE TO DB - IF VALID
            const user = this.userRepository.create(req.body);
            const result = await this.userRepository.save(user);
            res.status(201).json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // PUT /users/:id
    async update(req, res) {
        try {

            // STEP 2: CHECK FOR VIOLATIONS - Validate request body
            const { error, value } = UserSchema.validate(req.body);

            // STEP 3: ENFORCE THE RULES!!
            if (error) {
                return res.status(400).json({ error: error.details.map(d => d.message) });
            }

            // STEP 4: SAVE TO DB - IF VALID
            await this.userRepository.update(req.params.id, req.body);
            const updatedUser = await this.userRepository.findOneBy({ id: parseInt(req.params.id) });
            res.json(updatedUser);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // DELETE /users/:id
    async remove(req, res) {
        try {
            await this.userRepository.delete(req.params.id);
            res.json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}