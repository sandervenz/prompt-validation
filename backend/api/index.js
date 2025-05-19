import express from 'express';
import serverless from 'serverless-http';

const app = express();

app.get('/', (req, res) => {
  console.log('✅ Home hit!');
  res.send('API READY!');
});

export default serverless(app);
