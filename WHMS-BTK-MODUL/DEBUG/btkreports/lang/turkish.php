<?php
/**
 * WHMCS BTK Raporlama Modülü - Türkçe Dil Dosyası (Tüm TPL Dosyalarını Kapsayan Kapsamlı Sürüm)
 * modules/addons/btkreports/lang/turkish.php
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// Genel Modül İsimleri, Başlıkları ve Butonlar
$_ADDONLANG['btkreports_addon_name'] = "BTK Raporlama Modülü";
$_ADDONLANG['dashboardtitle'] = "BTK Raporlama Ana Sayfa";
$_ADDONLANG['configtitle'] = "BTK Modül Genel Ayarları";
$_ADDONLANG['personeltitle'] = "Personel Yönetimi";
$_ADDONLANG['isspoptitle'] = "ISS POP Noktası Yönetimi";
$_ADDONLANG['productgroupmappingstitle'] = "Ürün Grubu - BTK Yetki & Hizmet Tipi Eşleştirme";
$_ADDONLANG['generatereportstitle'] = "Manuel Rapor Oluşturma ve Gönderme";
$_ADDONLANG['viewlogstitle'] = "Modül Günlük Kayıtları";
$_ADDONLANG['confirmPasswordTitle'] = "İşlem Onayı: Lütfen Şifrenizi Girin";

// Genel Butonlar ve İfadeler
$_ADDONLANG['saveChanges'] = "Değişiklikleri Kaydet";
$_ADDONLANG['cancel'] = "İptal";
$_ADDONLANG['aktif'] = "AKTİF";
$_ADDONLANG['pasif'] = "PASİF";
$_ADDONLANG['actions'] = "İşlemler";
$_ADDONLANG['optional'] = "Opsiyonel";
$_ADDONLANG['yes'] = "Evet";
$_ADDONLANG['no'] = "Hayır";
$_ADDONLANG['all'] = "Tümü";
$_ADDONLANG['selectOne'] = "Seçiniz...";
$_ADDONLANG['edit'] = "Düzenle";
$_ADDONLANG['delete'] = "Sil";
$_ADDONLANG['close'] = "Kapat";
$_ADDONLANG['filter'] = "Filtrele";
$_ADDONLANG['clearFilter'] = "Filtreyi Temizle";
$_ADDONLANG['search'] = "Ara";
$_ADDONLANG['upload'] = "Yükle ve İçe Aktar";
$_ADDONLANG['download'] = "İndir";
$_ADDONLANG['confirm'] = "Onayla";
$_ADDONLANG['confirmAndProceed'] = "Onayla ve Devam Et";
$_ADDONLANG['cancelAndReturn'] = "İptal Et ve Geri Dön";
$_ADDONLANG['previous'] = "Önceki";
$_ADDONLANG['next'] = "Sonraki";
$_ADDONLANG['kayitBulundu'] = "kayıt bulundu";
$_ADDONLANG['notApplicableShort'] = "N/A";
$_ADDONLANG['notSubmittedYet'] = "Henüz Gönderilmedi";
$_ADDONLANG['developerName'] = "KablosuzOnline & Gemini AI";
$_ADDONLANG['onceIliSecin'] = "Önce İl Seçiniz";
$_ADDONLANG['onceIlceyiSecin'] = "Önce İlçe Seçiniz";
$_ADDONLANG['selectIlce'] = "İlçe Seçiniz...";
$_ADDONLANG['selectMahalle'] = "Mahalle/Köy Seçiniz...";
$_ADDONLANG['dogrulaniyor'] = "Doğrulanıyor...";
$_ADDONLANG['nviDogrulamaHata'] = "NVI Doğrulama sırasında bir sunucu veya ağ hatası oluştu. Lütfen daha sonra tekrar deneyin.";
$_ADDONLANG['nviGerekliAlanlar'] = "TCKN, Ad, Soyad ve Doğum Yılı (NVI) alanları doğrulama için zorunludur.";
$_ADDONLANG['invalidPersonelId'] = "Geçersiz Personel ID.";
$_ADDONLANG['invalidPopId'] = "Geçersiz POP ID.";
$_ADDONLANG['excelReadError'] = "Excel dosyası okunamadı veya formatı geçersiz. Lütfen örnek şablonu kontrol edin ve dosyanın .xlsx formatında olduğundan emin olun.";
$_ADDONLANG['excelEmptyData'] = "Excel dosyasında işlenecek veri bulunamadı.";
$_ADDONLANG['unknownAjaxRequest'] = "Bilinmeyen AJAX isteği.";
$_ADDONLANG['csrfTokenError'] = "Güvenlik tokeni hatası. Lütfen sayfayı yenileyip tekrar deneyin.";
$_ADDONLANG['csrfTokenErrorExport'] = "Geçersiz dışa aktarma güvenlik tokeni.";
$_ADDONLANG['ftpHostUserRequiredForTest'] = "FTP Bağlantı Testi için Host ve Kullanıcı Adı alanları dolu olmalıdır.";
$_ADDONLANG['ftpTestFailed'] = "Bağlantı testi başarısız.";
$_ADDONLANG['ftpTestAjaxError'] = "Sunucuya ulaşılamadı veya bir test hatası oluştu.";
$_ADDONLANG['cronLibMissing'] = "Zamanlama Kütüphanesi Eksik (CronExpression)";
$_ADDONLANG['invalidCronExpression'] = "Geçersiz Cron İfadesi";
$_ADDONLANG['errorFetchingNextRun'] = "Sonraki Çalışma Zamanı Hesaplanamadı";
$_ADDONLANG['notConfigured'] = "Ayarlanmamış";
$_ADDONLANG['excelLibNotLoaded'] = "Excel kütüphanesi (ExcelExporter.php) yüklenemedi.";
$_ADDONLANG['fileUploadError'] = "Dosya yüklenirken hata: ";
$_ADDONLANG['noDataToExportPersonel'] = "Dışa aktarılacak personel verisi bulunamadı.";
$_ADDONLANG['noDataToExportIssPop'] = "Dışa aktarılacak ISS POP verisi bulunamadı.";
$_ADDONLANG['notImplementedYet'] = "Bu özellik henüz tamamlanmadı.";
$_ADDONLANG['unknownExportType'] = "Bilinmeyen Excel dışa aktarma türü.";
$_ADDONLANG['dbReadError'] = "Veritabanı okuma hatası: ";
$_ADDONLANG['reportTypeRequired'] = "Rapor türü seçilmelidir.";
$_ADDONLANG['yetkiGrupRequiredForReport'] = "REHBER veya HAREKET raporu için Yetki Türü Grubu seçilmelidir.";
$_ADDONLANG['manualReportGeneratedSuccess'] = "Rapor(lar) başarıyla oluşturuldu ve gönderildi: ";
$_ADDONLANG['manualReportGeneratedError'] = "Rapor oluşturulurken hata: ";
$_ADDONLANG['skipped'] = "Atlandı";
$_ADDONLANG['adminUsername'] = "Yönetici Adınız";
$_ADDONLANG['unknownAdmin'] = "(Bilinmiyor)";
$_ADDONLANG['enterPasswordHere'] = "Şifrenizi buraya girin...";
$_ADDONLANG['ayarlardanEtkinlestirin'] = "Ayarlardan Etkin Değil";
$_ADDONLANG['goToFtpSettings'] = "FTP Ayarlarına Git";
$_ADDONLANG['reportGroupAndType'] = "Rapor Grubu / Türü";
$_ADDONLANG['noActiveAuthGroupForReports'] = "Raporlama için aktif edilmiş ve ürün grubuyla eşleştirilmiş bir BTK Yetki Türü Grubu bulunmuyor veya henüz hiç başarılı rapor gönderilmemiş.";
$_ADDONLANG['noActiveAuthGroupForSelection'] = "Seçilecek aktif yetki grubu yok.";
$_ADDONLANG['mahalleSecinceOto'] = "Mahalle seçildiğinde otomatik dolar.";
$_ADDONLANG['whmcsProductNamePlaceholder'] = "WHMCS Ürün Adı veya Özel Tarife";
$_ADDONLANG['aboneTarifeDesc'] = "Abonenin kullandığı ana tarife veya paket adı.";
$_ADDONLANG['kurumYetkiliBilgileriTitle'] = "Kurum Yetkili Bilgileri";
$_ADDONLANG['kurumYetkiliAdi'] = "Yetkili Adı";
$_ADDONLANG['kurumYetkiliSoyadi'] = "Yetkili Soyadı";
$_ADDONLANG['kurumYetkiliTckn'] = "Yetkili T.C. Kimlik No";
$_ADDONLANG['kurumYetkiliTelefon'] = "Yetkili Telefon No";
$_ADDONLANG['kurumAdres'] = "Kurum Adresi";
$_ADDONLANG['saveBtkClientDetailsAjax'] = "BTK Bilgilerini Ayrı Kaydet (AJAX)";
$_ADDONLANG['clientDetailsSaveNote'] = "Müşteri bilgilerindeki BTK alanları, ana \"Değişiklikleri Kaydet\" butonuyla birlikte kaydedilecektir.";
$_ADDONLANG['dogumYiliNviClientDesc'] = "TCKN/YKN doğrulaması için gereklidir. 4 haneli yıl olarak giriniz.";
$_ADDONLANG['aboneUyrukDesc'] = "ICAO 9303 standardına uygun 3 harfli ülke kodu (Örn: TUR, DEU, USA).";
$_ADDONLANG['aboneKimlikTipi'] = "Kimlik Tipi";
$_ADDONLANG['aboneMeslekDesc'] = "BTK EK-5 Meslek Kodları listesinden seçiniz.";
$_ADDONLANG['uavtSorgula'] = "UAVT Adres Kodu Sorgula";
$_ADDONLANG['musteriTipiGSahis'] = "Bireysel-Şahıs (Gerçek Kişi)";
$_ADDONLANG['musteriTipiGSirket'] = "Bireysel-Şahıs Şirketi (Gerçek Kişi Tacir)";
$_ADDONLANG['musteriTipiTSirket'] = "Tüzel Kişi-Şirket";
$_ADDONLANG['musteriTipiTKamu'] = "Tüzel Kişi-Kamu Kurumu";
$_ADDONLANG['btkClientFormDesc'] = "Bu alandaki bilgiler, müşterinin BTK'ya raporlanacak ana abonelik verileridir. Lütfen eksiksiz ve doğru giriniz.";
$_ADDONLANG['tesisKoordinatTitle'] = "Tesis Koordinat Bilgileri";
$_ADDONLANG['teknikEkipIcin'] = "Google Maps - Saha Ekibi İçin";
$_ADDONLANG['popFilterByMahalle'] = "Mahalleye Göre (Varsayılan)";
$_ADDONLANG['popFilterByIlce'] = "İlçeye Göre";
$_ADDONLANG['popFilterByIl'] = "İle Göre";
$_ADDONLANG['issPopSecimNotu'] = "Hizmetin bağlı olduğu POP noktasının yayın SSID'sini seçin veya arayın. Filtre kriterini ve tesis adresini doğru girdiğinizden emin olun.";
$_ADDONLANG['statikIp'] = "Statik IP Adresi (Varsa)";
$_ADDONLANG['hizProfili'] = "Hız Profili (Varsa)";
$_ADDONLANG['otherServiceBtkInfo'] = "Diğer Hizmete Özel BTK Bilgileri";
$_ADDONLANG['noEk3ForThisGroup'] = "Bu ana yetki grubuna uygun EK-3 hizmet tipi bulunamadı.";
$_ADDONLANG['logMessageFilter'] = "Mesaj İçeriği";
$_ADDONLANG['dateFrom'] = "Başlangıç Tarihi";
$_ADDONLANG['dateTo'] = "Bitiş Tarihi";
$_ADDONLANG['logRecordsPerPageDesc'] = "Log Görüntüleme sayfasında sayfa başına gösterilecek kayıt sayısı.";
$_ADDONLANG['showBtkInfoIfEmptyClientArea'] = "Müşteri Panelinde BTK Bilgisi Boşsa Bile Göster";
$_ADDONLANG['showBtkInfoIfEmptyClientAreaDesc'] = "Eğer müşterinin veya hizmetin BTK verileri henüz girilmemişse, müşteri panelinde ilgili BTK bilgi blokları yine de gösterilsin mi? İşaretlenmezse, sadece veri varsa gösterilir.";
$_ADDONLANG['adminRecordsPerPageDesc'] = "Personel, POP vb. listeleme sayfalarında sayfa başına gösterilecek kayıt sayısı.";
$_ADDONLANG['surumNotlariLinkDesc'] = "Modül ana sayfasında gösterilecek sürüm notları TXT/MD dosyasının URL\'si.";
$_ADDONLANG['noAuthTypesForSelection'] = "Listelenecek yetki türü bulunamadı. Lütfen veritabanı tablolarını ve başlangıç verilerini kontrol edin.";
$_ADDONLANG['editIssPopTitle'] = "POP Noktasını Düzenle";
$_ADDONLANG['reportGroupAndType'] = "Rapor Grubu / Türü";
$_ADDONLANG['ayarlardanEtkinlestirin'] = "Ayarlardan Etkin Değil";
$_ADDONLANG['goToFtpSettings'] = "FTP Ayarlarına Git";
$_ADDONLANG['mappingssavedsucceed'] = "Eşleştirmeler başarıyla kaydedildi.";
$_ADDONLANG['mappingssavefailed'] = "Eşleştirmeler kaydedilirken bir hata oluştu.";
$_ADDONLANG['anaBtkYetkiTuru'] = "Ana BTK Yetki Türü (Rapor Dosya Tipi)";
$_ADDONLANG['anaBtkYetkiTuruTooltip'] = "Bu seçim, rapor dosyasının adındaki TİP bölümünü (örn: ISS, STH) belirler. Sadece Genel Ayarlar'da aktif edilenler listelenir.";
$_ADDONLANG['ek3HizmetTipi'] = "BTK EK-3 Hizmet Tipi (Rapor İçi Alan)";
$_ADDONLANG['ek3HizmetTipiTooltip'] = "Bu seçim, rapor dosyasının içindeki HIZMET_TIPI alanını belirler. Seçilen Ana Yetki Türüne göre filtrelenecektir.";
$_ADDONLANG['noActiveBtkAuthTypesV2'] = "Genel Ayarlar'da aktif edilmiş ve raporlama grubu (`grup` alanı) tanımlanmış Ana BTK Yetki Türü bulunamadı. Lütfen önce Genel Ayarlar sayfasından ana yetki türlerini seçip, bu yetki türlerinin referans tablosunda (`mod_btk_yetki_turleri_referans`) \"grup\" alanlarının (ISS, STH vb.) dolu olduğundan emin olun.";
$_ADDONLANG['downloadGeneratedFile'] = "Oluşturulan Dosyayı İndir";
$_ADDONLANG['reportGenerationResultTitle'] = "Rapor Oluşturma Sonucu";
$_ADDONLANG['generateAndDownloadReport'] = "Oluştur ve Tarayıcıya İndir (FTP Yok)";
$_ADDONLANG['menuItemsNotLoaded'] = "Menü Yüklenemedi";
$_ADDONLANG['btkAboneBilgileriTitle'] = "BTK Abonelik Bilgileri";
$_ADDONLANG['kimlikBilgileriTitle'] = "Kimlik Bilgileri";
$_ADDONLANG['yerlesimAdresiTitle'] = "Yerleşim (İkamet) Adresi";
$_ADDONLANG['btkHizmetDetaylariTitle'] = "BTK Hizmet Detayları";
$_ADDONLANG['btkServiceFormDesc'] = "Bu hizmete ait BTK raporlaması için gerekli olan tesis ve diğer özel bilgileri buradan giriniz. Değişiklikler ana \"Değişiklikleri Kaydet\" butonu ile kaydedilecektir.";
$_ADDONLANG['tesisAdresiAyniMi'] = "Yerleşim Adresi ile Tesis Adresi Aynı mı?";
$_ADDONLANG['tesisAdresiAyniMiDesc'] = "Eğer bu hizmetin sunulduğu tesis adresi, müşterinin ana yerleşim adresi ile aynı ise işaretleyin. Farklı ise, aşağıdaki alanları doldurun. Yeni hizmetlerde varsayılan olarak işaretlidir.";
$_ADDONLANG['tesisAdresiTitle'] = "Tesis Adresi";
$_ADDONLANG['farkliIseDoldurun'] = "Farklı İse Doldurun";
$_ADDONLANG['tesisKoordinatTitle'] = "Tesis Koordinat Bilgileri";
$_ADDONLANG['teknikEkipIcin'] = "Google Maps - Saha Ekibi İçin";
$_ADDONLANG['tesisKoordinatEnlem'] = "Tesis Koordinat Enlem";
$_ADDONLANG['tesisKoordinatBoylam'] = "Tesis Koordinat Boylam";
$_ADDONLANG['issPopBilgileriTitle'] = "ISS POP Bilgileri";
$_ADDONLANG['popFilterBy'] = "POP Filtreleme Kriteri:";
$_ADDONLANG['issPopNoktasiSecimi'] = "ISS POP Noktası (Yayın SSID)";
$_ADDONLANG['popSearchPlaceholder'] = "SSID veya POP Adı ile ara...";
$_ADDONLANG['otherServiceBtkInfo'] = "Diğer Hizmete Özel BTK Bilgileri";
$_ADDONLANG['aboneAnneKizlikSoyadi'] = "Anne Kızlık Soyadı";
$_ADDONLANG['logRecordsPerPage'] = "Log Kayıt Sayısı (Sayfa Başına)"; // config.tpl için
$_ADDONLANG['productGroupMappingInfoV2'] = 'Sadece "Genel Ayarlar"da aktif ettiğiniz Ana BTK Yetki Türleri burada listelenir. Bir Ana Yetki Türü seçtikten sonra, o yetki türüyle ilişkili EK-3 Hizmet Tipleri ikinci dropdown\'da görünecektir (JavaScript ile filtrelenir). Eşleştirme yapmazsanız, o gruptaki ürünler BTK raporlarına dahil edilmeyebilir.';
$_ADDONLANG['onceAnaYetkiSecin'] = 'Önce Ana Yetki Seçin'; // product_group_mappings.tpl JS
$_ADDONLANG['noEk3ForThisGroup'] = 'Bu gruba uygun EK-3 hizmet tipi yok.'; // product_group_mappings.tpl JS
$_ADDONLANG['logLevel'] = 'Seviye'; // view_logs.tpl
$_ADDONLANG['logActionFilter'] = 'İşlem İçeriği'; // view_logs.tpl
$_ADDONLANG['logMessageFilter'] = 'Mesaj İçeriği'; // view_logs.tpl
$_ADDONLANG['dateFrom'] = 'Başlangıç Tarihi'; // view_logs.tpl
$_ADDONLANG['dateTo'] = 'Bitiş Tarihi'; // view_logs.tpl
$_ADDONLANG['logDateTime'] = 'Tarih/Saat'; // view_logs.tpl
$_ADDONLANG['logAction'] = 'İşlem'; // view_logs.tpl
$_ADDONLANG['logMessage'] = 'Mesaj'; // view_logs.tpl
$_ADDONLANG['logUserId'] = 'Kullanıcı ID'; // view_logs.tpl
$_ADDONLANG['logIpAddress'] = 'IP Adresi'; // view_logs.tpl
$_ADDONLANG['noModuleLogsFound'] = 'Modül işlem/hata log kaydı bulunamadı.'; // view_logs.tpl
$_ADDONLANG['logFilename'] = 'Dosya Adı'; // view_logs.tpl
$_ADDONLANG['ftpServerType'] = 'FTP Sunucusu'; // view_logs.tpl
$_ADDONLANG['logStatus'] = 'Durum'; // view_logs.tpl
$_ADDONLANG['logErrorMessage'] = 'Hata Mesajı'; // view_logs.tpl
$_ADDONLANG['noFtpLogsFound'] = 'FTP gönderim log kaydı bulunamadı.'; // view_logs.tpl

// Yetki Türleri için Tooltip Açıklamaları (Örnekler - Bunlar çoğaltılmalı)
$_ADDONLANG['yetki_iss_b_genel_desc'] = "İnternet Servis Sağlayıcılığı (Bildirim Kapsamında) - İnternet erişim hizmetleri sunma yetkisi.";
$_ADDONLANG['yetki_aih_b_genel_desc'] = "Altyapı İşletmeciliği Hizmeti (Bildirim Kapsamında) - Telekomünikasyon altyapısı kurma ve işletme yetkisi.";
// ... (config.tpl'deki tüm 20 yetki türü için _desc anahtarları buraya eklenecek) ...
$_ADDONLANG['yetki_sth_k_genel_desc'] = "Sabit Telefon Hizmeti (Kullanım Hakkı Kapsamında) - Belirli kaynaklarla (numara bloğu vb.) sabit telefon hizmeti sunma yetkisi.";

// Müşteri Paneli (Client Area) Metinleri
$_ADDONLANG['btkAboneBilgileriTitleClientArea'] = "BTK Abonelik Bilgileriniz";
$_ADDONLANG['btkHizmetDetaylariTitleClientArea'] = "Hizmetinize Ait BTK Detayları";
$_ADDONLANG['btkBilgileriAciklamaClient'] = "Aşağıdaki bilgiler yasal yükümlülükler gereği Bilgi Teknolojileri ve İletişim Kurumu'na (BTK) raporlanmaktadır. Bu bilgilerde bir değişiklik olması veya bir yanlışlık olduğunu düşünüyorsanız, güncelleme talepleriniz için lütfen destek bileti oluşturarak veya müşteri hizmetlerimizle iletişime geçerek bizi bilgilendiriniz.";
$_ADDONLANG['aboneTcknClient'] = "T.C. Kimlik No / YKN:";
$_ADDONLANG['aboneAdiSoyadiClient'] = "Adınız Soyadınız:";
$_ADDONLANG['aboneUnvanClient'] = "Firma Ünvanı:";
$_ADDONLANG['yerlesimAdresiClient'] = "Yerleşim (İkamet) Adresiniz:";
$_ADDONLANG['disKapiNoClient'] = "D.No";
$_ADDONLANG['icKapiNoClient'] = "İ.No";
$_ADDONLANG['tesisAdresiClient'] = "Hizmet Tesis Adresi:";
$_ADDONLANG['yerlesimAdresiIleAyniClient'] = "Yerleşim adresiniz ile aynıdır.";
$_ADDONLANG['statikIpClient'] = "Statik IP Adresiniz:";
$_ADDONLANG['issPopBilgisiClient'] = "Bağlı Olduğunuz POP:";
$_ADDONLANG['musteriTipiClient'] = "Müşteri Tipiniz:";
$_ADDONLANG['aboneDogumTarihiClient'] = "Doğum Tarihiniz:";
$_ADDONLANG['aboneUyrukClient'] = "Uyruğunuz:";
$_ADDONLANG['adresNotAvailableClient'] = "Adres bilgisi bulunmamaktadır.";
$_ADDONLANG['tesisAddressNotAvailableClient'] = "Bu hizmet için özel bir tesis adresi tanımlanmamıştır veya yerleşim adresiniz kullanılmaktadır.";
$_ADDONLANG['otherServiceBtkInfoClient'] = "Diğer BTK Bilgileri";
$_ADDONLANG['hizmetTipiClient'] = "Hizmet Türü (BTK):";
$_ADDONLANG['aboneTarifeClient'] = "Tarifeniz:";
$_ADDONLANG['gsmIcciClient'] = "SIM Kart No (ICCI):";

// Genel hata/başarı mesajları
$_ADDONLANG['errorOccurred'] = "Bir hata oluştu!";
$_ADDONLANG['requiredFieldsMissing'] = "Zorunlu alanlar boş bırakılamaz.";
$_ADDONLANG['invalidData'] = "Geçersiz veri formatı.";
$_ADDONLANG['saveSuccess'] = "Değişiklikler başarıyla kaydedildi.";
$_ADDONLANG['saveError'] = "Değişiklikler kaydedilirken bir hata oluştu.";
$_ADDONLANG['deleteSuccess'] = "Kayıt başarıyla silindi.";
$_ADDONLANG['deleteError'] = "Kayıt silinirken bir hata oluştu.";
$_ADDONLANG['noDataFound'] = "Veri bulunamadı.";

?>