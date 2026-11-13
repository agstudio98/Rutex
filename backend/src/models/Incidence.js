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
      type: [Number], // [longitud, latitud] - GeoJSON
      required: true,
    },
  },
  { _id: false }
);

const incidenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El autor de la incidencia es obligatorio'],
      index: true,
    },
    location: {
      type: pointSchema,
      required: [true, 'La ubicación geográfica de la incidencia es obligatoria'],
    },
    type: {
      type: String,
      required: [true, 'El tipo de incidencia es obligatorio'],
      enum: {
        values: [
          'sin_luz',
          'sospechoso',
          'arrebatos',
          'zona_peligrosa',
          'accidente',
          'otro',
        ],
        message: '{VALUE} no es un tipo de incidencia válido',
      },
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción no puede exceder los 500 caracteres'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índice 2dsphere para consultas geoespaciales ($near, $geoWithin)
incidenceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incidence', incidenceSchema);
