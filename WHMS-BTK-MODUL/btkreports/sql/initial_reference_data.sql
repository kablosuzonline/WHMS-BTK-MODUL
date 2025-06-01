-- WHMCS BTK Raporlama Modülü - Başlangıç Referans Verileri - V2.0.1 - Beta (Taslak - Kullanıcı Tarafından Tamamlanacak)
-- Bu SQL betiği, modülün çalışması için gerekli referans tablolarına örnek/başlangıç verilerini ekler.
-- EK-3, EK-4, EK-5 ve tam adres listeleri (il, ilçe, mahalle) kullanıcı tarafından BTK dokümanlarına göre tamamlanmalıdır.

-- Modülün genel ayarları için varsayılanlar
INSERT IGNORE INTO `mod_btk_config` (`setting`, `value`) VALUES
('operator_code', '000'),
('operator_name', 'TESTOPERATOR'),
('operator_unvani', 'TEST OPERATOR ANONIM SIRKETI'),
('ftp_host', 'ftp.example.com'),
('ftp_username', 'ftpuser'),
('ftp_password', ''), 
('ftp_port', '21'),
('use_passive_ftp', '1'),
('ftp_rehber_path', '/REHBER/'),
('ftp_hareket_path', '/HAREKET/'),
('personel_ftp_path', '/PERSONEL/'),
('use_yedek_ftp', '0'),
('yedek_ftp_host', ''),
('yedek_ftp_username', ''),
('yedek_ftp_password', ''), 
('yedek_ftp_port', '21'),
('use_passive_yedek_ftp', '1'),
('yedek_ftp_rehber_path', '/REHBER/'),
('yedek_ftp_hareket_path', '/HAREKET/'),
('yedek_personel_ftp_path', '/PERSONEL/'),
('rehber_cron_schedule', '0 2 1 * *'),
('hareket_cron_schedule', '0 1 * * *'),
('personel_cron_schedule_haziran', '0 3 L 6 *'),
('personel_cron_schedule_aralik', '0 3 L 12 *'),
('hareket_arsivleme_periyodu_ay', '6'),
('delete_tables_on_deactivate', '0'),
('default_rapor_yetki_tipi', 'ISS');

-- EK-1: HAT DURUM KODLARI (Tam Liste - "314_KK_Abone_Desen.pdf" Bölüm 3.5'e göre)
INSERT IGNORE INTO `mod_btk_referans_hat_durum_kodlari` (`kod`, `hat_durum_aciklama`, `btk_aciklama`) VALUES
('1', 'AKTİF', 'Abonenin hizmeti aktif olarak kullandığı durum'),
('2', 'PASİF', 'Abonenin hizmeti aktif olarak kullanmadığı ancak aboneliğin devam ettiği durum'),
('3', 'DONDURULMUŞ_ABONE', 'Abonenin talebi üzerine hizmetin geçici olarak durdurulduğu durum'),
('4', 'DONDURULMUŞ_İŞLETME', 'İşletmeci tarafından (teknik arıza, bakım vb. nedenlerle) hizmetin geçici olarak durdurulduğu durum'),
('5', 'KISITLI_ABONE', 'Abonenin talebi üzerine hizmetin bazı özelliklerinin kısıtlandığı durum'),
('6', 'KISITLI_İŞLETME', 'İşletmeci tarafından (borç, yasal zorunluluk vb. nedenlerle) hizmetin bazı özelliklerinin kısıtlandığı durum'),
('7', 'HAT_NAKİL_GİDEN', 'Abonenin aynı işletmeci üzerinden hizmetini başka bir adrese taşıdığı (eski adresteki durum)'),
('8', 'HAT_NAKİL_GELEN', 'Abonenin aynı işletmeci üzerinden hizmetini başka bir adresten taşıdığı (yeni adresteki durum)'),
('9', 'OPERATOR_DEĞİŞİKLİĞİ', 'Abonenin hizmetini başka bir işletmeciye taşıdığı veya başka bir işletmeciden aldığı durum (Numara taşıma)'),
('10', 'HAT_İPTAL', 'Abonelik sözleşmesinin herhangi bir nedenle sonlandırıldığı durum'),
('11', 'BORÇ_NEDENİYLE_KAPALI', 'Abonenin ödenmemiş borçları nedeniyle hizmetin işletmeci tarafından tamamen kesildiği durum'),
('12', 'KAYIP_ÇALINTI_NEDENİYLE_KAPALI', 'Abonenin kayıp/çalıntı bildirimi üzerine hizmetin kullanıma kapatıldığı durum'),
('13', 'GEÇİCİ_KAPALI_ABONE', 'Abone talebi ile hattın belirli bir süre için (askıya alma) kapatıldığı durum'),
('14', 'GEÇİCİ_KAPALI_İŞLETME', 'İşletmeci tarafından (abonenin yasal yükümlülüklerini yerine getirmemesi gibi) hattın belirli bir süre için kapatıldığı durum'),
('15', 'NUMARA_TAŞIMA_GİDEN', 'Abonenin numarasını başka bir işletmeciye taşıdığı durum'),
('16', 'DONDURULMUS_ISLETME', 'İşletmeci tarafından çeşitli nedenlerle (örn: altyapı çalışması) hizmetin genel olarak dondurulduğu durum.'),
('X0', 'BTK VERİ GİRİŞİ BEKLİYOR', 'Modül tarafından atanan, BTK için veri girişi henüz tamamlanmamış hizmetler için özel durum');

-- EK-2: MÜŞTERİ HAREKET KODLARI (Tam Liste - "314_KK_Abone_Desen.pdf" Bölüm 3.6'ya göre)
INSERT IGNORE INTO `mod_btk_referans_musteri_hareket_kodlari` (`kod`, `aciklama`, `btk_aciklama`) VALUES
('1', 'YENİ_ABONELİK_KAYDI', 'Yeni bir abonelik sözleşmesinin yapılması'),
('2', 'ABONELİK_BİLGİ_GÜNCELLEME', 'Abone kimlik, iletişim veya diğer bilgilerinin güncellenmesi (Müşteri Bilgi Değişikliği ve Adres Değişikliği dışında kalanlar)'),
('3', 'ABONELİK_İPTALİ', 'Abonelik sözleşmesinin sonlandırılması'),
('4', 'ADRES_DEĞİŞİKLİĞİ_TESİS', 'Abonenin hizmet aldığı tesis adresinin (kurulum adresi) değişmesi'),
('5', 'ADRES_DEĞİŞİKLİĞİ_YERLEŞİM', 'Abonenin yerleşim (ikametgah/fatura) adresinin değişmesi'),
('6', 'TARİFE_DEĞİŞİKLİĞİ', 'Abonenin kullandığı tarife paketinin değişmesi'),
('7', 'HIZ_DEĞİŞİKLİĞİ', 'Abonenin internet erişim hızının değişmesi (Hız profilinin değişmesi)'),
('8', 'STATÜ_DEĞİŞİKLİĞİ_AKTİF', 'Hattın/hizmetin aktif duruma geçmesi'),
('9', 'STATÜ_DEĞİŞİKLİĞİ_PASİF', 'Hattın/hizmetin pasif duruma geçmesi'),
('10', 'STATÜ_DEĞİŞİKLİĞİ_DONDURMA', 'Hattın/hizmetin abone veya işletmeci tarafından dondurulması/askıya alınması'),
('11', 'MÜŞTERİ_BİLGİ_DEĞİŞİKLİĞİ', 'Müşterinin TCKN, YKN, Pasaport No, Ad, Soyad, Unvan gibi temel kimlik ve unvan bilgilerinin değişmesi'),
('12', 'OPERATÖR_DEĞİŞİKLİĞİ_GELEN', 'Abonenin başka bir işletmeciden mevcut işletmeciye geçmesi (Numara taşıma ile gelen)'),
('13', 'OPERATÖR_DEĞİŞİKLİĞİ_GİDEN', 'Abonenin mevcut işletmeciden başka bir işletmeciye geçmesi (Numara taşıma ile giden)'),
('14', 'NAKİL_İŞLEMİ', 'Hattın bir adresten başka bir adrese taşınması (hem tesis hem yerleşim adresi birlikte değişiyorsa)'),
('15', 'IP_DEĞİŞİKLİĞİ', 'Abonenin statik IP adresinin değişmesi veya statik IP alması/bırakması'),
('16', 'HİZMET_NUMARASI_DEĞİŞİKLİĞİ', 'Abonenin hizmet numarasının (DSL no, devre no, telefon no vb.) değişmesi'),
('17', 'ABONELİK_YENİLEME', 'Süresi biten veya bitecek olan bir aboneliğin aynı koşullarla veya farklı koşullarla yenilenmesi'),
('18', 'STATÜ_DEĞİŞİKLİĞİ_KISITLAMA', 'Hattın/hizmetin abone veya işletmeci tarafından kısıtlanması (örn: borç nedeniyle giden aramalara kapatma)'),
('19', 'STATÜ_DEĞİŞİKLİĞİ_KISIT_KALDIRMA', 'Hattaki/hizmetteki kısıtlamanın kaldırılması'),
('20', 'BORÇ_NEDENİYLE_KAPATMA', 'Abonenin ödenmemiş borçları nedeniyle hizmetin işletmeci tarafından tamamen kesilmesi (İptal değil, geçici kapatma)'),
('21', 'BORÇ_ÖDEMESİ_SONRASI_AÇMA', 'Borç nedeniyle kapatılan hizmetin borcun ödenmesi sonrası tekrar açılması'),
('22', 'KAYIP_CALINTI_KAPATMA', 'Abonenin kayıp/çalıntı bildirimi üzerine hizmetin kullanıma kapatılması'),
('23', 'KAYIP_CALINTI_ACMA', 'Kayıp/çalıntı nedeniyle kapatılan hizmetin tekrar kullanıma açılması'),
('24', 'DEVİR_ALAN', 'Aboneliğin başka bir kişiye/kuruma devredilmesi (Devralan abone için)'),
('25', 'DEVİR_EDEN', 'Aboneliğini başka bir kişiye/kuruma devretmesi (Devreden abone için)'),
('26', 'HİZMET_TÜRÜ_DEĞİŞİKLİĞİ', 'Abonenin aldığı ana hizmet türünün değişmesi (örn: ADSL den Fiber e geçiş, aynı hat no altında)'),
('27', 'ALFANUMERİK_BAŞLIK_TAHSİSİ', 'Aboneye yeni bir alfanumerik başlık (SMS Başlığı) tahsis edilmesi'),
('28', 'ALFANUMERİK_BAŞLIK_İPTALİ', 'Abonenin alfanumerik başlığının iptal edilmesi');

-- MÜŞTERİ TİPLERİ (BTK Dokümanında ayrı bir EK yok, genel kullanım ve PDF Bölüm 3.9'a göre)
INSERT IGNORE INTO `mod_btk_referans_musteri_tipleri` (`musteri_tipi_kodu`, `aciklama`) VALUES
('G-SAHIS', 'GERÇEK KİŞİ (ŞAHIS)'),
('G-SIRKET', 'GERÇEK KİŞİ (ŞAHIS ŞİRKETİ / TACİR)'),
('T-SIRKET', 'TÜZEL KİŞİ (ŞİRKET)'),
('T-KAMU', 'TÜZEL KİŞİ (KAMU KURUMU/KURULUŞU)'),
('T-DERNEK', 'TÜZEL KİŞİ (DERNEK/VAKIF/SENDİKA/ODA/BİRLİK)'),
('T-DIGER', 'TÜZEL KİŞİ (DİĞER)');

-- EK-2: MÜŞTERİ HAREKET KODLARI (Devamı)
-- (Bu kısım bir önceki parçada tamamlanmıştı, eğer EK-2 listesi çok uzunsa buraya devamı gelebilirdi.
-- Şu anki EK-2 listesi bir önceki parçaya sığdı.)

-- KİMLİK AİDİYETİ (BTK Dokümanında ayrı bir EK yok, genel kullanım)
-- Bu tablo, kimlik belgesinin kime ait olduğunu belirtir (örn: abonenin kendisine, vekiline).
INSERT IGNORE INTO `mod_btk_referans_kimlik_aidiyeti` (`kimlik_aidiyeti_kodu`, `aciklama`) VALUES
('1', 'KENDİSİ'),
('2', 'VEKİLİ'),
('3', 'VASİSİ'),
('4', 'VELİSİ'),
('5', 'ŞİRKET YETKİLİSİ'),
('9', 'DİĞER');

-- EK-3: HİZMET TİPLERİ (KULLANICI TARAFINDAN BTK DOKÜMANINA GÖRE TAMAMLANMALI)
-- AŞAĞIDAKİLER SADECE ÖRNEKTİR VE "314_KK_Abone_Desen.pdf" DOKÜMANINDAKİ BAZI KODLARDIR.
-- LÜTFEN BTK'NIN GÜNCEL VE TAM HİZMET TÜRÜ LİSTESİNİ EKLEYİNİZ.
INSERT IGNORE INTO `mod_btk_referans_hizmet_tipleri` (`hizmet_turu_kodu`, `deger_aciklama`) VALUES
('1', 'İNTERNET'),
('101', 'ÇEVİR ÇAĞRI İLE İNTERNET ERİŞİMİ (DIAL UP)'),
('102', 'ADSL'),
('103', 'SDSL'),
('104', 'VDSL'),
('105', 'FTTH/FTTB (Eve/Binaya Kadar Fiber)'),
('106', 'KABLO İNTERNET'),
('107', 'MOBİL İNTERNET (3G/4.5G/5G)'),
('108', 'UYDU İNTERNET'),
('109', 'WiFi İNTERNET'),
('110', 'KİRALIK DEVRE İNTERNET'),
('111', 'NOKTA-NOKTAYA ERİŞİM (WLAN/WiFi)'),
('199', 'DİĞER İNTERNET ERİŞİM HİZMETLERİ'),
('2', 'TELEFON'),
('201', 'SABİT TELEFON HİZMETİ (PSTN/ISDN)'),
('202', 'MOBİL TELEFON HİZMETİ (GSM/UMTS/LTE)'),
('203', 'İNTERNET ÜZERİNDEN TELEFON HİZMETİ (VoIP)'),
('204', 'UYDU TELEFON HİZMETİ'),
('205', 'SANTRAL HİZMETİ (Bulut Santral vb.)'),
('206', 'GÖRÜNTÜLÜ TELEFON HİZMETİ'),
('299', 'DİĞER TELEFON HİZMETLERİ'),
('3', 'MOBİL'), -- Genel Mobil Hizmetler (Eğer 202 altında detaylanmıyorsa)
('4', 'TV/RADYO YAYINCILIĞI'),
('401', 'KABLO TV'),
('402', 'IPTV'),
('403', 'UYDU PLATFORM HİZMETİ'),
('404', 'KARASAL SAYISAL YAYINCILIK'),
('405', 'İNTERNET ÜZERİNDEN TV/RADYO (OTT TV/Radyo)'),
('499', 'DİĞER TV/RADYO YAYINCILIK HİZMETLERİ'),
('5', 'VERİ MERKEZİ'),
('501', 'SUNUCU BARINDIRMA (COLOCATION)'),
('502', 'SUNUCU KİRALAMA (DEDICATED SERVER)'),
('503', 'SANAL SUNUCU (VPS/VDS)'),
('504', 'BULUT BİLİŞİM HİZMETLERİ (IaaS, PaaS, SaaS)'),
('599', 'DİĞER VERİ MERKEZİ HİZMETLERİ'),
('6', 'ALTYAPI'),
('601', 'KARANLIK FİBER KİRALAMA'),
('602', 'VERİ AKIŞ ERİŞİMİ'),
('603', 'AYRIŞTIRILMIŞ YEREL AĞA ERİŞİM (LLU)'),
('699', 'DİĞER ALTYAPI HİZMETLERİ'),
('7', 'SANAL MOBİL ŞEBEKE HİZMETİ (SMŞH / MVNO)'),
('8', 'DİĞER');
-- ... (Diğer tüm hizmet tipleri BTK EK-3 listesine göre buraya eklenecek) ...
-- ÖNEMLİ: EK-3 listesi oldukça kapsamlıdır ve yukarıdakiler sadece bir alt kümesidir.
-- Lütfen "314_KK_Abone_Desen.pdf" dokümanındaki EK-3 HİZMET TÜRLERİ bölümüne bakarak
-- verdiğiniz hizmetlere karşılık gelen TÜM KODLARI buraya ekleyiniz.
-- Örneğin:
-- 101 DIAL UP
-- 102 ADSL SABİT İNTERNET HİZMETİ
-- 103 SDSL SABİT İNTERNET HİZMETİ
-- ...
-- 201 SABİT TELEFON HİZMETİ
-- 202 MOBİL TELEFON HİZMETİ
-- ...
-- gibi tüm alt kırılımları eklemeniz gerekmektedir.

-- EK-4: KİMLİK TİPLERİ (KULLANICI TARAFINDAN BTK DOKÜMANINA GÖRE TAMAMLANMALI)
-- AŞAĞIDAKİLER "314_KK_Abone_Desen.pdf" DOKÜMANINDAKİ ÖRNEKLERDİR.
-- LÜTFEN BTK'NIN GÜNCEL VE TAM KİMLİK TİPİ LİSTESİNİ EKLEYİNİZ.
INSERT IGNORE INTO `mod_btk_referans_kimlik_tipleri` (`belge_tip_kodu`, `belge_adi`) VALUES
('1', 'NÜFUS CÜZDANI (ESKİ TİP)'),
('2', 'SÜRÜCÜ BELGESİ (ESKİ TİP)'),
('3', 'PASAPORT (T.C. VATANDAŞLARI İÇİN)'),
('4', 'TÜRKİYE CUMHURİYETİ KİMLİK KARTI (YENİ TİP)'),
('5', 'YABANCILARA MAHSUS İKAMET TEZKERESİ / YABANCI KİMLİK NUMARASI KARTI'),
('6', 'MAVİ KART (ESKİ PEMBE KART)'),
('7', 'PASAPORT (YABANCI UYRUKLULAR İÇİN)'),
('8', 'ULUSLARARASI KORUMA BAŞVURU SAHİBİ KİMLİK BELGESİ'),
('9', 'ULUSLARARASI KORUMA STATÜ SAHİBİ KİMLİK BELGESİ'),
('10', 'GEÇİCİ KORUMA KİMLİK BELGESİ (SUREYYELİ VB.)'),
('11', 'DİPLOMATİK MİSYON KİMLİK KARTI'),
('12', 'VATANDAŞLIKTAN ÇIKMA İZİN BELGESİ'),
('99', 'DİĞER'); 
-- ... (Diğer kimlik tipleri BTK EK-4 listesine göre buraya eklenecek) ...

-- initial_reference_data.sql - V2.0.1 - Beta (Taslak - Devamı)
-- 3. PARÇA - 1. KISIM

-- KİMLİK AİDİYETİ (BTK Dokümanında ayrı bir EK yok, genel kullanım)
-- Bu tablo, kimlik belgesinin kime ait olduğunu belirtir (örn: abonenin kendisine, vekiline).
INSERT IGNORE INTO `mod_btk_referans_kimlik_aidiyeti` (`kimlik_aidiyeti_kodu`, `aciklama`) VALUES
('1', 'KENDİSİ'),
('2', 'VEKİLİ'),
('3', 'VASİSİ'),
('4', 'VELİSİ'),
('5', 'ŞİRKET YETKİLİSİ'),
('9', 'DİĞER');

-- EK-3: HİZMET TİPLERİ (KULLANICI TARAFINDAN BTK DOKÜMANINA GÖRE TAMAMLANMALI)
-- AŞAĞIDAKİLER SADECE ÖRNEKTİR VE "314_KK_Abone_Desen.pdf" DOKÜMANINDAKİ BAZI KODLARDIR.
-- LÜTFEN BTK'NIN GÜNCEL VE TAM HİZMET TÜRÜ LİSTESİNİ BU YAPIYA UYGUN OLARAK EKLEYİNİZ.
-- Hizmet türü kodları genellikle 3 hanelidir ve ana kategori altında alt kırılımları olabilir.
-- PDF dokümanındaki EK-3 HİZMET TÜRLERİ bölümünü referans alınız.
INSERT IGNORE INTO `mod_btk_referans_hizmet_tipleri` (`hizmet_turu_kodu`, `deger_aciklama`) VALUES
('100', 'İNTERNET ERİŞİM HİZMETLERİ (GENEL)'), -- Ana Kategori Örneği
('101', 'ÇEVİR ÇAĞRI İLE İNTERNET ERİŞİMİ (DIAL UP)'),
('102', 'ADSL (ASİMETRİK SAYISAL ABONE HATTI)'),
('103', 'SDSL (SİMETRİK SAYISAL ABONE HATTI)'),
('104', 'VDSL (ÇOK YÜKSEK HIZLI SAYISAL ABONE HATTI)'),
('105', 'FTTH/FTTB (EVE/BİNAYA KADAR FİBER)'),
('106', 'KABLO İNTERNET'),
('107', 'MOBİL İNTERNET (3G/4.5G/5G VB.)'),
('108', 'UYDU İNTERNET'),
('109', 'WiFi İNTERNET (KAMUSAL ALAN VB.)'),
('110', 'KİRALIK DEVRE İNTERNET'),
('111', 'NOKTADAN NOKTAYA ERİŞİM (WLAN/KABLOSUZ VB.)'),
('112', 'METRO ETHERNET İNTERNET'),
('199', 'DİĞER İNTERNET ERİŞİM HİZMETLERİ'),

('200', 'TELEFON HİZMETLERİ (GENEL)'), -- Ana Kategori Örneği
('201', 'SABİT TELEFON HİZMETİ (PSTN/ISDN TEMELLİ)'),
('202', 'MOBİL TELEFON HİZMETİ (GSM/UMTS/LTE/5G VB.)'),
('203', 'İNTERNET ÜZERİNDEN TELEFON HİZMETİ (VoIP)'),
('204', 'UYDU TELEFON HİZMETİ'),
('205', 'SANTRAL HİZMETİ (BULUT SANTRAL, IP SANTRAL VB.)'),
('206', 'GÖRÜNTÜLÜ TELEFON HİZMETİ'),
('207', 'ACİL DURUM HABERLEŞME HİZMETLERİ'),
('208', 'FAKS HİZMETİ (IP ÜZERİNDEN VEYA DİĞER)'),
('299', 'DİĞER TELEFON HİZMETLERİ'),

('300', 'MOBİL HİZMETLER (GENEL - SES DIŞI)'), -- Ana Kategori Örneği (Eğer 107 ve 202 altında değilse)
('301', 'SMS (KISA MESAJ HİZMETİ)'),
('302', 'MMS (MULTİMEDYA MESAJ HİZMETİ)'),
('303', 'MOBİL VERİ HİZMETLERİ (İNTERNET DIŞI, ÖZEL APN VB.)'),
('304', 'MOBİL TV / MOBİL VİDEO'),
('399', 'DİĞER MOBİL HİZMETLER'),

('400', 'TV/RADYO YAYINCILIK HİZMETLERİ (GENEL)'), -- Ana Kategori Örneği
('401', 'KABLO TV YAYINCILIĞI'),
('402', 'IPTV (İNTERNET PROTOKOLÜ ÜZERİNDEN TELEVİZYON)'),
('403', 'UYDU PLATFORM HİZMETİ (DTH)'),
('404', 'KARASAL SAYISAL YAYINCILIK (DVB-T/T2)'),
('405', 'İNTERNET ÜZERİNDEN TV/RADYO (OTT TV/RADYO)'),
('406', 'MOBİL TV YAYINCILIĞI (DVB-H VB.)'),
('499', 'DİĞER TV/RADYO YAYINCILIK HİZMETLERİ'),

('500', 'VERİ MERKEZİ HİZMETLERİ (GENEL)'), -- Ana Kategori Örneği
('501', 'SUNUCU BARINDIRMA (COLOCATION)'),
('502', 'SUNUCU KİRALAMA (DEDICATED SERVER)'),
('503', 'SANAL SUNUCU (VPS/VDS)'),
('504', 'BULUT BİLİŞİM HİZMETLERİ (IaaS, PaaS, SaaS)'),
('505', 'VERİ DEPOLAMA HİZMETLERİ'),
('506', 'FELAKET KURTARMA MERKEZİ HİZMETLERİ'),
('599', 'DİĞER VERİ MERKEZİ HİZMETLERİ'),

('600', 'ALTYAPI HİZMETLERİ (GENEL)'), -- Ana Kategori Örneği
('601', 'KARANLIK FİBER KİRALAMA'),
('602', 'VERİ AKIŞ ERİŞİMİ (VAE)'),
('603', 'AYRIŞTIRILMIŞ YEREL AĞA ERİŞİM (LLU)'),
('604', 'KULE/ANTEN YERİ KİRALAMA'),
('605', 'KABLO KANALI KİRALAMA'),
('699', 'DİĞER ALTYAPI HİZMETLERİ'),

('700', 'SANAL MOBİL ŞEBEKE HİZMETİ (SMŞH / MVNO)'),
('701', 'TAM SMŞH (FULL MVNO)'),
('702', 'HAFİF SMŞH (LIGHT MVNO)'),

('800', 'DİĞER ELEKTRONİK HABERLEŞME HİZMETLERİ (GENEL)'), -- Ana Kategori Örneği
('801', 'MAKİNELER ARASI İLETİŞİM (M2M) HİZMETLERİ'),
('802', 'REHBERLİK HİZMETLERİ (118XX)'),
('803', 'ALFANUMERİK BAŞLIK (SMS BAŞLIĞI) HİZMETİ'),
('804', 'ÇAĞRI MERKEZİ HİZMETLERİ (DIŞ KAYNAKLI)'),
('999', 'TANIMLANMAMIŞ DİĞER HİZMETLER');
-- LÜTFEN VERDİĞİNİZ HİZMETLERE KARŞILIK GELEN TÜM RESMİ BTK KODLARINI EKLEYİNİZ.
-- initial_reference_data.sql - V2.0.1 - Beta (Taslak - Devamı)
-- 3. PARÇA - 2. KISIM

-- EK-4: KİMLİK TİPLERİ (KULLANICI TARAFINDAN BTK DOKÜMANINA GÖRE TAMAMLANMALI)
-- AŞAĞIDAKİLER "314_KK_Abone_Desen.pdf" DOKÜMANINDAKİ ÖRNEKLERDİR.
-- LÜTFEN BTK'NIN GÜNCEL VE TAM KİMLİK TİPİ LİSTESİNİ EKLEYİNİZ.
-- Belge Tip Kodu genellikle 1 veya 2 hanelidir. PDF'teki EK-4'e bakınız.
INSERT IGNORE INTO `mod_btk_referans_kimlik_tipleri` (`belge_tip_kodu`, `belge_adi`) VALUES
('1', 'NÜFUS CÜZDANI (ESKİ TİP)'),
('2', 'SÜRÜCÜ BELGESİ (ESKİ TİP)'),
('3', 'PASAPORT (T.C. VATANDAŞLARI İÇİN)'),
('4', 'TÜRKİYE CUMHURİYETİ KİMLİK KARTI (YENİ TİP)'),
('5', 'YABANCILARA MAHSUS İKAMET TEZKERESİ / YABANCI KİMLİK NUMARASI KARTI'),
('6', 'MAVİ KART (5901 SAYILI KANUNLA TANINAN HAKLARIN KULLANILMASINA İLİŞKİN BELGE)'),
('7', 'PASAPORT (YABANCI UYRUKLULAR İÇİN)'),
('8', 'ULUSLARARASI KORUMA BAŞVURU SAHİBİ KİMLİK BELGESİ'),
('9', 'ULUSLARARASI KORUMA STATÜ SAHİBİ KİMLİK BELGESİ'),
('10', 'GEÇİCİ KORUMA KİMLİK BELGESİ'),
('11', 'DİPLOMATİK MİSYON KİMLİK KARTI / KONSOLOSLUK KİMLİK KARTI'),
('12', 'VATANDAŞLIKTAN ÇIKMA İZİN BELGESİ (İÇİŞLERİ BAKANLIĞI TARAFINDAN VERİLEN)'),
('13', 'SÜRÜCÜ BELGESİ (YENİ TİP)'), 
('99', 'DİĞER BELGELER'); 
-- ... (Diğer tüm kimlik tipleri BTK EK-4 listesine göre buraya eklenecek) ...
-- ÖNEMLİ: Lütfen BTK'nın resmi EK-4 listesindeki tüm kimlik tiplerini ve kodlarını
-- buraya doğru bir şekilde ekleyiniz. Yukarıdaki liste sadece bir örnektir.

-- EK-5: MESLEK KODLARI (KULLANICI TARAFINDAN BTK DOKÜMANINA GÖRE TAMAMLANMALI)
-- AŞAĞIDAKİLER "314_KK_Abone_Desen.pdf" DOKÜMANINDAKİ ÖRNEKLERDİR.
-- LÜTFEN BTK'NIN GÜNCEL VE TAM MESLEK KODU LİSTESİNİ EKLEYİNİZ.
-- Meslek Kodu genellikle 3 hanelidir. PDF'teki EK-5'e bakınız.
INSERT IGNORE INTO `mod_btk_referans_meslek_kodlari` (`meslek_kodu`, `meslek_adi`) VALUES
('000', 'BİLİNMİYOR / BELİRTİLMEMİŞ'), -- Genellikle bu kod olmaz ama boş geçmemek için
('001', 'ÖĞRENCİ'),
('002', 'EV HANIMI'),
('003', 'EMEKLİ'),
('004', 'ÇALIŞMIYOR'),
('005', 'SERBEST MESLEK'),
('006', 'MEMUR (DEVLET)'),
('007', 'İŞÇİ (ÖZEL SEKTÖR)'),
('008', 'ESNAF / SANATKAR'),
('009', 'ÇİFTÇİ'),
('010', 'ASKERİ PERSONEL'),
('011', 'EMNİYET MENSUBU'),
('012', 'ÖĞRETMEN / AKADEMİSYEN'),
('013', 'SAĞLIK PERSONELİ (DOKTOR, HEMŞİRE VB.)'),
('014', 'MÜHENDİS'),
('015', 'AVUKAT / HUKUKÇU'),
('016', 'YÖNETİCİ (ÖZEL SEKTÖR)'),
('017', 'YÖNETİCİ (KAMU)'),
('018', 'SANATÇI'),
('019', 'SPORCU'),
('020', 'GAZETECİ / YAZAR'),
('021', 'MİMAR'),
('022', 'TEKNİKER / TEKNİSYEN'),
('023', 'BANKACI / FİNANSÇI'),
('024', 'TURİZMCİ'),
('025', 'ŞOFÖR'),
('026', 'GÜVENLİK GÖREVLİSİ'),
('027', 'İNŞAAT İŞÇİSİ'),
('028', 'MADENCİ'),
('029', 'DENİZCİ'),
('030', 'HAVACI'),
('031', 'DİN GÖREVLİSİ'),
('999', 'DİĞER MESLEKLER');
-- ... (Diğer tüm meslek kodları BTK EK-5 listesine göre buraya eklenecek) ...
-- ÖNEMLİ: Lütfen BTK'nın resmi EK-5 listesindeki tüm meslek kodlarını ve açıklamalarını
-- buraya doğru bir şekilde ekleyiniz. Yukarıdaki liste sadece bir örnektir.

-- initial_reference_data.sql - V2.0.1 - Beta (Taslak - Devamı)
-- 4. PARÇA - 1. KISIM

-- ADRES BİLGİLERİ
-- İLLER (TÜM İLLER EKLENECEKTİR - KULLANICI TARAFINDAN KONTROL EDİLMELİ VE GEREKİRSE GÜNCELLENMELİDİR)
-- İl kodları (plaka kodları) TUIK veya resmi kaynaklardan teyit edilebilir.
INSERT IGNORE INTO `mod_btk_adres_iller` (`il_kodu`, `il_adi`) VALUES
('01', 'ADANA'),
('02', 'ADIYAMAN'),
('03', 'AFYONKARAHİSAR'),
('04', 'AĞRI'),
('05', 'AMASYA'),
('06', 'ANKARA'),
('07', 'ANTALYA'),
('08', 'ARTVİN'),
('09', 'AYDIN'),
('10', 'BALIKESİR'),
('11', 'BİLECİK'),
('12', 'BİNGÖL'),
('13', 'BİTLİS'),
('14', 'BOLU'),
('15', 'BURDUR'),
('16', 'BURSA'),
('17', 'ÇANAKKALE'),
('18', 'ÇANKIRI'),
('19', 'ÇORUM'),
('20', 'DENİZLİ'),
('21', 'DİYARBAKIR'),
('22', 'EDİRNE'),
('23', 'ELAZIĞ'),
('24', 'ERZİNCAN'),
('25', 'ERZURUM'),
('26', 'ESKİŞEHİR'),
('27', 'GAZİANTEP'),
('28', 'GİRESUN'),
('29', 'GÜMÜŞHANE'),
('30', 'HAKKARİ'),
('31', 'HATAY'),
('32', 'ISPARTA'),
('33', 'MERSİN'),
('34', 'İSTANBUL'),
('35', 'İZMİR'),
('36', 'KARS'),
('37', 'KASTAMONU'),
('38', 'KAYSERİ'),
('39', 'KIRKLARELİ'),
('40', 'KIRŞEHİR'),
('41', 'KOCAELİ'),
('42', 'KONYA'),
('43', 'KÜTAHYA'),
('44', 'MALATYA'),
('45', 'MANİSA'),
('46', 'KAHRAMANMARAŞ'),
('47', 'MARDİN'),
('48', 'MUĞLA'),
('49', 'MUŞ'),
('50', 'NEVŞEHİR');
-- İllerin devamı bir sonraki kısımda olacak.
-- initial_reference_data.sql - V2.0.1 - Beta (Taslak - Devamı)
-- 4. PARÇA - 2. KISIM

-- İLLER (Devamı)
INSERT IGNORE INTO `mod_btk_adres_iller` (`il_kodu`, `il_adi`) VALUES
('51', 'NİĞDE'),
('52', 'ORDU'),
('53', 'RİZE'),
('54', 'SAKARYA'),
('55', 'SAMSUN'),
('56', 'SİİRT'),
('57', 'SİNOP'),
('58', 'SİVAS'),
('59', 'TEKİRDAĞ'),
('60', 'TOKAT'),
('61', 'TRABZON'),
('62', 'TUNCELİ'),
('63', 'ŞANLIURFA'),
('64', 'UŞAK'),
('65', 'VAN'),
('66', 'YOZGAT'),
('67', 'ZONGULDAK'),
('68', 'AKSARAY'),
('69', 'BAYBURT'),
('70', 'KARAMAN'),
('71', 'KIRIKKALE'),
('72', 'BATMAN'),
('73', 'ŞIRNAK'),
('74', 'BARTIN'),
('75', 'ARDAHAN'),
('76', 'IĞDIR'),
('77', 'YALOVA'),
('78', 'KARABÜK'),
('79', 'KİLİS'),
('80', 'OSMANİYE'),
('81', 'DÜZCE');

-- İLÇELER (ÖRNEK OLARAK SADECE BALIKESİR İLİNİN İLÇELERİ EKLENMİŞTİR)
-- DİĞER TÜM İLLERİN İLÇELERİ KULLANICI TARAFINDAN BU YAPIYA UYGUN OLARAK EKLENMELİDİR.
-- `il_id` için `(SELECT id FROM mod_btk_adres_iller WHERE il_kodu = 'İL_KODU')` gibi bir yapı kullanabilirsiniz.
INSERT IGNORE INTO `mod_btk_adres_ilceler` (`il_id`, `ilce_adi`) VALUES
((SELECT id FROM mod_btk_adres_iller WHERE il_kodu = '10'), 'ALTIEYLÜL'),
((SELECT id FROM mod_btk_adres_iller WHERE il_kodu = '10'), 'AYVALIK'),
((SELECT id FROM mod_btk_adres_iller WHERE il_kodu = '10'), 'BALYA'),
((SELECT id FROM mod_btk_adres_iller WHERE il_kodu = '10'), 'BANDIRMA'),
((SELECT id FROM mod_btk_adres_iller WHERE il_kodu = '10'), 'BİGADİÇ'),
((SELECT id FROM mod_btk_adres_iller WHERE il_kodu = '10'), 'BURHANİYE'),
((SELECT id FROM mod_btk_adres_iller WHERE il_kodu = '10'), 'DURSUNBEY'),
((SELECT id FROM mod_btk_adres_iller WHERE il_kodu = '10'), 'EDREMİT'),
((SELECT id FROM mod_btk_adres_iller WHERE il_kodu = '10'), 'ERDEK'),
((SELECT id FROM mod_btk_adres_iller WHERE il_kodu = '10'), 'GÖMEÇ'),
((SELECT id FROM mod_btk_adres_iller WHERE il_kodu = '10'), 'GÖNEN'),
((SELECT id FROM mod_btk_adres_iller WHERE il_kodu = '10'), 'HAVRAN'),
((SELECT id FROM mod_btk_adres_iller WHERE il_kodu = '10'), 'İVRİNDİ'),
((SELECT id FROM mod_btk_adres_iller WHERE il_kodu = '10'), 'KARESİ'),
((SELECT id FROM mod_btk_adres_iller WHERE il_kodu = '10'), 'KEPSUT'),
((SELECT id FROM mod_btk_adres_iller WHERE il_kodu = '10'), 'MANYAS'),
((SELECT id FROM mod_btk_adres_iller WHERE il_kodu = '10'), 'MARMARA'),
((SELECT id FROM mod_btk_adres_iller WHERE il_kodu = '10'), 'SAVAŞTEPE'),
((SELECT id FROM mod_btk_adres_iller WHERE il_kodu = '10'), 'SINDIRGI'),
((SELECT id FROM mod_btk_adres_iller WHERE il_kodu = '10'), 'SUSURLUK');

-- MAHALLELER/KÖYLER (ÖRNEK OLARAK SADECE BALIKESİR-AYVALIK İLÇESİNİN MAHALLELERİ EKLENECEKTİR)
-- DİĞER TÜM İLÇELERİN MAHALLELERİ KULLANICI TARAFINDAN BU YAPIYA UYGUN OLARAK EKLENMELİDİR.
-- `ilce_id` için `(SELECT id FROM mod_btk_adres_ilceler WHERE ilce_adi = 'İLÇE_ADI' AND il_id = (SELECT id FROM mod_btk_adres_iller WHERE il_kodu = 'İL_KODU'))` gibi bir yapı kullanabilirsiniz.
-- Aşağıdaki Ayvalık mahalleleri için `ilce_id` subquery ile alınacaktır.
-- (Ayvalık mahalleleri bir sonraki parçada listelenecektir.)
-- initial_reference_data.sql - V2.0.1 - Beta (Taslak - Devamı)
-- 5. PARÇA (SON PARÇA)

-- MAHALLELER/KÖYLER (ÖRNEK OLARAK SADECE BALIKESİR-AYVALIK İLÇESİNİN MAHALLELERİ EKLENMİŞTİR)
-- DİĞER TÜM İLÇELERİN MAHALLELERİ KULLANICI TARAFINDAN BU YAPIYA UYGUN OLARAK EKLENMELİDİR.
-- `ilce_id` için `(SELECT id FROM mod_btk_adres_ilceler WHERE ilce_adi = 'İLÇE_ADI' AND il_id = (SELECT id FROM mod_btk_adres_iller WHERE il_kodu = 'İL_KODU'))` gibi bir yapı kullanabilirsiniz.
-- Aşağıdaki Ayvalık mahalleleri için `ilce_id` subquery ile Balıkesir (il_kodu='10') ve Ayvalık'a bağlanacaktır.

-- Ayvalık (Balıkesir) Mahalleleri Örnekleri:
-- Not: Mahalle kodları (UAVT) ve posta kodları için güncel resmi kaynaklara başvurulmalıdır. Buradakiler örnektir.
INSERT IGNORE INTO `mod_btk_adres_mahalleler` (`ilce_id`, `mahalle_kodu`, `mahalle_adi`, `posta_kodu`) VALUES
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002001', 'ALİ ÇETİNKAYA MAH.', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002002', 'FETHİYE MAH.', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002003', 'HAMDİBEY MAH.', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002004', 'İSMETPAŞA MAH.', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002005', 'KAZIM KARABEKİR MAH.', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002006', 'MİTHATPAŞA MAH.', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002007', 'NAMIK KEMAL MAH.', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002008', 'SAKARYA MAH.', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002009', 'ZEKİBEY MAH.', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002010', '150 EVLER MAH.', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002011', 'KÜÇÜKKÖY MAH.', '10410'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002012', 'ALTINOVA MAH.', '10420'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002013', 'SAHİLKENT MAH.', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002014', 'ÇAMOBA KÖYÜ', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002015', 'TIFILLAR KÖYÜ', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002016', 'BAĞARASI KÖYÜ', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002017', 'KARAAYIT KÖYÜ', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002018', 'MURATELİ KÖYÜ', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002019', 'MUTLU KÖYÜ', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002020', 'ODABURNU KÖYÜ', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002021', 'YENİKÖY', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002022', 'AKÇAPINAR KÖYÜ', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002023', 'BEŞİKTEPE KÖYÜ', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002024', 'ÇAKMAK KÖYÜ', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002025', 'KIRCALAR KÖYÜ', '10400'),
((SELECT id FROM `mod_btk_adres_ilceler` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = (SELECT id FROM `mod_btk_adres_iller` WHERE `il_kodu` = '10')), '1002026', 'ÜÇKABAAĞAÇ KÖYÜ', '10400');
-- ... (Ayvalık'ın diğer mahalle/köyleri varsa buraya eklenecek) ...

--
-- ÖNEMLİ: Diğer tüm illerin tüm ilçelerini ve bu ilçelere bağlı tüm mahalle/köy verilerini
-- buraya eklemeniz gerekmektedir. Bu işlem için TÜİK veya NVI Adres Kayıt Sistemi
-- verilerinden faydalanabilirsiniz. Bu tablo çok büyük olacağı için,
-- sadece sık kullandığınız bölgeleri ekleyebilir veya adres girişini
-- formlar üzerinden serbest metin olarak yönetmeyi tercih edebilirsiniz.
-- Ancak BTK rapor formatı genellikle UAVT kodu (mahalle_kodu) beklemektedir.
--

SET FOREIGN_KEY_CHECKS=1; -- İlişkisel kontrolleri tekrar aktif et