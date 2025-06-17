<?php
/**
 * WHMCS BTK Raporları Modülü - Türkçe Dil Dosyası
 *
 * @author Sizin Adınız veya Firma Adınız
 * @version 1.0.0
 */

if (!defined('WHMCS')) {
    die('This file cannot be accessed directly');
}

// Genel Modül İsimleri ve Başlıklar
$_LANG['btk_module_name'] = 'BTK Raporları Modülü';
$_LANG['btk_dashboard_title'] = 'BTK Raporları Yönetim Paneli';
$_LANG['btk_config_title'] = 'Modül Ayarları';
$_LANG['btk_personnel_title'] = 'Personel Yönetimi';
$_LANG['btk_generate_reports_title'] = 'Rapor Oluştur ve Gönder';
$_LANG['btk_iss_pop_management_title'] = 'ISS POP Noktası Yönetimi';
$_LANG['btk_view_logs_title'] = 'İşlem Kayıtları (Loglar)';
$_LANG['btk_product_mapping_title'] = 'Ürün Grubu - Yetki Türü Eşleştirme';

// Menü İsimleri
$_LANG['btk_menu_dashboard'] = 'Gösterge Paneli';
$_LANG['btk_menu_config'] = 'Ayarlar';
$_LANG['btk_menu_personnel'] = 'Personel Bilgileri';
$_LANG['btk_menu_generate_reports'] = 'Rapor Oluştur/Gönder';
$_LANG['btk_menu_iss_pop'] = 'ISS POP Noktaları';
$_LANG['btk_menu_view_logs'] = 'Logları Görüntüle';
$_LANG['btk_menu_product_mapping'] = 'Ürün Eşleştirme';

// Butonlar ve Eylemler
$_LANG['btk_button_save_changes'] = 'Değişiklikleri Kaydet';
$_LANG['btk_button_test_connection'] = 'Bağlantıyı Test Et';
$_LANG['btk_button_generate_and_send'] = 'Oluştur ve FTP\'ye Gönder';
$_LANG['btk_button_generate_download'] = 'Oluştur ve İndir';
$_LANG['btk_button_add_new'] = 'Yeni Ekle';
$_LANG['btk_button_edit'] = 'Düzenle';
$_LANG['btk_button_delete'] = 'Sil';
$_LANG['btk_button_view'] = 'Görüntüle';
$_LANG['btk_button_confirm'] = 'Onayla';
$_LANG['btk_button_cancel'] = 'İptal';
$_LANG['btk_button_search'] = 'Ara';
$_LANG['btk_button_reset'] = 'Sıfırla';
$_LANG['btk_button_import_excel'] = 'Excel\'den İçe Aktar';
$_LANG['btk_button_export_excel'] = 'Excel\'e Aktar';
$_LANG['btk_button_manual_fetch_personnel'] = 'WHMCS Personelini Manuel Çek';

// Genel Mesajlar
$_LANG['btk_settings_saved_successfully'] = 'Ayarlar başarıyla kaydedildi.';
$_LANG['btk_error_saving_settings'] = 'Ayarlar kaydedilirken bir hata oluştu.';
$_LANG['btk_ftp_connection_successful'] = 'FTP bağlantısı başarılı.';
$_LANG['btk_ftp_connection_failed'] = 'FTP bağlantısı başarısız: ';
$_LANG['btk_ftp_status_active'] = 'Aktif';
$_LANG['btk_ftp_status_passive'] = 'Pasif';
$_LANG['btk_ftp_writable'] = 'Yazılabilir';
$_LANG['btk_ftp_not_writable'] = 'Yazılabilir Değil';
$_LANG['btk_confirm_delete_title'] = 'Silme İşlemini Onayla';
$_LANG['btk_confirm_delete_message'] = 'Bu kaydı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.';
$_LANG['btk_action_successful'] = 'İşlem başarıyla tamamlandı.';
$_LANG['btk_action_failed'] = 'İşlem sırasında bir hata oluştu.';
$_LANG['btk_required_field'] = 'Bu alan zorunludur.';
$_LANG['btk_invalid_format'] = 'Geçersiz format.';
$_LANG['btk_no_records_found'] = 'Kayıt bulunamadı.';
$_LANG['btk_please_wait'] = 'Lütfen bekleyin...';

// Ana Sayfa (Dashboard - index.tpl)
$_LANG['btk_dashboard_welcome_message'] = 'BTK Raporları Modülüne hoş geldiniz,';
$_LANG['btk_dashboard_intro_text'] = 'Bu panel üzerinden BTK\'ya gönderilecek raporları oluşturabilir, gönderebilir ve modül ayarlarınızı yönetebilirsiniz.';
$_LANG['btk_dashboard_config_desc'] = 'Modülün genel ayarlarını, operatör ve FTP bilgilerini yapılandırın.';
$_LANG['btk_dashboard_generate_desc'] = 'Gerekli BTK raporlarını manuel olarak oluşturun ve FTP sunucusuna gönderin.';
$_LANG['btk_dashboard_logs_desc'] = 'Modül tarafından gerçekleştirilen tüm işlemlerin ve olası hataların kayıtlarını görüntüleyin.';
$_LANG['btk_dashboard_ftp_status_title'] = 'FTP Sunucu Durumları';
$_LANG['btk_main_ftp_server_status'] = 'Ana FTP Sunucusu';
$_LANG['btk_backup_ftp_server_status'] = 'Yedek FTP Sunucusu';
$_LANG['btk_readme_link_text'] = 'Modül Kullanım Kılavuzu ve Sürüm Notları';
$_LANG['btk_go_to_config'] = 'Ayarlara Git';
$_LANG['btk_go_to_generate'] = 'Rapor Gönder';
$_LANG['btk_go_to_logs'] = 'Logları Görüntüle';

// Config Sayfası (config.tpl)
$_LANG['btk_tab_general_settings'] = 'Genel Ayarlar';
$_LANG['btk_tab_operator_info'] = 'Operatör Bilgileri';
$_LANG['btk_tab_ftp_settings'] = 'FTP Ayarları';
$_LANG['btk_tab_reporting_settings'] = 'Raporlama Ayarları';
$_LANG['btk_tab_auth_types'] = 'Yetkilendirme Türleri';
$_LANG['btk_tab_other_settings'] = 'Diğer Ayarlar';

// Config - Operatör Bilgileri
$_LANG['btk_operator_code'] = 'Operatör Kodu';
$_LANG['btk_operator_code_desc'] = 'BTK tarafından size bildirilen 3 haneli operatör kodu (Örn: 701).';
$_LANG['btk_operator_name'] = 'Operatör Adı';
$_LANG['btk_operator_name_desc'] = 'BTK tarafından size bildirilen operatör adı (Dosya adlarında kullanılır, Örn: IZMARBILISIM). Türkçe karakter ve boşluk kullanmayınız.';
$_LANG['btk_operator_title_ufficial'] = 'Operatör Resmi Unvanı';
$_LANG['btk_operator_title_ufficial_desc'] = 'Şirketinizin Ticaret Sicilinde tescilli resmi unvanı (Personel Listesi raporunda kullanılır).';

// Config - FTP Ayarları
$_LANG['btk_main_ftp_settings_title'] = 'Ana FTP Sunucusu Ayarları (BTK FTP)';
$_LANG['btk_backup_ftp_settings_title'] = 'Yedek FTP Sunucusu Ayarları (Arşiv Amaçlı)';
$_LANG['btk_use_backup_ftp'] = 'Yedek FTP Sunucusu Kullanılsın mı?';
$_LANG['btk_use_backup_ftp_desc'] = 'Rapor dosyalarının bir kopyasının da yedek FTP sunucusuna gönderilmesini sağlar.';
$_LANG['btk_ftp_host'] = 'FTP Sunucu Adresi (Host)';
$_LANG['btk_ftp_host_desc'] = 'FTP sunucusunun adresi (örn: ftp.btk.gov.tr veya IP adresi).';
$_LANG['btk_ftp_port'] = 'FTP Port Numarası';
$_LANG['btk_ftp_port_desc'] = 'Genellikle 21\'dir. Farklıysa belirtiniz.';
$_LANG['btk_ftp_username'] = 'FTP Kullanıcı Adı';
$_LANG['btk_ftp_username_desc'] = 'FTP sunucusuna bağlanmak için kullanıcı adı.';
$_LANG['btk_ftp_password'] = 'FTP Şifresi';
$_LANG['btk_ftp_password_desc'] = 'FTP sunucusuna bağlanmak için şifre. Kaydedildiğinde şifrelenecektir.';
$_LANG['btk_ftp_passive_mode'] = 'Pasif Mod Kullanılsın mı?';
$_LANG['btk_ftp_passive_mode_desc'] = 'Firewall arkasındaysanız veya bağlantı sorunları yaşıyorsanız işaretleyiniz.';
$_LANG['btk_ftp_rehber_folder'] = 'ABONE REHBER Dosyası Hedef Klasörü';
$_LANG['btk_ftp_rehber_folder_desc'] = 'FTP sunucusunda ABONE REHBER dosyalarının yükleneceği tam yol (örn: /upload/rehber/). Başına ve sonuna / ekleyiniz.';
$_LANG['btk_ftp_hareket_folder'] = 'ABONE HAREKET Dosyası Hedef Klasörü';
$_LANG['btk_ftp_hareket_folder_desc'] = 'FTP sunucusunda ABONE HAREKET dosyalarının yükleneceği tam yol.';
$_LANG['btk_ftp_personel_folder'] = 'PERSONEL LİSTESİ Dosyası Hedef Klasörü';
$_LANG['btk_ftp_personel_folder_desc'] = 'FTP sunucusunda PERSONEL LİSTESİ Excel dosyasının yükleneceği tam yol.';
$_LANG['btk_ftp_connection_status'] = 'Bağlantı Durumu';

// Config - Raporlama Ayarları
$_LANG['btk_cron_settings_title'] = 'Otomatik Rapor Gönderimi (Cron Job) Ayarları';
$_LANG['btk_cron_rehber_schedule'] = 'ABONE REHBER Gönderim Zamanlaması';
$_LANG['btk_cron_rehber_schedule_desc'] = 'Cron formatında (örn: "0 10 1 * *" her ayın 1. günü saat 10:00). BTK genelde ayın ilk 5 günü içinde ister.';
$_LANG['btk_cron_hareket_schedule'] = 'ABONE HAREKET Gönderim Zamanlaması';
$_LANG['btk_cron_hareket_schedule_desc'] = 'Cron formatında (örn: "0 1 * * *" her gün saat 01:00). BTK genelde her gün bir önceki günün hareketlerini ister.';
$_LANG['btk_cron_personel_schedule_june'] = 'PERSONEL LİSTESİ (Haziran) Gönderim Zamanlaması';
$_LANG['btk_cron_personel_schedule_june_desc'] = 'Cron formatında (örn: "0 16 L 6 *" her Haziran ayının son günü saat 16:00).';
$_LANG['btk_cron_personel_schedule_december'] = 'PERSONEL LİSTESİ (Aralık) Gönderim Zamanlaması';
$_LANG['btk_cron_personel_schedule_december_desc'] = 'Cron formatında (örn: "0 16 L 12 *" her Aralık ayının son günü saat 16:00).';
$_LANG['btk_cron_command_info_title'] = 'Cron Komutu Bilgisi';
$_LANG['btk_cron_command_info_desc'] = 'Sunucunuzda aşağıdaki cron komutunu tanımlamanız gerekmektedir. Önerilen çalıştırma sıklığı saatte birdir. Modül, kendi içindeki zamanlamalara göre doğru zamanda ilgili raporu gönderecektir.';
$_LANG['btk_cron_command_text'] = 'php -q /path/to/your/whmcs/modules/addons/btkreports/cron/btkreports_cron.php';
$_LANG['btk_data_retention_title'] = 'Veri Saklama Süreleri';
$_LANG['btk_hareket_canli_retention'] = 'Canlı Hareket Kayıtları Saklama Süresi (Gün)';
$_LANG['btk_hareket_canli_retention_desc'] = '`mod_btk_abone_hareket_canli` tablosunda tutulacak hareket kayıtlarının maksimum gün sayısı. Süresi dolanlar arşive taşınır.';
$_LANG['btk_hareket_arsiv_retention'] = 'Arşivlenmiş Hareket Kayıtları Saklama Süresi (Gün)';
$_LANG['btk_hareket_arsiv_retention_desc'] = '`mod_btk_abone_hareket_arsiv` tablosunda tutulacak eski hareket kayıtlarının maksimum gün sayısı. Süresi dolanlar silinir (0: Asla Silme).';
$_LANG['btk_personnel_file_name_format_title'] = 'Personel Listesi Excel Dosya Adı Formatı';
$_LANG['btk_personnel_file_name_format_ana'] = 'Ana FTP için Yıl-Dönem Eklensin mi?';
$_LANG['btk_personnel_file_name_format_ana_desc'] = 'İşaretlenirse dosya adı "OPERATORADI_Personel_Listesi_YIL_DONEM.xlsx" formatında olur (örn: IZMARBILISIM_Personel_Listesi_2025_1.xlsx). İşaretlenmezse sadece "Personel_Listesi.xlsx" olur.';
$_LANG['btk_personnel_file_name_format_yedek'] = 'Yedek FTP için Yıl-Dönem Eklensin mi?';
$_LANG['btk_personnel_file_name_format_yedek_desc'] = 'Yedek FTP\'ye gönderilecek personel dosyası için aynı formatlama kuralı.';

// Config - Yetkilendirme Türleri
$_LANG['btk_auth_types_desc'] = 'BTK tarafından işletmenize verilen yetkilendirme türlerini seçiniz. Raporlar bu seçimlere göre filtrelenebilir veya farklı formatlarda oluşturulabilir.';
$_LANG['btk_auth_type_select_all'] = 'Tümünü Seç';
$_LANG['btk_auth_type_deselect_all'] = 'Tüm Seçimi Kaldır';

// Config - Diğer Ayarlar
$_LANG['btk_other_settings_title'] = 'Diğer Gelişmiş Ayarlar';
$_LANG['btk_delete_db_on_deactivate'] = 'Modül Devre Dışı Bırakıldığında Veritabanı Tabloları Silinsin mi?';
$_LANG['btk_delete_db_on_deactivate_desc'] = 'UYARI: Bu seçenek işaretlenirse, modül devre dışı bırakıldığında tüm BTK modülü tabloları (`mod_btk_` ile başlayanlar) ve verileri kalıcı olarak silinecektir.';
$_LANG['btk_debug_mode'] = 'Hata Ayıklama (Debug) Modu Aktif mi?';
$_LANG['btk_debug_mode_desc'] = 'Aktif edilirse, modül işlemleri hakkında daha detaylı loglar (`mod_btk_logs` tablosuna ve/veya WHMCS loglarına) yazılır. Sadece sorun giderme amaçlı kullanılmalıdır.';
$_LANG['btk_nvi_tckn_validation'] = 'TCKN Doğrulaması Aktif mi?';
$_LANG['btk_nvi_tckn_validation_desc'] = 'Abone ve personel T.C. Kimlik Numaralarının NVI servisleri üzerinden doğrulanmasını sağlar.';
$_LANG['btk_nvi_ykn_validation'] = 'Yabancı Kimlik No (YKN) Doğrulaması Aktif mi?';
$_LANG['btk_nvi_ykn_validation_desc'] = 'Yabancı uyruklu abonelerin kimlik numaralarının NVI servisleri üzerinden doğrulanmasını sağlar.';
$_LANG['btk_adres_kodu_validation'] = 'Adres Kodu (UAVT) Doğrulaması Aktif mi?';
$_LANG['btk_adres_kodu_validation_desc'] = 'İleride eklenecek bir özelliktir. Tesis ve yerleşim adres kodlarının doğrulanmasını hedefler. (Şu an için işlevsel değildir).';

// Personel Yönetimi Sayfası (personel.tpl)
$_LANG['btk_personnel_list_title'] = 'BTK Personel Listesi';
$_LANG['btk_personnel_list_desc'] = 'Bu sayfadan BTK\'ya bildirilecek personel listesini yönetebilirsiniz. Bilgiler WHMCS yönetici hesaplarından çekilir ve ek detaylar burada girilir.';
$_LANG['btk_personnel_id'] = 'ID';
$_LANG['btk_personnel_admin_id'] = 'WHMCS Admin ID';
$_LANG['btk_personnel_fullname'] = 'Ad Soyad';
$_LANG['btk_personnel_firstname'] = 'Adı';
$_LANG['btk_personnel_lastname'] = 'Soyadı';
$_LANG['btk_personnel_email'] = 'E-posta';
$_LANG['btk_personnel_company_title'] = 'Firma Unvanı';
$_LANG['btk_personnel_tckn'] = 'T.C. Kimlik No';
$_LANG['btk_personnel_nationality_iso'] = 'Uyruk (ISO Kodu)';
$_LANG['btk_personnel_job_title'] = 'Unvan/Görev';
$_LANG['btk_personnel_department'] = 'Departman';
$_LANG['btk_personnel_mobile_phone'] = 'Mobil Telefon';
$_LANG['btk_personnel_work_phone'] = 'İş Telefonu (Sabit)';
$_LANG['btk_personnel_home_address'] = 'Ev Adresi';
$_LANG['btk_personnel_emergency_contact_name'] = 'Acil Durumda Aranacak Kişi Adı';
$_LANG['btk_personnel_emergency_contact_phone'] = 'Acil Durumda Aranacak Kişi Telefonu';
$_LANG['btk_personnel_start_date'] = 'İşe Başlama Tarihi';
$_LANG['btk_personnel_end_date'] = 'İşten Ayrılma Tarihi';
$_LANG['btk_personnel_leave_reason'] = 'İşten Ayrılma Nedeni';
$_LANG['btk_personnel_include_in_btk_list'] = 'BTK Listesine Eklensin';
$_LANG['btk_personnel_include_in_btk_list_short'] = 'BTK Listesi';
$_LANG['btk_personnel_duty_region_province'] = 'Görev Bölgesi (İl)';
$_LANG['btk_personnel_duty_region_district'] = 'Görev Bölgesi (İlçe)';
$_LANG['btk_personnel_add_new_personnel'] = 'Yeni Personel Kaydı (Manuel)';
$_LANG['btk_personnel_edit_personnel'] = 'Personel Bilgilerini Düzenle';
$_LANG['btk_personnel_not_found'] = 'Personel kaydı bulunamadı.';
$_LANG['btk_personnel_info_tckn_validation'] = 'Girilen T.C. Kimlik Numarası, NVI servisleri üzerinden doğrulanacaktır.';
$_LANG['btk_personnel_info_nationality'] = 'Personelin uyruğunu seçiniz. BTK raporlarında 3 karakterli ISO kodu kullanılacaktır.';
$_LANG['btk_personnel_info_btk_list'] = 'Bu seçenek işaretli ise personel, BTK\'ya gönderilecek Excel listesine dahil edilir. API kullanıcıları gibi insan olmayan hesaplar için işareti kaldırınız.';
$_LANG['btk_personnel_info_end_date'] = 'Personel işten ayrıldıysa bu tarihi giriniz. BTK listesine sadece mevcut çalışanlar dahil edilir.';
$_LANG['btk_personnel_whmcs_admins_not_in_btk_list'] = 'WHMCS Yöneticileri (Henüz BTK Personel Listesine Eklenmemiş)';
$_LANG['btk_personnel_add_selected_to_btk'] = 'Seçili Yöneticileri BTK Listesine Ekle';
$_LANG['btk_personnel_confirm_add_admins'] = 'Seçili WHMCS yöneticilerini BTK Personel Listesine eklemek istediğinizden emin misiniz? Bu işlem, onlar için personel kayıtları oluşturacaktır.';
$_LANG['btk_personnel_no_new_admins_to_add'] = 'BTK Personel Listesine eklenecek yeni WHMCS yöneticisi bulunmamaktadır.';
$_LANG['btk_personnel_admins_added_successfully'] = 'Seçili yöneticiler BTK Personel Listesine başarıyla eklendi.';

// Rapor Oluşturma Sayfası (generate_reports.tpl)
$_LANG['btk_generate_report_page_desc'] = 'Bu sayfadan BTK\'ya gönderilmesi gereken raporları manuel olarak oluşturabilir ve ilgili FTP sunucusuna gönderebilirsiniz.';
$_LANG['btk_report_type_label'] = 'Rapor Türü';
$_LANG['btk_report_type_rehber'] = 'ABONE REHBER Raporu';
$_LANG['btk_report_type_hareket'] = 'ABONE HAREKET Raporu';
$_LANG['btk_report_type_personel'] = 'PERSONEL LİSTESİ (Excel)';
$_LANG['btk_report_options_title'] = 'Rapor Seçenekleri';
$_LANG['btk_report_date_range_start'] = 'Başlangıç Tarihi';
$_LANG['btk_report_date_range_end'] = 'Bitiş Tarihi';
$_LANG['btk_report_date_range_desc_hareket'] = 'ABONE HAREKET raporu için hareketlerin alınacağı tarih aralığı. Boş bırakılırsa, son gönderimden bu yana olan tüm hareketler alınır.';
$_LANG['btk_report_send_to_ftp'] = 'Oluşturulan Dosyayı FTP\'ye Gönder';
$_LANG['btk_report_send_to_main_ftp'] = 'Ana FTP\'ye Gönder';
$_LANG['btk_report_send_to_backup_ftp'] = 'Yedek FTP\'ye Gönder (Ayarlıysa)';
$_LANG['btk_report_already_generated_today'] = 'Bugün zaten bir %s raporu oluşturulmuş ve gönderilmiş. Yine de oluşturmak istiyor musunuz?';
$_LANG['btk_report_generating_please_wait'] = 'Rapor oluşturuluyor ve FTP\'ye gönderiliyor, lütfen bekleyiniz... Bu işlem veri büyüklüğüne göre zaman alabilir.';
$_LANG['btk_report_generate_success'] = '%s dosyası başarıyla oluşturuldu ve FTP\'ye gönderildi.';
$_LANG['btk_report_generate_success_download_only'] = '%s dosyası başarıyla oluşturuldu.';
$_LANG['btk_report_generate_failed'] = '%s dosyası oluşturulurken veya FTP\'ye gönderilirken bir hata oluştu.';
$_LANG['btk_report_no_data_to_report'] = 'Raporlanacak %s verisi bulunamadı.';
$_LANG['btk_report_personel_year_label'] = 'Personel Listesi Yılı';
$_LANG['btk_report_personel_period_label'] = 'Personel Listesi Dönemi';
$_LANG['btk_report_personel_period_june'] = '1. Dönem (Haziran Sonu)';
$_LANG['btk_report_personel_period_december'] = '2. Dönem (Aralık Sonu)';
$_LANG['btk_report_personel_info'] = 'Personel listesi, seçilen yıl ve döneme göre mevcut çalışanları içerecektir.';
$_LANG['btk_resend_archive_title'] = 'Arşivden Rapor Yeniden Gönderme (Yedek FTP)';
$_LANG['btk_resend_archive_desc'] = 'Daha önce Yedek FTP\'ye gönderilmiş bir raporu (ABONE REHBER veya HAREKET) CNT değeri artırılarak Ana FTP\'ye yeniden göndermek için kullanılır.';
$_LANG['btk_resend_search_filename'] = 'Aranacak Dosya Adı (Kısmi)';
$_LANG['btk_resend_search_filetype'] = 'Dosya Türü';
$_LANG['btk_resend_select_file_to_resend'] = 'Yeniden Gönderilecek Dosyayı Seçin';
$_LANG['btk_resend_no_files_found'] = 'Yedek FTP\'de arama kriterlerinize uygun dosya bulunamadı.';
$_LANG['btk_resend_confirm_message'] = '%s adlı dosyayı CNT değeri artırılarak Ana FTP\'ye yeniden göndermek istediğinizden emin misiniz?';
$_LANG['btk_resend_successful'] = '%s dosyası başarıyla yeniden gönderildi (Yeni dosya adı: %s).';
$_LANG['btk_resend_failed'] = 'Dosya yeniden gönderilirken bir hata oluştu.';

// -- ISS POP Noktası Yönetimi (iss_pop_management.tpl)
$_LANG['btk_pop_list_title'] = 'ISS POP Noktası Listesi';
$_LANG['btk_pop_list_desc'] = 'Abonelerinize hizmet verdiğiniz POP (Point of Presence) noktalarını bu bölümden yönetebilirsiniz. Bu bilgiler ABONE REHBER raporundaki ISS_POP_BILGISI alanında kullanılır.';
$_LANG['btk_pop_id'] = 'ID';
$_LANG['btk_pop_name'] = 'POP Adı';
$_LANG['btk_pop_province'] = 'İl';
$_LANG['btk_pop_district'] = 'İlçe';
$_LANG['btk_pop_neighbourhood'] = 'Mahalle';
$_LANG['btk_pop_address_detail'] = 'Adres Detayı';
$_LANG['btk_pop_coordinates'] = 'Koordinatlar (Enlem,Boylam)';
$_LANG['btk_pop_ssid'] = 'Yayın Yapılan SSID';
$_LANG['btk_pop_server_info'] = 'Sunucu Bilgisi';
$_LANG['btk_pop_is_active'] = 'Aktif mi?';
$_LANG['btk_pop_add_new_pop'] = 'Yeni POP Noktası Ekle';
$_LANG['btk_pop_edit_pop'] = 'POP Noktası Bilgilerini Düzenle';
$_LANG['btk_pop_info_ssid'] = 'Bu SSID, ABONE REHBER raporunda hizmetin bağlı olduğu WHMCS sunucu adıyla birleştirilerek (SUNUCU_ADI.SSID) ISS_POP_BILGISI alanını oluşturur.';
$_LANG['btk_pop_info_server_info'] = 'Bu POP noktasının ilişkili olduğu WHMCS sunucusunun adı veya IP adresi. Otomatik eşleştirme için kullanılabilir.';


// Log Görüntüleme Sayfası (view_logs.tpl)
$_LANG['btk_log_list_title'] = 'Modül İşlem Kayıtları';
$_LANG['btk_log_list_desc'] = 'BTK Raporları modülü tarafından gerçekleştirilen önemli işlemler ve karşılaşılan hatalar burada listelenir.';
$_LANG['btk_log_date'] = 'Tarih/Saat';
$_LANG['btk_log_level'] = 'Seviye';
$_LANG['btk_log_operation'] = 'İşlem';
$_LANG['btk_log_message'] = 'Mesaj';
$_LANG['btk_log_details'] = 'Detay';
$_LANG['btk_log_admin_user'] = 'Admin Kullanıcı';
$_LANG['btk_log_ip_address'] = 'IP Adresi';
$_LANG['btk_log_filter_options'] = 'Filtreleme Seçenekleri';
$_LANG['btk_log_level_info'] = 'Bilgi';
$_LANG['btk_log_level_warning'] = 'Uyarı';
$_LANG['btk_log_level_error'] = 'Hata';
$_LANG['btk_log_level_debug'] = 'Debug';
$_LANG['btk_log_level_critical'] = 'Kritik';
$_LANG['btk_log_clear_logs_button'] = 'Tüm Logları Temizle';
$_LANG['btk_log_confirm_clear_logs'] = 'Tüm işlem kayıtlarını kalıcı olarak silmek istediğinizden emin misiniz?';
$_LANG['btk_log_logs_cleared_successfully'] = 'Tüm loglar başarıyla temizlendi.';
$_LANG['btk_log_error_clearing_logs'] = 'Loglar temizlenirken bir hata oluştu.';

// Ürün Grubu - Yetki Türü Eşleştirme (product_group_mappings.tpl)
$_LANG['btk_product_mapping_page_title'] = 'WHMCS Ürün Grubu - BTK Yetki Türü Eşleştirme';
$_LANG['btk_product_mapping_page_desc'] = 'Bu sayfada, WHMCS\'deki ürün gruplarınızı hangi BTK Yetkilendirme Türü kapsamında raporlayacağınızı belirleyebilirsiniz. Eşleştirilmeyen ürün gruplarına ait hizmetler raporlara dahil edilmeyebilir veya varsayılan bir yetki türüne göre işlenebilir.';
$_LANG['btk_product_group_id'] = 'WHMCS Ürün Grubu ID';
$_LANG['btk_product_group_name'] = 'WHMCS Ürün Grubu Adı';
$_LANG['btk_assigned_auth_type'] = 'Atanan BTK Yetki Türü';
$_LANG['btk_no_auth_type_assigned'] = 'Henüz Atanmamış';
$_LANG['btk_select_auth_type_label'] = 'Yetki Türü Seçin:';
$_LANG['btk_mapping_saved_successfully'] = 'Ürün grubu eşleştirmesi başarıyla kaydedildi.';
$_LANG['btk_mapping_save_error'] = 'Eşleştirme kaydedilirken bir hata oluştu.';

// Müşteri Profili ve Hizmet Detayları Enjeksiyonları İçin Ortak Alanlar
$_LANG['btk_form_section_title'] = 'BTK Bilgileri';
$_LANG['btk_nationality'] = 'Uyruk';
$_LANG['btk_select_nationality'] = 'Uyruk Seçiniz';
$_LANG['btk_father_name'] = 'Baba Adı';
$_LANG['btk_mother_name'] = 'Anne Adı';
$_LANG['btk_mother_maiden_name'] = 'Anne Kızlık Soyadı';
$_LANG['btk_birth_place'] = 'Doğum Yeri';
$_LANG['btk_birth_date'] = 'Doğum Tarihi';
$_LANG['btk_profession_code'] = 'Meslek Kodu';
$_LANG['btk_select_profession'] = 'Meslek Seçiniz (Arayınız)';
$_LANG['btk_id_card_volume_no'] = 'Kimlik Cilt No';
$_LANG['btk_id_card_family_serial_no'] = 'Kimlik Kütük (Aile Sıra) No';
$_LANG['btk_id_card_sequence_no'] = 'Kimlik Sıra (Sayfa) No';
$_LANG['btk_id_card_province'] = 'Kimlik Kayıtlı Olduğu İl';
$_LANG['btk_id_card_district'] = 'Kimlik Kayıtlı Olduğu İlçe';
$_LANG['btk_id_card_village'] = 'Kimlik Kayıtlı Olduğu Mahalle/Köy';
$_LANG['btk_id_card_type'] = 'Kimlik Tipi';
$_LANG['btk_select_id_card_type'] = 'Kimlik Tipi Seçiniz';
$_LANG['btk_id_card_serial_no'] = 'Kimlik Seri No';
$_LANG['btk_id_card_issue_place'] = 'Kimlik Verildiği Yer';
$_LANG['btk_id_card_issue_date'] = 'Kimlik Veriliş Tarihi';
$_LANG['btk_id_card_owner_relation'] = 'Kimlik Aidiyeti';
$_LANG['btk_select_id_card_owner_relation'] = 'Kimlik Aidiyeti Seçiniz';
$_LANG['btk_service_address_same_as_residential'] = 'Hizmet (Tesis) Adresi Yerleşim Adresi ile Aynı';
$_LANG['btk_address_province'] = 'İl';
$_LANG['btk_address_district'] = 'İlçe';
$_LANG['btk_address_neighbourhood'] = 'Mahalle/Köy';
$_LANG['btk_address_street_avenue'] = 'Cadde/Sokak/Bulvar';
$_LANG['btk_address_building_no'] = 'Dış Kapı No';
$_LANG['btk_address_apartment_no'] = 'İç Kapı No';
$_LANG['btk_address_postal_code'] = 'Posta Kodu';
$_LANG['btk_address_uavt_code'] = 'Adres Kodu (UAVT)';
$_LANG['btk_address_residential_title'] = 'Yerleşim Adresi Bilgileri';
$_LANG['btk_address_service_title'] = 'Hizmet (Tesis) Adresi Bilgileri';
$_LANG['btk_contact_phone1'] = 'İrtibat Telefonu 1';
$_LANG['btk_contact_phone2'] = 'İrtibat Telefonu 2';
$_LANG['btk_service_type'] = 'Hizmet Tipi (BTK)';
$_LANG['btk_select_service_type'] = 'Hizmet Tipi Seçiniz';
$_LANG['btk_line_status_btk'] = 'Hat Durumu (BTK)';
$_LANG['btk_select_line_status'] = 'Hat Durumu Seçiniz';
$_LANG['btk_line_status_code_btk'] = 'Hat Durum Kodu (BTK)';
$_LANG['btk_select_line_status_code'] = 'Hat Durum Kodu Seçiniz';
$_LANG['btk_line_status_code_desc_btk'] = 'Hat Durum Kodu Açıklaması';
$_LANG['btk_tariff_name'] = 'Tarife Adı';
$_LANG['btk_static_ip_address'] = 'Statik IP Adresi';
$_LANG['btk_iss_speed_profile'] = 'ISS Hız Profili';
$_LANG['btk_iss_username'] = 'ISS Kullanıcı Adı';
$_LANG['btk_iss_pop_info'] = 'ISS POP Bilgisi (Sunucu.SSID)';
$_LANG['btk_iss_pop_select_ssid'] = 'POP Noktası (SSID) Seçin';
$_LANG['btk_corporate_authorized_name'] = 'Kurum Yetkilisi Adı';
$_LANG['btk_corporate_authorized_surname'] = 'Kurum Yetkilisi Soyadı';
$_LANG['btk_corporate_authorized_tckn'] = 'Kurum Yetkilisi TCKN';
$_LANG['btk_corporate_authorized_phone'] = 'Kurum Yetkilisi Telefon';
$_LANG['btk_corporate_address'] = 'Kurum Adresi';
$_LANG['btk_activation_dealer_name'] = 'Aktivasyon Bayi Adı';
$_LANG['btk_activation_dealer_address'] = 'Aktivasyon Bayi Adresi';
$_LANG['btk_activation_user'] = 'Aktivasyon Kullanıcısı';
$_LANG['btk_updating_dealer_name'] = 'Güncelleyen Bayi Adı';
$_LANG['btk_updating_dealer_address'] = 'Güncelleyen Bayi Adresi';
$_LANG['btk_updating_user'] = 'Güncelleyen Kullanıcı';

// Operasyonel Alanlar (BTK Raporlarında Yok, Hizmet Detayları İçin)
$_LANG['btk_operational_info_title'] = 'Operasyonel Hizmet Bilgileri';
$_LANG['btk_family_filter_active'] = 'Aile Filtresi Aktif';
$_LANG['btk_mac_addresses'] = 'MAC Adres(ler)i';
$_LANG['btk_mac_addresses_desc'] = 'Birden fazla ise noktalı virgül (;) ile ayırınız.';
$_LANG['btk_device_serial_no'] = 'Cihaz Seri No(lar)ı';
$_LANG['btk_device_serial_no_desc'] = 'Birden fazla ise noktalı virgül (;) ile ayırınız.';
$_LANG['btk_wifi_password'] = 'WiFi Şifresi';
$_LANG['btk_wifi_password_desc'] = 'Müşterinin WiFi ağ şifresi (Güvenlik nedeniyle dikkatli kullanın).';
$_LANG['btk_installation_notes'] = 'Kurulum Notları';
$_LANG['btk_device_type'] = 'Cihaz Türü';
$_LANG['btk_device_type_indoor'] = 'INDOOR (İç Mekan)';
$_LANG['btk_device_type_outdoor'] = 'OUTDOOR (Dış Mekan)';
$_LANG['btk_device_type_other'] = 'DİĞER';
$_LANG['btk_device_model'] = 'Cihaz Modeli';
$_LANG['btk_installation_signal_quality'] = 'Kurulum Sinyal Kalitesi';
$_LANG['btk_facility_coordinates'] = 'Tesis Koordinatları (Enlem,Boylam)';
$_LANG['btk_facility_coordinates_desc'] = 'Teknik destek için harita üzerinde göstermeye yarar.';
$_LANG['btk_get_coordinates_from_address'] = 'Adresten Koordinatları Al';
$_LANG['btk_show_on_map'] = 'Haritada Göster';
$_LANG['btk_send_location_to_personnel'] = 'Konumu Personele E-posta Gönder';
$_LANG['btk_select_personnel_for_location'] = 'Görev Atanacak Personeli Seçin:';
$_LANG['btk_location_email_sent_successfully'] = 'Konum bilgisi personele başarıyla e-posta ile gönderildi.';
$_LANG['btk_location_email_send_failed'] = 'Konum bilgisi gönderilirken hata oluştu.';

// Hata Mesajları (Daha spesifik)
$_LANG['btk_error_invalid_tckn'] = 'Geçersiz T.C. Kimlik Numarası.';
$_LANG['btk_error_nvi_validation_failed'] = 'NVI doğrulaması başarısız oldu: ';
$_LANG['btk_error_invalid_ykn'] = 'Geçersiz Yabancı Kimlik Numarası.';
$_LANG['btk_error_mac_address_format'] = 'MAC adresi formatı geçersiz. (Örn: XX:XX:XX:XX:XX:XX veya XX-XX-XX-XX-XX-XX)';
$_LANG['btk_error_file_not_found_for_resend'] = 'Yeniden göndermek için belirtilen dosya Yedek FTP\'de bulunamadı.';
$_LANG['btk_error_could_not_create_temp_dir'] = 'Geçici rapor klasörü oluşturulamadı.';
$_LANG['btk_error_could_not_create_report_file'] = 'Rapor dosyası oluşturulamadı.';
$_LANG['btk_error_could_not_compress_file'] = 'Dosya sıkıştırılamadı.';
$_LANG['btk_error_personnel_not_found_for_email'] = 'E-posta gönderilecek personel bulunamadı veya e-posta adresi eksik.';

return $_LANG;