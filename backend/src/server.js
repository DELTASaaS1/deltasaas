require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`📡 Serveur DeltaSaaS démarré sur le port ${PORT}`);
});
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/commandes', require('./routes/commandes'));
app.use('/api/stock',     require('./routes/stock'));
app.use('/api/livraisons',require('./routes/livraisons'));