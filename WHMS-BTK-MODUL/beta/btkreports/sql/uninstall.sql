-- uninstall.sql
-- WHMCS BTK Abone Veri Raporlama Modülü
-- Veritabanı Tablolarını Silme Sorguları

-- Not: Bu script, modül kaldırılırken ve kullanıcı verilerin silinmesini onayladığında çalıştırılmalıdır.
-- Tabloların silinme sırası, FOREIGN KEY kısıtlamaları nedeniyle önemlidir.
-- Bağımlılığı olan tablolar, bağımlı olduğu tablolardan önce silinmelidir veya FOREIGN KEY'ler önce kaldırılmalıdır.
-- En güvenli yol, bağımlılıkları en az olan tablolardan başlayarak silmektir.

-- Önce FOREIGN KEY kısıtlamalarını kaldıralım (opsiyonel ama daha güvenli olabilir)
-- Bu ALTER TABLE komutları, eğer FOREIGN KEY'ler _activate içinde eklendiyse ve burada silinmeleri gerekiyorsa kullanılır.
-- Eğer CREATE TABLE içinde tanımlandıysa, tablo silindiğinde otomatik olarak kalkarlar.
-- ALTER TABLE `mod_btk_musteri_detaylari` DROP FOREIGN KEY `fk_musteri_detaylari_kurum_adres_id`;
-- ALTER TABLE `mod_btk_adresler` DROP FOREIGN KEY `fk_adresler_personel_id`;
-- ALTER TABLE `mod_btk_hizmet_detaylari` DROP FOREIGN KEY `fk_hizmet_detaylari_pop_id`;
-- ALTER TABLE `mod_btk_abone_rehber_arsivi` DROP FOREIGN KEY `fk_rehber_arsivi_gonderilen_dosya_id`;
-- ALTER TABLE `mod_btk_abone_hareket_canli` DROP FOREIGN KEY `fk_hareket_canli_gonderilen_dosya_id`;
-- ALTER TABLE `mod_btk_abone_hareket_arsivi` DROP FOREIGN KEY `fk_hareket_arsivi_gonderilen_dosya_id`;

-- Tabloları silme (Bağımlılıkları en çok olanlardan başlayarak veya FK'lar kaldırıldıktan sonra herhangi bir sırada)
DROP TABLE IF EXISTS `mod_btk_abone_hareket_arsivi`;
DROP TABLE IF EXISTS `mod_btk_abone_hareket_canli`;
DROP TABLE IF EXISTS `mod_btk_abone_rehber_arsivi`;
DROP TABLE IF EXISTS `mod_btk_gonderilen_dosyalar`;
DROP TABLE IF EXISTS `mod_btk_hizmet_detaylari`;
DROP TABLE IF EXISTS `mod_btk_iss_pop_noktalari`;
DROP TABLE IF EXISTS `mod_btk_musteri_detaylari`;
DROP TABLE IF EXISTS `mod_btk_urun_yetki_eslestirme`;
DROP TABLE IF EXISTS `mod_btk_personel`;
DROP TABLE IF EXISTS `mod_btk_adresler`;
DROP TABLE IF EXISTS `mod_btk_isletmeci_yetkileri`;

-- Referans tabloları
DROP TABLE IF EXISTS `mod_btk_ref_musteri_hareket_kodlari`;
DROP TABLE IF EXISTS `mod_btk_ref_hizmet_tipleri`;
DROP TABLE IF EXISTS `mod_btk_ref_musteri_tipleri`;
DROP TABLE IF EXISTS `mod_btk_ref_hat_durum_kodlari`;
DROP TABLE IF EXISTS `mod_btk_ref_kimlik_aidiyetleri`;
DROP TABLE IF EXISTS `mod_btk_ref_kimlik_tipleri`;
DROP TABLE IF EXISTS `mod_btk_ref_cinsiyet`;
DROP TABLE IF EXISTS `mod_btk_ref_meslekler`;
DROP TABLE IF EXISTS `mod_btk_ref_ulkeler`;
DROP TABLE IF EXISTS `mod_btk_adres_mahalle`;
DROP TABLE IF EXISTS `mod_btk_adres_ilce`;
DROP TABLE IF EXISTS `mod_btk_adres_il`;
DROP TABLE IF EXISTS `mod_btk_yetki_turleri`;

-- En son ayarlar tablosu
DROP TABLE IF EXISTS `mod_btk_settings`;