const express = require('express');
const router = express.Router();
const pengaduanController = require('../controllers/pengaduanController.cjs');
const { authenticateToken } = require('../middleware/authMiddleware.cjs');
const {
  validateCreatePengaduan,
  validateUpdatePengaduan,
  validateUpdateStatus,
  validateIdParam
} = require('../middleware/validateMiddleware.cjs');

// Seluruh endpoint pengaduan dilindungi autentikasi Bearer Token
router.use(authenticateToken);

router.get('/', pengaduanController.getAll);
router.get('/:id', validateIdParam, pengaduanController.getById);
router.post('/', validateCreatePengaduan, pengaduanController.create);
router.put('/:id', validateIdParam, validateUpdatePengaduan, pengaduanController.update);
router.patch('/:id/status', validateIdParam, validateUpdateStatus, pengaduanController.updateStatus);
router.delete('/:id', validateIdParam, pengaduanController.delete);

module.exports = router;
