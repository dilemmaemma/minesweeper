const express = require('express')
const cors = require('cors')
const path = require('path')

const customBoardRouter = require('./customBoard/router')
const highscoreRouter = require('./highscore/router')

const server = express()

server.use(express.json())
server.use(cors())

server.get('/api/customboard', customBoardRouter)

server.get('/api/highscore', highscoreRouter)

server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })

server.use((req, res) => {
    res.status(404).json({
        message: `Endpoint [${req.method}] ${req.originalUrl} does not exist`,
    })
})

module.exports = server