const RouteSession = require('../models/RouteSession');

// @desc    Iniciar nueva sesión de trayecto/acompañamiento
// @route   POST /api/routes
const createRouteSession = async (req, res) => {
  try {
    const { origin, destination, currentLocation } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({
        message: 'Los puntos de origen y destino son requeridos',
      });
    }

    const current = currentLocation || origin;

    const session = await RouteSession.create({
      userId: req.user._id,
      origin: {
        type: 'Point',
        coordinates: [Number(origin.longitude), Number(origin.latitude)],
      },
      destination: {
        type: 'Point',
        coordinates: [Number(destination.longitude), Number(destination.latitude)],
      },
      currentLocation: {
        type: 'Point',
        coordinates: [Number(current.longitude), Number(current.latitude)],
      },
      status: 'active',
    });

    const populatedSession = await RouteSession.findById(session._id).populate({
      path: 'userId',
      select: 'name phone contacts',
      populate: { path: 'contacts', select: 'name phone' },
    });

    return res.status(201).json({
      success: true,
      session: populatedSession,
    });
  } catch (error) {
    console.error('[Create Route Session Error]:', error);
    return res.status(500).json({
      message: 'Error al iniciar la sesión de ruta',
      error: error.message,
    });
  }
};

// @desc    Obtener detalles de una sesión de trayecto por ID
// @route   GET /api/routes/:id
const getRouteSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await RouteSession.findById(id).populate({
      path: 'userId',
      select: 'name phone contacts',
      populate: { path: 'contacts', select: 'name phone' },
    });

    if (!session) {
      return res.status(404).json({ message: 'Sesión de ruta no encontrada' });
    }

    return res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('[Get Route Session Error]:', error);
    return res.status(500).json({
      message: 'Error al obtener la sesión de ruta',
      error: error.message,
    });
  }
};

// @desc    Actualizar estado de una sesión (completed, alert, active)
// @route   PATCH /api/routes/:id/status
const updateRouteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!['active', 'completed', 'alert'].includes(status)) {
      return res.status(400).json({ message: 'Estado no válido' });
    }

    const updateData = { status };
    if (status === 'alert') {
      updateData.alertDetails = {
        triggeredAt: new Date(),
        reason: reason || 'Alerta de emergencia activada por el usuario',
      };
    }

    const session = await RouteSession.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!session) {
      return res.status(404).json({ message: 'Sesión no encontrada' });
    }

    return res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('[Update Route Status Error]:', error);
    return res.status(500).json({
      message: 'Error al actualizar el estado de la ruta',
      error: error.message,
    });
  }
};

// @desc    Obtener sesión activa del usuario autenticado
// @route   GET /api/routes/active/current
const getUserActiveSession = async (req, res) => {
  try {
    const session = await RouteSession.findOne({
      userId: req.user._id,
      status: { $in: ['active', 'alert'] },
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('[Get Active Session Error]:', error);
    return res.status(500).json({
      message: 'Error al buscar sesión activa',
      error: error.message,
    });
  }
};

module.exports = {
  createRouteSession,
  getRouteSessionById,
  updateRouteStatus,
  getUserActiveSession,
};
