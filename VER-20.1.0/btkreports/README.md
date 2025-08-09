# WHMCS BTK Raporlama Modülü v13.0.0 (Mimari Sürüm)

Bu eklenti, Türkiye'de faaliyet gösteren İnternet Servis Sağlayıcıları (ISS), Sabit Telefon Hizmeti (STH) operatörleri ve diğer yetkilendirilmiş telekomünikasyon şirketlerinin, Bilgi Teknolojileri ve İletişim Kurumu (BTK) tarafından talep edilen yasal raporlama yükümlülüklerini WHMCS otomasyon sistemi üzerinden kolayca yerine getirmeleri için geliştirilmiş kapsamlı bir çözümdür.

Modül, sadece bir raporlama aracı olmanın ötesinde, abone yönetimi, operasyonel izleme ve yasal uyumluluk süreçlerini otomatize eden güçlü bir yönetim platformu sunar.

---

## Ana Özellikler

- **Tam Otomatik Raporlama:** Cron job (zamanlanmış görevler) ile Abone Rehber, Abone Hareket ve Personel raporlarını otomatik olarak oluşturur, sıkıştırır (.gz) ve BTK'nın FTP sunucularına (ana ve yedek) gönderir.
- **"Tek Yumurta İkizi" Mimarisi:** BTK'nın talep ettiği spesifik "aynı desen" yapısına tam uyumlu. Abone Rehber ve Abone Hareket raporları, BTK dökümanlarına harfiyen uyan, tutarlı bir formatta üretilir.
- **Geriye Dönük Veri İnşası:** 10 yılı aşkın süredir çalışan sistemler için bile, WHMCS faturalarını ve hizmet kayıtlarını analiz ederek geçmişe dönük tüm abone hareketlerini yeniden inşa eder. Operatörün kendi "milat" tarihini seçmesine olanak tanır.
- **NVI KPS Entegrasyonu:** Nüfus ve Vatandaşlık İşleri (NVI) Kimlik Paylaşım Sistemi (KPS) ile tam entegre. Abone TCKN, Ad, Soyad ve Doğum Yılı bilgilerini tek tuşla anlık olarak doğrular.
- **Kilitli Alan Güvenliği:** NVI üzerinden doğrulanan "çekirdek kimlik bilgileri" (TCKN, Ad, Soyad vb.) sistem tarafından kilitlenir ve değiştirilmesi engellenerek veri bütünlüğü ve rapor doğruluğu garanti altına alınır.
- **Esnek Ürün Grubu Eşleştirme:** WHMCS ürün gruplarınızı, sahip olduğunuz farklı BTK yetki türleri (ISS, STH, AIH vb.) ve hizmet tipleri (EK-3) ile kolayca eşleştirmenizi sağlar.
- **Gelişmiş Ağ İzleme (Network Monitoring):** ISS operatörleri için POP noktalarını, baz istasyonlarını veya santralleri anlık olarak (ping ile) izler. Canlı durum (Online/Offline/Yüksek Gecikme) takibi ve loglaması yapar.
- **Profesyonel Yönetici Arayüzü:** Tüm modül fonksiyonları için modern, anlaşılır ve kullanımı kolay bir yönetici arayüzü sunar.
- **Detaylı Loglama:** Modül içinde yapılan her işlemi, her FTP gönderimini ve olası hataları detaylı olarak kaydederek tam bir denetim izi sağlar.
- **Modüler ve Genişletilebilir Mimari ("Operasyon Beyincik"):** Kod tabanı, "Tek Sorumluluk Prensibi"ne uygun olarak uzmanlaşmış `Manager` sınıflarına ayrılmıştır. Bu, modülün bakımını kolaylaştırır ve gelecekteki yeni özelliklerin (örn: E-Devlet e-Sözleşme API) entegrasyonunu basitleştirir.

---

## Kurulum ve Yapılandırma

1.  **Dosyaları Yükleme:** `btkreports` klasörünü, WHMCS ana dizininizdeki `/modules/addons/` klasörünün içine yükleyin.
2.  **Bağımlılıkları Yükleme:** Sunucunuzda SSH erişiminiz varsa, `btkreports` klasörüne girip `composer install --no-dev` komutunu çalıştırın. SSH erişiminiz yoksa, yerel makinenizde Composer ile bağımlılıkları yükleyip `vendor` klasörünü sunucuya yükleyin.
3.  **Eklentiyi Etkinleştirme:** WHMCS Yönetici Paneli > Sistem Ayarları > Eklenti Modülleri yolunu izleyerek "BTK Raporlama Modülü"nü bulun ve "Etkinleştir" butonuna basın.
4.  **İzinleri Ayarlama:** "Yönetici Rol Grupları" bölümünden, ilgili yönetici grubuna modül için erişim izni verin.
5.  **Modülü Yapılandırma:**
    *   Eklentiler > BTK Raporlama Modülü menüsüne gidin.
    *   **Genel Ayarlar:** Operatör Kodunuzu, Adınızı ve FTP bilgilerinizi girin. Raporlamakla yükümlü olduğunuz BTK Yetki Türlerini aktif edin.
    *   **Ürün Grubu Eşleştirme:** WHMCS ürün gruplarınızı, BTK Yetki ve Hizmet tipleriyle eşleştirin. Bu adım, raporlamanın doğru çalışması için kritiktir.
    *   **Veri Seti Yöneticisi:** Adres verilerinin (İl, İlçe, Mahalle) doğru çalışması için bu sayfadan ilgili veri setlerini yükleyin.

---

## Sürüm Notları - v13.0.0 (Mimari Sürüm)

- **YENİ:** Kod tabanı, "Operasyon Beyincik" adı verilen yeni bir mimariye geçirildi. `BtkHelper` sınıfının sorumlulukları, `AboneManager`, `PersonelManager`, `ConfigManager`, `PageManager` gibi uzmanlaşmış yönetici sınıflarına dağıtıldı.
- **YENİ:** "Veri Seti Yöneticisi" eklendi. Artık büyük hacimli İl, İlçe ve Mahalle verileri, modül arayüzünden isteğe bağlı olarak yüklenebilmektedir.
- **GÜNCELLEME:** `install.sql` dosyası, gelecekteki E-Devlet entegrasyonu için `mod_btk_esozlesme_basvurular` tablosunu içerecek şekilde güncellendi.
- **GÜNCELLEME:** `initial_reference_data.sql` dosyasından adres verileri çıkarılarak dosya boyutu küçültüldü ve kurulum hızı artırıldı.
- **GÜNCELLEME:** Cron dosyaları, daha düzenli ve güvenli bir yapı için kendi `cron/` klasörlerine taşındı.
- **GÜNCELLEME:** NVI KPS entegrasyonu için `Verifier` sınıfları ve `config.tpl` üzerindeki ayar alanları tamamlandı.