// This script assumes we have some generic product images to upload and seed
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://rwljtyocybcarctadkdx.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3bGp0eW9jeWJjYXJjdGFka2R4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzAyOTA5NywiZXhwIjoyMDg4NjA1MDk3fQ.8pfJcNzdizW5MRs7IRKqLP8u-wfh9Shlh1xCuqAVMpA';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// We need the user to run the schema first, because our REST API calls to insert products will fail if the tables don't exist yet!
async function checkTables() {
    const { error } = await supabaseAdmin.from('products').select('id').limit(1);
    if (error && error.code === '42P01') {
        console.error('ERROR: Tables do not exist yet!');
        console.log('Please go to https://supabase.com/dashboard/project/rwljtyocybcarctadkdx/sql');
        console.log('And run the contents of supabase/schema.sql');
        return false;
    }
    return true;
}

checkTables().then(exists => {
    if (exists) {
        console.log('Tables exist! Ready to seed.');
    }
});
