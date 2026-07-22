const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const routes     = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' })); // URL Vite
app.use(express.json());

// Toutes les routes passent par /api/v1
app.use('/api/v1', routes);

// Gestion des erreurs (toujours en dernier)
app.use(errorHandler);

module.exports = app;
