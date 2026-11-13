const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: 'JWT_SECRET no está configurado en el servidor' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      return next();
    } catch (error) {
      console.error('[Auth Middleware] Error al verificar token:', error.message);
      return res.status(401).json({ message: 'Token no válido o expirado' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado, token ausente' });
  }
};

module.exports = { protect };
