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
$composerAutoloadPath = __DIR__ . '/../vendor/autoload.php';
$phpSpreadsheetLoaded = false;
if (file_exists($composerAutoloadPath)) {
    require_once $composerAutoloadPath;
    if (class_exists('PhpOffice\PhpSpreadsheet\Spreadsheet')) {
        $phpSpreadsheetLoaded = true;
    }
}

if (!$phpSpreadsheetLoaded) {
    $criticalErrorMessage = "BTK Reports Module - ExcelExporter Error: PhpSpreadsheet kütüphanesi (Composer autoload.php üzerinden) yüklenemedi veya bulunamadı: {$composerAutoloadPath}. Excel işlemleri yapılamaz.";
    if (class_exists('BtkHelper')) { // BtkHelper'ın global olarak yüklendiğini varsayıyoruz
        BtkHelper::logAction('ExcelExporter Başlatma Hatası', 'CRITICAL', $criticalErrorMessage);
    } else {
        error_log($criticalErrorMessage);
    }
    // Bu durumda sınıfın fonksiyonları düzgün çalışmayacaktır.
    // Exception fırlatmak yerine, fonksiyonlar false döndürecek ve hata loglanacak.
}

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as ReaderXlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Shared\Date as PhpSpreadsheetDate; // Tarih formatlaması için

class ExcelExporter {

    /**
     * Personel listesini Excel (.xlsx) formatında oluşturur.
     *
     * @param array $personelData Veri dizisi. Beklenen anahtarlar: firma_unvani, ad, soyad, tckn, unvan, departman_adi, mobil_tel, sabit_tel, email
     * @param string $filename İndirilecek veya kaydedilecek dosyanın tam adı (uzantı dahil, örn: Personel_Listesi_2024_06.xlsx).
     * @param bool $outputToBrowser True ise dosyayı tarayıcıya indirmeye sunar.
     * @param string|null $savePath $outputToBrowser false ise dosyanın kaydedileceği yol (sadece dizin).
     * @return string|bool Başarılıysa dosya yolu veya true, başarısızsa false.
     */
    public static function exportPersonelList($personelData, $filename = 'Personel_Listesi.xlsx', $outputToBrowser = true, $savePath = null) {
        global $btkHelperNviLoaded; // NVIClient gibi global helper varlık kontrolü

        if (!$GLOBALS['phpSpreadsheetLoaded']) { // Global scope'taki değişkene erişim
            if ($btkHelperNviLoaded && class_exists('BtkHelper')) { BtkHelper::logAction('Excel Export Hatası', 'CRITICAL', 'PhpSpreadsheet kütüphanesi yüklenemedi.'); }
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
            $columnIndex = 1;
            foreach ($headers as $header) {
                $cellCoordinate = Coordinate::stringFromColumnIndex($columnIndex) . '1';
                $sheet->setCellValue($cellCoordinate, $header);
                $sheet->getColumnDimension(Coordinate::stringFromColumnIndex($columnIndex))->setAutoSize(true);
                $style = $sheet->getStyle($cellCoordinate);
                $style->getFont()->setBold(true);
                $style->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
                $style->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFE0E0E0');
                $columnIndex++;
            }

            $rowIndex = 2;
            if (is_array($personelData)) {
                foreach ($personelData as $personel) {
                    $sheet->setCellValueExplicit('A' . $rowIndex, $personel['firma_unvani'] ?? '', DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('B' . $rowIndex, $personel['ad'] ?? '', DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('C' . $rowIndex, $personel['soyad'] ?? '', DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('D' . $rowIndex, $personel['tckn'] ?? '', DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('E' . $rowIndex, $personel['unvan'] ?? '', DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('F' . $rowIndex, $personel['departman_adi'] ?? '', DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('G' . $rowIndex, $personel['mobil_tel'] ?? '', DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('H' . $rowIndex, $personel['sabit_tel'] ?? '', DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('I' . $rowIndex, $personel['email'] ?? '', DataType::TYPE_STRING);
                    $rowIndex++;
                }
            }
            
            $lastColumnLetter = Coordinate::stringFromColumnIndex(count($headers));
            $borderStyleArray = ['borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FF000000']]]];
            if ($rowIndex > 1) {
                $sheet->getStyle('A1:' . $lastColumnLetter . ($rowIndex - 1))->applyFromArray($borderStyleArray);
            } else {
                 $sheet->getStyle('A1:' . $lastColumnLetter . '1')->applyFromArray($borderStyleArray);
            }

            $writer = new Xlsx($spreadsheet);

            if ($outputToBrowser) {
                ob_clean(); // Olası çıktı tamponlarını temizle
                header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                header('Content-Disposition: attachment;filename="' . basename($filename) . '"');
                header('Cache-Control: max-age=0');
                header('Pragma: public');
                $writer->save('php://output');
                if ($btkHelperNviLoaded && class_exists('BtkHelper')) { BtkHelper::logAction('Personel Excel Export', 'BAŞARILI', basename($filename) . ' tarayıcıya gönderildi.'); }
                // WHMCS context'inde exit() genellikle _output fonksiyonu sonunda olur, burada doğrudan çıkış yapmamak daha iyi olabilir.
                // WHMCS, script bittikten sonra kendi işlemlerini yapabilir.
                // Ancak dosya indirme için exit() gerekebilir. Duruma göre test edilmeli.
                // exit; 
                return true;
            } else {
                $fullSavePath = ($savePath ?: sys_get_temp_dir()) . DIRECTORY_SEPARATOR . basename($filename);
                $writer->save($fullSavePath);
                if ($btkHelperNviLoaded && class_exists('BtkHelper')) { BtkHelper::logAction('Personel Excel Export', 'BAŞARILI', basename($filename) . ' dosyası ' . $fullSavePath . ' yoluna kaydedildi.'); }
                return $fullSavePath;
            }

        } catch (Exception $e) {
            if ($btkHelperNviLoaded && class_exists('BtkHelper')) { BtkHelper::logAction('Excel Export Hatası', 'HATA', 'Personel listesi Excel\'e aktarılırken hata: ' . $e->getMessage()); }
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
        global $btkHelperNviLoaded;

        if (!$GLOBALS['phpSpreadsheetLoaded'] || !file_exists($filePath) || !is_readable($filePath)) {
             if ($btkHelperNviLoaded && class_exists('BtkHelper')) { BtkHelper::logAction('Excel Import Hatası', 'CRITICAL', 'PhpSpreadsheet yüklenemedi veya dosya okunamıyor: ' . $filePath); }
            return false;
        }

        try {
            $reader = new ReaderXlsx();
            $reader->setReadDataOnly(true);
            $spreadsheet = $reader->load($filePath);
            $sheet = $spreadsheet->getActiveSheet();
            $highestRow = $sheet->getHighestDataRow();
            
            if ($highestRow < 1) {
                if ($btkHelperNviLoaded && class_exists('BtkHelper')) { BtkHelper::logAction('Excel Import Hatası', 'HATA', 'Excel dosyası boş veya geçersiz: ' . $filePath); }
                return false;
            }

            $headerData = $sheet->rangeToArray('A1:' . $sheet->getHighestDataColumn() . '1', NULL, TRUE, FALSE, TRUE);
            if (empty($headerData[1])) {
                if ($btkHelperNviLoaded && class_exists('BtkHelper')) { BtkHelper::logAction('Excel Import Hatası', 'HATA', 'Excel dosyasında başlık satırı bulunamadı.'); }
                return false;
            }
            
            $rawHeaders = $headerData[1]; // A => 'Başlık 1', B => 'Başlık 2' ...
            $normalizedHeaderToColLetter = [];
            foreach ($rawHeaders as $colLetter => $originalHeader) {
                if (!empty(trim((string)$originalHeader))) {
                    $normalizedHeadersMap[self::normalizeExcelHeader(trim((string)$originalHeader))] = $colLetter;
                }
            }
            
            // Veritabanı alanları -> Normalize Edilmiş Excel Başlığı eşleştirmesi
            // Bu harita, iss_pop_nokta_listesi.xlsx dosyanızdaki sütunlara göre esnek olmalı.
            $dbFieldToNormalizedHeader = [
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
                'aktif_pasif_durum_excel_str' => 'akti_f_pasi_f' // String olarak alıp boolean'a çevireceğiz
            ];

            $dataRows = [];
            for ($row = 2; $row <= $highestRow; $row++) {
                $rowData = [];
                $isEmptyRow = true;

                foreach ($dbFieldToNormalizedHeader as $dbField => $targetNormalizedHeader) {
                    $colLetter = $normalizedHeadersMap[$targetNormalizedHeader] ?? null;
                    $cellValue = null;
                    if ($colLetter) {
                         $cellValue = trim((string)$sheet->getCell($colLetter . $row)->getValue());
                    }
                    $rowData[$dbField] = $cellValue;
                    if (!empty($cellValue)) $isEmptyRow = false;
                }

                if (!$isEmptyRow) {
                    // Aktif/Pasif durumunu boolean'a çevir
                    if (isset($rowData['aktif_pasif_durum_excel_str'])) {
                        $val = mb_strtolower(trim($rowData['aktif_pasif_durum_excel_str']), 'UTF-8');
                        $rowData['aktif_pasif_durum'] = ($val === 'aktif' || $val === 'evet' || $val === '1' || $val === 'true');
                    } else {
                        $rowData['aktif_pasif_durum'] = true; // Varsayılan aktif
                    }
                    unset($rowData['aktif_pasif_durum_excel_str']);
                    $dataRows[] = $rowData;
                }
            }
            if ($btkHelperNviLoaded && class_exists('BtkHelper')) { BtkHelper::logAction('ISS POP Excel Import', 'BAŞARILI', $filePath . ' dosyasından ' . count($dataRows) . ' satır okundu.'); }
            return $dataRows;

        } catch (Exception $e) {
            if ($btkHelperNviLoaded && class_exists('BtkHelper')) { BtkHelper::logAction('Excel Import Hatası', 'HATA', 'ISS POP noktaları Excel\'den okunurken hata: ' . $e->getMessage()); }
            else { error_log("BTK Reports Excel Import Error: " . $e->getMessage()); }
            return false;
        }
    }

    /**
     * Excel başlıklarını daha standart bir formata (anahtar olarak kullanılabilir) dönüştürür.
     */
    private static function normalizeExcelHeader($header) {
        if (empty($header)) return '';
        $header = trim(mb_strtolower((string)$header, 'UTF-8'));
        $search = ['ı', 'ğ', 'ü', 'ş', 'ö', 'ç', ' ', '/', '-', '(', ')', '.', "\n", "\r", '[', ']'];
        $replace = ['i', 'g', 'u', 's', 'o', 'c', '_', '_', '_', '', '', '', '', '', '', ''];
        $header = str_replace($search, $replace, $header);
        $header = preg_replace('/[^a-z0-9_]/', '', $header); // Sadece alfanumerik ve alt çizgi
        $header = preg_replace('/_+/', '_', $header); // Birden fazla alt çizgiyi tek yap
        $header = trim($header, '_');

        // Sizin iss_pop_nokta_listesi.xlsx dosyanızdaki başlıklarla eşleşecek özel dönüşümler
        $map = [
            'pop_adi_lokasyon_adi' => 'pop_adi__lokasyon_adi', // Örnek: Excel'de "POP Adı / Lokasyon Adı"
            'yayin_yapilan_ssid' => 'yayin_yapilan_ssi_d',   // Örnek: Excel'de "YAYIN YAPILAN SSID" (I harfi)
            'ip_adresi' => 'i_p_adresi_',                     // Örnek: Excel'de "IP ADRESİ"
            'turu' => 'turu',                                 // Örnek: Excel'de "TÜRÜ"
            'markasi' => 'markasi',
            'modeli' => 'modeli_',
            'il' => 'i_l',
            'ilce' => 'i_lce',
             'mahalle' => 'mahalle', // Eğer Excel'de mahalle sütunu varsa
            'tam_adresi' => 'tam_adres', // Eğer Excel'de 'TAM ADRESİ' ise
            'aktifpasif' => 'akti_f_pasi_f',
            'aktif_pasif' => 'akti_f_pasi_f',
            'koordinatlar_enlem_boylam' => 'koordi_natlar',
            'koordinatlar' => 'koordi_natlar'
        ];
        // Daha esnek eşleştirme için:
        foreach ($map as $cleanKey => $excelVariation) {
            if ($header === $excelVariation || $header === $cleanKey) return $targetNormalizedHeader;
        }
        // Eşleşme yoksa, genel normalize edilmiş halini döndür
        return $header;
    }
}
?>