const express = require('express');
const cors = require('cors');
// const path = require('path');

const customBoardRouter = require('./customBoard/router.js');
const highscoreRouter = require('./highscore/router');

const server = express();

server.use(express.json());
server.use(cors());

server.use('/api/customboard', customBoardRouter);

server.use('/api/highscore', highscoreRouter);

server.use((err, req, res, next) => { // eslint-disable-line
    res.status(err.status || 500).json({
      message: err.message,
      stack: err.stack,
    });
  });

// server.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../dist/index.html'));
// });

module.exports = server