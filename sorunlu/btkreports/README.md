# WHMCS BTK Raporlama Modülü - V2.0.1 - Beta

Bu WHMCS eklenti modülü, Türkiye'deki internet servis sağlayıcıları (ISS) ve diğer elektronik haberleşme hizmeti sunan işletmecilerin Bilgi Teknolojileri ve İletişim Kurumu'na (BTK) periyodik olarak göndermekle yükümlü olduğu ABONE REHBER, ABONE HAREKET ve PERSONEL LİSTESİ raporlarını oluşturma, yönetme ve FTP ile iletme süreçlerini otomatikleştirmek amacıyla geliştirilmiştir.

## Temel Özellikler

* **Otomatik Rapor Oluşturma:**
    * ABONE REHBER (.abn formatında, ISO-8859-9 karakter kodlamalı, .gz sıkıştırmalı)
    * ABONE HAREKET (.abn formatında, ISO-8859-9 karakter kodlamalı, .gz sıkıştırmalı)
    * PERSONEL LİSTESİ (.xlsx formatında)
* **Zamanlanmış Gönderim:** WHMCS cron sistemi ile entegre çalışarak raporların BTK'nın belirlediği periyotlarda (aylık, 6 aylık) otomatik oluşturulup FTP'ye yüklenmesi.
* **Manuel Rapor Oluşturma:** Admin panelinden istenilen raporun manuel olarak oluşturulup FTP'ye gönderilebilmesi.
* **Veri Giriş Arayüzleri:**
    * WHMCS müşteri profili sayfasına entegre BTK yerleşim adresi ve kimlik bilgileri formu.
    * WHMCS hizmet detayları sayfasına entegre BTK tesis adresi, operasyonel veri ve yetki tipine özel alanlar formu.
    * Ayrı bir personel yönetimi sayfası.
* **NVI Entegrasyonu (Halka Açık Servisler):**
    * T.C. Kimlik Numarası (TCKN) doğrulama (Ad, Soyad, Doğum Yılı ile).
    * Yabancı Kimlik Numarası (YKN) doğrulama (Ad, Soyad, Doğum Günü/Ayı/Yılı ile - NVI servisinin güncel durumuna bağlıdır).
    * Veri girişi sırasında ve rapor oluşturma anında doğrulama.
    * Doğrulanamayan kimlik numaralarına sahip kayıtların raporlara dahil edilmemesi ve loglanması.
* **Detaylı Loglama:** Modülün tüm önemli işlemleri (rapor oluşturma, FTP yükleme, NVI sorguları, hatalar vb.) veritabanına loglanır.
* **Yapılandırılabilir Ayarlar:** Operatör kodu, FTP bilgileri, cron zamanlamaları, yetki türü tanımları gibi birçok ayar admin panelinden yönetilebilir.
* **Çoklu Yetki Türü Desteği:** İşletmecinin sahip olduğu farklı BTK yetki türleri (ISS, AIH, STH, GSM vb.) için ayrı ayrı raporlama yapabilme.
* **WHMCS Ürün/Hizmet Eşleştirme:** WHMCS'teki ürünlerin/hizmetlerin BTK yetki türleri ve hizmet tipleri ile eşleştirilebilmesi.

## Kurulum

1.  **Dosyaların Yüklenmesi:**
    * Modül dosyalarını (`btkreports` klasörünü) WHMCS kurulumunuzdaki `/modules/addons/` dizinine yükleyin.
    * Eğer harici PHP kütüphaneleri (`dragonmantank/cron-expression`, `phpoffice/phpspreadsheet`) kullanılıyorsa, bu kütüphanelerin `btkreports/vendor/` klasörü altında olduğundan ve `btkreports/vendor/autoload.php` dosyasının var olduğundan emin olun. Bu kütüphaneleri modül klasörü içinde `composer install --no-dev` komutuyla yükleyebilirsiniz.

2.  **Modül Aktivasyonu:**
    * WHMCS Admin Paneli > Eklentiler (Setup > Addon Modules) bölümüne gidin.
    * "BTK Raporlama Modülü"nü bulun ve "Activate" butonuna tıklayın.
    * Modül aktive edildiğinde gerekli veritabanı tabloları otomatik olarak oluşturulacaktır. (`sql/install.sql`)

3.  **Başlangıç Verilerinin Yüklenmesi (ÖNEMLİ):**
    * `sql/initial_reference_data.sql` dosyasını bir metin düzenleyici ile açın.
    * Bu dosyadaki **EK-3 (Hizmet Tipleri), EK-4 (Kimlik Tipleri), EK-5 (Meslek Kodları)** ve özellikle **Türkiye il, ilçe ve mahalle/köy listelerini** BTK'nın güncel dokümanlarından ve TÜİK/NVI gibi resmi kaynaklardan temin ederek SQL `INSERT IGNORE INTO` komutlarıyla doldurun. Dosya içinde örnekler ve yönlendirmeler bulunmaktadır.
    * Tamamladığınız `initial_reference_data.sql` dosyasını phpMyAdmin gibi bir araçla veya WHMCS veritabanı yönetim araçlarıyla veritabanınıza import edin. Bu işlem, modülün referans tablolarını dolduracaktır.

4.  **İzinlerin Yapılandırılması (Access Control):**
    * WHMCS Admin Paneli > Eklentiler (Setup > Addon Modules) bölümünde "BTK Raporlama Modülü" yanındaki "Configure" butonuna tıklayın.
    * "Access Control" bölümünden modüle erişebilecek admin rollerini seçin.

5.  **Modül Ayarlarının Yapılandırılması:**
    * WHMCS Admin Paneli > Eklentiler (Addons) > BTK Raporlama Modülü'ne gidin.
    * "Modül Ayarları" sekmesinden aşağıdaki bilgileri eksiksiz doldurun:
        * Operatör Kodu, Operatör Adı, Operatör Tam Ticari Unvanı.
        * Ana BTK FTP Sunucu Bilgileri (Host, Kullanıcı Adı, Şifre, Port, Yollar).
        * Gerekiyorsa Yedek FTP Sunucu Bilgileri.
        * Cron Zamanlama Ayarları (Raporların otomatik gönderim periyotları).
        * Yetki Türü Tanımları (İşletmenizin sahip olduğu BTK yetki türlerini tanımlayın ve BTK dosya tipi kodlarıyla eşleştirin).
        * Diğer Ayarlar (Şifre onay zaman aşımı, tabloları silme seçeneği vb.).

6.  **WHMCS Ürün/Hizmet Eşleştirmesi:**
    * Modül Ayarları > Yetki Türleri sekmesinde tanımladığınız yetki türlerini, WHMCS Ürünleri/Hizmetleri ile eşleştirmeniz gerekmektedir. Bu eşleştirme genellikle WHMCS ürün ayarlarında veya modülün özel bir arayüzünde yapılır (Bu modülde `config.tpl` altında "Ürün/Hizmet - BTK Yetki Eşleştirmeleri" bölümü eklenebilir veya her ürünün "Module Settings" tabına bir seçenek eklenebilir. Şu anki yapıda bu eşleştirme `mod_btk_product_service_map` tablosu üzerinden manuel veya ek bir arayüzle yapılmalıdır).

7.  **Cron Job Kurulumu:**
    * `btkreports_cron.php` dosyasının WHMCS cron sistemi tarafından düzenli olarak çalıştırılması gerekmektedir. WHMCS'in ana cron job'ı zaten kuruluysa ve `/modules/addons/btkreports/btkreports_cron.php` dosyası çağrılacak şekilde ayarlandıysa ek bir işleme gerek yoktur.
    * WHMCS'in önerdiği şekilde ana cron job'ınızın çalıştığından emin olun (genellikle her 5 dakikada bir çalışır). `btkreports_cron.php` içindeki zamanlama mantığı, raporların doğru zamanda oluşturulmasını sağlayacaktır.

## Kullanım

* **Veri Girişi:**
    * Müşteri BTK bilgileri (yerleşim adresi, kimlik detayları) için: Müşteri Profili > BTK Bilgileri sekmesi.
    * Hizmet BTK bilgileri (tesis adresi, operasyonel veriler, yetkiye özel alanlar) için: Müşteri > Hizmetler > İlgili Hizmet > BTK Bilgileri sekmesi (veya modülün enjekte ettiği form).
    * Personel bilgileri için: Eklentiler > BTK Raporlama Modülü > Personel Yönetimi.
* **NVI Doğrulama:** İlgili formlarda bulunan "NVI Doğrula" butonları ile TCKN/YKN doğrulaması yapılabilir.
* **Rapor Oluşturma:**
    * **Otomatik:** `btkreports_cron.php` dosyası, Ayarlar sayfasında belirlediğiniz zamanlamalara göre raporları otomatik oluşturup FTP'ye yükler.
    * **Manuel:** Eklentiler > BTK Raporlama Modülü > Manuel Rapor Oluştur sayfasından istenilen rapor türü seçilerek anlık oluşturma ve gönderme yapılabilir.
* **Log Takibi:** Eklentiler > BTK Raporlama Modülü > İşlem Logları sayfasından modülün tüm aktiviteleri ve olası hatalar takip edilebilir.

## Harici Kütüphane Gereksinimleri

Modülün bazı işlevleri için aşağıdaki PHP kütüphanelerinin sunucunuzda kurulu olması ve WHMCS tarafından erişilebilir olması (genellikle `vendor/autoload.php` aracılığıyla) önerilir:

* **`dragonmantank/cron-expression`:** Cron zamanlama ifadelerinin doğru bir şekilde yorumlanması için. (Kurulum: `composer require dragonmantank/cron-expression`)
* **`phpoffice/phpspreadsheet`:** Personel Listesi raporunun `.xlsx` formatında oluşturulabilmesi için. (Kurulum: `composer require phpoffice/phpspreadsheet`)

Bu kütüphaneler modülün ana dizinindeki `vendor` klasörü altında bulunmalı ve `vendor/autoload.php` dosyası `btkreports_cron.php` ve `btkreports.php` dosyalarının başında çağrılmalıdır. Eğer bu kütüphaneler olmadan kullanılırsa, cron zamanlaması daha basit (ve daha az güvenilir) bir metotla kontrol edilir ve personel raporu `.xlsx` yerine daha basit bir formatta (örn: CSV) üretilmeye çalışılabilir veya üretilemeyebilir.

## Sorun Giderme

* **Logları Kontrol Edin:** Modülün "İşlem Logları" sayfası, karşılaşılan sorunların kaynağını bulmada ilk başvurulacak yerdir.
* **WHMCS Aktivite Logları:** WHMCS > Utilities > Logs > Activity Log bölümünden modülle ilgili genel hatalar görülebilir.
* **PHP Hata Logları:** Sunucunuzun PHP hata logları, daha derinlemesine teknik sorunlar hakkında bilgi verebilir.
* **FTP Ayarları:** FTP bağlantı bilgilerinin (host, kullanıcı adı, şifre, port, pasif mod, yollar) doğru olduğundan ve firewall tarafından engellenmediğinden emin olun. Modül ana sayfasındaki FTP Bağlantı Durumu'nu kontrol edin.
* **Dosya İzinleri:** `modules/addons/btkreports/` klasörü ve alt klasörleri (özellikle raporların geçici olarak oluşturulacağı bir `temp` veya `cache` klasörü kullanılırsa) için yazma izinlerinin doğru ayarlandığından emin olun. (Mevcut yapıda `sys_get_temp_dir()` kullanılıyor.)
* **Harici Kütüphaneler:** Eğer cron zamanlaması veya Excel raporu çalışmıyorsa, `Cron\CronExpression` ve `PhpOffice\PhpSpreadsheet` kütüphanelerinin doğru kurulup kurulmadığını kontrol edin.

## Destek

Bu modül Kablosuz Online ve Gemini AI iş birliği ile geliştirilmiştir. Destek için lütfen ilgili kanallar üzerinden iletişime geçin.

---

Bu README dosyası, modülün son haline göre daha da detaylandırılmalı ve ekran görüntüleri, daha spesifik yapılandırma örnekleri ile zenginleştirilmelidir.