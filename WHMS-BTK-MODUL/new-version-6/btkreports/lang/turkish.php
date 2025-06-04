<?php
/**
 * WHMCS BTK Raporlama Modülü - Türkçe Dil Dosyası
 * Version: 6.0.0
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// Genel
$_ADDONLANG['btkreports_modul_adi'] = "BTK Raporlama Modülü";
$_ADDONLANG['btkreports_anasayfa'] = "Ana Sayfa";
$_ADDONLANG['btkreports_ayarlar'] = "Modül Genel Ayarları";
$_ADDONLANG['btkreports_urun_grup_eslestirme'] = "Ürün Grubu - BTK Yetki Eşleştirme";
$_ADDONLANG['btkreports_rapor_secimi_ve_islem'] = "Rapor Seçimi ve İşlem";
$_ADDONLANG['btkreports_personel_yonetimi'] = "Personel Bilgileri"; // Başlık sadeleştirildi
$_ADDONLANG['btkreports_gunluk_kayitlari'] = "Modül Günlük Kayıtları (Loglar)";
$_ADDONLANG['btkreports_kaydet'] = "Ayarları Kaydet";
$_ADDONLANG['btkreports_ayarlar_kaydedildi'] = "Ayarlar başarıyla kaydedildi.";
$_ADDONLANG['btkreports_hata_ayarlar_kaydedilemedi'] = "Ayarlar kaydedilirken bir hata oluştu.";
$_ADDONLANG['btkreports_evet'] = "Evet";
$_ADDONLANG['btkreports_hayir'] = "Hayır";
$_ADDONLANG['btkreports_aktif'] = "Aktif";
$_ADDONLANG['btkreports_pasif'] = "Pasif";
$_ADDONLANG['btkreports_test_et'] = "Bağlantıyı Test Et";
$_ADDONLANG['btkreports_test_ediliyor'] = "Test ediliyor...";
$_ADDONLANG['btkreports_ftp_test_basarili'] = "FTP bağlantısı başarılı!";
$_ADDONLANG['btkreports_ftp_test_basarisiz'] = "FTP bağlantısı başarısız: ";
$_ADDONLANG['btkreports_lutfen_bekleyin'] = "Lütfen bekleyin...";
$_ADDONLANG['btkreports_gerekli_alan'] = "Bu alan gereklidir.";
$_ADDONLANG['btkreports_surum_notlari_link_aciklama'] = "Sürüm Notlarına İlişkin (TXT Doküman Linki)";


// Config Sayfası Başlıkları
$_ADDONLANG['btkreports_config_operator_ftp_ayarlari'] = "Operatör & FTP Sunucu Ayarları";
$_ADDONLANG['btkreports_config_btk_yetkilendirme_secenekleri'] = "Bilgi Teknolojileri ve İletişim Kurumu (BTK) Yetkilendirme Seçenekleri";
$_ADDONLANG['btkreports_config_diger_ayarlar'] = "Diğer Ayarlar";
$_ADDONLANG['btkreports_config_cron_ayarlari'] = "Otomatik Rapor Gönderim (Cron) Zamanlamaları";

// Config Sayfası - Operatör & FTP Alanları
$_ADDONLANG['btkreports_operator_adi_label'] = "Operatör Adı (BTK)";
$_ADDONLANG['btkreports_operator_adi_aciklama'] = "BTK tarafından işletmecinize tanımlanan tam adı (Örn: IZMARBILISIM)";
$_ADDONLANG['btkreports_operator_kodu_label'] = "Operatör Kodu (BTK)";
$_ADDONLANG['btkreports_operator_kodu_aciklama'] = "BTK tarafından size atanan 3 haneli operatör kodu (Örn: 701)";
$_ADDONLANG['btkreports_operator_unvani_label'] = "Operatör Ticari Unvanı";
$_ADDONLANG['btkreports_operator_unvani_aciklama'] = "Şirketinizin resmi ticari unvanı (Personel listesi için gereklidir)";

$_ADDONLANG['btkreports_ana_ftp_sunucusu_bilgileri'] = "Ana FTP Sunucusu Bilgileri (BTK)";
$_ADDONLANG['btkreports_ftp_adresi_label'] = "FTP Sunucu Adresi (Host)";
$_ADDONLANG['btkreports_ftp_adresi_aciklama'] = "Dosyaların yükleneceği FTP sunucusunun adresi.";
$_ADDONLANG['btkreports_ftp_port_label'] = "FTP Portu";
$_ADDONLANG['btkreports_ftp_port_aciklama'] = "Varsayılan: 21 (FTPS için genellikle 990)";
$_ADDONLANG['btkreports_ftp_kullanici_adi_label'] = "FTP Kullanıcı Adı";
$_ADDONLANG['btkreports_ftp_sifre_label'] = "FTP Şifresi";
$_ADDONLANG['btkreports_ftp_sifre_aciklama'] = "Şifre veritabanında şifrelenerek saklanacaktır. Değiştirmek istemiyorsanız boş bırakın.";
$_ADDONLANG['btkreports_ftp_rehber_dosya_yolu_label'] = "FTP REHBER Dosya Yolu";
$_ADDONLANG['btkreports_ftp_rehber_dosya_yolu_aciklama'] = "(REHBER dosyalarının FTP sunucusunda yükleneceği tam klasör yolu. Örn: /REHBER/). Sonunda / olduğundan emin olun.";
$_ADDONLANG['btkreports_ftp_hareket_dosya_yolu_label'] = "FTP HAREKET Dosya Yolu";
$_ADDONLANG['btkreports_ftp_hareket_dosya_yolu_aciklama'] = "(HAREKET dosyalarının FTP sunucusunda yükleneceği tam klasör yolu. Örn: /HAREKET/). Sonunda / olduğundan emin olun.";
$_ADDONLANG['btkreports_ftp_personel_dosya_yolu_label'] = "FTP PERSONEL Dosya Yolu";
$_ADDONLANG['btkreports_ftp_personel_dosya_yolu_aciklama'] = "(PERSONEL Excel dosyasının FTP sunucusunda yükleneceği tam klasör yolu. Örn: /PERSONEL/). Sonunda / olduğundan emin olun.";
$_ADDONLANG['btkreports_ftp_use_ssl_label'] = "Güvenli Bağlantı Kullan (FTPS)";
$_ADDONLANG['btkreports_ftp_passive_mode_label'] = "Pasif Mod Kullan";

$_ADDONLANG['btkreports_yedek_ftp_kullan_label'] = "Yedek FTP Sunucusu Kullanmak İstiyorum";
$_ADDONLANG['btkreports_yedek_ftp_sunucusu_bilgileri'] = "Yedek FTP Sunucusu Bilgileri (Arşiv Amaçlı)";
// Yedek FTP için alan etiketleri ana FTP ile aynı olabilir, context'ten anlaşılır. Gerekirse ayrı tanımlanabilir.

// Config Sayfası - BTK Yetkilendirme Seçenekleri
$_ADDONLANG['btkreports_btk_yetkilendirme_turleri_label'] = "BTK Yetkilendirme Türleri";
$_ADDONLANG['btkreports_btk_yetkilendirme_aciklama'] = "Sahip olduğunuz ve raporlama yapacağınız BTK yetki türlerini seçin. Bu seçim, \"Ürün Grubu Eşleştirme\" sayfasındaki seçenekleri etkileyecektir.";
// Yetki türleri getBtkYetkiTurleriListesi() fonksiyonundan çekilecek, burada ayrıca tanımlamaya gerek yok.

// Config Sayfası - Diğer Ayarlar
$_ADDONLANG['btkreports_bos_dosya_gonder_label'] = "Boş Dosya Gönderilsin mi?";
$_ADDONLANG['btkreports_bos_dosya_gonder_aciklama'] = "Eğer ilgili yetki türüne ait raporlanacak veri olmasa bile, BTK boş dosya gönderilmesini talep ediyorsa bu seçeneği işaretleyin.";
$_ADDONLANG['btkreports_sil_tablolar_kaldirirken_label'] = "Deaktivasyonda Veriler Silinsin mi?";
$_ADDONLANG['btkreports_sil_tablolar_kaldirirken_aciklama'] = "UYARI: Bu seçenek işaretlenirse, modül kaldırıldığında tüm BTK verileriniz kalıcı olarak silinir!";
$_ADDONLANG['btkreports_nvi_tc_dogrulama_aktif_label'] = "NVI T.C. Kimlik No Doğrulaması Aktif";
$_ADDONLANG['btkreports_nvi_yabanci_dogrulama_aktif_label'] = "NVI Yabancı Kimlik No Doğrulaması Aktif";
$_ADDONLANG['btkreports_log_level_label'] = "Log Seviyesi";
$_ADDONLANG['btkreports_log_level_aciklama'] = "Modülün ne kadar detaylı log tutacağını belirler (DEBUG, INFO, WARNING, ERROR).";

// Config Sayfası - Cron Ayarları
$_ADDONLANG['btkreports_cron_rehber_label'] = "ABONE REHBER Raporu Gönderim Zamanı";
$_ADDONLANG['btkreports_cron_hareket_label'] = "ABONE HAREKET Raporu Gönderim Zamanı";
$_ADDONLANG['btkreports_cron_personel_label'] = "PERSONEL Listesi (Excel) Gönderim Zamanı";
$_ADDONLANG['btkreports_cron_ay_label'] = "Ay (Örn: 1,15 veya * her ay)";
$_ADDONLANG['btkreports_cron_gun_hafta_label'] = "Haftanın Günü (0=Pazar, 6=C.tesi, * her gün)";
$_ADDONLANG['btkreports_cron_gun_ay_label'] = "Ayın Günü (Örn: L son gün, 1, */2)";
$_ADDONLANG['btkreports_cron_saat_label'] = "Saat (0-23)";
$_ADDONLANG['btkreports_cron_dakika_label'] = "Dakika (0-59)";
$_ADDONLANG['btkreports_cron_rehber_varsayilan'] = "Varsayılan: Her ayın ilk günü saat 10:00";
$_ADDONLANG['btkreports_cron_hareket_varsayilan'] = "Varsayılan: Her gün saat 01:00";
$_ADDONLANG['btkreports_cron_personel_varsayilan'] = "Varsayılan: Her yılın 6. ve 12. aylarının son günü saat 16:00";


// Yetki Türleri (getBtkYetkiTurleriListesi() fonksiyonu ile aynı olmalı)
// Bu kısım config.tpl'de dinamik olarak oluşturulacak, ancak anahtarların burada olması gerekebilir.
// Örnek: $_ADDONLANG['AIH_B'] = "Altyapı İşletmeciliği Hizmeti (B)";
// Şu an için doğrudan PHP fonksiyonundan çekiyoruz, bu yüzden buraya eklemiyorum.

?>