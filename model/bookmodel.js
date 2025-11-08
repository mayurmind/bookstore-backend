import mongoose from "mongoose";
import bcrypt from "bcrypt";

const bookSchema = new mongoose.Schema({
    title : {
    },
    author : {
        type : String,
        required : true,
    },
    price : {
        type : Number,
        required : true,
        trim : true,
       minlength : 6,
    },
    desc: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String
  }
});


const Book = new mongoose.model('Book', bookSchema);
export default Book;