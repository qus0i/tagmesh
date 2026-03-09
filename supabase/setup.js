import fs from 'fs';
import { supabaseAdmin } from './adminClient.js';

async function setupDatabase() {
  console.log('Starting Supabase setup...');

  // 1. Create Admin User
  console.log('Creating admin user...');
  const { data: user, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email: 'tagmesh@gmail.com',
    password: 'Plus112233',
    email_confirm: true,
    user_metadata: { name: 'قصي كنعان', role: 'admin' }
  });

  if (userError && !userError.message.includes('already exists')) {
    console.error('Error creating user:', userError);
  } else {
    console.log('Admin user created successfully!');
  }

  // 2. Read and execute schema (Note: Since we are using JS client, we can't run raw multi-statement SQL easily without the postgres connection string or pg module. We will need to use Supabase CLI or pg-promise, or we just configure it since the user hasn't given the postgres password directly).
  console.log('\nNOTICE: To run the full schema.sql, please run it in the Supabase SQL Editor on the dashboard, OR provide the Postgres connection string.');
  
  // We can at least try to ensure the storage bucket exists
  console.log('\nEnsuring storage bucket exists...');
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  const bucketExists = buckets?.find(b => b.name === 'product-images');
  
  if (!bucketExists) {
    const { error: bucketError } = await supabaseAdmin.storage.createBucket('product-images', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
      fileSizeLimit: 10485760 // 10MB
    });
    if (bucketError) {
      console.error('Error creating bucket:', bucketError);
    } else {
      console.log('Storage bucket created!');
    }
  } else {
    console.log('Storage bucket already exists.');
  }
}

setupDatabase().catch(console.error);
