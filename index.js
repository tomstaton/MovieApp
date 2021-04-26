const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

uuid = require('uuid')

const app = express();
app.use(bodyParser.json());

app.use(morgan('common'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

mongoose.createConnection('mongodb://localhost:27017/movies', 
{ useNewUrlParser: true, useUnifiedTopology: true });

//app.use(myLogger);

//app.use(requestTime);
/*
let topMovies = [
  {
    title: 'Zodiac',
  },
  {
    title: 'Superbad'
  },
  {
    title: 'The Thing'
  },
  {
    title: 'Rosemary\'s baby'
  },
  {
    title: 'After Hours'
  },
  {
    title: 'Once Upon a Time... In Hollywood'
  },
  {
    title: 'The Apartment'
  },
  {
    title: 'Inside Llewyn Davis'
  },
  {
    title: 'A Star is Born'
  },
  {
    title: 'The Evil Dead 2'
  }
];

app.use(express.static('public'));

// GET requests
app.get('/', (req, res) => {
  res.send('My top movies');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', {root:__dirname});
});

app.get('/movies', (req, res) => {
  res.send('Successful get requests returning data on all movies');
});

app.get('/movies/:movie', (req, res) => {
  res.send('Successful get request of specific movie');
});

app.get('/movies/genres/:genre', (req, res)  => {
  res.send('Successful get request of a specific genre');
});

app.get('/movies/directors/:director', (req, res) => {
  res.send('Successful get request of director info');
});

//
/*
app.get('/users', (req, res) => {
  res.send('Successful get request of list of users');
})
*/

app.get('/users', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

//Add a user
/*JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});
/*
app.put('/users/:userName', (req, res) => {
  res.send('Successful update request of updated username');
});

app.put('/movies/:addmovie', (req, res) => {
  res.send('Successful post request of new movie to list of favorites');
});

app.delete('/movies/:movieTitle', (req, res) => {
  res.send('Successful delete request of movie from list of favorites');
});

app.delete('/users/:userName', (req, res) => {
  res.send('Successful delete request of user');
});
*/
app.listen(8080, () => {
  console.log('app is running');
});