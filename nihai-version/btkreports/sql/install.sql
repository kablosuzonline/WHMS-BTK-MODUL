-- WHMCS BTK Raporlama Modülü - Veritabanı Kurulum Script'i
-- Sürüm: 7.2.5 (Operatör - KRİTİK AKTİVASYON HATASI DÜZELTMESİ)
-- Bu script, modül etkinleştirildiğinde çalışarak gerekli tüm veritabanı yapılarını oluşturur.
-- TABLO OLUŞTURMA SIRALAMASI FOREIGN KEY BAĞIMLILIKLARINA GÖRE KESİN OLARAK DÜZENLENMİŞTİR.

-- 1. Ayarlar Tablosu (Bağımsız)
CREATE TABLE IF NOT EXISTS `mod_btk_settings` (
    `setting` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `value` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`setting`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Adres Referans Tabloları (Diğer tablolar tarafından referans alınırlar, bu yüzden ilk oluşturulmalılar)
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Personel Departmanları Tablosu (Personel tablosu tarafından referans alınır)
CREATE TABLE IF NOT EXISTS `mod_btk_personel_departmanlari` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `departman_adi` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BTK Yetki ve Kod Referans Tabloları (Diğer tablolar tarafından referans alınırlar)
CREATE TABLE IF NOT EXISTS `mod_btk_yetki_turleri_referans` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `yetki_kodu` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    `yetki_adi` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `grup` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Rapor dosya adındaki TIP (ISS, AIH, STH vb.)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mod_btk_ek3_hizmet_tipleri` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `hizmet_tipi_kodu` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE COMMENT 'Örn: ADSL, FIBER, WIFI',
    `hizmet_tipi_aciklamasi` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Örn: ADSL İnternet Erişimi',
    `ana_yetki_grup` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Bu hizmet tipinin raporlanacağı ana grup (ISS, STH vb.)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mod_btk_hat_durum_kodlari_referans` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kod` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    `aciklama` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mod_btk_musteri_hareket_kodlari_referans` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kod` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    `aciklama` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mod_btk_kimlik_tipleri_referans` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kod` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    `aciklama` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `ulke_kodu_gerekli` BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mod_btk_meslek_kodlari_referans` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kod` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    `aciklama` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 5. Referansları Kullanan Ara Tablolar
CREATE TABLE IF NOT EXISTS `mod_btk_secili_yetki_turleri` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `yetki_kodu` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    `aktif` BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (`yetki_kodu`) REFERENCES `mod_btk_yetki_turleri_referans`(`yetki_kodu`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Personel bilgilerini tutan ana tablo
CREATE TABLE IF NOT EXISTS `mod_btk_personel` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `whmcs_admin_id` INT UNIQUE DEFAULT NULL COMMENT 'tbladmins.id',
    `firma_unvani` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `ad` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `soyad` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `tckn` VARCHAR(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `dogum_yili` INT(4) DEFAULT NULL COMMENT 'TCKN Doğrulama için doğum yılı',
    `dogum_tarihi` DATE DEFAULT NULL COMMENT 'Tam doğum tarihi (YYYY-MM-DD), İK amacıyla eklendi',
    `cinsiyet` ENUM('E', 'K') DEFAULT NULL COMMENT 'Cinsiyet (E: Erkek, K: Kadın), İK amacıyla eklendi',
    `medeni_durum` VARCHAR(20) DEFAULT NULL COMMENT 'Medeni durum (Evli, Bekar vb.), İK amacıyla eklendi',
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
    `tckn_dogrulama_durumu` ENUM('Dogrulanmadi', 'Dogrulandi', 'Dogrulanamadi', 'GecersizTCKN', 'Hata', 'Kapali') DEFAULT 'Dogrulanmadi',
    `tckn_dogrulama_zamani` TIMESTAMP NULL DEFAULT NULL,
    `tckn_dogrulama_mesaji` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    FOREIGN KEY (`departman_id`) REFERENCES `mod_btk_personel_departmanlari`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`gorev_bolgesi_ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX `idx_personel_tckn` (`tckn`),
    INDEX `idx_personel_email` (`email`(191)),
    INDEX `idx_personel_dogum_tarihi` (`dogum_tarihi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mod_btk_product_group_mappings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `gid` INT NOT NULL COMMENT 'tblproductgroups.id',
    `ana_btk_yetki_kodu` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Dosya adı için (mod_btk_yetki_turleri_referans.yetki_kodu)',
    `ek3_hizmet_tipi_kodu` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Rapor içeriğindeki HIZMET_TIPI (mod_btk_ek3_hizmet_tipleri.hizmet_tipi_kodu)',
    UNIQUE KEY `gid_unique` (`gid`),
    FOREIGN KEY (`ana_btk_yetki_kodu`) REFERENCES `mod_btk_yetki_turleri_referans`(`yetki_kodu`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`ek3_hizmet_tipi_kodu`) REFERENCES `mod_btk_ek3_hizmet_tipleri`(`hizmet_tipi_kodu`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
    `izleme_aktif` BOOLEAN NOT NULL DEFAULT 0 COMMENT 'Bu POP noktası için izleme aktif mi?',
    `izleme_ip_adresi` VARCHAR(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ping atılacak spesifik IP adresi',
    `izleme_portu` INT(5) DEFAULT NULL COMMENT 'Cihazı izlemek için kullanılacak özel port',
    `son_izleme_zamani` TIMESTAMP NULL DEFAULT NULL COMMENT 'En son ne zaman kontrol edildi?',
    `canli_durum` ENUM('UNKNOWN', 'ONLINE', 'OFFLINE', 'HIGH_LATENCY') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UNKNOWN' COMMENT 'İzleme sonucu anlık durum',
    `son_ping_gecikmesi_ms` INT DEFAULT NULL COMMENT 'Milisaniye cinsinden son başarılı ping gecikmesi',
    `eklenme_tarihi` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`il_id`) REFERENCES `mod_btk_adres_il`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`mahalle_id`) REFERENCES `mod_btk_adres_mahalle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    UNIQUE KEY `ssid_ilce_popadi_unique` (`yayin_yapilan_ssid`(191), `ilce_id`, `pop_adi`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 7. Birbirine Bağımlı veya Diğerlerini Referans Alan En Karmaşık Tablolar
CREATE TABLE IF NOT EXISTS `mod_btk_abone_rehber` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `whmcs_client_id` INT DEFAULT NULL COMMENT 'tblclients.id',
    `whmcs_service_id` INT DEFAULT NULL UNIQUE COMMENT 'tblhosting.id (bir hizmet için tek bir rehber kaydı)',
    `operator_kod` VARCHAR(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `musteri_id` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `hat_no` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `hat_durum` CHAR(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'A, I, D, K',
    `hat_durum_kodu` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `hat_durum_kodu_aciklama` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `hizmet_tipi` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `musteri_tipi` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_baslangic` VARCHAR(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_bitis` VARCHAR(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_adi` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_soyadi` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_tc_kimlik_no` VARCHAR(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_pasaport_no` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_unvan` VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_vergi_numarasi` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_mersis_numarasi` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_cinsiyet` CHAR(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_uyruk` VARCHAR(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_baba_adi` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_ana_adi` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_anne_kizlik_soyadi` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_dogum_yeri` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_dogum_tarihi` VARCHAR(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_meslek` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_tarife` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_kimlik_tipi` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_kimlik_seri_no` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_kimlik_verildigi_yer` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_kimlik_verildigi_tarih` VARCHAR(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_kimlik_aidiyeti` CHAR(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `yerlesim_il_id` INT DEFAULT NULL,
    `yerlesim_ilce_id` INT DEFAULT NULL,
    `yerlesim_mahalle_id` INT DEFAULT NULL,
    `yerlesim_cadde` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `yerlesim_dis_kapi_no` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `yerlesim_ic_kapi_no` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `tesis_il_id` INT DEFAULT NULL,
    `tesis_ilce_id` INT DEFAULT NULL,
    `tesis_mahalle_id` INT DEFAULT NULL,
    `tesis_cadde` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `tesis_dis_kapi_no` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `tesis_ic_kapi_no` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `irtibat_tel_no_1` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `irtibat_tel_no_2` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `abone_email` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `kurum_yetkili_adi` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `kurum_yetkili_soyadi` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `kurum_yetkili_tckimlik_no` VARCHAR(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `kurum_yetkili_telefon` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `statik_ip` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `iss_hiz_profili` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `iss_kullanici_adi` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `iss_pop_noktasi_id` INT DEFAULT NULL,
    `son_guncellenme_zamani` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`yerlesim_il_id`) REFERENCES `mod_btk_adres_il`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`yerlesim_ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`yerlesim_mahalle_id`) REFERENCES `mod_btk_adres_mahalle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`tesis_il_id`) REFERENCES `mod_btk_adres_il`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`tesis_ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`tesis_mahalle_id`) REFERENCES `mod_btk_adres_mahalle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`iss_pop_noktasi_id`) REFERENCES `mod_btk_iss_pop_noktalari`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX `idx_rehber_client_id` (`whmcs_client_id`),
    INDEX `idx_rehber_hat_no` (`hat_no`(15))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mod_btk_abone_hareket_live` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `rehber_kayit_id` BIGINT NOT NULL,
    `musteri_hareket_kodu` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `musteri_hareket_aciklama` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `musteri_hareket_zamani` VARCHAR(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `islem_detayi_json` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `gonderildi_flag` BOOLEAN NOT NULL DEFAULT 0,
    `gonderim_zamani` TIMESTAMP NULL DEFAULT NULL,
    `kayit_zamani` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (`rehber_kayit_id`) REFERENCES `mod_btk_abone_rehber`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_hareket_gonderildi_flag` (`gonderildi_flag`, `kayit_zamani`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mod_btk_abone_hareket_archive` (
    `id` BIGINT NOT NULL,
    `rehber_kayit_id` BIGINT NOT NULL,
    `musteri_hareket_kodu` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `musteri_hareket_aciklama` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `musteri_hareket_zamani` VARCHAR(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `islem_detayi_json` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `gonderildi_flag` BOOLEAN NOT NULL DEFAULT 1,
    `gonderim_zamani` TIMESTAMP NULL DEFAULT NULL,
    `kayit_zamani` TIMESTAMP NULL DEFAULT NULL,
    `arsivlenme_zamani` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`id`),
    INDEX `idx_archive_gonderim_zamani` (`gonderim_zamani`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Log tabloları (Bağımsız)
CREATE TABLE IF NOT EXISTS `mod_btk_ftp_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `dosya_adi` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `rapor_turu` ENUM('REHBER', 'HAREKET', 'PERSONEL') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `yetki_turu_grup` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `ftp_sunucu_tipi` ENUM('ANA', 'YEDEK') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `gonderim_zamani` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `durum` ENUM('Basarili', 'Basarisiz', 'Bekliyor', 'Atlandi') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Bekliyor',
    `hata_mesaji` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `cnt_numarasi` VARCHAR(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    INDEX `idx_ftp_logs_rapor_tur_grup_zaman` (`rapor_turu`, `yetki_turu_grup`, `gonderim_zamani`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mod_btk_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `log_zamani` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `log_seviyesi` ENUM('INFO', 'UYARI', 'HATA', 'DEBUG', 'KRITIK') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INFO',
    `islem` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `mesaj` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `kullanici_id` INT DEFAULT NULL,
    `ip_adresi` VARCHAR(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    INDEX `idx_logs_zaman_seviye` (`log_zamani`, `log_seviyesi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mod_btk_pop_monitoring_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `pop_id` INT NOT NULL,
    `log_zamani` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `durum` ENUM('ONLINE', 'OFFLINE', 'HIGH_LATENCY', 'UNKNOWN') NOT NULL,
    `gecikme_ms` INT DEFAULT NULL,
    `detay` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    FOREIGN KEY (`pop_id`) REFERENCES `mod_btk_iss_pop_noktalari`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_pop_monitoring_logs_pop_id_zaman` (`pop_id`, `log_zamani`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;