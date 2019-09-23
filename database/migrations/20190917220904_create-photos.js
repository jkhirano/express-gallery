exports.up = function(knex, Promise) {
  return knex.schema.createTable("photos", table => {
    table.increments();
    table.string("author").notNullable();
    table.string("link").notNullable();
    table.string("description").notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("photos");
};
