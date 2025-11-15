const db = require('../config/database');

class Agency {
  static async getAll() {
    return await db('agencies').select('*');
  }

  static async getById(id) {
    return await db('agencies').where('id', id).first();
  }

  static async create(agency) {
    const [id] = await db('agencies').insert(agency);
    return await db('agencies').where('id', id).first();
  }

  static async update(id, agency) {
    await db('agencies').where('id', id).update(agency);
    return await db('agencies').where('id', id).first();
  }

  static async delete(id) {
    return await db('agencies').where('id', id).del();
  }

  static async getByWasteType(wasteType) {
    return await db('agencies').where('waste_type', wasteType).select('*');
  }

  static async getByJurisdiction(jurisdiction) {
    return await db('agencies').where('jurisdiction', jurisdiction).select('*');
  }
}

module.exports = Agency;