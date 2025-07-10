<?php
/**
 * WHMCS BTK Raporlama Modülü - Türkçe Dil Dosyası
 * Sürüm: 7.2.6 (Operatör - Arayüz ve Dil Tamamlama Sürümü)
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    7.2.6
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
$_ADDONLANG['statusActive'] = "Aktif";
$_ADDONLANG['statusPassive'] = "Pasif";
$_ADDONLANG['statusPending'] = "Beklemede";
$_ADDONLANG['statusSuccess'] = "Başarılı";
$_ADDONLANG['statusError'] = "Hatalı"; 
$_ADDONLANG['selectOption'] = "Lütfen Seçiniz...";
$_ADDONLANG['notAvailable'] = "Belirtilmemiş";
$_ADDONLANG['notConfigured'] = "Yapılandırılmamış";
$_ADDONLANG['loadingData'] = "Veri Yükleniyor...";
$_ADDONLANG['noDataFound'] = "Veri Bulunamadı";
$_ADDONLANG['ajaxRequestFailed'] = "Sunucu isteği başarısız oldu. Lütfen tekrar deneyin.";
$_ADDONLANG['errorOccurred'] = "Bir hata oluştu.";
$_ADDONLANG['validationErrorsOccurred'] = "Doğrulama hataları oluştu";
$_ADDONLANG['csrfTokenError'] = "Geçersiz güvenlik kodu. Lütfen sayfayı yenileyip tekrar deneyin.";
$_ADDONLANG['unknownAjaxRequest'] = "Bilinmeyen AJAX isteği.";
$_ADDONLANG['previous'] = "Önceki";
$_ADDONLANG['next'] = "Sonraki";
$_ADDONLANG['serviceTerminatedCannotEdit'] = "Sonlandırılmış/İptal Edilmiş Hizmetler Düzenlenemez.";
$_ADDONLANG['serviceCannotDeleteBtkReason'] = "BTK Modülü: Bu hizmet aktif, askıya alınmış veya sonlandırılmış olduğu için silinemez. Kayıtlar BTK için korunmalıdır. Lütfen önce hizmeti sonlandırın.";
$_ADDONLANG['excelExportButton'] = "Excel Olarak Dışa Aktar";
$_ADDONLANG['bilinmiyor'] = 'Bilinmiyor';
$_ADDONLANG['menuItemsNotLoaded'] = 'Menü Yüklenemedi';

// ==================================================================
// == BÖLÜM 2: ANA SAYFA (index.tpl)
// ==================================================================
$_ADDONLANG['dashboardPageTitle'] = "BTK Raporlama - Ana Sayfa";
$_ADDONLANG['moduleInfoTitle'] = "Modül Bilgileri";
$_ADDONLANG['moduleVersionLabel'] = "Modül Sürümü:";
$_ADDONLANG['dbVersion'] = "Veritabanı Sürümü";
$_ADDONLANG['developedBy'] = "Geliştiren";
$_ADDONLANG['ftpServerStatusTitle'] = "FTP Sunucu Durumları";
$_ADDONLANG['ftpMainServerLabel'] = "Ana BTK FTP Sunucusu";
$_ADDONLANG['ftpBackupServerLabel'] = "Yedek FTP Sunucusu";
$_ADDONLANG['lastReportSubmissions'] = "Son Başarılı Rapor Gönderimleri (Ana FTP)";
$_ADDONLANG['rehberReportLabel'] = "ABONE REHBER";
$_ADDONLANG['hareketReportLabel'] = "ABONE HAREKET";
$_ADDONLANG['personelReportLabel'] = "PERSONEL Listesi";
$_ADDONLANG['noSubmissionYet'] = "Henüz gönderim yapılmamış.";
$_ADDONLANG['generatedFileName'] = "Oluşturulan Dosya Adı";
$_ADDONLANG['nextCronRunsTitle'] = "Sonraki Otomatik Raporlama Zamanları";
$_ADDONLANG['popMonitoringStatusTitle'] = "Ağ Operasyonel Durumu (İzlenen POP Noktaları)";
$_ADDONLANG['popMonitoringDisabled'] = "POP Noktası İzleme özelliği Genel Ayarlar'dan kapalı durumdadır.";
$_ADDONLANG['totalMonitored'] = "Toplam İzlenen";
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
$_ADDONLANG['configPageTitle'] = "BTK Raporlama - Genel Ayarlar";
$_ADDONLANG['configSaveSuccess'] = "Ayarlar başarıyla kaydedildi.";
$_ADDONLANG['operatorInfoTitle'] = "Operatör Bilgileri";
$_ADDONLANG['operatorCodeLabel'] = "Operatör Kodu (BTK)";
$_ADDONLANG['operatorCodeTooltip'] = "BTK tarafından size atanan 3 haneli operatör kodu (Örn: 701).";
$_ADDONLANG['operatorNameLabel'] = "Operatör Adı (BTK)";
$_ADDONLANG['operatorNameTooltip'] = "BTK tarafından belirlenen işletmeci adı (Örn: IZMARBILISIM). Dosya adlarında kullanılır, Türkçe karakter ve boşluk içermemelidir.";
$_ADDONLANG['operatorTitleLabel'] = "Operatör Resmi Ünvanı";
$_ADDONLANG['operatorTitleTooltip'] = "Şirketinizin Ticaret Sicilinde kayıtlı tam resmi ünvanı. Personel raporunda kullanılır.";
$_ADDONLANG['mainFtpSettingsTitle'] = "Ana FTP Sunucu Ayarları (BTK)";
$_ADDONLANG['ftpHostLabel'] = "FTP Sunucusu (Host)";
$_ADDONLANG['ftpUserLabel'] = "FTP Kullanıcı Adı";
$_ADDONLANG['ftpPassLabel'] = "FTP Şifresi";
$_ADDONLANG['ftpPassHelpText'] = "Değiştirmek istemiyorsanız boş bırakın.";
$_ADDONLANG['ftpPort'] = "Port";
$_ADDONLANG['ftpSSL'] = "SSL Kullan";
$_ADDONLANG['testFtpConnectionButton'] = "Bağlantıyı Test Et";
$_ADDONLANG['ftpRehberPathLabel'] = "REHBER Dosya Yolu";
$_ADDONLANG['ftpHareketPathLabel'] = "HAREKET Dosya Yolu";
$_ADDONLANG['ftpPersonelPathLabel'] = "PERSONEL Dosya Yolu";
$_ADDONLANG['backupFtpSettingsTitle'] = "Yedek FTP Sunucusu Ayarları";
$_ADDONLANG['btkAuthTypesTitle'] = "BTK Yetkilendirme Seçenekleri";
$_ADDONLANG['btkAuthTypesHelpText'] = "Sahip olduğunuz ve raporlama yapacağınız BTK yetki türlerini seçin. Bu seçim, \"Ürün Grubu Eşleştirme\" sayfasındaki seçenekleri etkileyecektir.";
$_ADDONLANG['cronSettingsTitle'] = "Cron Job Zamanlama Ayarları";
$_ADDONLANG['cronSettingsTooltip'] = "Raporların otomatik oluşturulup gönderilme zamanlamaları. Standart cronjob formatını kullanın.";
$_ADDONLANG['otherSettingsTitle'] = "Diğer Ayarlar";
$_ADDONLANG['sendEmptyReportsLabel'] = "Boş Rapor Gönderilsin mi?";
$_ADDONLANG['sendEmptyReportsTooltip'] = "Raporlanacak veri olmasa bile, BTK boş dosya gönderimini talep ediyorsa bu seçeneği işaretleyin.";
$_ADDONLANG['deleteDataOnDeactivateLabel'] = "Modül Devre Dışı Bırakıldığında Veriler Silinsin mi?";
$_ADDONLANG['deleteDataOnDeactivateTooltip'] = "DİKKAT! Bu seçenek işaretlenirse, modül devre dışı bırakıldığında bu modüle ait tüm veritabanı tabloları ve ayarları silinecektir.";
$_ADDONLANG['personelKimlikDogrulamaYapilsin'] = "Personel Kimlik Doğrulama Yapılsın";
$_ADDONLANG['personelKimlikDogrulamaHelpText'] = "Personel yönetimi sayfasında TCKN doğrulaması aktif edilsin mi? (NVI Servisi)";
$_ADDONLANG['aboneKimlikDogrulamaYapilsin'] = "Abone/Müşteri Kimlik Doğrulama Yapılsın";
$_ADDONLANG['aboneKimlikDogrulamaHelpText'] = "Müşteri ve hizmet detayları kaydedilirken kimlik doğrulaması yapılsın mı? (Gelecek sürümlerde entegre edilecektir)";
$_ADDONLANG['popMonitoringSettingsTitle'] = "POP Noktası İzleme Ayarları (Opsiyonel)";
$_ADDONLANG['popMonitoringEnableLabel'] = "İzleme Özelliği Aktif Edilsin mi?";
$_ADDONLANG['popMonitoringEnableHelpText'] = "Aktif edildiğinde, POP noktalarınıza periyodik olarak ping atılır. Sunucunuzda `exec` fonksiyonu ve `ping` komutu erişilebilir olmalıdır.";
$_ADDONLANG['popMonitoringScheduleLabel'] = "İzleme Cron Zamanlaması";
$_ADDONLANG['popMonitoringScheduleHelpText'] = "POP noktalarının ne sıklıkla kontrol edileceğini belirler. Örnek: `*/5 * * * *` (Her 5 dakikada bir).";
$_ADDONLANG['popMonitoringHighLatencyLabel'] = "Yüksek Gecikme Eşiği (ms)";
$_ADDONLANG['popMonitoringHighLatencyHelpText'] = "Bu değerin üzerindeki ping süreleri 'Yüksek Gecikme' olarak işaretlenir.";
$_ADDONLANG['showBtkInfoClientArea'] = "Müşteri Panelinde BTK Bilgileri Gösterilsin";
$_ADDONLANG['invalidCronExpression'] = "Geçersiz Cron İfadesi";

// ==================================================================
// == BÖLÜM 4: ÜRÜN GRUBU EŞLEŞTİRME
// ==================================================================
$_ADDONLANG['productGroupMappingsPageTitle'] = "BTK - Ürün Grubu Yetki Eşleştirme";
$_ADDONLANG['productGroupMappingsIntro'] = "Bu bölümde, WHMCS ürün gruplarınızı, Genel Ayarlar'da aktif ettiğiniz BTK Yetki Türleri ile eşleştirebilirsiniz.";
$_ADDONLANG['productGroupMappingsHelpText'] = "Her ürün grubu için bir BTK Yetki Türü ve ona bağlı bir Hizmet Tipi seçerek, o gruptaki hizmetlerin hangi BTK raporu (ve dosya adı _TIP_ eki) altında raporlanacağını ve hizmetin ne olduğunu belirlersiniz. Eşleştirilmeyen gruplardaki hizmetler raporlara dahil edilmez.";
$_ADDONLANG['productGroupNameHeader'] = "WHMCS Ürün Grubu Adı";
$_ADDONLANG['btkAuthTypeToMapHeader'] = "Eşleştirilecek BTK Yetki Türü";
$_ADDONLANG['btkAuthTypeToMapTooltip'] = "Seçilen yetki türünün 'Rapor Tipi Eki' (Grubu) dosya adlarında kullanılacaktır.";
$_ADDONLANG['reportTypeAbbr'] = "Rapor Tipi";
$_ADDONLANG['mappingsSaveSuccess'] = "Ürün grubu eşleştirmeleri başarıyla kaydedildi.";
$_ADDONLANG['mappingsSaveError'] = "Eşleştirmeler kaydedilirken bir hata oluştu.";
$_ADDONLANG['serviceHizmetTipiLabel'] = "BTK Hizmet Tipi (EK-3)";
$_ADDONLANG['serviceHizmetTipiTooltip'] = "Rapor içeriğindeki HIZMET_TIPI alanına yazılacak olan değer.";
$_ADDONLANG['selectBtkAuthTypeOption'] = "BTK Yetki Türü Seçin...";
$_ADDONLANG['noActiveAuthTypesForMapping'] = "Eşleştirme için aktif edilmiş BTK Yetki Türü bulunmuyor. Lütfen Genel Ayarlar'dan yetki türlerini aktif edin.";
$_ADDONLANG['noProductGroupsFound'] = "WHMCS'de tanımlı ürün grubu bulunamadı.";
$_ADDONLANG['selectAnaYetkiFirst'] = "Önce Ana Yetki Türü Seçin";
$_ADDONLANG['noEk3ForSelectedAuth'] = "Bu yetki için EK-3 hizmet tipi yok.";
$_ADDONLANG['dbReadError'] = "Veritabanı okuma hatası: ";

// ==================================================================
// == BÖLÜM 5: PERSONEL VE POP YÖNETİMİ
// ==================================================================
$_ADDONLANG['personelPageTitle'] = "BTK - Personel Yönetimi";
$_ADDONLANG['personelIntroText'] = "BTK'ya gönderilecek personel listesi için gerekli bilgileri yönetin. Eksik bilgileri düzenleyebilirsiniz.";
$_ADDONLANG['addNewPersonelButton'] = "Yeni Personel Ekle";
$_ADDONLANG['personelAdiSoyadiHeader'] = "Adı Soyadı";
$_ADDONLANG['personelUnvanHeader'] = "Ünvan (BTK)";
$_ADDONLANG['personelEpostaHeader'] = "E-posta";
$_ADDONLANG['personelBtkListesineEklensinHeader'] = "Listeye Dahil?";
$_ADDONLANG['noPersonelFound'] = "Yönetilecek personel kaydı bulunamadı.";
$_ADDONLANG['editPersonelModalTitle'] = "Personel Bilgilerini Düzenle";
$_ADDONLANG['confirmDeletePersonelText'] = "'%s' adlı personeli silmek istediğinizden emin misiniz?";
$_ADDONLANG['issPopManagementPageTitle'] = "BTK - ISS POP Noktası Yönetimi";
$_ADDONLANG['issPopManagementIntro'] = "İnternet Servis Sağlayıcınıza ait POP, Baz İstasyonu, Santral gibi fiziksel nokta bilgilerini yönetin.";
$_ADDONLANG['addNewPopButton'] = "Yeni POP Noktası Ekle";
$_ADDONLANG['popAdiHeader'] = "POP Adı";
$_ADDONLANG['popYayinYapilanSsidHeader'] = "Yayınlanan SSID";
$_ADDONLANG['popIlIlceHeader'] = "İl / İlçe";
$_ADDONLANG['popLiveStatusHeader'] = "Canlı Durum";
$_ADDONLANG['popLatencyHeader'] = "Gecikme (ms)";
$_ADDONLANG['popMonitoringActiveHeader'] = "İzleme Aktif";
$_ADDONLANG['noPopDefinitionsFound'] = "Tanımlı POP noktası bulunamadı.";
$_ADDONLANG['editPopModalTitle'] = "POP Noktası Bilgilerini Düzenle";
$_ADDONLANG['popAdiLabel'] = "POP Adı/Etiketi";
$_ADDONLANG['popTipiHeader'] = "POP Tipi";
$_ADDONLANG['adresIlLabel'] = "İl";
$_ADDONLANG['adresIlceLabel'] = "İlçe";
$_ADDONLANG['adresMahalleLabel'] = "Mahalle/Köy";
$_ADDONLANG['selectIlOption'] = "İl Seçiniz...";
$_ADDONLANG['selectIlceOption'] = "İlçe Seçiniz...";
$_ADDONLANG['selectMahalleOption'] = "Mahalle/Köy Seçiniz...";
$_ADDONLANG['popDefinitionUpdateSuccess'] = "POP tanımı başarıyla güncellendi.";
$_ADDONLANG['popDefinitionAddSuccess'] = "Yeni POP tanımı başarıyla eklendi.";
$_ADDONLANG['popDefinitionSaveError'] = "POP tanımı kaydedilirken bir hata oluştu.";
$_ADDONLANG['invalidPopId'] = "Geçersiz POP ID.";
$_ADDONLANG['confirmDeletePopText'] = "'%s' adlı POP noktasını silmek istediğinizden emin misiniz?";
// ==================================================================
// == BÖLÜM 6: RAPORLAMA VE LOGLAR
// ==================================================================
$_ADDONLANG['generateReportsPageTitle'] = "BTK - Manuel Rapor Oluşturma";
$_ADDONLANG['generateReportsIntro'] = "Raporları manuel olarak oluşturabilir, indirebilir ve FTP sunucularına gönderebilirsiniz.";
$_ADDONLANG['generateRehberReportTitle'] = "ABONE REHBER Raporu Oluştur";
$_ADDONLANG['generateRehberReportHelpText'] = "Seçili Yetki Türü için TÜM abonelerin (aktif/iptal) güncel bilgilerini içeren kümülatif REHBER raporunu oluşturur.";
$_ADDONLANG['generateHareketReportTitle'] = "ABONE HAREKET Raporu Oluştur";
$_ADDONLANG['generateHareketReportHelpText'] = "Seçili Yetki Türü için son gönderimden bu yana oluşan veya gönderilmemiş tüm abone hareketlerini içeren HAREKET raporunu oluşturur.";
$_ADDONLANG['generatePersonelReportTitle'] = "PERSONEL Listesi Raporu Oluştur";
$_ADDONLANG['generatePersonelReportHelpText'] = "BTK'ya gönderilecek formatta güncel personel listesi Excel dosyasını oluşturur.";
$_ADDONLANG['selectBtkAuthTypeForReportLabel'] = "Raporlanacak Yetki Türü";
$_ADDONLANG['generateOnlyButton'] = "Sadece Oluştur ve İndir";
$_ADDONLANG['generateAndSendMainFtpButton'] = "Oluştur ve Ana FTP'ye Gönder";
$_ADDONLANG['generateAndSendBackupFtpButton'] = "Oluştur ve Yedek FTP'ye Gönder";
$_ADDONLANG['generatingReportPleaseWait'] = "Rapor oluşturuluyor, lütfen bekleyin...";
$_ADDONLANG['downloadFileButton'] = "Dosyayı İndir";
$_ADDONLANG['reportTypeRequired'] = "Rapor türü seçilmelidir.";
$_ADDONLANG['yetkiKoduRequiredForReport'] = "REHBER veya HAREKET için Yetki Türü seçilmelidir.";
$_ADDONLANG['noDataForReport'] = "Rapor için veri bulunamadı. Boş rapor gönderimi kapalı olduğu için işlem iptal edildi.";
$_ADDONLANG['fileNotFound'] = "Dosya bulunamadı veya süresi dolmuş.";
$_ADDONLANG['viewLogsPageTitle'] = "BTK - Modül Günlük Kayıtları";
$_ADDONLANG['viewLogsIntro'] = "Modülün çalışması sırasında oluşan önemli işlemleri, FTP gönderimlerini ve olası hataları buradan takip edebilirsiniz.";
$_ADDONLANG['logTypeFilterLabel'] = "Log Türü";
$_ADDONLANG['allLogTypesOption'] = "Tüm Loglar";
$_ADDONLANG['logTypeFtp'] = "FTP Gönderimleri";
$_ADDONLANG['logTypeGeneral'] = "Genel İşlemler";
$_ADDONLANG['logLevelFilterLabel'] = "Log Seviyesi";
$_ADDONLANG['allLogLevelsOption'] = "Tüm Seviyeler";
$_ADDONLANG['dateRangeFilterLabel'] = "Tarih Aralığı";
$_ADDONLANG['searchTermFilterLabel'] = "Arama Terimi";
$_ADDONLANG['searchTermPlaceholder'] = "Mesaj veya işlem içinde ara...";
$_ADDONLANG['filterButton'] = "Filtrele";
$_ADDONLANG['resetFilterButton'] = "Sıfırla";
$_ADDONLANG['logDateHeader'] = "Tarih";
$_ADDONLANG['logLevelHeader'] = "Seviye";
$_ADDONLANG['logActionHeader'] = "İşlem";
$_ADDONLANG['logMessageHeader'] = "Mesaj / Detay";
$_ADDONLANG['logFileNameHeader'] = "Dosya Adı";
$_ADDONLANG['deleteAllLogsButton'] = "Tüm Logları Sil";
$_ADDONLANG['confirmDeleteLogsModalTitle'] = "Tüm Logları Silmeyi Onayla";
$_ADDONLANG['confirmDeleteLogsModalText'] = "Tüm modül günlük kayıtlarını kalıcı olarak silmek istediğinizden emin misiniz?";
$_ADDONLANG['warningIrreversibleAction'] = "Bu işlem geri alınamaz!";
$_ADDONLANG['noGeneralLogsFound'] = "Genel log kaydı bulunamadı.";
$_ADDONLANG['noFtpLogsFound'] = "FTP log kaydı bulunamadı.";

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
$_ADDONLANG['btkServiceInformationTitle'] = "BTK Hizmet Bilgileri";
$_ADDONLANG['serviceHatNoLabel'] = "BTK Hat/Hizmet No";
$_ADDONLANG['serviceHatNoTooltip'] = "BTK'ya bildirilecek tekil hizmet numarası (Telefon, Devre No, Kullanıcı Adı vb.).";
$_ADDONLANG['serviceHizmetTipiTooltip'] = "Rapor içeriğindeki HIZMET_TIPI alanına yazılacak olan değer.";
$_ADDONLANG['serviceAboneBaslangicLabel'] = "Abonelik Başlangıcı";
$_ADDONLANG['serviceAboneTarifeLabel'] = "Tarife Bilgisi";
$_ADDONLANG['serviceStatikIpLabel'] = "Statik IP";
$_ADDONLANG['issHizProfiliLabel'] = "Hız Profili (ISS)";
$_ADDONLANG['issKullaniciAdiLabel'] = "Kullanıcı Adı (ISS)";
$_ADDONLANG['issPopNoktasiLabel'] = "POP Noktası (ISS)";
$_ADDONLANG['serviceTesisAdresiTitle'] = "BTK Hizmet Tesis Adresi";
$_ADDONLANG['tesisAdresiYerlesimleAyniLabel'] = "Müşterinin yerleşim adresi ile aynıdır";
$_ADDONLANG['noMatchingServiceType'] = "Bu ürün grubuna uygun hizmet tipi bulunamadı. Lütfen Ürün Grubu Eşleştirmesini kontrol edin.";

// ==================================================================
// == BÖLÜM 8: MÜŞTERİ PANELİ
// ==================================================================
$_ADDONLANG['btkInformationTitleClientArea'] = "BTK Bilgileriniz";
$_ADDONLANG['customerYerlesimAdresiTitleClientArea'] = "BTK Yerleşim Adresiniz";
$_ADDONLANG['btkInfoUpdateContactAdmin'] = "Bu bilgilerde bir yanlışlık veya değişiklik olması durumunda lütfen bizimle iletişime geçiniz.";
$_ADDONLANG['btkServiceInformationTitleClientArea'] = "Hizmetinize Ait BTK Bilgileri";
$_ADDONLANG['serviceHatNoLabelClientArea'] = "BTK Hat/Hizmet No:";
$_ADDONLANG['serviceAboneBaslangicLabelClientArea'] = "BTK Abonelik Başlangıcı:";
$_ADDONLANG['serviceTesisAdresiTitleClientArea'] = "BTK Hizmet Tesis Adresi";
$_ADDONLANG['tesisAdresiYerlesimleAyniClientArea'] = "Bu hizmetin tesis adresi, müşteri yerleşim adresi ile aynıdır.";
$_ADDONLANG['adresDisKapiNoLabel'] = "Dış Kapı No"; 
$_ADDONLANG['adresIcKapiNoLabel'] = "İç Kapı No";   
$_ADDONLANG['genderMale'] = "Erkek";
$_ADDONLANG['genderFemale'] = "Kadın";
$_ADDONLANG['musteriTipiGSahis'] = "Bireysel Şahıs";
$_ADDONLANG['musteriTipiTSirket'] = "Tüzel Şirket";
$_ADDONLANG['notProvidedOrApplicable'] = 'Sağlanmadı / Uygulanamaz';

?>