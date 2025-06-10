-- WHMCS BTK Raporlama Modülü Kurulum SQL Dosyası
-- Versiyon: (Bir sonraki sürüm numaranız)
-- Güncelleme Tarihi: (Bugünün tarihi)

-- Tablo: mod_btk_config (Modül Ayarları)
CREATE TABLE IF NOT EXISTS `mod_btk_config` (
    `setting` VARCHAR(255) NOT NULL,
    `value` TEXT DEFAULT NULL,
    PRIMARY KEY (`setting`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Varsayılan ayarları ekle (sadece ilk kurulumda)
INSERT IGNORE INTO `mod_btk_config` (`setting`, `value`) VALUES
('operator_kodu', ''),
('operator_adi', ''),
('operator_unvani', ''),
('ftp_host_btk', ''),
('ftp_port_btk', '21'),
('ftp_user_btk', ''),
('ftp_pass_btk', ''),
('ftp_path_rehber_btk', '/REHBER/'),
('ftp_path_hareket_btk', '/HAREKET/'),
('ftp_path_personel_btk', '/PERSONEL/'),
('ftp_use_ssl_btk', '0'),
('ftp_use_passive_btk', '1'),
('ftp_yedek_aktif', '0'),
('ftp_host_yedek', ''),
('ftp_port_yedek', '21'),
('ftp_user_yedek', ''),
('ftp_pass_yedek', ''),
('ftp_path_rehber_yedek', '/REHBER/'),
('ftp_path_hareket_yedek', '/HAREKET/'),
('ftp_path_personel_yedek', '/PERSONEL/'),
('ftp_use_ssl_yedek', '0'),
('ftp_use_passive_yedek', '1'),
('cron_rehber_zamanlama', '0 10 1 * *'),
('cron_hareket_zamanlama', '0 1 * * *'),
('cron_personel_zamanlama_haziran', '0 16 L 6 *'),
('cron_personel_zamanlama_aralik', '0 16 L 12 *'),
('delete_tables_on_deactivate', '0'),
('nvi_tc_dogrulama_aktif', '1'),
('nvi_adres_dogrulama_aktif', '0'),
('hareket_canli_saklama_suresi_gun', '7'),
('hareket_arsiv_saklama_suresi_gun', '180'),
('personel_dosya_adi_yil_ay_btk', '0'),
('personel_dosya_adi_yil_ay_yedek', '1'),
('debug_mode', '0'),
('btk_config_admin_user', 'btkadmin'), -- Varsayılan modül yöneticisi adı
('btk_config_admin_pass_hash', '$2y$10$IfH7q9E2.N10Gv/Qz19xWuX.PbjH.jPzIpj4Q0nUqLzY/4yBikUzG'); -- 'P@$$wOrd123' için hash. Kullanıcı bunu değiştirmeli.

-- Tablo: mod_btk_yetki_turleri (Seçilen Yetki Türleri)
CREATE TABLE IF NOT EXISTS `mod_btk_secilen_yetki_turleri` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `yetki_kodu` VARCHAR(100) NOT NULL UNIQUE, -- BTK tarafından verilen kod veya modül içi bir kod
    `yetki_adi` VARCHAR(255) NOT NULL,
    `aktif` TINYINT(1) DEFAULT 1,
    `rapor_dosya_onek` VARCHAR(50) DEFAULT NULL -- örn: ISS, AIH
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tablo: mod_btk_abone_rehber
CREATE TABLE IF NOT EXISTS `mod_btk_abone_rehber` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `operator_kod` VARCHAR(50) NOT NULL,
    `musteri_id` INT NOT NULL, -- WHMCS tblclients.id
    `hizmet_id` INT NOT NULL, -- WHMCS tblhosting.id
    `hat_no` VARCHAR(255) DEFAULT NULL, -- Genellikle hizmet ID veya özel bir numara
    `hat_durum` CHAR(1) DEFAULT 'A', -- A: Aktif, P: Pasif, I: İptal, D: Dondurulmuş
    `hat_durum_kodu` VARCHAR(10) DEFAULT NULL, -- BTK'nın istediği kod
    `hat_aciklama` TEXT DEFAULT NULL,
    `hizmet_tipi` VARCHAR(50) DEFAULT NULL, -- WIFI, FIBER vb.
    `musteri_tipi` VARCHAR(50) DEFAULT NULL, -- G-SIRKET, B-BIREYSEL
    `abone_baslangic` DATETIME DEFAULT NULL,
    `abone_bitis` DATETIME DEFAULT NULL,
    `abone_adi` VARCHAR(100) DEFAULT NULL,
    `abone_soyadı` VARCHAR(100) DEFAULT NULL,
    `abone_tc_kimlik_no` VARCHAR(11) DEFAULT NULL,
    `abone_yabanci_kimlik_no` VARCHAR(11) DEFAULT NULL,
    `abone_pasaport_no` VARCHAR(50) DEFAULT NULL,
    `abone_unvan` TEXT DEFAULT NULL,
    `abone_vergi_numarasi` VARCHAR(20) DEFAULT NULL,
    `abone_mersis_numarasi` VARCHAR(20) DEFAULT NULL,
    `abone_cinsiyet` CHAR(1) DEFAULT NULL, -- E, K
    `abone_uyruk` VARCHAR(50) DEFAULT NULL,
    `abone_baba_adi` VARCHAR(100) DEFAULT NULL,
    `abone_ana_adi` VARCHAR(100) DEFAULT NULL,
    `abone_anne_kizlik_soyadi` VARCHAR(100) DEFAULT NULL,
    `abone_dogum_yeri` VARCHAR(100) DEFAULT NULL,
    `abone_dogum_tarihi` DATE DEFAULT NULL,
    `abone_meslek` VARCHAR(100) DEFAULT NULL,
    `abone_tarife` VARCHAR(100) DEFAULT NULL,
    `abone_kimlik_cilt_no` VARCHAR(10) DEFAULT NULL,
    `abone_kimlik_kutuk_no` VARCHAR(10) DEFAULT NULL,
    `abone_kimlik_sayfa_no` VARCHAR(10) DEFAULT NULL,
    `abone_kimlik_il` VARCHAR(50) DEFAULT NULL,
    `abone_kimlik_ilce` VARCHAR(50) DEFAULT NULL,
    `abone_kimlik_mahalle_koy` VARCHAR(100) DEFAULT NULL,
    `abone_kimlik_tipi` VARCHAR(50) DEFAULT NULL,
    `abone_kimlik_seri_no` VARCHAR(20) DEFAULT NULL,
    `abone_kimlik_verildigi_yer` VARCHAR(100) DEFAULT NULL,
    `abone_kimlik_verildigi_tarih` DATE DEFAULT NULL,
    `abone_kimlik_aidiyeti` VARCHAR(50) DEFAULT NULL, -- KENDISI, ES, COCUK
    -- Yerleşim Yeri Adresi
    `abone_adres_yerlesim_il` VARCHAR(50) DEFAULT NULL,
    `abone_adres_yerlesim_ilce` VARCHAR(50) DEFAULT NULL,
    `abone_adres_yerlesim_mahalle` VARCHAR(100) DEFAULT NULL,
    `abone_adres_yerlesim_cadde` TEXT DEFAULT NULL,
    `abone_adres_yerlesim_dis_kapi_no` VARCHAR(20) DEFAULT NULL,
    `abone_adres_yerlesim_ic_kapi_no` VARCHAR(20) DEFAULT NULL,
    `abone_adres_yerlesim_posta_kodu` VARCHAR(10) DEFAULT NULL,
    `abone_adres_yerlesim_adres_kodu` VARCHAR(20) DEFAULT NULL, -- UAVT Adres Kodu
    -- Tesis Adresi
    `abone_adres_tesis_il` VARCHAR(50) DEFAULT NULL,
    `abone_adres_tesis_ilce` VARCHAR(50) DEFAULT NULL,
    `abone_adres_tesis_mahalle` VARCHAR(100) DEFAULT NULL,
    `abone_adres_tesis_cadde` TEXT DEFAULT NULL,
    `abone_adres_tesis_dis_kapi_no` VARCHAR(20) DEFAULT NULL,
    `abone_adres_tesis_ic_kapi_no` VARCHAR(20) DEFAULT NULL,
    `abone_adres_tesis_posta_kodu` VARCHAR(10) DEFAULT NULL,
    `abone_adres_tesis_adres_kodu` VARCHAR(20) DEFAULT NULL, -- UAVT Adres Kodu
    `abone_adres_irtibat_tel_no_1` VARCHAR(20) DEFAULT NULL,
    `abone_adres_irtibat_tel_no_2` VARCHAR(20) DEFAULT NULL,
    `abone_adres_e_mail` VARCHAR(255) DEFAULT NULL,
    -- Kurumsal Yetkili Bilgileri
    `kurum_yetkili_adi` VARCHAR(100) DEFAULT NULL,
    `kurum_yetkili_soyadi` VARCHAR(100) DEFAULT NULL,
    `kurum_yetkili_tckimlik_no` VARCHAR(11) DEFAULT NULL,
    `kurum_yetkili_telefon` VARCHAR(20) DEFAULT NULL,
    `kurum_adres` TEXT DEFAULT NULL,
    -- Aktivasyon ve Güncelleme Bilgileri
    `aktivasyon_bayi_adi` VARCHAR(100) DEFAULT NULL,
    `aktivasyon_bayi_adresi` TEXT DEFAULT NULL,
    `aktivasyon_kullanici` VARCHAR(100) DEFAULT NULL,
    `guncelleyen_bayi_adi` VARCHAR(100) DEFAULT NULL,
    `guncelleyen_bayi_adresi` TEXT DEFAULT NULL,
    `guncelleyen_kullanici` VARCHAR(100) DEFAULT NULL,
    -- ISS Özel Alanları
    `statik_ip` TEXT DEFAULT NULL,
    `iss_hiz_profili` VARCHAR(100) DEFAULT NULL,
    `iss_kullanici_adi` VARCHAR(100) DEFAULT NULL,
    `iss_pop_bilgisi` TEXT DEFAULT NULL,
    `tesis_koordinat_lat` VARCHAR(50) DEFAULT NULL, -- Google Maps için Enlem
    `tesis_koordinat_lon` VARCHAR(50) DEFAULT NULL, -- Google Maps için Boylam
    `tc_kimlik_dogrulama_durumu` TINYINT(1) DEFAULT 0, -- 0: Doğrulanmadı, 1: Doğrulandı, 2: Hatalı
    `tc_kimlik_dogrulama_zamani` DATETIME DEFAULT NULL,
    `adres_kodu_dogrulama_durumu` TINYINT(1) DEFAULT 0, -- 0: Doğrulanmadı, 1: Doğrulandı, 2: Hatalı
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_musteri_id` (`musteri_id`),
    INDEX `idx_hizmet_id` (`hizmet_id`),
    INDEX `idx_abone_tc_kimlik_no` (`abone_tc_kimlik_no`),
    INDEX `idx_abone_vergi_numarasi` (`abone_vergi_numarasi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tablo: mod_btk_abone_hareket_canli (Güncel Hareketler)
CREATE TABLE IF NOT EXISTS `mod_btk_abone_hareket_canli` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `abone_rehber_id` INT DEFAULT NULL, -- mod_btk_abone_rehber.id ile ilişki
    `operator_kod` VARCHAR(50) NOT NULL,
    `musteri_id` INT NOT NULL,
    `hizmet_id` INT NOT NULL,
    `hat_no` VARCHAR(255) DEFAULT NULL,
    `musteri_hareket_kodu` VARCHAR(10) NOT NULL, -- BTK tarafından tanımlanan hareket kodu
    `musteri_hareket_aciklama` VARCHAR(255) DEFAULT NULL,
    `musteri_hareket_zamani` DATETIME NOT NULL,
    `eski_deger` TEXT DEFAULT NULL, -- Değişiklik öncesi değer (JSON veya text)
    `yeni_deger` TEXT DEFAULT NULL, -- Değişiklik sonrası değer (JSON veya text)
    `kaynak` VARCHAR(100) DEFAULT NULL, -- Hareketi tetikleyen (hook, manuel, cron vb.)
    `gonderim_durumu` TINYINT(1) DEFAULT 0, -- 0: Gönderilmedi, 1: Gönderildi, 2: Hatalı Gönderim
    `gonderim_deneme_sayisi` INT DEFAULT 0,
    `son_gonderim_denemesi` DATETIME DEFAULT NULL,
    `gonderildigi_dosya_adi` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_hareket_abone_rehber_id` (`abone_rehber_id`),
    INDEX `idx_hareket_musteri_id` (`musteri_id`),
    INDEX `idx_hareket_hizmet_id` (`hizmet_id`),
    INDEX `idx_musteri_hareket_zamani` (`musteri_hareket_zamani`),
    INDEX `idx_gonderim_durumu` (`gonderim_durumu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tablo: mod_btk_abone_hareket_arsiv (Arşivlenmiş Hareketler)
CREATE TABLE IF NOT EXISTS `mod_btk_abone_hareket_arsiv` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `abone_rehber_id` INT DEFAULT NULL,
    `operator_kod` VARCHAR(50) NOT NULL,
    `musteri_id` INT NOT NULL,
    `hizmet_id` INT NOT NULL,
    `hat_no` VARCHAR(255) DEFAULT NULL,
    `musteri_hareket_kodu` VARCHAR(10) NOT NULL,
    `musteri_hareket_aciklama` VARCHAR(255) DEFAULT NULL,
    `musteri_hareket_zamani` DATETIME NOT NULL,
    `eski_deger` LONGTEXT DEFAULT NULL, -- Arşiv için LONGTEXT olabilir
    `yeni_deger` LONGTEXT DEFAULT NULL, -- Arşiv için LONGTEXT olabilir
    `kaynak` VARCHAR(100) DEFAULT NULL,
    `gonderildigi_dosya_adi` TEXT DEFAULT NULL,
    `arsivlenme_tarihi` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_arsiv_musteri_id` (`musteri_id`),
    INDEX `idx_arsiv_hizmet_id` (`hizmet_id`),
    INDEX `idx_arsiv_musteri_hareket_zamani` (`musteri_hareket_zamani`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tablo: mod_btk_personel_departmanlari (ÖNCE TANIMLANMALI)
CREATE TABLE IF NOT EXISTS `mod_btk_personel_departmanlari` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `departman_adi` VARCHAR(255) NOT NULL UNIQUE,
    `teknik_ekip` TINYINT(1) DEFAULT 0 -- 1 ise Google Maps için personel listesinde görünür
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Varsayılan Departmanları Ekle
INSERT IGNORE INTO `mod_btk_personel_departmanlari` (`departman_adi`, `teknik_ekip`) VALUES
('Yönetim Kurulu', 0),
('Genel Müdürlük', 0),
('Hukuk Müşavirliği', 0),
('Mali ve İdari İşler Departmanı', 0),
('Muhasebe ve Finans Birimi', 0),
('İnsan Kaynakları Birimi', 0),
('Satın Alma ve Lojistik Birimi', 0),
('Bilgi Teknolojileri Departmanı', 1),
('Yazılım Geliştirme Birimi', 0),
('Sistem ve Ağ Yönetimi Birimi', 1),
('Veritabanı Yönetimi Birimi', 0),
('Bilgi Güvenliği Birimi', 0),
('Teknik Destek ve Saha Operasyonları Birimi', 1),
('Satış ve Pazarlama Departmanı', 0),
('Kurumsal Satış Birimi', 0),
('Bireysel Satış Birimi', 0),
('Pazarlama ve İletişim Birimi', 0),
('Çağrı Merkezi ve Müşteri Hizmetleri Departmanı', 0),
('Proje Yönetimi Ofisi', 0),
('İş Geliştirme Departmanı', 0),
('Diğer', 0);

-- Tablo: mod_btk_personel
CREATE TABLE IF NOT EXISTS `mod_btk_personel` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `whmcs_admin_id` INT DEFAULT NULL, -- tbladmins.id
    `firma_unvani` VARCHAR(255) DEFAULT NULL,
    `adi` VARCHAR(100) DEFAULT NULL,
    `soyadi` VARCHAR(100) DEFAULT NULL,
    `tc_kimlik_no` VARCHAR(11) DEFAULT NULL,
    `unvan_gorev` VARCHAR(100) DEFAULT NULL,
    `calistigi_birim` VARCHAR(100) DEFAULT NULL,
    `mobil_telefonu` VARCHAR(20) DEFAULT NULL,
    `sabit_telefonu` VARCHAR(20) DEFAULT NULL,
    `e_posta_adresi` VARCHAR(255) DEFAULT NULL,
    `ev_adresi` TEXT DEFAULT NULL,
    `acil_durum_kisi_iletisim` TEXT DEFAULT NULL,
    `ise_baslama_tarihi` DATE DEFAULT NULL,
    `isten_ayrilma_tarihi` DATE DEFAULT NULL,
    `is_birakma_nedeni` TEXT DEFAULT NULL,
    `btk_listesine_eklensin` TINYINT(1) DEFAULT 1,
    `tc_kimlik_dogrulama_durumu` TINYINT(1) DEFAULT 0,
    `tc_kimlik_dogrulama_zamani` DATETIME DEFAULT NULL,
    `departman_id` INT DEFAULT NULL,
    `gorev_bolgesi_il` VARCHAR(100) DEFAULT NULL,
    `gorev_bolgesi_ilce` VARCHAR(100) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_personel_departman` FOREIGN KEY (`departman_id`) REFERENCES `mod_btk_personel_departmanlari`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX `idx_personel_whmcs_admin_id` (`whmcs_admin_id`),
    INDEX `idx_personel_tc_kimlik_no` (`tc_kimlik_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tablo: mod_btk_gonderim_gecmisi (FTP Gönderim Kayıtları)
CREATE TABLE IF NOT EXISTS `mod_btk_gonderim_gecmisi` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `dosya_adi` VARCHAR(255) NOT NULL,
    `rapor_turu` VARCHAR(50) NOT NULL, -- REHBER, HAREKET, PERSONEL
    `ftp_sunucu_tipi` VARCHAR(10) NOT NULL, -- BTK, YEDEK
    `gonderim_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `dosya_boyutu_byte` BIGINT DEFAULT NULL,
    `durum` VARCHAR(50) DEFAULT 'Basarili', -- Basarili, Hatali
    `hata_mesaji` TEXT DEFAULT NULL,
    `icerik_hash` VARCHAR(64) DEFAULT NULL,
    `cnt_degeri` INT DEFAULT 1,
    INDEX `idx_dosya_adi` (`dosya_adi`),
    INDEX `idx_gonderim_zamani` (`gonderim_zamani`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tablo: mod_btk_logs (Modül Logları)
CREATE TABLE IF NOT EXISTS `mod_btk_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `log_tarihi` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `log_seviyesi` VARCHAR(20) DEFAULT 'INFO', -- INFO, WARNING, ERROR, DEBUG
    `log_mesaji` TEXT NOT NULL,
    `kaynak_fonksiyon` VARCHAR(255) DEFAULT NULL,
    `kullanici_id` INT DEFAULT NULL -- İşlemi yapan admin ID
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tablo: mod_btk_iss_pop_noktalari
CREATE TABLE IF NOT EXISTS `mod_btk_iss_pop_noktalari` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `pop_adi` VARCHAR(255) NOT NULL,
    `yayin_yapilan_ssid` VARCHAR(255) DEFAULT NULL,
    `sunucu_bilgisi_eslestirme` VARCHAR(255) DEFAULT NULL,
    `adres_il` VARCHAR(100) DEFAULT NULL,
    `adres_ilce` VARCHAR(100) DEFAULT NULL,
    `adres_mahalle` VARCHAR(150) DEFAULT NULL,
    `adres_detay` TEXT DEFAULT NULL,
    `koordinat_lat` VARCHAR(50) DEFAULT NULL,
    `koordinat_lon` VARCHAR(50) DEFAULT NULL,
    `aktif` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_pop_ssid_ilce` (`yayin_yapilan_ssid`, `adres_ilce`),
    INDEX `idx_pop_il` (`adres_il`),
    INDEX `idx_pop_ilce` (`adres_ilce`),
    INDEX `idx_pop_mahalle` (`adres_mahalle`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tablo: mod_btk_adres_il
CREATE TABLE IF NOT EXISTS `mod_btk_adres_il` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `il_adi` VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tablo: mod_btk_adres_ilce
CREATE TABLE IF NOT EXISTS `mod_btk_adres_ilce` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `il_id` INT NOT NULL,
    `ilce_adi` VARCHAR(255) NOT NULL,
    FOREIGN KEY (`il_id`) REFERENCES `mod_btk_adres_il`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY `unique_il_ilce` (`il_id`, `ilce_adi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tablo: mod_btk_adres_mahalle
CREATE TABLE IF NOT EXISTS `mod_btk_adres_mahalle` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ilce_id` INT NOT NULL,
    `mahalle_adi` VARCHAR(255) NOT NULL,
    `posta_kodu` VARCHAR(10) DEFAULT NULL,
    FOREIGN KEY (`ilce_id`) REFERENCES `mod_btk_adres_ilce`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY `unique_ilce_mahalle` (`ilce_id`, `mahalle_adi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;