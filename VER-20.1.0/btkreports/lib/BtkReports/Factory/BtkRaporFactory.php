<?php
/**
 * BTK Raporlama Modülü - Rapor Üretici Fabrikası (Factory)
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX)
 *
 * ANKA-PHOENIX Sürüm Notları:
 * - Hata yönetimi, merkezi LogManager ile tam entegre hale getirildi.
 * - Desteklenmeyen bir rapor türü istendiğinde daha bilgilendirici bir
 *   hata mesajı oluşturuldu.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

namespace BtkReports\Factory;

use BtkReports\Rapor\BtkRaporInterface;
use BtkReports\Rapor\AboneRehberRapor;
use BtkReports\Rapor\AboneHareketRapor;
use BtkReports\Rapor\PersonelRapor;
use BtkReports\Manager\FtpManager;
use BtkReports\Manager\LogManager;

class BtkRaporFactory
{
    /**
     * Verilen rapor türüne göre ilgili rapor sınıfının bir nesnesini oluşturur.
     * Bu, "Factory Method" tasarım deseninin temelini oluşturur; yeni rapor
     * türleri eklemek için sadece bu `switch` bloğunu değiştirmek yeterlidir.
     *
     * @param string $raporTuru Oluşturulacak raporun türü (REHBER, HAREKET, PERSONEL).
     * @param array $settings Modülün genel ayarları.
     * @param FtpManager $ftpManager FTP işlemlerini yönetecek nesne.
     * @param string|null $yetkiTuruGrup Raporun ait olduğu yetki grubu (örn: ISS, STH).
     *                                   Personel raporu için bu değer null'dır.
     *
     * @return BtkRaporInterface İstenen rapor türü için oluşturulmuş nesne.
     * @throws \InvalidArgumentException Eğer geçersiz veya desteklenmeyen bir rapor türü istenirse.
     */
    public static function create(string $raporTuru, array $settings, FtpManager $ftpManager, ?string $yetkiTuruGrup = null): BtkRaporInterface
    {
        // Gelen rapor türünü, karşılaştırmada tutarlılık sağlamak için
        // her zaman büyük harfe çevir.
        $raporTuru = strtoupper($raporTuru);

        switch ($raporTuru) {
            case 'REHBER':
                return new AboneRehberRapor($raporTuru, $settings, $ftpManager, $yetkiTuruGrup);
            
            case 'HAREKET':
                return new AboneHareketRapor($raporTuru, $settings, $ftpManager, $yetkiTuruGrup);
            
            case 'PERSONEL':
                // Personel raporu bir yetki grubuna bağlı değildir, bu nedenle
                // $yetkiTuruGrup parametresi her zaman null olarak iletilir.
                return new PersonelRapor($raporTuru, $settings, $ftpManager, null);
            
            default:
                // Eğer `REHBER`, `HAREKET` veya `PERSONEL` dışında bir değer gelirse,
                // bu bir programlama hatasıdır. Hata fırlatarak durumu logla ve
                // geliştiriciyi bilgilendir.
                $errorMessage = "Geçersiz veya desteklenmeyen rapor türü istendi: {$raporTuru}";
                LogManager::logAction('Rapor Fabrikası Hatası', 'HATA', $errorMessage);
                throw new \InvalidArgumentException($errorMessage);
        }
    }
}