const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./docs/openapi.json');

const authRoutes = require('./src/routes/authRoutes.cjs');
const pengaduanRoutes = require('./src/routes/pengaduanRoutes.cjs');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler.cjs');

const app = express();

app.use(cors());
app.use(express.json());

// OpenAPI Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Endpoint info root
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'SIMADU API (Sistem Layanan Informasi dan Pengaduan Mahasiswa)',
    version: '1.0.0',
    documentation: '/docs',
    endpoints: {
      auth: '/api/auth/login',
      pengaduan: '/api/pengaduan'
    }
  });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/pengaduan', pengaduanRoutes);

// Handler 404 dan Error terpusat
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
