const mongoose = require('mongoose');

//create Author schema

const AuthorSchema = mongoose.Schema(
    {
        id: {type:Number,required:true},
        name: String,
        books: [String]
    }
);

const AuthorModel = mongoose.model('authors', AuthorSchema);

module.exports = AuthorModel