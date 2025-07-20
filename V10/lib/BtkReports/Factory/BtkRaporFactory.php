<?php
/**
 * Rapor Sınıflarını Oluşturan Fabrika (Factory)
 *
 * Gelen rapor türü (string) bilgisine göre ilgili rapor nesnesini oluşturur ve döndürür.
 * Bu, rapor oluşturma mantığını merkezileştirir ve kodu sadeleştirir.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    8.2.0
 */

namespace BtkReports\Factory;

use BtkReports\Rapor\AboneRehberRapor;
use BtkReports\Rapor\AboneHareketRapor;
use BtkReports\Rapor\PersonelRapor;
use BtkReports\Rapor\BtkRaporInterface;
use BtkReports\Manager\FtpManager;

class BtkRaporFactory
{
    /**
     * Verilen parametrelere göre uygun BTK Raporu nesnesini oluşturur.
     *
     * @param string $raporTuru Oluşturulacak raporun türü ('REHBER', 'HAREKET', 'PERSONEL').
     * @param array $settings Modülün genel ayarları.
     * @param FtpManager $ftpManager FTP işlemlerini yönetecek olan FtpManager nesnesi.
     * @param string|null $yetkiGrup Raporun ait olduğu yetki grubu ('ISS', 'STH' vb.). Personel raporu için null olabilir.
     * @return BtkRaporInterface Oluşturulan rapor nesnesi.
     * @throws \InvalidArgumentException Bilinmeyen bir rapor türü istendiğinde veya gerekli parametre eksik olduğunda.
     */
    public static function create(string $raporTuru, array $settings, FtpManager $ftpManager, ?string $yetkiGrup = null): BtkRaporInterface
    {
        switch (strtoupper($raporTuru)) {
            case 'REHBER':
                if (empty($yetkiGrup)) {
                    throw new \InvalidArgumentException("REHBER raporu için Yetki Grubu belirtilmelidir.");
                }
                return new AboneRehberRapor($settings, $ftpManager, $yetkiGrup);

            case 'HAREKET':
                if (empty($yetkiGrup)) {
                    throw new \InvalidArgumentException("HAREKET raporu için Yetki Grubu belirtilmelidir.");
                }
                return new AboneHareketRapor($settings, $ftpManager, $yetkiGrup);

            case 'PERSONEL':
                // Personel raporu için yetki grubu gerekmez.
                return new PersonelRapor($settings, $ftpManager, null);

            default:
                throw new \InvalidArgumentException("Bilinmeyen rapor türü istendi: {$raporTuru}");
        }
    }
}
?>