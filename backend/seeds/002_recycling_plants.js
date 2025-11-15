const recyclingPlants = [
  {
    name: 'NYC Recycling Center',
    latitude: 40.7128,
    longitude: -74.0060,
    accepted_categories: JSON.stringify({
      plastic: true,
      paper: true,
      glass: true,
      metal: true,
      electronic: false,
      organic: false
    }),
    contact: '+1-212-555-0201',
    hours: '6:00 AM - 8:00 PM',
    uses_green_energy: true
  },
  {
    name: 'Brooklyn Materials Recovery',
    latitude: 40.6782,
    longitude: -73.9442,
    accepted_categories: JSON.stringify({
      plastic: true,
      paper: true,
      glass: false,
      metal: true,
      electronic: true,
      organic: false
    }),
    contact: '+1-718-555-0201',
    hours: '7:00 AM - 7:00 PM',
    uses_green_energy: false
  },
  {
    name: 'Queens Green Recycling',
    latitude: 40.7282,
    longitude: -73.7949,
    accepted_categories: JSON.stringify({
      plastic: true,
      paper: true,
      glass: true,
      metal: true,
      electronic: false,
      organic: true
    }),
    contact: '+1-718-555-0202',
    hours: '8:00 AM - 6:00 PM',
    uses_green_energy: true
  }
];

exports.seed = function(knex) {
  return knex('recycling_plants')
    .del()
    .then(function () {
      return knex('recycling_plants').insert(recyclingPlants);
    });
};