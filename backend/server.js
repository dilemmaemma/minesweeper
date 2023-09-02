const express = require('express')
const cors = require('cors')
const path = require('path')

const server = express()

server.use(express.json())
server.use(cors())

server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })

server.use((req, res) => {
    res.status(404).json({
        message: `Endpoint [${req.method}] ${req.originalUrl} does not exist`,
    })
})

module.exports = server