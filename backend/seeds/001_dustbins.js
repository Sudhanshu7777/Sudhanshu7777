const dustbins = [
  {
    name: 'Central Park Dustbin',
    latitude: 40.7829,
    longitude: -73.9654,
    waste_category: 'mixed',
    contact_number: '+1-212-555-0101',
    opening_hours: '6:00 AM - 10:00 PM'
  },
  {
    name: 'Times Square Recycling',
    latitude: 40.7580,
    longitude: -73.9855,
    waste_category: 'recyclable',
    contact_number: '+1-212-555-0102',
    opening_hours: '24/7'
  },
  {
    name: 'Brooklyn Bridge Park Bin',
    latitude: 40.7029,
    longitude: -73.9965,
    waste_category: 'mixed',
    contact_number: '+1-718-555-0101',
    opening_hours: '7:00 AM - 9:00 PM'
  },
  {
    name: 'Union Square Compost',
    latitude: 40.7359,
    longitude: -73.9911,
    waste_category: 'organic',
    contact_number: '+1-212-555-0103',
    opening_hours: '8:00 AM - 8:00 PM'
  },
  {
    name: 'High Line E-Waste',
    latitude: 40.7480,
    longitude: -74.0048,
    waste_category: 'electronic',
    contact_number: '+1-212-555-0104',
    opening_hours: '9:00 AM - 6:00 PM'
  },
  {
    name: 'Battery Park Green Bin',
    latitude: 40.7033,
    longitude: -74.0170,
    waste_category: 'organic',
    contact_number: '+1-212-555-0105',
    opening_hours: '6:00 AM - 10:00 PM'
  },
  {
    name: 'Madison Square Recycling',
    latitude: 40.7420,
    longitude: -73.9876,
    waste_category: 'recyclable',
    contact_number: '+1-212-555-0106',
    opening_hours: '7:00 AM - 9:00 PM'
  },
  {
    name: 'Washington Square Bin',
    latitude: 40.7308,
    longitude: -73.9973,
    waste_category: 'mixed',
    contact_number: '+1-212-555-0107',
    opening_hours: '24/7'
  },
  {
    name: 'Hudson River Park Compost',
    latitude: 40.7165,
    longitude: -74.0117,
    waste_category: 'organic',
    contact_number: '+1-212-555-0108',
    opening_hours: '8:00 AM - 7:00 PM'
  },
  {
    name: 'Chelsea Market E-Waste',
    latitude: 40.7465,
    longitude: -74.0074,
    waste_category: 'electronic',
    contact_number: '+1-212-555-0109',
    opening_hours: '10:00 AM - 6:00 PM'
  }
];

exports.seed = function(knex) {
  return knex('dustbins')
    .del()
    .then(function () {
      return knex('dustbins').insert(dustbins);
    });
};