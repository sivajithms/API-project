const books = [
    {
        ISBN: "1234Book",
        title: "Tesla",
        pubDate: "2021-08-05",
        language: "en",
        numPage: 250,
        author: [1, 2],
        publications: [1],
        category: ["tech", "space", "education"],
    }
]

const author = [
    {
        id: 1,
        name: "sivajith",
        books: ["1234Book", "3344hehe"]
    },
    {
        id: 2,
        name: "Elon Musk",
        books: ["1234Book", ]
    },
]

const publications = [
    {
        id: 1,
        name: "writex",
        books: ["1234Book"]
    }
]

module.exports = { books, author, publications }