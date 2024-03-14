const express = require('express')
const app = express()
const ejs = require('ejs')
const fs = require('fs')
const multer = require('multer')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/upload'));
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

app.get('/card', (req, res) => {
    res.render('./pages/card')
})

app.get('/addmovie', (req, res) => {
    res.render('./pages/addmovie')
})

app.post('/addmovie', async (req, res) => {
    upload(req, res, async () => {
        if (req.file) {
            let details = {
                title: req.body.title,
                description: req.body.description,
                year: req.body.year,
                genre: req.body.genre,
                rating: req.body.rating,
                movimage: req.file.filename
            }

            const movie = new movieModel(details)
            try {
                await movie.save();
                res.redirect('/');
            } catch (error) {
                console.error(error);
            }
        }
    })
})

app.get('/deletemovie/:id', async (req, res) => {
    let id = req.params.id
    let image = await movieModel.findOne({ _id: id })
    let result = await movieModel.deleteOne({ _id: id })
    if (result.acknowledged) {
        fs.unlink(`upload/${image.movimage}`, (err) => {
            if (err) {
                console.log(err);
            }
            console.log("success");
        })
        res.redirect('/')
    }
})

app.get('/editmovie/:id', async (req, res) => {
    var id = req.params.id
    var result = await movieModel.findOne({ _id: id })
    res.render('./Pages/editmovie', { movies: result })
})

app.post('/editmovie/:id', async (req, res) => {
    var id = req.params.id;
    upload(req, res, async () => {
        try {
            var oldMovie = await movieModel.findOne({ _id: id });

            var details = {
                title: req.body.title,
                description: req.body.description,
                year: req.body.year,
                genre: req.body.genre,
                rating: req.body.rating,
            };

            if (!/^\d{4}$/.test(details.year)) {
                return res.status(400).send("Invalid year format.");
            }

            // Check if a new file is uploaded
            if (req.file) {
                // Delete old movie poster file
                if (oldMovie.movimage) {
                    fs.unlink(`upload/${oldMovie.movimage}`, (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Old image deleted successfully");
                        }
                    });
                }
                details.movimage = req.file.filename;
            } else {
                // If no new file is uploaded, retain the existing movie poster
                details.movimage = oldMovie.movimage;
            }

            // Update movie details
            await movieModel.updateOne({ _id: id }, details);
            res.redirect('/');
        } catch (error) {
            console.error(error);
        }
    });
})

app.listen(3000, () => {
    console.log('Server Start at 3000');
})