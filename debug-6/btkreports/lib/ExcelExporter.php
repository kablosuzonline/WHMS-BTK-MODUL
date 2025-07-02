<?php
/**
 * Excel (.xlsx) İşlemleri Sınıfı (Personel Export, POP Import)
 * PhpSpreadsheet kütüphanesini kullanır.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    6.5
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// Composer autoload dosyasını dahil et
$composerAutoloadPathExcel = __DIR__ . '/../vendor/autoload.php';
$GLOBALS['phpSpreadsheetLoadedCheck'] = false; // Global scope'ta tanımla
if (file_exists($composerAutoloadPathExcel)) {
    require_once $composerAutoloadPathExcel;
    if (class_exists('PhpOffice\PhpSpreadsheet\Spreadsheet')) {
        $GLOBALS['phpSpreadsheetLoadedCheck'] = true;
    }
}

if (!$GLOBALS['phpSpreadsheetLoadedCheck']) {
    $criticalErrorMessage = "BTK Reports Module - ExcelExporter Error: PhpSpreadsheet kütüphanesi (Composer autoload.php üzerinden) yüklenemedi veya bulunamadı: {$composerAutoloadPathExcel}. Excel işlemleri yapılamaz.";
    if (class_exists('BtkHelper')) { 
        BtkHelper::logAction('ExcelExporter Başlatma Hatası', 'CRITICAL', $criticalErrorMessage);
    } else {
        error_log($criticalErrorMessage);
    }
}

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as ReaderXlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

class ExcelExporter {

    /**
     * Personel listesini Excel (.xlsx) formatında oluşturur.
     *
     * @param array $personelData Veri dizisi. Her bir eleman ['Firma Adı'=>..., 'Adı'=>..., ...] şeklinde olmalı.
     * @param string $filename İndirilecek veya kaydedilecek dosyanın tam adı (uzantı dahil, örn: Personel_Listesi_2024_06.xlsx).
     * @param bool $outputToBrowser True ise dosyayı tarayıcıya indirmeye sunar.
     * @param string|null $savePath $outputToBrowser false ise dosyanın kaydedileceği yol (sadece dizin).
     * @return string|bool Başarılıysa dosya yolu veya true (tarayıcıya gönderildiyse), başarısızsa false.
     */
    public static function exportPersonelList($personelData, $filename = 'Personel_Listesi.xlsx', $outputToBrowser = true, $savePath = null) {
        if (!$GLOBALS['phpSpreadsheetLoadedCheck']) {
            if (class_exists('BtkHelper')) { BtkHelper::logAction('Excel Export Hatası (Personel)', 'CRITICAL', 'PhpSpreadsheet kütüphanesi yüklenemedi.'); }
            return false;
        }

        try {
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle('Personel Listesi');

            // Sütun Başlıkları (BTK'nın istediği excel formatına göre)
            $headers = [
                'Firma Adı', 'Adı', 'Soyadı', 'TC Kimlik No', 'Ünvan',
                'Çalıştığı birim', 'Mobil telefonu', 'Sabit telefonu', 'E-posta adresi'
            ];
            $columnIndex = 1; 
            foreach ($headers as $header) {
                $cellCoordinate = Coordinate::stringFromColumnIndex($columnIndex) . '1';
                $sheet->setCellValue($cellCoordinate, $header);
                $sheet->getColumnDimension(Coordinate::stringFromColumnIndex($columnIndex))->setAutoSize(true);
                $style = $sheet->getStyle($cellCoordinate);
                $style->getFont()->setBold(true);
                $style->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
                $style->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFE0E0E0'); // Açık Gri
                $columnIndex++;
            }

            // Veri Satırları
            $rowIndex = 2;
            if (is_array($personelData)) {
                foreach ($personelData as $personel) {
                    $sheet->setCellValueExplicit('A' . $rowIndex, $personel['Firma Adı'] ?? '', DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('B' . $rowIndex, $personel['Adı'] ?? '', DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('C' . $rowIndex, $personel['Soyadı'] ?? '', DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('D' . $rowIndex, $personel['TC Kimlik No'] ?? '', DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('E' . $rowIndex, $personel['Ünvan'] ?? '', DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('F' . $rowIndex, $personel['Çalıştığı birim'] ?? '', DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('G' . $rowIndex, $personel['Mobil telefonu'] ?? '', DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('H' . $rowIndex, $personel['Sabit telefonu'] ?? '', DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('I' . $rowIndex, $personel['E-posta adresi'] ?? '', DataType::TYPE_STRING);
                    $rowIndex++;
                }
            }
            
            $lastColumnLetter = Coordinate::stringFromColumnIndex(count($headers));
            $borderStyleArray = ['borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FF000000']]]];
            if ($rowIndex > 1) {
                $sheet->getStyle('A1:' . $lastColumnLetter . ($rowIndex - 1))->applyFromArray($borderStyleArray);
            } else { // Sadece başlık varsa
                 $sheet->getStyle('A1:' . $lastColumnLetter . '1')->applyFromArray($borderStyleArray);
            }

            $writer = new Xlsx($spreadsheet);
            $cleanFilename = preg_replace('/[^A-Za-z0-9_.-]/', '_', basename($filename)); // Güvenlik için dosya adını temizle

            if ($outputToBrowser) {
                ob_get_level() && ob_end_clean(); // Olası çıktı tamponlarını temizle
                header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                header('Content-Disposition: attachment;filename="' . $cleanFilename . '"');
                header('Cache-Control: max-age=0, must-revalidate');
                header('Pragma: public'); 
                $writer->save('php://output');
                if (class_exists('BtkHelper')) { BtkHelper::logAction('Personel Excel Export', 'BAŞARILI', $cleanFilename . ' tarayıcıya gönderildi.'); }
                exit; // Dosya gönderimi sonrası script'i sonlandır
            } else {
                $filePath = rtrim(($savePath ?: sys_get_temp_dir()), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $cleanFilename;
                $writer->save($filePath);
                if (class_exists('BtkHelper')) { BtkHelper::logAction('Personel Excel Export', 'BAŞARILI', $cleanFilename . ' dosyası ' . $filePath . ' yoluna kaydedildi.'); }
                return $filePath;
            }

        } catch (Exception $e) {
            if (class_exists('BtkHelper')) { BtkHelper::logAction('Excel Export Hatası (Personel)', 'HATA', 'Personel listesi Excel\'e aktarılırken hata: ' . $e->getMessage() . ' Trace: ' . substr($e->getTraceAsString(),0, 500)); }
            else { error_log("BTK Reports Excel Export Error: " . $e->getMessage()); }
            return false;
        }
    }

    /**
     * Yüklenen bir Excel dosyasından ISS POP Noktası verilerini okur.
     *
     * @param string $filePath Yüklenen Excel dosyasının yolu.
     * @return array|false Okunan veri dizisi [['pop_adi' => ..., 'yayin_yapilan_ssid' => ...], ...] veya hata durumunda false.
     */
    public static function importIssPopFromExcel($filePath) {
        if (!$GLOBALS['phpSpreadsheetLoadedCheck'] || !file_exists($filePath) || !is_readable($filePath)) {
             if (class_exists('BtkHelper')) { BtkHelper::logAction('Excel Import Hatası (POP)', 'CRITICAL', 'PhpSpreadsheet yüklenemedi veya dosya okunamıyor: ' . $filePath); }
            return false;
        }

        try {
            $reader = new ReaderXlsx();
            $reader->setReadDataOnly(true);
            $spreadsheet = $reader->load($filePath);
            $sheet = $spreadsheet->getActiveSheet(); // İlk çalışma sayfasını al
            $highestRow = $sheet->getHighestDataRow();
            
            if ($highestRow < 2) { // En az başlık ve bir veri satırı olmalı
                if (class_exists('BtkHelper')) { BtkHelper::logAction('Excel Import Hatası (POP)', 'HATA', 'Excel dosyası boş veya sadece başlık içeriyor: ' . $filePath); }
                return []; // Boş veri için boş array dön, false değil
            }

            $headerData = $sheet->rangeToArray('A1:' . $sheet->getHighestDataColumn(1) . '1', NULL, TRUE, FALSE, TRUE);
            if (empty($headerData[1])) {
                if (class_exists('BtkHelper')) { BtkHelper::logAction('Excel Import Hatası (POP)', 'HATA', 'Excel dosyasında başlık satırı bulunamadı.'); }
                return false;
            }
            
            $rawHeaders = $headerData[1]; 
            $normalizedHeadersMap = []; 
            foreach ($rawHeaders as $colLetter => $originalHeader) {
                if (!empty(trim((string)$originalHeader))) {
                    $normalizedHeadersMap[self::normalizeExcelHeader(trim((string)$originalHeader))] = $colLetter;
                }
            }
            
            // Veritabanı alanları -> Normalize Edilmiş Excel Başlığı (eşleşmesi beklenen)
            $dbFieldToNormalizedHeader = [
                'pop_adi' => 'pop_adi_lokasyon_adi',
                'yayin_yapilan_ssid' => 'yayin_yapilan_ssid',
                'ip_adresi' => 'ip_adresi',
                'cihaz_turu' => 'cihaz_turu',
                'cihaz_markasi' => 'markasi',
                'cihaz_modeli' => 'modeli',
                'pop_tipi' => 'turu',
                'il_adi_excel' => 'il', 
                'ilce_adi_excel' => 'ilce', 
                'mahalle_adi_excel' => 'mahalle',
                'tam_adres_detay' => 'tam_adres',
                'koordinatlar' => 'koordinatlar',
                'aktif_pasif_durum_excel_str' => 'aktif_pasif'
            ];

            $dataRows = [];
            for ($row = 2; $row <= $highestRow; $row++) {
                $rowData = [];
                $isEmptyRow = true;

                foreach ($dbFieldToNormalizedHeader as $dbField => $targetNormalizedHeader) {
                    $colLetter = $normalizedHeadersMap[$targetNormalizedHeader] ?? null;
                    $cellValue = null;
                    if ($colLetter) {
                         try { $cellValue = trim((string)$sheet->getCell($colLetter . $row)->getValue()); } catch (\PhpOffice\PhpSpreadsheet\Exception $cellException) { $cellValue = '';}
                    }
                    $rowData[$dbField] = $cellValue;
                    if (!empty($cellValue)) $isEmptyRow = false;
                }

                if (!$isEmptyRow) {
                    if (isset($rowData['aktif_pasif_durum_excel_str'])) {
                        $val = mb_strtolower(trim($rowData['aktif_pasif_durum_excel_str']), 'UTF-8');
                        $rowData['aktif_pasif_durum'] = ($val === 'aktif' || $val === 'evet' || $val === '1' || $val === 'true');
                    } else {
                        $rowData['aktif_pasif_durum'] = true; 
                    }
                    if (isset($rowData['koordinatlar']) && strpos($rowData['koordinatlar'], ',') !== false) {
                        list($enlem, $boylam) = array_map('trim', explode(',', $rowData['koordinatlar']));
                        $rowData['enlem'] = $enlem;
                        $rowData['boylam'] = $boylam;
                    }
                    unset($rowData['aktif_pasif_durum_excel_str']);
                    $dataRows[] = $rowData;
                }
            }
            if (class_exists('BtkHelper')) { BtkHelper::logAction('ISS POP Excel Import', 'BAŞARILI', $filePath . ' dosyasından ' . count($dataRows) . ' potansiyel satır okundu.'); }
            return $dataRows;

        } catch (Exception $e) {
            if (class_exists('BtkHelper')) { BtkHelper::logAction('Excel Import Hatası (POP)', 'HATA', 'ISS POP noktaları Excel\'den okunurken hata: ' . $e->getMessage() . ' Trace: '. substr($e->getTraceAsString(),0,500)); }
            else { error_log("BTK Reports Excel Import Error: " . $e->getMessage()); }
            return false;
        }
    }

    /**
     * Genel bir Excel dışa aktarma fonksiyonu.
     * @param array $dataToExport İki boyutlu dizi. İlk eleman başlıkları, diğerleri veri satırlarını içermeli.
     * @param string $filename İndirilecek dosyanın adı.
     * @param string $sheetTitle Sayfa başlığı.
     * @param bool $outputToBrowser Tarayıcıya mı gönderilecek?
     * @param string|null $savePath Kaydedilecekse yol.
     * @return string|bool
     */
    public static function exportGenericList($dataToExport, $filename = 'export.xlsx', $sheetTitle = 'Veri Listesi', $outputToBrowser = true, $savePath = null) {
        if (!$GLOBALS['phpSpreadsheetLoadedCheck']) { if (class_exists('BtkHelper')) { BtkHelper::logAction('Excel Generic Export Hatası', 'CRITICAL', 'PhpSpreadsheet kütüphanesi yüklenemedi.'); } return false; }
        if (empty($dataToExport) || !is_array($dataToExport) || count($dataToExport) < 1) {
            if (class_exists('BtkHelper')) { BtkHelper::logAction('Excel Generic Export Hatası', 'UYARI', 'Dışa aktarılacak veri bulunamadı.'); }
            return false;
        }
        
        try {
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle($sheetTitle);

            $headers = array_keys(reset($dataToExport)); // İlk satırın anahtarlarını başlık olarak al
            $columnIndex = 1;
            foreach ($headers as $header) {
                $cellCoordinate = Coordinate::stringFromColumnIndex($columnIndex) . '1';
                $sheet->setCellValue($cellCoordinate, $header);
                $sheet->getColumnDimension(Coordinate::stringFromColumnIndex($columnIndex))->setAutoSize(true);
                $style = $sheet->getStyle($cellCoordinate);
                $style->getFont()->setBold(true);
                $style->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $style->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFE0E0E0');
                $columnIndex++;
            }

            $rowIndex = 2;
            foreach ($dataToExport as $row) {
                $columnIndex = 1;
                foreach ($headers as $headerKey) { // Başlıklardaki sıraya göre veri yaz
                    $sheet->setCellValueExplicit(Coordinate::stringFromColumnIndex($columnIndex) . $rowIndex, $row[$headerKey] ?? '', DataType::TYPE_STRING);
                    $columnIndex++;
                }
                $rowIndex++;
            }
            
            $lastColumnLetter = Coordinate::stringFromColumnIndex(count($headers));
            $borderStyleArray = ['borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FF000000']]]];
            $sheet->getStyle('A1:' . $lastColumnLetter . ($rowIndex - 1))->applyFromArray($borderStyleArray);

            $writer = new Xlsx($spreadsheet);
            $cleanFilename = preg_replace('/[^A-Za-z0-9_.-]/', '_', basename($filename));

            if ($outputToBrowser) {
                ob_get_level() && ob_end_clean();
                header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                header('Content-Disposition: attachment;filename="' . $cleanFilename . '"');
                header('Cache-Control: max-age=0, must-revalidate'); header('Pragma: public');
                $writer->save('php://output');
                exit;
            } else {
                $filePath = rtrim(($savePath ?: sys_get_temp_dir()), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $cleanFilename;
                $writer->save($filePath);
                return $filePath;
            }
        } catch (Exception $e) { if (class_exists('BtkHelper')) { BtkHelper::logAction('Excel Generic Export Hatası', 'HATA', $e->getMessage()); } return false; }
    }


    /**
     * Excel başlıklarını daha standart bir formata (anahtar olarak kullanılabilir) dönüştürür.
     */
    private static function normalizeExcelHeader($header) {
        if (empty($header)) return '';
        $header = trim(mb_strtolower((string)$header, 'UTF-8'));
        $search = ['ı', 'ğ', 'ü', 'ş', 'ö', 'ç', ' ', '/', '-', '(', ')', '.', "\n", "\r", '[', ']', '̇'];
        $replace = ['i', 'g', 'u', 's', 'o', 'c', '_', '_', '_', '', '', '', '', '', '', '', 'i'];
        $header = str_replace($search, $replace, $header);
        $header = preg_replace('/[^a-z0-9_]/', '', $header);
        $header = preg_replace('/_+/', '_', $header);
        $header = trim($header, '_');
        return $header; 
    }
}
?>