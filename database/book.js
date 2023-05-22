const mongoose = require('mongoose');

//create book schema

const BookSchema = mongoose.Schema(
    {
        ISBN: { type: String, required: true },
        title: String,
        pubDate: String,
        language: String,
        numPage: { type: Number, required: true },
        author: [Number],
        publications: [Number],
        category: [String],
    }
);

const BookModel = mongoose.model('books', BookSchema);

module.exports = BookModel