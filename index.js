const express = require('express')
const database = require('./database')

const app = express()
const port = 3000


// database
const db = require('./database')

/* 
route               /
desccription        get all books
acces               public  
parameter           none    
method              get
*/
app.get('/', (req, res) => {
    res.json({ books: db.books })
})

/* 
route               /
desccription        get a specific book on ISBN
acces               public  
parameter           isbn
method              get
*/
app.get('/is/:isbn', (req, res) => {
    const isbn = req.params.isbn
    const getSpecificBook = database.books.filter((book) => book.ISBN === isbn )
    if (getSpecificBook.length === 0) {
        return res.json({ error: `no books found for the ISBN of ${isbn}` })
    }
    return res.json({ book: getSpecificBook })
})

/* 
route               /c/category
desccription        get a specific book on category
acces               public  
parameter           category
method              get
*/
app.get('/c/:category',(req,res)=>{
    const getSpecificBook = database.books.filter((book)=>book.category.includes(req.params.category))
    if (getSpecificBook.length === 0) {
        return res.json({ error: `no books found for the category of ${req.params.category}` })
    }
    return res.json({ book: getSpecificBook })
})

/* 
route               /l/lang
desccription        get a specific book on language
acces               public  
parameter           language
method              get
*/
app.get('/l/:lang',(req,res)=>{
    const getSpecificBook = database.books.filter((book)=>book.language===req.params.lang)
    if (getSpecificBook.length === 0) {
        return res.json({ error: `no books found for the lang of ${req.params.lang}` })
    }
    return res.json({ book: getSpecificBook })
})

/* 
route               /author
desccription        get all authors
acces               public  
parameter           none
method              get
*/
app.get('/author',(req,res)=>{
    return res.json({authors : database.author})
})

/* 
route               /author/id
desccription        get a specific author
acces               public  
parameter           id
method              get
*/
app.get('/author/:id',(req,res)=>{
    const authId = parseInt(req.params.id)
    const getSpecificAuthor = database.author.filter((author) => author.id === authId )
    if (getSpecificAuthor.length === 0) {
        return res.json({ error: `no author found for the id of ${authId}` })
    }
    return res.json({ book: getSpecificAuthor })
})

/* 
route               /author/book/isbn
desccription        get a list of authors based on books
acces               public  
parameter           isbn
method              get
*/
app.get('/author/book/:isbn',(req,res)=>{
    const getSpecificAuthor = database.author.filter((author)=>author.books.includes(req.params.isbn))
    if (getSpecificAuthor.length === 0) {
        return res.json({ error: `no author found for the book of ${req.params.isbn}` })
    }
    return res.json({ author: getSpecificAuthor })
})

/* 
route               /publications
desccription        get all publications
acces               public  
parameter           none
method              get
*/
app.get('/publications',(req,res)=>{
    return res.json({authors : database.publications})
})

/* 
route               /publications/id
desccription        get a specific publication
acces               public  
parameter           id
method              get
*/
app.get('/publications/:id',(req,res)=>{
    const getSpecificPublications = database.publications.filter((publications) => publications.id === parseInt(req.params.id) )
    if (getSpecificPublications.length === 0) {
        return res.json({ error: `no publications found for the id of ${parseInt(req.params.id)}` })
    }
    return res.json({ publications: getSpecificPublications })
})

/* 
route               /publications/book/isbn
desccription        get a list of publications based on books
acces               public  
parameter           isbn
method              get
*/
app.get('/publications/book/:isbn',(req,res)=>{
    const getSpecificPublications = database.publications.filter((publications)=>publications.books.includes(req.params.isbn))
    if (getSpecificPublications.length === 0) {
        return res.json({ error: `no publications found for the book of ${req.params.isbn}` })
    }
    return res.json({ publications: getSpecificPublications })
})


app.listen(port, () => console.log('server started at port', port))