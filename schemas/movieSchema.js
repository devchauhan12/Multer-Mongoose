const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/Movies')
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description :{
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    rating: {
        type: String,
        required: true,
    },
    movimage: {
        type: String,
        required: true,
    },
}, { timestamps: true })

const movieModel = mongoose.model('movielist', movieSchema)

module.exports = { movieModel };