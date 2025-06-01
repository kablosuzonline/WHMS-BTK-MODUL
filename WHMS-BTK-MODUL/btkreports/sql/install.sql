-- WHMCS BTK Raporlama Modülü - Veritabanı Kurulum Şeması - V3.0.0 - Tam Sürüm
-- Bu SQL betiği, modülün çalışması için gerekli tüm tabloları oluşturur.

SET FOREIGN_KEY_CHECKS=0; -- İlişkisel kontrolleri geçici olarak devre dışı bırak

--
-- Tablo yapısı: `mod_btk_config`
-- Modülün genel ayarlarını saklar.
--
DROP TABLE IF EXISTS `mod_btk_config`;
CREATE TABLE `mod_btk_config` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `setting` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting` (`setting`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_yetki_turleri_tanim`
-- İşletmecinin sahip olduğu BTK Yetki Türlerini tanımlar.
--
DROP TABLE IF EXISTS `mod_btk_yetki_turleri_tanim`;
CREATE TABLE `mod_btk_yetki_turleri_tanim` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `yetki_kullanici_adi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Kullanıcının verdiği isim (örn: Ana ISS Yetkimiz)',
  `yetki_kullanici_kodu` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Kullanıcının verdiği eşsiz kısa kod (eskiden ürün eşleştirmede kullanılıyordu, şimdi btk_dosya_tip_kodu esas)',
  `btk_dosya_tip_kodu` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'BTK dokümanındaki dosya tipi kodu (ISS, AIH, GSM, STH, UYDU, MOBIL, TT)',
  `aciklama` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aktif_mi` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Bu yetki tipi için rapor üretilecek mi?',
  `bos_dosya_gonder` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Veri olmasa bile FTP''ye boş dosya gönderilsin mi?',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_btk_dosya_tip_kodu` (`btk_dosya_tip_kodu`),
  KEY `yetki_kullanici_kodu_idx` (`yetki_kullanici_kodu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_product_group_map`
-- WHMCS ürün gruplarını BTK Yetki Türleri ve varsayılan Hizmet Tipleri ile eşleştirir.
--
DROP TABLE IF EXISTS `mod_btk_product_group_map`;
CREATE TABLE `mod_btk_product_group_map` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `whmcs_group_id` int(10) UNSIGNED NOT NULL COMMENT 'tblproductgroups.id ile eşleşir',
  `btk_yetki_kullanici_kodu` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'mod_btk_yetki_turleri_tanim.btk_dosya_tip_kodu ile eşleşir',
  `btk_hizmet_turu_kodu` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'mod_btk_referans_hizmet_tipleri.hizmet_turu_kodu ile eşleşir (EK-3)',
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_group_map` (`whmcs_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='WHMCS ürün gruplarını BTK Yetki ve Hizmet Tipleriyle eşler.';


--
-- Tablo yapısı: `mod_btk_abone_data`
-- Her bir hizmet için BTK'ya raporlanacak abone bilgilerini saklar.
-- "314_KK_Abone_Desen.pdf" Bölüm 3'teki tüm alanları içerir.
--
DROP TABLE IF EXISTS `mod_btk_abone_data`;
CREATE TABLE `mod_btk_abone_data` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `whmcs_service_id` int(10) UNSIGNED NOT NULL,
  `whmcs_client_id` int(10) UNSIGNED NOT NULL,
  `whmcs_order_id` int(10) UNSIGNED DEFAULT NULL,
  `btk_rapor_yetki_tipi_kodu` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Bu kaydın hangi yetki tipi altında raporlanacağı (ISS, AIH vb.)',
  `btk_onay_durumu` enum('OnayBekliyor','Onaylandi','Reddedildi','VeriGirisTamamlanmadi','IptalEdildi') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'VeriGirisTamamlanmadi',
  `operator_kod` char(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `musteri_id` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hat_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hat_durum` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hat_durum_kodu` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hat_durum_kodu_aciklama` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hizmet_tipi` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `musteri_tipi` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_baslangic` char(14) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'YYYYMMDDHHMMSS',
  `abone_bitis` char(14) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'YYYYMMDDHHMMSS',
  `abone_adi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_soyadi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_tc_kimlik_no` char(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_pasaport_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_unvan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_vergi_numarasi` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_mersis_numarasi` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_cinsiyet` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'E, K',
  `abone_uyruk` char(3) COLLATE utf8mb4_unicode_ci DEFAULT 'TUR',
  `abone_baba_adi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_ana_adi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_anne_kizlik_soyadi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_dogum_yeri` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_dogum_tarihi` char(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'YYYYMMDD',
  `abone_meslek` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_tarife` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_kimlik_cilt_no` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_kimlik_kutuk_no` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_kimlik_sayfa_no` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_kimlik_il` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_kimlik_ilce` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_kimlik_mahalle_koy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_kimlik_tipi` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_kimlik_seri_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_kimlik_verildigi_yer` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_kimlik_verildigi_tarih` char(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'YYYYMMDD',
  `abone_kimlik_aidiyeti` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `yerlesim_adresi_ayni` tinyint(1) DEFAULT 0 COMMENT 'Tesis adresi yerleşim adresiyle aynı mı?',
  `abone_adres_tesis_il` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_tesis_ilce` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_tesis_mahalle` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_tesis_cadde` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_tesis_dis_kapi_no` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_tesis_ic_kapi_no` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_tesis_posta_kodu` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_tesis_adres_kodu` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'UAVT Kodu',
  `abone_adres_irtibat_tel_no_1` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_irtibat_tel_no_2` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_e_mail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_yerlesim_il` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_yerlesim_ilce` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_yerlesim_mahalle` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_yerlesim_cadde` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_yerlesim_dis_kapi_no` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_yerlesim_ic_kapi_no` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abone_adres_yerlesim_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'UAVT Yerleşim Yeri No',
  `kurum_yetkili_adi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kurum_yetkili_soyadi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kurum_yetkili_tckimlik_no` char(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kurum_yetkili_telefon` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kurum_adres` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aktivasyon_bayi_adi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aktivasyon_bayi_adresi` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aktivasyon_kullanici` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guncelleyen_bayi_adi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guncelleyen_bayi_adresi` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guncelleyen_kullanici` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statik_ip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  -- Yetki Türüne Özel Alanlar
  `iss_hiz_profili` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iss_kullanici_adi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iss_pop_bilgisi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_hiz_profil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_hizmet_saglayici` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_pop_bilgi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_ulke_a` char(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_sinir_gecis_noktasi_a` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_abone_adres_tesis_ulke_b` char(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_abone_adres_tesis_il_b` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_abone_adres_tesis_ilce_b` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_abone_adres_tesis_mahalle_b` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_abone_adres_tesis_cadde_b` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_abone_adres_tesis_dis_kapi_no_b` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_abone_adres_tesis_ic_kapi_no_b` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_sinir_gecis_noktasi_b` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_devre_adlandirmasi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aih_devre_guzergah` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gsm_onceki_hat_numarasi` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gsm_dondurulma_tarihi` char(14) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gsm_kisitlama_tarihi` char(14) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gsm_yurtdisi_aktif` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gsm_sesli_arama_aktif` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gsm_rehber_aktif` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gsm_clir_ozelligi_aktif` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gsm_data_aktif` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gsm_eskart_bilgisi` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gsm_icci` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gsm_imsi` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gsm_dual_gsm_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gsm_fax_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gsm_vpn_kisakod_arama_aktif` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gsm_servis_numarasi` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gsm_bilgi_1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gsm_bilgi_2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gsm_bilgi_3` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gsm_alfanumerik_baslik` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_onceki_hat_numarasi` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_dondurulma_tarihi` char(14) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_kisitlama_tarihi` char(14) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_yurtdisi_aktif` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_sesli_arama_aktif` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_rehber_aktif` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_clir_ozelligi_aktif` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_data_aktif` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_sehirlerarasi_aktif` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_santral_binasi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_santral_tipi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_sebeke_hizmet_numarasi` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_pilot_numara` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_ddi_hizmet_numarasi` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_gorunen_numara` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_referans_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_ev_isyeri` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_abone_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_servis_numarasi` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_dahili_no` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sabit_alfanumerik_baslik` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_onceki_hat_numarasi` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_dondurulma_tarihi` char(14) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_kisitlama_tarihi` char(14) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_yurtdisi_aktif` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_sesli_arama_aktif` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_rehber_aktif` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_clir_ozelligi_aktif` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_data_aktif` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_uydu_adi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_terminal_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_enlem_bilgisi` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_boylam_bilgisi` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_hiz_profili` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_pop_bilgisi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_remote_bilgisi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_anauydu_firma` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_uydu_telefon_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_telefon_serino` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_telefon_imeino` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_telefon_marka` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_telefon_model` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_telefon_simkartno` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_telefonu_internet_kullanimi` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uydu_alfanumerik_baslik` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nvi_tckn_dogrulandi` tinyint(1) DEFAULT 0,
  `nvi_tckn_son_dogrulama` datetime DEFAULT NULL,
  `nvi_ykn_dogrulandi` tinyint(1) DEFAULT 0,
  `nvi_ykn_son_dogrulama` datetime DEFAULT NULL,
  `nvi_kurum_yetkili_tckn_dogrulandi` tinyint(1) DEFAULT 0, -- Kurum yetkilisi için
  `nvi_kurum_yetkili_tckn_son_dogrulama` datetime DEFAULT NULL, -- Kurum yetkilisi için
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `whmcs_service_id_unique` (`whmcs_service_id`),
  KEY `whmcs_client_id_idx` (`whmcs_client_id`),
  KEY `btk_rapor_yetki_tipi_kodu_idx` (`btk_rapor_yetki_tipi_kodu`),
  KEY `hat_no_idx` (`hat_no`),
  KEY `abone_tc_kimlik_no_idx` (`abone_tc_kimlik_no`),
  KEY `abone_pasaport_no_idx` (`abone_pasaport_no`),
  KEY `abone_unvan_idx` (`abone_unvan`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_hizmet_operasyonel_data`
--
DROP TABLE IF EXISTS `mod_btk_hizmet_operasyonel_data`;
CREATE TABLE `mod_btk_hizmet_operasyonel_data` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `whmcs_service_id` int(10) UNSIGNED NOT NULL,
  `tesis_adres_koordinat_enlem` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tesis_adres_koordinat_boylam` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tesis_adres_google_maps_link` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wireless_cihaz_marka` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wireless_cihaz_model` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wireless_cihaz_mac_adresi` varchar(17) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wireless_cihaz_konum_enlem` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wireless_cihaz_konum_boylam` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ek_bilgi_1` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ek_bilgi_2` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `whmcs_service_id_operasyonel_unique` (`whmcs_service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_abone_hareketler`
--
DROP TABLE IF EXISTS `mod_btk_abone_hareketler`;
CREATE TABLE `mod_btk_abone_hareketler` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `btk_abone_data_id` bigint(20) UNSIGNED NOT NULL,
  `musteri_hareket_kodu` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `musteri_hareket_aciklama` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `musteri_hareket_zamani` char(14) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'YYYYMMDDHHMMSS',
  `hareket_anindaki_data_snapshot` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Hareket anındaki mod_btk_abone_data kaydının JSON''u' CHECK (json_valid(`hareket_anindaki_data_snapshot`)),
  `islem_kayit_zamani` timestamp NOT NULL DEFAULT current_timestamp(),
  `raporlandi_mi` tinyint(1) NOT NULL DEFAULT 0,
  `dosya_adi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Hangi rapor dosyasına dahil edildiği',
  `raporlanma_zamani` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `btk_abone_data_id_idx` (`btk_abone_data_id`),
  KEY `raporlandi_mi_idx` (`raporlandi_mi`),
  KEY `musteri_hareket_zamani_idx` (`musteri_hareket_zamani`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_abone_hareketler_arsiv`
--
DROP TABLE IF EXISTS `mod_btk_abone_hareketler_arsiv`;
CREATE TABLE `mod_btk_abone_hareketler_arsiv` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `btk_abone_data_id` bigint(20) UNSIGNED NOT NULL,
  `musteri_hareket_kodu` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `musteri_hareket_aciklama` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `musteri_hareket_zamani` char(14) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hareket_anindaki_data_snapshot` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `islem_kayit_zamani` timestamp NOT NULL,
  `raporlandi_mi` tinyint(1) NOT NULL DEFAULT 1,
  `dosya_adi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `raporlanma_zamani` datetime DEFAULT NULL,
  `arsivlenme_zamani` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `arsiv_btk_abone_data_id_idx` (`btk_abone_data_id`),
  KEY `arsiv_raporlandi_mi_idx` (`raporlandi_mi`),
  KEY `arsiv_musteri_hareket_zamani_idx` (`musteri_hareket_zamani`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Tablo yapısı: `mod_btk_personel`
--
DROP TABLE IF EXISTS `mod_btk_personel`;
CREATE TABLE `mod_btk_personel` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `whmcs_admin_id` int(10) UNSIGNED DEFAULT NULL COMMENT 'WHMCS tbladmins.id ile eşleşebilir',
  `firma_unvani` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adi` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `soyadi` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tc_kimlik_no` char(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gorev_unvani` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `calistigi_birim` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobil_telefonu` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '5xxxxxxxxx',
  `sabit_telefonu` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'AlanKodu+TelNo',
  `e_posta_adresi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ise_baslama_tarihi` date DEFAULT NULL,
  `isten_ayrilma_tarihi` date DEFAULT NULL,
  `is_birakma_nedeni` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ev_adresi_detay` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `acil_durum_kisi_iletisim` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `btk_listesine_eklensin` tinyint(1) NOT NULL DEFAULT 1,
  `nvi_tckn_dogrulandi` tinyint(1) DEFAULT 0,
  `nvi_tckn_son_dogrulama` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `whmcs_admin_id_personel_unique` (`whmcs_admin_id`),
  UNIQUE KEY `tc_kimlik_no_personel_unique` (`tc_kimlik_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_generated_files`
--
DROP TABLE IF EXISTS `mod_btk_generated_files`;
CREATE TABLE `mod_btk_generated_files` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `dosya_tam_adi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dosya_tipi` enum('ABONE_REHBER','ABONE_HAREKET','PERSONEL_LISTESI') COLLATE utf8mb4_unicode_ci NOT NULL,
  `yetki_tipi_kodu` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ISS, AIH, GSM, STH, UYDU, PERSONEL',
  `dosya_zamandamgasi` char(14) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'YYYYMMDDHHMMSS veya personel için YYYYMM01000000',
  `sayac_cnt` int(2) UNSIGNED NOT NULL DEFAULT 1,
  `icerik_ozeti` char(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'SHA256 hash',
  `olusturulma_zamani` timestamp NOT NULL DEFAULT current_timestamp(),
  `btk_ftp_yukleme_durumu` enum('Bekliyor','Basarili','Basarisiz','Kullanilmiyor','Pending','Success','Error','Not_used') COLLATE utf8mb4_unicode_ci DEFAULT 'Bekliyor',
  `btk_ftp_yukleme_zamani` datetime DEFAULT NULL,
  `btk_ftp_hata_mesaji` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `yedek_ftp_yukleme_durumu` enum('Bekliyor','Basarili','Basarisiz','Kullanilmiyor','Pending','Success','Error','Not_used') COLLATE utf8mb4_unicode_ci DEFAULT 'Kullanilmiyor',
  `yedek_ftp_yukleme_zamani` datetime DEFAULT NULL,
  `yedek_ftp_hata_mesaji` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `dosya_tipi_idx` (`dosya_tipi`),
  KEY `yetki_tipi_kodu_file_idx` (`yetki_tipi_kodu`),
  KEY `olusturulma_zamani_idx` (`olusturulma_zamani`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_nvi_cache`
--
DROP TABLE IF EXISTS `mod_btk_nvi_cache`;
CREATE TABLE `mod_btk_nvi_cache` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `sorgu_tipi` enum('tckn','ykn') COLLATE utf8mb4_unicode_ci NOT NULL,
  `sorgu_parametreleri` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'JSON formatında sorgu parametreleri' CHECK (json_valid(`sorgu_parametreleri`)),
  `sorgu_param_hash` char(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'sorgu_parametreleri alanının SHA256 özeti',
  `sonuc` tinyint(1) DEFAULT NULL COMMENT 'Doğrulama sonucu (1: doğru, 0: yanlış)',
  `yanit_detayi` text COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'NVI servisinden dönen mesaj veya hata',
  `son_sorgu_zamani` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `sorgu_param_hash_unique` (`sorgu_param_hash`),
  KEY `sorgu_tipi_idx` (`sorgu_tipi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo yapısı: `mod_btk_logs`
--
DROP TABLE IF EXISTS `mod_btk_logs`;
CREATE TABLE `mod_btk_logs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `log_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `log_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INFO',
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL COMMENT 'WHMCS Admin ID',
  `client_id` int(10) UNSIGNED DEFAULT NULL,
  `service_id` int(10) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `log_type_idx` (`log_type`),
  KEY `log_time_idx` (`log_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Referans Tabloları (BTK EK'lerinden)
-- Bu tabloların içerikleri initial_reference_data.sql ile doldurulacaktır.
--
DROP TABLE IF EXISTS `mod_btk_referans_hat_durum_kodlari`;
CREATE TABLE `mod_btk_referans_hat_durum_kodlari` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `kod` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hat_durum_aciklama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `btk_aciklama` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kod_hat_durum_unique` (`kod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `mod_btk_referans_musteri_hareket_kodlari`;
CREATE TABLE `mod_btk_referans_musteri_hareket_kodlari` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `kod` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `aciklama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `btk_aciklama` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kod_musteri_hareket_unique` (`kod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `mod_btk_referans_hizmet_tipleri`;
CREATE TABLE `mod_btk_referans_hizmet_tipleri` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `hizmet_turu_kodu` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL, -- Kodu biraz daha uzun tutalım
  `deger_aciklama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hizmet_turu_kodu_unique` (`hizmet_turu_kodu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `mod_btk_referans_kimlik_tipleri`;
CREATE TABLE `mod_btk_referans_kimlik_tipleri` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `belge_tip_kodu` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `belge_adi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `belge_tip_kodu_unique` (`belge_tip_kodu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `mod_btk_referans_meslek_kodlari`;
CREATE TABLE `mod_btk_referans_meslek_kodlari` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `meslek_kodu` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `meslek_adi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `meslek_kodu_unique` (`meslek_kodu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `mod_btk_referans_musteri_tipleri`;
CREATE TABLE `mod_btk_referans_musteri_tipleri` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `musteri_tipi_kodu` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `aciklama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `musteri_tipi_kodu_unique` (`musteri_tipi_kodu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `mod_btk_referans_kimlik_aidiyeti`;
CREATE TABLE `mod_btk_referans_kimlik_aidiyeti` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `kimlik_aidiyeti_kodu` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `aciklama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kimlik_aidiyeti_kodu_unique` (`kimlik_aidiyeti_kodu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ADRES BİLGİLERİ (İller, İlçeler, Mahalleler)
DROP TABLE IF EXISTS `mod_btk_adres_iller`;
CREATE TABLE `mod_btk_adres_iller` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `il_kodu` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'TUIK İl Kodu',
  `il_adi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `il_adi_unique` (`il_adi`),
  KEY `il_kodu_idx` (`il_kodu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `mod_btk_adres_ilceler`;
CREATE TABLE `mod_btk_adres_ilceler` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `il_id` int(10) UNSIGNED NOT NULL,
  `ilce_kodu` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'TUIK İlçe Kodu',
  `ilce_adi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `il_id_fk_idx` (`il_id`),
  KEY `ilce_kodu_idx` (`ilce_kodu`),
  KEY `il_ilce_adi_idx` (`il_id`,`ilce_adi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `mod_btk_adres_mahalleler`;
CREATE TABLE `mod_btk_adres_mahalleler` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ilce_id` int(10) UNSIGNED NOT NULL,
  `mahalle_kodu` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'TUIK Mahalle/Köy Kodu (UAVT)',
  `mahalle_adi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `posta_kodu` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ilce_id_fk_idx` (`ilce_id`),
  KEY `mahalle_kodu_idx` (`mahalle_kodu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


SET FOREIGN_KEY_CHECKS=1; -- İlişkisel kontrolleri tekrar aktif et