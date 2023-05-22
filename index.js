require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const db = require('./database/database')
const port = 3000;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//models

const BookModel = require('./database/book')
const AuthorModel = require('./database/author')
const PublicationModel = require('./database/publications')



mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('db connected'))
    .catch((err) => console.log(err));


/* 
route               /
desccription        get all books
acces               public   
parameter           none    
method              get
*/
app.get('/', async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks)
});

/* 
route               /is
desccription        get a specific book on ISBN
acces               public  
parameter           isbn
method              get
*/
app.get('/is/:isbn', async (req, res) => {
    const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn })

    if (!getSpecificBook) {
        return res.json({ error: `no books found for the ISBN of ${req.params.isbn}` })
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
app.get('/c/:category', async (req, res) => {
    const getSpecificBook = await BookModel.findOne({ category: req.params.category })
    if (!getSpecificBook) {
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
app.get('/l/:lang', async (req, res) => {
    const getSpecificBook = await BookModel.findOne({ language: req.params.lang })
    if (!getSpecificBook) {
        return res.json({ error: `no books found for the language of ${req.params.lang}` })
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
app.get('/author', async (req, res) => {
    const getAllAuthor = await AuthorModel.find()
    return res.json({ authors: getAllAuthor })
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
app.get('/publications', async (req, res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json({ publications: getAllPublications })
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

app.post('/book/new', async (req, res) => {
    const { newBook } = req.body
    const isBook = await BookModel.findOne({ ISBN: newBook.ISBN })
    if (!isBook) {
        const addNewBook = BookModel.create(newBook).then(() => {
            return res.json({
                books: addNewBook,
                message: 'new book added'
            })
        }).catch((err) => {
            return res.json({
                message: err + 'new book not added'
            })
        })
    } else {
        const updateBook = BookModel.updateOne(newBook)
            .then(() => {
                return res.json({
                    book: updateBook,
                    message: 'book updated'
                })
            })
            .catch(() => {
                return res.json({ error: "book not updated" })
            });
    }
});

/* 
route               /author/new
desccription        Add new author
acces               public  
parameter           none
method              post
*/

app.post('/author/new', async (req, res) => {
    const { newAuthor } = req.body
    const isAuthor = await AuthorModel.findOne({ id: newAuthor.id })
    if (!isAuthor) {
        const addNewAuthor = AuthorModel.create(newAuthor).then(() => {
            return res.json({
                author: addNewAuthor,
                message: 'new author added'
            })
        }).catch(() => {
            return res.json({
                message: 'new author not added'
            })
        })
    } else {
        const updateAuthor = AuthorModel.updateOne(newAuthor)
            .then(() => {
                return res.json({
                    author: updateAuthor,
                    message: 'Author updated'
                })
            })
            .catch(() => {
                return res.json({ error: "Author not updated" })
            });
    }
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


/* 
route               /book/update/
desccription        update new book
acces               public  
parameter           isbn
method              PUT
*/

app.put('/book/update/:isbn', async (req, res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            title: req.body.bookTitle
        },
        {
            new: true
        }
    )
    return res.json({
        books: updatedBook
    })
})

/* 
route               /book/author/update
desccription        update/add new author
acces               public  
parameter           isbn
method              PUT
*/

app.put('/book/author/update/:isbn', async (req, res) => {
    //update book database
    const updateBook = await BookModel.findOneAndUpdate(
        {
            ISBN:req.params.isbn
        },
        {
            $addToSet:{
                authors:req.body.newAuthor
            }
        },
        {
            new : true
        }
    );

    //update the author database

    const updateAuthor = await AuthorModel.findOneAndUpdate(
        {
            id:req.body.newAuthor
        },
        {
            $addToSet:{
                books:req.params.isbn
            }
        },
        {
            new : true
        }
    );

    return res.json({
        books: updateBook,
        author:updateAuthor,
        message:'new author has added'
    })
})

/****DELETE****/

/* 
route               /book/delete
desccription        delete a book
acces               public  
parameter           isbn
method              DELETE
*/

app.delete('/book/delete/:isbn', async(req, res) => {
    const deleteBook = await BookModel.findOneAndDelete(
        {
            ISBN:req.params.isbn
        }
    );
    return res.json({
        books:deleteBook
    })
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