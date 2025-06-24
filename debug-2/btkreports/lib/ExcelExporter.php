<?php
/**
 * Excel (.xlsx) İşlemleri Sınıfı (Personel Export, POP Import)
 * PhpSpreadsheet kütüphanesini kullanır.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     [Üstadım & Sizin Adınız/Şirketiniz Gelecek]
 * @version    6.0.0
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// Composer autoload dosyasını dahil et
// Bu dosyanın varlığı ve PhpSpreadsheet sınıfının varlığı $GLOBALS['phpSpreadsheetLoaded'] ile kontrol edilecek.
// Bu global değişken, btkreports.php veya BtkHelper.php gibi ana bir dosyada set edilmelidir.
// if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
//     require_once __DIR__ . '/../vendor/autoload.php';
// }

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as ReaderXlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
// use PhpOffice\PhpSpreadsheet\Shared\Date as PhpSpreadsheetDate; // Tarih formatlaması için gerekirse

class ExcelExporter {

    /**
     * Personel listesini Excel (.xlsx) formatında oluşturur.
     *
     * @param array $personelData Veri dizisi. Beklenen anahtarlar: Firma Adı, Adı, Soyadı, TC Kimlik No, Ünvan, Çalıştığı birim, Mobil telefonu, Sabit telefonu, E-posta adresi
     * @param string $filename İndirilecek veya kaydedilecek dosyanın tam adı (uzantı dahil, örn: Personel_Listesi_2024_06.xlsx).
     * @param bool $outputToBrowser True ise dosyayı tarayıcıya indirmeye sunar.
     * @param string|null $savePath $outputToBrowser false ise dosyanın kaydedileceği tam yol (sadece dizin).
     * @return string|bool Başarılıysa dosya yolu (eğer kaydedildiyse) veya true (tarayıcıya gönderildiyse), başarısızsa false.
     */
    public static function exportPersonelList($personelData, $filename = 'Personel_Listesi.xlsx', $outputToBrowser = true, $savePath = null) {
        // $GLOBALS['phpSpreadsheetLoaded'] global değişkeni btkreports.php içinde set edilmeli.
        if (!isset($GLOBALS['phpSpreadsheetLoaded']) || !$GLOBALS['phpSpreadsheetLoaded']) {
            if (class_exists('BtkHelper')) { BtkHelper::logAction('Excel Export Hatası', 'CRITICAL', 'PhpSpreadsheet kütüphanesi yüklenemedi (ExcelExporter).'); }
            else { error_log("BTK Reports ExcelExporter Error: PhpSpreadsheet library not loaded."); }
            return false;
        }

        try {
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle('Personel Listesi');

            $headers = [
                'Firma Adı', 'Adı', 'Soyadı', 'TC Kimlik No', 'Ünvan',
                'Çalıştığı birim', 'Mobil telefonu', 'Sabit telefonu', 'E-posta adresi'
            ];
            $columnIndex = 1; // 1-tabanlı sütun indeksi (A=1, B=2 ...)
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

            $rowIndex = 2;
            if (is_array($personelData)) {
                foreach ($personelData as $personel) {
                    // Veri anahtarları Excel başlıklarıyla aynı olmalı.
                    // BtkHelper::getPersonelDataForReport() bu formatta hazırlamalı.
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
            $rangeToBorder = 'A1:' . $lastColumnLetter . ($rowIndex > 1 ? ($rowIndex - 1) : 1);
            $sheet->getStyle($rangeToBorder)->applyFromArray($borderStyleArray);

            $writer = new Xlsx($spreadsheet);

            if ($outputToBrowser) {
                if (ob_get_length()) ob_clean(); // Olası çıktı tamponlarını temizle
                header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                header('Content-Disposition: attachment;filename="' . basename($filename) . '"');
                header('Cache-Control: max-age=0, must-revalidate');
                header('Pragma: public'); 
                header('Expires: 0');
                $writer->save('php://output');
                if (class_exists('BtkHelper')) { BtkHelper::logAction('Personel Excel Export', 'BAŞARILI', basename($filename) . ' tarayıcıya gönderildi.'); }
                // WHMCS context'inde exit() genellikle action fonksiyonunun sonunda olmalı.
                // Bu fonksiyon true döndürür, çağıran yer exit yapar.
                return true;
            } else {
                $fullSavePath = ($savePath ?: sys_get_temp_dir()) . DIRECTORY_SEPARATOR . basename($filename);
                $writer->save($fullSavePath);
                if (class_exists('BtkHelper')) { BtkHelper::logAction('Personel Excel Export', 'BAŞARILI', basename($filename) . ' dosyası ' . $fullSavePath . ' yoluna kaydedildi.'); }
                return $fullSavePath;
            }

        } catch (Exception $e) {
            if (class_exists('BtkHelper')) { BtkHelper::logAction('Excel Export Hatası (Personel)', 'HATA', 'Personel listesi Excel\'e aktarılırken hata: ' . $e->getMessage()); }
            else { error_log("BTK Reports Excel Export Error (Personel): " . $e->getMessage()); }
            return false;
        }
    }

    /**
     * Yüklenen bir Excel dosyasından ISS POP Noktası verilerini okur.
     * @param string $filePath Yüklenen Excel dosyasının yolu.
     * @return array|false Okunan veri dizisi [['pop_adi' => ..., 'yayin_yapilan_ssid' => ...], ...] veya hata durumunda false.
     */
    public static function importIssPopFromExcel($filePath) {
        if (!$GLOBALS['phpSpreadsheetLoaded'] || !file_exists($filePath) || !is_readable($filePath)) {
             if (class_exists('BtkHelper')) { BtkHelper::logAction('Excel Import Hatası', 'CRITICAL', 'PhpSpreadsheet yüklenemedi veya dosya okunamıyor: ' . $filePath); }
             else { error_log("BTK Reports Excel Import Error: PhpSpreadsheet not loaded or file not readable: " . $filePath); }
            return false;
        }

        try {
            $reader = new ReaderXlsx();
            $reader->setReadDataOnly(true);
            $spreadsheet = $reader->load($filePath);
            $sheet = $spreadsheet->getActiveSheet();
            $highestRow = $sheet->getHighestDataRow();
            
            if ($highestRow < 1) { 
                if (class_exists('BtkHelper')) { BtkHelper::logAction('Excel Import Hatası', 'HATA', 'Excel dosyası boş veya geçersiz başlık yapısı: ' . $filePath); }
                return false; 
            }

            $headerData = $sheet->rangeToArray('A1:' . $sheet->getHighestDataColumn() . '1', NULL, TRUE, FALSE, TRUE); // Satır 1, Sütun Harfi => Değer
            if (empty($headerData[1])) { 
                if (class_exists('BtkHelper')) { BtkHelper::logAction('Excel Import Hatası', 'HATA', 'Excel dosyasında başlık satırı bulunamadı.'); }
                return false; 
            }
            
            $rawHeaders = $headerData[1]; // ['A' => 'Başlık 1', 'B' => 'Başlık 2', ...]
            $normalizedHeaderToColLetter = []; // ['normalize_edilmis_baslik' => 'A', ...]
            foreach ($rawHeaders as $colLetter => $originalHeader) {
                if (!empty(trim((string)$originalHeader))) {
                    // Aynı normalize edilmiş başlık birden fazla sütunda varsa, ilkini alır.
                    // Bu durum veri kaybına neden olabilir, Excel şablonu benzersiz başlıklar içermelidir.
                    $normalized = self::normalizeExcelHeader(trim((string)$originalHeader));
                    if (!isset($normalizedHeaderToColLetter[$normalized])) {
                         $normalizedHeaderToColLetter[$normalized] = $colLetter;
                    }
                }
            }
            
            $dbFieldToNormalizedHeader = [ // Kod içinde kullanılacak anahtar => Excel'deki normalize edilmiş başlık
                'pop_adi' => 'pop_adi__lokasyon_adi',
                'yayin_yapilan_ssid' => 'yayin_yapilan_ssi_d',
                'ip_adresi' => 'i_p_adresi_',
                'cihaz_turu' => 'cihaz_turu',
                'cihaz_markasi' => 'markasi',
                'cihaz_modeli' => 'modeli_',
                'pop_tipi' => 'turu',
                'il_adi_excel' => 'i_l',
                'ilce_adi_excel' => 'i_lce',
                'mahalle_adi_excel' => 'mahalle',
                'tam_adres' => 'tam_adres',
                'koordinatlar' => 'koordi_natlar',
                'aktif_pasif_durum_excel_str' => 'akti_f_pasi_f'
            ];

            $dataRows = [];
            for ($row = 2; $row <= $highestRow; $row++) { // Başlık satırını atla (1. satır)
                $rowData = []; 
                $isEmptyRow = true;
                foreach ($dbFieldToNormalizedHeader as $dbField => $targetNormalizedHeader) {
                    $colLetter = $normalizedHeaderToColLetter[$targetNormalizedHeader] ?? null;
                    $cellValue = null;
                    if ($colLetter) { 
                        // getCell()->getValue() yerine getCell()->getCalculatedValue() veya getFormattedValue()
                        // daha güvenilir olabilir, özellikle hücrelerde formül veya özel format varsa.
                        // Şimdilik getValue() ile devam edelim.
                        $cellValue = trim((string)$sheet->getCell($colLetter . $row)->getValue()); 
                    }
                    $rowData[$dbField] = $cellValue;
                    if (!is_null($cellValue) && $cellValue !== '') $isEmptyRow = false;
                }

                if (!$isEmptyRow) {
                    if (isset($rowData['aktif_pasif_durum_excel_str'])) {
                        $val = mb_strtolower(trim($rowData['aktif_pasif_durum_excel_str']), 'UTF-8');
                        $rowData['aktif_pasif_durum'] = ($val === 'aktif' || $val === 'evet' || $val === '1' || $val === 'true');
                    } else { 
                        $rowData['aktif_pasif_durum'] = true; // Eğer sütun yoksa veya boşsa varsayılan aktif
                    }
                    unset($rowData['aktif_pasif_durum_excel_str']);
                    $dataRows[] = $rowData;
                }
            }
            if (class_exists('BtkHelper')) { BtkHelper::logAction('ISS POP Excel Import', 'BAŞARILI', $filePath . ' dosyasından ' . count($dataRows) . ' satır okundu.'); }
            return $dataRows;

        } catch (\PhpOffice\PhpSpreadsheet\Exception $spe) { // PhpSpreadsheet özel exception'ları yakala
             if (class_exists('BtkHelper')) { BtkHelper::logAction('Excel Import Hatası (PhpSpreadsheet)', 'HATA', 'PhpSpreadsheet hatası: ' . $spe->getMessage()); }
            else { error_log("BTK Reports Excel Import PhpSpreadsheet Error: " . $spe->getMessage()); }
            return false;
        } catch (Exception $e) {
            if (class_exists('BtkHelper')) { BtkHelper::logAction('Excel Import Genel Hatası (ISS POP)', 'HATA', 'ISS POP Excel okunurken genel hata: ' . $e->getMessage()); }
            else { error_log("BTK Reports Excel Import General Error (ISS POP): " . $e->getMessage()); }
            return false;
        }
    }

    /**
     * Excel başlıklarını daha standart bir formata (anahtar olarak kullanılabilir) dönüştürür.
     */
    private static function normalizeExcelHeader($header) {
        if (empty($header)) return '';
        $header = trim(mb_strtolower((string)$header, 'UTF-8'));
        // Türkçe karakterler ve özel karakterleri temizleme/dönüştürme
        $search = ['ı', 'ğ', 'ü', 'ş', 'ö', 'ç', ' ', '/', '-', '(', ')', '.', "\n", "\r", '[', ']'];
        $replace = ['i', 'g', 'u', 's', 'o', 'c', '_', '_', '_', '', '', '', '', '', '', ''];
        $header = str_replace($search, $replace, $header);
        $header = preg_replace('/[^a-z0-9_]/', '', $header); // Sadece alfanumerik ve alt çizgi
        $header = preg_replace('/_+/', '_', $header); // Birden fazla alt çizgiyi tek yap
        $header = trim($header, '_'); // Baştaki/sondaki alt çizgileri temizle

        // Sizin iss_pop_nokta_listesi.xlsx dosyanızdaki başlıklarla eşleşecek özel dönüşümler
        // Bu map, Excel'deki olası başlık varyasyonlarını hedef anahtara eşler.
        $map = [
            'pop_adi_lokasyon_adi' => 'pop_adi__lokasyon_adi', // Excel: "POP Adı / Lokasyon Adı" -> Hedef: "pop_adi__lokasyon_adi"
            'yayin_yapilan_ssid' => 'yayin_yapilan_ssi_d',   // Excel: "YAYIN YAPILAN SSID" (I harfi) -> Hedef: "yayin_yapilan_ssi_d"
            'ip_adresi' => 'i_p_adresi_',                     // Excel: "IP ADRESİ"
            'turu' => 'turu',                                 // Excel: "TÜRÜ"
            'markasi' => 'markasi',
            'modeli' => 'modeli_',
            'il' => 'i_l',
            'ilce' => 'i_lce',
            'mahalle_koy' => 'mahalle', // Excel'de "MAHALLE/KÖY" ise
            'mahalle' => 'mahalle',     // Excel'de sadece "MAHALLE" ise
            'tam_adresi' => 'tam_adres',
            'tam_adres' => 'tam_adres',
            'aktifpasif' => 'akti_f_pasi_f',
            'aktif_pasif' => 'akti_f_pasi_f',
            'koordinatlar_enlem_boylam' => 'koordi_natlar',
            'koordinatlar' => 'koordi_natlar'
            // Buraya Excel dosyanızdaki diğer başlıklar için de eşleştirmeler ekleyebilirsiniz.
        ];
        // Daha esnek eşleştirme için:
        foreach ($map as $cleanKey => $excelVariation) {
            // Hem tam normalize edilmiş haliyle hem de haritadaki varyasyonla karşılaştır
            if ($header === $excelVariation || $header === $cleanKey) {
                 return $excelVariation; // Haritadaki standardize edilmiş varyasyonu (anahtar olarak kullanacağımız) döndür
            }
        }
        return $header; // Eşleşme yoksa genel normalize edilmiş halini döndür
    }
}
?>