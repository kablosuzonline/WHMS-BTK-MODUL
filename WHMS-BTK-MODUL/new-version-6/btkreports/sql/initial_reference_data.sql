-- modules/addons/btkreports/initial_reference_data.sql
-- WHMCS BTK Raporlama Modülü v6.0.0 - Başlangıç Referans Verileri

-- BTK EK-1: Hat Durum Kodları
INSERT IGNORE INTO `mod_btk_ref_hat_durum_kodlari` (`kod`, `aciklama_btk`, `aciklama_tr`) VALUES
('1', 'AKTİF', 'Aktif'),
('2', 'İPTAL_NUMARA_DEGISIKLIGI', 'İptal - Numara Değişikliği'),
('3', 'İPTAL', 'İptal'),
('4', 'İPTAL_SAHTE_EVRAK', 'İptal - Sahte Evrak'),
('5', 'İPTAL_MUSTERI_TALEBI', 'İptal - Müşteri Talebi'),
('6', 'İPTAL_DEVIR', 'İptal - Devir'),
('7', 'İPTAL_HAT_BENIM_DEGIL', 'İptal - Hat Benim Değil'),
('8', 'İPTAL_KARA_LISTE', 'İptal - Kara Liste'),
('9', 'İPTAL_KULLANIM_DISI', 'İptal - Kullanım Dışı'),
('10', 'İPTAL_EKSİK_EVRAK', 'İptal - Eksik Evrak'),
('11', 'İPTAL_SEHVEN_GIRIS', 'İptal - Sehven Giriş'),
('12', 'İPTAL_BAGLI_URUN_IPTALI', 'İptal - Bağlı Ürün İptali'),
('13', 'KISITLI_KONTUR_BITTI', 'Kısıtlı - Kontör Bitti'),
('14', 'KISITLI_ARAMAYA_KAPALI', 'Kısıtlı - Aramaya Kapalı'),
('15', 'DONDURULMUS_MUSTERI_TALEBI', 'Dondurulmuş - Müşteri Talebi'),
('16', 'DONDURULMUS_ISLETME', 'Dondurulmuş - İşletme Tarafından');

-- BTK EK-2: Müşteri Hareket Kodları
INSERT IGNORE INTO `mod_btk_ref_musteri_hareket_kodlari` (`kod`, `aciklama_btk`, `aciklama_tr`) VALUES
('1', 'YENİ ABONELİK KAYDI', 'Yeni Abonelik Kaydı'),
('2', 'HAT DURUM DEĞİŞİKLİĞİ', 'Hat Durum Değişikliği'),
('3', 'SIM KART DEĞİŞİKLİĞİ', 'SIM Kart Değişikliği'),
('4', 'ÖDEME TİPİ DEĞİŞİKLİĞİ', 'Ödeme Tipi Değişikliği'),
('5', 'ADRES DEĞİŞİKLİĞİ', 'Adres Değişikliği'),
('6', 'IMSI DEĞİŞİKLİĞİ', 'IMSI Değişikliği'),
('7', 'TARİFE DEĞİŞİKLİĞİ', 'Tarife Değişikliği'),
('8', 'DEVİR_MÜŞTERİ_DEĞİŞİKLİĞİ', 'Devir - Müşteri Değişikliği'),
('9', 'NUMARA DEĞİŞİKLİĞİ', 'Numara Değişikliği'),
('10', 'HAT İPTAL', 'Hat İptal'),
('11', 'MÜŞTERİ BİLGİ DEĞİŞİKLİĞİ', 'Müşteri Bilgi Değişikliği'),
('12', 'NUMARA TAŞIMA', 'Numara Taşıma'),
('13', 'NUMARA DEĞİŞMEDEN NAKİL', 'Numara Değişmeden Nakil (Sabit Hatlar İçin)'),
('14', 'NUMARA DEĞİŞTİREREK NAKİL', 'Numara Değiştirerek Nakil (Sabit Hatlar İçin)'),
('15', 'IP DEĞİŞİKLİĞİ', 'IP Değişikliği'),
('16', 'YENİDEN AKTİVASYON', 'Yeniden Aktivasyon');

-- BTK EK-3: Hizmet Tipleri (Örnekler - Bu liste BTK dokümanından tamamlanmalı)
-- `isletme_tipi_btk`, `altyapi_turu_btk`, `hizmet_kodu_btk`, `aciklama_tr`
INSERT IGNORE INTO `mod_btk_ref_hizmet_tipleri` (`isletme_tipi_btk`, `altyapi_turu_btk`, `hizmet_kodu_btk`, `aciklama_tr`) VALUES
('ISS', 'xDSL', 'XDSL', 'xDSL İnternet Hizmeti'),
('ISS', 'FIBER', 'FIBER', 'Fiber İnternet Hizmeti'),
('ISS', 'MOBIL DATA', 'MOBILVERI', 'Mobil Veri Hizmeti (ISS)'),
('ISS', 'WIFI', 'WIFI', 'WiFi Kablosuz İnternet'),
('AIH', 'FIBER', 'FIBERTRANS', 'Fiber Optik Devre Kiralama (AIH)'),
('AIH', NULL, 'DEVRE', 'Veri Devre Kiralama (AIH)'),
('STH', NULL, 'SABITSES', 'Sabit Telefon Hizmeti (Ses)'),
('MOBIL', 'GSM', 'MOBILSES', 'Mobil Ses Hizmeti (GSM)'),
('UYDU', NULL, 'UYDUVERI', 'Uydu Veri Hizmeti');

-- BTK EK-4: Kimlik Tipleri (Örnekler - Bu liste BTK dokümanından tamamlanmalı)
INSERT IGNORE INTO `mod_btk_ref_kimlik_tipleri` (`belge_adi_tr`, `belge_tip_kodu_btk`) VALUES
('TC Çipli Kimlik Kartı', 'TCKK'),
('TC Nüfus Cüzdanı', 'TCNC'),
('TC Yabancı Kimlik Belgesi', 'TCYK'),
('Yeni Tip Çipli e-Pasaport', 'TCPC'),
('Eski Tip Lacivert Pasaport', 'TCPL'),
('Geçici Pasaport', 'TCGP');

-- BTK EK-5: Meslek Kodları (Örnekler - Bu liste BTK dokümanından tamamlanmalı)
INSERT IGNORE INTO `mod_btk_ref_meslek_kodlari` (`kod_btk`, `aciklama_tr`) VALUES
('011', 'Subaylar'),
('111', 'Kanun Yapıcılar ve Üst Düzey Yöneticiler'),
('251', 'Yazılım ve Uygulama Geliştiricileri ve Analistleri'),
('0000', 'Diğer/Bilinmiyor'); -- Varsayılan veya bilinmeyen için

-- Adres Verileri - İller (81 İl)
INSERT IGNORE INTO `mod_btk_adres_il` (`plaka_kodu`, `il_adi`) VALUES
('01', 'ADANA'), ('02', 'ADIYAMAN'), ('03', 'AFYONKARAHİSAR'), ('04', 'AĞRI'), ('05', 'AMASYA'),
('06', 'ANKARA'), ('07', 'ANTALYA'), ('08', 'ARTVİN'), ('09', 'AYDIN'), ('10', 'BALIKESİR'),
('11', 'BİLECİK'), ('12', 'BİNGÖL'), ('13', 'BİTLİS'), ('14', 'BOLU'), ('15', 'BURDUR'),
('16', 'BURSA'), ('17', 'ÇANAKKALE'), ('18', 'ÇANKIRI'), ('19', 'ÇORUM'), ('20', 'DENİZLİ'),
('21', 'DİYARBAKIR'), ('22', 'EDİRNE'), ('23', 'ELAZIĞ'), ('24', 'ERZİNCAN'), ('25', 'ERZURUM'),
('26', 'ESKİŞEHİR'), ('27', 'GAZİANTEP'), ('28', 'GİRESUN'), ('29', 'GÜMÜŞHANE'), ('30', 'HAKKARİ'),
('31', 'HATAY'), ('32', 'ISPARTA'), ('33', 'MERSİN'), ('34', 'İSTANBUL'), ('35', 'İZMİR'),
('36', 'KARS'), ('37', 'KASTAMONU'), ('38', 'KAYSERİ'), ('39', 'KIRKLARELİ'), ('40', 'KIRŞEHİR'),
('41', 'KOCAELİ'), ('42', 'KONYA'), ('43', 'KÜTAHYA'), ('44', 'MALATYA'), ('45', 'MANİSA'),
('46', 'KAHRAMANMARAŞ'), ('47', 'MARDİN'), ('48', 'MUĞLA'), ('49', 'MUŞ'), ('50', 'NEVŞEHİR'),
('51', 'NİĞDE'), ('52', 'ORDU'), ('53', 'RİZE'), ('54', 'SAKARYA'), ('55', 'SAMSUN'),
('56', 'SİİRT'), ('57', 'SİNOP'), ('58', 'SİVAS'), ('59', 'TEKİRDAĞ'), ('60', 'TOKAT'),
('61', 'TRABZON'), ('62', 'TUNCELİ'), ('63', 'ŞANLIURFA'), ('64', 'UŞAK'), ('65', 'VAN'),
('66', 'YOZGAT'), ('67', 'ZONGULDAK'), ('68', 'AKSARAY'), ('69', 'BAYBURT'), ('70', 'KARAMAN'),
('71', 'KIRIKKALE'), ('72', 'BATMAN'), ('73', 'ŞIRNAK'), ('74', 'BARTIN'), ('75', 'ARDAHAN'),
('76', 'IĞDIR'), ('77', 'YALOVA'), ('78', 'KARABÜK'), ('79', 'KİLİS'), ('80', 'OSMANİYE'),
('81', 'DÜZCE');

-- Adres Verileri - Balıkesir İlçeleri (Balıkesir il_id'si 10 olacak, plaka koduna göre)
-- (Bu kısım için Balıkesir'in il_id'sinin 10 olduğunu varsayıyorum, kontrol edilmeli)
SET @balikesir_il_id = (SELECT id FROM mod_btk_adres_il WHERE plaka_kodu = '10');
INSERT IGNORE INTO `mod_btk_adres_ilce` (`il_id`, `ilce_adi`) VALUES
(@balikesir_il_id, 'ALTIEYLÜL'), (@balikesir_il_id, 'AYVALIK'), (@balikesir_il_id, 'BALYA'), (@balikesir_il_id, 'BANDIRMA'),
(@balikesir_il_id, 'BİGADİÇ'), (@balikesir_il_id, 'BURHANİYE'), (@balikesir_il_id, 'DURSUNBEY'), (@balikesir_il_id, 'EDREMİT'),
(@balikesir_il_id, 'ERDEK'), (@balikesir_il_id, 'GÖMEÇ'), (@balikesir_il_id, 'GÖNEN'), (@balikesir_il_id, 'HAVRAN'),
(@balikesir_il_id, 'İVRİNDİ'), (@balikesir_il_id, 'KARESİ'), (@balikesir_il_id, 'KEPSUT'), (@balikesir_il_id, 'MANYAS'),
(@balikesir_il_id, 'MARMARA'), (@balikesir_il_id, 'SAVAŞTEPE'), (@balikesir_il_id, 'SINDIRGI'), (@balikesir_il_id, 'SUSURLUK');

-- Adres Verileri - Ayvalık Mahalleleri (Ayvalık ilce_id'si dinamik olarak bulunacak)
SET @ayvalik_ilce_id = (SELECT id FROM mod_btk_adres_ilce WHERE ilce_adi = 'AYVALIK' AND il_id = @balikesir_il_id);
INSERT IGNORE INTO `mod_btk_adres_mahalle` (`ilce_id`, `mahalle_adi`, `posta_kodu`) VALUES
(@ayvalik_ilce_id, '150 EVLER MAHALLESİ', '10400'),
(@ayvalik_ilce_id, 'ALİBEY ADASI MAHALLESİ', '10405'), -- Cunda
(@ayvalik_ilce_id, 'ALTINOVA MAHALLESİ', '10415'),
(@ayvalik_ilce_id, 'ATATÜRK MAHALLESİ', '10400'), -- Bu mahalle ismi birçok ilçede olabilir, Ayvalık için teyit edilmeli.
(@ayvalik_ilce_id, 'BAĞYÜZÜ KÖYÜ', '10420'),
(@ayvalik_ilce_id, 'BEŞİKTEPE KÖYÜ', '10400'),
(@ayvalik_ilce_id, 'BULUTÇEŞME KÖYÜ', '10400'),
(@ayvalik_ilce_id, 'ÇAKMAK KÖYÜ', '10420'),
(@ayvalik_ilce_id, 'ÇAMOBA MAHALLESİ', '10400'),
(@ayvalik_il_id, 'FEVZİPAŞA-VEHBİBEY MAHALLESİ', '10400'),
(@ayvalik_ilce_id, 'GAZİKEMALPAŞA MAHALLESİ', '10400'),
(@ayvalik_ilce_id, 'HACIVELİLER KÖYÜ', '10400'),
(@ayvalik_ilce_id, 'HAMDİBEY MAHALLESİ', '10400'),
(@ayvalik_ilce_id, 'HAYRETTİNPAŞA MAHALLESİ', '10400'),
(@ayvalik_ilce_id, 'İSMETPAŞA MAHALLESİ', '10400'),
(@ayvalik_ilce_id, 'KAZIM KARABEKİR MAHALLESİ', '10400'),
(@ayvalik_ilce_id, 'KEMALPAŞA MAHALLESİ', '10400'),
(@ayvalik_ilce_id, 'KÜÇÜKKÖY MAHALLESİ', '10410'), -- Sarımsaklı'nın olduğu yer
(@ayvalik_ilce_id, 'MİTHATPAŞA MAHALLESİ', '10405'), -- Cunda
(@ayvalik_ilce_id, 'MURATELİ KÖYÜ', '10420'),
(@ayvalik_ilce_id, 'MUTLU KÖYÜ', '10420'),
(@ayvalik_ilce_id, 'NAMIK KEMAL MAHALLESİ', '10405'), -- Cunda
(@ayvalik_ilce_id, 'ODABURNU KÖYÜ', '10400'),
(@ayvalik_ilce_id, 'SAHİLKENT MAHALLESİ', '10400'),
(@ayvalik_ilce_id, 'SAKARYA MAHALLESİ', '10400'),
(@ayvalik_ilce_id, 'SÖBEÇİMEN KÖYÜ', '10400'),
(@ayvalik_ilce_id, 'TURGUTREİS MAHALLESİ', '10400'),
(@ayvalik_ilce_id, 'TUZLA KÖYÜ', '10400'),
(@ayvalik_ilce_id, 'ÜÇKABAAĞAÇ KÖYÜ', '10420'),
(@ayvalik_ilce_id, 'YAĞCIKÖY KÖYÜ', '10400'),
(@ayvalik_ilce_id, 'YENİKÖY KÖYÜ', '10420'),
(@ayvalik_ilce_id, 'Zekibey MAHALLESİ', '10400');
-- Ayvalık mahalle/köy listesi ve posta kodları için resmi kaynaktan teyit önemlidir. Bu liste örnektir.