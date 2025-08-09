<?php
/**
 * BTK Raporlama Modülü - Excel Dosyası Üretici
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX - Anayasal Uyum)
 *
 * ANKA-PHOENIX Sürüm Notları (Anayasal Uyum):
 * - Artık tek sayfalık değil, BTK'nın şablonlarına uygun olarak, birden
 *   fazla sayfayı (sheet) doldurabilen karmaşık Excel dosyaları üretir.
 * - `createCevherFaaliyetRaporu` metodu, BTK'nın sağladığı standart formları
 *   şablon olarak kullanır ve verileri bu şablonların içine yazar.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

namespace BtkReports\Exporter;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Style\Font;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use BtkReports\Helper\BtkHelper;
use BtkReports\Manager\LogManager;

class ExcelExporter
{
    /**
     * Verilen şablonu kullanarak bir CEVHER Faaliyet Raporu Excel dosyası oluşturur.
     *
     * @param string $sablonDosyaYolu Kullanılacak olan BTK şablon dosyasının tam yolu.
     * @param array $veriSetleri Sayfa adına göre gruplandırılmış veri setleri. Örn: ['Abone Sayıları' => [...]]
     * @param string $hedefDosyaYolu Oluşturulacak Excel dosyasının kaydedileceği tam yol.
     * @throws \Exception
     */
    public function createCevherFaaliyetRaporu(string $sablonDosyaYolu, array $veriSetleri, string $hedefDosyaYolu): void
    {
        if (!file_exists($sablonDosyaYolu)) {
            throw new \Exception("CEVHER şablon dosyası bulunamadı: {$sablonDosyaYolu}");
        }

        // Şablon dosyasını yükle
        $spreadsheet = IOFactory::load($sablonDosyaYolu);

        foreach ($veriSetleri as $sayfaAdi => $veri) {
            $sheet = $spreadsheet->getSheetByName($sayfaAdi);
            if ($sheet) {
                // BTK formlarında veri genellikle A5 hücresinden başlar.
                // Burası şablona göre ayarlanmalıdır.
                $startCell = 'A5'; 
                
                // Veriyi şablondaki doğru başlangıç hücresinden itibaren yaz
                $sheet->fromArray($veri['data'], null, $startCell, true);
            } else {
                LogManager::logAction('CEVHER Rapor Hatası', 'UYARI', "Şablonda '{$sayfaAdi}' adında bir sayfa bulunamadı, bu bölüm atlandı.", null, ['sablon' => $sablonDosyaYolu]);
            }
        }
        
        $writer = new Xlsx($spreadsheet);
        $writer->save($hedefDosyaYolu);
        LogManager::logAction('CEVHER Excel Dosyası Oluşturuldu', 'INFO', "Dosya: " . basename($hedefDosyaYolu), null, ['path' => $hedefDosyaYolu]);
    }

    /**
     * Muhasebe için "Aylık Giden Faturalar" raporunu oluşturur.
     */
    public function createGidenFaturalarExcel(string $startDate, string $endDate, array $data): string
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle("Giden Faturalar");

        $headers = [
            'Fatura Tarihi', 'Fatura Numarası', 'Müşteri Adı', 'VKN/TCKN',
            'Mal Hizmet Toplam Tutarı', 'Hesaplanan KDV', 'Hesaplanan ÖİV',
            'Vergiler Dahil Toplam Tutar', 'Ödeme Şekli', 'Durum'
        ];
        $sheet->fromArray($headers, null, 'A1');
        
        $rowData = [];
        $totals = ['mal_hizmet' => 0.0, 'kdv' => 0.0, 'oiv' => 0.0, 'toplam' => 0.0];

        foreach ($data as $fatura) {
            $kdvToplam = ($fatura['kdv_tutar_1'] ?? 0) + ($fatura['kdv_tutar_2'] ?? 0);
            $oivToplam = $fatura['oiv_tutar'] ?? 0;

            $rowData[] = [
                $fatura['fatura_tarihi'],
                $fatura['fatura_no'],
                $fatura['musteri_adi'],
                "'" . (string)$fatura['vkn_tckn'],
                (float)$fatura['mal_hizmet_toplam'],
                (float)$kdvToplam,
                (float)$oivToplam,
                (float)$fatura['vergiler_dahil_toplam'],
                $fatura['odeme_detay_aciklama'] ?? $fatura['odeme_sekli'],
                $fatura['durum'],
            ];

            $totals['mal_hizmet'] += (float)$fatura['mal_hizmet_toplam'];
            $totals['kdv'] += (float)$kdvToplam;
            $totals['oiv'] += (float)$oivToplam;
            $totals['toplam'] += (float)$fatura['vergiler_dahil_toplam'];
        }
        $sheet->fromArray($rowData, null, 'A2');

        $lastRow = count($rowData) + 2;
        $sheet->setCellValue("D{$lastRow}", 'GENEL TOPLAMLAR:');
        $sheet->setCellValue("E{$lastRow}", $totals['mal_hizmet']);
        $sheet->setCellValue("F{$lastRow}", $totals['kdv']);
        $sheet->setCellValue("G{$lastRow}", $totals['oiv']);
        $sheet->setCellValue("H{$lastRow}", $totals['toplam']);
        
        $headerRange = 'A1:J1';
        $totalRange = "D{$lastRow}:H{$lastRow}";
        $sheet->getStyle($headerRange)->getFont()->setBold(true);
        $sheet->getStyle($totalRange)->getFont()->setBold(true);
        
        foreach (range('A', 'J') as $columnID) {
            $sheet->getColumnDimension($columnID)->setAutoSize(true);
        }
        
        $currencyFormat = '#,##0.00" TL"';
        foreach (['E', 'F', 'G', 'H'] as $columnID) {
            $sheet->getStyle("{$columnID}2:{$columnID}{$lastRow}")->getNumberFormat()->setFormatCode($currencyFormat);
        }

        $dosyaAdi = "Giden_Faturalar_{$startDate}_-_{$endDate}_" . uniqid() . '.xlsx';
        $dosyaYolu = BtkHelper::getModuleTempPath() . DIRECTORY_SEPARATOR . $dosyaAdi;

        $writer = new Xlsx($spreadsheet);
        $writer->save($dosyaYolu);
        
        LogManager::logAction('Muhasebe Excel Dosyası Oluşturuldu', 'INFO', "Dosya: {$dosyaAdi}", null, ['path' => $dosyaYolu]);

        return $dosyaYolu;
    }
}