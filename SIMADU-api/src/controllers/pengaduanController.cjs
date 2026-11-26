const pengaduanService = require('../services/pengaduanService.cjs');

class PengaduanController {
  getAll(req, res, next) {
    try {
      const data = pengaduanService.getAll(req.user);
      return res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  getById(req, res, next) {
    try {
      const data = pengaduanService.getById(req.params.id, req.user);
      return res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  create(req, res, next) {
    try {
      const data = pengaduanService.create(req.validatedBody, req.user);
      return res.status(201).json({
        success: true,
        message: 'Pengaduan berhasil ditambahkan',
        data
      });
    } catch (error) {
      next(error);
    }
  }

  update(req, res, next) {
    try {
      const data = pengaduanService.update(req.params.id, req.validatedBody, req.user);
      return res.status(200).json({
        success: true,
        message: 'Pengaduan berhasil diperbarui',
        data
      });
    } catch (error) {
      next(error);
    }
  }

  updateStatus(req, res, next) {
    try {
      const data = pengaduanService.updateStatus(req.params.id, req.validatedStatus, req.user);
      return res.status(200).json({
        success: true,
        message: 'Status pengaduan berhasil diperbarui',
        data
      });
    } catch (error) {
      next(error);
    }
  }

  delete(req, res, next) {
    try {
      pengaduanService.delete(req.params.id, req.user);
      return res.status(200).json({
        success: true,
        message: 'Pengaduan berhasil dihapus'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PengaduanController();
