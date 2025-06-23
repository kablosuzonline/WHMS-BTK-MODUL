{*
 * WHMCS BTK Raporlama Modülü - Ayarlar Sayfası Şablonu
 * Version: 6.0.1 BETA
*}

<div class="btk-dashboard"> {* Ana sarmalayıcı index.tpl ile aynı olsun *}
    <div class="page-header">
        <h2><i class="fas fa-cogs"></i> {$LANG.btkreports_ayarlar}</h2>
    </div>

    <ul class="nav nav-tabs btk-nav-tabs" role="tablist">
        <li role="presentation"><a href="{$modulelink}&action=dashboard" aria-controls="anasayfa" role="tab">{$LANG.btkreports_anasayfa}</a></li>
        <li role="presentation" class="active"><a href="{$modulelink}&action=config" aria-controls="ayarlar" role="tab">{$LANG.btkreports_ayarlar}</a></li>
        <li role="presentation"><a href="{$modulelink}&action=productgroupmap" aria-controls="eslestirme" role="tab">{$LANG.btkreports_urun_grup_eslestirme}</a></li>
        <li role="presentation"><a href="{$modulelink}&action=personel" aria-controls="personel" role="tab">{$LANG.btkreports_personel_yonetimi}</a></li>
        <li role="presentation"><a href="{$modulelink}&action=generatereports" aria-controls="raporlar" role="tab">{$LANG.btkreports_rapor_secimi_ve_islem}</a></li>
        <li role="presentation"><a href="{$modulelink}&action=viewlogs" aria-controls="loglar" role="tab">{$LANG.btkreports_gunluk_kayitlari}</a></li>
    </ul>

    <div class="tab-content btk-tab-content">
        <div role="tabpanel" class="tab-pane active" id="ayarlar">
            {if $successmessage}
                <div class="alert alert-success text-center">
                    <i class="fas fa-check-circle"></i> {$successmessage}
                </div>
            {/if}
            {if $errormessage}
                <div class="alert alert-danger text-center">
                    <i class="fas fa-exclamation-circle"></i> {$errormessage}
                </div>
            {/if}

            <form method="post" action="{$modulelink}&action=config">
                <input type="hidden" name="token" value="{$csrfToken}" />

                {* <!-- Operatör & FTP Sunucu Ayarları Başlığı --> *}
                <div class="btk-section-title">
                    {$LANG.btkreports_config_operator_ftp_ayarlari}
                </div>
                {* ... (config.tpl'in geri kalan form içeriği bir önceki mesajdakiyle aynı) ... *}
                {* Önceki mesajdaki config.tpl içeriğinin TAMAMINI buraya kopyalayın (form elemanları kısmı) *}
                {* ----- ÖNCEKİ config.tpl FORM İÇERİĞİ BURAYA GELECEK ----- *}
                <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
                    <tr><td class="fieldlabel" width="200">{$LANG.btkreports_operator_adi_label}</td><td class="fieldarea"><input type="text" name="operator_adi" class="form-control input-400" value="{$currentConfig.operator_adi|escape}" /><small class="help-block">{$LANG.btkreports_operator_adi_aciklama}</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_operator_kodu_label}</td><td class="fieldarea"><input type="text" name="operator_kodu" class="form-control input-150" value="{$currentConfig.operator_kodu|escape}" maxlength="3" /><small class="help-block">{$LANG.btkreports_operator_kodu_aciklama}</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_operator_unvani_label}</td><td class="fieldarea"><input type="text" name="operator_unvani" class="form-control input-500" value="{$currentConfig.operator_unvani|escape}" /><small class="help-block">{$LANG.btkreports_operator_unvani_aciklama}</small></td></tr>
                </table>
                <div class="btk-subsection-title">{$LANG.btkreports_ana_ftp_sunucusu_bilgileri}</div>
                <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
                    <tr><td class="fieldlabel" width="200">{$LANG.btkreports_ftp_adresi_label}</td><td class="fieldarea"><input type="text" name="ftp_host" id="ftp_host" class="form-control input-300" value="{$currentConfig.ftp_host|escape}" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_port_label}</td><td class="fieldarea"><input type="number" name="ftp_port" id="ftp_port" class="form-control input-100" value="{$currentConfig.ftp_port|default:21}" /><small class="help-block">{$LANG.btkreports_ftp_port_aciklama}</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_kullanici_adi_label}</td><td class="fieldarea"><input type="text" name="ftp_username" id="ftp_username" class="form-control input-250" value="{$currentConfig.ftp_username|escape}" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_sifre_label}</td><td class="fieldarea"><input type="password" name="ftp_password" id="ftp_password" class="form-control input-250" value="" autocomplete="new-password" /><small class="help-block">{$LANG.btkreports_ftp_sifre_aciklama} {$currentConfig.ftp_password_decrypted_placeholder}</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_rehber_dosya_yolu_label}</td><td class="fieldarea"><input type="text" name="ftp_path_rehber" class="form-control input-400" value="{$currentConfig.ftp_path_rehber|default:'/'|escape}" /><small class="help-block">{$LANG.btkreports_ftp_rehber_dosya_yolu_aciklama}</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_hareket_dosya_yolu_label}</td><td class="fieldarea"><input type="text" name="ftp_path_hareket" class="form-control input-400" value="{$currentConfig.ftp_path_hareket|default:'/'|escape}" /><small class="help-block">{$LANG.btkreports_ftp_hareket_dosya_yolu_aciklama}</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_personel_dosya_yolu_label}</td><td class="fieldarea"><input type="text" name="ftp_path_personel" class="form-control input-400" value="{$currentConfig.ftp_path_personel|default:'/'|escape}" /><small class="help-block">{$LANG.btkreports_ftp_personel_dosya_yolu_aciklama}</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_use_ssl_label}</td><td class="fieldarea"><label class="btk-switch"><input type="checkbox" name="ftp_use_ssl" id="ftp_use_ssl_toggle" value="1" {if $currentConfig.ftp_use_ssl}checked{/if}><span class="btk-slider round"></span></label></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_passive_mode_label}</td><td class="fieldarea"><label class="btk-switch"><input type="checkbox" name="ftp_passive_mode" id="ftp_passive_mode_toggle" value="1" {if $currentConfig.ftp_passive_mode|default:true}checked{/if}><span class="btk-slider round"></span></label></td></tr>
                    <tr><td class="fieldlabel"></td><td class="fieldarea"><button type="button" id="testFtpAna" class="btn btn-info"><i class="fas fa-plug"></i> {$LANG.btkreports_test_et} (Ana)</button><div id="ftpTestResultAna" class="alert" style="display:none; margin-top:10px;"></div></td></tr>
                </table>
                <div class="btk-subsection-title">{$LANG.btkreports_yedek_ftp_sunucusu_bilgileri}</div>
                <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
                    <tr><td class="fieldlabel" width="200">{$LANG.btkreports_yedek_ftp_kullan_label}</td><td class="fieldarea"><label class="btk-switch"><input type="checkbox" name="ftp_yedek_aktif" id="ftp_yedek_aktif_toggle" value="1" {if $currentConfig.ftp_yedek_aktif}checked{/if}><span class="btk-slider round"></span></label></td></tr>
                </table>
                <div class="btk-yedek-ftp-fields {if !$currentConfig.ftp_yedek_aktif}hidden{/if}">
                <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
                    <tr><td class="fieldlabel" width="200">{$LANG.btkreports_ftp_adresi_label}</td><td class="fieldarea"><input type="text" name="ftp_host_yedek" id="ftp_host_yedek" class="form-control input-300" value="{$currentConfig.ftp_host_yedek|escape}" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_port_label}</td><td class="fieldarea"><input type="number" name="ftp_port_yedek" id="ftp_port_yedek" class="form-control input-100" value="{$currentConfig.ftp_port_yedek|default:21}" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_kullanici_adi_label}</td><td class="fieldarea"><input type="text" name="ftp_username_yedek" id="ftp_username_yedek" class="form-control input-250" value="{$currentConfig.ftp_username_yedek|escape}" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_sifre_label}</td><td class="fieldarea"><input type="password" name="ftp_password_yedek" id="ftp_password_yedek" class="form-control input-250" value="" autocomplete="new-password" /><small class="help-block">{$LANG.btkreports_ftp_sifre_aciklama} {$currentConfig.ftp_password_yedek_decrypted_placeholder}</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_rehber_dosya_yolu_label}</td><td class="fieldarea"><input type="text" name="ftp_path_rehber_yedek" class="form-control input-400" value="{$currentConfig.ftp_path_rehber_yedek|default:'/'|escape}" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_hareket_dosya_yolu_label}</td><td class="fieldarea"><input type="text" name="ftp_path_hareket_yedek" class="form-control input-400" value="{$currentConfig.ftp_path_hareket_yedek|default:'/'|escape}" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_personel_dosya_yolu_label}</td><td class="fieldarea"><input type="text" name="ftp_path_personel_yedek" class="form-control input-400" value="{$currentConfig.ftp_path_personel_yedek|default:'/'|escape}" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_use_ssl_label}</td><td class="fieldarea"><label class="btk-switch"><input type="checkbox" name="ftp_use_ssl_yedek" id="ftp_use_ssl_yedek_toggle" value="1" {if $currentConfig.ftp_use_ssl_yedek}checked{/if}><span class="btk-slider round"></span></label></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_passive_mode_label}</td><td class="fieldarea"><label class="btk-switch"><input type="checkbox" name="ftp_passive_mode_yedek" id="ftp_passive_mode_yedek_toggle" value="1" {if $currentConfig.ftp_passive_mode_yedek|default:true}checked{/if}><span class="btk-slider round"></span></label></td></tr>
                    <tr><td class="fieldlabel"></td><td class="fieldarea"><button type="button" id="testFtpYedek" class="btn btn-info"><i class="fas fa-plug"></i> {$LANG.btkreports_test_et} (Yedek)</button><div id="ftpTestResultYedek" class="alert" style="display:none; margin-top:10px;"></div></td></tr>
                </table>
                </div>
                <div class="btk-section-title">{$LANG.btkreports_config_btk_yetkilendirme_secenekleri}</div>
                <p>{$LANG.btkreports_btk_yetkilendirme_aciklama}</p>
                <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
                    <tr><td class="fieldlabel" width="200">{$LANG.btkreports_btk_yetkilendirme_turleri_label}</td><td class="fieldarea">
                        <ul class="btk-yetki-list">
                            {foreach from=$btkYetkiTurleri key=kod item=isim}
                                <li><label class="btk-switch"><input type="checkbox" name="secilen_yetki_turleri[]" value="{$kod}" id="yetki_{$kod}" {if $kod|in_array:$currentConfig.secilen_yetki_turleri_array}checked{/if}><span class="btk-slider round"></span></label><label for="yetki_{$kod}" style="margin-left: 5px; vertical-align: middle; cursor:pointer;">{$isim|escape} ({$kod|escape})</label></li>
                            {/foreach}
                        </ul>
                    </td></tr>
                </table>
                <div class="btk-section-title">{$LANG.btkreports_config_cron_ayarlari}</div>
                <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
                    <tr><td colspan="2"><strong>{$LANG.btkreports_cron_rehber_label}</strong> <small>({$LANG.btkreports_cron_rehber_varsayilan})</small></td></tr>
                    <tr><td class="fieldlabel" width="200">{$LANG.btkreports_cron_gun_ay_label} (Rehber)</td><td class="fieldarea"><input type="text" name="cron_rehber_ay" class="form-control input-100" value="{$currentConfig.cron_rehber_ay|default:'1'}" placeholder="1" /> <small>Örn: 1 (Her ayın 1'i)</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_gun_hafta_label} (Rehber)</td><td class="fieldarea"><input type="text" name="cron_rehber_gun_hafta" class="form-control input-100" value="{$currentConfig.cron_rehber_gun_hafta|default:'*'}" placeholder="*" /> <small>Rehber için ayın günü kullanılır, burası '*' kalabilir.</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_saat_label}</td><td class="fieldarea"><input type="text" name="cron_rehber_saat" class="form-control input-100" value="{$currentConfig.cron_rehber_saat|default:'10'}" placeholder="10" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_dakika_label}</td><td class="fieldarea"><input type="text" name="cron_rehber_dakika" class="form-control input-100" value="{$currentConfig.cron_rehber_dakika|default:'00'}" placeholder="00" /></td></tr>
                    <tr><td colspan="2"><hr /></td></tr>
                    <tr><td colspan="2"><strong>{$LANG.btkreports_cron_hareket_label}</strong> <small>({$LANG.btkreports_cron_hareket_varsayilan})</small></td></tr>
                    <tr><td class="fieldlabel" width="200">{$LANG.btkreports_cron_ay_label} (Hareket)</td><td class="fieldarea"><input type="text" name="cron_hareket_ay" class="form-control input-100" value="{$currentConfig.cron_hareket_ay|default:'*'}" placeholder="*" /> <small>Örn: * (Her ay)</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_gun_hafta_label} (Hareket)</td><td class="fieldarea"><input type="text" name="cron_hareket_gun_hafta" class="form-control input-100" value="{$currentConfig.cron_hareket_gun_hafta|default:'*'}" placeholder="*" /> <small>Örn: * (Her gün)</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_saat_label}</td><td class="fieldarea"><input type="text" name="cron_hareket_saat" class="form-control input-100" value="{$currentConfig.cron_hareket_saat|default:'01'}" placeholder="01" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_dakika_label}</td><td class="fieldarea"><input type="text" name="cron_hareket_dakika" class="form-control input-100" value="{$currentConfig.cron_hareket_dakika|default:'00'}" placeholder="00" /></td></tr>
                    <tr><td colspan="2"><hr /></td></tr>
                    <tr><td colspan="2"><strong>{$LANG.btkreports_cron_personel_label}</strong> <small>({$LANG.btkreports_cron_personel_varsayilan})</small></td></tr>
                    <tr><td class="fieldlabel" width="200">{$LANG.btkreports_cron_ay_label} (Personel)</td><td class="fieldarea"><input type="text" name="cron_personel_ay" class="form-control input-100" value="{$currentConfig.cron_personel_ay|default:'6,12'}" placeholder="6,12" /> <small>Örn: 6,12 (Haziran ve Aralık)</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_gun_ay_label} (Personel)</td><td class="fieldarea"><input type="text" name="cron_personel_gun_ay" class="form-control input-100" value="{$currentConfig.cron_personel_gun_ay|default:'L'}" placeholder="L" /> <small>Örn: L (Ayın son günü)</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_saat_label}</td><td class="fieldarea"><input type="text" name="cron_personel_saat" class="form-control input-100" value="{$currentConfig.cron_personel_saat|default:'16'}" placeholder="16" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_dakika_label}</td><td class="fieldarea"><input type="text" name="cron_personel_dakika" class="form-control input-100" value="{$currentConfig.cron_personel_dakika|default:'00'}" placeholder="00" /></td></tr>
                </table>
                <div class="btk-section-title">{$LANG.btkreports_config_diger_ayarlar}</div>
                <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
                    <tr><td class="fieldlabel" width="300">{$LANG.btkreports_bos_dosya_gonder_label}</td><td class="fieldarea"><label class="btk-switch"><input type="checkbox" name="bos_dosya_gonder" value="1" {if $currentConfig.bos_dosya_gonder}checked{/if}><span class="btk-slider round"></span></label><small class="help-block">{$LANG.btkreports_bos_dosya_gonder_aciklama}</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_sil_tablolar_kaldirirken_label}</td><td class="fieldarea"><label class="btk-switch"><input type="checkbox" name="sil_tablolar_kaldirirken" value="1" {if $currentConfig.sil_tablolar_kaldirirken}checked{/if}><span class="btk-slider round"></span></label><small class="help-block" style="color:red;">{$LANG.btkreports_sil_tablolar_kaldirirken_aciklama}</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_nvi_tc_dogrulama_aktif_label}</td><td class="fieldarea"><label class="btk-switch"><input type="checkbox" name="nvi_tc_dogrulama_aktif" value="1" {if $currentConfig.nvi_tc_dogrulama_aktif|default:true}checked{/if}><span class="btk-slider round"></span></label></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_nvi_yabanci_dogrulama_aktif_label}</td><td class="fieldarea"><label class="btk-switch"><input type="checkbox" name="nvi_yabanci_dogrulama_aktif" value="1" {if $currentConfig.nvi_yabanci_dogrulama_aktif|default:true}checked{/if}><span class="btk-slider round"></span></label></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_log_level_label}</td><td class="fieldarea">
                        <select name="log_level" class="form-control input-200">
                            <option value="DEBUG" {if $currentConfig.log_level eq 'DEBUG'}selected{/if}>DEBUG (En Detaylı)</option>
                            <option value="INFO" {if $currentConfig.log_level eq 'INFO' || !$currentConfig.log_level}selected{/if}>INFO (Normal)</option>
                            <option value="WARNING" {if $currentConfig.log_level eq 'WARNING'}selected{/if}>WARNING (Uyarılar)</option>
                            <option value="ERROR" {if $currentConfig.log_level eq 'ERROR'}selected{/if}>ERROR (Sadece Hatalar)</option>
                        </select><small class="help-block">{$LANG.btkreports_log_level_aciklama}</small>
                    </td></tr>
                </table>
                {* ----- ÖNCEKİ config.tpl FORM İÇERİĞİ BURADA BİTİYOR ----- *}

                <div class="btn-container" style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-top: 1px solid #ddd; text-align: right;">
                    <input type="submit" name="save_config" value="{$LANG.btkreports_kaydet}" class="btn btn-primary btn-lg" />
                </div>
            </form>
        </div>
    </div>
</div>


{* Dil değişkenlerini ve modül linkini JavaScript'e aktarmak için *}
<script type="text/javascript">
    var BtkLang = {
        test_ediliyor: "{$LANG.btkreports_test_ediliyor}",
        lutfen_bekleyin: "{$LANG.btkreports_lutfen_bekleyin}",
        ftp_test_basarili: "{$LANG.btkreports_ftp_test_basarili}",
        ftp_test_basarisiz: "{$LANG.btkreports_ftp_test_basarisiz}"
    };
    var btkModuleLink = "{$modulelink}"; // AJAX istekleri için modül linki (btk_admin_scripts.js içinde kullanılacak)
</script>

{* Modüle özel JavaScript dosyasını dahil et *}
<script type="text/javascript" src="../modules/addons/btkreports/assets/js/btk_admin_scripts.js?v={$version}"></script>