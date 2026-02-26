-- ============================================
-- CUSTOM BURGER - Veritabanı Şeması
-- Dr. Burger - Masa Sipariş Sistemi
-- ============================================

-- 1. Malzeme Kategorileri
CREATE TABLE IF NOT EXISTS ingredient_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  name_en TEXT,
  icon TEXT DEFAULT '🍔',
  display_order INT DEFAULT 0,
  is_required BOOLEAN DEFAULT false,  -- Ekmek ve köfte zorunlu
  min_select INT DEFAULT 0,           -- Minimum seçim sayısı
  max_select INT DEFAULT 5,           -- Maximum seçim sayısı
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Malzemeler
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES ingredient_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  calories INT DEFAULT 0,
  allergens TEXT[] DEFAULT '{}',    -- ['gluten', 'süt', 'yumurta', 'fıstık']
  is_available BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Custom Burger Siparişleri
CREATE TABLE IF NOT EXISTS custom_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,  -- CB-0001 formatı
  branch_id UUID REFERENCES branches(id),
  table_number INT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  notes TEXT,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'served', 'paid', 'cancelled')),
  printed_at TIMESTAMPTZ,
  prepared_at TIMESTAMPTZ,
  served_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Siparişteki Burgerler (bir siparişte birden fazla burger olabilir)
CREATE TABLE IF NOT EXISTS order_burgers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES custom_orders(id) ON DELETE CASCADE,
  burger_name TEXT DEFAULT 'Custom Burger',
  notes TEXT,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Burger Malzemeleri (her burgerin içindeki malzemeler)
CREATE TABLE IF NOT EXISTS burger_ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_burger_id UUID REFERENCES order_burgers(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id),
  ingredient_name TEXT NOT NULL,  -- Denormalize - yazdırmada kullanılır
  quantity INT DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Favori Burgerler (telefon numarasına göre)
CREATE TABLE IF NOT EXISTS saved_burgers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  burger_name TEXT NOT NULL DEFAULT 'Favori Burgerim',
  ingredients_json JSONB NOT NULL,  -- [{ingredient_id, name, category, quantity}]
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  order_count INT DEFAULT 0,        -- Kaç kez sipariş edildi
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Sipariş numarası için sequence
CREATE SEQUENCE IF NOT EXISTS custom_order_seq START 1;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE ingredient_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_burgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE burger_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_burgers ENABLE ROW LEVEL SECURITY;

-- Herkes malzemeleri görebilir (müşteri tarafı için)
CREATE POLICY "Public can read ingredient_categories"
  ON ingredient_categories FOR SELECT USING (true);

CREATE POLICY "Public can read ingredients"
  ON ingredients FOR SELECT USING (true);

-- Herkes sipariş oluşturabilir
CREATE POLICY "Public can create custom_orders"
  ON custom_orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read own orders"
  ON custom_orders FOR SELECT USING (true);

CREATE POLICY "Public can create order_burgers"
  ON order_burgers FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read order_burgers"
  ON order_burgers FOR SELECT USING (true);

CREATE POLICY "Public can create burger_ingredients"
  ON burger_ingredients FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read burger_ingredients"
  ON burger_ingredients FOR SELECT USING (true);

-- Favori burgerler - herkes kendi favorilerini yönetebilir
CREATE POLICY "Public can manage saved_burgers"
  ON saved_burgers FOR ALL USING (true) WITH CHECK (true);

-- Authenticated kullanıcılar (admin) her şeyi yapabilir
CREATE POLICY "Admin full access ingredient_categories"
  ON ingredient_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access ingredients"
  ON ingredients FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access custom_orders"
  ON custom_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access order_burgers"
  ON order_burgers FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access burger_ingredients"
  ON burger_ingredients FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- Realtime aktif et (canlı sipariş takibi için)
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE custom_orders;

-- ============================================
-- SEED DATA - Örnek Malzemeler
-- ============================================

-- Kategoriler
INSERT INTO ingredient_categories (name, name_en, icon, display_order, is_required, min_select, max_select) VALUES
  ('Ekmek', 'Bun', '🍞', 1, true, 1, 1),
  ('Köfte', 'Patty', '🥩', 2, true, 1, 3),
  ('Peynir', 'Cheese', '🧀', 3, false, 0, 3),
  ('Sos', 'Sauce', '🥫', 4, false, 0, 4),
  ('Sebze', 'Vegetables', '🥬', 5, false, 0, 6),
  ('Ekstra', 'Extras', '⭐', 6, false, 0, 5)
ON CONFLICT (name) DO NOTHING;

-- Ekmekler
INSERT INTO ingredients (category_id, name, name_en, price, calories, allergens, display_order) VALUES
  ((SELECT id FROM ingredient_categories WHERE name = 'Ekmek'), 'Klasik Hamburger Ekmeği', 'Classic Bun', 0, 150, ARRAY['gluten'], 1),
  ((SELECT id FROM ingredient_categories WHERE name = 'Ekmek'), 'Brioche Ekmek', 'Brioche Bun', 5, 200, ARRAY['gluten', 'süt', 'yumurta'], 2),
  ((SELECT id FROM ingredient_categories WHERE name = 'Ekmek'), 'Susamlı Ekmek', 'Sesame Bun', 3, 160, ARRAY['gluten', 'susam'], 3),
  ((SELECT id FROM ingredient_categories WHERE name = 'Ekmek'), 'Tam Buğday Ekmek', 'Whole Wheat Bun', 5, 140, ARRAY['gluten'], 4),
  ((SELECT id FROM ingredient_categories WHERE name = 'Ekmek'), 'Patates Ekmeği', 'Potato Bun', 7, 180, ARRAY['gluten', 'süt'], 5);

-- Köfteler
INSERT INTO ingredients (category_id, name, name_en, price, calories, allergens, display_order) VALUES
  ((SELECT id FROM ingredient_categories WHERE name = 'Köfte'), '120gr Dana Köfte', '120g Beef Patty', 30, 250, ARRAY[]::TEXT[], 1),
  ((SELECT id FROM ingredient_categories WHERE name = 'Köfte'), '180gr Dana Köfte', '180g Beef Patty', 45, 380, ARRAY[]::TEXT[], 2),
  ((SELECT id FROM ingredient_categories WHERE name = 'Köfte'), '200gr Angus Köfte', '200g Angus Patty', 60, 420, ARRAY[]::TEXT[], 3),
  ((SELECT id FROM ingredient_categories WHERE name = 'Köfte'), 'Tavuk Göğsü', 'Chicken Breast', 35, 200, ARRAY[]::TEXT[], 4),
  ((SELECT id FROM ingredient_categories WHERE name = 'Köfte'), 'Çıtır Tavuk', 'Crispy Chicken', 40, 350, ARRAY['gluten'], 5);

-- Peynirler
INSERT INTO ingredients (category_id, name, name_en, price, calories, allergens, display_order) VALUES
  ((SELECT id FROM ingredient_categories WHERE name = 'Peynir'), 'Cheddar', 'Cheddar', 10, 110, ARRAY['süt'], 1),
  ((SELECT id FROM ingredient_categories WHERE name = 'Peynir'), 'Gouda', 'Gouda', 12, 100, ARRAY['süt'], 2),
  ((SELECT id FROM ingredient_categories WHERE name = 'Peynir'), 'Mozzarella', 'Mozzarella', 12, 90, ARRAY['süt'], 3),
  ((SELECT id FROM ingredient_categories WHERE name = 'Peynir'), 'Füme Peynir', 'Smoked Cheese', 15, 120, ARRAY['süt'], 4),
  ((SELECT id FROM ingredient_categories WHERE name = 'Peynir'), 'Cream Cheese', 'Cream Cheese', 12, 100, ARRAY['süt'], 5);

-- Soslar
INSERT INTO ingredients (category_id, name, name_en, price, calories, allergens, display_order) VALUES
  ((SELECT id FROM ingredient_categories WHERE name = 'Sos'), 'Özel Burger Sos', 'Special Burger Sauce', 0, 80, ARRAY['yumurta'], 1),
  ((SELECT id FROM ingredient_categories WHERE name = 'Sos'), 'BBQ Sos', 'BBQ Sauce', 5, 60, ARRAY[]::TEXT[], 2),
  ((SELECT id FROM ingredient_categories WHERE name = 'Sos'), 'Ranch Sos', 'Ranch Sauce', 5, 70, ARRAY['süt', 'yumurta'], 3),
  ((SELECT id FROM ingredient_categories WHERE name = 'Sos'), 'Acı Sos', 'Hot Sauce', 3, 15, ARRAY[]::TEXT[], 4),
  ((SELECT id FROM ingredient_categories WHERE name = 'Sos'), 'Hardal-Bal', 'Honey Mustard', 5, 65, ARRAY[]::TEXT[], 5),
  ((SELECT id FROM ingredient_categories WHERE name = 'Sos'), 'Mayonez', 'Mayonnaise', 0, 90, ARRAY['yumurta'], 6);

-- Sebzeler
INSERT INTO ingredients (category_id, name, name_en, price, calories, allergens, display_order) VALUES
  ((SELECT id FROM ingredient_categories WHERE name = 'Sebze'), 'Domates', 'Tomato', 0, 10, ARRAY[]::TEXT[], 1),
  ((SELECT id FROM ingredient_categories WHERE name = 'Sebze'), 'Marul', 'Lettuce', 0, 5, ARRAY[]::TEXT[], 2),
  ((SELECT id FROM ingredient_categories WHERE name = 'Sebze'), 'Soğan Halkası', 'Onion Rings', 5, 30, ARRAY[]::TEXT[], 3),
  ((SELECT id FROM ingredient_categories WHERE name = 'Sebze'), 'Karamelize Soğan', 'Caramelized Onion', 8, 45, ARRAY[]::TEXT[], 4),
  ((SELECT id FROM ingredient_categories WHERE name = 'Sebze'), 'Turşu', 'Pickles', 0, 5, ARRAY[]::TEXT[], 5),
  ((SELECT id FROM ingredient_categories WHERE name = 'Sebze'), 'Jalapeno', 'Jalapeno', 5, 10, ARRAY[]::TEXT[], 6),
  ((SELECT id FROM ingredient_categories WHERE name = 'Sebze'), 'Mantar', 'Mushroom', 8, 20, ARRAY[]::TEXT[], 7),
  ((SELECT id FROM ingredient_categories WHERE name = 'Sebze'), 'Avokado', 'Avocado', 15, 80, ARRAY[]::TEXT[], 8);

-- Ekstralar
INSERT INTO ingredients (category_id, name, name_en, price, calories, allergens, display_order) VALUES
  ((SELECT id FROM ingredient_categories WHERE name = 'Ekstra'), 'Bacon', 'Bacon', 15, 150, ARRAY[]::TEXT[], 1),
  ((SELECT id FROM ingredient_categories WHERE name = 'Ekstra'), 'Sahanda Yumurta', 'Fried Egg', 10, 90, ARRAY['yumurta'], 2),
  ((SELECT id FROM ingredient_categories WHERE name = 'Ekstra'), 'Çıtır Soğan', 'Crispy Onion', 8, 60, ARRAY['gluten'], 3),
  ((SELECT id FROM ingredient_categories WHERE name = 'Ekstra'), 'Ekstra Köfte (+1)', 'Extra Patty (+1)', 30, 250, ARRAY[]::TEXT[], 4),
  ((SELECT id FROM ingredient_categories WHERE name = 'Ekstra'), 'Truffle Mayo', 'Truffle Mayo', 12, 100, ARRAY['yumurta'], 5);
