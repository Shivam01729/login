const app=require('express');
const express = require("express")
const path = require("path")
const apps = express()
const http=require('http').Server(app);
const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://shashankkrpandey123:a9yDfOJwsu0euCYt@cluster0.qbhmqbs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
const LogIn=require('./models/userModel');

apps.use(express.json())
apps.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, './tempelates')
const publicPath = path.join(__dirname, './public')
console.log(publicPath);

apps.set('view engine', 'hbs')
apps.set('views', tempelatePath)
apps.use(express.static(publicPath))


apps.get('/signup', (req, res) => {
    res.render('signup')
})
apps.get('/', (req, res) => {
    res.render('login')
})

apps.post('/signup', async (req, res) => {
    const data = new LogIn({
        name: req.body.name,
        password: req.body.password
    })
    await data.save()
});


apps.post('/login', async (req, res) => {
    try {
        const user = await LogIn.findOne({ name: req.body.name });

        if (!user) {
            return res.send("User not found");
        }

        if (user.password === req.body.password) {
            return res.status(200).render("home", { naming: `${req.body.name}` });
        } else {
            return res.send("Incorrect password");
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

const PORT=process.env.PORT || 3000;

apps.listen(PORT, () => {
    console.log('port connected');
});