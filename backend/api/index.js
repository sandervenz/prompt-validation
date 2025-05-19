import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import promptsRoutes from '../routes/prompts.js';

const corsOptions = {
  origin: 'https://prompt-validation.vercel.app',
  optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API READY!');
});

app.use('/api', promptsRoutes);

export default serverless(app);
