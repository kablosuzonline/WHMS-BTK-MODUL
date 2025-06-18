-- install.sql
-- WHMCS BTK Abone Veri Raporlama Modülü
-- Veritabanı Tablo Oluşturma Sorguları (initial_reference_data.sql ile tam uyumlu)

-- Genel Modül Ayarları Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_settings` (
    `setting` VARCHAR(255) NOT NULL,
    `value` TEXT DEFAULT NULL,
    PRIMARY KEY (`setting`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BTK Yetkilendirme Türleri Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_yetki_turleri` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `yetki_kodu_kisa` VARCHAR(20) NOT NULL COMMENT 'Örn: ISS, AIH-B',
    `yetki_adi` VARCHAR(255) NOT NULL COMMENT 'Örn: İnternet Servis Sağlayıcılığı (B)',
    `dosya_tipi_eki` VARCHAR(50) NOT NULL COMMENT 'Dosya adındaki yetki türü kısmı, örn: ISS_ABONE',
    `btk_teknik_dokuman_kodu` VARCHAR(10) NOT NULL COMMENT 'Dosya adındaki operatör kodundan sonra gelen kod, örn: 701',
    `aktif` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Bu yetki türü sistemde aktif mi?',
    PRIMARY KEY (`id`),
    UNIQUE KEY `yetki_kodu_kisa` (`yetki_kodu_kisa`),
    UNIQUE KEY `dosya_tipi_eki` (`dosya_tipi_eki`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- İşletmecinin Sahip Olduğu Yetki Türleri (Config sayfasından seçilenler)
CREATE TABLE IF NOT EXISTS `mod_btk_isletmeci_yetkileri` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `yetki_turu_id` INT(10) UNSIGNED NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `yetki_turu_id_unique` (`yetki_turu_id`),
    CONSTRAINT `fk_isletmeci_yetkileri_yetki_turu_id` FOREIGN KEY (`yetki_turu_id`) REFERENCES `mod_btk_yetki_turleri` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adres İl Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_adres_il` (
    `il_kodu` VARCHAR(2) NOT NULL COMMENT 'TÜİK İl Kodu',
    `il_adi` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`il_kodu`),
    UNIQUE KEY `il_adi_unique` (`il_adi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adres İlçe Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_adres_ilce` (
    `ilce_kodu` VARCHAR(4) NOT NULL COMMENT 'TÜİK İlçe Kodu',
    `il_kodu` VARCHAR(2) NOT NULL COMMENT 'TÜİK İl Kodu',
    `ilce_adi` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`ilce_kodu`),
    INDEX `idx_ilce_il_kodu` (`il_kodu`),
    CONSTRAINT `fk_ilce_il_kodu` FOREIGN KEY (`il_kodu`) REFERENCES `mod_btk_adres_il` (`il_kodu`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adres Mahalle/Köy Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_adres_mahalle` (
    `mahalle_koy_kodu` VARCHAR(10) NOT NULL COMMENT 'TÜİK Mahalle/Köy Kodu',
    `ilce_kodu` VARCHAR(4) NOT NULL COMMENT 'TÜİK İlçe Kodu',
    `mahalle_adi` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`mahalle_koy_kodu`),
    INDEX `idx_mahalle_ilce_kodu` (`ilce_kodu`),
    CONSTRAINT `fk_mahalle_ilce_kodu` FOREIGN KEY (`ilce_kodu`) REFERENCES `mod_btk_adres_ilce` (`ilce_kodu`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- EK-1 Hat Durum Kodları Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_ref_hat_durum_kodlari` (
    `kod` VARCHAR(5) NOT NULL,
    `aciklama` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`kod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- EK-2 Müşteri Tipleri Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_ref_musteri_tipleri` (
    `kod` VARCHAR(20) NOT NULL,
    `aciklama` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`kod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- EK-3 Hizmet Tipleri Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_ref_hizmet_tipleri` (
    `kod` VARCHAR(50) NOT NULL,
    `aciklama` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`kod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- EK-5 Müşteri Hareket Kodları Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_ref_musteri_hareket_kodlari` (
    `kod` VARCHAR(5) NOT NULL,
    `aciklama` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`kod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cinsiyet Referans Tablosu (ABONE_CINSIYET için)
CREATE TABLE IF NOT EXISTS `mod_btk_ref_cinsiyet` (
    `kod` CHAR(1) NOT NULL,
    `aciklama` VARCHAR(20) NOT NULL,
    PRIMARY KEY (`kod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Kimlik Tipleri Referans Tablosu (ABONE_KIMLIK_TIPI için)
CREATE TABLE IF NOT EXISTS `mod_btk_ref_kimlik_tipleri` (
    `kod` VARCHAR(20) NOT NULL,
    `aciklama` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`kod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Kimlik Aidiyetleri Referans Tablosu (ABONE_KIMLIK_AIDIYETI için)
CREATE TABLE IF NOT EXISTS `mod_btk_ref_kimlik_aidiyetleri` (
    `kod` VARCHAR(20) NOT NULL,
    `aciklama` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`kod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ülkeler Referans Tablosu (ABONE_UYRUK için)
CREATE TABLE IF NOT EXISTS `mod_btk_ref_ulkeler` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `ulke_adi_tr` VARCHAR(255) NOT NULL COMMENT 'Personele dropdown da gösterilecek Türkçe tam ülke adı',
    `iso_3166_1_alpha_2` CHAR(2) DEFAULT NULL COMMENT 'ISO 3166-1 Alpha-2 ülke kodu (Referans)',
    `iso_3166_1_alpha_3` CHAR(3) NOT NULL COMMENT 'ISO 3166-1 Alpha-3 ülke kodu (BTK Raporlarında kullanılacak)',
    `icao_9303_uyruk_kodu` CHAR(3) DEFAULT NULL COMMENT 'ICAO 9303 uyruk kodu (Genellikle Alpha-3 ile aynı, referans)',
    PRIMARY KEY (`id`),
    UNIQUE KEY `iso_3166_1_alpha_3_unique` (`iso_3166_1_alpha_3`),
    UNIQUE KEY `ulke_adi_tr_unique` (`ulke_adi_tr`),
    INDEX `idx_ulkeler_iso_alpha_2` (`iso_3166_1_alpha_2`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Meslekler Referans Tablosu (ABONE_MESLEK için)
CREATE TABLE IF NOT EXISTS `mod_btk_ref_meslekler` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `meslek_kodu` VARCHAR(30) NOT NULL COMMENT 'Kısa ve benzersiz bir kod',
    `meslek_adi` VARCHAR(255) NOT NULL COMMENT 'Personele dropdown da gösterilecek meslek adı',
    PRIMARY KEY (`id`),
    UNIQUE KEY `meslek_kodu_unique` (`meslek_kodu`),
    UNIQUE KEY `meslek_adi_unique` (`meslek_adi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Müşteri (Abone) Detayları Tablosu (WHMCS tblclients ile ilişkili)
CREATE TABLE IF NOT EXISTS `mod_btk_musteri_detaylari` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` INT(10) UNSIGNED NOT NULL COMMENT 'WHMCS tblclients.id',
    `musteri_tipi_kodu` VARCHAR(20) DEFAULT NULL COMMENT 'mod_btk_ref_musteri_tipleri.kod',
    `abone_adi` VARCHAR(100) DEFAULT NULL,
    `abone_soyadi` VARCHAR(100) DEFAULT NULL,
    `abone_tc_kimlik_no` VARCHAR(11) DEFAULT NULL,
    `abone_pasaport_no` VARCHAR(50) DEFAULT NULL,
    `abone_unvan` VARCHAR(255) DEFAULT NULL,
    `abone_vergi_numarasi` VARCHAR(20) DEFAULT NULL,
    `abone_mersis_numarasi` VARCHAR(16) DEFAULT NULL,
    `abone_cinsiyet_kodu` CHAR(1) DEFAULT NULL COMMENT 'mod_btk_ref_cinsiyet.kod',
    `abone_uyruk_ref_id` INT(10) UNSIGNED DEFAULT NULL COMMENT 'mod_btk_ref_ulkeler.id',
    `abone_baba_adi` VARCHAR(100) DEFAULT NULL,
    `abone_ana_adi` VARCHAR(100) DEFAULT NULL,
    `abone_anne_kizlik_soyadi` VARCHAR(100) DEFAULT NULL,
    `abone_dogum_yeri` VARCHAR(100) DEFAULT NULL,
    `abone_dogum_tarihi` DATE DEFAULT NULL,
    `abone_meslek_ref_id` INT(10) UNSIGNED DEFAULT NULL COMMENT 'mod_btk_ref_meslekler.id',
    `abone_kimlik_cilt_no` VARCHAR(10) DEFAULT NULL,
    `abone_kimlik_kutuk_no` VARCHAR(10) DEFAULT NULL,
    `abone_kimlik_sayfa_no` VARCHAR(10) DEFAULT NULL,
    `abone_kimlik_il_adi` VARCHAR(50) DEFAULT NULL,
    `abone_kimlik_ilce_adi` VARCHAR(50) DEFAULT NULL,
    `abone_kimlik_mahalle_koy` VARCHAR(100) DEFAULT NULL,
    `abone_kimlik_tipi_kodu` VARCHAR(20) DEFAULT NULL COMMENT 'mod_btk_ref_kimlik_tipleri.kod',
    `abone_kimlik_seri_no` VARCHAR(20) DEFAULT NULL,
    `abone_kimlik_verildigi_yer` VARCHAR(100) DEFAULT NULL,
    `abone_kimlik_verildigi_tarih` DATE DEFAULT NULL,
    `abone_kimlik_aidiyeti_kodu` VARCHAR(20) DEFAULT NULL COMMENT 'mod_btk_ref_kimlik_aidiyetleri.kod',
    `kurum_yetkili_adi` VARCHAR(100) DEFAULT NULL,
    `kurum_yetkili_soyadi` VARCHAR(100) DEFAULT NULL,
    `kurum_yetkili_tckimlik_no` VARCHAR(11) DEFAULT NULL,
    `kurum_yetkili_telefon` VARCHAR(20) DEFAULT NULL,
    `kurum_adres_id` INT(10) UNSIGNED DEFAULT NULL COMMENT 'mod_btk_adresler.id ile ilişkili',
    `tckn_dogrulama_durumu` BOOLEAN DEFAULT FALSE,
    `tckn_dogrulama_zamani` DATETIME DEFAULT NULL,
    `yabanci_kn_dogrulama_durumu` BOOLEAN DEFAULT FALSE,
    `yabanci_kn_dogrulama_zamani` DATETIME DEFAULT NULL,
    `vefat_durumu` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `client_id_unique` (`client_id`),
    INDEX `idx_abone_tc_kimlik_no` (`abone_tc_kimlik_no`),
    INDEX `idx_abone_mersis_numarasi` (`abone_mersis_numarasi`),
    CONSTRAINT `fk_musteri_detaylari_client_id` FOREIGN KEY (`client_id`) REFERENCES `tblclients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_musteri_detaylari_musteri_tipi` FOREIGN KEY (`musteri_tipi_kodu`) REFERENCES `mod_btk_ref_musteri_tipleri` (`kod`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_musteri_detaylari_cinsiyet` FOREIGN KEY (`abone_cinsiyet_kodu`) REFERENCES `mod_btk_ref_cinsiyet` (`kod`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_musteri_detaylari_uyruk` FOREIGN KEY (`abone_uyruk_ref_id`) REFERENCES `mod_btk_ref_ulkeler` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_musteri_detaylari_meslek` FOREIGN KEY (`abone_meslek_ref_id`) REFERENCES `mod_btk_ref_meslekler` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_musteri_detaylari_kimlik_tipi` FOREIGN KEY (`abone_kimlik_tipi_kodu`) REFERENCES `mod_btk_ref_kimlik_tipleri` (`kod`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_musteri_detaylari_kimlik_aidiyeti` FOREIGN KEY (`abone_kimlik_aidiyeti_kodu`) REFERENCES `mod_btk_ref_kimlik_aidiyetleri` (`kod`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adres Bilgileri Tablosu (Yerleşim, Tesis, Kurum Yetkilisi Adresleri için)
CREATE TABLE IF NOT EXISTS `mod_btk_adresler` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `adres_tipi` VARCHAR(20) NOT NULL COMMENT 'YERLESIM, TESIS, KURUM_YETKILI, PERSONEL_EV, BAYI',
    `client_id` INT(10) UNSIGNED DEFAULT NULL COMMENT 'Eğer yerleşim veya kurum yetkili adresi ise tblclients.id',
    `service_id` INT(10) UNSIGNED DEFAULT NULL COMMENT 'Eğer tesis adresi ise tblhosting.id',
    `personel_id` INT(10) UNSIGNED DEFAULT NULL COMMENT 'Eğer personel ev adresi ise mod_btk_personel.id',
    `adres_il_ref_kodu` VARCHAR(2) DEFAULT NULL COMMENT 'mod_btk_adres_il.il_kodu',
    `adres_ilce_ref_kodu` VARCHAR(4) DEFAULT NULL COMMENT 'mod_btk_adres_ilce.ilce_kodu',
    `adres_mahalle_ref_kodu` VARCHAR(10) DEFAULT NULL COMMENT 'mod_btk_adres_mahalle.mahalle_koy_kodu',
    `adres_il_adi_manual` VARCHAR(50) DEFAULT NULL COMMENT 'Referans tabloda yoksa manuel girilen il adı',
    `adres_ilce_adi_manual` VARCHAR(50) DEFAULT NULL COMMENT 'Referans tabloda yoksa manuel girilen ilçe adı',
    `adres_mahalle_adi_manual` VARCHAR(100) DEFAULT NULL COMMENT 'Referans tabloda yoksa manuel girilen mahalle adı',
    `adres_cadde_sokak_bulvar` VARCHAR(255) DEFAULT NULL,
    `adres_bina_adi_no` VARCHAR(100) DEFAULT NULL,
    `adres_dis_kapi_no` VARCHAR(10) DEFAULT NULL,
    `adres_ic_kapi_no` VARCHAR(10) DEFAULT NULL,
    `adres_posta_kodu` VARCHAR(5) DEFAULT NULL,
    `adres_uavt_kodu` VARCHAR(20) DEFAULT NULL COMMENT 'Ulusal Adres Veri Tabanı Kodu (Adres Kodu)',
    `adres_acik_full` TEXT DEFAULT NULL COMMENT 'Tam açık adres metni',
    `google_maps_link` VARCHAR(512) DEFAULT NULL,
    `is_default` BOOLEAN DEFAULT FALSE COMMENT 'Müşterinin/Personelin varsayılan adresi mi?',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_adres_client_id` (`client_id`),
    INDEX `idx_adres_service_id` (`service_id`),
    INDEX `idx_adres_personel_id` (`personel_id`),
    CONSTRAINT `fk_adresler_client_id` FOREIGN KEY (`client_id`) REFERENCES `tblclients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_adresler_service_id` FOREIGN KEY (`service_id`) REFERENCES `tblhosting` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    -- personel_id için FOREIGN KEY mod_btk_personel oluşturulduktan sonra eklenecek
    CONSTRAINT `fk_adresler_il_kodu` FOREIGN KEY (`adres_il_ref_kodu`) REFERENCES `mod_btk_adres_il` (`il_kodu`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_adresler_ilce_kodu` FOREIGN KEY (`adres_ilce_ref_kodu`) REFERENCES `mod_btk_adres_ilce` (`ilce_kodu`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_adresler_mahalle_kodu` FOREIGN KEY (`adres_mahalle_ref_kodu`) REFERENCES `mod_btk_adres_mahalle` (`mahalle_koy_kodu`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Müşteri Detayları tablosuna Kurum Adresi için Foreign Key eklemesi (mod_btk_adresler sonrası)
ALTER TABLE `mod_btk_musteri_detaylari` ADD CONSTRAINT `fk_musteri_detaylari_kurum_adres_id` FOREIGN KEY (`kurum_adres_id`) REFERENCES `mod_btk_adresler` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Hizmet (Ürün) Detayları Tablosu (WHMCS tblhosting ile ilişkili)
CREATE TABLE IF NOT EXISTS `mod_btk_hizmet_detaylari` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `service_id` INT(10) UNSIGNED NOT NULL COMMENT 'WHMCS tblhosting.id (HAT_NO olarak kullanılacak)',
    `client_id` INT(10) UNSIGNED NOT NULL COMMENT 'WHMCS tblclients.id (MUSTERI_ID olarak kullanılacak)',
    `yetki_turu_id` INT(10) UNSIGNED NOT NULL COMMENT 'mod_btk_yetki_turleri.id (Bu hizmet hangi yetki türüne ait)',
    `hat_durum` CHAR(1) DEFAULT NULL COMMENT 'A, I, D, K (BTK Teknik Dokümanına göre)',
    `hat_durum_kodu_ref` VARCHAR(5) DEFAULT NULL COMMENT 'mod_btk_ref_hat_durum_kodlari.kod',
    -- hat_durum_aciklama artık ref tablodan gelecek, burada tutmaya gerek yok.
    `hizmet_tipi_kodu` VARCHAR(50) DEFAULT NULL COMMENT 'mod_btk_ref_hizmet_tipleri.kod',
    `abone_baslangic_tarihi` DATETIME DEFAULT NULL,
    `abone_bitis_tarihi` DATETIME DEFAULT NULL,
    `tarife_bilgisi` VARCHAR(100) DEFAULT NULL COMMENT 'Abone tarife adı/kodu',
    `statik_ip_blogu` TEXT DEFAULT NULL COMMENT 'Virgülle ayrılmış statik IPler veya blok',
    `iss_hiz_profili` VARCHAR(100) DEFAULT NULL COMMENT 'Download/Upload hızı, örn: 100/20 Mbps',
    `iss_kullanici_adi` VARCHAR(100) DEFAULT NULL COMMENT 'xDSL kullanıcı adı vb.',
    `iss_pop_bilgisi_ref_id` INT(10) UNSIGNED DEFAULT NULL COMMENT 'mod_btk_iss_pop_noktalari.id',
    `iss_pop_bilgisi_manual` VARCHAR(255) DEFAULT NULL COMMENT 'Sunucu.SSID veya sadece Sunucu (Eğer POP ref tablosunda yoksa)',
    `aktivasyon_bayi_adi` VARCHAR(255) DEFAULT NULL,
    `aktivasyon_bayi_adresi_id` INT(10) UNSIGNED DEFAULT NULL COMMENT 'mod_btk_adresler.id ile ilişkili',
    `aktivasyon_kullanici` VARCHAR(100) DEFAULT NULL COMMENT 'WHMCS admin username veya sistem',
    `guncelleyen_bayi_adi` VARCHAR(255) DEFAULT NULL,
    `guncelleyen_bayi_adresi_id` INT(10) UNSIGNED DEFAULT NULL COMMENT 'mod_btk_adresler.id ile ilişkili',
    `guncelleyen_kullanici` VARCHAR(100) DEFAULT NULL COMMENT 'WHMCS admin username veya sistem',
    `tesis_adres_id` INT(10) UNSIGNED DEFAULT NULL COMMENT 'mod_btk_adresler.id (Bu hizmetin verildiği adres)',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `service_id_unique` (`service_id`),
    INDEX `idx_hizmet_client_id` (`client_id`),
    CONSTRAINT `fk_hizmet_detaylari_service_id` FOREIGN KEY (`service_id`) REFERENCES `tblhosting` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_hizmet_detaylari_client_id` FOREIGN KEY (`client_id`) REFERENCES `tblclients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_hizmet_detaylari_yetki_turu_id` FOREIGN KEY (`yetki_turu_id`) REFERENCES `mod_btk_yetki_turleri` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_hizmet_detaylari_hat_durum_kodu` FOREIGN KEY (`hat_durum_kodu_ref`) REFERENCES `mod_btk_ref_hat_durum_kodlari` (`kod`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_hizmet_detaylari_hizmet_tipi` FOREIGN KEY (`hizmet_tipi_kodu`) REFERENCES `mod_btk_ref_hizmet_tipleri` (`kod`) ON DELETE SET NULL ON UPDATE CASCADE,
    -- iss_pop_bilgisi_ref_id için FOREIGN KEY mod_btk_iss_pop_noktalari oluşturulduktan sonra eklenecek
    CONSTRAINT `fk_hizmet_detaylari_tesis_adres_id` FOREIGN KEY (`tesis_adres_id`) REFERENCES `mod_btk_adresler` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_hizmet_detaylari_aktivasyon_adres_id` FOREIGN KEY (`aktivasyon_bayi_adresi_id`) REFERENCES `mod_btk_adresler` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_hizmet_detaylari_guncelleyen_adres_id` FOREIGN KEY (`guncelleyen_bayi_adresi_id`) REFERENCES `mod_btk_adresler` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- WHMCS Ürünleri ile BTK Yetki Türleri Eşleştirme Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_urun_yetki_eslestirme` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `product_id` INT(10) UNSIGNED NOT NULL COMMENT 'WHMCS tblproducts.id',
    `yetki_turu_id` INT(10) UNSIGNED NOT NULL COMMENT 'mod_btk_yetki_turleri.id',
    PRIMARY KEY (`id`),
    UNIQUE KEY `product_yetki_unique` (`product_id`, `yetki_turu_id`),
    CONSTRAINT `fk_urun_eslestirme_product_id` FOREIGN KEY (`product_id`) REFERENCES `tblproducts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_urun_eslestirme_yetki_turu_id` FOREIGN KEY (`yetki_turu_id`) REFERENCES `mod_btk_yetki_turleri` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Personel Bilgileri Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_personel` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `admin_id` INT(10) UNSIGNED DEFAULT NULL COMMENT 'WHMCS tbladmins.id (Eğer WHMCS admini ise)',
    `firma_unvani` VARCHAR(255) NOT NULL COMMENT 'Operatörün resmi unvanı (Configden gelecek)',
    `adi` VARCHAR(100) NOT NULL,
    `soyadi` VARCHAR(100) NOT NULL,
    `tc_kimlik_no` VARCHAR(11) DEFAULT NULL,
    `unvan_gorev` VARCHAR(100) DEFAULT NULL COMMENT 'Personelin şirketteki unvanı/görevi',
    `calistigi_birim` VARCHAR(100) DEFAULT NULL COMMENT 'Personelin çalıştığı departman/birim',
    `mobil_telefonu` VARCHAR(20) DEFAULT NULL,
    `sabit_telefonu` VARCHAR(20) DEFAULT NULL,
    `eposta_adresi` VARCHAR(255) DEFAULT NULL,
    `uyruk_ref_id` INT(10) UNSIGNED DEFAULT NULL COMMENT 'mod_btk_ref_ulkeler.id',
    `ev_adresi_id` INT(10) UNSIGNED DEFAULT NULL COMMENT 'mod_btk_adresler.id (İK için)',
    `acil_durum_kontak_adi` VARCHAR(100) DEFAULT NULL COMMENT 'İK için',
    `acil_durum_kontak_telefonu` VARCHAR(20) DEFAULT NULL COMMENT 'İK için',
    `ise_baslama_tarihi` DATE DEFAULT NULL COMMENT 'İK için',
    `isten_ayrilma_tarihi` DATE DEFAULT NULL,
    `is_birakma_nedeni` TEXT DEFAULT NULL COMMENT 'İK için',
    `btk_listesine_eklensin` BOOLEAN NOT NULL DEFAULT TRUE,
    `tckn_dogrulama_durumu` BOOLEAN DEFAULT FALSE,
    `tckn_dogrulama_zamani` DATETIME DEFAULT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Personel aktif mi? (İşten ayrılınca false olur)',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `admin_id_unique` (`admin_id`),
    CONSTRAINT `fk_personel_admin_id` FOREIGN KEY (`admin_id`) REFERENCES `tbladmins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_personel_uyruk_id` FOREIGN KEY (`uyruk_ref_id`) REFERENCES `mod_btk_ref_ulkeler` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_personel_ev_adresi_id` FOREIGN KEY (`ev_adresi_id`) REFERENCES `mod_btk_adresler` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- mod_btk_adresler tablosuna personel_id için FOREIGN KEY eklemesi (mod_btk_personel sonrası)
ALTER TABLE `mod_btk_adresler` ADD CONSTRAINT `fk_adresler_personel_id` FOREIGN KEY (`personel_id`) REFERENCES `mod_btk_personel` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- ISS POP Noktası Bilgileri Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_iss_pop_noktalari` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `pop_adi` VARCHAR(255) NOT NULL COMMENT 'POP Noktası Adı / Santral Adı',
    `adres_il_ref_kodu` VARCHAR(2) DEFAULT NULL COMMENT 'mod_btk_adres_il.il_kodu',
    `adres_ilce_ref_kodu` VARCHAR(4) DEFAULT NULL COMMENT 'mod_btk_adres_ilce.ilce_kodu',
    `adres_mahalle_ref_kodu` VARCHAR(10) DEFAULT NULL COMMENT 'mod_btk_adres_mahalle.mahalle_koy_kodu',
    `adres_acik` TEXT DEFAULT NULL COMMENT 'POP Noktasının Açık Adresi',
    `yayin_yapilan_ssid` VARCHAR(100) DEFAULT NULL COMMENT 'Örn: Baz İstasyonu SSID',
    `koordinatlar` VARCHAR(50) DEFAULT NULL COMMENT 'Enlem,Boylam',
    `aktif` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `pop_adi_ssid_unique` (`pop_adi`, `yayin_yapilan_ssid`),
    CONSTRAINT `fk_pop_il_kodu` FOREIGN KEY (`adres_il_ref_kodu`) REFERENCES `mod_btk_adres_il` (`il_kodu`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_pop_ilce_kodu` FOREIGN KEY (`adres_ilce_ref_kodu`) REFERENCES `mod_btk_adres_ilce` (`ilce_kodu`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_pop_mahalle_kodu` FOREIGN KEY (`adres_mahalle_ref_kodu`) REFERENCES `mod_btk_adres_mahalle` (`mahalle_koy_kodu`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Hizmet Detayları tablosuna iss_pop_bilgisi_ref_id için FOREIGN KEY eklemesi (mod_btk_iss_pop_noktalari sonrası)
ALTER TABLE `mod_btk_hizmet_detaylari` ADD CONSTRAINT `fk_hizmet_detaylari_pop_id` FOREIGN KEY (`iss_pop_bilgisi_ref_id`) REFERENCES `mod_btk_iss_pop_noktalari` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Abone Rehber Arşiv Tablosu (Gönderilen her REHBER satırı buraya eklenecek, silinmeyecek)
CREATE TABLE IF NOT EXISTS `mod_btk_abone_rehber_arsivi` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `gonderilen_dosya_id` INT(10) UNSIGNED NOT NULL COMMENT 'mod_btk_gonderilen_dosyalar.id',
    `service_id` INT(10) UNSIGNED NOT NULL COMMENT 'tblhosting.id (HAT_NO)',
    `client_id` INT(10) UNSIGNED NOT NULL COMMENT 'tblclients.id (MUSTERI_ID)',
    `operator_kod` VARCHAR(10) NOT NULL,
    `hat_no_orj` VARCHAR(50) NOT NULL COMMENT 'tblhosting.id veya özel hat no',
    `hat_durum` CHAR(1) NOT NULL,
    `hat_durum_kodu` VARCHAR(5) NOT NULL,
    `hat_aciklama` VARCHAR(255) NOT NULL,
    `musteri_hareket_kodu` VARCHAR(5) DEFAULT NULL, -- Rehberde de olabilir, genellikle ilk kayıtta
    `musteri_hareket_aciklama` VARCHAR(255) DEFAULT NULL,
    `musteri_hareket_zamani` VARCHAR(14) DEFAULT NULL, -- YYYYAAGGSSDDSS
    `hizmet_tipi` VARCHAR(50) DEFAULT NULL,
    `musteri_tipi` VARCHAR(20) DEFAULT NULL,
    `abone_baslangic` VARCHAR(14) DEFAULT NULL, -- YYYYAAGGSSDDSS
    `abone_bitis` VARCHAR(14) DEFAULT NULL, -- YYYYAAGGSSDDSS
    `abone_adi` VARCHAR(100) DEFAULT NULL,
    `abone_soyadi` VARCHAR(100) DEFAULT NULL,
    `abone_tc_kimlik_no` VARCHAR(11) DEFAULT NULL,
    `abone_pasaport_no` VARCHAR(50) DEFAULT NULL,
    `abone_unvan` VARCHAR(255) DEFAULT NULL,
    `abone_vergi_numarasi` VARCHAR(20) DEFAULT NULL,
    `abone_mersis_numarasi` VARCHAR(16) DEFAULT NULL,
    `abone_cinsiyet` CHAR(1) DEFAULT NULL,
    `abone_uyruk` CHAR(3) DEFAULT NULL, -- ISO 3166-1 Alpha-3
    `abone_baba_adi` VARCHAR(100) DEFAULT NULL,
    `abone_ana_adi` VARCHAR(100) DEFAULT NULL,
    `abone_anne_kizlik_soyadi` VARCHAR(100) DEFAULT NULL,
    `abone_dogum_yeri` VARCHAR(100) DEFAULT NULL,
    `abone_dogum_tarihi` VARCHAR(10) DEFAULT NULL, -- YYYY-AA-GG veya YYYYAAGG
    `abone_meslek` VARCHAR(255) DEFAULT NULL, -- Ref tablodan veya manuel
    `abone_tarife` VARCHAR(100) DEFAULT NULL,
    `abone_kimlik_cilt_no` VARCHAR(10) DEFAULT NULL,
    `abone_kimlik_kutuk_no` VARCHAR(10) DEFAULT NULL,
    `abone_kimlik_sayfa_no` VARCHAR(10) DEFAULT NULL,
    `abone_kimlik_il` VARCHAR(50) DEFAULT NULL,
    `abone_kimlik_ilce` VARCHAR(50) DEFAULT NULL,
    `abone_kimlik_mahalle_koy` VARCHAR(100) DEFAULT NULL,
    `abone_kimlik_tipi` VARCHAR(100) DEFAULT NULL, -- Ref tablodan
    `abone_kimlik_seri_no` VARCHAR(20) DEFAULT NULL,
    `abone_kimlik_verildigi_yer` VARCHAR(100) DEFAULT NULL,
    `abone_kimlik_verildigi_tarih` VARCHAR(10) DEFAULT NULL, -- YYYY-AA-GG veya YYYYAAGG
    `abone_kimlik_aidiyeti` VARCHAR(50) DEFAULT NULL, -- Ref tablodan
    `abone_adres_tesis_il` VARCHAR(50) DEFAULT NULL,
    `abone_adres_tesis_ilce` VARCHAR(50) DEFAULT NULL,
    `abone_adres_tesis_mahalle` VARCHAR(100) DEFAULT NULL,
    `abone_adres_tesis_cadde` VARCHAR(255) DEFAULT NULL,
    `abone_adres_tesis_dis_kapi_no` VARCHAR(10) DEFAULT NULL,
    `abone_adres_tesis_ic_kapi_no` VARCHAR(10) DEFAULT NULL,
    `abone_adres_tesis_posta_kodu` VARCHAR(5) DEFAULT NULL,
    `abone_adres_tesis_adres_kodu` VARCHAR(20) DEFAULT NULL, -- UAVT
    `abone_adres_irtibat_tel_no_1` VARCHAR(20) DEFAULT NULL,
    `abone_adres_irtibat_tel_no_2` VARCHAR(20) DEFAULT NULL,
    `abone_adres_e_mail` VARCHAR(255) DEFAULT NULL,
    `abone_adres_yerlesim_il` VARCHAR(50) DEFAULT NULL,
    `abone_adres_yerlesim_ilce` VARCHAR(50) DEFAULT NULL,
    `abone_adres_yerlesim_mahalle` VARCHAR(100) DEFAULT NULL,
    `abone_adres_yerlesim_cadde` VARCHAR(255) DEFAULT NULL,
    `abone_adres_yerlesim_dis_kapi_no` VARCHAR(10) DEFAULT NULL,
    `abone_adres_yerlesim_ic_kapi_no` VARCHAR(10) DEFAULT NULL,
    `abone_adres_yerlesim_no` VARCHAR(20) DEFAULT NULL, -- UAVT (Yerleşim)
    `kurum_yetkili_adi` VARCHAR(100) DEFAULT NULL,
    `kurum_yetkili_soyadi` VARCHAR(100) DEFAULT NULL,
    `kurum_yetkili_tckimlik_no` VARCHAR(11) DEFAULT NULL,
    `kurum_yetkili_telefon` VARCHAR(20) DEFAULT NULL,
    `kurum_adres` TEXT DEFAULT NULL,
    `aktivasyon_bayi_adi` VARCHAR(255) DEFAULT NULL,
    `aktivasyon_bayi_adresi` TEXT DEFAULT NULL,
    `aktivasyon_kullanici` VARCHAR(100) DEFAULT NULL,
    `guncelleyen_bayi_adi` VARCHAR(255) DEFAULT NULL,
    `guncelleyen_bayi_adresi` TEXT DEFAULT NULL,
    `guncelleyen_kullanici` VARCHAR(100) DEFAULT NULL,
    `statik_ip` TEXT DEFAULT NULL,
    `iss_hiz_profili` VARCHAR(100) DEFAULT NULL,
    `iss_kullanici_adi` VARCHAR(100) DEFAULT NULL,
    `iss_pop_bilgisi` VARCHAR(255) DEFAULT NULL,
    `raw_data_line` TEXT NOT NULL COMMENT 'Oluşturulan ve gönderilen tam satır verisi',
    `kayit_zamani` DATETIME NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_rehber_arsiv_service_id` (`service_id`),
    INDEX `idx_rehber_arsiv_gonderilen_dosya_id` (`gonderilen_dosya_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Abone Hareket Canlı Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_abone_hareket_canli` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `service_id` INT(10) UNSIGNED NOT NULL,
    `client_id` INT(10) UNSIGNED NOT NULL,
    `operator_kod` VARCHAR(10) NOT NULL,
    `hat_no_orj` VARCHAR(50) NOT NULL,
    `musteri_hareket_kodu_ref` VARCHAR(5) NOT NULL COMMENT 'mod_btk_ref_musteri_hareket_kodlari.kod',
    -- musteri_hareket_aciklama ref tablodan gelecek
    `musteri_hareket_zamani` VARCHAR(14) NOT NULL COMMENT 'YYYYAAGGSSDDSS',
    -- Diğer tüm EK-4 HAREKET alanları buraya eklenecek (Rehberdekine benzer şekilde)
    `hat_durum` CHAR(1) DEFAULT NULL,
    `hat_durum_kodu` VARCHAR(5) DEFAULT NULL,
    `hat_aciklama` VARCHAR(255) DEFAULT NULL,
    `hizmet_tipi` VARCHAR(50) DEFAULT NULL,
    `musteri_tipi` VARCHAR(20) DEFAULT NULL,
    `abone_baslangic` VARCHAR(14) DEFAULT NULL,
    `abone_bitis` VARCHAR(14) DEFAULT NULL,
    `abone_adi` VARCHAR(100) DEFAULT NULL,
    `abone_soyadi` VARCHAR(100) DEFAULT NULL,
    `abone_tc_kimlik_no` VARCHAR(11) DEFAULT NULL,
    `abone_pasaport_no` VARCHAR(50) DEFAULT NULL,
    `abone_unvan` VARCHAR(255) DEFAULT NULL,
    `abone_vergi_numarasi` VARCHAR(20) DEFAULT NULL,
    `abone_mersis_numarasi` VARCHAR(16) DEFAULT NULL,
    `abone_cinsiyet` CHAR(1) DEFAULT NULL,
    `abone_uyruk` CHAR(3) DEFAULT NULL, -- ISO 3166-1 Alpha-3
    `abone_baba_adi` VARCHAR(100) DEFAULT NULL,
    `abone_ana_adi` VARCHAR(100) DEFAULT NULL,
    `abone_anne_kizlik_soyadi` VARCHAR(100) DEFAULT NULL,
    `abone_dogum_yeri` VARCHAR(100) DEFAULT NULL,
    `abone_dogum_tarihi` VARCHAR(10) DEFAULT NULL,
    `abone_meslek` VARCHAR(255) DEFAULT NULL,
    `abone_tarife` VARCHAR(100) DEFAULT NULL,
    `abone_kimlik_cilt_no` VARCHAR(10) DEFAULT NULL,
    `abone_kimlik_kutuk_no` VARCHAR(10) DEFAULT NULL,
    `abone_kimlik_sayfa_no` VARCHAR(10) DEFAULT NULL,
    `abone_kimlik_il` VARCHAR(50) DEFAULT NULL,
    `abone_kimlik_ilce` VARCHAR(50) DEFAULT NULL,
    `abone_kimlik_mahalle_koy` VARCHAR(100) DEFAULT NULL,
    `abone_kimlik_tipi` VARCHAR(100) DEFAULT NULL,
    `abone_kimlik_seri_no` VARCHAR(20) DEFAULT NULL,
    `abone_kimlik_verildigi_yer` VARCHAR(100) DEFAULT NULL,
    `abone_kimlik_verildigi_tarih` VARCHAR(10) DEFAULT NULL,
    `abone_kimlik_aidiyeti` VARCHAR(50) DEFAULT NULL,
    `abone_adres_tesis_il` VARCHAR(50) DEFAULT NULL,
    `abone_adres_tesis_ilce` VARCHAR(50) DEFAULT NULL,
    `abone_adres_tesis_mahalle` VARCHAR(100) DEFAULT NULL,
    `abone_adres_tesis_cadde` VARCHAR(255) DEFAULT NULL,
    `abone_adres_tesis_dis_kapi_no` VARCHAR(10) DEFAULT NULL,
    `abone_adres_tesis_ic_kapi_no` VARCHAR(10) DEFAULT NULL,
    `abone_adres_tesis_posta_kodu` VARCHAR(5) DEFAULT NULL,
    `abone_adres_tesis_adres_kodu` VARCHAR(20) DEFAULT NULL,
    `abone_adres_irtibat_tel_no_1` VARCHAR(20) DEFAULT NULL,
    `abone_adres_irtibat_tel_no_2` VARCHAR(20) DEFAULT NULL,
    `abone_adres_e_mail` VARCHAR(255) DEFAULT NULL,
    `abone_adres_yerlesim_il` VARCHAR(50) DEFAULT NULL,
    `abone_adres_yerlesim_ilce` VARCHAR(50) DEFAULT NULL,
    `abone_adres_yerlesim_mahalle` VARCHAR(100) DEFAULT NULL,
    `abone_adres_yerlesim_cadde` VARCHAR(255) DEFAULT NULL,
    `abone_adres_yerlesim_dis_kapi_no` VARCHAR(10) DEFAULT NULL,
    `abone_adres_yerlesim_ic_kapi_no` VARCHAR(10) DEFAULT NULL,
    `abone_adres_yerlesim_no` VARCHAR(20) DEFAULT NULL,
    `kurum_yetkili_adi` VARCHAR(100) DEFAULT NULL,
    `kurum_yetkili_soyadi` VARCHAR(100) DEFAULT NULL,
    `kurum_yetkili_tckimlik_no` VARCHAR(11) DEFAULT NULL,
    `kurum_yetkili_telefon` VARCHAR(20) DEFAULT NULL,
    `kurum_adres` TEXT DEFAULT NULL,
    `aktivasyon_bayi_adi` VARCHAR(255) DEFAULT NULL,
    `aktivasyon_bayi_adresi` TEXT DEFAULT NULL,
    `aktivasyon_kullanici` VARCHAR(100) DEFAULT NULL,
    `guncelleyen_bayi_adi` VARCHAR(255) DEFAULT NULL,
    `guncelleyen_bayi_adresi` TEXT DEFAULT NULL,
    `guncelleyen_kullanici` VARCHAR(100) DEFAULT NULL,
    `statik_ip` TEXT DEFAULT NULL,
    `iss_hiz_profili` VARCHAR(100) DEFAULT NULL,
    `iss_kullanici_adi` VARCHAR(100) DEFAULT NULL,
    `iss_pop_bilgisi` VARCHAR(255) DEFAULT NULL,
    `raw_data_line` TEXT NOT NULL COMMENT 'Oluşturulan tam satır verisi',
    `gonderildi_mi` BOOLEAN NOT NULL DEFAULT FALSE,
    `gonderilen_dosya_id` INT(10) UNSIGNED DEFAULT NULL COMMENT 'mod_btk_gonderilen_dosyalar.id',
    `gonderim_zamani` DATETIME DEFAULT NULL,
    `olusturulma_zamani` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_hareket_canli_service_id` (`service_id`),
    INDEX `idx_hareket_canli_gonderildi_mi` (`gonderildi_mi`),
    CONSTRAINT `fk_hareket_canli_musteri_hareket_kodu` FOREIGN KEY (`musteri_hareket_kodu_ref`) REFERENCES `mod_btk_ref_musteri_hareket_kodlari` (`kod`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Abone Hareket Arşiv Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_abone_hareket_arsivi` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `original_canli_id` BIGINT UNSIGNED DEFAULT NULL,
    `gonderilen_dosya_id` INT(10) UNSIGNED NOT NULL,
    `service_id` INT(10) UNSIGNED NOT NULL,
    `client_id` INT(10) UNSIGNED NOT NULL,
    `operator_kod` VARCHAR(10) NOT NULL,
    `hat_no_orj` VARCHAR(50) NOT NULL,
    `musteri_hareket_kodu_ref` VARCHAR(5) NOT NULL,
    `musteri_hareket_zamani` VARCHAR(14) NOT NULL,
    -- Diğer tüm EK-4 HAREKET alanları (canlı tablodaki gibi)
    `raw_data_line` TEXT NOT NULL,
    `gonderim_zamani` DATETIME NOT NULL,
    `arsivlenme_zamani` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_hareket_arsiv_service_id` (`service_id`),
    INDEX `idx_hareket_arsiv_gonderilen_dosya_id` (`gonderilen_dosya_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Gönderilen Dosyalar Log Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_gonderilen_dosyalar` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `dosya_adi` VARCHAR(255) NOT NULL,
    `dosya_tipi` VARCHAR(20) NOT NULL COMMENT 'REHBER, HAREKET, PERSONEL',
    `yetki_turu_id` INT(10) UNSIGNED DEFAULT NULL,
    `ftp_sunucu_tipi` VARCHAR(10) NOT NULL DEFAULT 'ANA' COMMENT 'ANA, YEDEK',
    `ftp_hedef_yol` VARCHAR(255) DEFAULT NULL,
    `olusturulma_zamani_param` VARCHAR(14) NOT NULL,
    `cnt_degeri` VARCHAR(2) NOT NULL,
    `gonderim_baslangic_zamani` DATETIME NOT NULL,
    `gonderim_bitis_zamani` DATETIME DEFAULT NULL,
    `gonderim_durumu` VARCHAR(20) NOT NULL DEFAULT 'BEKLIYOR' COMMENT 'BEKLIYOR, GONDERILIYOR, BASARILI, HATALI',
    `hata_mesaji` TEXT DEFAULT NULL,
    `dosya_boyutu_byte` BIGINT UNSIGNED DEFAULT NULL,
    `icerik_hash` VARCHAR(64) DEFAULT NULL,
    `manuel_gonderim` BOOLEAN NOT NULL DEFAULT FALSE,
    `gonderen_admin_id` INT(10) UNSIGNED DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `dosya_adi_ftp_sunucu_unique` (`dosya_adi`, `ftp_sunucu_tipi`),
    INDEX `idx_gonderilen_dosya_tipi` (`dosya_tipi`),
    INDEX `idx_gonderilen_dosya_durumu` (`gonderim_durumu`),
    CONSTRAINT `fk_gonderilen_dosyalar_yetki_turu_id` FOREIGN KEY (`yetki_turu_id`) REFERENCES `mod_btk_yetki_turleri` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_gonderilen_dosyalar_admin_id` FOREIGN KEY (`gonderen_admin_id`) REFERENCES `tbladmins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Foreign Key kısıtlamalarının eklenmesi (Tüm tablolar oluşturulduktan sonra _activate içinde çalıştırılması daha güvenlidir)
ALTER TABLE `mod_btk_abone_rehber_arsivi` ADD CONSTRAINT `fk_rehber_arsivi_gonderilen_dosya_id` FOREIGN KEY (`gonderilen_dosya_id`) REFERENCES `mod_btk_gonderilen_dosyalar` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `mod_btk_abone_hareket_canli` ADD CONSTRAINT `fk_hareket_canli_gonderilen_dosya_id` FOREIGN KEY (`gonderilen_dosya_id`) REFERENCES `mod_btk_gonderilen_dosyalar` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `mod_btk_abone_hareket_arsivi` ADD CONSTRAINT `fk_hareket_arsivi_gonderilen_dosya_id` FOREIGN KEY (`gonderilen_dosya_id`) REFERENCES `mod_btk_gonderilen_dosyalar` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;