import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://wdqnyscsiugfwwhfirot.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkcW55c2NzaXVnZnd3aGZpcm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNjQ3MTYsImV4cCI6MjA2Nzc0MDcxNn0.7PW7VJg1MsENTbAj2aZ15aqLF-_2UHo1DLmE56lm_qs';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };