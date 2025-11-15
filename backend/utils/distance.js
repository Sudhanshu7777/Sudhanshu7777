/**
 * Calculate the distance between two points on Earth using the Haversine formula
 * @param {number} lat1 - Latitude of first point in decimal degrees
 * @param {number} lon1 - Longitude of first point in decimal degrees
 * @param {number} lat2 - Latitude of second point in decimal degrees
 * @param {number} lon2 - Longitude of second point in decimal degrees
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Find nearby locations within a specified radius
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @param {Array} locations - Array of location objects with latitude and longitude
 * @param {number} radiusKm - Search radius in kilometers
 * @returns {Array} Array of nearby locations with distance added
 */
function findNearbyLocations(userLat, userLon, locations, radiusKm = 5) {
  return locations
    .map(location => {
      const distance = calculateDistance(
        userLat, 
        userLon, 
        location.latitude, 
        location.longitude
      );
      
      return {
        ...location,
        distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
      };
    })
    .filter(location => location.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
}

module.exports = {
  calculateDistance,
  findNearbyLocations,
  toRadians
};