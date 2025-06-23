<?php
// --- BÖLÜM 1 / 1 BAŞI - (app/Controllers/Admin/ConfigController.php, Ayarları yönetir)

namespace WHMCS\Module\Addon\BtkReports\App\Controllers\Admin;

use WHMCS\Module\Addon\BtkReports\App\Helpers\BtkHelper;
use WHMCS\Database\Capsule; // Veritabanı işlemleri için

class ConfigController
{
    protected array $vars; // WHMCS'den gelen $vars
    protected BtkHelper $btkHelper;
    protected array $lang;

    public function __construct(array $vars)
    {
        $this->vars = $vars;
        $this->btkHelper = new BtkHelper();
        $this->lang = $vars['_lang'] ?? [];
    }

    /**
     * Ayar sayfasını görüntülemek için verileri hazırlar.
     *
     * @return array Şablona gönderilecek veriler.
     */
    public function index(): array
    {
        // Mevcut tüm ayarları veritabanından çek
        $settings = $this->btkHelper->getAllSettings();

        // Yetkilendirme türlerini çek
        $authorizationTypes = [];
        try {
            $authTypesFromDb = Capsule::table('mod_btk_yetki_turleri')->orderBy('id')->get();
            foreach ($authTypesFromDb as $type) {
                $authorizationTypes[] = [
                    'id' => $type->id,
                    'yetki_kodu' => $type->yetki_kodu,
                    'yetki_aciklama' => $type->yetki_aciklama,
                    'secili_mi' => (bool) $type->secili_mi,
                ];
            }
        } catch (\Exception $e) {
            BtkHelper::log('ConfigController_index_auth_types_error', [], $e);
            $settings['btkModuleError_auth_types'] = 'Yetkilendirme türleri yüklenirken bir hata oluştu.';
        }

        // Şifre alanları için placeholder (*****)
        $ftpPasswordPlaceholder = '********';
        if (empty($settings['ftp_ana_sifre'])) {
            $settings['ftp_ana_sifre_display'] = '';
        } else {
            $settings['ftp_ana_sifre_display'] = $ftpPasswordPlaceholder;
        }
        if (empty($settings['ftp_yedek_sifre'])) {
            $settings['ftp_yedek_sifre_display'] = '';
        } else {
            $settings['ftp_yedek_sifre_display'] = $ftpPasswordPlaceholder;
        }
        
        // Boolean ayarlarını doğru şekilde ayarla (açma/kapama anahtarları için)
        $booleanSettings = [
            'yedek_ftp_kullan', 'ftp_ana_pasif_mod', 'ftp_yedek_pasif_mod',
            'personel_excel_ad_format_ana', 'personel_excel_ad_format_yedek',
            'veritabani_sil_deactivate', 'debug_mode',
            'nvi_tckn_validation', 'nvi_ykn_validation', 'adres_kodu_validation'
        ];
        foreach ($booleanSettings as $key) {
            $settings[$key] = isset($settings[$key]) ? (bool)$settings[$key] : false;
        }


        // Flash mesajı varsa al (kaydetme işleminden sonra)
        $flashMessage = $_SESSION['btk_flash_message'] ?? null;
        if ($flashMessage) {
            unset($_SESSION['btk_flash_message']); // Gösterdikten sonra temizle
        }

        return [ // Bu dizi _output fonksiyonunda $pageData['vars'] içine girecek
            'pageTitle' => $this->lang['btk_config_title'] ?? 'Modül Ayarları',
            'settings' => $settings, // Tüm ayarlar
            'authorizationTypes' => $authorizationTypes,
            'modulelink' => $this->vars['modulelink'],
            'LANG' => $this->lang,
            'flash_message' => $flashMessage,
            // FTP Test sonuçları için yer tutucular (JS ile doldurulacak)
            'ftp_ana_test_result' => '',
            'ftp_yedek_test_result' => '',
        ];
    }

    /**
     * POST edilen ayarları kaydeder.
     *
     * @return array Yönlendirme veya mesaj için.
     */
    public function save(): array
    {
        $postedSettings = $_POST['settings'] ?? [];
        $message = ['type' => 'error', 'text' => $this->lang['btk_error_saving_settings'] ?? 'Ayarlar kaydedilemedi.'];

        if (empty($postedSettings) || !is_array($postedSettings)) {
            $_SESSION['btk_flash_message'] = $message;
            return ['redirect' => $this->vars['modulelink'] . '&action=config'];
        }

        // CSRF Token kontrolü (WHMCS'in kendi token'ını kullanabiliriz veya kendimiz üretebiliriz)
        // check_token("WHMCS.admin.default"); // Örnek WHMCS token kontrolü

        $allSuccess = true;

        foreach ($postedSettings as $key => $value) {
            // Şifre alanları özel işlem gerektirir
            if (($key === 'ftp_ana_sifre' || $key === 'ftp_yedek_sifre')) {
                if (!empty($value) && $value !== '********') { // Eğer yeni bir şifre girilmişse (placeholder değilse)
                    $encryptedPassword = BtkHelper::encryptPassword($value);
                    if ($encryptedPassword === null || strpos($encryptedPassword, 'ENCRYPT_FUNCTION_MISSING') === 0) {
                        $allSuccess = false;
                        BtkHelper::log('ConfigController_save_password_encrypt_fail', ['key' => $key], 'Şifre şifrelenemedi.');
                        continue; // Bu ayarı kaydetme
                    }
                    if (!BtkHelper::saveSetting($key, $encryptedPassword)) {
                        $allSuccess = false;
                    }
                } elseif (empty($value)) { // Eğer şifre alanı boş bırakılmışsa, mevcut şifreyi silme
                     if (!BtkHelper::saveSetting($key, '')) { // Boş olarak kaydet
                        $allSuccess = false;
                    }
                }
                // Eğer '********' ise, şifreyi değiştirme, mevcut olan kalsın (BtkHelper::saveSetting zaten updateOrInsert yapıyor)
                // Bu durumda BtkHelper::saveSetting'e hiç gitmemek daha doğru.
                // Bu mantık saveSetting'e dokunmadan, sadece value değişmişse veya boşaltılmışsa işlem yapmak üzerine kurulu.
            } else {
                 // Checkbox/toggle switch değerleri POST edilmediğinde gelmeyebilir, bu yüzden
                 // tüm olası boolean ayarları kontrol edip, gelmemişse '0' olarak set etmek gerekebilir.
                 // Ancak HTML formunda hidden input ile '0' değeri gönderip, checkbox işaretliyse '1' ile üzerine yazdırılabilir.
                 // Şimdilik gelen değeri olduğu gibi kaydediyoruz.
                 // Açma/kapama anahtarları için, eğer POST'ta o key yoksa '0' (false) anlamına gelir.
                $currentValueToSave = is_array($value) ? json_encode($value) : trim($value);
                if (!BtkHelper::saveSetting($key, $currentValueToSave)) {
                    $allSuccess = false;
                }
            }
        }
        
        // Boolean (açma/kapama anahtarı) ayarlarının işlenmesi:
        // Eğer bir checkbox/anahtar işaretlenmemişse, $_POST içinde o key hiç gelmez.
        // Bu yüzden tüm olası boolean ayarlarını döngüye alıp, $_POST'ta yoksa '0' olarak kaydetmeliyiz.
        $booleanSettingKeys = [
            'yedek_ftp_kullan', 'ftp_ana_pasif_mod', 'ftp_yedek_pasif_mod',
            'personel_excel_ad_format_ana', 'personel_excel_ad_format_yedek',
            'veritabani_sil_deactivate', 'debug_mode',
            'nvi_tckn_validation', 'nvi_ykn_validation', 'adres_kodu_validation'
        ];
        foreach ($booleanSettingKeys as $boolKey) {
            $valueToSave = isset($postedSettings[$boolKey]) && ($postedSettings[$boolKey] === '1' || $postedSettings[$boolKey] === 'on') ? '1' : '0';
            if (!BtkHelper::saveSetting($boolKey, $valueToSave)) {
                $allSuccess = false;
            }
        }


        // Yetkilendirme türlerini kaydet
        $postedAuthTypes = $_POST['authtypes'] ?? [];
        try {
            // Önce tümünü '0' yap
            Capsule::table('mod_btk_yetki_turleri')->update(['secili_mi' => 0]);
            if (!empty($postedAuthTypes) && is_array($postedAuthTypes)) {
                foreach ($postedAuthTypes as $authTypeId => $value) {
                    if ($value === '1') {
                        Capsule::table('mod_btk_yetki_turleri')->where('id', (int)$authTypeId)->update(['secili_mi' => 1]);
                    }
                }
            }
        } catch (\Exception $e) {
            $allSuccess = false;
            BtkHelper::log('ConfigController_save_auth_types_error', [], $e);
        }


        if ($allSuccess) {
            $message = ['type' => 'success', 'text' => $this->lang['btk_settings_saved_successfully'] ?? 'Ayarlar başarıyla kaydedildi.'];
        }

        $_SESSION['btk_flash_message'] = $message;
        return ['redirect' => $this->vars['modulelink'] . '&action=config'];
    }

    /**
     * FTP Bağlantısını test eder (AJAX ile çağrılabilir).
     * Bu metod doğrudan HTML basabilir veya JSON döndürebilir.
     * Şimdilik JSON döndürecek şekilde tasarlayalım.
     */
    public function testFtpConnection(): array // JSON response için array döndürür
    {
        // Bu metod daha sonra FtpService kullanılarak detaylandırılacak.
        // $_POST['ftp_type'] (ana veya yedek)
        // $_POST['host'], $_POST['port'], $_POST['user'], $_POST['pass'], $_POST['passive']
        // FtpService->testConnection(...)
        // return ['success' => true/false, 'message' => 'Bağlantı başarılı/başarısız: detay'];

        // Şimdilik dummy response
        header('Content-Type: application/json');
        $ftpType = $_POST['ftp_type'] ?? 'ana';
        $host = $_POST['host'] ?? '';
        // Simüle edilmiş bir yanıt
        if (!empty($host)) {
            return ['success' => true, 'message' => ucfirst($ftpType) . " FTP (" . htmlspecialchars($host) . ") bağlantı testi SİMÜLASYONU başarılı."];
        } else {
            return ['success' => false, 'message' => ucfirst($ftpType) . " FTP bağlantı testi için host bilgisi girilmedi."];
        }
    }
}

// --- BÖLÜM 1 / 1 SONU - (app/Controllers/Admin/ConfigController.php, Ayarları yönetir)