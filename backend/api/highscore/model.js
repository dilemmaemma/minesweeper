const db = require('../../data/dbConfig.js');

function find() {
    return db('username as u')
        .leftJoin('gamemode as g', 'u.gamemode_id', 'g.gamemode_id')
        .leftJoin('difficulty as d', 'g.difficulty_id', 'd.difficulty_id')
        .select('u.name', 'g.time', 'd.difficulty')
        .orderBy('g.time')
}

function findByUsername({username}) {
    return db('username as u')
        .leftJoin('gamemode as g', 'u.gamemode_id', 'g.gamemode_id')
        .leftJoin('difficulty as d', 'g.difficulty_id', 'd.difficulty_id')
        .select('u.name', 'g.time', 'd.difficulty')
        .where('u.username', username)
        .orderBy('g.time')
}

async function add({ name, gamemode, seconds, ip_address }) {
    let created_user

    await db.transaction(async trx => {
        let difficulty_id_to_use
        const [difficulty] = await trx('difficulty').where('difficulty', gamemode)
    
        if (difficulty) {
            difficulty_id_to_use = difficulty.difficulty_id
        } else {
            throw new Error('Unidentified gamemode')
        }
    
        let username_id_to_use
        const [username] = await trx('username').where('name', username)
    
        if (username) {
            username_id_to_use = username.username_id
        } else {
            const [username_id] = await trx('username').insert({ username_id: username_id })
            username_id_to_use = username_id
        }
    
        let gamemode_id_to_use
        const [time] = await trx('gamemode'.where('time', time))
    
        if (time) {
            gamemode_id_to_use = time.gamemode_id
        } else {
            const [gamemode_id] = await trx('gamemode').insert({ gamemode_id: gamemode_id })
            gamemode_id_to_use = gamemode_id
        }
    
        const [names] = await trx('username').insert({ username_id: username_id_to_use, name, ip_address, gamemode_id: gamemode_id_to_use})
        await trx('gamemode').insert({ gamemode_id: gamemode_id_to_use, seconds, difficulty_id: difficulty_id_to_use })
    
        created_user = names
        
        return findByUsername(created_user.name)
    })
}

module.exports = {
    find,
    findByUsername,
    add
}