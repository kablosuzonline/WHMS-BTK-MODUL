<?php
// ajax.php - GEÇİCİ TEST SÜRÜMÜ

// WHMCS'i başlatmayı denemeden önce basit bir yanıt verelim
require_once __DIR__ . '/../../../../init.php';

// Güvenlik: Sadece giriş yapmış adminlerin erişebilmesini sağla
if (!isset($_SESSION['adminid'])) {
    http_response_code(403);
    die(json_encode(['status' => 'error', 'message' => 'Access Denied.']));
}

header('Content-Type: application/json; charset=utf-8');

// Hiçbir işlem yapmadan doğrudan başarılı bir yanıt döndür
echo json_encode([
    'status' => 'success',
    'message' => 'AJAX handler dosyası (ajax.php) başarıyla çalıştı ve yanıt döndü!',
    'action_received' => $_REQUEST['btk_ajax_action'] ?? 'Action Alınamadı'
]);

exit();