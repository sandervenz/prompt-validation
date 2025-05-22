import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import promptsRoutes from './routes/prompts.js';
import statsRoutes from './routes/stats.js';

dotenv.config();

const corsOptions = {
  origin: ['https://prompt-validation.vercel.app', 'http://localhost:3000'],
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API READY!');
});

app.use('/api', promptsRoutes);
app.use('/api/stats', statsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
