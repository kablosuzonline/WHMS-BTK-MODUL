<?php

namespace WHMCS\Module\Addon\BtkRaporlari\Services;

if (!defined('WHMCS')) {
    die('This file cannot be accessed directly');
}

use WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Font;
use PhpOffice\PhpSpreadsheet\Cell\DataType; // Veri tipi belirlemek için

/**
 * Class ExcelExportService
 *
 * Verileri Excel (.xlsx) formatında dışa aktarmak için kullanılır.
 * Özellikle BTK Personel Listesi için.
 */
class ExcelExportService
{
    /**
     * BTK Personel Listesi Excel dosyasını oluşturur.
     *
     * @param array $personnelData mod_btk_personel tablosundan çekilmiş personel verileri.
     *                             Her bir eleman, WHMCS admin ad/soyad/email ve diğer BTK alanlarını içermelidir.
     * @param string $operatorUnvani Operatörün resmi unvanı.
     * @param string $filePath Kaydedilecek dosyanın tam yolu (uzantısız, örn: /path/to/temp/IZMARBILISIM_Personel_Listesi_2025_1).
     * @return string|false Oluşturulan .xlsx dosyasının tam yolu veya hata durumunda false.
     */
    public static function generatePersonnelExcel(array $personnelData, $operatorUnvani, $filePath)
    {
        BtkHelper::logActivity("ExcelExportService: Personel Listesi Excel oluşturma başlatıldı.", 0, 'DEBUG', ['file_path_base' => $filePath]);

        if (!class_exists('PhpOffice\PhpSpreadsheet\Spreadsheet')) {
            $msg = 'PhpSpreadsheet kütüphanesi bulunamadı. Lütfen Composer ile yükleyin veya manuel olarak dahil edin.';
            BtkHelper::logActivity($msg, 0, 'CRITICAL');
            return false;
        }

        try {
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle('Personel Listesi');

            // Başlık Satırı (BTK Personel_Listesi.xlsx şablonuna göre)
            // A1: FİRMA ADI (Operatör Unvanı)
            // A2: ADI SOYADI | T.C. KİMLİK NO | ÜNVANI | ÇALIŞTIĞI BİRİM | MOBİL TELEFONU | SABİT TELEFONU | E-POSTA ADRESİ
            // Not: BTK şablonundaki sıra ve başlıklar tam olarak eşleşmelidir.
            // Şablondaki gerçek başlıklar:
            // Firma Adı, Adı, Soyadı, TC Kimlik No, Ünvan, Çalıştığı birim, Mobil telefonu (alan koduyla birlikte 10 hane olarak giriniz), Sabit telefonu (alan koduyla birlikte 10 hane olarak giriniz), E-posta adresi

            $sheet->setCellValue('A1', 'FİRMA ADI:');
            $sheet->setCellValue('B1', $operatorUnvani);
            $sheet->getStyle('A1')->getFont()->setBold(true);
            $sheet->mergeCells('B1:I1'); // Firma adını genişlet

            // Sütun Başlıkları
            $headers = [
                'A' => 'ADI',
                'B' => 'SOYADI',
                'C' => 'T.C. KİMLİK NO',
                'D' => 'ÜNVANI',
                'E' => 'ÇALIŞTIĞI BİRİM',
                'F' => 'MOBİL TELEFONU',
                'G' => 'SABİT TELEFONU',
                'H' => 'E-POSTA ADRESİ'
            ];

            $headerRow = 3; // Başlıklar 3. satırdan başlasın
            foreach ($headers as $column => $title) {
                $sheet->setCellValue($column . $headerRow, $title);
                $sheet->getStyle($column . $headerRow)->getFont()->setBold(true);
                $sheet->getStyle($column . $headerRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getColumnDimension($column)->setAutoSize(true);
            }

            // Veri Satırları
            $row = $headerRow + 1;
            foreach ($personnelData as $personel) {
                // Personel objesi/dizisinden WHMCS admin adı ve soyadını al
                // $personel->firstname, $personel->lastname (eğer WHMCS tbladmins ile join edilmişse)
                // veya $personel['whmcs_firstname'], $personel['whmcs_lastname'] gibi
                // Bizim mod_btk_personel tablomuzda admin_id var, oradan çekilebilir.
                // Şimdilik $personel objesinde ad,soyad olduğunu varsayalım.

                $adi = $personel->whmcs_firstname ?? ($personel['whmcs_firstname'] ?? '');
                $soyadi = $personel->whmcs_lastname ?? ($personel['whmcs_lastname'] ?? '');
                
                // Telefon numaralarını formatla (sadece rakamlar, başında 0 olmadan, 10 hane)
                $mobilTel = preg_replace('/\D/', '', (string)($personel->mobil_telefonu ?? ''));
                if (strlen($mobilTel) == 11 && substr($mobilTel, 0, 1) == '0') {
                    $mobilTel = substr($mobilTel, 1);
                }
                if (strlen($mobilTel) != 10) $mobilTel = ''; // Geçersizse boşalt

                $sabitTel = preg_replace('/\D/', '', (string)($personel->sabit_telefonu ?? ''));
                 if (strlen($sabitTel) == 11 && substr($sabitTel, 0, 1) == '0') {
                    $sabitTel = substr($sabitTel, 1);
                }
                if (strlen($sabitTel) != 10) $sabitTel = '';


                $sheet->setCellValueExplicit('A' . $row, $adi, DataType::TYPE_STRING);
                $sheet->setCellValueExplicit('B' . $row, $soyadi, DataType::TYPE_STRING);
                $sheet->setCellValueExplicit('C' . $row, (string)($personel->tc_kimlik_no ?? ''), DataType::TYPE_STRING); // TCKN string olarak
                $sheet->setCellValueExplicit('D' . $row, (string)($personel->unvan_gorev ?? ''), DataType::TYPE_STRING);
                $sheet->setCellValueExplicit('E' . $row, (string)($personel->departman_adi ?? ''), DataType::TYPE_STRING); // departman_id'den adı çekilmeli
                $sheet->setCellValueExplicit('F' . $row, $mobilTel, DataType::TYPE_STRING);
                $sheet->setCellValueExplicit('G' . $row, $sabitTel, DataType::TYPE_STRING);
                $sheet->setCellValueExplicit('H' . $row, $personel->whmcs_email ?? ($personel['whmcs_email'] ?? ''), DataType::TYPE_STRING);
                $row++;
            }

            // Dosyayı kaydet
            $writer = new Xlsx($spreadsheet);
            $xlsxFilePath = $filePath . '.xlsx';
            $writer->save($xlsxFilePath);

            if (file_exists($xlsxFilePath)) {
                BtkHelper::logActivity("ExcelExportService: Personel Listesi başarıyla oluşturuldu: {$xlsxFilePath}", 0, 'INFO');
                return $xlsxFilePath;
            } else {
                BtkHelper::logActivity("ExcelExportService: Personel Listesi Excel dosyası oluşturulamadı: {$xlsxFilePath}", 0, 'ERROR');
                return false;
            }

        } catch (\PhpOffice\PhpSpreadsheet\Exception $pe) {
            BtkHelper::logActivity("ExcelExportService: PhpSpreadsheet Hatası - " . $pe->getMessage(), 0, 'ERROR', ['exception' => (string)$pe]);
            return false;
        } catch (\Exception $e) {
            BtkHelper::logActivity("ExcelExportService: Genel Hata - " . $e->getMessage(), 0, 'ERROR', ['exception' => (string)$e]);
            return false;
        }
    }

} // Sınıf sonu
?>