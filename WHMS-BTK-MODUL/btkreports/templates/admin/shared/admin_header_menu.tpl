{* WHMCS BTK Raporları Modülü - Admin Paneli Ortak Navigasyon Menüsü *}
{* Bu şablon, diğer admin .tpl dosyalarının başına include edilir. *}
{* Aktif sekmeyi belirlemek için $active_tab Smarty değişkeni kullanılır. *}
{* $active_tab değişkeni, btkreports.php'deki output fonksiyonunda ilgili action'a göre set edilmelidir. *}

<ul class="nav nav-tabs btk-nav-tabs" style="margin-bottom: 20px;">
    <li {if $active_tab == 'dashboard' || !$active_tab}class="active"{/if}>
        <a href="{$modulelink}&action=index">
            <i class="fas fa-tachometer-alt icon-spacer"></i>{$LANG.btk_menu_dashboard}
        </a>
    </li>
    <li {if $active_tab == 'config'}class="active"{/if}>
        <a href="{$modulelink}&action=config">
            <i class="fas fa-cogs icon-spacer"></i>{$LANG.btk_menu_config}
        </a>
    </li>
    <li {if $active_tab == 'personnel'}class="active"{/if}>
        <a href="{$modulelink}&action=personnel">
            <i class="fas fa-users-cog icon-spacer"></i>{$LANG.btk_menu_personnel}
        </a>
    </li>
    <li {if $active_tab == 'generatereport'}class="active"{/if}>
        <a href="{$modulelink}&action=generatereport">
            <i class="fas fa-file-export icon-spacer"></i>{$LANG.btk_menu_generate_reports}
        </a>
    </li>
    <li {if $active_tab == 'isspop'}class="active"{/if}>
        <a href="{$modulelink}&action=isspop">
            <i class="fas fa-broadcast-tower icon-spacer"></i>{$LANG.btk_menu_iss_pop}
        </a>
    </li>
    <li {if $active_tab == 'productmapping'}class="active"{/if}>
        <a href="{$modulelink}&action=productmapping">
            <i class="fas fa-link icon-spacer"></i>{$LANG.btk_menu_product_mapping}
        </a>
    </li>
    <li {if $active_tab == 'viewlogs'}class="active"{/if}>
        <a href="{$modulelink}&action=viewlogs">
            <i class="fas fa-clipboard-list icon-spacer"></i>{$LANG.btk_menu_view_logs}
        </a>
    </li>
</ul>

{*
Not: Bu menünün düzgün çalışması için, btkreports.php dosyasındaki btkreports_output() fonksiyonunda,
her bir action için $smartyvalues['active_tab'] değişkeninin doğru değere (örn: 'config', 'personnel')
atanması gerekmektedir. Aşağıda btkreports_output() fonksiyonunun ilgili bölümü için bir örnek verilmiştir:

```php
<?php
// btkreports.php içinde

// ... (use ifadeleri ve diğer fonksiyonlar) ...

function btkreports_output($vars)
{
    global $_LANG; // WHMCS global dil dizisi
    $addonLang = []; // Modülümüze özel dil dizisi

    // Dil dosyasını yükle (önce admin dilini, yoksa varsayılanı dene)
    $adminLanguage = isset($_SESSION['adminlang']) ? strtolower($_SESSION['adminlang']) : '';
    if (empty($adminLanguage)) {
        $adminLanguage = strtolower(\WHMCS\Config\Setting::getValue('Language'));
    }
    $moduleLangPath = __DIR__ . '/lang/';
    if (file_exists($moduleLangPath . $adminLanguage . '.php')) {
        include($moduleLangPath . $adminLanguage . '.php');
    } elseif (file_exists($moduleLangPath . 'turkish.php')) {
        include($moduleLangPath . 'turkish.php');
    }
    // Modül dilini $_LANG'a ekle (WHMCS globaliyle çakışmamasına dikkat et)
    if (isset($LANG) && is_array($LANG)) { // $LANG bizim include ettiğimiz dosyadaki _LANG
        foreach($LANG as $key => $value) {
            if (!isset($_LANG[$key])) {
                 $_LANG[$key] = $value;
            }
        }
    }

    $action = isset($_REQUEST['action']) ? htmlspecialchars($_REQUEST['action']) : 'index';
    $smartyvalues = []; // Smarty'e gönderilecek değişkenler
    $smartyvalues['modulelink'] = $vars['modulelink'];
    $smartyvalues['version'] = $vars['version'];
    $smartyvalues['LANG'] = $_LANG; // Şablonlara tüm dil değişkenlerini gönder
    $smartyvalues['csrfToken'] = \WHMCS\Session::get('tkval');
    $smartyvalues['modulepath'] = ROOTDIR . DIRECTORY_SEPARATOR . 'modules' . DIRECTORY_SEPARATOR . 'addons' . DIRECTORY_SEPARATOR . 'btkreports';


    // Flash mesajlarını al ve Smarty'e gönder, sonra sil
    if (isset($_SESSION['btk_flash_message'])) {
        $smartyvalues['flash_message'] = $_SESSION['btk_flash_message'];
        unset($_SESSION['btk_flash_message']);
    }

    $pageTitle = '';
    $templateFile = '';

    // Çıktıyı buffer'la
    ob_start();

    switch ($action) {
        case 'config':
            $pageTitle = $_LANG['btk_config_title'] ?? 'Modül Ayarları';
            $smartyvalues['active_tab'] = 'config';
            btkreports_page_config($smartyvalues); // Ayar sayfasının verilerini yükle/kaydet
            $templateFile = 'config';
            break;
        // ... (diğer case blokları: personnel, generatereport, isspop, productmapping, viewlogs) ...
        // Örnek bir case:
        // case 'personnel':
        //     $pageTitle = $_LANG['btk_personnel_title'] ?? 'Personel Yönetimi';
        //     $smartyvalues['active_tab'] = 'personnel';
        //     // btkreports_page_personnel($smartyvalues); // Personel sayfasının verilerini yükle/işle
        //     $templateFile = 'personnel';
        //     break;
        case 'index':
        default:
            $pageTitle = $_LANG['btk_dashboard_title'] ?? 'BTK Raporları';
            $smartyvalues['active_tab'] = 'dashboard';
            $smartyvalues['operator_name'] = \WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper::getSetting('operator_adi', 'Operatör');

            // Ana FTP durumunu kontrol et ve Smarty'e gönder
            // Bu kısım BtkHelper::testFtpConnection fonksiyonunu çağırarak doldurulacak.
            // $smartyvalues['main_ftp_status'] = ['connected' => false, 'error' => 'Test edilmedi', 'writable_rehber' => null]; // Örnek başlangıç değeri
            // if (\WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper::getSetting('yedek_ftp_kullan') == '1') {
            //    $smartyvalues['yedek_ftp_enabled'] = true;
            //    $smartyvalues['backup_ftp_status'] = ['connected' => false, 'error' => 'Test edilmedi', 'writable_rehber' => null]; // Örnek
            // } else {
            //    $smartyvalues['yedek_ftp_enabled'] = false;
            // }
            $templateFile = 'index';
            break;
    }

    // Şablon dosyasının tam yolunu oluştur
    $templateFilePath = __DIR__ . '/templates/admin/' . $templateFile . '.tpl';

    if (file_exists($templateFilePath)) {
        // Smarty değişkenlerini ata ve şablonu render et
        foreach ($smartyvalues as $key => $value) {
            $vars['smarty']->assign($key, $value);
        }
        // WHMCS admin teması için header ve footer'ı dahil etme şekli (outputbuffer ile)
        // Sayfa başlığını ayarla (WHMCS kendi mekanizmasıyla yapar, biz sadece içeriği basarız)
        echo '<div class="context-title">' . $pageTitle . '</div>'; // WHMCS stilinde başlık
        $vars['smarty']->display($templateFilePath); // Sadece bizim tpl dosyamızı render et
    } else {
        echo '<div class="alert alert-danger">Admin şablon dosyası bulunamadı: ' . $templateFile . '.tpl</div>';
        \WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper::logActivity("Admin şablon dosyası bulunamadı: " . $templateFilePath, 0, 'CRITICAL');
    }

    $output_content = ob_get_contents(); // Buffer'daki içeriği al
    ob_end_clean(); // Buffer'ı temizle ve kapat

    echo $output_content; // Son çıktıyı bas
}
?>