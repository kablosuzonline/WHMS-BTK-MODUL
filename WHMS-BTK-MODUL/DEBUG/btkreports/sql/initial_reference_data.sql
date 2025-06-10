-- WHMCS BTK Raporlama Modülü - Başlangıç Referans Verileri SQL Dosyası
-- Version: 6.0.0
-- Bu script, modül kurulumunda install.sql'den sonra çalıştırılır.

-- Temel Modül Ayarları (Varsayılan değerler)
INSERT INTO `mod_btk_settings` (`setting`, `value`) VALUES
('operator_code', ''),
('operator_name', ''),
('operator_title', ''),
('main_ftp_host', ''),
('main_ftp_user', ''),
('main_ftp_pass', ''), 
('main_ftp_port', '21'),
('main_ftp_ssl', '0'),
('main_ftp_rehber_path', '/REHBER/'),
('main_ftp_hareket_path', '/HAREKET/'),
('main_ftp_personel_path', '/PERSONEL/'),
('backup_ftp_enabled', '0'),
('backup_ftp_host', ''),
('backup_ftp_user', ''),
('backup_ftp_pass', ''), 
('backup_ftp_port', '21'),
('backup_ftp_ssl', '0'),
('backup_ftp_rehber_path', '/REHBER_YEDEK/'),
('backup_ftp_hareket_path', '/HAREKET_YEDEK/'),
('backup_ftp_personel_path', '/PERSONEL_YEDEK/'),
('send_empty_reports', '0'),
('delete_data_on_deactivate', '0'),
('rehber_cron_schedule', '0 2 1 * *'),
('hareket_cron_schedule', '0 1 * * *'),
('personel_cron_schedule', '0 16 L 6,12 *'),
('personel_filename_add_year_month_main', '0'),
('personel_filename_add_year_month_backup', '1'),
('hareket_live_table_days', '7'),
('hareket_archive_table_days', '180'),
('admin_records_per_page', '20'),
('log_records_per_page', '50'),
('show_btk_info_if_empty_clientarea', '0'),
('surum_notlari_link', '../modules/addons/btkreports/README.md'),
('module_db_version', '6.0.0')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- BTK Ana Yetki Türleri Referans Verileri (Sizin sağladığınız 20 adetlik listeye göre güncellendi)
-- Grup adları, rapor dosya adındaki "TIP" kısmı için ve EK-3 hizmet tipleriyle eşleştirmek için önemlidir.
-- (B) Bildirim Kapsamında, (K) Kullanım Hakkı Kapsamında anlamına gelir.
DELETE FROM `mod_btk_yetki_turleri_referans`; -- Önce mevcutları temizle (eğer varsa)
INSERT IGNORE INTO `mod_btk_yetki_turleri_referans` (`yetki_kodu`, `yetki_adi`, `grup`) VALUES
('AIH_B', 'Altyapı İşletmeciliği Hizmeti (B)', 'AIH'),
('AIH_K', 'Altyapı İşletmeciliği Hizmeti (K)', 'AIH'),
('GMPCS_MT_B', 'GMPCS Mobil Telefon Hizmeti (B)', 'GMPCS'),
('GMPCS_MT_K', 'GMPCS Mobil Telefon Hizmeti (K)', 'GMPCS'),
('GSM_IMTIYAZ', 'GSM (İmtiyaz Sözleşmesi)', 'GSM'),
('HT_GSM1800_B', 'Hava Taşıtlarında GSM 1800 Mobil Telefon Hizmeti (B)', 'GSM'), -- Grubu GSM olarak varsayıyoruz
('IMT_SSKHYB', 'IMT (Sayısı Sınırlandırılmış Kullanım Hakkı Yetki Belgesi)', 'IMT'),
('IMT2000_UMTS_IMTIYAZ', 'IMT-2000/UMTS (İmtiyaz Sözleşmesi)', 'IMT'),
('KABLOYAYIN_B', 'Kablolu Yayın Hizmeti (B)', 'KABLOYAYIN'),
('OKTH_K', 'Ortak Kullanımlı Telsiz Hizmeti (K)', 'OKTH'),
('REHBERLIK_K', 'Rehberlik Hizmeti (K)', 'REHBERLIK'),
('STH_B', 'Sabit Telefon Hizmeti (B)', 'STH'),
('STH_K', 'Sabit Telefon Hizmeti (K)', 'STH'),
('SMSH_B', 'Sanal Mobil Şebeke Hizmeti (B)', 'SMSH'),
('SMSH_K', 'Sanal Mobil Şebeke Hizmeti (K)', 'SMSH'),
('UYDUHAB_B', 'Uydu Haberleşme Hizmeti (B)', 'UYDU'),
('UYDUPLAT_B', 'Uydu Platform Hizmeti (B)', 'UYDUPLAT'),
('UYDUKABLOTV', 'Uydu ve Kablo TV Hizmetleri', 'UYDUKABLOTV'), -- Bu genel bir başlık gibi, grubu UYDU veya KABLOTV olabilir, şimdilik UYDUKABLOTV.
('CTH_IMTIYAZ', 'Çeşitli Telekomünikasyon Hizmetleri (İmtiyaz Sözleşmesi)', 'CTH'),
('ISS_B', 'İnternet Servis Sağlayıcılığı (B)', 'ISS');

-- Seçili Yetki Türleri için ilk kayıtlar (modül kurulduğunda referans tablosundakilerle senkronize edilir)
DELETE FROM `mod_btk_secili_yetki_turleri`; -- Önce mevcutları temizle
INSERT IGNORE INTO `mod_btk_secili_yetki_turleri` (`yetki_kodu`, `aktif`) 
SELECT `yetki_kodu`, 0 FROM `mod_btk_yetki_turleri_referans`;

-- Personel Departmanları (personel-departman-gorevleri.xlsx dosyasından)
INSERT IGNORE INTO `mod_btk_personel_departmanlari` (`departman_adi`) VALUES
('Yönetim Kurulu'), ('Genel Müdürlük'), ('İnsan Kaynakları Departmanı'), 
('Muhasebe ve Finans Departmanı'), ('Satış ve Pazarlama Departmanı'), ('Müşteri Hizmetleri Departmanı'), 
('Bilgi Teknolojileri Departmanı'), ('Teknik Destek Departmanı'), ('Saha Operasyon Departmanı'), 
('Hukuk Departmanı'), ('AR-GE Departmanı'), ('Kalite Yönetimi Departmanı'), 
('Kurumsal İletişim Departmanı'), ('İdari İşler Departmanı');

-- Adres Verileri
-- TÜM İLLER (81 İl)
INSERT IGNORE INTO `mod_btk_adres_il` (`id`, `il_adi`, `plaka_kodu`) VALUES
(1, 'ADANA', '01'), (2, 'ADIYAMAN', '02'), (3, 'AFYONKARAHİSAR', '03'), (4, 'AĞRI', '04'), (5, 'AMASYA', '05'),
(6, 'ANKARA', '06'), (7, 'ANTALYA', '07'), (8, 'ARTVİN', '08'), (9, 'AYDIN', '09'), (10, 'BALIKESİR', '10'),
(11, 'BİLECİK', '11'), (12, 'BİNGÖL', '12'), (13, 'BİTLİS', '13'), (14, 'BOLU', '14'), (15, 'BURDUR', '15'),
(16, 'BURSA', '16'), (17, 'ÇANAKKALE', '17'), (18, 'ÇANKIRI', '18'), (19, 'ÇORUM', '19'), (20, 'DENİZLİ', '20'),
(21, 'DİYARBAKIR', '21'), (22, 'EDİRNE', '22'), (23, 'ELAZIĞ', '23'), (24, 'ERZİNCAN', '24'), (25, 'ERZURUM', '25'),
(26, 'ESKİŞEHİR', '26'), (27, 'GAZİANTEP', '27'), (28, 'GİRESUN', '28'), (29, 'GÜMÜŞHANE', '29'), (30, 'HAKKARİ', '30'),
(31, 'HATAY', '31'), (32, 'ISPARTA', '32'), (33, 'MERSİN', '33'), (34, 'İSTANBUL', '34'), (35, 'İZMİR', '35'),
(36, 'KARS', '36'), (37, 'KASTAMONU', '37'), (38, 'KAYSERİ', '38'), (39, 'KIRKLARELİ', '39'), (40, 'KIRŞEHİR', '40'),
(41, 'KOCAELİ', '41'), (42, 'KONYA', '42'), (43, 'KÜTAHYA', '43'), (44, 'MALATYA', '44'), (45, 'MANİSA', '45'),
(46, 'KAHRAMANMARAŞ', '46'), (47, 'MARDİN', '47'), (48, 'MUĞLA', '48'), (49, 'MUŞ', '49'), (50, 'NEVŞEHİR', '50'),
(51, 'NİĞDE', '51'), (52, 'ORDU', '52'), (53, 'RİZE', '53'), (54, 'SAKARYA', '54'), (55, 'SAMSUN', '55'),
(56, 'SİİRT', '56'), (57, 'SİNOP', '57'), (58, 'SİVAS', '58'), (59, 'TEKİRDAĞ', '59'), (60, 'TOKAT', '60'),
(61, 'TRABZON', '61'), (62, 'TUNCELİ', '62'), (63, 'ŞANLIURFA', '63'), (64, 'UŞAK', '64'), (65, 'VAN', '65'),
(66, 'YOZGAT', '66'), (67, 'ZONGULDAK', '67'), (68, 'AKSARAY', '68'), (69, 'BAYBURT', '69'), (70, 'KARAMAN', '70'),
(71, 'KIRIKKALE', '71'), (72, 'BATMAN', '72'), (73, 'ŞIRNAK', '73'), (74, 'BARTIN', '74'), (75, 'ARDAHAN', '75'),
(76, 'IĞDIR', '76'), (77, 'YALOVA', '77'), (78, 'KARABÜK', '78'), (79, 'KİLİS', '79'), (80, 'OSMANİYE', '80'),
(81, 'DÜZCE', '81');

-- AYVALIK İLÇESİ (BALIKESİR İLİNE BAĞLI)
-- Balıkesir'in ID'si 10 olduğunu varsayıyoruz.
INSERT IGNORE INTO `mod_btk_adres_ilce` (`id`, `il_id`, `ilce_adi`) VALUES (1001, 10, 'AYVALIK');

-- AYVALIK İLÇESİNE AİT MAHALLELER (Ulaşılabilen ve yaygın olanlar)
INSERT IGNORE INTO `mod_btk_adres_mahalle` (`ilce_id`, `mahalle_adi`, `posta_kodu`) VALUES
(1001, '150 EVLER MAHALLESİ', '10400'),
(1001, 'ALİ ÇETİNKAYA MAHALLESİ', '10400'),
(1001, 'ALİBEY ADASI MAHALLESİ', '10405'),
(1001, 'ALTINOVA MAHALLESİ', '10420'),
(1001, 'ATATÜRK MAHALLESİ', '10400'),
(1001, 'BAĞYÜZÜ KÖYÜ', '10400'),
(1001, 'BEŞİKTAŞ MAHALLESİ', '10400'),
(1001, 'BULUTÇEŞME KÖYÜ', '10400'),
(1001, 'ÇAKMAK KÖYÜ', '10400'),
(1001, 'ÇAMOBA KÖYÜ', '10400'),
(1001, 'FEVZİPAŞA-VEHBİBEY MAHALLESİ', '10400'),
(1001, 'GAZİKEMALPAŞA MAHALLESİ', '10400'),
(1001, 'HACIVELİLER KÖYÜ', '10400'),
(1001, 'HAMDİBEY MAHALLESİ', '10400'),
(1001, 'HAYRETTİNPAŞA MAHALLESİ', '10400'),
(1001, 'İSMETPAŞA MAHALLESİ', '10400'),
(1001, 'KAZIMKARABEKİR MAHALLESİ', '10400'),
(1001, 'KEMALPAŞA MAHALLESİ', '10400'),
(1001, 'KIRCA MAHALLESİ', '10400'),
(1001, 'KÜÇÜKKÖY MAHALLESİ', '10410'),
(1001, 'MİTHATPAŞA MAHALLESİ', '10400'),
(1001, 'MURTELİ KÖYÜ', '10400'),
(1001, 'MUTLU KÖYÜ', '10400'),
(1001, 'NAMIKKEMAL MAHALLESİ', '10400'),
(1001, 'ODABURNU KÖYÜ', '10400'),
(1001, 'SAHİL KEMALPAŞA MAHALLESİ', '10400'),
(1001, 'SAKARYA MAHALLESİ', '10400'),
(1001, 'TURGUTREİS MAHALLESİ', '10400'),
(1001, 'ÜÇKABAAĞAÇ KÖYÜ', '10400'),
(1001, 'YENİKÖY KÖYÜ', '10400'),
(1001, 'ZÜBEYDE HANIM MAHALLESİ', '10400');

-- BTK EK-1 HAT DURUM KODLARI
INSERT IGNORE INTO `mod_btk_ek1_hat_durum_kodlari` (`kod`, `aciklama`) VALUES
('1', 'AKTIF'), ('2', 'IPTAL NUMARA DEGISIKLIGI'), ('3', 'IPTAL'), ('4', 'IPTAL SAHTE EVRAK'),
('5', 'IPTAL MUSTERI TALEBI'), ('6', 'IPTAL DEVIR'), ('7', 'IPTAL HAT BENIM DEGIL'),
('8', 'IPTAL KARA LISTE'), ('9', 'IPTAL KULLANIM DISI'), ('10', 'IPTAL EKSIK EVRAK'),
('11', 'IPTAL SEHVEN GIRIS'), ('12', 'IPTAL BAGLI URUN IPTALI'), ('13', 'KISITLI KONTUR BITTI'),
('14', 'KISITLI ARAMAYA KAPALI'), ('15', 'DONDURULMUS MUSTERI TALEBI'), ('16', 'DONDURULMUS ISLETME');

-- BTK EK-2 MÜŞTERİ HAREKET KODLARI
INSERT IGNORE INTO `mod_btk_ek2_musteri_hareket_kodlari` (`kod`, `aciklama`) VALUES
('1', 'YENI_ABONELIK_KAYDI'), ('2', 'HAT_DURUM_DEGISIKLIGI'), ('3', 'SIM_KART_DEGISIKLIGI'),
('4', 'ODEME_TIPI_DEGISIKLIGI'), ('5', 'ADRES_DEGISIKLIGI'), ('6', 'IMSI_DEGISIKLIGI'),
('7', 'TARIFE_DEGISIKLIGI'), ('8', 'DEVIR_MUSTERI_DEGISIKLIGI'), ('9', 'NUMARA_DEGISIKLIGI'),
('10', 'HAT_IPTAL'), ('11', 'MUSTERI_BILGI_DEGISIKLIGI'), ('12', 'NUMARA_TASIMA'),
('13', 'NUMARA_DEGISMEDEN_NAKIL'), ('14', 'NUMARA_DEGISTIREREK_NAKIL'), ('15', 'IP_DEGISIKLIGI');
-- ... initial_reference_data.sql Bölüm 1/3 içeriğinin sonu ...

-- BTK EK-3 HİZMET TİPLERİ (BTK 24.10.2018 Dokümanı EK-3 ve abonedesen.xlsx birleştirilmiş ve ana yetki gruplarıyla eşleştirilmiş hali)
-- hizmet_tipi_kodu: Rapor içindeki HIZMET_TIPI alanına yazılacak değer.
-- ana_yetki_grup: Bu hizmetin genellikle hangi ana BTK Yetki Konusu (ve dolayısıyla rapor dosya adındaki "TIP") altında verildiğini belirtir.
INSERT IGNORE INTO `mod_btk_ek3_hizmet_tipleri` (`hizmet_tipi_kodu`, `hizmet_tipi_aciklamasi`, `ana_yetki_grup`) VALUES
-- MOBİL GRUBU (GSM, GMPCS, IMT)
('POSTPAID_GSM', 'Postpaid GSM', 'GSM'),
('PREPAID_GSM', 'Prepaid GSM', 'GSM'),
('HSCSD', 'HSCSD (Mobil Veri)', 'GSM'),
('GSMPOS', 'GSM POS Hizmeti', 'GSM'),
('MOBIL_DATA_FATURALI', 'Faturalı Mobil İnternet/Data', 'GSM'), -- Genel Mobil Data
('MOBIL_DATA_ONODEMELI', 'Ön Ödemeli Mobil İnternet/Data', 'GSM'), -- Genel Mobil Data
('M2M_FATURALI', 'Faturalı M2M (Makineler Arası İletişim)', 'GSM'),
('M2M_ONODEMELI', 'Ön Ödemeli M2M (Makineler Arası İletişim)', 'GSM'),
('GMPCS_SES', 'GMPCS Mobil Telefon Hizmeti (Ses)', 'GMPCS'),
('GMPCS_DATA', 'GMPCS Mobil Telefon Hizmeti (Data)', 'GMPCS'), -- GMPCS için Data
('HT_GSM1800_SES', 'Hava Taşıtlarında GSM 1800 Mobil Telefon Hizmeti (Ses)', 'GSM'),
('IMT_SES', 'IMT Ses Hizmeti (3G/4.5G Ses)', 'IMT'),
('IMT_DATA', 'IMT Data Hizmeti (3G/4.5G Data)', 'IMT'),
('IMT_SMS', 'IMT SMS Hizmeti', 'IMT'),
('IMT_MMS', 'IMT MMS Hizmeti', 'IMT'),

-- ISS GRUBU (İnternet Servis Sağlayıcılığı)
('ADSL', 'ADSL İnternet Erişimi', 'ISS'),
('XDSL', 'xDSL İnternet Erişimi (VDSL, SDSL vb.)', 'ISS'),
('FIBER_INTERNET', 'Fiber İnternet Erişimi', 'ISS'), -- EK-3'te FIBER
('HIPERNET', 'Hipernet İnternet Erişimi', 'ISS'),     -- EK-3'te HIPER
('FR', 'Frame Relay (ISS)', 'ISS'),
('ATM', 'ATM (ISS)', 'ISS'),
('METRO_ETHERNET_ISS', 'Metro Ethernet (ISS)', 'ISS'), -- EK-3'te METRO
('WIFI_INTERNET', 'WiFi İnternet Erişimi (ISS)', 'ISS'), -- EK-3'te WIFI
('SSG_INTERNET', 'SSG İnternet Erişimi', 'ISS'),
('VERI_MERKEZI', 'Veri Merkezi Hizmetleri (ISS)', 'ISS'),
('UYDU_INTERNET_ISS', 'Uydu Üzerinden İnternet Erişimi (ISS)', 'ISS'), -- EK-3'te UYDU_INTERNET
('KABLONET_INTERNET', 'Kablo İnternet Erişimi (KABLONET)', 'ISS'),   -- EK-3'te KABLONET

-- STH GRUBU (Sabit Telefon Hizmeti)
('SAYISAL_COKLU_HAT', 'Sayısal Çoklu Hat (PRA/PRI)', 'STH'),
('SAYISAL_COKLU_SERVIS_444', 'Sayısal Çoklu Hat Servis 444', 'STH'),
('SAYISAL_COKLU_SERVIS_3RAKAM', 'Sayısal Çoklu Hat Servis 3 Rakam', 'STH'),
('SAYISAL_COKLU_SERVIS_822', 'Sayısal Çoklu Hat Servis 822', 'STH'),
('SAYISAL_COKLU_SERVIS_800', 'Sayısal Çoklu Hat Servis 800', 'STH'),
('SANAL_SANTRAL', 'Sanal Santral Hizmeti', 'STH'),
('IP_COKLU_HAT', 'IP Çoklu Hat (SIP Trunk)', 'STH'),
('IP_COKLU_SERVIS_444', 'IP Çoklu Hat Servis 444', 'STH'),
('TELEKS_STH', 'Teleks Hizmeti (STH)', 'STH'), -- EK-3'te TELEKS
('SABIT_HAT_ANALOG', 'Sabit Hat (POTS/Analog)', 'STH'), -- EK-3'te SABIT_HAT
('SERVIS_444', 'Servis 444 (STH)', 'STH'),
('ANKESOR_STH', 'Ankesörlü Telefon Hizmeti (STH)', 'STH'), -- EK-3'te ANKESOR
('MULTIMEDYA_ANKESOR_STH', 'Multimedya Ankesör Hizmeti (STH)', 'STH'), -- EK-3'te MULTIMEDYA_ANKESOR
('CENTREKS_STH', 'Centreks Hizmeti (STH)', 'STH'), -- EK-3'te CENTREKS
('SERVIS_3RAKAM', 'Servis 3 Rakam (STH)', 'STH'),
('SAYISAL_IKILI_HAT_STH', 'Sayısal İkili Hat (BRA/BRI) (STH)', 'STH'), -- EK-3'te SAYISAL_IKILI_HAT
('SERVIS_800', 'Servis 800 (STH)', 'STH'),
('TELEFON_STH_GENEL', 'Telefon Hizmeti (Genel Sabit)', 'STH'), -- EK-3'te TELEFON
('ISDN_PRI', 'ISDN PRI (STH)', 'STH'),
('WIMAX', 'WIMAX (STH)', 'STH'),
('GORUNTULU_TELEFON', 'Görüntülü Telefon (STH)', 'STH'),
('KIRALIKDEVRE_TELEFON', 'Kiralık Devre Telefon (STH)', 'STH'),
('KIRALIKDEVRE_TELGRAF', 'Kiralık Devre Telgraf (STH)', 'STH'),
('ISDN_BA', 'ISDN BA (Bulut Akademi)', 'STH'), -- EK-3'te ISDN_BULUT_AKADEMI
('KURUMSAL_GUVENLIK', 'Kurumsal Güvenlik (STH)', 'STH'),
('SMS_TOPLU', 'SMS / Toplu SMS (PSTN/STH)', 'STH'), -- EK-3'te SMS / Toplu SMS

-- UYDU GRUBU (Uydu Haberleşme Hizmeti - UHH)
('UYDU_SES_UHH', 'Uydu Üzerinden Ses (UHH)', 'UYDU'),       -- EK-3'te UYDU_SES
('UYDU_DATA_UHH', 'Uydu Üzerinden Data (UHH)', 'UYDU'),       -- EK-3'te UYDU_DATA
('TES_UYDU_IP_TEL', 'TES-Uydu IP ve Telefon', 'UYDU'), -- Bu hem UYDU hem GMPCS olabilir

-- AIH GRUBU (Altyapı İşletmeciliği Hizmeti)
('P2P_METRO', 'Noktadan Noktaya Metro Ethernet (AIH)', 'AIH'),
('P2P_ATM', 'Noktadan Noktaya ATM (AIH)', 'AIH'),
('P2P_FR', 'Noktadan Noktaya Frame Relay (AIH)', 'AIH'),
('P2P_GHDSL', 'Noktadan Noktaya G.SHDSL (AIH)', 'AIH'),
('P2P_ADSL', 'Noktadan Noktaya ADSL (AIH)', 'AIH'),
('VPN_METRO', 'VPN Metro Ethernet (AIH)', 'AIH'),
('VPN_GHDSL', 'VPN G.SHDSL (AIH)', 'AIH'),
('VPN_ADSL', 'VPN ADSL (AIH)', 'AIH'),
('VPN_FR', 'VPN Frame Relay (AIH)', 'AIH'),
('KIRALIK_DEVRE_DATA', 'Kiralık Devre Data (AIH)', 'AIH'),
('KIRALIK_DEVRE_KISMI', 'Kiralık Devre Kısmi (AIH)', 'AIH'),
('VPN_MPLS', 'VPN MPLS (AIH)', 'AIH'),
('P2P_DWDM', 'Noktadan Noktaya DWDM (AIH)', 'AIH'),
('P2P_SDH', 'Noktadan Noktaya SDH (AIH)', 'AIH'),

-- KABLOYAYIN GRUBU
('KABLOTV_HIZMETI', 'Kablo TV Hizmeti', 'KABLOYAYIN'), -- Ana Yetki KABLOYAYIN_B

-- UYDU PLATFORM GRUBU
('UYDU_PLATFORM', 'Uydu Platform Hizmeti', 'UYDUPLAT'), -- Ana Yetki UYDUPLAT_B

-- DİĞER GRUPLAR (Ana Yetki Kodu ile aynı olabilir veya genel bir hizmet tipi)
('OKTH_HIZMETI', 'Ortak Kullanımlı Telsiz Hizmeti', 'OKTH'), -- Ana Yetki OKTH_K
('REHBERLIK_HIZMETI', 'Rehberlik Hizmeti', 'REHBERLIK'),   -- Ana Yetki REHBERLIK_K
('SMSH_HIZMETI', 'Sanal Mobil Şebeke Hizmeti', 'SMSH'),     -- Ana Yetki SMSH_B veya SMSH_K
('CTH_HIZMETI', 'Çeşitli Telekomünikasyon Hizmetleri', 'CTH'); -- Ana Yetki CTH_IMTIYAZ

-- BTK EK-4 KİMLİK TİPLERİ (BTK 24.10.2018 Dokümanı EK-4)
INSERT IGNORE INTO `mod_btk_ek4_kimlik_tipleri` (`kod`, `aciklama`, `ulke_kodu_gerekli`) VALUES
('TCKK', 'TC Çipli Kimlik Kartı', FALSE),
('TCNC', 'TC Nüfus Cüzdanı', FALSE),
('TCYK', 'TC Yabancı Kimlik Belgesi (Yabancı Misyon Kimlik Kartı, Geçici Koruma Kimlik Belgesi, İkamet İzin Belgesi, Çalışma İzni Belgesi, Vatansız Kişi Kimlik Belgesi)', FALSE),
('TCPC', 'TC Pasaportu: Yeni Tip Çipli e-Pasaport (Tüm Tipler)', FALSE),
('TCPL', 'TC Pasaportu: Eski Tip Lacivert (Umuma Mahsus)', FALSE),
('TCPY', 'TC Pasaportu: Eski Tip Yeşil (Hususi)', FALSE),
('TCPG', 'TC Pasaportu: Eski Tip Gri (Hizmet)', FALSE),
('TCPK', 'TC Pasaportu: Eski Tip Kırmızı (Diplomatik)', FALSE),
('TCGP', 'TC Pasaportu: Geçici Pasaport', FALSE),
('YP', 'Yabancı Pasaport', TRUE),
('AC', 'Uçuş mürettebatı belgesi', TRUE),
('GC', 'Gemi adamı cüzdanı', TRUE),
('NE', 'NATO Emri belgesi', TRUE),
('SB', 'Seyahat Belgesi', TRUE),
('HB', 'Hudut Geçiş Belgesi', TRUE),
('GK', 'Gemi Komutanı Onaylı Personel Listesi', TRUE),
('TCSC', 'TC Sürücü Belgesi', FALSE),
('TCHS', 'TC Hakim/Savcı Mesleki Kimlik Kartı', FALSE),
('TCSV', 'TC Avukatlık Belgesi', FALSE),
('TCGK', 'TC Geçici Kimlik Belgesi', FALSE),
('TCMA', 'TC Mavi Kart', FALSE),
('TCEV', 'TC Uluslararası aile cüzdanı', FALSE),
('TCNT', 'Noter Kimlik Kartı', FALSE),
('TBMM', 'TBMM Milletvekili Kimlik Kartı', FALSE),
('TSK', 'Türk Silahlı Kuvvetleri Kimlik Kartı', FALSE),
('KKTC', 'Kuzey Kıbrıs Türk Cumhuriyeti Kimlik Kartı', FALSE);
-- EK-4 Kimlik Tipleri Sonu
-- ... initial_reference_data.sql Bölüm 2/3 içeriğinin sonu ...

-- BTK EK-5 MESLEK KODLARI (BTK 24.10.2018 Dokümanı EK-5 - ISCO 08 130 Grup)
-- Bu liste tamdır (130 Meslek Kodu).
INSERT IGNORE INTO `mod_btk_ek5_meslek_kodlari` (`kod`, `aciklama`) VALUES
('011', 'Subaylar'),
('021', 'Subay olmayan silahlı kuvvetlerin daimi mensupları'),
('031', 'Silahlı kuvvetlerde diğer rütbelerdeki meslekler'),
('111', 'Kanun yapıcılar ve üst düzey yöneticiler'),
('112', 'Genel müdürler ve başkanlar (özel sektör)'),
('121', 'İş hizmetleri ve idaresi ile ilgili müdürler'),
('122', 'Satış, pazarlama ve iş geliştirme ile ilgili müdürler'),
('131', 'Tarım, ormancılık ve balıkçılık ile ilgili üretim müdürleri'),
('132', 'İmalat, madencilik, inşaat ve dağıtım müdürleri'),
('133', 'Bilgi ve iletişim teknolojisi hizmet müdürleri'),
('134', 'Profesyonel hizmet müdürleri'),
('141', 'Otel, lokanta ve restoran müdürleri'),
('142', 'Perakende ve toptan ticaret müdürleri'),
('143', 'Diğer hizmet müdürleri'),
('211', 'Fizik ve yer bilimleri ile ilgili profesyonel meslek mensupları'),
('212', 'Matematikçiler, istatistikçiler ve aktüerler'),
('213', 'Yaşam bilimleri ile ilgili profesyonel meslek mensupları'),
('214', 'Mühendislik ile ilgili profesyonel meslek mensupları (elektroteknoloji mühendisleri hariç)'),
('215', 'Elektroteknoloji mühendisleri'),
('216', 'Mimarlar, planlamacılar, harita mühendisleri ve tasarımcılar'),
('221', 'Tıp doktorları'),
('222', 'Hemşirelik ve ebelik profesyonelleri'),
('223', 'Geleneksel ve tamamlayıcı tıp profesyonelleri'),
('224', 'Paramedikal uygulayıcılar'),
('225', 'Veterinerler'),
('226', 'Diğer sağlık profesyonelleri'),
('231', 'Üniversite ve yükseköğretim öğretim elemanları'),
('232', 'Mesleki eğitim öğretmenleri'),
('233', 'Ortaöğretim (ortaokul ve lise) öğretmenleri'),
('234', 'İlkokul ve okul öncesi öğretmenleri'),
('235', 'Eğitim ile ilgili diğer profesyonel meslek mensupları'),
('241', 'Finans ile ilgili profesyonel meslek mensupları'),
('242', 'Yönetim ile ilgili profesyonel meslek mensupları'),
('243', 'Satış, pazarlama ve halkla ilişkiler ile ilgili profesyonel meslek mensupları'),
('251', 'Yazılım ve uygulama geliştiricileri ve analistleri'),
('252', 'Veri tabanı ve bilgisayar ağları ile ilgili profesyonel meslek mensupları'),
('261', 'Hukuk ile ilgili profesyonel meslek mensupları'),
('262', 'Kütüphaneciler, arşivciler ve küratörler'),
('263', 'Sosyal ve din ile ilgili profesyonel meslek mensupları'),
('264', 'Yazarlar, gazeteciler ve dilbilimciler'),
('265', 'Yaratıcı sanatçılar ve sahne sanatçıları'),
('311', 'Fizik ve mühendislik bilimleri teknisyenleri'),
('312', 'Maden, imalat ve inşaat süpervizörleri'),
('313', 'İşlem kontrol teknisyenleri'),
('314', 'Yaşam bilimleri teknisyenleri ve ilgili yardımcı profesyonel meslek mensupları'),
('315', 'Gemi ve hava taşıtı kontrolörleri ve teknisyenleri'),
('321', 'Tıp teknisyenleri ve eczacılık teknisyenleri'),
('322', 'Hemşirelik ve ebelik yardımcı profesyonelleri'),
('323', 'Geleneksel ve tamamlayıcı tıp yardımcı profesyonelleri'),
('324', 'Veteriner teknisyenleri ve yardımcıları'),
('325', 'Diğer yardımcı sağlık profesyonelleri'),
('331', 'Finans ve matematiksel işler ile ilgili yardımcı profesyonel meslek mensupları'),
('332', 'Satış ve satın alma temsilcileri ve aracıları (brokerler)'),
('333', 'İş hizmetleri aracıları'),
('334', 'İdari ve belli bir alanda uzmanlaşmış sekreterler'),
('335', 'Düzenleyici devlet ile ilgili alanlardaki yardımcı profesyonel meslek mensupları'),
('341', 'Hukuk, sosyal ve din ile ilgili yardımcı profesyonel meslek mensupları'),
('342', 'Spor ve fitnes çalışanları'),
('343', 'Sanat, kültür ve mutfak ile ilgili yardımcı profesyonel meslek mensupları'),
('351', 'Bilgi ve iletişim teknolojileri işletim ve kullanıcı destek teknisyenleri'),
('352', 'Telekomünikasyon ve yayın teknisyenleri'),
('411', 'Genel büro elemanları'),
('412', 'Sekreterler (genel)'),
('413', 'Klavye kullanan operatörler'),
('421', 'Veznedarlar, tahsilatçılar ve benzer elemanlar'),
('422', 'Müşteri danışma elemanları'),
('431', 'Sayısal işlemler yapan büro elemanları'),
('432', 'Malzeme kayıtları ve taşımacılık ile ilgili büro elemanları'),
('441', 'Diğer büro hizmetlerinde çalışan elemanlar'),
('511', 'Seyahatlerde hizmet veren elemanlar, kondüktörler ve otobüs muavinleri ile rehberler'),
('512', 'Aşçılar'),
('513', 'Garsonlar ve barmenler'),
('514', 'Kuaförler, güzellik uzmanları ve ilgili çalışanlar'),
('515', 'Bina sorumluları ile temizlik ve bakım işleri sorumluları'),
('516', 'Diğer kişisel hizmetlerde çalışanlar'),
('521', 'Sokak, tezgah ve pazar satış elemanları'),
('522', 'Mağaza, dükkan vb. satış elemanları'),
('523', 'Kasiyerler ve bilet satıcıları'),
('524', 'Diğer satış elemanları'),
('531', 'Çocuk bakım hizmetleri veren elemanlar ve öğretmen yardımcıları'),
('532', 'Sağlık hizmetlerinde kişisel bakım çalışanları'),
('541', 'Koruma hizmetleri veren elemanlar'),
('611', 'Bahçıvanlar ve bitkisel ürün yetiştiricileri'),
('612', 'Hayvan yetiştiricileri'),
('613', 'Karma bitki ve hayvan yetiştiricileri'),
('621', 'Ormancılık ve ormancılık ile ilgili işlerde çalışanlar'),
('622', 'Su ürünleri çalışanları, avcılar ve tuzakçılar'),
('631', 'Kendi geçimine yönelik bitkisel ürün yetiştiricileri'),
('632', 'Kendi geçimine yönelik çiftlik hayvanları yetiştiricileri'),
('633', 'Kendi geçimine yönelik karma bitkisel ürün ve çiftlik hayvanları yetiştiricileri'),
('634', 'Kendi geçimine yönelik balıkçılar, avcılar, tuzakçılar ve toplayıcılar'),
('711', 'Kaba inşaat ve ilgili işlerde çalışan sanatkarlar'),
('712', 'İnşaatı tamamlayıcı işler ve ilgili işlerde çalışan sanatkarlar'),
('713', 'Badana, boya ve bina dış yüzey temizliği ve ilgili işlerde çalışan sanatkarlar'),
('721', 'Metal levha ve inşaat malzemesi, metal kalıpçılar ve kaynakçılar ve ilgili işlerde çalışanlar'),
('722', 'Demirciler, alet yapımcıları ve ilgili işlerde çalışanlar'),
('723', 'Makine bakım ve onarım işlerinde çalışanlar'),
('731', 'El sanatları çalışanları'),
('732', 'Basım ile ilgili işlerde çalışanlar'),
('741', 'Elektrikli ekipman kurulumcuları ve tamircileri'),
('742', 'Elektronik ve telekomünikasyon kurulumcuları ve tamircileri'),
('751', 'Gıda işleme ve ilgili işlerde çalışanlar'),
('752', 'Ağaç işleyiciler, ahşap mobilya imalatçıları ve ilgili işlerde çalışanlar'),
('753', 'Tekstil ve giyim eşyası ile ilgili işlerde çalışanlar'),
('754', 'Diğer sanatkarlar ve ilgili işlerde çalışanlar'),
('811', 'Madencilik ve mineral işleme tesisi operatörleri'),
('812', 'Metal işleme ve perdahlama tesisi operatörleri'),
('813', 'Kimyasal ve fotoğrafik ürünler tesis ve makine operatörleri'),
('814', 'Kauçuk, plastik ve kağıt ürünleri makine operatörleri'),
('815', 'Tekstil, kürk ve deri ürünleri makine operatörleri'),
('816', 'Gıda ve ilgili ürünlerin makine operatörleri'),
('817', 'Ağaç işleme ve kağıt imalat tesisi operatörleri'),
('818', 'Diğer sabit tesis ve makine operatörleri'),
('821', 'Montajcılar'),
('831', 'Lokomotif motoru sürücüleri ve ilgili çalışanlar'),
('832', 'Otomobil, kamyonet ve motosiklet sürücüleri'),
('833', 'Ağır yük kamyonu ve otobüs sürücüleri'),
('834', 'Hareketli makine ve teçhizat operatörleri'),
('835', 'Gemi güverte tayfaları ve ilgili çalışanlar'),
('911', 'Ev, otel ve bürolarda çalışan temizlikçiler ve ev işleri yardımcıları'),
('912', 'Taşıt ve pencere temizleme ile çamaşır yıkama ve diğer elle yapılan temizlik işlerinde çalışanlar'),
('921', 'Tarım, ormancılık ve balıkçılık sektörlerinde nitelik gerektirmeyen işlerde çalışanlar'),
('931', 'Madencilik ve inşaat sektörlerinde nitelik gerektirmeyen işlerde çalışanlar'),
('932', 'İmalat sektöründe nitelik gerektirmeyen işlerde çalışanlar'),
('933', 'Ulaştırma ve depolama sektörlerinde nitelik gerektirmeyen işlerde çalışanlar'),
('941', 'Yiyecek hazırlama yardımcıları'),
('951', 'Cadde ve sokaklarda hizmet işlerinde çalışanlar'),
('952', 'Sokak satıcıları (gıda hariç)'),
('961', 'Çöpçüler ve atık toplayıcılar'),
('962', 'Diğer nitelik gerektirmeyen işlerde çalışanlar');
-- EK-5 Meslek Kodları Sonu

-- initial_reference_data.sql dosyasının sonu.