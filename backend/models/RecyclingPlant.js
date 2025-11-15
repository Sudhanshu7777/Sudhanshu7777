const db = require('../config/database');

class RecyclingPlant {
  static async getAll() {
    return await db('recycling_plants').select('*');
  }

  static async getById(id) {
    return await db('recycling_plants').where('id', id).first();
  }

  static async create(plant) {
    const [id] = await db('recycling_plants').insert(plant);
    return await db('recycling_plants').where('id', id).first();
  }

  static async update(id, plant) {
    await db('recycling_plants').where('id', id).update(plant);
    return await db('recycling_plants').where('id', id).first();
  }

  static async delete(id) {
    return await db('recycling_plants').where('id', id).del();
  }

  static async getByCategory(category) {
    return await db('recycling_plants')
      .whereRaw('JSON_EXTRACT(accepted_categories, ?) IS NOT NULL', [`$."${category}"`])
      .select('*');
  }

  static async getGreenEnergyPlants() {
    return await db('recycling_plants').where('uses_green_energy', true).select('*');
  }

  static async getNearby(latitude, longitude, radiusKm = 10) {
    const plants = await db('recycling_plants').select('*');
    const { findNearbyLocations } = require('../utils/distance');
    
    return findNearbyLocations(latitude, longitude, plants, radiusKm);
  }
}

module.exports = RecyclingPlant;