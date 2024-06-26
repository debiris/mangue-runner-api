const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authMiddleware = require('./middleware/auth');
const User = require('./models/User');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();

// Configuração do CORS para permitir requisições do Vercel
const corsOptions = {
  origin: 'https://mangue-runner-b7bbj31uc-debiris-projects.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

app.use('/api/auth', authRoutes);

// Rota protegida de exemplo
app.get('/api/protected', authMiddleware, (req, res) => {
  res.send('Esta é uma rota protegida');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
