function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan internal server';

  // Format respons konsisten tanpa membocorkan detail sensitif stack trace
  res.status(statusCode).json({
    success: false,
    message: message
  });
}

function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Rute '${req.method} ${req.originalUrl}' tidak ditemukan pada SIMADU API`
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
