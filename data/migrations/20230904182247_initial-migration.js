exports.up = async function(knex) {
    await knex.schema
      .createTable('difficulty', tbl => {
          tbl.increments('difficulty_id')
          tbl.string('difficulty', 12).notNullable()
      })
      .createTable('username', tbl => {
          tbl.increments('username_id')
          tbl.string('username', 15).notNullable()
          tbl.string('ip_address', 128).notNullable()
          tbl.integer('gamemode_id')
              .unsigned()
              .notNullable()
              .references('gamemode_id')
              .inTable('gamemode')
              .onDelete('CASCADE')
              .onUpdate('CASCADE')
      })
      .createTable('gamemode', tbl => {
          tbl.increments('gamemode_id')
          tbl.integer('time').notNullable()
          tbl.integer('difficulty_id')
              .unsigned()
              .notNullable()
              .references('difficulty_id')
              .inTable('difficulty')
              .onDelete('CASCADE')
              .onUpdate('CASCADE')
      })
  };
  
  exports.down = async function(knex) {
    await knex.schema
      .dropTableIfExists('gamemode')
      .dropTableIfExists('username')
      .dropTableIfExists('difficulty')
  };
  