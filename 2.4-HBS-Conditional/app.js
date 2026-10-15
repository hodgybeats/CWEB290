const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const port = 8080;

//boilerplate code to connect render engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./views"); //tells hbs to look in the views folder for the

//handle when user visits http://localhost:8080/
app.get("/conditional", //req, res)=>{},(req,res)=>{}, ();
    (req, res) => {
        res.render("conditional", {
        title: "Conditional Test",
        isLoggedIn: true,
        username: "Charles",
        students: ["List1","List2","List3"]
        });
    },
);

//Iterators route
//handle when user visits http://localhost:8080/todos
app.get('/todos', (req, res) => {
    res.render('iterators', {
        title: 'Todo List',
        todos: [
            { task: 'Finish project', completed: true },
            { task: 'Read book', completed: false },
            { task: 'Go shopping', completed: true }
        ]
    });
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
