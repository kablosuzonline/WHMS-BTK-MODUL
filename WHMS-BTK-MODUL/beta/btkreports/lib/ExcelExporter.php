<?php
/**
 * Excel (.xlsx) İşlemleri Sınıfı (Personel Export, POP Import)
 * PhpSpreadsheet kütüphanesini kullanır.
 * Bu sınıfın çalışması için PhpSpreadsheet kütüphanesinin
 * btkreports.php ana dosyasında require_once ile dahil edilmiş olması gerekir.
 *
 * @package    WHMCS\Module\Addon\BtkReports
 * @author     Gemini Pro AI & Kablosuz Online WISP
 * @version    1.0.0
 */

// WHMCS ortamında çalışıp çalışmadığını kontrol et
if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// Gerekli PhpSpreadsheet sınıflarını import et
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as WriterXlsxPhp; // WHMCS Xlsx sınıfıyla çakışmaması için alias
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as ReaderXlsxPhp; // WHMCS Xlsx sınıfıyla çakışmaması için alias
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

class ExcelExporter {

    private static $moduleName = 'btkreports'; // Loglama için modül adı

    /**
     * PhpSpreadsheet kütüphanesinin yüklenip yüklenmediğini kontrol eder.
     * @return bool
     */
    private static function isPhpSpreadsheetLoaded() {
        if (!class_exists('PhpOffice\PhpSpreadsheet\Spreadsheet')) {
            logModuleCall(self::$moduleName, __CLASS__ . '::' . __FUNCTION__, 'PhpSpreadsheet Kütüphanesi Yüklenemedi!', 'Hata: Spreadsheet sınıfı bulunamadı. Lütfen kütüphanenin doğru kurulduğundan emin olun.', null, 'CRITICAL');
            return false;
        }
        return true;
    }

    /**
     * Personel listesini Excel (.xlsx) formatında oluşturur ve tarayıcıya gönderir veya dosyaya kaydeder.
     *
     * @param array $personelData Veri dizisi.
     * @param string $filename İndirilecek veya kaydedilecek dosyanın adı (uzantısız).
     * @param string $operatorName Rapor dosya adına eklenecek operatör kısa adı.
     * @param string $fileFormatType Config'den gelen dosya adı format türü ('default', 'yearly_period', vb.).
     * @param bool $outputToBrowser True ise dosyayı tarayıcıya indirmeye sunar.
     * @param string|null $savePath $outputToBrowser false ise dosyanın kaydedileceği tam yol (sadece dizin).
     * @return string|bool Başarılıysa dosya yolu (eğer kaydedildiyse) veya true (tarayıcıya gönderildiyse), başarısızsa false.
     */
    public static function exportPersonelList($personelData, $filename = 'Personel_Listesi', $operatorName = 'OPERATOR', $fileFormatType = 'default', $outputToBrowser = true, $savePath = null) {
        if (!self::isPhpSpreadsheetLoaded()) {
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
            $sheet->getRowDimension(1)->setRowHeight(20);


            $rowIndex = 2;
            if (is_array($personelData)) {
                foreach ($personelData as $personel) {
                    // Gelen $personel objesi veya dizisi içindeki alan adları başlıklarla eşleşmeli.
                    // btkreports_php'deki fonksiyon bu formatta veri hazırlamalı.
                    $sheet->setCellValueExplicit('A' . $rowIndex, $personel->firma_unvani ?? ($personel['firma_unvani'] ?? ''), DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('B' . $rowIndex, $personel->adi ?? ($personel['adi'] ?? ''), DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('C' . $rowIndex, $personel->soyadi ?? ($personel['soyadi'] ?? ''), DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('D' . $rowIndex, $personel->tc_kimlik_no ?? ($personel['tc_kimlik_no'] ?? ''), DataType::TYPE_STRING); // Başına ' eklemeye gerek yok, DataType::TYPE_STRING yeterli
                    $sheet->setCellValueExplicit('E' . $rowIndex, $personel->unvan_gorev ?? ($personel['unvan_gorev'] ?? ''), DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('F' . $rowIndex, $personel->calistigi_birim ?? ($personel['calistigi_birim'] ?? ''), DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('G' . $rowIndex, $personel->mobil_telefonu ?? ($personel['mobil_telefonu'] ?? ''), DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('H' . $rowIndex, $personel->sabit_telefonu ?? ($personel['sabit_telefonu'] ?? ''), DataType::TYPE_STRING);
                    $sheet->setCellValueExplicit('I' . $rowIndex, $personel->eposta_adresi ?? ($personel['eposta_adresi'] ?? ''), DataType::TYPE_STRING);
                    $rowIndex++;
                }
            }
            
            $lastColumnLetter = Coordinate::stringFromColumnIndex(count($headers));
            $borderStyleArray = ['borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FF000000']]]];
            $rangeToBorder = 'A1:' . $lastColumnLetter . ($rowIndex > 1 ? ($rowIndex - 1) : 1);
            if ($rowIndex > 1) { // Sadece veri varsa kenarlık ekle
                $sheet->getStyle($rangeToBorder)->applyFromArray($borderStyleArray);
            }

            // Dinamik dosya adı oluşturma
            $finalFilename = $filename; // Temel ad
            if ($fileFormatType === 'default') { // BTK'nın istediği standart isim (Operatör adı olmadan)
                $finalFilename = "Personel_Listesi";
            } elseif ($fileFormatType === 'yearly_period') {
                $current_month = date('n');
                $period = ($current_month <= 6) ? '1' : '2';
                $finalFilename = $operatorName . "_" . $filename . "_" . date('Y') . "_" . $period;
            } elseif ($fileFormatType === 'yearly_monthly') {
                $finalFilename = $operatorName . "_" . $filename . "_" . date('Y_m');
            } elseif ($fileFormatType === 'timestamp') {
                $finalFilename = $operatorName . "_" . $filename . "_" . date('YmdHis');
            } else { // Operatör adıyla varsayılan
                 $finalFilename = $operatorName . "_" . $filename . "_" . date('Y_m');
            }
            $finalFilename .= ".xlsx";


            $writer = new WriterXlsxPhp($spreadsheet);

            if ($outputToBrowser) {
                if (ob_get_contents()) ob_end_clean(); // Olası çıktı tamponlarını temizle
                
                header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                header('Content-Disposition: attachment;filename="' . basename($finalFilename) . '"');
                header('Cache-Control: max-age=0, must-revalidate, post-check=0, pre-check=0');
                header('Pragma: public');
                header('Expires: 0');
                
                $writer->save('php://output');
                logModuleCall(self::$moduleName, __CLASS__ . '::' . __FUNCTION__, 'Personel Excel Export (Tarayıcı)', basename($finalFilename) . ' tarayıcıya gönderildi.', 'success');
                // WHMCS context'inde burada exit() yapmak, çağıran fonksiyonun akışını keser.
                // Bu fonksiyon true döndürmeli, çağıran yer (btkreports.php'deki action) exit yapmalı.
                return true;
            } else {
                if (is_null($savePath)) {
                    $savePath = sys_get_temp_dir(); // WHMCS tmp dizini daha iyi olabilir: $GLOBALS['templates_compiledir'] veya $GLOBALS['attachments_dir']
                }
                if (!is_dir($savePath)) {
                    mkdir($savePath, 0777, true); // Gerekirse dizin oluştur
                }
                $fullSavePath = rtrim($savePath, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . basename($finalFilename);
                $writer->save($fullSavePath);
                logModuleCall(self::$moduleName, __CLASS__ . '::' . __FUNCTION__, 'Personel Excel Export (Dosya)', basename($finalFilename) . ' dosyası ' . $fullSavePath . ' yoluna kaydedildi.', 'success');
                return $fullSavePath;
            }

        } catch (\PhpOffice\PhpSpreadsheet\Exception $spe) {
            logModuleCall(self::$moduleName, __CLASS__ . '::' . __FUNCTION__, 'Excel Export Hatası (PhpSpreadsheet)', 'Personel listesi Excel\'e aktarılırken PhpSpreadsheet hatası: ' . $spe->getMessage(), $spe->getTraceAsString(), 'ERROR');
            return false;
        } catch (Exception $e) {
            logModuleCall(self::$moduleName, __CLASS__ . '::' . __FUNCTION__, 'Excel Export Genel Hatası (Personel)', 'Personel listesi Excel\'e aktarılırken genel hata: ' . $e->getMessage(), $e->getTraceAsString(), 'ERROR');
            return false;
        }
    }

    /**
     * Yüklenen bir Excel dosyasından ISS POP Noktası verilerini okur.
     * @param string $filePath Yüklenen Excel dosyasının tam yolu.
     * @return array|false Okunan veri dizisi veya hata durumunda false.
     *                     Dönen dizideki her eleman: ['pop_adi'=>val, 'yayin_yapilan_ssid'=>val, ..., 'aktif_pasif_durum'=>bool]
     */
    public static function importIssPopFromExcel($filePath) {
        if (!self::isPhpSpreadsheetLoaded()) {
            return false;
        }
        if (!file_exists($filePath) || !is_readable($filePath)) {
            logModuleCall(self::$moduleName, __CLASS__ . '::' . __FUNCTION__, 'Excel Import Hatası', 'Dosya bulunamadı veya okunamıyor: ' . $filePath, null, 'ERROR');
            return false;
        }

        try {
            $reader = new ReaderXlsxPhp();
            $reader->setReadDataOnly(true); // Sadece veriyi oku, formatlamayı değil (performans için)
            $spreadsheet = $reader->load($filePath);
            $sheet = $spreadsheet->getActiveSheet();
            $highestRow = $sheet->getHighestDataRow();
            $highestColumnLetter = $sheet->getHighestDataColumn(); // A, B, C...

            if ($highestRow < 1) {
                logModuleCall(self::$moduleName, __CLASS__ . '::' . __FUNCTION__, 'Excel Import Hatası', 'Excel dosyası boş veya başlık satırı yok: ' . basename($filePath), null, 'ERROR');
                return false;
            }

            // Başlık satırını oku (1. satır)
            $headerRow = $sheet->rangeToArray('A1:' . $highestColumnLetter . '1', null, true, false, true);
            if (empty($headerRow[1])) {
                logModuleCall(self::$moduleName, __CLASS__ . '::' . __FUNCTION__, 'Excel Import Hatası', 'Excel dosyasında başlık satırı okunamadı.', basename($filePath), 'ERROR');
                return false;
            }
            
            $rawHeaders = $headerRow[1]; // ['A' => 'Başlık 1', 'B' => 'Başlık 2', ...]
            $normalizedHeaderToColLetter = [];
            foreach ($rawHeaders as $colLetter => $originalHeader) {
                if (!empty(trim((string)$originalHeader))) {
                    $normalized = self::normalizeExcelHeader(trim((string)$originalHeader));
                    if (!isset($normalizedHeaderToColLetter[$normalized])) {
                         $normalizedHeaderToColLetter[$normalized] = $colLetter;
                    }
                }
            }
            
            // Veritabanı alanları ile Excel'deki normalize edilmiş başlıklar arasındaki eşleştirme
            // Bu eşleştirme, iss_pop_nokta_listesi.xlsx dosyanızdaki başlıklara göre yapılmalı.
            $dbFieldToNormalizedHeader = [
                'pop_adi'                   => 'pop_adi_lokasyon_adi', // Excel: "POP Adı / Lokasyon Adı"
                'yayin_yapilan_ssid'        => 'yayin_yapilan_ssi_d',  // Excel: "YAYIN YAPILAN SSID"
                'adres_il_adi_excel'        => 'i_l',                  // Excel: "İL"
                'adres_ilce_adi_excel'      => 'i_lce',                // Excel: "İLÇE"
                'adres_mahalle_adi_excel'   => 'mahalle_koy',          // Excel: "MAHALLE/KÖY"
                'adres_acik_excel'          => 'tam_adres',            // Excel: "TAM ADRES"
                'koordinatlar'              => 'koordi_natlar',        // Excel: "KOORDİNATLAR (Enlem,Boylam)"
                'aktif_pasif_durum_excel_str' => 'aktif_pasif_durumu'     // Excel: "Aktif/Pasif Durumu"
                // Diğer olası başlıklar eklenebilir: 'ip_adresi', 'cihaz_turu', 'cihaz_markasi', 'cihaz_modeli', 'pop_tipi'
            ];

            $dataRows = [];
            for ($row = 2; $row <= $highestRow; $row++) {
                $rowData = [];
                $isEmptyRow = true;
                foreach ($dbFieldToNormalizedHeader as $dbField => $targetNormalizedHeader) {
                    $colLetter = $normalizedHeaderToColLetter[$targetNormalizedHeader] ?? null;
                    $cellValue = null;
                    if ($colLetter) {
                        $cellValue = trim((string)$sheet->getCell($colLetter . $row)->getValue());
                    }
                    $rowData[$dbField] = $cellValue;
                    if (!is_null($cellValue) && $cellValue !== '') $isEmptyRow = false;
                }

                if (!$isEmptyRow) {
                    // Aktif/Pasif durumunu boolean'a çevir
                    if (isset($rowData['aktif_pasif_durum_excel_str'])) {
                        $val = mb_strtolower(trim($rowData['aktif_pasif_durum_excel_str']), 'UTF-8');
                        $rowData['aktif'] = ($val === 'aktif' || $val === 'evet' || $val === '1' || $val === 'true');
                    } else {
                        $rowData['aktif'] = true; // Eğer sütun yoksa veya boşsa varsayılan aktif
                    }
                    unset($rowData['aktif_pasif_durum_excel_str']); // Bu geçici alanı kaldır
                    $dataRows[] = $rowData;
                }
            }
            logModuleCall(self::$moduleName, __CLASS__ . '::' . __FUNCTION__, 'ISS POP Excel Import', basename($filePath) . ' dosyasından ' . count($dataRows) . ' satır okundu.', 'success');
            return $dataRows;

        } catch (\PhpOffice\PhpSpreadsheet\Exception $spe) {
            logModuleCall(self::$moduleName, __CLASS__ . '::' . __FUNCTION__, 'Excel Import Hatası (PhpSpreadsheet)', 'PhpSpreadsheet hatası: ' . $spe->getMessage(), $spe->getTraceAsString(), 'ERROR');
            return false;
        } catch (Exception $e) {
            logModuleCall(self::$moduleName, __CLASS__ . '::' . __FUNCTION__, 'Excel Import Genel Hatası (ISS POP)', 'ISS POP Excel okunurken genel hata: ' . $e->getMessage(), $e->getTraceAsString(), 'ERROR');
            return false;
        }
    }

    /**
     * Excel başlıklarını daha standart bir formata (anahtar olarak kullanılabilir) dönüştürür.
     * Bu fonksiyon, iss_pop_nokta_listesi.xlsx dosyanızdaki başlıklara göre özelleştirilmiştir.
     */
    private static function normalizeExcelHeader($header) {
        if (empty($header)) return '';
        $header = trim(mb_strtolower((string)$header, 'UTF-8'));
        
        $search = ['ı', 'ğ', 'ü', 'ş', 'ö', 'ç', ' ', '/', '-', '(', ')', '.', "\n", "\r", '[', ']', 'ä', 'é', 'å', 'ë', 'ï', 'î', 'ô', 'û', 'â', 'ê'];
        $replace = ['i', 'g', 'u', 's', 'o', 'c', '_', '_', '_', '', '', '', '', '', '', '', 'a', 'e', 'a', 'e', 'i', 'i', 'o', 'u', 'a', 'e'];
        $header = str_replace($search, $replace, $header);
        $header = preg_replace('/[^a-z0-9_]/', '', $header);
        $header = preg_replace('/_+/', '_', $header);
        $header = trim($header, '_');

        // iss_pop_nokta_listesi.xlsx özel eşleştirmeleri
        $specificMap = [
            'pop_adi_lokasyon_adi' => 'pop_adi__lokasyon_adi',
            'yayin_yapilan_ssid' => 'yayin_yapilan_ssi_d',
            'ip_adresi' => 'i_p_adresi_',
            'turu' => 'turu', // POP TÜRÜ
            'markasi' => 'markasi',
            'modeli' => 'modeli_',
            'il' => 'i_l',
            'ilce' => 'i_lce',
            'mahalle_koy' => 'mahalle_koy', // MAHALLE/KÖY
            'mahalle' => 'mahalle_koy',     // Eğer sadece MAHALLE ise yine aynı yere map edelim
            'tam_adresi' => 'tam_adres',
            'koordinatlar_enlem_boylam' => 'koordi_natlar',
            'koordinatlar' => 'koordi_natlar',
            'aktif_pasif_durumu' => 'aktif_pasif_durumu' // Excel'de "Aktif/Pasif Durumu" ise
        ];

        return $specificMap[$header] ?? $header; // Özel eşleşme varsa onu, yoksa genel normalize edilmişi döndür
    }
}
?>