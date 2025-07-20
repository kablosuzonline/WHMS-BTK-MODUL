<?php
/**
 * WHMCS BTK Raporlama Modülü - Kapsamlı Hook Dosyası
 * Sürüm: 8.5.2 (Nihai Autoload Düzeltmesi)
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    8.5.2
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

/**
 * ACİL DURUM DÜZELTMESİ: AUTOLOADER HATASINI GİDERMEK İÇİN GEREKLİ SINIFLARI MANUEL YÜKLEME
 * Bu yöntem, modülün her koşulda kendi sınıflarını ve harici kütüphanelerini bulmasını garanti altına alır.
 */
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/lib/BtkReports/Helper/BtkHelper.php';

use BtkReports\Helper\BtkHelper;
use WHMCS\Database\Capsule;
use WHMCS\Service\Service;

// =================================================================================
// == ARAYÜZ ENJEKSİYON HOOK'LARI
// =================================================================================

/**
 * Müşteri profili sayfasına BTK veri giriş formunu "dikişsiz" bir şekilde enjekte eder.
 */
add_hook('AdminAreaClientProfilePage', 1, function($vars) {
    try {
        return BtkHelper::injectClientProfileForm($vars);
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: AdminAreaClientProfilePage', 'KRITIK', $e->getMessage());
        return '<div class="alert alert-danger">BTK Müşteri Bilgileri bölümü yüklenirken kritik bir hata oluştu. Lütfen logları kontrol edin.</div>';
    }
});

/**
 * Hizmet detayları sayfasına BTK veri giriş formunu "dikişsiz" bir şekilde enjekte eder.
 */
add_hook('AdminAreaViewServicePage', 1, function($vars) {
    try {
        return BtkHelper::injectServiceDetailsForm($vars);
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: AdminAreaViewServicePage', 'KRITIK', $e->getMessage(), null, ['serviceid' => $vars['serviceid']]);
        return '<div class="alert alert-danger">BTK Hizmet Bilgileri bölümü yüklenirken kritik bir hata oluştu. Lütfen logları kontrol edin.</div>';
    }
});

// =================================================================================
// == VERİ KAYDETME VE İŞLEM HOOK'LARI
// =================================================================================

/**
 * Müşteri profili kaydedildiğinde, enjekte edilen BTK verilerini yakalar.
 */
add_hook('ClientEdit', 1, function($vars) {
    if (isset($_POST['btk_profile_data_submitted'])) {
        try {
            BtkHelper::handleClientProfileSave($vars['userid'], $_POST['btk_profile_data'] ?? []);
        } catch (\Exception $e) {
            BtkHelper::logAction('Hook Hatası: ClientEdit (BTK Veri Kaydı)', 'HATA', $e->getMessage(), null, ['userid' => $vars['userid']]);
        }
    }
});

/**
 * Hizmet detayları kaydedildiğinde, enjekte edilen BTK verilerini yakalar.
 */
add_hook('AdminServiceEdit', 1, function($vars) {
    try {
        BtkHelper::handleServiceEdit($vars);
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: AdminServiceEdit (Standart Veri)', 'HATA', $e->getMessage(), null, ['serviceid' => $vars['serviceid']]);
    }
    
    if (isset($_POST['btk_service_data_submitted'])) {
        try {
            BtkHelper::handleServiceDetailsSave($vars['serviceid'], $_POST['btk_service_data'] ?? []);
        } catch (\Exception $e) {
            BtkHelper::logAction('Hook Hatası: AdminServiceEdit (BTK Veri Kaydı)', 'HATA', $e->getMessage(), null, ['serviceid' => $vars['serviceid']]);
        }
    }
});

/**
 * Yeni bir sipariş onaylandığında, ilgili hizmetler için "YENİ ABONELİK" hareketi oluşturur.
 */
add_hook('AfterOrderAccept', 1, function($vars) {
    try {
        BtkHelper::handleOrderAccepted($vars['orderid']);
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: AfterOrderAccept', 'HATA', $e->getMessage(), null, ['orderid' => $vars['orderid']]);
    }
});

/**
 * Bir hizmet askıya alındığında "HAT DURUM DEĞİŞİKLİĞİ" hareketi oluşturur.
 */
add_hook('AfterModuleSuspend', 1, function($vars) {
    try {
        BtkHelper::handleServiceStatusChange($vars['params']['serviceid'], 'Suspended');
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: AfterModuleSuspend', 'HATA', $e->getMessage(), null, ['serviceid' => $vars['params']['serviceid']]);
    }
});

/**
 * Askıdan çıkarıldığında "HAT DURUM DEĞİŞİKLİĞİ" hareketi oluşturur.
 */
add_hook('AfterModuleUnsuspend', 1, function($vars) {
    try {
        BtkHelper::handleServiceStatusChange($vars['params']['serviceid'], 'Active');
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: AfterModuleUnsuspend', 'HATA', $e->getMessage(), null, ['serviceid' => $vars['params']['serviceid']]);
    }
});

/**
 * Hizmet sonlandırıldığında "HAT İPTAL" hareketi oluşturur.
 */
add_hook('AfterModuleTerminate', 1, function($vars) {
    try {
        BtkHelper::handleServiceStatusChange($vars['params']['serviceid'], 'Terminated');
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: AfterModuleTerminate', 'HATA', $e->getMessage(), null, ['serviceid' => $vars['params']['serviceid']]);
    }
});

/**
 * Hizmet silinme işlemini engeller, BTK kayıt bütünlüğünü korur.
 */
add_hook('ServiceDelete', 1, function($vars) {
    try {
        $rehberKayit = Capsule::table('mod_btk_abone_rehber')->where('whmcs_service_id', $vars['serviceid'])->first();
        if ($rehberKayit) { 
            BtkHelper::logAction('Hook: ServiceDelete (Engellendi)', 'UYARI', "ID {$vars['serviceid']} hizmetinin BTK kaydı olduğu için silinemez.", null);
            return ['abort' => true, 'errorMessage' => BtkHelper::getLang('serviceCannotDeleteBtkReason')];
        }
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: ServiceDelete', 'HATA', $e->getMessage(), null, ['serviceid' => $vars['serviceid']]);
    }
});

// =================================================================================
// == PERSONEL YÖNETİMİ HOOK'LARI
// =================================================================================

/**
 * Bir admin hesabı kaydedildiğinde, personel tablosunu senkronize eder.
 */
add_hook('AdminSave', 1, function ($vars) {
    try {
        BtkHelper::syncAdminToPersonel($vars['adminid'], $vars);
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: AdminSave', 'HATA', $e->getMessage(), null, ['adminid' => $vars['adminid']]);
    }
});

/**
 * Bir admin hesabı silindiğinde, personel kaydını pasife çeker.
 */
add_hook('AdminDelete', 1, function ($vars) {
    try {
        BtkHelper::handleAdminDelete($vars['adminid']);
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: AdminDelete', 'HATA', $e->getMessage(), null, ['adminid' => $vars['adminid']]);
    }
});

// =================================================================================
// == MÜŞTERİ PANELİ HOOK'LARI
// =================================================================================

/**
 * Müşteri paneli detaylar sayfasına BTK bilgilerini basar.
 */
add_hook('ClientAreaDetailsOutput', 1, function($vars) {
    try {
        if (BtkHelper::get_btk_setting('show_btk_info_if_empty_clientarea', '0') !== '1') {
            return '';
        }
        $smarty = new \Smarty();
        $smarty->assign('LANG', BtkHelper::loadLang());
        $smarty->assign($vars);
        $smarty->assign('btkClientData', BtkHelper::getBtkClientInfoForClientArea($vars['client']->id));
        return $smarty->fetch(__DIR__ . '/templates/clientarea/client_btk_details.tpl');
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: ClientAreaDetailsOutput', 'HATA', $e->getMessage(), $vars['client']->id ?? null);
        return '';
    }
});

/**
 * Müşteri paneli hizmet detayları sayfasına BTK bilgilerini basar.
 */
add_hook('ClientAreaProductDetailsOutput', 1, function($vars) {
    try {
        if (BtkHelper::get_btk_setting('show_btk_info_if_empty_clientarea', '0') !== '1') {
            return '';
        }
        $smarty = new \Smarty();
        $smarty->assign('LANG', BtkHelper::loadLang());
        $smarty->assign($vars);
        $smarty->assign('btkServiceDetailsData', BtkHelper::getBtkServiceInfoForClientArea($vars['serviceid']));
        return $smarty->fetch(__DIR__ . '/templates/clientarea/service_btk_details.tpl');
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: ClientAreaProductDetailsOutput', 'HATA', $e->getMessage(), $vars['userid'] ?? null, ['serviceid' => $vars['serviceid']]);
        return '';
    }
});

// =================================================================================
// == KENDİNİ ONARAN GÜVENLİK MEKANİZMASI
// =================================================================================
/**
 * Her yönetici sayfası yüklendiğinde çalışır.
 * Güvenli temp klasörünün ve .htaccess dosyasının varlığını kontrol eder,
 * eğer silinmişse yeniden oluşturur.
 */
add_hook('AdminAreaPage', 1, function($vars) {
    try {
        BtkHelper::ensureTempDirectoryExists();
    } catch (\Exception $e) {
        BtkHelper::logAction('Temp Klasör Bekçi Hatası', 'KRITIK', $e->getMessage());
    }
});

?>