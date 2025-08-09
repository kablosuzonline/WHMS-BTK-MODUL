<?php
/**
 * Modül Adres Veri Seti Yöneticisi
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX)
 *
 * ANKA-PHOENIX Sürüm Notları:
 * - Hata yönetimi, merkezi LogManager ile tam entegre hale getirildi.
 * - Mahalle veri setlerini yüklemek için kullanılan ilçe listesi (`getIlceListForMahalleUpload`)
 *   SQL dosya adlarıyla uyumlu olacak şekilde, Türkçe karakterleri
 *   dönüştüren ve standartlaştıran bir mantıkla iyileştirildi.
 * - Dosya yolu oluşturma ve kontrol mekanizmaları daha güvenli hale getirildi.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

namespace BtkReports\Manager;

use WHMCS\Database\Capsule;
use BtkReports\Manager\LogManager;

class DataManager
{
    /**
     * Belirtilen adres veri setini ilgili SQL dosyasından yükler.
     * @param string $setName Yüklenecek setin adı (iller, ilceler, mahalleler)
     * @param array $options Ek seçenekler (örn: mahalleler için ilce_kodu)
     * @return array
     */
    public static function loadDataSet(string $setName, array $options = []): array
    {
        LogManager::logAction('Adres Veri Seti Yükleme Denemesi', 'UYARI', "'{$setName}' veri seti yükleniyor.", null, ['options' => $options]);
        try {
            $filePath = self::getDataSetFilePath($setName, $options);

            if (!file_exists($filePath) || !is_readable($filePath)) {
                throw new \Exception("Veri seti dosyası bulunamadı veya okunamıyor: {$filePath}");
            }

            $sqlContent = file_get_contents($filePath);
            $queries = explode(';', $sqlContent);
            $executedQueries = 0;

            // Veritabanı işlemlerini bir transaction içinde yaparak
            // olası bir hatada geri alınmasını sağla.
            Capsule::transaction(function () use ($queries, &$executedQueries) {
                foreach ($queries as $query) {
                    $query = trim($query);
                    if (!empty($query)) {
                        Capsule::connection()->statement($query);
                        $executedQueries++;
                    }
                }
            });
            
            LogManager::logAction('Adres Veri Seti Yüklendi', 'INFO', "'{$setName}' veri seti başarıyla yüklendi. {$executedQueries} sorgu çalıştırıldı.");

            return [
                'status' => 'success',
                'message' => "'{$setName}' veri seti başarıyla yüklendi."
            ];

        } catch (\Exception $e) {
            LogManager::logAction('Adres Veri Seti Yükleme Hatası', 'HATA', $e->getMessage());
            return [
                'status' => 'error',
                'message' => 'Hata: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Veri setlerinin veritabanında yüklü olup olmadığını kontrol eder.
     * @return array
     */
    public static function checkDataSetsStatus(): array
    {
        return [
            'iller' => Capsule::table('mod_btk_adres_il')->exists(),
            'ilceler' => Capsule::table('mod_btk_adres_ilce')->exists(),
        ];
    }
    
    /**
     * Adres veri seti adına göre SQL dosyasının tam yolunu oluşturur ve döndürür.
     * @param string $setName
     * @param array $options
     * @return string
     * @throws \Exception
     */
    private static function getDataSetFilePath(string $setName, array $options): string
    {
        $basePath = realpath(__DIR__ . '/../../../sql/data_sets');
        if (!$basePath) {
            throw new \Exception("Veri seti ana klasörü bulunamadı.");
        }

        switch ($setName) {
            case 'iller':
                return $basePath . DIRECTORY_SEPARATOR . 'iller.sql';
            case 'ilceler':
                return $basePath . DIRECTORY_SEPARATOR . 'ilceler.sql';
            case 'mahalleler':
                if (empty($options['ilce_kodu'])) {
                    throw new \Exception("Mahalleleri yüklemek için 'ilce_kodu' parametresi zorunludur.");
                }
                // Güvenlik için ilçe kodu parametresini temizle
                $ilceKodu = preg_replace('/[^a-zA-Z0-9_-]/', '', $options['ilce_kodu']);
                return $basePath . DIRECTORY_SEPARATOR . 'mahalleler' . DIRECTORY_SEPARATOR . $ilceKodu . '.sql';
            default:
                throw new \Exception("Bilinmeyen veya desteklenmeyen veri seti adı: {$setName}");
        }
    }

    /**
     * Mahalle dosyalarının yüklenebilmesi için ilçe listesini, SQL dosya adlarıyla
     * eşleşecek formatta döndürür.
     * @return array
     */
    public static function getIlceListForMahalleUpload(): array
    {
        // Türkçe karakterleri dosya adlarına uygun hale getirmek için çevrim haritası
        $charMap = [
            'ı' => 'i', 'İ' => 'i', 'ö' => 'o', 'Ö' => 'o', 'ü' => 'u', 'Ü' => 'u',
            'ç' => 'c', 'Ç' => 'c', 'ş' => 's', 'Ş' => 's', 'ğ' => 'g', 'Ğ' => 'g',
        ];

        $ilceler = Capsule::table('mod_btk_adres_ilce as ilce')
            ->join('mod_btk_adres_il as il', 'ilce.il_id', '=', 'il.id')
            ->select(
                'ilce.id', 
                'il.plaka_kodu',
                'ilce.ilce_adi',
                Capsule::raw("CONCAT(il.il_adi, ' - ', ilce.ilce_adi) as display_name")
            )
            ->orderBy('il.plaka_kodu')
            ->orderBy('ilce.ilce_adi')
            ->get()->map(fn($item) => (array)$item)->all();

        // Her ilçe için dosya adını oluştur
        foreach ($ilceler as &$ilce) {
            $cleanIlceAdi = strtolower(str_replace(' ', '_', $ilce['ilce_adi']));
            $cleanIlceAdi = strtr($cleanIlceAdi, $charMap);
            // "merkez" ilçeler genellikle il adıyla anılır, bu yüzden "merkez"i kaldır
            $cleanIlceAdi = str_replace('_merkez', '', $cleanIlceAdi);
            $ilce['ilce_kodu_str'] = $ilce['plaka_kodu'] . '_' . $cleanIlceAdi;
        }
        unset($ilce); // Referansla döngü bittikten sonra referansı temizle

        return $ilceler;
    }
}