<?php
/**
 * BTK Raporlama Modülü - POP Noktası İzleme Sınıfı
 * Sürüm: 20.0.0 (Operasyon PHOENIX)
 *
 * Bu sınıf, tek bir POP noktasının canlı durumunu kontrol etmek için
 * gerekli olan teknik işlemleri (PING, Port Taraması) yürütür.
 * PopManager tarafından yönetilir ve btkreports_monitor_cron.php
 * tarafından tetiklenir.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.0.0
 */

namespace BtkReports\Monitor;

class PopMonitor
{
    private array $popData;
    private array $config;

    /**
     * PopMonitor constructor.
     *
     * @param array $popData İzlenecek POP noktasına ait veritabanı satırı.
     * @param array $config İzleme ayarları (timeout vb.).
     */
    public function __construct(array $popData, array $config)
    {
        $this->popData = $popData;
        $this->config = $config;
    }

    /**
     * POP noktasının izleme tipine göre ilgili kontrol metodunu çalıştırır.
     *
     * @return array Sonuç durumu, gecikme ve mesajı içeren bir dizi.
     */
    public function checkStatus(): array
    {
        $monitorType = $this->popData['izleme_tipi'] ?? 'PING';

        if ($monitorType === 'PORT') {
            return $this->checkPortStatus();
        }
        
        return $this->checkPingStatus();
    }

    /**
     * PING yöntemi ile POP noktasının durumunu kontrol eder.
     */
    private function checkPingStatus(): array
    {
        $ip = $this->popData['izleme_ip_adresi'];
        $timeout = (int)($this->config['timeout_sec'] ?? 2);
        
        // exec fonksiyonunun kullanılabilir olup olmadığını kontrol et
        if (!function_exists('exec')) {
            return $this->createResult('UNKNOWN', null, 'Sunucuda `exec` fonksiyonu devre dışı bırakılmış.');
        }

        // İşletim sistemine göre doğru PING komutunu kullan
        $command = (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN')
            ? "ping -n 1 -w " . ($timeout * 1000) . " " . escapeshellarg($ip) // Windows
            : "ping -c 1 -W " . $timeout . " " . escapeshellarg($ip);      // Linux/Unix

        exec($command, $output, $return_var);
        
        if ($return_var !== 0) {
            return $this->createResult('OFFLINE', null, 'Hedef IP adresine ulaşılamadı (Timeout veya Host Not Found).');
        }

        // Gecikme süresini (latency) yanıttan ayrıştır
        $latency = $this->parseLatencyFromPingOutput($output);
        
        if ($latency !== null && $latency > (int)($this->config['high_latency_threshold_ms'] ?? 500)) {
            return $this->createResult('HIGH_LATENCY', $latency, "Yanıt süresi ({$latency}ms) eşik değerini aştı.");
        }
        
        return $this->createResult('ONLINE', $latency, 'POP noktası çevrimiçi ve yanıt veriyor.');
    }

    /**
     * Port taraması yöntemi ile POP noktasının durumunu kontrol eder.
     */
    private function checkPortStatus(): array
    {
        $ip = $this->popData['izleme_ip_adresi'];
        $ports = array_filter(array_map('trim', explode(',', $this->popData['izleme_portlari'] ?? '')));
        $timeout = (int)($this->config['timeout_sec'] ?? 2);

        if (empty($ports)) {
            return $this->createResult('UNKNOWN', null, 'İzlenecek port tanımlanmamış.');
        }

        $openPorts = [];
        $closedPorts = [];

        foreach ($ports as $port) {
            if (!is_numeric($port) || $port < 1 || $port > 65535) continue;
            
            $startTime = microtime(true);
            $connection = @fsockopen($ip, (int)$port, $errno, $errstr, $timeout);
            $endTime = microtime(true);
            
            if (is_resource($connection)) {
                $latency = round(($endTime - $startTime) * 1000);
                $openPorts[] = "{$port} ({$latency}ms)";
                fclose($connection);
            } else {
                $closedPorts[] = $port;
            }
        }

        if (!empty($openPorts)) {
            $message = 'Açık port(lar): ' . implode(', ', $openPorts);
            if (!empty($closedPorts)) {
                 $message .= ' | Kapalı port(lar): ' . implode(', ', $closedPorts);
            }
            return $this->createResult('ONLINE', null, $message);
        } else {
            return $this->createResult('OFFLINE', null, 'Tüm portlar kapalı veya ulaşılamıyor: ' . implode(', ', $closedPorts));
        }
    }
    
    /**
     * PING komutunun çıktısından gecikme süresini (ms) ayrıştırır.
     */
    private function parseLatencyFromPingOutput(array $output): ?int
    {
        foreach ($output as $line) {
            // Linux/Unix formatı: time=12.3 ms
            if (preg_match('/time=([\d\.]+)\s*ms/i', $line, $matches)) {
                return (int)round((float)$matches[1]);
            }
            // Windows formatı: time=12ms
            if (preg_match('/time=([\d\.]+)\s*ms/i', $line, $matches)) {
                return (int)$matches[1];
            }
        }
        return null;
    }

    /**
     * Standart bir sonuç dizisi oluşturur.
     */
    private function createResult(string $status, ?int $latency, string $message): array
    {
        return [
            'status' => $status,
            'latency_ms' => $latency,
            'message' => $message
        ];
    }
}