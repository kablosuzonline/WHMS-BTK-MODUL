<?php
/**
 * POP Noktası İzleyici Sınıfı
 *
 * Tek bir POP noktasını izlemekten, ping atarak canlı durumunu ve gecikmesini
 * kontrol etmekten sorumludur.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    8.2.0
 */

namespace BtkReports\Monitor;

class PopMonitor
{
    private array $pop;
    private array $config;

    /**
     * PopMonitor constructor.
     *
     * @param array $pop İzlenecek POP verilerini içeren dizi (veritabanı satırı).
     * @param array $config İzleme ayarlarını içeren dizi (timeout, threshold vb.).
     */
    public function __construct(array $pop, array $config)
    {
        $this->pop = $pop;
        $this->config = $config;
    }

    /**
     * POP noktasının canlı durumunu ping atarak kontrol eder.
     *
     * @return array Sonucu içeren bir dizi:
     *               ['status' => 'ONLINE'|'OFFLINE'|'HIGH_LATENCY'|'UNKNOWN', 'latency' => int|null, 'detail' => string|null]
     */
    public function checkStatus(): array
    {
        $ipToPing = $this->pop['izleme_ip_adresi'] ?: $this->pop['ip_adresi'];
        if (empty($ipToPing) || !filter_var($ipToPing, FILTER_VALIDATE_IP)) {
            return ['status' => 'UNKNOWN', 'latency' => null, 'detail' => 'İzlenecek geçerli bir IP adresi tanımlı değil.'];
        }

        if (!function_exists('exec')) {
            return ['status' => 'UNKNOWN', 'latency' => null, 'detail' => 'Sunucuda `exec()` fonksiyonu kapalı veya güvenlik kısıtlamaları nedeniyle kullanılamıyor.'];
        }

        $timeout = (int)($this->config['timeout_sec'] ?? 2);
        $latency = null;
        $output = [];
        $return_var = 1; // Başarısızlık varsayımı

        // Güvenlik: Kullanıcı girdisi olmayan, sabit komutlar kullan.
        // Platforma göre doğru ping komutunu seç.
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            // Windows için: -n 1 (1 paket gönder), -w TIMEOUT (milisaniye)
            $command = sprintf('ping -n 1 -w %d %s', $timeout * 1000, escapeshellarg($ipToPing));
        } else {
            // Linux/macOS için: -c 1 (1 paket gönder), -W TIMEOUT (saniye)
            $command = sprintf('ping -c 1 -W %d %s', $timeout, escapeshellarg($ipToPing));
        }

        // exec() fonksiyonunu güvenlik nedeniyle @ ile bastırıyoruz, hataları kendimiz yöneteceğiz.
        @exec($command, $output, $return_var);
        
        $fullOutput = implode("\n", $output);

        // $return_var === 0, komutun başarıyla çalıştığı anlamına gelir (ping yanıtı alındı).
        if ($return_var === 0) {
            // Farklı dillerdeki ve işletim sistemlerindeki ping çıktılarını yakalamak için genel bir regex.
            if (preg_match('/time[=<]([0-9\.]+)\s*ms/i', $fullOutput, $matches)) {
                $latency = round((float)$matches[1]);
                $highLatencyThreshold = (int)($this->config['high_latency_threshold_ms'] ?? 500);
                
                if ($latency > $highLatencyThreshold) {
                    return ['status' => 'HIGH_LATENCY', 'latency' => $latency, 'detail' => "Gecikme ({$latency}ms) eşik değerini ({$highLatencyThreshold}ms) aştı."];
                }
                
                return ['status' => 'ONLINE', 'latency' => $latency, 'detail' => 'Cihaz erişilebilir.'];
            }
            
            // Ping başarılı ama gecikme süresi parse edilemediyse (beklenmedik durum)
            return ['status' => 'ONLINE', 'latency' => null, 'detail' => 'Cihaz erişilebilir ancak gecikme süresi ayrıştırılamadı.'];
        }
        
        // Ping komutu başarısız olduysa (timeout veya host bulunamadı)
        return ['status' => 'OFFLINE', 'latency' => null, 'detail' => 'Cihaza erişilemedi (Zaman aşımı veya ulaşılamıyor).'];
    }
}
?>