-- // --- BÖLÜM 1 / 4 BAŞI - (initial_reference_data.sql - Tam Sürüm - Bölüm 1/4)
-- WHMCS BTK Raporları Modülü için Kapsamlı Başlangıç ve Referans Verileri
-- Bu script, modül ilk aktive edildiğinde veya gerektiğinde çalıştırılabilir.
-- 'INSERT IGNORE INTO' kullanılmıştır, böylece mevcut kayıtlar varsa hata vermez.

-- Varsayılan Modül Ayarları (mod_btk_ayarlar)
INSERT IGNORE INTO `mod_btk_ayarlar` (`ayar_adi`, `ayar_degeri`) VALUES
('operator_kodu', '701'),
('operator_adi', 'IZMARBILISIM'),
('operator_unvani', 'İZMAR BİLİŞİM HİZMETLERİ SANAYİ TİCARET LİMİTED ŞİRKETİ'),
('ftp_ana_host', 'ftp.ornekalanadi.com.tr'),
('ftp_ana_port', '21'),
('ftp_ana_kullanici', 'ftp_kullanici_adi'),
('ftp_ana_sifre', ''), -- Modül arayüzünden girilip şifrelenecek
('ftp_ana_rehber_klasor', '/ABONE_REHBER/'),
('ftp_ana_hareket_klasor', '/ABONE_HAREKET/'),
('ftp_ana_personel_klasor', '/PERSONEL_LISTESI/'),
('ftp_ana_pasif_mod', '1'), -- 1: Evet, 0: Hayır
('yedek_ftp_kullan', '0'), -- 1: Evet, 0: Hayır
('ftp_yedek_host', ''),
('ftp_yedek_port', '21'),
('ftp_yedek_kullanici', ''),
('ftp_yedek_sifre', ''), -- Modül arayüzünden girilip şifrelenecek
('ftp_yedek_rehber_klasor', '/BACKUP/ABONE_REHBER/'),
('ftp_yedek_hareket_klasor', '/BACKUP/ABONE_HAREKET/'),
('ftp_yedek_personel_klasor', '/BACKUP/PERSONEL_LISTESI/'),
('ftp_yedek_pasif_mod', '1'), -- 1: Evet, 0: Hayır
('cron_rehber_zamanlama', '0 10 1 * *'), -- Her ayın 1. günü saat 10:00
('cron_hareket_zamanlama', '0 1 * * *'), -- Her gün saat 01:00
('cron_personel_zamanlama_haziran', '0 16 L 6 *'), -- Haziran ayının son günü saat 16:00
('cron_personel_zamanlama_aralik', '0 16 L 12 *'), -- Aralık ayının son günü saat 16:00
('hareket_canli_saklama_suresi_gun', '7'),
('hareket_arsiv_saklama_suresi_gun', '180'),
('personel_excel_ad_format_ana', '0'), -- 0: Sabit Ad (Personel_Listesi.xlsx), 1: Yıl-Dönem Ekle (Personel_Listesi_YYYY-D.xlsx)
('personel_excel_ad_format_yedek', '1'), -- 0: Sabit Ad, 1: Yıl-Dönem Ekle
('veritabani_sil_deactivate', '0'), -- 1: Modül deaktive edildiğinde tabloları sil, 0: Silme
('debug_mode', '0'), -- 1: Debug modu aktif, 0: Pasif
('son_rehber_gonderim_tarihi', NULL),
('son_hareket_gonderim_tarihi', NULL),
('son_personel_gonderim_tarihi', NULL),
('nvi_tckn_dogrulama_aktif', '1'), -- 1: Aktif, 0: Pasif
('nvi_ykn_dogrulama_aktif', '1'), -- 1: Aktif, 0: Pasif
('adres_kodu_dogrulama_aktif', '0'), -- 1: Aktif, 0: Pasif (NVİ KPS erişimi gerektirir)
('log_tutma_suresi_gun', '90'),
('pop_noktasi_filtre_kriteri', 'MAHALLE'); -- IL, ILCE, MAHALLE (varsayılan)

-- BTK Yetkilendirme Türleri (mod_btk_yetki_turleri) - Tam liste BTK dokümanından
INSERT IGNORE INTO `mod_btk_yetki_turleri` (`yetki_kodu`, `yetki_aciklama`, `secili_mi`) VALUES
('AIH_B', 'Altyapı İşletmeciliği Hizmeti (B)', 0),
('AIH_K', 'Altyapı İşletmeciliği Hizmeti (K)', 0),
('GMPCS_B', 'GMPCS Mobil Telefon Hizmeti (B)', 0),
('GMPCS_K', 'GMPCS Mobil Telefon Hizmeti (K)', 0),
('GSM_IS', 'GSM (İmtiyaz Sözleşmesi)', 0),
('HTGSM1800_B', 'Hava Taşıtlarında GSM 1800 Mobil Telefon Hizmeti (B)', 0),
('IMT_SSKHYB', 'IMT (Sayısı Sınırlandırılmış Kullanım Hakkı Yetki Belgesi)', 0),
('IMT2000_IS', 'IMT-2000/UMTS (İmtiyaz Sözleşmesi)', 0),
('KABLOYAYIN_B', 'Kablolu Yayın Hizmeti (B)', 0),
('OKTH_K', 'Ortak Kullanimli Telsiz Hizmeti (K)', 0),
('REHBER_K', 'Rehberlik Hizmeti (K)', 0),
('STH_B', 'Sabit Telefon Hizmeti (B)', 0),
('STH_K', 'Sabit Telefon Hizmeti (K)', 0),
('SMSH_B', 'Sanal Mobil Şebeke Hizmeti (B)', 0),
('SMSH_K', 'Sanal Mobil Şebeke Hizmeti (K)', 0),
('UHH_B', 'Uydu Haberleşme Hizmeti (B)', 0),
('UPH_B', 'Uydu Platform Hizmeti (B)', 0),
('UKTH', 'Uydu ve Kablo TV Hizmetleri', 0),
('CTH_IS', 'Çeşitli Telekomünikasyon Hizmetleri (İmtiyaz Sözleşmesi)', 0),
('ISS_B', 'İnternet Servis Sağlayıcılığı (B)', 1);

-- Türkiye İl Listesi (mod_btk_adres_il) - Tam Liste
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

-- Örnek İlçe ve Mahalle Verileri (Balıkesir İli için)
-- Balıkesir il_id'si 10'dur.
INSERT IGNORE INTO `mod_btk_adres_ilce` (`il_id`, `ilce_adi`) VALUES
(10, 'ALTIEYLÜL'), (10, 'AYVALIK'), (10, 'BALYA'), (10, 'BANDIRMA'), (10, 'BİGADİÇ'),
(10, 'BURHANİYE'), (10, 'DURSUNBEY'), (10, 'EDREMİT'), (10, 'ERDEK'), (10, 'GÖMEÇ'),
(10, 'GÖNEN'), (10, 'HAVRAN'), (10, 'İVRİNDİ'), (10, 'KARESİ'), (10, 'KEPSUT'),
(10, 'MANYAS'), (10, 'MARMARA'), (10, 'SAVAŞTEPE'), (10, 'SINDIRGI'), (10, 'SUSURLUK');

-- Balıkesir İli, Ayvalık İlçesine Bağlı Örnek Mahalleler (mod_btk_adres_mahalle)
-- Ayvalık ilçe ID'sini dinamik olarak alır.
INSERT IGNORE INTO `mod_btk_adres_mahalle` (`ilce_id`, `mahalle_adi`, `posta_kodu`) VALUES
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), '150 EVLER MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'AKÇAPINAR MAHALLESİ', '10425'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'ALİBEY (ALİBEY ADASI) MAHALLESİ', '10405'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'ALTINOVA MAHALLESİ', '10420'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'ATATÜRK MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'BAĞYÜZÜ MAHALLESİ', '10425'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'BEŞTEPELER MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'BULUTÇEŞME MAHALLESİ', '10425'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'ÇAKMAK MAHALLESİ', '10425'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'ÇAMOBA MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'FATİH MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'FEVZİPAŞA-VEHBİBEY MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'GAZİKEMALPAŞA MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'HACIYUSUF MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'HAYRETTİNPAŞA MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'İSMETPAŞA MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'KARAAYIT MAHALLESİ', '10425'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'KAZIM KARABEKİR MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'KEMALPAŞA MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'KIRCA MAHALLESİ', '10425'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'KÜÇÜKKÖY MAHALLESİ', '10410'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'MİTHATPAŞA MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'MURATELİ MAHALLESİ', '10425'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'MUTLU MAHALLESİ', '10425'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'NAMIK KEMAL MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'ODABURNU MAHALLESİ', '10425'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'SAHİL KENT MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'SAKARYA MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'TURGUTREİS MAHALLESİ', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'TÜRKÖZÜ MAHALLESİ', '10425'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'ÜÇKABAAĞAÇ MAHALLESİ', '10425'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'YENİKÖY MAHALLESİ', '10425'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'YENİ MAHALLE', '10400'),
((SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = 10 LIMIT 1), 'ZEKİBEY MAHALLESİ', '10400');
-- // --- BÖLÜM 1 / 4 SONU - (initial_reference_data.sql - Tam Sürüm - Bölüm 1/4)
-- // --- BÖLÜM 2 / 4 BAŞI - (initial_reference_data.sql - Tam Sürüm - Bölüm 2/4)
-- Personel Departmanları (mod_btk_personel_departmanlari) - personel-departman-gorevleri.xlsx'e göre
INSERT IGNORE INTO `mod_btk_personel_departmanlari` (`departman_adi`) VALUES
('Yönetim Kurulu'),
('Genel Müdürlük'),
('Hukuk Müşavirliği'),
('Mali İşler ve Finans Direktörlüğü'),
('İnsan Kaynakları Direktörlüğü'),
('Kurumsal İletişim Direktörlüğü'),
('Satış ve Pazarlama Direktörlüğü'),
('Müşteri Hizmetleri Direktörlüğü'),
('Teknik Operasyonlar Direktörlüğü'),
('Bilgi Teknolojileri Direktörlüğü'),
('Network Operasyon Merkezi (NOC)'),
('Saha Operasyonları'),
('Çağrı Merkezi'),
('Bayi Yönetimi'),
('Muhasebe Departmanı'),
('Teknik Destek Departmanı'),
('Yazılım Geliştirme Departmanı'),
('Sistem Yönetimi Departmanı');

-- BTK Referans Verileri

-- Hat Durum Kodları (EK-1) - mod_btk_ref_hat_durum_kodlari
INSERT IGNORE INTO `mod_btk_ref_hat_durum_kodlari` (`kod`, `aciklama`) VALUES
('1','AKTIF'),
('2','IPTAL_BORÇ'),
('3','IPTAL_NAKIL'),
('4','IPTAL_SAHTE_EVRAK'),
('5','IPTAL_ABONE_ISTEGI'),
('6','IPTAL_DEVIR'),
('7','IPTAL_VEFAT'),
('8','IPTAL_ŞİRKET_KAPAMA'),
('9','IPTAL_ABONE_SÖZLEŞMESİNE_AYKIRILIK'),
('10','IPTAL_KAYIP_ÇALINTI_VB'),
('11','IPTAL_DİĞER'),
('12','KISITLI_ABONE_ISTEGI'),
('13','KISITLI_BORÇ'),
('14','KISITLI_KAYIP_ÇALINTI_VB'),
('15','KISITLI_DİĞER'),
('16','DONDURULMUŞ_ABONE_İSTEĞİ'),
('17','DONDURULMUŞ_BORÇ'),
('18','DONDURULMUŞ_DİĞER'),
('19','IPTAL_NUMARA_TAŞIMA');

-- Müşteri Hareket Kodları (EK-2) - mod_btk_ref_musteri_hareket_kodlari
INSERT IGNORE INTO `mod_btk_ref_musteri_hareket_kodlari` (`kod`, `aciklama`) VALUES
('1','YENI ABONELIK KAYDI'),
('2','ABONE IPTAL KAYDI'),
('3','ABONE BILGI GUNCELLEME'),
('4','ABONE NAKIL KAYDI'),
('5','ABONE DEVIR KAYDI'),
('6','NUMARA DEGISIKLIGI KAYDI'),
('7','SIMKART DEGISIKLIGI KAYDI'),
('8','TARIFE DEGISIKLIGI KAYDI'),
('9','STATU DEGISIKLIGI KAYDI (FATURALIDAN ÖN ÖDEMELİYE GEÇİŞ VEYA TERSİ)'),
('10','HAT DURUM DEGISIKLIGI'),
('11','FAALİYETE BAŞLAMA'),
('12','FAALİYETİN SONLANDIRILMASI'),
('13','NUMARA TAŞIMA (GELEN)'),
('14','NUMARA TAŞIMA (GİDEN)');

-- Hizmet Tipleri (EK-3) - mod_btk_ref_hizmet_tipleri
INSERT IGNORE INTO `mod_btk_ref_hizmet_tipleri` (`kod`, `aciklama`) VALUES
('PSTN','PSTN'),
('GSM','GSM'),
('IMT2000/UMTS','IMT2000/UMTS'),
('GMPCS','GMPCS'),
('OZEL TRUNK','OZEL TRUNK'),
('SAYISAL TRUNK','SAYISAL TRUNK'),
('INTERNET DIALUP','INTERNET DIALUP'),
('XDSL','XDSL'),
('FTTX','FTTX'),
('KABLOMODEM','KABLOMODEM'),
('MOBIL INTERNET','MOBIL INTERNET'),
('UYDU INTERNET','UYDU INTERNET'),
('WIFI','WIFI'),
('KIRALIK DEVRE','KIRALIK DEVRE'),
('KAPALI DEVRE','KAPALI DEVRE'),
('DIGER','DIGER');

-- Müşteri Tipleri (EK-4) - mod_btk_ref_musteri_tipleri
INSERT IGNORE INTO `mod_btk_ref_musteri_tipleri` (`kod`, `aciklama`) VALUES
('B','BIREYSEL'),
('G','ŞİRKET'),
('K','KAMU KURUM VE KURULUŞLARI'),
('D','DİĞER (DERNEK, VAKIF VB.)');

-- Kimlik Tipleri (EK-5) - mod_btk_ref_kimlik_tipleri
INSERT IGNORE INTO `mod_btk_ref_kimlik_tipleri` (`kod`, `aciklama`) VALUES
('B','ESKİ TİP NÜFUS CÜZDANI'),
('Y','YENİ TİP KİMLİK KARTI'),
('P','PASAPORT'),
('S','SÜRÜCÜ BELGESİ (YENİ TİP)'),
('G','GEÇİCİ KİMLİK BELGESİ'),
('D','DİĞER');

-- Kimlik Aidiyeti (EK-5 altında belirtilmiş) - mod_btk_ref_kimlik_aidiyeti
INSERT IGNORE INTO `mod_btk_ref_kimlik_aidiyeti` (`kod`, `aciklama`) VALUES
('K','KENDİSİ'),
('A','ANNESİ'),
('B','BABASI'),
('E','EŞİ'),
('V','VELİSİ/VASİSİ'),
('T','TÜZEL KİŞİ YETKİLİSİ/VEKİLİ'),
('D','DİĞER');

-- Cinsiyet Kodları (BTK Deseninde Geçiyor) - mod_btk_ref_cinsiyet
INSERT IGNORE INTO `mod_btk_ref_cinsiyet` (`kod`, `aciklama`) VALUES
('E','ERKEK'),
('K','KADIN'),
('D','DİĞER/BELİRTİLMEMİŞ');

-- Hat Durum (Genel) (BTK Deseninde Geçiyor) - mod_btk_ref_hat_durum
INSERT IGNORE INTO `mod_btk_ref_hat_durum` (`kod`, `aciklama`) VALUES
('A','AKTİF'),
('I','İPTAL'),
('D','DONDURULMUŞ'),
('K','KISITLI');

-- Meslek Kodları (EK-6) - mod_btk_ref_meslek_kodlari
INSERT IGNORE INTO `mod_btk_ref_meslek_kodlari` (`kod`, `aciklama`) VALUES
('0100', 'Bilinmiyor/Diğer'),
('0110', 'Silahlı Kuvvetler Mensupları (Subay, Astsubay)'),
('0111', 'Subay'),
('0112', 'Astsubay'),
('0210', 'Emniyet Mensupları (Polis)'),
('0310', 'Mülki İdare Amirleri'),
('0320', 'Adli ve İdari Yargı Hakim ve Savcıları'),
('0330', 'Noterler'),
('0340', 'Akademisyenler'),
('0350', 'Öğretmenler'),
('0360', 'Din Görevlileri'),
('0370', 'Kamu Kurum ve Kuruluşları Başkan, Genel Müdür ve Üst Düzey Yöneticileri'),
('0380', 'Kamu Kurum ve Kuruluşları Yöneticileri (Müdür, Şef vb.)'),
('0390', 'Kamu Kurum ve Kuruluşları Memurları'),
('0410', 'Milletvekilleri, Belediye Başkanları, Siyasi Parti Yöneticileri'),
('0420', 'Büyükelçi, Konsolos ve Diplomatlar'),
('0510', 'Doktorlar'),
('0520', 'Diş Hekimleri'),
('0530', 'Eczacılar'),
('0540', 'Veteriner Hekimler'),
('0550', 'Hemşire, Ebe ve Diğer Sağlık Personeli'),
('0610', 'Avukatlar'),
('0620', 'Mimar ve Mühendisler'),
('0621', 'Mimar'),
('0622', 'İnşaat Mühendisi'),
('0623', 'Makine Mühendisi'),
('0624', 'Elektrik-Elektronik Mühendisi'),
('0625', 'Bilgisayar Mühendisi'),
('0626', 'Endüstri Mühendisi'),
('0627', 'Kimya Mühendisi'),
('0628', 'Harita Mühendisi'),
('0629', 'Diğer Mühendisler'),
('0630', 'Şehir ve Bölge Plancıları'),
('0640', 'Teknikerler ve Teknisyenler'),
('0650', 'Mali Müşavirler ve Muhasebeciler'),
('0660', 'Bankacılar ve Finans Uzmanları'),
('0670', 'Sigortacılar'),
('0680', 'İnsan Kaynakları Uzmanları'),
('0690', 'Halkla İlişkiler ve Tanıtım Uzmanları'),
('0710', 'Basın Mensupları (Gazeteci, Yazar, TV Programcısı vb.)'),
('0720', 'Sanatçılar (Müzisyen, Ressam, Heykeltıraş, Oyuncu vb.)'),
('0730', 'Sporcular ve Antrenörler'),
('0740', 'Tercümanlar ve Dil Bilimciler'),
('0750', 'Psikolog, Sosyolog ve Sosyal Hizmet Uzmanları'),
('0760', 'Kütüphaneci, Arşivci ve Müzeciler'),
('0810', 'Özel Sektör Üst Düzey Yöneticileri (CEO, Genel Müdür vb.)'),
('0820', 'Özel Sektör Yöneticileri (Müdür, Şef vb.)'),
('0830', 'Özel Sektör Uzman ve Çalışanları'),
('0840', 'Esnaf ve Sanatkarlar (Kendi İşinin Sahibi)'),
('0841', 'Bakkal, Market Sahibi/İşletmecisi'),
('0842', 'Manav Sahibi/İşletmecisi'),
('0843', 'Kasap Sahibi/İşletmecisi'),
('0844', 'Fırıncı, Pastacı Sahibi/İşletmecisi'),
('0845', 'Lokanta, Kafe Sahibi/İşletmecisi'),
('0846', 'Berber, Kuaför Sahibi/İşletmecisi'),
('0847', 'Terzi, Konfeksiyoncu Sahibi/İşletmecisi'),
('0848', 'Ayakkabıcı, Tamirci Sahibi/İşletmecisi'),
('0849', 'Taksici, Minibüsçü, Servisçi Sahibi/İşletmecisi'),
('0850', 'Diğer Esnaf ve Sanatkarlar'),
('0910', 'Çiftçiler ve Tarım İşçileri'),
('0920', 'Hayvancılıkla Uğraşanlar'),
('0930', 'Ormancılık ve Balıkçılıkla Uğraşanlar'),
('1010', 'Madencilik ve Taş Ocakçılığı İşçileri'),
('1020', 'İmalat Sanayi İşçileri'),
('1030', 'İnşaat İşçileri ve Ustaları'),
('1040', 'Ulaştırma Sektörü Çalışanları (Şoför, Makinist, Pilot, Denizci vb.)'),
('1041', 'Pilot, Uçuş Mühendisi'),
('1042', 'Gemi Kaptanı, Denizci'),
('1043', 'Makinist (Tren)'),
('1044', 'Ağır Vasıta Şoförü (Kamyon, Tır)'),
('1045', 'Hafif Vasıta Şoförü (Otomobil, Minibüs)'),
('1050', 'Turizm Sektörü Çalışanları (Otel Personeli, Tur Rehberi vb.)'),
('1060', 'Ticaret ve Satış Elemanları'),
('1070', 'Büro ve Sekreterlik Hizmetleri Çalışanları'),
('1080', 'Temizlik Hizmetleri Çalışanları'),
('1090', 'Güvenlik Görevlileri'),
('1100', 'Ev Hizmetleri Çalışanları'),
('1110', 'Serbest Meslek Sahipleri (Danışman, Tasarımcı vb. - Yukarıda Sınıflandırılmayanlar)'),
('1120', 'Sanatkarlar (El Sanatları vb. - Yukarıda Sınıflandırılmayanlar)'),
('1200', 'Öğrenciler'),
('1300', 'Emekliler'),
('1400', 'Ev Hanımları'),
('1500', 'İşsizler/Çalışmayanlar'),
('1600', 'Çocuklar (Henüz Meslek Sahibi Olmayanlar)');
-- // --- BÖLÜM 2 / 4 SONU - (initial_reference_data.sql - Tam Sürüm - Bölüm 2/4)
-- // --- BÖLÜM 3 / 4 BAŞI - (initial_reference_data.sql - Tam Sürüm - Bölüm 3/4)
-- Uyruk Kodları (ISO 3166-1 Alpha-3 ve ICAO 9303 standardına uygun) - mod_btk_ref_ulkeler
-- Bu liste yaygın olanları ve BTK'nın özellikle belirttiği (TUR, SYR, vb.) ve diğerlerini içerir.
INSERT IGNORE INTO `mod_btk_ref_ulkeler` (`iso_kodu`, `ulke_adi_tr`, `ulke_adi_en`) VALUES
('TUR', 'Türkiye', 'Turkey'),
('AFG', 'Afganistan', 'Afghanistan'),
('ALB', 'Arnavutluk', 'Albania'),
('DZA', 'Cezayir', 'Algeria'),
('AND', 'Andora', 'Andorra'),
('AGO', 'Angola', 'Angola'),
('ATG', 'Antigua ve Barbuda', 'Antigua and Barbuda'),
('ARG', 'Arjantin', 'Argentina'),
('ARM', 'Ermenistan', 'Armenia'),
('AUS', 'Avustralya', 'Australia'),
('AUT', 'Avusturya', 'Austria'),
('AZE', 'Azerbaycan', 'Azerbaijan'),
('BHS', 'Bahamalar', 'Bahamas'),
('BHR', 'Bahreyn', 'Bahrain'),
('BGD', 'Bangladeş', 'Bangladesh'),
('BRB', 'Barbados', 'Barbados'),
('BLR', 'Beyaz Rusya (Belarus)', 'Belarus'),
('BEL', 'Belçika', 'Belgium'),
('BLZ', 'Belize', 'Belize'),
('BEN', 'Benin', 'Benin'),
('BTN', 'Bhutan', 'Bhutan'),
('BOL', 'Bolivya', 'Bolivia (Plurinational State of)'),
('BIH', 'Bosna Hersek', 'Bosnia and Herzegovina'),
('BWA', 'Botsvana', 'Botswana'),
('BRA', 'Brezilya', 'Brazil'),
('BRN', 'Brunei', 'Brunei Darussalam'),
('BGR', 'Bulgaristan', 'Bulgaria'),
('BFA', 'Burkina Faso', 'Burkina Faso'),
('BDI', 'Burundi', 'Burundi'),
('CPV', 'Cabo Verde', 'Cabo Verde'),
('KHM', 'Kamboçya', 'Cambodia'),
('CMR', 'Kamerun', 'Cameroon'),
('CAN', 'Kanada', 'Canada'),
('CAF', 'Orta Afrika Cumhuriyeti', 'Central African Republic'),
('TCD', 'Çad', 'Chad'),
('CHL', 'Şili', 'Chile'),
('CHN', 'Çin', 'China'),
('COL', 'Kolombiya', 'Colombia'),
('COM', 'Komorlar', 'Comoros'),
('COG', 'Kongo', 'Congo'),
('COD', 'Kongo Demokratik Cumhuriyeti', 'Congo, Democratic Republic of the'),
('CRI', 'Kosta Rika', 'Costa Rica'),
('CIV', 'Fildişi Sahili', 'Côte d\'Ivoire'),
('HRV', 'Hırvatistan', 'Croatia'),
('CUB', 'Küba', 'Cuba'),
('CYP', 'Kıbrıs (Güney)', 'Cyprus'),
('CZE', 'Çek Cumhuriyeti (Çekya)', 'Czechia'),
('DNK', 'Danimarka', 'Denmark'),
('DJI', 'Cibuti', 'Djibouti'),
('DMA', 'Dominika', 'Dominica'),
('DOM', 'Dominik Cumhuriyeti', 'Dominican Republic'),
('ECU', 'Ekvador', 'Ecuador'),
('EGY', 'Mısır', 'Egypt'),
('SLV', 'El Salvador', 'El Salvador'),
('GNQ', 'Ekvator Ginesi', 'Equatorial Guinea'),
('ERI', 'Eritre', 'Eritrea'),
('EST', 'Estonya', 'Estonia'),
('SWZ', 'Esvatini (Svaziland)', 'Eswatini'),
('ETH', 'Etiyopya', 'Ethiopia'),
('FJI', 'Fiji', 'Fiji'),
('FIN', 'Finlandiya', 'Finland'),
('FRA', 'Fransa', 'France'),
('GAB', 'Gabon', 'Gabon'),
('GMB', 'Gambiya', 'Gambia'),
('GEO', 'Gürcistan', 'Georgia'),
('DEU', 'Almanya', 'Germany'),
('GHA', 'Gana', 'Ghana'),
('GRC', 'Yunanistan', 'Greece'),
('GRD', 'Grenada', 'Grenada'),
('GTM', 'Guatemala', 'Guatemala'),
('GIN', 'Gine', 'Guinea'),
('GNB', 'Gine-Bissau', 'Guinea-Bissau'),
('GUY', 'Guyana', 'Guyana'),
('HTI', 'Haiti', 'Haiti'),
('VAT', 'Vatikan (Kutsal Makam)', 'Holy See'),
('HND', 'Honduras', 'Honduras'),
('HUN', 'Macaristan', 'Hungary'),
('ISL', 'İzlanda', 'Iceland'),
('IND', 'Hindistan', 'India'),
('IDN', 'Endonezya', 'Indonesia'),
('IRN', 'İran', 'Iran (Islamic Republic of)'),
('IRQ', 'Irak', 'Iraq'),
('IRL', 'İrlanda', 'Ireland'),
('ISR', 'İsrail', 'Israel'),
('ITA', 'İtalya', 'Italy'),
('JAM', 'Jamaika', 'Jamaica'),
('JPN', 'Japonya', 'Japan'),
('JOR', 'Ürdün', 'Jordan'),
('KAZ', 'Kazakistan', 'Kazakhstan'),
('KEN', 'Kenya', 'Kenya'),
('KIR', 'Kiribati', 'Kiribati'),
('PRK', 'Kuzey Kore (Kore Demokratik Halk Cumhuriyeti)', 'Korea (Democratic People\'s Republic of)'),
('KOR', 'Güney Kore (Kore Cumhuriyeti)', 'Korea, Republic of'),
('KWT', 'Kuveyt', 'Kuwait'),
('KGZ', 'Kırgızistan', 'Kyrgyzstan'),
('LAO', 'Laos (Lao Demokratik Halk Cumhuriyeti)', 'Lao People\'s Democratic Republic'),
('LVA', 'Letonya', 'Latvia'),
('LBN', 'Lübnan', 'Lebanon'),
('LSO', 'Lesotho', 'Lesotho'),
('LBR', 'Liberya', 'Liberia'),
('LBY', 'Libya', 'Libya'),
('LIE', 'Lihtenştayn', 'Liechtenstein'),
('LTU', 'Litvanya', 'Lithuania'),
('LUX', 'Lüksemburg', 'Luxembourg'),
('MDG', 'Madagaskar', 'Madagascar'),
('MWI', 'Malavi', 'Malawi'),
('MYS', 'Malezya', 'Malaysia'),
('MDV', 'Maldivler', 'Maldives'),
('MLI', 'Mali', 'Mali'),
('MLT', 'Malta', 'Malta'),
('MHL', 'Marshall Adaları', 'Marshall Islands'),
('MRT', 'Moritanya', 'Mauritania'),
('MUS', 'Morityus', 'Mauritius'),
('MEX', 'Meksika', 'Mexico'),
('FSM', 'Mikronezya (Mikronezya Federal Devletleri)', 'Micronesia (Federated States of)'),
('MDA', 'Moldova', 'Moldova, Republic of'),
('MCO', 'Monako', 'Monaco'),
('MNG', 'Moğolistan', 'Mongolia'),
('MNE', 'Karadağ', 'Montenegro'),
('MAR', 'Fas', 'Morocco'),
('MOZ', 'Mozambik', 'Mozambique'),
('MMR', 'Myanmar (Burma)', 'Myanmar'),
('NAM', 'Namibya', 'Namibia'),
('NRU', 'Nauru', 'Nauru'),
('NPL', 'Nepal', 'Nepal'),
('NLD', 'Hollanda', 'Netherlands'),
('NZL', 'Yeni Zelanda', 'New Zealand'),
('NIC', 'Nikaragua', 'Nicaragua'),
('NER', 'Nijer', 'Niger'),
('NGA', 'Nijerya', 'Nigeria'),
('MKD', 'Kuzey Makedonya', 'North Macedonia'),
('NOR', 'Norveç', 'Norway'),
('OMN', 'Umman', 'Oman'),
('PAK', 'Pakistan', 'Pakistan'),
('PLW', 'Palau', 'Palau'),
('PSE', 'Filistin Devleti', 'Palestine, State of'),
('PAN', 'Panama', 'Panama'),
('PNG', 'Papua Yeni Gine', 'Papua New Guinea'),
('PRY', 'Paraguay', 'Paraguay'),
('PER', 'Peru', 'Peru'),
('PHL', 'Filipinler', 'Philippines'),
('POL', 'Polonya', 'Poland'),
('PRT', 'Portekiz', 'Portugal'),
('QAT', 'Katar', 'Qatar'),
('ROU', 'Romanya', 'Romania'),
('RUS', 'Rusya Federasyonu', 'Russian Federation'),
('RWA', 'Ruanda', 'Rwanda'),
('KNA', 'Saint Kitts ve Nevis', 'Saint Kitts and Nevis'),
('LCA', 'Saint Lucia', 'Saint Lucia'),
('VCT', 'Saint Vincent ve Grenadinler', 'Saint Vincent and the Grenadines'),
('WSM', 'Samoa', 'Samoa'),
('SMR', 'San Marino', 'San Marino'),
('STP', 'Sao Tome ve Principe', 'Sao Tome and Principe'),
('SAU', 'Suudi Arabistan', 'Saudi Arabia'),
('SEN', 'Senegal', 'Senegal'),
('SRB', 'Sırbistan', 'Serbia'),
('SYC', 'Seyşeller', 'Seychelles'),
('SLE', 'Sierra Leone', 'Sierra Leone'),
('SGP', 'Singapur', 'Singapore'),
('SVK', 'Slovakya', 'Slovakia'),
('SVN', 'Slovenya', 'Slovenia'),
('SLB', 'Solomon Adaları', 'Solomon Islands'),
('SOM', 'Somali', 'Somalia'),
('ZAF', 'Güney Afrika', 'South Africa'),
('SSD', 'Güney Sudan', 'South Sudan'),
('ESP', 'İspanya', 'Spain'),
('LKA', 'Sri Lanka', 'Sri Lanka'),
('SDN', 'Sudan', 'Sudan'),
('SUR', 'Surinam', 'Suriname'),
('SWE', 'İsveç', 'Sweden'),
('CHE', 'İsviçre', 'Switzerland'),
('SYR', 'Suriye (Suriye Arap Cumhuriyeti)', 'Syrian Arab Republic'),
('TJK', 'Tacikistan', 'Tajikistan'),
('TZA', 'Tanzanya (Tanzanya Birleşik Cumhuriyeti)', 'Tanzania, United Republic of'),
('THA', 'Tayland', 'Thailand'),
('TLS', 'Doğu Timor (Timor-Leste)', 'Timor-Leste'),
('TGO', 'Togo', 'Togo'),
('TON', 'Tonga', 'Tonga'),
('TTO', 'Trinidad ve Tobago', 'Trinidad and Tobago'),
('TUN', 'Tunus', 'Tunisia'),
('TKM', 'Türkmenistan', 'Turkmenistan'),
('TUV', 'Tuvalu', 'Tuvalu'),
('UGA', 'Uganda', 'Uganda'),
('UKR', 'Ukrayna', 'Ukraine'),
('ARE', 'Birleşik Arap Emirlikleri', 'United Arab Emirates'),
('GBR', 'Birleşik Krallık (İngiltere)', 'United Kingdom of Great Britain and Northern Ireland'),
('USA', 'Amerika Birleşik Devletleri', 'United States of America'),
('URY', 'Uruguay', 'Uruguay'),
('UZB', 'Özbekistan', 'Uzbekistan'),
('VUT', 'Vanuatu', 'Vanuatu'),
('VEN', 'Venezuela', 'Venezuela (Bolivarian Republic of)'),
('VNM', 'Vietnam', 'Viet Nam'),
('YEM', 'Yemen', 'Yemen'),
('ZMB', 'Zambiya', 'Zambia'),
('ZWE', 'Zimbabve', 'Zimbabwe'),
('D', 'Vatansız (Stateless)', 'Stateless'), -- ICAO dokümanında "XXA–XXC Stateless persons" olarak geçer.
('XXX', 'Belirtilmemiş/Bilinmiyor', 'Unspecified/Unknown'); -- ICAO dokümanında "XXX Unspecified" olarak geçer.
-- // --- BÖLÜM 3 / 4 SONU - (initial_reference_data.sql - Tam Sürüm - Bölüm 3/4)
-- // --- BÖLÜM 4 / 4 BAŞI - (initial_reference_data.sql - Tam Sürüm - Bölüm 4/4)
-- GENEL NOTLAR:
-- 1. Bu `initial_reference_data.sql` dosyası, modülün ilk kurulumunda çalışacak temel verileri ve
--    BTK teknik dokümanlarında belirtilen standart kod tablolarının içeriklerini sağlamayı amaçlar.
-- 2. Adres verileri (il, ilçe, mahalle) örneklendirilmiştir. Tam ve güncel adres veritabanı için
--    resmi kaynaklardan (TÜİK, NVI vb.) veri alınması ve modülün bir güncelleme mekanizmasıyla
--    bu verileri periyodik olarak tazelemesi ideal bir çözüm olacaktır. Bu script sadece bir başlangıç seti sunar.
--    İlçe ve mahalle eklemelerinde `(SELECT id FROM mod_btk_adres_il WHERE il_adi = '...' LIMIT 1)` ve
--    `(SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = '...' AND il_id = (SELECT id FROM mod_btk_adres_il WHERE il_adi = '...') LIMIT 1)`
--    gibi yapılar, `id`'lerin farklı ortamlarda değişebileceği göz önüne alınarak, isim eşleşmesiyle doğru
--    `il_id` ve `ilce_id` değerlerini bulmak için kullanılmıştır.
-- 3. `INSERT IGNORE INTO` kullanıldığı için, bu script birden fazla kez çalıştırılsa bile mevcut veriler
--    üzerine yazılmayacak veya hata üretmeyecektir (PRIMARY KEY veya UNIQUE KEY ihlali durumunda).
-- 4. `mod_btk_ayarlar` tablosundaki FTP şifreleri gibi hassas veriler için başlangıçta boş değerler atanmıştır.
--    Bu şifreler modülün Config arayüzünden girildiğinde şifrelenerek veritabanına kaydedilecektir.
-- 5. Personel (`mod_btk_personel`) tablosuna `tbladmins` tablosundan ilk aktarım, `btkreports.php`
--    içindeki `_activate()` fonksiyonu tarafından yapılacaktır. Bu scriptte örnek personel kaydı eklenmemiştir.
-- 6. Abone (`mod_btk_abone_rehber`) ve Hareket (`mod_btk_abone_hareket_canli`) tablolarına da bu script
--    üzerinden toplu test verisi eklenmemiştir. Bu veriler, modülün ilgili veri giriş arayüzleri
--    (client profile/services enjeksiyonları) ve hook mekanizmaları aracılığıyla sisteme dahil edilmelidir.
--    Bu, modülün gerçek dünya senaryolarına göre doğru veri işlemesini test etmek için daha sağlıklıdır.

-- // SCRIPT SONU // --
-- // --- BÖLÜM 4 / 4 SONU - (initial_reference_data.sql - Tam Sürüm - Bölüm 4/4)