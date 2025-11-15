exports.up = function(knex) {
  return knex.schema.createTable('agencies', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('waste_type').notNullable();
    table.string('contact_number');
    table.string('email');
    table.string('jurisdiction');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('agencies');
};