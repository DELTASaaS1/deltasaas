const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const routes     = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(s => s.trim())
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];
app.use(cors({ origin: corsOrigins }));
app.use(express.json());

// Toutes les routes passent par /api/v1
app.use('/api/v1', routes);

// Gestion des erreurs (toujours en dernier)
app.use(errorHandler);

module.exports = app;
