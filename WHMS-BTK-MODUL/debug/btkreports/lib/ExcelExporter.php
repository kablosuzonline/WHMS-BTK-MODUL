<?php
/**
 * WHMCS BTK Raporlama Modülü - Excel Dosyası Oluşturucu
 *
 * PhpSpreadsheet kütüphanesini kullanarak .xlsx formatında Excel dosyaları oluşturur.
 * Özellikle BTK Personel Listesi raporu için kullanılacaktır.
 */

// Composer autoload dosyasını modül kök dizininden referans alarak dahil et
// Bu dosya, ExcelExporter.php'nin bulunduğu lib klasörünün bir üstündedir.
if (file_exists(dirname(__DIR__) . '/vendor/autoload.php')) {
    require_once dirname(__DIR__) . '/vendor/autoload.php';
} elseif (defined('BTKREPORTS_MODULE_BASE_DIR') && file_exists(BTKREPORTS_MODULE_BASE_DIR . '/vendor/autoload.php')) {
    // Eğer BTKREPORTS_MODULE_BASE_DIR sabiti tanımlıysa (örn: cron.php'de)
    require_once BTKREPORTS_MODULE_BASE_DIR . '/vendor/autoload.php';
} else {
    // Acil durum: Autoloader bulunamazsa, bu sınıf düzgün çalışmayacaktır.
    // Bu durumun loglanması BtkHelper instance'ı gerektirir, construct içinde ele alınacak.
}


use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Font;
use PhpOffice\PhpSpreadsheet\Cell\DataType;

class ExcelExporter
{
    private $helper; // BtkHelper loglama ve ayarlar için
    private $isPhpSpreadsheetLoaded = false;

    public function __construct(BtkHelper $helperInstance = null)
    {
        $this->helper = $helperInstance;
        if (class_exists('\PhpOffice\PhpSpreadsheet\Spreadsheet')) {
            $this->isPhpSpreadsheetLoaded = true;
        } else {
            $errorMessage = 'ExcelExporter HATA: PhpSpreadsheet kütüphanesi bulunamadı veya yüklenemedi. Lütfen Composer ile "phpoffice/phpspreadsheet" paketini modülün ana dizinine kurun.';
            if ($this->helper) {
                $this->helper->logMessage('CRITICAL', __CLASS__ . ' Constructor', $errorMessage);
            } else {
                // Helper yoksa sunucu loguna yazmayı dene
                error_log($errorMessage);
            }
            // throw new \Exception($errorMessage); // İsteğe bağlı olarak exception fırlatılabilir
        }
    }

    /**
     * BTK Personel Listesi Excel dosyasını oluşturur ve kaydeder/indirir.
     *
     * @param array $personelListesi Personel verilerini içeren array (her bir eleman bir personel objesi/array'i)
     * @param string $operatorUnvani Raporun "Firma Adı" sütununda kullanılacak operatör unvanı
     * @param string $filePath Kaydedilecek dosyanın tam yolu (uzantı dahil, örn: /path/to/module/temp_reports/IZMARBILISIM_Personel_Listesi_2024_06.xlsx)
     * @param bool $downloadDirectly True ise dosyayı kaydetmek yerine doğrudan tarayıcıya indirir. (Cron için false olmalı)
     * @return bool|string Başarılı ise kaydedilen dosya yolu (veya true eğer downloadDirectly true ise), başarısız ise false.
     */
    public function createBtkPersonelExcel(array $personelListesi, $operatorUnvani, $filePath, $downloadDirectly = false)
    {
        if (!$this->isPhpSpreadsheetLoaded) {
            if ($this->helper) $this->helper->logMessage('ERROR', __METHOD__, 'PhpSpreadsheet sınıfı başlatılamadığı için Excel oluşturma işlemi yapılamıyor.');
            return false;
        }

        try {
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle('Personel Listesi'); // Çalışma sayfasının adı

            // Başlık Satırı (Header Row) - Personel_Listesi.xlsx dosyanızdaki BTK'ya gönderilecek sütunlara göre
            // BTK'nın talep ettiği Excel formatındaki sütun başlıkları tam olarak yazılmalı.
            $headers = [
                'A1' => 'Firma Adı',
                'B1' => 'Adı',
                'C1' => 'Soyadı',
                'D1' => 'TC Kimlik No',
                'E1' => 'Ünvan', // Görev/Pozisyon
                'F1' => 'Çalıştığı birim',
                'G1' => 'Mobil telefonu', // BTK dokümanında "alan koduyla birlikte 10 hane" notu vardı, veri buna uygun olmalı.
                'H1' => 'Sabit telefonu', // BTK dokümanında "alan koduyla birlikte 10 hane" notu vardı.
                'I1' => 'E-posta adresi'
            ];

            // Başlıkları yaz ve stil uygula
            foreach ($headers as $cellCoordinate => $headerTitle) {
                $sheet->setCellValue($cellCoordinate, $headerTitle);
                $style = $sheet->getStyle($cellCoordinate);
                $style->getFont()->setBold(true);
                $style->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFE0E0E0'); // Açık gri arkaplan
                $style->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $style->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
                $style->getBorders()->getOutline()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
            }
            $sheet->getRowDimension(1)->setRowHeight(22); // Başlık satırı yüksekliği


            // Veri Satırları
            $rowNumber = 2;
            if (is_array($personelListesi) || is_object($personelListesi)) {
                foreach ($personelListesi as $personelObject) {
                    // Gelen veri obje ise array'e çevir (Capsule'dan gelenler obje olabilir)
                    $personel = (array) $personelObject;

                    // Sadece BTK listesine eklenecek ve işten ayrılmamış olanlar
                    if (isset($personel['btk_listesine_eklensin']) && $personel['btk_listesine_eklensin'] == 1 && empty($personel['isten_ayrilma_tarihi'])) {
                        // TCKN ve Telefon numaralarını metin olarak yazdır (başındaki sıfırların kaybolmaması için)
                        $sheet->setCellValueExplicit('A' . $rowNumber, $operatorUnvani ?? '', DataType::TYPE_STRING);
                        $sheet->setCellValueExplicit('B' . $rowNumber, $personel['adi'] ?? '', DataType::TYPE_STRING);
                        $sheet->setCellValueExplicit('C' . $rowNumber, $personel['soyadi'] ?? '', DataType::TYPE_STRING);
                        $sheet->setCellValueExplicit('D' . $rowNumber, (string)($personel['tc_kimlik_no'] ?? ''), DataType::TYPE_STRING);
                        $sheet->setCellValueExplicit('E' . $rowNumber, $personel['unvan'] ?? '', DataType::TYPE_STRING);
                        $sheet->setCellValueExplicit('F' . $rowNumber, $personel['calistigi_birim'] ?? '', DataType::TYPE_STRING);
                        $sheet->setCellValueExplicit('G' . $rowNumber, (string)($personel['mobil_telefonu'] ?? ''), DataType::TYPE_STRING);
                        $sheet->setCellValueExplicit('H' . $rowNumber, (string)($personel['sabit_telefonu'] ?? ''), DataType::TYPE_STRING);
                        $sheet->setCellValueExplicit('I' . $rowNumber, $personel['eposta_adresi'] ?? '', DataType::TYPE_STRING);

                        // Hücrelere kenarlık ekle (isteğe bağlı)
                        foreach (range('A', 'I') as $colLetter) {
                             $sheet->getCell($colLetter . $rowNumber)->getStyle()->getBorders()->getOutline()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
                        }
                        $rowNumber++;
                    }
                }
            }


            // Sütun genişliklerini otomatik ayarla (içeriğe göre)
            foreach (range('A', $sheet->getHighestDataColumn()) as $col) {
                 $sheet->getColumnDimension($col)->setAutoSize(true);
            }

            // Dosyayı yazıcı nesnesi ile oluştur
            $writer = new Xlsx($spreadsheet);

            if ($downloadDirectly) {
                // Bu kısım genellikle admin arayüzünden manuel indirme için kullanılır, cron için değil.
                $filename = basename($filePath);
                header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                header('Content-Disposition: attachment;filename="' . $filename . '"');
                header('Cache-Control: max-age=0');
                // Tarayıcıya göndermeden önce ob_clean() gerekebilir, eğer beklenmedik çıktılar varsa.
                // ob_end_clean();
                $writer->save('php://output');
                if ($this->helper) $this->helper->logMessage('INFO', __METHOD__, $filename . " dosyası doğrudan indirme için tarayıcıya gönderildi.");
                // die(); // İndirme sonrası scriptin sonlanması gerekebilir.
                return true;
            } else {
                // Dosyayı sunucuya kaydet
                $saveDir = dirname($filePath);
                if (!is_dir($saveDir)) {
                    if (!@mkdir($saveDir, 0777, true) && !is_dir($saveDir)) { // İzinler önemli
                        throw new \RuntimeException(sprintf('ExcelExporter HATA: Dizin "%s" oluşturulamadı veya yazılamıyor.', $saveDir));
                    }
                }
                $writer->save($filePath);
                if ($this->helper) $this->helper->logMessage('INFO', __METHOD__, $filePath . " dosyası başarıyla oluşturuldu ve kaydedildi.");
                return $filePath;
            }
        } catch (\PhpOffice\PhpSpreadsheet\Exception $e) {
            $errorMessage = "ExcelExporter - PhpSpreadsheet Hatası (Personel Excel): " . $e->getMessage();
            if ($this->helper) $this->helper->logMessage('ERROR', __METHOD__, $errorMessage);
            return false;
        } catch (\Exception $e) {
            $errorMessage = "ExcelExporter - Genel Hata (Personel Excel Oluşturma): " . $e->getMessage();
            if ($this->helper) $this->helper->logMessage('ERROR', __METHOD__, $errorMessage);
            return false;
        }
    }

} // End of ExcelExporter class
// --- BÖLÜM 1 / 1 SONU - (ExcelExporter.php, PhpSpreadsheet kullanarak Excel Oluşturma Sınıfı - GÜNCEL)
?>