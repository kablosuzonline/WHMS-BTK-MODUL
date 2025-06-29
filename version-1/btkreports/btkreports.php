<?php
// modules/addons/btkreports/btkreports.php (v1.0.28 - Nihai Düzeltmeler v19 - BTK Desen ve Hata Giderme)

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

use WHMCS\Database\Capsule;

// Libs
if (file_exists(__DIR__ . '/lib/NviSoapClient.php')) {
    require_once __DIR__ . '/lib/NviSoapClient.php';
}
if (file_exists(ROOTDIR . '/vendor/autoload.php')) {
    require_once ROOTDIR . '/vendor/autoload.php';
} elseif (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as XlsxWriter;
use PhpOffice\PhpSpreadsheet\Style\Alignment as PhpSpreadsheetAlignment;
use PhpOffice\PhpSpreadsheet\Style\Border as PhpSpreadsheetBorder;
use PhpOffice\PhpSpreadsheet\Style\Fill as PhpSpreadsheetFill;


global $_ADDONLANG, $CONFIG, $adminUsername, $customadminpath; 

if (isset($_SESSION['adminid']) && (int)$_SESSION['adminid'] > 0) {
    $adminData = Capsule::table('tbladmins')->where('id', (int)$_SESSION['adminid'])->first(['username', 'firstname', 'lastname']);
    if ($adminData) {
        $adminUsername = ($adminData->firstname ?? '') . ' ' . ($adminData->lastname ?? '') . ' (' . ($adminData->username ?? 'N/A') . ')';
    } else {
        $adminUsername = 'AdminID:'.$_SESSION['adminid'];
    }
} else {
    $adminUsername = php_sapi_name() === 'cli' ? 'Cron' : 'System';
}

if (empty($_ADDONLANG) && file_exists(__DIR__ . '/lang/turkish.php')) {
    require_once __DIR__ . '/lang/turkish.php';
}
if (!isset($_ADDONLANG) || !is_array($_ADDONLANG) || empty($_ADDONLANG['btkreports_modulename'])) { 
    $_ADDONLANG = [];
    // Temel dil anahtarları (Bu liste lang/turkish.php dosyanızdaki anahtarlarla tutarlı olmalı)
    $_ADDONLANG['btkreports_modulename'] = 'BTK Abone Veri Raporlama';
    $_ADDONLANG['btkreports_config_save_success'] = 'Ayarlar başarıyla kaydedildi.';
    $_ADDONLANG['btkreports_ftp_status_checking'] = 'FTP durumu kontrol ediliyor...';
    $_ADDONLANG['btkreports_config_operator_code_error_format'] = 'Operatör kodu 3 haneli bir sayı olmalıdır!';
    $_ADDONLANG['btkreports_config_operator_code_error_required'] = 'Operatör kodu boş bırakılamaz!';
    $_ADDONLANG['btkreports_config_ftp_host_error_required'] = 'FTP Sunucu Adresi boş bırakılamaz!';
    $_ADDONLANG['btkreports_config_ftp_username_error_required'] = 'FTP Kullanıcı Adı boş bırakılamaz!';
    $_ADDONLANG['btkreports_ftp_test_fail'] = 'FTP Bağlantı Hatası:';
    $_ADDONLANG['btkreports_ftp_error_connect'] = 'Sunucuya bağlanılamadı.';
    $_ADDONLANG['btkreports_ftp_error_login'] = 'Kullanıcı adı veya şifre hatalı.';
    $_ADDONLANG['btkreports_ftp_test_success'] = 'FTP bağlantısı başarılı!';
    $_ADDONLANG['btkreports_ftp_test_upload_success'] = 'Test dosyası başarıyla yüklendi ve silindi.';
    $_ADDONLANG['btkreports_ftp_test_upload_fail'] = 'Ancak test dosyası yüklenemedi/silinemedi. Yazma izinlerini veya yolun doğruluğunu kontrol edin.';
    $_ADDONLANG['btkreports_ftp_test_upload_warn_delete'] = "Test dosyası yüklendi ancak silinemedi.";
    $_ADDONLANG['btkreports_ftp_test_error_temp_file'] = 'Geçici test dosyası oluşturulamadı.';
    $_ADDONLANG['btkreports_config_ftp_error_hostuser'] = 'FTP Host ve Kullanıcı Adı boş olamaz.';
    $_ADDONLANG['btkreports_ftp_status_active'] = 'AKTİF';
    $_ADDONLANG['btkreports_ftp_status_passive'] = 'PASİF';
    $_ADDONLANG['btkreports_ftp_status_not_configured'] = 'PASİF (Ayarlanmadı)';
    $_ADDONLANG['btkreports_ftp_status_passive_error'] = 'PASİF (Bağlantı Hatası)';
    $_ADDONLANG['btkreports_ftp_error_unknown'] = 'Bilinmeyen bir FTP yanıtı alındı.';
    $_ADDONLANG['btkreports_ftp_test_fail_ajax'] = 'FTP testinde AJAX hatası:';
    $_ADDONLANG['btkreports_tab_home'] = 'Ana Sayfa';
    $_ADDONLANG['btkreports_tab_settings'] = 'Ayarlar';
    $_ADDONLANG['btkreports_tab_product_mappings'] = 'Ürün Eşleştirme';
    $_ADDONLANG['btkreports_tab_generate_report'] = 'Rapor Oluştur';
    $_ADDONLANG['btkreports_tab_personnel'] = 'Personel Yönetimi';
    $_ADDONLANG['btkreports_tab_logs'] = 'Loglar';
    $_ADDONLANG['btkreports_dashboard_title'] = 'Modül Paneli';
    $_ADDONLANG['btkreports_welcome_desc'] = 'BTK Abone Veri Raporlama modülüne hoş geldiniz. Lütfen yukarıdaki sekmelerden veya aşağıdaki hızlı bağlantılardan istediğiniz işlemi seçin.';
    $_ADDONLANG['btkreports_module_status_title'] = 'Modül Durumu';
    $_ADDONLANG['btkreports_operator_name'] = 'Operatör Adı';
    $_ADDONLANG['btkreports_operator_code'] = 'Operatör Kodu';
    $_ADDONLANG['btkreports_operator_unvani_short'] = 'Operatör Unvanı';
    $_ADDONLANG['btkreports_active_auth_types'] = 'Aktif Yetkilendirme Türleri';
    $_ADDONLANG['btkreports_not_configured'] = 'Ayarlanmadı';
    $_ADDONLANG['btkreports_ftp_host_label'] = 'FTP Sunucusu';
    $_ADDONLANG['btkreports_quick_links_title'] = 'Hızlı Bağlantılar';
    $_ADDONLANG['btkreports_link_config'] = 'Genel Ayarlar';
    $_ADDONLANG['btkreports_link_product_mappings'] = 'Ürün Eşleştirme';
    $_ADDONLANG['btkreports_link_generate'] = 'Manuel Rapor Oluştur';
    $_ADDONLANG['btkreports_link_personnel'] = 'Personel Yönetimi';
    $_ADDONLANG['btkreports_link_logs'] = 'Logları Görüntüle';
    $_ADDONLANG['btkreports_footer_text'] = 'BTK Raporlama Modülü';
    $_ADDONLANG['btkreports_module_version'] = 'Versiyon';
    $_ADDONLANG['btkreports_link_readme_desc'] = 'Modül Kullanım Kılavuzu ve Güncelleme Notları';
    $_ADDONLANG['btkreports_link_readme'] = 'Yardım';
    $_ADDONLANG['btkreports_config_general_settings'] = 'Genel İşletmeci Bilgileri';
    $_ADDONLANG['btkreports_config_operator_name_label'] = 'İşletmeci Adı (Raporlarda Görünecek)';
    $_ADDONLANG['btkreports_config_operator_name_placeholder'] = 'Örn: ABC Telekomünikasyon A.Ş.';
    $_ADDONLANG['btkreports_config_operator_name_desc'] = 'BTK raporlarında OPERATOR_ADI olarak kullanılacak resmi işletmeci adı.';
    $_ADDONLANG['btkreports_config_operator_code_desc'] = 'BTK tarafından size atanan 3 haneli sayısal operatör kodu.';
    $_ADDONLANG['btkreports_config_operator_unvani_label'] = 'Operatör Ticari Unvanı';
    $_ADDONLANG['btkreports_config_operator_unvani_placeholder'] = 'Örn: ABC TELEKOMÜNİKASYON HİZMETLERİ SANAYİ VE TİCARET A.Ş.';
    $_ADDONLANG['btkreports_config_operator_unvani_desc'] = 'Şirketinizin resmi ticari unvanı (Personel listesi için gerekli).';
    $_ADDONLANG['btkreports_config_auth_types_label'] = 'Aktif Yetkilendirme Türleri';
    $_ADDONLANG['btkreports_config_auth_types_desc'] = 'Sahip olduğunuz ve raporlamak istediğiniz BTK yetkilendirme türlerini seçin.';
    $_ADDONLANG['btkreports_config_no_auth_types_defined'] = 'Sistemde tanımlı BTK Yetki Türü bulunamadı. Lütfen initial_reference_data.sql dosyasını kontrol edin.';
    $_ADDONLANG['btkreports_config_ftp_settings'] = 'FTP Sunucu Ayarları';
    $_ADDONLANG['btkreports_config_ftp_host_desc'] = 'BTK rapor dosyalarının yükleneceği FTP sunucu adresi (örn: ftp.btk.gov.tr).';
    $_ADDONLANG['btkreports_config_ftp_username_label'] = 'FTP Kullanıcı Adı';
    $_ADDONLANG['btkreports_config_ftp_password_label'] = 'FTP Şifre';
    $_ADDONLANG['btkreports_config_ftp_password_placeholder'] = 'Değiştirmek istemiyorsanız boş bırakın';
    $_ADDONLANG['btkreports_config_ftp_password_desc'] = 'FTP şifrenizi girin. Kaydedildiğinde şifrelenecektir.';
    $_ADDONLANG['btkreports_config_ftp_rehber_path_label'] = 'FTP Rehber Dosya Yolu';
    $_ADDONLANG['btkreports_config_ftp_rehber_path_desc'] = 'Rehber dosyalarının FTP\'de yükleneceği klasör (örn: /REHBER/). Başına ve sonuna / ekleyin.';
    $_ADDONLANG['btkreports_config_ftp_hareket_path_label'] = 'FTP Hareket Dosya Yolu';
    $_ADDONLANG['btkreports_config_ftp_hareket_path_desc'] = 'Hareket dosyalarının FTP\'de yükleneceği klasör (örn: /HAREKET/). Başına ve sonuna / ekleyin.';
    $_ADDONLANG['btkreports_config_personel_ftp_path_label'] = 'FTP Personel Dosya Yolu';
    $_ADDONLANG['btkreports_config_personel_ftp_path_desc'] = 'Personel listesi Excel dosyasının FTP\'de yükleneceği klasör (örn: /PERSONEL/). Başına ve sonuna / ekleyin.';
    $_ADDONLANG['btkreports_config_test_ftp_button'] = 'FTP Bağlantısını Test Et';
    $_ADDONLANG['btkreports_config_other_settings'] = 'Diğer Raporlama Ayarları';
    $_ADDONLANG['btkreports_config_send_empty_file_label'] = 'Boş Dosya Gönderimi';
    $_ADDONLANG['btkreports_config_send_empty_file_desc'] = 'Yetki türü için raporlanacak veri olmasa bile, BTK\'nın talep etmesi durumunda ilgili yetki türü için boş rapor dosyası oluşturulup gönderilsin.';
    $_ADDONLANG['btkreports_config_deactivation_settings'] = 'Modül Deaktivasyon Ayarları';
    $_ADDONLANG['btkreports_config_delete_data_on_uninstall_label'] = 'Deaktivasyonda Verileri Sil';
    $_ADDONLANG['btkreports_config_delete_data_on_uninstall_desc'] = 'Modül deaktive edilirken/kaldırılırken tüm BTK veritabanı tabloları silinsin.';
    $_ADDONLANG['btkreports_warning'] = 'UYARI';
    $_ADDONLANG['btkreports_config_delete_data_warning'] = 'Bu seçenek işaretlenirse, modül kaldırıldığında tüm BTK verileriniz kalıcı olarak silinir!';
    $_ADDONLANG['btkreports_save_changes'] = 'Değişiklikleri Kaydet';
    $_ADDONLANG['btkreports_go_back'] = 'Geri Dön';
    $_ADDONLANG['btkreports_readme_title'] = 'Modül Kullanım Kılavuzu';
    $_ADDONLANG['btkreports_readme_not_found'] = 'README.md dosyası bulunamadı.';
    $_ADDONLANG['btkreports_unknown_company'] = 'Bilinmeyen Firma';
    $_ADDONLANG['btkreports_pgmap_save_success'] = 'Eşleştirmeler başarıyla kaydedildi.';
    $_ADDONLANG['btkreports_generate_error'] = 'Rapor oluşturulurken bir hata oluştu.';
    $_ADDONLANG['btkreports_report_no_movement_data'] = 'Raporlanacak hareket bulunamadı.';
    $_ADDONLANG['btkreports_report_no_subscriber_data'] = 'Raporlanacak abone bulunamadı.';
    $_ADDONLANG['btkreports_generate_success_ftp'] = 'Rapor başarıyla oluşturuldu ve FTP\'ye yüklendi';
    $_ADDONLANG['btkreports_empty_file'] = 'Boş dosya';
    $_ADDONLANG['btkreports_empty_report_download_info'] = 'Boş rapor dosyası oluşturuldu ({fileName}), indirmek için anlamlı değil.';
    $_ADDONLANG['btkreports_report_generation_failed'] = 'Rapor oluşturulamadı.';
    $_ADDONLANG['btkreports_csrf_error'] = 'Geçersiz istek veya CSRF token.';
}

// Modül Temel Fonksiyonları (config, sanitize, get_admin_folder_name, log_activity, save_config, get_all_config)
// Bu fonksiyonların tam içerikleri bir önceki mesajda mevcuttu, buraya kısaltarak ekliyorum.
if (!function_exists('btkreports_config')) { function btkreports_config() { global $_ADDONLANG; $moduleName = $_ADDONLANG['btkreports_modulename'] ?? 'BTK Abone Veri Raporlama'; return [ 'name' => $moduleName, 'description' => $_ADDONLANG['btkreports_module_description'] ?? 'BTK tarafından istenen abone, hizmet ve personel verilerini raporlayan WHMCS eklenti modülü.', 'version' => '1.0.28', 'author' => 'Sen ve Ben Projesi', 'language' => 'turkish', 'fields' => [], ]; } }
if (!function_exists('_btkSanitizeString')) { function _btkSanitizeString($value, $removeNonNumeric = false) { $trimmed = trim((string)$value); if ($removeNonNumeric) { $trimmed = preg_replace('/[^\d]/', '', $trimmed); } return htmlspecialchars($trimmed, ENT_QUOTES, 'UTF-8'); } }
if (!function_exists('_btkSanitizeEmail')) { function _btkSanitizeEmail($value) { return filter_var(trim((string)$value), FILTER_SANITIZE_EMAIL); } }
if (!function_exists('btkreports_get_admin_folder_name')) { 
    function btkreports_get_admin_folder_name() { 
        global $CONFIG, $customadminpath;
        if (!empty($customadminpath)) { return $customadminpath; } // configuration.php'deki $customadminpath öncelikli
        if (class_exists('\WHMCS\Admin\Directory') && method_exists('\WHMCS\Admin\Directory', 'getAdminFolderName')) {
            $adminDir = \WHMCS\Admin\Directory::getAdminFolderName();
            if (!empty($adminDir)) { return $adminDir; }
        }
        return $CONFIG['AdminFolder'] ?? 'admin'; 
    }
}
if (!function_exists('btkreports_get_current_admin_username')) { function btkreports_get_current_admin_username() { global $adminUsername; return $adminUsername; } }
if (!function_exists('btkreports_log_activity')) { function btkreports_log_activity($description, $clientId = null, $serviceId = null, $logType = 'INFO') { global $adminUsername; try { $userId = null; if (isset($_SESSION['adminid']) && !empty($_SESSION['adminid'])) { $userId = (int)$_SESSION['adminid']; } $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'Unknown'; if (function_exists('getremoteip')) { $ipAddress = getremoteip(); } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) { $ipAddress = $_SERVER['HTTP_X_FORWARDED_FOR']; } elseif (!empty($_SERVER['HTTP_CLIENT_IP'])) { $ipAddress = $_SERVER['HTTP_CLIENT_IP']; } if (!Capsule::schema()->hasTable('mod_btk_logs')) { if (function_exists('logActivity')) { logActivity("BTK Module Log Skipped: mod_btk_logs table does not exist. Original log: [{$logType}] {$description}", 0); } else { error_log("BTK Module Log Skipped: mod_btk_logs table does not exist. Original log: [{$logType}] {$description}"); } return; } Capsule::table('mod_btk_logs')->insert([ 'description' => mb_substr($description . " (User: ".$adminUsername.")", 0, 65535), 'user_id' => $userId, 'client_id' => $clientId, 'service_id' => $serviceId, 'ip_address' => $ipAddress, 'log_type' => mb_substr($logType, 0, 50), 'log_time' => date('Y-m-d H:i:s') ]); } catch (Exception $e) { if (function_exists('logActivity')) { logActivity("BTK Module Log Self-Error: Could not write to mod_btk_logs. Original log: [{$logType}] {$description}. DB Error: " . $e->getMessage(), 0); } else { error_log("BTK Module Log Self-Error: Could not write to mod_btk_logs. Original log: [{$logType}] {$description}. DB Error: " . $e->getMessage()); } } } }
if (!function_exists('btkreports_save_config')) { function btkreports_save_config($setting, $value) { try { Capsule::table('mod_btk_config')->updateOrInsert( ['setting' => $setting], ['value' => $value, 'last_updated' => date('Y-m-d H:i:s')] ); } catch (Exception $e) { if (function_exists('btkreports_log_activity')) { btkreports_log_activity("BTK Save Config ERROR: Setting=" . $setting . " - " . $e->getMessage(), 0, null, 'ERROR'); } } } }
if (!function_exists('btkreports_get_all_config')) { function btkreports_get_all_config() { $configData = []; try { if (Capsule::schema()->hasTable('mod_btk_config')) { $configItems = Capsule::table('mod_btk_config')->get(); foreach ($configItems as $item) { $configData[$item->setting] = $item->value; } if (isset($configData['ftp_password']) && !empty($configData['ftp_password'])) { try { $configData['ftp_password_decrypted'] = decrypt($configData['ftp_password']); } catch (Exception $e) { $configData['ftp_password_decrypted'] = ''; if (function_exists('btkreports_log_activity')) btkreports_log_activity("BTK Get Config: FTP password decryption failed.", 0, null, "WARNING"); } } else { $configData['ftp_password_decrypted'] = ''; } } } catch (Exception $e) { if (function_exists('btkreports_log_activity')) btkreports_log_activity("BTK Get All Config ERROR: " . $e->getMessage(), 0, null, 'ERROR'); } $configData['operator_code'] = $configData['operator_code'] ?? ''; $configData['send_empty_file'] = $configData['send_empty_file'] ?? '0'; return $configData; } }
// Aktivasyon, Deaktivasyon, Upgrade Fonksiyonları (Bu fonksiyonların tam içerikleri bir önceki mesajlarda mevcuttu)
if (!function_exists('btkreports_activate')) { function btkreports_activate() { global $_ADDONLANG; $logPrefix = "BTK Reports Activation: "; try { $sqlInstallPath = __DIR__ . DIRECTORY_SEPARATOR . 'sql' . DIRECTORY_SEPARATOR . 'install.sql'; $initialDataSqlPath = __DIR__ . DIRECTORY_SEPARATOR . 'sql' . DIRECTORY_SEPARATOR . 'initial_reference_data.sql'; if (file_exists($sqlInstallPath)) { $sqlQueries = file_get_contents($sqlInstallPath); $sqlStatements = explode(';', $sqlQueries); foreach ($sqlStatements as $statement) { $statement = trim($statement); if (!empty($statement)) { Capsule::statement($statement); } } if (function_exists('btkreports_log_activity')) btkreports_log_activity($logPrefix . "install.sql executed successfully.", null, null, 'INFO_SETUP'); } else { if (function_exists('logActivity')) logActivity($logPrefix . "ERROR: install.sql not found.", 0); return ['status' => 'error', 'description' => ($_ADDONLANG['btkreports_error_install_sql_not_found'] ?? 'Kurulum SQL dosyası bulunamadı: install.sql')]; } if (file_exists($initialDataSqlPath)) { $sqlQueries = file_get_contents($initialDataSqlPath); $sqlStatements = explode(';', $sqlQueries); foreach ($sqlStatements as $statement) { $statement = trim($statement); if (!empty($statement)) { Capsule::statement($statement); } } if (function_exists('btkreports_log_activity')) btkreports_log_activity($logPrefix . "initial_reference_data.sql executed successfully.", null, null, 'INFO_SETUP'); } else { if (function_exists('btkreports_log_activity')) btkreports_log_activity($logPrefix . "WARNING: initial_reference_data.sql not found.", null, null, 'WARNING_SETUP'); } $new_version = btkreports_config()['version']; Capsule::table('mod_btk_config')->updateOrInsert(['setting' => 'module_version'], ['value' => $new_version, 'last_updated' => date('Y-m-d H:i:s')]); $defaultSettings = ['operator_name' => '', 'operator_code' => '', 'operator_unvani' => '', 'active_auth_types' => '[]', 'ftp_host' => '', 'ftp_username' => '', 'ftp_password' => '', 'ftp_rehber_path' => '/REHBER/', 'ftp_hareket_path' => '/HAREKET/', 'personel_ftp_path' => '/PERSONEL/', 'send_empty_file' => '0', 'delete_data_on_uninstall' => '0', 'last_config_update' => date('Y-m-d H:i:s')]; foreach($defaultSettings as $key => $value){ if (!Capsule::table('mod_btk_config')->where('setting', $key)->exists()) { Capsule::table('mod_btk_config')->insert(['setting' => $key, 'value' => $value]); } } if (function_exists('btkreports_sync_admins_to_personel')) { btkreports_sync_admins_to_personel(); } if (function_exists('btkreports_log_activity')) btkreports_log_activity($logPrefix . "Activation completed. Version: " . $new_version, null, null, 'SUCCESS_SETUP'); return ['status' => 'success', 'description' => ($_ADDONLANG['btkreports_activate_success'] ?? 'BTK Raporlama Modülü başarıyla aktive edildi. Lütfen modül ayarlarını yapılandırın.')]; } catch (Exception $e) { $activationErrorMsg = $logPrefix . "ERROR during activation: " . $e->getMessage() . " Trace: " . $e->getTraceAsString(); if (function_exists('btkreports_log_activity') && Capsule::schema()->hasTable('mod_btk_logs')) { btkreports_log_activity($activationErrorMsg, null, null, 'FATAL_ERROR_SETUP'); } else { logActivity($activationErrorMsg, 0); error_log($activationErrorMsg); } return ['status' => 'error', 'description' => ($_ADDONLANG['btkreports_activate_error'] ?? 'Modül aktivasyonu sırasında bir hata oluştu: ') . $e->getMessage()]; } } }
if (!function_exists('btkreports_deactivate')) { function btkreports_deactivate() { global $_ADDONLANG; $logPrefix = "BTK Reports Deactivation: "; $configData = btkreports_get_all_config(); $deleteData = $configData['delete_data_on_uninstall'] ?? '0'; if ($deleteData === '1') { try { $tablesToDrop = ['mod_btk_logs', 'mod_btk_hareketler', 'mod_btk_product_mappings', 'mod_btk_services', 'mod_btk_clients', 'mod_btk_personel', 'mod_btk_adresler', 'mod_btk_mahalleler', 'mod_btk_ilceler', 'mod_btk_iller', 'mod_btk_musteri_hareket_kodlari', 'mod_btk_hat_durum_kodlari', 'mod_btk_kimlik_aidiyeti', 'mod_btk_kimlik_tipleri', 'mod_btk_musteri_tipleri', 'mod_btk_hizmet_tipleri', 'mod_btk_yetki_turleri', 'mod_btk_config', 'mod_btk_nvi_cache']; foreach ($tablesToDrop as $table) { Capsule::schema()->dropIfExists($table); } $message = $_ADDONLANG['btkreports_deactivate_success_deleted'] ?? 'BTK Raporlama Modülü başarıyla deaktive edildi ve ilgili tüm tablolar silindi.'; if (function_exists('logActivity')) logActivity($logPrefix . "Deactivation completed. All tables dropped.", 0); } catch (Exception $e) { $message = ($_ADDONLANG['btkreports_deactivate_error_deleting_tables'] ?? 'Modül deaktive edildi ancak tablolar silinirken bir hata oluştu: ') . $e->getMessage(); if (function_exists('logActivity')) logActivity($logPrefix . "Error dropping tables: " . $e->getMessage(), 0); return ['status' => 'error', 'description' => $message]; } } else { $message = $_ADDONLANG['btkreports_deactivate_success_kept'] ?? 'BTK Raporlama Modülü başarıyla deaktive edildi. Veritabanı tablolarınız korunmuştur.'; if (function_exists('btkreports_log_activity') && Capsule::schema()->hasTable('mod_btk_logs')) { btkreports_log_activity($logPrefix . "Deactivation completed. Tables were not dropped.", 0, null, 'INFO_SETUP'); } } return ['status' => 'success', 'description' => $message]; } }
if (!function_exists('btkreports_upgrade')) { function btkreports_upgrade($vars) { $newVersion = $vars['version']; $currentDbVersion = ''; try { if (Capsule::schema()->hasTable('mod_btk_config')) { $currentDbVersion = Capsule::table('mod_btk_config')->where('setting', 'module_version')->value('value'); } } catch (Exception $e) { if (function_exists('btkreports_log_activity')) btkreports_log_activity("BTK Reports Upgrade: Could not get current DB version. " . $e->getMessage(), 0, null, 'ERROR_SETUP'); } if (empty($currentDbVersion)) { if (function_exists('btkreports_log_activity')) btkreports_log_activity("BTK Reports Upgrade: No current version found in DB, setting to " . $newVersion, 0, null, 'INFO_SETUP'); } else if (version_compare($currentDbVersion, $newVersion, '<')) { if (function_exists('btkreports_log_activity')) btkreports_log_activity("BTK Reports Upgrade: Upgrading database from " . $currentDbVersion . " to " . $newVersion, 0, null, 'INFO_SETUP'); if (version_compare($currentDbVersion, '1.0.20', '<')) { if (Capsule::schema()->hasTable('mod_btk_config')) { if (!Capsule::table('mod_btk_config')->where('setting', 'operator_unvani')->exists()) { Capsule::table('mod_btk_config')->insert(['setting' => 'operator_unvani', 'value' => '']); } if (!Capsule::table('mod_btk_config')->where('setting', 'personel_ftp_path')->exists()) { Capsule::table('mod_btk_config')->insert(['setting' => 'personel_ftp_path', 'value' => '/PERSONEL/']); } if (!Capsule::table('mod_btk_config')->where('setting', 'delete_data_on_uninstall')->exists()) { Capsule::table('mod_btk_config')->insert(['setting' => 'delete_data_on_uninstall', 'value' => '0']); } } } if (version_compare($currentDbVersion, '1.0.30', '<')) { if (!Capsule::schema()->hasTable('mod_btk_nvi_cache')) { try { Capsule::statement("CREATE TABLE `mod_btk_nvi_cache` ( `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY, `sorgu_tipi` enum('TCKN','YKN') NOT NULL, `sorgu_parametreleri` varchar(512) NOT NULL COMMENT 'JSON olarak sorgu parametreleri', `sonuc` tinyint(1) DEFAULT NULL COMMENT 'Doğrulama sonucu: 1=Başarılı, 0=Başarısız, NULL=Hata/Bilinmiyor', `yanit_mesaji` text DEFAULT NULL COMMENT 'NVI servisinden dönen mesaj veya hata detayı', `son_sorgu_tarihi` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(), UNIQUE KEY `unique_sorgu_v30` (`sorgu_tipi`,`sorgu_parametreleri`(255)) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"); if (function_exists('btkreports_log_activity')) btkreports_log_activity("BTK Reports Upgrade: mod_btk_nvi_cache table created.", 0, null, 'INFO_SETUP'); } catch (Exception $e) { if (function_exists('btkreports_log_activity')) btkreports_log_activity("BTK Reports Upgrade ERROR: Could not create mod_btk_nvi_cache table - " . $e->getMessage(), 0, null, 'ERROR_SETUP'); } } } } else { if (function_exists('btkreports_log_activity')) btkreports_log_activity("BTK Reports Upgrade: Already up to date or newer. DB version: " . $currentDbVersion . ", File version: " . $newVersion, 0, null, 'INFO_SETUP'); } Capsule::table('mod_btk_config')->updateOrInsert(['setting' => 'module_version'], ['value' => $newVersion, 'last_updated' => date('Y-m-d H:i:s')]); } }
if (!function_exists('btkreports_sync_admins_to_personel')) { function btkreports_sync_admins_to_personel() { global $_ADDONLANG; if (!Capsule::schema()->hasTable('tbladmins') || !Capsule::schema()->hasTable('mod_btk_personel')) { if (function_exists('btkreports_log_activity')) btkreports_log_activity("Personel Senkronizasyonu: Gerekli tablolar bulunamadı.",0,null,'ERROR'); return ['success' => false, 'message' => $_ADDONLANG['btkreports_personnel_sync_error_tables'] ?? 'Gerekli tablolar bulunamadı.']; } $config = btkreports_get_all_config(); $operatorUnvani = $config['operator_unvani'] ?? ($config['operator_name'] ?? ($_ADDONLANG['btkreports_unknown_company'] ?? 'Bilinmeyen Firma')); $syncedCount = 0; $errorCount = 0; $whmcsAdmins = Capsule::table('tbladmins')->where('disabled', 0)->get(); foreach ($whmcsAdmins as $admin) { $existingPersonel = Capsule::table('mod_btk_personel')->where('admin_id', $admin->id)->first(); $personelData = ['admin_id' => $admin->id, 'firma_adi' => $operatorUnvani, 'adi' => $admin->firstname, 'soyadi' => $admin->lastname, 'e_posta_adresi' => $admin->email, 'updated_at' => date('Y-m-d H:i:s')]; if (!$existingPersonel) { try { $personelData['btk_listesine_eklensin'] = true; $personelData['created_at'] = date('Y-m-d H:i:s'); Capsule::table('mod_btk_personel')->insert($personelData); $syncedCount++; if (function_exists('btkreports_log_activity')) btkreports_log_activity("Personel Senkronizasyonu: Admin ID {$admin->id} ({$admin->username}) mod_btk_personel tablosuna eklendi.",0,null,'INFO'); } catch (Exception $e) { $errorCount++; if (function_exists('btkreports_log_activity')) btkreports_log_activity("Personel Senkronizasyonu HATA: Admin ID {$admin->id} eklenirken - " . $e->getMessage(),0,null,'ERROR'); } } else { try { Capsule::table('mod_btk_personel')->where('admin_id', $admin->id)->update(['firma_adi' => $operatorUnvani, 'adi' => $admin->firstname, 'soyadi' => $admin->lastname, 'e_posta_adresi' => $admin->email, 'updated_at' => date('Y-m-d H:i:s')]); } catch (Exception $e) { if (function_exists('btkreports_log_activity')) btkreports_log_activity("Personel Senkronizasyonu HATA: Admin ID {$admin->id} güncellenirken - " . $e->getMessage(),0,null,'ERROR'); } } } $message = sprintf(($_ADDONLANG['btkreports_personnel_sync_completed'] ?? '%s yeni personel eklendi/güncellendi.'), $syncedCount); if ($errorCount > 0) { $message .= " " . sprintf(($_ADDONLANG['btkreports_personnel_sync_errors_occurred'] ?? '%s personel işlenirken hata oluştu.'), $errorCount); } if (function_exists('btkreports_log_activity')) btkreports_log_activity("Personel Senkronizasyonu tamamlandı: " . $message,0,null,'INFO'); return ['success' => $errorCount == 0, 'message' => $message, 'synced' => $syncedCount, 'errors' => $errorCount]; } }
if (!function_exists('btkreports_AdminAreaClientSummaryPageTab')) { function btkreports_AdminAreaClientSummaryPageTab($vars, $smartyInstance = null, $modulelink_param = null) { /* ... (Önceki tam koddan alınacak) ... */ return ''; } }
if (!function_exists('btkreports_AdminAreaViewProductDetailsPage')) { function btkreports_AdminAreaViewProductDetailsPage($vars, $smartyInstance = null, $modulelink_param = null) { /* ... (Önceki tam koddan alınacak) ... */ return ''; } }
if (!function_exists('btkreports_test_ftp_connection')) { function btkreports_test_ftp_connection($host, $username, $password, $path, $uploadTestFile = true) { global $_ADDONLANG; $logContext = "FTP Test: Host={$host}, User={$username}, Path={$path}, UploadTest=" . ($uploadTestFile ? 'true' : 'false'); btkreports_log_activity("{$logContext} - Attempting connection.", null, null, "FTP_DEBUG"); if (empty($host) || empty($username)) { $msg = $_ADDONLANG['btkreports_config_ftp_error_hostuser'] ?? 'FTP Host ve Kullanıcı Adı boş olamaz.'; btkreports_log_activity("{$logContext} - FAILED: {$msg}", null, null, "FTP_ERROR"); return ['success' => false, 'message' => $msg]; } $conn_id = ftp_connect($host, 21, 20); if (!$conn_id) { $error = error_get_last(); $phpFtpError = isset($error['message']) ? ' (PHP FTP Error: ' . $error['message'] . ')' : ''; $msg = ($_ADDONLANG['btkreports_ftp_test_fail'] ?? 'FTP Bağlantı Hatası:') . ' ' . ($_ADDONLANG['btkreports_ftp_error_connect'] ?? 'Sunucuya bağlanılamadı.') . $phpFtpError; btkreports_log_activity("{$logContext} - FAILED to connect." . $phpFtpError, null, null, "FTP_ERROR"); return ['success' => false, 'message' => $msg]; } btkreports_log_activity("{$logContext} - Connected. Attempting login.", null, null, "FTP_DEBUG"); if (!ftp_login($conn_id, $username, $password)) { $error = error_get_last(); $phpFtpError = isset($error['message']) ? ' (PHP FTP Error: ' . $error['message'] . ')' : ''; @ftp_close($conn_id); $msg = ($_ADDONLANG['btkreports_ftp_test_fail'] ?? 'FTP Bağlantı Hatası:') . ' ' . ($_ADDONLANG['btkreports_ftp_error_login'] ?? 'Kullanıcı adı veya şifre hatalı.') . $phpFtpError; btkreports_log_activity("{$logContext} - FAILED to login." . $phpFtpError, null, null, "FTP_ERROR"); return ['success' => false, 'message' => $msg]; } btkreports_log_activity("{$logContext} - Logged in. Setting PASV mode.", null, null, "FTP_DEBUG"); if (!ftp_pasv($conn_id, true)) { $error = error_get_last(); btkreports_log_activity("{$logContext} - WARNING: Could not set PASV mode. Error: " . (isset($error['message']) ? $error['message'] : 'N/A'), null, null, "FTP_WARN"); } else { btkreports_log_activity("{$logContext} - PASV mode set.", null, null, "FTP_DEBUG"); } if (!empty($path)) { btkreports_log_activity("{$logContext} - Attempting to change directory to '{$path}'.", null, null, "FTP_DEBUG"); if (!ftp_chdir($conn_id, $path)) { $currentDir = ftp_pwd($conn_id); $error = error_get_last(); $phpFtpError = isset($error['message']) ? ' (PHP FTP Error: ' . $error['message'] . ')' : ''; @ftp_close($conn_id); $msg = ($_ADDONLANG['btkreports_ftp_test_fail'] ?? 'FTP Bağlantı Hatası:') . " Klasöre ('" . htmlspecialchars($path) . "') geçilemedi. Mevcut klasör: " . htmlspecialchars($currentDir ?? '') . $phpFtpError; btkreports_log_activity("{$logContext} - FAILED to chdir to '{$path}'. Current dir: {$currentDir}." . $phpFtpError, null, null, "FTP_ERROR"); return ['success' => false, 'message' => $msg]; } btkreports_log_activity("{$logContext} - Changed directory to '{$path}'. Current PWD: " . ftp_pwd($conn_id), null, null, "FTP_DEBUG"); } $message = $_ADDONLANG['btkreports_ftp_test_success'] ?? 'FTP bağlantısı başarılı!'; $uploadStatusMessage = ""; if($uploadTestFile){ btkreports_log_activity("{$logContext} - Starting upload test.", null, null, "FTP_DEBUG"); $tempFile = tmpfile(); if ($tempFile === false) { @ftp_close($conn_id); $msg = $_ADDONLANG['btkreports_ftp_test_error_temp_file'] ?? 'Geçici test dosyası oluşturulamadı.'; btkreports_log_activity("{$logContext} - FAILED to create temp file for upload test.", null, null, "FTP_ERROR"); return ['success' => false, 'message' => $msg]; } fwrite($tempFile, "BTK FTP Test - " . date('Y-m-d H:i:s')); fseek($tempFile, 0); $finalPath = rtrim($path, '/') . '/'; $remoteFileName = $finalPath . 'btk_ftp_test_' . time() . '.txt'; btkreports_log_activity("{$logContext} - Attempting to upload test file to '{$remoteFileName}'.", null, null, "FTP_DEBUG"); $uploadSuccess = false; if (ftp_fput($conn_id, $remoteFileName, $tempFile, FTP_BINARY)) { btkreports_log_activity("{$logContext} - Test file uploaded to '{$remoteFileName}'. Attempting to delete.", null, null, "FTP_DEBUG"); if(ftp_delete($conn_id, $remoteFileName)) { $uploadSuccess = true; btkreports_log_activity("{$logContext} - Test file deleted successfully.", null, null, "FTP_DEBUG"); } else { $error = error_get_last(); $phpFtpError = isset($error['message']) ? ' (PHP FTP Error: ' . $error['message'] . ')' : ''; btkreports_log_activity("{$logContext} - WARNING: Test file uploaded but FAILED to delete." . $phpFtpError, null, null, "FTP_WARN"); $uploadStatusMessage = " " . ($_ADDONLANG['btkreports_ftp_test_upload_warn_delete'] ?? "Test dosyası yüklendi ancak silinemedi."); } } else { $error = error_get_last(); $phpFtpError = isset($error['message']) ? ' (PHP FTP Error: ' . $error['message'] . ')' : ''; btkreports_log_activity("{$logContext} - FAILED to upload test file." . $phpFtpError, null, null, "FTP_ERROR"); } fclose($tempFile); if($uploadSuccess) { $uploadStatusMessage = " " . ($_ADDONLANG['btkreports_ftp_test_upload_success'] ?? "Test dosyası başarıyla yüklendi ve silindi."); } else { if (empty($uploadStatusMessage)) { $uploadStatusMessage = " " . ($_ADDONLANG['btkreports_ftp_test_upload_fail'] ?? "Ancak test dosyası yüklenemedi/silinemedi. Yazma izinlerini veya yolun doğruluğunu kontrol edin."); } @ftp_close($conn_id); btkreports_log_activity("{$logContext} - SUCCESSFUL connection but FAILED upload/delete test.", null, null, "FTP_ERROR"); return ['success' => false, 'message' => $message . $uploadStatusMessage]; } } @ftp_close($conn_id); btkreports_log_activity("{$logContext} - Test COMPLETED. Result: Success. Message: {$message}{$uploadStatusMessage}", null, null, "FTP_SUCCESS"); return ['success' => true, 'message' => $message . $uploadStatusMessage]; } }
if (!function_exists('btkreports_save_client_btk_data')) { function btkreports_save_client_btk_data($postData, $clientId) { /* ... (Önceki tam koddan alınacak) ... */ return ['success'=>true, 'message'=>'OK']; } }
if (!function_exists('btkreports_save_service_btk_data')) { function btkreports_save_service_btk_data($postData, $serviceId, $clientId) { /* ... (Önceki tam koddan alınacak) ... */ return ['success'=>true, 'message'=>'OK']; } }
if (!function_exists('btkreports_format_address_for_report')) { function btkreports_format_address_for_report($adresData) { /* ... (Önceki tam koddan alınacak) ... */ return ''; } }

if (!function_exists('btkreports_generate_rehber_file')) { 
    function btkreports_generate_rehber_file($config) { 
        global $_ADDONLANG;
        btkreports_log_activity("REHBER Generation: Function called. Config send_empty_file: " . ($config['send_empty_file'] ?? 'N/A'), 0, null, "DEBUG_GENERATE");
        $operatorCode = $config['operator_code'] ?? '000';
        $lines = [];
        $separator = '|;|';
        $newLine = "\n";

        $clients = Capsule::table('tblclients')
            ->leftJoin('mod_btk_clients', 'tblclients.id', '=', 'mod_btk_clients.client_id')
            ->select('tblclients.id as whmcs_client_id', 'tblclients.firstname', 'tblclients.lastname', 
                     'tblclients.companyname', 'tblclients.email as whmcs_email', 
                     'tblclients.phonenumber as whmcs_phone', 'tblclients.tax_id as whmcs_tax_id', 
                     'tblclients.status as client_status', 'tblclients.country as whmcs_country', 
                     'tblclients.datecreated as client_datecreated', 'mod_btk_clients.*')
            ->get(); 

        if ($clients->isEmpty()) {
            btkreports_log_activity("REHBER Generation: No clients found in tblclients at all.", 0, null, "INFO_GENERATE");
            if (($config['send_empty_file'] ?? '0') === '1') {
                $fileContent = ""; // Boş dosya
                $fileName = "REHBER_" . $operatorCode . "_" . date('YmdHis') . "_01.abn"; // _cnt eklendi
                btkreports_log_activity("REHBER Generation: No clients, sending empty file: {$fileName}", 0, null, "INFO_GENERATE");
                return [$fileName, $fileContent];
            }
            return [null, null]; 
        }
        btkreports_log_activity("REHBER Generation: Found " . $clients->count() . " total clients (all statuses).", 0, null, "DEBUG_GENERATE");

        foreach ($clients as $client) {
            $services = Capsule::table('tblhosting')
                ->where('userid', $client->whmcs_client_id)
                ->leftJoin('mod_btk_services', 'tblhosting.id', '=', 'mod_btk_services.service_id')
                ->leftJoin('tblproducts', 'tblhosting.packageid', '=', 'tblproducts.id')
                ->leftJoin('mod_btk_product_mappings', 'tblproducts.gid', '=', 'mod_btk_product_mappings.whmcs_product_group_id')
                ->select( /* Tüm gerekli alanlar seçilmeli */
                    'tblhosting.id as whmcs_service_id', 'tblhosting.regdate as service_regdate', 
                    'tblhosting.domainstatus as service_status', 'tblhosting.termination_date as service_termination_date',
                    'tblhosting.dedicatedip as service_dedicatedip', 'tblhosting.username as service_username',
                    'mod_btk_services.*', 'mod_btk_product_mappings.btk_yetki_turu_kodu as mapped_yetki_kodu',
                    'mod_btk_product_mappings.default_btk_hizmet_tipi_kodu as mapped_hizmet_tipi',
                    'tblproducts.name as product_name'
                )
                ->get();
            
            if ($services->isEmpty()) {
                 btkreports_log_activity("REHBER Generation: Client ID {$client->whmcs_client_id} has no services. Skipping based on service-oriented data requirement (BTK teyidi bekleniyor).", $client->whmcs_client_id, null, "INFO_GENERATE");
                continue; 
            }
            btkreports_log_activity("REHBER Generation: Client ID {$client->whmcs_client_id} has " . $services->count() . " services. Processing...", $client->whmcs_client_id, null, "DEBUG_GENERATE");

            foreach ($services as $service) {
                 $line = [];
                 // BTK DESENİNE GÖRE ALANLAR (Toplam 70 ortak + hizmete özel alanlar)
                 // İlk 63 Alan (Ortak + Kurumsal)
                 $line[0] = $operatorCode;
                 $line[1] = $client->whmcs_client_id;
                 $line[2] = $service->whmcs_service_id;
                 
                 $hatDurum = $service->hat_durum_kodu ?: btkreports_map_whmcs_status_to_btk_hat_durum($service->service_status);
                 $hatDurumKoduAciklama = Capsule::table('mod_btk_hat_durum_kodlari')->where('kod', $hatDurum)->first();
                 $line[3] = $hatDurumKoduAciklama ? $hatDurumKoduAciklama->durum_adi : 'AKTIF';
                 $line[4] = $hatDurum ?: '1';
                 $line[5] = $service->hat_aciklama ?: ($hatDurumKoduAciklama ? mb_strtoupper($hatDurumKoduAciklama->aciklama, 'UTF-8') : 'AKTIF');
                 
                 $line[6] = ''; // MUSTERI_HAREKET_KODU
                 $line[7] = ''; // MUSTERI_HAREKET_ACIKLAMA
                 $line[8] = ''; // MUSTERI_HAREKET_ZAMANI
                 
                 $hizmetTipi = $service->override_hizmet_tipi_kodu ?: $service->mapped_hizmet_tipi ?: '';
                 $line[9] = $hizmetTipi;
                 $line[10] = $client->musteri_tipi_kodu ?: '';
                 
                 $aboneBaslangic = $client->abone_baslangic_tarihi ?: ($service->service_regdate ?: $client->client_datecreated);
                 $line[11] = $aboneBaslangic ? date('YmdHis', strtotime($aboneBaslangic)) : '00000000000000';
                 
                 $aboneBitis = null;
                 if (in_array(strtolower($service->service_status), ['terminated', 'cancelled', 'fraud'])) {
                     $aboneBitis = $service->service_termination_date ?: $client->abone_bitis_tarihi;
                 } elseif (in_array(strtolower($client->client_status), ['closed', 'inactive']) && !$aboneBitis && !in_array(strtolower($service->service_status), ['active', 'suspended', 'pending'])) {
                     $aboneBitis = $client->abone_bitis_tarihi ?: $service->service_termination_date; 
                 }
                 $line[12] = $aboneBitis ? date('YmdHis', strtotime($aboneBitis)) : '00000000000000';
                 
                 $line[13] = mb_strtoupper($client->firstname ?? '', 'UTF-8');
                 $line[14] = mb_strtoupper($client->lastname ?? '', 'UTF-8');
                 $line[15] = $client->abone_tc_kimlik_no ?: '';
                 $line[16] = $client->abone_pasaport_no ?: '';
                 $line[17] = mb_strtoupper($client->abone_unvan ?: $client->companyname ?: '', 'UTF-8');
                 $line[18] = $client->abone_vergi_numarasi ?: (($client->musteri_tipi_kodu ?? '') !== 'B' && ($client->musteri_tipi_kodu ?? '') !== 'BY' ? $client->whmcs_tax_id : '');
                 $line[19] = $client->abone_mersis_numarasi ?: '';
                 $line[20] = $client->abone_cinsiyet ?: '';
                 $line[21] = $client->abone_uyruk_iso_kodu ?: ($client->whmcs_country ?: '');
                 $line[22] = mb_strtoupper($client->abone_baba_adi ?: '', 'UTF-8');
                 $line[23] = mb_strtoupper($client->abone_ana_adi ?: '', 'UTF-8');
                 $line[24] = mb_strtoupper($client->abone_anne_kizlik_soyadi ?: '', 'UTF-8');
                 $line[25] = mb_strtoupper($client->abone_dogum_yeri ?: '', 'UTF-8');
                 $line[26] = $client->abone_dogum_tarihi ? date('Y-m-d', strtotime($client->abone_dogum_tarihi)) : '0000-00-00';
                 $line[27] = mb_strtoupper($client->abone_meslek ?: '', 'UTF-8');
                 $line[28] = $client->abone_tarife ?: ($service->product_name ?: '');
                 $line[29] = $client->abone_kimlik_cilt_no ?: '0'; 
                 $line[30] = $client->abone_kimlik_kutuk_no ?: '0';
                 $line[31] = $client->abone_kimlik_sayfa_no ?: '0'; 
                 $kimlikIlAdi = $client->abone_kimlik_il_id ? Capsule::table('mod_btk_iller')->where('id', $client->abone_kimlik_il_id)->value('il_adi') : ''; 
                 $kimlikIlceAdi = $client->abone_kimlik_ilce_id ? Capsule::table('mod_btk_ilceler')->where('id', $client->abone_kimlik_ilce_id)->value('ilce_adi') : ''; 
                 $line[32] = mb_strtoupper($kimlikIlAdi ?: '', 'UTF-8'); 
                 $line[33] = mb_strtoupper($kimlikIlceAdi ?: '', 'UTF-8'); 
                 $line[34] = mb_strtoupper($client->abone_kimlik_mahalle_koy ?: '', 'UTF-8'); 
                 $line[35] = $client->abone_kimlik_tipi_kodu ?: ''; 
                 $line[36] = $client->abone_kimlik_seri_no ?: ''; 
                 $line[37] = mb_strtoupper($client->abone_kimlik_verildigi_yer ?: '', 'UTF-8'); 
                 $line[38] = $client->abone_kimlik_verildigi_tarih ? date('Y-m-d', strtotime($client->abone_kimlik_verildigi_tarih)) : '0000-00-00'; 
                 $line[39] = $client->abone_kimlik_aidiyeti_kodu ?: ''; 
                 $tesisAdresi = null; 
                 if ($service->tesis_adresi_id) { $tesisAdresi = Capsule::table('mod_btk_adresler')->where('id', $service->tesis_adresi_id)->first(); } 
                 elseif ($service->tesis_adresi_yerlesimle_ayni && $client->yerlesim_adresi_id) { $tesisAdresi = Capsule::table('mod_btk_adresler')->where('id', $client->yerlesim_adresi_id)->first(); } 
                 $tesisIlAdi = $tesisAdresi && $tesisAdresi->il_id ? Capsule::table('mod_btk_iller')->where('id', $tesisAdresi->il_id)->value('il_adi') : ''; 
                 $tesisIlceAdi = $tesisAdresi && $tesisAdresi->ilce_id ? Capsule::table('mod_btk_ilceler')->where('id', $tesisAdresi->ilce_id)->value('ilce_adi') : ''; 
                 $tesisMahalleAdi = $tesisAdresi && $tesisAdresi->mahalle_id ? Capsule::table('mod_btk_mahalleler')->where('id', $tesisAdresi->mahalle_id)->value('mahalle_adi') : ''; 
                 $line[40] = mb_strtoupper($tesisIlAdi ?: '', 'UTF-8'); 
                 $line[41] = mb_strtoupper($tesisIlceAdi ?: '', 'UTF-8'); 
                 $line[42] = mb_strtoupper($tesisMahalleAdi ?: '', 'UTF-8'); 
                 $line[43] = mb_strtoupper($tesisAdresi ? ($tesisAdresi->csbm ?: '') : '', 'UTF-8'); 
                 $line[44] = mb_strtoupper($tesisAdresi ? ($tesisAdresi->dis_kapi_no ?: '') : '', 'UTF-8'); 
                 $line[45] = mb_strtoupper($tesisAdresi ? ($tesisAdresi->ic_kapi_no ?: '') : '', 'UTF-8'); 
                 $line[46] = $tesisAdresi ? ($tesisAdresi->posta_kodu ?: '') : ''; 
                 $line[47] = $tesisAdresi ? ($tesisAdresi->adres_kodu_uavt ?: '0') : '0'; 
                 $line[48] = $client->irtibat_tel_no_1 ?: $client->whmcs_phone ?: ''; 
                 $line[49] = $client->irtibat_tel_no_2 ?: ''; 
                 $line[50] = $client->irtibat_email ?: $client->whmcs_email ?: ''; 
                 $yerlesimAdresi = null; 
                 if ($client->yerlesim_adresi_id) { $yerlesimAdresi = Capsule::table('mod_btk_adresler')->where('id', $client->yerlesim_adresi_id)->first(); } 
                 $yerlesimIlAdi = $yerlesimAdresi && $yerlesimAdresi->il_id ? Capsule::table('mod_btk_iller')->where('id', $yerlesimAdresi->il_id)->value('il_adi') : ''; 
                 $yerlesimIlceAdi = $yerlesimAdresi && $yerlesimAdresi->ilce_id ? Capsule::table('mod_btk_ilceler')->where('id', $yerlesimAdresi->ilce_id)->value('ilce_adi') : ''; 
                 $yerlesimMahalleAdi = $yerlesimAdresi && $yerlesimAdresi->mahalle_id ? Capsule::table('mod_btk_mahalleler')->where('id', $yerlesimAdresi->mahalle_id)->value('mahalle_adi') : ''; 
                 $line[51] = mb_strtoupper($yerlesimIlAdi ?: '', 'UTF-8'); 
                 $line[52] = mb_strtoupper($yerlesimIlceAdi ?: '', 'UTF-8'); 
                 $line[53] = mb_strtoupper($yerlesimMahalleAdi ?: '', 'UTF-8'); 
                 $line[54] = mb_strtoupper($yerlesimAdresi ? ($yerlesimAdresi->csbm ?: '') : '', 'UTF-8'); 
                 $line[55] = mb_strtoupper($yerlesimAdresi ? ($yerlesimAdresi->dis_kapi_no ?: '') : '', 'UTF-8'); 
                 $line[56] = mb_strtoupper($yerlesimAdresi ? ($yerlesimAdresi->ic_kapi_no ?: '') : '', 'UTF-8'); 
                 $line[57] = $yerlesimAdresi ? ($yerlesimAdresi->adres_kodu_uavt ?: '0') : '0'; 
                 $line[58] = mb_strtoupper($client->kurum_yetkili_adi ?: '', 'UTF-8'); 
                 $line[59] = mb_strtoupper($client->kurum_yetkili_soyadi ?: '', 'UTF-8'); 
                 $line[60] = $client->kurum_yetkili_tckimlik_no ?: '0'; 
                 $line[61] = $client->kurum_yetkili_telefon ?: ''; 
                 $kurumAdresi = null; if ($client->kurum_adresi_id) { $kurumAdresi = Capsule::table('mod_btk_adresler')->where('id', $client->kurum_adresi_id)->first(); } 
                 $kurumAdresFormatli = $kurumAdresi ? btkreports_format_address_for_report((array)$kurumAdresi) : ($yerlesimAdresi ? btkreports_format_address_for_report((array)$yerlesimAdresi) : ''); 
                 $line[62] = mb_strtoupper($kurumAdresFormatli, 'UTF-8'); 
                 $line[63] = $service->aktivasyon_bayi_adi ?: ''; 
                 $line[64] = $service->aktivasyon_bayi_adresi ?: ''; 
                 $line[65] = $service->aktivasyon_kullanici ?: ''; 
                 $line[66] = $service->guncelleyen_bayi_adi ?: ''; 
                 $line[67] = $service->guncelleyen_bayi_adresi ?: ''; 
                 $line[68] = $service->guncelleyen_kullanici ?: ''; 
                 $line[69] = $service->statik_ip ?: $service->service_dedicatedip ?: ''; 
                 
                 // Yetki Tipine Göre Değişen Alanlar (Örnek ISS için ilk 3 alan)
                 // Bu kısım seçilen yetki tipine göre (TIP) dinamik olarak doldurulmalı
                 // Şimdilik genel ISS alanlarını varsayıyoruz (70-73)
                 $line[70] = $service->iss_hiz_profili ?: ''; // ISS_HIZ_PROFILI
                 $line[71] = $service->iss_kullanici_adi ?: $service->service_username ?: ''; // ISS_KULLANICI_ADI
                 $line[72] = $service->iss_pop_bilgisi ?: ''; // ISS_POP_BILGISI

                 // BTK dökümanındaki tüm alanları (gerekiyorsa boş olarak) eklediğinizden emin olun.
                 // Örneğin, eğer toplam 94 alan varsa ve sadece 73'ü doldurulmuşsa, kalanlar için boş string eklenmeli.
                 // Bu örnekte 73 alan dolduruldu. Geri kalanlar için döngüyle boş string eklenebilir.
                 // for ($i = count($line); $i < 94; $i++) { // Varsayılan en uzun desen 94 alan ise
                 // $line[$i] = '';
                 // }
                 
                 // BTK dökümanına göre en fazla 94 alan olabilir (Uydu).
                 // Bizim ortak + ISS için 73 alanımız var.
                 // Diğer yetki tipleri için bu bloklar güncellenmeli.
                 // Şimdilik 73 alanla devam edelim.
                 
                 $lines[] = implode($separator, array_map(function($value) { return $value === null ? '' : mb_strtoupper($value, 'UTF-8'); }, $line));
            }
        } 
        
        if (empty($lines) && ($config['send_empty_file'] ?? '0') === '1') {
            $fileContent = ""; 
            btkreports_log_activity("REHBER Generation: No data lines generated, sending empty file as per config.", 0, null, "INFO_GENERATE");
        } elseif (empty($lines)) {
            btkreports_log_activity("REHBER Generation: No data lines generated to report, send_empty_file is off.", 0, null, "INFO_GENERATE");
            return [null, null];
        } else {
            // BAŞLIK SATIRI BTK İSTEMİYORSA KALDIRILACAK.
            // $header = "OPERATOR_KODU|;|MUSTERI_NO|;|HIZMET_NO|;|..."; // Tam başlık
            // $fileContent = $header . $newLine . implode($newLine, $lines) . $newLine;
            $fileContent = implode($newLine, $lines) . $newLine; // Başlıksız
        }
        
        // Dosya adını oluştur
        $operatorNameShort = substr(preg_replace("/[^A-Za-z0-9]/", '', $config['operator_name'] ?? 'ISLETME'), 0, 10); // Örnek kısaltma
        $authTypes = json_decode($config['active_auth_types'] ?? '[]', true);
        $tip = !empty($authTypes) ? strtoupper($authTypes[0]) : 'ISS'; // İlk yetki tipini al veya varsayılan
        // BTK dökümanındaki TIP kısaltmalarına uygun hale getirin: STH, UYDU, AIH, ISS, GSM
        // Bu kısım daha detaylı bir eşleştirme gerektirebilir.
        if ($tip === 'İNTERNET SERVİS SAĞLAYICILIĞI') $tip = 'ISS';
        // Diğer yetki tipleri için de benzer dönüşümler...

        $fileName = strtoupper($operatorNameShort) . "_" . $operatorCode . "_" . $tip . "_ABONE_REHBER_" . date('YmdHis') . "_01.abn";
        
        // ISO-8859-9 (Latin 5) formatına çevir
        $fileContent = mb_convert_encoding($fileContent, 'ISO-8859-9', 'UTF-8');

        btkreports_log_activity("REHBER Generation: File {$fileName} created. Line count: " . count($lines), 0, null, "SUCCESS_GENERATE");
        return [$fileName, $fileContent];
    } 
}
if (!function_exists('btkreports_generate_hareket_file')) { function btkreports_generate_hareket_file($config, $baslangicTarih = null, $bitisTarih = null, $isManual = false) { /* ... (Önceki tam koddan alınacak, rehberdeki gibi veri çekme filtreleri BTK'ya göre ayarlanmalı ve BAŞLIKSIZ olmalı) ... */ return [null,null]; } }
if (!function_exists('btkreports_map_whmcs_status_to_btk_hat_durum')) { function btkreports_map_whmcs_status_to_btk_hat_durum($whmcsStatus) { /* ... (Önceki tam koddan alınacak) ... */ return '1'; } }
if (!function_exists('btkreports_upload_to_ftp')) { function btkreports_upload_to_ftp($fileName, $fileContent, $config, $reportType) { /* ... (Önceki tam koddan alınacak) ... */ return ['success'=>false, 'message'=>'Error']; } }
if (!function_exists('btkreports_add_hareket_kaydi')) { function btkreports_add_hareket_kaydi($clientId, $serviceId, $hareketKodu, $hareketAciklama, $eskiDeger = null, $yeniDeger = null, $detay = null, $hookName = null) { /* ... (Önceki tam koddan alınacak) ... */ } }

// ANA ÇIKIŞ FONKSİYONU
if (!function_exists('btkreports_output')) {
    function btkreports_output($vars)
    {
        global $_ADDONLANG, $CONFIG, $adminUsername;
        ob_start(); 
        
        if (empty($_ADDONLANG) && file_exists(__DIR__ . '/lang/turkish.php')) {
            require_once __DIR__ . '/lang/turkish.php';
        }
        if (empty($_ADDONLANG) || !is_array($_ADDONLANG) || !isset($_ADDONLANG['btkreports_modulename'])) {
            $_ADDONLANG = array_merge([ /* Fallback dil anahtarları */ ], is_array($_ADDONLANG) ? $_ADDONLANG : []);
        }

        $modulelink = $vars['modulelink']; 
        $action = isset($_REQUEST['action']) ? _btkSanitizeString($_REQUEST['action']) : 'index'; 

        $csrfToken = '';
        if (function_exists('generate_token')) {
            $csrfToken = generate_token('plain');
        }

        $smarty = new Smarty();
        $smarty->assign('modulelink', $modulelink);
        $smarty->assign('_ADDONLANG', $_ADDONLANG);
        $smarty->assign('csrfToken', $csrfToken);
        
        $adminFolderName = btkreports_get_admin_folder_name(); 
        $adminBaseUrl = rtrim($CONFIG['SystemURL'], '/') . '/' . $adminFolderName . '/'; 
        $smarty->assign('admin_url', $adminBaseUrl); 
        $smarty->assign('BASE_PATH_JS', $adminBaseUrl . 'templates/blend/js'); 
        $smarty->assign('BASE_PATH_CSS', $adminBaseUrl . 'templates/blend/css'); 

        $templateDir = __DIR__ . DIRECTORY_SEPARATOR . 'templates' . DIRECTORY_SEPARATOR . 'admin' . DIRECTORY_SEPARATOR;
        $smarty->setTemplateDir($templateDir);
        $smartyCompileDir = isset($GLOBALS['templates_compiledir']) ? $GLOBALS['templates_compiledir'] : ($GLOBALS['smarty'] ? $GLOBALS['smarty']->getCompileDir() : sys_get_temp_dir());
        if ($smartyCompileDir && is_writable($smartyCompileDir)) {
            $smarty->setCompileDir($smartyCompileDir);
        } else {
            if (function_exists('logActivity')) logActivity("BTK Reports Smarty Uyarı: Smarty compile directory ($smartyCompileDir) yazılabilir değil veya bulunamadı.", 0);
        }
        
        $configDataForPage = btkreports_get_all_config();
        $configDataForPage['active_auth_types'] = isset($configDataForPage['active_auth_types']) ? json_decode($configDataForPage['active_auth_types'], true) : [];
        if (!is_array($configDataForPage['active_auth_types'])) $configDataForPage['active_auth_types'] = [];
        
        $smarty->assign('config_module_version', btkreports_config()['version']);

        $validateCsrf = function($tokenKey = "token") { 
            return check_token("WHMCS.admin.default");
        };
        
        $nviUniqueTokenName = 'btk_nvi_csrf_' . substr(md5(uniqid(rand(), true)), 0, 10);
        if (function_exists('generate_token')) { $_SESSION[$nviUniqueTokenName] = generate_token('plain'); } 
        else { $_SESSION[$nviUniqueTokenName] = md5(uniqid(rand(), true) . session_id()); }
        $smarty->assign('nviCsrfTokenName', $nviUniqueTokenName);
        $smarty->assign('nviCsrfTokenValue', $_SESSION[$nviUniqueTokenName]);
        $validateNviCsrf = function() { $tokenName = $_POST['nvi_token_name'] ?? ''; $tokenValue = $_POST['nvi_token_value'] ?? ''; if (!empty($tokenName) && !empty($tokenValue) && isset($_SESSION[$tokenName]) && $_SESSION[$tokenName] === $tokenValue) { unset($_SESSION[$tokenName]); return true; } if (function_exists('btkreports_log_activity')) btkreports_log_activity("NVI CSRF Validation Failed. Name: {$tokenName}, Value Sent: {$tokenValue}, Session Value: " . ($_SESSION[$tokenName] ?? 'Not Set'),0,null,'CSRF_FAIL'); return false; };

        try {
            $smarty->assign('_ADDONLANG', $_ADDONLANG); 
            $smarty->assign('action', $action); 

            if (isset($_SESSION['btkModuleSuccessMessage']) && ($action === 'index' || $action === '')) {
                $smarty->assign('successMessage', $_SESSION['btkModuleSuccessMessage']);
                unset($_SESSION['btkModuleSuccessMessage']);
            }
             if (isset($_SESSION['btkModuleErrorMessage_Index']) && ($action === 'index' || $action === '')) { 
                $smarty->assign('errorMessage_index', $_SESSION['btkModuleErrorMessage_Index']);
                unset($_SESSION['btkModuleErrorMessage_Index']);
            }

            switch ($action) {
                case 'index':
                case '': 
                    $allYetkiTurleriForStatus = Capsule::table('mod_btk_yetki_turleri')->get(['yetki_kodu', 'yetki_adi']);
                    $smarty->assign('allYetkiTurleriForStatus', $allYetkiTurleriForStatus); 
                    $smarty->assign('config', (object)$configDataForPage);
                    $smarty->assign('ftp_status_initial_message', $_ADDONLANG['btkreports_ftp_status_checking'] ?? 'FTP durumu kontrol ediliyor...');
                    $smarty->display('index.tpl');
                    break;
                case 'config':
                    if ($_SERVER['REQUEST_METHOD'] === 'POST' && $validateCsrf() ) { 
                        $operatorName = _btkSanitizeString($_POST['operatorName'] ?? '');
                        $operatorCode = _btkSanitizeString($_POST['operatorCode'] ?? '', true); 
                        $operatorUnvani = _btkSanitizeString($_POST['operator_unvani'] ?? '');
                        $formErrors = [];
                        if (strlen($operatorCode) === 0) { $formErrors[] = $_ADDONLANG['btkreports_config_operator_code_error_required'] ?? 'Operatör kodu boş bırakılamaz!'; } 
                        elseif (!preg_match('/^\d{3}$/', $operatorCode)) { $formErrors[] = $_ADDONLANG['btkreports_config_operator_code_error_format'] ?? 'Operatör kodu 3 haneli bir sayı olmalıdır!';}
                        if (empty(_btkSanitizeString($_POST['ftp_host'] ?? ''))) { $formErrors[] = $_ADDONLANG['btkreports_config_ftp_host_error_required'] ?? 'FTP Sunucu Adresi boş bırakılamaz!'; }
                        if (empty(_btkSanitizeString($_POST['ftp_username'] ?? ''))) { $formErrors[] = $_ADDONLANG['btkreports_config_ftp_username_error_required'] ?? 'FTP Kullanıcı Adı boş bırakılamaz!';}

                        if (empty($formErrors)) {
                            $activeAuthTypes = isset($_POST['active_auth_types']) && is_array($_POST['active_auth_types']) ? array_map('_btkSanitizeString', $_POST['active_auth_types']) : [];
                            $ftpHost = _btkSanitizeString($_POST['ftp_host'] ?? ''); $ftpUsername = _btkSanitizeString($_POST['ftp_username'] ?? ''); $ftpPassword = $_POST['ftp_password']; 
                            $ftpRehberPath = _btkSanitizeString($_POST['ftp_rehber_path'] ?? '/REHBER/'); $ftpHareketPath = _btkSanitizeString($_POST['ftp_hareket_path'] ?? '/HAREKET/'); $personelFtpPath = _btkSanitizeString($_POST['personel_ftp_path'] ?? '/PERSONEL/');
                            $sendEmptyFile = isset($_POST['send_empty_file']) ? '1' : '0'; $deleteDataOnUninstall = isset($_POST['delete_data_on_uninstall']) ? '1' : '0';
                            btkreports_save_config('operator_name', $operatorName); btkreports_save_config('operator_code', $operatorCode); btkreports_save_config('operator_unvani', $operatorUnvani); btkreports_save_config('active_auth_types', json_encode($activeAuthTypes));
                            btkreports_save_config('ftp_host', $ftpHost); btkreports_save_config('ftp_username', $ftpUsername);
                            if (!empty($ftpPassword) && $ftpPassword !== '********') { $encryptedPassword = encrypt($ftpPassword); btkreports_save_config('ftp_password', $encryptedPassword); }
                            btkreports_save_config('ftp_rehber_path', $ftpRehberPath); btkreports_save_config('ftp_hareket_path', $ftpHareketPath); btkreports_save_config('personel_ftp_path', $personelFtpPath);
                            btkreports_save_config('send_empty_file', $sendEmptyFile); btkreports_save_config('delete_data_on_uninstall', $deleteDataOnUninstall); btkreports_save_config('last_config_update', date('Y-m-d H:i:s'));
                            if (function_exists('btkreports_log_activity')) btkreports_log_activity("BTK Config: Settings saved by admin " . btkreports_get_current_admin_username(), 0);
                            $_SESSION['btkModuleSuccessMessage'] = $_ADDONLANG['btkreports_config_save_success'];
                            ob_end_clean(); 
                            header("Location: " . $modulelink . "&action=index"); 
                            exit;
                        } else {
                             $smarty->assign('errorMessage', implode('<br>', $formErrors));
                            $configDataForPage['operator_name'] = $operatorName; $configDataForPage['operator_code'] = _btkSanitizeString($_POST['operatorCode'] ?? ''); $configDataForPage['operator_unvani'] = $operatorUnvani;
                            $configDataForPage['active_auth_types'] = isset($_POST['active_auth_types']) && is_array($_POST['active_auth_types']) ? array_map('_btkSanitizeString', $_POST['active_auth_types']) : [];
                            $configDataForPage['ftp_host'] = _btkSanitizeString($_POST['ftp_host'] ?? ''); $configDataForPage['ftp_username'] = _btkSanitizeString($_POST['ftp_username'] ?? '');
                            $configDataForPage['ftp_rehber_path'] = _btkSanitizeString($_POST['ftp_rehber_path'] ?? '/REHBER/'); $configDataForPage['ftp_hareket_path'] = _btkSanitizeString($_POST['ftp_hareket_path'] ?? '/HAREKET/'); $configDataForPage['personel_ftp_path'] = _btkSanitizeString($_POST['personel_ftp_path'] ?? '/PERSONEL/');
                            $configDataForPage['send_empty_file'] = isset($_POST['send_empty_file']) ? '1' : '0'; $configDataForPage['delete_data_on_uninstall'] = isset($_POST['delete_data_on_uninstall']) ? '1' : '0';
                        }
                    } 
                    $smarty->assign('config', (object)$configDataForPage);
                    $allYetkiTurleri = Capsule::table('mod_btk_yetki_turleri')->orderBy('yetki_adi')->get();
                    $smarty->assign('allYetkiTurleri', $allYetkiTurleri);
                    $smarty->display('config.tpl');
                    break;
                
                case 'getFtpStatus': 
                    ob_end_clean(); 
                    ob_start(); 
                    header('Content-Type: application/json; charset=utf-8');
                    $logContextAjax = "AJAX getFtpStatus:";
                    
                    $submittedToken = $_POST['token'] ?? ''; 
                    if (!check_token("WHMCS.admin.default", $submittedToken)) {
                        btkreports_log_activity("{$logContextAjax} - Invalid CSRF token for POST. Submitted: " . htmlspecialchars($submittedToken), null, null, "FTP_ERROR_CSRF");
                        ob_end_clean(); 
                        echo json_encode(['success' => false, 'message' => 'Geçersiz güvenlik anahtarı (CSRF). Sayfayı yenileyip tekrar deneyin.']);
                        exit;
                    }
                    btkreports_log_activity("{$logContextAjax} - CSRF token validated for POST.", null, null, "FTP_DEBUG");

                    $ftpHost = _btkSanitizeString($_POST['ftp_host'] ?? '');
                    $ftpUsername = _btkSanitizeString($_POST['ftp_username'] ?? '');
                    $ftpPassword = $_POST['ftp_password'] ?? ''; 
                    $ftpPathForTest = _btkSanitizeString($_POST['ftp_path_to_test'] ?? '/'); 

                    if (empty($ftpHost) && empty($ftpUsername) && !isset($_POST['ftp_host'])) { 
                        $configCurrent = btkreports_get_all_config();
                        $ftpHost = $configCurrent['ftp_host'] ?? '';
                        $ftpUsername = $configCurrent['ftp_username'] ?? '';
                        $ftpPassword = $configCurrent['ftp_password_decrypted'] ?? '';
                        $ftpPathForTest = $configCurrent['ftp_rehber_path'] ?? '/';
                        btkreports_log_activity("{$logContextAjax} - FTP params taken from DB (likely index page status check). Host: {$ftpHost}", null, null, "FTP_DEBUG");
                    } elseif ($ftpPassword === '********') { 
                        $configCurrent = btkreports_get_all_config();
                        $ftpPassword = $configCurrent['ftp_password_decrypted'] ?? '';
                        btkreports_log_activity("{$logContextAjax} - FTP Password was placeholder from POST, using decrypted from DB if available.", null, null, "FTP_DEBUG");
                    }
                    
                    $result = ['success' => false, 'message' => ($_ADDONLANG['btkreports_ftp_status_passive'] ?? 'PASİF') . ' - ' . ($_ADDONLANG['btkreports_ftp_status_not_configured'] ?? 'Ayarlanmadı')];
                    if (!empty($ftpHost) && !empty($ftpUsername)) {
                        btkreports_log_activity("{$logContextAjax} - Calling btkreports_test_ftp_connection with Host:{$ftpHost}, User:{$ftpUsername}, Path:{$ftpPathForTest}, Upload:true", null, null, "FTP_DEBUG");
                        $testResult = btkreports_test_ftp_connection($ftpHost, $ftpUsername, $ftpPassword, $ftpPathForTest, true); 
                        btkreports_log_activity("{$logContextAjax} - btkreports_test_ftp_connection returned: " . print_r($testResult, true), null, null, "FTP_DEBUG_RESULT");
                        
                        $result['message'] = $testResult['message'] ?? 'Bilinmeyen FTP Hatası'; 
                        if($testResult['success']){ 
                            $result['success'] = true;
                            $result['message'] = ($_ADDONLANG['btkreports_ftp_status_active'] ?? 'AKTİF') . ' - ' . $result['message']; 
                        } else { 
                            $result['success'] = false;
                            $result['message'] = ($_ADDONLANG['btkreports_ftp_status_passive_error'] ?? 'PASİF') . ': ' . $result['message']; 
                        }
                    } else {
                        btkreports_log_activity("{$logContextAjax} - FTP Host or Username not provided.", null, null, "FTP_WARN");
                         $result['message'] = $_ADDONLANG['btkreports_config_ftp_error_hostuser'] ?? 'FTP Host ve Kullanıcı Adı eksik.';
                    }
                    
                    $jsonOutput = json_encode($result, JSON_UNESCAPED_UNICODE);
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        btkreports_log_activity("{$logContextAjax} - JSON Encode Error: " . json_last_error_msg() . " - Data: " . print_r($result, true), null, null, "FTP_ERROR_JSON");
                        ob_end_clean(); 
                        echo json_encode(['success' => false, 'message' => 'Sunucu yanıtı işlenirken bir hata oluştu (JSON). Hata: ' . json_last_error_msg()]);
                        exit;
                    }

                    ob_end_clean(); 
                    echo $jsonOutput;
                    exit; 
                
                case 'productGroupMappings': $smarty->assign('config', (object)$configDataForPage); $productGroups = Capsule::table('tblproductgroups')->leftJoin('mod_btk_product_mappings', 'tblproductgroups.id', '=', 'mod_btk_product_mappings.whmcs_product_group_id')->select('tblproductgroups.id as gid', 'tblproductgroups.name as groupname', 'mod_btk_product_mappings.btk_yetki_turu_kodu', 'mod_btk_product_mappings.default_btk_hizmet_tipi_kodu')->orderBy('tblproductgroups.order')->get(); $activeAuthTypes = $configDataForPage['active_auth_types']; $availableYetkiTurleri = Capsule::table('mod_btk_yetki_turleri')->whereIn('yetki_kodu', $activeAuthTypes)->orderBy('yetki_adi')->get(); $allHizmetTipleri = Capsule::table('mod_btk_hizmet_tipleri')->orderBy('deger_aciklama')->get(); $hizmetTipleriByYetki = []; foreach($allHizmetTipleri as $ht){ $assignedYetkiler = !empty($ht->yetki_turu_kodu) ? explode(',', $ht->yetki_turu_kodu) : $activeAuthTypes; foreach($assignedYetkiler as $yetkiKodu){ $yetkiKodu = trim($yetkiKodu); if(!in_array($yetkiKodu, $activeAuthTypes) && !empty($ht->yetki_turu_kodu)) continue; if(!isset($hizmetTipleriByYetki[$yetkiKodu])){ $hizmetTipleriByYetki[$yetkiKodu] = []; } $hizmetTipleriByYetki[$yetkiKodu][] = ['hizmet_turu' => $ht->hizmet_turu, 'deger_aciklama' => $ht->deger_aciklama]; } } $smarty->assign('productGroups', $productGroups); $smarty->assign('availableYetkiTurleri', $availableYetkiTurleri); $smarty->assign('allHizmetTipleri', $allHizmetTipleri); $smarty->assign('hizmetTipleriByYetkiJson', json_encode($hizmetTipleriByYetki)); if ($_SERVER['REQUEST_METHOD'] === 'POST' && $validateCsrf()) { $mappings = isset($_POST['mappings']) && is_array($_POST['mappings']) ? $_POST['mappings'] : []; foreach ($mappings as $groupId => $map) { $sanitizedGroupId = (int)$groupId; $btkYetkiKodu = _btkSanitizeString($map['btk_yetki_turu_kodu']); $hizmetTipiKodu = !empty($map['default_btk_hizmet_tipi_kodu']) ? _btkSanitizeString($map['default_btk_hizmet_tipi_kodu']) : null; if ($sanitizedGroupId > 0 && !empty($btkYetkiKodu)) { Capsule::table('mod_btk_product_mappings')->updateOrInsert( ['whmcs_product_group_id' => $sanitizedGroupId], [ 'btk_yetki_turu_kodu' => $btkYetkiKodu, 'default_btk_hizmet_tipi_kodu' => $hizmetTipiKodu, 'last_updated' => date('Y-m-d H:i:s') ] ); } } $_SESSION['btkModuleSuccessMessage'] = $_ADDONLANG['btkreports_pgmap_save_success'] ?? 'Eşleştirmeler kaydedildi.'; if (function_exists('btkreports_log_activity')) btkreports_log_activity("BTK Product Mappings: Saved by admin " . btkreports_get_current_admin_username(), 0); ob_end_clean(); header("Location: " . $modulelink . "&action=productGroupMappings&save=success"); exit; } if(isset($_GET['save']) && $_GET['save'] === 'success' && isset($_SESSION['btkModuleSuccessMessage'])) { $smarty->assign('successMessage', $_SESSION['btkModuleSuccessMessage']); unset($_SESSION['btkModuleSuccessMessage']); } $smarty->display('product_group_mappings.tpl'); break;
                case 'getClientBtkDetails': $clientId = isset($_REQUEST['client_id']) ? (int)$_REQUEST['client_id'] : 0; if (!$clientId) { echo "Müşteri ID gerekli."; return; } btkreports_AdminAreaClientSummaryPageTab(['userid' => $clientId], $smarty, $modulelink); break;
                case 'saveClientBtkData': if ($_SERVER['REQUEST_METHOD'] === 'POST' && $validateCsrf()) { $clientId = isset($_POST['client_id']) ? (int)$_POST['client_id'] : 0; if (!$clientId) { /* Hata */ } else { $saveResult = btkreports_save_client_btk_data($_POST, $clientId); $redirectParams = $saveResult['success'] ? "&btktabaction=success&message=" . urlencode($saveResult['message']) : "&btktabaction=error&message=" . urlencode($saveResult['message']); ob_end_clean(); header("Location: clientssummary.php?userid=" . $clientId . $redirectParams . "#btkModuleTab"); exit; } } $smarty->assign('config', (object)$configDataForPage); $smarty->display('index.tpl'); break;
                case 'getServiceBtkDetails': $serviceId = isset($_REQUEST['service_id']) ? (int)$_REQUEST['service_id'] : 0; $clientId = isset($_REQUEST['client_id']) ? (int)$_REQUEST['client_id'] : (Capsule::table('tblhosting')->where('id', $serviceId)->value('userid')); if (!$serviceId || !$clientId) { echo "Hizmet veya Müşteri ID gerekli."; return; } btkreports_AdminAreaViewProductDetailsPage(['serviceid' => $serviceId, 'userid' => $clientId], $smarty, $modulelink); break;
                case 'saveServiceBtkData': if ($_SERVER['REQUEST_METHOD'] === 'POST' && $validateCsrf()) { $serviceId = isset($_POST['service_id']) ? (int)$_POST['service_id'] : 0; $clientId = isset($_POST['client_id']) ? (int)$_POST['client_id'] : 0; if (!$serviceId || !$clientId) { /* Hata */ } else { $saveResult = btkreports_save_service_btk_data($_POST, $serviceId, $clientId); $redirectParams = $saveResult['success'] ? "&btkaction=success&message=" . urlencode($saveResult['message']) : "&btkaction=error&message=" . urlencode($saveResult['message']); ob_end_clean(); header("Location: clientsservices.php?userid=" . $clientId . "&id=" . $serviceId . $redirectParams); exit; } } $smarty->assign('config', (object)$configDataForPage); $smarty->display('index.tpl'); break;
                case 'getIlceler': ob_end_clean(); header('Content-Type: application/json'); $ilId = isset($_GET['il_id']) ? (int)$_GET['il_id'] : 0; if (!$ilId) { echo json_encode(['success' => false, 'message' => $_ADDONLANG['btkreports_ajax_address_error_il'] ?? 'İl seçilmedi.']); exit; } $ilceler = Capsule::table('mod_btk_ilceler')->where('il_id', $ilId)->orderBy('ilce_adi')->get(['id', 'ilce_adi']); if ($ilceler->isEmpty()) { echo json_encode(['success' => false, 'message' => $_ADDONLANG['btkreports_ajax_address_no_ilce_found'] ?? 'İlçe bulunamadı.']); } else { echo json_encode(['success' => true, 'ilceler' => $ilceler]); } exit;
                case 'getMahalleler': ob_end_clean(); header('Content-Type: application/json'); $ilceId = isset($_GET['ilce_id']) ? (int)$_GET['ilce_id'] : 0; if (!$ilceId) { echo json_encode(['success' => false, 'message' => $_ADDONLANG['btkreports_ajax_address_error_ilce'] ?? 'İlçe seçilmedi.']); exit; } $mahalleler = Capsule::table('mod_btk_mahalleler')->where('ilce_id', $ilceId)->orderBy('mahalle_adi')->get(['id', 'mahalle_adi']); if ($mahalleler->isEmpty()) { echo json_encode(['success' => false, 'message' => $_ADDONLANG['btkreports_ajax_address_no_mahalle_found'] ?? 'Mahalle bulunamadı.']); } else { echo json_encode(['success' => true, 'mahalleler' => $mahalleler]); } exit;
                case 'nviTcknDogrula': ob_end_clean(); header('Content-Type: application/json'); if ($_SERVER['REQUEST_METHOD'] === 'POST' && $validateNviCsrf()) { $tckn = _btkSanitizeString($_POST['tckn']); $ad = _btkSanitizeString($_POST['ad']); $soyad = _btkSanitizeString($_POST['soyad']); $dogumYili = (int)$_POST['dogum_yili']; $clientId = (int)$_POST['client_id']; if (empty($tckn) || empty($ad) || empty($soyad) || empty($dogumYili) || !$clientId) { echo json_encode(['success' => false, 'message' => $_ADDONLANG['btkreports_client_nvi_error_fill_fields_tckn']]); exit; } $nviClient = new NviSoapClient(); $result = $nviClient->TCKimlikNoDogrula($tckn, $ad, $soyad, $dogumYili); $nviStatusUpdate = ['nvi_tckn_durum' => $result, 'nvi_tckn_son_dogrulama' => date('Y-m-d H:i:s')]; Capsule::table('mod_btk_clients')->updateOrInsert(['client_id' => $clientId], $nviStatusUpdate); $logMsg = "NVI TCKN Dogrulama " . ($result ? "Basarili" : "Basarisiz") . ": client_id={$clientId}, TCKN={$tckn}"; if (function_exists('btkreports_log_activity')) btkreports_log_activity($logMsg, $clientId, null, $result ? 'NVI_SUCCESS' : 'NVI_FAIL'); echo json_encode(['success' => $result, 'message' => $result ? $_ADDONLANG['btkreports_client_nvi_tckn_success'] : $_ADDONLANG['btkreports_client_nvi_tckn_fail']]); } else { echo json_encode(['success' => false, 'message' => $_ADDONLANG['btkreports_csrf_error'] ?? 'Geçersiz istek veya CSRF token.']); } exit;
                case 'nviYknDogrula': ob_end_clean(); header('Content-Type: application/json'); if ($_SERVER['REQUEST_METHOD'] === 'POST' && $validateNviCsrf()) { $ykn = _btkSanitizeString($_POST['ykn']); $ad = _btkSanitizeString($_POST['ad']); $soyad = _btkSanitizeString($_POST['soyad']); $dogumGun = (int)$_POST['dogum_gun']; $dogumAy = (int)$_POST['dogum_ay']; $dogumYil = (int)$_POST['dogum_yil']; $clientId = (int)$_POST['client_id']; if (empty($ykn) || empty($ad) || empty($soyad) || empty($dogumGun) || empty($dogumAy) || empty($dogumYil) || !$clientId) { echo json_encode(['success' => false, 'message' => $_ADDONLANG['btkreports_client_nvi_error_fill_fields_ykn']]); exit; } $nviClient = new NviSoapClient(); $result = $nviClient->YabanciKimlikNoDogrula($ykn, $ad, $soyad, $dogumGun, $dogumAy, $dogumYil); $nviStatusUpdate = ['nvi_ykn_durum' => $result, 'nvi_ykn_son_dogrulama' => date('Y-m-d H:i:s')]; Capsule::table('mod_btk_clients')->updateOrInsert(['client_id' => $clientId], $nviStatusUpdate); $logMsg = "NVI YKN Dogrulama " . ($result ? "Basarili" : "Basarisiz") . ": client_id={$clientId}, YKN={$ykn}"; if (function_exists('btkreports_log_activity')) btkreports_log_activity($logMsg, $clientId, null, $result ? 'NVI_SUCCESS' : 'NVI_FAIL'); echo json_encode(['success' => $result, 'message' => $result ? $_ADDONLANG['btkreports_client_nvi_ykn_success'] : $_ADDONLANG['btkreports_client_nvi_ykn_fail']]); } else { echo json_encode(['success' => false, 'message' => $_ADDONLANG['btkreports_csrf_error'] ?? 'Geçersiz istek veya CSRF token.']); } exit;
                case 'logs': $smarty->assign('config', (object)$configDataForPage); $page = isset($_GET['page']) ? (int)$_GET['page'] : 1; $limit = 25; $offset = ($page - 1) * $limit; $logQuery = Capsule::table('mod_btk_logs'); $filterDesc = isset($_GET['filter_description']) ? _btkSanitizeString($_GET['filter_description']) : ''; $filterUser = isset($_GET['filter_username']) ? _btkSanitizeString($_GET['filter_username']) : ''; if (!empty($filterDesc)) { $logQuery->where('description', 'LIKE', '%' . $filterDesc . '%'); } if (!empty($filterUser)) { $adminUserDb = Capsule::table('tbladmins')->where('username', $filterUser)->first(['id']); if ($adminUserDb) { $logQuery->where('user_id', $adminUserDb->id); } else { $logQuery->where('user_id', -1); } } $smarty->assign('filter_description', $filterDesc); $smarty->assign('filter_username', $filterUser); $totalLogs = $logQuery->count(); $logs = $logQuery->orderBy('log_time', 'desc')->skip($offset)->take($limit)->get(); $adminIds = $logs->pluck('user_id')->filter()->unique()->toArray(); $admins = []; if (!empty($adminIds)) { $adminUsersResult = Capsule::table('tbladmins')->whereIn('id', $adminIds)->get(['id', 'username']); foreach ($adminUsersResult as $adminUserObj) { $admins[$adminUserObj->id] = $adminUserObj->username; } } $smarty->assign('logs', $logs); $smarty->assign('admins', $admins); $smarty->assign('totalPages', ceil($totalLogs / $limit)); $smarty->assign('currentPage', $page); if(isset($_GET['deletesuccess'])){ $smarty->assign('successMessage', $_ADDONLANG['btkreports_logs_delete_success']); } if(isset($_GET['deleteerror']) && isset($_GET['message'])){ $smarty->assign('errorMessage', ($_ADDONLANG['btkreports_logs_delete_error'] ?? 'Loglar silinirken hata: ') . _btkSanitizeString($_GET['message'])); } $smarty->display('logs.tpl'); break;
                case 'deleteLogs': if ($_SERVER['REQUEST_METHOD'] === 'POST' && $validateCsrf()) { try { Capsule::table('mod_btk_logs')->truncate(); if (function_exists('btkreports_log_activity')) btkreports_log_activity("BTK Logs: All logs deleted by admin " . btkreports_get_current_admin_username(), 0, null, 'INFO'); ob_end_clean(); header("Location: " . $modulelink . "&action=logs&deletesuccess=1"); exit; } catch (Exception $e) { if (function_exists('btkreports_log_activity')) btkreports_log_activity("BTK Logs: Error deleting logs - " . $e->getMessage(), 0, null, 'ERROR'); ob_end_clean(); header("Location: " . $modulelink . "&action=logs&deleteerror=1&message=".urlencode($e->getMessage())); exit; } } ob_end_clean(); header("Location: " . $modulelink . "&action=logs"); exit;
                case 'generate': $smarty->assign('config', (object)$configDataForPage); if ($_SERVER['REQUEST_METHOD'] === 'POST' && $validateCsrf()) { $reportType = _btkSanitizeString($_POST['report_type']); $generateAction = _btkSanitizeString($_POST['generate_action']); $fileName = null; $fileContent = null; $configDataCurrent = btkreports_get_all_config(); if ($reportType === 'rehber') { list($fileName, $fileContent) = btkreports_generate_rehber_file($configDataCurrent); } elseif ($reportType === 'hareket') { $hareketBaslangic = !empty($_POST['date_from']) ? _btkSanitizeString($_POST['date_from']) . ' 00:00:00' : null; $hareketBitis = !empty($_POST['date_to']) ? _btkSanitizeString($_POST['date_to']) . ' 23:59:59' : null; list($fileName, $fileContent) = btkreports_generate_hareket_file($configDataCurrent, $hareketBaslangic, $hareketBitis, true); } if ($fileName && $fileContent !== null) { if (function_exists('btkreports_log_activity')) btkreports_log_activity("BTK Manual Generate: {$fileName} created.", 0); if ($generateAction === 'generate_download') { $gzFileName = str_replace('.ABN', '.ABN.gz', $fileName); $gzippedContent = gzencode((string)$fileContent, 9); if ($gzippedContent === false) { $smarty->assign('errorMessage', ($_ADDONLANG['btkreports_generate_error'] ?? 'Rapor oluşturulurken hata oluştu.') . " Gzip sıkıştırma hatası."); } else { header('Content-Description: File Transfer'); header('Content-Type: application/gzip'); header('Content-Disposition: attachment; filename="' . $gzFileName . '"'); header('Expires: 0'); header('Cache-Control: must-revalidate'); header('Pragma: public'); header('Content-Length: ' . strlen($gzippedContent)); ob_end_clean(); echo $gzippedContent; exit; } } elseif ($generateAction === 'generate_ftp') { $ftpResult = btkreports_upload_to_ftp($fileName, $fileContent, $configDataCurrent, $reportType); if ($ftpResult['success']) { $smarty->assign('successMessage', ($_ADDONLANG['btkreports_generate_success_ftp'] ?? 'Rapor başarıyla oluşturuldu ve FTP\'ye yüklendi') . " (" . $fileName . ")"); } else { $smarty->assign('errorMessage', ($_ADDONLANG['btkreports_generate_error'] ?? 'Rapor oluşturulurken hata oluştu.') . $ftpResult['message']); } } } else { $sendEmptyFileConfig = $configDataCurrent['send_empty_file'] ?? '0'; $fileContentIsNull = ($fileContent === null); $fileContentIsEmptyString = ($fileContent === ""); $noDataMessage = ($reportType === 'hareket' ? ($_ADDONLANG['btkreports_report_no_movement_data'] ?? "Raporlanacak hareket bulunamadı.") : ($_ADDONLANG['btkreports_report_no_subscriber_data'] ?? "Raporlanacak abone bulunamadı.")); $errorFileName = $fileName ?: 'BilinmeyenDosya.ABN'; if ( ($fileContentIsNull || $fileContentIsEmptyString) && $sendEmptyFileConfig !== '1' ) { $smarty->assign('errorMessage', ($_ADDONLANG['btkreports_generate_error'] ?? 'Rapor oluşturulurken hata oluştu.') . $noDataMessage); } elseif ($fileContentIsEmptyString && $sendEmptyFileConfig === '1') { if($generateAction === 'generate_ftp'){ $ftpResult = btkreports_upload_to_ftp($errorFileName, $fileContent, $configDataCurrent, $reportType); if ($ftpResult['success']) { $smarty->assign('successMessage', ($_ADDONLANG['btkreports_generate_success_ftp'] ?? 'Rapor başarıyla oluşturuldu ve FTP\'ye yüklendi') . " (" . ($_ADDONLANG['btkreports_empty_file'] ?? 'Boş dosya') . ": " . $errorFileName . ")"); } else { $smarty->assign('errorMessage', ($_ADDONLANG['btkreports_generate_error'] ?? 'Rapor oluşturulurken hata oluştu.') . $ftpResult['message']); } } elseif ($generateAction === 'generate_download'){ $smarty->assign('infoMessage', str_replace('{fileName}', $errorFileName, ($_ADDONLANG['btkreports_empty_report_download_info'] ?? "Boş rapor dosyası oluşturuldu ({fileName}), indirmek için anlamlı değil."))); } } else { $smarty->assign('errorMessage', ($_ADDONLANG['btkreports_generate_error'] ?? 'Rapor oluşturulurken hata oluştu.') . ($_ADDONLANG['btkreports_report_generation_failed'] ?? "Rapor oluşturulamadı.")); } } } $smarty->display('generate.tpl'); break;
                case 'viewReadme': $readmePath = __DIR__ . DIRECTORY_SEPARATOR . 'README.md'; $readmeContent = ''; if (file_exists($readmePath)) { $readmeContent = file_get_contents($readmePath); } $smarty->assign('readme_content', $readmeContent); $smarty->assign('config', (object)$configDataForPage); $smarty->display('index.tpl'); break; 
                case 'personelList': case 'syncPersonelSuccess': case 'syncPersonelError': case 'deletePersonelSuccess': case 'deletePersonelError': $personelListesi = Capsule::table('mod_btk_personel')->orderBy('adi')->orderBy('soyadi')->get(); $smarty->assign('personelListesi', $personelListesi); if ($action === 'syncPersonelSuccess') $smarty->assign('syncResultMsg', $_ADDONLANG['btkreports_personnel_sync_success_msg'] ?? 'Personel listesi başarıyla senkronize edildi.'); if ($action === 'syncPersonelError') $smarty->assign('syncResultMsg', $_ADDONLANG['btkreports_personnel_sync_error_msg'] ?? 'Personel senkronizasyonu sırasında hata oluştu.'); $smarty->assign('config', (object)$configDataForPage); $smarty->display('personel.tpl'); break;
                case 'personelEdit': $personelId = isset($_GET['pid']) ? (int)$_GET['pid'] : 0; $personelData = null; if ($personelId > 0) { $personelData = Capsule::table('mod_btk_personel')->find($personelId); } $smarty->assign('personelData', $personelData ? (object)$personelData : null); $smarty->assign('config', (object)$configDataForPage); $smarty->display('personel.tpl'); break;
                case 'savePersonelData': if ($_SERVER['REQUEST_METHOD'] === 'POST' && $validateCsrf()) { /* ... (savePersonelData içeriği önceki gibi) ... */ } $smarty->assign('config', (object)$configDataForPage); $smarty->display('personel.tpl'); break;
                case 'deletePersonel': if ($validateCsrf()) { /* ... (deletePersonel içeriği önceki gibi) ... */ } ob_end_clean(); header("Location: " . $modulelink . "&action=personelList"); exit;
                case 'syncPersonel': if ($validateCsrf()) { /* ... (syncPersonel içeriği önceki gibi) ... */ } ob_end_clean(); header("Location: " . $modulelink . "&action=personelList"); exit;


                default:
                    if (ob_get_length()) ob_end_clean(); 
                    $_SESSION['btkModuleErrorMessage_Index'] = "Bilinmeyen action: '" . htmlspecialchars($action) . "'. Lütfen geçerli bir sayfa seçin.";
                    header("Location: " . $modulelink . "&action=index");
                    exit;
            }
        } catch (SmartyException $e) { 
            if (ob_get_length()) ob_end_clean(); 
            $errorMsg = "Smarty Template Hatası ({$action}): " . $e->getMessage() . " - Template: " . (isset($e->template_resource) ? $e->template_resource : 'N/A'); 
            if (function_exists('btkreports_log_activity')) btkreports_log_activity("BTK Output Smarty ERROR: " . $errorMsg, 0, null, 'ERROR'); 
            echo $errorMsg . " Sistem loglarını kontrol edin.";
        } catch (Exception $e) { 
            if (ob_get_length()) ob_end_clean(); 
            $errorMsg = "Genel PHP Hatası ({$action}): " . $e->getMessage() . " - File: " . $e->getFile() . " - Line: " . $e->getLine(); 
            if (function_exists('btkreports_log_activity')) btkreports_log_activity("BTK Output General ERROR: " . $errorMsg, 0, null, 'ERROR'); 
            echo $errorMsg . " Sistem loglarını kontrol edin."; 
        }
        if (ob_get_length() && !in_array($action, ['getFtpStatus', 'getIlceler', 'getMahalleler', 'nviTcknDogrula', 'nviYknDogrula']) && !($action === 'generate' && isset($_POST['generate_action']) && $_POST['generate_action'] === 'generate_download') ) {
             ob_end_flush();
        } elseif (ob_get_length()) { 
            ob_end_clean();
        }
    }
}

if (!function_exists('btkreports_AdminAreaHeadOutput')) {
    function btkreports_AdminAreaHeadOutput($vars) {
        global $CONFIG;
        $moduleNameFromUrl = isset($_GET['module']) ? _btkSanitizeString($_GET['module']) : ''; 
        $output = '';
        if ($moduleNameFromUrl === 'btkreports') {
            $adminFolderName = btkreports_get_admin_folder_name(); 
            $whmcsSystemUrl = rtrim($CONFIG['SystemURL'], '/'); 
            $adminFullUrl = $whmcsSystemUrl . '/' . $adminFolderName . '/'; 
            $jsModuleLink = $adminFullUrl . $vars['modulelink'];

            $moduleAssetsPath = $whmcsSystemUrl . '/modules/addons/btkreports/assets/'; 
            $moduleConfig = btkreports_config();
            $moduleVersion = $moduleConfig['version'] ?? '1.0.0';

            $output .= '<script type="text/javascript">var btkFullModuleLink = "' . htmlspecialchars($jsModuleLink, ENT_QUOTES, 'UTF-8') . '";</script>';
            $output .= '<script type="text/javascript">var btkAdminUrl = "' . htmlspecialchars($adminFullUrl, ENT_QUOTES, 'UTF-8') . '";</script>'; 
            $output .= '<script type="text/javascript">var btkCsrfToken = "' . (function_exists('generate_token') ? generate_token('plain') : '') . '";</script>';
            
            $jsLang = [];
            $keysToExport = [
                'btkreports_ftp_status_checking', 'btkreports_ftp_status_active', 'btkreports_ftp_status_passive',
                'btkreports_ftp_status_not_configured', 'btkreports_ftp_status_passive_error', 'btkreports_ftp_status_unknown',
                'btkreports_ftp_test_fail_ajax', 'btkreports_ftp_error_timeout', 'btkreports_ftp_error_unknown',
                'btkreports_config_ftp_testing', 'btkreports_personnel_sync_inprogress', 'btkreports_generating_report',
                'btkreports_select_option_ilce', 'btkreports_select_option_mahalle', 'btkreports_client_nvi_error_fill_fields_tckn',
                'btkreports_download_report', 'btkreports_error_unknown', 'btkreports_error_server_report_generation',
                'btkreports_tab_home', 'btkreports_tab_settings', 'btkreports_tab_product_mappings', 
                'btkreports_tab_generate_report', 'btkreports_tab_personnel', 'btkreports_tab_logs',
                'btkreports_link_readme_desc', 'btkreports_link_readme'
            ];
            global $_ADDONLANG; 
            if(empty($_ADDONLANG) && file_exists(__DIR__ . '/lang/turkish.php')) require_once __DIR__ . '/lang/turkish.php';

            foreach($keysToExport as $key) {
                if (isset($_ADDONLANG[$key])) { 
                    $jsLang[$key] = $_ADDONLANG[$key]; 
                }
            }
            $output .= '<script type="text/javascript">var btkLang = ' . json_encode($jsLang, JSON_UNESCAPED_UNICODE) . ';</script>';

            $cssFilePath = $moduleAssetsPath . 'css/btk_admin_style.css';
            $output .= '<link href="' . htmlspecialchars($cssFilePath) . '?v=' . $moduleVersion . '" rel="stylesheet" type="text/css" />' . PHP_EOL;
            
            $jsFilePath = $moduleAssetsPath . 'js/btk_admin_scripts.js';
            $output .= '<script type="text/javascript" src="' . htmlspecialchars($jsFilePath) . '?v=' . $moduleVersion . '"></script>' . PHP_EOL;
        }
        return $output;
    }
}
?>