-- Create job_postings table
CREATE TABLE IF NOT EXISTS job_postings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Update applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'job',
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS budget TEXT;

-- Update site_content table
ALTER TABLE site_content
ADD COLUMN IF NOT EXISTS stat_beef TEXT DEFAULT '100%',
ADD COLUMN IF NOT EXISTS stat_customers TEXT DEFAULT '50k+',
ADD COLUMN IF NOT EXISTS stat_experience TEXT DEFAULT '10+',
ADD COLUMN IF NOT EXISTS stat_awards TEXT DEFAULT '5';

-- Enable RLS (Row Level Security) if not already enabled (Optional but recommended)
-- ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies (Adjust as needed for public/admin access)
-- Example: Allow public read access to job_postings
-- CREATE POLICY "Public job postings are viewable by everyone" ON job_postings FOR SELECT USING (true);
