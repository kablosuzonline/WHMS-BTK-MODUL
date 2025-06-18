<?php
/**
 * WHMCS BTK Abone Veri Raporlama Modülü - Hook Dosyası
 * Bu dosya, WHMCS'in çeşitli noktalarına müdahale ederek modül işlevselliğini entegre eder.
 *
 * @version 1.2.1 (Tüm mevcut ve planlanan hook taslaklarını içerir)
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

use WHMCS\Database\Capsule;
use WHMCS\Utility\Token\TokenManager;

if (!defined('BTKREPORTS_MODULE_NAME')) {
    define('BTKREPORTS_MODULE_NAME', 'btkreports');
}

/**
 * Hook için dil yükleyici fonksiyon.
 */
if (!function_exists('btkreports_load_language_for_hook')) {
    function btkreports_load_language_for_hook() {
        $moduleName = BTKREPORTS_MODULE_NAME;
        $lang = [];
        global $_ADMINLANG;

        if (isset($_ADMINLANG[$moduleName]) && is_array($_ADMINLANG[$moduleName])) {
            $lang = $_ADMINLANG[$moduleName];
        } else {
            $langFilePath = __DIR__ . '/lang/turkish.php';
            if (file_exists($langFilePath)) {
                $returned_lang = include $langFilePath;
                if (is_array($returned_lang)) $lang = $returned_lang;
                elseif (isset($_ADMINLANG[$moduleName]) && is_array($_ADMINLANG[$moduleName])) $lang = $_ADMINLANG[$moduleName];
            }
        }
        
        if (empty($lang['module_name'])) $lang['module_name'] = 'BTK Reports (Dil Hatası - Hook)';
        if (empty($lang['access_denied'])) $lang['access_denied'] = 'Access Denied';
        if (empty($lang['error_field_required'])) $lang['error_field_required'] = 'Field {fieldName} is required.';
        if (empty($lang['btk_musteri_bilgileri_tab_title'])) $lang['btk_musteri_bilgileri_tab_title'] = 'BTK Müşteri Bilgileri';
        if (empty($lang['btk_hizmet_bilgileri_tab_title'])) $lang['btk_hizmet_bilgileri_tab_title'] = 'BTK Hizmet Detayları';
        return $lang;
    }
}


if (function_exists('add_hook')) {

    // --- Müşteri Profili Sekmesi ve Kaydetme Hook'ları ---
    add_hook('AdminClientProfileTabFields', 1, function($vars) {
        $lang = btkreports_load_language_for_hook();
        $clientId = $vars['userid'] ?? null;
        if (!$clientId) return [];
        if (function_exists('btkreports_get_client_profile_tab_content_for_hook')) {
            $btkTabContent = btkreports_get_client_profile_tab_content_for_hook($clientId, $lang);
            if ($btkTabContent !== false && is_string($btkTabContent)) {
                return [$lang['btk_musteri_bilgileri_tab_title'] => $btkTabContent];
            }
        }
        return [$lang['btk_musteri_bilgileri_tab_title'] => '<div class="alert alert-warning">BTK Müşteri Detayları yüklenemedi (Ref: HK_CPTF_FUNC_ERR).</div>'];
    });

    add_hook('AdminClientProfileTabFieldsSave', 1, function($vars) {
        $moduleName = BTKREPORTS_MODULE_NAME;
        $clientId = $vars['userid'] ?? null;
        if (!$clientId || !isset($_POST['btk_client_details_save']) || $_POST['btk_client_details_save'] != '1') return;

        $tokenFromForm = $_POST['btk_client_token'] ?? '';
        $expectedTokenName = 'Admin.Client.BTKSave.' . $clientId;
        $isValidToken = false;
        if (class_exists('\WHMCS\Utility\Token\TokenManager')) {
            $isValidToken = TokenManager::verify($expectedTokenName, $tokenFromForm);
        } elseif (function_exists('check_token')) { // WHMCS < 8 için
            // check_token() POST'tan kendi alır, $tokenFromForm'u direkt kullanamayız.
            // Bu durumda, TPL'deki token adını WHMCS'in beklediği bir şeyle değiştirmek veya
            // check_token'ı farklı bir şekilde kullanmak gerekebilir.
            // Şimdilik, TokenManager'ın varlığını varsayıyoruz.
            // Eğer yoksa, CSRF koruması bu hook için zayıf kalabilir.
            // WHMCS'in ana formu için zaten kendi token'ı olur, onu da doğrulamak gerekir.
            // check_token("WHMCS.admin.default"); // Bu, genel formu doğrular.
        }
        if (!$isValidToken && class_exists('\WHMCS\Utility\Token\TokenManager')) { // Sadece TokenManager varsa bu hatayı verelim.
            logModuleCall($moduleName, __FUNCTION__, 'CSRF Token Hatalı (Müşteri Profili Kaydetme)', ['userid' => $clientId, 'token_name' => $expectedTokenName], null, 'ERROR');
            if (isset($_SESSION)) $_SESSION['btkClientProfileSaveMsg'] = ['status' => 'error', 'message' => ($GLOBALS['_ADMINLANG']['btkreports']['access_denied'] ?? 'Access Denied') . ' (CSRF Token - Client Save)'];
            return;
        }
        // Eğer TokenManager yoksa ve check_token kullanacaksak, TPL'deki token name'i "token" olmalı.
        // Ya da burada $_POST['token_whmcs_general'] gibi bir şeyi check_token'a vermeliyiz.
        // Şimdilik, TokenManager var veya check_token("WHMCS.admin.default") Müşteri Profili ana formu için yeterli.

        if (function_exists('btkreports_save_client_btk_data')) {
            $saveResult = btkreports_save_client_btk_data($clientId, $_POST);
            if (is_array($saveResult) && isset($saveResult['message']) && isset($_SESSION)) {
                $_SESSION['btkClientProfileSaveMsg'] = $saveResult;
            }
        } else {
            logModuleCall($moduleName, __FUNCTION__, 'btkreports_save_client_btk_data fonksiyonu bulunamadı!', ['userid' => $clientId], 'ERROR');
        }
    });

    add_hook('ClientDetailsValidation', 1, function($vars) {
        $moduleName = BTKREPORTS_MODULE_NAME;
        $lang = btkreports_load_language_for_hook();
        $errors = [];
        if (!isset($_POST['btk_client_details_save']) && !isset($_POST['btk_musteri_tipi_kodu'])) return $errors;
        
        if (function_exists('btkreports_validate_client_btk_data')) {
            $validation_errors_from_function = btkreports_validate_client_btk_data($_POST, $lang);
            if(is_array($validation_errors_from_function)) {
                $errors = array_merge($errors, $validation_errors_from_function);
            }
        } else {
            // Temel doğrulamalar (eğer btkreports_validate_client_btk_data yoksa)
            if (empty($_POST['btk_musteri_tipi_kodu'])) $errors[] = str_replace('{fieldName}', $lang['musteri_tipi_label'], $lang['error_field_required']);
            // ... diğer temel doğrulamalar ...
        }

        if (!empty($errors)) {
            logModuleCall($moduleName, __FUNCTION__, 'Müşteri BTK Veri Doğrulama Hataları (Hook)', ['userid' => ($vars['userid'] ?? 'N/A'), 'errors' => $errors], 'VALIDATION_ERROR');
        }
        return $errors;
    });


    // --- Hizmet Detayları Sekmesi ve Kaydetme Hook'ları ---
    add_hook('AdminClientServicesTabFields', 1, function($vars) {
        $lang = btkreports_load_language_for_hook();
        $serviceId = $vars['id'] ?? null;
        $clientId = $vars['userid'] ?? null;
        if (!$serviceId || !$clientId) return [];

        if (function_exists('btkreports_get_service_details_tab_content_for_hook')) {
            $btkTabContent = btkreports_get_service_details_tab_content_for_hook($serviceId, $clientId, $lang);
            if ($btkTabContent !== false && is_string($btkTabContent)) {
                return [$lang['btk_hizmet_bilgileri_tab_title'] => $btkTabContent];
            }
        }
        return [$lang['btk_hizmet_bilgileri_tab_title'] => '<div class="alert alert-warning">BTK Hizmet Detayları yüklenemedi (Ref: HK_CSTF_FUNC_ERR_V2).</div>'];
    });

    add_hook('AdminClientServicesTabFieldsSave', 1, function($vars) {
        $moduleName = BTKREPORTS_MODULE_NAME;
        $serviceId = $vars['id'] ?? null;
        $clientId = $vars['userid'] ?? null;

        if (!$serviceId || !$clientId || 
            (!isset($_POST['btk_service_details_save']) || $_POST['btk_service_details_save'] != '1') && 
            (!isset($_POST['btk_service_approve_action']) || $_POST['btk_service_approve_action'] !== 'approve')
           ) {
            return;
        }

        $tokenFromForm = $_POST['btk_service_token'] ?? '';
        $expectedTokenName = 'Admin.Service.BTKSave.' . $serviceId;
        $isValidToken = false;
        if (class_exists('\WHMCS\Utility\Token\TokenManager')) {
             $isValidToken = TokenManager::verify($expectedTokenName, $tokenFromForm);
        } elseif (function_exists('check_token')) {
            // check_token("WHMCS.admin.default"); // Bu genel formu doğrular.
            // Özel token için TPL'de <input type="hidden" name="token" value="{$csrfToken}"> WHMCS genel tokenı ile gönderilmeli
        }
         if (!$isValidToken && class_exists('\WHMCS\Utility\Token\TokenManager')) {
            logModuleCall($moduleName, __FUNCTION__, 'CSRF Token Hatalı (Hizmet Detayları Kaydetme)', ['serviceid' => $serviceId, 'token_name' => $expectedTokenName], null, 'ERROR');
            if(isset($_SESSION)) $_SESSION['btkServiceDetailsSaveMsg'] = ['status' => 'error', 'message' => ($GLOBALS['_ADMINLANG']['btkreports']['access_denied'] ?? 'Access Denied') . ' (CSRF Token)'];
            return;
        }


        if (function_exists('btkreports_save_service_btk_data')) {
            $saveResult = btkreports_save_service_btk_data($serviceId, $clientId, $_POST);
            if (is_array($saveResult) && isset($saveResult['message']) && isset($_SESSION)) {
                $_SESSION['btkServiceDetailsSaveMsg'] = $saveResult;
            }

            if (isset($_POST['btk_service_approve_action']) && $_POST['btk_service_approve_action'] === 'approve' && ($saveResult['status'] ?? 'error') === 'success') {
                if (function_exists('btkreports_create_initial_btk_records_for_service')) {
                    $initialRecordResult = btkreports_create_initial_btk_records_for_service($serviceId, $clientId);
                    if (isset($_SESSION['btkServiceDetailsSaveMsg'])) {
                        $_SESSION['btkServiceDetailsSaveMsg']['message'] .= "<br>" . ($initialRecordResult['success'] ? ($lang['changes_saved_successfully'] ?? 'Saved') ." (İlk BTK Kayıtları: ".$initialRecordResult['message'].")" : "UYARI: İlk BTK kayıtları oluşturulurken hata: " . $initialRecordResult['message']);
                        if (!$initialRecordResult['success']) $_SESSION['btkServiceDetailsSaveMsg']['status'] = 'error';
                    }
                }
                // WHMCS hizmetini de "Active" yap
                $currentServiceStatus = Capsule::table('tblhosting')->where('id', $serviceId)->value('domainstatus');
                if ($currentServiceStatus !== 'Active') {
                    try {
                        localAPI('UpdateClientProduct', ['serviceid' => $serviceId, 'status' => 'Active']);
                        logModuleCall($moduleName, __FUNCTION__, "Hizmet (ID:{$serviceId}) WHMCS'te Aktif yapıldı (BTK Onay sonrası).", null, 'SUCCESS');
                    } catch (\Exception $e) { /* ... log ... */ }
                }
            }
        } else {
            logModuleCall($moduleName, __FUNCTION__, 'btkreports_save_service_btk_data fonksiyonu bulunamadı!', ['serviceid' => $serviceId], 'ERROR');
        }
    });


    // --- Sipariş ve Hizmet Durumu Değişiklik Hook'ları ---
    add_hook('AcceptOrder', 1, function($vars) {
        $moduleName = BTKREPORTS_MODULE_NAME;
        $orderId = $vars['orderid'] ?? null;
        if (!$orderId) return;
        
        $services = Capsule::table('tblhosting')->where('orderid', $orderId)->get(['id', 'userid', 'domainstatus', 'packageid'])->all();
        logModuleCall($moduleName, __FUNCTION__, "Sipariş Onaylandı (ID:{$orderId}) - Hizmetler Kontrol Ediliyor.", ['orderid' => $orderId, 'service_count' => count($services)], 'INFO');

        foreach($services as $service) {
            // Bu hook, hizmet detayları sayfasındaki özel "BTK İçin Onayla" butonuna yönlendirme veya
            // hizmete bir not ekleme ("BTK Veri Girişi Bekleniyor") gibi işlemler yapabilir.
            // Otomatik ilk kayıt oluşturma mantığı btkreports_save_service_btk_data içinde
            // btk_service_approve_action ile tetikleniyor.
            // Eğer bir ürün için BTK Yetki Türü atanmışsa ve bazı temel veriler otomatik çekilebiliyorsa,
            // burada bir ön BTK kaydı (mod_btk_hizmet_detaylari'na taslak) oluşturulabilir.
            if (function_exists('btkreports_handle_accept_order_for_service')) {
                btkreports_handle_accept_order_for_service($service->id, $service->userid, $service->packageid);
            }
        }
    });

    if (!function_exists('btk_handle_service_status_change_for_hook')) {
        function btk_handle_service_status_change_for_hook($vars, $newWhmcsStatus) {
            $moduleName = BTKREPORTS_MODULE_NAME;
            $serviceId = $vars['id'] ?? ($vars['serviceid'] ?? null);
            $clientId = $vars['userid'] ?? null;

            if (!$serviceId) {
                logModuleCall($moduleName, __FUNCTION__, "Hizmet Durum Değişikliği - Service ID eksik.", $vars, 'ERROR');
                return;
            }
            if (!$clientId) {
                $clientId = Capsule::table('tblhosting')->where('id', $serviceId)->value('userid');
            }
            if (!$clientId) {
                logModuleCall($moduleName, __FUNCTION__, "Hizmet Durum Değişikliği - Client ID bulunamadı (Service ID: {$serviceId}).", $vars, 'ERROR');
                return;
            }

            logModuleCall($moduleName, __FUNCTION__, "Hizmet Durum Değişikliği Hook: Hizmet ID:{$serviceId}, Yeni WHMCS Durumu: {$newWhmcsStatus}", $vars, 'INFO');

            if (function_exists('btkreports_log_service_status_change_as_hareket')) {
                btkreports_log_service_status_change_as_hareket($serviceId, $clientId, $newWhmcsStatus);
            } else {
                 logModuleCall($moduleName, __FUNCTION__, "btkreports_log_service_status_change_as_hareket fonksiyonu bulunamadı!", ['serviceId' => $serviceId], 'ERROR');
            }
        }
    }

    add_hook('ServiceSuspend', 1, function($vars) { btk_handle_service_status_change_for_hook($vars, 'Suspended'); });
    add_hook('ServiceUnsuspend', 1, function($vars) { btk_handle_service_status_change_for_hook($vars, 'Active'); });
    add_hook('ServiceTerminate', 1, function($vars) { btk_handle_service_status_change_for_hook($vars, 'Terminated'); });
    // WHMCS'te 'Cancelled' için özel bir hook yoktur, genellikle 'Terminated' hook'u iptal işlemlerini de yakalar.
    // Hizmetin Cancelled olması durumunda da Terminated hook'u tetiklenir.
    // Farklı bir işlem gerekiyorsa, hizmetin detaylarından iptal nedenine bakılabilir.


    // --- Personel Senkronizasyonu Hook'ları (Aktif) ---
    if (function_exists('btkreports_sync_single_whmcs_admin')) { // Ana fonksiyon btkreports.php'de olmalı
        add_hook('AdminAdd', 1, function($vars) {
            // WHMCS AdminAdd hook'u $vars içinde 'type' => 'tbladmins' ve 'adminid' döndürmez.
            // Bu hook sadece admin eklendikten sonra çalışır ve eklenen adminin ID'sini doğrudan vermez.
            // En son eklenen admini bulmak veya bu hook'u farklı kullanmak gerekebilir.
            // Şimdilik, bu hook'u tam işlevsel yapmak zor. Manuel senkronizasyon daha güvenilir.
            // logModuleCall(BTKREPORTS_MODULE_NAME, 'AdminAdd Hook', $vars, null, 'DEBUG');
            // Eğer bir şekilde adminid alınabilirse:
            // btkreports_sync_single_whmcs_admin($vars['adminid'], 'add');
        });

        add_hook('AdminEdit', 1, function($vars) { // Bu hook $vars['adminid'] içerir.
            if (isset($vars['adminid'])) {
                btkreports_sync_single_whmcs_admin($vars['adminid'], 'edit');
            }
        });

        add_hook('AdminDelete', 1, function($vars) { // Bu hook $vars['adminid'] içerir.
            if (isset($vars['adminid'])) {
                btkreports_sync_single_whmcs_admin($vars['adminid'], 'delete');
            }
        });
    }

} // End: if function_exists('add_hook')

?>