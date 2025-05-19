import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import promptsRoutes from '../routes/prompts.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', promptsRoutes);

export default serverless(app);
