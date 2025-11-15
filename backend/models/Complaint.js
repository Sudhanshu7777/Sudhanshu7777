const db = require('../config/database');

class Complaint {
  static async getAll() {
    return await db('complaints').select('*').orderBy('created_at', 'desc');
  }

  static async getById(id) {
    return await db('complaints').where('id', id).first();
  }

  static async getByTrackingId(trackingId) {
    return await db('complaints').where('tracking_id', trackingId).first();
  }

  static async create(complaint) {
    const [id] = await db('complaints').insert(complaint);
    return await db('complaints').where('id', id).first();
  }

  static async update(id, complaint) {
    await db('complaints').where('id', id).update(complaint);
    return await db('complaints').where('id', id).first();
  }

  static async updateStatus(id, status) {
    await db('complaints').where('id', id).update('status', status);
    return await db('complaints').where('id', id).first();
  }

  static async delete(id) {
    return await db('complaints').where('id', id).del();
  }

  static async getByStatus(status) {
    return await db('complaints').where('status', status).select('*').orderBy('created_at', 'desc');
  }

  static async getByUser(userName) {
    return await db('complaints').where('user_name', userName).select('*').orderBy('created_at', 'desc');
  }

  static generateTrackingId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `ECO-${timestamp}-${random}`.toUpperCase();
  }
}

module.exports = Complaint;