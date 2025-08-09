<?php
/**
 * BTK Raporlama Modülü - Rapor Arayüzü (Interface)
 * Sürüm: 20.0.0 (Operasyon PHOENIX)
 *
 * Bu arayüz, modül içinde oluşturulacak tüm rapor sınıflarının (Abone Rehber,
 * Abone Hareket, Personel vb.) uyması gereken zorunlu metodları tanımlar.
 * Bu sayede, BtkRaporFactory sınıfı, hangi rapor türü istenirse istensin,
 * aynı standart metodları çağırabileceğinden emin olur. "Strategy"
 * tasarım deseninin bir parçasıdır.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.0.0
 */

namespace BtkReports\Rapor;

interface BtkRaporInterface
{
    /**
     * Raporu oluşturur, geçici bir dosyaya yazar ve indirme linkini döner.
     *
     * Bu metod, "Oluştur ve İndir" butonuna basıldığında tetiklenir.
     * Rapor içeriğini hazırlar, bir dosyaya yazar ve bu dosyanın
     * indirilmesi için gerekli bilgileri içeren bir dizi döndürür.
     *
     * @param bool $isPersonelRaporu Personel raporu için özel formatlama gerekip gerekmediğini belirtir.
     * @return array Başarı durumu, mesaj ve indirme linkini içeren bir dizi.
     */
    public function olusturVeIndir(bool $isPersonelRaporu = false): array;

    /**
     * Raporu oluşturur ve belirtilen FTP sunucusuna (Ana veya Yedek) gönderir.
     *
     * Bu metod, cron job'lar tarafından otomatik olarak veya yönetici panelindeki
     * "Oluştur ve Gönder" butonlarıyla tetiklenir. Rapor içeriğini hazırlar,
     * bir dosyaya yazar ve bu dosyayı FtpManager aracılığıyla ilgili sunucuya
     * yüklemeyi dener. Sonucu bir dizi olarak döndürür.
     *
     * @param string $ftpType Gönderim yapılacak sunucunun tipi ('main' veya 'backup').
     * @return array Başarı durumu ve mesajı içeren bir dizi.
     */
    public function olusturVeGonder(string $ftpType): array;
}