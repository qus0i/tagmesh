import { createClient } from '@supabase/supabase-js';

// Load from environment or use direct values for initialization script
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://rwljtyocybcarctadkdx.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3bGp0eW9jeWJjYXJjdGFka2R4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzAyOTA5NywiZXhwIjoyMDg4NjA1MDk3fQ.8pfJcNzdizW5MRs7IRKqLP8u-wfh9Shlh1xCuqAVMpA';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
