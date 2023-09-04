exports.up = async function(knex) {
  await knex.schema
    .createTable('username', tbl => {
        tbl.increments('username_id')
        tbl.string('username', 15).notNullable()
        tbl.string('ip_address', 32).notNullable()
        tbl.integer([FOREIGN KEY HERE])
    })
};

exports.down = function(knex) {
  
};
