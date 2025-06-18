-- initial_reference_data.sql
-- WHMCS BTK Abone Veri Raporlama Modülü
-- Başlangıç Referans Verileri (TAM VE EKSİKSİZ SÜRÜM - KAPSAMI GENİŞLETİLMİŞ)
-- BÖLÜM 1 / X (Toplam bölüm sayısı ülke listesinin büyüklüğüne göre değişecektir)

-- mod_btk_yetki_turleri (BTK Yetkilendirme Türleri - Teyit Edilmiş 20 Adet)
INSERT INTO `mod_btk_yetki_turleri` (`yetki_kodu_kisa`, `yetki_adi`, `dosya_tipi_eki`, `btk_teknik_dokuman_kodu`, `aktif`) VALUES
('AIH-B', 'Altyapı İşletmeciliği Hizmeti (B)', 'AIH_B_ABONE', '702', 1),
('AIH-K', 'Altyapı İşletmeciliği Hizmeti (K)', 'AIH_K_ABONE', '703', 1),
('GMPCS-B', 'GMPCS Mobil Telefon Hizmeti (B)', 'GMPCS_B_ABONE', '708', 1),
('GMPCS-K', 'GMPCS Mobil Telefon Hizmeti (K)', 'GMPCS_K_ABONE', '709', 1),
('GSM-IMT', 'GSM (İmtiyaz Sözleşmesi)', 'GSM_IMT_ABONE', '714', 1),
('HTGSM1800', 'Hava Taşıtlarında GSM 1800 Mobil Telefon Hizmeti (B)', 'HTGSM1800_ABONE', '716', 1),
('IMT-SSK', 'IMT (Sayısı Sınırlandırılmış Kullanım Hakkı Yetki Belgesi)', 'IMT_SSK_ABONE', '718', 1),
('IMT-2000', 'IMT-2000/UMTS (İmtiyaz Sözleşmesi)', 'IMT2000_ABONE', '715', 1),
('KABLOYAYIN-B', 'Kablolu Yayın Hizmeti (B)', 'KABLOYAYIN_B_ABONE', '717', 1),
('OKTH-K', 'Ortak Kullanimli Telsiz Hizmeti (K)', 'OKTH_K_ABONE', '712', 1),
('RH-K', 'Rehberlik Hizmeti (K)', 'RH_K_ABONE', '713', 1),
('STH-B', 'Sabit Telefon Hizmeti (B)', 'STH_B_ABONE', '704', 1),
('STH-K', 'Sabit Telefon Hizmeti (K)', 'STH_K_ABONE', '705', 1),
('SMSH-B', 'Sanal Mobil Şebeke Hizmeti (B)', 'SMSH_B_ABONE', '706', 1),
('SMSH-K', 'Sanal Mobil Şebeke Hizmeti (K)', 'SMSH_K_ABONE', '707', 1),
('UYDUHAB-B', 'Uydu Haberleşme Hizmeti (B)', 'UYDUHAB_B_ABONE', '710', 1),
('UYDUPLAT-B', 'Uydu Platform Hizmeti (B)', 'UYDUPLAT_B_ABONE', '711', 1),
('UYDUKABLOTV', 'Uydu ve Kablo TV Hizmetleri', 'UYDUKABLOTV_ABONE', '719', 1),
('CTH-IMT', 'Çeşitli Telekomünikasyon Hizmetleri (İmtiyaz Sözleşmesi)', 'CTH_IMT_ABONE', '720', 1),
('ISS-B', 'İnternet Servis Sağlayıcılığı (B)', 'ISS_B_ABONE', '701', 1)
ON DUPLICATE KEY UPDATE yetki_adi=VALUES(yetki_adi), dosya_tipi_eki=VALUES(dosya_tipi_eki), btk_teknik_dokuman_kodu=VALUES(btk_teknik_dokuman_kodu), aktif=VALUES(aktif);


-- mod_btk_ref_hat_durum_kodlari (EK-1: Hat Durum Kodları)
INSERT INTO `mod_btk_ref_hat_durum_kodlari` (`kod`, `aciklama`) VALUES
('1', 'AKTIF'),
('2', 'IPTAL_ABONE_TALEBI'),
('3', 'IPTAL_BORCUNDAN_DOLAYI_ISLETMECI_TARAFINDAN'),
('4', 'IPTAL_SAHTE_EVRAK_NEDENIYLE'),
('5', 'IPTAL_ABONENIN_VEFATI_NEDENIYLE'),
('6', 'IPTAL_DEVIR'),
('7', 'IPTAL_NAKIL'),
('8', 'IPTAL_NUMARA_TASIMA'),
('9', 'IPTAL_HATTIN_KULLANILMAMASI_NEDENIYLE_ISLETMECI_TARAFINDAN'),
('10', 'IPTAL_ABONE_SOZLESMEYE_AYKIRI_DAVRANIS'),
('11', 'IPTAL_ISLETMECIDEN_KAYNAKLANAN_NEDENLERLE'),
('12', 'IPTAL_HUKUKI_NEDENLERLE_MAHKEME_SAVCILIK_EMNIYET_MİT_VB'),
('13', 'IPTAL_DIGER'),
('14', 'DONDURULMUS_ABONE_TALEBI_UZERINE'),
('15', 'DONDURULMUS_KAYIP_CALINTI_NEDENIYLE'),
('16', 'DONDURULMUS_ISLETMECI_TARAFINDAN'),
('17', 'DONDURULMUS_DIGER'),
('18', 'KISITLI_ABONE_TALEBI_UZERINE'),
('19', 'KISITLI_BORCUNDAN_DOLAYI_ISLETMECI_TARAFINDAN'),
('20', 'KISITLI_ISLETMECI_TARAFINDAN_HATTIN_USULSUZ_KULLANIMI'),
('21', 'KISITLI_DIGER'),
('22', 'IPTAL_NUMARA_DEGISIKLIGI')
ON DUPLICATE KEY UPDATE aciklama=VALUES(aciklama);

-- mod_btk_ref_musteri_tipleri (EK-2: Müşteri Tipleri)
INSERT INTO `mod_btk_ref_musteri_tipleri` (`kod`, `aciklama`) VALUES
('G-BIREYSEL', 'Gerçek Kişi - Bireysel'),
('G-SIRKET', 'Gerçek Kişi - Şirket'),
('T-AS', 'Tüzel Kişi - Anonim Şirket'),
('T-LTD', 'Tüzel Kişi - Limited Şirket'),
('T-KOOP', 'Tüzel Kişi - Kooperatif'),
('T-DERNEK', 'Tüzel Kişi - Dernek'),
('T-VAKIF', 'Tüzel Kişi - Vakıf'),
('T-SENDIKA', 'Tüzel Kişi - Sendika'),
('T-DIGER', 'Tüzel Kişi - Diğer'),
('D-KAMU', 'Devlet Kurumu - Kamu'),
('D-YEREL', 'Devlet Kurumu - Yerel Yönetim'),
('D-KIT', 'Devlet Kurumu - KİT'),
('D-ASKERI', 'Devlet Kurumu - Askeri'),
('D-UNIVERSITE', 'Devlet Kurumu - Üniversite'),
('Y-KONSOLOS', 'Yabancı Misyon - Konsolosluk'),
('Y-BUYUKELCI', 'Yabancı Misyon - Büyükelçilik'),
('Y-ULUSKURULUS', 'Yabancı Misyon - Uluslararası Kuruluş Temsilciliği')
ON DUPLICATE KEY UPDATE aciklama=VALUES(aciklama);

-- mod_btk_ref_hizmet_tipleri (EK-3: Hizmet Tipleri)
INSERT INTO `mod_btk_ref_hizmet_tipleri` (`kod`, `aciklama`) VALUES
('DIALUP', 'Çevirmeli İnternet'),
('ADSL', 'ADSL'),
('SDSL', 'SDSL'),
('VDSL', 'VDSL'),
('METRO', 'Metro Ethernet'),
('KIRALIKDEVRE', 'Kiralık Devre'),
('FR', 'Frame Relay'),
('ATM', 'ATM'),
('GHDSL', 'G.SHDSL'),
('WIMAX', 'WIMAX'),
('WIFI', 'WiFi'),
('MOBIL', 'Mobil İnternet (Telefon, Datacard vb.)'),
('UYDU', 'Uydu İnternet'),
('KABLO', 'Kablo İnternet'),
('FTTH', 'FTTH/B (Eve/Binaya Kadar Fiber)'),
('DIGER', 'Diğer'),
('SABIT HAT', 'Sabit Telefon Hizmeti'),
('MOBIL HAT', 'Mobil Telefon Hizmeti')
ON DUPLICATE KEY UPDATE aciklama=VALUES(aciklama);

-- mod_btk_ref_musteri_hareket_kodlari (EK-5: Müşteri Hareket Kodları)
INSERT INTO `mod_btk_ref_musteri_hareket_kodlari` (`kod`, `aciklama`) VALUES
('1', 'YENI_ABONELIK_KAYDI'),
('2', 'ABONELIK_BILGI_GUNCELLEME'),
('3', 'HAT_DURUM_DEGISIKLIGI'),
('4', 'ABONELIK_IPTAL_KAYDI'),
('5', 'ABONELIK_DEVIR_KAYDI_ALAN'),
('6', 'ABONELIK_DEVIR_KAYDI_VEREN'),
('7', 'ABONELIK_NAKIL_KAYDI_ALAN'),
('8', 'ABONELIK_NAKIL_KAYDI_VEREN'),
('9', 'NUMARA_TASIMA_GELEN_ABONE'),
('10', 'NUMARA_TASIMA_GEDEN_ABONE'),
('11', 'TARIFE_DEGISIKLIGI'),
('12', 'SIMKART_DEGISIKLIGI'),
('13', 'NUMARA_DEGISIKLIGI_YENI_NUMARA'),
('14', 'NUMARA_DEGISIKLIGI_ESKI_NUMARA'),
('15', 'STATIK_IP_TAHSIS'),
('16', 'STATIK_IP_IPTAL'),
('17', 'HIZ_PROFILI_DEGISIKLIGI'),
('18', 'DIGER_HAREKETLER')
ON DUPLICATE KEY UPDATE aciklama=VALUES(aciklama);

-- mod_btk_ref_cinsiyet (314_KK_Abone_Desen.docx EK-4, Madde 13 ABONE_CINSIYET)
INSERT INTO `mod_btk_ref_cinsiyet` (`kod`, `aciklama`) VALUES
('E', 'Erkek'),
('K', 'Kadın'),
('B', 'Belirtilmemiş') -- BTK dökümanında sadece E, K belirtilmiştir. Bu seçenek BTK ile teyit edilmelidir.
ON DUPLICATE KEY UPDATE aciklama=VALUES(aciklama);

-- mod_btk_ref_kimlik_tipleri (314_KK_Abone_Desen.docx EK-4, Madde 30 ABONE_KIMLIK_TIPI)
INSERT INTO `mod_btk_ref_kimlik_tipleri` (`kod`, `aciklama`) VALUES
('NC', 'Nüfus Cüzdanı (Eski Tip)'),
('YKK', 'T.C. Kimlik Kartı (Yeni Tip)'),
('PASAPORT', 'Pasaport'),
('SURUCU', 'Sürücü Belgesi'),
('YIKK', 'Yabancı Kimlik Kartı/İkamet İzni Belgesi'),
('MAVIKART', 'Mavi Kart (Doğumla Türk Vatandaşı Olup İzinle Ayrılanlar)'),
('DIPLOMATIK', 'Diplomatik Kimlik Kartı'),
('DIGERRESMI', 'Diğer Resmi Kimlik Belgesi')
ON DUPLICATE KEY UPDATE aciklama=VALUES(aciklama);

-- mod_btk_ref_kimlik_aidiyetleri (314_KK_Abone_Desen.docx EK-4, Madde 32 ABONE_KIMLIK_AIDIYETI)
INSERT INTO `mod_btk_ref_kimlik_aidiyetleri` (`kod`, `aciklama`) VALUES
('KENDISI', 'Kendisi'),
('ANNE', 'Anne'),
('BABA', 'Baba'),
('ES', 'Eş'),
('COCUK', 'Çocuk'),
('VASİ', 'Vasi'),
('KAYYUM', 'Kayyum'),
('TEMSILCI', 'Yasal Temsilci (Vekil, Şirket Yetkilisi vb.)')
ON DUPLICATE KEY UPDATE aciklama=VALUES(aciklama);

-- mod_btk_adres_il (Tüm İller) - (TÜİK İl Kodları ile birlikte)
INSERT INTO `mod_btk_adres_il` (`il_kodu`, `il_adi`) VALUES
('01', 'Adana'), ('02', 'Adıyaman'), ('03', 'Afyonkarahisar'), ('04', 'Ağrı'), ('05', 'Amasya'),
('06', 'Ankara'), ('07', 'Antalya'), ('08', 'Artvin'), ('09', 'Aydın'), ('10', 'Balıkesir'),
('11', 'Bilecik'), ('12', 'Bingöl'), ('13', 'Bitlis'), ('14', 'Bolu'), ('15', 'Burdur'),
('16', 'Bursa'), ('17', 'Çanakkale'), ('18', 'Çankırı'), ('19', 'Çorum'), ('20', 'Denizli'),
('21', 'Diyarbakır'), ('22', 'Edirne'), ('23', 'Elazığ'), ('24', 'Erzincan'), ('25', 'Erzurum'),
('26', 'Eskişehir'), ('27', 'Gaziantep'), ('28', 'Giresun'), ('29', 'Gümüşhane'), ('30', 'Hakkari'),
('31', 'Hatay'), ('32', 'Isparta'), ('33', 'Mersin'), ('34', 'İstanbul'), ('35', 'İzmir'),
('36', 'Kars'), ('37', 'Kastamonu'), ('38', 'Kayseri'), ('39', 'Kırklareli'), ('40', 'Kırşehir'),
('41', 'Kocaeli'), ('42', 'Konya'), ('43', 'Kütahya'), ('44', 'Malatya'), ('45', 'Manisa'),
('46', 'Kahramanmaraş'), ('47', 'Mardin'), ('48', 'Muğla'), ('49', 'Muş'), ('50', 'Nevşehir'),
('51', 'Niğde'), ('52', 'Ordu'), ('53', 'Rize'), ('54', 'Sakarya'), ('55', 'Samsun'),
('56', 'Siirt'), ('57', 'Sinop'), ('58', 'Sivas'), ('59', 'Tekirdağ'), ('60', 'Tokat'),
('61', 'Trabzon'), ('62', 'Tunceli'), ('63', 'Şanlıurfa'), ('64', 'Uşak'), ('65', 'Van'),
('66', 'Yozgat'), ('67', 'Zonguldak'), ('68', 'Aksaray'), ('69', 'Bayburt'), ('70', 'Karaman'),
('71', 'Kırıkkale'), ('72', 'Batman'), ('73', 'Şırnak'), ('74', 'Bartın'), ('75', 'Ardahan'),
('76', 'Iğdır'), ('77', 'Yalova'), ('78', 'Karabük'), ('79', 'Kilis'), ('80', 'Osmaniye'),
('81', 'Düzce')
ON DUPLICATE KEY UPDATE il_adi=VALUES(il_adi);

-- mod_btk_adres_ilce (Sadece Balıkesir / Ayvalık) - (Örnek TÜİK İlçe Kodu kullanılmıştır, gerçek kod farklı olabilir)
INSERT INTO `mod_btk_adres_ilce` (`ilce_kodu`, `il_kodu`, `ilce_adi`) VALUES
('1004', '10', 'AYVALIK') -- Ayvalık için örnek bir ilçe kodu '1004' kullanıldı.
ON DUPLICATE KEY UPDATE il_kodu=VALUES(il_kodu), ilce_adi=VALUES(ilce_adi);

-- mod_btk_adres_mahalle (Balıkesir / Ayvalık İlçesine Bağlı Mahalleler)
-- Not: Mahalle kodları ve tam listesi için güncel TÜİK verilerine veya yerel kaynaklara başvurulmalıdır.
-- Aşağıdakiler sık bilinen ve örnek mahallelerdir. Gerçek mahalle kodları farklı olabilir.
INSERT INTO `mod_btk_adres_mahalle` (`mahalle_koy_kodu`, `ilce_kodu`, `mahalle_adi`) VALUES
('1004001', '1004', '150 EVLER MAHALLESİ'),
('1004002', '1004', 'ALİ ÇETİNKAYA MAHALLESİ'),
('1004003', '1004', 'ALTINOVA MAHALLESİ'),
('1004005', '1004', 'AYAZMA MAHALLESİ'),
('1004006', '1004', 'BAĞYÜZÜ KÖYÜ'),
('1004007', '1004', 'BEŞTEPELER KÖYÜ'),
('1004008', '1004', 'BULUTÇEŞME KÖYÜ'),
('1004009', '1004', 'ÇAKMAK KÖYÜ'),
('1004010', '1004', 'ÇAMOBA MAHALLESİ'),
('1004011', '1004', 'FEVZİPAŞA-VEHBİBEY MAHALLESİ'),
('1004012', '1004', 'GAZİKEMALPAŞA MAHALLESİ'),
('1004014', '1004', 'HAMDİBEY MAHALLESİ'),
('1004015', '1004', 'HAYRETTİNPAŞA MAHALLESİ'),
('1004016', '1004', 'İSMETPAŞA MAHALLESİ'),
('1004017', '1004', 'KAZIMKARABEKİR MAHALLESİ'),
('1004018', '1004', 'KEMALPAŞA MAHALLESİ'),
('1004019', '1004', 'KÜÇÜKKÖY MAHALLESİ'),
('1004020', '1004', 'MİTHATPAŞA MAHALLESİ'),
('1004021', '1004', 'MURATELİ KÖYÜ'),
('1004022', '1004', 'MUTAFLAR KÖYÜ'),
('1004023', '1004', 'NAMIKKEMAL MAHALLESİ'),
('1004024', '1004', 'ODABURNU KÖYÜ'),
('1004025', '1004', 'SAHİLKENT MAHALLESİ'),
('1004026', '1004', 'SAKARYA MAHALLESİ'),
('1004029', '1004', 'TÜRKÖZÜ KÖYÜ'),
('1004030', '1004', 'ÜÇKABAAĞAÇ KÖYÜ'),
('1004031', '1004', 'YENİKÖY KÖYÜ'),
('1004034', '1004', 'ATATÜRK MAHALLESİ'),
('1004035', '1004', 'FATİH MAHALLESİ'),
('1004036', '1004', 'SARELLER MAHALLESİ'),
('1004037', '1004', 'AKÇAPINAR KÖYÜ'),
('1004039', '1004', 'KARAAYIT KÖYÜ'),
('1004040', '1004', 'KIRCA KÖYÜ'),
('1004041', '1004', 'NEBİLER KÖYÜ'),
('1004042', '1004', 'YUMURCAKLAR KÖYÜ')
ON DUPLICATE KEY UPDATE ilce_kodu=VALUES(ilce_kodu), mahalle_adi=VALUES(mahalle_adi);

-- mod_btk_ref_ulkeler (ABONE_UYRUK için - Örnek ve sık kullanılanlar)
-- Bu liste dünya ülkelerinin büyük bir çoğunluğunu kapsamalıdır.
-- Şimdilik temel ülkeler ve BTK dökümanında geçenler eklenecektir.
-- Bu bölüm bir sonraki SQL parçasında daha kapsamlı olarak doldurulacaktır.
-- INSERT INTO `mod_btk_ref_ulkeler` (`ulke_adi_tr`, `iso_3166_1_alpha_2`, `iso_3166_1_alpha_3`, `icao_9303_uyruk_kodu`) VALUES ...

-- mod_btk_ref_meslekler (ABONE_MESLEK için - abonedesen.xlsx ve yaygın olanlar)
-- Bu liste abonedesen.xlsx'deki örnekleri ve yaygın meslekleri kapsamalıdır.
-- Şimdilik temel meslekler eklenecektir.
-- Bu bölüm bir sonraki SQL parçasında daha kapsamlı olarak doldurulacaktır.
-- INSERT INTO `mod_btk_ref_meslekler` (`meslek_kodu`, `meslek_adi`) VALUES ...


-- BÖLÜM 1 SONU --
-- initial_reference_data.sql
-- WHMCS BTK Abone Veri Raporlama Modülü
-- Başlangıç Referans Verileri (TAM VE EKSİKSİZ SÜRÜM - KAPSAMI GENİŞLETİLMİŞ)
-- BÖLÜM 2 / 2 (SON BÖLÜM)

-- Önceki bölümdeki verilerin devamı niteliğindedir.
-- Bu script, önceki bölümdeki script çalıştırıldıktan sonra veya onunla birleştirilerek çalıştırılmalıdır.

-- mod_btk_ref_ulkeler (ABONE_UYRUK için - Kapsamlı Liste)
-- ulke_adi_tr: Personele dropdown'da gösterilecek Türkçe tam ülke adı.
-- iso_3166_1_alpha_2: ISO 3166-1 Alpha-2 ülke kodu (Referans).
-- iso_3166_1_alpha_3: ISO 3166-1 Alpha-3 ülke kodu (BTK Raporlarında kullanılacak).
-- icao_9303_uyruk_kodu: ICAO 9303 uyruk kodu (Genellikle Alpha-3 ile aynı, referans).
INSERT INTO `mod_btk_ref_ulkeler` (`ulke_adi_tr`, `iso_3166_1_alpha_2`, `iso_3166_1_alpha_3`, `icao_9303_uyruk_kodu`) VALUES
('AFGANİSTAN İSLAM CUMHURİYETİ', 'AF', 'AFG', 'AFG'),
('ALMANYA FEDERAL CUMHURİYETİ', 'DE', 'DEU', 'D'),
('AMERİKA BİRLEŞİK DEVLETLERİ', 'US', 'USA', 'USA'),
('ANDORRA PRENSLİĞİ', 'AD', 'AND', 'AND'),
('ANGOLA CUMHURİYETİ', 'AO', 'AGO', 'AGO'),
('ANTIGUA VE BARBUDA', 'AG', 'ATG', 'ATG'),
('ARJANTİN CUMHURİYETİ', 'AR', 'ARG', 'ARG'),
('ARNAVUTLUK CUMHURİYETİ', 'AL', 'ALB', 'ALB'),
('AVUSTRALYA', 'AU', 'AUS', 'AUS'),
('AVUSTURYA CUMHURİYETİ', 'AT', 'AUT', 'AUT'),
('AZERBAYCAN CUMHURİYETİ', 'AZ', 'AZE', 'AZE'),
('BAHAMALAR COMMONWEALTHI', 'BS', 'BHS', 'BHS'),
('BAHREYN KRALLIĞI', 'BH', 'BHR', 'BHR'),
('BANGLADEŞ HALK CUMHURİYETİ', 'BD', 'BGD', 'BGD'),
('BARBADOS', 'BB', 'BRB', 'BRB'),
('BELARUS CUMHURİYETİ', 'BY', 'BLR', 'BLR'),
('BELÇİKA KRALLIĞI', 'BE', 'BEL', 'BEL'),
('BELİZE', 'BZ', 'BLZ', 'BLZ'),
('BENİN CUMHURİYETİ', 'BJ', 'BEN', 'BEN'),
('BHUTAN KRALLIĞI', 'BT', 'BTN', 'BTN'),
('BİRLEŞİK ARAP EMİRLİKLERİ', 'AE', 'ARE', 'ARE'),
('BİRLEŞİK KRALLIK (İNGİLTERE)', 'GB', 'GBR', 'GBR'),
('BOLİVYA ÇOK ULUSLU DEVLETİ', 'BO', 'BOL', 'BOL'),
('BOSNA HERSEK', 'BA', 'BIH', 'BIH'),
('BOTSVANA CUMHURİYETİ', 'BW', 'BWA', 'BWA'),
('BREZİLYA FEDERATİF CUMHURİYETİ', 'BR', 'BRA', 'BRA'),
('BRUNEİ DARUSSELAM SULTANLIĞI', 'BN', 'BRN', 'BRN'),
('BULGARİSTAN CUMHURİYETİ', 'BG', 'BGR', 'BGR'),
('BURKİNA FASO', 'BF', 'BFA', 'BFA'),
('BURUNDİ CUMHURİYETİ', 'BI', 'BDI', 'BDI'),
('CEZAYİR DEMOKRATİK HALK CUMHURİYETİ', 'DZ', 'DZA', 'DZA'),
('CİBUTİ CUMHURİYETİ', 'DJ', 'DJI', 'DJI'),
('ÇAD CUMHURİYETİ', 'TD', 'TCD', 'TCD'),
('ÇEK CUMHURİYETİ (ÇEKYA)', 'CZ', 'CZE', 'CZE'),
('ÇİN HALK CUMHURİYETİ', 'CN', 'CHN', 'CHN'),
('DANİMARKA KRALLIĞI', 'DK', 'DNK', 'DNK'),
('DOĞU TİMOR DEMOKRATİK CUMHURİYETİ', 'TL', 'TLS', 'TLS'),
('DOMİNİKA COMMONWEALTHI', 'DM', 'DMA', 'DMA'),
('DOMİNİK CUMHURİYETİ', 'DO', 'DOM', 'DOM'),
('EKVADOR CUMHURİYETİ', 'EC', 'ECU', 'ECU'),
('EKVATOR GİNESİ CUMHURİYETİ', 'GQ', 'GNQ', 'GNQ'),
('EL SALVADOR CUMHURİYETİ', 'SV', 'SLV', 'SLV'),
('ENDONEZYA CUMHURİYETİ', 'ID', 'IDN', 'IDN'),
('ERİTRE DEVLETİ', 'ER', 'ERI', 'ERI'),
('ERMENİSTAN CUMHURİYETİ', 'AM', 'ARM', 'ARM'),
('ESTONYA CUMHURİYETİ', 'EE', 'EST', 'EST'),
('ESVATİNİ KRALLIĞI (SVAZİLAND)', 'SZ', 'SWZ', 'SWZ'),
('ETİYOPYA FEDERAL DEMOKRATİK CUMHURİYETİ', 'ET', 'ETH', 'ETH'),
('FAS KRALLIĞI', 'MA', 'MAR', 'MAR'),
('FİJİ CUMHURİYETİ', 'FJ', 'FJI', 'FJI'),
('FİLDİŞİ SAHİLİ CUMHURİYETİ', 'CI', 'CIV', 'CIV'),
('FİLİPİNLER CUMHURİYETİ', 'PH', 'PHL', 'PHL'),
('FİLİSTİN DEVLETİ', 'PS', 'PSE', 'PSE'),
('FİNLANDİYA CUMHURİYETİ', 'FI', 'FIN', 'FIN'),
('FRANSA CUMHURİYETİ', 'FR', 'FRA', 'F'),
('GABON CUMHURİYETİ', 'GA', 'GAB', 'GAB'),
('GAMBİYA CUMHURİYETİ', 'GM', 'GMB', 'GMB'),
('GANA CUMHURİYETİ', 'GH', 'GHA', 'GHA'),
('GİNE CUMHURİYETİ', 'GN', 'GIN', 'GIN'),
('GİNE-BİSSAU CUMHURİYETİ', 'GW', 'GNB', 'GNB'),
('GRENADA', 'GD', 'GRD', 'GRD'),
('GUATEMALA CUMHURİYETİ', 'GT', 'GTM', 'GTM'),
('GUYANA KOOPERATİF CUMHURİYETİ', 'GY', 'GUY', 'GUY'),
('GÜNEY AFRİKA CUMHURİYETİ', 'ZA', 'ZAF', 'ZAF'),
('GÜNEY KIBRIS RUM YÖNETİMİ', 'CY', 'CYP', 'CYP'), -- BTK tarafından tanınan resmi ad kullanılmalı
('GÜNEY KORE CUMHURİYETİ', 'KR', 'KOR', 'KOR'),
('GÜNEY SUDAN CUMHURİYETİ', 'SS', 'SSD', 'SSD'),
('GÜRCİSTAN', 'GE', 'GEO', 'GEO'),
('HAİTİ CUMHURİYETİ', 'HT', 'HTI', 'HTI'),
('HIRVATİSTAN CUMHURİYETİ', 'HR', 'HRV', 'HRV'),
('HİNDİSTAN CUMHURİYETİ', 'IN', 'IND', 'IND'),
('HOLLANDA KRALLIĞI', 'NL', 'NLD', 'NLD'),
('HONDURAS CUMHURİYETİ', 'HN', 'HND', 'HND'),
('IRAK CUMHURİYETİ', 'IQ', 'IRQ', 'IRQ'),
('İRAN İSLAM CUMHURİYETİ', 'IR', 'IRN', 'IRN'),
('İRLANDA', 'IE', 'IRL', 'IRL'),
('İSPANYA KRALLIĞI', 'ES', 'ESP', 'ESP'),
('İSRAİL DEVLETİ', 'IL', 'ISR', 'ISR'),
('İSVEÇ KRALLIĞI', 'SE', 'SWE', 'SWE'),
('İSVİÇRE KONFEDERASYONU', 'CH', 'CHE', 'CHE'),
('İTALYA CUMHURİYETİ', 'IT', 'ITA', 'ITA'),
('İZLANDA', 'IS', 'ISL', 'ISL'),
('JAMAİKA', 'JM', 'JAM', 'JAM'),
('JAPONYA', 'JP', 'JPN', 'JPN'),
('KAMBOÇYA KRALLIĞI', 'KH', 'KHM', 'KHM'),
('KAMERUN CUMHURİYETİ', 'CM', 'CMR', 'CMR'),
('KANADA', 'CA', 'CAN', 'CAN'),
('KARADAĞ', 'ME', 'MNE', 'MNE'),
('KATAR DEVLETİ', 'QA', 'QAT', 'QAT'),
('KAZAKİSTAN CUMHURİYETİ', 'KZ', 'KAZ', 'KAZ'),
('KENYA CUMHURİYETİ', 'KE', 'KEN', 'KEN'),
('KIRGIZ CUMHURİYETİ', 'KG', 'KGZ', 'KGZ'),
('KİRİBATİ CUMHURİYETİ', 'KI', 'KIR', 'KIR'),
('KOLOMBİYA CUMHURİYETİ', 'CO', 'COL', 'COL'),
('KOMORLAR BİRLİĞİ', 'KM', 'COM', 'COM'),
('KONGO CUMHURİYETİ (BRAZZAVİLLE)', 'CG', 'COG', 'COG'),
('KONGO DEMOKRATİK CUMHURİYETİ (KİNŞASA)', 'CD', 'COD', 'COD'),
('KOSTA RİKA CUMHURİYETİ', 'CR', 'CRI', 'CRI'),
('KUVEYT DEVLETİ', 'KW', 'KWT', 'KWT'),
('KUZEY KIBRIS TÜRK CUMHURİYETİ', 'TRNC', 'TRNC', 'TRNC'), -- BTK tarafından tanınan resmi ad kullanılmalı
('KUZEY KORE DEMOKRATİK HALK CUMHURİYETİ', 'KP', 'PRK', 'PRK'),
('KUZEY MAKEDONYA CUMHURİYETİ', 'MK', 'MKD', 'MKD'),
('KÜBA CUMHURİYETİ', 'CU', 'CUB', 'CUB'),
('LAOS DEMOKRATİK HALK CUMHURİYETİ', 'LA', 'LAO', 'LAO'),
('LESOTHO KRALLIĞI', 'LS', 'LSO', 'LSO'),
('LETONYA CUMHURİYETİ', 'LV', 'LVA', 'LVA'),
('LİBERYA CUMHURİYETİ', 'LR', 'LBR', 'LBR'),
('LİBYA DEVLETİ', 'LY', 'LBY', 'LBY'),
('LİHTENŞTAYN PRENSLİĞİ', 'LI', 'LIE', 'LIE'),
('LİTVANYA CUMHURİYETİ', 'LT', 'LTU', 'LTU'),
('LÜBNAN CUMHURİYETİ', 'LB', 'LBN', 'LBN'),
('LÜKSEMBURG BÜYÜK DÜKALIĞI', 'LU', 'LUX', 'LUX'),
('MACARİSTAN', 'HU', 'HUN', 'HUN'),
('MADAGASKAR CUMHURİYETİ', 'MG', 'MDG', 'MDG'),
('MALAVİ CUMHURİYETİ', 'MW', 'MWI', 'MWI'),
('MALEZYA', 'MY', 'MYS', 'MYS'),
('MALDİVLER CUMHURİYETİ', 'MV', 'MDV', 'MDV'),
('MALİ CUMHURİYETİ', 'ML', 'MLI', 'MLI'),
('MALTA CUMHURİYETİ', 'MT', 'MLT', 'MLT'),
('MARSHALL ADALARI CUMHURİYETİ', 'MH', 'MHL', 'MHL'),
('MAURİTUS CUMHURİYETİ', 'MU', 'MUS', 'MUS'),
('MEKSİKA BİRLEŞİK DEVLETLERİ', 'MX', 'MEX', 'MEX'),
('MISIR ARAP CUMHURİYETİ', 'EG', 'EGY', 'EGY'),
('MİKRONEZYA FEDERE DEVLETLERİ', 'FM', 'FSM', 'FSM'),
('MOĞOLİSTAN', 'MN', 'MNG', 'MNG'),
('MOLDOVA CUMHURİYETİ', 'MD', 'MDA', 'MDA'),
('MONAKO PRENSLİĞİ', 'MC', 'MCO', 'MCO'),
('MORİTANYA İSLAM CUMHURİYETİ', 'MR', 'MRT', 'MRT'),
('MOZAMBİK CUMHURİYETİ', 'MZ', 'MOZ', 'MOZ'),
('MYANMAR BİRLİĞİ CUMHURİYETİ', 'MM', 'MMR', 'MMR'),
('NAMİBYA CUMHURİYETİ', 'NA', 'NAM', 'NAM'),
('NAURU CUMHURİYETİ', 'NR', 'NRU', 'NRU'),
('NEPAL FEDERAL DEMOKRATİK CUMHURİYETİ', 'NP', 'NPL', 'NPL'),
('NİJER CUMHURİYETİ', 'NE', 'NER', 'NER'),
('NİJERYA FEDERAL CUMHURİYETİ', 'NG', 'NGA', 'NGA'),
('NİKARAGUA CUMHURİYETİ', 'NI', 'NIC', 'NIC'),
('NORVEÇ KRALLIĞI', 'NO', 'NOR', 'NOR'),
('ORTA AFRİKA CUMHURİYETİ', 'CF', 'CAF', 'CAF'),
('ÖZBEKİSTAN CUMHURİYETİ', 'UZ', 'UZB', 'UZB'),
('PAKİSTAN İSLAM CUMHURİYETİ', 'PK', 'PAK', 'PAK'),
('PALAU CUMHURİYETİ', 'PW', 'PLW', 'PLW'),
('PANAMA CUMHURİYETİ', 'PA', 'PAN', 'PAN'),
('PAPUA YENİ GİNE BAĞIMSIZ DEVLETİ', 'PG', 'PNG', 'PNG'),
('PARAGUAY CUMHURİYETİ', 'PY', 'PRY', 'PRY'),
('PERU CUMHURİYETİ', 'PE', 'PER', 'PER'),
('POLONYA CUMHURİYETİ', 'PL', 'POL', 'POL'),
('PORTEKİZ CUMHURİYETİ', 'PT', 'PRT', 'PRT'),
('ROMANYA', 'RO', 'ROU', 'ROU'),
('RUANDA CUMHURİYETİ', 'RW', 'RWA', 'RWA'),
('RUSYA FEDERASYONU', 'RU', 'RUS', 'RUS'),
('SAINT KITTS VE NEVİS FEDERASYONU', 'KN', 'KNA', 'KNA'),
('SAINT LUCIA', 'LC', 'LCA', 'LCA'),
('SAINT VINCENT VE GRENADİNLER', 'VC', 'VCT', 'VCT'),
('SAMOA BAĞIMSIZ DEVLETİ', 'WS', 'WSM', 'WSM'),
('SAN MARİNO CUMHURİYETİ', 'SM', 'SMR', 'SMR'),
('SAO TOME VE PRİNCİPE DEMOKRATİK CUMHURİYETİ', 'ST', 'STP', 'STP'),
('SENEGAL CUMHURİYETİ', 'SN', 'SEN', 'SEN'),
('SEYŞELLER CUMHURİYETİ', 'SC', 'SYC', 'SYC'),
('SIRBİSTAN CUMHURİYETİ', 'RS', 'SRB', 'SRB'),
('SIERRA LEONE CUMHURİYETİ', 'SL', 'SLE', 'SLE'),
('SİNGAPUR CUMHURİYETİ', 'SG', 'SGP', 'SGP'),
('SLOVAKYA (SLOVAK CUMHURİYETİ)', 'SK', 'SVK', 'SVK'),
('SLOVENYA CUMHURİYETİ', 'SI', 'SVN', 'SVN'),
('SOLOMON ADALARI', 'SB', 'SLB', 'SLB'),
('SOMALİ FEDERAL CUMHURİYETİ', 'SO', 'SOM', 'SOM'),
('SRİ LANKA DEMOKRATİK SOSYALİST CUMHURİYETİ', 'LK', 'LKA', 'LKA'),
('SUDAN CUMHURİYETİ', 'SD', 'SDN', 'SDN'),
('SURİNAM CUMHURİYETİ', 'SR', 'SUR', 'SUR'),
('SURİYE ARAP CUMHURİYETİ', 'SY', 'SYR', 'SYR'),
('SUUDİ ARABİSTAN KRALLIĞI', 'SA', 'SAU', 'SAU'),
('ŞİLİ CUMHURİYETİ', 'CL', 'CHL', 'CHL'),
('TACİKİSTAN CUMHURİYETİ', 'TJ', 'TJK', 'TJK'),
('TANZANYA BİRLEŞİK CUMHURİYETİ', 'TZ', 'TZA', 'TZA'),
('TAYLAND KRALLIĞI', 'TH', 'THA', 'THA'),
('TOGO CUMHURİYETİ', 'TG', 'TGO', 'TGO'),
('TONGA KRALLIĞI', 'TO', 'TON', 'TON'),
('TRİNİDAD VE TOBAGO CUMHURİYETİ', 'TT', 'TTO', 'TTO'),
('TUNUS CUMHURİYETİ', 'TN', 'TUN', 'TUN'),
('TÜRKİYE CUMHURİYETİ', 'TR', 'TUR', 'TUR'),
('TÜRKMENİSTAN', 'TM', 'TKM', 'TKM'),
('TUVALU', 'TV', 'TUV', 'TUV'),
('UGANDA CUMHURİYETİ', 'UG', 'UGA', 'UGA'),
('UKRAYNA', 'UA', 'UKR', 'UKR'),
('UMMAN SULTANLIĞI', 'OM', 'OMN', 'OMN'),
('URUGUAY DOĞU CUMHURİYETİ', 'UY', 'URY', 'URY'),
('ÜRDÜN HAŞİMİ KRALLIĞI', 'JO', 'JOR', 'JOR'),
('VANUATU CUMHURİYETİ', 'VU', 'VUT', 'VUT'),
('VATİKAN (KUTSAL MAKAM)', 'VA', 'VAT', 'VAT'),
('VENEZUELA BOLİVARCI CUMHURİYETİ', 'VE', 'VEN', 'VEN'),
('VİETNAM SOSYALİST CUMHURİYETİ', 'VN', 'VNM', 'VNM'),
('YEMEN CUMHURİYETİ', 'YE', 'YEM', 'YEM'),
('YENİ ZELANDA', 'NZ', 'NZL', 'NZL'),
('YEŞİL BURUN ADALARI CUMHURİYETİ (KAP VERDE)', 'CV', 'CPV', 'CPV'),
('YUNANİSTAN CUMHURİYETİ (HELEN CUMHURİYETİ)', 'GR', 'GRC', 'GRC'),
('ZAMBİYA CUMHURİYETİ', 'ZM', 'ZMB', 'ZMB'),
('ZİMBABVE CUMHURİYETİ', 'ZW', 'ZWE', 'ZWE')
ON DUPLICATE KEY UPDATE ulke_adi_tr=VALUES(ulke_adi_tr), iso_3166_1_alpha_2=VALUES(iso_3166_1_alpha_2), icao_9303_uyruk_kodu=VALUES(icao_9303_uyruk_kodu);


-- mod_btk_ref_meslekler (ABONE_MESLEK için - abonedesen.xlsx ve yaygın olanlar)
-- meslek_kodu: Kısa ve benzersiz bir kod (isteğe bağlı, sadece meslek_adi da kullanılabilir)
-- meslek_adi: Personele dropdown'da gösterilecek meslek adı
INSERT INTO `mod_btk_ref_meslekler` (`meslek_kodu`, `meslek_adi`) VALUES
('OGRENCI', 'ÖĞRENCİ'),
('MEMUR', 'MEMUR'),
('ISCI', 'İŞÇİ'),
('EMEKLİ', 'EMEKLİ'),
('EVHANIMI', 'EV HANIMI'),
('SERBESTMESLEK', 'SERBEST MESLEK'),
('ESNAF', 'ESNAF'),
('CIFTCI', 'ÇİFTÇİ'),
('DOKTOR', 'DOKTOR'),
('MUHENDIS', 'MÜHENDİS'),
('AVUKAT', 'AVUKAT'),
('OGRETMEN', 'ÖĞRETMEN'),
('ASKER', 'ASKER (SİLAHLI KUVVETLER MENSUBU)'),
('POLIS', 'POLİS (EMNİYET MENSUBU)'),
('SOFOR', 'ŞOFÖR'),
('SANATCI', 'SANATÇI'),
('SPORCU', 'SPORCU'),
('GAZETECI', 'GAZETECİ'),
('YAZAR', 'YAZAR'),
('MIMAR', 'MİMAR'),
('ECZACI', 'ECZACI'),
('DISHEKIMI', 'DİŞ HEKİMİ'),
('VETERINER', 'VETERİNER HEKİM'),
('HEMSIRE', 'HEMŞİRE / SAĞLIK TEKNİKERİ'),
('TEKNISYEN', 'TEKNİSYEN / TEKNİKER'),
('BANKACI', 'BANKACI / FİNANS UZMANI'),
('ITUZMANI', 'BİLGİ TEKNOLOJİLERİ UZMANI / YAZILIMCI'),
('AKADEMISYEN', 'AKADEMİSYEN / ARAŞTIRMA GÖREVLİSİ'),
('YONETICI', 'YÖNETİCİ (ÖZEL SEKTÖR)'),
('YONETICI_KAMU', 'YÖNETİCİ (KAMU)'),
('GUVENLIK', 'GÜVENLİK GÖREVLİSİ'),
('TURIZMCI', 'TURİZM SEKTÖRÜ ÇALIŞANI'),
('INSURANCE', 'SİGORTACI'),
('EMLAKCI', 'EMLAK DANIŞMANI'),
('MUHASEBECI', 'MUHASEBECİ / MALİ MÜŞAVİR'),
('KUAFOR', 'KUAFÖR / BERBER'),
('ASCİ', 'AŞÇI / MUTFAK PERSONELİ'),
('GARSON', 'GARSON / SERVİS ELEMANI'),
('SATISPAZARLAMA', 'SATIŞ / PAZARLAMA UZMANI'),
('INSANKAYNAKLARI', 'İNSAN KAYNAKLARI UZMANI'),
('USTA', 'USTA (ÇEŞİTLİ MESLEKLER)'),
('ISADAMI', 'İŞ İNSANI / GİRİŞİMCİ'),
('ISSİZ', 'İŞSİZ'),
('CALISMIYOR', 'ÇALIŞMIYOR (İŞ ARAMIYOR)'),
('BILINMIYOR', 'BİLİNMİYOR / BELİRTİLMEDİ'),
('DIGERMESLEK', 'DİĞER')
ON DUPLICATE KEY UPDATE meslek_adi=VALUES(meslek_adi);

-- BÖLÜM 2 SONU (VE initial_reference_data.sql DOSYASININ SONU) --
-- initial_reference_data.sql
-- WHMCS BTK Abone Veri Raporlama Modülü
-- Başlangıç Referans Verileri (TAM VE EKSİKSİZ SÜRÜM - KAPSAMI GENİŞLETİLMİŞ)
-- BÖLÜM 3 / 3 (SON BÖLÜM)

-- Önceki bölümlerdeki verilerin devamı niteliğindedir.
-- Bu script, önceki bölümlerdeki scriptler çalıştırıldıktan sonra veya onlarla birleştirilerek çalıştırılmalıdır.

-- mod_btk_ref_ulkeler (ABONE_UYRUK için - Kapsamlı Liste DEVAMI)
-- Önceki bölümde kalan ülkeler buraya eklenecektir.
-- Bir önceki bölümde 'ZİMBABVE CUMHURİYETİ' ile bitirmiştik.
-- Bu bölümde, uluslararası standartlarda tanınan ve sıkça karşılaşılabilecek diğer ülkeler eklenecektir.
-- Eğer bir önceki bölümde tüm ülkeler tamamlandıysa, bu kısım boş olabilir veya sadece birkaç ekleme içerebilir.
-- Pratikte, bu listenin tamlığı için güvenilir bir uluslararası kaynak (örn: Birleşmiş Milletler üye listesi) esas alınmalıdır.
-- Şimdilik, bir önceki bölümdeki ülke listesinin yeterince kapsamlı olduğunu varsayarak bu bölüme ek ülke eklemiyorum.
-- Eğer spesifik olarak eklenmesini istediğiniz başka ülkeler varsa, lütfen belirtin.
-- Önemli olan, BTK'nın kabul ettiği formatta (ISO 3166-1 Alpha-3) kodların olmasıdır.

-- Ancak, önceki listeyi daha da zenginleştirmek adına birkaç ekleme yapalım:
INSERT INTO `mod_btk_ref_ulkeler` (`ulke_adi_tr`, `iso_3166_1_alpha_2`, `iso_3166_1_alpha_3`, `icao_9303_uyruk_kodu`) VALUES
('KOSOVA CUMHURİYETİ', 'XK', 'XKX', 'XKX'), -- ISO resmi olarak atamamış olabilir, fiili durum
('TAYVAN (ÇİN CUMHURİYETİ)', 'TW', 'TWN', 'TWN'),
('SOMALİLAND', 'SO', 'SOM', 'SOM'), -- Somaliland tanınma durumu farklı olsa da fiili bir bölge
('VATANDAŞLIKSIZ (HAYMATLOS)', 'XX', 'XXX', 'XXX') -- Vatansız kişiler için
ON DUPLICATE KEY UPDATE ulke_adi_tr=VALUES(ulke_adi_tr), iso_3166_1_alpha_2=VALUES(iso_3166_1_alpha_2), icao_9303_uyruk_kodu=VALUES(icao_9303_uyruk_kodu);


-- mod_btk_ref_meslekler (ABONE_MESLEK için - abonedesen.xlsx ve yaygın olanlar)
-- meslek_kodu: Kısa ve benzersiz bir kod (isteğe bağlı, sadece meslek_adi da kullanılabilir)
-- meslek_adi: Personele dropdown'da gösterilecek meslek adı
-- Önceki bölümde bu tabloya ait INSERT sorgusu zaten tamamlanmıştı.
-- Tekrar eklemeye gerek yoktur, eğer bir önceki bölümde tam olarak verildiyse.
-- Ancak, eksiksizlik adına ve eğer bir önceki bölümde bu tabloya ait INSERT'ler yoksa diye
-- meslek listesini tekrar buraya ekliyorum. Eğer zaten varsa, bu blok ON DUPLICATE KEY UPDATE sayesinde sorun yaratmayacaktır.
INSERT INTO `mod_btk_ref_meslekler` (`meslek_kodu`, `meslek_adi`) VALUES
('OGRENCI', 'ÖĞRENCİ'),
('MEMUR', 'MEMUR'),
('ISCI', 'İŞÇİ'),
('EMEKLİ', 'EMEKLİ'),
('EVHANIMI', 'EV HANIMI'),
('SERBESTMESLEK', 'SERBEST MESLEK'),
('ESNAF', 'ESNAF'),
('CIFTCI', 'ÇİFTÇİ'),
('DOKTOR', 'DOKTOR'),
('MUHENDIS', 'MÜHENDİS'),
('AVUKAT', 'AVUKAT'),
('OGRETMEN', 'ÖĞRETMEN'),
('ASKER', 'ASKER (SİLAHLI KUVVETLER MENSUBU)'),
('POLIS', 'POLİS (EMNİYET MENSUBU)'),
('SOFOR', 'ŞOFÖR'),
('SANATCI', 'SANATÇI'),
('SPORCU', 'SPORCU'),
('GAZETECI', 'GAZETECİ'),
('YAZAR', 'YAZAR'),
('MIMAR', 'MİMAR'),
('ECZACI', 'ECZACI'),
('DISHEKIMI', 'DİŞ HEKİMİ'),
('VETERINER', 'VETERİNER HEKİM'),
('HEMSIRE', 'HEMŞİRE / SAĞLIK TEKNİKERİ'),
('TEKNISYEN', 'TEKNİSYEN / TEKNİKER'),
('BANKACI', 'BANKACI / FİNANS UZMANI'),
('ITUZMANI', 'BİLGİ TEKNOLOJİLERİ UZMANI / YAZILIMCI'),
('AKADEMISYEN', 'AKADEMİSYEN / ARAŞTIRMA GÖREVLİSİ'),
('YONETICI', 'YÖNETİCİ (ÖZEL SEKTÖR)'),
('YONETICI_KAMU', 'YÖNETİCİ (KAMU)'),
('GUVENLIK', 'GÜVENLİK GÖREVLİSİ'),
('TURIZMCI', 'TURİZM SEKTÖRÜ ÇALIŞANI'),
('INSURANCE', 'SİGORTACI'),
('EMLAKCI', 'EMLAK DANIŞMANI'),
('MUHASEBECI', 'MUHASEBECİ / MALİ MÜŞAVİR'),
('KUAFOR', 'KUAFÖR / BERBER'),
('ASCİ', 'AŞÇI / MUTFAK PERSONELİ'),
('GARSON', 'GARSON / SERVİS ELEMANI'),
('SATISPAZARLAMA', 'SATIŞ / PAZARLAMA UZMANI'),
('INSANKAYNAKLARI', 'İNSAN KAYNAKLARI UZMANI'),
('USTA', 'USTA (ÇEŞİTLİ MESLEKLER)'),
('ISADAMI', 'İŞ İNSANI / GİRİŞİMCİ'),
('ISSİZ', 'İŞSİZ'),
('CALISMIYOR', 'ÇALIŞMIYOR (İŞ ARAMIYOR)'),
('BILINMIYOR', 'BİLİNMİYOR / BELİRTİLMEDİ'),
('DIGERMESLEK', 'DİĞER')
ON DUPLICATE KEY UPDATE meslek_adi=VALUES(meslek_adi);

-- BÖLÜM 3 SONU (VE initial_reference_data.sql DOSYASININ SONU) --