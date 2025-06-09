-- btkreports modülü için veritabanı tabloları oluşturma scripti
-- ANA HEDEF: BTK Raporlama Gereksinimleri
-- Son Güncelleme: (Şu anki tarih ve saat)

-- Modül Ayarları Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_settings` (
    `setting` VARCHAR(255) NOT NULL PRIMARY KEY,
    `value` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BTK Ana Yetkilendirme Konuları Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_yetki_turleri_referans` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `yetki_kodu_config` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Config ekranında kullanılacak anahtar (örn: ISS_B_GENEL)',
    `yetki_adi_config` VARCHAR(255) NOT NULL COMMENT 'Config ekranında görünecek tam ad (örn: İnternet Servis Sağlayıcılığı (B))',
    `rapor_tip_kodu` VARCHAR(10) NOT NULL COMMENT 'Rapor dosya adındaki TIP için (ISS, STH, AIH, GSM, UYDU, GMPCS)',
    INDEX `idx_rapor_tip_kodu` (`rapor_tip_kodu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin Tarafından Seçilen Aktif BTK Yetkilendirme Konuları
CREATE TABLE IF NOT EXISTS `mod_btk_secili_yetki_turleri` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `yetki_kodu_config` VARCHAR(100) NOT NULL UNIQUE COMMENT 'mod_btk_yetki_turleri_referans.yetki_kodu_config',
    `aktif` BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (`yetki_kodu_config`) REFERENCES `mod_btk_yetki_turleri_referans`(`yetki_kodu_config`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BTK EK-3 Hizmet Tipleri Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_hizmet_tipleri_referans` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `hizmet_tipi_kodu` VARCHAR(50) NOT NULL UNIQUE COMMENT 'BTK EK-3 HIZMET_TURU Değeri (örn: ADSL, FIBER_ISS)',
    `aciklama` VARCHAR(255) NOT NULL COMMENT 'BTK EK-3 Açıklaması',
    `ilgili_rapor_tip_kodu` VARCHAR(10) DEFAULT NULL COMMENT 'Bu hizmet tipinin ait olduğu ana rapor tipi (ISS, STH vb.) - Filtreleme için'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX `idx_hizmet_ilgili_rapor_tip` ON `mod_btk_hizmet_tipleri_referans`(`ilgili_rapor_tip_kodu`);

-- Ürün - BTK Yetkilendirme Konusu ve Detaylı Hizmet Tipi Eşleştirme Tablosu
-- WHMCS Ürün ID'si ile eşleştirme yapılacak.
CREATE TABLE IF NOT EXISTS `mod_btk_product_mappings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `whmcs_product_id` INT NOT NULL UNIQUE COMMENT 'tblproducts.id',
    `ana_yetki_kodu_config` VARCHAR(100) NOT NULL COMMENT 'mod_btk_yetki_turleri_referans.yetki_kodu_config',
    `detayli_hizmet_tipi_kodu` VARCHAR(50) NOT NULL COMMENT 'mod_btk_hizmet_tipleri_referans.hizmet_tipi_kodu (Rapor içeriğindeki alan10 için)',
    FOREIGN KEY (`ana_yetki_kodu_config`) REFERENCES `mod_btk_yetki_turleri_referans`(`yetki_kodu_config`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`detayli_hizmet_tipi_kodu`) REFERENCES `mod_btk_hizmet_tipleri_referans`(`hizmet_tipi_kodu`) ON DELETE RESTRICT ON UPDATE CASCADE
    -- tblproducts.id için FOREIGN KEY eklenebilir, WHMCS güncellemelerinde sorun yaratmaması için dikkatli olunmalı.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adres Referans Tabloları
CREATE TABLE IF NOT EXISTS `mod_btk_adres_il` ( `id` INT AUTO_INCREMENT PRIMARY KEY, `il_adi` VARCHAR(255) NOT NULL UNIQUE, `plaka_kodu` VARCHAR(2) DEFAULT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `mod_btk_adres_ilce` ( `id` INT AUTO_INCREMENT PRIMARY KEY, `il_id` INT NOT NULL, `ilce_adi` VARCHAR(255) NOT NULL, FOREIGN KEY (`il_id`) REFERENCES `mod_btk_adres_il`(`id`) ON DELETE CASCADE ON UPDATE CASCADE, UNIQUE KEY `il_ilce_unique` (`il_id`, `ilce_adi`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `mod_btk_adres_mahalle` ( `id` INT AUTO_INCREMENT PRIMARY KEY, `ilce_id` INT NOT NULL, `mahalle_adi` VARCHAR(255) NOT NULL, `posta_kodu` VARCHAR(10) DEFAULT NULL, FOREIGN KEY (`ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE CASCADE ON UPDATE CASCADE ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- EK Listeleri İçin Referans Tabloları
CREATE TABLE IF NOT EXISTS `mod_btk_hat_durum_kodlari_referans` ( `id` INT AUTO_INCREMENT PRIMARY KEY, `kod` VARCHAR(10) NOT NULL UNIQUE, `aciklama` VARCHAR(255) NOT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `mod_btk_musteri_hareket_kodlari_referans` ( `id` INT AUTO_INCREMENT PRIMARY KEY, `kod` VARCHAR(10) NOT NULL UNIQUE, `aciklama` VARCHAR(255) NOT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `mod_btk_kimlik_tipleri_referans` ( `id` INT AUTO_INCREMENT PRIMARY KEY, `kod` VARCHAR(10) NOT NULL UNIQUE, `aciklama` VARCHAR(255) NOT NULL, `ulke_kodu_gerekli` BOOLEAN DEFAULT FALSE ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `mod_btk_meslek_kodlari_referans` ( `id` INT AUTO_INCREMENT PRIMARY KEY, `kod` VARCHAR(10) NOT NULL UNIQUE, `aciklama` VARCHAR(255) NOT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ISS POP Noktaları Tablosu (Sizin Excel'inize göre düzenlendi)
CREATE TABLE IF NOT EXISTS `mod_btk_iss_pop_noktalari` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `pop_adi_lokasyon_adi` VARCHAR(255) DEFAULT NULL COMMENT 'Excel: POP Adı / Lokasyon Adı',
    `yayin_yapilan_ssid` VARCHAR(255) NOT NULL COMMENT 'Excel: YAYIN YAPILAN SSID',
    `ip_adresi` VARCHAR(255) DEFAULT NULL COMMENT 'Excel: IP ADRESİ',
    `turu` VARCHAR(100) DEFAULT NULL COMMENT 'Excel: TÜRÜ (Baz İstasyonu, Santral vb.)',
    `markasi` VARCHAR(100) DEFAULT NULL COMMENT 'Excel: MARKASI',
    `modeli` VARCHAR(100) DEFAULT NULL COMMENT 'Excel: MODELİ',
    `il` VARCHAR(100) DEFAULT NULL COMMENT 'Excel: İL (İleride il_id''ye çevrilecek)',
    `ilce` VARCHAR(100) DEFAULT NULL COMMENT 'Excel: İLÇE (İleride ilce_id''ye çevrilecek)',
    `tam_adres` TEXT DEFAULT NULL COMMENT 'Excel: TAM ADRES',
    `koordinatlar` VARCHAR(100) DEFAULT NULL COMMENT 'Excel: KOORDİNATLAR (Enlem,Boylam)',
    `aktif_pasif` VARCHAR(50) DEFAULT NULL COMMENT 'Excel: AKTİF/PASİF (İleride boolean''a çevrilecek)',
    `eklenme_tarihi` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `ssid_ilce_popadi_unique` (`yayin_yapilan_ssid`, `ilce`, `pop_adi_lokasyon_adi`(191)) -- SSID, İlçe ve POP Adı unique olmalı (pop_adi_lokasyon_adi için prefix index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Personel Departmanları Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_personel_departmanlari` ( `id` INT AUTO_INCREMENT PRIMARY KEY, `departman_adi` VARCHAR(255) NOT NULL UNIQUE ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Personel Bilgileri Tablosu (BTK Raporu ve İK ihtiyaçlarına göre düzenlendi)
CREATE TABLE IF NOT EXISTS `mod_btk_personel` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `whmcs_admin_id` INT UNIQUE DEFAULT NULL COMMENT 'tbladmins.id (Opsiyonel ilişki)',
    `firma_unvani` VARCHAR(255) DEFAULT NULL COMMENT 'BTK Raporu için: Operatörün tam ticari ünvanı',
    `ad` VARCHAR(100) DEFAULT NULL,
    `soyad` VARCHAR(100) DEFAULT NULL,
    `tckn` VARCHAR(11) DEFAULT NULL COMMENT 'BTK Raporu için',
    `unvan_pozisyon` VARCHAR(100) DEFAULT NULL COMMENT 'BTK Raporu için: Ünvan',
    `departman_id` INT DEFAULT NULL COMMENT 'BTK Raporu için: Çalıştığı birim (mod_btk_personel_departmanlari.id)',
    `mobil_tel` VARCHAR(20) DEFAULT NULL COMMENT 'BTK Raporu için (alan koduyla 10 hane)',
    `sabit_tel` VARCHAR(20) DEFAULT NULL COMMENT 'BTK Raporu için (alan koduyla 10 hane)',
    `email` VARCHAR(255) DEFAULT NULL COMMENT 'BTK Raporu için: E-posta adresi',
    `ev_adresi_ik` TEXT DEFAULT NULL COMMENT 'İK İçin',
    `acil_durum_kisi_ik` TEXT DEFAULT NULL COMMENT 'İK İçin',
    `ise_baslama_tarihi_ik` DATE DEFAULT NULL COMMENT 'İK İçin',
    `isten_ayrilma_tarihi_btk` DATE DEFAULT NULL COMMENT 'BTK Raporu için (Excelde sadece aktifler listelenir)',
    `is_birakma_nedeni_ik` TEXT DEFAULT NULL COMMENT 'İK İçin',
    `gorev_bolgesi_ilce_id` INT DEFAULT NULL COMMENT 'mod_btk_adres_ilce.id (Google Maps için)',
    `btk_listesine_eklensin` BOOLEAN NOT NULL DEFAULT 1 COMMENT 'BTK Personel Raporuna dahil edilsin mi?',
    `tckn_dogrulama_durumu` ENUM('Dogrulanmadi', 'Dogrulandi', 'Dogrulanamadi', 'GecersizTCKN', 'Hata') DEFAULT 'Dogrulanmadi',
    `tckn_dogrulama_zamani` TIMESTAMP NULL DEFAULT NULL,
    `tckn_dogrulama_mesaji` TEXT DEFAULT NULL,
    FOREIGN KEY (`departman_id`) REFERENCES `mod_btk_personel_departmanlari`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`gorev_bolgesi_ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ABONE REHBER Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_abone_rehber` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `whmcs_client_id` INT DEFAULT NULL, `whmcs_service_id` INT DEFAULT NULL UNIQUE,
    `operator_kod` VARCHAR(3) NOT NULL, `musteri_id` VARCHAR(255) NOT NULL, `hat_no` VARCHAR(20) NOT NULL,
    `hat_durum` CHAR(1) DEFAULT NULL, `hat_durum_kodu` VARCHAR(10) DEFAULT NULL, `hat_durum_kodu_aciklama` VARCHAR(255) DEFAULT NULL,
    `musteri_hareket_kodu` VARCHAR(10) DEFAULT NULL, `musteri_hareket_aciklama` VARCHAR(255) DEFAULT NULL, `musteri_hareket_zamani` VARCHAR(14) DEFAULT NULL,
    `rapor_tip_kodu` VARCHAR(10) DEFAULT NULL COMMENT 'Dosya adındaki TIP (ISS, STH vb.)',
    `hizmet_tipi_ek3_kodu` VARCHAR(50) DEFAULT NULL COMMENT 'BTK EK-3 Hizmet Tipi Kodu (alan10 için)',
    `musteri_tipi` VARCHAR(20) DEFAULT NULL,
    `abone_baslangic` VARCHAR(14) DEFAULT NULL, `abone_bitis` VARCHAR(14) DEFAULT NULL,
    `abone_adi` VARCHAR(100) DEFAULT NULL, `abone_soyadi` VARCHAR(100) DEFAULT NULL,
    `abone_tc_kimlik_no` VARCHAR(11) DEFAULT NULL, `abone_pasaport_no` VARCHAR(50) DEFAULT NULL, `abone_unvan` VARCHAR(250) DEFAULT NULL,
    `abone_vergi_numarasi` VARCHAR(20) DEFAULT NULL, `abone_mersis_numarasi` VARCHAR(50) DEFAULT NULL,
    `abone_cinsiyet` CHAR(1) DEFAULT NULL, `abone_uyruk` VARCHAR(3) DEFAULT NULL,
    `abone_baba_adi` VARCHAR(100) DEFAULT NULL, `abone_ana_adi` VARCHAR(100) DEFAULT NULL, `abone_anne_kizlik_soyadi` VARCHAR(100) DEFAULT NULL,
    `abone_dogum_yeri` VARCHAR(100) DEFAULT NULL, `abone_dogum_tarihi` VARCHAR(8) DEFAULT NULL,
    `abone_meslek` VARCHAR(10) DEFAULT NULL, `abone_tarife` VARCHAR(100) DEFAULT NULL,
    `abone_kimlik_cilt_no` VARCHAR(10) DEFAULT NULL, `abone_kimlik_kutuk_no` VARCHAR(10) DEFAULT NULL, `abone_kimlik_sayfa_no` VARCHAR(10) DEFAULT NULL,
    `abone_kimlik_il` VARCHAR(100) DEFAULT NULL, `abone_kimlik_ilce` VARCHAR(100) DEFAULT NULL, `abone_kimlik_mahalle_koy` VARCHAR(100) DEFAULT NULL,
    `abone_kimlik_tipi` VARCHAR(10) DEFAULT NULL, `abone_kimlik_seri_no` VARCHAR(20) DEFAULT NULL,
    `abone_kimlik_verildigi_yer` VARCHAR(100) DEFAULT NULL, `abone_kimlik_verildigi_tarih` VARCHAR(8) DEFAULT NULL, `abone_kimlik_aidiyeti` CHAR(1) DEFAULT NULL,
    `yerlesim_il_id` INT DEFAULT NULL, `yerlesim_ilce_id` INT DEFAULT NULL, `yerlesim_mahalle_id` INT DEFAULT NULL,
    `yerlesim_cadde` VARCHAR(255) DEFAULT NULL, `yerlesim_dis_kapi_no` VARCHAR(50) DEFAULT NULL, `yerlesim_ic_kapi_no` VARCHAR(50) DEFAULT NULL,
    `yerlesim_posta_kodu` VARCHAR(10) DEFAULT NULL, `yerlesim_adres_kodu_uavt` VARCHAR(50) DEFAULT NULL,
    `tesis_il_id` INT DEFAULT NULL, `tesis_ilce_id` INT DEFAULT NULL, `tesis_mahalle_id` INT DEFAULT NULL,
    `tesis_cadde` VARCHAR(255) DEFAULT NULL, `tesis_dis_kapi_no` VARCHAR(50) DEFAULT NULL, `tesis_ic_kapi_no` VARCHAR(50) DEFAULT NULL,
    `tesis_posta_kodu` VARCHAR(10) DEFAULT NULL, `tesis_adres_kodu_uavt` VARCHAR(50) DEFAULT NULL,
    `irtibat_tel_no_1` VARCHAR(20) DEFAULT NULL, `irtibat_tel_no_2` VARCHAR(20) DEFAULT NULL, `abone_email` VARCHAR(255) DEFAULT NULL,
    `kurum_yetkili_adi` VARCHAR(100) DEFAULT NULL, `kurum_yetkili_soyadi` VARCHAR(100) DEFAULT NULL, `kurum_yetkili_tckimlik_no` VARCHAR(11) DEFAULT NULL,
    `kurum_yetkili_telefon` VARCHAR(20) DEFAULT NULL, `kurum_adres` TEXT DEFAULT NULL,
    `aktivasyon_bayi_adi` VARCHAR(255) DEFAULT NULL, `aktivasyon_bayi_adresi` TEXT DEFAULT NULL, `aktivasyon_kullanici` VARCHAR(100) DEFAULT NULL,
    `guncelleyen_bayi_adi` VARCHAR(255) DEFAULT NULL, `guncelleyen_bayi_adresi` TEXT DEFAULT NULL, `guncelleyen_kullanici` VARCHAR(100) DEFAULT NULL,
    `statik_ip` VARCHAR(255) DEFAULT NULL,
    `iss_hiz_profili` VARCHAR(100) DEFAULT NULL,
    `iss_kullanici_adi` VARCHAR(255) DEFAULT NULL,
    `iss_pop_bilgisi_sunucu` VARCHAR(255) DEFAULT NULL,
    `iss_pop_noktasi_id` INT DEFAULT NULL,
    `tesis_koordinat_enlem` VARCHAR(50) DEFAULT NULL,
    `tesis_koordinat_boylam` VARCHAR(50) DEFAULT NULL,
    `tckn_dogrulama_durumu` ENUM('Dogrulanmadi', 'Dogrulandi', 'Dogrulanamadi', 'GecersizTCKN', 'Hata', 'NVIPasaport') DEFAULT 'Dogrulanmadi',
    `tckn_dogrulama_zamani` TIMESTAMP NULL DEFAULT NULL,
    `tckn_dogrulama_mesaji` TEXT DEFAULT NULL,
    `rehber_ozel_alanlar_json` TEXT DEFAULT NULL,
    `son_guncellenme_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `olusturulma_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`yerlesim_il_id`) REFERENCES `mod_btk_adres_il`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`yerlesim_ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`yerlesim_mahalle_id`) REFERENCES `mod_btk_adres_mahalle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`tesis_il_id`) REFERENCES `mod_btk_adres_il`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`tesis_ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`tesis_mahalle_id`) REFERENCES `mod_btk_adres_mahalle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`iss_pop_noktasi_id`) REFERENCES `mod_btk_iss_pop_noktalari`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`hizmet_tipi_ek3_kodu`) REFERENCES `mod_btk_hizmet_tipleri_referans`(`hizmet_tipi_kodu`) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX `idx_rehber_client_id` (`whmcs_client_id`), INDEX `idx_rehber_hat_no` (`hat_no`), INDEX `idx_rehber_tckn` (`abone_tc_kimlik_no`),
    INDEX `idx_rehber_rapor_tip` (`rapor_tip_kodu`), INDEX `idx_rehber_hat_durum` (`hat_durum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ABONE HAREKET Canlı Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_abone_hareket_live` ( `id` BIGINT AUTO_INCREMENT PRIMARY KEY, `rehber_kayit_id` BIGINT NOT NULL, `musteri_hareket_kodu` VARCHAR(10) NOT NULL, `musteri_hareket_aciklama` VARCHAR(255) NOT NULL, `musteri_hareket_zamani` VARCHAR(14) NOT NULL, `islem_detayi_json` TEXT DEFAULT NULL, `gonderildi_flag` BOOLEAN NOT NULL DEFAULT 0, `cnt_numarasi` VARCHAR(2) DEFAULT NULL, `gonderilen_dosya_adi` VARCHAR(255) DEFAULT NULL, `gonderim_zamani` TIMESTAMP NULL DEFAULT NULL, `kayit_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (`rehber_kayit_id`) REFERENCES `mod_btk_abone_rehber`(`id`) ON DELETE CASCADE ON UPDATE CASCADE, INDEX `idx_hareket_rehber_kayit_id` (`rehber_kayit_id`), INDEX `idx_hareket_gonderildi_flag` (`gonderildi_flag`), INDEX `idx_hareket_zaman` (`musteri_hareket_zamani`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ABONE HAREKET Arşiv Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_abone_hareket_archive` LIKE `mod_btk_abone_hareket_live`;
ALTER TABLE `mod_btk_abone_hareket_archive` ADD `arsivlenme_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- FTP Gönderim Logları Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_ftp_logs` ( `id` INT AUTO_INCREMENT PRIMARY KEY, `dosya_adi` VARCHAR(255) NOT NULL, `rapor_turu` ENUM('REHBER', 'HAREKET', 'PERSONEL') NOT NULL, `yetki_turu_grup` VARCHAR(50) DEFAULT NULL, `ftp_sunucu_tipi` ENUM('ANA', 'YEDEK') NOT NULL, `gonderim_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `durum` ENUM('Basarili', 'Basarisiz', 'Bekliyor', 'Atlandi') NOT NULL DEFAULT 'Bekliyor', `hata_mesaji` TEXT DEFAULT NULL, `cnt_numarasi` VARCHAR(2) NOT NULL, INDEX `idx_ftp_logs_dosya_adi` (`dosya_adi`(191)), INDEX `idx_ftp_logs_rapor_tur_durum` (`rapor_turu`, `durum`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Genel Modül Logları Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_logs` ( `id` INT AUTO_INCREMENT PRIMARY KEY, `log_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `log_seviyesi` ENUM('INFO', 'WARNING', 'ERROR', 'DEBUG', 'CRITICAL') NOT NULL DEFAULT 'INFO', `islem` VARCHAR(255) DEFAULT NULL, `mesaj` TEXT, `kullanici_id` INT DEFAULT NULL, `ip_adresi` VARCHAR(45) DEFAULT NULL, INDEX `idx_logs_seviye_islem` (`log_seviyesi`, `islem`(191)) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- WHMCS hizmeti ile POP noktası eşleştirme tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_service_pop_mapping` ( `id` INT AUTO_INCREMENT PRIMARY KEY, `whmcs_service_id` INT NOT NULL UNIQUE, `iss_pop_noktasi_id` INT NOT NULL, `guncellenme_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (`iss_pop_noktasi_id`) REFERENCES `mod_btk_iss_pop_noktalari`(`id`) ON DELETE CASCADE ON UPDATE CASCADE, INDEX `idx_service_pop_service_id` (`whmcs_service_id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;