-- WHMCS BTK Raporlama Modülü - Veritabanı Kurulum Script'i
-- modules/addons/btkreports/sql/install.sql
-- Son Güncelleme: (Bu dosyanın oluşturulduğu tarih/saat)

-- Hata durumunda devam etmesi için (opsiyonel, bazı MySQL sürümlerinde farklı olabilir)
-- SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
-- SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Modül Ayarları Tablosu
--
CREATE TABLE IF NOT EXISTS `mod_btk_settings` (
    `setting` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `value` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`setting`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- BTK Yetki Türleri Referans Tablosu
--
CREATE TABLE IF NOT EXISTS `mod_btk_yetki_turleri_referans` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `yetki_kodu` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    `yetki_adi` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `grup` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Rapor dosya adındaki TIP (ISS, AIH, STH vb.)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Admin Tarafından Seçilen Aktif BTK Yetki Türleri
--
CREATE TABLE IF NOT EXISTS `mod_btk_secili_yetki_turleri` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `yetki_kodu` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    `aktif` BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (`yetki_kodu`) REFERENCES `mod_btk_yetki_turleri_referans`(`yetki_kodu`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Ürün Grubu - BTK Yetki Türü Eşleştirme Tablosu
--
CREATE TABLE IF NOT EXISTS `mod_btk_product_group_mappings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `gid` INT NOT NULL COMMENT 'tblproductgroups.id',
    `ana_btk_yetki_kodu` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Dosya adı için (mod_btk_yetki_turleri_referans.yetki_kodu)',
    `ek3_hizmet_tipi_kodu` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Rapor içeriğindeki HIZMET_TIPI (mod_btk_ek3_hizmet_tipleri.hizmet_tipi_kodu)',
    UNIQUE KEY `gid_unique` (`gid`),
    FOREIGN KEY (`ana_btk_yetki_kodu`) REFERENCES `mod_btk_yetki_turleri_referans`(`yetki_kodu`) ON DELETE CASCADE ON UPDATE CASCADE
    -- ek3_hizmet_tipi_kodu için foreign key mod_btk_ek3_hizmet_tipleri tablosu oluşturulduktan sonra eklenecek
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Adres Referans Tabloları
--
CREATE TABLE IF NOT EXISTS `mod_btk_adres_il` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `il_adi` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    `plaka_kodu` VARCHAR(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mod_btk_adres_ilce` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `il_id` INT NOT NULL,
    `ilce_adi` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    FOREIGN KEY (`il_id`) REFERENCES `mod_btk_adres_il`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY `il_ilce_unique` (`il_id`, `ilce_adi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mod_btk_adres_mahalle` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ilce_id` INT NOT NULL,
    `mahalle_adi` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `posta_kodu` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    FOREIGN KEY (`ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
    -- INDEX `idx_mahalle_ilce_adi` (`ilce_id`, `mahalle_adi`(191)) -- Uzun unique key'ler için prefix gerekebilir
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- ISS POP Noktaları Tablosu
--
CREATE TABLE IF NOT EXISTS `mod_btk_iss_pop_noktalari` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `pop_adi` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `yayin_yapilan_ssid` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `ip_adresi` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `cihaz_turu` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `cihaz_markasi` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `cihaz_modeli` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `pop_tipi` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'BAZ İSTASYONU, SANTRAL vb.',
    `il_id` INT DEFAULT NULL,
    `ilce_id` INT DEFAULT NULL,
    `mahalle_id` INT DEFAULT NULL,
    `tam_adres` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `koordinatlar` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '"Enlem,Boylam"',
    `aktif_pasif_durum` BOOLEAN NOT NULL DEFAULT 1 COMMENT '1: Aktif, 0: Pasif',
    `eklenme_tarihi` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`il_id`) REFERENCES `mod_btk_adres_il`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`mahalle_id`) REFERENCES `mod_btk_adres_mahalle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    UNIQUE KEY `ssid_ilce_popadi_unique` (`yayin_yapilan_ssid`(191), `ilce_id`, `pop_adi`(191)) -- Uzun unique key'ler için prefix
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Personel Departmanları Referans Tablosu
--
CREATE TABLE IF NOT EXISTS `mod_btk_personel_departmanlari` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `departman_adi` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Personel Bilgileri Tablosu
--
CREATE TABLE IF NOT EXISTS `mod_btk_personel` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `whmcs_admin_id` INT UNIQUE DEFAULT NULL COMMENT 'tbladmins.id',
    `firma_unvani` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `ad` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `soyad` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `tckn` VARCHAR(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `unvan` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Pozisyonu',
    `departman_id` INT DEFAULT NULL,
    `mobil_tel` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `sabit_tel` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `email` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `ev_adresi` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `acil_durum_kisi_iletisim` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `ise_baslama_tarihi` DATE DEFAULT NULL,
    `isten_ayrilma_tarihi` DATE DEFAULT NULL,
    `is_birakma_nedeni` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `gorev_bolgesi_ilce_id` INT DEFAULT NULL,
    `btk_listesine_eklensin` BOOLEAN NOT NULL DEFAULT 1,
    `tckn_dogrulama_durumu` ENUM('Dogrulanmadi', 'Dogrulandi', 'Dogrulanamadi', 'GecersizTCKN', 'Hata') DEFAULT 'Dogrulanmadi',
    `tckn_dogrulama_zamani` TIMESTAMP NULL DEFAULT NULL,
    `tckn_dogrulama_mesaji` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    FOREIGN KEY (`departman_id`) REFERENCES `mod_btk_personel_departmanlari`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`gorev_bolgesi_ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX `idx_personel_tckn` (`tckn`),
    INDEX `idx_personel_email` (`email`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- ABONE REHBER Tablosu
--
CREATE TABLE IF NOT EXISTS `mod_btk_abone_rehber` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `whmcs_client_id` INT DEFAULT NULL COMMENT 'tblclients.id',
    `whmcs_service_id` INT DEFAULT NULL UNIQUE COMMENT 'tblhosting.id (bir hizmet için tek bir rehber kaydı)',
    `operator_kod` VARCHAR(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `musteri_id` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'WHMCS Client ID veya özel bir ID olabilir',
    `hat_no` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Hizmete ait numara veya tekil tanımlayıcı (örn: domain, username, telefon no)',
    `hat_durum` CHAR(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'A, I, D, K',
    `hat_durum_kodu` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `hat_durum_kodu_aciklama` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `musteri_hareket_kodu` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Rehberdeki son hareket kodu',
    `musteri_hareket_aciklama` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `musteri_hareket_zamani` VARCHAR(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'YYYYMMDDHHMMSS (UTC)',
    `hizmet_tipi` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'EK-3 Hizmet Tipi Kodu',
    `musteri_tipi` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'G-SAHIS, T-SIRKET vb.',
    `abone_baslangic` VARCHAR(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'YYYYMMDDHHMMSS (UTC)',
    `abone_bitis` VARCHAR(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'YYYYMMDDHHMMSS (UTC)',
    `abone_adi` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_soyadi` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_tc_kimlik_no` VARCHAR(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_pasaport_no` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_unvan` VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_vergi_numarasi` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_mersis_numarasi` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_cinsiyet` CHAR(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'E, K',
    `abone_uyruk` VARCHAR(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'TUR, SYR vb. (ICAO 9303)',
    `abone_baba_adi` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_ana_adi` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_anne_kizlik_soyadi` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_dogum_yeri` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_dogum_tarihi` VARCHAR(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'YYYYMMDD',
    `abone_meslek` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'EK-5 Meslek Kodu',
    `abone_tarife` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_kimlik_cilt_no` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_kimlik_kutuk_no` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_kimlik_sayfa_no` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_kimlik_il` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_kimlik_ilce` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_kimlik_mahalle_koy` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_kimlik_tipi` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'EK-4 Kimlik Tipi Kodu',
    `abone_kimlik_seri_no` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_kimlik_verildigi_yer` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_kimlik_verildigi_tarih` VARCHAR(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'YYYYMMDD',
    `abone_kimlik_aidiyeti` CHAR(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'B (Bireysel), Y (Yetkili)',
    `yerlesim_il_id` INT DEFAULT NULL,
    `yerlesim_ilce_id` INT DEFAULT NULL,
    `yerlesim_mahalle_id` INT DEFAULT NULL,
    `yerlesim_cadde` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `yerlesim_dis_kapi_no` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `yerlesim_ic_kapi_no` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `yerlesim_posta_kodu` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `yerlesim_adres_kodu_uavt` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `tesis_il_id` INT DEFAULT NULL,
    `tesis_ilce_id` INT DEFAULT NULL,
    `tesis_mahalle_id` INT DEFAULT NULL,
    `tesis_cadde` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `tesis_dis_kapi_no` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `tesis_ic_kapi_no` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `tesis_posta_kodu` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `tesis_adres_kodu_uavt` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `irtibat_tel_no_1` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `irtibat_tel_no_2` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_email` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `kurum_yetkili_adi` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `kurum_yetkili_soyadi` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `kurum_yetkili_tckimlik_no` VARCHAR(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `kurum_yetkili_telefon` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `kurum_adres` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `aktivasyon_bayi_adi` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `aktivasyon_bayi_adresi` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `aktivasyon_kullanici` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `guncelleyen_bayi_adi` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `guncelleyen_bayi_adresi` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `guncelleyen_kullanici` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `statik_ip` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `iss_hiz_profili` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `iss_kullanici_adi` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `iss_pop_bilgisi_sunucu` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'tblhosting.server (veya domain)',
    `iss_pop_noktasi_id` INT DEFAULT NULL COMMENT 'mod_btk_iss_pop_noktalari.id',
    `tesis_koordinat_enlem` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `tesis_koordinat_boylam` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `tckn_dogrulama_durumu` ENUM('Dogrulanmadi', 'Dogrulandi', 'Dogrulanamadi', 'GecersizTCKN', 'Hata', 'NVIPasaport') DEFAULT 'Dogrulanmadi',
    `tckn_dogrulama_zamani` TIMESTAMP NULL DEFAULT NULL,
    `tckn_dogrulama_mesaji` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `son_guncellenme_zamani` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `olusturulma_zamani` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    -- Yetki türüne özel alanlar (alan71-85 veya 71-94) için placeholder'lar
    -- Bu alanlar, BtkHelper::getBtkAlanSiralamasi() ve rapor oluşturma mantığında dinamik olarak eklenecek
    -- veya bu tabloda NULLABLE olarak tanımlanabilir. Şimdilik NULLABLE bırakalım.
    `gsm_onceki_hat_numarasi` VARCHAR(20) DEFAULT NULL,
    `gsm_dondurulma_tarihi` VARCHAR(14) DEFAULT NULL,
    `gsm_kisitlama_tarihi` VARCHAR(14) DEFAULT NULL,
    `gsm_yurtdisi_aktif` CHAR(1) DEFAULT NULL,
    `gsm_sesli_arama_aktif` CHAR(1) DEFAULT NULL,
    `gsm_rehber_aktif` CHAR(1) DEFAULT NULL,
    `gsm_clir_ozelligi_aktif` CHAR(1) DEFAULT NULL,
    `gsm_data_aktif` CHAR(1) DEFAULT NULL,
    `gsm_eskart_bilgisi` VARCHAR(50) DEFAULT NULL,
    `gsm_icci` VARCHAR(22) DEFAULT NULL,
    `gsm_imsi` VARCHAR(15) DEFAULT NULL,
    `gsm_dual_gsm_no` VARCHAR(20) DEFAULT NULL,
    `gsm_fax_no` VARCHAR(20) DEFAULT NULL,
    `gsm_vpn_kisakod_arama_aktif` CHAR(1) DEFAULT NULL,
    `gsm_servis_numarasi` VARCHAR(20) DEFAULT NULL,
    `gsm_bilgi_1` VARCHAR(255) DEFAULT NULL,
    `gsm_bilgi_2` VARCHAR(255) DEFAULT NULL,
    `gsm_bilgi_3` VARCHAR(255) DEFAULT NULL,
    `gsm_alfanumerik_baslik` VARCHAR(11) DEFAULT NULL,
    -- Diğer yetki türleri için de benzer özel alanlar eklenecek...
    FOREIGN KEY (`yerlesim_il_id`) REFERENCES `mod_btk_adres_il`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`yerlesim_ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`yerlesim_mahalle_id`) REFERENCES `mod_btk_adres_mahalle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`tesis_il_id`) REFERENCES `mod_btk_adres_il`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`tesis_ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`tesis_mahalle_id`) REFERENCES `mod_btk_adres_mahalle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`iss_pop_noktasi_id`) REFERENCES `mod_btk_iss_pop_noktalari`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX `idx_rehber_client_id` (`whmcs_client_id`),
    INDEX `idx_rehber_hat_no` (`hat_no`(15)),
    INDEX `idx_rehber_tckn` (`abone_tc_kimlik_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- ABONE HAREKET Canlı Tablosu
--
CREATE TABLE IF NOT EXISTS `mod_btk_abone_hareket_live` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `rehber_kayit_id` BIGINT NOT NULL COMMENT 'mod_btk_abone_rehber.id (veya whmcs_service_id)',
    `musteri_hareket_kodu` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'EK-2 Kodu',
    `musteri_hareket_aciklama` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `musteri_hareket_zamani` VARCHAR(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'YYYYMMDDHHMMSS (UTC)',
    `islem_detayi_json` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Hareket anındaki değişen veya tüm rehber verisinin JSON snapshotı',
    `gonderildi_flag` BOOLEAN NOT NULL DEFAULT 0,
    `cnt_numarasi` VARCHAR(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `gonderilen_dosya_adi` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `gonderim_zamani` TIMESTAMP NULL DEFAULT NULL,
    `kayit_zamani` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`rehber_kayit_id`) REFERENCES `mod_btk_abone_rehber`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_hareket_rehber_id` (`rehber_kayit_id`),
    INDEX `idx_hareket_gonderildi_flag` (`gonderildi_flag`, `kayit_zamani`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- ABONE HAREKET Arşiv Tablosu
--
CREATE TABLE IF NOT EXISTS `mod_btk_abone_hareket_archive` LIKE `mod_btk_abone_hareket_live`;
ALTER TABLE `mod_btk_abone_hareket_archive` ADD `arsivlenme_zamani` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `mod_btk_abone_hareket_archive` DROP PRIMARY KEY, ADD PRIMARY KEY (`id`), MODIFY `id` BIGINT NOT NULL; -- Auto increment'i kaldır

--
-- FTP Gönderim Logları Tablosu
--
CREATE TABLE IF NOT EXISTS `mod_btk_ftp_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `dosya_adi` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `rapor_turu` ENUM('REHBER', 'HAREKET', 'PERSONEL') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `yetki_turu_grup` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `ftp_sunucu_tipi` ENUM('ANA', 'YEDEK') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `gonderim_zamani` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `durum` ENUM('Basarili', 'Basarisiz', 'Bekliyor', 'Atlandi') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Bekliyor',
    `hata_mesaji` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `cnt_numarasi` VARCHAR(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    INDEX `idx_ftp_logs_dosya_adi` (`dosya_adi`(191)),
    INDEX `idx_ftp_logs_rapor_tur_grup_zaman` (`rapor_turu`, `yetki_turu_grup`, `gonderim_zamani`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Genel Modül Logları Tablosu
--
CREATE TABLE IF NOT EXISTS `mod_btk_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `log_zamani` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `log_seviyesi` ENUM('INFO', 'WARNING', 'ERROR', 'DEBUG', 'CRITICAL') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INFO',
    `islem` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `mesaj` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `kullanici_id` INT DEFAULT NULL,
    `ip_adresi` VARCHAR(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    INDEX `idx_logs_zaman_seviye` (`log_zamani`, `log_seviyesi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- WHMCS hizmeti ile POP noktası eşleştirme tablosu
--
CREATE TABLE IF NOT EXISTS `mod_btk_service_pop_mapping` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `whmcs_service_id` INT NOT NULL UNIQUE COMMENT 'tblhosting.id',
    `iss_pop_noktasi_id` INT NOT NULL,
    `guncellenme_zamani` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`iss_pop_noktasi_id`) REFERENCES `mod_btk_iss_pop_noktalari`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
    -- tblhosting.id ile de FOREIGN KEY eklenebilir, ancak WHMCS güncellemelerinde sorun yaratmaması için düşünülmeli.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX `idx_service_pop_service_id` ON `mod_btk_service_pop_mapping`(`whmcs_service_id`);

--
-- EK-3 Hizmet Tipleri Referans Tablosu
--
CREATE TABLE IF NOT EXISTS `mod_btk_ek3_hizmet_tipleri` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `hizmet_tipi_kodu` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE COMMENT 'Örn: ADSL, FIBER, WIFI',
    `hizmet_tipi_aciklamasi` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Örn: ADSL İnternet Erişimi',
    `ana_yetki_grup` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Bu hizmet tipinin raporlanacağı ana grup (ISS, STH vb.)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- EK-1 Hat Durum Kodları Referans Tablosu
--
CREATE TABLE IF NOT EXISTS `mod_btk_hat_durum_kodlari_referans` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kod` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    `aciklama` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- EK-2 Müşteri Hareket Kodları Referans Tablosu
--
CREATE TABLE IF NOT EXISTS `mod_btk_musteri_hareket_kodlari_referans` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kod` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    `aciklama` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- EK-4 Kimlik Tipleri Referans Tablosu
--
CREATE TABLE IF NOT EXISTS `mod_btk_kimlik_tipleri_referans` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kod` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    `aciklama` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `ulke_kodu_gerekli` BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- EK-5 Meslek Kodları Referans Tablosu
--
CREATE TABLE IF NOT EXISTS `mod_btk_meslek_kodlari_referans` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kod` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    `aciklama` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


ALTER TABLE `mod_btk_product_group_mappings`
ADD CONSTRAINT `fk_pgm_ek3_hizmet_tipi`
FOREIGN KEY (`ek3_hizmet_tipi_kodu`) REFERENCES `mod_btk_ek3_hizmet_tipleri`(`hizmet_tipi_kodu`)
ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;