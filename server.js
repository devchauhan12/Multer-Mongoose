const express = require('express')
const app = express()
const ejs = require('ejs')
const fs = require('fs')
const multer = require('multer')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')
const { movieModel } = require('./schemas/movieSchema.js')


const storage = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            return cb(null, './upload')
        },
        filename: (req, file, cb) => {
            return cb(null, Date.now() + file.originalname)
        }
    }
)
let upload = multer({ storage: storage }).single('file')

app.get('/', async (req, res) => {
    const movies = await movieModel.find({})
    res.render('./Pages/home', { movies: movies })
})

app.get('/addmovie', (req, res) => {
    res.render('./pages/addmovie')
})

app.post('/addmovie', async (req, res) => {

    console.log('first')
    // const movie = req.body;

    // const newMovie = new movieModel(movie);
    // await newMovie.save();

    // res.redirect('/')
})

app.get('/deletemovie/:id', async (req, res) => {
    const userId = req.params.id;
    var result = await movieModel.deleteOne(({ _id: userId }))
    res.redirect('/')
})

app.get('/editmovie/:id', async (req, res) => {
    const userId = req.params.id;

    const movie = await movieModel.findById(userId);

    res.render('./pages/editmovie', { movie });
})

app.post('/editmovie/:id', async (req, res) => {
    const userId = req.params.id;
    const updatedMovieData = req.body;

    const updatedMovie = await movieModel.findByIdAndUpdate(userId, updatedMovieData, { new: true });

    res.redirect('/');
})

app.listen(3000, () => {
    console.log('Server Start at 3000');
})