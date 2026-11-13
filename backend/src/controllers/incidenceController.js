const Incidence = require('../models/Incidence');

// @desc    Crear nueva incidencia comunitaria
// @route   POST /api/incidences
const createIncidence = async (req, res) => {
  try {
    const { type, description, latitude, longitude } = req.body;

    if (!type || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        message: 'Tipo de incidencia, latitud y longitud son requeridos',
      });
    }

    const incidence = await Incidence.create({
      userId: req.user._id,
      type,
      description: description || '',
      location: {
        type: 'Point',
        coordinates: [Number(longitude), Number(latitude)], // GeoJSON: [lng, lat]
      },
      timestamp: new Date(),
    });

    const populatedIncidence = await Incidence.findById(incidence._id).populate(
      'userId',
      'name phone'
    );

    return res.status(201).json({
      success: true,
      incidence: populatedIncidence,
    });
  } catch (error) {
    console.error('[Create Incidence Error]:', error);
    return res.status(500).json({
      message: 'Error al registrar la incidencia',
      error: error.message,
    });
  }
};

// @desc    Obtener incidencias cercanas según coordenadas
// @route   GET /api/incidences/nearby?lat=...&lng=...&distance=...
const getNearbyIncidences = async (req, res) => {
  try {
    const { lat, lng, distance = 5000 } = req.query; // Distancia en metros (por defecto 5 km)

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        message: 'Debes proporcionar parámetros de latitud (lat) y longitud (lng)',
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    const incidences = await Incidence.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: parseInt(distance, 10),
        },
      },
    })
      .sort({ createdAt: -1 })
      .populate('userId', 'name')
      .limit(50);

    return res.status(200).json({
      success: true,
      count: incidences.length,
      incidences,
    });
  } catch (error) {
    console.error('[Nearby Incidences Error]:', error);
    return res.status(500).json({
      message: 'Error al consultar incidencias cercanas',
      error: error.message,
    });
  }
};

// @desc    Obtener todas las incidencias recientes
// @route   GET /api/incidences
const getAllIncidences = async (req, res) => {
  try {
    const incidences = await Incidence.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('userId', 'name');

    return res.status(200).json({
      success: true,
      count: incidences.length,
      incidences,
    });
  } catch (error) {
    console.error('[All Incidences Error]:', error);
    return res.status(500).json({
      message: 'Error al listar incidencias',
      error: error.message,
    });
  }
};

module.exports = {
  createIncidence,
  getNearbyIncidences,
  getAllIncidences,
};
