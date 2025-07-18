<?php
/**
 * WHMCS BTK Raporlama Modülü - Türkçe Dil Dosyası
 * Sürüm: 8.1.0 (Yeniden Doğuş)
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    8.1.0
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

$_ADDONLANG = [];

// ==================================================================
// == BÖLÜM 1: GENEL VE ORTAK KULLANIM
// ==================================================================
$_ADDONLANG['moduleName'] = "BTK Raporlama Modülü";
$_ADDONLANG['saveChanges'] = "Değişiklikleri Kaydet";
$_ADDONLANG['saveButton'] = "Kaydet";
$_ADDONLANG['cancelButton'] = "İptal";
$_ADDONLANG['closeButton'] = "Kapat";
$_ADDONLANG['editButton'] = "Düzenle";
$_ADDONLANG['deleteButton'] = "Sil";
$_ADDONLANG['confirmButton'] = "Onayla"; 
$_ADDONLANG['actionsHeader'] = "İşlemler";
$_ADDONLANG['statusLabel'] = "Durum";
$_ADDONLANG['yes'] = "Evet";
$_ADDONLANG['no'] = "Hayır";
$_ADDONLANG['active'] = "Aktif"; 
$_ADDONLANG['passive'] = "Pasif";
$_ADDONLANG['selectOption'] = "Lütfen Seçiniz...";
$_ADDONLANG['notAvailable'] = "Belirtilmemiş";
$_ADDONLANG['notConfigured'] = "Yapılandırılmamış";
$_ADDONLANG['loadingData'] = "Veri Yükleniyor...";
$_ADDONLANG['noDataFound'] = "Veri Bulunamadı";
$_ADDONLANG['ajaxRequestFailed'] = "Sunucu isteği başarısız oldu. Lütfen tekrar deneyin.";
$_ADDONLANG['errorOccurred'] = "Bir hata oluştu.";
$_ADDONLANG['csrfTokenError'] = "Geçersiz güvenlik kodu. Lütfen sayfayı yenileyip tekrar deneyin.";
$_ADDONLANG['bilinmiyor'] = 'Bilinmiyor';
$_ADDONLANG['menuItemsNotLoaded'] = 'Menü Yüklenemedi';
$_ADDONLANG['noDataToExport'] = 'Dışa aktarılacak veri bulunamadı.';
$_ADDONLANG['invalidCronExpression'] = "Geçersiz Cron İfadesi";
$_ADDONLANG['confirmDeleteDefault'] = 'Bu öğeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!';

// ==================================================================
// == BÖLÜM 2: ANA SAYFA (Dashboard)
// ==================================================================
$_ADDONLANG['dashboardPageTitle'] = "BTK Raporlama - Ana Sayfa";
$_ADDONLANG['moduleInfoTitle'] = "Modül Bilgileri";
$_ADDONLANG['moduleVersionLabel'] = "Modül Sürümü:";
$_ADDONLANG['ftpServerStatusTitle'] = "FTP Sunucu Durumları";
$_ADDONLANG['ftpMainServerLabel'] = "Ana BTK FTP";
$_ADDONLANG['ftpBackupServerLabel'] = "Yedek FTP";
$_ADDONLANG['lastReportSubmissions'] = "Son Başarılı Gönderimler (Ana FTP)";
$_ADDONLANG['rehberReportLabel'] = "ABONE REHBER";
$_ADDONLANG['hareketReportLabel'] = "ABONE HAREKET";
$_ADDONLANG['personelReportLabel'] = "PERSONEL";
$_ADDONLANG['noSubmissionYet'] = "Henüz gönderim yok.";
$_ADDONLANG['generatedFileName'] = "Oluşturulan Dosya Adı";
$_ADDONLANG['nextCronRunsTitle'] = "Sonraki Otomatik Raporlama Zamanları";
$_ADDONLANG['popMonitoringStatusTitle'] = "Ağ Operasyonel Durumu";
$_ADDONLANG['popMonitoringDisabled'] = "POP İzleme özelliği kapalı.";
$_ADDONLANG['totalMonitored'] = "İzlenen POP";
$_ADDONLANG['popOnline'] = "Online";
$_ADDONLANG['popOffline'] = "Offline";
$_ADDONLANG['popHighLatency'] = "Yüksek Gecikme";
$_ADDONLANG['goToSettingsButton'] = "Ayarları Yönet";
$_ADDONLANG['yetkiTuruGrubu'] = "Yetki Grubu";
$_ADDONLANG['reportType'] = "Rapor Türü";
$_ADDONLANG['lastSubmissionDate'] = "Son Gönderim";
$_ADDONLANG['lastSubmittedFile'] = "Dosya Adı";

// ==================================================================
// == BÖLÜM 3: GENEL AYARLAR (config.tpl)
// ==================================================================
$_ADDONLANG['configPageTitle'] = "Genel Ayarlar";
$_ADDONLANG['configSaveSuccess'] = "Ayarlar başarıyla kaydedildi.";
$_ADDONLANG['operatorInfoTitle'] = "Operatör Bilgileri";
$_ADDONLANG['operatorCodeLabel'] = "Operatör Kodu";
$_ADDONLANG['operatorCodeTooltip'] = "BTK tarafından size atanan 3 haneli operatör kodu (Örn: 701).";
$_ADDONLANG['operatorNameLabel'] = "Operatör Adı";
$_ADDONLANG['operatorNameTooltip'] = "BTK tarafından belirlenen işletmeci adı (Örn: IZMARBILISIM). Dosya adlarında kullanılır.";
$_ADDONLANG['operatorTitleLabel'] = "Operatör Resmi Ünvanı";
$_ADDONLANG['operatorTitleTooltip'] = "Şirketinizin Ticaret Sicilinde kayıtlı tam resmi ünvanı.";
$_ADDONLANG['mainFtpSettingsTitle'] = "Ana FTP Sunucu Ayarları";
$_ADDONLANG['ftpHostLabel'] = "FTP Sunucusu (Host)";
$_ADDONLANG['ftpUserLabel'] = "Kullanıcı Adı";
$_ADDONLANG['ftpPassLabel'] = "Şifre";
$_ADDONLANG['ftpPassHelpText'] = "Değiştirmek istemiyorsanız boş bırakın.";
$_ADDONLANG['ftpPort'] = "Port";
$_ADDONLANG['ftpSSL'] = "SSL";
$_ADDONLANG['testFtpConnectionButton'] = "Bağlantıyı Test Et";
$_ADDONLANG['ftpRehberPathLabel'] = "REHBER Yolu";
$_ADDONLANG['ftpHareketPathLabel'] = "HAREKET Yolu";
$_ADDONLANG['ftpPersonelPathLabel'] = "PERSONEL Yolu";
$_ADDONLANG['backupFtpSettingsTitle'] = "Yedek FTP Sunucu Ayarları";
$_ADDONLANG['btkAuthTypesTitle'] = "BTK Yetkilendirme Seçenekleri";
$_ADDONLANG['btkAuthTypesHelpText'] = "Sahip olduğunuz BTK yetki türlerini seçin. Bu seçim, 'Ürün Grubu Eşleştirme' sayfasındaki seçenekleri etkileyecektir.";
$_ADDONLANG['cronSettingsTitle'] = "Cron Zamanlama Ayarları";
$_ADDONLANG['cronSettingsTooltip'] = "Raporların otomatik oluşturulma zamanlamaları (Standart cronjob formatı).";
$_ADDONLANG['cronRehberScheduleLabel'] = "REHBER Cron";
$_ADDONLANG['cronHareketScheduleLabel'] = "HAREKET Cron";
$_ADDONLANG['otherSettingsTitle'] = "Diğer Ayarlar";
$_ADDONLANG['sendEmptyReportsLabel'] = "Boş Rapor Gönderilsin";
$_ADDONLANG['sendEmptyReportsTooltip'] = "Raporlanacak veri olmasa bile, BTK boş dosya gönderimini talep ediyorsa bu seçeneği aktif edin.";
$_ADDONLANG['personelKimlikDogrulamaYapilsin'] = "Personel Kimlik Doğrulama";
$_ADDONLANG['personelKimlikDogrulamaHelpText'] = "Personel kayıtlarında TCKN doğrulaması aktif edilsin mi?";
$_ADDONLANG['showBtkInfoClientArea'] = "Müşteri Panelinde Göster";
$_ADDONLANG['deleteDataOnDeactivateLabel'] = "Modül Kaldırılınca Verileri Sil";
$_ADDONLANG['deleteDataOnDeactivateTooltip'] = "DİKKAT! Aktif edilirse, modül devre dışı bırakıldığında tüm veritabanı tabloları silinecektir.";
$_ADDONLANG['popMonitoringSettingsTitle'] = "POP Noktası İzleme";
$_ADDONLANG['popMonitoringEnableLabel'] = "İzleme Özelliği";
$_ADDONLANG['popMonitoringEnableHelpText'] = "Aktif edildiğinde, POP noktalarınıza periyodik ping atılır.";
$_ADDONLANG['popMonitoringScheduleLabel'] = "İzleme Cron";
$_ADDONLANG['popMonitoringScheduleHelpText'] = "POP noktalarının kontrol edilme sıklığı.";
$_ADDONLANG['popMonitoringHighLatencyLabel'] = "Yüksek Gecikme Eşiği (ms)";
$_ADDONLANG['popMonitoringHighLatencyHelpText'] = "Bu değerin üzerindeki ping süreleri 'Yüksek Gecikme' olarak işaretlenir.";

// ==================================================================
// == BÖLÜM 4: ÜRÜN GRUBU EŞLEŞTİRME
// ==================================================================
$_ADDONLANG['productGroupMappingsPageTitle'] = "Ürün Grubu Eşleştirme";
$_ADDONLANG['productGroupMappingsIntro'] = "WHMCS ürün gruplarınızı, BTK Yetki ve Hizmet Tipleri ile eşleştirin.";
$_ADDONLANG['productGroupMappingsHelpText'] = "Eşleştirilmeyen gruplardaki hizmetler raporlara dahil edilmez.";
$_ADDONLANG['productGroupNameHeader'] = "WHMCS Ürün Grubu";
$_ADDONLANG['btkAuthTypeToMapHeader'] = "BTK Yetki Türü";
$_ADDONLANG['btkAuthTypeToMapTooltip'] = "Seçilen yetkinin 'Grubu' (ISS, STH vb.) dosya adlarında kullanılır.";
$_ADDONLANG['mappingsSaveSuccess'] = "Eşleştirmeler kaydedildi.";
$_ADDONLANG['mappingsSaveError'] = "Eşleştirmeler kaydedilirken bir hata oluştu.";
$_ADDONLANG['serviceHizmetTipiLabel'] = "Hizmet Tipi (EK-3)";
$_ADDONLANG['serviceHizmetTipiTooltip'] = "Rapor içeriğindeki HIZMET_TIPI alanına yazılacak değer.";
$_ADDONLANG['selectBtkAuthTypeOption'] = "BTK Yetki Türü Seçin...";
$_ADDONLANG['noActiveAuthTypesForMapping'] = "Eşleştirme için aktif BTK Yetki Türü yok.";
$_ADDONLANG['noProductGroupsFound'] = "Ürün grubu bulunamadı.";
$_ADDONLANG['selectAnaYetkiFirst'] = "Önce Yetki Türü Seçin";
$_ADDONLANG['noEk3ForSelectedAuth'] = "Bu yetki için EK-3 hizmet tipi yok.";

// ==================================================================
// == BÖLÜM 5: PERSONEL VE POP YÖNETİMİ
// ==================================================================
$_ADDONLANG['personelPageTitle'] = "Personel Yönetimi";
$_ADDONLANG['personelIntroText'] = "BTK'ya gönderilecek personel listesini yönetin.";
$_ADDONLANG['addNewPersonelButton'] = "Yeni Personel Ekle";
$_ADDONLANG['personelAdiSoyadiHeader'] = "Adı Soyadı";
$_ADDONLANG['personelUnvanHeader'] = "Ünvan (BTK)";
$_ADDONLANG['personelEpostaHeader'] = "E-posta";
$_ADDONLANG['personelBtkListesineEklensinHeader'] = "Listeye Dahil?";
$_ADDONLANG['noPersonelFound'] = "Personel kaydı bulunamadı.";
$_ADDONLANG['editPersonelModalTitle'] = "Personel Düzenle";
$_ADDONLANG['confirmDeletePersonelText'] = "'%s' adlı personeli silmek istediğinizden emin misiniz?";
$_ADDONLANG['issPopManagementPageTitle'] = "ISS POP Yönetimi";
$_ADDONLANG['issPopManagementIntro'] = "ISS POP, Baz İstasyonu, Santral gibi fiziksel nokta bilgilerini yönetin.";
$_ADDONLANG['addNewPopButton'] = "Yeni POP Noktası Ekle";
$_ADDONLANG['popAdiHeader'] = "POP Adı";
$_ADDONLANG['popYayinYapilanSsidHeader'] = "Yayınlanan SSID";
$_ADDONLANG['popIlIlceHeader'] = "İl / İlçe";
$_ADDONLANG['popLiveStatusHeader'] = "Canlı Durum";
$_ADDONLANG['popLatencyHeader'] = "Gecikme (ms)";
$_ADDONLANG['popMonitoringActiveHeader'] = "İzleme";
$_ADDONLANG['noPopDefinitionsFound'] = "Tanımlı POP noktası bulunamadı.";
$_ADDONLANG['editPopModalTitle'] = "POP Noktası Düzenle";
$_ADDONLANG['popAdiLabel'] = "POP Adı/Etiketi";
$_ADDONLANG['popTipiHeader'] = "POP Tipi";
$_ADDONLANG['adresIlLabel'] = "İl";
$_ADDONLANG['adresIlceLabel'] = "İlçe";
$_ADDONLANG['adresMahalleLabel'] = "Mahalle/Köy";
$_ADDONLANG['selectIlOption'] = "İl Seçiniz...";
$_ADDONLANG['selectIlceOption'] = "İlçe Seçiniz...";
$_ADDONLANG['selectMahalleOption'] = "Mahalle Seçiniz...";
$_ADDONLANG['confirmDeletePopText'] = "'%s' adlı POP noktasını silmek istediğinizden emin misiniz?";
$_ADDONLANG['tcknInvalidInput'] = "TCKN, Ad, Soyad ve Doğum Yılı alanları zorunludur.";
$_ADDONLANG['validatingNvi'] = "Doğrulanıyor...";
$_ADDONLANG['tcknValidationFailedAjax'] = "Doğrulama servisine ulaşılamadı.";
$_ADDONLANG['errorFetchingPersonelDetails'] = "Personel bilgileri alınamadı.";
$_ADDONLANG['errorFetchingPopDetails'] = "POP bilgileri alınamadı.";

// ==================================================================
// == BÖLÜM 6: RAPORLAMA VE LOGLAR
// ==================================================================
$_ADDONLANG['generateReportsPageTitle'] = "Manuel Raporlar";
$_ADDONLANG['generateReportsIntro'] = "Raporları manuel olarak oluşturabilir, indirebilir ve FTP'ye gönderebilirsiniz.";
$_ADDONLANG['generateRehberReportTitle'] = "ABONE REHBER Raporu";
$_ADDONLANG['generateRehberReportHelpText'] = "Seçili Yetki Türü için TÜM abonelerin (aktif/iptal) güncel bilgilerini içeren kümülatif REHBER raporunu oluşturur.";
$_ADDONLANG['generateHareketReportTitle'] = "ABONE HAREKET Raporu";
$_ADDONLANG['generateHareketReportHelpText'] = "Seçili Yetki Türü için son gönderimden bu yana oluşan veya gönderilmemiş tüm abone hareketlerini içeren HAREKET raporunu oluşturur.";
$_ADDONLANG['generatePersonelReportTitle'] = "PERSONEL Raporu";
$_ADDONLANG['generatePersonelReportHelpText'] = "BTK'ya gönderilecek formatta güncel personel listesi Excel dosyasını oluşturur.";
$_ADDONLANG['selectBtkAuthTypeForReportLabel'] = "Yetki Türü";
$_ADDONLANG['generateOnlyButton'] = "Oluştur ve İndir";
$_ADDONLANG['generateAndSendMainFtpButton'] = "Oluştur ve Ana FTP'ye Gönder";
$_ADDONLANG['generateAndSendBackupFtpButton'] = "Oluştur ve Yedek FTP'ye Gönder";
$_ADDONLANG['reportTypeRequired'] = "Rapor türü seçilmelidir.";
$_ADDONLANG['yetkiKoduRequiredForReport'] = "Rapor için Yetki Grubu seçilmelidir.";
$_ADDONLANG['viewLogsPageTitle'] = "Modül Günlük Kayıtları";
$_ADDONLANG['viewLogsIntro'] = "Modül işlemlerini, FTP gönderimlerini ve hataları buradan takip edebilirsiniz.";
$_ADDONLANG['logTypeFilterLabel'] = "Log Türü";
$_ADDONLANG['allLogTypesOption'] = "Tüm Loglar";
$_ADDONLANG['logLevelFilterLabel'] = "Log Seviyesi";
$_ADDONLANG['allLogLevelsOption'] = "Tüm Seviyeler";
$_ADDONLANG['dateRangeFilterLabel'] = "Tarih Aralığı";
$_ADDONLANG['searchTermPlaceholder'] = "Arama...";
$_ADDONLANG['filterButton'] = "Filtrele";
$_ADDONLANG['resetFilterButton'] = "Sıfırla";
$_ADDONLANG['logDateHeader'] = "Tarih";
$_ADDONLANG['logLevelHeader'] = "Seviye";
$_ADDONLANG['logActionHeader'] = "İşlem";
$_ADDONLANG['logMessageHeader'] = "Mesaj";
$_ADDONLANG['deleteAllLogsButton'] = "Tüm Logları Sil";
$_ADDONLANG['confirmDeleteLogsModalTitle'] = "Tüm Logları Silmeyi Onayla";
$_ADDONLANG['confirmDeleteLogsModalText'] = "Tüm modül günlük kayıtlarını kalıcı olarak silmek istediğinizden emin misiniz?";
$_ADDONLANG['warningIrreversibleAction'] = "Bu işlem geri alınamaz!";
$_ADDONLANG['noGeneralLogsFound'] = "Genel log kaydı yok.";
$_ADDONLANG['noFtpLogsFound'] = "FTP log kaydı yok.";
$_ADDONLANG['logFileNameHeader'] = "Dosya Adı";
$_ADDONLANG['logStatusHeader'] = "Durum";

// ==================================================================
// == BÖLÜM 7: ENJEKTE EDİLEN FORMLAR (Müşteri & Hizmet Detayları)
// ==================================================================
$_ADDONLANG['aboneTemelBtkBilgileri'] = "BTK Abone Temel Bilgileri";
$_ADDONLANG['personelTcKimlikNoHeader'] = "TC Kimlik No";
$_ADDONLANG['abonePasaportNoLabel'] = "Pasaport No";
$_ADDONLANG['musteriTipiLabel'] = "Müşteri Tipi";
$_ADDONLANG['aboneCinsiyetLabel'] = "Cinsiyet";
$_ADDONLANG['aboneUyrukLabel'] = "Uyruk";
$_ADDONLANG['aboneBabaAdiLabel'] = "Baba Adı";
$_ADDONLANG['aboneAnaAdiLabel'] = "Anne Adı";
$_ADDONLANG['aboneDogumYeriLabel'] = "Doğum Yeri";
$_ADDONLANG['aboneDogumTarihiLabel'] = "Doğum Tarihi";
$_ADDONLANG['aboneMeslekLabel'] = "Meslek";
$_ADDONLANG['aboneKimlikTipiLabel'] = "Kimlik Tipi";
$_ADDONLANG['aboneKimlikSeriNoLabel'] = "Kimlik Seri No";
$_ADDONLANG['kurumYetkilisiBilgileriTitle'] = "BTK Kurum Yetkilisi Bilgileri";
$_ADDONLANG['kurumYetkiliAdiLabel'] = "Yetkili Adı";
$_ADDONLANG['kurumYetkiliSoyadiLabel'] = "Yetkili Soyadı";
$_ADDONLANG['kurumYetkiliTcKimlikNoLabel'] = "Yetkili TCKN";
$_ADDONLANG['kurumYetkiliTelefonLabel'] = "Yetkili Telefonu";
$_ADDONLANG['aboneVergiNumarasiLabel'] = "Vergi Numarası";
$_ADDONLANG['aboneMersisNumarasiLabel'] = "Mersis Numarası";
$_ADDONLANG['aboneKimlikVerildigiYerLabel'] = "Kimliğin Verildiği Yer";
$_ADDONLANG['aboneKimlikVerildigiTarihLabel'] = "Kimlik Veriliş Tarihi";
$_ADDONLANG['aboneKimlikAidiyetiLabel'] = "Kimlik Aidiyeti";
$_ADDONLANG['aboneKimlikAidiyetiB'] = "Bireysel";
$_ADDONLANG['aboneKimlikAidiyetiY'] = "Yetkili";
$_ADDONLANG['aboneYerlesimAdresiTitle'] = "BTK Abone Yerleşim Adresi";
$_ADDONLANG['adresCaddeLabel'] = "Cadde/Sokak";
$_ADDONLANG['adresDisKapiNoLabel'] = "Dış Kapı No";
$_ADDONLANG['adresIcKapiNoLabel'] = "İç Kapı No";
$_ADDONLANG['btkServiceInformationTitle'] = "BTK Hizmet Bilgileri";
$_ADDONLANG['serviceHatNoLabel'] = "BTK Hat/Hizmet No";
$_ADDONLANG['serviceHatNoTooltip'] = "BTK'ya bildirilecek tekil hizmet numarası (Devre No, Kullanıcı Adı vb.).";
$_ADDONLANG['serviceAboneBaslangicLabel'] = "Abonelik Başlangıcı";
$_ADDONLANG['serviceAboneTarifeLabel'] = "Tarife Bilgisi";
$_ADDONLANG['serviceStatikIpLabel'] = "Statik IP";
$_ADDONLANG['issHizProfiliLabel'] = "Hız Profili (ISS)";
$_ADDONLANG['issKullaniciAdiLabel'] = "Kullanıcı Adı (ISS)";
$_ADDONLANG['issPopNoktasiLabel'] = "POP Noktası (ISS)";
$_ADDONLANG['serviceTesisAdresiTitle'] = "Hizmet Tesis Adresi";
$_ADDONLANG['tesisAdresiYerlesimleAyniLabel'] = "Müşterinin yerleşim adresi ile aynıdır";

// ==================================================================
// == BÖLÜM 8: MÜŞTERİ PANELİ
// ==================================================================
$_ADDONLANG['btkInformationTitleClientArea'] = "BTK Bilgileriniz";
$_ADDONLANG['customerYerlesimAdresiTitleClientArea'] = "BTK Yerleşim Adresiniz";
$_ADDONLANG['btkInfoUpdateContactAdmin'] = "Bu bilgilerde bir yanlışlık olması durumunda lütfen bizimle iletişime geçiniz.";
$_ADDONLANG['btkServiceInformationTitleClientArea'] = "Hizmetinize Ait BTK Bilgileri";
$_ADDONLANG['serviceHatNoLabelClientArea'] = "Hat/Hizmet No:";
$_ADDONLANG['serviceAboneBaslangicLabelClientArea'] = "Abonelik Başlangıcı:";
$_ADDONLANG['serviceTesisAdresiTitleClientArea'] = "Hizmet Tesis Adresi";
$_ADDONLANG['tesisAdresiYerlesimleAyniClientArea'] = "Tesis adresi, yerleşim adresi ile aynıdır.";
$_ADDONLANG['genderMale'] = "Erkek";
$_ADDONLANG['genderFemale'] = "Kadın";
$_ADDONLANG['musteriTipiGSahis'] = "Bireysel";
$_ADDONLANG['musteriTipiTSirket'] = "Kurumsal";
$_ADDONLANG['notProvidedOrApplicable'] = 'Sağlanmadı';

?>