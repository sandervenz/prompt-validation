import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import promptsRoutes from './routes/prompts.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API READY!');
});

app.use('/api', promptsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
