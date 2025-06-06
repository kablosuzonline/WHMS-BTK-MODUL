<?php
/**
 * WHMCS BTK Raporlama Modülü
 * Version: 6.0.5 (hasForeignKey hatası düzeltildi)
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

use WHMCS\Database\Capsule;

function btkreports_config() {
    return [
        "name" => "BTK Raporlama Modülü",
        "description" => "Bilgi Teknolojileri ve İletişim Kurumu (BTK) yasal raporlama süreçlerini yönetir.",
        "version" => "6.0.5", // Versiyon güncellendi
        "author" => "KablosuzOnline & Gemini AI",
        "language" => "turkish",
    ];
}

function btkreports_activate() {
    $logDescription = 'BTK Raporlama Modülü etkinleştirme: ';
    try {
        $charset = Capsule::connection()->getConfig('charset') ?: 'utf8mb4';
        $collation = Capsule::connection()->getConfig('collation') ?: 'utf8mb4_unicode_ci';
        $schema = Capsule::schema();

        $tablesToCreate = [
            'mod_btk_config' => function ($table) use ($charset, $collation) {
                $table->charset = $charset; $table->collation = $collation; $table->increments('id');
                $table->string('operator_kodu', 50)->nullable(); $table->string('operator_adi', 100)->nullable()->comment('BTK dosya isimleri için');
                $table->string('operator_unvani', 255)->nullable()->comment('Personel listesi için'); $table->text('secilen_yetki_turleri')->nullable()->comment('JSON array');
                $table->string('ftp_host', 255)->nullable(); $table->integer('ftp_port')->default(21)->nullable(); $table->string('ftp_username', 100)->nullable(); $table->text('ftp_password')->nullable()->comment('Şifrelenecek');
                $table->string('ftp_path_rehber', 255)->default('/')->nullable(); $table->string('ftp_path_hareket', 255)->default('/')->nullable(); $table->string('ftp_path_personel', 255)->default('/')->nullable();
                $table->boolean('ftp_use_ssl')->default(false)->comment('FTPS için'); $table->boolean('ftp_passive_mode')->default(true);
                $table->boolean('ftp_yedek_aktif')->default(false)->comment('Yedek FTP kullanımı aktif mi?'); $table->string('ftp_host_yedek', 255)->nullable();
                $table->integer('ftp_port_yedek')->default(21)->nullable(); $table->string('ftp_username_yedek', 100)->nullable(); $table->text('ftp_password_yedek')->nullable()->comment('Şifrelenecek');
                $table->string('ftp_path_rehber_yedek', 255)->default('/')->nullable(); $table->string('ftp_path_hareket_yedek', 255)->default('/')->nullable(); $table->string('ftp_path_personel_yedek', 255)->default('/')->nullable();
                $table->boolean('ftp_use_ssl_yedek')->default(false)->comment('Yedek FTPS için'); $table->boolean('ftp_passive_mode_yedek')->default(true);
                $table->string('cron_rehber_ay', 20)->default('1')->comment('Ayın günü (1-31)'); $table->string('cron_rehber_gun_hafta', 20)->default('*')->comment('Rehber için genelde Ayın Günü kullanılır');
                $table->string('cron_rehber_saat', 2)->default('10'); $table->string('cron_rehber_dakika', 2)->default('00');
                $table->string('cron_hareket_ay', 20)->default('*')->comment('Her ay'); $table->string('cron_hareket_gun_hafta', 20)->default('*')->comment('Haftanın günü (0-6 Pazar-Cumartesi, * her gün)');
                $table->string('cron_hareket_saat', 2)->default('01'); $table->string('cron_hareket_dakika', 2)->default('00');
                $table->string('cron_personel_ay', 20)->default('6,12')->comment('Haziran ve Aralık'); $table->string('cron_personel_gun_ay', 20)->default('L')->comment('Ayın son günü (L) veya belirli günler');
                $table->string('cron_personel_saat', 2)->default('16'); $table->string('cron_personel_dakika', 2)->default('00');
                $table->integer('canli_hareket_saklama_gun')->default(7)->comment('Canlı hareket tablosunda verilerin kaç gün saklanacağı');
                $table->integer('arsiv_hareket_saklama_gun')->default(180)->comment('Arşiv hareket tablosunda verilerin kaç gün saklanacağı');
                $table->boolean('bos_dosya_gonder')->default(false); $table->boolean('sil_tablolar_kaldirirken')->default(false);
                $table->boolean('nvi_tc_dogrulama_aktif')->default(true); $table->boolean('nvi_yabanci_dogrulama_aktif')->default(true);
                $table->string('log_level', 20)->default('INFO')->comment('DEBUG, INFO, WARNING, ERROR'); $table->integer('admin_password_confirm_timeout')->default(15)->comment('Admin şifre onayının ne kadar süreyle (dakika) geçerli olacağı');
                $table->timestamps();
            },
            'mod_btk_ref_hat_durum_kodlari' => function ($table) use ($charset, $collation) { $table->charset = $charset; $table->collation = $collation; $table->increments('id'); $table->string('kod', 10)->unique(); $table->string('aciklama_btk', 255); $table->string('aciklama_tr', 255)->nullable(); },
            'mod_btk_ref_musteri_hareket_kodlari' => function ($table) use ($charset, $collation) { $table->charset = $charset; $table->collation = $collation; $table->increments('id'); $table->string('kod', 10)->unique(); $table->string('aciklama_btk', 255); $table->string('aciklama_tr', 255)->nullable(); },
            'mod_btk_ref_hizmet_tipleri' => function ($table) use ($charset, $collation) { $table->charset = $charset; $table->collation = $collation; $table->increments('id'); $table->string('isletme_tipi_btk', 50); $table->string('altyapi_turu_btk', 100)->nullable(); $table->string('hizmet_kodu_btk', 100)->unique(); $table->string('aciklama_tr', 255); },
            'mod_btk_ref_kimlik_tipleri' => function ($table) use ($charset, $collation) { $table->charset = $charset; $table->collation = $collation; $table->increments('id'); $table->string('belge_adi_tr', 100); $table->string('belge_tip_kodu_btk', 10)->unique(); },
            'mod_btk_ref_meslek_kodlari' => function ($table) use ($charset, $collation) { $table->charset = $charset; $table->collation = $collation; $table->increments('id'); $table->string('kod_btk', 10)->unique(); $table->string('aciklama_tr', 255); },
            'mod_btk_adres_il' => function ($table) use ($charset, $collation) { $table->charset = $charset; $table->collation = $collation; $table->increments('id'); $table->string('plaka_kodu', 2)->unique(); $table->string('il_adi', 100)->index();},
            'mod_btk_adres_ilce' => function ($table) use ($charset, $collation) { $table->charset = $charset; $table->collation = $collation; $table->increments('id'); $table->unsignedInteger('il_id')->index(); $table->string('ilce_adi', 100)->index(); },
            'mod_btk_adres_mahalle' => function ($table) use ($charset, $collation) { $table->charset = $charset; $table->collation = $collation; $table->increments('id'); $table->unsignedInteger('ilce_id')->index(); $table->string('mahalle_adi', 150)->index(); $table->string('posta_kodu', 10)->nullable(); },
            'mod_btk_personel' => function ($table) use ($charset, $collation) { $table->charset = $charset; $table->collation = $collation; $table->increments('id'); $table->unsignedInteger('whmcs_admin_id')->unique(); $table->string('firma_unvani', 255)->nullable(); $table->string('adi', 100)->nullable(); $table->string('soyadi', 100)->nullable(); $table->string('tc_kimlik_no', 11)->nullable()->index(); $table->string('unvan', 100)->nullable(); $table->string('calistigi_birim', 100)->nullable(); $table->string('mobil_telefonu', 20)->nullable(); $table->string('sabit_telefonu', 20)->nullable(); $table->string('email_adresi', 255)->nullable(); $table->text('ev_adresi')->nullable(); $table->string('acil_durum_kisi_adi', 100)->nullable(); $table->string('acil_durum_kisi_telefonu', 20)->nullable(); $table->date('ise_baslama_tarihi')->nullable(); $table->date('isten_ayrilma_tarihi')->nullable(); $table->text('is_birakma_nedeni')->nullable(); $table->boolean('btk_listesine_ekle')->default(true); $table->timestamps(); $table->timestamp('son_guncelleme_zamani')->nullable()->default(Capsule::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')); },
            'mod_btk_product_group_map' => function ($table) use ($charset, $collation) { $table->charset = $charset; $table->collation = $collation; $table->increments('id'); $table->unsignedInteger('whmcs_product_group_id'); $table->string('btk_yetki_turu_kod_anahtar', 100); $table->string('btk_hizmet_kodu_btk', 100)->nullable()->index(); $table->unique(['whmcs_product_group_id', 'btk_yetki_turu_kod_anahtar'], 'uk_pgid_yetki_map'); },
            'mod_btk_dosya_loglari' => function ($table) use ($charset, $collation) { $table->charset = $charset; $table->collation = $collation; $table->increments('id'); $table->string('dosya_adi', 255)->unique(); $table->enum('dosya_tipi', ['REHBER', 'HAREKET', 'PERSONEL']); $table->string('yetki_turu_kodu', 50)->nullable()->index(); $table->datetime('olusturulma_zamani_rapor'); $table->integer('cnt_degeri'); $table->datetime('ftp_ana_yuklenme_zamani')->nullable(); $table->boolean('ftp_ana_yuklenme_durumu')->default(false); $table->text('ftp_ana_hata_mesaji')->nullable(); $table->datetime('ftp_yedek_yuklenme_zamani')->nullable(); $table->boolean('ftp_yedek_yuklenme_durumu')->default(false); $table->text('ftp_yedek_hata_mesaji')->nullable(); $table->string('icerik_hash', 64)->nullable(); $table->timestamp('kayit_zamani')->useCurrent(); },
            'mod_btk_abone_rehber' => function ($table) use ($charset, $collation) { $table->charset = $charset; $table->collation = $collation; $table->bigIncrements('id'); $table->unsignedInteger('whmcs_client_id')->nullable()->index(); $table->unsignedInteger('whmcs_service_id')->nullable(); $table->string('btk_yetki_turu_kod', 50)->nullable(); $table->string('alan_1_operator_kod', 3)->nullable(); $table->string('alan_2_musteri_id', 50)->nullable(); $table->string('alan_3_hat_no', 50)->nullable()->index(); $table->char('alan_4_hat_durum', 1)->nullable(); $table->string('alan_5_hat_durum_kodu', 2)->nullable(); $table->string('alan_6_hat_durum_aciklama', 255)->nullable(); $table->string('alan_10_hizmet_tipi', 50)->nullable(); $table->string('alan_11_musteri_tipi', 20)->nullable(); $table->string('alan_12_abone_baslangic', 14)->nullable(); $table->string('alan_13_abone_bitis', 14)->nullable(); $table->string('alan_14_abone_adi', 100)->nullable(); $table->string('alan_15_abone_soyadi', 100)->nullable(); $table->string('alan_16_abone_tc_kimlik_no', 11)->nullable()->index(); $table->string('alan_17_abone_pasaport_no', 50)->nullable(); $table->string('alan_18_abone_unvan', 255)->nullable(); $table->string('alan_19_abone_vergi_numarasi', 20)->nullable(); $table->string('alan_20_abone_mersis_numarasi', 20)->nullable(); $table->char('alan_21_abone_cinsiyet', 1)->nullable(); $table->string('alan_22_abone_uyruk', 50)->nullable(); $table->string('alan_23_abone_baba_adi', 100)->nullable(); $table->string('alan_24_abone_ana_adi', 100)->nullable(); $table->string('alan_25_abone_anne_kizlik_soyadi', 100)->nullable(); $table->string('alan_26_abone_dogum_yeri', 100)->nullable(); $table->string('alan_27_abone_dogum_tarihi', 8)->nullable(); $table->string('alan_28_abone_meslek', 10)->nullable(); $table->string('alan_29_abone_tarife', 100)->nullable(); $table->string('alan_30_abone_kimlik_cilt_no', 20)->nullable(); $table->string('alan_31_abone_kimlik_kutuk_no', 20)->nullable(); $table->string('alan_32_abone_kimlik_sayfa_no', 20)->nullable(); $table->string('alan_33_abone_kimlik_il', 100)->nullable(); $table->string('alan_34_abone_kimlik_ilce', 100)->nullable(); $table->string('alan_35_abone_kimlik_mahalle_koy', 100)->nullable(); $table->string('alan_36_abone_kimlik_tipi', 10)->nullable(); $table->string('alan_37_abone_kimlik_seri_no', 20)->nullable(); $table->string('alan_38_abone_kimlik_verildigi_yer', 100)->nullable(); $table->string('alan_39_abone_kimlik_verildigi_tarih', 8)->nullable(); $table->char('alan_40_abone_kimlik_aidiyeti', 1)->nullable(); $table->string('alan_41_abone_adres_tesis_il', 100)->nullable(); $table->string('alan_42_abone_adres_tesis_ilce', 100)->nullable(); $table->string('alan_43_abone_adres_tesis_mahalle', 255)->nullable(); $table->string('alan_44_abone_adres_tesis_cadde', 255)->nullable(); $table->string('alan_45_abone_adres_tesis_dis_kapi_no', 20)->nullable(); $table->string('alan_46_abone_adres_tesis_ic_kapi_no', 20)->nullable(); $table->string('alan_47_abone_adres_tesis_posta_kodu', 10)->nullable(); $table->string('alan_48_abone_adres_tesis_adres_kodu', 20)->nullable(); $table->string('alan_49_abone_adres_irtibat_tel_no_1', 20)->nullable(); $table->string('alan_50_abone_adres_irtibat_tel_no_2', 20)->nullable(); $table->string('alan_51_abone_adres_e_mail', 255)->nullable(); $table->string('alan_52_abone_adres_yerlesim_il', 100)->nullable(); $table->string('alan_53_abone_adres_yerlesim_ilce', 100)->nullable(); $table->string('alan_54_abone_adres_yerlesim_mahalle', 255)->nullable(); $table->string('alan_55_abone_adres_yerlesim_cadde', 255)->nullable(); $table->string('alan_56_abone_adres_yerlesim_dis_kapi_no', 20)->nullable(); $table->string('alan_57_abone_adres_yerlesim_ic_kapi_no', 20)->nullable(); $table->string('alan_58_abone_adres_yerlesim_no', 20)->nullable(); $table->string('alan_59_kurum_yetkili_adi', 100)->nullable(); $table->string('alan_60_kurum_yetkili_soyadi', 100)->nullable(); $table->string('alan_61_kurum_yetkili_tckimlik_no', 11)->nullable(); $table->string('alan_62_kurum_yetkili_telefon', 20)->nullable(); $table->text('alan_63_kurum_adres')->nullable(); $table->string('alan_64_aktivasyon_bayi_adi', 100)->nullable(); $table->string('alan_65_aktivasyon_bayi_adresi', 255)->nullable(); $table->string('alan_66_aktivasyon_kullanici', 100)->nullable(); $table->string('alan_67_guncelleyen_bayi_adi', 100)->nullable(); $table->string('alan_68_guncelleyen_bayi_adresi', 255)->nullable(); $table->string('alan_69_guncelleyen_kullanici', 100)->nullable(); $table->string('alan_70_statik_ip', 255)->nullable(); $table->string('alan_71_ozel_1', 255)->nullable(); $table->string('alan_72_ozel_2', 255)->nullable(); $table->string('alan_73_ozel_3', 255)->nullable(); $table->string('alan_74_ozel_4', 255)->nullable(); $table->string('alan_75_ozel_5', 255)->nullable(); $table->string('alan_76_ozel_6', 255)->nullable(); $table->string('alan_77_ozel_7', 255)->nullable(); $table->string('alan_78_ozel_8', 255)->nullable(); $table->string('alan_79_ozel_9', 255)->nullable(); $table->string('alan_80_ozel_10', 255)->nullable(); $table->string('alan_81_ozel_11', 255)->nullable(); $table->string('alan_82_ozel_12', 255)->nullable(); $table->string('alan_83_ozel_13', 255)->nullable(); $table->string('alan_84_ozel_14', 255)->nullable(); $table->string('alan_85_ozel_15', 255)->nullable(); $table->boolean('is_nvi_tc_dogrulandi')->default(false); $table->boolean('is_nvi_yabanci_dogrulandi')->default(false); $table->boolean('is_permanently_cancelled')->default(false); $table->boolean('vefat_durumu')->default(false); $table->string('google_map_konum', 255)->nullable(); $table->timestamps(); $table->unique(['whmcs_service_id', 'btk_yetki_turu_kod'], 'uk_rehber_service_id_yetki_map');},
            'mod_btk_abone_hareket_canli' => function ($table) use ($charset, $collation) { $table->charset = $charset; $table->collation = $collation; $table->bigIncrements('id'); $table->unsignedBigInteger('mod_btk_abone_rehber_id')->nullable()->index(); $table->unsignedInteger('whmcs_service_id')->nullable()->index(); $table->string('btk_yetki_turu_kod', 50)->nullable(); $table->string('alan_1_operator_kod', 3)->nullable(); $table->string('alan_2_musteri_id', 50)->nullable(); $table->string('alan_3_hat_no', 50)->nullable(); $table->string('alan_7_musteri_hareket_kodu', 2); $table->string('alan_8_musteri_hareket_aciklama', 255)->nullable(); $table->string('alan_9_musteri_hareket_zamani', 14); $table->text('hareket_detaylari_json')->nullable(); $table->boolean('is_gonderildi')->default(false)->index(); $table->unsignedInteger('gonderilen_dosya_id')->nullable()->index(); $table->integer('gonderim_cnt')->nullable(); $table->timestamp('created_at')->nullable()->useCurrent(); },
            'mod_btk_abone_hareket_arsiv' => function ($table) use ($charset, $collation) { $table->charset = $charset; $table->collation = $collation; $table->unsignedBigInteger('id'); $table->unsignedBigInteger('mod_btk_abone_rehber_id')->nullable()->index(); $table->unsignedInteger('whmcs_service_id')->nullable()->index(); $table->string('btk_yetki_turu_kod', 50)->nullable(); $table->string('alan_1_operator_kod', 3)->nullable(); $table->string('alan_2_musteri_id', 50)->nullable(); $table->string('alan_3_hat_no', 50)->nullable(); $table->string('alan_7_musteri_hareket_kodu', 2); $table->string('alan_8_musteri_hareket_aciklama', 255)->nullable(); $table->string('alan_9_musteri_hareket_zamani', 14)->index(); $table->text('hareket_detaylari_json')->nullable(); $table->unsignedInteger('gonderilen_dosya_id')->nullable(); $table->integer('gonderim_cnt')->nullable(); $table->timestamp('created_at')->nullable(); $table->timestamp('arsivlenme_zamani')->useCurrent(); $table->primary('id'); }
        ];

        foreach ($tablesToCreate as $tableName => $tableSchemaCallback) {
            if (!$schema->hasTable($tableName)) {
                $schema->create($tableName, $tableSchemaCallback);
                $logDescription .= "{$tableName} oluşturuldu. ";
            } else {
                $logDescription .= "{$tableName} zaten var. ";
            }
        }
        if (Capsule::table('mod_btk_config')->where('id', 1)->count() == 0) {
           Capsule::table('mod_btk_config')->insert(['id' => 1, 'created_at' => date("Y-m-d H:i:s"), 'updated_at' => date("Y-m-d H:i:s")]);
           $logDescription .= 'mod_btk_config tablosuna varsayılan kayıt (ID:1) eklendi. ';
        }

        // Foreign Key'leri sona bıraktık, tüm tabloların varlığından emin olduktan sonra.
        // Hata durumunda devam etmesi için try-catch içine alıyoruz.
        try {
            // Adres tabloları için Foreign Key'ler
            if ($schema->hasTable('mod_btk_adres_ilce') && $schema->hasTable('mod_btk_adres_il')) {
                // Önce FK var mı diye daha güvenli bir kontrol yapalım (WHMCS'in eski versiyonlarında hasForeignKey yok)
                $connection = Capsule::connection();
                $dbName = $connection->getDatabaseName();
                $foreignKeysIlce = $connection->select("SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = '{$dbName}' AND TABLE_NAME = 'mod_btk_adres_ilce' AND CONSTRAINT_NAME LIKE '%il_id_foreign%';");
                if (empty($foreignKeysIlce)) {
                    $schema->table('mod_btk_adres_ilce', function($table) { $table->foreign('il_id')->references('id')->on('mod_btk_adres_il')->onDelete('cascade')->onUpdate('cascade'); });
                }
            }
            if ($schema->hasTable('mod_btk_adres_mahalle') && $schema->hasTable('mod_btk_adres_ilce')) {
                $foreignKeysMahalle = $connection->select("SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = '{$dbName}' AND TABLE_NAME = 'mod_btk_adres_mahalle' AND CONSTRAINT_NAME LIKE '%ilce_id_foreign%';");
                 if (empty($foreignKeysMahalle)) {
                    $schema->table('mod_btk_adres_mahalle', function($table) { $table->foreign('ilce_id')->references('id')->on('mod_btk_adres_ilce')->onDelete('cascade')->onUpdate('cascade'); });
                 }
            }
            // Hareket Canlı Tablosu için
            if ($schema->hasTable('mod_btk_abone_hareket_canli') && $schema->hasTable('mod_btk_dosya_loglari')) {
                 $foreignKeysHareket = $connection->select("SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = '{$dbName}' AND TABLE_NAME = 'mod_btk_abone_hareket_canli' AND CONSTRAINT_NAME LIKE '%gonderilen_dosya_id_foreign%';");
                 if (empty($foreignKeysHareket)) {
                     $schema->table('mod_btk_abone_hareket_canli', function ($table) {
                        $table->foreign('gonderilen_dosya_id', 'fk_hareket_canli_dosya_id')->references('id')->on('mod_btk_dosya_loglari')->onDelete('set null')->onUpdate('cascade');
                    });
                 }
            }
        } catch (Exception $e) {
            $logDescription .= "Foreign key oluşturma sırasında bazı hatalar oluştu (bu durum normal olabilir): " . $e->getMessage();
        }

        logActivity($logDescription . 'Tüm tablolar kontrol edildi/oluşturuldu.');
        return ['status' => 'success', 'description' => 'BTK Raporlama Modülü başarıyla etkinleştirildi ve gerekli tüm veritabanı tabloları oluşturuldu/kontrol edildi. Lütfen Ayarlar sayfasından "Başlangıç Verilerini Yükle" butonunu kullanarak referans verilerini yükleyin (veya /sql/initial_reference_data.sql dosyasını veritabanınızda çalıştırın). Ardından diğer yapılandırmaları yapınız.'];

    } catch (Exception $e) {
        $errorMessage = 'Modül etkinleştirme hatası: ' . $e->getMessage() . ' (Dosya: ' . $e->getFile() . ' Satır: ' . $e->getLine() . ')';
        logActivity('BTK Raporlama Modülü Etkinleştirme Hatası: ' . $errorMessage, 0);
        return ['status' => 'error', 'description' => $errorMessage];
    }
}

function btkreports_deactivate() {
    try {
        $config = null; if (Capsule::schema()->hasTable('mod_btk_config')) { $config = Capsule::table('mod_btk_config')->first(); }
        if ($config && $config->sil_tablolar_kaldirirken) {
            // Foreign Key'leri olan tablolara dokunmadan önce constraint'leri kaldırmak daha güvenli olabilir.
            // Veya silme sırasına dikkat etmek. Şimdilik direkt silmeyi deniyoruz.
            Capsule::schema()->dropIfExists('mod_btk_abone_hareket_arsiv');
            Capsule::schema()->dropIfExists('mod_btk_abone_hareket_canli'); // Bu, mod_btk_dosya_loglari'na FK'ye sahip olabilir
            Capsule::schema()->dropIfExists('mod_btk_abone_rehber');
            Capsule::schema()->dropIfExists('mod_btk_dosya_loglari');
            Capsule::schema()->dropIfExists('mod_btk_product_group_map');
            Capsule::schema()->dropIfExists('mod_btk_personel');
            Capsule::schema()->dropIfExists('mod_btk_adres_mahalle'); // mod_btk_adres_ilce'ye FK'si var
            Capsule::schema()->dropIfExists('mod_btk_adres_ilce'); // mod_btk_adres_il'e FK'si var
            Capsule::schema()->dropIfExists('mod_btk_adres_il');
            Capsule::schema()->dropIfExists('mod_btk_ref_meslek_kodlari');
            Capsule::schema()->dropIfExists('mod_btk_ref_kimlik_tipleri');
            Capsule::schema()->dropIfExists('mod_btk_ref_hizmet_tipleri');
            Capsule::schema()->dropIfExists('mod_btk_ref_musteri_hareket_kodlari');
            Capsule::schema()->dropIfExists('mod_btk_ref_hat_durum_kodlari');
            Capsule::schema()->dropIfExists('mod_btk_config');
            logActivity('BTK Raporlama Modülü: Tüm tablolar silindi (kullanıcı tercihi).', 0);
            return ['status' => 'success', 'description' => 'BTK Raporlama Modülü devre dışı bırakıldı ve ilgili tüm veritabanı tabloları silindi.'];
        } else {
            logActivity('BTK Raporlama Modülü: Devre dışı bırakıldı, tablolar korundu.', 0);
            return ['status' => 'success', 'description' => 'BTK Raporlama Modülü devre dışı bırakıldı. Veritabanı tabloları korunmuştur.'];
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
    $csrfToken = '';
    // CSRF token üretme (WHMCS versiyonlarına uyumlu)
    if (function_exists('generate_token')) { // WHMCS < 8.0 için
        $csrfToken = generate_token('plain');
    } elseif (class_exists('\WHMCS\Utility\CSRF')) { // WHMCS 8.0+ için
        // \WHMCS\Utility\CSRF sınıfı yoksa hata vermemesi için varlık kontrolü
        if (method_exists('\WHMCS\Utility\CSRF', 'generateToken')) {
            $csrfToken = \WHMCS\Utility\CSRF::generateToken(); // default (HTML form) veya 'plain'
        }
    }
    // Eğer generate_token veya CSRF sınıfı yoksa $csrfToken boş kalır, bu durumda
    // check_token da başarısız olacaktır. Bu, çok eski WHMCS versiyonlarında olabilir.

    $smartyvalues = ['modulelink' => $vars['modulelink'], 'version' => $vars['version'], 'LANG' => $LANG, 'csrfToken' => $csrfToken];

    $currentConfig = [];
    if (Capsule::schema()->hasTable('mod_btk_config')) {
        $currentConfig = (array) Capsule::table('mod_btk_config')->where('id', 1)->first();
        if ($currentConfig) {
            $smartyvalues['btk_operator_kodu_set'] = !empty($currentConfig['operator_kodu']);
            $currentConfig['ftp_password_decrypted_placeholder'] = !empty($currentConfig['ftp_password']) ? ($LANG['btk_sifre_placeholder'] ?? '********') : ($LANG['btk_sifre_girilmemis'] ?? 'Şifre Girilmemiş');
            $currentConfig['ftp_password_yedek_decrypted_placeholder'] = !empty($currentConfig['ftp_password_yedek']) ? ($LANG['btk_sifre_placeholder'] ?? '********') : ($LANG['btk_sifre_girilmemis'] ?? 'Şifre Girilmemiş');
            $currentConfig['secilen_yetki_turleri_array'] = !empty($currentConfig['secilen_yetki_turleri']) ? json_decode($currentConfig['secilen_yetki_turleri'], true) : [];
        } else {
            $currentConfig = []; // Config kaydı yoksa boş dizi
            $smartyvalues['btk_operator_kodu_set'] = false;
        }
    } else { // Config tablosu hiç yoksa
        $currentConfig = [];
        $smartyvalues['btk_operator_kodu_set'] = false;
        if ($action !== 'config' && $action !== 'setup_initial_data_action') {
            $smartyvalues['errormessage'] = $LANG['btkreports_config_table_missing'] ?? 'Kritik Hata: Modül yapılandırma tablosu bulunamadı! Lütfen modülü devre dışı bırakıp tekrar etkinleştirin.';
        }
        logActivity("BTK Raporlama Modülü: KRİTİK HATA - mod_btk_config tablosu bulunamadı!", 0);
    }
    $smartyvalues['currentConfig'] = $currentConfig;


    switch ($action) {
        case 'config':
            if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_config'])) {
                $tokenValid = false;
                $postedToken = $_POST['token'] ?? '';
                if (function_exists('check_token')) { $tokenValid = check_token("WHMCS.admin.default", $postedToken); }
                elseif (class_exists('\WHMCS\Utility\CSRF')) { if(method_exists('\WHMCS\Utility\CSRF', 'verifyToken')) $tokenValid = \WHMCS\Utility\CSRF::verifyToken("WHMCS.admin.default", $postedToken);}

                if (!$tokenValid) {
                     $smartyvalues['errormessage'] = $LANG['btkreports_csrf_error_message'] ?? "Geçersiz güvenlik tokeni. İşlem reddedildi.";
                } else {
                    $configData = [];
                    $configData['operator_kodu'] = isset($_POST['operator_kodu']) ? trim($_POST['operator_kodu']) : null;
                    $configData['operator_adi'] = isset($_POST['operator_adi']) ? trim($_POST['operator_adi']) : null;
                    $configData['operator_unvani'] = isset($_POST['operator_unvani']) ? trim($_POST['operator_unvani']) : null;
                    $secilenYetkiler = isset($_POST['secilen_yetki_turleri']) && is_array($_POST['secilen_yetki_turleri']) ? array_map('trim', $_POST['secilen_yetki_turleri']) : [];
                    $configData['secilen_yetki_turleri'] = json_encode($secilenYetkiler);

                    $configData['ftp_host'] = isset($_POST['ftp_host']) ? trim($_POST['ftp_host']) : null;
                    $configData['ftp_port'] = isset($_POST['ftp_port']) ? (int)$_POST['ftp_port'] : 21;
                    $configData['ftp_username'] = isset($_POST['ftp_username']) ? trim($_POST['ftp_username']) : null;
                    if (isset($_POST['ftp_password']) && trim($_POST['ftp_password']) !== '') { $configData['ftp_password'] = encrypt(trim($_POST['ftp_password'])); } elseif (isset($currentConfig['ftp_password'])) { $configData['ftp_password'] = $currentConfig['ftp_password']; } else { $configData['ftp_password'] = null; }
                    $configData['ftp_path_rehber'] = isset($_POST['ftp_path_rehber']) ? rtrim(trim($_POST['ftp_path_rehber']), '/') . '/' : '/';
                    $configData['ftp_path_hareket'] = isset($_POST['ftp_path_hareket']) ? rtrim(trim($_POST['ftp_path_hareket']), '/') . '/' : '/';
                    $configData['ftp_path_personel'] = isset($_POST['ftp_path_personel']) ? rtrim(trim($_POST['ftp_path_personel']), '/') . '/' : '/';
                    $configData['ftp_use_ssl'] = (isset($_POST['ftp_use_ssl_toggle'])) ? 1 : 0;
                    $configData['ftp_passive_mode'] = (isset($_POST['ftp_passive_mode_toggle'])) ? 1 : 0;

                    $configData['ftp_yedek_aktif'] = (isset($_POST['ftp_yedek_aktif_toggle'])) ? 1 : 0;
                    $configData['ftp_host_yedek'] = isset($_POST['ftp_host_yedek']) ? trim($_POST['ftp_host_yedek']) : null;
                    $configData['ftp_port_yedek'] = isset($_POST['ftp_port_yedek']) ? (int)$_POST['ftp_port_yedek'] : 21;
                    $configData['ftp_username_yedek'] = isset($_POST['ftp_username_yedek']) ? trim($_POST['ftp_username_yedek']) : null;
                    if (isset($_POST['ftp_password_yedek']) && trim($_POST['ftp_password_yedek']) !== '') { $configData['ftp_password_yedek'] = encrypt(trim($_POST['ftp_password_yedek'])); } elseif (isset($currentConfig['ftp_password_yedek'])) { $configData['ftp_password_yedek'] = $currentConfig['ftp_password_yedek']; } else { $configData['ftp_password_yedek'] = null; }
                    $configData['ftp_path_rehber_yedek'] = isset($_POST['ftp_path_rehber_yedek']) ? rtrim(trim($_POST['ftp_path_rehber_yedek']), '/') . '/' : '/';
                    $configData['ftp_path_hareket_yedek'] = isset($_POST['ftp_path_hareket_yedek']) ? rtrim(trim($_POST['ftp_path_hareket_yedek']), '/') . '/' : '/';
                    $configData['ftp_path_personel_yedek'] = isset($_POST['ftp_path_personel_yedek']) ? rtrim(trim($_POST['ftp_path_personel_yedek']), '/') . '/' : '/';
                    $configData['ftp_use_ssl_yedek'] = (isset($_POST['ftp_use_ssl_yedek_toggle'])) ? 1 : 0;
                    $configData['ftp_passive_mode_yedek'] = (isset($_POST['ftp_passive_mode_yedek_toggle'])) ? 1 : 0;

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

                    $configData['canli_hareket_saklama_gun'] = isset($_POST['canli_hareket_saklama_gun']) ? (int)$_POST['canli_hareket_saklama_gun'] : 7;
                    $configData['arsiv_hareket_saklama_gun'] = isset($_POST['arsiv_hareket_saklama_gun']) ? (int)$_POST['arsiv_hareket_saklama_gun'] : 180;
                    $configData['bos_dosya_gonder'] = (isset($_POST['bos_dosya_gonder_toggle'])) ? 1 : 0;
                    $configData['sil_tablolar_kaldirirken'] = (isset($_POST['sil_tablolar_kaldirirken_toggle'])) ? 1 : 0;
                    $configData['nvi_tc_dogrulama_aktif'] = (isset($_POST['nvi_tc_dogrulama_aktif_toggle'])) ? 1 : 0;
                    $configData['nvi_yabanci_dogrulama_aktif'] = (isset($_POST['nvi_yabanci_dogrulama_aktif_toggle'])) ? 1 : 0;
                    $configData['log_level'] = isset($_POST['log_level']) ? trim($_POST['log_level']) : 'INFO';
                    $configData['admin_password_confirm_timeout'] = isset($_POST['admin_password_confirm_timeout']) ? (int)$_POST['admin_password_confirm_timeout'] : 15;
                    $configData['updated_at'] = date("Y-m-d H:i:s");

                   try {
                       Capsule::table('mod_btk_config')->updateOrInsert(['id' => 1], $configData);
                       $smartyvalues['successmessage'] = $LANG['btkreports_ayarlar_kaydedildi'];
                       logActivity('BTK Raporlama Modülü: Ayarlar güncellendi.', 0);
                       $currentConfig = (array) Capsule::table('mod_btk_config')->where('id', 1)->first();
                       if ($currentConfig) {
                           $currentConfig['ftp_password_decrypted_placeholder'] = !empty($currentConfig['ftp_password']) ? ($LANG['btk_sifre_placeholder'] ?? '********') : ($LANG['btk_sifre_girilmemis'] ?? 'Şifre Girilmemiş');
                           $currentConfig['ftp_password_yedek_decrypted_placeholder'] = !empty($currentConfig['ftp_password_yedek']) ? ($LANG['btk_sifre_placeholder'] ?? '********') : ($LANG['btk_sifre_girilmemis'] ?? 'Şifre Girilmemiş');
                           $currentConfig['secilen_yetki_turleri_array'] = !empty($currentConfig['secilen_yetki_turleri']) ? json_decode($currentConfig['secilen_yetki_turleri'], true) : [];
                       } else {$currentConfig = [];}
                       $smartyvalues['currentConfig'] = $currentConfig;
                   } catch (Exception $e) {
                       $smartyvalues['errormessage'] = $LANG['btkreports_hata_ayarlar_kaydedilemedi'] . ' ' . $e->getMessage();
                       logActivity('BTK Raporlama Modülü: Ayar kaydetme hatası - ' . $e->getMessage(), 0);
                   }
                }
            }
            $smartyvalues['btkYetkiTurleri'] = getBtkYetkiTurleriListesi($LANG);
            $templateFile = 'config';
            break;

        case 'ftp_test':
            header('Content-Type: application/json');
            $tokenValid = false;
            if (isset($_POST['token'])) {
                if (function_exists('check_token')) { $tokenValid = check_token("WHMCS.admin.default", $_POST['token']); }
                elseif (class_exists('\WHMCS\Utility\CSRF')) { if(method_exists('\WHMCS\Utility\CSRF', 'verifyToken')) $tokenValid = \WHMCS\Utility\CSRF::verifyToken("WHMCS.admin.default", $_POST['token']);}
            }
            if (!$tokenValid) { echo json_encode(['status' => 'error', 'message' => ($LANG['btkreports_csrf_error_message'] ?? 'Geçersiz güvenlik tokeni.')]); exit; }

            $ftpType = isset($_POST['ftp_type']) ? $_POST['ftp_type'] : 'ana';
            $params = []; $formSifre = null;

            if ($ftpType === 'ana') {
                $params['host'] = isset($_POST['ftp_host']) ? trim($_POST['ftp_host']) : ''; $params['port'] = isset($_POST['ftp_port']) ? (int)$_POST['ftp_port'] : 21;
                $params['username'] = isset($_POST['ftp_username']) ? trim($_POST['ftp_username']) : ''; $formSifre = isset($_POST['ftp_password']) ? trim($_POST['ftp_password']) : null;
                $params['use_ssl'] = isset($_POST['ftp_use_ssl']) && ($_POST['ftp_use_ssl'] === 'true' || $_POST['ftp_use_ssl'] == 1);
                $params['passive_mode'] = isset($_POST['ftp_passive_mode']) && ($_POST['ftp_passive_mode'] === 'true' || $_POST['ftp_passive_mode'] == 1);
                $params['password'] = ($formSifre !== null && $formSifre !== '') ? $formSifre : (($currentConfig && !empty($currentConfig['ftp_password'])) ? BtkHelper::decryptAdminPassword($currentConfig['ftp_password']) : '');
            } else { // yedek
                $params['host'] = isset($_POST['ftp_host_yedek']) ? trim($_POST['ftp_host_yedek']) : ''; $params['port'] = isset($_POST['ftp_port_yedek']) ? (int)$_POST['ftp_port_yedek'] : 21;
                $params['username'] = isset($_POST['ftp_username_yedek']) ? trim($_POST['ftp_username_yedek']) : ''; $formSifre = isset($_POST['ftp_password_yedek']) ? trim($_POST['ftp_password_yedek']) : null;
                $params['use_ssl'] = isset($_POST['ftp_use_ssl_yedek']) && ($_POST['ftp_use_ssl_yedek'] === 'true' || $_POST['ftp_use_ssl_yedek'] == 1);
                $params['passive_mode'] = isset($_POST['ftp_passive_mode_yedek']) && ($_POST['ftp_passive_mode_yedek'] === 'true' || $_POST['ftp_passive_mode_yedek'] == 1);
                $params['password'] = ($formSifre !== null && $formSifre !== '') ? $formSifre : (($currentConfig && !empty($currentConfig['ftp_password_yedek'])) ? BtkHelper::decryptAdminPassword($currentConfig['ftp_password_yedek']) : '');
            }
            if (empty($params['host'])) { echo json_encode(['status' => 'error', 'message' => ($LANG['btkreports_ftp_adresi_label'] ?? 'FTP Host') . ' boş olamaz.']); exit; }
            if (empty($params['username'])) { echo json_encode(['status' => 'error', 'message' => ($LANG['btkreports_ftp_kullanici_adi_label'] ?? 'FTP Kullanıcı Adı') . ' boş olamaz.']); exit; }
            
            $result = BtkHelper::testFtpConnection($params);
            echo json_encode($result);
            exit;
        
        case 'setup_initial_data_action':
            header('Content-Type: application/json');
            $tokenValid = false;
            if (isset($_POST['token'])) {
                if (function_exists('check_token')) { $tokenValid = check_token("WHMCS.admin.default", $_POST['token']); }
                elseif (class_exists('\WHMCS\Utility\CSRF')) { if(method_exists('\WHMCS\Utility\CSRF', 'verifyToken')) $tokenValid = \WHMCS\Utility\CSRF::verifyToken("WHMCS.admin.default", $_POST['token']);}
            }
            if (!$tokenValid) { echo json_encode(['status' => 'error', 'message' => ($LANG['btkreports_csrf_error_message'] ?? 'Geçersiz token.')]); exit; }

            $result = BtkHelper::setupInitialData();
            if ($result['status'] === 'success') {
                // JS'e özel bir "display" mesajı ekleyelim, ham mesaj da kalsın.
                $result['message_display'] = ($LANG['btk_initial_data_success_desc_js'] ?? 'Başlangıç verileri başarıyla yüklendi! Sayfa birazdan yenilenecek...') . ' (' . ($result['message'] ?? '') . ')';
            } else {
                $result['message_display'] = $result['message'];
            }
            echo json_encode($result);
            exit;

        case 'dashboard':
        default:
            $smartyvalues['referansVeriDurumu'] = BtkHelper::checkInitialDataStatus();
            $ftpDurumu = ['ana' => ['status' => 'pending', 'message' => ($LANG['btkreports_test_icin_tiklayin'] ?? 'Test Et')],
                            'yedek' => ['status' => 'pending', 'message' => ($LANG['btkreports_test_icin_tiklayin'] ?? 'Test Et')]];
            $sonGonderimler = ['rehber' => ($LANG['btk_veri_yok'] ?? 'Veri Yok'), 'hareket' => ($LANG['btk_veri_yok'] ?? 'Veri Yok'), 'personel' => ($LANG['btk_veri_yok'] ?? 'Veri Yok')];

            if (empty($smartyvalues['btk_operator_kodu_set'])) {
                $ftpDurumu['ana']['status'] = 'config_needed'; $ftpDurumu['ana']['message'] = $LANG['btkreports_once_operator_kodu_girin'] ?? 'Ayarlar eksik';
                $ftpDurumu['yedek']['status'] = 'config_needed'; $ftpDurumu['yedek']['message'] = '';
            } elseif (empty($currentConfig['ftp_host']) || empty($currentConfig['ftp_username'])) {
                $ftpDurumu['ana']['status'] = 'config_needed'; $ftpDurumu['ana']['message'] = $LANG['btkreports_ftp_ayarlari_eksik_ana'] ?? 'FTP Ayarları Eksik';
            }
            if ($currentConfig && !empty($currentConfig['ftp_yedek_aktif'])) {
                if (empty($currentConfig['ftp_host_yedek']) || empty($currentConfig['ftp_username_yedek'])) {
                    $ftpDurumu['yedek']['status'] = 'config_needed'; $ftpDurumu['yedek']['message'] = $LANG['btkreports_ftp_ayarlari_eksik_yedek'] ?? 'Yedek FTP Ayarları Eksik';
                }
            } else {
                 $ftpDurumu['yedek']['status'] = 'disabled';
                 $ftpDurumu['yedek']['message'] = $LANG['btkreports_yedek_ftp_aktif_degil'] ?? 'Yedek FTP Aktif Değil';
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

        // Diğer action'lar için template ve sayfa başlığı atamaları
        case 'personel': $templateFile = 'personel'; $smartyvalues['pageTitle'] = $LANG['btkreports_personel_yonetimi'] ?? 'Personel Yönetimi'; break;
        case 'productgroupmap': $templateFile = 'product_group_mappings'; $smartyvalues['pageTitle'] = $LANG['btkreports_urun_grup_eslestirme'] ?? 'Ürün Grubu Eşleştirme'; break;
        case 'generatereports': $templateFile = 'generate_reports'; $smartyvalues['pageTitle'] = $LANG['btkreports_rapor_secimi_ve_islem'] ?? 'Rapor Oluşturma'; break;
        case 'viewlogs': $templateFile = 'view_logs'; $smartyvalues['pageTitle'] = $LANG['btkreports_gunluk_kayitlari'] ?? 'Modül Logları'; break;
        case 'confirm_password_form': $templateFile = 'confirm_password'; $smartyvalues['pageTitle'] = $LANG['btk_admin_sifre_onayi_baslik'] ?? 'Admin Şifre Onayı'; break;
    }

    if (empty($smartyvalues['pageTitle']) && $action === 'config') { $smartyvalues['pageTitle'] = $LANG['btkreports_ayarlar'] ?? 'Modül Ayarları'; }
    elseif (empty($smartyvalues['pageTitle']) && ($action === 'dashboard' || $action === '')) { $smartyvalues['pageTitle'] = $LANG['btkreports_anasayfa'] ?? 'Ana Sayfa'; }

    $smarty = new \WHMCS\Smarty(true);
    $moduleTemplateDir = ROOTDIR . '/modules/addons/btkreports/templates/admin/';
    foreach ($smartyvalues as $key => $value) { $smarty->assign($key, $value); }
    try {
        $templatePath = $moduleTemplateDir . $templateFile . '.tpl';
        if (file_exists($templatePath)) { echo $smarty->fetch($templatePath); }
        else { echo '<div class="alert alert-danger">Template dosyası bulunamadı: ' . htmlspecialchars($templatePath) . ' (Action: ' . htmlspecialchars($action) . ')</div>'; }
    } catch (Exception $e) {
        logModuleCall('btkreports', $action, ['error' => $e->getMessage()], $e->getMessage(), $e->getTraceAsString());
        echo '<div class="alert alert-danger">Arayüz hatası: ' . htmlspecialchars($e->getMessage()) . '. Sistem loglarını kontrol ediniz.</div>';
    }
}

function getBtkYetkiTurleriListesi($LANG) {
    $yetkiTurleri = [
        'AIH_B' => $LANG['btk_yetki_aih_b'] ?? 'Altyapı İşletmeciliği Hizmeti (B)', 'AIH_K' => $LANG['btk_yetki_aih_k'] ?? 'Altyapı İşletmeciliği Hizmeti (K)',
        'CTH_IMTIYAZ' => $LANG['btk_yetki_cth_imtiyaz'] ?? 'Çeşitli Telekomünikasyon Hizmetleri (İmtiyaz)',
        'GMPCS_MT_B' => $LANG['btk_yetki_gmpcs_mt_b'] ?? 'GMPCS Mobil Telefon Hizmeti (B)', 'GMPCS_MT_K' => $LANG['btk_yetki_gmpcs_mt_k'] ?? 'GMPCS Mobil Telefon Hizmeti (K)',
        'GSM_IMTIYAZ' => $LANG['btk_yetki_gsm_imtiyaz'] ?? 'GSM (İmtiyaz Sözleşmesi)', 'HT_GSM1800_B' => $LANG['btk_yetki_ht_gsm1800_b'] ?? 'Hava Taşıtlarında GSM 1800 (B)',
        'IMT_SSKHYB' => $LANG['btk_yetki_imt_sskhyb'] ?? 'IMT (Sınırlı Kullanım Hakkı Yetki Bel.)', 'IMT2000_UMTS_IMTIYAZ' => $LANG['btk_yetki_imt2000_umts_imtiyaz'] ?? 'IMT-2000/UMTS (İmtiyaz)',
        'ISS_B' => $LANG['btk_yetki_iss_b'] ?? 'İnternet Servis Sağlayıcılığı (B)', 'KABLOYAYIN_B' => $LANG['btk_yetki_kabloyayin_b'] ?? 'Kablolu Yayın Hizmeti (B)',
        'OKTH_K' => $LANG['btk_yetki_okth_k'] ?? 'Ortak Kullanımlı Telsiz Hizmeti (K)', 'REHBERLIK_K' => $LANG['btk_yetki_rehberlik_k'] ?? 'Rehberlik Hizmeti (K)',
        'STH_B' => $LANG['btk_yetki_sth_b'] ?? 'Sabit Telefon Hizmeti (B)', 'STH_K' => $LANG['btk_yetki_sth_k'] ?? 'Sabit Telefon Hizmeti (K)',
        'SMSH_B' => $LANG['btk_yetki_smsh_b'] ?? 'Sanal Mobil Şebeke Hizmeti (B)', 'SMSH_K' => $LANG['btk_yetki_smsh_k'] ?? 'Sanal Mobil Şebeke Hizmeti (K)',
        'UYDUHAB_B' => $LANG['btk_yetki_uyduhab_b'] ?? 'Uydu Haberleşme Hizmeti (B)', 'UYDUPLAT_B' => $LANG['btk_yetki_uyduplat_b'] ?? 'Uydu Platform Hizmeti (B)',
        'UYDUKABLOTV' => $LANG['btk_yetki_uydukablatv'] ?? 'Uydu ve Kablo TV Hizmetleri',
    ];
    return $yetkiTurleri;
}
?>