const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository.cjs');

class AuthService {
  login(username, password) {
    if (!username || !password) {
      const error = new Error('Username dan password wajib diisi');
      error.statusCode = 400;
      throw error;
    }

    const user = userRepository.findByUsername(username);
    if (!user) {
      const error = new Error('Kredensial login tidak valid');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      const error = new Error('Kredensial login tidak valid');
      error.statusCode = 401;
      throw error;
    }

    const secretKey = process.env.JWT_SECRET || 'simadu-secret-uts-wse-2026-key-signature';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    const payload = {
      id: user.id,
      nama: user.nama,
      role: user.role
    };

    const token = jwt.sign(payload, secretKey, { expiresIn });

    return {
      token,
      user: {
        id: user.id,
        nama: user.nama,
        role: user.role
      }
    };
  }
}

module.exports = new AuthService();
