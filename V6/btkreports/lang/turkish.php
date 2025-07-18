<?php
/**
 * WHMCS BTK Raporlama Modülü - Türkçe Dil Dosyası
 * Dosya: modules/addons/btkreports/lang/turkish.php
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// Global (Modül Genelinde Kullanılanlar)
$_ADDONLANG['moduleName'] = "BTK Raporlama Modülü";
$_ADDONLANG['saveChangesButton'] = "Değişiklikleri Kaydet";
$_ADDONLANG['saveButton'] = "Kaydet";
$_ADDONLANG['cancelButton'] = "İptal";
$_ADDONLANG['closeButton'] = "Kapat";
$_ADDONLANG['editButton'] = "Düzenle";
$_ADDONLANG['deleteButton'] = "Sil";
$_ADDONLANG['confirmButton'] = "Onayla"; // Genel onay butonu (örn: log silme modalı için)
$_ADDONLANG['actionsHeader'] = "İşlemler";
$_ADDONLANG['statusLabel'] = "Durum";
$_ADDONLANG['statusActive'] = "Aktif";
$_ADDONLANG['statusPassive'] = "Pasif";
$_ADDONLANG['statusPending'] = "Beklemede";
$_ADDONLANG['statusSuccess'] = "Başarılı";
$_ADDONLANG['statusError'] = "Hatalı";
$_ADDONLANG['yes'] = "Evet";
$_ADDONLANG['no'] = "Hayır";
$_ADDONLANG['active'] = "Aktif"; // Toggle için
$_ADDONLANG['passive'] = "Pasif"; // Toggle için
$_ADDONLANG['selectOption'] = "Lütfen Seçiniz...";
$_ADDONLANG['notAvailable'] = "Belirtilmemiş";
$_ADDONLANG['notConfigured'] = "Yapılandırılmamış";
$_ADDONLANG['loadingData'] = "Veri Yükleniyor...";
$_ADDONLANG['noDataFound'] = "Veri Bulunamadı";
$_ADDONLANG['ajaxRequestFailed'] = "Sunucu isteği başarısız oldu. Lütfen tekrar deneyin.";
$_ADDONLANG['errorOccurred'] = "Bir hata oluştu.";
$_ADDONLANG['validationErrorsOccurred'] = "Doğrulama hataları oluştu";
$_ADDONLANG['dateFormatYYYYMMDDTooltip'] = "Format: YYYYAAGS (Örn: 19801231)";
$_ADDONLANG['dateFormatYYYYMMDDHHMMSSTooltip'] = "Format: YYYYAAGGSSddss (Örn: 20240520143000)";
$_ADDONLANG['csrfTokenError'] = "Geçersiz güvenlik kodu. Lütfen sayfayı yenileyip tekrar deneyin.";
$_ADDONLANG['unknownAjaxRequest'] = "Bilinmeyen AJAX isteği.";


// Ana Sayfa (index.tpl)
$_ADDONLANG['dashboardPageTitle'] = "BTK Raporlama - Ana Sayfa";
$_ADDONLANG['moduleInfoTitle'] = "Modül Bilgileri";
$_ADDONLANG['moduleVersionLabel'] = "Modül Sürümü:";
$_ADDONLANG['releaseNotesLabel'] = "Sürüm Notları:";
$_ADDONLANG['viewReleaseNotesButton'] = "Sürüm Notlarını Görüntüle";
$_ADDONLANG['releaseNotesNotFound'] = "Sürüm notları dosyası bulunamadı.";
$_ADDONLANG['ftpServerStatusTitle'] = "FTP Sunucu Durumları";
$_ADDONLANG['checkingFtpStatus'] = "FTP durumları kontrol ediliyor...";
$_ADDONLANG['ftpServerTypeLabel'] = "FTP Sunucu Türü";
$_ADDONLANG['ftpHostLabel'] = "FTP Sunucusu (Host):";
$_ADDONLANG['ftpMainServerLabel'] = "Ana BTK FTP Sunucusu";
$_ADDONLANG['ftpBackupServerLabel'] = "Yedek FTP Sunucusu";
$_ADDONLANG['refreshFtpStatusButton'] = "Durumları Yenile";
$_ADDONLANG['lastSubmissionsTitle'] = "Son Rapor Gönderimleri";
$_ADDONLANG['rehberReportLabel'] = "ABONE REHBER Raporu";
$_ADDONLANG['hareketReportLabel'] = "ABONE HAREKET Raporu";
$_ADDONLANG['personelReportLabel'] = "PERSONEL Listesi Raporu";
$_ADDONLANG['noSubmissionYet'] = "Henüz gönderim yapılmamış.";
$_ADDONLANG['generatedFileName'] = "Oluşturulan Dosya Adı";
$_ADDONLANG['quickAccessTitle'] = "Hızlı Erişim";
$_ADDONLANG['goToSettingsButton'] = "Genel Ayarlar";
$_ADDONLANG['goToGenerateReportButton'] = "Manuel Rapor Oluştur";
$_ADDONLANG['goToLogsButton'] = "Günlük Kayıtları";
$_ADDONLANG['btkInfoTitle'] = "BTK Sunucularına Veri Gönderim Modülü Hakkında Yardım ve Bilgilendirme";
$_ADDONLANG['btkInfoText1'] = "Modülün doğru çalışması için lütfen öncelikle \"Genel Ayarlar\" bölümünden gerekli tüm yapılandırmaları yapın.";
$_ADDONLANG['btkInfoText2'] = "Daha sonra \"Ürün Grubu - BTK Yetki Eşleştirme\" bölümünden WHMCS ürün gruplarınızı ilgili BTK kategorileri ile eşleştirin.";
$_ADDONLANG['btkInfoText3'] = "Müşteri ve hizmet bazlı BTK verilerini, ilgili müşteri özet sayfasındaki \"BTK Bilgileri\" sekmesinden ve hizmet detay sayfasındaki \"BTK Hizmet Bilgileri\" bölümünden yönetebilirsiniz.";
$_ADDONLANG['btkInfoText4'] = "Raporlar, cron job ayarlarınıza bağlı olarak otomatik oluşturulacak ve FTP'ye yüklenecektir. Manuel rapor oluşturma ve gönderme işlemleri için \"Rapor Oluştur\" sayfasını kullanabilirsiniz.";

// Genel Ayarlar (config.tpl)
$_ADDONLANG['configPageTitle'] = "BTK Raporlama - Genel Ayarlar";
$_ADDONLANG['configSaveSuccess'] = "Ayarlar başarıyla kaydedildi.";
$_ADDONLANG['configSaveError'] = "Ayarlar kaydedilirken bir hata oluştu";
$_ADDONLANG['operatorInfoTitle'] = "Operatör Bilgileri";
$_ADDONLANG['operatorCodeLabel'] = "Operatör Kodu (BTK):";
$_ADDONLANG['operatorCodeTooltip'] = "BTK tarafından size atanan 3 haneli operatör kodu (Örn: 701).";
$_ADDONLANG['operatorNameLabel'] = "Operatör Adı (BTK):";
$_ADDONLANG['operatorNameTooltip'] = "BTK tarafından belirlenen işletmeci adı (Örn: IZMARBILISIM). Dosya adlarında kullanılır, Türkçe karakter ve boşluk içermemelidir.";
$_ADDONLANG['operatorTitleLabel'] = "Operatör Resmi Ünvanı:";
$_ADDONLANG['operatorTitleTooltip'] = "Şirketinizin Ticaret Sicilinde kayıtlı tam resmi ünvanı. Personel raporunda kullanılır.";
$_ADDONLANG['operatorTitlePlaceholder'] = "İZMAR BİLİŞİM HİZMETLERİ SANAYİ TİCARET LİMİTED ŞİRKETİ";
$_ADDONLANG['operatorTitleHelpText'] = "Bu alan sadece PERSONEL Listesi Excel dosyasında 'Firma Adı' olarak kullanılacaktır.";
$_ADDONLANG['mainFtpSettingsTitle'] = "Ana FTP Sunucu Ayarları (BTK)";
$_ADDONLANG['ftpUserLabel'] = "FTP Kullanıcı Adı:";
$_ADDONLANG['ftpPassLabel'] = "FTP Şifresi:";
$_ADDONLANG['ftpPassHelpText'] = "Şifre girilirse mevcut şifre güncellenir. Boş bırakılırsa mevcut şifre değişmez.";
$_ADDONLANG['testFtpConnectionButton'] = "Bağlantıyı Test Et";
$_ADDONLANG['testingFtpConnection'] = "Bağlantı test ediliyor...";
$_ADDONLANG['ftpTestFailed'] = "FTP Bağlantı Testi Başarısız Oldu";
$_ADDONLANG['ftpRehberPathLabel'] = "REHBER Dosya Yolu:";
$_ADDONLANG['ftpHareketPathLabel'] = "HAREKET Dosya Yolu:";
$_ADDONLANG['ftpPersonelPathLabel'] = "PERSONEL Dosya Yolu:";
$_ADDONLANG['ftpPathTooltip'] = "Dosyaların yükleneceği FTP sunucusundaki klasör yolu (Örn: /ABONE_DOSYALARI/REHBER/). Başına ve sonuna / (slash) eklemeyi unutmayın.";
$_ADDONLANG['useBackupFtpLabel'] = "Yedek FTP Sunucusu Kullanılsın mı?";
$_ADDONLANG['backupFtpSettingsTitle'] = "Yedek FTP Sunucu Ayarları";
$_ADDONLANG['btkAuthTypesTitle'] = "Bilgi Teknolojileri ve İletişim Kurum (BTK) Yetkilendirme Seçenekleri";
$_ADDONLANG['btkAuthTypesHelpText'] = "Sahip olduğunuz ve raporlama yapacağınız BTK yetki türlerini seçin. Bu seçim, \"Ürün Grubu Eşleştirme\" sayfasındaki seçenekleri etkileyecektir.";
$_ADDONLANG['yetkiInfoPrefix'] = "Bu yetki türü hakkında kısa bilgi: ";
$_ADDONLANG['noAuthTypesFound'] = "Veritabanında tanımlı BTK Yetki Türü bulunamadı. Lütfen initial_reference_data.sql dosyasını kontrol edin.";
$_ADDONLANG['otherSettingsTitle'] = "Diğer Ayarlar";
$_ADDONLANG['sendEmptyReportsLabel'] = "Boş Rapor Gönderilsin mi?";
$_ADDONLANG['sendEmptyReportsTooltip'] = "Eğer ilgili yetki türüne ait raporlanacak veri olmasa bile, BTK boş dosya gönderimini talep ediyorsa bu seçeneği işaretleyin.";
$_ADDONLANG['personelFilenameAddYearMonthMainLabel'] = "Ana FTP'ye Personel Dosya Adına Yıl-Ay Eklensin mi?";
$_ADDONLANG['personelFilenameAddYearMonthBackupLabel'] = "Yedek FTP'ye Personel Dosya Adına Yıl-Ay Eklensin mi?";
$_ADDONLANG['personelFilenameAddYearMonthTooltip'] = "İşaretlenirse, personel Excel dosyası 'OPERATORADI_Personel_Listesi_YIL_AY.xlsx' formatında olur. İşaretlenmezse sadece 'Personel_Listesi.xlsx' olur.";
$_ADDONLANG['deleteDataOnDeactivateLabel'] = "Modül Devre Dışı Bırakıldığında Veriler Silinsin mi?";
$_ADDONLANG['deleteDataOnDeactivateTooltip'] = "DİKKAT! Bu seçenek işaretlenirse, modül devre dışı bırakıldığında bu modüle ait tüm veritabanı tabloları ve ayarları silinecektir.";
$_ADDONLANG['cronSettingsTitle'] = "Cron Job Zamanlama Ayarları";
$_ADDONLANG['cronSettingsTooltip'] = "Raporların otomatik oluşturulup FTP'ye gönderilme zamanlamaları. Standart cronjob formatını kullanın.";
$_ADDONLANG['cronRehberScheduleLabel'] = "REHBER Raporu Cron:";
$_ADDONLANG['cronHareketScheduleLabel'] = "HAREKET Raporu Cron:";
$_ADDONLANG['cronPersonelScheduleLabel'] = "PERSONEL Raporu Cron:";
$_ADDONLANG['cronPersonelHelpText'] = "Örn: '0 16 * * *' (Her gün 16:00). Script içi kontrolle Haziran ve Aralık son günleri işlenir.";
$_ADDONLANG['hareketLiveTableDayLimitLabel'] = "Canlı Hareket Tablosu Gün Limiti:";
$_ADDONLANG['hareketLiveTableDayLimitTooltip'] = "Canlı hareket tablosunda kaç günlük hareket verisinin tutulacağını belirtir. Bu süreyi aşan gönderilmiş hareketler arşive taşınır.";
$_ADDONLANG['hareketArchiveTableDayLimitLabel'] = "Arşiv Hareket Tablosu Gün Limiti:";
$_ADDONLANG['hareketArchiveTableDayLimitTooltip'] = "Arşiv hareket tablosunda kaç günlük verinin tutulacağını belirtir. Bu süreyi aşan arşivlenmiş hareketler periyodik olarak (ileride eklenecek bir özellikle) silinebilir.";


// Ürün Grubu Eşleştirme (product_group_mappings.tpl)
$_ADDONLANG['productGroupMappingsPageTitle'] = "BTK - Ürün Grubu Yetki Eşleştirme";
$_ADDONLANG['productGroupMappingsIntro'] = "Bu bölümde, WHMCS ürün gruplarınızı, Genel Ayarlar'da aktif ettiğiniz BTK Yetki Türleri ile eşleştirebilirsiniz.";
$_ADDONLANG['productGroupMappingsHelpText'] = "Her ürün grubu için bir BTK Yetki Türü seçerek, o gruptaki hizmetlerin hangi BTK raporu (ve dosya adı _TIP_ eki) altında raporlanacağını belirlersiniz.";
$_ADDONLANG['productGroupNameHeader'] = "WHMCS Ürün Grubu Adı";
$_ADDONLANG['btkAuthTypeToMapHeader'] = "Eşleştirilecek BTK Yetki Türü";
$_ADDONLANG['btkAuthTypeToMapTooltip'] = "Seçilen yetki türünün 'Rapor Tipi Eki' dosya adlarında kullanılacaktır.";
$_ADDONLANG['selectBtkAuthTypeOption'] = "BTK Yetki Türü Seçin...";
$_ADDONLANG['noActiveAuthTypesForMapping'] = "Eşleştirme için aktif edilmiş BTK Yetki Türü bulunmuyor. Lütfen Genel Ayarlar'dan yetki türlerini aktif edin.";
$_ADDONLANG['noProductGroupsFound'] = "WHMCS'de tanımlı ürün grubu bulunamadı.";
$_ADDONLANG['mappingsSaveSuccess'] = "Ürün grubu eşleştirmeleri başarıyla kaydedildi.";
$_ADDONLANG['mappingsSaveError'] = "Ürün grubu eşleştirmeleri kaydedilirken bir hata oluştu.";
$_ADDONLANG['reportTypeAbbr'] = "Rapor Tipi";

// Personel Yönetimi (personel.tpl)
$_ADDONLANG['personelPageTitle'] = "BTK - Personel Yönetimi";
$_ADDONLANG['personelIntroText'] = "Bu bölüm, BTK'ya gönderilecek personel listesi için gerekli bilgileri yönetmenizi sağlar.";
$_ADDONLANG['personelHelpText'] = "Personel bilgileri WHMCS adminlerinden otomatik olarak çekilir. Eksik veya BTK için özel olan bilgileri (TCKN, Ünvan, Çalıştığı Birim) buradan güncelleyebilirsiniz. 'BTK Listesine Eklensin' seçeneği ile hangi personelin rapora dahil edileceğini belirleyebilirsiniz.";
$_ADDONLANG['personelAdiHeader'] = "Adı";
$_ADDONLANG['personelSoyadiHeader'] = "Soyadı";
$_ADDONLANG['personelTcKimlikNoHeader'] = "TC Kimlik No";
$_ADDONLANG['personelUnvanHeader'] = "Ünvan (BTK)";
$_ADDONLANG['personelCalistigiBirimHeader'] = "Çalıştığı Birim (BTK)";
$_ADDONLANG['personelEpostaHeader'] = "E-posta";
$_ADDONLANG['personelBtkListesineEklensinHeader'] = "BTK Listesine Eklensin?";
$_ADDONLANG['personelBtkListesineEklensinTooltip'] = "Bu personel BTK'ya gönderilecek Excel listesine dahil edilsin mi?";
$_ADDONLANG['noPersonelFound'] = "Yönetilecek personel kaydı bulunamadı. WHMCS adminlerinizle senkronize edilmiş olabilir.";
$_ADDONLANG['savePersonelChangesButton'] = "Personel Değişikliklerini Kaydet";
$_ADDONLANG['personelListSaveSuccess'] = "Personel listesi başarıyla güncellendi.";
$_ADDONLANG['personelListSaveError'] = "Personel listesi güncellenirken bir hata oluştu.";
$_ADDONLANG['editPersonelModalTitle'] = "Personel Bilgilerini Düzenle";
$_ADDONLANG['addNewPersonelButton'] = "Yeni Personel Ekle"; // Eğer manuel ekleme olacaksa
$_ADDONLANG['personelTcKimlikNoPlaceholder'] = "11 Haneli TCKN";
$_ADDONLANG['personelUnvanPlaceholder'] = "Örn: Teknik Destek Uzmanı";
$_ADDONLANG['personelCalistigiBirimPlaceholder'] = "Örn: Müşteri Hizmetleri";
$_ADDONLANG['personelAdiLabel'] = "Adı (WHMCS):";
$_ADDONLANG['personelSoyadiLabel'] = "Soyadı (WHMCS):";
$_ADDONLANG['personelTcKimlikNoLabel'] = "TC Kimlik No (BTK):";
$_ADDONLANG['personelEpostaLabel'] = "E-posta (WHMCS):";
$_ADDONLANG['personelUnvanLabel'] = "Ünvan (BTK):";
$_ADDONLANG['personelCalistigiBirimLabel'] = "Çalıştığı Birim (BTK):";
$_ADDONLANG['personelMobilTelefonuLabel'] = "Mobil Telefonu (BTK):";
$_ADDONLANG['personelSabitTelefonuLabel'] = "Sabit Telefonu (BTK):";
$_ADDONLANG['personelIkInfoHeader'] = "Ek İK Bilgileri (BTK Raporu İçin Gerekli Değil)";
$_ADDONLANG['personelIseBaslamaTarihiLabel'] = "İşe Başlama Tarihi:";
$_ADDONLANG['personelIstenAyrilmaTarihiLabel'] = "İşten Ayrılma Tarihi:";
$_ADDONLANG['personelEvAdresiLabel'] = "Ev Adresi:";
$_ADDONLANG['personelAcilDurumKisisiLabel'] = "Acil Durumda Aranacak Kişi ve İletişim:";
$_ADDONLANG['personelIsBirakmaNedeniLabel'] = "İş Bırakma Nedeni:";
$_ADDONLANG['personelBtkListesineEklensinLabelModal'] = "Bu Personel BTK Listesine Eklensin mi?";
$_ADDONLANG['errorFetchingPersonelDetails'] = "Personel detayları çekilirken hata oluştu.";
$_ADDONLANG['personelDetailSaveSuccess'] = "Personel detayları başarıyla güncellendi.";
$_ADDONLANG['personelDetailSaveError'] = "Personel detayları güncellenirken bir hata oluştu.";
$_ADDONLANG['tcknValid'] = "TCKN Geçerli.";
$_ADDONLANG['tcknInvalid'] = "TCKN Geçersiz veya bilgiler eşleşmiyor.";
$_ADDONLANG['tcknInvalidInput'] = "TCKN, Ad, Soyad ve Doğum Yılı boş olamaz veya formatı hatalı.";
$_ADDONLANG['tcknValidationFailedAjax'] = "TCKN doğrulama servisine ulaşılamadı.";
$_ADDONLANG['tcknMustBe11Digits'] = "TCKN 11 haneli olmalıdır.";
$_ADDONLANG['tcknNotValidatedWarningConfirm'] = "TC Kimlik Numarası doğrulanmadı veya hatalı. Yine de kaydetmek istediğinize emin misiniz?";


// ISS POP Yönetimi (iss_pop_management.tpl)
$_ADDONLANG['issPopManagementPageTitle'] = "BTK - ISS POP Noktası Yönetimi";
$_ADDONLANG['issPopManagementIntro'] = "Bu bölüm, İnternet Servis Sağlayıcınıza ait POP (Point of Presence), Baz İstasyonu, Santral gibi fiziksel nokta bilgilerini yönetmenizi sağlar.";
$_ADDONLANG['addNewPopButton'] = "Yeni POP Noktası Ekle";
$_ADDONLANG['popKoduHeader'] = "POP Kodu";
$_ADDONLANG['popAdiHeader'] = "POP Adı";
$_ADDONLANG['popTipiHeader'] = "POP Tipi";
$_ADDONLANG['popIlIlceHeader'] = "İl / İlçe";
$_ADDONLANG['popYayinYapilanSsidHeader'] = "Yayınlanan SSID";
$_ADDONLANG['popYonetimIpHeader'] = "Yönetim IP";
$_ADDONLANG['popDurumHeader'] = "Durum";
$_ADDONLANG['noPopDefinitionsFound'] = "Tanımlı POP noktası bulunamadı.";
$_ADDONLANG['editPopModalTitle'] = "POP Noktası Bilgilerini Düzenle";
$_ADDONLANG['popKoduLabel'] = "POP Kodu/ID:";
$_ADDONLANG['popKoduTooltip'] = "Sizin tarafınızdan verilen benzersiz bir kod (Örn: ANK-POP-01).";
$_ADDONLANG['popAdiLabel'] = "POP Adı/Etiketi:";
$_ADDONLANG['popTipiLabel'] = "POP Tipi:";
$_ADDONLANG['popTipiPlaceholder'] = "Örn: Ana POP, Kenar POP, Baz İstasyonu, Santral";
$_ADDONLANG['btkPopBilgisiLabel'] = "BTK Raporu için POP Bilgisi:";
$_ADDONLANG['btkPopBilgisiTooltip'] = "ABONE REHBER dosyasındaki 'iss_pop_bilgisi' alanına yazılacak standart metin.";
$_ADDONLANG['btkPopBilgisiPlaceholder'] = "Örn: ANKARA-KIZILAY-POP1";
$_ADDONLANG['popLocationInfoTitle'] = "Lokasyon Bilgileri";
$_ADDONLANG['adresIlLabel'] = "İl:";
$_ADDONLANG['adresIlceLabel'] = "İlçe:";
$_ADDONLANG['adresMahalleLabel'] = "Mahalle/Köy:";
$_ADDONLANG['selectIlOption'] = "İl Seçiniz...";
$_ADDONLANG['selectIlceOption'] = "İlçe Seçiniz...";
$_ADDONLANG['selectMahalleOption'] = "Mahalle/Köy Seçiniz...";
$_ADDONLANG['popTamAdresDetayLabel'] = "Tam Adres Detayı (Cadde, Sokak, No):";
$_ADDONLANG['popUavtAdresKoduLabel'] = "UAVT / Adres Kodu:";
$_ADDONLANG['popEnlemLabel'] = "Enlem (Latitude):";
$_ADDONLANG['popBoylamLabel'] = "Boylam (Longitude):";
$_ADDONLANG['popTechnicalInfoTitle'] = "Teknik Detaylar";
$_ADDONLANG['popYayinYapilanSsidLabel'] = "Yayın Yapılan SSID (Kablosuz ise):";
$_ADDONLANG['popYonetimIpLabel'] = "Ana Yönetim IP Adresi:";
$_ADDONLANG['popIpBloklariLabel'] = "Bu POP'a Ait IP Blokları:";
$_ADDONLANG['popIpBloklariPlaceholder'] = "Her satıra bir blok (örn: 192.168.1.0/24)";
$_ADDONLANG['popCihazTuruLabel'] = "Cihaz Türü:";
$_ADDONLANG['popCihazMarkasiLabel'] = "Cihaz Markası:";
$_ADDONLANG['popCihazModeliLabel'] = "Cihaz Modeli:";
$_ADDONLANG['popOtherInfoTitle'] = "Diğer Bilgiler";
$_ADDONLANG['popNotlarLabel'] = "Notlar/Açıklamalar:";
$_ADDONLANG['popAdiRequired'] = "POP Adı alanı zorunludur.";
$_ADDONLANG['popDefinitionUpdateSuccess'] = "POP tanımı başarıyla güncellendi.";
$_ADDONLANG['popDefinitionAddSuccess'] = "Yeni POP tanımı başarıyla eklendi.";
$_ADDONLANG['popDefinitionSaveError'] = "POP tanımı kaydedilirken bir hata oluştu.";
$_ADDONLANG['popDefinitionDeleteSuccess'] = "POP tanımı başarıyla silindi.";
$_ADDONLANG['popDefinitionDeleteError'] = "POP tanımı silinirken bir hata oluştu.";
$_ADDONLANG['popDefinitionNotFound'] = "POP tanımı bulunamadı.";
$_ADDONLANG['invalidPopId'] = "Geçersiz POP ID.";
$_ADDONLANG['confirmDeletePopText'] = "'%s' adlı POP noktasını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!";


// Manuel Rapor Oluşturma (generate_reports.tpl)
$_ADDONLANG['generateReportsPageTitle'] = "BTK - Manuel Rapor Oluşturma ve Gönderme";
$_ADDONLANG['generateReportsIntro'] = "Bu bölümden ABONE REHBER, ABONE HAREKET ve PERSONEL LİSTESİ raporlarını manuel olarak oluşturabilir, indirebilir ve FTP sunucularına gönderebilirsiniz.";
$_ADDONLANG['generateRehberReportTitle'] = "ABONE REHBER Raporu Oluştur";
$_ADDONLANG['generateRehberReportHelpText'] = "Seçili Yetki Türü için tüm abonelerin güncel bilgilerini içeren REHBER raporunu oluşturur.";
$_ADDONLANG['generateHareketReportTitle'] = "ABONE HAREKET Raporu Oluştur";
$_ADDONLANG['generateHareketReportHelpText'] = "Seçili Yetki Türü için son gönderimden bu yana oluşan veya gönderilmemiş tüm abone hareketlerini içeren HAREKET raporunu oluşturur.";
$_ADDONLANG['generatePersonelReportTitle'] = "PERSONEL Listesi Raporu Oluştur";
$_ADDONLANG['generatePersonelReportHelpText'] = "BTK'ya gönderilecek formatta güncel personel listesi Excel dosyasını oluşturur.";
$_ADDONLANG['selectBtkAuthTypeForReportLabel'] = "Raporlanacak Yetki Türü";
$_ADDONLANG['generateOnlyButton'] = "Sadece Oluştur ve İndir";
$_ADDONLANG['generateAndSendMainFtpButton'] = "Oluştur ve Ana FTP'ye Gönder";
$_ADDONLANG['generateAndSendBackupFtpButton'] = "Oluştur ve Yedek FTP'ye Gönder";
$_ADDONLANG['generatingReportPleaseWait'] = "Rapor oluşturuluyor, lütfen bekleyin...";
$_ADDONLANG['reportGenerationFailed'] = "Rapor oluşturma başarısız oldu.";
$_ADDONLANG['downloadFileButton'] = "Dosyayı İndir";
$_ADDONLANG['resendFromBackupFtpTitle'] = "Yedek FTP'den Rapor Çek ve Yeniden Gönder";
$_ADDONLANG['resendFromBackupFtpHelpText'] = "Daha önce Yedek FTP'ye yüklenmiş bir raporu bularak Ana BTK FTP sunucusuna (CNT değeri artırılarak) yeniden gönderebilirsiniz.";
$_ADDONLANG['reportTypeLabel'] = "Rapor Türü:";
$_ADDONLANG['fileNameFilterLabel'] = "Dosya Adı Filtresi:";
$_ADDONLANG['fileNameFilterPlaceholder'] = "Örn: REHBER_202405";
$_ADDONLANG['dateRangeLabel'] = "Tarih Aralığı (Yedek FTP):";
$_ADDONLANG['dateRangePlaceholder'] = "Raporun Yedek FTP'ye yüklenme tarihi";
$_ADDONLANG['searchBackupFtpButton'] = "Yedek FTP'de Ara";

// Günlük Kayıtları (view_logs.tpl)
$_ADDONLANG['viewLogsPageTitle'] = "BTK - Modül Günlük Kayıtları";
$_ADDONLANG['viewLogsIntro'] = "Modülün çalışması sırasında oluşan önemli işlemleri, FTP gönderimlerini ve olası hataları buradan takip edebilirsiniz.";
$_ADDONLANG['logTypeFilterLabel'] = "Log Türü";
$_ADDONLANG['allLogTypesOption'] = "Tüm Log Türleri";
$_ADDONLANG['logTypeGeneral'] = "Genel İşlem Logları";
$_ADDONLANG['logTypeFtp'] = "FTP Gönderim Logları";
$_ADDONLANG['logTypeNvi'] = "NVİ Doğrulama Logları";
$_ADDONLANG['logTypeCron'] = "Cron Job Logları";
$_ADDONLANG['logLevelFilterLabel'] = "Log Seviyesi";
$_ADDONLANG['allLogLevelsOption'] = "Tüm Seviyeler";
$_ADDONLANG['dateRangeFilterLabel'] = "Tarih Aralığı";
$_ADDONLANG['searchTermFilterLabel'] = "Arama Terimi";
$_ADDONLANG['searchTermPlaceholder'] = "Mesaj veya işlem içinde ara...";
$_ADDONLANG['filterButton'] = "Filtrele";
$_ADDONLANG['resetFilterButton'] = "Filtreyi Temizle";
$_ADDONLANG['ftpLogsTitle'] = "FTP Gönderim Logları";
$_ADDONLANG['generalLogsTitle'] = "Genel İşlem Logları";
$_ADDONLANG['logDateHeader'] = "Tarih";
$_ADDONLANG['logReportTypeHeader'] = "Rapor Türü";
$_ADDONLANG['logFileNameHeader'] = "Dosya Adı";
$_ADDONLANG['logFtpServerTypeHeader'] = "FTP Sunucu";
$_ADDONLANG['logCntHeader'] = "CNT";
$_ADDONLANG['logStatusHeader'] = "Durum";
$_ADDONLANG['logMessageHeader'] = "Mesaj / Detay";
$_ADDONLANG['logLevelHeader'] = "Seviye";
$_ADDONLANG['logActionHeader'] = "İşlem/Fonksiyon";
$_ADDONLANG['noFtpLogsFound'] = "FTP gönderim log kaydı bulunamadı.";
$_ADDONLANG['noGeneralLogsFound'] = "Genel işlem log kaydı bulunamadı.";
$_ADDONLANG['deleteAllLogsButton'] = "Tüm Logları Sil";
$_ADDONLANG['confirmDeleteLogsModalTitle'] = "Tüm Logları Silmeyi Onayla";
$_ADDONLANG['confirmDeleteLogsModalText'] = "Tüm modül günlük kayıtlarını (Genel ve FTP logları) kalıcı olarak silmek istediğinizden emin misiniz?";
$_ADDONLANG['warningIrreversibleAction'] = "Bu işlem geri alınamaz!";
// $_ADDONLANG['confirmDeleteButton'] = "Evet, Tümünü Sil"; // 'confirmButton' genel anahtarı kullanılabilir

// Müşteri Paneli (clientarea/*.tpl)
$_ADDONLANG['btkInformationTitleClientArea'] = "BTK Bilgileriniz";
$_ADDONLANG['customerYerlesimAdresiTitleClientArea'] = "BTK Yerleşim Adresiniz";
$_ADDONLANG['kurumYetkilisiBilgileriTitleClientArea'] = "BTK Kurum Yetkilisi Bilgileri";
$_ADDONLANG['btkInfoUpdateContactAdmin'] = "Bu bilgilerde bir yanlışlık veya değişiklik olması durumunda lütfen bizimle iletişime geçiniz.";
$_ADDONLANG['btkInfoNotAvailableClientArea'] = "Size ait BTK bilgileri henüz sistemimizde tanımlanmamıştır veya yüklenirken bir sorun oluşmuştur.";
$_ADDONLANG['btkServiceInformationTitleClientArea'] = "Hizmetinize Ait BTK Bilgileri";
$_ADDONLANG['serviceHatNoLabelClientArea'] = "BTK Hat/Hizmet No:";
$_ADDONLANG['serviceHizmetTipiLabelClientArea'] = "BTK Hizmet Tipi:";
$_ADDONLANG['serviceAboneBaslangicLabelClientArea'] = "BTK Abonelik Başlangıcı:";
$_ADDONLANG['serviceAboneTarifeLabelClientArea'] = "BTK Tarife Bilgisi:";
$_ADDONLANG['serviceStatikIpLabelClientArea'] = "Statik IP (BTK):";
$_ADDONLANG['issHizProfiliLabelClientArea'] = "Hız Profili (ISS):";
$_ADDONLANG['issKullaniciAdiLabelClientArea'] = "Kullanıcı Adı (ISS):";
$_ADDONLANG['issPopBilgisiLabelClientArea'] = "POP Noktası (ISS):";
$_ADDONLANG['aihHizProfiliLabelClientArea'] = "Hız Profili (AİH):";
$_ADDONLANG['aihDevreAdlandirmasiLabelClientArea'] = "Devre Adlandırması (AİH):";
$_ADDONLANG['serviceTesisAdresiTitleClientArea'] = "BTK Hizmet Tesis Adresi";
$_ADDONLANG['tesisAdresiYerlesimleAyniClientArea'] = "Bu hizmetin tesis adresi, müşteri yerleşim adresi ile aynıdır.";
$_ADDONLANG['btkServiceInfoNotAvailableClientArea'] = "Bu hizmete ait BTK bilgileri henüz sistemimizde tanımlanmamıştır veya yüklenirken bir sorun oluşmuştur.";
$_ADDONLANG['adresKoduLabel'] = "Adres Kodu (UAVT)";
$_ADDONLANG['adresDisKapiNoLabel'] = "Dış Kapı No"; // clientarea için eksikti
$_ADDONLANG['adresIcKapiNoLabel'] = "İç Kapı No";   // clientarea için eksikti
$_ADDONLANG['genderMale'] = "Erkek";
$_ADDONLANG['genderFemale'] = "Kadın";
$_ADDONLANG['kimlikAidiyetiBireysel'] = "Bireysel (Kendime Ait)";
$_ADDONLANG['kimlikAidiyetiYetkili'] = "Yetkili (Başkası Adına)";
$_ADDONLANG['musteriTipiGSahis'] = "Bireysel Şahıs";
$_ADDONLANG['musteriTipiGSirket'] = "Bireysel Şirket";
$_ADDONLANG['musteriTipiTSirket'] = "Tüzel Şirket";
$_ADDONLANG['musteriTipiTKamu'] = "Tüzel Kamu";


// Diğer Genel Hata/Başarı Mesajları
$_ADDONLANG['dataSaveSuccess'] = "Veriler başarıyla kaydedildi.";
$_ADDONLANG['dataSaveError'] = "Veriler kaydedilirken bir hata oluştu.";
$_ADDONLANG['invalidAction'] = "Geçersiz işlem talebi.";
$_ADDONLANG['requiredFieldsMissing'] = "Gerekli alanlar boş bırakılamaz.";
$_ADDONLANG['unknownError'] = "Bilinmeyen bir hata oluştu. Lütfen logları kontrol edin.";

?>