const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

const PORT = 7777;
app.use(express.json());

// Signup route to create a new user
app.post('/signup', async (req, res) => {
    const userDetails = new User(req.body);
    try {
        await userDetails.save();
        res.status(201).send(userDetails);
    } catch (error) {
        res.status(400).send(error);
    }
})

// Get all users from database
app.get('/user', async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            return res.status(404).send();
        }
        res.status(200).send(users);      
    } catch (error) {
        
    }
})

//update user details
app.patch('/user', async (req, res) => {
    try {
        const userId = req.body.userId;
        const updatedData = req.body;
        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).send(user);
    } catch (error) {
        return res.status(404).send();
    }
})

// Delete a user from database
app.delete('/user', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.body.userId);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

connectDB().then(() => {
    console.log('MongoDB connected...');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

}).catch(err => {
    console.error(err.message);
    process.exit(1);
});
app.get('/', (req, res) => {
    res.send('Hello, World! Hey jude');
});