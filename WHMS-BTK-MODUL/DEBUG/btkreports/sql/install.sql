-- WHMCS BTK Raporlama Modülü - Kurulum SQL Dosyası
-- Version: 6.0.0
-- Bu script, modül aktive edildiğinde çalıştırılır.
-- Tüm tablolar 'mod_btk_' prefix'i ile başlar.

-- Modül Ayarları Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_settings` (
    `setting` VARCHAR(255) NOT NULL PRIMARY KEY,
    `value` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BTK Ana Yetki Türleri Referans Tablosu (Adminin config'de seçeceği genel yetkiler)
CREATE TABLE IF NOT EXISTS `mod_btk_yetki_turleri_referans` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `yetki_kodu` VARCHAR(50) NOT NULL UNIQUE,
    `yetki_adi` VARCHAR(255) NOT NULL,
    `grup` VARCHAR(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin Tarafından Seçilen Aktif Ana BTK Yetki Türleri
CREATE TABLE IF NOT EXISTS `mod_btk_secili_yetki_turleri` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `yetki_kodu` VARCHAR(50) NOT NULL UNIQUE,
    `aktif` BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (`yetki_kodu`) REFERENCES `mod_btk_yetki_turleri_referans`(`yetki_kodu`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BTK EK-1 Hat Durum Kodları Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_ek1_hat_durum_kodlari` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kod` VARCHAR(10) NOT NULL UNIQUE,
    `aciklama` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BTK EK-2 Müşteri Hareket Kodları Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_ek2_musteri_hareket_kodlari` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kod` VARCHAR(10) NOT NULL UNIQUE,
    `aciklama` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BTK EK-3 Hizmet Tipleri Referans Tablosu (Rapor içindeki HIZMET_TIPI alanı için)
CREATE TABLE IF NOT EXISTS `mod_btk_ek3_hizmet_tipleri` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `hizmet_tipi_kodu` VARCHAR(50) NOT NULL UNIQUE,
    `hizmet_tipi_aciklamasi` VARCHAR(255) NOT NULL,
    `ana_yetki_grup` VARCHAR(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_ek3_ana_yetki_grup ON mod_btk_ek3_hizmet_tipleri(ana_yetki_grup);

-- BTK EK-4 Kimlik Tipleri Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_ek4_kimlik_tipleri` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kod` VARCHAR(10) NOT NULL UNIQUE,
    `aciklama` VARCHAR(255) NOT NULL,
    `ulke_kodu_gerekli` BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BTK EK-5 Meslek Kodları Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_ek5_meslek_kodlari` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kod` VARCHAR(10) NOT NULL UNIQUE,
    `aciklama` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ürün Grubu - Ana BTK Yetki Türü ve EK-3 Hizmet Tipi Eşleştirme Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_product_group_mappings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `gid` INT NOT NULL UNIQUE,
    `ana_btk_yetki_kodu` VARCHAR(50) NOT NULL,
    `ek3_hizmet_tipi_kodu` VARCHAR(50) NOT NULL,
    FOREIGN KEY (`ana_btk_yetki_kodu`) REFERENCES `mod_btk_yetki_turleri_referans`(`yetki_kodu`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`ek3_hizmet_tipi_kodu`) REFERENCES `mod_btk_ek3_hizmet_tipleri`(`hizmet_tipi_kodu`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adres Referans Tabloları
CREATE TABLE IF NOT EXISTS `mod_btk_adres_il` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `il_adi` VARCHAR(255) NOT NULL UNIQUE,
    `plaka_kodu` VARCHAR(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mod_btk_adres_ilce` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `il_id` INT NOT NULL,
    `ilce_adi` VARCHAR(255) NOT NULL,
    FOREIGN KEY (`il_id`) REFERENCES `mod_btk_adres_il`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY `il_ilce_unique` (`il_id`, `ilce_adi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mod_btk_adres_mahalle` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ilce_id` INT NOT NULL,
    `mahalle_adi` VARCHAR(255) NOT NULL,
    `posta_kodu` VARCHAR(10) DEFAULT NULL,
    FOREIGN KEY (`ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ISS POP Noktaları Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_iss_pop_noktalari` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `pop_adi` VARCHAR(255) NOT NULL,
    `yayin_yapilan_ssid` VARCHAR(255) NOT NULL,
    `ip_adresi` VARCHAR(255) DEFAULT NULL,
    `cihaz_turu` VARCHAR(100) DEFAULT NULL,
    `cihaz_markasi` VARCHAR(100) DEFAULT NULL,
    `cihaz_modeli` VARCHAR(100) DEFAULT NULL,
    `pop_tipi` VARCHAR(100) DEFAULT NULL,
    `il_id` INT DEFAULT NULL,
    `ilce_id` INT DEFAULT NULL,
    `mahalle_id` INT DEFAULT NULL,
    `tam_adres` TEXT DEFAULT NULL,
    `koordinatlar` VARCHAR(100) DEFAULT NULL,
    `aktif_pasif_durum` BOOLEAN NOT NULL DEFAULT 1,
    `eklenme_tarihi` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`il_id`) REFERENCES `mod_btk_adres_il`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`mahalle_id`) REFERENCES `mod_btk_adres_mahalle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    UNIQUE KEY `ssid_ilce_popadi_unique` (`yayin_yapilan_ssid`, `ilce_id`, `pop_adi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Personel Departmanları Referans Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_personel_departmanlari` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `departman_adi` VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Personel Bilgileri Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_personel` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `whmcs_admin_id` INT UNIQUE DEFAULT NULL,
    `firma_unvani` VARCHAR(255) DEFAULT NULL,
    `ad` VARCHAR(100) DEFAULT NULL,
    `soyad` VARCHAR(100) DEFAULT NULL,
    `tckn` VARCHAR(11) DEFAULT NULL,
    `unvan` VARCHAR(100) DEFAULT NULL,
    `departman_id` INT DEFAULT NULL,
    `mobil_tel` VARCHAR(20) DEFAULT NULL,
    `sabit_tel` VARCHAR(20) DEFAULT NULL,
    `email` VARCHAR(255) DEFAULT NULL,
    `ev_adresi` TEXT DEFAULT NULL,
    `acil_durum_kisi_iletisim` TEXT DEFAULT NULL,
    `ise_baslama_tarihi` DATE DEFAULT NULL,
    `isten_ayrilma_tarihi` DATE DEFAULT NULL,
    `is_birakma_nedeni` TEXT DEFAULT NULL,
    `gorev_bolgesi_ilce_id` INT DEFAULT NULL,
    `btk_listesine_eklensin` BOOLEAN NOT NULL DEFAULT 1,
    `tckn_dogrulama_durumu` ENUM('Dogrulanmadi', 'Dogrulandi', 'Dogrulanamadi', 'GecersizTCKN', 'Hata') DEFAULT 'Dogrulanmadi',
    `tckn_dogrulama_zamani` TIMESTAMP NULL DEFAULT NULL,
    `tckn_dogrulama_mesaji` TEXT DEFAULT NULL,
    FOREIGN KEY (`departman_id`) REFERENCES `mod_btk_personel_departmanlari`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`gorev_bolgesi_ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ABONE REHBER Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_abone_rehber` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `whmcs_client_id` INT DEFAULT NULL,
    `whmcs_service_id` INT DEFAULT NULL UNIQUE,
    `operator_kod` VARCHAR(3) NOT NULL,
    `musteri_id` VARCHAR(255) NOT NULL,
    `hat_no` VARCHAR(50) NOT NULL,
    `hat_durum` CHAR(1) DEFAULT NULL,
    `hat_durum_kodu` VARCHAR(10) DEFAULT NULL,
    `hat_durum_kodu_aciklama` VARCHAR(255) DEFAULT NULL,
    `musteri_hareket_kodu` VARCHAR(10) DEFAULT NULL,
    `musteri_hareket_aciklama` VARCHAR(255) DEFAULT NULL,
    `musteri_hareket_zamani` VARCHAR(14) DEFAULT NULL,
    `hizmet_tipi` VARCHAR(50) DEFAULT NULL, -- EK-3 Hizmet Tipi Kodu
    `musteri_tipi` VARCHAR(20) DEFAULT NULL,
    `abone_baslangic` VARCHAR(14) DEFAULT NULL,
    `abone_bitis` VARCHAR(14) DEFAULT NULL,
    `abone_adi` VARCHAR(100) DEFAULT NULL, `abone_soyadi` VARCHAR(100) DEFAULT NULL, `abone_tc_kimlik_no` VARCHAR(11) DEFAULT NULL, `abone_pasaport_no` VARCHAR(50) DEFAULT NULL, `abone_unvan` VARCHAR(250) DEFAULT NULL, `abone_vergi_numarasi` VARCHAR(20) DEFAULT NULL, `abone_mersis_numarasi` VARCHAR(50) DEFAULT NULL, `abone_cinsiyet` CHAR(1) DEFAULT NULL, `abone_uyruk` VARCHAR(3) DEFAULT NULL, `abone_baba_adi` VARCHAR(100) DEFAULT NULL, `abone_ana_adi` VARCHAR(100) DEFAULT NULL, `abone_anne_kizlik_soyadi` VARCHAR(100) DEFAULT NULL, `abone_dogum_yeri` VARCHAR(100) DEFAULT NULL, `abone_dogum_tarihi` VARCHAR(8) DEFAULT NULL, `abone_meslek` VARCHAR(50) DEFAULT NULL, `abone_tarife` VARCHAR(100) DEFAULT NULL, `abone_kimlik_cilt_no` VARCHAR(10) DEFAULT NULL, `abone_kimlik_kutuk_no` VARCHAR(10) DEFAULT NULL, `abone_kimlik_sayfa_no` VARCHAR(10) DEFAULT NULL, `abone_kimlik_il` VARCHAR(100) DEFAULT NULL, `abone_kimlik_ilce` VARCHAR(100) DEFAULT NULL, `abone_kimlik_mahalle_koy` VARCHAR(100) DEFAULT NULL, `abone_kimlik_tipi` VARCHAR(10) DEFAULT NULL, `abone_kimlik_seri_no` VARCHAR(20) DEFAULT NULL, `abone_kimlik_verildigi_yer` VARCHAR(100) DEFAULT NULL, `abone_kimlik_verildigi_tarih` VARCHAR(8) DEFAULT NULL, `abone_kimlik_aidiyeti` CHAR(1) DEFAULT NULL,
    `yerlesim_il_id` INT DEFAULT NULL, `yerlesim_ilce_id` INT DEFAULT NULL, `yerlesim_mahalle_id` INT DEFAULT NULL, `yerlesim_cadde` VARCHAR(255) DEFAULT NULL, `yerlesim_dis_kapi_no` VARCHAR(50) DEFAULT NULL, `yerlesim_ic_kapi_no` VARCHAR(50) DEFAULT NULL, `yerlesim_posta_kodu` VARCHAR(10) DEFAULT NULL, `yerlesim_adres_kodu_uavt` VARCHAR(50) DEFAULT NULL,
    `tesis_il_id` INT DEFAULT NULL, `tesis_ilce_id` INT DEFAULT NULL, `tesis_mahalle_id` INT DEFAULT NULL, `tesis_cadde` VARCHAR(255) DEFAULT NULL, `tesis_dis_kapi_no` VARCHAR(50) DEFAULT NULL, `tesis_ic_kapi_no` VARCHAR(50) DEFAULT NULL, `tesis_posta_kodu` VARCHAR(10) DEFAULT NULL, `tesis_adres_kodu_uavt` VARCHAR(50) DEFAULT NULL,
    `irtibat_tel_no_1` VARCHAR(20) DEFAULT NULL, `irtibat_tel_no_2` VARCHAR(20) DEFAULT NULL, `abone_email` VARCHAR(255) DEFAULT NULL,
    `kurum_yetkili_adi` VARCHAR(100) DEFAULT NULL, `kurum_yetkili_soyadi` VARCHAR(100) DEFAULT NULL, `kurum_yetkili_tckimlik_no` VARCHAR(11) DEFAULT NULL, `kurum_yetkili_telefon` VARCHAR(20) DEFAULT NULL, `kurum_adres` TEXT DEFAULT NULL,
    `aktivasyon_bayi_adi` VARCHAR(255) DEFAULT NULL, `aktivasyon_bayi_adresi` TEXT DEFAULT NULL, `aktivasyon_kullanici` VARCHAR(100) DEFAULT NULL, `guncelleyen_bayi_adi` VARCHAR(255) DEFAULT NULL, `guncelleyen_bayi_adresi` TEXT DEFAULT NULL, `guncelleyen_kullanici` VARCHAR(100) DEFAULT NULL,
    `statik_ip` VARCHAR(255) DEFAULT NULL, 
    `iss_hiz_profili` VARCHAR(100) DEFAULT NULL, `iss_kullanici_adi` VARCHAR(255) DEFAULT NULL, `iss_pop_bilgisi_sunucu` VARCHAR(255) DEFAULT NULL, `iss_pop_noktasi_id` INT DEFAULT NULL, 
    `gsm_onceki_hat_numarasi` VARCHAR(20) DEFAULT NULL, `gsm_dondurulma_tarihi` VARCHAR(14) DEFAULT NULL, `gsm_kisitlama_tarihi` VARCHAR(14) DEFAULT NULL, `gsm_yurtdisi_aktif` CHAR(1) DEFAULT NULL, `gsm_sesli_arama_aktif` CHAR(1) DEFAULT NULL, `gsm_rehber_aktif` CHAR(1) DEFAULT NULL, `gsm_clir_ozelligi_aktif` CHAR(1) DEFAULT NULL, `gsm_data_aktif` CHAR(1) DEFAULT NULL, `gsm_eskart_bilgisi` VARCHAR(50) DEFAULT NULL, `gsm_icci` VARCHAR(30) DEFAULT NULL, `gsm_imsi` VARCHAR(20) DEFAULT NULL, `gsm_dual_gsm_no` VARCHAR(20) DEFAULT NULL, `gsm_fax_no` VARCHAR(20) DEFAULT NULL, `gsm_vpn_kisakod_arama_aktif` CHAR(1) DEFAULT NULL, `gsm_servis_numarasi` VARCHAR(20) DEFAULT NULL, `gsm_bilgi_1` VARCHAR(255) DEFAULT NULL, `gsm_bilgi_2` VARCHAR(255) DEFAULT NULL, `gsm_bilgi_3` VARCHAR(255) DEFAULT NULL, `gsm_alfanumerik_baslik` VARCHAR(50) DEFAULT NULL,
    `sabit_onceki_hat_numarasi` VARCHAR(20) DEFAULT NULL, `sabit_dondurulma_tarihi` VARCHAR(14) DEFAULT NULL, `sabit_kisitlama_tarihi` VARCHAR(14) DEFAULT NULL, `sabit_yurtdisi_aktif` CHAR(1) DEFAULT NULL, `sabit_sesli_arama_aktif` CHAR(1) DEFAULT NULL, `sabit_rehber_aktif` CHAR(1) DEFAULT NULL, `sabit_clir_ozelligi_aktif` CHAR(1) DEFAULT NULL, `sabit_data_aktif` CHAR(1) DEFAULT NULL, `sabit_sehirlerarasi_aktif` CHAR(1) DEFAULT NULL, `sabit_santral_binasi` VARCHAR(255) DEFAULT NULL, `sabit_santral_tipi` VARCHAR(50) DEFAULT NULL, `sabit_sebeke_hizmet_numarasi` VARCHAR(20) DEFAULT NULL, `sabit_pilot_numara` VARCHAR(20) DEFAULT NULL, `sabit_ddi_hizmet_numarasi` VARCHAR(20) DEFAULT NULL, `sabit_gorunen_numara` VARCHAR(20) DEFAULT NULL, `sabit_referans_no` VARCHAR(50) DEFAULT NULL, `sabit_ev_isyeri` CHAR(1) DEFAULT NULL, `sabit_abone_id` VARCHAR(50) DEFAULT NULL, `sabit_servis_numarasi` VARCHAR(20) DEFAULT NULL, `sabit_dahili_no` VARCHAR(10) DEFAULT NULL, `sabit_alfanumerik_baslik` VARCHAR(50) DEFAULT NULL,
    `aih_hiz_profil` VARCHAR(100) DEFAULT NULL, `aih_hizmet_saglayici` VARCHAR(255) DEFAULT NULL, `aih_pop_bilgi` VARCHAR(255) DEFAULT NULL, `aih_ulke_a` VARCHAR(3) DEFAULT NULL, `aih_sinir_gecis_noktasi_a` VARCHAR(255) DEFAULT NULL, `aih_abone_adres_tesis_ulke_b` VARCHAR(3) DEFAULT NULL, `aih_abone_adres_tesis_il_b` VARCHAR(100) DEFAULT NULL, `aih_abone_adres_tesis_ilce_b` VARCHAR(100) DEFAULT NULL, `aih_abone_adres_tesis_mahalle_b` VARCHAR(255) DEFAULT NULL, `aih_abone_adres_tesis_cadde_b` VARCHAR(255) DEFAULT NULL, `aih_abone_adres_tesis_dis_kapi_no_b` VARCHAR(50) DEFAULT NULL, `aih_abone_adres_tesis_ic_kapi_no_b` VARCHAR(50) DEFAULT NULL, `aih_sinir_gecis_noktasi_b` VARCHAR(255) DEFAULT NULL, `aih_devre_adlandirmasi` VARCHAR(255) DEFAULT NULL, `aih_devre_guzergah` TEXT DEFAULT NULL,
    `uydu_onceki_hat_numarasi` VARCHAR(20) DEFAULT NULL, `uydu_dondurulma_tarihi` VARCHAR(14) DEFAULT NULL, `uydu_kisitlama_tarihi` VARCHAR(14) DEFAULT NULL, `uydu_yurtdisi_aktif` CHAR(1) DEFAULT NULL, `uydu_sesli_arama_aktif` CHAR(1) DEFAULT NULL, `uydu_rehber_aktif` CHAR(1) DEFAULT NULL, `uydu_clir_ozelligi_aktif` CHAR(1) DEFAULT NULL, `uydu_data_aktif` CHAR(1) DEFAULT NULL, `uydu_uydu_adi` VARCHAR(100) DEFAULT NULL, `uydu_terminal_id` VARCHAR(50) DEFAULT NULL, `uydu_enlem_bilgisi` VARCHAR(50) DEFAULT NULL, `uydu_boylam_bilgisi` VARCHAR(50) DEFAULT NULL, `uydu_hiz_profili` VARCHAR(100) DEFAULT NULL, `uydu_pop_bilgisi` VARCHAR(255) DEFAULT NULL, `uydu_remote_bilgisi` VARCHAR(255) DEFAULT NULL, `uydu_anauydu_firma` VARCHAR(255) DEFAULT NULL, `uydu_uydutelefon_no` VARCHAR(20) DEFAULT NULL, `uydu_telefon_serino` VARCHAR(50) DEFAULT NULL, `uydu_telefon_imeino` VARCHAR(20) DEFAULT NULL, `uydu_telefon_marka` VARCHAR(100) DEFAULT NULL, `uydu_telefon_model` VARCHAR(100) DEFAULT NULL, `uydu_telefon_simkartno` VARCHAR(30) DEFAULT NULL, `uydu_telefonu_internet_kullanimi` CHAR(1) DEFAULT NULL, `uydu_alfanumerik_baslik` VARCHAR(50) DEFAULT NULL,
    `tesis_koordinat_enlem` VARCHAR(50) DEFAULT NULL,
    `tesis_koordinat_boylam` VARCHAR(50) DEFAULT NULL,
    `tckn_dogrulama_durumu` ENUM('Dogrulanmadi', 'Dogrulandi', 'Dogrulanamadi', 'GecersizTCKN', 'Hata', 'NVIPasaport') DEFAULT 'Dogrulanmadi',
    `tckn_dogrulama_zamani` TIMESTAMP NULL DEFAULT NULL,
    `tckn_dogrulama_mesaji` TEXT DEFAULT NULL,
    `son_guncellenme_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `olusturulma_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`yerlesim_il_id`) REFERENCES `mod_btk_adres_il`(`id`) ON DELETE SET NULL ON UPDATE CASCADE, FOREIGN KEY (`yerlesim_ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE SET NULL ON UPDATE CASCADE, FOREIGN KEY (`yerlesim_mahalle_id`) REFERENCES `mod_btk_adres_mahalle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`tesis_il_id`) REFERENCES `mod_btk_adres_il`(`id`) ON DELETE SET NULL ON UPDATE CASCADE, FOREIGN KEY (`tesis_ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE SET NULL ON UPDATE CASCADE, FOREIGN KEY (`tesis_mahalle_id`) REFERENCES `mod_btk_adres_mahalle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`iss_pop_noktasi_id`) REFERENCES `mod_btk_iss_pop_noktalari`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`hat_durum_kodu`) REFERENCES `mod_btk_ek1_hat_durum_kodlari`(`kod`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`musteri_hareket_kodu`) REFERENCES `mod_btk_ek2_musteri_hareket_kodlari`(`kod`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`hizmet_tipi`) REFERENCES `mod_btk_ek3_hizmet_tipleri`(`hizmet_tipi_kodu`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`abone_kimlik_tipi`) REFERENCES `mod_btk_ek4_kimlik_tipleri`(`kod`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`abone_meslek`) REFERENCES `mod_btk_ek5_meslek_kodlari`(`kod`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_rehber_client_id ON mod_btk_abone_rehber(whmcs_client_id);
CREATE INDEX idx_rehber_service_id ON mod_btk_abone_rehber(whmcs_service_id);
CREATE INDEX idx_rehber_hat_no ON mod_btk_abone_rehber(hat_no(10)); -- HAT_NO uzun olabilir, prefix index
CREATE INDEX idx_rehber_tckn ON mod_btk_abone_rehber(abone_tc_kimlik_no);
CREATE INDEX idx_rehber_hizmet_tipi ON mod_btk_abone_rehber(hizmet_tipi);
CREATE INDEX idx_rehber_musteri_tipi ON mod_btk_abone_rehber(musteri_tipi);
CREATE INDEX idx_rehber_hat_durum ON mod_btk_abone_rehber(hat_durum);


-- ABONE HAREKET Canlı Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_abone_hareket_live` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `rehber_kayit_id` BIGINT NOT NULL, -- mod_btk_abone_rehber.id (Hangi rehber kaydıyla ilgili hareket)
    `musteri_hareket_kodu` VARCHAR(10) NOT NULL, -- EK-2 Müşteri Hareket Kodu
    `musteri_hareket_aciklama` VARCHAR(255) NOT NULL,
    `musteri_hareket_zamani` VARCHAR(14) NOT NULL, -- YYYYMMDDHHMMSS
    -- Hareket anındaki TÜM rehber verisinin bir kopyası (JSON veya ayrı sütunlar)
    -- Ya da sadece değişen alanlar ve eski/yeni değerleri. BTK tam satır bekler.
    `hareket_abone_verisi_json` MEDIUMTEXT DEFAULT NULL, -- Rapor için oluşturulacak tam ABN satırını JSON olarak saklayabiliriz.
    `gonderildi_flag` BOOLEAN NOT NULL DEFAULT 0,
    `cnt_numarasi` VARCHAR(2) DEFAULT NULL,
    `gonderilen_dosya_adi` VARCHAR(255) DEFAULT NULL,
    `gonderim_zamani` TIMESTAMP NULL DEFAULT NULL,
    `kayit_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`rehber_kayit_id`) REFERENCES `mod_btk_abone_rehber`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`musteri_hareket_kodu`) REFERENCES `mod_btk_ek2_musteri_hareket_kodlari`(`kod`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_hareket_rehber_kayit_id ON mod_btk_abone_hareket_live(rehber_kayit_id);
CREATE INDEX idx_hareket_gonderildi_flag ON mod_btk_abone_hareket_live(gonderildi_flag);
CREATE INDEX idx_hareket_zaman_kod ON mod_btk_abone_hareket_live(musteri_hareket_zamani, musteri_hareket_kodu);


-- ABONE HAREKET Arşiv Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_abone_hareket_archive` LIKE `mod_btk_abone_hareket_live`;
ALTER TABLE `mod_btk_abone_hareket_archive` ADD `arsivlenme_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
-- Arşiv tablosundan FOREIGN KEY'leri kaldırmak isteyebiliriz, eğer ana kayıtlar silinirse sorun olmasın diye.
-- Ancak ON DELETE CASCADE olduğu için rehber kaydı silinince hareketler de silinir.
-- Eğer rehber kaydı hiç silinmeyecekse (sadece durumu değişecekse) FK'lar kalabilir.
-- ALTER TABLE `mod_btk_abone_hareket_archive` DROP FOREIGN KEY `mod_btk_abone_hareket_live_ibfk_1`; (Constraint adı farklı olabilir)
-- ALTER TABLE `mod_btk_abone_hareket_archive` DROP FOREIGN KEY `mod_btk_abone_hareket_live_ibfk_2`;


-- FTP Gönderim Logları Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_ftp_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `dosya_adi` VARCHAR(255) NOT NULL,
    `rapor_turu` ENUM('REHBER', 'HAREKET', 'PERSONEL') NOT NULL,
    `yetki_turu_grup` VARCHAR(50) DEFAULT NULL,
    `ftp_sunucu_tipi` ENUM('ANA', 'YEDEK') NOT NULL,
    `gonderim_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `durum` ENUM('Basarili', 'Basarisiz', 'Bekliyor', 'Skipped') NOT NULL DEFAULT 'Bekliyor',
    `hata_mesaji` TEXT DEFAULT NULL,
    `cnt_numarasi` VARCHAR(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_ftp_logs_dosya_adi ON mod_btk_ftp_logs(dosya_adi);
CREATE INDEX idx_ftp_logs_rapor_ftp_durum ON mod_btk_ftp_logs(rapor_turu, ftp_sunucu_tipi, durum);

-- Genel Modül Logları Tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `log_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `log_seviyesi` ENUM('INFO', 'WARNING', 'HATA', 'DEBUG', 'CRITICAL') NOT NULL DEFAULT 'INFO',
    `islem` VARCHAR(255) DEFAULT NULL,
    `mesaj` MEDIUMTEXT,
    `kullanici_id` INT DEFAULT NULL,
    `ip_adresi` VARCHAR(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_logs_seviye_islem ON mod_btk_logs(log_seviyesi, islem(191)); -- islem için prefix index
CREATE INDEX idx_logs_zaman ON mod_btk_logs(log_zamani);

-- WHMCS hizmeti ile POP noktası eşleştirme tablosu
CREATE TABLE IF NOT EXISTS `mod_btk_service_pop_mapping` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `whmcs_service_id` INT NOT NULL UNIQUE,
    `iss_pop_noktasi_id` INT NOT NULL,
    `guncellenme_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`iss_pop_noktasi_id`) REFERENCES `mod_btk_iss_pop_noktalari`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_service_pop_service_id ON mod_btk_service_pop_mapping(whmcs_service_id);