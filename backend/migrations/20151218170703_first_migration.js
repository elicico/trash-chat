
exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(table) {
    table.increments('id')
    table.text('username').notNullable().unique()
    table.text('bcrypt_password').notNullable()
  })

  .createTable('rooms', function(table) {
    table.increments('id')
    table.text('name').unique().notNullable()
  })

  .createTable('messages', function(table) {
    table.increments('id')
    table.text('message').notNullable()
    table.timestamp('sent_at').notNullable().defaultTo(knex.fn.now())
    table.integer('room_id').notNullable().index().references('id').inTable('rooms')
    table.integer('user_id').notNullable().references('id').inTable('users')
  })

};

exports.down = function(knex) {
  return knex.schema
    .dropTable('users')
    .dropTable('rooms')
    .dropTable('messages')
};
