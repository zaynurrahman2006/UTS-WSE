const authService = require('../services/authService.cjs');

class AuthController {
  login(req, res, next) {
    try {
      const { username, password } = req.body;
      const result = authService.login(username, password);
      return res.status(200).json({
        success: true,
        message: 'Autentikasi berhasil',
        token: result.token,
        user: result.user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
