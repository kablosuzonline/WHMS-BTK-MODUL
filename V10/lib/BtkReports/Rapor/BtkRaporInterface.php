<?php
/**
 * BTK Rapor Arayüzü (Interface)
 *
 * Bu arayüz, modül içerisindeki tüm rapor sınıflarının uyması gereken
 * ortak metotları ve "sözleşmeyi" tanımlar. Bu sayede, gelecekte yeni bir
 * rapor türü eklendiğinde bile sistemin tutarlı bir şekilde çalışması
 * garanti altına alınır.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    8.2.0
 */

namespace BtkReports\Rapor;

interface BtkRaporInterface
{
    /**
     * Raporu oluşturur, sıkıştırır ve belirtilen FTP sunucusuna gönderir.
     * Bu metot, bir raporun tam yaşam döngüsünü (veri toplama, formatlama,
     * dosya oluşturma, sıkıştırma ve gönderme) yönetir.
     *
     * @param string $ftpType Gönderimin yapılacağı FTP sunucusu ('main' veya 'backup').
     * @return array İşlem sonucunu içeren bir dizi.
     *               Başarılı ise: ['status' => true, 'message' => 'Başarı mesajı']
     *               Başarısız ise: ['status' => false, 'message' => 'Hata mesajı']
     *               Atlandıysa: ['status' => true, 'message' => 'Atlama nedeni', 'skipped' => true]
     */
    public function olusturVeGonder(string $ftpType = 'main'): array;

    /**
     * Raporu oluşturur ve yerel olarak indirilebilir bir dosyaya kaydeder.
     * Bu metot, manuel rapor oluşturma ve indirme işlevselliği için kullanılır.
     *
     * @param bool $outputToBrowser Eğer 'true' ise, dosyayı doğrudan tarayıcıya indirme olarak gönderir.
     *                              Eğer 'false' ise, dosyayı modülün güvenli temp klasörüne kaydeder ve yolunu döndürür.
     * @return array İşlem sonucunu içeren bir dizi.
     *               Başarılı ise: ['status' => true, 'message' => 'Başarı mesajı', 'file' => 'dosya_adi.gz', 'file_path' => '/tam/dosya/yolu.gz']
     *               Başarısız ise: ['status' => false, 'message' => 'Hata mesajı']
     */
    public function olusturVeIndir(bool $outputToBrowser = true): array;
}
?>