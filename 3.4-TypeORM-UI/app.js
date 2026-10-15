const express = require('express');
const app = express();
const PORT = 5000;
const { AppDataSource } = require("./data-source")
const { Member } = require("./entity/Member");
const { Book } = require("./entity/Book");
const { BorrowRecord } = require("./entity/BorrowRecord");
const exphbs = require('express-handlebars');
const { books, members, borrows } = require('./fixtures/user-seed');
const { Ilike } = require('typeorm');

app.use(express.json()); // for JSON requests
app.use(express.urlencoded({ extended: true })); // for form submissions

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Connect DB
// AppDataSource.initialize()
// .then(() => {
//     console.log("DB Connected ");
//     // seed 3 user - return the result of save([{},{},{}])
//     const bookRepo = AppDataSource.getRepository(Book);
//     return bookRepo.save(books);
// })
// .then((memberResult) => {
//     const bookRepo = AppDataSource.getRepository(Member);
//     return bookRepo.save(members);
// })
// .then((borrowRecord) => {
//     const memberRepo = AppDataSource.getRepository(BorrowRecord);
//     return memberRepo.save(borrows);
// })
// .then((borrowResult) => {
//     console.log("Borrow Results", borrowResult);
// })
// .catch(err => console.error(err));


// self calling function
(async () => {
    try
    {
        await AppDataSource.initialize();
        const bookRepo = AppDataSource.getRepository(Book);
        const memberRepo = AppDataSource.getRepository(Member);
        const borrowRepo = AppDataSource.getRepository(BorrowRecord);

        const bookResult = await bookRepo.save(books);
        const memberResult = await memberRepo.save(members);
        const borrowResult = await borrowRepo.save(borrows);

        console.log("Book Results", bookResult);
        console.log("Member Results", memberResult);
        console.log("Borrow Results", borrowResult);
    }
    catch(err) {
        console.error(err);
    }
})();




app.get('/',async (req, res) => {
   try {
    // NOTE: you can query as many tables as you need/want in a single route handler
    const memberRepo = AppDataSource.getRepository(Member);
    const bookRepo = AppDataSource.getRepository(Book);

    const members = await memberRepo.find();
    const books = await bookRepo.find({ where: { isAvailable: true } }); // only available books

    res.render('booking', { members, books });
  } catch (err) {
    console.error(err);
    res.send("Error fetching data");
  }
});

app.post("/borrow/check", async (req, res) => {
    const { memberId, bookId } = req.body;

    try {
        const bookRepo = AppDataSource.getRepository(Book);
        const borrowRepo = AppDataSource.getRepository(BorrowRecord);

        // 1. Check if book exists
        const book = await bookRepo.findOne({ where: { id: bookId } });
        if (!book) return res.json({ success: false, message: "Book not found." });

        // 2. Check if book is available
        if (!book.isAvailable) return res.json({ success: false, message: "Book is already borrowed." });

        // 3. Check if member already borrowed the book
        const alreadyBorrowed = await borrowRepo.findOne({
            where: { member_id: memberId, returned: false }
        });
        if (alreadyBorrowed) return res.json({ success: false, message: "You have already borrowed a book." });

        // 4. Record borrow
        const borrow = borrowRepo.create({
            book_id: bookId,
            member_id: memberId,
            returned: false
        });
        await borrowRepo.save(borrow);

        // 5. Mark book as unavailable
        book.isAvailable = false;
        await bookRepo.save(book);

        return res.json({ success: true, message: `Book "${book.title}" borrowed successfully!` });

    } catch (err) {
        console.error(err);
        return res.json({ success: false, message: "Something went wrong." });
    }
});

// API for 3.7-Reach-UI
app.get('/members',async (req, res) => {
   try {
    const { search } = req.query

    const memberRepo = AppDataSource.getRepository(Member);

    const whereClause = { }
    if (search) {
      whereClause.name = ILike(`%${search}%`)
    }
    const members = await memberRepo.find({ where: whereClause });

    res.json(members);
  } catch (err) {
    console.error(err);
    res.send("Error fetching data");
  }
});

app.get('/books',async (req, res) => {
   try {
    const { search } = req.query

    const bookRepo = AppDataSource.getRepository(Book);
    const whereClause = { isAvailable : true  }
    if (search) {
      whereClause.title = ILike(`%${search}%`)
    }
    const books = await bookRepo.find({where: whereClause }); 

    res.json(books);
  } catch (err) {
    console.error(err);
    res.send("Error fetching data");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});