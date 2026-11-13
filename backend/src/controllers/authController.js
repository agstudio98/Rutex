const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

let googleCertificates = null;
let googleCertificatesExpireAt = 0;

const verifyGoogleIdToken = async (idToken) => {
  if (typeof idToken !== 'string') throw new Error('Token de Google inválido');
  const [encodedHeader, encodedPayload, encodedSignature] = idToken.split('.');
  if (!encodedHeader || !encodedPayload || !encodedSignature) throw new Error('Token de Google inválido');

  const header = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString('utf8'));
  const claims = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
  if (header.alg !== 'RS256' || !header.kid) throw new Error('Firma de Google inválida');

  const allowedAudiences = [
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_WEB_CLIENT_ID,
    process.env.GOOGLE_ANDROID_CLIENT_ID,
    process.env.GOOGLE_IOS_CLIENT_ID,
  ].filter(Boolean);
  if (!allowedAudiences.length) throw new Error('Google OAuth no está configurado en el servidor');

  if (!googleCertificates || Date.now() >= googleCertificatesExpireAt) {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/certs');
    if (!response.ok) throw new Error('No se pudieron obtener los certificados de Google');
    googleCertificates = await response.json();
    const maxAge = Number(response.headers.get('cache-control')?.match(/max-age=(\d+)/)?.[1] || 3600);
    googleCertificatesExpireAt = Date.now() + maxAge * 1000;
  }

  const publicCertificate = googleCertificates.keys?.find((key) => key.kid === header.kid);
  if (!publicCertificate) {
    googleCertificates = null;
    throw new Error('Firma de Google desconocida');
  }
  const signedContent = Buffer.from(`${encodedHeader}.${encodedPayload}`);
  const signature = Buffer.from(encodedSignature, 'base64url');
  const publicKey = crypto.createPublicKey({ key: publicCertificate, format: 'jwk' });
  if (!crypto.verify('RSA-SHA256', signedContent, publicKey, signature)) throw new Error('Firma de Google inválida');

  const now = Math.floor(Date.now() / 1000);
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!['accounts.google.com', 'https://accounts.google.com'].includes(claims.iss)
    || !audiences.some((audience) => allowedAudiences.includes(audience))
    || claims.exp <= now
    || claims.iat > now + 60
    || claims.email_verified !== true
    || !claims.sub || !claims.email) {
    throw new Error('El token de Google no es válido para esta aplicación');
  }
  return claims;
};

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está configurado en el servidor');
  }
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: 'Por favor completá todos los campos obligatorios: name, email, password, phone',
      });
    }

    if (!/^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(name.trim()) || name.trim().length < 2 || name.trim().length > 50) {
      return res.status(400).json({ message: 'El nombre debe tener entre 2 y 50 letras; se permiten espacios, apóstrofes y guiones.' });
    }
    if (password.length < 8 || password.length > 64 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9\s]/.test(password)) {
      return res.status(400).json({ message: 'La contraseña requiere 8 caracteres, mayúscula, minúscula, número y símbolo.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      contacts: [],
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        contacts: user.contacts,
      },
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    return res.status(500).json({ message: 'Error en el servidor al registrar el usuario', error: error.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const claims = await verifyGoogleIdToken(req.body?.idToken);
    const email = claims.email.toLowerCase();
    let user = await User.findOne({ $or: [{ googleId: claims.sub }, { email }] });

    if (user) {
      if (user.googleId && user.googleId !== claims.sub) {
        return res.status(401).json({ message: 'La cuenta de Google no coincide con esta cuenta.' });
      }
      if (!user.googleId) {
        user.googleId = claims.sub;
        await user.save();
      }
    } else {
      user = await User.create({
        name: (claims.name || email.split('@')[0]).slice(0, 50),
        email,
        googleId: claims.sub,
        phone: '',
        contacts: [],
      });
    }

    const token = generateToken(user._id);
    return res.status(200).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, contacts: user.contacts },
    });
  } catch (error) {
    const status = error.message?.includes('no está configurado') ? 503 : 401;
    console.error('[Google Login Error]:', error.message);
    return res.status(status).json({ message: error.message || 'No se pudo validar la cuenta de Google' });
  }
};

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor ingresá email y contraseña' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        contacts: user.contacts,
      },
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    return res.status(500).json({ message: 'Error en el servidor al iniciar sesión', error: error.message });
  }
};

// @desc    Obtener perfil del usuario autenticado
// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('contacts', 'name email phone');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('[Profile Error]:', error);
    return res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
  }
};

// @desc    Agregar contacto de confianza
// @route   POST /api/auth/contacts
const addContact = async (req, res) => {
  try {
    const { contactEmail } = req.body;
    if (!contactEmail) {
      return res.status(400).json({ message: 'Debes enviar el email del contacto' });
    }

    const contactUser = await User.findOne({ email: contactEmail });
    if (!contactUser) {
      return res.status(404).json({ message: 'No se encontró un usuario con ese email' });
    }

    if (contactUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'No puedes agregarte a ti mismo como contacto' });
    }

    const currentUser = await User.findById(req.user._id);
    if (currentUser.contacts.includes(contactUser._id)) {
      return res.status(400).json({ message: 'El usuario ya está en tu lista de contactos' });
    }

    currentUser.contacts.push(contactUser._id);
    await currentUser.save();

    const updatedUser = await User.findById(req.user._id).populate('contacts', 'name email phone');

    return res.status(200).json({
      success: true,
      message: 'Contacto agregado con éxito',
      contacts: updatedUser.contacts,
    });
  } catch (error) {
    console.error('[Add Contact Error]:', error);
    return res.status(500).json({ message: 'Error al agregar contacto', error: error.message });
  }
};

// @desc    Actualizar perfil y configuraciones del usuario
// @route   PUT /api/auth/profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.phone) user.phone = req.body.phone.trim();
    if (req.body.settings) {
      user.settings = {
        ...(user.settings || {}),
        ...req.body.settings,
      };
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id)
      .populate('contacts', 'name email phone');

    return res.status(200).json({
      success: true,
      message: 'Perfil y configuraciones actualizadas correctamente',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        contacts: updatedUser.contacts,
        settings: updatedUser.settings,
      },
    });
  } catch (error) {
    console.error('[Update Profile Error]:', error);
    return res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  getUserProfile,
  updateUserProfile,
  addContact,
};
