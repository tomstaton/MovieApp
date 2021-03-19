const express = require('express');
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use(myLogger);

app.use(requestTime);

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

app.get('/movies/:genre', (req, res)  => {
  res.send('Successful get request of specific genre');
});

app.get('/movies/:director', (req, res) => {
  res.send('Successful get request of director info');
});

app.post('/users', (req, res) => {
  res.send('Successful post request of new user');
});

app.put('/users/:userName/:newName', (req, res) => {
  res.send('Successful post request of updated username');
});

app.post('/users/:movieList/:newMovie', (req, res) => {
  res.send('Successful post request of new movie to list of favorites');
});

app.delete('/movieList/:movieTitle', (req, res) => {
  res.send('Successful delete request of movie from list of favorites');
});

app.delete('/users/:userName', (req, res) => {
  res.send('Successful delete request of user');
});

app.listen(8080, () => {
  console.log('app is running');
});