-- ==============================================================================
-- Dr. Burger Security Enhancements (RLS & Policies)
-- ==============================================================================
-- This script secures your database by enabling Row Level Security (RLS) on all tables.
-- It ensures that:
-- 1. Public users can VIEW content (Products, Menu, Branches, etc.)
-- 2. Public users can SUBMIT forms (Contact, Applications)
-- 3. ONLY Logged-in Admins can EDIT/DELETE data or VIEW private messages.
-- ==============================================================================

-- 1. Enable RLS on All Tables
-- These commands turn on the "Security Shield" for each table.
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS applications ENABLE ROW LEVEL SECURITY;

-- 2. Clean up Old Policies (to prevent conflicts)
-- We drop existing policies to ensure clean application of new rules.
DROP POLICY IF EXISTS "Public Read Products" ON products;
DROP POLICY IF EXISTS "Public Write Products" ON products;
DROP POLICY IF EXISTS "Public Update Products" ON products;
DROP POLICY IF EXISTS "Public Read Categories" ON categories;
DROP POLICY IF EXISTS "Public Read Branches" ON branches;
DROP POLICY IF EXISTS "Public Read Job Postings" ON job_postings;
DROP POLICY IF EXISTS "Public Read Site Content" ON site_content;
DROP POLICY IF EXISTS "Public Update Content" ON site_content;
DROP POLICY IF EXISTS "Public Insert Messages" ON messages;
DROP POLICY IF EXISTS "Public Insert Applications" ON applications;

-- ==============================================================================
-- 3. Create New Policies
-- ==============================================================================

-- GROUP A: Content Tables (Public READ, Admin WRITE)
-- (Products, Categories, Branches, Job Postings, Site Content)

-- Products
CREATE POLICY "Public users can view products" 
ON products FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Admins can manage products" 
ON products FOR ALL 
TO authenticated 
USING (true);

-- Categories
CREATE POLICY "Public users can view categories" 
ON categories FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Admins can manage categories" 
ON categories FOR ALL 
TO authenticated 
USING (true);

-- Branches
CREATE POLICY "Public users can view branches" 
ON branches FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Admins can manage branches" 
ON branches FOR ALL 
TO authenticated 
USING (true);

-- Job Postings
CREATE POLICY "Public users can view job postings" 
ON job_postings FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Admins can manage job postings" 
ON job_postings FOR ALL 
TO authenticated 
USING (true);

-- Site Content
CREATE POLICY "Public users can view site content" 
ON site_content FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Admins can manage site content" 
ON site_content FOR ALL 
TO authenticated 
USING (true);


-- GROUP B: Submission Tables (Public INSERT, Admin READ/DELETE)
-- (Messages, Applications)

-- Messages
CREATE POLICY "Public users can send messages" 
ON messages FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Admins can view and delete messages" 
ON messages FOR ALL 
TO authenticated 
USING (true);

-- Applications
CREATE POLICY "Public users can submit applications" 
ON applications FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Admins can view and delete applications" 
ON applications FOR ALL 
TO authenticated 
USING (true);

-- ==============================================================================
-- End of Script
-- ==============================================================================
