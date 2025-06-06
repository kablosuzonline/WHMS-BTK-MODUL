-- modules/addons/btkreports/sql/install.sql
-- WHMCS BTK Raporlama Modülü v6.0.3 - Tam Veritabanı Şeması
-- Bu dosya, modülün ihtiyaç duyduğu tüm tabloların oluşturulma sorgularını içerir.
-- _activate fonksiyonu da bu yapıya göre tabloları oluşturacaktır.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- Genel Yapılandırma Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_config` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `operator_kodu` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `operator_adi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'BTK dosya isimleri için',
  `operator_unvani` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Personel listesi için',
  `secilen_yetki_turleri` text COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'JSON array',
  `ftp_host` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ftp_port` int(11) DEFAULT 21,
  `ftp_username` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ftp_password` text COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Şifrelenecek',
  `ftp_path_rehber` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '/',
  `ftp_path_hareket` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '/',
  `ftp_path_personel` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '/',
  `ftp_use_ssl` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'FTPS için',
  `ftp_passive_mode` tinyint(1) NOT NULL DEFAULT 1,
  `ftp_yedek_aktif` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Yedek FTP kullanımı aktif mi?',
  `ftp_host_yedek` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ftp_port_yedek` int(11) DEFAULT 21,
  `ftp_username_yedek` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ftp_password_yedek` text COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Şifrelenecek',
  `ftp_path_rehber_yedek` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '/',
  `ftp_path_hareket_yedek` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '/',
  `ftp_path_personel_yedek` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '/',
  `ftp_use_ssl_yedek` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Yedek FTPS için',
  `ftp_passive_mode_yedek` tinyint(1) NOT NULL DEFAULT 1,
  `cron_rehber_ay` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '1' COMMENT 'Ayın günü (1-31)',
  `cron_rehber_gun_hafta` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '*' COMMENT 'Rehber için genelde Ayın Günü kullanılır',
  `cron_rehber_saat` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT '10',
  `cron_rehber_dakika` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT '00',
  `cron_hareket_ay` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '*' COMMENT 'Her ay',
  `cron_hareket_gun_hafta` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '*' COMMENT 'Haftanın günü (0-6 Pazar-Cumartesi, * her gün)',
  `cron_hareket_saat` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT '01',
  `cron_hareket_dakika` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT '00',
  `cron_personel_ay` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '6,12' COMMENT 'Haziran ve Aralık',
  `cron_personel_gun_ay` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'L' COMMENT 'Ayın son günü (L) veya belirli günler',
  `cron_personel_saat` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT '16',
  `cron_personel_dakika` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT '00',
  `canli_hareket_saklama_gun` int(11) DEFAULT 7 COMMENT 'Canlı hareket tablosunda verilerin kaç gün saklanacağı',
  `arsiv_hareket_saklama_gun` int(11) DEFAULT 180 COMMENT 'Arşiv hareket tablosunda verilerin kaç gün saklanacağı',
  `bos_dosya_gonder` tinyint(1) NOT NULL DEFAULT 0,
  `sil_tablolar_kaldirirken` tinyint(1) NOT NULL DEFAULT 0,
  `nvi_tc_dogrulama_aktif` tinyint(1) NOT NULL DEFAULT 1,
  `nvi_yabanci_dogrulama_aktif` tinyint(1) NOT NULL DEFAULT 1,
  `log_level` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'INFO' COMMENT 'DEBUG, INFO, WARNING, ERROR',
  `admin_password_confirm_timeout` int(11) DEFAULT 15 COMMENT 'Admin şifre onayının ne kadar süreyle (dakika) geçerli olacağı',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BTK EK-1: Hat Durum Kodları Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_ref_hat_durum_kodlari` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `kod` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `aciklama_btk` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'BTK Teknik Dokümanındaki Açıklama',
  `aciklama_tr` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Modül içi Türkçe Açıklama',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_hat_durum_kod` (`kod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BTK EK-2: Müşteri Hareket Kodları Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_ref_musteri_hareket_kodlari` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `kod` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `aciklama_btk` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'BTK Teknik Dokümanındaki Açıklama',
  `aciklama_tr` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Modül içi Türkçe Açıklama',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_musteri_hareket_kod` (`kod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BTK EK-3: Hizmet Tipleri Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_ref_hizmet_tipleri` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `isletme_tipi_btk` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'BTK Dokümanındaki İşletme Tipi (MOBİL, SABIT, ISS vb.)',
  `altyapi_turu_btk` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'BTK Dokümanındaki Altyapı Türü',
  `hizmet_kodu_btk` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Raporda kullanılacak BTK Hizmet Kodu',
  `aciklama_tr` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Modül içi Türkçe Açıklama',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_hizmet_kodu_btk` (`hizmet_kodu_btk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BTK EK-4: Kimlik Tipleri Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_ref_kimlik_tipleri` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `belge_adi_tr` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Modül içi Türkçe Belge Adı',
  `belge_tip_kodu_btk` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'BTK Teknik Dokümanındaki Belge Tip Kodu',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_belge_tip_kodu_btk` (`belge_tip_kodu_btk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BTK EK-5: Meslek Kodları Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_ref_meslek_kodlari` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `kod_btk` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'BTK Teknik Dokümanındaki Meslek Kodu',
  `aciklama_tr` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Modül içi Türkçe Açıklama',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_meslek_kod_btk` (`kod_btk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adres Hiyerarşisi Tabloları
CREATE TABLE IF NOT EXISTS `mod_btk_adres_il` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `plaka_kodu` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `il_adi` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_plaka_kodu` (`plaka_kodu`),
  KEY `idx_il_adi` (`il_adi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mod_btk_adres_ilce` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `il_id` int(10) UNSIGNED NOT NULL,
  `ilce_adi` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ilce_il_id` (`il_id`),
  KEY `idx_ilce_adi` (`ilce_adi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mod_btk_adres_mahalle` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ilce_id` int(10) UNSIGNED NOT NULL,
  `mahalle_adi` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `posta_kodu` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_mahalle_ilce_id` (`ilce_id`),
  KEY `idx_mahalle_adi` (`mahalle_adi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Personel Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_personel` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `whmcs_admin_id` int(10) UNSIGNED NOT NULL,
  `firma_unvani` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `soyadi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tc_kimlik_no` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unvan` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Personelin şirketteki görevi',
  `calistigi_birim` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobil_telefonu` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_telefonu` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_adresi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ev_adresi` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `acil_durum_kisi_adi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `acil_durum_kisi_telefonu` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ise_baslama_tarihi` date DEFAULT NULL,
  `isten_ayrilma_tarihi` date DEFAULT NULL,
  `is_birakma_nedeni` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `btk_listesine_ekle` tinyint(1) NOT NULL DEFAULT 1,
  `olusturulma_zamani` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `son_guncelleme_zamani` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_personel_whmcs_admin_id` (`whmcs_admin_id`),
  KEY `idx_personel_tc_kimlik_no` (`tc_kimlik_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ürün Grubu - BTK Yetki Eşleştirme Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_product_group_map` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `whmcs_product_group_id` int(10) UNSIGNED NOT NULL,
  `btk_yetki_turu_kod_anahtar` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'BTK Yetki Türünün benzersiz anahtarı (örn: ISS_B)',
  `btk_hizmet_kodu_btk` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Bu yetki türü altında raporlanacak varsayılan BTK Hizmet Kodu',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_pgid_yetki_map` (`whmcs_product_group_id`, `btk_yetki_turu_kod_anahtar`),
  KEY `idx_map_hizmet_kodu` (`btk_hizmet_kodu_btk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Oluşturulan/Gönderilen Dosyaların Log Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_dosya_loglari` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `dosya_adi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dosya_tipi` enum('REHBER','HAREKET','PERSONEL') COLLATE utf8mb4_unicode_ci NOT NULL,
  `yetki_turu_kodu` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'REHBER ve HAREKET için',
  `olusturulma_zamani_rapor` datetime NOT NULL COMMENT 'Dosya ismindeki YYYYMMDDHHMMSS',
  `cnt_degeri` int(11) NOT NULL,
  `ftp_ana_yuklenme_zamani` datetime DEFAULT NULL,
  `ftp_ana_yuklenme_durumu` tinyint(1) NOT NULL DEFAULT 0,
  `ftp_ana_hata_mesaji` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ftp_yedek_yuklenme_zamani` datetime DEFAULT NULL,
  `ftp_yedek_yuklenme_durumu` tinyint(1) NOT NULL DEFAULT 0,
  `ftp_yedek_hata_mesaji` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icerik_hash` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'SHA256 dosya içeriği özeti',
  `kayit_zamani` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_dosya_adi` (`dosya_adi`),
  KEY `idx_dosya_tipi_yetki` (`dosya_tipi`,`yetki_turu_kodu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ABONE REHBER Ana Veri Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_abone_rehber` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `whmcs_client_id` int(10) UNSIGNED DEFAULT NULL,
  `whmcs_service_id` int(10) UNSIGNED DEFAULT NULL,
  `btk_yetki_turu_kod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_1_operator_kod` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_2_musteri_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_3_hat_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_4_hat_durum` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'A, P, I, D vb.',
  `alan_5_hat_durum_kodu` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'BTK EK-1',
  `alan_6_hat_durum_aciklama` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_10_hizmet_tipi` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'BTK EK-3''ten hizmet kodu',
  `alan_11_musteri_tipi` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'G-SAHIS, T-SIRKET vb.',
  `alan_12_abone_baslangic` varchar(14) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'YYYYMMDDHHMMSS',
  `alan_13_abone_bitis` varchar(14) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'YYYYMMDDHHMMSS',
  `alan_14_abone_adi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_15_abone_soyadi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_16_abone_tc_kimlik_no` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_17_abone_pasaport_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_18_abone_unvan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_19_abone_vergi_numarasi` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_20_abone_mersis_numarasi` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_21_abone_cinsiyet` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'E, K',
  `alan_22_abone_uyruk` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ISO 3166-1 alpha-3',
  `alan_23_abone_baba_adi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_24_abone_ana_adi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_25_abone_anne_kizlik_soyadi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_26_abone_dogum_yeri` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_27_abone_dogum_tarihi` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'YYYYMMDD',
  `alan_28_abone_meslek` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'BTK EK-5',
  `alan_29_abone_tarife` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_30_abone_kimlik_cilt_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_31_abone_kimlik_kutuk_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_32_abone_kimlik_sayfa_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_33_abone_kimlik_il` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_34_abone_kimlik_ilce` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_35_abone_kimlik_mahalle_koy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_36_abone_kimlik_tipi` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'BTK EK-4',
  `alan_37_abone_kimlik_seri_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_38_abone_kimlik_verildigi_yer` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_39_abone_kimlik_verildigi_tarih` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'YYYYMMDD',
  `alan_40_abone_kimlik_aidiyeti` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'B, Y',
  `alan_41_abone_adres_tesis_il` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_42_abone_adres_tesis_ilce` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_43_abone_adres_tesis_mahalle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_44_abone_adres_tesis_cadde` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_45_abone_adres_tesis_dis_kapi_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_46_abone_adres_tesis_ic_kapi_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_47_abone_adres_tesis_posta_kodu` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_48_abone_adres_tesis_adres_kodu` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'UAVT Adres Kodu',
  `alan_49_abone_adres_irtibat_tel_no_1` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_50_abone_adres_irtibat_tel_no_2` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_51_abone_adres_e_mail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_52_abone_adres_yerlesim_il` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_53_abone_adres_yerlesim_ilce` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_54_abone_adres_yerlesim_mahalle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_55_abone_adres_yerlesim_cadde` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_56_abone_adres_yerlesim_dis_kapi_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_57_abone_adres_yerlesim_ic_kapi_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_58_abone_adres_yerlesim_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'BTK örnek verisindeki alan',
  `alan_59_kurum_yetkili_adi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_60_kurum_yetkili_soyadi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_61_kurum_yetkili_tckimlik_no` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_62_kurum_yetkili_telefon` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_63_kurum_adres` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_64_aktivasyon_bayi_adi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_65_aktivasyon_bayi_adresi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_66_aktivasyon_kullanici` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_67_guncelleyen_bayi_adi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_68_guncelleyen_bayi_adresi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_69_guncelleyen_kullanici` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_70_statik_ip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Birden fazla IP virgülle ayrılabilir',
  `alan_71_ozel_1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'örn: ISS_HIZ_PROFILI, GSM_ONCEKI_HAT_NUMARASI vb.',
  `alan_72_ozel_2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_73_ozel_3` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_74_ozel_4` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_75_ozel_5` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_76_ozel_6` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_77_ozel_7` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_78_ozel_8` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_79_ozel_9` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_80_ozel_10` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_81_ozel_11` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_82_ozel_12` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_83_ozel_13` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_84_ozel_14` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_85_ozel_15` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_nvi_tc_dogrulandi` tinyint(1) DEFAULT 0,
  `is_nvi_yabanci_dogrulandi` tinyint(1) DEFAULT 0,
  `is_permanently_cancelled` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'BTK nezdinde kalıcı iptal mi?',
  `vefat_durumu` tinyint(1) NOT NULL DEFAULT 0,
  `google_map_konum` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_rehber_service_id_yetki` (`whmcs_service_id`, `btk_yetki_turu_kod`),
  KEY `idx_rehber_client_id` (`whmcs_client_id`),
  KEY `idx_rehber_hat_no` (`alan_3_hat_no`),
  KEY `idx_rehber_tc_kimlik_no` (`alan_16_abone_tc_kimlik_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ABONE HAREKET Canlı Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_abone_hareket_canli` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `mod_btk_abone_rehber_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'mod_btk_abone_rehber.id ile ilişkili',
  `whmcs_service_id` int(10) UNSIGNED DEFAULT NULL,
  `btk_yetki_turu_kod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_1_operator_kod` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_2_musteri_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_3_hat_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_7_musteri_hareket_kodu` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'BTK EK-2',
  `alan_8_musteri_hareket_aciklama` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_9_musteri_hareket_zamani` varchar(14) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'YYYYMMDDHHMMSS',
  `hareket_detaylari_json` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_gonderildi` tinyint(1) NOT NULL DEFAULT 0,
  `gonderilen_dosya_id` int(10) UNSIGNED DEFAULT NULL COMMENT 'mod_btk_dosya_loglari.id',
  `gonderim_cnt` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_hareket_canli_rehber_id` (`mod_btk_abone_rehber_id`),
  KEY `idx_hareket_canli_service_id` (`whmcs_service_id`),
  KEY `idx_hareket_canli_gonderildi_tarih` (`is_gonderildi`, `alan_9_musteri_hareket_zamani`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ABONE HAREKET Arşiv Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_abone_hareket_arsiv` (
  `id` bigint(20) UNSIGNED NOT NULL COMMENT 'Canlı tablodaki ID''yi koruyacak, auto_increment YOK',
  `mod_btk_abone_rehber_id` bigint(20) UNSIGNED DEFAULT NULL,
  `whmcs_service_id` int(10) UNSIGNED DEFAULT NULL,
  `btk_yetki_turu_kod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_1_operator_kod` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_2_musteri_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_3_hat_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_7_musteri_hareket_kodu` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alan_8_musteri_hareket_aciklama` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alan_9_musteri_hareket_zamani` varchar(14) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hareket_detaylari_json` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gonderilen_dosya_id` int(10) UNSIGNED DEFAULT NULL,
  `gonderim_cnt` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL COMMENT 'Canlı tablodaki oluşturulma zamanı',
  `arsivlenme_zamani` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_hareket_arsiv_rehber_id` (`mod_btk_abone_rehber_id`),
  KEY `idx_hareket_arsiv_service_id` (`whmcs_service_id`),
  KEY `idx_hareket_arsiv_hareket_zamani` (`alan_9_musteri_hareket_zamani`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;