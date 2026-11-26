const pengaduanRepository = require('../repositories/pengaduanRepository.cjs');

class PengaduanService {
  getAll(currentUser) {
    if (currentUser.role === 'admin') {
      return pengaduanRepository.getAll();
    }
    return pengaduanRepository.getByMahasiswaId(currentUser.id);
  }

  getById(id, currentUser) {
    const pengaduan = pengaduanRepository.getById(id);
    if (!pengaduan) {
      const error = new Error(`Pengaduan dengan ID ${id} tidak ditemukan`);
      error.statusCode = 404;
      throw error;
    }

    if (currentUser.role === 'mahasiswa' && pengaduan.mahasiswaId !== currentUser.id) {
      const error = new Error('Akses ditolak: Anda tidak memiliki akses ke pengaduan mahasiswa lain');
      error.statusCode = 403;
      throw error;
    }

    return pengaduan;
  }

  create({ judul, kategori, deskripsi }, currentUser) {
    if (currentUser.role !== 'mahasiswa') {
      const error = new Error('Akses ditolak: Administrator tidak diperbolehkan membuat pengaduan');
      error.statusCode = 403;
      throw error;
    }

    return pengaduanRepository.create({
      mahasiswaId: currentUser.id,
      judul,
      kategori,
      deskripsi
    });
  }

  update(id, { judul, kategori, deskripsi }, currentUser) {
    const existing = pengaduanRepository.getById(id);
    if (!existing) {
      const error = new Error(`Pengaduan dengan ID ${id} tidak ditemukan`);
      error.statusCode = 404;
      throw error;
    }

    if (currentUser.role !== 'mahasiswa' || existing.mahasiswaId !== currentUser.id) {
      const error = new Error('Akses ditolak: Hanya mahasiswa pemilik pengaduan yang dapat mengubah data');
      error.statusCode = 403;
      throw error;
    }

    if (existing.status !== 'diajukan') {
      const error = new Error(`Pengaduan berstatus '${existing.status}' tidak dapat diubah lagi`);
      error.statusCode = 400;
      throw error;
    }

    return pengaduanRepository.update(id, { judul, kategori, deskripsi });
  }

  updateStatus(id, newStatus, currentUser) {
    if (currentUser.role !== 'admin') {
      const error = new Error('Akses ditolak: Hanya administrator yang dapat memperbarui status penanganan');
      error.statusCode = 403;
      throw error;
    }

    const existing = pengaduanRepository.getById(id);
    if (!existing) {
      const error = new Error(`Pengaduan dengan ID ${id} tidak ditemukan`);
      error.statusCode = 404;
      throw error;
    }

    return pengaduanRepository.updateStatus(id, newStatus);
  }

  delete(id, currentUser) {
    const existing = pengaduanRepository.getById(id);
    if (!existing) {
      const error = new Error(`Pengaduan dengan ID ${id} tidak ditemukan`);
      error.statusCode = 404;
      throw error;
    }

    if (currentUser.role !== 'mahasiswa' || existing.mahasiswaId !== currentUser.id) {
      const error = new Error('Akses ditolak: Hanya mahasiswa pemilik pengaduan yang dapat menghapus data');
      error.statusCode = 403;
      throw error;
    }

    if (existing.status !== 'diajukan') {
      const error = new Error(`Pengaduan berstatus '${existing.status}' tidak dapat dihapus`);
      error.statusCode = 400;
      throw error;
    }

    pengaduanRepository.delete(id);
    return true;
  }
}

module.exports = new PengaduanService();
