const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database')
const port = 3000;

const app = express();

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())




/* 
route               /
desccription        get all books
acces               public  
parameter           none    
method              get
*/
app.get('/', (req, res) => {
    return res.json({ books: db.books, author: db.author, publications: db.publications })
});

/* 
route               /
desccription        get a specific book on ISBN
acces               public  
parameter           isbn
method              get
*/
app.get('/is/:isbn', (req, res) => {
    const isbn = req.params.isbn
    const getSpecificBook = db.books.filter((book) => book.ISBN === isbn)
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
app.get('/c/:category', (req, res) => {
    const getSpecificBook = db.books.filter((book) => book.category.includes(req.params.category))
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
app.get('/l/:lang', (req, res) => {
    const getSpecificBook = db.books.filter((book) => book.language === req.params.lang)
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
app.get('/author', (req, res) => {
    return res.json({ authors: db.author })
})

/* 
route               /author/id
desccription        get a specific author
acces               public  
parameter           id
method              get
*/
app.get('/author/:id', (req, res) => {
    const authId = parseInt(req.params.id)
    const getSpecificAuthor = db.author.filter((author) => author.id === authId)
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
app.get('/author/book/:isbn', (req, res) => {
    const getSpecificAuthor = db.author.filter((author) => author.books.includes(req.params.isbn))
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
app.get('/publications', (req, res) => {
    return res.json({ authors: db.publications })
})

/* 
route               /publications/id
desccription        get a specific publication
acces               public  
parameter           id
method              get
*/
app.get('/publications/:id', (req, res) => {
    const getSpecificPublications = db.publications.filter((publications) => publications.id === parseInt(req.params.id))
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
app.get('/publications/book/:isbn', (req, res) => {
    const getSpecificPublications = db.publications.filter((publications) => publications.books.includes(req.params.isbn))
    if (getSpecificPublications.length === 0) {
        return res.json({ error: `no publications found for the book of ${req.params.isbn}` })
    }
    return res.json({ publications: getSpecificPublications })
})


//POST

/* 
route               /book/new
desccription        Add new book
acces               public  
parameter           none
method              post
*/

app.post('/book/new', (req, res) => {
    const newBook = req.body;
    var isISBN, bookIndex
    db.books.forEach((data, i) => {
        if (data.ISBN === newBook.ISBN) {
            isISBN = true;
            bookIndex = i;
        }
    })
    if (isISBN) {
        db.books[bookIndex] = newBook;
    } else {
        db.books.push(newBook)
    }
    return res.json({ updatedBooks: db.books })
})

/* 
route               /author/new
desccription        Add new author
acces               public  
parameter           none
method              post
*/

app.post('/author/new', (req, res) => {
    const newAuthor = req.body;
    var isAuthor, authorIndex
    db.author.forEach((data, i) => {
        if (data.id === newAuthor.id) {
            isAuthor = true;
            authorIndex = i;
        }
    })
    if (isAuthor) {
        db.author[authorIndex] = newAuthor;
    } else {
        db.author.push(newAuthor)
    }
    return res.json({ updatedauthor: db.author })
})

/* 
route               /publication/new
desccription        Add new publication
acces               public  
parameter           none
method              post
*/

app.post('/publication/new', (req, res) => {
    const newPublication = req.body;
    var isPublicaton, publicationIndex
    db.publications.forEach((data, i) => {
        if (data.id === newPublication.id) {
            isPublicaton = true;
            publicationIndex = i;
        }
    })
    if (isPublicaton) {
        db.publications[publicationIndex] = newPublication;
    } else {
        db.publications.push(newPublication)
    }
    return res.json({ updatedpublications: db.publications })
})


/****PUT****/

/* 
route               /publication/update/book
desccription        update/add new publications
acces               public  
parameter           isbn
method              PUT
*/

app.put('/publication/update/book/:isbn', (req, res) => {
    db.publications.forEach((pub) => {
        if (pub.id === req.body.pubId) {
            return pub.books.push(req.params.isbn)
        }
    });

    db.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publications = req.body.pubId
            return
        }
    });
    return res.json({ books: db.books, publications: db.publications, message: "succesfuly updated publications" })
});

/****DELETE****/

/* 
route               /book/delete
desccription        delete a book
acces               public  
parameter           isbn
method              DELETE
*/

app.delete('/book/delete/:isbn', (req, res) => {
    const updatedBookDb = db.books.filter((book) => book.ISBN !== req.params.isbn)
    db.books = updatedBookDb
    return res.json({ book: db.books })
});

/* 
route               /book/delete/author
desccription        delete an author from a book and vice versa
acces               public  
parameter           isbn, authorId
method              DELETE
*/

app.delete('/book/delete/author/:isbn/:authorId', (req, res) => {
    db.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter((author) => author !== parseInt(req.params.authorId))
            book.author = newAuthorList;
            return;
        }
    });

    db.author.forEach((author) => {
        if (author.id === parseInt(req.params.authorId)) {
            const newBookList = author.books.filter((book) => book !== req.params.isbn)
            author.books = newBookList;
            return
        }
    });
    return res.json({
        book: db.books,
        author: db.author,
        message: "author was deleted"
    })
});



app.listen(port, () => console.log('server started at port', port))