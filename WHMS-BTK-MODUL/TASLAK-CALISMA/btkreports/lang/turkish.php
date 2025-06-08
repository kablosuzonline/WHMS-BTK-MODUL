<?php
/**
 * WHMCS BTK Raporlama Modülü - Türkçe Dil Dosyası
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
$_ADDONLANG['productgroupmappingstitle'] = "Ürün Grubu - BTK Yetki Eşleştirme";
$_ADDONLANG['generatereportstitle'] = "Manuel Rapor Oluşturma ve Gönderme";
$_ADDONLANG['viewlogstitle'] = "Modül Günlük Kayıtları";
$_ADDONLANG['confirmPasswordTitle'] = "İşlem Onayı";

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
$_ADDONLANG['upload'] = "Yükle";
$_ADDONLANG['download'] = "İndir";
$_ADDONLANG['confirm'] = "Onayla";
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
$_ADDONLANG['nviDogrulamaHata'] = "NVI Doğrulama sırasında bir sunucu veya ağ hatası oluştu.";
$_ADDONLANG['nviGerekliAlanlar'] = "TCKN, Ad, Soyad ve Doğum Yılı (NVI) alanları zorunludur.";
$_ADDONLANG['invalidPersonelId'] = "Geçersiz Personel ID.";
$_ADDONLANG['invalidPopId'] = "Geçersiz POP ID.";
$_ADDONLANG['excelReadError'] = "Excel dosyası okunamadı veya formatı geçersiz. Lütfen örnek şablonu kontrol edin.";
$_ADDONLANG['excelEmptyData'] = "Excel dosyasında işlenecek veri bulunamadı.";
$_ADDONLANG['unknownAjaxRequest'] = "Bilinmeyen AJAX isteği.";


// Ana Sayfa (index.tpl)
// ... (Bir önceki "turkish.php eksiksiz gelsin" mesajındaki Ana Sayfa bölümü buraya gelecek) ...
$_ADDONLANG['moduleInfoTitle'] = "Modül Bilgileri";
$_ADDONLANG['moduleDescriptionText'] = "Bu modül, BTK yasal raporlama yükümlülüklerinizi WHMCS üzerinden yönetmenizi sağlar.";
$_ADDONLANG['moduleversion'] = "Modül Sürümü";
$_ADDONLANG['developedBy'] = "Geliştiren";
$_ADDONLANG['surumNotlariLinkText'] = "Sürüm Notları (TXT)";
$_ADDONLANG['surumNotlariDetayLink'] = "Tüm Sürüm Notlarını Görüntüle";
$_ADDONLANG['ftpServerStatusTitle'] = "FTP Sunucu Durumları";
$_ADDONLANG['mainFtpServer'] = "Ana BTK FTP Sunucusu";
$_ADDONLANG['backupFtpServer'] = "Yedek FTP Sunucusu";
$_ADDONLANG['ftpStatusNote'] = "FTP bağlantı durumları periyodik olarak kontrol edilir veya ayarlar sayfasından test edilebilir.";
$_ADDONLANG['moduleHelpTitle'] = "Modül Kullanım Bilgileri";
$_ADDONLANG['moduleHelpText1'] = "Modülün doğru çalışması için lütfen öncelikle \"Genel Ayarlar\" bölümünden gerekli tüm yapılandırmaları yapın.";
$_ADDONLANG['moduleHelpText2'] = "Daha sonra \"Ürün Grubu - BTK Yetki Eşleştirme\" bölümünden WHMCS ürün gruplarınızı ilgili BTK kategorileri ile eşleştirin.";
$_ADDONLANG['moduleHelpText3'] = "Müşteri ve hizmet bazlı BTK verilerini, ilgili müşteri özet sayfasındaki \"BTK Bilgileri\" sekmesinden ve hizmet detay sayfasındaki \"BTK Hizmet Bilgileri\" bölümünden yönetebilirsiniz.";
$_ADDONLANG['lastReportSubmissions'] = "Son Rapor Gönderimleri";
$_ADDONLANG['reportType'] = "Rapor Türü";
$_ADDONLANG['lastSubmissionDate'] = "Son Gönderim Tarihi";
$_ADDONLANG['lastSubmittedFile'] = "Son Gönderilen Dosya";
$_ADDONLANG['nextCronRun'] = "Sonraki Otomatik Çalışma";
$_ADDONLANG['generateReport'] = "Rapor Oluştur/Gönder";
$_ADDONLANG['goToGenerateReportsPage'] = "Manuel Rapor Sayfasına Git";
$_ADDONLANG['reportAboneRehber'] = "ABONE REHBER";
$_ADDONLANG['reportAboneHareket'] = "ABONE HAREKET";
$_ADDONLANG['reportPersonelListesi'] = "PERSONEL LİSTESİ";
$_ADDONLANG['backupFtpDisabled'] = "Yedek FTP etkin değil.";
$_ADDONLANG['goToConfig'] = "Genel Ayarlara Git";
$_ADDONLANG['goToLogs'] = "Günlük Kayıtlarına Git";
$_ADDONLANG['notConfigured'] = "Ayarlanmamış";
$_ADDONLANG['errorFetchingNextRun'] = "Hesaplanamadı / Hata";

// Genel Ayarlar (config.tpl)
// ... (Bir önceki "turkish.php eksiksiz gelsin" mesajındaki Genel Ayarlar bölümü buraya gelecek) ...
$_ADDONLANG['generalSettings'] = "Operatör ve Genel Ayarlar";
$_ADDONLANG['operatorCode'] = "Operatör Kodu";
$_ADDONLANG['operatorCodeDesc'] = "BTK tarafından size bildirilen 3 haneli operatör kodu (Örn: 701). Bu alan zorunludur.";
$_ADDONLANG['operatorName'] = "Operatör Adı";
$_ADDONLANG['operatorNameDesc'] = "BTK tarafından size bildirilen işletmeci adı (Örn: IZMARBILISIM). Dosya adlarında kullanılır. Bu alan zorunludur.";
$_ADDONLANG['operatorTitle'] = "Operatör Resmi Ünvanı";
$_ADDONLANG['operatorTitleDesc'] = "Şirketinizin Ticaret Sicilinde kayıtlı tam resmi ünvanı. Sadece Personel Listesi raporunda kullanılır.";
$_ADDONLANG['mainFtpSettings'] = "Ana BTK FTP Sunucu Ayarları";
$_ADDONLANG['ftpHost'] = "Sunucu Adresi (Host)";
$_ADDONLANG['ftpUser'] = "Kullanıcı Adı";
$_ADDONLANG['ftpPassPlaceholder'] = "Şifre (Değiştirmek istemiyorsanız boş bırakın)";
$_ADDONLANG['ftpPort'] = "Port (Varsayılan: 21)";
$_ADDONLANG['ftpSSL'] = "SSL/TLS Kullan";
$_ADDONLANG['ftpSSLDesc'] = "Güvenli FTP bağlantısı (FTPS/FTPES) için işaretleyin.";
$_ADDONLANG['ftpRehberPath'] = "REHBER Dosya Yolu";
$_ADDONLANG['ftpHareketPath'] = "HAREKET Dosya Yolu";
$_ADDONLANG['ftpPersonelPath'] = "PERSONEL Dosya Yolu";
$_ADDONLANG['personelFilenameAddYearMonth'] = "Personel Dosya Adına Yıl-Ay Ekle";
$_ADDONLANG['personelFilenameAddYearMonthDesc'] = "Personel listesi Excel dosyasının adına '_YIL_AY' eklensin mi? (Örn: Personel_Listesi_2024_06.xlsx)";
$_ADDONLANG['backupFtpSettings'] = "Yedek FTP Sunucu Ayarları";
$_ADDONLANG['btkYetkilendirmeSecenekleri'] = "Bilgi Teknolojileri ve İletişim Kurum (BTK) Yetkilendirme Seçenekleri";
$_ADDONLANG['btkYetkilendirmeDesc'] = "Sahip olduğunuz ve raporlama yapacağınız BTK yetki türlerini seçin. Bu seçim, \"Ürün Grubu Eşleştirme\" sayfasındaki seçenekleri etkileyecektir.";
$_ADDONLANG['yetkiDefaultDesc'] = "Bu yetki türü hakkında detaylı bilgi için BTK mevzuatını inceleyiniz.";
$_ADDONLANG['cronSettings'] = "Otomatik Raporlama (Cron Job) Ayarları";
$_ADDONLANG['rehberCronSchedule'] = "ABONE REHBER Gönderim Zamanlaması";
$_ADDONLANG['hareketCronSchedule'] = "ABONE HAREKET Gönderim Zamanlaması";
$_ADDONLANG['personelCronSchedule'] = "PERSONEL LİSTESİ Gönderim Zamanlaması";
$_ADDONLANG['cronScheduleDesc'] = "Standart cron ifadesi formatında giriniz. (Örn: '0 2 * * *' her gün saat 02:00)";
$_ADDONLANG['otherSettings'] = "Diğer Ayarlar";
$_ADDONLANG['sendEmptyReports'] = "Boş Dosya Gönderilsin mi?";
$_ADDONLANG['sendEmptyReportsDesc'] = "Eğer ilgili periyotta raporlanacak veri olmasa bile, BTK'ya boş içerikli (sadece başlık satırı olan veya tamamen boş) bir dosya gönderilsin mi?";
$_ADDONLANG['debugMode'] = "Hata Ayıklama Modu";
$_ADDONLANG['debugModeDesc'] = "Etkinleştirildiğinde, modül daha detaylı loglar tutar. Sadece sorun giderme amaçlı kullanın.";
$_ADDONLANG['deleteDataOnDeactivate'] = "Modül Devre Dışı Bırakıldığında Veriler Silinsin mi?";
$_ADDONLANG['deleteDataOnDeactivateDesc'] = "UYARI: Bu seçenek işaretlenirse, modül WHMCS'den kaldırıldığında tüm BTK raporlama veritabanı tabloları ve ayarları SİLİNECEKTİR!";
$_ADDONLANG['hareketLiveTableDays'] = "Hareketlerin Canlı Tabloda Kalma Süresi (Gün)";
$_ADDONLANG['hareketLiveTableDaysDesc'] = "ABONE HAREKET kayıtlarının, gönderildikten sonra canlı hareket tablosunda kaç gün daha tutulacağını belirtir. Sonrasında arşivlenir.";
$_ADDONLANG['hareketArchiveTableDays'] = "Hareketlerin Arşiv Tablosunda Kalma Süresi (Gün)";
$_ADDONLANG['hareketArchiveTableDaysDesc'] = "Arşivlenmiş ABONE HAREKET kayıtlarının ne kadar süreyle saklanacağını belirtir. Bu sürenin sonunda veriler kalıcı olarak silinebilir (opsiyonel).";
$_ADDONLANG['settingssavedsucceed'] = "Ayarlar başarıyla kaydedildi!";
$_ADDONLANG['operatorCodeRequired'] = "Operatör Kodu boş bırakılamaz.";
$_ADDONLANG['operatorNameRequired'] = "Operatör Adı boş bırakılamaz.";
$_ADDONLANG['mainFtpUserRequiredWithHost'] = "Ana FTP Host girilmişse, Kullanıcı Adı da girilmelidir.";
$_ADDONLANG['backupFtpUserRequiredWithHost'] = "Yedek FTP Host girilmişse, Kullanıcı Adı da girilmelidir.";


// Personel Yönetimi (personel.tpl)
// ... (Bir önceki "turkish.php eksiksiz gelsin" mesajındaki Personel Yönetimi bölümü buraya gelecek) ...
$_ADDONLANG['addNewPersonel'] = "Yeni Personel Ekle";
$_ADDONLANG['personelList'] = "Personel Listesi";
$_ADDONLANG['personelFirmaUnvani'] = "Firma Resmi Ünvanı";
$_ADDONLANG['personelAdi'] = "Adı";
$_ADDONLANG['personelSoyadi'] = "Soyadı";
$_ADDONLANG['personelTCKN'] = "T.C. Kimlik No";
$_ADDONLANG['personelUnvan'] = "Ünvanı/Pozisyonu";
$_ADDONLANG['personelDepartman'] = "Çalıştığı Birim";
$_ADDONLANG['personelMobilTel'] = "Mobil Telefonu";
$_ADDONLANG['personelSabitTel'] = "Sabit Telefonu";
$_ADDONLANG['personelEmail'] = "E-posta Adresi";
$_ADDONLANG['personelEvAdresi'] = "Ev Adresi (İK İçin)";
$_ADDONLANG['personelAcilDurum'] = "Acil Durumda Aranacak Kişi (İK İçin)";
$_ADDONLANG['personelIseBaslama'] = "İşe Başlama Tarihi (İK İçin)";
$_ADDONLANG['personelIstenAyrilma'] = "İşten Ayrılma Tarihi (İK İçin)";
$_ADDONLANG['personelIsBirakmaNedeni'] = "İş Bırakma Nedeni (İK İçin)";
$_ADDONLANG['personelGorevBolgesiIlce'] = "Görev Bölgesi (İlçe)";
$_ADDONLANG['personelBtkListesineEkle'] = "BTK Personel Listesine Ekle";
$_ADDONLANG['personelBtkListesineEkleDesc'] = "Bu personel, BTK'ya gönderilecek resmi personel listesine dahil edilsin mi?";
$_ADDONLANG['personelNoPersonelFound'] = "Kayıtlı personel bulunamadı.";
$_ADDONLANG['personelEdit'] = "Düzenle";
$_ADDONLANG['personelDelete'] = "Sil";
$_ADDONLANG['personelDeleteConfirm'] = "%s isimli personeli silmek istediğinizden emin misiniz?";
$_ADDONLANG['personelsavedsucceed'] = "Personel bilgileri başarıyla kaydedildi!";
$_ADDONLANG['personelupdatesucceed'] = "Personel bilgileri başarıyla güncellendi!";
$_ADDONLANG['personelsavefailed'] = "Personel bilgileri kaydedilirken bir hata oluştu.";
$_ADDONLANG['personeldeletedsucceed'] = "Personel başarıyla silindi!";
$_ADDONLANG['personeldeletefailed'] = "Personel silinirken bir hata oluştu.";
$_ADDONLANG['nviTcDogrula'] = "NVI TCKN Doğrula";
$_ADDONLANG['nviDogrulamaBasarili'] = "TCKN Başarıyla Doğrulandı.";
$_ADDONLANG['nviDogrulamaBasarisiz'] = "TCKN Doğrulanamadı! Lütfen bilgileri kontrol edin veya NVI servisini daha sonra tekrar deneyin.";
$_ADDONLANG['firmaUnvaniAutoDesc'] = "Bu alan Genel Ayarlar'daki 'Operatör Resmi Ünvanı' bölümünden otomatik olarak çekilir.";
$_ADDONLANG['addEditPersonelTitle'] = "Personel Ekle/Düzenle";
$_ADDONLANG['editPersonelTitle'] = "Personel Bilgilerini Düzenle";
$_ADDONLANG['filterPersonel'] = "Personel Filtrele";
$_ADDONLANG['personelDurumu'] = "Çalışma Durumu";
$_ADDONLANG['aktifCalisan'] = "Aktif Çalışan";
$_ADDONLANG['ayrilmisCalisan'] = "İşten Ayrılmış";
$_ADDONLANG['dogumYiliNvi'] = "Doğum Yılı (NVI için)";
$_ADDONLANG['dogumYiliNviDesc'] = "TCKN doğrulaması için personelin 4 haneli doğum yılı gereklidir.";
$_ADDONLANG['whmcsAdminUser'] = "İlişkili WHMCS Yöneticisi (Opsiyonel)";
$_ADDONLANG['noWhmcsAdminLink'] = "WHMCS Yöneticisi ile İlişkilendirme Yok";
$_ADDONLANG['whmcsAdminLinkDesc'] = "Bu personel bir WHMCS admin hesabıyla ilişkiliyse seçin. Bu, bazı otomatik işlemlerde kullanılabilir.";


// ISS POP Noktası Yönetimi (iss_pop_management.tpl)
// ... (Bir önceki "turkish.php eksiksiz gelsin" mesajındaki ISS POP bölümü buraya gelecek) ...
$_ADDONLANG['addNewIssPop'] = "Yeni POP Noktası Ekle";
$_ADDONLANG['issPopList'] = "ISS POP Noktaları Listesi";
$_ADDONLANG['popAdi'] = "POP Adı / Lokasyon Adı";
$_ADDONLANG['yayinYapilanSSID'] = "Yayın Yapılan SSID";
$_ADDONLANG['popIpAdresi'] = "IP Adresi";
$_ADDONLANG['popCihazTuru'] = "Cihaz Türü";
$_ADDONLANG['popCihazMarkasi'] = "Cihaz Markası";
$_ADDONLANG['popCihazModeli'] = "Cihaz Modeli";
$_ADDONLANG['popTipi'] = "POP Tipi (Baz İst./Santral vb.)";
$_ADDONLANG['popIl'] = "İl";
$_ADDONLANG['popIlce'] = "İlçe";
$_ADDONLANG['popMahalle'] = "Mahalle/Köy";
$_ADDONLANG['popTamAdres'] = "Tam Adres";
$_ADDONLANG['popKoordinatlar'] = "Koordinatlar (Enlem,Boylam)";
$_ADDONLANG['popAktifPasif'] = "Durum";
$_ADDONLANG['popImportExcel'] = "Excel'den İçe Aktar (.xlsx)";
$_ADDONLANG['popExportExcel'] = "Excel'e Dışa Aktar (.xlsx)";
$_ADDONLANG['popNoPopFound'] = "Kayıtlı POP noktası bulunamadı.";
$_ADDONLANG['isspopsavedsucceed'] = "ISS POP Noktası bilgileri başarıyla kaydedildi!";
$_ADDONLANG['isspopupdatesucceed'] = "ISS POP Noktası bilgileri başarıyla güncellendi!";
$_ADDONLANG['isspopsavefailed'] = "ISS POP Noktası bilgileri kaydedilirken bir hata oluştu.";
$_ADDONLANG['isspopdeletedsucceed'] = "ISS POP Noktası başarıyla silindi!";
$_ADDONLANG['isspopdeletefailed'] = "ISS POP Noktası silinirken bir hata oluştu.";
$_ADDONLANG['excelFile'] = "Excel Dosyası (.xlsx)";
$_ADDONLANG['excelImportDesc'] = "Lütfen `iss_pop_nokta_listesi.xlsx` formatına uygun bir Excel dosyası seçin. Mevcut kayıtlar 'Yayın Yapılan SSID' ve 'İlçe' bazında güncellenecek, olmayanlar eklenecektir.";
$_ADDONLANG['downloadSampleExcel'] = "Örnek Excel Şablonunu İndir";
$_ADDONLANG['addEditIssPopTitle'] = "POP Noktası Ekle/Düzenle";
$_ADDONLANG['editIssPopTitle'] = "POP Noktası Bilgilerini Düzenle";
$_ADDONLANG['deleteConfirmPop'] = "'%s' isimli POP noktasını silmek istediğinizden emin misiniz?";
$_ADDONLANG['popLocationInfo'] = "POP Lokasyon Bilgileri";
$_ADDONLANG['filterIssPop'] = "POP Noktası Filtrele";


// Ürün Grubu Eşleştirme (product_group_mappings.tpl) - YENİ EKLENENLER
$_ADDONLANG['mapProductGroupsToBtkAuth'] = "WHMCS Ürün Gruplarını BTK Yetki Türleriyle Eşleştirin";
$_ADDONLANG['productGroupMappingDesc'] = "Bu sayfada, WHMCS sisteminizdeki ürün gruplarını, hangi BTK Yetki Türü (ve dolayısıyla hangi raporlama Tip'i) kapsamında raporlanacağını belirleyebilirsiniz. Sadece Genel Ayarlar'da aktif ettiğiniz BTK yetki türleri burada listelenecektir.";
$_ADDONLANG['productGroupMappingInfo'] = "Bir ürün grubunu bir BTK Yetki Türü ile eşleştirdiğinizde, o ürün grubundaki tüm hizmetler (ürünler) seçilen yetki türünün gerektirdiği rapor formatına göre (örn: ISS, STH, AIH) raporlanacaktır.";
$_ADDONLANG['productGroupName'] = "WHMCS Ürün Grubu";
$_ADDONLANG['btkYetkiTuru'] = "Eşleştirilecek BTK Yetki Türü";
$_ADDONLANG['productGroupMappingTooltip'] = "Her ürün grubu için sadece bir BTK yetki türü seçebilirsiniz. Seçim yapmazsanız veya 'Eşleştirme Yok' seçerseniz, o gruptaki ürünler BTK raporlarına dahil edilmeyebilir veya varsayılan bir işleme tabi tutulabilir.";
$_ADDONLANG['noMapping'] = "Eşleştirme Yok / Raporlama Dışı";
$_ADDONLANG['noProductGroupsFound'] = "Sistemde tanımlı ürün grubu bulunamadı. Lütfen önce WHMCS'te ürün grupları oluşturun.";
$_ADDONLANG['noActiveBtkAuthTypes'] = "Genel Ayarlar'da aktif edilmiş ve raporlama grubu tanımlanmış (ISS, AIH, STH vb.) BTK Yetki Türü bulunamadı. Lütfen önce Genel Ayarlar sayfasından yetki türlerini seçip, bu yetki türlerinin referans tablosunda (`mod_btk_yetki_turleri_referans`) \"grup\" alanlarının dolu olduğundan emin olun.";
$_ADDONLANG['saveMappings'] = "Eşleştirmeleri Kaydet";
$_ADDONLANG['mappingssavedsucceed'] = "Eşleştirmeler başarıyla kaydedildi.";
$_ADDONLANG['mappingssavefailed'] = "Eşleştirmeler kaydedilirken bir hata oluştu.";


// Manuel Rapor Oluşturma (generate_reports.tpl) - YENİ EKLENENLER
$_ADDONLANG['selectReportAndAction'] = "Rapor Türü Seçin ve İşlemi Başlatın";
$_ADDONLANG['yetkiTuruGrubu'] = "Yetki Türü Grubu (Tip)";
$_ADDONLANG['allActiveGroups'] = "Tüm Aktif Gruplar İçin Tek Tek";
$_ADDONLANG['yetkiGrupSecimNotu'] = "Personel raporu için bu alan dikkate alınmaz. REHBER ve HAREKET raporları seçilen grup için üretilir. 'Tüm Aktif Gruplar' seçilirse her aktif yetki grubu için ayrı ayrı raporlar oluşturulur.";
$_ADDONLANG['ftpTarget'] = "FTP Hedefi";
$_ADDONLANG['mainFtpServerShort'] = "Ana FTP";
$_ADDONLANG['backupFtpServerShort'] = "Yedek FTP";
$_ADDONLANG['bothFtpServers'] = "Her İki FTP Birden";
$_ADDONLANG['ftpDoNotSend'] = "FTP'ye Gönderme (Sadece Oluştur)";
$_ADDONLANG['cntOverride'] = "CNT Değeri (Opsiyonel)";
$_ADDONLANG['cntOverrideDesc'] = "BTK'nın özel talebiyle belirli bir CNT ile göndermek için (Örn: 02). Normalde boş bırakın, sistem otomatik belirler (Yeni rapor için '01').";
$_ADDONLANG['generateReportConfirm'] = "Seçili rapor(lar) oluşturulup belirtilen FTP hedeflerine gönderilsin mi?";
$_ADDONLANG['generateAndSendReport'] = "Raporu Oluştur ve Gönder";
$_ADDONLANG['resendOldReportTitle'] = "Yedek FTP'den Eski Raporu Yeniden Gönder";
$_ADDONLANG['resendOldReportDesc'] = "Bu özellik, daha önce yedek FTP sunucusuna gönderilmiş bir raporu, dosya adındaki CNT değerini bir artırarak Ana BTK FTP sunucusuna yeniden göndermenizi sağlar. (İleri aşamada geliştirilecektir).";
$_ADDONLANG['filenameSearch'] = "Dosya Adında Ara";
$_ADDONLANG['dateRange'] = "Tarih Aralığı";
$_ADDONLANG['searchInBackup'] = "Yedekte Ara";


// Log Görüntüleme (view_logs.tpl) - YENİ EKLENENLER
$_ADDONLANG['moduleLogsTitle'] = "İşlem ve Hata Logları";
$_ADDONLANG['ftpLogsTitle'] = "FTP Gönderim Logları";
$_ADDONLANG['lastXLogs'] = "Son %s Kayıt";
$_ADDONLANG['logDateTime'] = "Tarih/Saat";
$_ADDONLANG['logLevel'] = "Seviye";
$_ADDONLANG['logAction'] = "İşlem";
$_ADDONLANG['logActionFilter'] = "İşlem İçeriği";
$_ADDONLANG['logMessage'] = "Mesaj";
$_ADDONLANG['logUserId'] = "Kullanıcı ID";
$_ADDONLANG['logIpAddress'] = "IP Adresi";
$_ADDONLANG['noModuleLogsFound'] = "Modül işlem/hata log kaydı bulunamadı.";
$_ADDONLANG['logFilename'] = "Dosya Adı";
$_ADDONLANG['ftpServerType'] = "FTP Sunucusu";
$_ADDONLANG['logStatus'] = "Durum";
$_ADDONLANG['logErrorMessage'] = "Hata Mesajı";
$_ADDONLANG['noFtpLogsFound'] = "FTP gönderim log kaydı bulunamadı.";


// Client Profile & Service Details Enjeksiyonları (tpl dosyalarından ve önceki tanımlardan)
$_ADDONLANG['btkInformationTab'] = "BTK Bilgileri";
$_ADDONLANG['btkServiceInfoTab'] = "BTK Hizmet Bilgileri";
$_ADDONLANG['btkAboneBilgileriTitle'] = "BTK Abonelik Bilgileri"; // Admin için
$_ADDONLANG['kimlikBilgileriTitle'] = "Kimlik Bilgileri";
$_ADDONLANG['aboneTcknDesc'] = "11 Haneli T.C. Kimlik Numarası.";
$_ADDONLANG['abonePasaportNo'] = "Pasaport No";
$_ADDONLANG['abonePasaportNoDesc'] = "Yabancı uyruklular için pasaport numarası.";
$_ADDONLANG['aboneBabaAdi'] = "Baba Adı";
$_ADDONLANG['aboneAnaAdi'] = "Anne Adı";
$_ADDONLANG['aboneDogumYeri'] = "Doğum Yeri";
$_ADDONLANG['aboneDogumTarihi'] = "Doğum Tarihi (YYYYMMDD)";
$_ADDONLANG['aboneCinsiyet'] = "Cinsiyet";
$_ADDONLANG['male'] = "Erkek";
$_ADDONLANG['female'] = "Kadın";
$_ADDONLANG['yerlesimAdresiTitle'] = "Yerleşim (İkamet) Adresi";
$_ADDONLANG['caddeSokakBulvar'] = "Cadde/Sokak/Bulvar";
$_ADDONLANG['disKapiNo'] = "Dış Kapı No";
$_ADDONLANG['icKapiNo'] = "İç Kapı No";
$_ADDONLANG['postaKodu'] = "Posta Kodu";
$_ADDONLANG['adresKoduUAVT'] = "Adres Kodu (UAVT)";
$_ADDONLANG['uavtSorgula'] = "UAVT Adres Kodu Sorgula";
$_ADDONLANG['musteriTipi'] = "Müşteri Tipi";
$_ADDONLANG['aboneMeslek'] = "Meslek";
$_ADDONLANG['btkHizmetDetaylariTitle'] = "BTK Hizmet Detayları"; // Admin için
$_ADDONLANG['btkServiceFormDesc'] = "Bu hizmete ait BTK raporlaması için gerekli olan tesis ve diğer özel bilgileri buradan giriniz.";
$_ADDONLANG['tesisAdresiAyniMi'] = "Yerleşim Adresi ile Tesis Adresi Aynı mı?";
$_ADDONLANG['tesisAdresiAyniMiDesc'] = "Eğer bu hizmetin sunulduğu tesis adresi, müşterinin ana yerleşim adresi ile aynı ise işaretleyin. Farklı ise, aşağıdaki alanları doldurun. Yeni hizmetlerde varsayılan olarak işaretlidir.";
$_ADDONLANG['tesisAdresiTitle'] = "Tesis Adresi";
$_ADDONLANG['farkliIseDoldurun'] = "Farklı İse Doldurun";
$_ADDONLANG['mahalleSecinceOto'] = "Mahalle seçildiğinde otomatik dolabilir.";
$_ADDONLANG['tesisKoordinatTitle'] = "Tesis Koordinat Bilgileri";
$_ADDONLANG['teknikEkipIcin'] = "Google Maps - Saha Ekibi İçin";
$_ADDONLANG['tesisKoordinatEnlem'] = "Tesis Koordinat Enlem";
$_ADDONLANG['tesisKoordinatBoylam'] = "Tesis Koordinat Boylam";
$_ADDONLANG['issPopBilgileriTitle'] = "ISS POP Bilgileri";
$_ADDONLANG['popFilterBy'] = "POP Filtreleme Kriteri:";
$_ADDONLANG['popFilterByIl'] = "İle Göre";
$_ADDONLANG['popFilterByIlce'] = "İlçeye Göre";
$_ADDONLANG['popFilterByMahalle'] = "Mahalleye Göre (Varsayılan)";
$_ADDONLANG['issPopNoktasiSecimi'] = "ISS POP Noktası (Yayın SSID)";
$_ADDONLANG['popSearchPlaceholder'] = "SSID veya POP Adı ile ara...";
$_ADDONLANG['issPopSecimNotu'] = "Hizmetin bağlı olduğu POP noktasının yayın SSID'sini seçin veya arayın. Filtre kriterini değiştirerek arama kapsamını daraltabilirsiniz.";
$_ADDONLANG['statikIp'] = "Statik IP Adresi (Varsa)";
$_ADDONLANG['hizProfili'] = "Hız Profili (Varsa)";

// Confirm Password (confirm_password.tpl)
$_ADDONLANG['enterYourPasswordToContinue'] = "Devam etmek için lütfen WHMCS admin şifrenizi girin:";
$_ADDONLANG['adminPassword'] = "Admin Şifreniz";

// Müşteri Paneli (Client Area) Metinleri
$_ADDONLANG['btkAboneBilgileriTitleClientArea'] = "BTK Abonelik Bilgileriniz";
$_ADDONLANG['btkHizmetDetaylariTitleClientArea'] = "Hizmetinize Ait BTK Detayları";
$_ADDONLANG['btkBilgileriAciklamaClient'] = "Bu bilgiler yasal yükümlülükler gereği BTK'ya raporlanmaktadır. Bilgilerinizde bir değişiklik olması durumunda lütfen bizimle iletişime geçerek güncellenmesini talep ediniz.";
$_ADDONLANG['aboneTcknClient'] = "T.C. Kimlik No / YKN:";
$_ADDONLANG['aboneAdiSoyadiClient'] = "Adınız Soyadınız:";
$_ADDONLANG['aboneUnvanClient'] = "Firma Ünvanı:";
$_ADDONLANG['yerlesimAdresiClient'] = "Yerleşim (İkamet) Adresiniz:";
$_ADDONLANG['disKapiNoClient'] = "D.No";
$_ADDONLANG['icKapiNoClient'] = "İ.No";
$_ADDONLANG['tesisAdresiClient'] = "Hizmet Tesis Adresi:";
$_ADDONLANG['yerlesimAdresiIleAyniClient'] = "Yerleşim adresiniz ile aynıdır.";
$_ADDONLANG['statikIpClient'] = "Statik IP Adresiniz:";
$_ADDONLANG['issPopBilgisiClient'] = "Bağlı Olduğunuz POP Bilgisi:";

// Genel hata/başarı mesajları
$_ADDONLANG['errorOccurred'] = "Bir hata oluştu!";
$_ADDONLANG['requiredFieldsMissing'] = "Gerekli alanlar boş bırakılamaz.";
$_ADDONLANG['invalidData'] = "Geçersiz veri formatı.";
$_ADDONLANG['saveSuccess'] = "Değişiklikler başarıyla kaydedildi.";
$_ADDONLANG['saveError'] = "Değişiklikler kaydedilirken bir hata oluştu.";
$_ADDONLANG['deleteSuccess'] = "Kayıt başarıyla silindi.";
$_ADDONLANG['deleteError'] = "Kayıt silinirken bir hata oluştu.";
$_ADDONLANG['noDataFound'] = "Veri bulunamadı.";

?>