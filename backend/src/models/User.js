const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Ingresá un correo electrónico válido',
      ],
    },
    password: {
      type: String,
      required: function () { return !this.googleId; },
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      select: false, // No retorna el password en consultas directas
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    phone: {
      type: String,
      required: function () { return !this.googleId; },
      trim: true,
      default: '',
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    settings: {
      soundAlerts: { type: Boolean, default: true },
      vibration: { type: Boolean, default: true },
      incidentRadius: { type: Number, default: 5 },
      sosCountdown: { type: Number, default: 3 },
      highAccuracyLocation: { type: Boolean, default: true },
      shareLocationOnlyOnActiveRoute: { type: Boolean, default: true },
      darkMode: { type: Boolean, default: true },
      mapType: { type: String, default: 'standard' },
    },
  },
  {
    timestamps: true,
  }
);

// Hash de contraseña previo a guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para verificar contraseña
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
