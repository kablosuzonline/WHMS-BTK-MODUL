-- WHMCS BTK Raporlama Modülü - Mahalle Veri Seti (Balıkesir - Ayvalık)
-- Sürüm: 20.0.0 (Operasyon PHOENIX) - GÜNCELLENMİŞ VE DOĞRULANMIŞ VERİ

-- Önceki olası eksik veya hatalı kayıtları temizle
DELETE FROM `mod_btk_adres_mahalle` WHERE `ilce_id` = (SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK');

INSERT IGNORE INTO `mod_btk_adres_mahalle` (`ilce_id`, `mahalle_adi`, `posta_kodu`) VALUES
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), '150 EVLER MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'ALİ ÇETİNKAYA MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'ALTINOVA MAHALLESİ', '10425'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'BAĞYÜZÜ MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'BEŞİKTEPE MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'BULUTÇEŞME MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'BÜYÜKDERE MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'ÇAKMAK MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'ÇAMOBA MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'FATİH MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'FETHİYE MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'FEVZİPAŞA-VEHBİBEY MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'GAZİKEMALPAŞA MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'GÜMÜŞLÜ MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'HACIVELİLER MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'HAMDİBEY MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'HAYRETTİNPAŞA MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'İSMETPAŞA MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'KARAAYIT MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'KAZIM KARABEKİR MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'KEMALPAŞA MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'KIVANÇ MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'KÜÇÜKKÖY MAHALLESİ', '10410'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'MİTHATPAŞA MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'MUTLU MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'NAMIK KEMAL MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'ODABURNU MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'SAKARYA MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'SEFA ÇAMLIK MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'TIFILLAR MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'TÜRKÖZÜ MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'ÜÇKABAAĞAÇ MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'YENİKÖY MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'ZEKİBEY MAHALLESİ', '10400');