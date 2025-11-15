exports.up = function(knex) {
  return knex.schema.createTable('recycling_plants', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.decimal('latitude', 10, 8).notNullable();
    table.decimal('longitude', 11, 8).notNullable();
    table.text('accepted_categories'); // JSON string of accepted categories
    table.string('contact');
    table.string('hours');
    table.boolean('uses_green_energy').defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('recycling_plants');
};