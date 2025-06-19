<?php
// --- BÖLÜM 1 / 2 BAŞI - (btkreports.php, v2.0.4 - Güncellenmiş BtkHelper Kullanımı)

// === PHP HATA GÖSTERİMİ AYARI ===
error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
// === PHP HATA GÖSTERİMİ SONU ===

/**
 * WHMCS BTK Raporları Addon Modülü (Namespace'siz Yapı)
 *
 * @package    WHMCS
 * @subpackage AddonModules
 * @author     Kablosuz Online
 * @version    2.0.4 
 * @link       https://www.kablosuzonline.com.tr
 */

if (!defined("WHMCS")) {
    die("Bu dosyaya doğrudan erişilemez. Lütfen WHMCS yönetici panelinden erişin.");
}

// Manuel olarak sınıfları dahil et
$helperPath = __DIR__ . '/lib/btkhelper.php';
$dashboardControllerPath = __DIR__ . '/controllers/admin/dashboardcontroller.php'; 

if (file_exists($helperPath)) {
    require_once $helperPath;
} else {
    // BtkHelper kritik, olmadan devam edilemez.
    if (basename($_SERVER['SCRIPT_NAME']) === 'configaddonmods.php' || (isset($_GET['module']) && $_GET['module'] === 'btkreports')) {
         echo '<div class="alert alert-danger"><strong>BTK Raporları Modülü Kritik Hatası:</strong> lib/btkhelper.php dosyası bulunamadı! Modül düzgün çalışamaz.</div>';
    }
    return; 
}

// DashboardController'ı sadece _output içinde çağıracağımız için orada require edebiliriz
// veya burada edip varlığını kontrol edebiliriz.
if (file_exists($dashboardControllerPath)) {
    require_once $dashboardControllerPath;
} else {
    // Bu hata _output içinde yönetilecek.
    if (class_exists('BtkHelper') && method_exists('BtkHelper', 'moduleLog')) {
        BtkHelper::moduleLog('btkreports_critical_load_error', 'dashboardcontroller.php dosyası bulunamadı', ['path' => $dashboardControllerPath]);
    }
}
// require_once __DIR__ . '/controllers/admin/configcontroller.php'; // Gerektiğinde dahil edilecek

use WHMCS\Database\Capsule;

/**
 * Modül Meta Verilerini Tanımlar.
 */
function btkreports_config(): array
{
    $moduleName = 'BTK Raporları Modülü (v2)';
    if (class_exists('BtkHelper') && method_exists('BtkHelper', 'getSetting')) {
        // mod_btk_config tablosundaki sütun adını kullanmalıyız, örneğin 'operator_unvani' veya 'module_display_name'
        // Senin "new-version" modülündeki mod_btk_config'de 'operator_unvani' vardı.
        // 'module_display_name' gibi bir alan yoksa, operatör adını kullanabiliriz.
         $displayName = BtkHelper::getSetting('operator_adi', $moduleName); // Sütun adı 'operator_adi' ise
         if (!empty($displayName)) {
             $moduleName = $displayName . ' - BTK Raporları';
         }
    }

    return [
        'name' => $moduleName,
        'description' => 'BTK için yasal raporlamaları yönetir (Namespace\'siz yapı).',
        'version' => '2.0.4', // Bu versiyon bilgisi önemli
        'author' => 'Kablosuz Online',
        'language' => 'turkish',
        'fields' => [
             'info_redirect' => [
                'FriendlyName' => 'Modül Yönetimi',
                'Type' => 'info',
                'Description' => 'Bu modülün tüm ayarları ve işlemleri için lütfen "Eklentiler > ' . htmlspecialchars($moduleName) . '" menüsünden modülün kendi arayüzüne gidin.',
            ],
        ],
    ];
}

/**
 * Modül Aktivasyon Fonksiyonu.
 */
function btkreports_activate(): array
{
    $messages = [];
    if (!class_exists('BtkHelper')) {
        return ['status' => 'error', 'description' => 'Kritik Hata: BtkHelper sınıfı yüklenemedi. Aktivasyon tamamlanamadı.'];
    }
    try {
        $sqlFilePath = __DIR__ . '/sql/install.sql';
        if (file_exists($sqlFilePath)) {
            $sqlQueries = file_get_contents($sqlFilePath);
            $statements = array_filter(array_map('trim', explode(';', $sqlQueries)));
            foreach ($statements as $statement) { if (!empty($statement)) { Capsule::statement($statement); }}
            $messages[] = 'Veritabanı tabloları başarıyla oluşturuldu/kontrol edildi.';
        } else { return ['status' => 'error', 'description' => 'Kritik Hata: sql/install.sql dosyası bulunamadı.'];}
        
        // initial_reference_data.sql, mod_btk_config tablosuna ID=1 ile ilk kaydı atacak.
        // Bu script, saveSetting'den önce çalışmalı.
        $initialDataPath = __DIR__ . '/sql/initial_reference_data.sql';
        if (file_exists($initialDataPath)) {
            $sqlQueries = file_get_contents($initialDataPath);
            $statements = array_filter(array_map('trim', explode(';', $sqlQueries)));
            foreach ($statements as $statement) { if (!empty($statement)) { try { Capsule::statement($statement); } catch (\Exception $e) { BtkHelper::moduleLog('activate_initial_data_warning', $e->getMessage(), $statement, ['warning']);}}}
            $messages[] = 'Başlangıç ve referans verileri yüklendi/kontrol edildi.';
        } else { $messages[] = 'Bilgi: sql/initial_reference_data.sql bulunamadı.';}
        
        // Modül versiyonunu mod_btk_config tablosuna kaydet
        // mod_btk_config tablosunda 'module_version_btkreports' adında bir sütun olmalı.
        // Eğer yoksa, initial_reference_data.sql'de veya install.sql'de bu sütun eklenmeli.
        // Veya BtkHelper::saveSetting() bu sütunu dinamik olarak ekleyebilmeli (ALTER TABLE ile, bu riskli).
        // En iyisi install.sql'de mod_btk_config'e bu sütunu eklemek.
        // Şimdilik, bu sütunun var olduğunu varsayıyoruz.
        $moduleConfig = btkreports_config();
        BtkHelper::saveSetting('module_version', $moduleConfig['version']); // 'module_version' sütun adı
        $messages[] = 'Modül versiyonu kaydedildi.';

        // Personel aktarımı (BtkHelper'ın yüklendiğinden emin olduktan sonra)
        $admins = Capsule::table('tbladmins')->where('disabled', 0)->get();
        $operatorUnvani = BtkHelper::getSetting('operator_unvani', 'Lütfen Ayarlardan Giriniz');
        foreach ($admins as $admin) {
            if (!Capsule::table('mod_btk_personel')->where('whmcs_admin_id', $admin->id)->exists()) { // sütun adı whmcs_admin_id olmalı
                try { Capsule::table('mod_btk_personel')->insert([
                        'whmcs_admin_id' => $admin->id, 'adi' => $admin->firstname, 'soyadi' => $admin->lastname,
                        'email_adresi' => $admin->email, 'firma_unvani' => $operatorUnvani,
                        'btk_listesine_ekle' => 1, 'olusturulma_zamani' => date('Y-m-d H:i:s'),
                        'son_guncelleme_zamani' => date('Y-m-d H:i:s'),
                    ]);
                } catch (\Exception $e) { BtkHelper::moduleLog('activate_personnel_error', ['admin_id' => $admin->id], $e->getMessage(), ['error']);}
            }
        }
        $messages[] = 'WHMCS yöneticileri personel tablosuna aktarıldı/kontrol edildi.';
        
        BtkHelper::moduleLog('btkreports_activate', 'Modül aktive edildi', ['version' => $moduleConfig['version']]);
        return ['status' => 'success', 'description' => implode('<br>', $messages)];
    } catch (\Exception $e) {
        $errorMessage = 'Modül aktivasyonu sırasında genel bir hata oluştu: ' . $e->getMessage();
        BtkHelper::moduleLog('activate_exception_v204', $errorMessage, $e->getTraceAsString(), ['error']);
        return ['status' => 'error', 'description' => $errorMessage];
    }
}

/**
 * Modül Deaktivasyon Fonksiyonu.
 */
function btkreports_deactivate(): array
{
    if (!class_exists('BtkHelper')) {
        return ['status' => 'error', 'description' => 'Kritik Hata: BtkHelper sınıfı yüklenemedi. Deaktivasyon yapılamıyor.'];
    }
    try {
        // mod_btk_config tablosundaki 'sil_tablolar_kaldirirken' sütun adını kullanmalıyız.
        $deleteTables = (bool) BtkHelper::getSetting('sil_tablolar_kaldirirken', "0"); 

        if ($deleteTables) {
            // Silinecek tabloların listesi (install.sql'deki ile aynı olmalı, bağımlılık sırasına dikkat et)
            $tablesToDrop = [ /* ... v2.0.2'deki gibi tablo listesi ... */ ];
            foreach ($tablesToDrop as $tableName) { Capsule::schema()->dropIfExists($tableName); }
            BtkHelper::moduleLog('btkreports_deactivate', 'Tablolar silindi.');
            return ['status' => 'success', 'description' => 'Modül devre dışı bırakıldı ve veritabanı tabloları silindi.'];
        } else {
            BtkHelper::moduleLog('btkreports_deactivate', 'Tablolar korundu.');
            return ['status' => 'success', 'description' => 'Modül devre dışı bırakıldı. Veritabanı tabloları korunmuştur.'];
        }
    } catch (\Exception $e) {
        $errorMessage = 'Modül devre dışı bırakılırken bir hata oluştu: ' . $e->getMessage();
        BtkHelper::moduleLog('deactivate_exception_v204', $errorMessage, $e->getTraceAsString(), ['error']);
        return ['status' => 'error', 'description' => $errorMessage];
    }
}

/**
 * Modül Yükseltme Fonksiyonu.
 */
function btkreports_upgrade(array $vars): void
{
    if (class_exists('BtkHelper') && method_exists('BtkHelper', 'moduleLog')) {
        BtkHelper::moduleLog('btkreports_upgrade_v204', $vars, 'Upgrade fonksiyonu çalıştı.');
    }
}

// --- BÖLÜM 1 / 2 SONU - (btkreports.php, v2.0.4 - Güncellenmiş BtkHelper Kullanımı)
// --- BÖLÜM 2 / 2 BAŞI - (btkreports.php, v2.0.4 - _output fonksiyonu)

/**
 * Modül Admin Arayüzü Çıktı Fonksiyonu - Doğrudan PHP ile HTML basar.
 */
function btkreports_output(array $vars): void
{
    $action = strtolower($_GET['action'] ?? 'index');
    $modulelink = $vars['modulelink'] ?? 'addonmodules.php?module=btkreports';
    $LANG = $vars['_lang'] ?? [];
    
    $controllerClass = null;
    $methodName = 'index';
    $pageData = []; 

    if (!class_exists('BtkHelper')) {
        echo '<div class="alert alert-danger"><strong>BTK Modülü Kritik Hatası:</strong> BtkHelper sınıfı yüklenemedi!</div>';
        return;
    }
    
    switch ($action) {
        case 'index':
        case 'dashboard':
            if (class_exists('DashboardController')) {
                $controllerClass = 'DashboardController';
                $methodName = 'index';
            } else {
                $pageData['btkModuleError'] = 'DashboardController sınıfı yüklenemedi (Ana Sayfa).';
            }
            break;
        case 'config':
            // ConfigController'ı dahil et (dosya adı küçük harf varsayımı)
            $configControllerPath = __DIR__ . '/controllers/admin/configcontroller.php';
            if (file_exists($configControllerPath)) {
                require_once $configControllerPath;
                if (class_exists('ConfigController')) {
                    $controllerClass = 'ConfigController';
                    $methodName = ($_SERVER['REQUEST_METHOD'] === 'POST') ? 'save' : 'index';
                } else {
                    $pageData['btkModuleError'] = 'ConfigController sınıfı configcontroller.php içinde bulunamadı.';
                }
            } else {
                $pageData['btkModuleError'] = 'controllers/admin/configcontroller.php dosyası bulunamadı.';
            }
            break;
        // TODO: Diğer controller'lar için case'ler ve require_once'lar eklenecek
        default:
            if (class_exists('DashboardController')) {
                $controllerClass = 'DashboardController';
                $methodName = 'index';
            } else {
                $pageData['btkModuleError'] = 'Varsayılan DashboardController sınıfı yüklenemedi (Bilinmeyen Action).';
            }
            BtkHelper::moduleLog('output_unknown_action_v204', ['action' => $action], 'Bilinmeyen action, DashboardController@index çağrılıyor.');
            break;
    }

    if ($controllerClass && class_exists($controllerClass)) {
        try {
            $controller = new $controllerClass($vars); 
            if (method_exists($controller, $methodName)) {
                $controllerResponse = $controller->$methodName();
                if (is_array($controllerResponse)) {
                    $pageData = array_merge($pageData, $controllerResponse);
                } elseif ($controllerResponse !== null) { 
                    echo $controllerResponse; 
                    return;
                }
            } else {
                $pageData['btkModuleError'] = ($pageData['btkModuleError'] ?? '') . " Metod bulunamadı: " . htmlspecialchars($methodName) . " @ " . htmlspecialchars($controllerClass);
            }
        } catch (\Throwable $e) {
            $pageData['btkModuleError'] = ($pageData['btkModuleError'] ?? '') . " Controller Çalıştırma Hatası: " . htmlspecialchars($e->getMessage());
        }
    } elseif (empty($pageData['btkModuleError']) && $controllerClass) { 
        $pageData['btkModuleError'] = "Controller sınıfı ({$controllerClass}) bulunamadı veya yüklenemedi.";
    }

    // HTML Çıktısı
    $moduleConfig = btkreports_config(); // Bu fonksiyon global olduğu için çağrılabilir.
    echo '<h2>' . htmlspecialchars($pageData['pageTitle'] ?? ($LANG['btk_module_name'] ?? ($moduleConfig['name'] ?? 'BTK Raporları'))) . '</h2>';

    if (!empty($pageData['btkModuleError'])) {
        echo '<div class="alert alert-danger">' . nl2br(htmlspecialchars($pageData['btkModuleError'])) . '</div>';
    }

    // Ana sayfa içeriği
    if (($action === 'index' || $action === 'dashboard') && empty($pageData['btkModuleError'])) {
        // ... (v2.0.2'deki ana sayfa HTML basım kodu buraya gelecek) ...
        echo '<div style="padding: 15px; background-color: #f9f9f9; border: 1px solid #ddd; margin-bottom: 20px;">';
        echo '<p>' . ($pageData['welcomeMessage'] ?? '') . '</p>';
        echo '<p>' . ($pageData['introText'] ?? '') . '</p>';
        echo '</div>';
        echo '<h4>Hızlı Erişim</h4><p>';
        echo '<a href="' . htmlspecialchars($pageData['modulelink'] ?? $modulelink) . '&action=config" class="btn btn-info"><i class="fas fa-cogs"></i> ' . htmlspecialchars($pageData['configLinkText'] ?? ($LANG['btk_menu_config'] ?? 'Ayarlar')) . '</a> ';
        // Diğer butonlar da benzer şekilde eklenecek...
        echo '</p><hr>';
        echo '<p><small>Şu anki tarih/saat: ' . htmlspecialchars($pageData['currentDateTime'] ?? '') . '</small></p>';
        echo '<p><small>Modül Versiyonu: ' . htmlspecialchars($pageData['moduleVersion'] ?? $moduleConfig['version'] ?? 'Bilinmiyor') . '</small></p>';

    } elseif ($action === 'config' && empty($pageData['btkModuleError'])) {
        // Config sayfası için HTML basımı (v1.0.28'deki mantık buraya taşınacak)
        // Bu kısım bir sonraki adımda ConfigController'dan gelen verilerle doldurulacak.
        // Şimdilik bir yer tutucu veya ConfigController'dan gelen $pageData['html_output'] gibi bir şey basılabilir.
        echo $pageData['config_form_html'] ?? '<div class="alert alert-info">Config sayfası içeriği burada gösterilecek.</div>';

    } elseif (empty($pageData['btkModuleError'])) {
         echo '<div class="alert alert-warning">İstenen sayfa (\''.htmlspecialchars($action).'\') için içerik henüz oluşturulmadı.</div>';
    }
}
// --- BÖLÜM 2 / 2 SONU - (btkreports.php, v2.0.4 - _output fonksiyonu)