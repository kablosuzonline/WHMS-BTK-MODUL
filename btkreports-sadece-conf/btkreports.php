<?php
/**
 * WHMCS BTK Raporlama Modülü
 * Version: 6.0.1 BETA
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

use WHMCS\Database\Capsule;

function btkreports_config() {
    return [
        "name" => "BTK Raporlama Modülü",
        "description" => "Bilgi Teknolojileri ve İletişim Kurumu (BTK) yasal raporlama süreçlerini yönetir.",
        "version" => "6.0.1", // Versiyonu güncelledim
        "author" => "KablosuzOnline & Gemini AI",
        "language" => "turkish",
    ];
}

function btkreports_activate() {
    try {
        $charset = Capsule::connection()->getConfig('charset');
        $collation = Capsule::connection()->getConfig('collation');
        if (!Capsule::schema()->hasTable('mod_btk_config')) {
            Capsule::schema()->create('mod_btk_config', function ($table) use ($charset, $collation) {
                $table->charset = $charset; $table->collation = $collation; $table->increments('id');
                $table->string('operator_kodu', 50)->nullable();
                $table->string('operator_adi', 100)->nullable()->comment('BTK dosya isimleri için');
                $table->string('operator_unvani', 255)->nullable()->comment('Personel listesi için');
                $table->text('secilen_yetki_turleri')->nullable()->comment('JSON array');
                $table->string('ftp_host', 255)->nullable(); $table->integer('ftp_port')->default(21)->nullable();
                $table->string('ftp_username', 100)->nullable(); $table->text('ftp_password')->nullable()->comment('Şifrelenecek');
                $table->string('ftp_path_rehber', 255)->default('/')->nullable(); $table->string('ftp_path_hareket', 255)->default('/')->nullable(); $table->string('ftp_path_personel', 255)->default('/')->nullable();
                $table->boolean('ftp_use_ssl')->default(false); $table->boolean('ftp_passive_mode')->default(true);
                $table->boolean('ftp_yedek_aktif')->default(false); $table->string('ftp_host_yedek', 255)->nullable();
                $table->integer('ftp_port_yedek')->default(21)->nullable(); $table->string('ftp_username_yedek', 100)->nullable();
                $table->text('ftp_password_yedek')->nullable()->comment('Şifrelenecek');
                $table->string('ftp_path_rehber_yedek', 255)->default('/')->nullable(); $table->string('ftp_path_hareket_yedek', 255)->default('/')->nullable(); $table->string('ftp_path_personel_yedek', 255)->default('/')->nullable();
                $table->boolean('ftp_use_ssl_yedek')->default(false); $table->boolean('ftp_passive_mode_yedek')->default(true);
                $table->string('cron_rehber_ay', 20)->default('1'); $table->string('cron_rehber_gun_hafta', 20)->default('*');
                $table->string('cron_rehber_saat', 2)->default('10'); $table->string('cron_rehber_dakika', 2)->default('00');
                $table->string('cron_hareket_ay', 20)->default('*'); $table->string('cron_hareket_gun_hafta', 20)->default('*');
                $table->string('cron_hareket_saat', 2)->default('01'); $table->string('cron_hareket_dakika', 2)->default('00');
                $table->string('cron_personel_ay', 20)->default('6,12'); $table->string('cron_personel_gun_ay', 20)->default('L');
                $table->string('cron_personel_saat', 2)->default('16'); $table->string('cron_personel_dakika', 2)->default('00');
                $table->boolean('bos_dosya_gonder')->default(false); $table->boolean('sil_tablolar_kaldirirken')->default(false);
                $table->boolean('nvi_tc_dogrulama_aktif')->default(true); $table->boolean('nvi_yabanci_dogrulama_aktif')->default(true);
                $table->string('log_level', 20)->default('INFO'); $table->timestamps();
            });
            if (Capsule::table('mod_btk_config')->count() == 0) {
                Capsule::table('mod_btk_config')->insert(['created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")]);
            }
            logActivity('BTK Raporlama Modülü: mod_btk_config tablosu oluşturuldu/kontrol edildi.', 0);
        }
        // Diğer referans tablolarının ve ana veri tablolarının (boş halleriyle) oluşturulması install.sql'den yapılacak.
        // _activate fonksiyonu sadece mod_btk_config'i garantiye alabilir.
        return ['status' => 'success', 'description' => 'BTK Raporlama Modülü etkinleştirildi. Lütfen "SQL Kurulum" dosyasındaki diğer tabloları oluşturup, "Başlangıç Verileri" SQL dosyasını çalıştırdıktan sonra "Modül Genel Ayarları" sayfasından yapılandırma yapınız.'];
    } catch (Exception $e) {
        logActivity('BTK Raporlama Modülü Etkinleştirme Hatası: ' . $e->getMessage(), 0);
        return ['status' => 'error', 'description' => 'Modül etkinleştirme hatası: ' . $e->getMessage()];
    }
}

function btkreports_deactivate() {
    // ... (deactivate fonksiyonu öncekiyle aynı) ...
    try {
        $config = null; if (Capsule::schema()->hasTable('mod_btk_config')) { $config = Capsule::table('mod_btk_config')->first(); }
        if ($config && $config->sil_tablolar_kaldirirken) {
            Capsule::schema()->dropIfExists('mod_btk_dosya_loglari'); Capsule::schema()->dropIfExists('mod_btk_product_group_map');
            Capsule::schema()->dropIfExists('mod_btk_personel'); Capsule::schema()->dropIfExists('mod_btk_abone_hareket_arsiv'); Capsule::schema()->dropIfExists('mod_btk_abone_hareket_canli');
            Capsule::schema()->dropIfExists('mod_btk_abone_rehber'); Capsule::schema()->dropIfExists('mod_btk_adres_mahalle');
            Capsule::schema()->dropIfExists('mod_btk_adres_ilce'); Capsule::schema()->dropIfExists('mod_btk_adres_il');
            Capsule::schema()->dropIfExists('mod_btk_ref_meslek_kodlari'); Capsule::schema()->dropIfExists('mod_btk_ref_kimlik_tipleri');
            Capsule::schema()->dropIfExists('mod_btk_ref_hizmet_tipleri'); Capsule::schema()->dropIfExists('mod_btk_ref_musteri_hareket_kodlari');
            Capsule::schema()->dropIfExists('mod_btk_ref_hat_durum_kodlari');
            Capsule::schema()->dropIfExists('mod_btk_config');
            logActivity('BTK Raporlama Modülü: Tüm tablolar silindi.', 0);
            return ['status' => 'success', 'description' => 'BTK Raporlama Modülü devre dışı bırakıldı ve tüm tablolar silindi.'];
        } else {
            logActivity('BTK Raporlama Modülü: Devre dışı bırakıldı, tablolar korundu.', 0);
            return ['status' => 'success', 'description' => 'BTK Raporlama Modülü devre dışı bırakıldı. Tablolar korundu.'];
        }
    } catch (Exception $e) {
        logActivity('BTK Raporlama Modülü Devre Dışı Bırakma Hatası: ' . $e->getMessage(), 0);
        return ['status' => 'error', 'description' => 'Modül devre dışı bırakma hatası: ' . $e->getMessage()];
    }
}


function btkreports_output($vars) {
    require_once __DIR__ . '/lib/btkhelper.php';

    $action = isset($_REQUEST['action']) ? htmlspecialchars(trim($_REQUEST['action'])) : 'dashboard';
    $LANG = $vars['_lang'];
    $csrfToken = generate_token('plain');
    $smartyvalues = ['modulelink' => $vars['modulelink'], 'version' => $vars['version'], 'LANG' => $LANG, 'csrfToken' => $csrfToken];

    $currentConfig = (array) Capsule::table('mod_btk_config')->first();
    if ($currentConfig) {
        $currentConfig['ftp_password_decrypted_placeholder'] = !empty($currentConfig['ftp_password']) ? '******** (Değiştirmek için yeni şifre girin)' : '';
        $currentConfig['ftp_password_yedek_decrypted_placeholder'] = !empty($currentConfig['ftp_password_yedek']) ? '******** (Değiştirmek için yeni şifre girin)' : '';
        $currentConfig['secilen_yetki_turleri_array'] = !empty($currentConfig['secilen_yetki_turleri']) ? json_decode($currentConfig['secilen_yetki_turleri'], true) : [];
    } else {
        $currentConfig = [];
         if ($action !== 'config' && $action !== 'activate_manual') { // activate_manual diye bir action ekleyebiliriz.
            $smartyvalues['errormessage'] = $LANG['btkreports_config_not_found'] ?? 'Modül yapılandırması bulunamadı. Lütfen önce ayarları kaydedin veya modülü yeniden etkinleştirin.';
            // Belki de config sayfasına yönlendirmek daha iyi olur.
            // header("Location: " . $vars['modulelink'] . "&action=config&error=config_missing");
            // exit;
        }
    }
    $smartyvalues['currentConfig'] = $currentConfig;


    switch ($action) {
        case 'config':
            // ... (config action'ının POST ve GET kısmı bir önceki TAM gönderimdekiyle aynı) ...
            if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_config'])) {
                if (!function_exists('check_token') || !check_token("WHMCS.admin.default")) {
                     $smartyvalues['errormessage'] = "Geçersiz CSRF token. İşlem reddedildi.";
                     $smartyvalues['btkYetkiTurleri'] = getBtkYetkiTurleriListesi($LANG);
                     $templateFile = 'config';
                     break;
                }
                $configData = [];
                $configData['operator_kodu'] = isset($_POST['operator_kodu']) ? trim($_POST['operator_kodu']) : null;
                $configData['operator_adi'] = isset($_POST['operator_adi']) ? trim($_POST['operator_adi']) : null;
                $configData['operator_unvani'] = isset($_POST['operator_unvani']) ? trim($_POST['operator_unvani']) : null;
                $secilenYetkiler = isset($_POST['secilen_yetki_turleri']) && is_array($_POST['secilen_yetki_turleri']) ? $_POST['secilen_yetki_turleri'] : [];
                $configData['secilen_yetki_turleri'] = json_encode($secilenYetkiler);
                $configData['ftp_host'] = isset($_POST['ftp_host']) ? trim($_POST['ftp_host']) : null;
                $configData['ftp_port'] = isset($_POST['ftp_port']) ? (int)$_POST['ftp_port'] : 21;
                $configData['ftp_username'] = isset($_POST['ftp_username']) ? trim($_POST['ftp_username']) : null;
                if (isset($_POST['ftp_password'])) { if (trim($_POST['ftp_password']) === '') { $dbVals = (array) Capsule::table('mod_btk_config')->where('id', 1)->first(['ftp_password']); $configData['ftp_password'] = isset($dbVals['ftp_password']) ? $dbVals['ftp_password'] : null; } else { $configData['ftp_password'] = encrypt(trim($_POST['ftp_password'])); } }
                $configData['ftp_path_rehber'] = isset($_POST['ftp_path_rehber']) ? rtrim(trim($_POST['ftp_path_rehber']), '/') . '/' : '/';
                $configData['ftp_path_hareket'] = isset($_POST['ftp_path_hareket']) ? rtrim(trim($_POST['ftp_path_hareket']), '/') . '/' : '/';
                $configData['ftp_path_personel'] = isset($_POST['ftp_path_personel']) ? rtrim(trim($_POST['ftp_path_personel']), '/') . '/' : '/';
                $configData['ftp_use_ssl'] = isset($_POST['ftp_use_ssl']) ? 1 : 0;
                $configData['ftp_passive_mode'] = isset($_POST['ftp_passive_mode']) ? 1 : 0;
                $configData['ftp_yedek_aktif'] = isset($_POST['ftp_yedek_aktif']) ? 1 : 0;
                $configData['ftp_host_yedek'] = isset($_POST['ftp_host_yedek']) ? trim($_POST['ftp_host_yedek']) : null;
                $configData['ftp_port_yedek'] = isset($_POST['ftp_port_yedek']) ? (int)$_POST['ftp_port_yedek'] : 21;
                $configData['ftp_username_yedek'] = isset($_POST['ftp_username_yedek']) ? trim($_POST['ftp_username_yedek']) : null;
                if (isset($_POST['ftp_password_yedek'])) { if (trim($_POST['ftp_password_yedek']) === '') { $dbVals = (array) Capsule::table('mod_btk_config')->where('id', 1)->first(['ftp_password_yedek']); $configData['ftp_password_yedek'] = isset($dbVals['ftp_password_yedek']) ? $dbVals['ftp_password_yedek'] : null; } else { $configData['ftp_password_yedek'] = encrypt(trim($_POST['ftp_password_yedek'])); } }
                $configData['ftp_path_rehber_yedek'] = isset($_POST['ftp_path_rehber_yedek']) ? rtrim(trim($_POST['ftp_path_rehber_yedek']), '/') . '/' : '/';
                $configData['ftp_path_hareket_yedek'] = isset($_POST['ftp_path_hareket_yedek']) ? rtrim(trim($_POST['ftp_path_hareket_yedek']), '/') . '/' : '/';
                $configData['ftp_path_personel_yedek'] = isset($_POST['ftp_path_personel_yedek']) ? rtrim(trim($_POST['ftp_path_personel_yedek']), '/') . '/' : '/';
                $configData['ftp_use_ssl_yedek'] = isset($_POST['ftp_use_ssl_yedek']) ? 1 : 0;
                $configData['ftp_passive_mode_yedek'] = isset($_POST['ftp_passive_mode_yedek']) ? 1 : 0;
                $configData['cron_rehber_ay'] = isset($_POST['cron_rehber_ay']) ? trim($_POST['cron_rehber_ay']) : '1';
                $configData['cron_rehber_gun_hafta'] = isset($_POST['cron_rehber_gun_hafta']) ? trim($_POST['cron_rehber_gun_hafta']) : '*';
                $configData['cron_rehber_saat'] = isset($_POST['cron_rehber_saat']) ? trim($_POST['cron_rehber_saat']) : '10';
                $configData['cron_rehber_dakika'] = isset($_POST['cron_rehber_dakika']) ? trim($_POST['cron_rehber_dakika']) : '00';
                $configData['cron_hareket_ay'] = isset($_POST['cron_hareket_ay']) ? trim($_POST['cron_hareket_ay']) : '*';
                $configData['cron_hareket_gun_hafta'] = isset($_POST['cron_hareket_gun_hafta']) ? trim($_POST['cron_hareket_gun_hafta']) : '*';
                $configData['cron_hareket_saat'] = isset($_POST['cron_hareket_saat']) ? trim($_POST['cron_hareket_saat']) : '01';
                $configData['cron_hareket_dakika'] = isset($_POST['cron_hareket_dakika']) ? trim($_POST['cron_hareket_dakika']) : '00';
                $configData['cron_personel_ay'] = isset($_POST['cron_personel_ay']) ? trim($_POST['cron_personel_ay']) : '6,12';
                $configData['cron_personel_gun_ay'] = isset($_POST['cron_personel_gun_ay']) ? trim($_POST['cron_personel_gun_ay']) : 'L';
                $configData['cron_personel_saat'] = isset($_POST['cron_personel_saat']) ? trim($_POST['cron_personel_saat']) : '16';
                $configData['cron_personel_dakika'] = isset($_POST['cron_personel_dakika']) ? trim($_POST['cron_personel_dakika']) : '00';
                $configData['bos_dosya_gonder'] = isset($_POST['bos_dosya_gonder']) ? 1 : 0;
                $configData['sil_tablolar_kaldirirken'] = isset($_POST['sil_tablolar_kaldirirken']) ? 1 : 0;
                $configData['nvi_tc_dogrulama_aktif'] = isset($_POST['nvi_tc_dogrulama_aktif']) ? 1 : 0;
                $configData['nvi_yabanci_dogrulama_aktif'] = isset($_POST['nvi_yabanci_dogrulama_aktif']) ? 1 : 0;
                $configData['log_level'] = isset($_POST['log_level']) ? trim($_POST['log_level']) : 'INFO';
                $configData['updated_at'] = date("Y-m-d H:i:s");
               try { Capsule::table('mod_btk_config')->where('id', 1)->update($configData); $smartyvalues['successmessage'] = $LANG['btkreports_ayarlar_kaydedildi']; logActivity('BTK Raporlama Modülü: Ayarlar güncellendi. Kaydedilen Data: ' . json_encode($configData), 0);
               } catch (Exception $e) { $smartyvalues['errormessage'] = $LANG['btkreports_hata_ayarlar_kaydedilemedi'] . ' ' . $e->getMessage(); logActivity('BTK Raporlama Modülü: Ayar kaydetme hatası - ' . $e->getMessage(), 0); }
                // Ayarları POST sonrası tekrar yükle
                $currentConfig = (array) Capsule::table('mod_btk_config')->first();
                if ($currentConfig) {
                    $currentConfig['ftp_password_decrypted_placeholder'] = !empty($currentConfig['ftp_password']) ? '******** (Değiştirmek için yeni şifre girin)' : '';
                    $currentConfig['ftp_password_yedek_decrypted_placeholder'] = !empty($currentConfig['ftp_password_yedek']) ? '******** (Değiştirmek için yeni şifre girin)' : '';
                    $currentConfig['secilen_yetki_turleri_array'] = !empty($currentConfig['secilen_yetki_turleri']) ? json_decode($currentConfig['secilen_yetki_turleri'], true) : [];
                } else { $currentConfig = []; }
                $smartyvalues['currentConfig'] = $currentConfig;
            }
            $smartyvalues['btkYetkiTurleri'] = getBtkYetkiTurleriListesi($LANG);
            $templateFile = 'config';
            break;

        case 'ftp_test':
            // ... (ftp_test action'ı önceki TAM gönderimdekiyle aynı) ...
            logActivity("BTK FTP Test - Gelen AJAX POST Verisi: " . json_encode($_POST));
            header('Content-Type: application/json');
            if (!function_exists('check_token') || !check_token("WHMCS.admin.default")) { echo json_encode(['status' => 'error', 'message' => 'Geçersiz CSRF token.']); exit;}
            $ftpType = isset($_POST['ftp_type']) ? $_POST['ftp_type'] : 'ana'; $params = [];
            // $currentConfigFromDB = (array) Capsule::table('mod_btk_config')->first(); // Zaten yukarıda $currentConfig olarak alındı
            if ($ftpType === 'ana') {
                $params['host'] = isset($_POST['ftp_host']) ? trim($_POST['ftp_host']) : '';
                $params['port'] = isset($_POST['ftp_port']) ? (int)$_POST['ftp_port'] : 21;
                $params['username'] = isset($_POST['ftp_username']) ? trim($_POST['ftp_username']) : '';
                $formPassword = isset($_POST['ftp_password']) ? trim($_POST['ftp_password']) : null;
                $params['password'] = ($formPassword !== null && $formPassword !== '') ? $formPassword : (!empty($currentConfig['ftp_password']) ? decrypt($currentConfig['ftp_password']) : '');
                $params['use_ssl'] = isset($_POST['ftp_use_ssl']) && filter_var($_POST['ftp_use_ssl'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
                $params['passive_mode'] = isset($_POST['ftp_passive_mode']) && filter_var($_POST['ftp_passive_mode'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            } else {
                $params['host'] = isset($_POST['ftp_host_yedek']) ? trim($_POST['ftp_host_yedek']) : '';
                $params['port'] = isset($_POST['ftp_port_yedek']) ? (int)$_POST['ftp_port_yedek'] : 21;
                $params['username'] = isset($_POST['ftp_username_yedek']) ? trim($_POST['ftp_username_yedek']) : '';
                $formPasswordYedek = isset($_POST['ftp_password_yedek']) ? trim($_POST['ftp_password_yedek']) : null;
                $params['password'] = ($formPasswordYedek !== null && $formPasswordYedek !== '') ? $formPasswordYedek : (!empty($currentConfig['ftp_password_yedek']) ? decrypt($currentConfig['ftp_password_yedek']) : '');
                $params['use_ssl'] = isset($_POST['ftp_use_ssl_yedek']) && filter_var($_POST['ftp_use_ssl_yedek'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
                $params['passive_mode'] = isset($_POST['ftp_passive_mode_yedek']) && filter_var($_POST['ftp_passive_mode_yedek'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            }
            if (empty($params['host'])) { logActivity("BTK FTP Test Hatası ({$ftpType}): Host boş."); echo json_encode(['status' => 'error', 'message' => ($ftpType === 'ana' ? $LANG['btkreports_ana_ftp_sunucusu_bilgileri'] : $LANG['btkreports_yedek_ftp_sunucusu_bilgileri']) . ' - Host boş olamaz.']); exit; }
            if (empty($params['username'])) { logActivity("BTK FTP Test Hatası ({$ftpType}): Kullanıcı adı boş."); echo json_encode(['status' => 'error', 'message' => ($ftpType === 'ana' ? $LANG['btkreports_ana_ftp_sunucusu_bilgileri'] : $LANG['btkreports_yedek_ftp_sunucusu_bilgileri']) . ' - Kullanıcı Adı boş olamaz.']); exit; }
            logActivity("BTK FTP Test - BtkHelper'a Gönderilen Parametreler ({$ftpType}): " . json_encode($params));
            $result = BtkHelper::testFtpConnection($params);
            logActivity("BTK FTP Test - BtkHelper Sonucu ({$ftpType}): " . json_encode($result));
            echo json_encode($result); exit;

        case 'dashboard':
        default:
            $ftpDurumu = ['ana' => ['status' => null, 'message' => ''], 'yedek' => ['status' => null, 'message' => '']];
            $sonGonderimler = ['rehber' => ($LANG['btk_veri_yok'] ?? 'Veri Yok'), 'hareket' => ($LANG['btk_veri_yok'] ?? 'Veri Yok'), 'personel' => ($LANG['btk_veri_yok'] ?? 'Veri Yok')];

            if ($currentConfig && !empty($currentConfig['operator_kodu'])) { // Sadece operatör kodu girilmişse FTP testi yap
                if (!empty($currentConfig['ftp_host']) && !empty($currentConfig['ftp_username'])) {
                    $ftpParamsAna = [ /* ... parametreler ... */
                        'host' => $currentConfig['ftp_host'], 'port' => (int)$currentConfig['ftp_port'],
                        'username' => $currentConfig['ftp_username'], 'password' => !empty($currentConfig['ftp_password']) ? decrypt($currentConfig['ftp_password']) : '',
                        'use_ssl' => (bool)$currentConfig['ftp_use_ssl'], 'passive_mode' => (bool)$currentConfig['ftp_passive_mode'] ];
                    $ftpDurumu['ana'] = BtkHelper::testFtpConnection($ftpParamsAna);
                } else { $ftpDurumu['ana']['status'] = 'error'; $ftpDurumu['ana']['message'] = $LANG['btkreports_ftp_ayarlari_eksik_ana'] ?? 'Ana FTP ayarları eksik.'; }

                if (!empty($currentConfig['ftp_yedek_aktif']) && !empty($currentConfig['ftp_host_yedek']) && !empty($currentConfig['ftp_username_yedek'])) {
                    $ftpParamsYedek = [ /* ... parametreler ... */
                        'host' => $currentConfig['ftp_host_yedek'], 'port' => (int)$currentConfig['ftp_port_yedek'],
                        'username' => $currentConfig['ftp_username_yedek'], 'password' => !empty($currentConfig['ftp_password_yedek']) ? decrypt($currentConfig['ftp_password_yedek']) : '',
                        'use_ssl' => (bool)$currentConfig['ftp_use_ssl_yedek'], 'passive_mode' => (bool)$currentConfig['ftp_passive_mode_yedek'] ];
                    $ftpDurumu['yedek'] = BtkHelper::testFtpConnection($ftpParamsYedek);
                } elseif (!empty($currentConfig['ftp_yedek_aktif'])) { $ftpDurumu['yedek']['status'] = 'error'; $ftpDurumu['yedek']['message'] = $LANG['btkreports_ftp_ayarlari_eksik_yedek'] ?? 'Yedek FTP ayarları eksik.'; }
            } else {
                 $ftpDurumu['ana']['message'] = $LANG['btkreports_once_config_yapin'] ?? 'Lütfen önce modül ayarlarını yapılandırın.';
                 $ftpDurumu['yedek']['message'] = ''; // Yedek için de aynı durum geçerli olabilir
            }
            $smartyvalues['ftpDurumu'] = $ftpDurumu;

            if (Capsule::schema()->hasTable('mod_btk_dosya_loglari')) {
                $lastRehber = Capsule::table('mod_btk_dosya_loglari')->where('dosya_tipi', 'REHBER')->where('ftp_ana_yuklenme_durumu', 1)->orderBy('olusturulma_zamani_rapor', 'desc')->first();
                if ($lastRehber) $sonGonderimler['rehber'] = date('d.m.Y H:i:s', strtotime($lastRehber->olusturulma_zamani_rapor));
                $lastHareket = Capsule::table('mod_btk_dosya_loglari')->where('dosya_tipi', 'HAREKET')->where('ftp_ana_yuklenme_durumu', 1)->orderBy('olusturulma_zamani_rapor', 'desc')->first();
                if ($lastHareket) $sonGonderimler['hareket'] = date('d.m.Y H:i:s', strtotime($lastHareket->olusturulma_zamani_rapor));
                $lastPersonel = Capsule::table('mod_btk_dosya_loglari')->where('dosya_tipi', 'PERSONEL')->where('ftp_ana_yuklenme_durumu', 1)->orderBy('olusturulma_zamani_rapor', 'desc')->first();
                if ($lastPersonel) $sonGonderimler['personel'] = date('d.m.Y H:i:s', strtotime($lastPersonel->olusturulma_zamani_rapor));
            }
            $smartyvalues['sonGonderimler'] = $sonGonderimler;
            $templateFile = 'index';
            break;
        // Diğer case'ler buraya eklenecek
    }
    // ... (Smarty render kısmı aynı) ...
    $smarty = new \WHMCS\Smarty(true); $moduleTemplateDir = ROOTDIR . '/modules/addons/btkreports/templates/admin/';
    foreach ($smartyvalues as $key => $value) { $smarty->assign($key, $value); }
    try {
        $templatePath = $moduleTemplateDir . $templateFile . '.tpl';
        if (file_exists($templatePath)) { echo $smarty->fetch($templatePath); }
        else { echo '<div class="alert alert-danger">Template dosyası bulunamadı: ' . $templatePath . '</div>'; }
    } catch (Exception $e) {
        logModuleCall('btkreports', $action, $smartyvalues, $e->getMessage(), $e->getTraceAsString());
        echo '<div class="alert alert-danger">Arayüz hatası: ' . $e->getMessage() . '</div>';
    }
}

function getBtkYetkiTurleriListesi($LANG) {
    // ... (getBtkYetkiTurleriListesi fonksiyonu öncekiyle aynı) ...
    $yetkiTurleri = [
        'AIH_B' => isset($LANG['btk_yetki_aih_b']) ? $LANG['btk_yetki_aih_b'] : 'Altyapı İşletmeciliği Hizmeti (B)',
        'AIH_K' => isset($LANG['btk_yetki_aih_k']) ? $LANG['btk_yetki_aih_k'] : 'Altyapı İşletmeciliği Hizmeti (K)',
        'CTH_IMTIYAZ' => isset($LANG['btk_yetki_cth_imtiyaz']) ? $LANG['btk_yetki_cth_imtiyaz'] : 'Çeşitli Telekomünikasyon Hizmetleri (İmtiyaz Sözleşmesi)',
        'GMPCS_MT_B' => isset($LANG['btk_yetki_gmpcs_mt_b']) ? $LANG['btk_yetki_gmpcs_mt_b'] : 'GMPCS Mobil Telefon Hizmeti (B)',
        'GMPCS_MT_K' => isset($LANG['btk_yetki_gmpcs_mt_k']) ? $LANG['btk_yetki_gmpcs_mt_k'] : 'GMPCS Mobil Telefon Hizmeti (K)',
        'GSM_IMTIYAZ' => isset($LANG['btk_yetki_gsm_imtiyaz']) ? $LANG['btk_yetki_gsm_imtiyaz'] : 'GSM (İmtiyaz Sözleşmesi)',
        'HT_GSM1800_B' => isset($LANG['btk_yetki_ht_gsm1800_b']) ? $LANG['btk_yetki_ht_gsm1800_b'] : 'Hava Taşıtlarında GSM 1800 Mobil Telefon Hizmeti (B)',
        'IMT_SSKHYB' => isset($LANG['btk_yetki_imt_sskhyb']) ? $LANG['btk_yetki_imt_sskhyb'] : 'IMT (Sayısı Sınırlandırılmış Kullanım Hakkı Yetki Belgesi)',
        'IMT2000_UMTS_IMTIYAZ' => isset($LANG['btk_yetki_imt2000_umts_imtiyaz']) ? $LANG['btk_yetki_imt2000_umts_imtiyaz'] : 'IMT-2000/UMTS (İmtiyaz Sözleşmesi)',
        'ISS_B' => isset($LANG['btk_yetki_iss_b']) ? $LANG['btk_yetki_iss_b'] : 'İnternet Servis Sağlayıcılığı (B)',
        'KABLOYAYIN_B' => isset($LANG['btk_yetki_kabloyayin_b']) ? $LANG['btk_yetki_kabloyayin_b'] : 'Kablolu Yayın Hizmeti (B)',
        'OKTH_K' => isset($LANG['btk_yetki_okth_k']) ? $LANG['btk_yetki_okth_k'] : 'Ortak Kullanımlı Telsiz Hizmeti (K)',
        'REHBERLIK_K' => isset($LANG['btk_yetki_rehberlik_k']) ? $LANG['btk_yetki_rehberlik_k'] : 'Rehberlik Hizmeti (K)',
        'STH_B' => isset($LANG['btk_yetki_sth_b']) ? $LANG['btk_yetki_sth_b'] : 'Sabit Telefon Hizmeti (B)',
        'STH_K' => isset($LANG['btk_yetki_sth_k']) ? $LANG['btk_yetki_sth_k'] : 'Sabit Telefon Hizmeti (K)',
        'SMSH_B' => isset($LANG['btk_yetki_smsh_b']) ? $LANG['btk_yetki_smsh_b'] : 'Sanal Mobil Şebeke Hizmeti (B)',
        'SMSH_K' => isset($LANG['btk_yetki_smsh_k']) ? $LANG['btk_yetki_smsh_k'] : 'Sanal Mobil Şebeke Hizmeti (K)',
        'UYDUHAB_B' => isset($LANG['btk_yetki_uyduhab_b']) ? $LANG['btk_yetki_uyduhab_b'] : 'Uydu Haberleşme Hizmeti (B)',
        'UYDUPLAT_B' => isset($LANG['btk_yetki_uyduplat_b']) ? $LANG['btk_yetki_uyduplat_b'] : 'Uydu Platform Hizmeti (B)',
        'UYDUKABLOTV' => isset($LANG['btk_yetki_uydukablatv']) ? $LANG['btk_yetki_uydukablatv'] : 'Uydu ve Kablo TV Hizmetleri',
    ];
    return $yetkiTurleri;
}
?>