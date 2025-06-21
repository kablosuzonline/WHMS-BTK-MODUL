-- WHMCS BTK Raporlama Modülü Kurulum SQL Scripti
-- Bu script, modülün çalışması için gerekli veritabanı tablolarını oluşturur.

--
-- Tablo yapısı: `mod_btk_settings`
-- Modülün genel ayarlarını saklar.
--
CREATE TABLE IF NOT EXISTS `mod_btk_settings` (
  `setting` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`setting`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_yetki_turleri`
-- BTK tarafından tanımlanan yetki türlerini ve modülde aktif olup olmadıklarını saklar.
--
CREATE TABLE IF NOT EXISTS `mod_btk_yetki_turleri` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `yetki_kodu` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Örn: AIH_B, ISS_B',
  `yetki_adi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Örn: Altyapı İşletmeciliği Hizmeti (B)',
  `aktif` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Modülde bu yetki türü seçili mi? (0=Hayır, 1=Evet)',
  `is_bildirim` tinyint(1) DEFAULT NULL COMMENT 'Yetki türü (B) Bildirim kapsamında ise 1, (K) Kullanım kapsamında ise 0',
  `rapor_tipi_eki` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Dosya adında kullanılacak TIP (örn: ISS, AIH)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `yetki_kodu` (`yetki_kodu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_product_group_mappings`
-- WHMCS ürün gruplarını BTK yetki türleri ile eşleştirir.
--
CREATE TABLE IF NOT EXISTS `mod_btk_product_group_mappings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL COMMENT 'tblproductgroups.id',
  `yetki_kodu` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'mod_btk_yetki_turleri.yetki_kodu',
  PRIMARY KEY (`id`),
  UNIQUE KEY `group_yetki_unique` (`group_id`,`yetki_kodu`),
  KEY `group_id_idx` (`group_id`),
  KEY `yetki_kodu_idx` (`yetki_kodu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --- BÖLÜM 1 / 5 SONU - (install.sql, Genel ayarlar, yetki türleri ve ürün eşleştirme tabloları)

--
-- Tablo yapısı: `mod_btk_abone_rehber`
-- ABONE REHBER raporu için gerekli tüm abone ve hizmet verilerini saklar.
-- Bu tablodaki kayıtlar silinmez, sadece güncellenir veya durumu değiştirilir.
--
CREATE TABLE IF NOT EXISTS `mod_btk_abone_rehber` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) DEFAULT NULL COMMENT 'tblclients.id',
  `service_id` int(11) DEFAULT NULL COMMENT 'tblhosting.id (Hizmet bazlı raporlama için)',
  `operator_kod` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `musteri_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'WHMCS tblclients.id veya hizmete özel abone ID',
  `hat_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Hizmete atanan numara veya benzersiz tanımlayıcı',
  `hat_durum` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'A: Aktif, I: İptal, D: Dondurulmuş, K: Kısıtlı',
  `hat_durum_kodu` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'mod_btk_ref_hat_durum_kodlari.kod referansı',
  `hat_aciklama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hizmet_tipi` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'mod_btk_ref_hizmet_tipleri.hizmet_kodu referansı',
  `musteri_tipi` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'G-SAHIS, G-SIRKET, T-SIRKET, T-KAMU',
  `abone_baslangic` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'YYYYMMDDHHMMSS formatında',
  `abone_bitis` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'YYYYMMDDHHMMSS formatında (iptal durumunda)',
  `abone_adi` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_soyadi` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_tc_kimlik_no` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_pasaport_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_unvan` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_vergi_numarasi` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_mersis_numarasi` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_cinsiyet` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'E: Erkek, K: Kadın',
  `abone_uyruk` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ISO 3166-1 alpha-3 Ülke Kodu (örn: TUR)',
  `abone_baba_adi` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_ana_adi` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_anne_kizlik_soyadi` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_dogum_yeri` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_dogum_tarihi` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'YYYYMMDD formatında',
  `abone_meslek` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'mod_btk_ref_meslek_kodlari.kod referansı',
  `abone_tarife` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_kimlik_cilt_no` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_kimlik_kutuk_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_kimlik_sayfa_no` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_kimlik_il` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_kimlik_ilce` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_kimlik_mahalle_koy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_kimlik_tipi` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'mod_btk_ref_kimlik_tipleri.belge_tip_kodu referansı',
  `abone_kimlik_seri_no` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_kimlik_verildigi_yer` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_kimlik_verildigi_tarih` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'YYYYMMDD formatında',
  `abone_kimlik_aidiyeti` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'B: Bireysel, Y: Yetkili',
  `abone_adres_tesis_il` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_tesis_ilce` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_tesis_mahalle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_tesis_cadde` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_tesis_dis_kapi_no` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_tesis_ic_kapi_no` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_tesis_posta_kodu` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_tesis_adres_kodu` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'UAVT Adres Kodu',
  `abone_adres_irtibat_tel_no_1` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_irtibat_tel_no_2` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_e_mail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_yerlesim_il` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_yerlesim_ilce` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_yerlesim_mahalle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_yerlesim_cadde` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_yerlesim_dis_kapi_no` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_yerlesim_ic_kapi_no` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_yerlesim_no` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Tam yerleşim adresi (WHMCS client adresi)',
  `kurum_yetkili_adi` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kurum_yetkili_soyadi` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kurum_yetkili_tckimlik_no` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kurum_yetkili_telefon` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kurum_adres` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aktivasyon_bayi_adi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aktivasyon_bayi_adresi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aktivasyon_kullanici` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guncelleyen_bayi_adi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guncelleyen_bayi_adresi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guncelleyen_kullanici` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statik_ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iss_hiz_profili` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iss_kullanici_adi` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iss_pop_bilgisi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'mod_btk_pop_definitions.btk_pop_bilgisi referansı olabilir',
  `aih_hiz_profil` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_hizmet_saglayici` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_pop_bilgi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_ulke_a` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_sinir_gecis_noktasi_a` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_adres_tesis_ulke_b` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_adres_tesis_il_b` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_adres_tesis_ilce_b` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_adres_tesis_mahalle_b` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_adres_tesis_cadde_b` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_adres_tesis_dis_kapi_no_b` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_adres_tesis_ic_kapi_no_b` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_sinir_gecis_noktasi_b` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_devre_adlandirmasi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_devre_guzergah` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_service_per_operator` (`service_id`,`operator_kod`),
  KEY `client_id_idx` (`client_id`),
  KEY `service_id_idx` (`service_id`),
  KEY `hat_no_idx` (`hat_no`),
  KEY `abone_tc_kimlik_no_idx` (`abone_tc_kimlik_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- --- BÖLÜM 2 / 5 SONU - (install.sql, mod_btk_abone_rehber tablosu)

--
-- Tablo yapısı: `mod_btk_abone_hareket_live`
-- ABONE HAREKET raporu için son X günlük canlı hareketleri saklar.
--
CREATE TABLE IF NOT EXISTS `mod_btk_abone_hareket_live` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `rehber_id` int(11) DEFAULT NULL COMMENT 'mod_btk_abone_rehber.id referansı',
  `client_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `musteri_hareket_kodu` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'mod_btk_ref_musteri_hareket_kodlari.kod referansı',
  `musteri_hareket_aciklama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `musteri_hareket_zamani` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'YYYYMMDDHHMMSS formatında',
  `data_snapshot` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Hareket anındaki ilgili rehber verisinin JSON formatında kopyası (opsiyonel)',
  `gonderildi` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Bu hareket BTK ya gönderildi mi? (0=Hayır, 1=Evet)',
  `gonderim_dosya_adi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Gönderildiği dosyanın tam adı',
  `gonderim_cnt` tinyint(2) unsigned zerofill DEFAULT NULL COMMENT 'Gönderim sayısı (CNT)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `rehber_id_idx` (`rehber_id`),
  KEY `musteri_hareket_zamani_idx` (`musteri_hareket_zamani`),
  KEY `gonderildi_idx` (`gonderildi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_abone_hareket_archive`
-- `mod_btk_abone_hareket_live` tablosundan taşınan eski hareketleri arşivler.
--
CREATE TABLE IF NOT EXISTS `mod_btk_abone_hareket_archive` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `rehber_id` int(11) DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `musteri_hareket_kodu` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `musteri_hareket_aciklama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `musteri_hareket_zamani` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_snapshot` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gonderim_dosya_adi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gonderim_cnt` tinyint(2) unsigned zerofill DEFAULT NULL,
  `archived_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `musteri_hareket_zamani_archive_idx` (`musteri_hareket_zamani`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_personel`
-- BTK Personel Listesi raporu için personel bilgilerini saklar.
--
CREATE TABLE IF NOT EXISTS `mod_btk_personel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) NOT NULL COMMENT 'tbladmins.id referansı (WHMCS yönetici IDsi)',
  `firma_adi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'mod_btk_settings.operator_title değerinden gelir',
  `adi` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `soyadi` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tc_kimlik_no` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unvan` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `calistigi_birim` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobil_telefonu` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_telefonu` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `eposta_adresi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ev_adresi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `acil_durum_kisisi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ise_baslama_tarihi` date DEFAULT NULL,
  `isten_ayrilma_tarihi` date DEFAULT NULL,
  `is_birakma_nedeni` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `btk_listesine_eklensin` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Bu personel BTK raporuna dahil edilsin mi? (0=Hayır, 1=Evet)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_id_unique` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_ftp_logs`
-- FTP gönderim işlemlerini ve CNT (Count) takibini loglar.
--
CREATE TABLE IF NOT EXISTS `mod_btk_ftp_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rapor_turu` enum('REHBER','HAREKET','PERSONEL') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dosya_adi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ftp_sunucu_turu` enum('ANA','YEDEK') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gonderim_tarihi` timestamp NOT NULL DEFAULT current_timestamp(),
  `cnt` tinyint(2) unsigned zerofill NOT NULL,
  `durum` enum('BASARILI','HATALI') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hata_mesaji` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dosya_adi_sunucu_tur_cnt_unique` (`dosya_adi`(191),`ftp_sunucu_turu`,`cnt`), -- Prefix for dosya_adi
  KEY `rapor_turu_idx` (`rapor_turu`),
  KEY `gonderim_tarihi_idx` (`gonderim_tarihi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_logs`
-- Modülün genel işlem ve hata loglarını saklar.
--
CREATE TABLE IF NOT EXISTS `mod_btk_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tarih` timestamp NOT NULL DEFAULT current_timestamp(),
  `islem` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mesaj` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seviye` enum('INFO','WARNING','ERROR','DEBUG') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INFO',
  PRIMARY KEY (`id`),
  KEY `tarih_idx` (`tarih`),
  KEY `seviye_idx` (`seviye`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --- BÖLÜM 3 / 5 SONU - (install.sql, Hareket, personel ve log tabloları)

--
-- Tablo yapısı: `mod_btk_adres_il`
--
CREATE TABLE IF NOT EXISTS `mod_btk_adres_il` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Plaka Kodu olarak da kullanılabilir',
  `il_kodu` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Resmi il kodu (varsa)',
  `il_adi` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `il_adi_unique` (`il_adi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_adres_ilce`
--
CREATE TABLE IF NOT EXISTS `mod_btk_adres_ilce` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `il_id` int(11) NOT NULL COMMENT 'mod_btk_adres_il.id referansı',
  `ilce_kodu` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ilce_adi` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `il_id_idx` (`il_id`),
  UNIQUE KEY `il_ilce_unique` (`il_id`,`ilce_adi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_adres_mahalle`
--
CREATE TABLE IF NOT EXISTS `mod_btk_adres_mahalle` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ilce_id` int(11) NOT NULL COMMENT 'mod_btk_adres_ilce.id referansı',
  `mahalle_kodu` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mahalle_adi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ilce_id_idx` (`ilce_id`)
  -- Mahalleler için unique key ilçe bazında olmalı: UNIQUE KEY `ilce_mahalle_unique` (`ilce_id`,`mahalle_adi`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_adres_sokak` (Opsiyonel, çok büyük olabilir)
--
CREATE TABLE IF NOT EXISTS `mod_btk_adres_sokak` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mahalle_id` int(11) NOT NULL COMMENT 'mod_btk_adres_mahalle.id referansı',
  `sokak_kodu` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sokak_adi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `mahalle_id_idx` (`mahalle_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_adres_bina` (Opsiyonel, çok büyük olabilir)
--
CREATE TABLE IF NOT EXISTS `mod_btk_adres_bina` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sokak_id` int(11) NOT NULL COMMENT 'mod_btk_adres_sokak.id referansı',
  `bina_kodu` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dis_kapi_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bina_adi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sokak_id_idx` (`sokak_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_adres_daire` (Opsiyonel, çok büyük olabilir)
--
CREATE TABLE IF NOT EXISTS `mod_btk_adres_daire` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bina_id` int(11) NOT NULL COMMENT 'mod_btk_adres_bina.id referansı',
  `daire_kodu` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ic_kapi_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bina_id_idx` (`bina_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_ref_hat_durum_kodlari` (EK-1)
--
CREATE TABLE IF NOT EXISTS `mod_btk_ref_hat_durum_kodlari` (
  `kod` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `aciklama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`kod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_ref_musteri_hareket_kodlari` (EK-2)
--
CREATE TABLE IF NOT EXISTS `mod_btk_ref_musteri_hareket_kodlari` (
  `kod` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `aciklama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`kod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_ref_hizmet_tipleri` (EK-3)
--
CREATE TABLE IF NOT EXISTS `mod_btk_ref_hizmet_tipleri` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hizmet_kodu` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'BTK Dokümanındaki HIZMET_TURU',
  `hizmet_adi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'BTK Dokümanındaki DEGER_ACIKLAMA',
  `isletme_tipi_ornek` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Bu hizmet tipini kullanan örnek işletme türü (MOBİL, ISS, PSTN vb.)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `hizmet_kodu_unique` (`hizmet_kodu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_ref_kimlik_tipleri` (EK-4)
--
CREATE TABLE IF NOT EXISTS `mod_btk_ref_kimlik_tipleri` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `belge_tip_kodu` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `belge_adi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ulke_kodu_ornek` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `belge_tip_kodu_unique` (`belge_tip_kodu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_ref_meslek_kodlari` (EK-5)
--
CREATE TABLE IF NOT EXISTS `mod_btk_ref_meslek_kodlari` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kod` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `meslek_adi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `meslek_kodu_unique` (`kod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --- BÖLÜM 4 / 5 SONU - (install.sql, Adres ve BTK Referans tabloları)

--
-- Tablo yapısı: `mod_btk_pop_definitions`
-- ISS POP Noktaları, Baz İstasyonları, Santral vb. fiziksel nokta bilgilerini saklar.
--
CREATE TABLE IF NOT EXISTS `mod_btk_pop_definitions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `pop_kodu` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Operatör tarafından verilen benzersiz POP kodu/ID',
    `pop_adi` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'POP Noktasının Açıklayıcı Adı',
    `yayin_yapilan_ssid` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Özellikle kablosuz erişim noktaları için',
    `yonetim_ip_adresi` VARCHAR(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ana yönetim IP adresi (IPv4/IPv6)',
    `ip_bloklari` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Bu POPa ait IP blokları (virgül veya satırla ayrılmış)',
    `cihaz_turu` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Router, Switch, AP, OLT vb.',
    `cihaz_markasi` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `cihaz_modeli` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `pop_tipi` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'BAZ İSTASYONU, SANTRAL, VERİ MERKEZİ, POP vb.',
    `btk_pop_bilgisi` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'BTK raporu için standartlaştırılmış POP bilgisi (iss_pop_bilgisi alanına yazılacak)',
    `il_id` INT DEFAULT NULL,
    `ilce_id` INT DEFAULT NULL,
    `mahalle_id` INT DEFAULT NULL,
    `tam_adres_detay` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Cadde, sokak, no gibi detaylar',
    `uavt_adres_kodu` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `enlem` DECIMAL(10, 7) DEFAULT NULL COMMENT 'Coğrafi Enlem (örn: 39.9207700)',
    `boylam` DECIMAL(11, 8) DEFAULT NULL COMMENT 'Coğrafi Boylam (örn: 32.8541100)',
    `aktif_pasif_durum` BOOLEAN NOT NULL DEFAULT 1 COMMENT '1: Aktif, 0: Pasif',
    `notlar` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `eklenme_tarihi` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Foreign Key'ler ALTER TABLE ile eklenecek, çünkü tabloların varlığı garanti edilmeli.
    UNIQUE KEY `pop_kodu_unique` (`pop_kodu`),
    UNIQUE KEY `ssid_ilce_popadi_unique` (`yayin_yapilan_ssid`(191), `ilce_id`, `pop_adi`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Yabancı Anahtar Kısıtlamaları (Foreign Key Constraints)
-- Tabloların oluşturulma sırasına dikkat ederek veya tüm tablolar oluşturulduktan sonra ALTER TABLE ile eklenmeli.
-- Bu kısım modül aktivasyonunda PHP içinden de kontrol edilip eklenebilir.
-- ALTER TABLE `mod_btk_adres_ilce` ADD CONSTRAINT `fk_ilce_to_il` FOREIGN KEY (`il_id`) REFERENCES `mod_btk_adres_il`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- ALTER TABLE `mod_btk_adres_mahalle` ADD CONSTRAINT `fk_mahalle_to_ilce` FOREIGN KEY (`ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- ALTER TABLE `mod_btk_adres_sokak` ADD CONSTRAINT `fk_sokak_to_mahalle` FOREIGN KEY (`mahalle_id`) REFERENCES `mod_btk_adres_mahalle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- ALTER TABLE `mod_btk_adres_bina` ADD CONSTRAINT `fk_bina_to_sokak` FOREIGN KEY (`sokak_id`) REFERENCES `mod_btk_adres_sokak`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- ALTER TABLE `mod_btk_adres_daire` ADD CONSTRAINT `fk_daire_to_bina` FOREIGN KEY (`bina_id`) REFERENCES `mod_btk_adres_bina`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- ALTER TABLE `mod_btk_product_group_mappings` ADD CONSTRAINT `fk_pgm_group_id` FOREIGN KEY (`group_id`) REFERENCES `tblproductgroups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- ALTER TABLE `mod_btk_product_group_mappings` ADD CONSTRAINT `fk_pgm_yetki_kodu` FOREIGN KEY (`yetki_kodu`) REFERENCES `mod_btk_yetki_turleri`(`yetki_kodu`) ON DELETE CASCADE ON UPDATE CASCADE;

-- ALTER TABLE `mod_btk_abone_rehber` ADD CONSTRAINT `fk_rehber_client_id` FOREIGN KEY (`client_id`) REFERENCES `tblclients`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
-- ALTER TABLE `mod_btk_abone_rehber` ADD CONSTRAINT `fk_rehber_service_id` FOREIGN KEY (`service_id`) REFERENCES `tblhosting`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
-- ALTER TABLE `mod_btk_abone_rehber` ADD CONSTRAINT `fk_rehber_hat_durum_kodu` FOREIGN KEY (`hat_durum_kodu`) REFERENCES `mod_btk_ref_hat_durum_kodlari`(`kod`) ON DELETE SET NULL ON UPDATE CASCADE;
-- ALTER TABLE `mod_btk_abone_rehber` ADD CONSTRAINT `fk_rehber_hizmet_tipi` FOREIGN KEY (`hizmet_tipi`) REFERENCES `mod_btk_ref_hizmet_tipleri`(`hizmet_kodu`) ON DELETE SET NULL ON UPDATE CASCADE;
-- ALTER TABLE `mod_btk_abone_rehber` ADD CONSTRAINT `fk_rehber_meslek_kodu` FOREIGN KEY (`abone_meslek`) REFERENCES `mod_btk_ref_meslek_kodlari`(`kod`) ON DELETE SET NULL ON UPDATE CASCADE;
-- ALTER TABLE `mod_btk_abone_rehber` ADD CONSTRAINT `fk_rehber_kimlik_tipi` FOREIGN KEY (`abone_kimlik_tipi`) REFERENCES `mod_btk_ref_kimlik_tipleri`(`belge_tip_kodu`) ON DELETE SET NULL ON UPDATE CASCADE;

-- ALTER TABLE `mod_btk_abone_hareket_live` ADD CONSTRAINT `fk_hareket_rehber_id` FOREIGN KEY (`rehber_id`) REFERENCES `mod_btk_abone_rehber`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- ALTER TABLE `mod_btk_abone_hareket_live` ADD CONSTRAINT `fk_hareket_musteri_kodu` FOREIGN KEY (`musteri_hareket_kodu`) REFERENCES `mod_btk_ref_musteri_hareket_kodlari`(`kod`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ALTER TABLE `mod_btk_personel` ADD CONSTRAINT `fk_personel_admin_id` FOREIGN KEY (`admin_id`) REFERENCES `tbladmins`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- ALTER TABLE `mod_btk_pop_definitions` ADD CONSTRAINT `fk_pop_il_id` FOREIGN KEY (`il_id`) REFERENCES `mod_btk_adres_il`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
-- ALTER TABLE `mod_btk_pop_definitions` ADD CONSTRAINT `fk_pop_ilce_id` FOREIGN KEY (`ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
-- ALTER TABLE `mod_btk_pop_definitions` ADD CONSTRAINT `fk_pop_mahalle_id` FOREIGN KEY (`mahalle_id`) REFERENCES `mod_btk_adres_mahalle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- --- BÖLÜM 5 / 5 SONU - (install.sql, ISS POP Noktaları Tablosu ve Foreign Key'ler)