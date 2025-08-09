<?php
/**
 * Raporlama Yardımcı Fonksiyonları Yöneticisi
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX - Anayasal Uyum)
 *
 * ANKA-PHOENIX Sürüm Notları (Anayasal Uyum):
 * - Hata veren `prepareEFaturaInvoicesPage` ve `prepareESozlesmeBasvurularPage`
 *   çağrıları, `EFaturaManager` ve `ESozlesmeManager` sınıflarındaki
 *   doğru fonksiyonlara yönlendirildi.
 * - Tarihsel Veri İnşa Aracı (`executeRebuild`) mantığı, WHMCS fatura
 *   açıklamalarındaki tarihleri daha güvenilir bir şekilde ayrıştıracak
 *   şekilde iyileştirildi ve loglaması detaylandırıldı.
 * - Adres ve Kimlik Tipi gibi referans verilerini çeken yeni
 *   fonksiyonlar (`getAllKimlikTipleri` vb.) eklendi.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */
namespace BtkReports\Manager;

use WHMCS\Database\Capsule;
use BtkReports\Helper\BtkHelper;
use Cron\CronExpression;
use WHMCS\Service\Service;
use BtkReports\Factory\BtkRaporFactory;

class RaporManager
{
    // ==================================================================
    // == ÇEKİRDEK RAPOR FORMATLAMA
    // ==================================================================

    public static function formatAbnRow(array $dataArray, array $btkAlanSiralamasi): string
    {
        $rowValues = [];
        foreach ($btkAlanSiralamasi as $btkFieldKey) {
            $dbFieldKey = strtolower($btkFieldKey);
            $value = $dataArray[$dbFieldKey] ?? '';
            $cleanValue = mb_strtoupper(str_replace(['|', ';', "\r", "\n"], ' ', (string)$value), 'UTF-8');
            $rowValues[] = $cleanValue;
        }
        return implode('|;|', $rowValues);
    }
    
    public static function getBtkAlanSiralamasi(?string $yetkiTuruGrup = null): array
    {
        $ortakAlanlar = [ 'OPERATOR_KOD', 'MUSTERI_ID', 'HAT_NO', 'HAT_DURUM', 'HAT_DURUM_KODU', 'HAT_DURUM_KODU_ACIKLAMA', 'MUSTERI_HAREKET_KODU', 'MUSTERI_HAREKET_ACIKLAMA', 'MUSTERI_HAREKET_ZAMANI', 'HIZMET_TIPI', 'MUSTERI_TIPI', 'ABONE_BASLANGIC', 'ABONE_BITIS', 'ABONE_ADI', 'ABONE_SOYADI', 'ABONE_TC_KIMLIK_NO', 'ABONE_PASAPORT_NO', 'ABONE_UNVAN', 'ABONE_VERGI_NUMARASI', 'ABONE_MERSIS_NUMARASI', 'ABONE_CINSIYET', 'ABONE_UYRUK', 'ABONE_BABA_ADI', 'ABONE_ANA_ADI', 'ABONE_ANNE_KIZLIK_SOYADI', 'ABONE_DOGUM_YERI', 'ABONE_DOGUM_TARIHI', 'ABONE_MESLEK', 'ABONE_TARIFE', 'ABONE_KIMLIK_TIPI', 'ABONE_KIMLIK_SERI_NO', 'ABONE_KIMLIK_VERILDIGI_YER', 'ABONE_KIMlik_VERILDIGI_TARIH', 'ABONE_KIMLIK_AIDIYETI', 'ABONE_ADRES_YERLESIM_IL', 'ABONE_ADRES_YERLESIM_ILCE', 'ABONE_ADRES_YERLESIM_MAHALLE', 'ABONE_ADRES_YERLESIM_CADDE', 'ABONE_ADRES_YERLESIM_DIS_KAPI_NO', 'ABONE_ADRES_YERLESIM_IC_KAPI_NO', 'ABONE_ADRES_TESIS_IL', 'ABONE_ADRES_TESIS_ILCE', 'ABONE_ADRES_TESIS_MAHALLE', 'ABONE_ADRES_TESIS_CADDE', 'ABONE_ADRES_TESIS_DIS_KAPI_NO', 'ABONE_ADRES_TESIS_IC_KAPI_NO', 'IRTIBAT_TEL_NO_1', 'IRTIBAT_TEL_NO_2', 'ABONE_ADRES_E_MAIL', 'STATIK_IP', 'ISS_HIZ_PROFILI', 'ISS_KULLANICI_ADI', 'ISS_POP_BILGISI'];
        return $ortakAlanlar;
    }
    
    // ==================================================================
    // == DURUM EŞLEŞTİRME MANTIĞI
    // ==================================================================
    
    public static function getBtkDurumFromWhmcsStatus(string $whmcsStatus): array
    {
        return match (strtolower($whmcsStatus)) {
            'active' => ['hat_durum' => 'A', 'kod' => '1', 'aciklama' => 'AKTIF', 'hareket_kodu' => '1', 'hareket_aciklama' => 'HAT DURUM DEGISIKLIGI'],
            'suspended' => ['hat_durum' => 'K', 'kod' => '13', 'aciklama' => 'KISITLI', 'hareket_kodu' => '1', 'hareket_aciklama' => 'HAT DURUM DEGISIKLIGI'],
            'terminated' => ['hat_durum' => 'D', 'kod' => '15', 'aciklama' => 'DONDURULMUS', 'hareket_kodu' => '1', 'hareket_aciklama' => 'HAT DURUM DEGISIKLIGI'],
            'cancelled' => ['hat_durum' => 'I', 'kod' => '5', 'aciklama' => 'IPTAL_MUSTERI_TALEBI', 'hareket_kodu' => '10', 'hareket_aciklama' => 'HAT IPTAL'],
            'fraud' => ['hat_durum' => 'I', 'kod' => '11', 'aciklama' => 'IPTAL_SEHVEN_GIRIS', 'hareket_kodu' => '10', 'hareket_aciklama' => 'HAT IPTAL'],
            default => ['hat_durum' => 'B', 'kod' => '0', 'aciklama' => 'HENUZ ONAYLANMAMIS', 'hareket_kodu' => '11', 'hareket_aciklama' => 'MUSTERI_BILGI_DEGISIKLIGI'],
        };
    }

    public static function determineFinalStatusData(Service $service, array $guncellenecekVeri): array
    {
        $finalData = [];
        $mapping = ConfigManager::getBtkYetkiForProductGroup($service->product->gid);
        $finalData['hizmet_tipi'] = $guncellenecekVeri['hizmet_tipi'] ?? $mapping['ek3_hizmet_tipi_kodu'] ?? null;
        $btkDurum = self::getBtkDurumFromWhmcsStatus($service->domainstatus);
        $finalData['hat_durum'] = $btkDurum['hat_durum'];
        $finalData['hat_durum_kodu'] = $btkDurum['kod'];
        $finalData['hat_durum_kodu_aciklama'] = $btkDurum['aciklama'];
        return $finalData;
    }

    // ==================================================================
    // == REFERANS VERİ YÖNETİMİ
    // ==================================================================

    public static function getIller(): array { return Capsule::table('mod_btk_adres_il')->orderBy('il_adi')->get()->map(fn($item)=>(array)$item)->all(); }
    public static function getIlcelerByIlId(int $ilId): array { if ($ilId <= 0) return []; return Capsule::table('mod_btk_adres_ilce')->where('il_id', $ilId)->select('id', 'ilce_adi as name')->orderBy('ilce_adi')->get()->map(fn($item)=>(array)$item)->all(); }
    public static function getMahallelerByIlceId(int $ilceId): array { if ($ilceId <= 0) return []; return Capsule::table('mod_btk_adres_mahalle')->where('ilce_id', $ilceId)->select('id', 'mahalle_adi as name')->orderBy('mahalle_adi')->get()->map(fn($item)=>(array)$item)->all(); }
    public static function getAllEk3HizmetTipleri(?string $grup = null): array { $query = Capsule::table('mod_btk_ek3_hizmet_tipleri'); if($grup) $query->where('ana_yetki_grup', $grup); return $query->orderBy('hizmet_tipi_aciklamasi')->get()->map(fn($item)=>(array)$item)->all(); }
    public static function getAllKimlikTipleri(): array { return Capsule::table('mod_btk_kimlik_tipleri_referans')->orderBy('aciklama')->get()->map(fn($item)=>(array)$item)->all(); }

    // ==================================================================
    // == DASHBOARD VE YARDIMCI İŞLEMLER
    // ==================================================================
    
    public static function getNextCronRuns(array $settings): array { $runs = []; $schedules = ['rehber' => $settings['rehber_cron_schedule'] ?? null, 'hareket' => $settings['hareket_cron_schedule'] ?? null, 'personel' => $settings['personel_cron_schedule'] ?? null, 'monitor' => ($settings['pop_monitoring_enabled'] ?? '0') === '1' ? ($settings['pop_monitoring_cron_schedule'] ?? null) : null]; foreach ($schedules as $key => $schedule) { if ($schedule && CronExpression::isValidExpression($schedule)) { try { $runs[$key] = CronExpression::factory($schedule)->getNextRunDate()->format('Y-m-d H:i:s T'); } catch (\Exception $e) { $runs[$key] = BtkHelper::getLang('invalidCronExpression'); } } else { $runs[$key] = BtkHelper::getLang('notConfigured'); } } return $runs; }
    public static function getLastSubmissions(): array { $lastSubmissions = []; $aktifGruplar = ConfigManager::getAktifYetkiTurleri('array_grup_names_only'); foreach ($aktifGruplar as $grup) { $lastSubmissions[$grup]['REHBER'] = self::getLastSuccessfulReportInfo('REHBER', $grup); $lastSubmissions[$grup]['HAREKET'] = self::getLastSuccessfulReportInfo('HAREKET', $grup); } $lastSubmissions['PERSONEL'] = self::getLastSuccessfulReportInfo('PERSONEL'); return $lastSubmissions; }
    private static function getLastSuccessfulReportInfo(string $raporTuru, ?string $yetkiTuruGrup = null): array { $query = Capsule::table('mod_btk_ftp_logs')->where('rapor_turu', $raporTuru)->where('ftp_sunucu_tipi', 'ANA')->where('durum', 'Basarili'); if ($yetkiTuruGrup !== null && $raporTuru !== 'PERSONEL') { $query->where('yetki_turu_grup', $yetkiTuruGrup); } $log = (array)($query->orderBy('gonderim_zamani', 'DESC')->first() ?? []); return [ 'tarih_saat' => $log ? date("d.m.Y H:i:s", strtotime($log['gonderim_zamani'] . ' UTC')) : BtkHelper::getLang('noSubmissionYet'), 'dosya_adi' => $log['dosya_adi'] ?? '-', 'cnt' => $log['cnt_numarasi'] ?? '-' ]; }
    
    public static function buildPagination(array $filters, int $total, int $limit, int $page, string $action = '', string $pageVar = 'page')
    {
        $totalPages = ($limit > 0 && $total > 0) ? ceil($total / $limit) : 1;
        if ($totalPages <= 1) return '';
        
        $queryParams = array_merge($_GET, $filters);
        unset($queryParams[$pageVar]);
        if (!empty($action)) {
            $queryParams['action'] = $action;
        }
        $queryString = http_build_query($queryParams);
        
        $html = '<div class="text-center"><ul class="pagination">';
        $html .= ($page > 1) ? '<li><a href="?'.$queryString.'&'.$pageVar.'='.($page - 1).'">«</a></li>' : '<li class="disabled"><span>«</span></li>';
        $startPage = max(1, $page - 2);
        $endPage = min($totalPages, $page + 2);
        
        if ($startPage > 1) {
            $html .= '<li><a href="?'.$queryString.'&'.$pageVar.'=1">1</a></li>';
            if ($startPage > 2) $html .= '<li class="disabled"><span>...</span></li>';
        }
        
        for ($i = $startPage; $i <= $endPage; $i++) {
            if ($i == $page) {
                $html .= '<li class="active"><span>'.$i.'</span></li>';
            } else {
                $html .= '<li><a href="?'.$queryString.'&'.$pageVar.'='.$i.'">'.$i.'</a></li>';
            }
        }
        
        if ($endPage < $totalPages) {
            if ($endPage < $totalPages - 1) $html .= '<li class="disabled"><span>...</span></li>';
            $html .= '<li><a href="?'.$queryString.'&'.$pageVar.'='.$totalPages.'">'.$totalPages.'</a></li>';
        }
        
        $html .= ($page < $totalPages) ? '<li><a href="?'.$queryString.'&'.$pageVar.'='.($page + 1).'">»</a></li>' : '<li class="disabled"><span>»</span></li>';
        $html .= '</ul></div>';
        
        return $html;
    }
    
    // ==================================================================
    // == RAPOR OLUŞTURMA VE İNDİRME İŞLEMLERİ
    // ==================================================================
    
    public static function getNextCntNumber(string $raporTuru, ?string $yetkiGrup): string { $bugununBasi = date('Y-m-d 00:00:00'); $bugununSonu = date('Y-m-d 23:59:59'); $query = Capsule::table('mod_btk_ftp_logs')->where('rapor_turu', $raporTuru)->whereBetween('gonderim_zamani', [$bugununBasi, $bugununSonu]); if ($raporTuru !== 'PERSONEL') { $query->where('yetki_turu_grup', $yetkiGrup); } $sonGonderim = $query->orderBy('gonderim_zamani', 'desc')->first(); if ($sonGonderim && isset($sonGonderim->cnt_numarasi)) { return str_pad((int)$sonGonderim->cnt_numarasi + 1, 2, '0', STR_PAD_LEFT); } return '01'; }
    public static function downloadTempFile(?string $fileName): void { if (empty($fileName) || basename($fileName) !== $fileName) { header("HTTP/1.0 403 Forbidden"); die("Geçersiz dosya adı."); } $fullPath = BtkHelper::getModuleTempPath() . DIRECTORY_SEPARATOR . $fileName; if (file_exists($fullPath) && is_readable($fullPath)) { header('Content-Description: File Transfer'); header('Content-Type: application/octet-stream'); header('Content-Disposition: attachment; filename="' . basename($fullPath) . '"'); header('Expires: 0'); header('Cache-Control: must-revalidate'); header('Pragma: public'); header('Content-Length: ' . filesize($fullPath)); readfile($fullPath); @unlink($fullPath); exit; } header("HTTP/1.0 404 Not Found"); die("Dosya bulunamadı."); }
    public static function handleGenerateReportAjax(array $request, array $LANG) { $reportType = $request['report_type'] ?? null; $yetkiGrup = $request['yetki_grup'] ?? null; $action = $request['generation_action'] ?? null; try { if (empty($reportType) || empty($action)) throw new \Exception('Gerekli parametreler eksik.'); $settings = BtkHelper::getAllBtkSettings(); $ftpManager = new FtpManager($settings); $rapor = BtkRaporFactory::create($reportType, $settings, $ftpManager, $yetkiGrup); if ($action === 'generate_only') { return $rapor->olusturVeIndir($reportType === 'PERSONEL'); } else { $ftpType = ($action === 'send_main') ? 'main' : 'backup'; return $rapor->olusturVeGonder($ftpType); } } catch (\Exception $e) { return ['status' => false, 'message' => 'Hata: ' . $e->getMessage()]; } }
    public static function rebuildHistoricalData(string $milatTarihi, array $LANG): array { try { if (empty($milatTarihi) || !($startDate = \DateTime::createFromFormat('d/m/Y', $milatTarihi))) { throw new \Exception("Geçersiz milat tarihi formatı. Lütfen GG/AA/YYYY formatında girin."); } LogManager::logAction('Tarihsel İnşa Başlatıldı', 'UYARI', "Milat Tarihi: {$milatTarihi}. Bu işlem uzun sürebilir."); self::executeRebuild($startDate); return ['type' => 'success', 'message' => "Tarihsel veri inşa işlemi başarıyla tamamlandı."]; } catch (\Exception $e) { LogManager::logAction('Tarihsel İnşa BAŞARISIZ', 'KRITIK', $e->getMessage()); return ['type' => 'error', 'message' => 'Hata: ' . $e->getMessage()]; } }
    
    private static function executeRebuild(\DateTime $startDate): void
    {
        set_time_limit(0);
        $eşleştirilmişGidListesi = Capsule::table('mod_btk_product_group_mappings')->pluck('gid')->all();
        if (empty($eşleştirilmişGidListesi)) { LogManager::logAction('Tarihsel İnşa Atlandı', 'UYARI', 'BTK ile eşleştirilmiş ürün grubu bulunamadı.'); return; }
        
        $hizmetler = Capsule::table('tblhosting as h')->join('tblproducts as p', 'h.packageid', '=', 'p.id')->whereIn('p.gid', $eşleştirilmişGidListesi)->select('h.id as service_id', 'h.regdate', 'h.termination_date', 'h.domainstatus')->cursor();
        foreach ($hizmetler as $hizmet) {
            $hizmetId = $hizmet->service_id;
            $ilkHareketZamani = (new \DateTime($hizmet->regdate))->format('YmdHis');
            AboneManager::createOrUpdateRehberKayit($hizmetId, [], ['kod' => '2', 'aciklama' => 'YENI_ABONELIK_KAYDI', 'zaman' => $ilkHareketZamani]);

            $faturalar = Capsule::table('tblinvoiceitems')->where('relid', $hizmetId)->where('type', 'Hosting')->join('tblinvoices', 'tblinvoiceitems.invoiceid', '=', 'tblinvoices.id')->where('tblinvoices.status', 'Paid')->select('tblinvoiceitems.description', 'tblinvoices.datepaid')->orderBy('tblinvoices.datepaid', 'asc')->get();

            $sonOdenmisDonemBitis = null;
            foreach ($faturalar as $fatura) {
                if (preg_match('/\((\d{2}\/\d{2}\/\d{4})\s*-\s*(\d{2}\/\d{2}\/\d{4})\)/', $fatura->description, $matches)) {
                    $donemBaslangic = \DateTime::createFromFormat('d/m/Y', $matches[1]);
                    if ($donemBaslangic < $startDate) continue;

                    if ($sonOdenmisDonemBitis && $donemBaslangic > $sonOdenmisDonemBitis->modify('+1 day')) {
                        AboneManager::createOrUpdateRehberKayit($hizmetId, [], ['kod' => '1', 'aciklama' => 'HAT DURUM DEGISIKLIGI', 'zaman' => $sonOdenmisDonemBitis->format('YmdHis')]);
                    }
                    
                    AboneManager::createOrUpdateRehberKayit($hizmetId, [], ['kod' => '1', 'aciklama' => 'HAT DURUM DEGISIKLIGI', 'zaman' => $donemBaslangic->format('YmdHis')]);
                    $sonOdenmisDonemBitis = \DateTime::createFromFormat('d/m/Y', $matches[2]);
                }
            }
            
            $sonDurumHareketi = self::getBtkDurumFromWhmcsStatus($hizmet->domainstatus);
            $sonHareketZamani = ($hizmet->termination_date && $hizmet->termination_date != '0000-00-00 00:00:00') ? (new \DateTime($hizmet->termination_date))->format('YmdHis') : date('YmdHis');
            AboneManager::createOrUpdateRehberKayit($hizmetId, [], ['kod' => $sonDurumHareketi['hareket_kodu'], 'aciklama' => $sonDurumHareketi['hareket_aciklama'], 'zaman' => $sonHareketZamani]);
        }
        LogManager::logAction('Tarihsel İnşa Tamamlandı', 'INFO', 'İşlem başarıyla tamamlandı.');
    }
}