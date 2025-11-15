const agencies = [
  {
    name: 'NYC Department of Sanitation',
    waste_type: 'general',
    contact_number: '+1-212-555-0301',
    email: 'dsny@nyc.gov',
    jurisdiction: 'Manhattan'
  },
  {
    name: 'Environmental Protection Agency NYC',
    waste_type: 'hazardous',
    contact_number: '+1-212-555-0302',
    email: 'epa.nyc@epa.gov',
    jurisdiction: 'All Boroughs'
  }
];

exports.seed = function(knex) {
  return knex('agencies')
    .del()
    .then(function () {
      return knex('agencies').insert(agencies);
    });
};