-- Update site_content table with label columns
ALTER TABLE site_content
ADD COLUMN IF NOT EXISTS stat_beef_label TEXT DEFAULT 'Dana Eti',
ADD COLUMN IF NOT EXISTS stat_customers_label TEXT DEFAULT 'Mutlu Müşteri',
ADD COLUMN IF NOT EXISTS stat_experience_label TEXT DEFAULT 'Yıllık Deneyim',
ADD COLUMN IF NOT EXISTS stat_awards_label TEXT DEFAULT 'Gurme Ödülü';
