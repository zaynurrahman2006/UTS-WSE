const VALID_KATEGORI = ['Fasilitas', 'Akademik', 'TI'];
const VALID_STATUS = ['diajukan', 'diproses', 'selesai'];

function validateCreatePengaduan(req, res, next) {
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({
      success: false,
      message: 'Format request body harus berupa objek JSON valid'
    });
  }

  // Tolak field terlarang yang tidak boleh diatur secara bebas oleh client
  const forbiddenFields = ['id', 'mahasiswaId', 'status', 'createdAt'];
  const injectedFields = forbiddenFields.filter(f => Object.prototype.hasOwnProperty.call(body, f));
  if (injectedFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Field '${injectedFields.join(', ')}' tidak boleh ditentukan oleh client`
    });
  }

  const { judul, kategori, deskripsi } = body;

  if (!judul || typeof judul !== 'string' || judul.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Field wajib kosong atau tidak valid: judul wajib diisi dengan teks'
    });
  }

  if (!kategori || typeof kategori !== 'string' || kategori.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Field wajib kosong atau tidak valid: kategori wajib diisi'
    });
  }

  if (!VALID_KATEGORI.includes(kategori.trim())) {
    return res.status(400).json({
      success: false,
      message: `Kategori '${kategori}' tidak valid. Pilihan kategori: ${VALID_KATEGORI.join(', ')}`
    });
  }

  if (!deskripsi || typeof deskripsi !== 'string' || deskripsi.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Field wajib kosong atau tidak valid: deskripsi wajib diisi dengan teks'
    });
  }

  req.validatedBody = {
    judul: judul.trim(),
    kategori: kategori.trim(),
    deskripsi: deskripsi.trim()
  };

  next();
}

function validateUpdatePengaduan(req, res, next) {
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({
      success: false,
      message: 'Format request body harus berupa objek JSON valid'
    });
  }

  const forbiddenFields = ['id', 'mahasiswaId', 'status', 'createdAt'];
  const injectedFields = forbiddenFields.filter(f => Object.prototype.hasOwnProperty.call(body, f));
  if (injectedFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Field '${injectedFields.join(', ')}' tidak boleh diubah melalui endpoint ini`
    });
  }

  const { judul, kategori, deskripsi } = body;

  if (!judul || typeof judul !== 'string' || judul.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Field judul wajib diisi dengan teks valid'
    });
  }

  if (!kategori || typeof kategori !== 'string' || kategori.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Field kategori wajib diisi'
    });
  }

  if (!VALID_KATEGORI.includes(kategori.trim())) {
    return res.status(400).json({
      success: false,
      message: `Kategori '${kategori}' tidak valid. Pilihan: ${VALID_KATEGORI.join(', ')}`
    });
  }

  if (!deskripsi || typeof deskripsi !== 'string' || deskripsi.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Field deskripsi wajib diisi dengan teks valid'
    });
  }

  req.validatedBody = {
    judul: judul.trim(),
    kategori: kategori.trim(),
    deskripsi: deskripsi.trim()
  };

  next();
}

function validateUpdateStatus(req, res, next) {
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({
      success: false,
      message: 'Format request body harus berupa objek JSON valid'
    });
  }

  const { status } = body;

  if (!status || typeof status !== 'string' || status.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Field status wajib diisi'
    });
  }

  if (!VALID_STATUS.includes(status.trim())) {
    return res.status(400).json({
      success: false,
      message: `Status '${status}' tidak valid. Pilihan: ${VALID_STATUS.join(', ')}`
    });
  }

  req.validatedStatus = status.trim();
  next();
}

function validateIdParam(req, res, next) {
  const rawId = req.params.id;
  const numId = Number(rawId);

  if (!Number.isInteger(numId) || numId <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Parameter ID pengaduan harus berupa bilangan bulat positif'
    });
  }

  req.params.id = numId;
  next();
}

module.exports = {
  validateCreatePengaduan,
  validateUpdatePengaduan,
  validateUpdateStatus,
  validateIdParam
};
