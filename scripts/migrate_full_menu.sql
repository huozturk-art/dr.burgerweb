-- ============================================
-- FAZ 9: TAM MENÜ SİPARİŞ SİSTEMİ - MİGRASYON
-- ============================================

-- 1. order_burgers tablosunu genişlet
-- (Bu tablo artık tüm sipariş kalemlerini içerecek)
ALTER TABLE order_burgers 
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id),
ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT true;

-- 2. Mevcut kayıtları işaretle (geriye dönük uyumluluk)
UPDATE order_burgers SET is_custom = true WHERE is_custom IS NULL;

-- 3. burger_ingredients tablosundaki kısıtlamayı esnet (Opsiyonel)
-- Standart ürünlerin malzemesi olmayacağı için bu tablo boş kalacak.

-- 4. Realtime kontrolü (Zaten aktif olmalı ama emin olalım)
ALTER PUBLICATION supabase_realtime ADD TABLE order_burgers;
-- Not: Eğer tablo zaten yayındaysa hata verebilir, manuel kontrol edilebilir.

COMMENT ON COLUMN order_burgers.product_id IS 'Standart ürünler için products tablosuna referans';
COMMENT ON COLUMN order_burgers.is_custom IS 'Custom burger ise true, hazır ürünse false';
