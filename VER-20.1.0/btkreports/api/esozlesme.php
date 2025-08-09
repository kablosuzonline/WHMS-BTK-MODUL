<?php
/**
 * WHMCS BTK Raporlama Modülü - E-Devlet E-Sözleşme API Gateway
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX)
 *
 * Bu dosya, BTK/E-Devlet'ten gelen API çağrıları için tek giriş noktasıdır.
 * Gelen istekleri doğrular, zaman dilimini ayarlar, ilgili Manager sınıfına
 * yönlendirir ve merkezi LogManager aracılığıyla tüm işlemleri kaydeder.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

// --- GÜVENLİK KONTROLÜ: Sadece BTK IP Adresine İzin Ver ---
// BTK, canlı sistemde bu IP'yi kullandığını teyit etmiştir.
$allowedIpAddresses = [
    '212.175.164.15', // BTK Resmi Çıkış IP'si
    '127.0.0.1',      // Yerel testler için
    '::1'             // Yerel testler için (IPv6)
];

if (!in_array($_SERVER['REMOTE_ADDR'], $allowedIpAddresses)) {
    // Güvenlik ihlali denemesini logla
    error_log('[BTK-Entegre] ESozlesme API FORBIDDEN ACCESS from IP: ' . $_SERVER['REMOTE_ADDR']);
    header('HTTP/1.1 403 Forbidden');
    // JSON cevabı standart BTK formatına uygun olmalı
    die(json_encode(['sonuc' => ['kodu' => -1, 'mesaji' => 'Erisim Engellendi.']]));
}

// --- WHMCS ORTAMINI BAŞLATMA ---
// Bu dosya, WHMCS'in kök dizininde olmalıdır.
// Bu yol, sunucu yapılandırmasına göre dikkatlice ayarlanmalıdır.
$whmcsInitPath = realpath(__DIR__ . '/../../../../init.php');
if (!$whmcsInitPath || !file_exists($whmcsInitPath)) {
    header('HTTP/1.1 500 Internal Server Error');
    error_log('[BTK-Entegre] ESozlesme API CRITICAL: WHMCS init.php bulunamadi.');
    die(json_encode(['sonuc' => ['kodu' => -1, 'mesaji' => 'Sistem altyapi hatasi.']]));
}
require_once $whmcsInitPath;

// OPERASYON ZAMAN SENKRONİZASYONU
date_default_timezone_set('Europe/Istanbul');

// Composer autoloader'ını dahil et
require_once __DIR__ . '/../vendor/autoload.php';

use BtkReports\Manager\ESozlesmeManager;
use BtkReports\Manager\LogManager;

// Cevap başlığını her zaman JSON olarak ayarla
header('Content-Type: application/json; charset=utf-8');
$requestData = null;

try {
    // Gelen isteğin gövdesini (body) al ve JSON olarak çöz
    $requestData = json_decode(file_get_contents('php://input'), true);

    // JSON parse hatası olup olmadığını kontrol et
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new \InvalidArgumentException('Gecersiz JSON formati.');
    }

    // URL'den çağrılan metodu al (örn: /.../esozlesme.php/eKayitBasvuruOnaySorgula)
    $pathInfo = $_SERVER['PATH_INFO'] ?? '';
    $methodName = basename(trim($pathInfo, '/'));

    if (empty($methodName)) {
        throw new \InvalidArgumentException('Metot belirtilmedi.');
    }
    
    // Gelen isteği, gövdesiyle birlikte logla
    LogManager::logAction('E-Sozlesme API Isteği Alındı', 'INFO', "Metot: {$methodName}", null, ['request_body' => $requestData]);

    // İlgili yönetici sınıfını oluştur
    $manager = new ESozlesmeManager();
    $response = [];

    // Gelen metoda göre doğru fonksiyonu çağır
    switch ($methodName) {
        case 'eKayitBasvuruOnaySorgula':
            $response = $manager->handleSorgula($requestData);
            break;
        case 'eKayitBasvuruOnayKaydet':
            $response = $manager->handleKaydet($requestData);
            break;
        case 'eKayitBasvuruOnayIptal':
            $response = $manager->handleIptal($requestData);
            break;
        default:
            // Tanımlanmamış bir metot çağrılırsa hata fırlat
            throw new \InvalidArgumentException('Gecersiz metot cagrildi: ' . htmlspecialchars($methodName));
    }
    
    // Başarılı cevabı, düzgün formatlanmış JSON olarak yazdır
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (\InvalidArgumentException $e) {
    // Mantıksal veya format hataları (400 Bad Request)
    LogManager::logAction('E-Sozlesme API Hatasi (400)', 'UYARI', $e->getMessage(), null, ['request_body' => $requestData]);
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['sonuc' => ['kodu' => -1, 'mesaji' => $e->getMessage()]]);

} catch (\Exception $e) {
    // Beklenmedik sistem hataları (500 Internal Server Error)
    LogManager::logAction('E-Sozlesme API Hatasi (500)', 'KRITIK', $e->getMessage(), null, ['request_body' => $requestData, 'trace' => $e->getTraceAsString()]);
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['sonuc' => ['kodu' => -1, 'mesaji' => 'Sistemde beklenmedik bir hata olustu.']]);
}

// Script'in çalışmasını sonlandır
exit;