# WHMCS BTK Raporlama Modülü v8.0.0 (Zirve)

## Hakkında

Bu modül, Türkiye'de faaliyet gösteren İnternet Servis Sağlayıcı (ISS), Sabit Telefon Hizmeti (STH) ve diğer telekomünikasyon işletmecilerinin, Bilgi Teknolojileri ve İletişim Kurumu (BTK) tarafından zorunlu kılınan yasal raporlama yükümlülüklerini WHMCS üzerinden otomatize etmeleri için geliştirilmiş kapsamlı bir çözümdür.

**v8.0.0 (Zirve)** sürümü, sadece bir raporlama aracı olmanın ötesine geçerek, WHMCS ile "etle tırnak gibi" bütünleşen, operasyonel verimliliği artıran ve proaktif izleme yetenekleri sunan bir **İşletmeci Kontrol Paneli** haline gelmiştir.

## Temel Yetenekler

-   **Tam Otomatik Raporlama:** ABONE REHBER, ABONE HAREKET ve PERSONEL LİSTESİ raporlarını BTK'nın teknik şartnamesine %100 uyumlu olarak oluşturur, sıkıştırır ve FTP sunucularına otomatik olarak yükler.
-   **Kusursuz WHMCS Entegrasyonu:** BTK'ya özel verileri yönetmek için ayrı sayfalara veya sekmelere gitme ihtiyacını ortadan kaldırır. Tüm veri girişi ve yönetimi, WHMCS'in kendi **Müşteri Profili** ve **Hizmet Detayları** sayfalarına doğrudan enjekte edilen formlar aracılığıyla, sanki WHMCS'in kendi "Custom Fields" özelliğiymiş gibi yapılır.
-   **Tek "Kaydet" Butonu:** Enjekte edilen formlardaki veriler, WHMCS'in standart "Save Changes" butonu ile kaydedilir. Ekstra bir butona gerek yoktur.
-   **Operasyonel İzleme (Opsiyonel):** ISS'ler için POP noktalarının (Baz istasyonu, santral vb.) canlı durumunu (`ONLINE`, `OFFLINE`, `HIGH_LATENCY`) periyodik olarak `ping` atarak izler ve ana panelde özetler.
-   **Gelişmiş Yönetim Arayüzü:** Modern, hızlı ve kullanıcı dostu bir yönetici paneli sunar.
-   **Esnek Mimari:** Strateji ve Fabrika tasarım desenleri kullanılarak inşa edilmiştir, bu da gelecekteki değişikliklere (yeni rapor türleri, farklı kimlik doğrulama servisleri) kolayca uyum sağlamasını sağlar.
-   **Güvenlik:** CSRF koruması, güvenli geçici dosya yönetimi ve enjeksiyon saldırılarına karşı koruma mekanizmaları içerir.
-   **Sürüm Uyumluluğu:** Hem eski hem de yeni WHMCS sürümleriyle sorunsuz çalışacak şekilde tasarlanmıştır.

---

## Kurulum

1.  **Dosyaları Yükleyin:**
    -   Modül klasörünü (`btkreports`) WHMCS ana dizininizdeki `modules/addons/` klasörünün içine yükleyin.
    -   Dosya yapısı şu şekilde olmalıdır: `/path/to/whmcs/modules/addons/btkreports/`

2.  **Bağımlılıkları Kurun (Composer):**
    -   Sunucunuza SSH ile bağlanın ve `btkreports` klasörünün içine gidin:
      ```bash
      cd /path/to/whmcs/modules/addons/btkreports/
      ```
    -   Aşağıdaki komutu çalıştırarak gerekli PHP kütüphanelerini (PhpSpreadsheet, Cron-Expression) kurun:
      ```bash
      composer install --no-dev
      ```
    -   Eğer `composer` yüklü değilse, önce onu kurmanız gerekmektedir.

3.  **Modülü Etkinleştirin:**
    -   WHMCS yönetici panelinize giriş yapın.
    -   `Setup > Addon Modules` (veya `Ayarlar > Eklenti Modülleri`) sayfasına gidin.
    -   Listede "BTK Raporlama Modülü"nü bulun ve yanındaki **"Activate"** butonuna tıklayın.
    -   Etkinleştirme sırasında, modül gerekli veritabanı tablolarını ve güvenli `temp` klasörünü otomatik olarak oluşturacaktır.

4.  **İzinleri Yapılandırın:**
    -   Aynı sayfada, "BTK Raporlama Modülü"nün yanındaki **"Configure"** butonuna tıklayın.
    -   Modüle erişmesini istediğiniz yönetici gruplarını ("Full Administrator" gibi) seçin ve "Save Changes" butonuna tıklayın.

---

## Yapılandırma

Modül başarıyla etkinleştirildikten sonra, `Addons > BTK Raporlama Modülü` menüsünden modül arayüzüne erişin.

1.  **Genel Ayarlar:**
    -   **Operatör Bilgileri:** BTK tarafından size verilen Operatör Kodu, Adı ve Resmi Ünvanınızı girin.
    -   **FTP Ayarları:** BTK'nın ana ve (isteğe bağlı) yedek FTP sunucu bilgilerini eksiksiz olarak girin. "Bağlantıyı Test Et" butonu ile bilgilerin doğruluğunu kontrol edebilirsiniz.
    -   **BTK Yetkilendirme Seçenekleri:** Sahip olduğunuz ve raporlama yapacağınız tüm yetki türlerini (ISS, STH vb.) aktif hale getirin.
    -   **Cron Zamanlama:** Raporların ne sıklıkla oluşturulacağını standart cron formatında belirleyin.
    -   **Diğer Ayarlar:** Boş rapor gönderimi, kimlik doğrulama ve POP izleme gibi opsiyonel özellikleri buradan yönetin.

2.  **Ürün Grubu Eşleştirme:**
    -   Bu kritik sayfada, WHMCS'teki her bir ürün grubunuzun, hangi BTK Yetki Türü ve Hizmet Tipi altında raporlanacağını eşleştirin. Bu eşleştirme yapılmadan abone raporları oluşturulamaz.

3.  **Personel ve POP Yönetimi:**
    -   Raporlanacak personelinizi ve (eğer ISS iseniz) POP noktalarınızı ilgili sayfalardan yönetin.

---

## Cron Job Kurulumu

Modülün raporları ve izlemeyi otomatik yapabilmesi için sunucunuzda iki adet cron job (zamanlanmış görev) tanımlamanız gerekmektedir.

1.  **Raporlama Cron'u (Zorunlu):**
    ```
    */5 * * * * php -q /path/to/whmcs/modules/addons/btkreports/btkreports_cron.php
    ```
    *Bu cron, her 5 dakikada bir çalışarak, Genel Ayarlar'da belirlediğiniz zamanlamalara göre (örn: her gün saat 01:00'de HAREKET, her ayın 1'inde REHBER) raporları oluşturur ve gönderir.*

2.  **İzleme Cron'u (Opsiyonel):**
    *Eğer POP Noktası İzleme özelliğini aktif ettiyseniz, bu cron'u da eklemelisiniz.*
    ```
    */5 * * * * php -q /path/to/whmcs/modules/addons/btkreports/btkreports_monitor_cron.php
    ```
    *Bu cron, POP noktalarınızın durumunu Genel Ayarlar'da belirlediğiniz sıklıkta kontrol eder.*

`/path/to/whmcs/` kısmını kendi WHMCS kurulum yolunuzla değiştirmeyi unutmayın.

---

## Kusursuz Entegrasyon Nasıl Çalışır?

-   **Müşteri Bilgileri:** Bir müşterinin profiline girdiğinizde (`Clients > View/Search Clients > Profile`), sayfanın alt kısmında BTK'ya özel veri alanlarını göreceksiniz. Bu alanları doldurup sayfanın en altındaki WHMCS'in kendi **"Save Changes"** butonuna basmanız yeterlidir.
-   **Hizmet Bilgileri:** Bir müşterinin hizmet detaylarına girdiğinizde (`Clients > View/Search Clients > Products/Services`), sayfanın alt kısmında o hizmete özel BTK alanlarını (Hizmet Tipi, Tesis Adresi, POP Noktası vb.) göreceksiniz. Bu alanları doldurup yine sayfanın en altındaki **"Save Changes"** butonuna basmanız yeterlidir.

Modül, bu kaydetme işlemlerini arka planda yakalayarak ilgili BTK veritabanı tablolarını günceller ve gerekirse HAREKET raporu için kayıt oluşturur. **Asla ayrı bir "BTK Bilgilerini Kaydet" butonuna veya sayfasına ihtiyacınız olmaz.**