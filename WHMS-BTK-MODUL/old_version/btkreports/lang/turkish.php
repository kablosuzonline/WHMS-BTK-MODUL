<?php
// modules/addons/btkreports/lang/turkish.php

if (!defined('WHMCS')) {
    die('This file cannot be accessed directly');
}

$_ADDONLANG['btkreports_modulename'] = 'BTK Abone Veri Raporlama';
$_ADDONLANG['btkreports_module_description'] = 'BTK tarafından istenen abone, hizmet ve personel verilerini raporlayan WHMCS eklenti modülü.';

// Genel
$_ADDONLANG['btkreports_go_back'] = 'Geri Dön';
$_ADDONLANG['btkreports_save_changes'] = 'Değişiklikleri Kaydet';
$_ADDONLANG['btkreports_success'] = 'Başarılı!';
$_ADDONLANG['btkreports_error'] = 'Hata!';
$_ADDONLANG['btkreports_warning'] = 'Uyarı!';
$_ADDONLANG['btkreports_info'] = 'Bilgi';
$_ADDONLANG['btkreports_please_wait'] = 'Lütfen Bekleyin...';
$_ADDONLANG['btkreports_home'] = 'Ana Sayfa';
$_ADDONLANG['btkreports_settings'] = 'Ayarlar';
$_ADDONLANG['btkreports_action'] = 'Eylem';
$_ADDONLANG['btkreports_status'] = 'Durum';
$_ADDONLANG['btkreports_created_at'] = 'Oluşturulma Tarihi';
$_ADDONLANG['btkreports_updated_at'] = 'Güncellenme Tarihi';
$_ADDONLANG['btkreports_actions'] = 'İşlemler';
$_ADDONLANG['btkreports_not_configured'] = 'Ayarlanmadı';
$_ADDONLANG['btkreports_or'] = 'veya';
$_ADDONLANG['btkreports_yes'] = 'Evet';
$_ADDONLANG['btkreports_no'] = 'Hayır';
$_ADDONLANG['btkreports_select_option'] = '-- Seçiniz --';
$_ADDONLANG['btkreports_select_option_ilce'] = '-- İlçe Seçin --';
$_ADDONLANG['btkreports_select_option_mahalle'] = '-- Mahalle Seçin --';
$_ADDONLANG['btkreports_all'] = 'Tümü';
$_ADDONLANG['btkreports_filter'] = 'Filtrele';
$_ADDONLANG['btkreports_clear_filter'] = 'Filtreyi Temizle';
$_ADDONLANG['btkreports_records_not_found'] = 'Kayıt bulunamadı.';
$_ADDONLANG['btkreports_close'] = 'Kapat';
$_ADDONLANG['btkreports_delete'] = 'Sil';
$_ADDONLANG['btkreports_edit'] = 'Düzenle';
$_ADDONLANG['btkreports_view'] = 'Görüntüle';
$_ADDONLANG['btkreports_confirm_delete'] = 'Silmek istediğinizden emin misiniz?';
$_ADDONLANG['btkreports_required_field'] = 'Bu alan zorunludur.';
$_ADDONLANG['btkreports_unknown_company'] = 'Bilinmeyen Firma';
$_ADDONLANG['btkreports_csrf_error'] = 'Geçersiz istek veya CSRF token.';
$_ADDONLANG['btkreports_note'] = 'Not';
$_ADDONLANG['btkreports_download_report'] = 'Raporu İndir';


// Aktivasyon / Deaktivasyon
$_ADDONLANG['btkreports_activate_success'] = 'BTK Raporlama Modülü başarıyla aktive edildi. Lütfen modül ayarlarını yapılandırın.';
$_ADDONLANG['btkreports_activate_error'] = 'Modül aktivasyonu sırasında bir hata oluştu: ';
$_ADDONLANG['btkreports_deactivate_success_deleted'] = 'BTK Raporlama Modülü başarıyla deaktive edildi ve ilgili tüm tablolar silindi.';
$_ADDONLANG['btkreports_deactivate_success_kept'] = 'BTK Raporlama Modülü başarıyla deaktive edildi. Veritabanı tablolarınız korunmuştur.';
$_ADDONLANG['btkreports_deactivate_error_deleting_tables'] = 'Modül deaktive edildi ancak tablolar silinirken bir hata oluştu: ';


// Ana Sayfa (index.tpl) Sekmeleri
$_ADDONLANG['btkreports_tab_home'] = 'Ana Sayfa';
$_ADDONLANG['btkreports_tab_settings'] = 'Ayarlar';
$_ADDONLANG['btkreports_tab_product_mappings'] = 'Ürün Eşleştirme';
$_ADDONLANG['btkreports_tab_generate_report'] = 'Rapor Oluştur';
$_ADDONLANG['btkreports_tab_personnel'] = 'Personel Yönetimi';
$_ADDONLANG['btkreports_tab_logs'] = 'Loglar';

// Ana Sayfa (index.tpl) İçeriği
$_ADDONLANG['btkreports_welcome_title'] = 'BTK Abone Veri Raporlama Modülüne Hoş Geldiniz';
$_ADDONLANG['btkreports_welcome_desc'] = 'Bu modül, BTK tarafından talep edilen abone, hizmet ve personel verilerini raporlamanıza yardımcı olur. Lütfen yukarıdaki sekmelerden veya aşağıdaki hızlı bağlantılardan istediğiniz işlemi seçin.';
$_ADDONLANG['btkreports_module_status_title'] = 'Modül Durumu';
$_ADDONLANG['btkreports_module_version'] = 'Versiyon';
$_ADDONLANG['btkreports_operator_name'] = 'Operatör Adı';
$_ADDONLANG['btkreports_operator_code'] = 'Operatör Kodu';
$_ADDONLANG['btkreports_operator_unvani_short'] = 'Operatör Unvanı';
$_ADDONLANG['btkreports_active_auth_types'] = 'Aktif Yetkilendirme Türleri';
$_ADDONLANG['btkreports_ftp_status'] = 'FTP Durumu';
$_ADDONLANG['btkreports_ftp_status_active'] = 'AKTİF';
$_ADDONLANG['btkreports_ftp_status_passive'] = 'PASİF';
$_ADDONLANG['btkreports_ftp_status_checking'] = 'Kontrol ediliyor...';
$_ADDONLANG['btkreports_ftp_status_not_configured'] = 'PASİF (Ayarlanmadı)';
$_ADDONLANG['btkreports_ftp_status_passive_error'] = 'PASİF (Bağlantı Hatası)';
$_ADDONLANG['btkreports_ftp_status_unknown'] = 'FTP Durumu Bilinmiyor';
$_ADDONLANG['btkreports_quick_links_title'] = 'Hızlı Bağlantılar';
$_ADDONLANG['btkreports_link_config'] = 'Genel Ayarlar';
$_ADDONLANG['btkreports_link_product_mappings'] = 'Ürün Eşleştirme';
$_ADDONLANG['btkreports_link_generate'] = 'Manuel Rapor Oluştur';
$_ADDONLANG['btkreports_link_personnel'] = 'Personel Yönetimi';
$_ADDONLANG['btkreports_link_logs'] = 'Logları Görüntüle';
$_ADDONLANG['btkreports_link_readme'] = 'Yardım / Dokümantasyon';
$_ADDONLANG['btkreports_link_readme_desc'] = 'Modül Kullanım Kılavuzu ve Güncelleme Notları';
$_ADDONLANG['btkreports_footer_text'] = 'BTK Raporlama Modülü - Tüm Hakları Saklıdır.';
$_ADDONLANG['btkreports_readme_title'] = 'Modül Yardım ve Dokümantasyon';
$_ADDONLANG['btkreports_readme_not_found'] = 'Yardım dosyası (README.md) bulunamadı veya okunamadı.';
$_ADDONLANG['btkreports_dashboard_title'] = 'Modül Paneli';


// Modül Ayarları (config.tpl)
$_ADDONLANG['btkreports_config_title'] = 'Modül Genel Ayarları';
$_ADDONLANG['btkreports_config_general_settings'] = 'Genel İşletmeci Bilgileri';
$_ADDONLANG['btkreports_config_operator_name_label'] = 'Operatör Adı';
$_ADDONLANG['btkreports_config_operator_name_placeholder'] = 'Örn: İZMAR BİLİŞİM HİZMETLERİ';
$_ADDONLANG['btkreports_config_operator_name_desc'] = 'BTK tarafından belirlenen işletmecinizin tam adı.';
$_ADDONLANG['btkreports_config_operator_code_label'] = 'Operatör Kodu';
$_ADDONLANG['btkreports_config_operator_code_desc'] = 'BTK tarafından size atanan 3 haneli operatör kodu (Örn: 701).';
$_ADDONLANG['btkreports_config_operator_code_error_format'] = 'Operatör kodu 3 haneli bir sayı olmalıdır!';
$_ADDONLANG['btkreports_config_operator_code_error_required'] = 'Operatör kodu boş bırakılamaz!';
$_ADDONLANG['btkreports_config_operator_unvani_label'] = 'Operatör Ticari Unvanı';
$_ADDONLANG['btkreports_config_operator_unvani_placeholder'] = 'Örn: İZMAR BİLİŞİM LTD. ŞTİ.';
$_ADDONLANG['btkreports_config_operator_unvani_desc'] = 'Personel raporunda kullanılacak işletmeci ticari unvanı.';
$_ADDONLANG['btkreports_config_auth_types_label'] = 'Aktif BTK Yetkilendirme Türleri';
$_ADDONLANG['btkreports_config_auth_types_desc'] = 'Sahip olduğunuz ve raporlama yapacağınız BTK yetki türlerini seçin.';
$_ADDONLANG['btkreports_config_no_auth_types_defined'] = 'Sistemde tanımlı BTK Yetki Türü bulunamadı. Lütfen initial_reference_data.sql dosyasını kontrol edin.';
$_ADDONLANG['btkreports_config_ftp_settings'] = 'FTP Sunucu Ayarları';
$_ADDONLANG['btkreports_config_ftp_host_label'] = 'FTP Sunucu Adresi (Host)';
$_ADDONLANG['btkreports_config_ftp_host_desc'] = 'Dosyaların yükleneceği FTP sunucusunun adresi.';
$_ADDONLANG['btkreports_config_ftp_host_error_required'] = 'FTP Sunucu Adresi boş bırakılamaz!';
$_ADDONLANG['btkreports_config_ftp_username_label'] = 'FTP Kullanıcı Adı';
$_ADDONLANG['btkreports_config_ftp_username_error_required'] = 'FTP Kullanıcı Adı boş bırakılamaz!';
$_ADDONLANG['btkreports_config_ftp_password_label'] = 'FTP Şifresi';
$_ADDONLANG['btkreports_config_ftp_password_placeholder'] = 'Değiştirmek istemiyorsanız boş bırakın';
$_ADDONLANG['btkreports_config_ftp_password_desc'] = 'Şifre veritabanında şifrelenerek saklanacaktır.';
$_ADDONLANG['btkreports_config_ftp_rehber_path_label'] = 'FTP REHBER Dosya Yolu';
$_ADDONLANG['btkreports_config_ftp_rehber_path_desc'] = 'REHBER dosyalarının FTP sunucusunda yükleneceği tam klasör yolu (Örn: /ABONE/REHBER/). Sonunda / olduğundan emin olun.';
$_ADDONLANG['btkreports_config_ftp_hareket_path_label'] = 'FTP HAREKET Dosya Yolu';
$_ADDONLANG['btkreports_config_ftp_hareket_path_desc'] = 'HAREKET dosyalarının FTP sunucusunda yükleneceği tam klasör yolu (Örn: /ABONE/HAREKET/). Sonunda / olduğundan emin olun.';
$_ADDONLANG['btkreports_config_personel_ftp_path_label'] = 'FTP PERSONEL Dosya Yolu';
$_ADDONLANG['btkreports_config_personel_ftp_path_desc'] = 'Personel listesi Excel dosyasının FTP sunucusunda yükleneceği tam klasör yolu (Örn: /PERSONEL/). Sonunda / olduğundan emin olun.';
$_ADDONLANG['btkreports_config_test_ftp_button'] = 'FTP Bağlantısını Test Et';
$_ADDONLANG['btkreports_config_ftp_testing'] = 'Test ediliyor...';
$_ADDONLANG['btkreports_ftp_test_success'] = 'FTP bağlantısı başarılı!';
$_ADDONLANG['btkreports_ftp_test_fail'] = 'FTP bağlantısı başarısız:';
$_ADDONLANG['btkreports_ftp_test_fail_ajax'] = 'FTP testinde AJAX hatası:';
$_ADDONLANG['btkreports_ftp_error_connect'] = 'Sunucuya bağlanılamadı.';
$_ADDONLANG['btkreports_ftp_error_login'] = 'Kullanıcı adı veya şifre hatalı.';
$_ADDONLANG['btkreports_ftp_test_error_temp_file'] = 'Geçici test dosyası oluşturulamadı.';
$_ADDONLANG['btkreports_ftp_test_upload_success'] = "Test dosyası başarıyla yüklendi ve silindi.";
$_ADDONLANG['btkreports_ftp_test_upload_fail'] = "Ancak test dosyası yüklenemedi/silinemedi. Yazma izinlerini kontrol edin.";
$_ADDONLANG['btkreports_ftp_error_timeout'] = 'Sunucu zaman aşımına uğradı.';
$_ADDONLANG['btkreports_ftp_error_unknown'] = 'Bilinmeyen bir hata oluştu.';
$_ADDONLANG['btkreports_config_other_settings'] = 'Diğer Raporlama Ayarları';
$_ADDONLANG['btkreports_config_send_empty_file_label'] = 'Boş Dosya Gönderilsin mi?';
$_ADDONLANG['btkreports_config_send_empty_file_desc'] = 'Eğer ilgili yetki türüne ait raporlanacak veri olmasa bile, BTK boş dosya gönderilmesini talep ediyorsa bu seçeneği işaretleyin.';
$_ADDONLANG['btkreports_config_deactivation_settings'] = 'Modül Deaktivasyon Ayarları';
$_ADDONLANG['btkreports_config_delete_data_on_uninstall_label'] = 'Deaktivasyonda Verileri Sil';
$_ADDONLANG['btkreports_config_delete_data_on_uninstall_desc'] = 'Modül deaktive edilirken/kaldırılırken tüm BTK veritabanı tabloları silinsin.';
$_ADDONLANG['btkreports_config_delete_data_warning'] = 'Bu seçenek işaretlenirse, modül kaldırıldığında tüm BTK verileriniz kalıcı olarak silinir!';
$_ADDONLANG['btkreports_config_save_success'] = 'Ayarlar başarıyla kaydedildi.';
$_ADDONLANG['btkreports_config_save_error_op_code'] = 'Operatör kodu geçerli değil, ayarlar kaydedilemedi!';


// Ürün Grubu Eşleştirme (product_group_mappings.tpl)
$_ADDONLANG['btkreports_pgmap_title'] = 'Ürün Grubu - BTK Yetki Türü Eşleştirme';
$_ADDONLANG['btkreports_pgmap_description'] = 'WHMCS ürün gruplarınızı, BTK Yetki Türü ve varsayılan Hizmet Tipi ile eşleştirin. Bu eşleştirmeler, yeni hizmetler için varsayılan değerleri belirleyecektir.';
$_ADDONLANG['btkreports_pgmap_note_auth_types'] = '"BTK Yetki Türü" dropdown menüsünde sadece modül ayarlarında aktif olarak seçtiğiniz yetki türleri listelenir.';
$_ADDONLANG['btkreports_pgmap_table_header_group'] = 'WHMCS Ürün Grubu';
$_ADDONLANG['btkreports_pgmap_table_header_auth_type'] = 'BTK Yetki Türü';
$_ADDONLANG['btkreports_pgmap_table_header_service_type'] = 'Varsayılan Hizmet Tipi (EK-3)';
$_ADDONLANG['btkreports_pgmap_no_groups_found'] = 'Eşleştirilecek WHMCS ürün grubu bulunamadı.';
$_ADDONLANG['btkreports_pgmap_select_auth_type'] = '-- Yetki Türü Seçin --';
$_ADDONLANG['btkreports_pgmap_select_service_type'] = '-- Hizmet Tipi Seçin (Opsiyonel) --';
$_ADDONLANG['btkreports_pgmap_save_success'] = 'Ürün grubu eşleştirmeleri başarıyla kaydedildi.';
$_ADDONLANG['btkreports_pgmap_save_error'] = 'Ürün grubu eşleştirmeleri kaydedilirken bir hata oluştu.';

// Rapor Oluşturma (generate.tpl)
$_ADDONLANG['btkreports_generate_title'] = 'Manuel Rapor Oluşturma ve Gönderme';
$_ADDONLANG['btkreports_generate_report_type'] = 'Rapor Türü';
$_ADDONLANG['btkreports_generate_select_report_type'] = '-- Rapor Türü Seçin --';
$_ADDONLANG['btkreports_generate_report_type_rehber'] = 'REHBER (Tüm Aboneler)';
$_ADDONLANG['btkreports_generate_report_type_hareket'] = 'HAREKET (Değişiklikler)';
$_ADDONLANG['btkreports_generate_date_range'] = 'Tarih Aralığı (Sadece Hareket Raporu İçin)';
$_ADDONLANG['btkreports_generate_date_from'] = 'Başlangıç Tarihi';
$_ADDONLANG['btkreports_generate_date_to'] = 'Bitiş Tarihi';
$_ADDONLANG['btkreports_generate_action'] = 'İşlem';
$_ADDONLANG['btkreports_generate_action_download'] = 'Oluştur ve İndir (.gz)';
$_ADDONLANG['btkreports_generate_action_ftp'] = 'Oluştur ve FTP\'ye Yükle';
$_ADDONLANG['btkreports_generate_button'] = 'Rapor Oluştur';
$_ADDONLANG['btkreports_generate_error'] = 'Hata: ';
$_ADDONLANG['btkreports_generate_success_ftp'] = 'Dosya FTP\'ye gönderilmek üzere başarıyla oluşturuldu';
$_ADDONLANG['btkreports_report_no_movement_data'] = "Raporlanacak hareket bulunamadı.";
$_ADDONLANG['btkreports_report_no_subscriber_data'] = "Raporlanacak abone bulunamadı.";
$_ADDONLANG['btkreports_empty_file'] = 'Boş dosya';
$_ADDONLANG['btkreports_empty_report_download_info'] = "Boş rapor dosyası oluşturuldu, indirmek için anlamlı değil.";
$_ADDONLANG['btkreports_report_generation_failed'] = "Rapor oluşturulamadı.";
$_ADDONLANG['btkreports_generating_report'] = 'Rapor Oluşturuluyor...';
$_ADDONLANG['btkreports_generate_select_report_type_alert'] = 'Lütfen bir rapor türü seçin.';
$_ADDONLANG['btkreports_generate_date_range_alert'] = 'Hareket raporu için lütfen tarih aralığı seçin.';


// Loglar (logs.tpl)
$_ADDONLANG['btkreports_logs_title'] = 'Modül İşlem Logları';
$_ADDONLANG['btkreports_logs_description'] = 'Modül tarafından gerçekleştirilen işlemlerin ve olası hataların kayıtları.';
$_ADDONLANG['btkreports_logs_table_date'] = 'Tarih/Saat';
$_ADDONLANG['btkreports_logs_table_description'] = 'Açıklama';
$_ADDONLANG['btkreports_logs_table_user'] = 'Kullanıcı';
$_ADDONLANG['btkreports_logs_table_ip'] = 'IP Adresi';
$_ADDONLANG['btkreports_logs_filter_desc'] = 'Açıklama Filtresi';
$_ADDONLANG['btkreports_logs_filter_user'] = 'Kullanıcı Adı Filtresi';
$_ADDONLANG['btkreports_logs_delete_all'] = 'Tüm Logları Sil';
$_ADDONLANG['btkreports_logs_delete_confirm'] = 'Tüm log kayıtlarını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.';
$_ADDONLANG['btkreports_logs_delete_success'] = 'Tüm log kayıtları başarıyla silindi.';
$_ADDONLANG['btkreports_logs_delete_error'] = 'Loglar silinirken hata: ';


// Personel Yönetimi (personel.tpl)
$_ADDONLANG['btkreports_personnel_title'] = 'Personel Bilgileri Yönetimi';
$_ADDONLANG['btkreports_personnel_description'] = 'BTK\'ya raporlanacak personel bilgilerini buradan yönetebilirsiniz.';
$_ADDONLANG['btkreports_personnel_sync_from_admins'] = 'WHMCS Yöneticilerinden Senkronize Et';
$_ADDONLANG['btkreports_personnel_sync_inprogress'] = 'Senkronize Ediliyor...';
$_ADDONLANG['btkreports_personnel_sync_success'] = 'Personel listesi WHMCS yöneticileriyle başarıyla senkronize edildi.';
$_ADDONLANG['btkreports_personnel_sync_error'] = 'Personel senkronizasyonu sırasında hata oluştu.';
$_ADDONLANG['btkreports_personnel_sync_error_tables'] = 'Personel senkronizasyonu için gerekli tablolar bulunamadı.';
$_ADDONLANG['btkreports_personnel_sync_completed'] = '%s yeni personel eklendi/güncellendi.';
$_ADDONLANG['btkreports_personnel_sync_errors_occurred'] = '%s personel işlenirken hata oluştu.';
$_ADDONLANG['btkreports_personnel_add_new_manual'] = 'Manuel Yeni Personel Ekle';
$_ADDONLANG['btkreports_personnel_edit'] = 'Personel Düzenle';
$_ADDONLANG['btkreports_personnel_list_title'] = 'Personel Listesi';
$_ADDONLANG['btkreports_personnel_list_desc'] = 'BTK raporlaması için yönetilecek personel listesi aşağıdadır. WHMCS yöneticileri ile senkronize edilir ve ek bilgiler manuel olarak girilebilir.';
$_ADDONLANG['btkreports_personnel_no_records'] = 'Yönetilecek personel kaydı bulunamadı. WHMCS yöneticileri ile senkronize etmeyi deneyin veya manuel yeni personel ekleyin.';
$_ADDONLANG['btkreports_personnel_admin_id'] = 'Admin ID';
$_ADDONLANG['btkreports_personnel_manual_entry'] = 'Manuel Kayıt';
$_ADDONLANG['btkreports_personnel_firma_adi'] = 'Firma Adı (Ticari Unvan)';
$_ADDONLANG['btkreports_personnel_adi'] = 'Adı';
$_ADDONLANG['btkreports_personnel_soyadi'] = 'Soyadı';
$_ADDONLANG['btkreports_personnel_eposta'] = 'E-posta';
$_ADDONLANG['btkreports_personnel_tckn'] = 'T.C. Kimlik No';
$_ADDONLANG['btkreports_personnel_tckn_tooltip'] = '11 haneli T.C. Kimlik Numarası';
$_ADDONLANG['btkreports_personnel_unvan'] = 'Ünvanı (BTK)';
$_ADDONLANG['btkreports_personnel_calistigi_birim'] = 'Çalıştığı Birim (BTK)';
$_ADDONLANG['btkreports_personnel_mobil_telefonu'] = 'Mobil Telefonu (BTK)';
$_ADDONLANG['btkreports_personnel_sabit_telefonu'] = 'Sabit Telefonu (BTK)';
$_ADDONLANG['btkreports_personnel_phone_placeholder'] = '5xxxxxxxxx';
$_ADDONLANG['btkreports_personnel_phone_placeholder_fixed'] = '212xxxxxxx';
$_ADDONLANG['btkreports_personnel_btk_listesine_eklensin'] = 'BTK Raporuna Dahil Et';
$_ADDONLANG['btkreports_personnel_btk_listesine_eklensin_desc'] = 'Bu personel BTK\'ya gönderilecek personel listesine dahil edilsin mi? (API kullanıcıları gibi bazılarını hariç tutabilirsiniz).';
$_ADDONLANG['btkreports_personnel_from_config'] = 'Modül ayarlarındaki Operatör Unvanından alınır';
$_ADDONLANG['btkreports_personnel_from_whmcs'] = 'WHMCS Yöneticisinden alınır';
$_ADDONLANG['btkreports_personnel_ik_info'] = 'İK Bilgileri (Opsiyonel - Dahili Kullanım İçin)';
$_ADDONLANG['btkreports_personnel_ev_adresi'] = 'Ev Adresi';
$_ADDONLANG['btkreports_personnel_ev_adresi_placeholder'] = 'Detaylı adres bilgisi... (İleride adres modülü ile entegre edilebilir)';
$_ADDONLANG['btkreports_personnel_acil_durum_kisi'] = 'Acil Durumda Aranacak Kişi';
$_ADDONLANG['btkreports_personnel_acil_durum_kisi_placeholder'] = 'Ad Soyad, Telefon, Yakınlık Derecesi...';
$_ADDONLANG['btkreports_personnel_ise_baslama_tarihi'] = 'İşe Başlama Tarihi';
$_ADDONLANG['btkreports_personnel_isten_ayrilma_tarihi'] = 'İşten Ayrılma Tarihi';
$_ADDONLANG['btkreports_personnel_is_birakma_nedeni'] = 'İş Bırakma Nedeni';
$_ADDONLANG['btkreports_personnel_report_settings'] = 'BTK Rapor Ayarları';
$_ADDONLANG['btkreports_personnel_save_success'] = 'Personel bilgileri başarıyla kaydedildi.';
$_ADDONLANG['btkreports_personnel_save_error'] = 'Personel bilgileri kaydedilirken hata oluştu.';
$_ADDONLANG['btkreports_personnel_delete_confirm_manual'] = "Bu manuel personel kaydını silmek istediğinizden emin misiniz?";
$_ADDONLANG['btkreports_personnel_delete_success'] = 'Personel BTK modülünden başarıyla silindi.';
$_ADDONLANG['btkreports_personnel_delete_error'] = 'Personel silinirken hata oluştu.';
$_ADDONLANG['btkreports_personnel_validation_error_required'] = 'Bu alan zorunludur.';
$_ADDONLANG['btkreports_personnel_validation_error_tckn'] = 'Geçerli bir T.C. Kimlik No giriniz.';
$_ADDONLANG['btkreports_personnel_validation_error_phone'] = 'Geçerli bir 10 haneli telefon numarası giriniz (örn: 5xxxxxxxxx veya 212xxxxxxx).';
$_ADDONLANG['btkreports_personnel_validation_error_email'] = 'Geçerli bir e-posta adresi giriniz.';
$_ADDONLANG['btkreports_personnel_validation_header'] = 'Lütfen aşağıdaki hataları düzeltin:';
$_ADDONLANG['btkreports_personnel_generate_excel_button'] = 'Personel Listesi Excel Oluştur ve FTP\'ye Yükle';
$_ADDONLANG['btkreports_personnel_manual_info'] = 'Personel listesi her yılın Haziran ve Aralık aylarının son günü otomatik olarak FTP\'ye yüklenir. Buradan manuel olarak da tetikleyebilirsiniz.';
$_ADDONLANG['btkreports_go_back_to_list'] = 'Personel Listesine Dön';
$_ADDONLANG['btkreports_personnel_select_action'] = 'Lütfen personel listesinden bir işlem seçin veya yeni personel ekleyin.';
$_ADDONLANG['btkreports_personnel_nvi_tckn_personel_label'] = 'TCKN Personel NVI Doğrula';
$_ADDONLANG['btkreports_personnel_nvi_status_pending'] = 'Doğrulama Bekliyor...';
$_ADDONLANG['btkreports_personnel_address_todo'] = 'Ev adresi girişi için adres modülü entegrasyonu (client_details.tpl benzeri) eklenecektir.';


// NVI Doğrulama (Müşteri ve Personel için ortak olabilir)
$_ADDONLANG['btkreports_client_nvi_tckn_label'] = 'TCKN NVI Doğrula';
$_ADDONLANG['btkreports_client_nvi_ykn_label'] = 'YKN NVI Doğrula';
$_ADDONLANG['btkreports_client_nvi_status'] = 'NVI Durumu';
$_ADDONLANG['btkreports_client_nvi_last_checked'] = 'Son NVI Kontrolü';
$_ADDONLANG['btkreports_client_nvi_verified'] = 'Doğrulandı';
$_ADDONLANG['btkreports_client_nvi_not_verified'] = 'Doğrulanamadı';
$_ADDONLANG['btkreports_client_nvi_not_checked'] = 'Kontrol Edilmedi';
$_ADDONLANG['btkreports_client_nvi_error_fill_fields_tckn'] = 'TCKN Doğrulaması için lütfen TCKN, Ad, Soyad ve Doğum Yılı alanlarını doldurun.';
$_ADDONLANG['btkreports_client_nvi_tckn_success'] = 'TCKN Doğrulaması Başarılı!';
$_ADDONLANG['btkreports_client_nvi_tckn_fail'] = 'TCKN Doğrulaması Başarısız! Lütfen bilgileri kontrol edin.';
$_ADDONLANG['btkreports_client_nvi_error_fill_fields_ykn'] = 'YKN Doğrulaması için lütfen YKN, Ad, Soyad ve Doğum Tarihi (Gün, Ay, Yıl) alanlarını doldurun.';
$_ADDONLANG['btkreports_client_nvi_ykn_success'] = 'YKN Doğrulaması Başarılı!';
$_ADDONLANG['btkreports_client_nvi_ykn_fail'] = 'YKN Doğrulaması Başarısız! Lütfen bilgileri kontrol edin.';

// Hook Mesajları (loglama için)
$_ADDONLANG['btkreports_hook_client_added'] = 'Yeni Müşteri/Abone Eklendi';
$_ADDONLANG['btkreports_hook_client_updated'] = 'Müşteri/Abone Bilgileri Güncellendi';
$_ADDONLANG['btkreports_hook_client_closed'] = 'Müşteri Hesabı Kapatıldı';
$_ADDONLANG['btkreports_hook_service_created'] = 'Yeni Hizmet Oluşturuldu/Aktif Edildi';
$_ADDONLANG['btkreports_hook_service_suspended'] = 'Hizmet Askıya Alındı';
$_ADDONLANG['btkreports_hook_service_unsuspended'] = 'Hizmet Askıdan Çıkarıldı';
$_ADDONLANG['btkreports_hook_service_terminated'] = 'Hizmet İptal Edildi (Sonlandırıldı)';
$_ADDONLANG['btkreports_hook_service_deleted'] = 'Hizmet Silindi';
$_ADDONLANG['btkreports_hook_service_package_changed'] = 'Hizmet Paketi/Tarifesi Değiştirildi';
$_ADDONLANG['btkreports_hook_admin_added_sync_attempt'] = "Yeni yönetici eklendi, personel senkronizasyonu denendi. Admin ID: ";
$_ADDONLANG['btkreports_hook_admin_edited_sync_attempt'] = "Yönetici bilgileri düzenlendi, personel senkronizasyonu denendi. Admin ID: ";
$_ADDONLANG['btkreports_hook_admin_deleted_marked'] = "Yönetici silindi, personel kaydı güncellendi (işten ayrıldı olarak işaretlendi). Admin ID: ";
$_ADDONLANG['btkreports_hook_admin_deleted_error'] = "Yönetici silindi, personel kaydı güncellenirken HATA: ";

// Müşteri Özeti Sekmesi ve Hizmet Detayları Sekmesi
$_ADDONLANG['btkreports_client_tab_title'] = 'BTK Bilgileri';
$_ADDONLANG['btkreports_service_tab_title'] = 'BTK Hizmet Bilgileri';
$_ADDONLANG['btkreports_save_btk_data'] = 'BTK Bilgilerini Kaydet';
$_ADDONLANG['btkreports_musteri_tipi_label'] = 'Müşteri Tipi (EK-3)';
$_ADDONLANG['btkreports_abone_baslangic_tarihi_label'] = 'Abonelik Başlangıç Tarihi';
$_ADDONLANG['btkreports_abone_bitis_tarihi_label'] = 'Abonelik Bitiş Tarihi';
$_ADDONLANG['btkreports_abone_tarife_label'] = 'Abone Tarife Adı';
$_ADDONLANG['btkreports_abone_tckn_label'] = 'TC Kimlik No';
$_ADDONLANG['btkreports_abone_ykn_label'] = 'Yabancı Kimlik No';
$_ADDONLANG['btkreports_abone_unvan_label'] = 'Unvan (Kurumsal ise)';
$_ADDONLANG['btkreports_abone_vergi_no_label'] = 'Vergi Numarası (Kurumsal ise)';
$_ADDONLANG['btkreports_abone_mersis_no_label'] = 'Mersis Numarası (Kurumsal ise)';
$_ADDONLANG['btkreports_abone_cinsiyet_label'] = 'Cinsiyet';
$_ADDONLANG['btkreports_abone_cinsiyet_erkek'] = 'Erkek';
$_ADDONLANG['btkreports_abone_cinsiyet_kadin'] = 'Kadın';
$_ADDONLANG['btkreports_abone_cinsiyet_diger'] = 'Diğer/Belirtilmemiş';
$_ADDONLANG['btkreports_abone_uyruk_label'] = 'Uyruk (ISO 3166-1 Alpha-2)';
$_ADDONLANG['btkreports_abone_baba_adi_label'] = 'Baba Adı';
$_ADDONLANG['btkreports_abone_ana_adi_label'] = 'Anne Adı';
$_ADDONLANG['btkreports_abone_anne_kizlik_soyadi_label'] = 'Anne Kızlık Soyadı';
$_ADDONLANG['btkreports_abone_dogum_yeri_label'] = 'Doğum Yeri';
$_ADDONLANG['btkreports_abone_dogum_tarihi_label'] = 'Doğum Tarihi';
$_ADDONLANG['btkreports_abone_meslek_label'] = 'Meslek';
$_ADDONLANG['btkreports_abone_kimlik_bilgileri_title'] = 'Kimlik Bilgileri';
$_ADDONLANG['btkreports_abone_kimlik_cilt_no_label'] = 'Cilt No';
$_ADDONLANG['btkreports_abone_kimlik_kutuk_no_label'] = 'Kütük No (Aile Sıra No)';
$_ADDONLANG['btkreports_abone_kimlik_sayfa_no_label'] = 'Sayfa No (Birey Sıra No)';
$_ADDONLANG['btkreports_abone_kimlik_nvi_il_label'] = 'Nüfusa Kayıtlı Olduğu İl';
$_ADDONLANG['btkreports_abone_kimlik_nvi_ilce_label'] = 'Nüfusa Kayıtlı Olduğu İlçe';
$_ADDONLANG['btkreports_abone_kimlik_mahalle_koy_label'] = 'Mahalle/Köy';
$_ADDONLANG['btkreports_abone_kimlik_tipi_label'] = 'Kimlik Tipi (EK-3)';
$_ADDONLANG['btkreports_abone_kimlik_seri_no_label'] = 'Kimlik Seri No';
$_ADDONLANG['btkreports_abone_kimlik_verildigi_yer_label'] = 'Kimliğin Verildiği Yer';
$_ADDONLANG['btkreports_abone_kimlik_verildigi_tarih_label'] = 'Kimliğin Verildiği Tarih';
$_ADDONLANG['btkreports_abone_kimlik_aidiyeti_label'] = 'Kimlik Aidiyeti (EK-3)';
$_ADDONLANG['btkreports_adres_bilgileri_title'] = 'Adres Bilgileri';
$_ADDONLANG['btkreports_yerlesim_adresi_title'] = 'Yerleşim Yeri Adresi (İkametgah)';
$_ADDONLANG['btkreports_kurum_adresi_title'] = 'Kurum Yetkili Adresi (Kurumsal ise)';
$_ADDONLANG['btkreports_adres_il_label'] = 'İl';
$_ADDONLANG['btkreports_adres_ilce_label'] = 'İlçe';
$_ADDONLANG['btkreports_adres_mahalle_label'] = 'Mahalle/Köy';
$_ADDONLANG['btkreports_adres_csbm_label'] = 'CSBM (Cadde/Sokak/Bulvar/Meydan)';
$_ADDONLANG['btkreports_adres_site_bina_label'] = 'Site/Bina Adı';
$_ADDONLANG['btkreports_adres_dis_kapi_label'] = 'Dış Kapı No';
$_ADDONLANG['btkreports_adres_ic_kapi_label'] = 'İç Kapı No';
$_ADDONLANG['btkreports_adres_posta_kodu_label'] = 'Posta Kodu';
$_ADDONLANG['btkreports_adres_uavt_kodu_label'] = 'UAVT Adres Kodu';
$_ADDONLANG['btkreports_irtibat_bilgileri_title'] = 'İrtibat Bilgileri';
$_ADDONLANG['btkreports_irtibat_tel1_label'] = 'Telefon 1';
$_ADDONLANG['btkreports_irtibat_tel2_label'] = 'Telefon 2 (Opsiyonel)';
$_ADDONLANG['btkreports_irtibat_email_label'] = 'E-posta Adresi';
$_ADDONLANG['btkreports_kurum_yetkilisi_title'] = 'Kurum Yetkilisi Bilgileri (Kurumsal ise)';
$_ADDONLANG['btkreports_kurum_yetkili_ad_label'] = 'Yetkili Adı';
$_ADDONLANG['btkreports_kurum_yetkili_soyad_label'] = 'Yetkili Soyadı';
$_ADDONLANG['btkreports_kurum_yetkili_tckn_label'] = 'Yetkili TCKN';
$_ADDONLANG['btkreports_kurum_yetkili_tel_label'] = 'Yetkili Telefon';

$_ADDONLANG['btkreports_service_hat_durum_label'] = 'Hat Durum Kodu (EK-1)';
$_ADDONLANG['btkreports_service_hat_aciklama_label'] = 'Hat Açıklaması';
$_ADDONLANG['btkreports_service_override_yetki_label'] = 'Geçerli Yetki Türü (Override)';
$_ADDONLANG['btkreports_service_override_hizmet_label'] = 'Geçerli Hizmet Tipi (Override)';
$_ADDONLANG['btkreports_service_tesis_adresi_title'] = 'Hizmet Tesis Adresi';
$_ADDONLANG['btkreports_service_tesis_adresi_ayni_label'] = 'Tesis adresi, abonenin yerleşim yeri adresi ile aynı mı?';
$_ADDONLANG['btkreports_service_statik_ip_label'] = 'Statik IP Adresi/Blokları';
$_ADDONLANG['btkreports_service_iss_hiz_profili_label'] = 'ISS Hız Profili';
$_ADDONLANG['btkreports_service_iss_kullanici_adi_label'] = 'ISS Kullanıcı Adı';
$_ADDONLANG['btkreports_service_iss_pop_bilgisi_label'] = 'ISS POP Bilgisi';
$_ADDONLANG['btkreports_service_aktivasyon_bilgileri_title'] = 'Aktivasyon Bilgileri';
$_ADDONLANG['btkreports_service_aktivasyon_bayi_adi_label'] = 'Aktivasyonu Yapan Bayi Adı';
$_ADDONLANG['btkreports_service_aktivasyon_bayi_adresi_label'] = 'Aktivasyonu Yapan Bayi Adresi';
$_ADDONLANG['btkreports_service_aktivasyon_kullanici_label'] = 'Aktivasyonu Yapan Kullanıcı';
$_ADDONLANG['btkreports_service_guncelleme_bilgileri_title'] = 'Son Güncelleme Bilgileri';
$_ADDONLANG['btkreports_service_guncelleyen_bayi_adi_label'] = 'Güncelleyen Bayi Adı';
$_ADDONLANG['btkreports_service_guncelleyen_bayi_adresi_label'] = 'Güncelleyen Bayi Adresi';
$_ADDONLANG['btkreports_service_guncelleyen_kullanici_label'] = 'Güncelleyen Kullanıcı';


?>