const express = require("express");
const app = express();
const PORT = 5000;
const { AppDataSource } = require("./data-source");
const { Member } = require("./entity/Member");
const { Book } = require("./entity/Book");
const { BorrowRecord } = require("./entity/BorrowRecord");
const { bookSeed, memberSeed, borrowSeed } = require("./fixture/dataSeed");
const { ILike } = require("typeorm");
 
const exphbs = require("express-handlebars");
 
app.use(express.json()); // for JSON requests
app.use(express.urlencoded({ extended: true })); // for form submissions
 
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
 
// // Connect DB
// AppDataSource.initialize().then(() => {
//     console.log("DB Connected ");
//     const bookRepo = AppDataSource.getRepository(Book);
//     return bookRepo.save(bookSeed);
// })
// .then(() => {
//     const memberRepo = AppDataSource.getRepository(Member);
//     return memberRepo.save(memberSeed);
// })
// .then(() => {
//     const borrowRepo = AppDataSource.getRepository(BorrowRecord);
//     return borrowRepo.save(borrowSeed);
// })
// .catch(err => console.error(err));
 
//self calling function
(async () => {
  try {
    await AppDataSource.initialize();
    const bookRepo = AppDataSource.getRepository(Book);
    const memberRepo = AppDataSource.getRepository(Member);
    const borrowRepo = AppDataSource.getRepository(BorrowRecord);
 
    const bookResult = await bookRepo.save(bookSeed);
    const memResult = await memberRepo.save(memberSeed);
    const borrowResult = await borrowRepo.save(borrowSeed);
 
    console.log("Book Result " + bookResult);
    console.log("Book Result " + memResult);
    console.log("Book Result " + borrowResult);
  } catch (err) {
    console.error(err);
  }
})();
 
app.get("/", async (req, res) => {
  try {
    //NOTE: you can query as many tables as you need/want in a single
    //route handler
    const memberRepo = AppDataSource.getRepository(Member);
    const bookRepo = AppDataSource.getRepository(Book);
 
    const members = await memberRepo.find();
    const books = await bookRepo.find({ where: { isAvailable: true } }); // only available books
 
    res.render("booking", { members, books });
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
    if (!book.isAvailable)
      return res.json({ success: false, message: "Book is already borrowed." });
 
    // 3. Check if member already borrowed the book
    const alreadyBorrowed = await borrowRepo.findOne({
      where: { member_id: memberId, returned: false },
    });
    if (alreadyBorrowed)
      return res.json({
        success: false,
        message: "You have already borrowed a book.",
      });
 
    // 4. Record borrow
    const borrow = borrowRepo.create({
      book_id: bookId,
      member_id: memberId,
      returned: false,
    });
    await borrowRepo.save(borrow);
 
    // 5. Mark book as unavailable
    book.isAvailable = false;
    await bookRepo.save(book);
 
    return res.json({
      success: true,
      message: `Book "${book.title}" borrowed successfully!`,
    });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "Something went wrong." });
  }
});
 
//API for 3.8-React-UI
 
// app.get('/members',async (req, res) => {
//    try {
//     const { search } = req.query
 
//     const memberRepo = AppDataSource.getRepository(Member);
 
//     const whereClause = { }
//     if (search) {
//       whereClause.name = ILike(`%${search}%`)
//     }
//     const members = await memberRepo.find({ where: whereClause });
 
//     res.json(members);
//   } catch (err) {
//     console.error(err);
//     res.send("Error fetching data");
//   }
// });
 
// app.get('/books',async (req, res) => {
//    try {
//     const { search } = req.query
 
//     const bookRepo = AppDataSource.getRepository(Book);
//     const whereClause = { isAvailable : true  }
//     if (search) {
//       whereClause.title = ILike(`%${search}%`)
//     }
//     const books = await bookRepo.find({where: whereClause });
 
//     res.json(books);
//   } catch (err) {
//     console.error(err);
//     res.send("Error fetching data");
//   }
// });
 
//3.9 - React-Services
app.get("/members", async (req, res) => {
  try {
    const { search } = req.query;
 
    const memberRepo = AppDataSource.getRepository(Member);
 
    const whereClause = {};
    if (search) {
      whereClause.name = ILike(`%${search}%`);
    }
    const members = await memberRepo.find({ where: whereClause });
 
    res.json(members);
  } catch (err) {
    console.error(err);
    res.send("Error fetching data");
  }
});
 
app.get("/books", async (req, res) => {
  try {
    const { search } = req.query;
 
    const bookRepo = AppDataSource.getRepository(Book);
    const whereClause = { isAvailable: true };
    if (search) {
      whereClause.title = ILike(`%${search}%`);
    }
    const books = await bookRepo.find({ where: whereClause });
 
    res.json(books);
  } catch (err) {
    console.error(err);
    res.send("Error fetching data");
  }
});
 
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});