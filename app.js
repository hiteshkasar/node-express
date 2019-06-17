const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const Joi = require('joi');

app.use(bodyparser.json());

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'MovieDB'
});

mysqlConnection.connect((err) => {
    if(!err) console.log('database connection succeded');
    else console.log(`database connection failed ${err}`);
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

//lists all movies
app.get('/api/movies', (req, res) => {
    let sqlStatement = `CALL getMovies(?)`;
    mysqlConnection.query(sqlStatement, [null], (error, results, fields) => {
        if(error) return console.log(`${error.message}`);

        console.log(results);
        res.send(results);
    });
});

//create or add new movie to the list
app.post('/api/movies', (req, res) => {
    const {error} = validateMovie(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    let sqlStatement = `CALL postMovies(?)`;
    name = req.body.name;
    mysqlConnection.query(sqlStatement, [name], (error, results, fields) => {
        if(error) return console.log(`${error.message}`);

        console.log('Inserted successfully');
        res.send('Inserted successfully');
    });
});

//Update movie with given ID
app.put('/api/movies/:id', (req, res) => {
    const {error} = validateMovie(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    let sqlStatement = `CALL updateMovies(?, ?)`;
    id = parseInt(req.params.id);
    name = req.body.name;
    mysqlConnection.query(sqlStatement, [id, name], (error, results, fields) => {
        if(error) return console.log(`${error.message}`);

        console.log('Updated successfully');
        res.send('Updated successfully');
    });
});

//delete movie with given ID
app.delete('/api/movies/:id', (req, res) => {
    let sqlStatement = `CALL deleteMovies(?)`;
    id = parseInt(req.params.id);
    mysqlConnection.query(sqlStatement, [id], (error, results, fields) => {
        if(error) return console.log(`${error.message}`);

        console.log(`Deleted successfully with id ${id}`);
        res.send(`Deleted successfully with id ${id}`);
    });
});

//Return specific movie
app.get('/api/movies/:id', (req, res) => {
    let sqlStatement = `CALL getMovies(?)`;
    id = parseInt(req.params.id);
    mysqlConnection.query(sqlStatement, [id], (error, results, fields) => {
        if(error) return console.log(`${error.message}`);

        console.log(results[0]);
        res.send(results[0]);
    });
});

function validateMovie(movie){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(movie, schema);
}

port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});