const Dustbin = require('../models/Dustbin');

const getAllDustbins = async (req, res) => {
  try {
    const dustbins = await Dustbin.getAll();
    res.status(200).json({
      success: true,
      data: dustbins,
      count: dustbins.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dustbins',
      error: error.message
    });
  }
};

const getDustbinById = async (req, res) => {
  try {
    const { id } = req.params;
    const dustbin = await Dustbin.getById(id);
    
    if (!dustbin) {
      return res.status(404).json({
        success: false,
        message: 'Dustbin not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: dustbin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dustbin',
      error: error.message
    });
  }
};

const getNearbyDustbins = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }
    
    const dustbins = await Dustbin.getNearby(
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(radius)
    );
    
    res.status(200).json({
      success: true,
      data: dustbins,
      count: dustbins.length,
      search_params: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius: parseFloat(radius)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error finding nearby dustbins',
      error: error.message
    });
  }
};

const getDustbinsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const dustbins = await Dustbin.getByWasteCategory(category);
    
    res.status(200).json({
      success: true,
      data: dustbins,
      count: dustbins.length,
      category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dustbins by category',
      error: error.message
    });
  }
};

const createDustbin = async (req, res) => {
  try {
    const dustbin = await Dustbin.create(req.body);
    res.status(201).json({
      success: true,
      data: dustbin,
      message: 'Dustbin created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating dustbin',
      error: error.message
    });
  }
};

const updateDustbin = async (req, res) => {
  try {
    const { id } = req.params;
    const dustbin = await Dustbin.update(id, req.body);
    
    if (!dustbin) {
      return res.status(404).json({
        success: false,
        message: 'Dustbin not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: dustbin,
      message: 'Dustbin updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating dustbin',
      error: error.message
    });
  }
};

const deleteDustbin = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Dustbin.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Dustbin not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Dustbin deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting dustbin',
      error: error.message
    });
  }
};

module.exports = {
  getAllDustbins,
  getDustbinById,
  getNearbyDustbins,
  getDustbinsByCategory,
  createDustbin,
  updateDustbin,
  deleteDustbin
};