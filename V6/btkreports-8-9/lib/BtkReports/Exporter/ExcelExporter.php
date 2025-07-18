<?php
/**
 * Excel (.xlsx) İşlemleri Sınıfı
 * PhpSpreadsheet kütüphanesini kullanarak Excel dosyaları oluşturur.
 * Sürüm 8.1.0 ile AbstractBtkRapor'daki değişikliklerle senkronize edilmiştir.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    8.1.0
 */

namespace BtkReports\Exporter;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use BtkReports\Helper\BtkHelper;

class ExcelExporter {

    /**
     * Personel listesini BTK'nın talep ettiği formatta bir Excel (.xlsx) dosyası olarak oluşturur.
     *
     * @param array $personelData Veri dizisi.
     * @param string $filename İndirilecek veya kaydedilecek dosyanın tam adı.
     * @param bool $outputToBrowser True ise dosyayı tarayıcıya indirmeye sunar, false ise belirtilen yola kaydeder.
     * @param string|null $savePath Dosyanın kaydedileceği yol (sadece dizin). Null ise modülün temp klasörü kullanılır.
     * @return string|bool Başarılıysa dosya yolu veya true (tarayıcıya gönderildiyse), başarısızsa false.
     * @throws \Exception Gerekli kütüphaneler yüklenemezse veya dosya yazılamazsa.
     */
    public static function exportPersonelList(array $personelData, string $filename, bool $outputToBrowser = true, ?string $savePath = null): string|bool
    {
        try {
            if (!class_exists('PhpOffice\PhpSpreadsheet\Spreadsheet')) {
                throw new \Exception("PhpSpreadsheet kütüphanesi yüklenemedi. 'composer install' komutunu çalıştırdınız mı?");
            }

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
            if (!empty($personelData)) {
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
            $sheet->getStyle('A1:' . $lastColumnLetter . ($rowIndex - 1))->applyFromArray($borderStyleArray);

            $writer = new Xlsx($spreadsheet);
            $cleanFilename = preg_replace('/[^A-Za-z0-9_.-]/', '_', basename($filename));

            if ($outputToBrowser) {
                if(ob_get_level()) ob_end_clean();
                header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                header('Content-Disposition: attachment;filename="' . $cleanFilename . '"');
                header('Cache-Control: max-age=0, must-revalidate');
                header('Pragma: public'); 
                $writer->save('php://output');
                BtkHelper::logAction('Personel Excel Export', 'BAŞARILI', $cleanFilename . ' tarayıcıya gönderildi.');
                exit; // Tarayıcıya gönderim sonrası script'i sonlandır
            } else {
                $finalSavePath = $savePath ?: BtkHelper::getModuleTempPath();
                if (!is_dir($finalSavePath)) {
                    @mkdir($finalSavePath, 0755, true);
                }
                $filePath = rtrim($finalSavePath, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $cleanFilename;
                $writer->save($filePath);
                BtkHelper::logAction('Personel Excel Export', 'BAŞARILI', $cleanFilename . ' dosyası ' . $filePath . ' yoluna kaydedildi.');
                return $filePath;
            }

        } catch (\Exception $e) {
            BtkHelper::logAction('Excel Export Hatası (Personel)', 'KRITIK', 'Personel listesi Excel\'e aktarılırken hata: ' . $e->getMessage());
            return false;
        }
    }
}
?>