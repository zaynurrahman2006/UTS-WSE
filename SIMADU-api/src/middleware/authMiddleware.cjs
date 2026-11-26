const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak: Token autentikasi tidak ditemukan atau format salah (gunakan Bearer Token)'
    });
  }

  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET || 'simadu-secret-uts-wse-2026-key-signature';

  jwt.verify(token, secretKey, (err, decodedUser) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak: Token tidak valid atau sudah kedaluwarsa'
      });
    }

    req.user = decodedUser;
    next();
  });
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak: Anda tidak memiliki role yang diizinkan untuk operasi ini'
      });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole
};
