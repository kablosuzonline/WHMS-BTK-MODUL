<?php
/**
 * WHMCS BTK Raporlama Modülü - Türkçe Dil Dosyası
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX)
 *
 * ANKA-PHOENIX Sürüm Notları:
 * - Yeni E-Fatura ve CEVHER sayfaları için menü metinleri eklendi.
 * - E-Fatura ayar sayfası için tüm metinler eklendi.
 * - Müşteri profili ve hizmet detayları sekmelerindeki tüm yeni alanlar için metinler eklendi.
 * - Tarihsel Veri İnşa Aracı için metinler eklendi.
 * - NVI doğrulama mesajları ve FTP test mesajları güncellendi.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

if (!defined('WHMCS')) {
    die('This file cannot be accessed directly');
}

$_ADDONLANG = [];

// ==================================================================
// == GENEL VE MENÜ METİNLERİ
// ==================================================================
$_ADDONLANG['btk_reports_addon'] = 'BTK Raporlama Modülü';
$_ADDONLANG['dashboardPageTitle'] = 'Ana Sayfa';
$_ADDONLANG['configPageTitle'] = 'Genel Ayarlar';
$_ADDONLANG['efaturaConfigPageTitle'] = 'E-Fatura Ayarları';
$_ADDONLANG['efaturaInvoicesPageTitle'] = 'E-Fatura Yönetimi';
$_ADDONLANG['productGroupMappingsPageTitle'] = 'Ürün Grubu Eşleştirme';
$_ADDONLANG['personelPageTitle'] = 'Personel Yönetimi';
$_ADDONLANG['issPopManagementPageTitle'] = 'POP Noktası Yönetimi';
$_ADDONLANG['dataManagementPageTitle'] = 'Veri Yönetimi';
$_ADDONLANG['generateReportsPageTitle'] = 'Manuel Raporlar';
$_ADDONLANG['cevherReportsTitle'] = 'CEVHER Raporları';
$_ADDONLANG['viewLogsPageTitle'] = 'Logları Görüntüle';
$_ADDONLANG['eSozlesmeBasvurularTitle'] = 'E-Sözleşme Başvuruları';
$_ADDONLANG['eSozlesmeTestSenaryoTitle'] = 'E-Sözleşme Test Senaryoları';
$_ADDONLANG['eSozlesmeSettingsTitle'] = 'BTK E-Kayıt (E-Sözleşme) Ayarları';
$_ADDONLANG['eSozlesmeSettingsDesc'] = 'BTK/E-Devlet üzerinden yeni abonelik başvurularını almak için gerekli olan entegrasyon ve test ayarları.';

// ==================================================================
// == DASHBOARD (ANA SAYFA) METİNLERİ
// ==================================================================
$_ADDONLANG['moduleInfoTitle'] = 'Modül Bilgileri';
$_ADDONLANG['moduleVersionLabel'] = 'Modül Versiyonu';
$_ADDONLANG['goToSettingsButton'] = 'Ayarlara Git';
$_ADDONLANG['ftpServerStatusTitle'] = 'FTP Sunucu Durumları';
$_ADDONLANG['ftpMainServerLabel'] = 'Ana FTP Sunucusu';
$_ADDONLANG['ftpBackupServerLabel'] = 'Yedek FTP Sunucusu';
$_ADDONLANG['popMonitoringStatusTitle'] = 'Ağ (POP) İzleme Durumu';
$_ADDONLANG['totalMonitored'] = 'Toplam İzlenen';
$_ADDONLANG['popOnline'] = 'Çevrimiçi';
$_ADDONLANG['popOffline'] = 'Çevrimdışı';
$_ADDONLANG['popHighLatency'] = 'Yüksek Gecikme';
$_ADDONLANG['lastReportSubmissions'] = 'Son Rapor Gönderimleri';
$_ADDONLANG['yetkiTuruGrubu'] = 'Yetki Türü Grubu';
$_ADDONLANG['reportType'] = 'Rapor Türü';
$_ADDONLANG['lastSubmissionDate'] = 'Son Gönderim Tarihi';
$_ADDONLANG['lastSubmittedFile'] = 'Son Gönderilen Dosya';
$_ADDONLANG['rehberReportLabel'] = 'Rehber Raporu';
$_ADDONLANG['hareketReportLabel'] = 'Hareket Raporu';
$_ADDONLANG['personelReportLabel'] = 'Personel Raporu';
$_ADDONLANG['nextCronRunsTitle'] = 'Sonraki Zamanlanmış Görev Çalışma Zamanları';

// ==================================================================
// == GENEL AYARLAR SAYFASI (config.tpl)
// ==================================================================
$_ADDONLANG['generalSettings'] = 'Operatör ve Genel Ayarlar';
$_ADDONLANG['operatorCode'] = 'Operatör Kodu';
$_ADDONLANG['operatorCodeDesc'] = 'BTK tarafından size atanan 3 haneli operatör kodu.';
$_ADDONLANG['operatorName'] = 'Operatör Adı (Kısa)';
$_ADDONLANG['operatorNameDesc'] = 'Rapor dosyası adlarında kullanılacak, boşluk ve Türkçe karakter içermeyen kısa ad (Örn: IZMARTEL).';
$_ADDONLANG['operatorTitle'] = 'Operatör Ünvanı (Tam)';
$_ADDONLANG['operatorTitleDesc'] = 'Personel raporu gibi resmi dökümanlarda kullanılacak tam şirket ünvanı.';
$_ADDONLANG['mainFtpSettings'] = 'Ana BTK FTP Sunucu Ayarları';
$_ADDONLANG['backupFtpSettings'] = 'Yedek FTP Sunucu Ayarlarını Etkinleştir';
$_ADDONLANG['ftpHost'] = 'Sunucu Adresi (Host)';
$_ADDONLANG['ftpUser'] = 'Kullanıcı Adı';
$_ADDONLANG['ftpPassPlaceholder'] = 'Değiştirmek istemiyorsanız boş bırakın';
$_ADDONLANG['ftpPort'] = 'Port';
$_ADDONLANG['ftpSSL'] = 'SSL Kullan';
$_ADDONLANG['ftpPasv'] = 'Pasif Mod';
$_ADDONLANG['testFtpConnection'] = 'FTP Bağlantısını Test Et';
$_ADDONLANG['testingConnection'] = 'Bağlantı test ediliyor...';
$_ADDONLANG['ftpTestAjaxError'] = 'Sunucuya ulaşılamadı veya bir AJAX hatası oluştu.';
$_ADDONLANG['ftpTestSuccess'] = 'Bağlantı başarılı.';
$_ADDONLANG['ftpTestFail'] = 'Bağlantı başarısız.';
$_ADDONLANG['ftpTestMissingCreds'] = 'Lütfen sunucu adresi, kullanıcı adı ve şifre alanlarını doldurun.';
$_ADDONLANG['ftpTestNotEnabled'] = 'Bu FTP sunucusu ayarlarda etkinleştirilmemiş.';
$_ADDONLANG['nviSettings'] = 'NVI KPS Doğrulama Ayarları';
$_ADDONLANG['nviSettingsDesc'] = 'Nüfus ve Vatandaşlık İşleri Genel Müdürlüğü\'nün sağladığı KPS (Kimlik Paylaşım Sistemi) servislerine erişim için gerekli kullanıcı adı ve şifre.';
$_ADDONLANG['nviKpsUserLabel'] = 'KPS Kullanıcı Adı';
$_ADDONLANG['nviKpsPassLabel'] = 'KPS Şifresi';
$_ADDONLANG['nvi_kps_mode'] = 'NVI KPS Sistemi Modu';
$_ADDONLANG['btk_ekayit_mode'] = 'BTK E-Kayıt Sistemi Modu';
$_ADDONLANG['mode_test'] = 'TEST';
$_ADDONLANG['mode_canli'] = 'CANLI';
$_ADDONLANG['btkYetkilendirmeSecenekleri'] = 'BTK Yetkilendirme Seçenekleri';
$_ADDONLANG['btkYetkilendirmeDesc'] = 'Firmanızın sahip olduğu ve raporlama yapacağınız BTK yetkilendirme türlerini seçiniz.';
$_ADDONLANG['otherSettings'] = 'Diğer Ayarlar';
$_ADDONLANG['sendEmptyReports'] = 'Boş Raporları Gönder';
$_ADDONLANG['sendEmptyReportsDesc'] = 'İlgili dönemde hareket olmasa bile boş rapor dosyaları oluşturulup FTP\'ye gönderilsin.';
$_ADDONLANG['debugMode'] = 'Hata Ayıklama Modu';
$_ADDONLANG['debugModeDesc'] = 'Aktif edildiğinde, modül loglarına daha detaylı bilgi kaydedilir. Sadece sorun giderme amaçlı kullanın.';
$_ADDONLANG['deleteDataOnDeactivate'] = 'Modül Devre Dışı Bırakıldığında Verileri Sil';
$_ADDONLANG['deleteDataOnDeactivateDesc'] = 'DİKKAT! Bu seçenek aktif edilirse, modül devre dışı bırakıldığında tüm BTK tabloları ve verileri kalıcı olarak silinir.';
$_ADDONLANG['configSaveSuccess'] = 'Ayarlar başarıyla kaydedildi.';

// ==================================================================
// == ÜRÜN GRUBU EŞLEŞTİRME SAYFASI (product_group_mappings.tpl)
// ==================================================================
$_ADDONLANG['productGroupMappingsIntro'] = 'Bu bölümde, WHMCS\'teki ürün gruplarınızı, ilgili BTK Yetki Türleri ve Hizmet Tipleri ile eşleştirmelisiniz. Bu eşleştirme, hangi hizmetin hangi raporun içinde yer alacağını belirler.';
$_ADDONLANG['productGroupMappingsHelpText'] = 'Sadece Genel Ayarlar sayfasında aktif ettiğiniz yetki türleri burada listelenir. Bir ürün grubu için eşleştirme yapmazsanız, o gruba ait hizmetler BTK raporlarına dahil edilmez.';
$_ADDONLANG['btkAuthTypeToMapHeader'] = 'Eşleştirilecek BTK Yetki Türü';
$_ADDONLANG['btkAuthTypeToMapTooltip'] = 'Bu ürün grubunun dahil olacağı ana BTK yetkisi. Rapor dosyası adındaki (ISS, STH vb.) grup adını belirler.';
$_ADDONLANG['serviceHizmetTipiTooltip'] = 'Rapor içeriğindeki HIZMET_TIPI alanını belirler. Sadece seçtiğiniz ana yetki grubuna uygun hizmet tipleri listelenir.';
$_ADDONLANG['selectBtkAuthTypeOption'] = 'Lütfen Bir Yetki Türü Seçin';
$_ADDONLANG['selectAnaYetkiFirst'] = 'Önce Ana Yetki Türünü Seçin';
$_ADDONLANG['noEk3ForSelectedAuth'] = 'Seçilen yetki türüne uygun hizmet tipi bulunamadı.';
$_ADDONLANG['noProductGroupsFound'] = 'WHMCS sisteminizde tanımlı ürün grubu bulunamadı.';
$_ADDONLANG['noActiveAuthTypesForMapping'] = 'Raporlama için aktif edilmiş BTK Yetki Türü bulunmamaktadır. Lütfen önce Genel Ayarlar\'dan seçim yapın.';
$_ADDONLANG['mappingsSaveSuccess'] = 'Ürün grubu eşleştirmeleri başarıyla kaydedildi ve mevcut aboneler için ilk kayıtlar oluşturulmaya başlandı.';
$_ADDONLANG['mappingsSaveError'] = 'Eşleştirmeler kaydedilirken bir hata oluştu.';

// ==================================================================
// == VERİ YÖNETİMİ SAYFASI (data_management.tpl)
// ==================================================================
$_ADDONLANG['dataManagementIntro'] = 'Bu bölüm, modülün çalışması için gerekli olan adres verilerini yönetmenizi ve geçmişe dönük abone hareketlerini oluşturmanızı sağlar.';
$_ADDONLANG['addressDataSetsTitle'] = 'Adres Veri Setleri';
$_ADDONLANG['ilDataSet'] = 'İl Veri Seti';
$_ADDONLANG['ilceDataSet'] = 'İlçe Veri Seti';
$_ADDONLANG['mahalleDataSet'] = 'Mahalle Veri Setleri';
$_ADDONLANG['statusLoaded'] = 'Yüklü';
$_ADDONLANG['statusNotLoaded'] = 'Yüklü Değil';
$_ADDONLANG['loadButton'] = 'Yükle';
$_ADDONLANG['selectIlForMahalle'] = 'İlgili ilçenin mahallelerini yüklemek için aşağıdaki listeden seçim yapın.';
$_ADDONLANG['selectIlceForMahalle'] = 'İl - İlçe Seçin';
$_ADDONLANG['dataSetLoading'] = 'Veri seti yükleniyor, lütfen bekleyin...';
$_ADDONLANG['dataSetLoadSuccess'] = 'Veri seti başarıyla yüklendi. Sayfa yenileniyor...';
$_ADDONLANG['dataSetLoadError'] = 'Veri seti yüklenirken bir hata oluştu.';
$_ADDONLANG['rebuildHistoryTitle'] = 'Tarihsel Veri İnşa Aracı';
$_ADDONLANG['rebuildHistoryWarning'] = 'DİKKAT: Bu işlem, mevcut abone hareket tablolarını temizleyebilir ve WHMCS fatura kayıtlarınıza göre geçmiş hareketleri yeniden oluşturur. Bu işlem geri alınamaz ve büyük veritabanlarında uzun sürebilir. Lütfen başlamadan önce veritabanı yedeği alınız.';
$_ADDONLANG['rebuildHistoryLabel'] = 'Milat Tarihi Seçin:';
$_ADDONLANG['rebuildHistoryButton'] = 'Tarihinden İtibaren Geçmişi İnşa Et';

// ==================================================================
// == BTK VERİ ALANLARI (SEKMELER VE PANELLER İÇİN)
// ==================================================================
$_ADDONLANG['btkInfoMissingWarning'] = 'DİKKAT: Bu müşterinin BTK yasal bilgileri eksiktir. Lütfen aşağıdaki alanları doldurun.';
$_ADDONLANG['musteriTipiLabel'] = 'Müşteri Tipi';
$_ADDONLANG['musteriTipiGSahis'] = 'Gerçek Kişi (Şahıs)';
$_ADDONLANG['musteriTipiTSirket'] = 'Tüzel Kişi (Şirket)';
$_ADDONLANG['aboneUyrukLabel'] = 'Uyruk';
$_ADDONLANG['abonePasaportNoLabel'] = 'Pasaport No';
$_ADDONLANG['aboneBabaAdiLabel'] = 'Baba Adı';
$_ADDONLANG['aboneAnaAdiLabel'] = 'Ana Adı';
$_ADDONLANG['aboneCinsiyetLabel'] = 'Cinsiyet';
$_ADDONLANG['genderMale'] = 'Erkek';
$_ADDONLANG['genderFemale'] = 'Kadın';
$_ADDONLANG['aboneDogumYeriLabel'] = 'Doğum Yeri';
$_ADDONLANG['aboneDogumTarihiLabel'] = 'Doğum Tarihi';
$_ADDONLANG['aboneKimlikTipiLabel'] = 'Kimlik Tipi';
$_ADDONLANG['aboneKimlikSeriNoLabel'] = 'Kimlik Seri No';
$_ADDONLANG['btkServiceInformationTitle'] = 'BTK Hizmet Bilgileri';
$_ADDONLANG['serviceHatNoLabel'] = 'Hat Numarası';
$_ADDONLANG['serviceHatNoTooltip'] = 'Bu hizmetin BTK sistemlerindeki tekil numarasıdır. Alan adı, IP adresi veya "S" ile başlayan hizmet ID\'si olabilir.';
$_ADDONLANG['serviceHizmetTipiLabel'] = 'Hizmet Tipi (EK-3)';
$_ADDONLANG['serviceAboneBaslangicLabel'] = 'Abonelik Başlangıç Zamanı';
$_ADDONLANG['serviceAboneTarifeLabel'] = 'Tarife Adı';
$_ADDONLANG['serviceStatikIpLabel'] = 'Statik IP Adresi';
$_ADDONLANG['issHizProfiliLabel'] = 'Hız Profili';
$_ADDONLANG['issKullaniciAdiLabel'] = 'Kullanıcı Adı (PPPoE/Hotspot)';
$_ADDONLANG['issPopNoktasiLabel'] = 'POP Noktası';
$_ADDONLANG['adresIlLabel'] = 'İl';
$_ADDONLANG['adresIlceLabel'] = 'İlçe';
$_ADDONLANG['adresMahalleLabel'] = 'Mahalle';
$_ADDONLANG['selectIlOption'] = 'Lütfen İl Seçin';
$_ADDONLANG['selectIlceOption'] = 'Lütfen İlçe Seçin';
$_ADDONLANG['selectMahalleOption'] = 'Lütfen Mahalle Seçin';
$_ADDONLANG['nviVerifyButton'] = 'NVI ile Doğrula';
$_ADDONLANG['nviVerificationSuccess'] = 'Kimlik bilgileri NVI üzerinden başarıyla doğrulandı.';
$_ADDONLANG['nviVerificationFail'] = 'Kimlik bilgileri NVI üzerinden doğrulanamadı. Lütfen bilgileri kontrol edin.';
$_ADDONLANG['nviVerificationError'] = 'NVI servisine bağlanırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
$_ADDONLANG['nviVerificationSkipped'] = 'NVI doğrulama ayarları yapılmadığı için bu adım atlandı.';

// ==================================================================
// == PERSONEL SAYFASI
// ==================================================================
$_ADDONLANG['personelIntroText'] = 'Bu bölümden BTK\'ya raporlanacak personel listesini yönetebilirsiniz. WHMCS yöneticileri otomatik olarak senkronize edilir.';
$_ADDONLANG['addNewPersonelButton'] = 'Yeni Personel Ekle';
$_ADDONLANG['personelAdiSoyadiHeader'] = 'Adı Soyadı';
$_ADDONLANG['personelEpostaHeader'] = 'E-posta';
$_ADDONLANG['personelBtkListesineEklensinHeader'] = 'BTK Listesinde';
$_ADDONLANG['noPersonelFound'] = 'Kayıtlı personel bulunamadı.';
$_ADDONLANG['confirmDeletePersonelText'] = '%s isimli personeli silmek istediğinizden emin misiniz?';
$_ADDONLANG['personelDateValidationError'] = 'İşten ayrılma tarihi, işe başlama tarihinden önce olamaz.';

// ==================================================================
// == POP NOKTASI SAYFASI
// ==================================================================
$_ADDONLANG['issPopManagementIntro'] = 'Bu bölümden ISS hizmetleri için kullandığınız POP (Point of Presence) noktalarını tanımlayabilirsiniz.';
$_ADDONLANG['addNewPopButton'] = 'Yeni POP Noktası Ekle';
$_ADDONLANG['popAdiHeader'] = 'POP Adı';
$_ADDONLANG['popAdiLabel'] = 'POP Adı / Cihaz Adı';
$_ADDONLANG['popYayinYapilanSsidHeader'] = 'Yayın Yapılan SSID';
$_ADDONLANG['popIlIlceHeader'] = 'İl / İlçe';
$_ADDONLANG['popLiveStatusHeader'] = 'Canlı Durum';
$_ADDONLANG['popMonitoringActiveHeader'] = 'İzleme Aktif';
$_ADDONLANG['popTipiHeader'] = 'POP Tipi';
$_ADDONLANG['confirmDeletePopText'] = '%s adlı POP noktasını silmek istediğinizden emin misiniz?';

// ==================================================================
// == MANUEL RAPORLAR SAYFASI
// ==================================================================
$_ADDONLANG['generateReportsIntro'] = 'Bu sayfadan istediğiniz zaman manuel olarak rapor oluşturabilir, indirebilir veya FTP sunucularınıza gönderebilirsiniz.';
$_ADDONLANG['generateRehberReportTitle'] = 'Abone Rehber Raporu Oluştur';
$_ADDONLANG['generateHareketReportTitle'] = 'Abone Hareket Raporu Oluştur';
$_ADDONLANG['generatePersonelReportTitle'] = 'Personel Raporu Oluştur';
$_ADDONLANG['generateOnlyButton'] = 'Oluştur ve İndir';
$_ADDONLANG['generateAndSendMainFtpButton'] = 'Oluştur ve Ana FTP\'ye Gönder';
$_ADDONLANG['generateAndSendBackupFtpButton'] = 'Oluştur ve Yedek FTP\'ye Gönder';
$_ADDONLANG['noDataToExport'] = 'Raporlanacak yeni veri bulunamadı.';

// ==================================================================
// == LOG GÖRÜNTÜLEME SAYFASI
// ==================================================================
$_ADDONLANG['viewLogsIntro'] = 'Modülün çalışması sırasında oluşan tüm olayları, uyarıları ve hataları bu bölümden takip edebilirsiniz.';
$_ADDONLANG['logLevelFilterLabel'] = 'Log Seviyesi';
$_ADDONLANG['allLogLevelsOption'] = 'Tüm Seviyeler';
$_ADDONLANG['dateRangeFilterLabel'] = 'Tarih Aralığı';
$_ADDONLANG['searchTermPlaceholder'] = 'İşlem veya mesaj içinde ara...';
$_ADDONLANG['filterButton'] = 'Filtrele';
$_ADDONLANG['resetFilterButton'] = 'Sıfırla';
$_ADDONLANG['logLevelHeader'] = 'Seviye';
$_ADDONLANG['logActionHeader'] = 'İşlem';
$_ADDONLANG['logMessageHeader'] = 'Mesaj';
$_ADDONLANG['logFileNameHeader'] = 'Dosya Adı';
$_ADDONLANG['logStatusHeader'] = 'Durum';
$_ADDONLANG['noGeneralLogsFound'] = 'Filtre kriterlerine uygun genel log kaydı bulunamadı.';
$_ADDONLANG['noFtpLogsFound'] = 'Filtre kriterlerine uygun FTP log kaydı bulunamadı.';
$_ADDONLANG['deleteAllLogsButton'] = 'Tüm Logları Temizle';
$_ADDONLANG['confirmDeleteLogsModalText'] = 'Tüm modül ve FTP günlük kayıtlarını kalıcı olarak silmek istediğinizden emin misiniz?';
$_ADDONLANG['logsDeletedSuccess'] = 'Tüm günlük kayıtları başarıyla silindi.';

// ==================================================================
// == MÜŞTERİ PANELİ METİNLERİ
// ==================================================================
$_ADDONLANG['btkInformationTitleClientArea'] = 'BTK Bilgileri';
$_ADDONLANG['customerYerlesimAdresiTitleClientArea'] = 'Yerleşim Adresi';
$_ADDONLANG['btkInfoUpdateContactAdmin'] = 'Bu bilgileri güncellemek için lütfen bizimle iletişime geçin.';
$_ADDONLANG['btkServiceInformationTitleClientArea'] = 'BTK Hizmet Bilgileri';
$_ADDONLANG['serviceHatNoLabelClientArea'] = 'Hat No';
$_ADDONLANG['serviceAboneBaslangicLabelClientArea'] = 'Abonelik Başlangıç';
$_ADDONLANG['serviceTesisAdresiTitleClientArea'] = 'Hizmetin Teslim Edildiği Adres';
$_ADDONLANG['tesisAdresiYerlesimleAyniClientArea'] = 'Hizmet adresi, fatura adresiniz ile aynıdır.';
$_ADDONLANG['adresDisKapiNoLabel'] = 'Dış Kapı No';
$_ADDONLANG['adresIcKapiNoLabel'] = 'İç Kapı No';

// ==================================================================
// == GENEL METİNLER VE BUTONLAR
// ==================================================================
$_ADDONLANG['saveChanges'] = 'Değişiklikleri Kaydet';
$_ADDONLANG['selectOption'] = 'Lütfen Seçin...';
$_ADDONLANG['loadingData'] = 'Veri Yükleniyor...';
$_ADDONLANG['actionsHeader'] = 'İşlemler';
$_ADDONLANG['editButton'] = 'Düzenle';
$_ADDONLANG['deleteButton'] = 'Sil';
$_ADDONLANG['closeButton'] = 'Kapat';
$_ADDONLANG['saveButton'] = 'Kaydet';
$_ADDONLANG['statusLabel'] = 'Durum';
$_ADDONLANG['active'] = 'AKTİF';
$_ADDONLANG['passive'] = 'PASİF';
$_ADDONLANG['bilinmiyor'] = 'Bilinmiyor';
$_ADDONLANG['errorOccurred'] = 'Bir Hata Oluştu';
$_ADDONLANG['confirmButton'] = 'Evet, Onayla';
$_ADDONLANG['cancelButton'] = 'İptal';
$_ADDONLANG['warningIrreversibleAction'] = 'Uyarı: Bu işlem geri alınamaz!';
$_ADDONLANG['serviceCannotDeleteBtkReason'] = 'Bu hizmetin bir BTK kaydı olduğu için silinemez. Lütfen önce hizmeti iptal (Cancelled) durumuna getirin.';
$_ADDONLANG['invalidCronExpression'] = 'Geçersiz Cron Formatı';
$_ADDONLANG['notConfigured'] = 'Ayarlanmamış';
$_ADDONLANG['noSubmissionYet'] = 'Henüz Gönderim Yapılmadı';

return $_ADDONLANG;