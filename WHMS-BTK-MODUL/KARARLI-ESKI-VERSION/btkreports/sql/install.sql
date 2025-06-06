-- WHMCS BTK Raporlama Modülü - Veritabanı Kurulum Dosyası v1.0.30
-- TÜM TABLOLAR VE TÜM FOREIGN KEY'LER DAHİL.
SET FOREIGN_KEY_CHECKS=0;

-- mod_btk_config: Modülün genel ayarlarını saklar
CREATE TABLE IF NOT EXISTS `mod_btk_config` (
    `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `setting` VARCHAR(255) NOT NULL,
    `value` TEXT NULL,
    `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `setting_unique_v30` (`setting`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- mod_btk_yetki_turleri: BTK Yetkilendirme Türlerini saklar
CREATE TABLE IF NOT EXISTS `mod_btk_yetki_turleri` (
    `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `yetki_kodu` VARCHAR(50) NOT NULL UNIQUE,
    `yetki_adi` VARCHAR(255) NOT NULL,
    `kapsam` CHAR(1) NOT NULL COMMENT 'B: Bildirim, K: Kullanım Hakkı'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- mod_btk_hizmet_tipleri: Hizmet Tiplerini saklar (EK-3'ten)
CREATE TABLE IF NOT EXISTS `mod_btk_hizmet_tipleri` (
    `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `hizmet_turu` VARCHAR(50) NOT NULL UNIQUE COMMENT 'EK-3 Hizmet Türü Kodu',
    `deger_aciklama` VARCHAR(255) NOT NULL COMMENT 'EK-3 Değer Açıklaması',
    `yetki_turu_kodu` VARCHAR(50) NULL COMMENT 'Bu hizmet tipinin hangi yetki türüyle ilişkili olduğu'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- mod_btk_musteri_tipleri: Müşteri Tiplerini saklar (EK-3'ten)
CREATE TABLE IF NOT EXISTS `mod_btk_musteri_tipleri` (
    `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `musteri_tipi_kodu` VARCHAR(50) NOT NULL UNIQUE COMMENT 'EK-3 Müşteri Tipi Kodu',
    `deger_aciklama` VARCHAR(255) NOT NULL COMMENT 'EK-3 Değer Açıklaması'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- mod_btk_kimlik_tipleri: Kimlik Tiplerini saklar (EK-3'ten)
CREATE TABLE IF NOT EXISTS `mod_btk_kimlik_tipleri` (
    `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `kimlik_tipi_kodu` VARCHAR(50) NOT NULL UNIQUE COMMENT 'EK-3 Kimlik Tipi Kodu',
    `deger_aciklama` VARCHAR(255) NOT NULL COMMENT 'EK-3 Değer Açıklaması'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- mod_btk_kimlik_aidiyeti: Kimlik Aidiyetlerini saklar (EK-3'ten)
CREATE TABLE IF NOT EXISTS `mod_btk_kimlik_aidiyeti` (
    `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `kimlik_aidiyeti_kodu` VARCHAR(50) NOT NULL UNIQUE COMMENT 'EK-3 Kimlik Aidiyeti Kodu',
    `deger_aciklama` VARCHAR(255) NOT NULL COMMENT 'EK-3 Değer Açıklaması'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- mod_btk_hat_durum_kodlari: Hat Durum Kodlarını saklar (EK-1'den)
CREATE TABLE IF NOT EXISTS `mod_btk_hat_durum_kodlari` (
    `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `kod` VARCHAR(10) NOT NULL UNIQUE,
    `durum_adi` VARCHAR(100) NOT NULL,
    `aciklama` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- mod_btk_musteri_hareket_kodlari: Müşteri Hareket Kodlarını saklar (EK-2'den)
CREATE TABLE IF NOT EXISTS `mod_btk_musteri_hareket_kodlari` (
    `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `kod` VARCHAR(10) NOT NULL UNIQUE,
    `aciklama` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- mod_btk_iller: Türkiye İllerini saklar
CREATE TABLE IF NOT EXISTS `mod_btk_iller` (
    `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `plaka_kodu` CHAR(2) NOT NULL UNIQUE,
    `il_adi` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- mod_btk_ilceler: Türkiye İlçelerini saklar
CREATE TABLE IF NOT EXISTS `mod_btk_ilceler` (
    `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `il_id` INT(11) UNSIGNED NOT NULL,
    `ilce_adi` VARCHAR(100) NOT NULL,
    UNIQUE KEY `unique_il_ilce_v30` (`il_id`, `ilce_adi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- mod_btk_mahalleler: Mahalle/Köy bilgilerini saklar
CREATE TABLE IF NOT EXISTS `mod_btk_mahalleler` (
    `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `ilce_id` INT(11) UNSIGNED NOT NULL,
    `mahalle_adi` VARCHAR(150) NOT NULL,
    UNIQUE KEY `unique_ilce_mahalle_v30` (`ilce_id`, `mahalle_adi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- mod_btk_adresler: Abone ve Tesis adreslerini detaylı saklar
CREATE TABLE IF NOT EXISTS `mod_btk_adresler` (
    `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `adres_tipi` ENUM('YERLESIM', 'TESIS', 'KURUM_YETKILI', 'PERSONEL_IKAMET') NOT NULL,
    `il_id` INT(11) UNSIGNED NULL,
    `ilce_id` INT(11) UNSIGNED NULL,
    `mahalle_id` INT(11) UNSIGNED NULL,
    `csbm` VARCHAR(255) NULL COMMENT 'Cadde/Sokak/Bulvar/Meydan',
    `site_bina_adi` VARCHAR(255) NULL,
    `dis_kapi_no` VARCHAR(50) NULL,
    `ic_kapi_no` VARCHAR(50) NULL,
    `posta_kodu` VARCHAR(10) NULL,
    `adres_kodu_uavt` VARCHAR(50) NULL COMMENT 'Ulusal Adres Veri Tabanı Kodu',
    `adres_tam_metin` TEXT NULL COMMENT 'BTK raporu için oluşturulan birleştirilmiş adres metni',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- mod_btk_clients: Müşterilere ait BTK özel bilgilerini saklar
CREATE TABLE IF NOT EXISTS `mod_btk_clients` (
    `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `client_id` INT(10) NOT NULL, -- SIGNED INT(10) to match tblclients.id
    `musteri_tipi_kodu` VARCHAR(50) NULL,
    `abone_baslangic_tarihi` DATE NULL,
    `abone_bitis_tarihi` DATE NULL,
    `abone_tarife` VARCHAR(255) NULL,
    `abone_tc_kimlik_no` VARCHAR(11) NULL,
    `abone_pasaport_no` VARCHAR(50) NULL,
    `abone_unvan` VARCHAR(255) NULL,
    `abone_vergi_numarasi` VARCHAR(20) NULL,
    `abone_mersis_numarasi` VARCHAR(20) NULL,
    `abone_cinsiyet` ENUM('E', 'K', 'D') NULL,
    `abone_uyruk_iso_kodu` CHAR(2) NULL,
    `abone_baba_adi` VARCHAR(100) NULL,
    `abone_ana_adi` VARCHAR(100) NULL,
    `abone_anne_kizlik_soyadi` VARCHAR(100) NULL,
    `abone_dogum_yeri` VARCHAR(100) NULL,
    `abone_dogum_tarihi` DATE NULL,
    `abone_meslek` VARCHAR(100) NULL,
    `abone_kimlik_cilt_no` VARCHAR(10) NULL,
    `abone_kimlik_kutuk_no` VARCHAR(10) NULL,
    `abone_kimlik_sayfa_no` VARCHAR(10) NULL,
    `abone_kimlik_il_id` INT(11) UNSIGNED NULL,
    `abone_kimlik_ilce_id` INT(11) UNSIGNED NULL,
    `abone_kimlik_mahalle_koy` VARCHAR(150) NULL,
    `abone_kimlik_tipi_kodu` VARCHAR(50) NULL,
    `abone_kimlik_seri_no` VARCHAR(20) NULL,
    `abone_kimlik_verildigi_yer` VARCHAR(100) NULL,
    `abone_kimlik_verildigi_tarih` DATE NULL,
    `abone_kimlik_aidiyeti_kodu` VARCHAR(50) NULL,
    `nvi_tckn_durum` BOOLEAN DEFAULT FALSE,
    `nvi_tckn_son_dogrulama` DATETIME NULL,
    `nvi_ykn_durum` BOOLEAN DEFAULT FALSE,
    `nvi_ykn_son_dogrulama` DATETIME NULL,
    `yerlesim_adresi_id` INT(11) UNSIGNED NULL,
    `irtibat_tel_no_1` VARCHAR(20) NULL,
    `irtibat_tel_no_2` VARCHAR(20) NULL,
    `irtibat_email` VARCHAR(255) NULL,
    `kurum_yetkili_adi` VARCHAR(100) NULL,
    `kurum_yetkili_soyadi` VARCHAR(100) NULL,
    `kurum_yetkili_tckimlik_no` VARCHAR(11) NULL,
    `kurum_yetkili_telefon` VARCHAR(20) NULL,
    `kurum_adresi_id` INT(11) UNSIGNED NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `client_id_unique_v30` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- mod_btk_services: Hizmetlere ait BTK özel bilgilerini saklar
CREATE TABLE IF NOT EXISTS `mod_btk_services` (
    `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `service_id` INT(10) NOT NULL, -- SIGNED INT(10) to match tblhosting.id
    `client_id` INT(10) NOT NULL, -- SIGNED INT(10) to match tblclients.id
    `hat_durum_kodu` VARCHAR(10) NULL,
    `hat_aciklama` VARCHAR(255) NULL,
    `override_btk_yetki_turu_kodu` VARCHAR(50) NULL,
    `override_hizmet_tipi_kodu` VARCHAR(50) NULL,
    `tesis_adresi_id` INT(11) UNSIGNED NULL,
    `tesis_adresi_yerlesimle_ayni` BOOLEAN DEFAULT FALSE,
    `statik_ip` VARCHAR(255) NULL,
    `iss_hiz_profili` VARCHAR(100) NULL,
    `iss_kullanici_adi` VARCHAR(100) NULL,
    `iss_pop_bilgisi` VARCHAR(100) NULL,
    `aktivasyon_bayi_adi` VARCHAR(255) NULL,
    `aktivasyon_bayi_adresi` TEXT NULL,
    `aktivasyon_kullanici` VARCHAR(100) NULL,
    `guncelleyen_bayi_adi` VARCHAR(255) NULL,
    `guncelleyen_bayi_adresi` TEXT NULL,
    `guncelleyen_kullanici` VARCHAR(100) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `service_id_unique_v30` (`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- mod_btk_product_mappings: WHMCS ürün gruplarını BTK yetki türleri ve hizmet tipleri ile eşler
CREATE TABLE IF NOT EXISTS `mod_btk_product_mappings` (
    `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `whmcs_product_group_id` INT(10) NOT NULL, -- SIGNED INT(10) to match tblproductgroups.id
    `btk_yetki_turu_kodu` VARCHAR(50) NOT NULL,
    `default_btk_hizmet_tipi_kodu` VARCHAR(50) NULL,
    `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `whmcs_product_group_id_unique_v30` (`whmcs_product_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- mod_btk_hareketler: Raporlanacak abone ve hizmet hareketlerini saklar
CREATE TABLE IF NOT EXISTS `mod_btk_hareketler` (
    `id` BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `client_id` INT(10) NOT NULL, -- SIGNED INT(10)
    `service_id` INT(10) NULL,   -- SIGNED INT(10) (NULL olabilir)
    `musteri_hareket_kodu` VARCHAR(10) NOT NULL,
    `musteri_hareket_aciklama` VARCHAR(255) NULL,
    `hareket_zamani` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `eski_deger` TEXT NULL,
    `yeni_deger` TEXT NULL,
    `detay` TEXT NULL COMMENT 'Hareketle ilgili ek bilgiler, JSON formatında olabilir',
    `raporlandi_mi` BOOLEAN DEFAULT FALSE,
    `raporlanma_zamani` DATETIME NULL,
    `rapor_dosya_adi` VARCHAR(255) NULL,
    `created_by_hook` VARCHAR(255) NULL COMMENT 'Hangi hook tarafından oluşturuldu',
    INDEX `idx_hareket_raporlandi_zamani_v30` (`raporlandi_mi`, `hareket_zamani`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- YENİ: mod_btk_personel Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_personel` (
    `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `admin_id` INT(10) NOT NULL UNIQUE COMMENT 'tbladmins.id ile ilişkili (SIGNED INT(10))',
    `firma_adi` VARCHAR(255) NULL COMMENT 'mod_btk_config.operator_unvani alanından gelecek',
    `adi` VARCHAR(255) NULL COMMENT 'tbladmins.firstname',
    `soyadi` VARCHAR(255) NULL COMMENT 'tbladmins.lastname',
    `tc_kimlik_no` VARCHAR(11) NULL,
    `unvan` VARCHAR(255) NULL COMMENT 'Manuel giriş, BTK için',
    `calistigi_birim` VARCHAR(255) NULL COMMENT 'Manuel giriş, BTK için',
    `mobil_telefonu` VARCHAR(20) NULL COMMENT 'Alan koduyla 10 hane, BTK için',
    `sabit_telefonu` VARCHAR(20) NULL COMMENT 'Alan koduyla 10 hane, BTK için',
    `e_posta_adresi` VARCHAR(255) NULL COMMENT 'tbladmins.email',
    `ev_adresi_id` INT(11) UNSIGNED NULL COMMENT 'mod_btk_adresler.id ile ilişkili (İK için opsiyonel)',
    `acil_durum_kisi_iletisim` TEXT NULL COMMENT 'İK için opsiyonel',
    `ise_baslama_tarihi` DATE NULL COMMENT 'İK için opsiyonel',
    `isten_ayrilma_tarihi` DATE NULL COMMENT 'İK için opsiyonel',
    `is_birakma_nedeni` TEXT NULL COMMENT 'İK için opsiyonel',
    `btk_listesine_eklensin` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- mod_btk_nvi_cache: NVI sorgu sonuçlarını geçici olarak saklamak için
CREATE TABLE IF NOT EXISTS `mod_btk_nvi_cache` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `sorgu_tipi` enum('TCKN','YKN') NOT NULL,
    `sorgu_parametreleri` varchar(512) NOT NULL COMMENT 'JSON olarak sorgu parametreleri',
    `sonuc` tinyint(1) DEFAULT NULL COMMENT 'Doğrulama sonucu: 1=Başarılı, 0=Başarısız, NULL=Hata/Bilinmiyor',
    `yanit_mesaji` text DEFAULT NULL COMMENT 'NVI servisinden dönen mesaj veya hata detayı',
    `son_sorgu_tarihi` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    UNIQUE KEY `unique_sorgu_v30` (`sorgu_tipi`,`sorgu_parametreleri`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- mod_btk_logs: Modülün genel işlem loglarını saklar
CREATE TABLE IF NOT EXISTS `mod_btk_logs` (
    `id` BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `log_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `description` TEXT NOT NULL,
    `user_id` INT(10) NULL COMMENT 'İşlemi yapan WHMCS admin ID (SIGNED INT(10))',
    `client_id` INT(10) NULL COMMENT 'SIGNED INT(10)',
    `service_id` INT(10) NULL COMMENT 'SIGNED INT(10)',
    `ip_address` VARCHAR(45) NULL,
    `log_type` VARCHAR(50) DEFAULT 'INFO' COMMENT 'INFO, ERROR, WARNING, FTP, CRON, NVI'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Foreign Key Kısıtlamalarını Ekleme (TÜMÜ)
ALTER TABLE `mod_btk_hizmet_tipleri`
ADD CONSTRAINT `fk_hizmet_yetki_v30` FOREIGN KEY (`yetki_turu_kodu`) REFERENCES `mod_btk_yetki_turleri`(`yetki_kodu`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `mod_btk_ilceler`
ADD CONSTRAINT `fk_ilceler_il_v30` FOREIGN KEY (`il_id`) REFERENCES `mod_btk_iller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `mod_btk_mahalleler`
ADD CONSTRAINT `fk_mahalleler_ilce_v30` FOREIGN KEY (`ilce_id`) REFERENCES `mod_btk_ilceler`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `mod_btk_adresler`
ADD CONSTRAINT `fk_adres_il_v30` FOREIGN KEY (`il_id`) REFERENCES `mod_btk_iller`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `fk_adres_ilce_v30` FOREIGN KEY (`ilce_id`) REFERENCES `mod_btk_ilceler`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `fk_adres_mahalle_v30` FOREIGN KEY (`mahalle_id`) REFERENCES `mod_btk_mahalleler`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `mod_btk_clients`
ADD CONSTRAINT `fk_clients_whmcs_v30` FOREIGN KEY (`client_id`) REFERENCES `tblclients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `fk_clients_musteri_tipi_v30` FOREIGN KEY (`musteri_tipi_kodu`) REFERENCES `mod_btk_musteri_tipleri`(`musteri_tipi_kodu`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `fk_clients_kimlik_tipi_v30` FOREIGN KEY (`abone_kimlik_tipi_kodu`) REFERENCES `mod_btk_kimlik_tipleri`(`kimlik_tipi_kodu`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `fk_clients_kimlik_aidiyeti_v30` FOREIGN KEY (`abone_kimlik_aidiyeti_kodu`) REFERENCES `mod_btk_kimlik_aidiyeti`(`kimlik_aidiyeti_kodu`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `fk_clients_kimlik_il_v30` FOREIGN KEY (`abone_kimlik_il_id`) REFERENCES `mod_btk_iller`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `fk_clients_kimlik_ilce_v30` FOREIGN KEY (`abone_kimlik_ilce_id`) REFERENCES `mod_btk_ilceler`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `fk_clients_yerlesim_adres_v30` FOREIGN KEY (`yerlesim_adresi_id`) REFERENCES `mod_btk_adresler`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `fk_clients_kurum_adres_v30` FOREIGN KEY (`kurum_adresi_id`) REFERENCES `mod_btk_adresler`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `mod_btk_services`
ADD CONSTRAINT `fk_services_whmcs_v30` FOREIGN KEY (`service_id`) REFERENCES `tblhosting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `fk_services_client_v30` FOREIGN KEY (`client_id`) REFERENCES `tblclients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `fk_services_hat_durum_v30` FOREIGN KEY (`hat_durum_kodu`) REFERENCES `mod_btk_hat_durum_kodlari`(`kod`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `fk_services_override_yetki_v30` FOREIGN KEY (`override_btk_yetki_turu_kodu`) REFERENCES `mod_btk_yetki_turleri`(`yetki_kodu`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `fk_services_override_hizmet_v30` FOREIGN KEY (`override_hizmet_tipi_kodu`) REFERENCES `mod_btk_hizmet_tipleri`(`hizmet_turu`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `fk_services_tesis_adres_v30` FOREIGN KEY (`tesis_adresi_id`) REFERENCES `mod_btk_adresler`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `mod_btk_product_mappings`
ADD CONSTRAINT `fk_mappings_pg_v30` FOREIGN KEY (`whmcs_product_group_id`) REFERENCES `tblproductgroups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `fk_mappings_yetki_v30` FOREIGN KEY (`btk_yetki_turu_kodu`) REFERENCES `mod_btk_yetki_turleri`(`yetki_kodu`) ON DELETE RESTRICT ON UPDATE CASCADE,
ADD CONSTRAINT `fk_mappings_hizmet_tipi_v30` FOREIGN KEY (`default_btk_hizmet_tipi_kodu`) REFERENCES `mod_btk_hizmet_tipleri`(`hizmet_turu`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `mod_btk_hareketler`
ADD CONSTRAINT `fk_hareketler_client_v30` FOREIGN KEY (`client_id`) REFERENCES `tblclients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `fk_hareketler_service_v30` FOREIGN KEY (`service_id`) REFERENCES `tblhosting`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `fk_hareketler_kod_v30` FOREIGN KEY (`musteri_hareket_kodu`) REFERENCES `mod_btk_musteri_hareket_kodlari`(`kod`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `mod_btk_personel`
ADD CONSTRAINT `fk_personel_admin_id_v30` FOREIGN KEY (`admin_id`) REFERENCES `tbladmins`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `fk_personel_ev_adresi_v30` FOREIGN KEY (`ev_adresi_id`) REFERENCES `mod_btk_adresler`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

SET FOREIGN_KEY_CHECKS=1;