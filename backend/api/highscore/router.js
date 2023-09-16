const router = require('express').Router()
const requestIp = require('request-ip')
const Highscore = require('./model')

router.use(requestIp.mw())

router.get('/test', (req, res) => {
    res.json({message: 'Custom board test route is working'})
})

router.get('/', (req, res, next) => {
    Highscore.find()
        .then(users => {
            res.json(users)
        })
        .catch(next)
    
})

router.get('/:username', (req, res, next) => {
    Highscore.findByUsername(req.params.username)
        .then(user => {
            res.json(user)
        })
        .catch(next)
})

router.post('/', (req, res, next) => {
    const { name, gamemode, seconds } = req.body
    const ip_address = req.clientIp

    if (!name || !gamemode || !seconds) {
        next({ status: 500, message: 'Must include name, gamemode, and total seconds' })
    }

    Highscore.add( name, gamemode, seconds, ip_address )
        .then(result => {
            res.status(201).json(result)
        })
        .catch(next)
})

module.exports = router