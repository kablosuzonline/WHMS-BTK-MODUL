<?php
// modules/addons/btkreports/btkreports.php
// WHMCS BTK Abone Veri Raporlama Modülü Ana Dosyası
// GERÇEK TAM SÜRÜM (Fonksiyon Tekrarları Düzeltilmiş)
// BÖLÜM 1 / 4

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// Kütüphaneler
// Bu require'lar sadece bir kez, dosyanın en başında yapılmalı.
if (file_exists(__DIR__ . '/lib/PhpSpreadsheet/vendor/autoload.php')) {
    require_once __DIR__ . '/lib/PhpSpreadsheet/vendor/autoload.php';
} else {
    if (function_exists('logModuleCall')) {
        logModuleCall('btkreports', 'LibraryLoad - btkreports.php', 'PhpSpreadsheet autoload.php not found. Excel export/import features will not work.', null, 'CRITICAL');
    } else {
        error_log('BTK Reports Module Error: PhpSpreadsheet autoload.php not found in ' . __DIR__ . '/lib/PhpSpreadsheet/vendor/');
    }
}

if (file_exists(__DIR__ . '/lib/NviSoapClient.php')) {
    require_once __DIR__ . '/lib/NviSoapClient.php';
} else {
    if (function_exists('logModuleCall')) {
        logModuleCall('btkreports', 'LibraryLoad - btkreports.php', 'NviSoapClient.php not found. NVI verification features will not work.', null, 'CRITICAL');
    } else {
        error_log('BTK Reports Module Error: NviSoapClient.php not found in ' . __DIR__ . '/lib/');
    }
}

if (file_exists(__DIR__ . '/lib/ExcelExporter.php')) {
    require_once __DIR__ . '/lib/ExcelExporter.php';
} else {
     if (function_exists('logModuleCall')) {
        logModuleCall('btkreports', 'LibraryLoad - btkreports.php', 'ExcelExporter.php not found. Excel export/import via helper class will not work.', null, 'WARNING');
    } else {
        error_log('BTK Reports Module Error: ExcelExporter.php not found in ' . __DIR__ . '/lib/');
    }
}

// Gerekli PhpSpreadsheet ve diğer sınıflar için use ifadeleri (sadece bir kez)
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as WriterXlsxPhpSpreadsheet;

use WHMCS\Database\Capsule;
use WHMCS\Utility\Token\TokenManager;
// Namespace'li kullanım için, bu sınıfların lib altında doğru namespace ile tanımlandığını varsayıyoruz.
use WHMCS\Module\Addon\BtkReports\Lib\NviSoapClient;
use WHMCS\Module\Addon\BtkReports\Lib\ExcelExporter;

// Modül Sabitleri (sadece bir kez)
if (!defined('BTKREPORTS_MODULE_NAME')) {
    define('BTKREPORTS_MODULE_NAME', 'btkreports');
}
if (!defined('BTKREPORTS_LOG_LEVEL_ERROR')) { define('BTKREPORTS_LOG_LEVEL_ERROR', 'error'); }
if (!defined('BTKREPORTS_LOG_LEVEL_INFO')) { define('BTKREPORTS_LOG_LEVEL_INFO', 'info'); }
if (!defined('BTKREPORTS_LOG_LEVEL_DEBUG')) { define('BTKREPORTS_LOG_LEVEL_DEBUG', 'debug'); }


// ===================================================================================
// TEMEL YARDIMCI FONKSİYONLAR (Diğer fonksiyonlardan önce tanımlanmalı)
// ===================================================================================

/**
 * Dil dosyasını yükler ve dil dizisini döndürür.
 */
if (!function_exists('btkreports_load_language')) {
    function btkreports_load_language() {
        $moduleName = BTKREPORTS_MODULE_NAME;
        $lang = [];
        global $_ADMINLANG;
        if (isset($_ADMINLANG[$moduleName]) && is_array($_ADMINLANG[$moduleName])) {
            $lang = $_ADMINLANG[$moduleName];
        } else {
            $langFilePath = __DIR__ . '/lang/turkish.php';
            if (file_exists($langFilePath)) {
                $current_adminlang_btk = $_ADMINLANG[$moduleName] ?? null;
                include $langFilePath;
                if (isset($_ADMINLANG[$moduleName]) && is_array($_ADMINLANG[$moduleName])) {
                    $lang = $_ADMINLANG[$moduleName];
                } elseif ($current_adminlang_btk) {
                    $_ADMINLANG[$moduleName] = $current_adminlang_btk;
                    $lang = $current_adminlang_btk;
                }
            }
        }
        $defaults = ['module_name' => 'BTK Reports (Dil Dosyası Yüklenemedi - Ana)', 'access_denied' => 'Erişim Engellendi', 'error_field_required' => '{fieldName} alanı zorunludur.', 'error_unexpected' => 'Beklenmeyen bir hata oluştu.', 'changes_saved_successfully' => 'Değişiklikler başarıyla kaydedildi.'];
        foreach($defaults as $key => $value) if(empty($lang[$key])) $lang[$key] = $value;
        return $lang;
    }
}

/**
 * Belirli bir ayarı veritabanından okur (şifreleri decrypt eder).
 */
if (!function_exists('btkreports_get_setting')) {
    function btkreports_get_setting($settingName, $defaultValue = null) {
        try {
            $setting = Capsule::table('mod_btk_settings')->where('setting', $settingName)->first();
            if ($setting) {
                if (in_array($settingName, ['ftp_password', 'backup_ftp_password']) && !empty($setting->value)) {
                    if (function_exists('decrypt')) return decrypt($setting->value);
                    logModuleCall(BTKREPORTS_MODULE_NAME, __FUNCTION__, "decrypt() fonksiyonu bulunamadı: $settingName", null, 'WARNING');
                    return $setting->value; 
                }
                return $setting->value;
            }
            return $defaultValue;
        } catch (\Exception $e) { logModuleCall(BTKREPORTS_MODULE_NAME, __FUNCTION__, "Ayar okuma hatası: $settingName", $e->getMessage(), null, 'ERROR'); return $defaultValue; }
    }
}

/**
 * Tüm ayarları veritabanından okur ve varsayılanlarla birleştirir (şifreleri decrypt eder).
 */
if (!function_exists('btkreports_get_all_settings')) {
    function btkreports_get_all_settings() {
        $settingsFromDB = [];
        try {
            $results = Capsule::table('mod_btk_settings')->get();
            foreach ($results as $result) {
                if (in_array($result->setting, ['ftp_password', 'backup_ftp_password']) && !empty($result->value)) {
                    if (function_exists('decrypt')) {
                        $settingsFromDB[$result->setting] = decrypt($result->value);
                        $settingsFromDB[$result->setting . '_encrypted_raw'] = $result->value; // Ham değeri de sakla
                    } else {
                        $settingsFromDB[$result->setting] = $result->value;
                    }
                } else {
                    $settingsFromDB[$result->setting] = $result->value;
                }
            }
        } catch (\Exception $e) { logModuleCall(BTKREPORTS_MODULE_NAME, __FUNCTION__, "Tüm ayarları okuma hatası", $e->getMessage(), null, 'ERROR'); }
        return array_merge(btkreports_get_default_settings_array(), $settingsFromDB);
    }
}

/**
 * Bir ayarı veritabanına kaydeder veya günceller.
 */
if (!function_exists('btkreports_save_setting')) {
    function btkreports_save_setting($settingName, $value) {
        try {
            Capsule::table('mod_btk_settings')->updateOrInsert(
                ['setting' => $settingName],
                ['value' => is_array($value) ? json_encode($value) : $value]
            );
            return true;
        } catch (\Exception $e) { logModuleCall(BTKREPORTS_MODULE_NAME, __FUNCTION__, "Ayar '$settingName' kaydedilirken hata.", null, $e->getMessage(), null, 'ERROR'); return false; }
    }
}

/**
 * Modül için varsayılan ayarları döndürür (şifreler encrypt edilmemiş).
 */
if (!function_exists('btkreports_get_default_settings_array')) {
    function btkreports_get_default_settings_array() {
        return [
            'operator_code' => '000', 'operator_name' => 'OPERATOR_KISAKOD', 'operator_title_official' => 'OPERATÖR RESMİ TİCARET ÜNVANI LİMİTED ŞİRKETİ',
            'ftp_host' => '', 'ftp_username' => '', 'ftp_password' => '', 'ftp_port' => '21', 'ftp_passive_mode' => '1',
            'ftp_path_abone_rehber' => '/REHBER/', 'ftp_path_abone_hareket' => '/HAREKET/', 'ftp_path_personel_excel' => '/PERSONEL/',
            'use_backup_ftp' => '0',
            'backup_ftp_host' => '', 'backup_ftp_username' => '', 'backup_ftp_password' => '', 'backup_ftp_port' => '21', 'backup_ftp_passive_mode' => '1',
            'backup_ftp_path_abone_rehber' => '/ARSIV/REHBER/', 'backup_ftp_path_abone_hareket' => '/ARSIV/HAREKET/', 'backup_ftp_path_personel_excel' => '/ARSIV/PERSONEL/',
            'cron_abone_rehber_time' => '0 10 1 * *', 'cron_abone_hareket_time' => '0 1 * * *', 'cron_personel_excel_time' => '0 16 L 6,12 *',
            'send_empty_reports' => '0', 'personel_excel_filename_format' => 'default',
            'hareket_report_days_to_keep_in_live' => '7', 'max_execution_time_cron' => '300',
            'log_level' => BTKREPORTS_LOG_LEVEL_ERROR, 'auto_retry_failed_ftp' => '0', 'retry_failed_ftp_count' => '3',
            'delete_tables_on_deactivate_confirm' => '0'
        ];
    }
}

/**
 * Varsayılan ayarları veritabanına kaydeder (eğer mevcut değillerse).
 */
if (!function_exists('btkreports_save_default_settings')) {
    function btkreports_save_default_settings() {
        $defaults = btkreports_get_default_settings_array();
        foreach ($defaults as $key => $value) {
            if (Capsule::table('mod_btk_settings')->where('setting', $key)->doesntExist()) {
                btkreports_save_setting($key, $value);
            }
        }
    }
}

/**
 * SQL dosyasını sorgulara böler, yorumları ve boş satırları atlar.
 */
if (!function_exists('btkreports_split_sql_file')) {
    function btkreports_split_sql_file($sqlContent, $delimiter = ';') {
        $queries = [];
        $sqlContent = preg_replace(["/\s*--(.*?)\r?\n/", "/\s*#.*?\r?\n/", "/\s*\/\*(.*?)\*\/\s*/s"], '', $sqlContent);
        $rawQueries = explode($delimiter, $sqlContent); $currentQuery = '';
        foreach ($rawQueries as $part) {
            $trimmedPart = trim($part);
            if (!empty($trimmedPart)) {
                $queries[] = $trimmedPart . $delimiter; // Her sorguyu delimiter ile bitir
            }
        }
        return array_filter($queries, function($q){ return !empty(trim(rtrim(trim($q), ';'))); });
    }
}

/**
 * FTP dosya yolunu sanitize eder.
 */
if (!function_exists('btkreports_sanitize_ftp_path')) {
    function btkreports_sanitize_ftp_path($path) {
        $path = trim(str_replace('\\', '/', $path));
        if (empty($path) || $path === '/') return '/';
        if (strpos($path, '/') !== 0) $path = '/' . $path;
        if (substr($path, -1) !== '/') $path .= '/';
        return preg_replace('#/+#', '/', $path);
    }
}

/**
 * WHMCS Admin klasör adını alır.
 */
if (!function_exists('btkreports_get_admin_folder_name')) {
    function btkreports_get_admin_folder_name() {
        if (class_exists('\WHMCS\Admin\AdminServiceProvider')) {
            $adminFolder = \WHMCS\Admin\AdminServiceProvider::getAdminFolderName();
            if (!empty($adminFolder)) return $adminFolder;
        }
        if (isset($GLOBALS['customadminpath']) && !empty($GLOBALS['customadminpath'])) {
            return $GLOBALS['customadminpath'];
        }
        $ds = DIRECTORY_SEPARATOR; $configPath = dirname(__DIR__) . $ds . $ds . $ds . 'configuration.php';
        if (file_exists($configPath)) {
            $configContent = @file_get_contents($configPath);
            if ($configContent && preg_match('/\$customadminpath\s*=\s*[\'"]([a-zA-Z0-9_]+)[\'"]\s*;/', $configContent, $matches)) {
                if (!empty($matches[1])) return $matches[1];
            }
        }
        return 'admin';
    }
}

/**
 * Adres objesinden veya dizisinden formatlanmış tam adres stringi oluşturur (Gösterim amaçlı).
 */
if (!function_exists('btkreports_format_full_address_from_obj')) {
    function btkreports_format_full_address_from_obj($addressInput) {
        if (empty($addressInput)) return ''; $addressObj = is_array($addressInput) ? (object) $addressInput : $addressInput; $parts = [];
        if (!empty($addressObj->adres_cadde_sokak_bulvar)) $parts[] = $addressObj->adres_cadde_sokak_bulvar;
        if (!empty($addressObj->adres_bina_adi_no)) $parts[] = $addressObj->adres_bina_adi_no;
        $kapiPart = ''; if (!empty($addressObj->adres_dis_kapi_no)) $kapiPart .= "No:" . $addressObj->adres_dis_kapi_no;
        if (!empty($addressObj->adres_ic_kapi_no)) $kapiPart .= ($kapiPart ? " D:" : "D:") . $addressObj->adres_ic_kapi_no;
        if ($kapiPart) $parts[] = $kapiPart;
        $mahalleAdi = ''; if (!empty($addressObj->adres_mahalle_ref_kodu)) { $mahalle = Capsule::table('mod_btk_adres_mahalle')->where('mahalle_koy_kodu', $addressObj->adres_mahalle_ref_kodu)->first(); if($mahalle) $mahalleAdi = $mahalle->mahalle_adi; }
        if (empty($mahalleAdi) && !empty($addressObj->adres_mahalle_adi_manual)) $mahalleAdi = $addressObj->adres_mahalle_adi_manual; if ($mahalleAdi) $parts[] = $mahalleAdi;
        $ilceAdi = ''; if (!empty($addressObj->adres_ilce_ref_kodu)) { $ilce = Capsule::table('mod_btk_adres_ilce')->where('ilce_kodu', $addressObj->adres_ilce_ref_kodu)->first(); if($ilce) $ilceAdi = $ilce->ilce_adi; }
        if (empty($ilceAdi) && !empty($addressObj->adres_ilce_adi_manual)) $ilceAdi = $addressObj->adres_ilce_adi_manual;
        $ilAdi = ''; if (!empty($addressObj->adres_il_ref_kodu)) { $il = Capsule::table('mod_btk_adres_il')->where('il_kodu', $addressObj->adres_il_ref_kodu)->first(); if($il) $ilAdi = $il->il_adi; }
        if (empty($ilAdi) && !empty($addressObj->adres_il_adi_manual)) $ilAdi = $addressObj->adres_il_adi_manual;
        if ($ilceAdi && $ilAdi) $parts[] = $ilceAdi . '/' . $ilAdi; elseif ($ilceAdi && !$ilAdi && !empty($addressObj->adres_ilce_ref_kodu)) { $ilFromIlce = Capsule::table('mod_btk_adres_ilce AS ilce')->join('mod_btk_adres_il AS il_ref', 'ilce.il_kodu', '=', 'il_ref.il_kodu')->where('ilce.ilce_kodu', $addressObj->adres_ilce_ref_kodu)->value('il_ref.il_adi'); if ($ilFromIlce) $parts[] = $ilceAdi . '/' . $ilFromIlce; else $parts[] = $ilceAdi; }
        elseif ($ilAdi) $parts[] = $ilAdi;
        if (!empty($addressObj->adres_posta_kodu)) $parts[] = $addressObj->adres_posta_kodu;
        return implode(', ', array_filter($parts));
    }
}

// ===================================================================================
// MODÜL ANA FONKSİYONLARI (MetaData, activate, deactivate, upgrade, config)
// ===================================================================================
// Bu fonksiyonlar yukarıda zaten tanımlandı. Tekrar eklenmiyor.

// BÖLÜM 1 SONU (Bu mesajın 1. Bölümü, _config fonksiyonunun sonuna kadar olan kısım)
// modules/addons/btkreports/btkreports.php
// GERÇEK TAM SÜRÜM (Fonksiyon Tekrarları Düzeltilmiş)
// BÖLÜM 2 / 4 (Tahmini)

// ÖNEMLİ NOT: Bu bölüm, bir önceki bölümün (BÖLÜM 1/4) devamıdır.
// Bir önceki bölümdeki `btkreports_config()` fonksiyonunun kapanış `}` parantezinden
// sonra bu kodlar eklenmelidir.
// Nihai dosyada, <?php etiketi sadece en başta bir kez olacaktır.

/**
 * Müşteri Profili BTK Sekmesi İçeriğini Oluşturur ve Render Eder (Hook için)
 * Bu fonksiyon, AdminClientProfileTabFields hook'u tarafından çağrılır.
 * TPL için gerekli tüm verileri hazırlar ve TPL'i render edip HTML string olarak döndürür.
 */
if (!function_exists('btkreports_get_client_profile_tab_content_for_hook')) {
    function btkreports_get_client_profile_tab_content_for_hook($clientId, $langFromHook) {
        $moduleName = BTKREPORTS_MODULE_NAME;
        global $smarty;
        $lang = (!empty($langFromHook) && is_array($langFromHook)) ? $langFromHook : btkreports_load_language();

        if (is_null($smarty)) {
            logModuleCall($moduleName, __FUNCTION__, 'Smarty nesnesi bulunamadı (Müşteri Profili Hook).', ['clientId' => $clientId], 'CRITICAL');
            return '<div class="alert alert-danger">Smarty Error! (Ref: BGTCPTCH_SMRT_CLIENT_V10)</div>';
        }

        $btkClientData = []; $yerlesimAdresiData = []; $kurumAdresiData = [];
        $initialIlcelerYerlesim = []; $initialMahallelerYerlesim = [];
        $initialIlcelerKurum = []; $initialMahallelerKurum = [];

        try {
            $clientDataRaw = Capsule::table('mod_btk_musteri_detaylari')->where('client_id', $clientId)->first();
            if ($clientDataRaw) {
                $btkClientData = json_decode(json_encode($clientDataRaw), true);
                $yerlesimAdresi = Capsule::table('mod_btk_adresler')->where('client_id', $clientId)->where('adres_tipi', 'YERLESIM')->orderBy('id', 'desc')->first();
                if ($yerlesimAdresi) {
                    $yerlesimAdresiData = json_decode(json_encode($yerlesimAdresi), true);
                    if ($yerlesimAdresi->adres_il_ref_kodu) {
                        $initialIlcelerYerlesim = Capsule::table('mod_btk_adres_ilce')->where('il_kodu', $yerlesimAdresi->adres_il_ref_kodu)->orderBy('ilce_adi')->get(['ilce_kodu as id', 'ilce_adi as name'])->all();
                        if ($yerlesimAdresi->adres_ilce_ref_kodu) {
                            $initialMahallelerYerlesim = Capsule::table('mod_btk_adres_mahalle')->where('ilce_kodu', $yerlesimAdresi->adres_ilce_ref_kodu)->orderBy('mahalle_adi')->get(['mahalle_koy_kodu as id', 'mahalle_adi as name'])->all();
                        }
                    }
                }
                if (isset($btkClientData['kurum_adres_id']) && $btkClientData['kurum_adres_id']) {
                    $kurumAdresi = Capsule::table('mod_btk_adresler')->find($btkClientData['kurum_adres_id']);
                    if ($kurumAdresi && ($kurumAdresi->adres_tipi === 'KURUM_YETKILI' || $kurumAdresi->adres_tipi === 'KURUM') && $kurumAdresi->client_id == $clientId) {
                         $kurumAdresiData = json_decode(json_encode($kurumAdresi), true);
                        if ($kurumAdresi->adres_il_ref_kodu) {
                            $initialIlcelerKurum = Capsule::table('mod_btk_adres_ilce')->where('il_kodu', $kurumAdresi->adres_il_ref_kodu)->orderBy('ilce_adi')->get(['ilce_kodu as id', 'ilce_adi as name'])->all();
                            if ($kurumAdresi->adres_ilce_ref_kodu) {
                                $initialMahallelerKurum = Capsule::table('mod_btk_adres_mahalle')->where('ilce_kodu', $kurumAdresi->adres_ilce_ref_kodu)->orderBy('mahalle_adi')->get(['mahalle_koy_kodu as id', 'mahalle_adi as name'])->all();
                            }
                        }
                    } else if ($kurumAdresi) {
                        logModuleCall($moduleName, __FUNCTION__, "Kurum adresi ID ({$btkClientData['kurum_adres_id']}) müşteri ({$clientId}) ile eşleşmiyor veya tipi yanlış.", ['kurum_adres_tipi' => $kurumAdresi->adres_tipi, 'kurum_adres_client_id' => $kurumAdresi->client_id], 'WARNING');
                        $btkClientData['kurum_adres_id'] = null;
                    }
                }
            } else {
                $whmcsClient = Capsule::table('tblclients')->find($clientId);
                if ($whmcsClient) {
                    $btkClientData['abone_adi'] = $whmcsClient->firstname; $btkClientData['abone_soyadi'] = $whmcsClient->lastname;
                    $btkClientData['abone_unvan'] = $whmcsClient->companyname ?: ($whmcsClient->firstname . ' ' . $whmcsClient->lastname);
                    $btkClientData['abone_vergi_numarasi'] = $whmcsClient->tax_id;
                    $whmcsIlAdi = trim($whmcsClient->state); $ilRef = Capsule::table('mod_btk_adres_il')->where('il_adi', 'LIKE', $whmcsIlAdi)->first();
                    if ($ilRef) {
                        $yerlesimAdresiData['adres_il_ref_kodu'] = $ilRef->il_kodu;
                        $ilceler = Capsule::table('mod_btk_adres_ilce')->where('il_kodu', $ilRef->il_kodu)->orderBy('ilce_adi')->get(['ilce_kodu as id', 'ilce_adi as name'])->all();
                        $initialIlcelerYerlesim = $ilceler; $whmcsIlceAdi = trim($whmcsClient->city);
                        foreach ($ilceler as $ilce) if (0 === strcasecmp(mb_strtolower($ilce->name, 'UTF-8'), mb_strtolower($whmcsIlceAdi, 'UTF-8'))) { $yerlesimAdresiData['adres_ilce_ref_kodu'] = $ilce->id; $initialMahallelerYerlesim = Capsule::table('mod_btk_adres_mahalle')->where('ilce_kodu', $ilce->id)->orderBy('mahalle_adi')->get(['mahalle_koy_kodu as id', 'mahalle_adi as name'])->all(); break; }
                    } else $yerlesimAdresiData['adres_il_adi_manual'] = $whmcsClient->state;
                    if (empty($yerlesimAdresiData['adres_ilce_ref_kodu']) && !empty($whmcsClient->city)) $yerlesimAdresiData['adres_ilce_adi_manual'] = $whmcsClient->city;
                    $yerlesimAdresiData['adres_cadde_sokak_bulvar'] = $whmcsClient->address1; $yerlesimAdresiData['adres_acik_full'] = $whmcsClient->address2; $yerlesimAdresiData['adres_posta_kodu'] = $whmcsClient->postcode;
                    $turkey = Capsule::table('mod_btk_ref_ulkeler')->where('iso_3166_1_alpha_3', 'TUR')->first(); if ($turkey) $btkClientData['abone_uyruk_ref_id'] = $turkey->id;
                    $btkClientData['musteri_tipi_kodu'] = 'G-BIREYSEL';
                }
            }

            $refMusteriTipleri = Capsule::table('mod_btk_ref_musteri_tipleri')->orderBy('aciklama')->get()->all();
            $refCinsiyet = Capsule::table('mod_btk_ref_cinsiyet')->get()->all();
            $refUlkeler = Capsule::table('mod_btk_ref_ulkeler')->orderBy('ulke_adi_tr')->get(['id', 'ulke_adi_tr', 'iso_3166_1_alpha_3'])->all();
            $refMeslekler = Capsule::table('mod_btk_ref_meslekler')->orderBy('meslek_adi')->get()->all();
            $refKimlikTipleri = Capsule::table('mod_btk_ref_kimlik_tipleri')->orderBy('aciklama')->get()->all();
            $refKimlikAidiyetleri = Capsule::table('mod_btk_ref_kimlik_aidiyetleri')->orderBy('aciklama')->get()->all();
            $refIller = Capsule::table('mod_btk_adres_il')->orderBy('il_adi')->get()->all();
            $csrfTokenClient = ''; if (class_exists('\WHMCS\Utility\Token\TokenManager')) $csrfTokenClient = TokenManager::generate('Admin.Client.BTKSave.' . $clientId);
            $clientDetails = getClientsDetails($clientId);

            $templateVars = [
                'lang' => $lang, 'modulelink' => 'addonmodules.php?module=' . $moduleName, 'clientid' => $clientId,
                'btk_musteri_data' => (object) $btkClientData, 'btk_yerlesim_adresi_data' => (object) $yerlesimAdresiData,
                'btk_kurum_adresi_data' => (object) $kurumAdresiData,
                'btk_yerlesim_adresi_data_ilceler_initial' => $initialIlcelerYerlesim, 'btk_yerlesim_adresi_data_mahalleler_initial' => $initialMahallelerYerlesim,
                'btk_kurum_adresi_data_ilceler_initial' => $initialIlcelerKurum, 'btk_kurum_adresi_data_mahalleler_initial' => $initialMahallelerKurum,
                'btk_ref_musteri_tipleri' => $refMusteriTipleri, 'btk_ref_cinsiyet' => $refCinsiyet, 'btk_ref_ulkeler' => $refUlkeler,
                'btk_ref_meslekler' => $refMeslekler, 'btk_ref_kimlik_tipleri' => $refKimlikTipleri, 'btk_ref_kimlik_aidiyetleri' => $refKimlikAidiyetleri,
                'btk_ref_iller' => $refIller, 'btk_csrf_token_client' => $csrfTokenClient,
            ];
            if (is_array($clientDetails)) foreach($clientDetails as $key => $value) if (!isset($templateVars[$key])) $templateVars[$key] = $value;
            if (isset($_SESSION['btkClientProfileSaveMsg'])) { $templateVars['btk_client_action_result'] = $_SESSION['btkClientProfileSaveMsg']; unset($_SESSION['btkClientProfileSaveMsg']); }

            $templatePath = __DIR__ . '/templates/admin/client_details.tpl';
            if (file_exists($templatePath)) {
                foreach ($templateVars as $key => $value) $smarty->assign($key, $value);
                return $smarty->fetch($templatePath);
            } else { logModuleCall($moduleName, __FUNCTION__, 'client_details.tpl bulunamadı.', ['path' => $templatePath], 'ERROR'); return '<div class="alert alert-danger">' . ($lang['error_unexpected'] ?? 'Error') . ' (Template Missing)</div>';}
        } catch (\Exception $e) { logModuleCall($moduleName, __FUNCTION__, 'Müşteri BTK sekmesi oluşturma hatası.', ['cid' => $clientId], $e->getMessage(), $e->getTraceAsString(), 'CRITICAL'); return '<div class="alert alert-danger">Error: ' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8') . '</div>';}
    }
}

// BÖLÜM 3 SONU - Devamı sonraki bölümde (btkreports_output fonksiyonunun tamamı ve NVI internal fonksiyonları)
// modules/addons/btkreports/btkreports.php
// WHMCS BTK Abone Veri Raporlama Modülü Ana Dosyası
// GERÇEK TAM SÜRÜM (Fonksiyon Sırası Düzeltilmiş ve Tüm Mevcut Fonksiyonlar Dahil)
// BÖLÜM 2 / 4 (Tahmini)

// BÖLÜM 1'İN TÜM İÇERİĞİ BURADA YER ALMALIDIR.
// (MetaData, activate, deactivate, upgrade, config ve TÜM TEMEL YARDIMCI FONKSİYONLAR)
// Önceki mesajımdaki 1. Bölüm'ün içeriğini buraya kopyalayıp yapıştıracağım.
// ####################################################################################
// ####################### BÖLÜM 1 İÇERİĞİ BAŞLANGICI ##################################
// ####################################################################################

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// Kütüphaneler
if (file_exists(__DIR__ . '/lib/PhpSpreadsheet/vendor/autoload.php')) {
    require_once __DIR__ . '/lib/PhpSpreadsheet/vendor/autoload.php';
} else {
    if (function_exists('logModuleCall')) {
        logModuleCall('btkreports', 'LibraryLoad - btkreports.php', 'PhpSpreadsheet autoload.php not found. Excel export/import features will not work.', null, 'CRITICAL');
    } else {
        error_log('BTK Reports Module Error: PhpSpreadsheet autoload.php not found in ' . __DIR__ . '/lib/PhpSpreadsheet/vendor/');
    }
}

if (file_exists(__DIR__ . '/lib/NviSoapClient.php')) {
    require_once __DIR__ . '/lib/NviSoapClient.php';
} else {
    if (function_exists('logModuleCall')) {
        logModuleCall('btkreports', 'LibraryLoad - btkreports.php', 'NviSoapClient.php not found. NVI verification features will not work.', null, 'CRITICAL');
    } else {
        error_log('BTK Reports Module Error: NviSoapClient.php not found in ' . __DIR__ . '/lib/');
    }
}

if (file_exists(__DIR__ . '/lib/ExcelExporter.php')) {
    require_once __DIR__ . '/lib/ExcelExporter.php';
} else {
     if (function_exists('logModuleCall')) {
        logModuleCall('btkreports', 'LibraryLoad - btkreports.php', 'ExcelExporter.php not found. Excel export/import via helper class will not work.', null, 'WARNING');
    } else {
        error_log('BTK Reports Module Error: ExcelExporter.php not found in ' . __DIR__ . '/lib/');
    }
}

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as WriterXlsxPhpSpreadsheet;

use WHMCS\Database\Capsule;
use WHMCS\Utility\Token\TokenManager;
use WHMCS\Module\Addon\BtkReports\Lib\NviSoapClient;
use WHMCS\Module\Addon\BtkReports\Lib\ExcelExporter;

if (!defined('BTKREPORTS_MODULE_NAME')) {
    define('BTKREPORTS_MODULE_NAME', 'btkreports');
}
if (!defined('BTKREPORTS_LOG_LEVEL_ERROR')) { define('BTKREPORTS_LOG_LEVEL_ERROR', 'error'); }
if (!defined('BTKREPORTS_LOG_LEVEL_INFO')) { define('BTKREPORTS_LOG_LEVEL_INFO', 'info'); }
if (!defined('BTKREPORTS_LOG_LEVEL_DEBUG')) { define('BTKREPORTS_LOG_LEVEL_DEBUG', 'debug'); }

if (!function_exists('btkreports_load_language')) {
    function btkreports_load_language() {
        $moduleName = BTKREPORTS_MODULE_NAME; $lang = []; global $_ADMINLANG;
        if (isset($_ADMINLANG[$moduleName]) && is_array($_ADMINLANG[$moduleName])) $lang = $_ADMINLANG[$moduleName];
        else { $langFilePath = __DIR__ . '/lang/turkish.php'; if (file_exists($langFilePath)) { $current_adminlang_btk = $_ADMINLANG[$moduleName] ?? null; include $langFilePath; if (isset($_ADMINLANG[$moduleName]) && is_array($_ADMINLANG[$moduleName])) $lang = $_ADMINLANG[$moduleName]; elseif ($current_adminlang_btk) { $_ADMINLANG[$moduleName] = $current_adminlang_btk; $lang = $current_adminlang_btk; }}}
        $defaults = ['module_name' => 'BTK Reports (Dil Hatası - Ana)', 'access_denied' => 'Erişim Engellendi', 'error_field_required' => '{fieldName} alanı zorunludur.', 'error_unexpected' => 'Beklenmeyen bir hata oluştu.', 'changes_saved_successfully' => 'Değişiklikler başarıyla kaydedildi.'];
        foreach($defaults as $key => $value) if(empty($lang[$key])) $lang[$key] = $value; return $lang;
    }
}
if (!function_exists('btkreports_get_setting')) {
    function btkreports_get_setting($settingName, $defaultValue = null) {
        try { $setting = Capsule::table('mod_btk_settings')->where('setting', $settingName)->first();
            if ($setting) { if (in_array($settingName, ['ftp_password', 'backup_ftp_password']) && !empty($setting->value)) { if (function_exists('decrypt')) return decrypt($setting->value); logModuleCall(BTKREPORTS_MODULE_NAME, __FUNCTION__, "decrypt() bulunamadı: $settingName", null, 'WARNING'); return $setting->value; } return $setting->value; }
            return $defaultValue;
        } catch (\Exception $e) { logModuleCall(BTKREPORTS_MODULE_NAME, __FUNCTION__, "Ayar okuma hatası: $settingName", $e->getMessage(), null, 'ERROR'); return $defaultValue; }
    }
}
if (!function_exists('btkreports_get_all_settings')) {
    function btkreports_get_all_settings() {
        $settingsFromDB = [];
        try { $results = Capsule::table('mod_btk_settings')->get();
            foreach ($results as $result) { if (in_array($result->setting, ['ftp_password', 'backup_ftp_password']) && !empty($result->value)) { if (function_exists('decrypt')) { $settingsFromDB[$result->setting] = decrypt($result->value); $settingsFromDB[$result->setting . '_encrypted_raw'] = $result->value; } else $settingsFromDB[$result->setting] = $result->value; } else $settingsFromDB[$result->setting] = $result->value; }
        } catch (\Exception $e) { logModuleCall(BTKREPORTS_MODULE_NAME, __FUNCTION__, "Tüm ayarları okuma hatası", $e->getMessage(), null, 'ERROR'); }
        return array_merge(btkreports_get_default_settings_array(), $settingsFromDB);
    }
}
if (!function_exists('btkreports_save_setting')) {
    function btkreports_save_setting($settingName, $value) {
        try { Capsule::table('mod_btk_settings')->updateOrInsert(['setting' => $settingName], ['value' => is_array($value) ? json_encode($value) : $value]); return true;
        } catch (\Exception $e) { logModuleCall(BTKREPORTS_MODULE_NAME, __FUNCTION__, "Ayar '$settingName' kaydetme hatası.", null, $e->getMessage(), null, 'ERROR'); return false; }
    }
}
if (!function_exists('btkreports_get_default_settings_array')) {
    function btkreports_get_default_settings_array() {
        return [
            'operator_code' => '000', 'operator_name' => 'OPERATOR_KISAKOD', 'operator_title_official' => 'OPERATÖR RESMİ TİCARET ÜNVANI LİMİTED ŞİRKETİ',
            'ftp_host' => '', 'ftp_username' => '', 'ftp_password' => '', 'ftp_port' => '21', 'ftp_passive_mode' => '1',
            'ftp_path_abone_rehber' => '/REHBER/', 'ftp_path_abone_hareket' => '/HAREKET/', 'ftp_path_personel_excel' => '/PERSONEL/',
            'use_backup_ftp' => '0',
            'backup_ftp_host' => '', 'backup_ftp_username' => '', 'backup_ftp_password' => '', 'backup_ftp_port' => '21', 'backup_ftp_passive_mode' => '1',
            'backup_ftp_path_abone_rehber' => '/ARSIV/REHBER/', 'backup_ftp_path_abone_hareket' => '/ARSIV/HAREKET/', 'backup_ftp_path_personel_excel' => '/ARSIV/PERSONEL/',
            'cron_abone_rehber_time' => '0 10 1 * *', 'cron_abone_hareket_time' => '0 1 * * *', 'cron_personel_excel_time' => '0 16 L 6,12 *',
            'send_empty_reports' => '0', 'personel_excel_filename_format' => 'default',
            'hareket_report_days_to_keep_in_live' => '7', 'max_execution_time_cron' => '300',
            'log_level' => BTKREPORTS_LOG_LEVEL_ERROR, 'auto_retry_failed_ftp' => '0', 'retry_failed_ftp_count' => '3',
            'delete_tables_on_deactivate_confirm' => '0'
        ];
    }
}
if (!function_exists('btkreports_save_default_settings')) {
    function btkreports_save_default_settings() {
        $defaults = btkreports_get_default_settings_array();
        foreach ($defaults as $key => $value) if (Capsule::table('mod_btk_settings')->where('setting', $key)->doesntExist()) btkreports_save_setting($key, $value);
    }
}
if (!function_exists('btkreports_split_sql_file')) {
    function btkreports_split_sql_file($sqlContent, $delimiter = ';') {
        $queries = []; $sqlContent = preg_replace(["/\s*--(.*?)\r?\n/", "/\s*#.*?\r?\n/", "/\s*\/\*(.*?)\*\/\s*/s"], '', $sqlContent);
        $rawQueries = explode($delimiter, $sqlContent); $currentQuery = '';
        foreach ($rawQueries as $part) { $trimmedPart = trim($part); if (!empty($trimmedPart)) $queries[] = $trimmedPart . $delimiter; }
        return array_filter($queries, function($q){ return !empty(trim(rtrim(trim($q), ';'))); });
    }
}
if (!function_exists('btkreports_sanitize_ftp_path')) {
    function btkreports_sanitize_ftp_path($path) {
        $path = trim(str_replace('\\', '/', $path)); if (empty($path) || $path === '/') return '/';
        if (strpos($path, '/') !== 0) $path = '/' . $path; if (substr($path, -1) !== '/') $path .= '/';
        return preg_replace('#/+#', '/', $path);
    }
}
if (!function_exists('btkreports_get_admin_folder_name')) {
    function btkreports_get_admin_folder_name() {
        if (class_exists('\WHMCS\Admin\AdminServiceProvider')) { $adminFolder = \WHMCS\Admin\AdminServiceProvider::getAdminFolderName(); if (!empty($adminFolder)) return $adminFolder; }
        if (isset($GLOBALS['customadminpath']) && !empty($GLOBALS['customadminpath'])) return $GLOBALS['customadminpath'];
        $ds = DIRECTORY_SEPARATOR; $configPath = dirname(dirname(dirname(__DIR__))) . $ds . 'configuration.php';
        if (file_exists($configPath)) { $configContent = @file_get_contents($configPath); if ($configContent && preg_match('/\$customadminpath\s*=\s*[\'"]([a-zA-Z0-9_]+)[\'"]\s*;/', $configContent, $matches)) if (!empty($matches[1])) return $matches[1]; }
        return 'admin';
    }
}
if (!function_exists('btkreports_format_full_address_from_obj')) {
    function btkreports_format_full_address_from_obj($addressInput) {
        if (empty($addressInput)) return ''; $addressObj = is_array($addressInput) ? (object) $addressInput : $addressInput; $parts = [];
        if (!empty($addressObj->adres_cadde_sokak_bulvar)) $parts[] = $addressObj->adres_cadde_sokak_bulvar; if (!empty($addressObj->adres_bina_adi_no)) $parts[] = $addressObj->adres_bina_adi_no;
        $kapiPart = ''; if (!empty($addressObj->adres_dis_kapi_no)) $kapiPart .= "No:" . $addressObj->adres_dis_kapi_no; if (!empty($addressObj->adres_ic_kapi_no)) $kapiPart .= ($kapiPart ? " D:" : "D:") . $addressObj->adres_ic_kapi_no; if ($kapiPart) $parts[] = $kapiPart;
        $mahalleAdi = ''; if (!empty($addressObj->adres_mahalle_ref_kodu)) { $mahalle = Capsule::table('mod_btk_adres_mahalle')->where('mahalle_koy_kodu', $addressObj->adres_mahalle_ref_kodu)->first(); if($mahalle) $mahalleAdi = $mahalle->mahalle_adi; } if (empty($mahalleAdi) && !empty($addressObj->adres_mahalle_adi_manual)) $mahalleAdi = $addressObj->adres_mahalle_adi_manual; if ($mahalleAdi) $parts[] = $mahalleAdi;
        $ilceAdi = ''; if (!empty($addressObj->adres_ilce_ref_kodu)) { $ilce = Capsule::table('mod_btk_adres_ilce')->where('ilce_kodu', $addressObj->adres_ilce_ref_kodu)->first(); if($ilce) $ilceAdi = $ilce->ilce_adi; } if (empty($ilceAdi) && !empty($addressObj->adres_ilce_adi_manual)) $ilceAdi = $addressObj->adres_ilce_adi_manual;
        $ilAdi = ''; if (!empty($addressObj->adres_il_ref_kodu)) { $il = Capsule::table('mod_btk_adres_il')->where('il_kodu', $addressObj->adres_il_ref_kodu)->first(); if($il) $ilAdi = $il->il_adi; } if (empty($ilAdi) && !empty($addressObj->adres_il_adi_manual)) $ilAdi = $addressObj->adres_il_adi_manual;
        if ($ilceAdi && $ilAdi) $parts[] = $ilceAdi . '/' . $ilAdi; elseif ($ilceAdi && !$ilAdi && !empty($addressObj->adres_ilce_ref_kodu)) { $ilFromIlce = Capsule::table('mod_btk_adres_ilce AS ilce')->join('mod_btk_adres_il AS il_ref', 'ilce.il_kodu', '=', 'il_ref.il_kodu')->where('ilce.ilce_kodu', $addressObj->adres_ilce_ref_kodu)->value('il_ref.il_adi'); if ($ilFromIlce) $parts[] = $ilceAdi . '/' . $ilFromIlce; else $parts[] = $ilceAdi; }
        elseif ($ilAdi) $parts[] = $ilAdi; if (!empty($addressObj->adres_posta_kodu)) $parts[] = $addressObj->adres_posta_kodu;
        return implode(', ', array_filter($parts));
    }
}

function btkreports_MetaData() { /* ... (BÖLÜM 1'deki gibi) ... */ }
function btkreports_activate() { /* ... (BÖLÜM 1'deki gibi, düzeltilmiş) ... */ }
function btkreports_deactivate() { /* ... (BÖLÜM 1'deki gibi, düzeltilmiş) ... */ }
function btkreports_upgrade($vars) { /* ... (BÖLÜM 1'deki gibi) ... */ }
function btkreports_config() { /* ... (BÖLÜM 2'deki gibi, TAMAMI) ... */ }

// ####################################################################################
// ####################### BÖLÜM 1 ve 2 İÇERİĞİ BİTİŞİ ################################
// ####################################################################################


// ####################################################################################
// ####################### BU MESAJIN YENİ İÇERİĞİ BAŞLANGICI #########################
// ####################################################################################

/**
 * Müşteri Profili BTK Sekmesi İçeriğini Oluşturur ve Render Eder (Hook için)
 * Bu fonksiyon, AdminClientProfileTabFields hook'u tarafından çağrılır.
 * TPL için gerekli tüm verileri hazırlar ve TPL'i render edip HTML string olarak döndürür.
 */
if (!function_exists('btkreports_get_client_profile_tab_content_for_hook')) {
    function btkreports_get_client_profile_tab_content_for_hook($clientId, $langFromHook) {
        $moduleName = BTKREPORTS_MODULE_NAME;
        global $smarty;
        $lang = (!empty($langFromHook) && is_array($langFromHook)) ? $langFromHook : btkreports_load_language();

        if (is_null($smarty)) {
            logModuleCall($moduleName, __FUNCTION__, 'Smarty nesnesi bulunamadı (Müşteri Profili Hook).', ['clientId' => $clientId], 'CRITICAL');
            return '<div class="alert alert-danger">Smarty Error! (Ref: BGTCPTCH_SMRT_CLIENT_V11)</div>';
        }

        $btkClientData = []; $yerlesimAdresiData = []; $kurumAdresiData = [];
        $initialIlcelerYerlesim = []; $initialMahallelerYerlesim = [];
        $initialIlcelerKurum = []; $initialMahallelerKurum = [];

        try {
            $clientDataRaw = Capsule::table('mod_btk_musteri_detaylari')->where('client_id', $clientId)->first();
            if ($clientDataRaw) {
                $btkClientData = json_decode(json_encode($clientDataRaw), true);
                $yerlesimAdresi = Capsule::table('mod_btk_adresler')->where('client_id', $clientId)->where('adres_tipi', 'YERLESIM')->orderBy('id', 'desc')->first();
                if ($yerlesimAdresi) {
                    $yerlesimAdresiData = json_decode(json_encode($yerlesimAdresi), true);
                    if ($yerlesimAdresi->adres_il_ref_kodu) {
                        $initialIlcelerYerlesim = Capsule::table('mod_btk_adres_ilce')->where('il_kodu', $yerlesimAdresi->adres_il_ref_kodu)->orderBy('ilce_adi')->get(['ilce_kodu as id', 'ilce_adi as name'])->all();
                        if ($yerlesimAdresi->adres_ilce_ref_kodu) $initialMahallelerYerlesim = Capsule::table('mod_btk_adres_mahalle')->where('ilce_kodu', $yerlesimAdresi->adres_ilce_ref_kodu)->orderBy('mahalle_adi')->get(['mahalle_koy_kodu as id', 'mahalle_adi as name'])->all();
                    }
                }
                if (isset($btkClientData['kurum_adres_id']) && $btkClientData['kurum_adres_id']) {
                    $kurumAdresi = Capsule::table('mod_btk_adresler')->find($btkClientData['kurum_adres_id']);
                    if ($kurumAdresi && ($kurumAdresi->adres_tipi === 'KURUM_YETKILI' || $kurumAdresi->adres_tipi === 'KURUM') && $kurumAdresi->client_id == $clientId) {
                         $kurumAdresiData = json_decode(json_encode($kurumAdresi), true);
                        if ($kurumAdresi->adres_il_ref_kodu) {
                            $initialIlcelerKurum = Capsule::table('mod_btk_adres_ilce')->where('il_kodu', $kurumAdresi->adres_il_ref_kodu)->orderBy('ilce_adi')->get(['ilce_kodu as id', 'ilce_adi as name'])->all();
                            if ($kurumAdresi->adres_ilce_ref_kodu) $initialMahallelerKurum = Capsule::table('mod_btk_adres_mahalle')->where('ilce_kodu', $kurumAdresi->adres_ilce_ref_kodu)->orderBy('mahalle_adi')->get(['mahalle_koy_kodu as id', 'mahalle_adi as name'])->all();
                        }
                    } else if ($kurumAdresi) { $btkClientData['kurum_adres_id'] = null; }
                }
            } else {
                $whmcsClient = Capsule::table('tblclients')->find($clientId);
                if ($whmcsClient) {
                    $btkClientData = ['abone_adi' => $whmcsClient->firstname, 'abone_soyadi' => $whmcsClient->lastname, 'abone_unvan' => $whmcsClient->companyname ?: ($whmcsClient->firstname . ' ' . $whmcsClient->lastname), 'abone_vergi_numarasi' => $whmcsClient->tax_id];
                    $whmcsIlAdi = trim($whmcsClient->state); $ilRef = Capsule::table('mod_btk_adres_il')->where('il_adi', 'LIKE', $whmcsIlAdi)->first();
                    if ($ilRef) { $yerlesimAdresiData['adres_il_ref_kodu'] = $ilRef->il_kodu; $ilceler = Capsule::table('mod_btk_adres_ilce')->where('il_kodu', $ilRef->il_kodu)->orderBy('ilce_adi')->get(['ilce_kodu as id', 'ilce_adi as name'])->all(); $initialIlcelerYerlesim = $ilceler; $whmcsIlceAdi = trim($whmcsClient->city); foreach ($ilceler as $ilce) if (0 === strcasecmp(mb_strtolower($ilce->name, 'UTF-8'), mb_strtolower($whmcsIlceAdi, 'UTF-8'))) { $yerlesimAdresiData['adres_ilce_ref_kodu'] = $ilce->id; $initialMahallelerYerlesim = Capsule::table('mod_btk_adres_mahalle')->where('ilce_kodu', $ilce->id)->orderBy('mahalle_adi')->get(['mahalle_koy_kodu as id', 'mahalle_adi as name'])->all(); break; }}
                    else $yerlesimAdresiData['adres_il_adi_manual'] = $whmcsClient->state;
                    if (empty($yerlesimAdresiData['adres_ilce_ref_kodu']) && !empty($whmcsClient->city)) $yerlesimAdresiData['adres_ilce_adi_manual'] = $whmcsClient->city;
                    $yerlesimAdresiData['adres_cadde_sokak_bulvar'] = $whmcsClient->address1; $yerlesimAdresiData['adres_acik_full'] = $whmcsClient->address2; $yerlesimAdresiData['adres_posta_kodu'] = $whmcsClient->postcode;
                    $turkey = Capsule::table('mod_btk_ref_ulkeler')->where('iso_3166_1_alpha_3', 'TUR')->first(); if ($turkey) $btkClientData['abone_uyruk_ref_id'] = $turkey->id;
                    $btkClientData['musteri_tipi_kodu'] = 'G-BIREYSEL';
                }
            }
            $refMusteriTipleri = Capsule::table('mod_btk_ref_musteri_tipleri')->orderBy('aciklama')->get()->all(); $refCinsiyet = Capsule::table('mod_btk_ref_cinsiyet')->get()->all(); $refUlkeler = Capsule::table('mod_btk_ref_ulkeler')->orderBy('ulke_adi_tr')->get(['id', 'ulke_adi_tr', 'iso_3166_1_alpha_3'])->all(); $refMeslekler = Capsule::table('mod_btk_ref_meslekler')->orderBy('meslek_adi')->get()->all(); $refKimlikTipleri = Capsule::table('mod_btk_ref_kimlik_tipleri')->orderBy('aciklama')->get()->all(); $refKimlikAidiyetleri = Capsule::table('mod_btk_ref_kimlik_aidiyetleri')->orderBy('aciklama')->get()->all(); $refIller = Capsule::table('mod_btk_adres_il')->orderBy('il_adi')->get()->all();
            $csrfTokenClient = ''; if (class_exists('\WHMCS\Utility\Token\TokenManager')) $csrfTokenClient = TokenManager::generate('Admin.Client.BTKSave.' . $clientId);
            $clientDetails = getClientsDetails($clientId);
            $templateVars = [
                'lang' => $lang, 'modulelink' => 'addonmodules.php?module=' . $moduleName, 'clientid' => $clientId,
                'btk_musteri_data' => (object) $btkClientData, 'btk_yerlesim_adresi_data' => (object) $yerlesimAdresiData, 'btk_kurum_adresi_data' => (object) $kurumAdresiData,
                'btk_yerlesim_adresi_data_ilceler_initial' => $initialIlcelerYerlesim, 'btk_yerlesim_adresi_data_mahalleler_initial' => $initialMahallelerYerlesim,
                'btk_kurum_adresi_data_ilceler_initial' => $initialIlcelerKurum, 'btk_kurum_adresi_data_mahalleler_initial' => $initialMahallelerKurum,
                'btk_ref_musteri_tipleri' => $refMusteriTipleri, 'btk_ref_cinsiyet' => $refCinsiyet, 'btk_ref_ulkeler' => $refUlkeler,
                'btk_ref_meslekler' => $refMeslekler, 'btk_ref_kimlik_tipleri' => $refKimlikTipleri, 'btk_ref_kimlik_aidiyetleri' => $refKimlikAidiyetleri,
                'btk_ref_iller' => $refIller, 'btk_csrf_token_client' => $csrfTokenClient,
            ];
            if (is_array($clientDetails)) foreach($clientDetails as $key => $value) if (!isset($templateVars[$key])) $templateVars[$key] = $value;
            if (isset($_SESSION['btkClientProfileSaveMsg'])) { $templateVars['btk_client_action_result'] = $_SESSION['btkClientProfileSaveMsg']; unset($_SESSION['btkClientProfileSaveMsg']); }
            $templatePath = __DIR__ . '/templates/admin/client_details.tpl';
            if (file_exists($templatePath)) { foreach ($templateVars as $key => $value) $smarty->assign($key, $value); return $smarty->fetch($templatePath); }
            else { logModuleCall($moduleName, __FUNCTION__, 'client_details.tpl bulunamadı.', ['path' => $templatePath], 'ERROR'); return '<div class="alert alert-danger">Template Missing</div>';}
        } catch (\Exception $e) { logModuleCall($moduleName, __FUNCTION__, 'Müşteri BTK sekmesi oluşturma hatası.', ['cid' => $clientId], $e->getMessage(), $e->getTraceAsString(), 'CRITICAL'); return '<div class="alert alert-danger">Error: ' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8') . '</div>';}
    }
}

// BÖLÜM 3 SONU
// modules/addons/btkreports/btkreports.php
// GERÇEK TAM SÜRÜM (Fonksiyon Sırası Düzeltilmiş ve Tüm Mevcut Fonksiyonlar Dahil)
// BÖLÜM 4 / 6

// Önceki bölümlerdeki fonksiyonların ve tanımlamaların devamı...
// (MetaData, activate, deactivate, upgrade, config, temel yardımcı fonksiyonlar,
//  get_client_profile_tab_content_for_hook fonksiyonları bir önceki bölümlerdeydi)

/**
 * Modül Admin Arayüzü Çıktı Fonksiyonu
 * Bu fonksiyon, modülün admin panelindeki tüm sayfaların görüntülenmesini ve
 * ilgili aksiyonların (AJAX, form gönderimleri vb.) işlenmesini yönetir.
 */
if (!function_exists('btkreports_output')) {
    function btkreports_output($vars) {
        $moduleName = BTKREPORTS_MODULE_NAME;
        $lang = btkreports_load_language();
        $modulelink = $vars['modulelink']; // addonmodules.php?module=btkreports
        $version = $vars['version'];
        $helperLink = $vars['Helplink']; // MetaData'da tanımlanan yardım linki
        $adminCustomPath = btkreports_get_admin_folder_name(); // Admin klasör adını al

        $action = isset($_REQUEST['action']) ? trim(strtolower($_REQUEST['action'])) : 'index';
        $sub_action = isset($_REQUEST['sub_action']) ? trim(strtolower($_REQUEST['sub_action'])) : '';

        // Genel Smarty değişkenleri (her sayfada kullanılabilir)
        $smartyVars = [
            'moduleName' => $moduleName,
            'lang' => $lang,
            'modulelink' => $modulelink,
            'version' => $version,
            'helperLink' => $helperLink,
            'adminCustomPath' => $adminCustomPath,
            'modulePath' => 'modules/addons/' . $moduleName . '/',
            'currentAction' => $action,
            'csrfToken' => '', // Her sayfa için gerekirse özel olarak veya genel bir tane oluşturulacak
            // Sayfalara özel varsayılanlar (ilgili prepare_..._page_data fonksiyonları içinde doldurulacak)
            'action_result_personnel' => null, 'edit_personnel_data' => null, 'personnel_list' => [],
            'whmcs_admins_for_select' => [], 'nationalities_for_select' => [], 'professions_for_select' => [],
            'pagination_output' => '', // Personel için sayfalama (ve diğer listelemeler için)
            'filters_personnel' => [], // Personel filtreleri için
            // Diğer sayfa özel değişkenleri için de benzer ön tanımlamalar yapılabilir.
        ];
        // Genel CSRF Token (AJAX testleri veya genel linkler için)
        if (class_exists('\WHMCS\Utility\Token\TokenManager')) {
            $smartyVars['csrfToken'] = TokenManager::generate('Admin.Module.btkreports.GlobalAction');
        } elseif (function_exists('generate_token')) { // WHMCS < 8 için fallback
            $smartyVars['csrfToken'] = generate_token();
        }


        // Üst Başlık ve Navigasyon Menüsü (Her sayfada gösterilecek)
        echo '<h2>' . ($lang['module_name'] ?? 'BTK Reports') . ' <small>v' . $version . '</small></h2>';
        echo '<div style="margin-bottom: 15px;">
            <a href="' . $modulelink . '" class="btn btn-default' . ($action == 'index' ? ' active' : '') . '"><i class="fas fa-tachometer-alt"></i> ' . ($lang['dashboard_title'] ?? 'Dashboard') . '</a>
            <a href="' . $modulelink . '&action=config" class="btn btn-default' . ($action == 'config' ? ' active' : '') . '"><i class="fas fa-cogs"></i> ' . ($lang['config_title'] ?? 'Settings') . '</a>
            <a href="' . $modulelink . '&action=generate" class="btn btn-default' . ($action == 'generate' ? ' active' : '') . '"><i class="fas fa-file-alt"></i> ' . ($lang['generate_reports_title'] ?? 'Generate Reports') . '</a>
            <a href="' . $modulelink . '&action=personnel" class="btn btn-default' . ($action == 'personnel' ? ' active' : '') . '"><i class="fas fa-users"></i> ' . ($lang['personnel_management_title'] ?? 'Personnel') . '</a>
            <a href="' . $modulelink . '&action=pop_management" class="btn btn-default' . ($action == 'pop_management' ? ' active' : '') . '"><i class="fas fa-broadcast-tower"></i> ' . ($lang['pop_management_title'] ?? 'POP Points') . '</a>
            <a href="' . $modulelink . '&action=product_mapping" class="btn btn-default' . ($action == 'product_mapping' ? ' active' : '') . '"><i class="fas fa-link"></i> ' . ($lang['product_mapping_title'] ?? 'Product Mapping') . '</a>
            <a href="' . $modulelink . '&action=logs" class="btn btn-default' . ($action == 'logs' ? ' active' : '') . '"><i class="fas fa-clipboard-list"></i> ' . ($lang['logs_view_title'] ?? 'Logs') . '</a>
            <a href="' . $helperLink . '" target="_blank" class="btn btn-info"><i class="fas fa-question-circle"></i> ' . ($lang['view_readme_long'] ?? 'Help') . '</a>
        </div>';

        // Session'dan gelen mesajları göster
        $sessionMessagesToDisplay = ['btkModuleMsg', 'btkClientProfileSaveMsg', 'btkServiceDetailsSaveMsg'];
        foreach ($sessionMessagesToDisplay as $sessionKey) {
            if (isset($_SESSION[$sessionKey]) && is_array($_SESSION[$sessionKey])) {
                $msgTypeClass = ($_SESSION[$sessionKey]['type'] ?? ($_SESSION[$sessionKey]['status'] ?? 'info')) === 'success' ? 'success' : 'danger';
                echo '<div class="alert alert-' . $msgTypeClass . '" role="alert">' . htmlspecialchars($_SESSION[$sessionKey]['message'] ?? '', ENT_QUOTES, 'UTF-8') . '</div>';
                unset($_SESSION[$sessionKey]);
            }
        }

        $templateFile = ''; // Yüklenecek TPL dosyasının adı (uzantısız)
        switch ($action) {
            case 'config':
                $configData = btkreports_config(); // Bu 'vars' anahtarlı bir dizi döner
                $templateFile = 'config';
                $smartyVars = array_merge($smartyVars, $configData['vars']);
                $smartyVars['csrfToken'] = $configData['vars']['csrfToken'] ?? $smartyVars['csrfToken']; // Config'in kendi özel token'ı
                break;

            case 'personnel':
                $templateFile = 'personnel';
                $smartyVars['page_title'] = $lang['personnel_management_title'] ?? 'Personnel Management';
                if (class_exists('\WHMCS\Utility\Token\TokenManager')) {
                    $smartyVars['csrfToken'] = TokenManager::generate('Admin.Module.btkreports.PersonnelAction');
                }
                btkreports_handle_personnel_actions($sub_action, $_REQUEST, $modulelink, $smartyVars, $lang);
                btkreports_prepare_personnel_page_data($smartyVars, $_GET, $lang);
                break;

            case 'get_address_data': // Dinamik adres dropdown'ları için AJAX
                header('Content-Type: application/json');
                $ajaxToken = $_POST['token'] ?? $_GET['token'] ?? '';
                $isValidToken = false;
                $requestingClientIdForToken = $_POST['client_id_for_token'] ?? '0';
                $requestingServiceIdForToken = $_POST['service_id_for_token'] ?? '0';

                if (class_exists('\WHMCS\Utility\Token\TokenManager')) {
                    $isValidToken = TokenManager::verify('Admin.Module.btkreports.GlobalAction', $ajaxToken) ||
                                    TokenManager::verify('Admin.Client.BTKSave.' . $requestingClientIdForToken, $ajaxToken) ||
                                    TokenManager::verify('Admin.Service.BTKSave.' . $requestingServiceIdForToken, $ajaxToken);
                }
                if (!$isValidToken && function_exists('check_token')) {
                     check_token("WHMCS.admin.default");
                     $isValidToken = true;
                }
                if (!$isValidToken) {
                     logModuleCall($moduleName, $action . ' - CSRF Error (Adres AJAX)', ['token_received' => $ajaxToken], 'CSRF Token Hatalı veya Eksik.', 'ERROR');
                     echo json_encode(['success' => false, 'message' => ($lang['access_denied'] ?? 'Access Denied') . ' (CSRF Token - Adres AJAX V5)']);
                     exit;
                }

                $type = $_POST['type'] ?? null;
                $parentIdStr = isset($_POST['parent_id']) ? (string)$_POST['parent_id'] : null;
                $items = []; $success = false;

                if ($parentIdStr !== null && !empty($parentIdStr) && in_array($type, ['ilce', 'mahalle'])) {
                    try {
                        if ($type === 'ilce') {
                            $items = Capsule::table('mod_btk_adres_ilce')->where('il_kodu', $parentIdStr)->orderBy('ilce_adi')->get(['ilce_kodu as id', 'ilce_adi as name'])->all();
                            $success = true;
                        } elseif ($type === 'mahalle') {
                            $items = Capsule::table('mod_btk_adres_mahalle')->where('ilce_kodu', $parentIdStr)->orderBy('mahalle_adi')->get(['mahalle_koy_kodu as id', 'mahalle_adi as name'])->all();
                            $success = true;
                        }
                    } catch (\Exception $e) {
                        logModuleCall($moduleName, $action . ' - DB Error (Adres AJAX)', ['type' => $type, 'parent_id' => $parentIdStr], $e->getMessage(), $e->getTraceAsString(), 'CRITICAL');
                        echo json_encode(['success' => false, 'message' => 'Veritabanı hatası: ' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8')]);
                        exit;
                    }
                } else {
                     logModuleCall($moduleName, $action . ' - Invalid Params (Adres AJAX)', ['type' => $type, 'parent_id' => $parentIdStr], 'Geçersiz tip veya parent_id boş.', 'WARNING');
                }
                echo json_encode(['success' => $success, 'items' => $items]);
                exit;

            case 'verify_nvi_client': // Müşteri veya Personel NVI Doğrulama AJAX
                header('Content-Type: application/json');
                $ajaxNviToken = $_POST['token'] ?? '';
                $contextId = isset($_POST['userid']) && is_numeric($_POST['userid']) ? (int)$_POST['userid'] : (isset($_POST['personnelid']) && is_numeric($_POST['personnelid']) ? (int)$_POST['personnelid'] : 0);
                $contextType = isset($_POST['context']) ? $_POST['context'] : ($clientIdForNvi > 0 ? 'client_profile' : 'unknown'); // 'client_profile' veya 'personnel_profile'

                $isValidNviToken = false;
                $expectedNviTokenName = '';
                if ($contextType === 'client_profile' && $contextId > 0) $expectedNviTokenName = 'Admin.Client.BTKSave.' . $contextId;
                elseif ($contextType === 'personnel_profile' && $contextId > 0) $expectedNviTokenName = 'Admin.Module.btkreports.PersonnelAction'; // Personel formu için farklı token

                if (class_exists('\WHMCS\Utility\Token\TokenManager')) {
                    $isValidNviToken = TokenManager::verify($expectedNviTokenName, $ajaxNviToken) || TokenManager::verify('Admin.Module.btkreports.GlobalAction', $ajaxNviToken);
                }
                if (!$isValidNviToken && function_exists('check_token')) { check_token("WHMCS.admin.default"); $isValidNviToken = true; }

                if (!$isValidNviToken) {
                     logModuleCall($moduleName, $action . ' - CSRF Error (NVI)', ['token' => $ajaxNviToken, 'ctx_id' => $contextId, 'ctx_type' => $contextType], 'CSRF Token Hatalı.', 'ERROR');
                     echo json_encode(['success' => false, 'message' => ($lang['access_denied'] ?? 'Access Denied') . ' (CSRF Token - NVI AJAX V5)']);
                     exit;
                }

                $tcknToVerify = preg_replace('/[^0-9]/', '', $_POST['tckn_to_verify'] ?? '');
                $adToVerify = trim($_POST['ad_for_nvi'] ?? '');
                $soyadToVerify = trim($_POST['soyad_for_nvi'] ?? '');
                $dogumTarihiInput = $_POST['dogum_tarihi_for_nvi'] ?? ''; // YYYY-MM-DD

                $isYabanciKimlik = (substr($tcknToVerify, 0, 2) === '99' && strlen($tcknToVerify) === 11);
                $nviResult = ['success' => false, 'message' => ($lang['error_field_required'] ?? 'Error') . ' (Kimlik No, Ad, Soyad veya Doğum Tarihi)', 'is_valid' => null, 'nvi_response_text' => 'Eksik parametreler.'];

                if ($contextId > 0 && !empty($tcknToVerify) && !empty($adToVerify) && !empty($soyadToVerify) && !empty($dogumTarihiInput)) {
                    $processedNviResult = null;
                    if ($isYabanciKimlik) {
                        if (preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $dogumTarihiInput, $matchesDate) && checkdate($matchesDate[2], $matchesDate[3], $matchesDate[1])) {
                            $processedNviResult = btkreports_nvi_yabanci_kn_dogrula_internal($tcknToVerify, $adToVerify, $soyadToVerify, (int)$matchesDate[3], (int)$matchesDate[2], (int)$matchesDate[1]);
                        } else { $nviResult = ['success' => false, 'message' => ($lang['error_date_invalid_format'] ?? 'Invalid date') . ' (Yabancı: GG.AA.YYYY)', 'is_valid' => false, 'nvi_response_text' => 'Doğum tarihi eksik/geçersiz.'];}
                    } else { // TCKN
                        if (preg_match('/^(\d{4})/', $dogumTarihiInput, $matchesYear)) {
                            $dogumYil = (int)$matchesYear[1];
                            if ($dogumYil >= 1900 && $dogumYil <= date('Y')) $processedNviResult = btkreports_nvi_tckn_dogrula_internal($tcknToVerify, $adToVerify, $soyadToVerify, $dogumYil);
                            else $nviResult = ['success' => false, 'message' => ($lang['error_date_invalid_format'] ?? 'Invalid year') . ' (TCKN: YYYY)', 'is_valid' => false, 'nvi_response_text' => 'Doğum yılı geçersiz.'];
                        } else { $nviResult = ['success' => false, 'message' => ($lang['error_date_invalid_format'] ?? 'Invalid year') . ' (TCKN: YYYY)', 'is_valid' => false, 'nvi_response_text' => 'Doğum yılı eksik/geçersiz.'];}
                    }
                    if ($processedNviResult) {
                        $nviResult = $processedNviResult; $nviResult['nvi_response_text'] = $processedNviResult['user_message'];
                        $updateDataForNVI = []; $idFieldToUpdate = '';
                        if ($contextType === 'client_profile') { $dbTableToUpdate = 'mod_btk_musteri_detaylari'; $idFieldToUpdate = 'client_id'; }
                        elseif ($contextType === 'personnel_profile') { $dbTableToUpdate = 'mod_btk_personel'; $idFieldToUpdate = 'id'; }
                        if ($dbTableToUpdate) {
                            if ($isYabanciKimlik && $dbTableToUpdate === 'mod_btk_musteri_detaylari') { $updateDataForNVI['yabanci_kn_dogrulama_durumu'] = $processedNviResult['is_valid'] ? 1 : 0; $updateDataForNVI['yabanci_kn_dogrulama_zamani'] = date('Y-m-d H:i:s'); }
                            elseif (!$isYabanciKimlik) { $updateDataForNVI['tckn_dogrulama_durumu'] = $processedNviResult['is_valid'] ? 1 : 0; $updateDataForNVI['tckn_dogrulama_zamani'] = date('Y-m-d H:i:s'); }
                            if (!empty($updateDataForNVI)) Capsule::table($dbTableToUpdate)->updateOrInsert([$idFieldToUpdate => $contextId], $updateDataForNVI);
                        }
                    }
                } else { $nviResult['message'] = ($lang['no_records_found'] ?? 'Not Found') . ' (' . $contextType . ' ID: ' . $contextId . ')'; }
            }
            echo json_encode($nviResult);
            exit;
            
        case 'test_ftp_connection':
            $ftpType = $_POST['ftp_type'] ?? 'main'; $ajaxFtpToken = $_POST['token'] ?? ''; $isValidFtpToken = false;
            if (class_exists('\WHMCS\Utility\Token\TokenManager')) $isValidFtpToken = TokenManager::verify('Admin.Module.btkreports.ConfigSave', $ajaxFtpToken) || TokenManager::verify('Admin.Module.btkreports.GlobalAction', $ajaxFtpToken);
            if (!$isValidFtpToken && function_exists('check_token')) { check_token("WHMCS.admin.default"); $isValidFtpToken = true; }
            if (!$isValidFtpToken) { logModuleCall($moduleName, $action . ' - CSRF Error (FTP Test)', null, 'CSRF Token Hatalı.', 'ERROR'); echo json_encode(['success' => false, 'message' => ($lang['access_denied'] ?? 'Access Denied') . ' (CSRF Token)']); exit; }
            $ftpResult = btkreports_test_ftp_connection_action_v2($_POST); header('Content-Type: application/json'); echo json_encode($ftpResult); exit;

        // Diğer sayfa action'ları için TPL dosyalarını yükleme ve veri hazırlama
        case 'generate': $templateFile = 'generate'; $smartyVars['page_title'] = $lang['generate_reports_title'] ?? 'Rapor Oluştur'; if (class_exists('\WHMCS\Utility\Token\TokenManager')) $smartyVars['csrfToken'] = TokenManager::generate('Admin.Module.btkreports.GenerateAction'); /* btkreports_handle_generate_actions(); btkreports_prepare_generate_page_data(); */ break;
        case 'pop_management': $templateFile = 'pop_management'; $smartyVars['page_title'] = $lang['pop_management_title'] ?? 'POP Yönetimi'; if (class_exists('\WHMCS\Utility\Token\TokenManager')) $smartyVars['csrfToken'] = TokenManager::generate('Admin.Module.btkreports.PopAction'); /* ... */ break;
        case 'product_mapping': $templateFile = 'product_group_mappings'; $smartyVars['page_title'] = $lang['product_mapping_title'] ?? 'Ürün Eşleştirme'; if (class_exists('\WHMCS\Utility\Token\TokenManager')) $smartyVars['csrfToken'] = TokenManager::generate('Admin.Module.btkreports.ProductMapAction'); /* ... */ break;
        case 'logs': $templateFile = 'logs'; $smartyVars['page_title'] = $lang['logs_view_title'] ?? 'Loglar'; if (class_exists('\WHMCS\Utility\Token\TokenManager')) $smartyVars['csrfToken'] = TokenManager::generate('Admin.Module.btkreports.LogAction'); /* ... */ break;
        case 'index': default: $templateFile = 'index'; $smartyVars['page_title'] = $lang['dashboard_title'] ?? 'Dashboard'; $smartyVars['settings'] = btkreports_get_all_settings(); break;
    }

    if (!empty($templateFile)) {
        global $smarty; if (is_null($smarty)) { if (class_exists('WHMCS\Smarty')) $smarty = new \WHMCS\Smarty(); elseif (class_exists('Smarty')) $smarty = new \Smarty(); else { echo '<div class="alert alert-danger">Smarty Error!</div>'; return; } $smarty->setTemplateDir(ROOTDIR . '/templates/'); $smarty->setCompileDir($GLOBALS['templates_compiledir']); $smarty->setCaching(0); }
        foreach ($smartyVars as $key => $value) $smarty->assign($key, $value);
        try { $templatePath = __DIR__ . '/templates/admin/' . $templateFile . '.tpl'; if (file_exists($templatePath)) $smarty->display($templatePath); else echo '<div class="alert alert-danger">Template not found: ' . htmlspecialchars($templateFile, ENT_QUOTES, 'UTF-8') . '.tpl</div>';
        } catch (Exception $e) { logModuleCall($moduleName, __FUNCTION__ . " - TPL Error", $templateFile, $e->getMessage(), $e->getTraceAsString(), 'CRITICAL'); echo '<div class="alert alert-danger">Template Error: ' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8') . '</div>'; }
    } elseif (!in_array($action, ['get_address_data', 'verify_nvi_client', 'test_ftp_connection'])) { echo '<div class="alert alert-warning">Invalid action: ' . htmlspecialchars($action, ENT_QUOTES, 'UTF-8') . '</div>'; }
}

// BÖLÜM 4 SONU

// modules/addons/btkreports/btkreports.php
// GERÇEK TAM SÜRÜM (Tüm Ana İşlevler Dahil)
// BÖLÜM 5 / 6

// Önceki bölümlerdeki fonksiyonların ve tanımlamaların devamı...
// (MetaData, activate, deactivate, upgrade, config,
//  get_client_profile_tab_content_for_hook, output (AJAX, Personel hariç temel case'ler),
//  NVI internal fonksiyonları, Personel Yönetimi tüm fonksiyonları (get_list, get_count, get_data, save_data,
//  delete_personnel, sync_admins, export_excel, get_whmcs_admins_for_select,
//  get_nationalities_for_select, get_professions_for_select) bir önceki bölümlerdeydi)


/**
 * Hizmet Detayları BTK Sekmesi İçeriğini Oluşturur ve Render Eder (Hook için)
 * Bu fonksiyon, AdminClientServicesTabFields hook'u tarafından çağrılır.
 */
if (!function_exists('btkreports_get_service_details_tab_content_for_hook')) {
    function btkreports_get_service_details_tab_content_for_hook($serviceId, $clientId, $langFromHook) {
        $moduleName = BTKREPORTS_MODULE_NAME;
        global $smarty;
        $lang = (!empty($langFromHook) && is_array($langFromHook)) ? $langFromHook : btkreports_load_language();

        if (is_null($smarty)) {
            logModuleCall($moduleName, __FUNCTION__, 'Smarty nesnesi bulunamadı (Hizmet Detayları Hook).', ['serviceId' => $serviceId], 'CRITICAL');
            return '<div class="alert alert-danger">Smarty Error! (Ref: BGTSDCTH_SMRT_V7)</div>';
        }

        $btkHizmetData = []; $tesisAdresiData = [];
        $initialIlcelerTesis = []; $initialMahallelerTesis = [];

        try {
            $hizmetDataRaw = Capsule::table('mod_btk_hizmet_detaylari')->where('service_id', $serviceId)->first();
            if ($hizmetDataRaw) {
                $btkHizmetData = json_decode(json_encode($hizmetDataRaw), true);
                if (!empty($btkHizmetData['tesis_adres_id'])) {
                    $tesisAdresi = Capsule::table('mod_btk_adresler')->find($btkHizmetData['tesis_adres_id']);
                    if ($tesisAdresi && $tesisAdresi->adres_tipi === 'TESIS' && $tesisAdresi->service_id == $serviceId) {
                        $tesisAdresiData = json_decode(json_encode($tesisAdresi), true);
                        if ($tesisAdresi->adres_il_ref_kodu) {
                            $initialIlcelerTesis = Capsule::table('mod_btk_adres_ilce')->where('il_kodu', $tesisAdresi->adres_il_ref_kodu)->orderBy('ilce_adi')->get(['ilce_kodu as id', 'ilce_adi as name'])->all();
                            if ($tesisAdresi->adres_ilce_ref_kodu) $initialMahallelerTesis = Capsule::table('mod_btk_adres_mahalle')->where('ilce_kodu', $tesisAdresi->adres_ilce_ref_kodu)->orderBy('mahalle_adi')->get(['mahalle_koy_kodu as id', 'mahalle_adi as name'])->all();
                        }
                    } else if ($tesisAdresi) { $btkHizmetData['tesis_adres_id'] = null; }
                }
            } else { $btkHizmetData = ['tesis_adresi_ayni_mi' => true, 'hat_durum' => 'A', 'hat_durum_kodu_ref' => '1']; }

            $whmcsServiceCmdParams = ['serviceid' => $serviceId]; if ($clientId) $whmcsServiceCmdParams['clientid'] = $clientId;
            $whmcsServiceCmd = localAPI('GetClientsProducts', $whmcsServiceCmdParams);
            $whmcsServiceDataForTpl = $whmcsServiceCmd['products']['product'][0] ?? [];

            if (!$hizmetDataRaw) { // Varsayılanları ata
                if (isset($whmcsServiceDataForTpl['regdate'])) $btkHizmetData['abone_baslangic_tarihi'] = $whmcsServiceDataForTpl['regdate'];
                if (isset($whmcsServiceDataForTpl['name'])) $btkHizmetData['tarife_bilgisi'] = $whmcsServiceDataForTpl['name'];
                if (isset($whmcsServiceDataForTpl['dedicatedip'])) $btkHizmetData['statik_ip_blogu'] = $whmcsServiceDataForTpl['dedicatedip'];
                if (isset($whmcsServiceDataForTpl['username'])) $btkHizmetData['iss_kullanici_adi'] = $whmcsServiceDataForTpl['username'];
                if (isset($whmcsServiceDataForTpl['pid']) && empty($btkHizmetData['yetki_turu_id'])) {
                    $assignedYetki = Capsule::table('mod_btk_urun_yetki_eslestirme')->where('product_id', $whmcsServiceDataForTpl['pid'])->first();
                    if ($assignedYetki) $btkHizmetData['yetki_turu_id'] = $assignedYetki->yetki_turu_id;
                }
            }
            $btkHizmetData['iss_pop_bilgisi_sunucu_auto'] = $whmcsServiceDataForTpl['servername'] ?? ($whmcsServiceDataForTpl['serverhostname'] ?? '');

            $refYetkiTurleri = Capsule::table('mod_btk_yetki_turleri')->where('aktif', 1)->orderBy('yetki_adi')->get()->all();
            $refHatDurumKodlari = Capsule::table('mod_btk_ref_hat_durum_kodlari')->orderBy('aciklama')->get()->all();
            $refHizmetTipleri = Capsule::table('mod_btk_ref_hizmet_tipleri')->orderBy('aciklama')->get()->all();
            $btkPopNoktalari = Capsule::table('mod_btk_iss_pop_noktalari')->where('aktif', 1)->orderBy('pop_adi')->get()->all();
            $btkRefIller = Capsule::table('mod_btk_adres_il')->orderBy('il_adi')->get()->all();
            $csrfTokenService = ''; if (class_exists('\WHMCS\Utility\Token\TokenManager')) $csrfTokenService = TokenManager::generate('Admin.Service.BTKSave.' . $serviceId);

            $btkHizmetData['is_cancelled_for_btk'] = ($btkHizmetData['hat_durum'] ?? '') === 'I';
            $whmcsServiceStatus = $whmcsServiceDataForTpl['status'] ?? 'Pending';
            $btkHizmetData['is_pending_btk_activation'] = false;
            if (in_array($whmcsServiceStatus, ['Pending', 'Active']) && !$btkHizmetData['is_cancelled_for_btk']) if (!$hizmetDataRaw || ($btkHizmetData['hat_durum'] ?? '') !== 'A') $btkHizmetData['is_pending_btk_activation'] = true;

            $templateVars = [
                'lang' => $lang, 'modulelink' => 'addonmodules.php?module=' . $moduleName, 'serviceid' => $serviceId, 'userid' => $clientId,
                'btk_hizmet_data' => (object) $btkHizmetData, 'btk_tesis_adresi_data' => (object) $tesisAdresiData,
                'btk_tesis_adresi_data_ilceler_initial' => $initialIlcelerTesis, 'btk_tesis_adresi_data_mahalleler_initial' => $initialMahallelerTesis,
                'btk_ref_yetki_turleri' => $refYetkiTurleri, 'btk_ref_hat_durum_kodlari' => $refHatDurumKodlari,
                'btk_ref_hizmet_tipleri' => $refHizmetTipleri, 'btk_pop_noktalari_listesi' => $btkPopNoktalari,
                'btk_ref_iller' => $btkRefIller, 'btk_csrf_token_service' => $csrfTokenService,
                'admin_username' => $_SESSION['adminusername'] ?? 'sistem',
            ];
            if (is_array($whmcsServiceDataForTpl)) foreach($whmcsServiceDataForTpl as $key => $value) if (!isset($templateVars[$key])) $templateVars[$key] = $value;
            if (isset($_SESSION['btkServiceDetailsSaveMsg'])) { $templateVars['btk_service_action_result'] = $_SESSION['btkServiceDetailsSaveMsg']; unset($_SESSION['btkServiceDetailsSaveMsg']); }

            $templatePath = __DIR__ . '/templates/admin/service_details.tpl';
            if (file_exists($templatePath)) { foreach ($templateVars as $key => $value) $smarty->assign($key, $value); return $smarty->fetch($templatePath); }
            else { logModuleCall($moduleName, __FUNCTION__, 'service_details.tpl bulunamadı.', ['path' => $templatePath], 'ERROR'); return '<div class="alert alert-danger">Template Missing</div>';}
        } catch (\Exception $e) { logModuleCall($moduleName, __FUNCTION__, 'Hizmet BTK sekmesi oluşturma hatası.', ['sid' => $serviceId], $e->getMessage(), $e->getTraceAsString(), 'CRITICAL'); return '<div class="alert alert-danger">Error: ' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8') . '</div>';}
    }
}


/**
 * Hizmet BTK detaylarını veritabanına kaydeder/günceller.
 */
if (!function_exists('btkreports_save_service_btk_data')) {
    function btkreports_save_service_btk_data($serviceId, $clientId, $postData) {
        $moduleName = BTKREPORTS_MODULE_NAME; $lang = btkreports_load_language();
        if (!is_numeric($serviceId) || $serviceId <= 0 || !is_numeric($clientId) || $clientId <= 0) { logModuleCall($moduleName, __FUNCTION__, 'Geçersiz ID.', ['sid' => $serviceId, 'cid' => $clientId], 'ERROR'); return ['status' => 'error', 'message' => 'Geçersiz ID.']; }
        $existingBtkService = Capsule::table('mod_btk_hizmet_detaylari')->where('service_id', $serviceId)->first();
        $existingBtkServiceArray = $existingBtkService ? json_decode(json_encode($existingBtkService), true) : null;
        $isCurrentlyBTKCancelled = ($existingBtkServiceArray && ($existingBtkServiceArray['hat_durum'] ?? '') === 'I');
        $btkData = []; $allowedPrefix = 'btk_'; foreach ($postData as $key => $value) if (strpos($key, $allowedPrefix) === 0) $btkData[substr($key, strlen($allowedPrefix))] = is_string($value) ? trim($value) : $value;
        if (empty($btkData) && !(isset($postData['btk_service_details_save']) && $postData['btk_service_details_save'] == '1') && !(isset($postData['btk_service_approve_action']) && $postData['btk_service_approve_action'] === 'approve') ) return ['status' => 'info', 'message' => $lang['changes_saved_successfully'] . ' (Veri yok).'];
        $validationErrors = [];
        if (empty($btkData['hizmet_yetki_turu_id'])) $validationErrors[] = str_replace('{fieldName}', $lang['hizmet_yetki_turu_label'], $lang['error_field_required']);
        if (empty($btkData['hat_durum'])) $validationErrors[] = str_replace('{fieldName}', $lang['hat_durum_label'], $lang['error_field_required']);
        if (empty($btkData['hat_durum_kodu_ref'])) $validationErrors[] = str_replace('{fieldName}', $lang['hat_durum_kodu_label'], $lang['error_field_required']);
        if (empty($btkData['hizmet_tipi_kodu'])) $validationErrors[] = str_replace('{fieldName}', $lang['hizmet_tipi_label'], $lang['error_field_required']);
        if (empty($btkData['abone_baslangic_tarihi'])) $validationErrors[] = str_replace('{fieldName}', $lang['abone_baslangic_tarihi_label_hizmet'], $lang['error_field_required']);
        if (($btkData['hat_durum'] ?? '') === 'I' && empty($btkData['abone_bitis_tarihi'])) $validationErrors[] = str_replace('{fieldName}', $lang['abone_bitis_tarihi_label_hizmet'], $lang['error_field_required']) . ' (İptal ise).';
        if (!empty($btkData['abone_baslangic_tarihi']) && !empty($btkData['abone_bitis_tarihi']) && strtotime($btkData['abone_bitis_tarihi']) < strtotime($btkData['abone_baslangic_tarihi'])) $validationErrors[] = ($lang['error_date_invalid_format'] ?? 'Tarih hatası') . ' (Bitiş < Başlangıç).';
        $tesisAdresiAyniMi = (isset($btkData['tesis_adresi_ayni_mi']) && $btkData['tesis_adresi_ayni_mi'] == '1');
        if (!$tesisAdresiAyniMi) {
            if (empty($btkData['tesis_il_kodu'])) $validationErrors[] = str_replace('{fieldName}', $lang['hizmet_tesis_adresi_title'] . ' - ' . $lang['adres_il_label'], $lang['error_field_required']);
            if (empty($btkData['tesis_ilce_kodu'])) $validationErrors[] = str_replace('{fieldName}', $lang['hizmet_tesis_adresi_title'] . ' - ' . $lang['adres_ilce_label'], $lang['error_field_required']);
            if (empty($btkData['tesis_cadde_sokak'])) $validationErrors[] = str_replace('{fieldName}', $lang['hizmet_tesis_adresi_title'] . ' - ' . $lang['adres_cadde_sokak_label'], $lang['error_field_required']);
            if (empty($btkData['tesis_dis_kapi_no'])) $validationErrors[] = str_replace('{fieldName}', $lang['hizmet_tesis_adresi_title'] . ' - ' . $lang['adres_dis_kapi_no_label'], $lang['error_field_required']);
        }
        if (!empty($validationErrors)) { logModuleCall($moduleName, __FUNCTION__, 'Hizmet BTK Veri Kaydetme Val Hataları', ['sid' => $serviceId, 'err' => $validationErrors], 'VALIDATION_ERROR'); return ['status' => 'error', 'message' => implode('<br>', $validationErrors)]; }
        $hizmetDetaylariToSave = [
            'client_id' => $clientId, 'yetki_turu_id' => (int)$btkData['hizmet_yetki_turu_id'], 'hat_durum' => $btkData['hat_durum'], 'hat_durum_kodu_ref' => $btkData['hat_durum_kodu_ref'], 'hizmet_tipi_kodu' => $btkData['hizmet_tipi_kodu'],
            'abone_baslangic_tarihi' => !empty($btkData['abone_baslangic_tarihi']) ? date('Y-m-d H:i:s', strtotime($btkData['abone_baslangic_tarihi'])) : null,
            'abone_bitis_tarihi' => !empty($btkData['abone_bitis_tarihi']) ? date('Y-m-d H:i:s', strtotime($btkData['abone_bitis_tarihi'])) : null,
            'tarife_bilgisi' => $btkData['tarife_bilgisi'] ?? null, 'statik_ip_blogu' => $btkData['statik_ip_blogu'] ?? null, 'iss_hiz_profili' => $btkData['iss_hiz_profili'] ?? null, 'iss_kullanici_adi' => $btkData['iss_kullanici_adi'] ?? null,
            'iss_pop_bilgisi_ref_id' => (isset($btkData['iss_pop_bilgisi_ref_id']) && (int)$btkData['iss_pop_bilgisi_ref_id'] > 0) ? (int)$btkData['iss_pop_bilgisi_ref_id'] : null,
            'iss_pop_bilgisi_manual' => (!(isset($btkData['iss_pop_bilgisi_ref_id']) && (int)$btkData['iss_pop_bilgisi_ref_id'] > 0) && isset($btkData['iss_pop_bilgisi_sunucu_auto'])) ? trim($btkData['iss_pop_bilgisi_sunucu_auto']) : null,
            'aktivasyon_bayi_adi' => $btkData['aktivasyon_bayi_adi'] ?? null, 'aktivasyon_bayi_adresi_text' => $btkData['aktivasyon_bayi_adresi_text'] ?? null, 'aktivasyon_kullanici' => $btkData['aktivasyon_kullanici'] ?? ($_SESSION['adminusername'] ?? 'sistem'),
            'guncelleyen_bayi_adi' => $btkData['guncelleyen_bayi_adi'] ?? null, 'guncelleyen_bayi_adresi_text' => $btkData['guncelleyen_bayi_adresi_text'] ?? null, 'guncelleyen_kullanici' => $_SESSION['adminusername'] ?? 'sistem',
            'google_maps_link' => filter_var($btkData['google_maps_link'] ?? '', FILTER_VALIDATE_URL) ? $btkData['google_maps_link'] : null, 'updated_at' => date('Y-m-d H:i:s'),
        ];
        foreach($hizmetDetaylariToSave as $key => $value) if($value === '') $hizmetDetaylariToSave[$key] = null;
        $currentTesisAdresId = $existingBtkServiceArray['tesis_adres_id'] ?? null; $finalTesisAdresId = null;
        if ($tesisAdresiAyniMi) { $finalTesisAdresId = null; if ($currentTesisAdresId) Capsule::table('mod_btk_adresler')->where('id', $currentTesisAdresId)->where('service_id', $serviceId)->where('adres_tipi', 'TESIS')->delete(); }
        else { $savedTesisAdresId = btkreports_save_or_update_address($clientId, $serviceId, $currentTesisAdresId, 'TESIS', $btkData, 'tesis'); if ($savedTesisAdresId === false) return ['status' => 'error', 'message' => ($lang['error_saving_changes'] ?? 'Error:') . ' Tesis adresi kaydedilemedi.']; $finalTesisAdresId = $savedTesisAdresId; }
        $hizmetDetaylariToSave['tesis_adres_id'] = $finalTesisAdresId;
        try {
            if ($existingBtkService) Capsule::table('mod_btk_hizmet_detaylari')->where('service_id', $serviceId)->update($hizmetDetaylariToSave);
            else { $hizmetDetaylariToSave['service_id'] = $serviceId; $hizmetDetaylariToSave['created_at'] = date('Y-m-d H:i:s'); Capsule::table('mod_btk_hizmet_detaylari')->insert($hizmetDetaylariToSave); }
            logModuleCall($moduleName, __FUNCTION__, 'Hizmet BTK Verileri Kaydedildi', ['sid' => $serviceId], 'SUCCESS');
            return ['status' => 'success', 'message' => $lang['changes_saved_successfully'] . ' (Hizmet BTK)'];
        } catch (\Exception $e) { logModuleCall($moduleName, __FUNCTION__, 'Hizmet BTK Veri Kaydetme DB Hatası', ['sid' => $serviceId], $e->getMessage(), null, 'CRITICAL'); return ['status' => 'error', 'message' => ($lang['error_saving_changes'] ?? 'Error:') . ' ' . $e->getMessage()]; }
    }
}

// BÖLÜM 5 SONU


// modules/addons/btkreports/btkreports.php
// GERÇEK TAM SÜRÜM (Tüm Ana İşlevler Dahil)
// BÖLÜM 6 / 6 (SON BÖLÜM)

// Önceki bölümlerdeki fonksiyonların ve tanımlamaların devamı...
// (MetaData, activate, deactivate, upgrade, config,
//  get_client_profile_tab_content_for_hook, output (AJAX, Personel hariç temel case'ler),
//  NVI internal fonksiyonları, Personel Yönetimi tüm fonksiyonları,
//  get_service_details_tab_content_for_hook, save_service_btk_data fonksiyonları bir önceki bölümlerdeydi)


/**
 * Yeni onaylanan bir hizmet için ilk ABONE HAREKET kaydını ("YENI_ABONELIK_KAYDI") oluşturur.
 * Ayrıca hizmetin BTK durumunu 'A' (Aktif) ve durum kodunu '1' (AKTIF) olarak günceller (eğer zaten değilse).
 */
if (!function_exists('btkreports_create_initial_btk_records_for_service')) {
    function btkreports_create_initial_btk_records_for_service($serviceId, $clientId) {
        $moduleName = BTKREPORTS_MODULE_NAME;
        $lang = btkreports_load_language();
        $settings = btkreports_get_all_settings();
        $operatorKod = $settings['operator_code'] ?? '000';

        if (!is_numeric($serviceId) || $serviceId <= 0 || !is_numeric($clientId) || $clientId <= 0) {
            logModuleCall($moduleName, __FUNCTION__, 'Geçersiz Hizmet/Müşteri ID (İlk Kayıt).', ['sid' => $serviceId, 'cid' => $clientId], 'ERROR');
            return ['success' => false, 'message' => 'Geçersiz Hizmet veya Müşteri ID.'];
        }

        $btkHizmet = Capsule::table('mod_btk_hizmet_detaylari')->where('service_id', $serviceId)->first();
        $btkMusteri = Capsule::table('mod_btk_musteri_detaylari')->where('client_id', $clientId)->first();
        
        if (!$btkHizmet || !$btkMusteri) {
            $msg = "İlk BTK kayıtları için Hizmet (ID:{$serviceId}) veya Müşteri (ID:{$clientId}) BTK detayları eksik.";
            logModuleCall($moduleName, __FUNCTION__, $msg, ['sid' => $serviceId, 'cid' => $clientId, 'h_fnd' => !!$btkHizmet, 'm_fnd' => !!$btkMusteri], 'ERROR');
            return ['success' => false, 'message' => $msg];
        }
        if ($btkHizmet->hat_durum !== 'A' || $btkHizmet->hat_durum_kodu_ref !== '1') {
             $msg = "İlk BTK kayıtları için Hizmet (ID:{$serviceId}) BTK Hat Durumu 'Aktif' (A/1) olmalı. Mevcut: {$btkHizmet->hat_durum}/{$btkHizmet->hat_durum_kodu_ref}.";
            logModuleCall($moduleName, __FUNCTION__, $msg, ['sid' => $serviceId], 'WARNING');
            // Bu durumda hizmet BTK detayları kaydedilip durum A/1 yapılmalı önce.
            // Bu fonksiyonun çağrıldığı yer (örn: save_service_btk_data) bu durumu sağlamalı.
            // return ['success' => false, 'message' => $msg . ' Lütfen hizmet BTK detaylarını kaydedin.'];
        }

        $existingYeniHareket = Capsule::table('mod_btk_abone_hareket_canli')->where('service_id', $serviceId)->where('musteri_hareket_kodu_ref', '1')->exists();
        if ($existingYeniHareket) {
            logModuleCall($moduleName, __FUNCTION__, "Hizmet (ID:{$serviceId}) için 'Yeni Abonelik Kaydı' HAREKETI zaten var.", ['sid' => $serviceId], 'INFO');
            return ['success' => true, 'message' => 'Yeni Abonelik Hareketi zaten mevcut (Atlandı).'];
        }

        $currentTime = date('YmdHis');
        $reportLineData = btkreports_prepare_report_line_data($clientId, $serviceId, $btkMusteri, $btkHizmet, $settings, 'A', '1');
        if (!$reportLineData) {
             logModuleCall($moduleName, __FUNCTION__, "Rapor satırı için veri hazırlanamadı (İlk Kayıt, SID: {$serviceId}).", ['sid' => $serviceId], 'CRITICAL');
             return ['success' => false, 'message' => "Rapor satırı için veri hazırlanamadı."];
        }

        try {
            $transactionResult = Capsule::transaction(function () use ($serviceId, $clientId, $operatorKod, $currentTime, $reportLineData, $moduleName, $lang) {
                $hareketKodu = '1';
                $hareketAciklamaObj = Capsule::table('mod_btk_ref_musteri_hareket_kodlari')->where('kod', $hareketKodu)->first();
                $hareketAciklamaStr = $hareketAciklamaObj ? $hareketAciklamaObj->aciklama : 'YENI_ABONELIK_KAYDI';

                $reportLineDataForHareket = $reportLineData;
                $reportLineDataForHareket['MUSTERI_HAREKET_KODU'] = $hareketKodu;
                $reportLineDataForHareket['MUSTERI_HAREKET_ACIKLAMA'] = $hareketAciklamaStr;
                $reportLineDataForHareket['MUSTERI_HAREKET_ZAMANI'] = $currentTime;

                $hareketRawLine = btkreports_build_abn_line($reportLineDataForHareket, 'hareket', $operatorKod, $serviceId, $clientId);
                
                $hareketDataForInsert = [
                    'service_id' => $serviceId, 'client_id' => $clientId,
                    'musteri_hareket_kodu_ref' => $hareketKodu, 'musteri_hareket_zamani' => $currentTime,
                    'olusturulma_zamani' => date('Y-m-d H:i:s'), 'gonderildi_mi' => false,
                    'raw_data_line' => $hareketRawLine,
                    'hat_durum' => $reportLineDataForHareket['HAT_DURUM'] ?? 'A',
                    'hat_durum_kodu' => $reportLineDataForHareket['HAT_DURUM_KODU'] ?? '1',
                    'hat_aciklama' => $reportLineDataForHareket['HAT_ACIKLAMA'] ?? 'AKTIF',
                ];
                $hareketColumns = Capsule::schema()->getColumnListing('mod_btk_abone_hareket_canli');
                $finalHareketDataToInsert = array_intersect_key($hareketDataForInsert, array_flip($hareketColumns));
                $finalHareketDataToInsert['service_id'] = $serviceId; $finalHareketDataToInsert['client_id'] = $clientId; $finalHareketDataToInsert['raw_data_line'] = $hareketRawLine;

                Capsule::table('mod_btk_abone_hareket_canli')->insert($finalHareketDataToInsert);
                // Hizmet durumu zaten A/1 olmalıydı.
                logModuleCall($moduleName, __FUNCTION__, "İlk HAREKET kaydı (ID:{$serviceId}) oluşturuldu.", ['h_kodu' => $hareketKodu], 'SUCCESS');
                return true;
            });
            if ($transactionResult) return ['success' => true, 'message' => ($lang['success_general'] ?? 'Success') . ' (İlk BTK Kayıtları Oluşturuldu)'];
            else { logModuleCall($moduleName, __FUNCTION__, 'İlk BTK kayıtları Transaction başarısız.', ['sid' => $serviceId], 'ERROR'); return ['success' => false, 'message' => 'İlk BTK kayıtları oluşturulurken işlem hatası.']; }
        } catch (\Exception $e) { logModuleCall($moduleName, __FUNCTION__, 'İlk BTK kayıtları oluşturma hatası.', ['sid' => $serviceId], $e->getMessage(), $e->getTraceAsString(), 'CRITICAL'); return ['success' => false, 'message' => 'Kritik hata: ' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8')]; }
    }
}


/**
 * Hizmet durumu değişikliklerini ABONE HAREKET olarak loglar ve hizmetin BTK durumunu günceller.
 */
if (!function_exists('btkreports_log_service_status_change_as_hareket')) {
    function btkreports_log_service_status_change_as_hareket($serviceId, $clientId, $newWhmcsStatus) {
        $moduleName = BTKREPORTS_MODULE_NAME; $lang = btkreports_load_language(); $settings = btkreports_get_all_settings(); $operatorKod = $settings['operator_code'] ?? '000';

        if (!is_numeric($serviceId) || $serviceId <= 0 || !is_numeric($clientId) || $clientId <= 0) { logModuleCall($moduleName, __FUNCTION__, 'Geçersiz ID.', ['sid' => $serviceId, 'cid' => $clientId], 'ERROR'); return ['success' => false, 'message' => 'Geçersiz ID.']; }

        $btkHizmet = Capsule::table('mod_btk_hizmet_detaylari')->where('service_id', $serviceId)->first();
        $btkMusteri = Capsule::table('mod_btk_musteri_detaylari')->where('client_id', $clientId)->first();
        if (!$btkHizmet || !$btkMusteri) { $msg = "Hizmet durumu değişikliği loglanamadı: Hizmet (ID:{$serviceId}) veya Müşteri (ID:{$clientId}) BTK verisi eksik."; logModuleCall($moduleName, __FUNCTION__, $msg, ['h_fnd' => !!$btkHizmet, 'm_fnd' => !!$btkMusteri], 'WARNING'); return ['success' => false, 'message' => $msg]; }

        $newBtkHatDurum = $btkHizmet->hat_durum; $newBtkHatDurumKoduRef = $btkHizmet->hat_durum_kodu_ref;
        $btkHareketKoduRef = '3'; // Varsayılan: HAT_DURUM_DEGISIKLIGI
        $isSignificantChangeForHareket = false;

        switch (strtolower($newWhmcsStatus)) {
            case 'suspended': if ($btkHizmet->hat_durum !== 'D') { $newBtkHatDurum = 'D'; $newBtkHatDurumKoduRef = '16'; $isSignificantChangeForHareket = true; } break;
            case 'active': if ($btkHizmet->hat_durum !== 'A') { $newBtkHatDurum = 'A'; $newBtkHatDurumKoduRef = '1'; $isSignificantChangeForHareket = true; } break;
            case 'terminated': case 'cancelled':
                if ($btkHizmet->hat_durum !== 'I') {
                    $newBtkHatDurum = 'I'; $newBtkHatDurumKoduRef = '2'; $btkHareketKoduRef = '4'; $isSignificantChangeForHareket = true;
                    if (empty($btkHizmet->abone_bitis_tarihi) || substr($btkHizmet->abone_bitis_tarihi, 0, 10) === '0000-00-00') {
                        Capsule::table('mod_btk_hizmet_detaylari')->where('service_id', $serviceId)->update(['abone_bitis_tarihi' => date('Y-m-d H:i:s')]);
                        $btkHizmet = Capsule::table('mod_btk_hizmet_detaylari')->where('service_id', $serviceId)->first();
                    }
                } break;
            default: logModuleCall($moduleName, __FUNCTION__, "Bilinmeyen WHMCS durumu: {$newWhmcsStatus}", ['sid' => $serviceId], 'WARNING'); return ['success' => false, 'message' => "Bilinmeyen WHMCS durumu: {$newWhmcsStatus}"];
        }

        if (!$isSignificantChangeForHareket) {
            // Durum değişmediyse bile, mod_btk_hizmet_detaylari'nı senkronize et
            Capsule::table('mod_btk_hizmet_detaylari')->where('service_id', $serviceId)->update(['hat_durum' => $newBtkHatDurum, 'hat_durum_kodu_ref' => (string)$newBtkHatDurumKoduRef, 'updated_at' => date('Y-m-d H:i:s')]);
            logModuleCall($moduleName, __FUNCTION__, "BTK hat durumu zaten aynı ({$btkHizmet->hat_durum}/{$btkHizmet->hat_durum_kodu_ref}), hareket loglanmadı.", ['sid' => $serviceId], 'INFO');
            return ['success' => true, 'message' => 'BTK hat durumu zaten aynıydı.'];
        }

        $currentTime = date('YmdHis');
        $reportLineData = btkreports_prepare_report_line_data($clientId, $serviceId, $btkMusteri, $btkHizmet, $settings, $newBtkHatDurum, $newBtkHatDurumKoduRef);
        if (!$reportLineData) { logModuleCall($moduleName, __FUNCTION__, "Rapor satırı verisi hazırlanamadı.", ['sid' => $serviceId], 'ERROR'); return ['success' => false, 'message' => "Rapor satırı verisi hazırlanamadı."]; }

        try {
            Capsule::transaction(function () use ($serviceId, $clientId, $operatorKod, $currentTime, $reportLineData, $btkHareketKoduRef, $newBtkHatDurum, $newBtkHatDurumKoduRef, $moduleName) {
                $hareketKodu = (string)$btkHareketKoduRef;
                $hareketAciklamaObj = Capsule::table('mod_btk_ref_musteri_hareket_kodlari')->where('kod', $hareketKodu)->first();
                $hareketAciklamaStr = $hareketAciklamaObj ? $hareketAciklamaObj->aciklama : 'TANIMSIZ_HAREKET';
                $reportLineData['MUSTERI_HAREKET_KODU'] = $hareketKodu; $reportLineData['MUSTERI_HAREKET_ACIKLAMA'] = $hareketAciklamaStr; $reportLineData['MUSTERI_HAREKET_ZAMANI'] = $currentTime;
                $hareketRawLine = btkreports_build_abn_line($reportLineData, 'hareket', $operatorKod, $serviceId, $clientId);
                $hareketDataForInsert = ['service_id' => $serviceId, 'client_id' => $clientId, 'musteri_hareket_kodu_ref' => $hareketKodu, 'musteri_hareket_zamani' => $currentTime, 'olusturulma_zamani' => date('Y-m-d H:i:s'), 'gonderildi_mi' => false, 'raw_data_line' => $hareketRawLine, 'hat_durum' => $reportLineData['HAT_DURUM'], 'hat_durum_kodu' => $reportLineData['HAT_DURUM_KODU'], 'hat_aciklama' => $reportLineData['HAT_ACIKLAMA']];
                $hareketColumns = Capsule::schema()->getColumnListing('mod_btk_abone_hareket_canli'); $finalHareketDataToInsert = array_intersect_key($hareketDataForInsert, array_flip($hareketColumns));
                $finalHareketDataToInsert['service_id'] = $serviceId; $finalHareketDataToInsert['client_id'] = $clientId; $finalHareketDataToInsert['raw_data_line'] = $hareketRawLine;
                Capsule::table('mod_btk_abone_hareket_canli')->insert($finalHareketDataToInsert);
                Capsule::table('mod_btk_hizmet_detaylari')->where('service_id', $serviceId)->update(['hat_durum' => $newBtkHatDurum, 'hat_durum_kodu_ref' => (string)$newBtkHatDurumKoduRef, 'updated_at' => date('Y-m-d H:i:s')]);
                logModuleCall($moduleName, __FUNCTION__, "Hizmet durumu ({$serviceId}) BTK için güncellendi: {$newBtkHatDurum}/{$newBtkHatDurumKoduRef}. Hareket: {$btkHareketKoduRef}", null, 'SUCCESS');
            });
            return ['success' => true, 'message' => 'Hizmet durumu değişikliği BTK için loglandı.'];
        } catch (\Exception $e) { logModuleCall($moduleName, __FUNCTION__, 'Hizmet durumu loglama hatası.', ['sid' => $serviceId], $e->getMessage(), null, 'CRITICAL'); return ['success' => false, 'message' => 'DB Hatası: ' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8')]; }
    }
}

/**
 * Hook İş Mantığı: Sipariş Onaylandığında
 * Bu fonksiyon AcceptOrder hook'u tarafından çağrılır.
 */
if (!function_exists('btkreports_handle_accept_order_for_service')) {
    function btkreports_handle_accept_order_for_service($serviceId, $clientId, $packageId) {
        $moduleName = BTKREPORTS_MODULE_NAME;
        logModuleCall($moduleName, __FUNCTION__, "AcceptOrder hook'u tetiklendi - Hizmet:{$serviceId}, Müşteri:{$clientId}, Paket:{$packageId}", null, 'INFO');
        // Bu aşamada hizmetin BTK verileri henüz girilmemiş olabilir.
        // `btkreports_save_service_btk_data` fonksiyonu içinde, eğer özel bir "BTK için Onayla"
        // butonu ile gelinirse `btkreports_create_initial_btk_records_for_service` çağrılacak.
        // Bu hook, belki hizmete bir not ekleyebilir: "BTK veri girişi bekleniyor."
        // Veya eğer ürün-yetki eşleştirmesi varsa ve bazı temel BTK verileri otomatik
        // olarak `mod_btk_hizmet_detaylari`'na eklenebiliyorsa, bu yapılabilir.
        // Şimdilik sadece logluyoruz. Ana mantık hizmet detayları kaydetme fonksiyonunda.
    }
}

/**
 * Hook İş Mantığı: Tek bir WHMCS admini eklendiğinde/güncellendiğinde/silindiğinde personel tablosunu senkronize et.
 */
if (!function_exists('btkreports_sync_single_whmcs_admin')) {
    function btkreports_sync_single_whmcs_admin($adminId, $actionType = 'edit') { // actionType: 'add', 'edit', 'delete'
        $moduleName = BTKREPORTS_MODULE_NAME;
        if (!is_numeric($adminId) || $adminId <= 0) return;

        if ($actionType === 'delete') {
            // WHMCS'den silinen admini bizim tablomuzda pasif yap veya admin_id'yi null yap.
            // Ya da btk_listesine_eklensin'i false yap.
            try {
                Capsule::table('mod_btk_personel')->where('admin_id', $adminId)
                    ->update(['is_active' => 0, 'admin_id' => null, 'updated_at' => date('Y-m-d H:i:s')]);
                logModuleCall($moduleName, __FUNCTION__, "WHMCS Admin (ID:{$adminId}) silindi, BTK personel kaydı pasifleştirildi/bağlantısı kesildi.", null, 'INFO');
            } catch (\Exception $e) {
                logModuleCall($moduleName, __FUNCTION__, "WHMCS Admin (ID:{$adminId}) silinirken BTK personel senkronizasyon hatası.", $e->getMessage(), null, 'ERROR');
            }
            return;
        }

        // Ekleme veya Düzenleme
        $adminData = Capsule::table('tbladmins')->where('id', $adminId)->where('disabled', 0)->first();
        if ($adminData) {
            $existingPersonnel = Capsule::table('mod_btk_personel')->where('admin_id', $adminData->id)->first();
            $operator_unvani = btkreports_get_setting('operator_title_official', 'Bilinmeyen Operatör');
            $dataToSync = [
                'firma_unvani' => $operator_unvani,
                'adi' => $adminData->firstname,
                'soyadi' => $adminData->lastname,
                'eposta_adresi' => $adminData->email,
                'is_active' => 1, // WHMCS'de aktifse burada da aktif
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            try {
                if ($existingPersonnel) {
                    Capsule::table('mod_btk_personel')->where('id', $existingPersonnel->id)->update($dataToSync);
                    logModuleCall($moduleName, __FUNCTION__, "WHMCS Admin (ID:{$adminId}) güncellendi, BTK personel kaydı senkronize edildi.", null, 'INFO');
                } else { // Yeni WHMCS admini, BTK personel listesine de ekle (temel bilgilerle)
                    $dataToSync['admin_id'] = $adminData->id;
                    $dataToSync['btk_listesine_eklensin'] = 1; // Varsayılan
                    $turkey = Capsule::table('mod_btk_ref_ulkeler')->where('iso_3166_1_alpha_3', 'TUR')->first();
                    if ($turkey) $dataToSync['uyruk_ref_id'] = $turkey->id;
                    $dataToSync['created_at'] = date('Y-m-d H:i:s');
                    Capsule::table('mod_btk_personel')->insert($dataToSync);
                    logModuleCall($moduleName, __FUNCTION__, "Yeni WHMCS Admin (ID:{$adminId}) BTK personel listesine eklendi.", null, 'INFO');
                }
            } catch (\Exception $e) {
                logModuleCall($moduleName, __FUNCTION__, "WHMCS Admin (ID:{$adminId}) senkronizasyonu sırasında DB hatası.", $e->getMessage(), null, 'ERROR');
            }
        }
    }
}

// BÖLÜM 6 SONU (ve DOSYANIN SONU)
?>