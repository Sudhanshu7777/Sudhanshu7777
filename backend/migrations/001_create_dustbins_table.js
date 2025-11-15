exports.up = function(knex) {
  return knex.schema.createTable('dustbins', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.decimal('latitude', 10, 8).notNullable();
    table.decimal('longitude', 11, 8).notNullable();
    table.string('waste_category').notNullable();
    table.string('contact_number');
    table.string('opening_hours');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('dustbins');
};