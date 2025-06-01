<?php
/**
 * WHMCS BTK Raporlama Modülü - Türkçe Dil Dosyası - V2.0.1 - Kararlı Sürüm Adayı
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// Genel Modül İsimleri ve Açıklamaları (btkreports_config() fonksiyonunda da kullanılır)
$_LANG['btkaddonmodulename'] = 'BTK Raporlama Modülü';
$_LANG['btkaddonmoduledesc'] = 'BTK için Abone Rehber, Abone Hareket ve Personel Listesi raporlarını oluşturur ve yönetir.';

// Admin Arayüzü Genel Metinleri
$_LANG['btk_main_title'] = 'BTK Raporlama Modülü';
$_LANG['btk_dashboard_title'] = 'Kontrol Paneli';
$_LANG['btk_settings_title'] = 'Modül Ayarları';
$_LANG['btk_personnel_management_title'] = 'Personel Yönetimi';
$_LANG['btk_product_group_mapping_title'] = 'Ürün Grubu - BTK Yetki & Hizmet Tipi Eşleştirme';
$_LANG['btk_generate_reports_title'] = 'Manuel Rapor Oluştur';
$_LANG['btk_view_logs_title'] = 'İşlem Logları';
$_LANG['btk_save_changes'] = 'Değişiklikleri Kaydet';
$_LANG['btk_cancel'] = 'İptal';
$_LANG['btk_submit'] = 'Gönder';
$_LANG['btk_edit'] = 'Düzenle';
$_LANG['btk_delete'] = 'Sil';
$_LANG['btk_add_new'] = 'Yeni Ekle';
$_LANG['btk_confirm_password_title'] = 'Şifre Onayı';
$_LANG['btk_password_confirmation_required'] = 'Bu bölüme güvenli erişim için lütfen WHMCS admin şifrenizi tekrar girin.';
$_LANG['btk_password_confirmation_timed_out'] = 'Güvenlik nedeniyle şifre onayınız zaman aşımına uğradı. Lütfen tekrar onaylayın.';
$_LANG['btk_incorrect_password'] = 'Girilen şifre yanlış. Lütfen tekrar deneyin.';
$_LANG['btk_error_occurred'] = 'Bir hata oluştu:';
$_LANG['btk_success_message'] = 'İşlem başarıyla tamamlandı.';
$_LANG['btk_info_message'] = 'Bilgilendirme';
$_LANG['btk_pleaseselectone'] = 'Lütfen Seçiniz...';
$_LANG['btk_loading'] = 'Yükleniyor...';
$_LANG['btk_noresultsfound'] = 'Sonuç bulunamadı';
$_LANG['btk_error'] = 'Hata!';
$_LANG['btk_pleaseselectilfirst'] = 'Önce İl Seçin';
$_LANG['btk_go_back'] = 'Geri Dön';
$_LANG['btk_yes'] = 'Evet';
$_LANG['btk_no'] = 'Hayır';


// Ayarlar Sayfası (config.tpl)
$_LANG['btk_tab_general_settings'] = 'Genel Ayarlar';
$_LANG['btk_tab_ftp_settings'] = 'FTP Ayarları';
$_LANG['btk_tab_backup_ftp_settings'] = 'Yedek FTP Ayarları';
$_LANG['btk_tab_cron_settings'] = 'Cron Zamanlama';
$_LANG['btk_tab_yetki_tanimlari'] = 'Yetki Türleri';
$_LANG['btk_tab_product_group_mappings_menu'] = 'Ürün Grubu Eşleştirme';
$_LANG['btk_tab_other_settings'] = 'Diğer Ayarlar';

$_LANG['btk_operator_info_title'] = 'Operatör Bilgileri';
$_LANG['btk_operator_code'] = 'Operatör Kodu';
$_LANG['btk_tooltip_operator_code'] = 'BTK tarafından verilen 3 haneli sabit kod.';
$_LANG['btk_operator_name'] = 'Operatör Adı (Dosya Adı İçin)';
$_LANG['btk_tooltip_operator_name'] = 'Dosya adlarında kullanılacak, boşluksuz, Türkçe karakter içermeyen kısa ad (örn: XYZTELEKOM).';
$_LANG['btk_operator_unvani'] = 'Operatör Tam Ticari Unvanı';
$_LANG['btk_tooltip_operator_unvani'] = 'Personel raporu gibi resmi belgelerde kullanılacak tam ticari unvan.';
$_LANG['btk_default_rapor_yetki_tipi'] = 'Varsayılan Rapor Yetki Tipi';
$_LANG['btk_tooltip_default_rapor_yetki_tipi'] = 'Eğer bir WHMCS ürün grubu herhangi bir BTK Yetki Türü ile eşleştirilmemişse veya ürünün hizmet detaylarında özel bir Yetki Tipi belirtilmemişse, o gruptaki hizmetler için varsayılan olarak kullanılacak BTK dosya tipi kodu (örn: ISS, AIH).';


$_LANG['btk_main_ftp_settings_title'] = 'Ana BTK FTP Sunucu Ayarları';
$_LANG['btk_ftp_host'] = 'FTP Sunucu Adresi';
$_LANG['btk_ftp_username'] = 'FTP Kullanıcı Adı';
$_LANG['btk_ftp_password'] = 'FTP Şifre';
$_LANG['btk_ftp_password_placeholder_new'] = 'FTP Şifresi';
$_LANG['btk_ftp_password_placeholder_exists'] = 'Değiştirmek için yeni şifre girin';
$_LANG['btk_ftp_port'] = 'FTP Port';
$_LANG['btk_use_passive_ftp'] = 'Pasif Mod FTP';
$_LANG['btk_ftp_active'] = 'Aktif';
$_LANG['btk_ftp_rehber_path'] = 'Abone Rehber Yolu';
$_LANG['btk_ftp_hareket_path'] = 'Abone Hareket Yolu';
$_LANG['btk_personel_ftp_path'] = 'Personel Listesi Yolu';
$_LANG['btk_ftp_path_placeholder'] = 'Örn: /REHBER/';
$_LANG['btk_ftp_path_help'] = 'FTP yolları genellikle BTK tarafından belirtildiği gibi /abone/REHBER/ veya /abone/HAREKET/ şeklinde olabilir. Personel için /PERSONEL/ olabilir. Lütfen BTK\'dan teyit ediniz.';

$_LANG['btk_backup_ftp_settings_title'] = 'Yedek FTP Sunucu Ayarları';
$_LANG['btk_use_yedek_ftp'] = 'Yedek FTP Kullan';
$_LANG['btk_yedek_ftp_host'] = 'Yedek FTP Sunucu';
$_LANG['btk_yedek_ftp_username'] = 'Yedek FTP Kullanıcı';
$_LANG['btk_yedek_ftp_password'] = 'Yedek FTP Şifre';
$_LANG['btk_yedek_ftp_port'] = 'Yedek FTP Port';
$_LANG['btk_use_passive_yedek_ftp'] = 'Yedek Pasif Mod FTP';
$_LANG['btk_yedek_ftp_rehber_path'] = 'Yedek Abone Rehber Yolu';
$_LANG['btk_yedek_ftp_hareket_path'] = 'Yedek Abone Hareket Yolu';
$_LANG['btk_yedek_personel_ftp_path'] = 'Yedek Personel Listesi Yolu';

$_LANG['btk_cron_settings_title'] = 'Otomatik Rapor Gönderim Zamanlamaları';
$_LANG['btk_tooltip_cron'] = 'Standart cron formatı kullanın. Örneğin: "dakika saat gün ay günadı". Örnekler: "0 2 1 * *" (Her ayın 1\'i 02:00), "0 1 * * *" (Her gün 01:00), "0 3 L 6 *" (Haziran ayının son günü 03:00).';
$_LANG['btk_rehber_cron_schedule'] = 'Abone Rehber Raporu Zamanı';
$_LANG['btk_hareket_cron_schedule'] = 'Abone Hareket Raporu Zamanı';
$_LANG['btk_personel_cron_schedule_haziran'] = 'Personel Raporu (Haziran Dönemi)';
$_LANG['btk_personel_cron_schedule_aralik'] = 'Personel Raporu (Aralık Dönemi)';
$_LANG['btk_hareket_arsivleme_periyodu_ay'] = 'Hareket Log Arşivleme Periyodu (Ay)';
$_LANG['btk_hareket_arsivleme_periyodu_ay_desc'] = 'Raporlanmış hareketlerin kaç ay sonra `mod_btk_abone_hareketler_arsiv` tablosuna taşınacağını belirtir. 0 girilirse arşivleme yapılmaz.';
$_LANG['btk_whmcs_cron_info'] = '<strong>WHMCS Cron Kurulumu:</strong> Bu zamanlamaların çalışması için WHMCS sistem cronunun sunucunuzda doğru bir şekilde kurulmuş olması gerekmektedir. Genellikle her 5 dakikada bir çalışacak şekilde ayarlanır.';

$_LANG['btk_yetki_tanimlari_title'] = 'BTK Yetki Türü Tanımları';
$_LANG['btk_yetki_tanimlari_desc'] = 'İşletmenizin sahip olduğu ve raporlama yapacağı BTK yetki türlerini burada tanımlayabilirsiniz. Bu tanımlar, ürün gruplarınızla eşleştirilerek hangi hizmetin hangi yetki tipi altında raporlanacağını belirler.';
$_LANG['btk_yetki_kullanici_adi'] = 'Yetki Adı (Açıklayıcı)';
$_LANG['btk_yetki_kullanici_kodu'] = 'Yetki Kısa Kodu (Eşsiz)';
$_LANG['btk_btk_dosya_tip_kodu'] = 'BTK Dosya Tipi Kodu';
$_LANG['btk_aktif_mi'] = 'Aktif mi?';
$_LANG['btk_bos_dosya_gonder'] = 'Boş Dosya Gönder?';
$_LANG['btk_actions'] = 'İşlemler';
$_LANG['btk_edit_yetki_turu'] = 'Yetki Türünü Düzenle';
$_LANG['btk_add_new_yetki_turu'] = 'Yeni Yetki Türü Ekle';
$_LANG['btk_confirm_delete_yetki'] = 'Bu yetki türünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve bu yetki türüyle eşleşen ürün grubu bağlantıları kopacaktır.';
$_LANG['btk_yetki_kodu_dosya_tipi_aciklama'] = 'BTK\'nın belirlediği dosya tipi kodları (ISS, AIH, STH, GSM, UYDU, MOBIL, TT).';

$_LANG['btk_other_settings_title'] = 'Çeşitli Ayarlar';
$_LANG['btk_password_confirm_timeout'] = 'Şifre Onay Zaman Aşımı (Dakika)';
$_LANG['btk_password_confirm_timeout_desc'] = 'Modülün hassas bölümlerine erişim için girilen şifrenin ne kadar süreyle geçerli olacağı.';
$_LANG['btk_delete_tables_on_deactivate'] = 'Modül Devre Dışı Bırakılınca Tabloları Sil';
$_LANG['btk_delete_tables_on_deactivate_desc'] = 'Evet, modül devre dışı bırakıldığında tüm BTK veritabanı tablolarını sil.';
$_LANG['btk_delete_tables_warning'] = '<strong>DİKKAT:</strong> Bu seçenek işaretliyse, modülü devre dışı bıraktığınızda tüm BTK verileriniz kalıcı olarak silinecektir!';

// Ürün Grubu Eşleştirme Sayfası (product_group_mappings.tpl)
$_LANG['btk_product_group_mapping_desc'] = 'Bu sayfada, WHMCS ürün gruplarınızı, BTK raporlaması için kullanılacak varsayılan "BTK Yetki Türü" ve "BTK Hizmet Tipi (EK-3)" ile eşleştirebilirsiniz. Bir ürün grubuna yapılan atama, o gruptaki tüm ürünler için varsayılan olacaktır. Bu ayarlar, her bir hizmetin kendi detay sayfasından ayrıca özelleştirilebilir.';
$_LANG['btk_product_mapping_note'] = "Bir ürün grubu için Yetki Türü veya Hizmet Tipi seçilmezse (Boş Bırak/Varsayılan), o gruptaki hizmetlerin BTK ayarları ya Modül Ayarları'ndaki varsayılanlardan ya da manuel olarak hizmet detay sayfasından girilen bilgilerden alınacaktır.";
$_LANG['btk_product_group_name'] = "WHMCS Ürün Grubu";
$_LANG['btk_product_map_default_option'] = "-- Varsayılanı Kullan --";
$_LANG['btk_no_product_groups_found'] = "WHMCS'te tanımlı ürün grubu bulunmamaktadır.";
$_LANG['btk_save_mappings'] = "Eşleştirmeleri Kaydet";
$_LANG['btk_tooltip_product_map_yetki'] = 'Bu ürün grubundaki hizmetlerin varsayılan olarak hangi BTK Yetki Türü (Dosya Kodu) altında raporlanacağını seçin.';
$_LANG['btk_tooltip_product_map_hizmet'] = 'Bu ürün grubundaki hizmetler için varsayılan BTK Hizmet Tipi (EK-3 Kodu) seçin.';


// Müşteri ve Hizmet Formları
$_LANG['btk_musteri_btk_bilgileri_title'] = 'Müşteriye Ait BTK Bilgileri (Genel)';
$_LANG['btk_musteri_btk_bilgileri_desc'] = 'Burada girilen bilgiler, müşterinin tüm hizmetleri için varsayılan BTK verileri olarak kullanılabilir ve hizmet bazında ayrıca düzenlenebilir.';
$_LANG['btk_hizmet_btk_bilgileri_title'] = 'Hizmete Özel BTK ve Operasyonel Bilgiler';
$_LANG['btk_tab_temel_hizmet'] = 'Temel Hizmet';
$_LANG['btk_tab_abone_kimlik'] = 'Abone Kimlik';
$_LANG['btk_tab_tesis_adresi'] = 'Tesis Adresi';
$_LANG['btk_tab_yetki_ozel'] = 'Yetki Özel';
$_LANG['btk_tab_operasyonel'] = 'Operasyonel';
$_LANG['btk_tab_bayi'] = 'Bayi';

$_LANG['btk_hat_no'] = 'Hat Numarası / Tanımlayıcı';
$_LANG['btk_tooltip_hat_no'] = 'Hizmete ait BTK tarafından istenen numara veya tanımlayıcı (DSL No, IP, Alan Adı vb.).';
$_LANG['btk_hizmet_tipi_ek3'] = 'Hizmet Tipi (BTK EK-3)';
$_LANG['btk_tooltip_hizmet_tipi_ek3'] = 'BTK EK-3\'te tanımlanan hizmet türünü seçiniz.';
$_LANG['btk_rapor_yetki_tipi'] = 'Raporlanacak BTK Yetki Tipi';
$_LANG['btk_tooltip_rapor_yetki_tipi'] = 'Bu hizmetin hangi BTK yetki tipi (ISS, AIH vb.) altında raporlanacağını seçiniz. Bu seçim, ürün grubuyla eşleştirilmiş yetki türünü geçersiz kılar.';
$_LANG['btk_abone_tarife'] = 'Abone Tarife Adı';
$_LANG['btk_tooltip_tarife'] = 'Hizmetin tarife adını giriniz.';
$_LANG['btk_statik_ip'] = 'Statik IP Adresi';
$_LANG['btk_btk_onay_durumu'] = 'BTK Onay Durumu';
$_LANG['btk_onay_durumu_onaybekliyor'] = 'Onay Bekliyor';
$_LANG['btk_onay_durumu_onaylandi'] = 'Onaylandı (Aktif)';
$_LANG['btk_onay_durumu_reddedildi'] = 'Reddedildi';
$_LANG['btk_onay_durumu_verigiristamamlanmadi'] = 'Veri Girişi Tamamlanmadı';
$_LANG['btk_btn_complete_and_accept_order'] = 'BTK Kaydını Tamamla ve Siparişi Onayla';

$_LANG['btk_musteri_tipi'] = 'Müşteri Tipi';
$_LANG['btk_tooltip_musteri_tipi'] = 'Müşterinin BTK sistemindeki tipini seçiniz.';
$_LANG['btk_abone_unvan'] = 'Ticari Unvan (Kurumsal ise)';
$_LANG['btk_abone_tc_kimlik_no'] = 'T.C. Kimlik No';
$_LANG['btk_tooltip_tckn'] = 'Bireysel abone ise T.C. Kimlik Numarası. NVI ile doğrulanacaktır.';
$_LANG['btk_abone_pasaport_no'] = 'Yabancı Kimlik No / Pasaport No';
$_LANG['btk_tooltip_pasaport'] = 'Yabancı uyruklu ise Pasaport No veya Yabancı Kimlik No.';
$_LANG['btk_abone_dogum_tarihi_display'] = 'Doğum Tarihi (GG.AA.YYYY)';
$_LANG['btk_abone_uyruk'] = 'Uyruk';
$_LANG['btk_tooltip_uyruk'] = 'Abone uyruğu (ISO 3166-1 alpha-3 kodu, örn: TUR).';
$_LANG['btk_nvi_dogrula'] = 'NVI Doğrula';
$_LANG['btk_nvi_durum'] = 'NVI Durumu';

$_LANG['btk_yerlesim_adresi_title'] = 'Müşteri Yerleşim Adresi (İkametgah/Fatura)';
$_LANG['btk_tesis_adresi_title'] = 'Hizmet Tesis Adresi (Kurulum Adresi)';
$_LANG['btk_yerlesim_adresi_ayni_label'] = 'Tesis Adresi, yukarıdaki Müşteri Yerleşim Adresi ile aynı.';
$_LANG['btk_il'] = 'İl';
$_LANG['btk_ilce'] = 'İlçe';
$_LANG['btk_mahalle_koy'] = 'Mahalle/Köy';
$_LANG['btk_cadde_sokak'] = 'Cadde/Sokak/Bulvar/Meydan';
$_LANG['btk_dis_kapi_no'] = 'Dış Kapı No';
$_LANG['btk_ic_kapi_no'] = 'İç Kapı No';
$_LANG['btk_posta_kodu'] = 'Posta Kodu';
$_LANG['btk_uavt_adres_kodu'] = 'UAVT Adres Kodu';
$_LANG['btk_uavt_yerlesim_yeri_no'] = 'UAVT Yerleşim Yeri No';

// Personel Yönetimi
$_LANG['btk_personel_sync_confirm'] = 'WHMCS admin kullanıcıları ile personel listenizi senkronize etmek istediğinizden emin misiniz? Bu işlem mevcut BTK personel bilgilerini koruyarak sadece WHMCS\'ten gelen Ad, Soyad ve Email alanlarını güncelleyecektir.';
$_LANG['btk_personel_sync_button'] = 'WHMCS Adminlerini Personel Listesiyle Senkronize Et';
$_LANG['btk_personel_page_desc'] = 'Bu sayfada, BTK\'ya bildirilecek personel listenizi yönetebilirsiniz. BTK\'ya gönderilecek personel raporu, "BTK Listesine Eklensin" durumu işaretli olan ve "İşten Ayrılma Tarihi" boş olan veya bugünden sonraki bir tarih olan personeli içerecektir.';
$_LANG['btk_personel_list_update_bulk'] = 'Seçili "BTK Listesine Ekle" Durumlarını Güncelle';
$_LANG['btk_personel_modal_title'] = 'Personel Bilgilerini Düzenle';
$_LANG['btk_personel_temel_bilgiler'] = 'Temel Bilgiler (WHMCS\'ten Senkronize)';
$_LANG['btk_personel_btk_zorunlu'] = 'BTK Raporu İçin Zorunlu Bilgiler';
$_LANG['btk_personel_ik_opsiyonel'] = 'İnsan Kaynakları (İK) Bilgileri (Opsiyonel)';
$_LANG['btk_personel_gorev_unvan'] = 'Görevi / Ünvanı';
$_LANG['btk_personel_calistigi_birim'] = 'Çalıştığı Birim';
$_LANG['btk_personel_mobil_tel'] = 'Mobil Telefonu';
$_LANG['btk_personel_sabit_tel'] = 'Sabit Telefonu';
$_LANG['btk_personel_dogum_yili_nvi'] = 'Doğum Yılı (NVI Doğrulama için)';
$_LANG['btk_personel_ise_baslama'] = 'İşe Başlama Tarihi';
$_LANG['btk_personel_isten_ayrilma'] = 'İşten Ayrılma Tarihi';
$_LANG['btk_personel_isten_ayrilma_desc'] = 'Bu tarih doluysa, personel BTK raporuna dahil edilmez.';
$_LANG['btk_personel_is_birakma_nedeni'] = 'İş Bırakma Nedeni';
$_LANG['btk_personel_ev_adresi'] = 'Ev Adresi';
$_LANG['btk_personel_acil_durum_kisi'] = 'Acil Durumda Aranacak Kişi ve İletişim';
$_LANG['btk_personel_btk_listesine_ekle_label'] = 'Bu personeli BTK Rapor Listesine Dahil Et';
$_LANG['btk_tooltip_tckn_personel'] = 'Personelin T.C. Kimlik Numarası. NVI ile doğrulanacaktır.';


// Manuel Rapor Oluşturma
$_LANG['btk_manual_report_page_title'] = 'Manuel Rapor Oluşturma ve Gönderme';
$_LANG['btk_manual_report_page_desc'] = 'Bu bölümden istediğiniz rapor türünü seçerek manuel olarak oluşturabilir ve BTK FTP sunucusuna (ve yapılandırılmışsa yedek FTP\'ye) gönderebilirsiniz. Bu işlem, cron zamanlamasını beklemeden anlık raporlama yapmanızı sağlar.';
$_LANG['btk_manual_report_warning'] = 'Lütfen dikkat: Manuel rapor oluşturma işlemi, özellikle çok sayıda abone veya hareket verisi varsa sunucunuzda ek yük oluşturabilir ve zaman alabilir.';
$_LANG['btk_report_type'] = 'Rapor Türü';
$_LANG['btk_report_type_rehber'] = 'Abone Rehber Raporu';
$_LANG['btk_report_type_hareket'] = 'Abone Hareket Raporu';
$_LANG['btk_report_type_personel'] = 'Personel Listesi Raporu';
$_LANG['btk_yetki_tipi_for_report'] = 'Yetki Tipi (Rapor için)';
$_LANG['btk_yetki_tipi_for_report_all'] = 'Tüm Aktif Yetki Tipleri İçin Oluştur';
$_LANG['btk_yetki_tipi_for_report_desc'] = 'Sadece Abone Rehber ve Abone Hareket raporları için geçerlidir. "Tüm Aktif Yetki Tipleri İçin Oluştur" seçilirse, ayarlı ve aktif olan her yetki için ayrı dosya oluşturulur. Personel Listesi için bu alan dikkate alınmaz.';
$_LANG['btk_btn_generate_and_send_report'] = 'Raporu Oluştur ve Gönder';
$_LANG['btk_confirm_manual_report'] = 'Seçili rapor(lar)ı şimdi oluşturup FTP\'ye göndermek istediğinizden emin misiniz? Bu işlem biraz zaman alabilir.';

// Log Görüntüleme
$_LANG['btk_logs_page_title'] = 'Modül İşlem Logları';
$_LANG['btk_logs_page_desc'] = 'Bu sayfada, BTK Raporlama modülünün gerçekleştirdiği önemli işlemleri ve olası hataları takip edebilirsiniz.';
$_LANG['btk_log_time'] = 'Zaman';
$_LANG['btk_log_type'] = 'Log Tipi';
$_LANG['btk_log_description'] = 'Açıklama';
$_LANG['btk_log_admin_id'] = 'Admin ID';
$_LANG['btk_log_client_id'] = 'Müşteri ID';
$_LANG['btk_log_service_id'] = 'Hizmet ID';
$_LANG['btk_log_ip_address'] = 'IP Adresi';
$_LANG['btk_no_logs_found'] = 'Görüntülenecek log kaydı bulunmamaktadır.';


// Modül Ana Sayfası (index.tpl)
$_LANG['btk_dashboard_welcome'] = 'BTK Raporlama Modülü Kontrol Paneli';
$_LANG['btk_dashboard_desc'] = 'Bu arayüz üzerinden BTK raporlama süreçlerinizi yönetebilir, ayarlarınızı yapılandırabilir ve oluşturulan raporları takip edebilirsiniz.';
$_LANG['btk_version'] = 'Versiyon';
$_LANG['btk_last_cron_run'] = 'Son Cron Çalışması';
$_LANG['btk_cron_not_run_yet'] = 'Cron henüz çalışmamış veya loglanmamış.';
$_LANG['btk_last_generated_reports_title'] = 'Son Oluşturulan Rapor Dosyaları (En Fazla 10)';
$_LANG['btk_filename'] = 'Dosya Adı';
$_LANG['btk_file_type'] = 'Dosya Tipi';
$_LANG['btk_yetki_type_short'] = 'Yetki Tipi';
$_LANG['btk_creation_time'] = 'Oluşturulma Zamanı';
$_LANG['btk_btk_ftp_status'] = 'BTK FTP Durumu';
$_LANG['btk_backup_ftp_status'] = 'Yedek FTP Durumu';
$_LANG['btk_no_reports_generated_yet'] = 'Henüz oluşturulmuş bir rapor dosyası bulunmamaktadır.';
$_LANG['btk_ftp_connection_status_title'] = 'FTP Bağlantı Durumu';
$_LANG['btk_main_btk_ftp_server'] = 'Ana BTK FTP Sunucusu';
$_LANG['btk_backup_ftp_server'] = 'Yedek FTP Sunucusu';
$_LANG['btk_connection_successful'] = 'Bağlantı Başarılı';
$_LANG['btk_connection_failed'] = 'Bağlantı Başarısız';
$_LANG['btk_not_in_use'] = 'Kullanılmıyor';
$_LANG['btk_ftp_settings_not_configured'] = 'FTP ayarları henüz yapılandırılmamış veya test edilemedi.';
$_LANG['btk_configure_settings_link'] = 'Ayarları Yapılandır';
$_LANG['btk_module_info_help_title'] = 'Modül Bilgileri ve Yardım';
$_LANG['btk_module_info_p1'] = 'Bu modül, BTK\'nın yasal zorunlulukları gereği periyodik olarak iletilmesi gereken abone, hareket ve personel bilgilerini raporlamak üzere geliştirilmiştir.';
$_LANG['btk_module_info_li_settings'] = '<strong>Ayarlar:</strong> Modülün çalışması için gerekli operatör, FTP ve zamanlama ayarlarını yapılandırın.';
$_LANG['btk_module_info_li_personnel'] = '<strong>Personel Yönetimi:</strong> BTK\'ya bildirilecek personel listenizi güncel tutun.';
$_LANG['btk_module_info_li_manual_report'] = '<strong>Manuel Rapor Oluşturma:</strong> İhtiyaç duyduğunuzda raporları elle oluşturup FTP\'ye gönderebilirsiniz.';
$_LANG['btk_module_info_li_logs'] = '<strong>İşlem Logları:</strong> Modülün yaptığı tüm işlemleri (rapor oluşturma, FTP yükleme, hatalar vb.) buradan takip edebilirsiniz.';
$_LANG['btk_module_info_docs_link'] = 'Detaylı bilgi ve yardım için modül dokümantasyonuna başvurunuz.';

?>