-- WHMCS BTK Raporlama Modülü - Başlangıç Referans Verileri v1.0.30 uyumlu
-- Yeni config ayarları için varsayılanlar eklendi.
-- İl, ilçe, mahalle verileri için örnekler bırakıldı, tam liste için manuel giriş veya ayrı bir script gerekebilir.

-- mod_btk_hat_durum_kodlari (EK-1'den alınmıştır)
INSERT IGNORE INTO `mod_btk_hat_durum_kodlari` (`kod`, `durum_adi`, `aciklama`) VALUES
('1', 'AKTIF', 'AKTIF'),
('2', 'IPTAL', 'IPTAL NUMARA_DEGISIKLIGI'),
('3', 'IPTAL', 'IPTAL'),
('4', 'IPTAL', 'IPTAL SAHTE_EVRAK'),
('5', 'IPTAL', 'IPTAL MUSTERI TALEBI'),
('6', 'IPTAL', 'IPTAL DEVIR'),
('7', 'IPTAL', 'IPTAL HAT_BENIM_DEGIL'),
('8', 'IPTAL', 'IPTAL_KARA_LISTE'),
('9', 'IPTAL', 'IPTAL KULLANIM_DISI'),
('10', 'IPTAL', 'IPTAL EKSIK EVRAK'),
('11', 'IPTAL', 'IPTAL SEHVEN_GIRIS'),
('12', 'IPTAL', 'IPTAL BAGLI_URUN_IPTALI'),
('13', 'KISITLI', 'KISITLI KONTUR_BITTI'),
('14', 'KISITLI', 'KISITLI ARAMAYA_KAPALI'),
('15', 'DONDURULMUS', 'DONDURULMUS_MUSTERI_TALEBI'),
('16', 'DONDURULMUS', 'DONDURULMUS ISLETME');

-- mod_btk_musteri_hareket_kodlari
INSERT IGNORE INTO `mod_btk_musteri_hareket_kodlari` (`kod`, `aciklama`) VALUES
('1', 'YENI ABONELIK'),
('2', 'HAT DURUM DEGISIKLIGI'),
('3', 'TARIFE DEGISIKLIGI'),
('4', 'ADRES DEGISIKLIGI (YERLESIM)'),
('5', 'ADRES DEGISIKLIGI (TESIS)'),
('6', 'UNVAN DEGISIKLIGI'),
('7', 'TCKN/YKN DEGISIKLIGI/GUNCELLEME'),
('8', 'HIZMET IPTALI'),
('9', 'HIZMET ASKIYA ALMA'),
('10', 'HIZMET ASKIYA ALMADAN CIKARMA'),
('11', 'HIZMET DEVIR (GELEN)'),
('12', 'HIZMET DEVIR (GIDEN)'),
('13', 'DIGER ABONE BILGI GUNCELLEME'),
('14', 'HIZMET PAKET/HIZ DEGISIKLIGI'),
('15', 'STATIK IP ATAMA/DEGISTIRME');

-- mod_btk_yetki_turleri
INSERT IGNORE INTO `mod_btk_yetki_turleri` (`yetki_kodu`, `yetki_adi`, `kapsam`) VALUES
('AIH_B', 'Altyapı İşletmeciliği Hizmeti (B)', 'B'),
('AIH_K', 'Altyapı İşletmeciliği Hizmeti (K)', 'K'),
('GMPCS_MT_B', 'GMPCS Mobil Telefon Hizmeti (B)', 'B'),
('GMPCS_MT_K', 'GMPCS Mobil Telefon Hizmeti (K)', 'K'),
('GSM_IMTIYAZ', 'GSM (İmtiyaz Sözleşmesi)', 'K'),
('HT_GSM1800_B', 'Hava Taşıtlarında GSM 1800 Mobil Telefon Hizmeti (B)', 'B'),
('IMT_SSKHYB', 'IMT (Sayısı Sınırlandırılmış Kullanım Hakkı Yetki Belgesi)', 'K'),
('IMT2000_UMTS_IMTIYAZ', 'IMT-2000/UMTS (İmtiyaz Sözleşmesi)', 'K'),
('KABLOYAYIN_B', 'Kablolu Yayın Hizmeti (B)', 'B'),
('OKTH_K', 'Ortak Kullanimli Telsiz Hizmeti (K)', 'K'),
('REHBERLIK_K', 'Rehberlik Hizmeti (K)', 'K'),
('STH_B', 'Sabit Telefon Hizmeti (B)', 'B'),
('STH_K', 'Sabit Telefon Hizmeti (K)', 'K'),
('SMSH_B', 'Sanal Mobil Şebeke Hizmeti (B)', 'B'),
('SMSH_K', 'Sanal Mobil Şebeke Hizmeti (K)', 'K'),
('UYDUHAB_B', 'Uydu Haberleşme Hizmeti (B)', 'B'),
('UYDUPLAT_B', 'Uydu Platform Hizmeti (B)', 'B'),
('UYDUKABLOTV', 'Uydu ve Kablo TV Hizmetleri', 'B'),
('CTH_IMTIYAZ', 'Çeşitli Telekomünikasyon Hizmetleri (İmtiyaz Sözleşmesi)', 'K'),
('ISS_B', 'İnternet Servis Sağlayıcılığı (B)', 'B');

-- mod_btk_hizmet_tipleri
INSERT IGNORE INTO `mod_btk_hizmet_tipleri` (`hizmet_turu`, `deger_aciklama`, `yetki_turu_kodu`) VALUES
('XDSL', 'xDSL İnternet Hizmeti', 'ISS_B'),
('METRO', 'Metro Ethernet İnternet Hizmeti', 'ISS_B'),
('DIALUP', 'Dial-Up İnternet Hizmeti', 'ISS_B'),
('MOBIL', 'Mobil İnternet Hizmeti', 'IMT_SSKHYB,GSM_IMTIYAZ,IMT2000_UMTS_IMTIYAZ,SMSH_B,SMSH_K'),
('SABIT_TEL', 'Sabit Telefon Hizmeti', 'STH_B,STH_K'),
('ALTYAPI', 'Altyapı Kiralama Hizmeti', 'AIH_B,AIH_K'),
('WIFI', 'Kablosuz İnternet Hizmeti (WiFi)', 'ISS_B'),
('UYDU_INTERNET', 'Uydu İnternet Hizmeti', 'UYDUHAB_B'),
('KABLOTV_INTERNET', 'KabloTV Üzerinden İnternet Hizmeti', 'KABLOYAYIN_B'),
('VERIMERKEZI', 'Veri Merkezi Hizmeti', 'CTH_IMTIYAZ,ISS_B'),
('SESBARINDIRMA', 'Ses Barındırma Hizmeti', 'CTH_IMTIYAZ,STH_B'),
('GMPCS', 'GMPCS Mobil Telefon Hizmeti', 'GMPCS_MT_B,GMPCS_MT_K'),
('OKTH', 'Ortak Kullanımlı Telsiz Hizmeti', 'OKTH_K'),
('REHBERLIK', 'Rehberlik Hizmeti', 'REHBERLIK_K');

-- mod_btk_musteri_tipleri
INSERT IGNORE INTO `mod_btk_musteri_tipleri` (`musteri_tipi_kodu`, `deger_aciklama`) VALUES
('B', 'BİREYSEL ABONE TC VATANDAŞI'),
('BY', 'BİREYSEL ABONE YABANCI UYRUKLU'),
('K', 'KURUMSAL ABONE (KAMU)'),
('O', 'KURUMSAL ABONE (ÖZEL)'),
('E', 'KURUMSAL ABONE (ELÇİLİK)'),
('D', 'KURUMSAL ABONE (DERNEK/VAKIF)'),
('G-SIRKET', 'TİCARİ İŞLETMELER (ŞİRKET)'),
('G-KOBI', 'KOBİ'),
('G-BUYUK', 'BÜYÜK İŞLETMELER');

-- mod_btk_kimlik_tipleri
INSERT IGNORE INTO `mod_btk_kimlik_tipleri` (`kimlik_tipi_kodu`, `deger_aciklama`) VALUES
('TCKC', 'TÜRKİYE CUMHURİYETİ KİMLİK KARTI'),
('TCKK_ESKI', 'NÜFUS CÜZDANI (ESKİ TİP)'),
('PASAPORT', 'PASAPORT'),
('YKC', 'YABANCI KİMLİK KARTI (İKAMET VB.)'),
('MAVI', 'MAVİ KART (PEMBE KART)'),
('DIGER', 'DİĞER RESMİ KİMLİK BELGESİ');

-- mod_btk_kimlik_aidiyeti
INSERT IGNORE INTO `mod_btk_kimlik_aidiyeti` (`kimlik_aidiyeti_kodu`, `deger_aciklama`) VALUES
('K', 'KENDİSİ'),
('V', 'VELİSİ'),
('VS', 'VASİSİ'),
('VK', 'VEKİLİ'),
('Y', 'YASAL TEMSİLCİSİ');

-- mod_btk_iller (Örnekler - Tam liste için ayrıca bir SQL dosyası veya manuel giriş gerekebilir)
-- Bu kısım, tüm 81 ili içerecek şekilde genişletilmelidir. Şimdilik sadece birkaç örnek bırakıyorum.
INSERT IGNORE INTO `mod_btk_iller` (`plaka_kodu`, `il_adi`) VALUES
('01', 'ADANA'), ('06', 'ANKARA'), ('07', 'ANTALYA'), ('09', 'AYDIN'), ('10', 'BALIKESİR'),
('16', 'BURSA'), ('20', 'DENİZLİ'), ('26', 'ESKİŞEHİR'), ('27', 'GAZİANTEP'), ('32', 'ISPARTA'),
('33', 'MERSİN'), ('34', 'İSTANBUL'), ('35', 'İZMİR'), ('38', 'KAYSERİ'), ('41', 'KOCAELİ'),
('42', 'KONYA'), ('43', 'KÜTAHYA'), ('45', 'MANİSA'), ('48', 'MUĞLA'), ('54', 'SAKARYA'),
('55', 'SAMSUN'), ('61', 'TRABZON');
-- ... (Tüm 81 il buraya eklenebilir)

-- Varsayılan Modül Ayarları (mod_btk_config)
INSERT IGNORE INTO `mod_btk_config` (`setting`, `value`) VALUES
('operator_name', ''),
('operator_code', ''),
('operator_unvani', ''),
('active_auth_types', '[]'),
('ftp_host', ''),
('ftp_username', ''),
('ftp_password', ''),
('ftp_rehber_path', '/REHBER/'),
('ftp_hareket_path', '/HAREKET/'),
('personel_ftp_path', '/PERSONEL/'),
('send_empty_file', '0'),
('delete_data_on_uninstall', '0'),
('last_config_update', NOW()),
('module_version', '1.0.28'); -- btkreports.php v1.0.28 ile uyumlu