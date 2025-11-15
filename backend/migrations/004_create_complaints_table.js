exports.up = function(knex) {
  return knex.schema.createTable('complaints', function(table) {
    table.increments('id').primary();
    table.string('user_name').notNullable();
    table.string('issue_category').notNullable();
    table.decimal('latitude', 10, 8);
    table.decimal('longitude', 11, 8);
    table.string('photo_url');
    table.text('description');
    table.string('tracking_id').unique().notNullable();
    table.string('status').defaultTo('pending'); // pending, in_progress, resolved
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('complaints');
};