<?php
/**
 * WHMCS BTK Raporlama Modülü - Hook Dosyası
 *
 * WHMCS olaylarını dinleyerek BTK raporları için gerekli veri ve hareketleri oluşturur.
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// Gerekli sınıfları yükle
// Bu hook dosyası WHMCS tarafından otomatik yüklendiği için ana init.php zaten çalışmış olur.
// Modülün kendi lib dosyalarını dahil etmemiz yeterli.
$moduleBaseDir = dirname(__FILE__);
if (file_exists($moduleBaseDir . '/vendor/autoload.php')) {
    require_once $moduleBaseDir . '/vendor/autoload.php';
}
require_once $moduleBaseDir . '/lib/BtkHelper.php';
// NviSoapClient.php burada genellikle doğrudan kullanılmaz, BtkHelper üzerinden çağrılır.

use WHMCS\Database\Capsule;

// -- Yardımcı Fonksiyon (Hook'lar içinde tekrar kullanılabilir) --
/**
 * Verilen hizmet ID'si için BTK Rehber kaydını oluşturur veya günceller.
 * Ayrıca bir hareket kaydı oluşturur.
 *
 * @param int $serviceId WHMCS tblhosting.id
 * @param string $hareketKodu BTK EK-2 Müşteri Hareket Kodu
 * @param string $hareketAciklama Hareket açıklaması
 * @param array $overrideData Rehber tablosuna yazılacak özel veriler (opsiyonel)
 * @return bool
 */
function btk_reports_handle_service_change($serviceId, $hareketKodu, $hareketAciklama, $overrideData = []) {
    $btkHelper = new BtkHelper();
    if (!$btkHelper->getSetting('operator_code')) {
        // Modül ayarları yapılmamışsa işlem yapma
        return false;
    }

    try {
        $service = Capsule::table('tblhosting')->find($serviceId);
        if (!$service) {
            $btkHelper->logMessage('WARNING', __FUNCTION__, "Hizmet bulunamadı: ID {$serviceId}");
            return false;
        }
        $client = Capsule::table('tblclients')->find($service->userid);
        if (!$client) {
            $btkHelper->logMessage('WARNING', __FUNCTION__, "Müşteri bulunamadı: ID {$service->userid} (Hizmet ID: {$serviceId})");
            return false;
        }

        // 1. mod_btk_abone_rehber kaydını bul veya oluştur/güncelle
        $rehberData = []; // BtkHelper içinde bu verileri toplamak için bir fonksiyon olabilir.
        
        // Temel Müşteri Bilgileri
        $rehberData['client_id'] = $client->id;
        $rehberData['service_id'] = $service->id;
        $rehberData['operator_kod'] = $btkHelper->operatorCode;
        $rehberData['musteri_id'] = (string)$client->id; // Veya farklı bir müşteri ID sistemi varsa o
        $rehberData['hat_no'] = $overrideData['hat_no'] ?? $service->dedicatedip ?: $service->domain ?: (string)$service->id; // BTK'nın istediği formatta olmalı
        
        // Hat Durumu ve Kodu (Bu kısım daha akıllı olmalı, mevcut durumu kontrol etmeli)
        // Örneğin, $hareketKodu '10' (HAT_IPTAL) ise hat_durum 'I' olmalı.
        // $service->domainstatus (Pending, Active, Suspended, Terminated, Cancelled, Fraud)
        switch ($service->domainstatus) {
            case 'Active':
                $rehberData['hat_durum'] = 'A';
                $rehberData['hat_durum_kodu'] = $overrideData['hat_durum_kodu'] ?? '1'; // AKTIF
                break;
            case 'Suspended':
                $rehberData['hat_durum'] = 'D'; // Dondurulmuş
                $rehberData['hat_durum_kodu'] = $overrideData['hat_durum_kodu'] ?? '15'; // DONDURULMUS_MUSTERI_TALEBI veya 16
                break;
            case 'Terminated':
            case 'Cancelled':
                $rehberData['hat_durum'] = 'I'; // İptal
                $rehberData['hat_durum_kodu'] = $overrideData['hat_durum_kodu'] ?? '3'; // IPTAL (veya hareket koduna göre)
                break;
            default: // Pending, Fraud vb. durumlar için varsayılan
                $rehberData['hat_durum'] = 'P'; // Ya da BTK'nın "Beklemede" gibi bir kodu varsa
                $rehberData['hat_durum_kodu'] = $overrideData['hat_durum_kodu'] ?? '1'; // Şimdilik AKTIF gibi davranalım ya da özel bir kod
        }
        if (isset($overrideData['hat_durum'])) $rehberData['hat_durum'] = $overrideData['hat_durum'];


        // Hizmet Tipi (Ürün grubu eşleştirmesinden gelmeli)
        $mapping = Capsule::table('mod_btk_product_group_mappings as pgm')
                        ->join('mod_btk_yetki_turleri as yt', 'pgm.yetki_kodu', '=', 'yt.yetki_kodu')
                        ->where('pgm.group_id', $service->gid)
                        ->select('yt.rapor_tipi_eki') // Bu, hizmet_tipi için BTK kodu olmalı, rapor_tipi_eki dosya adı için.
                                                    // mod_btk_yetki_turleri'ne hizmet_tipi_btk_kodu alanı eklenebilir.
                        ->first();
        // Şimdilik placeholder, bu EK-3'ten doğru hizmet tipini almalı
        $rehberData['hizmet_tipi'] = $overrideData['hizmet_tipi'] ?? ($mapping->rapor_tipi_eki ?? 'INTERNET');


        // Diğer rehber alanları client ve service objelerinden ve mod_btk_abone_rehber'deki mevcut kayıttan alınır.
        // Bu fonksiyon BtkHelper'a taşınabilir: $rehberData = $btkHelper->prepareRehberDataFromWhmcs($client, $service, $overrideData);
        // ... (Tüm 85 alan için veri toplama mantığı) ...
        $rehberData['abone_adi'] = $client->firstname;
        $rehberData['abone_soyadi'] = $client->lastname;
        $rehberData['abone_baslangic'] = $overrideData['abone_baslangic'] ?? $btkHelper->formatBtkDateTime(strtotime($service->regdate));
        if ($rehberData['hat_durum'] == 'I' && empty($overrideData['abone_bitis'])) {
             $rehberData['abone_bitis'] = $btkHelper->formatBtkDateTime(); // İptal ise bitiş tarihi şu an
        } else {
            $rehberData['abone_bitis'] = $overrideData['abone_bitis'] ?? '';
        }
        // ÖNEMLİ: Tüm 85 alanın `mod_btk_abone_rehber`'deki karşılıkları burada doldurulmalı
        // veya `BtkHelper::buildBtkReportLine` fonksiyonuna gönderilecek array için hazırlanmalı.
        // `client_details_btk_form.tpl` ve `service_details_btk_form.tpl`'den gelen ek veriler
        // `overrideData` ile veya doğrudan `mod_btk_abone_rehber`'den okunarak birleştirilmeli.


        $existingRehberEntry = Capsule::table('mod_btk_abone_rehber')->where('service_id', $serviceId)->first();
        if ($existingRehberEntry) {
            Capsule::table('mod_btk_abone_rehber')->where('id', $existingRehberEntry->id)->update($rehberData);
            $rehberId = $existingRehberEntry->id;
            $btkHelper->logMessage('INFO', __FUNCTION__, "BTK Rehber kaydı güncellendi: Service ID {$serviceId}");
        } else {
            $rehberId = Capsule::table('mod_btk_abone_rehber')->insertGetId($rehberData);
            $btkHelper->logMessage('INFO', __FUNCTION__, "Yeni BTK Rehber kaydı oluşturuldu: Service ID {$serviceId}, Rehber ID {$rehberId}");
        }

        // 2. mod_btk_abone_hareket_live kaydı oluştur
        if ($rehberId) {
            Capsule::table('mod_btk_abone_hareket_live')->insert([
                'rehber_id' => $rehberId,
                'client_id' => $client->id,
                'service_id' => $service->id,
                'musteri_hareket_kodu' => $hareketKodu,
                'musteri_hareket_aciklama' => $hareketAciklama,
                'musteri_hareket_zamani' => $btkHelper->formatBtkDateTime(),
                'gonderildi' => 0
            ]);
            $btkHelper->logMessage('INFO', __FUNCTION__, "BTK Hareket kaydı oluşturuldu: Service ID {$serviceId}, Hareket Kodu {$hareketKodu}");
        }
        return true;

    } catch (\Exception $e) {
        $btkHelper->logMessage('ERROR', __FUNCTION__, "Hizmet değişikliği işlenirken hata (Service ID: {$serviceId}): " . $e->getMessage() . "\nTrace: " . $e->getTraceAsString());
        return false;
    }
}


// -- MÜŞTERİ İLE İLGİLİ HOOK'LAR --

/**
 * Yeni Müşteri Kaydı (Admin Panelinden veya Müşteri Panelinden)
 * ClientAdd hook'u müşteri eklendikten sonra çalışır.
 * Bu aşamada henüz hizmet olmayabilir, bu yüzden sadece müşteri bazlı bir BTK kaydı
 * (eğer böyle bir yapı isteniyorsa) veya bir ön hazırlık yapılabilir.
 * Genellikle BTK raporlaması hizmet bazlı olduğu için bu hook direkt Rehber/Hareket oluşturmayabilir.
 * Ancak, müşterinin temel BTK bilgilerini (TCKN, Adres vb.) modülün kendi tablolarına çekmek için kullanılabilir.
 */
add_hook('ClientAdd', 1, function($vars) {
    $clientId = $vars['userid'];
    $btkHelper = new BtkHelper();
    $btkHelper->logMessage('DEBUG', 'ClientAdd Hook', "Yeni müşteri eklendi: ID {$clientId}. Henüz hizmet yok, BTK kaydı hizmetle birlikte oluşturulacak.");
    // TODO: Gerekirse, müşteri bazlı bir `mod_btk_client_details` tablosuna temel veri aktarımı yapılabilir.
});

/**
 * Müşteri Bilgileri Düzenlendiğinde (Admin veya Müşteri Paneli)
 * ClientEdit hook'u müşteri bilgileri güncellendikten sonra çalışır.
 */
add_hook('ClientEdit', 1, function($vars) {
    $clientId = $vars['userid'];
    $btkHelper = new BtkHelper();
    $btkHelper->logMessage('DEBUG', 'ClientEdit Hook', "Müşteri bilgileri güncellendi: ID {$clientId}.");

    // Müşteriye ait tüm aktif/pasif hizmetlerin BTK Rehber kayıtlarını bul
    $services = Capsule::table('tblhosting')->where('userid', $clientId)->pluck('id')->all();
    if (!empty($services)) {
        foreach ($services as $serviceId) {
            // Hareket Kodu: 11 - MUSTERI_BILGI_DEGISIKLIGI
            // Bu hook'ta hangi alanların değiştiği bilgisi gelmez, bu yüzden genel bir güncelleme hareketi oluşturulur.
            // Detaylı alan takibi gerekiyorsa, AdminClientProfileTabFieldsSave veya benzeri hook'lar kullanılmalı.
            btk_reports_handle_service_change($serviceId, '11', 'MUSTERI_BILGI_DEGISIKLIGI');
        }
    }
});


// --- BÖLÜM 1 / 2 SONU - (hooks.php, Başlangıç ve Müşteri ile İlgili Hook'lar)

// --- BÖLÜM 2 / 2 BAŞI - (hooks.php, Hizmet ve Fatura ile İlgili Hook'lar)
// -- HİZMET İLE İLGİLİ HOOK'LAR --

/**
 * Yeni Sipariş Kabul Edildiğinde (Admin Panelinden Onay Sonrası)
 * AfterModuleCreate hook'u, bir hizmet modül komutu (create) başarıyla çalıştıktan sonra tetiklenir.
 * Bu genellikle yeni bir hizmetin aktif hale geldiği andır.
 */
add_hook('AfterModuleCreate', 1, function($vars) {
    $serviceId = $vars['params']['serviceid']; // veya $vars['serviceid'] WHMCS versiyonuna göre değişebilir
    // Hareket Kodu: 1 - YENI_ABONELIK_KAYDI
    btk_reports_handle_service_change($serviceId, '1', 'YENI_ABONELIK_KAYDI');
});

/**
 * Hizmet Askıya Alındığında
 * AfterModuleSuspend hook'u, bir hizmet modül komutu (suspend) başarıyla çalıştıktan sonra tetiklenir.
 */
add_hook('AfterModuleSuspend', 1, function($vars) {
    $serviceId = $vars['params']['serviceid'];
    // Hareket Kodu: 2 - HAT_DURUM_DEGISIKLIGI
    // Hat Durum Kodu: 15 (DONDURULMUS_MUSTERI_TALEBI) veya 16 (DONDURULMUS_ISLETME)
    // Bunu ayırt etmek için $vars['params']['suspendreason'] kullanılabilir.
    $hatDurumKodu = '16'; // Varsayılan: İşletme tarafından donduruldu
    if (!empty($vars['params']['suspendreason']) && stripos($vars['params']['suspendreason'], 'müşteri') !== false) {
        // Bu çok güvenilir bir yöntem değil, daha iyi bir yol bulunmalı.
        // $hatDurumKodu = '15';
    }
    btk_reports_handle_service_change($serviceId, '2', 'HAT_DURUM_DEGISIKLIGI (Askıya Alındı)', ['hat_durum' => 'D', 'hat_durum_kodu' => $hatDurumKodu]);
});

/**
 * Hizmet Askıdan Çıkarıldığında
 * AfterModuleUnsuspend hook'u, bir hizmet modül komutu (unsuspend) başarıyla çalıştıktan sonra tetiklenir.
 */
add_hook('AfterModuleUnsuspend', 1, function($vars) {
    $serviceId = $vars['params']['serviceid'];
    // Hareket Kodu: 2 - HAT_DURUM_DEGISIKLIGI
    btk_reports_handle_service_change($serviceId, '2', 'HAT_DURUM_DEGISIKLIGI (Askıdan Çıkarıldı)', ['hat_durum' => 'A', 'hat_durum_kodu' => '1']);
});

/**
 * Hizmet Sonlandırıldığında (Terminate)
 * AfterModuleTerminate hook'u, bir hizmet modül komutu (terminate) başarıyla çalıştıktan sonra tetiklenir.
 */
add_hook('AfterModuleTerminate', 1, function($vars) {
    $serviceId = $vars['params']['serviceid'];
    // Hareket Kodu: 10 - HAT_IPTAL
    // Hat Durum Kodu: 3 (IPTAL) veya 5 (IPTAL_MUSTERI_TALEBI)
    btk_reports_handle_service_change($serviceId, '10', 'HAT_IPTAL (Sonlandırıldı)', ['hat_durum' => 'I', 'hat_durum_kodu' => '3', 'abone_bitis' => (new BtkHelper())->formatBtkDateTime()]);
});

/**
 * Hizmet İptal Edildiğinde (Cancelled - Genellikle fatura ödenmediğinde veya müşteri talebiyle)
 * AdminServiceCancelled hook'u veya ClientServiceCancelled hook'u kullanılabilir.
 * ServiceDelete hook'u da var ama BTK için hizmetler silinmemeli, iptal edilmeli.
 * OrderAcceptance (Sipariş Onayı) hook'u AfterModuleCreate yerine kullanılabilir.
 */
add_hook('AdminServiceEdit', 1, function($vars) {
    // Bu hook hizmet admin panelinden düzenlendiğinde çalışır.
    // domainstatus değişikliğini yakalamak için kullanılabilir.
    $serviceId = $vars['serviceid'];
    $oldStatus = ''; // Önceki durumu bir şekilde almamız gerekebilir, WHMCS bunu doğrudan vermiyor.
                    // Belki mod_btk_abone_rehber'den okunabilir.
    $newStatus = $vars['status']; // Yeni domainstatus

    // $existingBtkService = Capsule::table('mod_btk_abone_rehber')->where('service_id', $serviceId)->first();
    // if ($existingBtkService && $existingBtkService->hat_durum_text_whmcs != $newStatus) {
         // $btkHelper->logMessage('DEBUG', 'AdminServiceEdit Hook', "Service ID {$serviceId} durumu değişti: {$existingBtkService->hat_durum_text_whmcs} -> {$newStatus}");
         // btk_reports_handle_service_change($serviceId, '2', 'HAT_DURUM_DEGISIKLIGI (Admin Edit)');
    // }
    // Bu hook çok sık çalışabilir, sadece gerçekten BTK'yı etkileyen değişikliklerde hareket oluşturulmalı.
    // Şimdilik daha spesifik hooklara odaklanmak daha iyi olabilir.
});


/**
 * İptal Talebi Oluşturulduğunda (Müşteri Tarafından)
 * CancellationRequest hook'u, müşteri iptal talebi gönderdiğinde çalışır.
 * Bu, henüz kesin iptal değildir, admin onayı gerekebilir.
 */
add_hook('CancellationRequest', 1, function($vars) {
    $serviceId = $vars['relid']; // İptal talebi yapılan hizmetin ID'si (tblhosting.id)
    $btkHelper = new BtkHelper();
    $btkHelper->logMessage('INFO', 'CancellationRequest Hook', "Hizmet için iptal talebi alındı: ID {$serviceId}. Henüz kesin iptal değil.");
    // Burada bir hareket oluşturulabilir (örn: Müşteri İptal Talebi) veya admin onayı beklenebilir.
});


// -- FATURA İLE İLGİLİ HOOK'LAR (Opsiyonel, BTK doğrudan fatura hareketi istemeyebilir) --
/**
 * Fatura Ödendiğinde
 * InvoicePaid hook'u, bir fatura ödendi olarak işaretlendiğinde çalışır.
 * BTK için doğrudan bir hareket oluşturmayabilir, ancak hizmet aktivasyonuyla bağlantılıysa önemlidir.
 */
/*
add_hook('InvoicePaid', 1, function($vars) {
    $invoiceId = $vars['invoiceid'];
    // Ödenen faturayla ilişkili hizmetleri bulup, eğer beklemedeyse aktive et ve BTK hareketi oluştur.
    // Bu mantık karmaşık olabilir ve AfterModuleCreate ile çakışabilir.
});
*/


// -- DİĞER ÖNEMLİ OLABİLECEK HOOK'LAR --
// AdminLogin, ClientLogin: Güvenlik loglaması için kullanılabilir.
// AdminClientProfileTabFields, AdminServiceEdit: Admin panelindeki müşteri ve hizmet detaylarına
// modülümüzün özel formlarını (`client_details_btk_form.tpl`, `service_details_btk_form.tpl`) enjekte etmek için.
// Bu hook'lar `btkreports.php` dosyasındaki `_output` içinde de yönetilebilir.

// Örnek: AdminServiceEdit hook'u ile hizmet detayları BTK formunu gösterme
add_hook('AdminServiceEdit', 1, function($vars) {
    // Bu hook, hizmet düzenleme sayfasının altında bir bölüm eklemek için kullanılabilir.
    // $serviceId = $vars['serviceid'];
    // $output = btkreports_service_details_btk_form_output($vars); // btkreports.php'deki fonksiyonu çağır
    // return $output; // HTML'i döndür
    // Ancak WHMCS 8+ da bu tür arayüz eklemeleri için "output" fonksiyonu ve action'lar daha yaygın.
});


$btkHelperForHookInit = new BtkHelper();
$btkHelperForHookInit->logMessage('DEBUG', 'Hooks.php', "BTK Raporlama hook dosyası yüklendi ve çalışmaya hazır.");

// --- BÖLÜM 2 / 2 SONU - (hooks.php, Hizmet ve Fatura ile İlgili Hook'lar)
?>