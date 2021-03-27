const express = require('express');
  morgan = require('morgan');
  bodyParser = require('body-parser'),
  uuid = require('uuid')

const app = express();

app.use(morgan('common'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//app.use(myLogger);

//app.use(requestTime);

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

app.get('/users', (req, res) => {
  res.send('Successful get request of list of users');
})

app.post('/users/:adduser', (req, res) => {
  res.send('Successful post request of new user');
});

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

app.listen(8080, () => {
  console.log('app is running');
});