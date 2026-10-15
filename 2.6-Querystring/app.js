const express = require("express");

const app = express();
const port = 3000;

// search route http://localhost:3000/search
app.get("/search", (req, res) => {
  console.log("Entire Request Object", req);

    // there may be many key value pairs in the requery
    // our code is just looking for the title and author
    const { title, author } = req.query;
    console.log("Entire Query String Object", req.query);

    // check that title and author were supplied  in the url
    if (!title || !author) {
        // res.send used for quick debug (like console log but in a browser)
        return res.send("Please enter both title and author.");
    }
    res.send(`Searching for books titled "${title}" by ${author}`);
    // normally at this point in our code we would query a real database for books by author
    // then user res.json to send back the data from the database
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
