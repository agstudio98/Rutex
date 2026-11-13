const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number], // [longitud, latitud] - Estándar GeoJSON
      required: true,
    },
  },
  { _id: false }
);

const routeSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es obligatorio para iniciar una sesión de ruta'],
      index: true,
    },
    origin: {
      type: pointSchema,
      required: [true, 'El punto de origen es obligatorio'],
    },
    destination: {
      type: pointSchema,
      required: [true, 'El punto de destino es obligatorio'],
    },
    currentLocation: {
      type: pointSchema,
      required: [true, 'La ubicación actual es obligatoria'],
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'alert'],
      default: 'active',
      index: true,
    },
    alertDetails: {
      triggeredAt: Date,
      reason: String,
    },
  },
  {
    timestamps: true,
  }
);

routeSessionSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('RouteSession', routeSessionSchema);
