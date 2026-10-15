const express = require("express");
const exphbs = require('express-handlebars');
const app = express()
const port = 8080;

//boilerplate code to connect render engine
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views'); //tells hbs to look in the views folder for the 

//handle when user visits http://localhost:3000/
app.get("/", //req, res)=>{},(req,res)=>{}, ();
    (req,res)=>{
        res.render("home",
            {
                title:"",
                students: ["Bob","Wilma","Alice"],
                isLoggedIn: true
            }
        )    
    }
)

app.listen(port,()=>{
    console.log(`Listening on http://localhost:${port}`)
})