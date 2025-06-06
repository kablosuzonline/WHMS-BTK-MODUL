-- modules/addons/btkreports/sql/initial_reference_data.sql
-- WHMCS BTK Raporlama Modülü v6.0.3 - Başlangıç Referans Verileri (TÜM EKLER TAMAMLANDI)

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0; -- Veri yüklerken constraint sorunlarını önlemek için

-- mod_btk_config tablosuna varsayılan bir satır ekle (eğer _activate fonksiyonu veya önceki denemeler eklemediyse diye)
INSERT IGNORE INTO `mod_btk_config` (`id`, `operator_kodu`, `operator_adi`, `operator_unvani`, `secilen_yetki_turleri`, `ftp_host`, `ftp_port`, `ftp_username`, `ftp_password`, `ftp_path_rehber`, `ftp_path_hareket`, `ftp_path_personel`, `ftp_use_ssl`, `ftp_passive_mode`, `ftp_yedek_aktif`, `ftp_host_yedek`, `ftp_port_yedek`, `ftp_username_yedek`, `ftp_password_yedek`, `ftp_path_rehber_yedek`, `ftp_path_hareket_yedek`, `ftp_path_personel_yedek`, `ftp_use_ssl_yedek`, `ftp_passive_mode_yedek`, `cron_rehber_ay`, `cron_rehber_gun_hafta`, `cron_rehber_saat`, `cron_rehber_dakika`, `cron_hareket_ay`, `cron_hareket_gun_hafta`, `cron_hareket_saat`, `cron_hareket_dakika`, `cron_personel_ay`, `cron_personel_gun_ay`, `cron_personel_saat`, `cron_personel_dakika`, `canli_hareket_saklama_gun`, `arsiv_hareket_saklama_gun`, `bos_dosya_gonder`, `sil_tablolar_kaldirirken`, `nvi_tc_dogrulama_aktif`, `nvi_yabanci_dogrulama_aktif`, `log_level`, `admin_password_confirm_timeout`, `created_at`, `updated_at`) VALUES
(1, NULL, NULL, NULL, '[]', NULL, 21, NULL, NULL, '/', '/', '/', 0, 1, 0, NULL, 21, NULL, NULL, '/', '/', '/', 0, 1, '1', '*', '10', '00', '*', '*', '01', '00', '6,12', 'L', '16', '00', 7, 180, 0, 0, 1, 1, 'INFO', 15, NOW(), NOW())
ON DUPLICATE KEY UPDATE id=id; -- Eğer satır varsa ve güncellenecekse burada belirtilir, şimdilik sadece var olmasını sağlıyoruz.

-- BTK EK-1: Hat Durum Kodları
DELETE FROM `mod_btk_ref_hat_durum_kodlari`;
INSERT INTO `mod_btk_ref_hat_durum_kodlari` (`kod`, `aciklama_btk`, `aciklama_tr`) VALUES
('1', 'AKTİF', 'Aktif'),
('2', 'İPTAL_NUMARA_DEGISIKLIGI', 'İptal - Numara Değişikliği'),
('3', 'İPTAL', 'İptal (Genel)'),
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
DELETE FROM `mod_btk_ref_musteri_hareket_kodlari`;
INSERT INTO `mod_btk_ref_musteri_hareket_kodlari` (`kod`, `aciklama_btk`, `aciklama_tr`) VALUES
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

-- BTK EK-3: Hizmet Tipleri (BTK Teknik Dokümanı EK-3'e göre TAM LİSTE)
DELETE FROM `mod_btk_ref_hizmet_tipleri`;
INSERT INTO `mod_btk_ref_hizmet_tipleri` (`isletme_tipi_btk`, `altyapi_turu_btk`, `hizmet_kodu_btk`, `aciklama_tr`) VALUES
-- MOBİL İŞLETMECİ
('MOBİL', 'Postpaid GSM', 'POSTPAID_GSM', 'Faturalı GSM Ses/SMS/MMS/Veri'),
('MOBİL', 'Prepaid GSM', 'PREPAID_GSM', 'Ön Ödemeli GSM Ses/SMS/MMS/Veri'),
('MOBİL', 'HSCSD', 'HSCSD', 'HSCSD Veri İletişimi'),
('MOBİL', 'GSM POS', 'GSMPOS', 'GSM POS (M2M)'),
('MOBİL', 'Prepaid Internet (Data hattı)', 'PREPAID_INTERNET', 'Ön Ödemeli Mobil İnternet (Data Hattı)'),
('MOBİL', 'Postpaid Internet (Data hattı)', 'POSTPAID_INTERNET', 'Faturalı Mobil İnternet (Data Hattı)'),
('MOBİL', 'Prepaid M2M', 'PREPAID_M2M', 'Ön Ödemeli M2M/IoT'),
('MOBİL', 'Postpaid M2M', 'POSTPAID_M2M', 'Faturalı M2M/IoT'),
('MOBİL', NULL, 'MOBILEARAC', 'Mobil Araç Takip/Filo Yönetimi'),
('MOBİL', NULL, 'MOBILSAGLIK', 'Mobil Sağlık Hizmetleri'),
-- SABİT İŞLETMECİ (Türk Telekom Hariç Diğer STH İşletmecileri)
('STH', NULL, 'TELEFON_STH', 'Sabit Telefon Hizmeti (Diğer STH)'),
('STH', 'xDSL', 'XDSL_STH', 'xDSL İnternet (Diğer STH)'),
('STH', 'Fiber', 'FIBER_STH', 'Fiber İnternet (Diğer STH)'),
('STH', 'Dial-Up', 'DIALUP_STH', 'Çevirmeli Ağ İnternet (Diğer STH)'),
('STH', 'Metro Ethernet', 'METRO_STH', 'Metro Ethernet (Diğer STH)'),
('STH', NULL, 'KIRDEV_STH', 'Kiralık Devre (Diğer STH)'),
('STH', NULL, 'VERIMRKZ_STH', 'Veri Merkezi Hizmeti (Diğer STH)'),
-- TT İŞLETMECİ (Türk Telekom)
('TT', NULL, 'TELEFON_TT', 'Sabit Telefon Hizmeti (Türk Telekom)'),
('TT', 'ADSL', 'ADSL_TT', 'ADSL İnternet (Türk Telekom)'),
('TT', 'VDSL', 'VDSL_TT', 'VDSL İnternet (Türk Telekom)'),
('TT', 'Fiber', 'FIBER_TT', 'Fiber İnternet (Türk Telekom)'),
('TT', 'Hipernet', 'HIPERNET_TT', 'Hipernet (Türk Telekom)'),
('TT', 'Dial-Up', 'DIALUP_TT', 'Çevirmeli Ağ İnternet (Türk Telekom)'),
('TT', 'Metro Ethernet', 'METRO_TT', 'Metro Ethernet (Türk Telekom)'),
('TT', 'SSG Internet', 'SSG_INTERNET_TT', 'SSG İnternet (Türk Telekom)'),
('TT', NULL, 'KIRDEV_TT', 'Kiralık Devre (Türk Telekom)'),
('TT', NULL, 'VERIMRKZ_TT', 'Veri Merkezi Hizmeti (Türk Telekom)'),
-- İNTERNET SERVİS SAĞLAYICILARI (ISS)
('ISS', 'xDSL (ADSL, VDSL vb.)', 'ISS_XDSL', 'ISS xDSL İnternet (ADSL, VDSL vb.)'),
('ISS', 'Fiber', 'ISS_FIBER', 'ISS Fiber İnternet'),
('ISS', 'AirFiber / Radyolink', 'ISS_AIRFIBER', 'ISS AirFiber / Radyolink İnternet'),
('ISS', 'WiFi', 'ISS_WIFI', 'ISS WiFi Kablosuz İnternet'),
('ISS', 'Dial-Up', 'ISS_DIALUP', 'ISS Çevirmeli Ağ (Dial-Up)'),
('ISS', 'Kablo İnternet', 'ISS_KABLO_NET', 'ISS Kablo İnternet'),
('ISS', 'G.SHDSL', 'ISS_GSHDSL', 'ISS G.SHDSL'),
('ISS', 'Metro Ethernet', 'ISS_METRO', 'ISS Metro Ethernet'),
('ISS', NULL, 'ISS_VERIMRKZ', 'ISS Veri Merkezi Barındırma/Kolokasyon'),
('ISS', NULL, 'ISS_WEBHOST', 'ISS Web Hosting Hizmeti'),
('ISS', NULL, 'ISS_ALANADI', 'ISS Alan Adı Tescil Hizmeti'),
-- UYDU HABERLEŞME HİZMETİ (UHH) / GMPCS İŞLETMECİSİ
('UHH', 'Uydu üzerinden internet', 'UHH_INTERNET', 'Uydu Üzerinden İnternet (UHH)'),
('UHH', 'Uydu üzerinden ses', 'UHH_SES', 'Uydu Üzerinden Ses (UHH)'),
('UHH', 'Uydu üzerinden data', 'UHH_DATA', 'Uydu Üzerinden Data (UHH)'),
('UHH', 'Uydu TV Platformu', 'UHH_TV_PLATFORM', 'Uydu TV Platform Hizmeti (UHH)'),
('UHH', 'VSAT', 'UHH_VSAT', 'VSAT Uydu Hizmeti (UHH)'),
('GMPCS', 'Mobil Uydu Ses', 'GMPCS_SES', 'GMPCS Mobil Uydu Ses'),
('GMPCS', 'Mobil Uydu Data', 'GMPCS_DATA', 'GMPCS Mobil Uydu Data'),
('GMPCS', 'Mobil Uydu SMS', 'GMPCS_SMS', 'GMPCS Mobil Uydu SMS'),
-- ALTYAPI İŞLETİM HİZMETİ (AİH)
('AİH', 'Kablo Kanal/Gözü', 'AIH_KABLO_KANAL', 'AIH Kablo Kanal/Gözü Kiralama'),
('AİH', 'Karanlık Fiber', 'AIH_KARANLIK_FIBER', 'AIH Karanlık Fiber Kiralama'),
('AIH', 'Bakır Kablo Çifti', 'AIH_BAKIR_CIFT', 'AIH Bakır Kablo Çifti Kiralama'),
('AIH', 'Radyo Link Kapasitesi', 'AIH_RADYOLINK_KAP', 'AIH Radyo Link Kapasite Kiralama'),
('AİH', 'Anten/Kule/Direk Paylaşımı', 'AIH_KULE_PAYLASIM', 'AIH Anten/Kule/Direk Paylaşımı'),
('AİH', 'Sınır Geçiş Noktası Erişim (A)', 'AIH_SINIR_GECIS_A', 'AIH Sınır Geçiş Noktası Erişim (A)'),
('AİH', 'Sınır Geçiş Noktası Erişim (B)', 'AIH_SINIR_GECIS_B', 'AIH Sınır Geçiş Noktası Erişim (B)'),
('AİH', 'Veri Merkezi Alan/Kabin', 'AIH_VERIMRKZ_ALAN', 'AIH Veri Merkezi Alan/Kabin Kiralama'),
('AİH', 'Enerji Altyapısı Paylaşımı', 'AIH_ENERJI', 'AIH Enerji Altyapısı Paylaşımı'),
('AİH', NULL, 'AIH_KIRALIK_DEVRE', 'AIH Kiralık Devre Hizmeti (Genel)');
-- Diğer hizmet tipleri dokümandan teyit edilerek eklenebilir. Örn: Sanal Mobil Şebeke Hizmeti (SMŞH) vb.

-- BTK EK-4: Kimlik Tipleri
DELETE FROM `mod_btk_ref_kimlik_tipleri`;
INSERT INTO `mod_btk_ref_kimlik_tipleri` (`belge_adi_tr`, `belge_tip_kodu_btk`) VALUES
('TC Kimlik Kartı (Yeni Çipli)', 'TCKK'), ('Nüfus Cüzdanı (Eski Tip)', 'TCNC'),
('Yabancı Kimlik Belgesi (99 ile başlayan)', 'TCYK'), ('Pasaport (TC Vatandaşları için Yeni Tip Çipli Tüm Tipler)', 'TCPC'),
('Pasaport (TC Vatandaşları için Eski Tip Umuma Mahsus - Lacivert)', 'TCPL'), ('Pasaport (TC Vatandaşları için Eski Tip Hususi - Yeşil)', 'TCPY'),
('Pasaport (TC Vatandaşları için Eski Tip Hizmet - Gri)', 'TCPG'), ('Pasaport (TC Vatandaşları için Eski Tip Diplomatik - Kırmızı)', 'TCPK'),
('Geçici Pasaport (TC Vatandaşları için)', 'TCGP'), ('Pasaport (Yabancı Uyruklular için)', 'YP'),
('Uçuş Mürettebatı Belgesi', 'AC'), ('Gemi Adamı Cüzdanı', 'GC'),
('NATO Seyahat Emri Belgesi', 'NE'), ('Mülteciler/İkincil Koruma Sahipleri/Vatansızlar İçin Seyahat Belgesi', 'SB'),
('Hudut Geçiş Belgesi (Kara/Demiryolu/Hava/Deniz)', 'HB'), ('Gemi Komutanı Onaylı Personel Listesi (Transit)', 'GK'),
('Sürücü Belgesi (Yeni ve Eski Tip TC)', 'TCSC'), ('Hakim ve Savcı Mesleki Kimlik Kartı (TC)', 'TCHS'),
('Avukatlık Kimlik Belgesi (TC)', 'TCSV'), ('Geçici Kimlik Belgesi (TC Nüfus Kayıt Örneği Geçerli)', 'TCGK'),
('Mavi Kart (TC Vatandaşlığından İzinle Çıkanlar)', 'TCMA'), ('Uluslararası Aile Cüzdanı (TC Evlilik Cüzdanı)', 'TCEV'),
('Noter Kimlik Kartı (TC)', 'TCNT'), ('Milletvekili Kimlik Kartı (TBMM)', 'TBMM'),
('Türk Silahlı Kuvvetleri Kimlik Kartı (Askeri Personel)', 'TSK'), ('Kuzey Kıbrıs Türk Cumhuriyeti Kimlik Kartı', 'KKTC');

-- BTK EK-5: Meslek Kodları (Dokümandaki tam liste)
DELETE FROM `mod_btk_ref_meslek_kodlari`;
INSERT INTO `mod_btk_ref_meslek_kodlari` (`kod_btk`, `aciklama_tr`) VALUES
('0110','Subaylar'), ('0210','Astsubaylar'), ('0310','Uzman jandarma ve uzman erbaşlar'),
('1111','Cumhurbaşkanı, milletvekilleri, bakanlar, müsteşarlar'), ('1112','Üst düzey kamu yöneticileri (genel müdür, vali vb.)'), ('1114','Siyasi parti yöneticileri'), ('1120','Şirket genel müdürleri ve icra kurulu başkanları'),
('1211','Finans müdürleri'), ('1212','İnsan kaynakları müdürleri'), ('1213','Politika ve planlama müdürleri'), ('1219','Başka yerde sınıflandırılmamış iş hizmetleri ve idare müdürleri'),
('1221','Satış ve pazarlama müdürleri'), ('1222','Reklam ve halkla ilişkiler müdürleri'), ('1223','Araştırma ve geliştirme müdürleri'),
('1311','Tarım ve ormancılık üretim müdürleri'), ('1312','Su ürünleri üretim müdürleri'),
('1321','İmalat müdürleri'), ('1322','Madencilik müdürleri'), ('1323','İnşaat müdürleri'), ('1324','Tedarik, dağıtım ve benzeri müdürler'),
('1330','Bilgi ve iletişim teknolojileri hizmetleri müdürleri'),
('1341','Çocuk bakım hizmetleri müdürleri'), ('1342','Sağlık hizmetleri müdürleri'), ('1343','Yaşlı bakım hizmetleri müdürleri'), ('1344','Sosyal hizmet müdürleri'), ('1345','Eğitim müdürleri'), ('1346','Finans ve sigorta hizmetleri şube müdürleri'), ('1349','Başka yerde sınıflandırılmamış profesyonel hizmet müdürleri'),
('1411','Otel müdürleri'), ('1412','Restoran ve diğer yiyecek içecek hizmetleri müdürleri'), ('1420','Perakende ve toptan ticaret müdürleri'),
('1431','Spor, eğlence ve dinlence merkezi müdürleri'), ('1432','Kültür merkezi müdürleri'), ('1439','Başka yerde sınıflandırılmamış diğer hizmet müdürleri'),
('2111','Fizikçiler ve astronomlar'), ('2112','Meteorologlar'), ('2113','Kimyagerler'), ('2114','Jeologlar ve jeofizikçiler'),
('2120','Matematikçiler, aktüerler ve istatistikçiler'),
('2131','Biyologlar, botanikçiler, zoologlar ve ilgili profesyoneller'), ('2132','Tarım, orman ve su ürünleri danışmanları'), ('2133','Çevre koruma profesyonelleri'),
('2141','Sanayi ve üretim mühendisleri'), ('2142','İnşaat mühendisleri'), ('2143','Çevre mühendisleri'), ('2144','Makine mühendisleri'), ('2145','Kimya mühendisleri'), ('2146','Maden, metalurji mühendisleri ve ilgili profesyoneller'), ('2149','Başka yerde sınıflandırılmamış mühendislik ile ilgili profesyoneller'),
('2151','Elektrik mühendisleri'), ('2152','Elektronik mühendisleri'), ('2153','Telekomünikasyon mühendisleri'),
('2161','Bina mimarları'), ('2162','Peyzaj mimarları'), ('2163','Ürün ve giyim eşyası tasarımcıları'), ('2164','Şehir ve trafik planlamacıları'), ('2165','Harita mühendisleri ve fotogrametri uzmanları'), ('2166','Grafik ve multimedya tasarımcıları'),
('2211','Pratisyen hekimler'), ('2212','Uzman hekimler'), ('2221','Hemşirelik profesyonelleri (eğitim dahil)'), ('2222','Ebelik profesyonelleri (eğitim dahil)'),
('2230','Geleneksel ve tamamlayıcı tıp profesyonelleri'), ('2240','Paramedikler (ATT vb.)'),
('2250','Veteriner hekimler'),
('2261','Diş hekimleri'), ('2262','Eczacılar'), ('2263','Çevre ve iş sağlığı ve hijyeni profesyonelleri'), ('2264','Fizyoterapistler'), ('2265','Diyetisyenler ve beslenme uzmanları'), ('2266','Odyologlar ve konuşma terapistleri'), ('2267','Optisyenler'), ('2269','Başka yerde sınıflandırılmamış diğer sağlık profesyonelleri'),
('2310','Üniversite ve yükseköğretim öğretim üyeleri'), ('2320','Mesleki eğitim öğretmenleri'),
('2330','Ortaöğretim öğretmenleri'), ('2341','Okul öncesi ve ilkokul öğretmenleri'), ('2342','Özel eğitim öğretmenleri'),
('2351','Eğitim metotları uzmanları'), ('2352','Müfettişler'), ('2353','Dil öğretmenleri (kursta)'), ('2354','Müzik öğretmenleri (kursta)'), ('2355','Sanat öğretmenleri (kursta)'), ('2356','Bilgisayar eğitmenleri (kursta)'), ('2359','Başka yerde sınıflandırılmamış eğitim ile ilgili profesyoneller'),
('2411','Muhasebeciler'), ('2412','Finansal ve yatırım danışmanları'), ('2413','Finansal analistler'),
('2421','Yönetim ve organizasyon analistleri'), ('2422','Politika analistleri'), ('2423','Personel ve kariyer profesyonelleri'), ('2424','Eğitim ve meslek danışmanları'),
('2431','Reklam ve pazarlama profesyonelleri'), ('2432','Halkla ilişkiler profesyonelleri'), ('2433','Teknik ve tıbbi satış profesyonelleri (BİT hariç)'), ('2434','Bilgi ve iletişim teknolojileri satış profesyonelleri'),
('2511','Sistem analistleri'), ('2512','Yazılım geliştiricileri'), ('2513','Web ve multimedya geliştiricileri'), ('2514','Uygulama programcıları'), ('2519','Başka yerde sınıflandırılmamış yazılım ve uygulama geliştiricileri ve analistleri'),
('2521','Veri tabanı tasarımcıları ve yöneticileri'), ('2522','Sistem yöneticileri'), ('2523','Bilgisayar ağı profesyonelleri'), ('2529','Başka yerde sınıflandırılmamış veri tabanı ve ağ profesyonelleri'),
('2611','Avukatlar'), ('2612','Hakimler'), ('2619','Başka yerde sınıflandırılmamış hukuk ile ilgili profesyoneller (savcı, noter dahil)'),
('2621','Arşivciler ve küratörler'), ('2622','Kütüphaneciler ve diğer bilgi profesyonelleri'),
('2631','Ekonomistler'), ('2632','Sosyologlar, antropologlar ve ilgili profesyoneller'), ('2633','Felsefeciler, tarihçiler ve siyaset bilimcileri'), ('2634','Psikologlar'), ('2635','Sosyal hizmet uzmanları ve danışmanlar'), ('2636','Din ile ilgili profesyoneller'),
('2641','Yazarlar ve ilgili yazınsal elemanlar'), ('2642','Gazeteciler'), ('2643','Tercümanlar (yazılı ve sözlü) ve diğer dilbilimciler'),
('2651','Görsel sanatçılar'), ('2652','Müzisyenler, şarkıcılar ve besteciler'), ('2653','Dansçılar ve koreograflar'), ('2654','Film, sahne vb. yönetmenleri ve yapımcıları'), ('2655','Aktörler'), ('2656','Spikerler (radyo, televizyon ve diğer medya)'), ('2659','Başka yerde sınıflandırılmamış yaratıcı ve sahne sanatçıları'),
('3111','Kimya ve fizik bilimleri teknisyenleri'), ('3112','İnşaat mühendisliği teknisyenleri'), ('3113','Elektrik mühendisliği teknisyenleri'), ('3114','Elektronik mühendisliği teknisyenleri'), ('3115','Makine mühendisliği teknisyenleri'), ('3116','Kimya mühendisliği teknisyenleri'), ('3117','Madencilik ve metalurji teknisyenleri'), ('3118','Çizimci (Teknik Ressam)'), ('3119','Başka yerde sınıflandırılmamış fizik ve mühendislik bilimleri teknisyenleri'),
('3121','Maden süpervizörleri'), ('3122','İmalat süpervizörleri'), ('3123','İnşaat süpervizörleri'),
('3131','Enerji üretim tesisi operatörleri'), ('3132','Çöp yakma ve su arıtma tesisi operatörleri'), ('3133','Kimyasal işlem kontrol teknisyenleri'), ('3134','Petrol ve doğal gaz rafineri tesisi operatörleri'), ('3135','Metal üretim işlemi kontrol teknisyenleri'), ('3139','Başka yerde sınıflandırılmamış işlem kontrol teknisyenleri'),
('3141','Yaşam bilimleri teknisyenleri (tıp hariç)'), ('3142','Ziraat teknisyenleri'), ('3143','Ormancılık teknisyenleri'),
('3151','Gemi makine zabitleri'), ('3152','Gemi güverte Kaptan-ı Süvarileri ve Kılavuz Kaptanları'), ('3153','Hava pilotları ve ilgili yardımcı profesyoneller'), ('3154','Hava trafik kontrolörleri'), ('3155','Hava trafik emniyeti elektronik teknisyenleri'),
('3211','Tıbbi görüntüleme ve tedavi edici cihaz teknisyenleri'), ('3212','Tıbbi ve patoloji laboratuvarı teknisyenleri'), ('3213','Eczacılık teknisyenleri ve yardımcıları'), ('3214','Tıbbi ve diş protez teknisyenleri'),
('3221','Hemşirelik yardımcı profesyonelleri'), ('3222','Ebelik yardımcı profesyonelleri'),
('3230','Geleneksel ve tamamlayıcı tıp ile ilgili yardımcı profesyonel meslek mensupları'),
('3240','Veteriner teknisyenleri ve yardımcıları'),
('3251','Diş teknisyenleri ve terapistleri'), ('3252','Tıbbi kayıtlar ve sağlık bilgisi teknisyenleri'), ('3253','Toplum sağlığı çalışanları'), ('3254','Optisyenler'), ('3255','Fizyoterapi teknisyenleri ve yardımcıları'), ('3256','Tıbbi Asistanlar'), ('3257','Çevre ve iş sağlığı müfettişleri ve yardımcıları'), ('3258','Ambulans çalışanları (Acil Tıp Teknisyeni)'), ('3259','Başka yerde sınıflandırılmamış yardımcı sağlık profesyonelleri'),
('3311','Menkul kıymetler ve finans aracıları ve sensörleri'), ('3312','Kredi ve borç verme (kambiyo) memurları'), ('3313','Muhasebe yardımcı profesyonelleri'), ('3314','İstatistik, matematik ve ilgili yardımcı profesyoneller'), ('3315','Değerleme ve kayıp tespit uzmanları'),
('3321','Sigorta temsilcileri'), ('3322','Ticari satış temsilcileri'), ('3323','Satın alma uzmanları'), ('3324','Ticaret komisyoncuları'),
('3331','Gümrük ve sınır muayene memurları'), ('3332','Konferans ve etkinlik planlayıcıları'), ('3333','Emlakçılar'), ('3334','İstihdam ve işe alım uzmanları'), ('3339','Başka yerde sınıflandırılmamış iş hizmetleri aracıları'),
('3341','Büro süpervizörleri'), ('3342','Hukuk sekreterleri'), ('3343','İdari ve yönetici sekreterler'), ('3344','Tıp sekreterleri'),
('3351','Gümrük ve vergi müfettişleri'), ('3352','Devlet lisans müfettişleri'), ('3353','Sosyal yardım ve emeklilik müfettişleri'), ('3354','Sağlık ve güvenlik müfettişleri'), ('3355','Polis müfettişleri ve dedektifler'), ('3359','Başka yerde sınıflandırılmamış düzenleyici devlet ile ilgili yardımcı profesyoneller'),
('3411','Hukuk ve ilgili yardımcı profesyonel meslek mensupları'), ('3412','Sosyal hizmet uzman yardımcıları'), ('3413','Din ile ilgili yardımcı profesyonel meslek mensupları'),
('3421','Sporcular ve atletler'), ('3422','Spor antrenörleri, eğiticileri ve hakemleri'), ('3423','Fitness ve eğlence (rekreasyon) liderleri ve eğiticileri'),
('3431','Fotoğrafçılar'), ('3432','İç mimarlar ve dekoratörler'), ('3433','Galericiler, kütüphaneciler ve müze teknisyenleri'), ('3434','Aşçılar (Profesyonel)'), ('3435','Diğer sanat, kültür ve mutfak ile ilgili yardımcı profesyonel meslek mensupları'),
('3511','Bilgi ve iletişim teknolojileri işletim teknisyenleri'), ('3512','Bilgi ve iletişim teknolojileri kullanıcı destek teknisyenleri'), ('3513','Bilgisayar ağı ve sistem teknisyenleri'), ('3514','Web teknisyenleri'),
('3521','Yayın ve görsel-işitsel teknisyenler'), ('3522','Telekomünikasyon mühendisliği teknisyenleri'),
('4110','Genel büro memurları'), ('4120','Sekreterler (genel)'),
('4131','Daktilograflar ve kelime işlemciler'), ('4132','Veri giriş operatörleri'),
('4211','Banka ve postane veznedarları'), ('4212','Bahis ve kumarhane veznedarları'), ('4213','Rehinci'), ('4214','Para tahsildarları ve benzerleri'),
('4221','Seyahat danışmanları ve memurları'), ('4222','Danışma merkezi bilgi memurları'), ('4223','Anketörler ve pazar araştırmacıları'), ('4224','Resepsiyonistler (genel)'), ('4225','Çağrı merkezi bilgi memurları'), ('4226','Müşteri hizmetleri memurları'), ('4229','Başka yerde sınıflandırılmamış müşteri danışma memurları'),
('4311','Muhasebe ve kayıt memurları'), ('4312','İstatistik, finans ve sigorta memurları'), ('4313','Bordro memurları'),
('4321','Stok ve depolama memurları'), ('4322','Üretim memurları'), ('4323','Ulaştırma memurları'),
('4411','Kütüphane memurları'), ('4412','Posta ve tasnif memurları'), ('4413','Kodlama, tashih ve ilgili memurlar'), ('4414','Personel işleri memurları'), ('4415','Dosyalama memurları'), ('4416','Taşımacılık ve lojistik memurları'), ('4419','Başka yerde sınıflandırılmamış diğer büro hizmetleri memurları'),
('5111','Uçuş görevlileri'), ('5112','Tren kondüktörleri'), ('5113','Seyahat rehberleri'),
('5120','Aşçılar (Kurumsal olmayan)'),
('5131','Garsonlar'), ('5132','Barmenler'),
('5141','Kuaförler'), ('5142','Güzellik uzmanları ve ilgili çalışanlar'),
('5151','Temizlik ve bakım işleri amirleri (ev, otel ve büro)'), ('5152','Ev kahyaları'), ('5153','Kapıcılar, apartman görevlileri ve bina görevlileri'),
('5161','Astrologlar, falcılar ve ilgili çalışanlar'), ('5162','Refakatçiler'), ('5163','Cenaze işleri ve mezarlık görevlileri'), ('5164','Evcil hayvan bakıcıları ve hayvan eğiticileri'), ('5165','Sürüş eğitmenleri'), ('5169','Başka yerde sınıflandırılmamış kişisel hizmetler veren elemanlar'),
('5211','Tezgah ve pazar satıcıları (gıda)'), ('5212','Sokak satıcıları (gıda dışı)'),
('5221','Dükkan sahipleri (küçük)'), ('5222','Mağaza ve dükkan satış sorumluları'), ('5223','Mağaza, dükkan vb. yerlerde çalışan satış elemanları'),
('5230','Kasiyerler'),
('5241','Mankenler ve diğer tanıtım elemanları'), ('5242','Doğrudan satış elemanları (kapıdan)'), ('5243','Telefonla satış elemanları'), ('5244','Servis istasyonu görevlileri'), ('5245','Yiyecek-içecek servis elemanları (self servis)'), ('5246','Gıda tezgah görevlileri (fast-food)'), ('5249','Başka yerde sınıflandırılmamış satış elemanları'),
('5311','Çocuk bakıcıları ve yardımcıları'), ('5312','Öğretmen yardımcıları'),
('5321','Sağlık bakım yardımcıları (kurumsal)'), ('5322','Evde kişisel bakım çalışanları'), ('5329','Başka yerde sınıflandırılmamış sağlık hizmetlerinde kişisel bakım çalışanları'),
('5411','İtfaiyeciler'), ('5412','Polis memurları'), ('5413','Gardiyanlar'), ('5414','Güvenlik görevlileri'), ('5419','Başka yerde sınıflandırılmamış koruma hizmetleri çalışanları'),
('6111','Pazara yönelik bahçıvanlar ve bitkisel ürün yetiştiricileri'), ('6112','Pazara yönelik hayvan yetiştiricileri'),
('6113','Pazara yönelik karma bitki ve hayvan yetiştiricileri'), ('6114','Tarla ürünleri ve sebze yetiştiricileri (Diğer)'),
('6210','Ormancılık ve ilgili işlerde çalışanlar'), ('6221','Su ürünleri yetiştiriciliği çalışanları'),
('6222','İç sular ve kıyı balıkçıları'), ('6223','Açık deniz balıkçıları'), ('6224','Avcılar ve tuzakçılar (profesyonel)'),
('6310','Kendi geçimine yönelik tarla ve sebze yetiştiricileri'), ('6320','Kendi geçimine yönelik hayvan yetiştiricileri'),
('6330','Kendi geçimine yönelik karma bitki ve hayvan yetiştiricileri'), ('6340','Kendi geçimine yönelik balıkçılar, avcılar, tuzakçılar ve toplayıcılar'),
('7111','Ev inşaatçıları'), ('7112','Duvarcılar ve ilgili çalışanlar'), ('7113','Taş ustaları (inşaat)'), ('7114','Betoncular ve ilgili çalışanlar'), ('7115','Doğramacılar ve marangozlar (inşaat)'), ('7119','Başka yerde sınıflandırılmamış kaba inşaat ve ilgili işlerde çalışanlar'),
('7121','Çatı ustaları'), ('7122','Yer ve duvar döşemecileri'), ('7123','Sıvacılar'), ('7124','Yalıtımcılar'), ('7125','Camcılar'), ('7126','Sıhhi tesisatçılar ve boru tesisatçıları'), ('7127','Klima ve soğutma sistemi montajcıları ve tamircileri'),
('7131','Badanacılar ve benzeri işlerde çalışanlar'), ('7132','Boya püskürtücüler ve cilacılar'), ('7133','Bina ve diğer yapı temizleyicileri'),
('7211','Metal kalıpçılar ve maçacılar'), ('7212','Kaynakçılar ve oksijenli kesiciler'), ('7213','Metal levha işçileri'), ('7214','Metal yapı malzemesi hazırlayıcıları ve kurucuları'), ('7215','Halat, kablo çekicileri ve ekleyicileri'),
('7221','Demirciler ve ilgili işlerde çalışanlar'), ('7222','Alet yapımcıları ve ilgili çalışanlar'), ('7223','Metal makine ve alet kurucuları ve ayarlayıcıları'), ('7224','Metal parlatıcılar, taşlayıcılar ve kalıpçılar'),
('7231','Motorlu taşıt bakım ve onarımcıları'), ('7232','Hava taşıtı motor bakım ve onarımcıları'), ('7233','Tarım ve sanayi makineleri bakım ve onarımcıları'), ('7234','Bisiklet ve ilgili tamirciler'),
('7311','Hassas alet ve cihaz yapımcıları ve tamircileri'), ('7312','Müzik aleti yapımcıları ve tamircileri'), ('7313','Mücevher ve değerli metal işleyicileri'), ('7314','Çömlekçiler ve ilgili çalışanlar (porselen ve aşındırıcı maddeler dahil)'), ('7315','Cam kesiciler, kalıpçılar, şekillendiriciler, taşlayıcılar ve perdahçılar'), ('7316','Tabela yapımcıları, dekoratif boyacılar, gravürcüler ve hakkaklar'), ('7317','El sanatları çalışanları (ağaç, sepet ve ilgili malzemeler)'), ('7318','El sanatları çalışanları (tekstil, deri ve ilgili malzemeler)'), ('7319','Başka yerde sınıflandırılmamış el sanatları çalışanları'),
('7321','Baskı öncesi teknisyenleri'), ('7322','Basımcılar'), ('7323','Baskı sonrası ve ciltleme çalışanları'),
('7411','Bina ve ilgili elektrik tesisatçıları ve tamircileri'), ('7412','Elektrik hat montajcıları ve tamircileri'), ('7413','Elektrikli taşıt ve teleferik hat montajcıları ve tamircileri'),
('7421','Elektronik mekanikçileri ve servis elemanları'), ('7422','Bilgi ve iletişim teknolojileri (BİT) kurulumcuları ve servis elemanları'),
('7511','Kasaplar, balıkçılar ve ilgili gıda hazırlama işlerinde çalışanlar'), ('7512','Fırıncılar, pastacılar ve şekerleme imalatçıları'), ('7513','Süt ve süt ürünleri imalatçıları'), ('7514','Meyve, sebze ve ilgili ürünleri muhafaza edenler'), ('7515','Gıda ve içecek tadımcıları ve derecelendiricileri'), ('7516','Tütün hazırlayıcıları ve tütün imalatçıları'),
('7521','Ağaç işleyicileri ve ahşap muamelecileri'), ('7522','Doğramacılar ve ilgili işlerde çalışanlar'), ('7523','Ahşap işleme makineleri ayarlayıcıları ve operatörleri'),
('7531','Tekstil elyaf hazırlayıcıları, eğiricileri ve bükücüleri'), ('7532','Dokumacılar, örücüler ve ilgili çalışanlar'), ('7533','Terziler, kürkçüler ve şapkacılar'), ('7534','Döşemeciler ve ilgili çalışanlar'), ('7535','Deri ve kürk kalıpçıları ve kesicileri'), ('7536','Ayakkabıcılar ve ilgili çalışanlar'),
('7541','Dalgıçlar'), ('7542','Patlayıcı madde kullanıcıları'), ('7543','Ürün derecelendiricileri ve test edicileri (gıda ve içecekler hariç)'), ('7544','İlaçlama ve haşere kontrolü yapanlar'), ('7549','Başka yerde sınıflandırılmamış diğer sanatkarlar ve ilgili işlerde çalışanlar'),
('8111','Madencilik tesisi operatörleri'), ('8112','Mineral ve taş işleme tesisi operatörleri'), ('8113','Kuyucular, sondajcılar ve ilgili çalışanlar'), ('8114','Çimento, taş ve diğer mineral ürünleri makine operatörleri'),
('8121','Metal eritme, dönüştürme ve arıtma fırını operatörleri'), ('8122','Metal dökümcüleri, kalıpçıları ve maçacıları'), ('8123','Metal ısıl işlem tesisi operatörleri'), ('8124','Metal çekme ve pres makinesi operatörleri'),
('8131','Kimyasal işlem tesisi kontrol ve makine operatörleri'), ('8132','Fotoğrafik ürünler makine operatörleri'),
('8141','Kauçuk ürünleri makine operatörleri'), ('8142','Plastik ürünleri makine operatörleri'), ('8143','Kağıt ürünleri makine operatörleri'),
('8151','Elyaf hazırlama, eğirme ve bükme makinesi operatörleri'), ('8152','Dokuma ve örme makinesi operatörleri'), ('8153','Dikiş makinesi operatörleri'), ('8154','Ağartma, boyama ve temizleme makinesi operatörleri (tekstil, kürk, deri)'), ('8155','Kürk ve deri hazırlama makinesi operatörleri'), ('8156','Ayakkabı imalat ve ilgili makine operatörleri'), ('8157','Çamaşırhane makinesi operatörleri'), ('8159','Başka yerde sınıflandırılmamış tekstil, kürk ve deri ürünleri makine operatörleri'),
('8160','Gıda ve ilgili ürünlerin makine operatörleri'),
('8171','Kağıt hamuru ve kağıt imalat tesisi operatörleri'), ('8172','Ağaç işleme tesisi operatörleri'),
('8181','Cam ve seramik tesisi operatörleri'), ('8182','Buhar makinesi ve kazan operatörleri'), ('8183','Ambalajlama, şişeleme ve etiketleme makinesi operatörleri'), ('8189','Başka yerde sınıflandırılmamış sabit tesis ve makine operatörleri'),
('8211','Mekanik makine montajcıları'), ('8212','Elektrikli ve elektronik ekipman montajcıları'), ('8219','Başka yerde sınıflandırılmamış montajcılar'),
('8311','Demiryolu lokomotif makinisti'), ('8312','Demiryolu ve metro fren, işaret ve makas görevlileri'),
('8321','Motosiklet sürücüleri'), ('8322','Otomobil, taksi ve kamyonet sürücüleri'),
('8331','Otobüs ve tramvay sürücüleri'), ('8332','Ağır kamyon ve tır şoförleri'),
('8341','Tarım ve ormancılık makineleri operatörleri'), ('8342','Hafriyat makineleri operatörleri'), ('8343','Vinç, bocurgat ve ilgili tesis operatörleri'), ('8344','Forklift ve benzeri yükleme boşaltma araçları operatörleri'),
('8350','Gemi güverte mürettebatı ve ilgili çalışanlar'),
('9111','Evlerde çalışan temizlikçiler ve yardımcılar'), ('9112','Otel, büro vb. yerlerde çalışan temizlikçiler ve yardımcılar'),
('9121','Elle çamaşır yıkayıcılar ve ütücüler'), ('9122','Taşıt temizleyicileri'), ('9123','Pencere temizleyicileri'), ('9129','Başka yerde sınıflandırılmamış diğer temizlikçiler'),
('9211','Tarım, bahçıvanlık, hayvancılık ve su ürünleri yetiştiriciliği sektörlerinde gündelikçiler'),
('9212','Ormancılık sektöründe gündelikçiler'), ('9213','Balıkçılık ve avcılık sektörlerinde gündelikçiler'),
('9311','Madencilik ve taş ocakçılığı sektörlerinde nitelik gerektirmeyen işlerde çalışanlar'), ('9312','İnşaat ve bakım işlerinde nitelik gerektirmeyen işlerde çalışanlar (yol, baraj vb.)'),
('9313','Bina inşaatlarında nitelik gerektirmeyen işlerde çalışanlar'), ('9321','Elle paketleyiciler'),
('9329','Başka yerde sınıflandırılmamış imalat sektöründe nitelik gerektirmeyen işlerde çalışanlar'),
('9331','El ve pedallı taşıt sürücüleri'), ('9332','Hayvan gücüyle çekilen taşıt ve teçhizat sürücüleri'),
('9333','Yükleme boşaltma işlerinde nitelik gerektirmeyen işlerde çalışanlar'), ('9334','Raf düzenleyicileri'),
('9411','Fast food hazırlayıcıları'), ('9412','Mutfak yardımcıları'),
('9510','Cadde ve sokaklarda hizmet verenler (temizlik, ayakkabı boyama vb.)'), ('9520','Sokak satıcıları (gıda dışı) (işportacılar)'),
('9611','Çöpçüler'), ('9612','Atık ve hurda toplayıcıları'), ('9613','Sokak süpürücüleri ve ilgili çalışanlar'),
('9621','Ulaklar, paket dağıtıcıları ve valiz taşıyıcıları'), ('9622','İşçi (gündelikçi)'),
('9623','Sayaç okuyucuları ve otomat para toplayıcıları'), ('9624','Su ve odun toplayıcıları'),
('9629','Başka yerde sınıflandırılmamış diğer nitelik gerektirmeyen işlerde çalışanlar'),
('XXXX','Diğer/Bilinmiyor/Uygulanamaz','Diğer/Bilinmiyor/Uygulanamaz'); -- BTK dokümanında olmasa da, bir default gerekebilir.

-- Adres Verileri - İller (81 İl)
DELETE FROM `mod_btk_adres_il`;
INSERT IGNORE INTO `mod_btk_adres_il` (`plaka_kodu`, `il_adi`) VALUES
('01', 'ADANA'), ('02', 'ADIYAMAN'), ('03', 'AFYONKARAHİSAR'), ('04', 'AĞRI'), ('05', 'AMASYA'), ('06', 'ANKARA'), ('07', 'ANTALYA'), ('08', 'ARTVİN'), ('09', 'AYDIN'), ('10', 'BALIKESİR'),
('11', 'BİLECİK'), ('12', 'BİNGÖL'), ('13', 'BİTLİS'), ('14', 'BOLU'), ('15', 'BURDUR'), ('16', 'BURSA'), ('17', 'ÇANAKKALE'), ('18', 'ÇANKIRI'), ('19', 'ÇORUM'), ('20', 'DENİZLİ'),
('21', 'DİYARBAKIR'), ('22', 'EDİRNE'), ('23', 'ELAZIĞ'), ('24', 'ERZİNCAN'), ('25', 'ERZURUM'), ('26', 'ESKİŞEHİR'), ('27', 'GAZİANTEP'), ('28', 'GİRESUN'), ('29', 'GÜMÜŞHANE'), ('30', 'HAKKARİ'),
('31', 'HATAY'), ('32', 'ISPARTA'), ('33', 'MERSİN'), ('34', 'İSTANBUL'), ('35', 'İZMİR'), ('36', 'KARS'), ('37', 'KASTAMONU'), ('38', 'KAYSERİ'), ('39', 'KIRKLARELİ'), ('40', 'KIRŞEHİR'),
('41', 'KOCAELİ'), ('42', 'KONYA'), ('43', 'KÜTAHYA'), ('44', 'MALATYA'), ('45', 'MANİSA'), ('46', 'KAHRAMANMARAŞ'), ('47', 'MARDİN'), ('48', 'MUĞLA'), ('49', 'MUŞ'), ('50', 'NEVŞEHİR'),
('51', 'NİĞDE'), ('52', 'ORDU'), ('53', 'RİZE'), ('54', 'SAKARYA'), ('55', 'SAMSUN'), ('56', 'SİİRT'), ('57', 'SİNOP'), ('58', 'SİVAS'), ('59', 'TEKİRDAĞ'), ('60', 'TOKAT'),
('61', 'TRABZON'), ('62', 'TUNCELİ'), ('63', 'ŞANLIURFA'), ('64', 'UŞAK'), ('65', 'VAN'), ('66', 'YOZGAT'), ('67', 'ZONGULDAK'), ('68', 'AKSARAY'), ('69', 'BAYBURT'), ('70', 'KARAMAN'),
('71', 'KIRIKKALE'), ('72', 'BATMAN'), ('73', 'ŞIRNAK'), ('74', 'BARTIN'), ('75', 'ARDAHAN'), ('76', 'IĞDIR'), ('77', 'YALOVA'), ('78', 'KARABÜK'), ('79', 'KİLİS'), ('80', 'OSMANİYE'),
('81', 'DÜZCE');

-- Adres Verileri - Balıkesir İlçeleri
SET @balikesir_il_id_val = (SELECT id FROM `mod_btk_adres_il` WHERE `plaka_kodu` = '10' LIMIT 1);
DELETE FROM `mod_btk_adres_ilce` WHERE `il_id` = IFNULL(@balikesir_il_id_val, -1);
INSERT IGNORE INTO `mod_btk_adres_ilce` (`il_id`, `ilce_adi`) VALUES
(IFNULL(@balikesir_il_id_val, 0), 'ALTIEYLÜL'), (IFNULL(@balikesir_il_id_val, 0), 'AYVALIK'), (IFNULL(@balikesir_il_id_val, 0), 'BALYA'), (IFNULL(@balikesir_il_id_val, 0), 'BANDIRMA'),
(IFNULL(@balikesir_il_id_val, 0), 'BİGADİÇ'), (IFNULL(@balikesir_il_id_val, 0), 'BURHANİYE'), (IFNULL(@balikesir_il_id_val, 0), 'DURSUNBEY'), (IFNULL(@balikesir_il_id_val, 0), 'EDREMİT'),
(IFNULL(@balikesir_il_id_val, 0), 'ERDEK'), (IFNULL(@balikesir_il_id_val, 0), 'GÖMEÇ'), (IFNULL(@balikesir_il_id_val, 0), 'GÖNEN'), (IFNULL(@balikesir_il_id_val, 0), 'HAVRAN'),
(IFNULL(@balikesir_il_id_val, 0), 'İVRİNDİ'), (IFNULL(@balikesir_il_id_val, 0), 'KARESİ'), (IFNULL(@balikesir_il_id_val, 0), 'KEPSUT'), (IFNULL(@balikesir_il_id_val, 0), 'MANYAS'),
(IFNULL(@balikesir_il_id_val, 0), 'MARMARA'), (IFNULL(@balikesir_il_id_val, 0), 'SAVAŞTEPE'), (IFNULL(@balikesir_il_id_val, 0), 'SINDIRGI'), (IFNULL(@balikesir_il_id_val, 0), 'SUSURLUK');

-- Adres Verileri - Ayvalık Mahalleleri (Bu liste güncel resmi kaynaktan teyit edilmelidir)
SET @ayvalik_ilce_id_val = (SELECT id FROM `mod_btk_adres_ilce` WHERE `ilce_adi` = 'AYVALIK' AND `il_id` = IFNULL(@balikesir_il_id_val, -1) LIMIT 1);
DELETE FROM `mod_btk_adres_mahalle` WHERE `ilce_id` = IFNULL(@ayvalik_ilce_id_val, -1);
INSERT IGNORE INTO `mod_btk_adres_mahalle` (`ilce_id`, `mahalle_adi`, `posta_kodu`) VALUES
(IFNULL(@ayvalik_ilce_id_val, 0), '150 EVLER MAHALLESİ', '10400'), (IFNULL(@ayvalik_ilce_id_val, 0), 'ALİ ÇETİNKAYA MAHALLESİ', '10400'),
(IFNULL(@ayvalik_ilce_id_val, 0), 'ALİBEYADASI MAHALLESİ', '10405'), (IFNULL(@ayvalik_ilce_id_val, 0), 'ALTINOVA MAHALLESİ', '10415'),
(IFNULL(@ayvalik_ilce_id_val, 0), 'ATATÜRK MAHALLESİ', '10400'), (IFNULL(@ayvalik_ilce_id_val, 0), 'BAĞYÜZÜ MAHALLESİ', '10420'),
(IFNULL(@ayvalik_ilce_id_val, 0), 'BEŞİKTEPE MAHALLESİ', '10400'), (IFNULL(@ayvalik_ilce_id_val, 0), 'BULUTÇEŞME MAHALLESİ', '10400'),
(IFNULL(@ayvalik_ilce_id_val, 0), 'ÇAKMAK MAHALLESİ', '10420'), (IFNULL(@ayvalik_ilce_id_val, 0), 'ÇAMOBA MAHALLESİ', '10400'),
(IFNULL(@ayvalik_ilce_id_val, 0), 'FEVZİPAŞA-VEHBİBEY MAHALLESİ', '10400'), (IFNULL(@ayvalik_ilce_id_val, 0), 'GAZİKEMALPAŞA MAHALLESİ', '10400'),
(IFNULL(@ayvalik_ilce_id_val, 0), 'HACIVELİLER MAHALLESİ', '10400'), (IFNULL(@ayvalik_ilce_id_val, 0), 'HAMDİBEY MAHALLESİ', '10400'),
(IFNULL(@ayvalik_ilce_id_val, 0), 'HAYRETTİNPAŞA MAHALLESİ', '10400'), (IFNULL(@ayvalik_ilce_id_val, 0), 'İSMETPAŞA MAHALLESİ', '10400'),
(IFNULL(@ayvalik_ilce_id_val, 0), 'KAZIM KARABEKİR MAHALLESİ', '10400'), (IFNULL(@ayvalik_ilce_id_val, 0), 'KEMALPAŞA MAHALLESİ', '10400'),
(IFNULL(@ayvalik_ilce_id_val, 0), 'KÜÇÜKKÖY MAHALLESİ', '10410'), (IFNULL(@ayvalik_ilce_id_val, 0), 'MİTHATPAŞA MAHALLESİ', '10405'),
(IFNULL(@ayvalik_ilce_id_val, 0), 'MURATELİ MAHALLESİ', '10420'), (IFNULL(@ayvalik_ilce_id_val, 0), 'MUTLU MAHALLESİ', '10420'),
(IFNULL(@ayvalik_ilce_id_val, 0), 'NAMIK KEMAL MAHALLESİ', '10405'), (IFNULL(@ayvalik_ilce_id_val, 0), 'ODABURNU MAHALLESİ', '10400'),
(IFNULL(@ayvalik_ilce_id_val, 0), 'SAHİLKENT MAHALLESİ', '10400'), (IFNULL(@ayvalik_ilce_id_val, 0), 'SAKARYA MAHALLESİ', '10400'),
(IFNULL(@ayvalik_ilce_id_val, 0), 'SARIMSAKLI MAHALLESİ', '10410'), (IFNULL(@ayvalik_ilce_id_val, 0), 'SÖBEÇİMEN MAHALLESİ', '10400'),
(IFNULL(@ayvalik_ilce_id_val, 0), 'TURGUTREİS MAHALLESİ', '10400'), (IFNULL(@ayvalik_ilce_id_val, 0), 'TUZLA MAHALLESİ', '10400'),
(IFNULL(@ayvalik_ilce_id_val, 0), 'ÜÇKABAAĞAÇ MAHALLESİ', '10420'), (IFNULL(@ayvalik_ilce_id_val, 0), 'YAĞCILAR MAHALLESİ', '10400'),
(IFNULL(@ayvalik_ilce_id_val, 0), 'YENİ MAHALLE', '10400'), (IFNULL(@ayvalik_ilce_id_val, 0), 'YENİKÖY MAHALLESİ', '10420'),
(IFNULL(@ayvalik_ilce_id_val, 0), 'ZEKİBEY MAHALLESİ', '10400');

SET FOREIGN_KEY_CHECKS = 1;