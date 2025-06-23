<?php
// --- BÖLÜM 1 / 1 BAŞI - (controllers/admin/dashboardcontroller.php, v2.0.1 - Namespace'siz)

if (!defined("WHMCS")) {
    die("Bu dosyaya doğrudan erişilemez.");
}

// BtkHelper sınıfı btkreports.php dosyasında zaten require_once ile dahil edilmiş olmalı.
// Bu yüzden burada tekrar require_once yapmaya genellikle gerek yoktur.
// Ancak, emin olmak veya bu dosyanın bağımsız test edilebilirliğini artırmak için
// bir class_exists kontrolü ve gerekirse require_once eklenebilir.
// Şimdilik, btkreports.php'nin bunu hallettiğini varsayıyoruz.

class DashboardController
{
    /**
     * @var array WHMCS tarafından _output fonksiyonuna geçirilen veya Controller'a verilen değişkenler.
     */
    protected array $vars;

    /**
     * Constructor.
     *
     * @param array $vars WHMCS $vars dizisi veya modül tarafından hazırlanan temel değişkenler.
     */
    public function __construct(array $vars)
    {
        $this->vars = $vars;
        // BtkHelper statik metodlar kullandığı için burada nesne oluşturmaya gerek yok.
    }

    /**
     * Modül ana sayfası için verileri hazırlar.
     * Bu metod, _output fonksiyonunun HTML basarken kullanacağı bir veri dizisi döndürür.
     *
     * @return array Ana sayfa için hazırlanmış veri dizisi.
     */
    public function index(): array
    {
        // BtkHelper sınıfının varlığını ve yüklendiğini kontrol et
        if (!class_exists('BtkHelper') || !method_exists('BtkHelper', 'getSetting')) {
            // Bu kritik bir durum, BtkHelper olmadan bu controller düzgün çalışamaz.
            // Hata mesajını pageData içinde döndürelim, _output fonksiyonu bunu basar.
            return [
                'pageTitle' => 'Hata',
                'btkModuleError' => 'DashboardController: BtkHelper sınıfı veya gerekli metodları bulunamadı!',
                'modulelink' => $this->vars['modulelink'] ?? 'addonmodules.php?module=btkreports',
                'LANG' => $this->vars['_lang'] ?? [],
            ];
        }

        $lang = $this->vars['_lang'] ?? [];
        $modulelink = $this->vars['modulelink'] ?? 'addonmodules.php?module=btkreports';
        
        $moduleConfigData = [];
        if (function_exists('btkreports_config')) { // Global fonksiyon olduğu için varlığını kontrol et
            $moduleConfigData = btkreports_config();
        }
        $pageTitle = $lang['btk_dashboard_title'] ?? ($moduleConfigData['name'] ?? 'BTK Raporları Ana Sayfa');
        $moduleVersion = $moduleConfigData['version'] ?? 'Bilinmiyor';
        
        $operatorName = BtkHelper::getSetting('operator_adi', ($lang['btk_operator_name_not_set'] ?? '...'));
        $yedekFtpEnabled = (bool) BtkHelper::getSetting('yedek_ftp_kullan', "0");

        // FTP Durumları için temel bilgiler
        // Bu bilgiler, BtkHelper::getFtpSettings() metodunun senin "new-version" modülündeki
        // mod_btk_config tablosundaki sütun adlarını doğru okuduğunu varsayar.
        $mainFtpSettings = BtkHelper::getFtpSettings('ana');
        $mainFtpStatus = [
            'configured' => !empty($mainFtpSettings['host']) && !empty($mainFtpSettings['kullanici']),
            'status_text' => ($mainFtpSettings['host'] && $mainFtpSettings['kullanici']) ? ($lang['btk_ftp_status_not_checked_yet'] ?? 'Kontrol Edilmedi') : ($lang['btk_not_configured'] ?? 'Yapılandırılmadı'),
            'host' => $mainFtpSettings['host'] ?: '-',
        ];

        $backupFtpStatus = ['configured' => false, 'status_text' => ($lang['btk_not_configured'] ?? 'Yapılandırılmadı'), 'host' => '-'];
        if ($yedekFtpEnabled) {
            $backupFtpSettings = BtkHelper::getFtpSettings('yedek');
            $backupFtpStatus['configured'] = !empty($backupFtpSettings['host']) && !empty($backupFtpSettings['kullanici']);
            $backupFtpStatus['host'] = $backupFtpSettings['host'] ?: '-';
            if ($backupFtpStatus['configured']) {
                $backupFtpStatus['status_text'] = $lang['btk_ftp_status_not_checked_yet'] ?? 'Kontrol Edilmedi';
            }
        }
        
        // TODO: FtpService (lib/ftpservice.php) hazır olduğunda, gerçek FTP durum kontrolleri yapılacak.

        $pageData = [
            'pageTitle' => $pageTitle,
            'welcomeMessage' => ($lang['btk_dashboard_welcome_message'] ?? 'BTK Raporları Modülüne hoş geldiniz, ') . htmlspecialchars($operatorName) . '.',
            'introText' => $lang['btk_dashboard_intro_text'] ?? 'Bu panel üzerinden BTK raporlarını yönetebilirsiniz.',
            'configLinkText' => $lang['btk_go_to_config'] ?? 'Ayarlara Git',
            'personnelLinkText' => $lang['btk_menu_personnel'] ?? 'Personel Bilgileri',
            'reportsLinkText' => $lang['btk_go_to_generate'] ?? 'Rapor Oluştur/Gönder',
            'popLinkText' => $lang['btk_menu_iss_pop'] ?? 'ISS POP Noktaları',
            'logsLinkText' => $lang['btk_go_to_logs'] ?? 'Logları Görüntüle',
            'mappingLinkText' => $lang['btk_menu_product_mapping'] ?? 'Ürün Eşleştirme',
            'readmeLinkText' => $lang['btk_readme_link_text'] ?? 'Modül Kılavuzu',
            'modulelink' => $modulelink,
            'currentDateTime' => date('Y-m-d H:i:s'), 
            'moduleVersion' => $moduleVersion,
            'whmcsVersion' => $this->vars['version'] ?? 'Bilinmiyor',
            'phpVersion' => phpversion(),
            'yedek_ftp_enabled' => $yedekFtpEnabled,
            'main_ftp_status' => $mainFtpStatus,
            'backup_ftp_status' => $backupFtpStatus,
            'LANG' => $lang, // _output'taki HTML basımı için
        ];
        
        if (method_exists('BtkHelper', 'moduleLog')) { // Önce metodun varlığını kontrol et
             BtkHelper::moduleLog(
                'DashboardController::index',
                ['action' => 'index', 'whmcs_version_in_vars' => ($this->vars['version'] ?? 'N/A')],
                ['pageTitle_prepared' => $pageData['pageTitle'], 'operatorName_used' => $operatorName]
            );
        }
        
        return $pageData;
    }
}

// --- BÖLÜM 1 / 1 SONU - (controllers/admin/dashboardcontroller.php, v2.0.1 - Namespace'siz)