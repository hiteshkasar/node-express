const express = require('express');
const app = express();
const Joi = require('joi');
const cors = require('cors');

app.use(express.json());
app.use(cors());

const movies = [
    {id: 1, name: 'Kaho Na Pyaar Hai'},
    {id: 2, name: 'Zindagi Na Milegi Dobara'},
    {id: 3, name: 'Dil Dosti Duniyadari'},
    {id: 4, name: 'Kuch Kuch Hota Hai'}, 
];

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/movies', (req, res) => {
    res.send(movies);
});

app.post('/api/movies', (req, res) => {
    const {error} = validateMovie(req.body);  //{error} object is equivalent to result.error if we get result from const result
    if(error) return res.status(400).send(error.details[0].message);

    const movie = {
        id: movies.length + 1,
        name: req.body.name
    };
    movies.push(movie);
    res.send(movie);
});

app.put('/api/movies/:id', (req, res) => {
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    if(!movie) return res.status(404).send('The movie with given ID was not found.');

    const {error} = validateMovie(req.body);
    console.log(`${JSON.stringify(req.body)}`);
    if(error) return res.status(400).send(error.details[0].message);

    movie.name = req.body.name;
    res.send(movie);
});

function validateMovie(movie){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(movie, schema);
}

app.delete('/api/movies/:id', (req, res) => {
    const movie = isMovieFound(req.params.id);  //movies.find(m => m.id === parseInt(req.params.id));
    if(!movie) return res.status(404).send('The movie with given ID was not found.');

    const movieIndex = movies.indexOf(movie);
    movies.splice(movieIndex, 1);

    res.send(movie);
});

function isMovieFound(id){
    return movies.find(m => m.id === parseInt(id));
}

app.get('/api/movies/:id', (req, res) => {
    const requestedMovie = isMovieFound(req.params.id);  //movies.find(m => m.id === parseInt(req.params.id));
    if(!requestedMovie) return res.status(404).send('The movie with given ID was not found.')
    res.send(requestedMovie);
});

port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));