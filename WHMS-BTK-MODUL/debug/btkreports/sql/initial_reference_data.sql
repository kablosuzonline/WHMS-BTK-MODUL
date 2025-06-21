-- WHMCS BTK Raporlama Modülü Başlangıç Referans Verileri
-- Bu script, modülün çalışması için gerekli olan bazı sabit referans verilerini yükler.

--
-- `mod_btk_settings` tablosuna varsayılan ayarlar
--
INSERT IGNORE INTO `mod_btk_settings` (`setting`, `value`) VALUES
('operator_code', ''),
('operator_name', ''),
('operator_title', ''),
('ftp_host_main', ''),
('ftp_user_main', ''),
('ftp_pass_main', ''),
('ftp_rehber_path_main', '/REHBER/'),
('ftp_hareket_path_main', '/HAREKET/'),
('ftp_personel_path_main', '/PERSONEL/'),
('ftp_use_backup', '0'),
('ftp_host_backup', ''),
('ftp_user_backup', ''),
('ftp_pass_backup', ''),
('ftp_rehber_path_backup', '/REHBER/'),
('ftp_hareket_path_backup', '/HAREKET/'),
('ftp_personel_path_backup', '/PERSONEL/'),
('send_empty_reports', '0'),
('delete_data_on_deactivate', '0'),
('cron_rehber_schedule', '0 10 1 * *'),
('cron_hareket_schedule', '0 1 * * *'),
('cron_personel_schedule', '0 16 L 6,12 *'),
('personel_filename_add_yearmonth_main', '0'),
('personel_filename_add_yearmonth_backup', '0'),
('hareket_live_table_day_limit', '7'), -- Canlı hareket tablosunda 7 günlük veri tutulacak
('hareket_archive_table_day_limit', '180'); -- Arşiv hareket tablosunda 180 günlük veri tutulacak

--
-- `mod_btk_yetki_turleri` tablosuna BTK Yetkilendirme Türleri
--
INSERT IGNORE INTO `mod_btk_yetki_turleri` (`yetki_kodu`, `yetki_adi`, `aktif`, `is_bildirim`, `rapor_tipi_eki`) VALUES
('AIH_B', 'Altyapı İşletmeciliği Hizmeti (B)', 0, 1, 'AIH'),
('AIH_K', 'Altyapı İşletmeciliği Hizmeti (K)', 0, 0, 'AIH'),
('GMPCS_MT_B', 'GMPCS Mobil Telefon Hizmeti (B)', 0, 1, 'GMPCS'),
('GMPCS_MT_K', 'GMPCS Mobil Telefon Hizmeti (K)', 0, 0, 'GMPCS'),
('GSM_IMTIYAZ', 'GSM (İmtiyaz Sözleşmesi)', 0, NULL, 'GSM'),
('HT_GSM1800_B', 'Hava Taşıtlarında GSM 1800 Mobil Telefon Hizmeti (B)', 0, 1, 'HTGSM'),
('IMT_SSKHYB', 'IMT (Sayısı Sınırlandırılmış Kullanım Hakkı Yetki Belgesi)', 0, NULL, 'IMT'),
('IMT2000_UMTS_IMTIYAZ', 'IMT-2000/UMTS (İmtiyaz Sözleşmesi)', 0, NULL, 'IMT'),
('KABLOYAYIN_B', 'Kablolu Yayın Hizmeti (B)', 0, 1, 'KBLYN'),
('OKTH_K', 'Ortak Kullanımlı Telsiz Hizmeti (K)', 0, 0, 'OKTH'),
('REHBERLIK_K', 'Rehberlik Hizmeti (K)', 0, 0, 'RHBR'),
('STH_B', 'Sabit Telefon Hizmeti (B)', 0, 1, 'STH'),
('STH_K', 'Sabit Telefon Hizmeti (K)', 0, 0, 'STH'),
('SMSH_B', 'Sanal Mobil Şebeke Hizmeti (B)', 0, 1, 'SMSH'),
('SMSH_K', 'Sanal Mobil Şebeke Hizmeti (K)', 0, 0, 'SMSH'),
('UYDUHAB_B', 'Uydu Haberleşme Hizmeti (B)', 0, 1, 'UYDU'),
('UYDUPLAT_B', 'Uydu Platform Hizmeti (B)', 0, 1, 'UYDUPLT'),
('UYDUKABLOTV', 'Uydu ve Kablo TV Hizmetleri', 0, NULL, 'UYDUKBL'),
('CTH_IMTIYAZ', 'Çeşitli Telekomünikasyon Hizmetleri (İmtiyaz Sözleşmesi)', 0, NULL, 'CTH'),
('ISS_B', 'İnternet Servis Sağlayıcılığı (B)', 0, 1, 'ISS');

-- --- BÖLÜM 1 / 7 SONU - (initial_reference_data.sql, Genel Ayarlar ve Yetki Türleri)

--
-- `mod_btk_ref_hat_durum_kodlari` tablosuna EK-1 Hat Durum Kodları
--
INSERT IGNORE INTO `mod_btk_ref_hat_durum_kodlari` (`kod`, `aciklama`) VALUES
('1', 'AKTIF'),
('2', 'IPTAL_NUMARA_DEGISIKLIGI'),
('3', 'IPTAL'),
('4', 'IPTAL_SAHTE_EVRAK'),
('5', 'IPTAL_MUSTERI_TALEBI'),
('6', 'IPTAL_DEVIR'),
('7', 'IPTAL_HAT_BENIM_DEGIL'),
('8', 'IPTAL_KARA_LISTE'),
('9', 'IPTAL_KULLANIM_DISI'),
('10', 'IPTAL_EKSIK_EVRAK'),
('11', 'IPTAL_SEHVEN_GIRIS'),
('12', 'IPTAL_BAGLI_URUN_IPTALI'),
('13', 'KISITLI_KONTUR_BITTI'),
('14', 'KISITLI_ARAMAYA_KAPALI'),
('15', 'DONDURULMUS_MUSTERI_TALEBI'),
('16', 'DONDURULMUS_ISLETME');

--
-- `mod_btk_ref_musteri_hareket_kodlari` tablosuna EK-2 Müşteri Hareket Kodları
--
INSERT IGNORE INTO `mod_btk_ref_musteri_hareket_kodlari` (`kod`, `aciklama`) VALUES
('1', 'YENI_ABONELIK_KAYDI'),
('2', 'HAT_DURUM_DEGISIKLIGI'),
('3', 'SIM_KART_DEGISIKLIGI'),
('4', 'ODEME_TIPI_DEGISIKLIGI'),
('5', 'ADRES_DEGISIKLIGI'),
('6', 'IMSI_DEGISIKLIGI'),
('7', 'TARIFE_DEGISIKLIGI'),
('8', 'DEVIR_MUSTERI_DEGISIKLIGI'),
('9', 'NUMARA_DEGISIKLIGI'),
('10', 'HAT_IPTAL'),
('11', 'MUSTERI_BILGI_DEGISIKLIGI'),
('12', 'NUMARA_TASIMA'),
('13', 'NUMARA_DEGISMEDEN_NAKIL'),
('14', 'NUMARA_DEGISTIREREK_NAKIL'),
('15', 'IP_DEGISIKLIGI');
-- --- BÖLÜM 2 / 7 SONU - (initial_reference_data.sql, EK-1 Hat Durum Kodları ve EK-2 Müşteri Hareket Kodları)

--
-- `mod_btk_ref_hizmet_tipleri` tablosuna EK-3 Hizmet Tipleri (Sadeleştirilmiş Liste)
-- BTK Dokümanındaki HIZMET_TURU alanı `hizmet_kodu`, DEGER_ACIKLAMA alanı `hizmet_adi` olarak alınmıştır.
-- Farklı işletme tipleri ve altyapı türleri için aynı hizmet_kodu olabilir, bu durum normaldir.
--
INSERT IGNORE INTO `mod_btk_ref_hizmet_tipleri` (`hizmet_kodu`, `hizmet_adi`, `isletme_tipi_ornek`) VALUES
('POSTPAID_GSM', 'MOBİL Hizmeti', 'MOBİL'),
('PREPAID_GSM', 'MOBİL Hizmeti', 'MOBİL'),
('HSCSD', 'MOBİL Hizmeti', 'MOBİL'),
('GSMPOS', 'MOBİL Hizmeti', 'MOBİL'),
('PREPAID_INTERNET', 'MOBİL Hizmeti', 'MOBİL'),
('POSTPAID_INTERNET', 'MOBİL Hizmeti', 'MOBİL'),
('PREPAID_M2M', 'MOBİL Hizmeti', 'MOBİL'),
('POSTPAID_M2M', 'MOBİL Hizmeti', 'MOBİL'),
('ADSL', 'IP Hizmeti', 'ISS'),
('XDSL', 'IP Hizmeti', 'ISS'),
('FIBER', 'IP Hizmeti', 'ISS'),
('HIPER', 'IP Hizmeti', 'ISS'),
('FR', 'IP Hizmeti', 'ISS'),
('ATM', 'IP Hizmeti', 'ISS'),
('METRO', 'IP Hizmeti', 'ISS'),
('WIFI', 'IP Hizmeti', 'ISS'),
('SSG_INTERNET', 'IP Hizmeti', 'ISS'),
('VERI_MERKEZI', 'IP Hizmeti', 'ISS'),
('UYDU_INTERNET', 'IP Hizmeti', 'UHH/GMPCS/ISS'),
('UYDU_SES', 'Ses Hizmeti', 'UHH/GMPCS/ISS'),
('UYDU_DATA', 'Data Hizmeti', 'UHH/GMPCS/ISS'),
('KABLONET', 'IP Hizmeti', 'ISS'),
('SAYISAL_COKLU_HAT', 'Telefon Hizmeti', 'PSTN'),
('SAYISAL_COKLU_SERVIS_444', 'Telefon Hizmeti', 'PSTN'),
('SAYISAL_COKLU_SERVIS_3RAKAM', 'Telefon Hizmeti', 'PSTN'),
('SAYISAL_COKLU_SERVIS_822', 'Telefon Hizmeti', 'PSTN'),
('SAYISAL_COKLU_SERVIS_800', 'Telefon Hizmeti', 'PSTN'),
('SANAL_SANTRAL', 'Telefon Hizmeti', 'PSTN'),
('IP_COKLU_HAT', 'Telefon Hizmeti', 'PSTN'),
('IP_COKLU_SERVIS_444', 'Telefon Hizmeti', 'PSTN'),
('TELEKS', 'Teleks Hizmeti', 'PSTN'),
('SABIT_HAT', 'Telefon Hizmeti', 'PSTN'),
('SERVIS_444', 'Telefon Hizmeti', 'PSTN'),
('ANKESOR', 'Telefon Hizmeti', 'PSTN/STH'),
('MULTIMEDYA_ANKESOR', 'Telefon Hizmeti', 'PSTN/STH'),
('CENTREKS', 'IP Santral', 'PSTN/STH'),
('SERVIS_3RAKAM', 'Telefon Hizmeti', 'PSTN/STH'),
('SAYISAL_IKILI_HAT', 'Telefon Hizmeti', 'PSTN/STH'),
('SERVIS_800', 'Telefon Hizmeti', 'PSTN/STH'),
('TELEFON', 'Telefon Hizmeti', 'PSTN/STH'),
('ISDN_PRI', 'Telefon Hizmeti', 'PSTN/STH'),
('WIMAX', 'Telefon Hizmeti', 'PSTN/STH'),
('GORUNTULU_TELEFON', 'Telefon Hizmeti', 'PSTN/STH'),
('KIRALIKDEVRE_TELEFON', 'Telefon Hizmeti', 'PSTN/STH'),
('KIRALIK_DEVRE_TELGRAF', 'Data Hizmeti', 'PSTN/STH'),
('ISDN_BULUT_AKADEMI', 'Data Hizmeti', 'PSTN/STH'),
('KURUMSAL_GUVENLIK', 'IP Hizmeti', 'PSTN/STH'),
('TES_UYDU_IP_VE_TELEFON', 'IP ve Telefon Hiz.', 'UHH/GMPCS/PSTN'),
('P2P_METRO', 'IP Hizmeti', 'AİH/ISS'),
('P2P_ATM', 'IP Hizmeti', 'AİH/ISS'),
('P2P_FR', 'IP Hizmeti', 'AİH/ISS'),
('P2P_GHDSL', 'IP Hizmeti', 'AİH/ISS'),
('P2P_ADSL', 'IP Hizmeti', 'AİH/ISS'),
('VPN_METRO', 'IP Hizmeti', 'AİH/ISS'),
('VPN_GHDSL', 'IP Hizmeti', 'AİH/ISS'),
('VPN_ADSL', 'IP Hizmeti', 'AİH/ISS'),
('VPN_FR', 'IP Hizmeti', 'AİH/ISS'),
('KIRALIK_DEVRE_DATA', 'Data Hizmeti', 'AİH'),
('KIRALIK_DEVRE_KISMI', 'IP Hizmeti', 'AİH'),
('SMS', 'SMS Hizmeti', 'PSTN/STH'),
('VPN_MPLS', 'Data Hizmeti', 'AİH'),
('P2P_DWDM', 'IP Transit', 'AİH'),
('P2P_SDH', 'IP Transit', 'AİH');
-- --- BÖLÜM 3 / 7 SONU - (initial_reference_data.sql, EK-3 Hizmet Tipleri)

--
-- `mod_btk_ref_kimlik_tipleri` tablosuna EK-4 Kimlik Tipleri
-- Belge Adı, Ait Olduğu Ülke Kodu, Belge Tip Kodu
--
INSERT IGNORE INTO `mod_btk_ref_kimlik_tipleri` (`belge_tip_kodu`, `belge_adi`, `ulke_kodu_ornek`) VALUES
('TCKK', 'TC Çipli Kimlik Kartı', 'TUR'),
('TCNC', 'TC Nüfus Cüzdanı', 'TUR'),
('TCYK', 'TC Yabancı Kimlik Belgesi', 'TUR'),
('TCPC', 'TC Pasaportu: Yeni Tip Çipli e-Pasaport (Tüm Tipler)', 'TUR'),
('TCPL', 'TC Pasaportu: Eski Tip Lacivert (Umuma Mahsus)', 'TUR'),
('TCPY', 'TC Pasaportu: Eski Tip Yeşil (Hususi)', 'TUR'),
('TCPG', 'TC Pasaportu: Eski Tip Gri (Hizmet)', 'TUR'),
('TCPK', 'TC Pasaportu: Eski Tip Kırmızı (Diplomatik)', 'TUR'),
('TCGP', 'TC Pasaportu: Geçici Pasaport', 'TUR'),
('YP', 'Yabancı Pasaport', NULL), -- Ülke kodu değişkendir
('AC', 'Uçuş mürettebatı belgesi', NULL),
('GC', 'Gemi adamı cüzdanı', NULL),
('NE', 'NATO Emri belgesi', NULL),
('SB', 'Seyahat Belgesi', NULL),
('HB', 'Hudut Geçiş Belgesi', NULL),
('GK', 'Gemi Komutanı Onaylı Personel Listesi', NULL),
('TCSC', 'TC Sürücü Belgesi', 'TUR'),
('TCHS', 'TC Hakim/Savcı Mesleki Kimlik Kartı', 'TUR'),
('TCSV', 'TC Avukatlık Belgesi', 'TUR'),
('TCGK', 'TC Geçici Kimlik Belgesi', 'TUR'),
('TCMA', 'TC Mavi Kart', 'TUR'),
('TCEV', 'TC Uluslararası aile cüzdanı', 'TUR'),
('TCNT', 'Noter Kimlik Kartı', 'TUR'),
('TBMM', 'TBMM Milletvekili Kimlik Kartı', 'TUR'),
('TSK', 'Türk Silahlı Kuvvetleri Kimlik Kartı', 'TUR'),
('KKTC', 'Kuzey Kıbrıs Türk Cumhuriyeti Kimlik Kartı', 'KKT');
-- --- BÖLÜM 4 / 7 SONU - (initial_reference_data.sql, EK-4 Kimlik Tipleri)

--
-- `mod_btk_ref_meslek_kodlari` tablosuna EK-5 Meslek Kodları (İlk 30 örnek)
-- Tam liste oldukça uzundur, bu sadece bir başlangıç setidir.
--
INSERT IGNORE INTO `mod_btk_ref_meslek_kodlari` (`kod`, `meslek_adi`) VALUES
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
('234', 'İlkokul ve okul öncesi öğretmenleri');
-- EK-5 Meslek kodlarının tamamı BTK dokümanından buraya eklenmelidir.
-- Uzunluğu nedeniyle sadece bir kısmı örnek olarak verilmiştir.
-- --- BÖLÜM 5 / 7 SONU - (initial_reference_data.sql, EK-5 Meslek Kodları - Bir Kısmı)

--
-- `mod_btk_adres_il` tablosuna Türkiye İlleri (Plaka kodu `id` ve `il_kodu` olarak kullanıldı)
--
INSERT IGNORE INTO `mod_btk_adres_il` (`id`, `il_kodu`, `il_adi`) VALUES
(1, '01', 'ADANA'), (2, '02', 'ADIYAMAN'), (3, '03', 'AFYONKARAHİSAR'), (4, '04', 'AĞRI'), (5, '05', 'AMASYA'),
(6, '06', 'ANKARA'), (7, '07', 'ANTALYA'), (8, '08', 'ARTVİN'), (9, '09', 'AYDIN'), (10, '10', 'BALIKESİR'),
(11, '11', 'BİLECİK'), (12, '12', 'BİNGÖL'), (13, '13', 'BİTLİS'), (14, '14', 'BOLU'), (15, '15', 'BURDUR'),
(16, '16', 'BURSA'), (17, '17', 'ÇANAKKALE'), (18, '18', 'ÇANKIRI'), (19, '19', 'ÇORUM'), (20, '20', 'DENİZLİ'),
(21, '21', 'DİYARBAKIR'), (22, '22', 'EDİRNE'), (23, '23', 'ELAZIĞ'), (24, '24', 'ERZİNCAN'), (25, '25', 'ERZURUM'),
(26, '26', 'ESKİŞEHİR'), (27, '27', 'GAZİANTEP'), (28, '28', 'GİRESUN'), (29, '29', 'GÜMÜŞHANE'), (30, '30', 'HAKKARİ'),
(31, '31', 'HATAY'), (32, '32', 'ISPARTA'), (33, '33', 'MERSİN'), (34, '34', 'İSTANBUL'), (35, '35', 'İZMİR'),
(36, '36', 'KARS'), (37, '37', 'KASTAMONU'), (38, '38', 'KAYSERİ'), (39, '39', 'KIRKLARELİ'), (40, '40', 'KIRŞEHİR'),
(41, '41', 'KOCAELİ'), (42, '42', 'KONYA'), (43, '43', 'KÜTAHYA'), (44, '44', 'MALATYA'), (45, '45', 'MANİSA'),
(46, '46', 'KAHRAMANMARAŞ'), (47, '47', 'MARDİN'), (48, '48', 'MUĞLA'), (49, '49', 'MUŞ'), (50, '50', 'NEVŞEHİR'),
(51, '51', 'NİĞDE'), (52, '52', 'ORDU'), (53, '53', 'RİZE'), (54, '54', 'SAKARYA'), (55, '55', 'SAMSUN'),
(56, '56', 'SİİRT'), (57, '57', 'SİNOP'), (58, '58', 'SİVAS'), (59, '59', 'TEKİRDAĞ'), (60, '60', 'TOKAT'),
(61, '61', 'TRABZON'), (62, '62', 'TUNCELİ'), (63, '63', 'ŞANLIURFA'), (64, '64', 'UŞAK'), (65, '65', 'VAN'),
(66, '66', 'YOZGAT'), (67, '67', 'ZONGULDAK'), (68, '68', 'AKSARAY'), (69, '69', 'BAYBURT'), (70, '70', 'KARAMAN'),
(71, '71', 'KIRIKKALE'), (72, '72', 'BATMAN'), (73, '73', 'ŞIRNAK'), (74, '74', 'BARTIN'), (75, '75', 'ARDAHAN'),
(76, '76', 'IĞDIR'), (77, '77', 'YALOVA'), (78, '78', 'KARABÜK'), (79, '79', 'KİLİS'), (80, '80', 'OSMANİYE'),
(81, '81', 'DÜZCE');
-- --- BÖLÜM 6 / 7 SONU - (initial_reference_data.sql, Türkiye İlleri)

--
-- `mod_btk_adres_ilce` tablosuna Balıkesir İline Ait İlçeler (`il_id` = 10)
--
INSERT IGNORE INTO `mod_btk_adres_ilce` (`il_id`, `ilce_adi`) VALUES
(10, 'ALTIEYLÜL'), (10, 'AYVALIK'), (10, 'BALYA'), (10, 'BANDIRMA'), (10, 'BİGADİÇ'),
(10, 'BURHANİYE'), (10, 'DURSUNBEY'), (10, 'EDREMİT'), (10, 'ERDEK'), (10, 'GÖMEÇ'),
(10, 'GÖNEN'), (10, 'HAVRAN'), (10, 'İVRİNDİ'), (10, 'KARESİ'), (10, 'KEPSUT'),
(10, 'MANYAS'), (10, 'MARMARA'), (10, 'SAVAŞTEPE'), (10, 'SINDIRGI'), (10, 'SUSURLUK');

--
-- `mod_btk_adres_mahalle` tablosuna Ayvalık İlçesine Ait Mahalleler
-- Ayvalık ilçesinin `id`'sinin `mod_btk_adres_ilce` tablosunda 2 olduğunu varsayarak (veya SELECT ile bulunarak).
-- Bu örnekte Ayvalık'ın ID'sinin (Balıkesir ilçeleri içinde 2. sırada eklendiği için) 21 olacağını varsayıyoruz (10 il + 11. ilçe Karesi'den sonra... Bu ID ataması dinamik olmalı).
-- Daha güvenli bir yol, ilçe eklerken dönen ID'yi kullanmaktır. Şimdilik statik bir ID (örneğin 21) kullanalım.
-- Gerçek ID'yi `SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK';` ile alıp kullanmak gerekir.
--
INSERT IGNORE INTO `mod_btk_adres_mahalle` (`ilce_id`, `mahalle_adi`) VALUES
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), '150 EVLER MAHALLESİ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'ALİ ÇETİNKAYA MAHALLESİ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'ALTINOVA MAHALLESİ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'ATATÜRK MAHALLESİ'), -- (Küçükköy)
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'BAĞYÜZÜ KÖYÜ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'BEŞİKTEPE KÖYÜ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'BULUTÇEŞME KÖYÜ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'ÇAKMAK KÖYÜ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'ÇAMOBA KÖYÜ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'FEVZİPAŞA-VEHBİBEY MAHALLESİ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'GAZİKEMALPAŞA MAHALLESİ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'HAMDİBEY MAHALLESİ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'İSMETPAŞA MAHALLESİ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'KAZIM KARABEKİR MAHALLESİ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'KEMALPAŞA MAHALLESİ'), -- (Cunda)
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'KÜÇÜKKÖY MAHALLESİ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'MİTHATPAŞA MAHALLESİ'), -- (Cunda)
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'MURATELİ KÖYÜ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'MUTLU KÖYÜ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'NAMIK KEMAL MAHALLESİ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'ODABURNU KÖYÜ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'SAHİL KENT MAHALLESİ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'SAKARYA MAHALLESİ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'SARIMSAKLI KÖYÜ'), -- (Küçükköy) - Artık mahalle olabilir.
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'TURGUTREİS KÖYÜ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'ÜÇKABAAĞAÇ KÖYÜ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'YENİKÖY KÖYÜ'),
((SELECT id FROM mod_btk_adres_ilce WHERE il_id = 10 AND ilce_adi = 'AYVALIK'), 'ZİYA BEY MAHALLESİ');

-- NOT: `mod_btk_adres_sokak`, `mod_btk_adres_bina`, `mod_btk_adres_daire` tabloları için
-- başlangıç verisi bu dosyaya eklenmemiştir. Bu veriler çok büyük olacağı için
-- modül içinden yönetilecek ayrı bir veri yükleme/güncelleme mekanizması (örn: API veya CSV import)
-- daha uygun olacaktır. Şimdilik bu tablolar boş başlayacaktır.