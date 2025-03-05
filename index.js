const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');

const db = require('./db');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(cors());
app.use(bodyParser.json()); //{key:value}
app.use(bodyParser.urlencoded({ extended: true }));

let users = [
    {username:"Ukrit" , email:"ukrit.sanitji@gmail.com", password :"1234"}
];


//Routing
app.get('/', (req, res) => {
    res.send('<h1>Welcome to my home page.</h1>')
});

app.get('/items/:id', (req, res) => {
    const id = req.params.id;
    res.send(`Received item id: ${id}`)
});

app.get('/Login', (req, res) => {
    res.render("Login");
});

app.get('/register', (req, res) => {
    res.render("register");
});

app.get('/products', (req, res) => {
    res.render("products");
});

app.post('/login', (req, res) => {
    const {email, password} = req.body;
    const sql ="SELECT a_pwd FROM account WHERE a_email=?";
    db.query(sql, [email],async (err, result)=>{
        if(err) {
            res.send("Error user :" + email);
        } else if (result.leagth > 0){
            const user = result[0];
            const match = await bcrypt.compare(password, user,a_pwd);
            if (match){
                res.redirect('/product');
            }else{
                res.send('Invalid email or password!.');
            }
        }
    });

});


app.post('/register', async(req, res) => {
    const {name,email,password,confirm_password } = req.body;
    
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashPassword);


    db.query("INSERT INTO account(a_name,a_email,a_pwd) VALUES(?,?,?)",
        [name, email,password], 
        (err, result) => {
            if (err){
                res.status(500).json({ error: err.message});
            } else {
                res.redirect('/login');
            }
    
        });
});
   

//start server
app.listen(port, ()=>{
    console.log(`server is running on http://localhost:${port}`)
})