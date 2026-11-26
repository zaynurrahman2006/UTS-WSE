require('dotenv').config();
const app = require('./app.cjs');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`SIMADU API berjalan pada http://localhost:${PORT}`);
  console.log(`Dokumentasi Swagger UI: http://localhost:${PORT}/docs`);
});

module.exports = server;
