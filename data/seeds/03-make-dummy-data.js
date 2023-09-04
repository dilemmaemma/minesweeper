const username = [
    { name: 'ScoreMaster99', ip_address: '192.168.1.100', gamemode_id: 1 },
    { name: 'TopScorer2023', ip_address: '10.0.0.45', gamemode_id: 2 },
    { name: 'GameChampion42', ip_address: '172.16.0.255', gamemode_id: 3 }
]

const gamemode = [
    { time: 90, difficulty_id: 1 },
    { time: 180, difficulty_id: 2 },
    { time: 300, difficulty_id: 3 },
]

exports.seed = async function (knex) {
    await knex('gamemode').insert(gamemode)
    await knex('username').insert(username)
}