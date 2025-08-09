<?php
/**
 * WHMCS BTK Raporlama Modülü - Merkezi Konfigürasyon Dosyası
 * Sürüm: 21.0.0 (Operasyon ZÜMRÜT-Ü ANKA)
 *
 * BU DOSYA, PROJENİN ANAYASASIDIR.
 *
 * Amaç: Tüm sabit dosya yollarını, API endpoint'lerini ve modül genelinde
 * kullanılacak temel parametreleri tek bir merkezde toplamak. Bu, bakım
 * kolaylığı sağlar ve "yol bulunamadı" gibi hataları engeller. Diğer
 * sınıflar, buradaki sabitleri kullanarak çalışacaktır.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    21.0.0
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// ==================================================================
// == BÖLÜM 1: DOSYA VE KLASÖR YOLLARI
// ==================================================================

/**
 * BTK'nın sağladığı CEVHER Excel şablon dosyalarının bulunduğu klasörün tam yolu.
 * ExcelExporter sınıfı, rapor oluşturmak için bu yoldaki şablonları okuyacaktır.
 */
define('BTK_CEVHER_SABLON_YOLU', __DIR__ . '/templates/admin/cevher_sablonlari/');


// ==================================================================
// == BÖLÜM 2: HARİCİ API ENDPOINT'LERİ
// ==================================================================

// --- NVI KPS (Kimlik Paylaşım Sistemi) ---
define('NVI_STS_TEST_URL', 'https://kpsbasvuru.nvi.gov.tr/Services/SecurityTokenService.svc');
define('NVI_STS_LIVE_URL', 'https://kps.nvi.gov.tr/Services/SecurityTokenService.svc');
define('NVI_KPS_V2_TEST_URL', "https://kpsbasvuru.nvi.gov.tr/Services/Tubitak/T%C3%BCmK%C3%BCt%C3%BCkSorgula.svc");
define('NVI_KPS_V2_LIVE_URL', "https://kps.nvi.gov.tr/Services/Tubitak/T%C3%BCmK%C3%BCt%C3%BCkSorgula.svc");

// --- GİB (Gelir İdaresi Başkanlığı) ---
define('GIB_MUKELLEF_SORGULAMA_URL', "https://earsivportal.efatura.gov.tr/earsiv-services/esign");

// --- BİMSA eDoksis ---
define('EDOKSIS_EFATURA_TEST_URL', "https://efaturatest.edoksis.net/EFaturaEDM/EFaturaEDM.svc?wsdl");
define('EDOKSIS_EFATURA_LIVE_URL', "https://efatura.edoksis.net/EFaturaEDM/EFaturaEDM.svc?wsdl");
define('EDOKSIS_EARSIV_TEST_URL', "https://earsivtest.edoksis.net/EArsiv/EArsiv.svc?wsdl");
define('EDOKSIS_EARSIV_LIVE_URL', "https://earsiv.edoksis.net/EArsiv/EArsiv.svc?wsdl");


// ==================================================================
// == BÖLÜM 3: BTK E-KAYIT SABİTLERİ
// ==================================================================

/**
 * BTK E-Kayıt (E-Sözleşme) dökümanlarında belirtilen sabit işletmeci tipi kodu.
 */
define('BTK_EKAYIT_ISLETMECI_TIPI_KODU', 0);