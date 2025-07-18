-- WHMCS BTK Raporlama Modülü - Başlangıç Referans Verileri Script'i
-- Sürüm: 8.1.0 (Yeniden Doğuş) - TÜM Veriler Eksiksiz

-- Temel Modül Ayarları (Varsayılan Değerler)
INSERT IGNORE INTO `mod_btk_settings` (`setting`, `value`) VALUES
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
('rehber_cron_schedule', '0 10 1 * *'),
('hareket_cron_schedule', '0 1 * * *'),
('personel_cron_schedule', '0 16 L 6,12 *'),
('personel_filename_add_year_month_main', '0'),
('personel_filename_add_year_month_backup', '1'),
('hareket_live_table_days', '7'),
('hareket_archive_table_days', '180'),
('admin_records_per_page', '20'),
('log_records_per_page', '50'),
('show_btk_info_if_empty_clientarea', '0'),
('personel_nvi_verification_enabled', '1'),
('abone_nvi_verification_enabled', '0'),
('pop_monitoring_enabled', '0'),
('pop_monitoring_cron_schedule', '*/5 * * * *'),
('pop_monitoring_timeout_sec', '2'),
('pop_monitoring_high_latency_threshold_ms', '500'),
('module_db_version', '8.1.0');

-- BTK Yetki Türleri Referans Verileri
INSERT IGNORE INTO `mod_btk_yetki_turleri_referans` (`yetki_kodu`, `yetki_adi`, `grup`) VALUES
('AIH_B', 'Altyapı İşletmeciliği Hizmeti (B)', 'AIH'),
('AIH_K', 'Altyapı İşletmeciliği Hizmeti (K)', 'AIH'),
('CTH_IMTIYAZ', 'Çeşitli Telekomünikasyon Hizmetleri (İmtiyaz Sözleşmesi)', 'CTH'),
('GMPCS_MT_B', 'GMPCS Mobil Telefon Hizmeti (B)', 'GMPCS'),
('GMPCS_MT_K', 'GMPCS Mobil Telefon Hizmeti (K)', 'GMPCS'),
('GSM_IMTIYAZ', 'GSM (İmtiyaz Sözleşmesi)', 'GSM'),
('HT_GSM1800_B', 'Hava Taşıtlarında GSM 1800 Mobil Telefon Hizmeti (B)', 'GSM'),
('IMT_SSKHYB', 'IMT (Sayısı Sınırlandırılmış Kullanım Hakkı Yetki Belgesi)', 'IMT'),
('IMT2000_UMTS_IMTIYAZ', 'IMT-2000/UMTS (İmtiyaz Sözleşmesi)', 'IMT'),
('ISS_B', 'İnternet Servis Sağlayıcılığı (B)', 'ISS'),
('KABLOYAYIN_B', 'Kablolu Yayın Hizmeti (B)', 'KABLOYAYIN'),
('OKTH_K', 'Ortak Kullanımlı Telsiz Hizmeti (K)', 'OKTH'),
('REHBERLIK_K', 'Rehberlik Hizmeti (K)', 'REHBERLIK'),
('STH_B', 'Sabit Telefon Hizmeti (B)', 'STH'),
('STH_K', 'Sabit Telefon Hizmeti (K)', 'STH'),
('SMSH_B', 'Sanal Mobil Şebeke Hizmeti (B)', 'SMSH'),
('SMSH_K', 'Sanal Mobil Şebeke Hizmeti (K)', 'SMSH'),
('UYDUHAB_B', 'Uydu Haberleşme Hizmeti (B)', 'UYDU'),
('UYDUKABLOTV', 'Uydu ve Kablo TV Hizmetleri', 'UYDUKABLOTV'),
('UYDUPLAT_B', 'Uydu Platform Hizmeti (B)', 'UYDUPLAT');

-- Seçili Yetki Türleri için ilk kayıtlar (başlangıçta hiçbiri aktif değil)
INSERT IGNORE INTO `mod_btk_secili_yetki_turleri` (`yetki_kodu`, `aktif`) SELECT `yetki_kodu`, 0 FROM `mod_btk_yetki_turleri_referans`;

-- Personel Departmanları
INSERT IGNORE INTO `mod_btk_personel_departmanlari` (`departman_adi`) VALUES
('Yönetim Kurulu'), ('Genel Müdürlük'), ('İnsan Kaynakları Departmanı'),
('Muhasebe ve Finans Departmanı'), ('Satış ve Pazarlama Departmanı'), ('Müşteri Hizmetleri Departmanı'),
('Bilgi Teknolojileri Departmanı'), ('Teknik Destek Departmanı'), ('Saha Operasyon Departmanı'),
('Hukuk Departmanı'), ('AR-GE Departmanı'), ('Kalite Yönetimi Departmanı'),
('Kurumsal İletişim Departmanı'), ('İdari İşler Departmanı');

-- Adres Verileri: TÜM İLLER (81 İl)
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

-- Zenginleştirilmiş İlçe ve Mahalle Verileri
-- Balıkesir iline ait TÜM İLÇELER (Balıkesir il_id = 10)
INSERT IGNORE INTO `mod_btk_adres_ilce` (`id`, `il_id`, `ilce_adi`) VALUES
(1131, 10, 'ALTIEYLÜL'), (1166, 10, 'AYVALIK'), (1171, 10, 'BALYA'), (1174, 10, 'BANDIRMA'), (1192, 10, 'BİGADİÇ'),
(1210, 10, 'BURHANİYE'), (1290, 10, 'DURSUNBEY'), (1299, 10, 'EDREMİT'), (1312, 10, 'ERDEK'), (1357, 10, 'GÖMEÇ'),
(1359, 10, 'GÖNEN'), (1381, 10, 'HAVRAN'), (1406, 10, 'İVRİNDİ'), (1805, 10, 'KARESİ'), (1462, 10, 'KEPSUT'),
(1512, 10, 'MANYAS'), (1515, 10, 'MARMARA'), (1612, 10, 'SAVAŞTEPE'), (1630, 10, 'SINDIRGI'), (1653, 10, 'SUSURLUK');

-- Ayvalık ilçesine ait TÜM MAHALLELER (Ayvalık ilce_id = 1166)
INSERT IGNORE INTO `mod_btk_adres_mahalle` (`ilce_id`, `mahalle_adi`, `posta_kodu`) VALUES
(1166, '150 EVLER MAHALLESİ', '10400'), (1166, 'ALİ ÇETİNKAYA MAHALLESİ', '10400'), (1166, 'ALİBEY ADASI MAHALLESİ', '10405'),
(1166, 'ALTINOVA MAHALLESİ', '10420'), (1166, 'ATATÜRK MAHALLESİ', '10400'), (1166, 'BAĞYÜZÜ KÖYÜ', '10400'),
(1166, 'BEŞİKTAŞ MAHALLESİ', '10400'), (1166, 'BULUTÇEŞME KÖYÜ', '10400'), (1166, 'CUMHURİYET MAHALLESİ', '10410'),
(1166, 'ÇAKMAK KÖYÜ', '10400'), (1166, 'ÇAMOBA KÖYÜ', '10400'), (1166, 'FEVZİPAŞA-VEHBİBEY MAHALLESİ', '10400'),
(1166, 'GAZİKEMALPAŞA MAHALLESİ', '10400'), (1166, 'HACIVELİLER KÖYÜ', '10400'), (1166, 'HAMDİBEY MAHALLESİ', '10400'),
(1166, 'HAYRETTİNPAŞA MAHALLESİ', '10400'), (1166, 'İSMETPAŞA MAHALLESİ', '10400'), (1166, 'KAZIMKARABEKİR MAHALLESİ', '10400'),
(1166, 'KEMALPAŞA MAHALLESİ', '10400'), (1166, 'KIRCA MAHALLESİ', '10400'), (1166, 'KÜÇÜKKÖY MAHALLESİ', '10410'),
(1166, 'MİTHATPAŞA MAHALLESİ', '10400'), (1166, 'MURTELİ KÖYÜ', '10400'), (1166, 'MUTLU KÖYÜ', '10400'),
(1166, 'NAMIK KEMAL MAHALLESİ', '10400'), (1166, 'ODABURNU KÖYÜ', '10400'), (1166, 'SAHİLKENT MAHALLESİ', '10420'),
(1166, 'SAKARYA MAHALLESİ', '10400'), (1166, 'SEFA-ÇAMLIK MAHALLESİ', '10400'), (1166, 'TURGUTREİS MAHALLESİ', '10400'),
(1166, 'ÜÇKABAAĞAÇ KÖYÜ', '10400'), (1166, 'YENİ MAHALLE', '10405'), (1166, 'YENİKÖY KÖYÜ', '10400'),
(1166, 'ZEYTİNLİK MAHALLESİ', '10400');

-- EK-1 HAT DURUM KODLARI
INSERT IGNORE INTO `mod_btk_hat_durum_kodlari_referans` (`kod`, `aciklama`) VALUES
('1', 'AKTIF'), ('2', 'IPTAL NUMARA DEGISIKLIGI'), ('3', 'IPTAL'), ('4', 'IPTAL SAHTE EVRAK'), ('5', 'IPTAL MUSTERI TALEBI'),
('6', 'IPTAL DEVIR'), ('7', 'IPTAL HAT BENIM DEGIL'), ('8', 'IPTAL KARA LISTE'), ('9', 'IPTAL KULLANIM DISI'), ('10', 'IPTAL EKSIK EVRAK'),
('11', 'IPTAL SEHVEN GIRIS'), ('12', 'IPTAL BAGLI URUN IPTALI'), ('13', 'KISITLI'), ('14', 'KISITLI ARAMAYA KAPALI'),
('15', 'DONDURULMUS MUSTERI TALEBI'), ('16', 'DONDURULMUS ISLETME');

-- EK-2 MÜŞTERİ HAREKET KODLARI
INSERT IGNORE INTO `mod_btk_musteri_hareket_kodlari_referans` (`kod`, `aciklama`) VALUES
('1', 'YENI_ABONELIK_KAYDI'), ('2', 'HAT_DURUM_DEGISIKLIGI'), ('3', 'SIM_KART_DEGISIKLIGI'),
('4', 'ODEME_TIPI_DEGISIKLIGI'), ('5', 'ADRES_DEGISIKLIGI'), ('6', 'IMSI_DEGISIKLIGI'),
('7', 'TARIFE_DEGISIKLIGI'), ('8', 'DEVIR_MUSTERI_DEGISIKLIGI'), ('9', 'NUMARA_DEGISIKLIGI'),
('10', 'HAT_IPTAL'), ('11', 'MUSTERI_BILGI_DEGISIKLIGI'), ('12', 'NUMARA_TASIMA'),
('13', 'NUMARA_DEGISMEDEN_NAKIL'), ('14', 'NUMARA_DEGISTIREREK_NAKIL'), ('15', 'IP_DEGISIKLIGI');

-- EK-3 HİZMET TİPLERİ
INSERT IGNORE INTO `mod_btk_ek3_hizmet_tipleri` (`hizmet_tipi_kodu`, `hizmet_tipi_aciklamasi`, `ana_yetki_grup`) VALUES
('ADSL', 'ADSL İnternet Erişimi', 'ISS'), ('XDSL', 'XDSL İnternet Erişimi', 'ISS'), ('FIBER', 'Fiber İnternet Erişimi', 'ISS'),
('HIPER', 'Hiper İnternet Erişimi', 'ISS'), ('FR', 'FR (Frame Relay) Veri İletimi', 'ISS'), ('ATM', 'ATM Veri İletimi', 'ISS'),
('METRO', 'Metro Ethernet İnternet Erişimi', 'ISS'), ('WIFI', 'WiFi İnternet Erişimi', 'ISS'), ('SSG_INTERNET', 'SSG İnternet Erişimi', 'ISS'),
('VERI_MERKEZI', 'Veri Merkezi Hizmeti (ISS kapsamında)', 'ISS'), ('UYDU_INTERNET', 'Uydu Üzerinden İnternet Erişimi', 'ISS'),
('KABLONET', 'Kablo İnternet Erişimi', 'ISS'), ('SAYISAL_COKLU_HAT', 'Sayısal Çoklu Hat (ISDN PRI/BRI)', 'STH'),
('SAYISAL_COKLU_SERVIS_444', 'Sayısal Çoklu Hat Servis 444', 'STH'), ('SAYISAL_COKLU_SERVIS_3RAKAM', 'Sayısal Çoklu Hat Servis 3 Rakam (1XY)', 'STH'),
('SAYISAL_COKLU_SERVIS_822', 'Sayısal Çoklu Hat Servis 822', 'STH'), ('SAYISAL_COKLU_SERVIS_800', 'Sayısal Çoklu Hat Servis 800', 'STH'),
('SANAL_SANTRAL', 'Sanal Santral Hizmeti', 'STH'), ('IP_COKLU_HAT', 'IP Çoklu Hat (SIP Trunk)', 'STH'),
('IP_COKLU_SERVIS_444', 'IP Çoklu Hat Servis 444', 'STH'), ('TELEKS', 'Teleks Hizmeti', 'STH'), ('SABIT_HAT', 'Sabit Telefon Hattı (POTS/PSTN)', 'STH'),
('SERVIS_444_STH', 'Servis 444 (STH)', 'STH'), ('ANKESOR', 'Ankesörlü Telefon Hizmeti', 'STH'), ('MULTIMEDYA_ANKESOR', 'Multimedya Ankesör Hizmeti', 'STH'),
('CENTREKS', 'Centreks Hizmeti', 'STH'), ('SERVIS_3RAKAM_STH', 'Servis 3 Rakam (1XY) (STH)', 'STH'), ('SAYISAL_IKILI_HAT', 'Sayısal İkili Hat (ISDN BRA)', 'STH'),
('SERVIS_800_STH', 'Servis 800 (STH)', 'STH'), ('TELEFON_STH', 'Telefon Hizmeti (Genel Sabit)', 'STH'), ('ISDN_PRI', 'ISDN PRI (STH)', 'STH'),
('WIMAX_STH', 'WIMAX (Sabit Telefon kapsamında)', 'STH'), ('GORUNTULU_TELEFON', 'Görüntülü Telefon (Sabit)', 'STH'), ('KIRALIKDEVRE_TELEFON', 'Kiralık Devre Telefon Hizmeti', 'STH'),
('KIRALIK_DEVRE_TELGRAF', 'Kiralık Devre Telgraf Hizmeti', 'STH'), ('ISDN_BULUT_AKADEMI', 'ISDN Bulut Akademi', 'STH'), ('KURUMSAL_GUVENLIK_STH', 'Kurumsal Güvenlik (Sabit Telefon kapsamında)', 'STH'),
('POSTPAID_GSM', 'Faturalı GSM Hizmeti', 'GSM'), ('PREPAID_GSM', 'Ön Ödemeli GSM Hizmeti', 'GSM'), ('HSCSD', 'HSCSD (Mobil Veri)', 'GSM'),
('GSMPOS', 'GSM POS Hizmeti', 'GSM'), ('PREPAID_INTERNET_MOBIL', 'Ön Ödemeli Mobil İnternet', 'GSM'), ('POSTPAID_INTERNET_MOBIL', 'Faturalı Mobil İnternet', 'GSM'),
('PREPAID_M2M', 'Ön Ödemeli M2M Hattı', 'GSM'), ('POSTPAID_M2M', 'Faturalı M2M Hattı', 'GSM'), ('HT_GSM1800', 'Hava Taşıtlarında GSM1800 Hizmeti', 'GSM'),
('UYDU_SES', 'Uydu Üzerinden Ses Hizmeti', 'UYDU'), ('UYDU_DATA', 'Uydu Üzerinden Data Hizmeti', 'UYDU'), ('TES_UYDU_IP_VE_TELEFON', 'TES-Uydu IP ve Telefon Hizmeti', 'UYDU'),
('P2P_METRO', 'Noktadan Noktaya Metro Ethernet (AIH)', 'AIH'), ('P2P_ATM', 'Noktadan Noktaya ATM (AIH)', 'AIH'), ('P2P_FR', 'Noktadan Noktaya Frame Relay (AIH)', 'AIH'),
('P2P_GHDSL', 'Noktadan Noktaya G.SHDSL (AIH)', 'AIH'), ('P2P_ADSL', 'Noktadan Noktaya ADSL (AIH)', 'AIH'), ('VPN_METRO', 'VPN Metro Ethernet (AIH)', 'AIH'),
('VPN_GHDSL', 'VPN G.SHDSL (AIH)', 'AIH'), ('VPN_ADSL', 'VPN ADSL (AIH)', 'AIH'), ('VPN_FR', 'VPN FR (AIH)', 'AIH'),
('KIRALIK_DEVRE_DATA', 'Kiralık Devre Data (AIH)', 'AIH'), ('KIRALIK_DEVRE_KISMI', 'Kiralık Devre Kısmi (AIH)', 'AIH'), ('VPN_MPLS', 'VPN MPLS (AIH)', 'AIH'),
('P2P_DWDM', 'Noktadan Noktaya DWDM (AIH)', 'AIH'), ('P2P_SDH', 'Noktadan Noktaya SDH (AIH)', 'AIH'), ('SMS_TOPLU_STH', 'SMS / Toplu SMS (PSTN/STH)', 'STH'),
('GMPCS_B', 'GMPCS Mobil Telefon Hizmeti (B) (Ana Yetki)', 'GMPCS'), ('GMPCS_K', 'GMPCS Mobil Telefon Hizmeti (K) (Ana Yetki)', 'GMPCS'),
('IMT_SAY_SIN_KUL_HAK', 'IMT (Sayısı Sınırlandırılmış Kullanım Hakkı Yetki Belgesi) (Ana Yetki)', 'IMT'), ('IMT2000_UMTS_IMT', 'IMT-2000/UMTS (İmtiyaz Sözleşmesi) (Ana Yetki)', 'IMT'),
('KABLOYAYIN_B_ANA', 'Kablolu Yayın Hizmeti (B) (Ana Yetki)', 'KABLOYAYIN'), ('OKTH_K_ANA', 'Ortak Kullanımlı Telsiz Hizmeti (K) (Ana Yetki)', 'OKTH'),
('REHBERLIK_K_ANA', 'Rehberlik Hizmeti (K) (Ana Yetki)', 'REHBERLIK'), ('SMSH_B_ANA', 'Sanal Mobil Şebeke Hizmeti (B) (Ana Yetki)', 'SMSH'),
('SMSH_K_ANA', 'Sanal Mobil Şebeke Hizmeti (K) (Ana Yetki)', 'SMSH'), ('UYDUHAB_B_ANA', 'Uydu Haberleşme Hizmeti (B) (Ana Yetki)', 'UYDU'),
('UYDUKABLOTV_ANA', 'Uydu ve Kablo TV Hizmetleri (Ana Yetki)', 'UYDUKABLOTV'), ('UYDUPLAT_B_ANA', 'Uydu Platform Hizmeti (B) (Ana Yetki)', 'UYDUPLAT'),
('CTH_IMTIYAZ_ANA', 'Çeşitli Telekomünikasyon Hizmetleri (İmtiyaz Sözleşmesi) (Ana Yetki)', 'CTH');

-- EK-4 KİMLİK TİPLERİ
INSERT IGNORE INTO `mod_btk_kimlik_tipleri_referans` (`kod`, `aciklama`, `ulke_kodu_gerekli`) VALUES
('TCKK', 'TC Çipli Kimlik Kartı', FALSE), ('TCNC', 'TC Nüfus Cüzdanı (Eski Tip)', FALSE), ('TCYK', 'TC Yabancı Kimlik Belgesi', FALSE),
('TCPC', 'TC Pasaportu: Yeni Tip Çipli e-Pasaport', FALSE), ('TCPL', 'TC Pasaportu: Eski Tip Lacivert', FALSE), ('TCPY', 'TC Pasaportu: Eski Tip Yeşil', FALSE),
('TCPG', 'TC Pasaportu: Eski Tip Gri', FALSE), ('TCPK', 'TC Pasaportu: Eski Tip Kırmızı', FALSE), ('TCGP', 'TC Pasaportu: Geçici Pasaport', FALSE),
('YP', 'Yabancı Pasaport', TRUE), ('AC', 'Uçuş mürettebatı belgesi (Yabancı Ülke)', TRUE), ('GC', 'Gemi adamı cüzdanı (Yabancı Ülke)', TRUE),
('NE', 'NATO Emri belgesi (Yabancı Ülke)', TRUE), ('SB', 'Seyahat Belgesi (Yabancı Ülke veya Uluslararası)', TRUE), ('HB', 'Hudut Geçiş Belgesi (Yabancı Ülke)', TRUE),
('GK', 'Gemi Komutanı Onaylı Personel Listesi (Yabancı Ülke Gemi)', TRUE), ('TCSC', 'TC Sürücü Belgesi (Yeni Tip)', FALSE), ('TCHS', 'TC Hakim/Savcı Mesleki Kimlik Kartı', FALSE),
('TCSV', 'TC Avukatlık Belgesi (Kimlik)', FALSE), ('TCGK', 'TC Geçici Kimlik Belgesi', FALSE), ('TCMA', 'TC Mavi Kart', FALSE),
('TCEV', 'TC Uluslararası aile cüzdanı', FALSE), ('TCNT', 'Noter Kimlik Kartı (TC)', FALSE), ('TBMM', 'TBMM Milletvekili Kimlik Kartı', FALSE),
('TSK', 'Türk Silahlı Kuvvetleri Kimlik Kartı', FALSE), ('KKTC', 'Kuzey Kıbrıs Türk Cumhuriyeti Kimlik Kartı', FALSE);

-- EK-5 MESLEK KODLARI
INSERT IGNORE INTO `mod_btk_meslek_kodlari_referans` (`kod`, `aciklama`) VALUES
('011', 'Subaylar'), ('021', 'Subay olmayan silahlı kuvvetlerin daimi mensupları'), ('031', 'Silahlı kuvvetlerde diğer rütbelerdeki meslekler'),
('111', 'Kanun yapıcılar ve üst düzey yöneticiler'), ('112', 'Genel müdürler ve başkanlar (özel sektör)'), ('121', 'İş hizmetleri ve idaresi ile ilgili müdürler'),
('122', 'Satış, pazarlama ve iş geliştirme ile ilgili müdürler'), ('131', 'Tarım, ormancılık ve balıkçılık ile ilgili üretim müdürleri'),
('132', 'İmalat, madencilik, inşaat ve dağıtım müdürleri'), ('133', 'Bilgi ve iletişim teknolojisi hizmet müdürleri'),
('134', 'Profesyonel hizmet müdürleri'), ('141', 'Otel, lokanta ve restoran müdürleri'), ('142', 'Perakende ve toptan ticaret müdürleri'),
('143', 'Diğer hizmet müdürleri'), ('211', 'Fizik ve yer bilimleri ile ilgili profesyonel meslek mensupları'), ('212', 'Matematikçiler, istatistikçiler ve aktüerler'),
('213', 'Yaşam bilimleri ile ilgili profesyonel meslek mensupları'), ('214', 'Mühendislik ile ilgili profesyonel meslek mensupları (elektroteknoloji mühendisleri hariç)'),
('215', 'Elektroteknoloji mühendisleri'), ('216', 'Mimarlar, planlamacılar, harita mühendisleri ve tasarımcılar'), ('221', 'Tıp doktorları'),
('222', 'Hemşirelik ve ebelik profesyonelleri'), ('223', 'Geleneksel ve tamamlayıcı tıp profesyonelleri'), ('224', 'Paramedikal uygulayıcılar'),
('225', 'Veterinerler'), ('226', 'Diğer sağlık profesyonelleri'), ('231', 'Üniversite ve yükseköğretim öğretim elemanları'),
('232', 'Mesleki eğitim öğretmenleri'), ('233', 'Ortaöğretim (ortaokul ve lise) öğretmenleri'), ('234', 'İlkokul ve okul öncesi öğretmenleri'),
('235', 'Eğitim ile ilgili diğer profesyonel meslek mensupları'), ('241', 'Finans ile ilgili profesyonel meslek mensupları'),
('242', 'Yönetim ile ilgili profesyonel meslek mensupları'), ('243', 'Satış, pazarlama ve halkla ilişkiler ile ilgili profesyonel meslek mensupları'),
('251', 'Yazılım ve uygulama geliştiricileri ve analistleri'), ('252', 'Veri tabanı ve bilgisayar ağları ile ilgili profesyonel meslek mensupları'),
('261', 'Hukuk ile ilgili profesyonel meslek mensupları'), ('262', 'Kütüphaneciler, arşivciler ve küratörler'), ('263', 'Sosyal ve din ile ilgili profesyonel meslek mensupları'),
('264', 'Yazarlar, gazeteciler ve dilbilimciler'), ('265', 'Yaratıcı sanatçılar ve sahne sanatçıları'), ('311', 'Fizik ve mühendislik bilimleri teknisyenleri'),
('312', 'Maden, imalat ve inşaat süpervizörleri'), ('313', 'İşlem kontrol teknisyenleri'), ('314', 'Yaşam bilimleri teknisyenleri ve ilgili yardımcı profesyonel meslek mensupları'),
('315', 'Gemi ve hava taşıtı kontrolörleri ve teknisyenleri'), ('321', 'Tıp teknisyenleri ve eczacılık teknisyenleri'),
('322', 'Hemşirelik ve ebelik yardımcı profesyonelleri'), ('323', 'Geleneksel ve tamamlayıcı tıp yardımcı profesyonelleri'),
('324', 'Veteriner teknisyenleri ve yardımcıları'), ('325', 'Diğer yardımcı sağlık profesyonelleri'), ('331', 'Finans ve matematiksel işler ile ilgili yardımcı profesyonel meslek mensupları'),
('332', 'Satış ve satın alma temsilcileri ve aracıları (brokerler)'), ('333', 'İş hizmetleri aracıları'), ('334', 'İdari ve belli bir alanda uzmanlaşmış sekreterler'),
('335', 'Düzenleyici devlet ile ilgili alanlardaki yardımcı profesyonel meslek mensupları'), ('341', 'Hukuk, sosyal ve din ile ilgili yardımcı profesyonel meslek mensupları'),
('342', 'Spor ve fitnes çalışanları'), ('343', 'Sanat, kültür ve mutfak ile ilgili yardımcı profesyonel meslek mensupları'), ('351', 'Bilgi ve iletişim teknolojileri işletim ve kullanıcı destek teknisyenleri'),
('352', 'Telekomünikasyon ve yayın teknisyenleri'), ('411', 'Genel büro elemanları'), ('412', 'Sekreterler (genel)'),
('413', 'Klavye kullanan operatörler'), ('421', 'Veznedarlar, tahsilatçılar ve benzer elemanlar'), ('422', 'Müşteri danışma elemanları'),
('431', 'Sayısal işlemler yapan büro elemanları'), ('432', 'Malzeme kayıtları ve taşımacılık ile ilgili büro elemanları'), ('441', 'Diğer büro hizmetlerinde çalışan elemanlar'),
('511', 'Seyahatlerde hizmet veren elemanlar, kondüktörler ve otobüs muavinleri ile rehberler'), ('512', 'Aşçılar'), ('513', 'Garsonlar ve barmenler'),
('514', 'Kuaförler, güzellik uzmanları ve ilgili çalışanlar'), ('515', 'Bina sorumluları ile temizlik ve bakım işleri sorumluları'),
('516', 'Diğer kişisel hizmetlerde çalışanlar'), ('521', 'Sokak, tezgah ve pazar satış elemanları'), ('522', 'Mağaza, dükkan vb. satış elemanları'), ('523', 'Kasiyerler ve bilet satıcıları'),
('524', 'Diğer satış elemanları'), ('531', 'Çocuk bakım hizmetleri veren elemanlar ve öğretmen yardımcıları'), ('532', 'Sağlık hizmetlerinde kişisel bakım çalışanları'),
('541', 'Koruma hizmetleri veren elemanlar'), ('611', 'Bahçıvanlar ve bitkisel ürün yetiştiricileri'), ('612', 'Hayvan yetiştiricileri'),
('613', 'Karma bitki ve hayvan yetiştiricileri'), ('621', 'Ormancılık ve ormancılık ile ilgili işlerde çalışanlar'), ('622', 'Su ürünleri çalışanları, avcılar ve tuzakçılar'),
('631', 'Kendi geçimine yönelik bitkisel ürün yetiştiricileri'), ('632', 'Kendi geçimine yönelik çiftlik hayvanları yetiştiricileri'), ('633', 'Kendi geçimine yönelik karma bitkisel ürün ve çiftlik hayvanları yetiştiricileri'),
('634', 'Kendi geçimine yönelik balıkçılar, avcılar, tuzakçılar ve toplayıcılar'), ('711', 'Kaba inşaat ve ilgili işlerde çalışan sanatkarlar'), ('712', 'İnşaatı tamamlayıcı işler ve ilgili işlerde çalışan sanatkarlar'),
('713', 'Badana, boya ve bina dış yüzey temizliği ve ilgili işlerde çalışan sanatkarlar'), ('721', 'Metal levha ve inşaat malzemesi, metal kalıpçılar ve kaynakçılar ve ilgili işlerde çalışanlar'),
('722', 'Demirciler, alet yapımcıları ve ilgili işlerde çalışanlar'), ('723', 'Makine bakım ve onarım işlerinde çalışanlar'), ('731', 'El sanatları çalışanları'),
('732', 'Basım ile ilgili işlerde çalışanlar'), ('741', 'Elektrikli ekipman kurulumcuları ve tamircileri'), ('742', 'Elektronik ve telekomünikasyon kurulumcuları ve tamircileri'),
('751', 'Gıda işleme ve ilgili işlerde çalışanlar'), ('752', 'Ağaç işleyiciler, ahşap mobilya imalatçıları ve ilgili işlerde çalışanlar'),
('753', 'Tekstil ve giyim eşyası ile ilgili işlerde çalışanlar'), ('754', 'Diğer sanatkarlar ve ilgili işlerde çalışanlar'),
('811', 'Madencilik ve mineral işleme tesisi operatörleri'), ('812', 'Metal işleme ve perdahlama tesisi operatörleri'),
('813', 'Kimyasal ve fotoğrafik ürünler tesis ve makine operatörleri'), ('814', 'Kauçuk, plastik ve kağıt ürünleri makine operatörleri'),
('815', 'Tekstil, kürk ve deri ürünleri makine operatörleri'), ('816', 'Gıda ve ilgili ürünlerin makine operatörleri'), ('817', 'Ağaç işleme ve kağıt imalat tesisi operatörleri'),
('818', 'Diğer sabit tesis ve makine operatörleri'), ('821', 'Montajcılar'), ('831', 'Lokomotif motoru sürücüleri ve ilgili çalışanlar'),
('832', 'Otomobil, kamyonet ve motosiklet sürücüleri'), ('833', 'Ağır yük kamyonu ve otobüs sürücüleri'), ('834', 'Hareketli makine ve teçhizat operatörleri'),
('835', 'Gemi güverte tayfaları ve ilgili çalışanlar'), ('911', 'Ev, otel ve bürolarda çalışan temizlikçiler ve ev işleri yardımcıları'),
('912', 'Taşıt ve pencere temizleme ile çamaşır yıkama ve diğer elle yapılan temizlik işlerinde çalışanlar'), ('921', 'Tarım, ormancılık ve balıkçılık sektörlerinde nitelik gerektirmeyen işlerde çalışanlar'),
('931', 'Madencilik ve inşaat sektörlerinde nitelik gerektirmeyen işlerde çalışanlar'), ('932', 'İmalat sektöründe nitelik gerektirmeyen işlerde çalışanlar'),
('933', 'Ulaştırma ve depolama sektörlerinde nitelik gerektirmeyen işlerde çalışanlar'), ('941', 'Yiyecek hazırlama yardımcıları'),
('951', 'Cadde ve sokaklarda hizmet işlerinde çalışanlar'), ('952', 'Sokak satıcıları (gıda hariç)'), ('961', 'Çöpçüler ve atık toplayıcılar'),
('962', 'Diğer nitelik gerektirmeyen işlerde çalışanlar');