const db = require('../config/database');

class Dustbin {
  static async getAll() {
    return await db('dustbins').select('*');
  }

  static async getById(id) {
    return await db('dustbins').where('id', id).first();
  }

  static async create(dustbin) {
    const [id] = await db('dustbins').insert(dustbin);
    return await db('dustbins').where('id', id).first();
  }

  static async update(id, dustbin) {
    await db('dustbins').where('id', id).update(dustbin);
    return await db('dustbins').where('id', id).first();
  }

  static async delete(id) {
    return await db('dustbins').where('id', id).del();
  }

  static async getByWasteCategory(category) {
    return await db('dustbins').where('waste_category', category).select('*');
  }

  static async getNearby(latitude, longitude, radiusKm = 5) {
    const dustbins = await db('dustbins').select('*');
    const { findNearbyLocations } = require('../utils/distance');
    
    return findNearbyLocations(latitude, longitude, dustbins, radiusKm);
  }
}

module.exports = Dustbin;