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
  res.json(topMovies)
});

app.listen(8080, () => {
  console.log('app is running');
});