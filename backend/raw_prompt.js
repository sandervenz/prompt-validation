import fs from 'fs';
import { parse } from 'fast-csv';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

// Ganti dengan PostgreSQL connection string dari Neon
const connectionString = process.env.DATABASE_URL;

const client = new Client({ connectionString });

async function importPromptsFromCSV(filePath) {
  await client.connect();
  console.log('Connected to database');

  const stream = fs.createReadStream(filePath);
  const parser = parse({ headers: true });

  for await (const row of stream.pipe(parser)) {
    const text = row['Text'];
    if (text?.trim()) {
      try {
        await client.query('INSERT INTO prompts (text) VALUES ($1)', [text]);
      } catch (error) {
        console.error('Insert error:', error.message);
      }
    }
  }

  await client.end();
  console.log('Import completed and connection closed');
}

// Jalankan
importPromptsFromCSV('../raw_prompts.csv').catch(console.error);
