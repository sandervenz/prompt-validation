import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import promptsRoutes from './routes/prompts.js';

dotenv.config();

const corsOptions = {
  origin: 'https://prompt-validation.vercel.app',
  optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', promptsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
