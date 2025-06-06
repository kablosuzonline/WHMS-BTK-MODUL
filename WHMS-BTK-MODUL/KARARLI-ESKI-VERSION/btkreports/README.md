# WHMCS BTK Abone Veri Raporlama Modülü v1.0

Bu modül, WHMCS altyapısını kullanan internet servis sağlayıcıları ve diğer telekomünikasyon işletmecilerinin, Bilgi Teknolojileri ve İletişim Kurumu (BTK) tarafından talep edilen abone ve hizmet verilerini, BTK'nın belirlediği formatta (314_KK_Abone_Desen.pdf dokümanına göre) otomatik olarak oluşturmasını ve bu verileri belirlenen FTP sunucusuna yüklemesini sağlamak amacıyla geliştirilmiştir.

## Kurulum Adımları

1.  **Dosyaların Yüklenmesi:**
    * Bu arşivdeki `btkreports` klasörünü, WHMCS kurulumunuzun bulunduğu dizindeki `modules/addons/` klasörünün içine kopyalayın.
    * Yol şu şekilde olmalıdır: `WHMCS_ROOT/modules/addons/btkreports/`

2.  **Veritabanı Kurulumu:**
    * WHMCS veritabanınızda (örneğin phpMyAdmin veya benzeri bir araç kullanarak) `btkreports/sql/install.sql` dosyasındaki SQL komutlarını çalıştırın. Bu işlem, modül için gerekli veritabanı tablolarını oluşturacaktır.
    * Ardından, yine aynı yöntemle `btkreports/sql/initial_reference_data.sql` dosyasındaki SQL komutlarını çalıştırın. Bu işlem, BTK tarafından tanımlanmış referans kodlarını (EK-1, EK-2, EK-3 vb.) ve temel adres verilerini (iller, ilçeler, bazı mahalleler) veritabanına yükleyecektir.
        * **ÖNEMLİ:** `initial_reference_data.sql` dosyası Türkiye'nin tüm detaylı adres verilerini (mahalle, cadde/sokak, bina, kapı no vb.) içermez. Sadece bir başlangıç seti ve altyapı sunar. Kapsamlı adres verilerinin ayrıca temin edilmesi veya zamanla modül içinden (eğer geliştirilirse) ya da doğrudan veritabanı üzerinden eklenmesi gerekebilir.

3.  **Eklentinin Aktifleştirilmesi:**
    * WHMCS yönetici panelinize giriş yapın.
    * `Kurulum > Eklenti Modülleri` (veya `Setup > Addon Modules`) menüsüne gidin.
    * Listede "BTK Abone Veri Raporlama" modülünü bulun ve "Aktifleştir" (veya "Activate") butonuna tıklayın.

4.  **Erişim İzinlerinin Yapılandırılması:**
    * Modülü aktifleştirdikten sonra, aynı satırda bulunan "Yapılandır" (veya "Configure") butonuna tıklayın.
    * Açılan sayfada, modüle hangi yönetici rollerinin erişebileceğini seçin (örneğin, "Full Administrator").
    * "Değişiklikleri Kaydet" (veya "Save Changes") butonuna tıklayın.

5.  **Modül Ayarlarının Yapılandırılması:**
    * WHMCS yönetici panelinde `Eklentiler > BTK Abone Veri Raporlama` (veya `Addons > BTK Abone Veri Raporlama`) menüsüne gidin.
    * Açılan modül yönetim sayfasında, "Modül Ayarları" (veya benzeri bir sekme/buton) bölümüne gidin.
    * BTK tarafından size iletilen "Operatör Adı", "Operatör Kodu" bilgilerini girin.
    * Faaliyet gösterdiğiniz BTK Yetkilendirme Türlerini seçin.
    * Rapor dosyalarının yükleneceği FTP sunucusunun bilgilerini (Host, Kullanıcı Adı, Şifre) ve dosyaların yükleneceği spesifik klasör yollarını (Rehber FTP Yolu, Hareket FTP Yolu) girin.
    * Gerekli diğer ayarları (örneğin, "Boş dosya gönderilsin mi?") yapılandırın.
    * Ayarları kaydedin. FTP bağlantı testi yaparak bilgilerin doğruluğunu kontrol edebilirsiniz.

6.  **Ürün Grubu Eşleştirmeleri:**
    * Modül arayüzünden "Ürün Grubu - BTK Yetki Eşleştirme" bölümüne gidin.
    * WHMCS'teki ürün gruplarınızı, ilgili BTK Yetki Türü ve varsayılan EK-3 Hizmet Tipi ile eşleştirin. Bu, yeni hizmetler için varsayılan BTK raporlama kategorilerini belirleyecektir.

7.  **Cron Job Kurulumu (Otomatik Raporlama İçin):**
    * Modül, günlük HAREKET ve aylık REHBER dosyalarını otomatik olarak oluşturup FTP'ye yüklemek için WHMCS'in günlük cron job'una entegre çalışır (`btkreports_cron.php`).
    * WHMCS'in ana cron job'unun (`crons/cron.php`) sunucunuzda düzenli olarak (genellikle günde bir kez) çalışacak şekilde ayarlandığından emin olun. Detaylı bilgi için WHMCS dokümantasyonuna bakınız: [https://docs.whmcs.com/Crons](https://docs.whmcs.com/Crons)
    * `btkreports_cron.php` dosyasının çalışması için özel bir cron job ayarlamanıza gerek yoktur, WHMCS'in kendi cron sistemi üzerinden tetiklenecektir.

## Temel Kullanım

* **Müşteri BTK Bilgileri:** WHMCS müşteri özet sayfasında "BTK Bilgileri" adlı yeni bir sekme göreceksiniz. Buradan her bir abone için BTK'nın talep ettiği kimlik, adres ve diğer bilgileri girebilir/güncelleyebilirsiniz. TCKN/YKN doğrulaması bu ekrandan yapılır.
* **Hizmet BTK Bilgileri:** WHMCS ürün/hizmet detay sayfasında "BTK Hizmet Bilgileri" adlı yeni bir bölüm göreceksiniz. Buradan her bir hizmet için Hizmet Tesis Adresi ve hizmete özel diğer BTK parametrelerini (Statik IP, ISS Hız Profili vb.) girebilir/güncelleyebilirsiniz.
* **Raporlar:** Modül, ayarlarınıza ve cron job kurulumunuza bağlı olarak REHBER ve HAREKET dosyalarını periyodik olarak oluşturup FTP sunucunuza yükleyecektir.
* **Loglar:** Modül arayüzündeki "Logları Görüntüle" bölümünden modülün işlemleri, olası hatalar ve rapor gönderim durumları hakkında detaylı bilgi alabilirsiniz.
* **Manuel Rapor Oluşturma:** "Rapor Oluştur" bölümünden belirli dosyaları manuel olarak tetikleyip indirebilir veya FTP'ye gönderebilirsiniz.

## Gereksinimler

* WHMCS Versiyonu: 8.13.0 veya üzeri (test edildiği versiyon)
* PHP Versiyonu: 8.1.32 veya üzeri (test edildiği versiyon)
* PHP SOAP Eklentisi: NVI kimlik doğrulaması için gereklidir.
* PHP ZipArchive Eklentisi: Raporları .gz formatında sıkıştırmak için gereklidir.
* PHP mbstring Eklentisi: UTF-8 işlemleri için gereklidir.
* Sunucudan NVI (tckimlik.nvi.gov.tr) ve BTK FTP sunucusuna ağ erişimi.

## Önemli Notlar

* Bu modül karmaşık yasal ve teknik gereksinimlere dayanmaktadır. Modülün doğru yapılandırılması ve kullanılmasından kullanıcı sorumludur.
* BTK mevzuatında ve teknik gereksinimlerinde olabilecek değişiklikler modülde güncellemeler gerektirebilir.
* Herhangi bir sorunla karşılaşırsanız veya bir hata tespit ederseniz, lütfen geliştirici ile iletişime geçin.
* Bu bir ilk sürümdür. Test ve geri bildirimlerinizle modül daha da geliştirilecektir.

## Geliştirici
[Sen ve Ben Projesi]