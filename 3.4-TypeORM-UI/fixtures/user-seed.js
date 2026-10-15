module.exports.books = [
  {id: 1, title: "Harry Potter", isAvailable: 1},
  {id: 2, title: "The Movie", isAvailable: 1},
  {id: 3, title: "The Movie2", isAvailable: 1},
  {id: 4, title: "The Movie3", isAvailable: 1},
  {id: 5, title: "The Movie4", isAvailable: 1},
  {id: 6, title: "The Movie5", isAvailable: 1},
  {id: 7, title: "The Movie6", isAvailable: 1},
];

module.exports.members = [
  {id: 1, name: "Ron"},
  {id: 2, name: "Messi"},
  {id: 3, name: "Neymar"},
];

module.exports.borrows = [
  {id: 1, bookid: 2, memberid: 3, returned: 1},
  {id: 2, bookid: 3, memberid: 4, returned: 1},
];
