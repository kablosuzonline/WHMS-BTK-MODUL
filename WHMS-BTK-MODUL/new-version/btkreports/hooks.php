<?php
/**
 * WHMCS BTK Raporlama Modülü - Hooks Dosyası - V5.0.0 - Yeni Nesil
 *
 * Bu dosya, WHMCS üzerinde gerçekleşen çeşitli olayları (hook'ları) yakalayarak
 * BTK raporlama modülünün ilgili fonksiyonlarını tetikler.
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

use WHMCS\Database\Capsule;

// Yardımcı fonksiyonlarımızı içeren dosyayı dahil ediyoruz (tüm iş mantığı burada)
if (file_exists(__DIR__ . '/lib/btkhelper.php')) {
    require_once __DIR__ . '/lib/btkhelper.php';
} else {
    // Bu kritik bir dosya, bulunamazsa modül düzgün çalışmaz.
    if (function_exists('logActivity')) { // WHMCS logActivity fonksiyonu varsa kullan
        logActivity("BTK Hook: btkhelper.php dosyası bulunamadı! Hook fonksiyonları çalışmayabilir.");
    }
    // Hook içinde die() kullanmak WHMCS'in çalışmasını engelleyebilir, sadece logla ve devam etme.
    return;
}

// --- ARAYÜZ ENJEKSİYONLARI İÇİN JAVASCRIPT VE BUTON HOOK'LARI ---

/**
 * Yeni sipariş formunda (admin area -> ordersadd.php) özel JavaScript kodları eklemek için.
 * Örneğin, BTK ile ilgili ön kontroller veya dinamik alanlar için gerekebilir.
 */
add_hook('AdminAreaHeadOutput', 1, function($vars) {
    $filename = $vars['filename'] ?? '';
    $output = '';
    // ordersadd.php sayfasında (yeni sipariş oluşturma) ve eğer helper fonksiyonumuz varsa JS'i ekle.
    if ($filename === 'ordersadd' && function_exists('btk_get_order_form_js')) {
        // btk_get_order_form_js fonksiyonu btkhelper.php içinde tanımlanmalı
        // ve <script> tag'leri dahil olmak üzere gerekli JS kodunu string olarak döndürmelidir.
        $output .= btk_get_order_form_js();
    }
    return $output;
});

/**
 * Hizmet detayları sayfasının (clientsservices.php) altına özel JavaScript kodları ve/veya butonlar eklemek için.
 * Örneğin "BTK Kaydını Tamamla ve Siparişi Onayla" butonu.
 */
add_hook('AdminAreaFooterOutput', 1, function($vars) {
    $filename = $vars['filename'] ?? '';
    $output = '';
    // clientsservices.php sayfasında (hizmet detayları) ve bir hizmet ID'si varsa
    if ($filename === 'clientsservices' && isset($_GET['id']) && is_numeric($_GET['id'])) {
        $serviceId = (int)$_GET['id'];
        if (function_exists('btk_get_service_details_js_and_button')) {
            // btk_get_service_details_js_and_button fonksiyonu btkhelper.php içinde tanımlanmalı
            // ve <script> tag'leri dahil olmak üzere gerekli JS/HTML kodunu string olarak döndürmelidir.
            $output .= btk_get_service_details_js_and_button($serviceId, $vars['modulelink'] ?? 'addonmodules.php?module=btkreports');
        }
    }
    return $output;
});


// --- SIPARİŞ AKIŞI HOOK'LARI ---

/**
 * Bir sipariş admin panelinden kabul edildiğinde tetiklenir (Admin panelinden manuel veya otomatik).
 * Yeni onaylanan hizmetler için BTK ilk kayıtlarını ve "YENI_ABONELIK_KAYDI" (kod '1') hareketlerini oluşturur.
 * Bu hook, ürün grubu eşleştirmelerinden varsayılan BTK Yetki ve Hizmet Tipi'ni alır.
 */
add_hook('AcceptOrder', 1, function($vars) {
    $orderId = $vars['orderid'] ?? 0;
    // $vars['serviceids'] bir dizi veya virgülle ayrılmış string olabilir.
    $serviceIdsInput = $vars['serviceids'] ?? [];
    $serviceIds = is_array($serviceIdsInput) ? $serviceIdsInput : (empty($serviceIdsInput) ? [] : explode(',', $serviceIdsInput));
    
    if ($orderId > 0 && !empty($serviceIds) && function_exists('btk_handle_accept_order')) {
        btk_handle_accept_order($orderId, $serviceIds); // Bu fonksiyon btkhelper.php'de
    } else {
        if (function_exists('btk_log_module_action')) {
            btk_log_module_action("AcceptOrder Hook Hatası: Geçersiz orderid veya serviceids. Helper fonksiyonu da eksik olabilir.", "CRITICAL_ERROR", (array)$vars);
        }
    }
});


// --- MÜŞTERİ PROFİLİ VE HİZMET DETAYLARI FORM ENJEKSİYON VE KAYIT HOOK'LARI ---

/**
 * Müşteri profili DÜZENLEME sayfasındaki "Profil" sekmesine BTK'ya özel alanları ekler.
 * Bu kanca, bir dizi döndürmelidir; her dizi elemanı form içine eklenecek bir HTML bloğudur.
 * client_details_btk_form.tpl bu kanca ile enjekte edilir.
 */
add_hook('AdminAreaClientProfileTabFields', 1, function($vars) {
    $clientId = $vars['userid'] ?? 0;
    if ($clientId > 0 && function_exists('btk_render_client_profile_btk_fields_hook')) {
        // btk_render_client_profile_btk_fields_hook fonksiyonu btkhelper.php içinde tanımlanmalı
        // ve AdminAreaClientProfileTabFields kancasının beklediği formatta bir dizi döndürmelidir.
        // Bu dizi, TPL dosyasından render edilmiş HTML'i içerecektir.
        return btk_render_client_profile_btk_fields_hook($vars); // $vars'ın tamamını gönderelim
    }
    return []; // Boş dizi döndürülürse hiçbir şey eklenmez.
});

/**
 * Müşteri profili sayfasındaki özel alanlar (BTK Veri Giriş Formu) kaydedildiğinde tetiklenir.
 * Müşterinin BTK ile ilgili yerleşim adresi ve kimlik bilgilerini günceller.
 * NVI doğrulaması yapar ve hatalıysa kimlik numaralarını kaydetmez.
 */
add_hook('AdminClientProfileTabFieldsSave', 1, function($vars) {
    $clientId = $vars['userid'] ?? 0;
    // $_POST verileri bu hook'ta en güncel bilgiyi içerir.
    // client_details_btk_form.tpl'den gelen btk_client_data dizisi bu şekilde gelmeli.
    if ($clientId > 0 && isset($_POST['btk_client_data']) && function_exists('btk_handle_client_data_update')) {
        $result = btk_handle_client_data_update($clientId, $_POST);
        // Sonuç (başarı/hata mesajı) session'a btkhelper içinde yazılıyor.
        // Eğer $result['status'] === 'error' ise ve işlemi durdurmak gerekiyorsa,
        // WHMCS dokümantasyonuna göre bu hook'tan bir string hata mesajı döndürülebilir.
        if (isset($result['status']) && $result['status'] === 'error' && !empty($result['message'])) {
            // WHMCS, Client Profile save işleminde hook'tan string bir hata mesajı döndürülürse
            // bunu genellikle bir popup veya hata mesajı olarak gösterir ve kaydı durdurabilir.
            // Bu davranış WHMCS versiyonuna göre test edilmelidir.
            // return $result['message']; // Bu satır aktif edilirse kaydı durdurabilir.
        }
    }
});

/**
 * Bir müşteri kaydı admin panelinden düzenlendiğinde (ClientEdit) tetiklenir.
 * Bu hook, BTK verilerini etkileyebilecek temel müşteri bilgileri (ad, soyad, şirket vb.)
 * değiştiğinde mod_btk_abone_data'daki ilgili kayıtları senkronize etmek ve
 * "Müşteri Bilgi Değişikliği" (kod '11') hareketi loglamak için kullanılır.
 */
add_hook('ClientEdit', 1, function($vars) {
    $clientId = $vars['userid'] ?? 0;
    // Bu hook, standart WHMCS müşteri düzenleme formu kaydedildiğinde çalışır.
    // BTK için kritik olan Ad, Soyad, Unvan gibi değişiklikler burada yakalanabilir.
    if ($clientId > 0 && function_exists('btk_handle_whmcs_client_core_data_update')) {
        // Bu fonksiyon btkhelper.php'de tanımlanmalı ve $vars içindeki değişiklikleri
        // mod_btk_abone_data'ya yansıtıp hareket loglamalıdır.
        btk_handle_whmcs_client_core_data_update($clientId, $vars);
    }
});

/**
 * Hizmet detayları sayfasına (clientsservices.php) BTK veri giriş formunu ekler.
 * Bu kanca, sayfanın belirli bir bölümüne HTML enjekte etmek için kullanılır.
 */
add_hook('AdminAreaServiceDetailsOutput', 1, function($vars) {
    $serviceId = $vars['id'] ?? ($vars['serviceid'] ?? 0);
    $clientId = $vars['userid'] ?? 0;
    $moduleLink = 'addonmodules.php?module=btkreports'; // WHMCS $vars['modulelink'] bu hook'ta olmayabilir.

    if ($serviceId > 0 && $clientId > 0 && function_exists('btk_render_service_details_form_hook')) {
        // btk_render_service_details_form_hook fonksiyonu btkhelper.php içinde tanımlanmalı
        // ve <script> ve <style> tag'leri dahil olmak üzere tam HTML'i bir dizi elemanı olarak döndürmelidir.
        return btk_render_service_details_form_hook($serviceId, $clientId, $moduleLink, $vars['_lang'] ?? []);
    }
    return [];
});


// --- HİZMET DURUM DEĞİŞİKLİĞİ HOOK'LARI ---

add_hook('AfterModuleSuspend', 1, function($vars) {
    $params = $vars['params'] ?? $vars; 
    $serviceId = $params['serviceid'] ?? null;
    if ($serviceId && function_exists('btk_handle_service_status_change')) {
        btk_handle_service_status_change($serviceId, 'D', '16', false, 'HİZMET DONDURULDU (İŞLETMECİ)'); 
    }
});

add_hook('AfterModuleUnsuspend', 1, function($vars) {
    $params = $vars['params'] ?? $vars;
    $serviceId = $params['serviceid'] ?? null;
    if ($serviceId && function_exists('btk_handle_service_status_change')) {
        btk_handle_service_status_change($serviceId, 'A', '1', false, 'HİZMET AKTİFLEŞTİRİLDİ (DONDURMA KALDIRILDI)'); 
    }
});

add_hook('AfterModuleTerminate', 1, function($vars) {
    $params = $vars['params'] ?? $vars;
    $serviceId = $params['serviceid'] ?? null;
    if ($serviceId && function_exists('btk_handle_service_status_change')) {
        btk_handle_service_status_change($serviceId, 'I', '10', true, 'HİZMET SONLANDIRILDI'); 
    }
});

/**
 * Bir hizmet silinmeden hemen önce tetiklenir.
 * BTK'ya raporlanmış verileri olan hizmetlerin silinmesini engellemek veya
 * bir "İPTAL" hareketi loglamak için kullanılabilir.
 */
add_hook('PreDeleteService', 1, function($vars) {
    $serviceId = $vars['serviceid'] ?? null;
    if ($serviceId && function_exists('btk_prevent_service_deletion_if_reported')) {
        $result = btk_prevent_service_deletion_if_reported($serviceId);
        if (is_array($result) && isset($result['abort']) && $result['abort'] === true) {
            // WHMCS hook'tan string bir hata mesajı beklerse işlemi durdurur.
            return $result['message'] ?? "BTK'ya raporlanmış verileri olan bu hizmet silinemez. Lütfen önce BTK durumunu 'İptal' olarak güncelleyin.";
        }
    }
    return []; // Sorun yoksa boş array veya null döndür
});


// --- PERSONEL YÖNETİMİ HOOK'LARI ---

/**
 * Yeni bir admin eklendiğinde tetiklenir.
 * Yeni admini mod_btk_personel tablosuna ekler.
 */
add_hook('AdminAdd', 1, function($vars) {
    $adminIdHook = $vars['adminid'] ?? 0;
    if ($adminIdHook && function_exists('btk_sync_admin_to_personel')) {
        btk_sync_admin_to_personel($adminIdHook, $vars);
    }
});

/**
 * Bir adminin bilgileri düzenlendiğinde tetiklenir.
 * mod_btk_personel tablosundaki ilgili adminin bilgilerini günceller.
 */
add_hook('AdminEdit', 1, function($vars) {
     $adminIdHook = $vars['adminid'] ?? 0;
    if ($adminIdHook && function_exists('btk_sync_admin_to_personel')) {
        // $vars içinde eski ve yeni değerler olabilir, helper bunu dikkate almalı
        btk_sync_admin_to_personel($adminIdHook, $vars);
    }
});

/**
 * Bir admin silindiğinde tetiklenir.
 * mod_btk_personel tablosundaki ilgili admini pasife alır (işten ayrılma tarihi set eder).
 */
add_hook('AdminDelete', 1, function($vars) {
    $adminIdHook = $vars['adminid'] ?? 0;
    if ($adminIdHook && function_exists('btk_deactivate_or_delete_personel')) {
        btk_deactivate_or_delete_personel($adminIdHook);
    }
});

?>