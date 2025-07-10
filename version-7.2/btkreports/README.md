# WHMCS BTK Raporlama Modülü

**Sürüm:** 6.5
**Geliştiren:** KablosuzOnline & Gemini AI

## Açıklama
Bu WHMCS eklenti modülü, Türkiye'deki servis sağlayıcıların Bilgi Teknolojileri ve İletişim Kurumu (BTK) tarafından talep edilen yasal raporlama yükümlülüklerini (ABONE REHBER, ABONE HAREKET, PERSONEL LİSTESİ) otomatize etmelerini sağlar.

## Kurulum
1. Modül dosyalarını `[WHMCS_KOK_DIZINI]/modules/addons/` klasörü altına `btkreports` ismiyle kopyalayın.
2. `btkreports` klasörü içinde, terminal veya SSH üzerinden `composer install` komutunu çalıştırarak gerekli kütüphaneleri (PhpSpreadsheet, Cron-Expression) yükleyin.
3. WHMCS admin panelinde `Sistem Ayarları > Eklenti Modülleri` bölümüne gidin.
4. "BTK Raporlama Modülü"nü bulun ve "Etkinleştir" butonuna tıklayın. Bu işlem, gerekli veritabanı tablolarını oluşturacak ve WHMCS adminlerinizi personel listesine ön-senkronize edecektir.
5. "Yapılandır" butonuna tıklayarak modülün temel ayarlarını (Operatör Kodu, Operatör Adı, FTP bilgileri vb.) yapın.

## Kullanım
Modül etkinleştirilip yapılandırıldıktan sonra, aşağıdaki adımları izleyin:
1.  **Genel Ayarlar:** Modülün ana ayarlarını, sahip olduğunuz BTK yetki türlerini ve cron zamanlamalarını yapılandırın.
2.  **Ürün Grubu Eşleştirme:** WHMCS ürün gruplarınızı ilgili BTK yetki türü ve hizmet tipi ile eşleştirin. Bu, raporların doğru kategorize edilmesi için kritiktir.
3.  **Personel Yönetimi:** WHMCS adminleriniz otomatik olarak personel listesine eklenecektir. Eksik olan BTK bilgilerini (TCKN, Ünvan vb.) bu sayfadan yönetin.
4.  **ISS POP Yönetimi:** İnternet servis sağlayıcılığı hizmeti veriyorsanız, POP noktalarınızı buradan tanımlayın.
5.  **Müşteri ve Hizmet Verileri:** Müşteri özet sayfasındaki "BTK Bilgileri" sekmesinden veya hizmet detayları sayfasındaki "BTK Hizmet Bilgileri" bölümünden, her bir abone ve hizmet için BTK'nın talep ettiği özel verileri girin ve güncelleyin.
6.  **Raporlama:** Raporlar, ayarladığınız cron zamanlamalarına göre otomatik olarak oluşturulup FTP'ye yüklenecektir. "Manuel Raporlar" sayfasından istediğiniz zaman rapor oluşturabilir veya indirebilirsiniz.
7.  **Günlük Kayıtları:** Modülün tüm işlemlerini, başarılı/başarısız FTP gönderimlerini ve olası hataları bu sayfadan takip edebilirsiniz.

## Sürüm Notları (v6.5)
- Temel veri çekme mantıkları (`getAboneRehberData`, `getAboneHareketData`) eklendi.
- Kritik WHMCS hook'ları (`AfterOrderAccept`, `AfterModuleSuspend`, `AfterModuleTerminate`, `ServiceDelete`, `PreAdminServiceEdit`) için temel işlevsellik eklendi.
- `BtkHelper` sınıfına CNT hesaplama (`getNextCnt`) ve adres ID bulma (`getIlIdByAdi` vb.) fonksiyonları eklendi.
- Personel yönetimi için NVI doğrulama mantığı entegre edildi ve kayıt engelleme özelliği eklendi.
- Manuel rapor oluşturma (`do_generate_report`) fonksiyonunun iskeleti oluşturuldu.
- Tüm dosyalarda sürüm numarası `6.5` olarak güncellendi ve yazar bilgisi `KablosuzOnline & Gemini AI` olarak damgalandı.
- `initial_reference_data.sql` dosyası Balıkesir ilçeleri ve Ayvalık mahalleleri ile güncellendi.
- WHMCS 8.x ve PHP 8.1+ uyumluluğu için kod iyileştirmeleri yapıldı.
- `config.tpl` ve `product_group_mappings.tpl` dosyalarındaki kritik hatalar giderildi.
- DataTables JS hataları düzeltildi ve `btk_admin_scripts.js` içine taşındı.

---