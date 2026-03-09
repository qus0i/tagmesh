import fs from 'fs';
import path from 'path';
import pg from 'pg';

const { Client } = pg;

// Using the provided password and project ID for connection string
const connectionString = 'postgresql://postgres.rwljtyocybcarctadkdx:Plus112233@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';

async function runSchema() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    
    console.log('Reading schema.sql...');
    const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema...');
    await client.query(sql);
    
    console.log('Schema executed successfully!');
  } catch (err) {
    console.error('Error executing schema:', err);
  } finally {
    await client.end();
  }
}

runSchema();
