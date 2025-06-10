<?php

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

use WHMCS\Database\Capsule;
// WHMCS Smarty sınıfını dahil et
$whmcsRootDir = dirname(__DIR__, 3); // modules/addons/btkreports -> modules/addons -> modules -> WHMCS KÖK

if (file_exists($whmcsRootDir . '/includes/smarty/Smarty.class.php')) {
    require_once $whmcsRootDir . '/includes/smarty/Smarty.class.php';
} elseif (file_exists($whmcsRootDir . '/vendor/smarty/smarty/libs/Smarty.class.php')) {
    require_once $whmcsRootDir . '/vendor/smarty/smarty/libs/Smarty.class.php';
} else {
    logActivity("BTK Raporlama Modülü: Smarty sınıfı bulunamadı. WHMCS Path: " . $whmcsRootDir, 0);
    // Smarty olmadan arayüz gösterilemeyeceği için burada kritik bir durum oluşabilir.
    // Ancak modülün diğer fonksiyonları (cron vb.) çalışmaya devam edebilir.
}


/**
 * Define addon module configuration parameters.
 *
 * @return array
 */
function btkreports_config()
{
    return [
        'name' => 'BTK Raporlama Modülü',
        'description' => 'BTK için yasal raporları oluşturma ve yönetme modülü. (Geliştiren: KABLOSUZONLINE)',
        'author' => '<a href="https://www.kablosuzonline.com.tr/wisp/" target="_blank">KABLOSUZONLINE</a>',
        'language' => 'turkish',
        'version' => '0.5.3', // Versiyonu güncel tutun
        'fields' => [
            'docs_link' => [
                'FriendlyName' => 'Dökümantasyon',
                'Type' => 'button',
                'Description' => '<a href="https://github.com/kablosuzonline/WHMS-BTK-MODUL/blob/main/WHMS-BTK-MODUL/README.md" target="_blank" class="btn btn-info">Kullanım Kılavuzu ve Sürüm Notları</a>',
            ],
            'initial_setup_info' => [
                'FriendlyName' => 'İlk Kurulum Notları',
                'Type' => 'info',
                'Description' => 'Modülün tam fonksiyonel çalışabilmesi için, lütfen "Eklentiler > BTK Raporlama Modülü" menüsünden "Yapılandırma" sayfasına giderek gerekli tüm ayarları (Operatör Bilgileri, FTP Ayarları, Yetki Türleri vb.) yapınız. Modül varsayılan yönetici kullanıcı adı "btkadmin" ve şifresi "P@$$wOrd123" olarak ayarlanmıştır. Lütfen bu bilgileri ilk fırsatta Yapılandırma sayfasından değiştiriniz. Adres verilerinin yüklenmesi aktivasyon sırasında biraz zaman alabilir.',
            ],
        ]
    ];
}

/**
 * Activate a module.
 *
 * @return array Optional success/failure message
 */
function btkreports_activate()
{
    try {
        @set_time_limit(0);
        @ini_set('memory_limit', '1024M');
        @ini_set('mysql.connect_timeout', '300');
        @ini_set('default_socket_timeout', '300');

        $sql_file_install = __DIR__ . '/sql/install.sql';
        if (file_exists($sql_file_install)) {
            $sql_commands_install = file_get_contents($sql_file_install);
            $sql_array_install = array_filter(array_map('trim', preg_split("/;\s*(?:\r\n|\n|\r)/", $sql_commands_install)));
            foreach ($sql_array_install as $command) {
                if (!empty($command)) {
                    Capsule::statement($command);
                }
            }
            logActivity("BTK Raporlama Modülü: install.sql başarıyla çalıştırıldı.", 0);
        } else {
            return ['status' => 'error', 'description' => 'Kurulum SQL dosyası (install.sql) bulunamadı: ' . $sql_file_install];
        }

        $sql_file_reference = __DIR__ . '/sql/initial_reference_data.sql';
        if (file_exists($sql_file_reference)) {
            $sql_commands_reference = file_get_contents($sql_file_reference);
            $sql_commands_reference = preg_replace('/^\xEF\xBB\xBF/', '', $sql_commands_reference);
            $sql_array_reference = array_filter(array_map('trim', preg_split("/;\s*(?:\r\n|\n|\r)/", $sql_commands_reference)));
            logActivity("BTK Raporlama Modülü: initial_reference_data.sql dosyasındaki " . count($sql_array_reference) . " komut çalıştırılmaya başlanıyor...", 0);
            $executed_count = 0;
            $batch_size = 500;
            $current_batch_commands_string = ""; // Komutları biriktir
            $commands_in_batch = 0;

            foreach ($sql_array_reference as $command_ref) {
                if (!empty($command_ref)) {
                    $current_batch_commands_string .= $command_ref . ";\n";
                    $commands_in_batch++;
                    if ($commands_in_batch >= $batch_size) {
                        try {
                            Capsule::unprepared($current_batch_commands_string); // Biriktirilmiş komutları çalıştır
                            $executed_count += $commands_in_batch;
                        } catch (\Exception $e_ref_batch) {
                            logActivity("BTK Raporlama Modülü: initial_reference_data.sql toplu komut çalıştırılırken hata: " . $e_ref_batch->getMessage(), 0);
                        }
                        $current_batch_commands_string = "";
                        $commands_in_batch = 0;
                        @set_time_limit(60);
                    }
                }
            }
            if (!empty($current_batch_commands_string)) {
                 try {
                    Capsule::unprepared($current_batch_commands_string);
                    $executed_count += $commands_in_batch;
                } catch (\Exception $e_ref_batch) {
                     logActivity("BTK Raporlama Modülü: initial_reference_data.sql son toplu komut çalıştırılırken hata: " . $e_ref_batch->getMessage(), 0);
                }
            }
            logActivity("BTK Raporlama Modülü: initial_reference_data.sql dosyasından yaklaşık " . $executed_count . " komut işlendi.", 0);
        } else {
            logActivity("BTK Raporlama Modülü: Adres referans veri SQL dosyası (initial_reference_data.sql) bulunamadı.", 0);
        }
        return ['status' => 'success', 'description' => 'BTK Raporlama Modülü başarıyla etkinleştirildi.'];
    } catch (\Exception $e) {
        logActivity("BTK Raporlama Modülü Aktivasyon Hatası: " . $e->getMessage() . " - Satır: " . $e->getLine() . " - Dosya: " . $e->getFile(), 0);
        return ['status' => "error", 'description' => "Modül etkinleştirilirken bir hata oluştu: " . $e->getMessage()];
    }
}

/**
 * Deactivate a module.
 */
function btkreports_deactivate()
{
    try {
        // Helper'ı include etmeden önce var olup olmadığını kontrol et
        if (file_exists(__DIR__ . '/lib/BtkHelper.php')) {
            require_once __DIR__ . '/lib/BtkHelper.php';
            $btkHelper = new BtkHelper([]);
            $delete_tables = $btkHelper->get_config('delete_tables_on_deactivate');
        } else {
            // Helper yoksa, tabloları silme ayarına ulaşılamaz, varsayılan olarak silme.
            $delete_tables = '0'; // Güvenli varsayılan
            logActivity("BTK Raporlama Modülü: BtkHelper.php bulunamadı, devre dışı bırakmada tablolar korunacak.", 0);
        }


        if ($delete_tables == '1') {
            try { Capsule::statement('SET FOREIGN_KEY_CHECKS=0;'); } catch (\Exception $exfk) { /* noop */ }
            $tables_to_drop = [
                'mod_btk_abone_hareket_canli', 'mod_btk_abone_hareket_arsiv', 'mod_btk_personel',
                'mod_btk_adres_mahalle', 'mod_btk_adres_ilce', 'mod_btk_config',
                'mod_btk_secilen_yetki_turleri', 'mod_btk_abone_rehber', 'mod_btk_personel_departmanlari',
                'mod_btk_gonderim_gecmisi', 'mod_btk_logs', 'mod_btk_iss_pop_noktalari',
                'mod_btk_adres_il'
            ];
            foreach ($tables_to_drop as $table_name) {
                if (Capsule::schema()->hasTable($table_name)) {
                    Capsule::schema()->drop($table_name);
                }
            }
            try { Capsule::statement('SET FOREIGN_KEY_CHECKS=1;'); } catch (\Exception $exfk) { /* noop */ }
            $message = 'BTK Raporlama Modülü başarıyla devre dışı bırakıldı ve ilgili veritabanı tabloları silindi.';
        } else {
            $message = 'BTK Raporlama Modülü başarıyla devre dışı bırakıldı. Veritabanı tabloları korunmuştur.';
        }
        unset($_SESSION['btk_admin_authed']);
        return ['status' => 'success', 'description' => $message];
    } catch (\Exception $e) {
        logActivity("BTK Raporlama Modülü Devre Dışı Bırakma Hatası: " . $e->getMessage(), 0);
        try { Capsule::statement('SET FOREIGN_KEY_CHECKS=1;'); } catch (\Exception $exfk) { /* noop */ }
        return ['status' => "error", 'description' => "Modül devre dışı bırakılırken bir hata oluştu: " . $e->getMessage()];
    }
}

/**
 * Upgrade a module.
 */
function btkreports_upgrade($vars)
{
    $currentVersion = $vars['version']; // Modülün DB'deki mevcut versiyonu (eğer saklanıyorsa) veya dosyadaki eski versiyonu
    $newVersion = btkreports_config()['version']; // Dosyadaki yeni versiyon

    logActivity("BTK Raporlama Modülü: Güncelleme fonksiyonu çalıştırıldı. Eski Sürüm: $currentVersion, Yeni Sürüm: $newVersion", 0);

    // Örnek güncelleme mantığı (versiyona göre)
    // if (version_compare($currentVersion, '0.6.0', '<')) {
    //     // 0.6.0 için gerekli veritabanı değişikliklerini yap
    //     try {
    //          // Örneğin yeni bir ayar eklenmişse install.sql'den ilgili INSERT'i alıp çalıştırabiliriz
    //          Capsule::table('mod_btk_config')->updateOrInsert(
    //              ['setting' => 'yeni_ayar_ornegi'],
    //              ['value' => 'varsayilan_deger']
    //          );
    //         logActivity("BTK Raporlama Modülü: v0.6.0 güncellemesi yapıldı.",0);
    //     } catch (\Exception $e) {
    //         logActivity("BTK Raporlama Modülü: v0.6.0 güncellemesi sırasında hata: " . $e->getMessage(),0);
    //         return ['status' => 'error', 'description' => 'v0.6.0 güncellemesi sırasında hata: ' . $e->getMessage()];
    //     }
    // }
    // Her zaman install.sql'i çalıştırmak yerine, sadece eksik tabloları ve sütunları kontrol edip eklemek daha güvenlidir.
    // Ancak şimdilik basit bir başarı mesajı dönelim.
    return ['status' => 'success', 'description' => 'BTK Raporlama Modülü güncelleme işlemi tamamlandı. Yeni Sürüm: ' . $newVersion];
}

/**
 * Admin Area Output.
 */
function btkreports_output($vars) {
    $modulelink = $vars['modulelink'];
    $LANG = $vars['_lang'];
    if (empty($LANG) && file_exists(__DIR__ . '/lang/turkish.php')) {
        include __DIR__ . '/lang/turkish.php';
        $LANG = $_LANG;
    }

    $action = isset($_REQUEST['action']) ? trim($_REQUEST['action']) : '';
    $page = isset($_REQUEST['page']) ? trim($_REQUEST['page']) : 'index';

    $smarty = new Smarty();
    $smarty->assign('modulelink', $modulelink);
    $smarty->assign('LANG', $LANG);
    $smarty->assign('version', $vars['version']);
    $smarty->assign('customadminpath', get_admin_folder_name()); // WHMCS admin klasör adını template'e gönder

    $action_result = isset($_SESSION['btk_action_result']) ? $_SESSION['btk_action_result'] : null;
    if ($action_result) {
        $smarty->assign('action_result_type', $action_result['type']);
        $message_text = isset($LANG[$action_result['message_key']]) ? $LANG[$action_result['message_key']] : $action_result['message_key'];
        // Parametreleri işle (eğer varsa)
        if (isset($action_result['params']) && is_array($action_result['params']) && !empty($message_text)) {
            // Dil dosyasında {param_name} gibi placeholder'lar varsa:
            // foreach ($action_result['params'] as $key => $value) {
            //    $message_text = str_replace('{' . $key . '}', $value, $message_text);
            // }
            // Veya vsprintf için: (parametreler sıralı olmalı)
            // $message_text = vsprintf($message_text, $action_result['params']);
        }
        $smarty->assign('action_result_message', $message_text);
        unset($_SESSION['btk_action_result']);
    }

    if (!file_exists(__DIR__ . '/lib/BtkHelper.php')) {
        echo "Hata: BtkHelper.php dosyası bulunamadı. Modül çalışamaz.";
        return;
    }
    require_once __DIR__ . '/lib/BtkHelper.php';
    $btkHelper = new BtkHelper($vars); // $vars'ı helper'a constructor ile gönder

    // Config sayfasına özel erişim kontrolü
    if ($page == 'config') {
        if (!isset($_SESSION['btk_admin_authed']) || $_SESSION['btk_admin_authed'] !== true) {
            $auth_error_message_key = '';
            if ($action == 'authenticate_config_access') {
                $submitted_username = isset($_POST['btk_username']) ? trim($_POST['btk_username']) : '';
                $submitted_password = isset($_POST['btk_password']) ? $_POST['btk_password'] : '';
                $stored_username = $btkHelper->get_config('btk_config_admin_user');
                $stored_password_hash = $btkHelper->get_config('btk_config_admin_pass_hash');
                $default_user = 'btkadmin'; // install.sql'deki varsayılan
                $default_pass_hash = '$2y$10$IfH7q9E2.N10Gv/Qz19xWuX.PbjH.jPzIpj4Q0nUqLzY/4yBikUzG'; // 'P@$$wOrd123'

                if ((empty($stored_username) || empty($stored_password_hash)) && ($submitted_username === $default_user && password_verify($submitted_password, $default_pass_hash))) {
                    $_SESSION['btk_admin_authed'] = true;
                    $_SESSION['btk_action_result'] = ['type' => 'info', 'message_key' => 'btk_info_change_default_password'];
                } elseif (!empty($stored_username) && $submitted_username === $stored_username && !empty($stored_password_hash) && password_verify($submitted_password, $stored_password_hash)) {
                    $_SESSION['btk_admin_authed'] = true;
                } else {
                    $auth_error_message_key = 'btk_auth_error_invalid_credentials';
                }
            }
            if (!isset($_SESSION['btk_admin_authed']) || $_SESSION['btk_admin_authed'] !== true) {
                if(!empty($auth_error_message_key) && isset($LANG[$auth_error_message_key])) $smarty->assign('auth_error', $LANG[$auth_error_message_key]);
                $smarty->assign('csrfToken', generate_token('plain'));
                $smarty->display(__DIR__ . '/templates/admin/confirm_password.tpl');
                return;
            }
        }
    }

    // Ayarları Kaydetme İşlemi
    if ($action == 'save_settings' && $page == 'config' && isset($_SESSION['btk_admin_authed']) && $_SESSION['btk_admin_authed'] === true) {
        check_token("WHMCS.admin.default"); // WHMCS'in kendi CSRF token kontrolü

        $save_success = true;
        $save_message_key = '';

        $new_admin_user = isset($_POST['btk_config_admin_user']) ? trim($_POST['btk_config_admin_user']) : '';
        if (empty($new_admin_user)) {
            $save_success = false;
            $save_message_key = 'btk_error_admin_user_required';
        } else {
            $btkHelper->set_config('btk_config_admin_user', $new_admin_user);
        }

        $new_admin_pass = isset($_POST['btk_config_new_admin_pass']) ? $_POST['btk_config_new_admin_pass'] : '';
        $confirm_admin_pass = isset($_POST['btk_config_confirm_admin_pass']) ? $_POST['btk_config_confirm_admin_pass'] : '';
        if (!empty($new_admin_pass)) {
            if (strlen($new_admin_pass) < 8) {
                 $save_success = false;
                 $save_message_key = 'btk_error_password_too_short';
            } elseif ($new_admin_pass === $confirm_admin_pass) {
                $hashed_password = password_hash($new_admin_pass, PASSWORD_DEFAULT);
                $btkHelper->set_config('btk_config_admin_pass_hash', $hashed_password);
            } else {
                $save_success = false;
                $save_message_key = 'btk_error_password_mismatch';
            }
        }

        if ($save_success) { // Sadece erişim ayarları başarılıysa diğerlerini de kaydetmeyi dene
            $checkbox_settings = ['ftp_use_ssl_btk', 'ftp_use_passive_btk', 'ftp_yedek_aktif', 'ftp_use_ssl_yedek', 'ftp_use_passive_yedek', 'delete_tables_on_deactivate', 'nvi_tc_dogrulama_aktif', 'nvi_adres_dogrulama_aktif', 'personel_dosya_adi_yil_ay_btk', 'personel_dosya_adi_yil_ay_yedek', 'debug_mode'];
            $text_settings = ['operator_kodu', 'operator_adi', 'operator_unvani', 'ftp_host_btk', 'ftp_port_btk', 'ftp_user_btk', 'ftp_path_rehber_btk', 'ftp_path_hareket_btk', 'ftp_path_personel_btk', 'ftp_host_yedek', 'ftp_port_yedek', 'ftp_user_yedek', 'ftp_path_rehber_yedek', 'ftp_path_hareket_yedek', 'ftp_path_personel_yedek', 'cron_rehber_zamanlama', 'cron_hareket_zamanlama', 'cron_personel_zamanlama_haziran', 'cron_personel_zamanlama_aralik', 'hareket_canli_saklama_suresi_gun', 'hareket_arsiv_saklama_suresi_gun'];

            foreach ($text_settings as $key) {
                if (isset($_POST[$key])) {
                    $btkHelper->set_config($key, trim($_POST[$key]));
                }
            }
            foreach ($checkbox_settings as $key) {
                $btkHelper->set_config($key, (isset($_POST[$key]) && $_POST[$key] == '1') ? '1' : '0');
            }

            if (isset($_POST['ftp_pass_btk_new']) && $_POST['ftp_pass_btk_new'] !== '' && $_POST['ftp_pass_btk_new'] !== '********') {
                $btkHelper->set_config('ftp_pass_btk', encrypt(trim($_POST['ftp_pass_btk_new'])));
            }
            if (isset($_POST['ftp_pass_yedek_new']) && $_POST['ftp_pass_yedek_new'] !== '' && $_POST['ftp_pass_yedek_new'] !== '********') {
                $btkHelper->set_config('ftp_pass_yedek', encrypt(trim($_POST['ftp_pass_yedek_new'])));
            }

            $secilen_yetkiler = isset($_POST['yetki_turleri']) && is_array($_POST['yetki_turleri']) ? $_POST['yetki_turleri'] : [];
            $btkHelper->saveSecilenYetkiTurleri($secilen_yetkiler);

            if (empty($save_message_key)) { // Eğer başka bir hata oluşmadıysa başarı mesajı ata
                 $save_message_key = 'btk_settings_saved_successfully';
            }
        }
        $_SESSION['btk_action_result'] = ['type' => $save_success ? 'success' : 'error', 'message_key' => $save_message_key];
        header("Location: " . $modulelink . "&page=config");
        exit;
    }

    // Sayfa içeriğini yükle
    $template_file = '';
    switch ($page) {
        case 'config':
            if (isset($_SESSION['btk_admin_authed']) && $_SESSION['btk_admin_authed'] === true) {
                $settings = $btkHelper->get_all_configs();
                $settings['ftp_pass_btk_display'] = !empty($btkHelper->get_config('ftp_pass_btk')) ? '********' : '';
                $settings['ftp_pass_yedek_display'] = !empty($btkHelper->get_config('ftp_pass_yedek')) ? '********' : '';
                $smarty->assign('settings', $settings);
                $smarty->assign('current_year', date('Y'));
                $smarty->assign('operator_yetki_turleri_options', $btkHelper->getYetkiTurleriOptions());
                $smarty->assign('secili_yetki_kodlari', $btkHelper->getSeciliYetkiKodlari());
                $smarty->assign('csrfToken', generate_token('plain')); // Form için CSRF token
                $template_file = 'config.tpl';
            }
            // Else durumu zaten yukarıda ele alındı (confirm_password.tpl gösterilir)
            break;
        case 'generate_reports':
            $smarty->assign('yetki_turleri', $btkHelper->getSeciliYetkilerFormatted());
            $smarty->assign('csrfToken', generate_token('plain'));
            $template_file = 'generate_reports.tpl';
            break;
        case 'view_logs':
            if (isset($_POST['clearlogs_confirm']) && $_POST['clearlogs_confirm'] == 'yes') {
                check_token("WHMCS.admin.default");
                if ($btkHelper->clear_logs()) {
                    $_SESSION['btk_action_result'] = ['type' => 'success', 'message_key' => 'btk_logs_cleared_successfully'];
                } else {
                    $_SESSION['btk_action_result'] = ['type' => 'error', 'message_key' => 'btk_error_clearing_logs'];
                }
                header("Location: " . $modulelink . "&page=view_logs");
                exit;
            }
            $smarty->assign('log_entries', $btkHelper->get_logs(200)); // Son 200 log
            $smarty->assign('csrfToken', generate_token('plain'));
            $template_file = 'view_logs.tpl';
            break;
        case 'personel':
            // Personel işlemleri (ekleme/düzenleme/silme) burada ele alınabilir POST ile
            $smarty->assign('personel_listesi', $btkHelper->getPersonelListesi());
            $smarty->assign('departmanlar', $btkHelper->getDepartmanlarForDropdown());
            $smarty->assign('csrfToken', generate_token('plain'));
            $template_file = 'personel.tpl';
            break;
        case 'iss_pop_management':
            // POP noktası işlemleri
            $smarty->assign('pop_noktalari', $btkHelper->getPopNoktalari());
            $smarty->assign('csrfToken', generate_token('plain'));
            $template_file = 'iss_pop_management.tpl';
            break;
        case 'logout_config':
             unset($_SESSION['btk_admin_authed']);
             header("Location: " . $modulelink . "&page=config"); // confirm_password.tpl'e yönlendirir
             exit;
        case 'index':
        default:
            $ftp_btk_status = $btkHelper->checkFtpConnection('btk');
            $ftp_yedek_status = $btkHelper->checkFtpConnection('yedek');
            $smarty->assign('ftp_btk_status', $ftp_btk_status);
            $smarty->assign('ftp_yedek_status', $ftp_yedek_status);
            $readme_content = $btkHelper->getReadmeContent();
            $smarty->assign('readme_content', $readme_content);
            $template_file = 'index.tpl';
            break;
    }

    if (!empty($template_file)) {
        try {
            $templatePath = __DIR__ . '/templates/admin/' . $template_file;
            if (file_exists($templatePath)) {
                $smarty->display($templatePath);
            } else {
                echo "Hata: Template dosyası bulunamadı: " . $templatePath;
                logActivity("BTK Raporlama Modülü: Template dosyası bulunamadı - " . $templatePath, 0);
            }
        } catch (Exception $e) {
            echo "Smarty Template Gösterim Hatası ({$template_file}): " . $e->getMessage();
            logModuleCall('btkreports', $page.'_template_error', $template_file, $e->getMessage(), $e->getTraceAsString());
        }
    }
} // btkreports_output fonksiyonunun sonu

/**
 * WHMCS Admin klasör adını almak için yardımcı fonksiyon.
 * @return string Admin folder name
 */
function get_admin_folder_name() {
    global $customadminpath; // WHMCS bu değişkeni genellikle global scope'a tanımlar.

    if (!empty($customadminpath)) {
        return rtrim($customadminpath, '/');
    }

    // Fallback: configuration.php dosyasından okumayı dene
    // Bu yöntem daha az güvenilir ve sunucu yapılandırmasına bağlıdır.
    $configFilePath = dirname(__DIR__, 3) . '/configuration.php';
    if (file_exists($configFilePath)) {
        // Hata raporlamasını geçici olarak bastır, dosya okuma hatası almamak için
        $error_reporting_level = error_reporting();
        error_reporting($error_reporting_level & ~E_NOTICE & ~E_WARNING);
        $configContents = file_get_contents($configFilePath);
        error_reporting($error_reporting_level); // Eski seviyeye geri dön

        if ($configContents && preg_match('/\$customadminpath\s*=\s*\'([a-zA-Z0-9_]+)\';/', $configContents, $matches)) {
            if (isset($matches[1])) {
                return $matches[1];
            }
        }
    }
    return 'admin'; // En son varsayılan
}

// Modül hooklarını yükle
if (file_exists(__DIR__ . '/hooks.php')) {
    require_once __DIR__ . '/hooks.php';
}
// Modül sonu
?>