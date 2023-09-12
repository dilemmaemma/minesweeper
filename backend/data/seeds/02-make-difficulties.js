const difficulty = [
    { difficulty: 'Easy' },
    { difficulty: 'Intermediate' },
    { difficulty: 'Expert' },
]

exports.seed = async function (knex) {
    await knex('difficulty').insert(difficulty)
}