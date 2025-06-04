{*
 * WHMCS BTK Raporlama Modülü - Ayarlar Sayfası Şablonu
 * Version: 6.0.1 BETA (Tasarım Revizyonu v4 - Blend Stili Toggle)
*}

<div class="btk-addon-page-container">
    <div class="page-header">
        <h2 class="btk-page-title"><i class="fas fa-cogs"></i> {$LANG.btkreports_ayarlar}</h2>
    </div>

    <ul class="nav nav-tabs btk-nav-tabs" role="tablist" id="btkModuleTabs">
        <li role="presentation"><a href="{$modulelink}&action=dashboard" aria-controls="anasayfa_content" data-action="dashboard">{$LANG.btkreports_anasayfa}</a></li>
        <li role="presentation" class="active"><a href="#config_content_tab" aria-controls="config_content_tab" role="tab" data-toggle="tab">{$LANG.btkreports_ayarlar}</a></li>
        <li role="presentation"><a href="{$modulelink}&action=productgroupmap" data-action="productgroupmap">{$LANG.btkreports_urun_grup_eslestirme}</a></li>
        <li role="presentation"><a href="{$modulelink}&action=personel" data-action="personel">{$LANG.btkreports_personel_yonetimi}</a></li>
        <li role="presentation"><a href="{$modulelink}&action=generatereports" data-action="generatereports">{$LANG.btkreports_rapor_secimi_ve_islem}</a></li>
        <li role="presentation"><a href="{$modulelink}&action=viewlogs" data-action="viewlogs">{$LANG.btkreports_gunluk_kayitlari}</a></li>
    </ul>

    <div class="tab-content btk-tab-content">
        <div role="tabpanel" class="tab-pane active" id="config_content_tab">
            {if $successmessage}
                <div class="alert alert-success text-center" style="margin-top:15px; margin-bottom: 15px;">
                    <i class="fas fa-check-circle"></i> {$successmessage}
                </div>
            {/if}
            {if $errormessage}
                <div class="alert alert-danger text-center" style="margin-top:15px; margin-bottom: 15px;">
                    <i class="fas fa-exclamation-circle"></i> {$errormessage}
                </div>
            {/if}

            <form method="post" action="{$modulelink}&action=config" class="btk-config-form">
                <input type="hidden" name="token" value="{$csrfToken}" />

                <div class="btk-section-title">
                    <i class="fas fa-user-cog"></i> {$LANG.btkreports_config_operator_ftp_ayarlari}
                </div>
                <table class="form" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr><td class="fieldlabel">{$LANG.btkreports_operator_adi_label}</td><td class="fieldarea"><input type="text" name="operator_adi" class="form-control input-400" value="{$currentConfig.operator_adi|escape}" /><small class="help-block">{$LANG.btkreports_operator_adi_aciklama}</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_operator_kodu_label}</td><td class="fieldarea"><input type="text" name="operator_kodu" class="form-control input-150" value="{$currentConfig.operator_kodu|escape}" maxlength="3" /><small class="help-block">{$LANG.btkreports_operator_kodu_aciklama}</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_operator_unvani_label}</td><td class="fieldarea"><input type="text" name="operator_unvani" class="form-control input-500" value="{$currentConfig.operator_unvani|escape}" /><small class="help-block">{$LANG.btkreports_operator_unvani_aciklama}</small></td></tr>
                </table>

                <div class="btk-subsection-title"><i class="fas fa-server"></i> {$LANG.btkreports_ana_ftp_sunucusu_bilgileri}</div>
                <table class="form" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_adresi_label}</td><td class="fieldarea"><input type="text" name="ftp_host" id="ftp_host" class="form-control input-300" value="{$currentConfig.ftp_host|escape}" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_port_label}</td><td class="fieldarea"><input type="number" name="ftp_port" id="ftp_port" class="form-control input-100" value="{$currentConfig.ftp_port|default:21}" /><small class="help-block">{$LANG.btkreports_ftp_port_aciklama}</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_kullanici_adi_label}</td><td class="fieldarea"><input type="text" name="ftp_username" id="ftp_username" class="form-control input-250" value="{$currentConfig.ftp_username|escape}" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_sifre_label}</td><td class="fieldarea"><input type="password" name="ftp_password" id="ftp_password" class="form-control input-250" value="" autocomplete="new-password" /><small class="help-block">{$LANG.btkreports_ftp_sifre_aciklama} {$currentConfig.ftp_password_decrypted_placeholder}</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_rehber_dosya_yolu_label}</td><td class="fieldarea"><input type="text" name="ftp_path_rehber" class="form-control input-400" value="{$currentConfig.ftp_path_rehber|default:'/'|escape}" /><small class="help-block">{$LANG.btkreports_ftp_rehber_dosya_yolu_aciklama}</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_hareket_dosya_yolu_label}</td><td class="fieldarea"><input type="text" name="ftp_path_hareket" class="form-control input-400" value="{$currentConfig.ftp_path_hareket|default:'/'|escape}" /><small class="help-block">{$LANG.btkreports_ftp_hareket_dosya_yolu_aciklama}</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_personel_dosya_yolu_label}</td><td class="fieldarea"><input type="text" name="ftp_path_personel" class="form-control input-400" value="{$currentConfig.ftp_path_personel|default:'/'|escape}" /><small class="help-block">{$LANG.btkreports_ftp_personel_dosya_yolu_aciklama}</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_use_ssl_label}</td><td class="fieldarea"><div class="btk-switch-blend"><input type="checkbox" name="ftp_use_ssl" id="ftp_use_ssl_toggle" value="1" {if $currentConfig.ftp_use_ssl}checked{/if}><label for="ftp_use_ssl_toggle"><span class="btk-switch-inner"></span><span class="btk-switch-switch"></span></label></div></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_passive_mode_label}</td><td class="fieldarea"><div class="btk-switch-blend"><input type="checkbox" name="ftp_passive_mode" id="ftp_passive_mode_toggle" value="1" {if $currentConfig.ftp_passive_mode|default:true}checked{/if}><label for="ftp_passive_mode_toggle"><span class="btk-switch-inner"></span><span class="btk-switch-switch"></span></label></div></td></tr>
                    <tr><td class="fieldlabel"></td><td class="fieldarea"><button type="button" id="testFtpAna" class="btn btn-info btn-sm" data-resultdiv="ftpTestResultAna"><i class="fas fa-plug"></i> {$LANG.btkreports_test_et} (Ana)</button><div id="ftpTestResultAna" class="alert" style="display:none;"></div></td></tr>
                </table>

                <div class="btk-subsection-title"><i class="fas fa-archive"></i> {$LANG.btkreports_yedek_ftp_sunucusu_bilgileri}</div>
                <table class="form" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr><td class="fieldlabel">{$LANG.btkreports_yedek_ftp_kullan_label}</td><td class="fieldarea"><div class="btk-switch-blend"><input type="checkbox" name="ftp_yedek_aktif" id="ftp_yedek_aktif_toggle" value="1" {if $currentConfig.ftp_yedek_aktif}checked{/if}><label for="ftp_yedek_aktif_toggle"><span class="btk-switch-inner"></span><span class="btk-switch-switch"></span></label></div></td></tr>
                </table>
                <div class="btk-yedek-ftp-fields {if !$currentConfig.ftp_yedek_aktif}hidden{/if}">
                <table class="form" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_adresi_label}</td><td class="fieldarea"><input type="text" name="ftp_host_yedek" id="ftp_host_yedek" class="form-control input-300" value="{$currentConfig.ftp_host_yedek|escape}" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_port_label}</td><td class="fieldarea"><input type="number" name="ftp_port_yedek" id="ftp_port_yedek" class="form-control input-100" value="{$currentConfig.ftp_port_yedek|default:21}" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_kullanici_adi_label}</td><td class="fieldarea"><input type="text" name="ftp_username_yedek" id="ftp_username_yedek" class="form-control input-250" value="{$currentConfig.ftp_username_yedek|escape}" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_sifre_label}</td><td class="fieldarea"><input type="password" name="ftp_password_yedek" id="ftp_password_yedek" class="form-control input-250" value="" autocomplete="new-password" /><small class="help-block">{$LANG.btkreports_ftp_sifre_aciklama} {$currentConfig.ftp_password_yedek_decrypted_placeholder}</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_rehber_dosya_yolu_label}</td><td class="fieldarea"><input type="text" name="ftp_path_rehber_yedek" class="form-control input-400" value="{$currentConfig.ftp_path_rehber_yedek|default:'/'|escape}" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_hareket_dosya_yolu_label}</td><td class="fieldarea"><input type="text" name="ftp_path_hareket_yedek" class="form-control input-400" value="{$currentConfig.ftp_path_hareket_yedek|default:'/'|escape}" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_personel_dosya_yolu_label}</td><td class="fieldarea"><input type="text" name="ftp_path_personel_yedek" class="form-control input-400" value="{$currentConfig.ftp_path_personel_yedek|default:'/'|escape}" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_use_ssl_label}</td><td class="fieldarea"><div class="btk-switch-blend"><input type="checkbox" name="ftp_use_ssl_yedek" id="ftp_use_ssl_yedek_toggle" value="1" {if $currentConfig.ftp_use_ssl_yedek}checked{/if}><label for="ftp_use_ssl_yedek_toggle"><span class="btk-switch-inner"></span><span class="btk-switch-switch"></span></label></div></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_ftp_passive_mode_label}</td><td class="fieldarea"><div class="btk-switch-blend"><input type="checkbox" name="ftp_passive_mode_yedek" id="ftp_passive_mode_yedek_toggle" value="1" {if $currentConfig.ftp_passive_mode_yedek|default:true}checked{/if}><label for="ftp_passive_mode_yedek_toggle"><span class="btk-switch-inner"></span><span class="btk-switch-switch"></span></label></div></td></tr>
                    <tr><td class="fieldlabel"></td><td class="fieldarea"><button type="button" id="testFtpYedek" class="btn btn-info btn-sm" data-resultdiv="ftpTestResultYedek"><i class="fas fa-plug"></i> {$LANG.btkreports_test_et} (Yedek)</button><div id="ftpTestResultYedek" class="alert" style="display:none;"></div></td></tr>
                </table>
                </div>

                <div class="btk-section-title"><i class="fas fa-check-square"></i> {$LANG.btkreports_config_btk_yetkilendirme_secenekleri}</div>
                <p>{$LANG.btkreports_btk_yetkilendirme_aciklama}</p>
                <div class="btk-settings-grid">
                    {* JavaScript BTK Yetki Türlerini ikiye bölecek *}
                    {assign var="btkYetkiTurleriHalf" value=($btkYetkiTurleri|@count / 2)|ceil}
                    <div class="btk-settings-column">
                        <ul>
                            {foreach from=$btkYetkiTurleri key=kod item=isim name=yetkilerloop}
                                {if $smarty.foreach.yetkilerloop.index < $btkYetkiTurleriHalf}
                                    <li class="btk-switch-container">
                                        <div class="btk-switch-blend">
                                            <input type="checkbox" name="secilen_yetki_turleri[]" value="{$kod}" id="yetki_{$kod}" {if $currentConfig.secilen_yetki_turleri_array && $kod|in_array:$currentConfig.secilen_yetki_turleri_array}checked{/if}>
                                            <label for="yetki_{$kod}"><span class="btk-switch-inner"></span><span class="btk-switch-switch"></span></label>
                                        </div>
                                        <label for="yetki_{$kod}" class="btk-switch-label">{$isim|escape} ({$kod|escape})</label>
                                        <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" data-placement="right" title="{$LANG['btk_yetki_info_'|cat:$kod]|default:($isim|cat:' yetki türü için açıklama.')}"></i>
                                    </li>
                                {/if}
                            {/foreach}
                        </ul>
                    </div>
                    <div class="btk-settings-column">
                        <ul>
                            {foreach from=$btkYetkiTurleri key=kod item=isim name=yetkilerloop2}
                                {if $smarty.foreach.yetkilerloop2.index >= $btkYetkiTurleriHalf}
                                     <li class="btk-switch-container">
                                        <div class="btk-switch-blend">
                                            <input type="checkbox" name="secilen_yetki_turleri[]" value="{$kod}" id="yetki_{$kod}_2" {if $currentConfig.secilen_yetki_turleri_array && $kod|in_array:$currentConfig.secilen_yetki_turleri_array}checked{/if}>
                                            <label for="yetki_{$kod}_2"><span class="btk-switch-inner"></span><span class="btk-switch-switch"></span></label>
                                        </div>
                                        <label for="yetki_{$kod}_2" class="btk-switch-label">{$isim|escape} ({$kod|escape})</label>
                                         <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" data-placement="right" title="{$LANG['btk_yetki_info_'|cat:$kod]|default:($isim|cat:' yetki türü için açıklama.')}"></i>
                                    </li>
                                {/if}
                            {/foreach}
                        </ul>
                    </div>
                </div>


                <div class="btk-section-title" style="margin-top:30px;"><i class="far fa-clock"></i> {$LANG.btkreports_config_cron_ayarlari}</div>
                {* ... (Cron ayarları bölümü HTML yapısı bir öncekiyle aynı, table.form ve fieldlabel/fieldarea kullanılacak) ... *}
                 <table class="form" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr><td colspan="2"><strong>{$LANG.btkreports_cron_rehber_label}</strong> <small>({$LANG.btkreports_cron_rehber_varsayilan})</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_gun_ay_label} (Rehber)</td><td class="fieldarea"><input type="text" name="cron_rehber_ay" class="form-control input-100" value="{$currentConfig.cron_rehber_ay|default:'1'}" placeholder="1" /> <small>Örn: 1 (Her ayın 1'i)</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_gun_hafta_label} (Rehber)</td><td class="fieldarea"><input type="text" name="cron_rehber_gun_hafta" class="form-control input-100" value="{$currentConfig.cron_rehber_gun_hafta|default:'*'}" placeholder="*" /> <small>Rehber için ayın günü kullanılır, burası '*' kalabilir.</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_saat_label}</td><td class="fieldarea"><input type="text" name="cron_rehber_saat" class="form-control input-100" value="{$currentConfig.cron_rehber_saat|default:'10'}" placeholder="10" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_dakika_label}</td><td class="fieldarea"><input type="text" name="cron_rehber_dakika" class="form-control input-100" value="{$currentConfig.cron_rehber_dakika|default:'00'}" placeholder="00" /></td></tr>
                </table>
                <hr style="margin:15px 0;" />
                <table class="form" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr><td colspan="2"><strong>{$LANG.btkreports_cron_hareket_label}</strong> <small>({$LANG.btkreports_cron_hareket_varsayilan})</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_ay_label} (Hareket)</td><td class="fieldarea"><input type="text" name="cron_hareket_ay" class="form-control input-100" value="{$currentConfig.cron_hareket_ay|default:'*'}" placeholder="*" /> <small>Örn: * (Her ay)</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_gun_hafta_label} (Hareket)</td><td class="fieldarea"><input type="text" name="cron_hareket_gun_hafta" class="form-control input-100" value="{$currentConfig.cron_hareket_gun_hafta|default:'*'}" placeholder="*" /> <small>Örn: * (Her gün)</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_saat_label}</td><td class="fieldarea"><input type="text" name="cron_hareket_saat" class="form-control input-100" value="{$currentConfig.cron_hareket_saat|default:'01'}" placeholder="01" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_dakika_label}</td><td class="fieldarea"><input type="text" name="cron_hareket_dakika" class="form-control input-100" value="{$currentConfig.cron_hareket_dakika|default:'00'}" placeholder="00" /></td></tr>
                </table>
                <hr style="margin:15px 0;" />
                 <table class="form" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr><td colspan="2"><strong>{$LANG.btkreports_cron_personel_label}</strong> <small>({$LANG.btkreports_cron_personel_varsayilan})</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_ay_label} (Personel)</td><td class="fieldarea"><input type="text" name="cron_personel_ay" class="form-control input-100" value="{$currentConfig.cron_personel_ay|default:'6,12'}" placeholder="6,12" /> <small>Örn: 6,12 (Haziran ve Aralık)</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_gun_ay_label} (Personel)</td><td class="fieldarea"><input type="text" name="cron_personel_gun_ay" class="form-control input-100" value="{$currentConfig.cron_personel_gun_ay|default:'L'}" placeholder="L" /> <small>Örn: L (Ayın son günü)</small></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_saat_label}</td><td class="fieldarea"><input type="text" name="cron_personel_saat" class="form-control input-100" value="{$currentConfig.cron_personel_saat|default:'16'}" placeholder="16" /></td></tr>
                    <tr><td class="fieldlabel">{$LANG.btkreports_cron_dakika_label}</td><td class="fieldarea"><input type="text" name="cron_personel_dakika" class="form-control input-100" value="{$currentConfig.cron_personel_dakika|default:'00'}" placeholder="00" /></td></tr>
                </table>


                <div class="btk-section-title" style="margin-top:30px;"><i class="fas fa-sliders-h"></i> {$LANG.btkreports_config_diger_ayarlar}</div>
                <div class="btk-settings-grid">
                     <div class="btk-settings-column">
                        <ul class="btk-diger-ayarlar-list">
                            <li class="btk-switch-container">
                                <div class="btk-switch-blend">
                                    <input type="checkbox" name="bos_dosya_gonder" id="bos_dosya_gonder_toggle" value="1" {if $currentConfig.bos_dosya_gonder}checked{/if}>
                                    <label for="bos_dosya_gonder_toggle"><span class="btk-switch-inner"></span><span class="btk-switch-switch"></span></label>
                                </div>
                                <label class="btk-switch-label" for="bos_dosya_gonder_toggle">{$LANG.btkreports_bos_dosya_gonder_label}</label>
                            </li>
                            <li><small class="help-block btk-switch-description">{$LANG.btkreports_bos_dosya_gonder_aciklama}</small></li>

                            <li class="btk-switch-container" style="margin-top:10px;">
                                 <div class="btk-switch-blend">
                                    <input type="checkbox" name="nvi_tc_dogrulama_aktif" id="nvi_tc_dogrulama_aktif_toggle" value="1" {if $currentConfig.nvi_tc_dogrulama_aktif|default:true}checked{/if}>
                                    <label for="nvi_tc_dogrulama_aktif_toggle"><span class="btk-switch-inner"></span><span class="btk-switch-switch"></span></label>
                                </div>
                                <label class="btk-switch-label" for="nvi_tc_dogrulama_aktif_toggle">{$LANG.btkreports_nvi_tc_dogrulama_aktif_label}</label>
                            </li>
                        </ul>
                    </div>
                    <div class="btk-settings-column">
                        <ul class="btk-diger-ayarlar-list">
                            <li class="btk-switch-container">
                                <div class="btk-switch-blend">
                                    <input type="checkbox" name="sil_tablolar_kaldirirken" id="sil_tablolar_kaldirirken_toggle" value="1" {if $currentConfig.sil_tablolar_kaldirirken}checked{/if}>
                                    <label for="sil_tablolar_kaldirirken_toggle"><span class="btk-switch-inner"></span><span class="btk-switch-switch"></span></label>
                                </div>
                                <label class="btk-switch-label" for="sil_tablolar_kaldirirken_toggle">{$LANG.btkreports_sil_tablolar_kaldirirken_label}</label>
                            </li>
                             <li><small class="help-block btk-switch-description btk-config-uyari">{$LANG.btkreports_sil_tablolar_kaldirirken_aciklama}</small></li>

                            <li class="btk-switch-container" style="margin-top:10px;">
                                <div class="btk-switch-blend">
                                    <input type="checkbox" name="nvi_yabanci_dogrulama_aktif" id="nvi_yabanci_dogrulama_aktif_toggle" value="1" {if $currentConfig.nvi_yabanci_dogrulama_aktif|default:true}checked{/if}>
                                    <label for="nvi_yabanci_dogrulama_aktif_toggle"><span class="btk-switch-inner"></span><span class="btk-switch-switch"></span></label>
                                </div>
                                <label class="btk-switch-label" for="nvi_yabanci_dogrulama_aktif_toggle">{$LANG.btkreports_nvi_yabanci_dogrulama_aktif_label}</label>
                            </li>
                        </ul>
                    </div>
                </div>
                <table class="form" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:20px;">
                    <tr>
                        <td class="fieldlabel">{$LANG.btkreports_log_level_label}</td>
                        <td class="fieldarea">
                            <select name="log_level" class="form-control input-200">
                                <option value="DEBUG" {if $currentConfig.log_level eq 'DEBUG'}selected{/if}>DEBUG (En Detaylı)</option>
                                <option value="INFO" {if $currentConfig.log_level eq 'INFO' || !$currentConfig.log_level}selected{/if}>INFO (Normal)</option>
                                <option value="WARNING" {if $currentConfig.log_level eq 'WARNING'}selected{/if}>WARNING (Uyarılar)</option>
                                <option value="ERROR" {if $currentConfig.log_level eq 'ERROR'}selected{/if}>ERROR (Sadece Hatalar)</option>
                            </select><small class="help-block">{$LANG.btkreports_log_level_aciklama}</small>
                        </td>
                    </tr>
                </table>

                <div class="btn-container">
                    <input type="submit" name="save_config" value="{$LANG.btkreports_kaydet_ve_geri_don|default:'Kaydet ve Geri Dön'}" class="btn btn-primary btn-lg" />
                </div>
            </form>
        </div>
        {* Diğer sekme içerikleri için placeholder'lar *}
        <div role="tabpanel" class="tab-pane" id="anasayfa_placeholder"></div>
        <div role="tabpanel" class="tab-pane" id="productgroupmap_placeholder"></div>
        <div role="tabpanel" class="tab-pane" id="personel_placeholder"></div>
        <div role="tabpanel" class="tab-pane" id="generatereports_placeholder"></div>
        <div role="tabpanel" class="tab-pane" id="viewlogs_placeholder"></div>
    </div>
</div>

<script type="text/javascript">
    // Bu script bloğu sayfanın en sonunda, jQuery yüklendikten sonra olmalı
    jQuery(document).ready(function($) {
        // Bootstrap Tooltip'leri etkinleştir (info ikonları için)
        $('[data-toggle="tooltip"]').tooltip();

        // Yedek FTP alanlarını göster/gizle (btk_admin_scripts.js'den buraya taşındı, çünkü o dosya bazen geç yüklenebiliyor)
        var $yedekFtpToggle = $('#ftp_yedek_aktif_toggle');
        var $yedekFtpFields = $('.btk-yedek-ftp-fields');
        function toggleYedekFtpFields() {
            if ($yedekFtpToggle.is(':checked')) {
                $yedekFtpFields.removeClass('hidden').slideDown();
            } else {
                $yedekFtpFields.slideUp(function() { $(this).addClass('hidden'); });
            }
        }
        if($yedekFtpToggle.length) {
            toggleYedekFtpFields(); // Sayfa yüklendiğinde durumu ayarla
            $yedekFtpToggle.on('change', toggleYedekFtpFields); // Değişiklikte durumu ayarla
        }

        // Sekme linklerine tıklama olayını yönet (sayfa değiştirmeden AJAX ile içerik yükleme veya WHMCS yönlendirmesi için)
        $('#btkModuleTabs a[data-action]').on('click', function (e) {
            var action = $(this).data('action');
            var targetHref = $(this).attr('href');

            if (targetHref && targetHref.startsWith('#') && $(targetHref).length) {
                // Zaten Bootstrap hallediyor, ek bir şey yapmaya gerek yok (data-toggle="tab" varsa)
            } else if (action && action !== '#') {
                e.preventDefault();
                window.location.href = btkModuleLink + '&action=' + action;
            }
        });
    });

    // Global JS değişkenleri (btk_admin_scripts.js tarafından kullanılacak)
    if (typeof BtkLang === 'undefined') { var BtkLang = {}; }
    BtkLang.test_ediliyor = "{str_replace('"', '\"', $LANG.btkreports_test_ediliyor)}";
    BtkLang.lutfen_bekleyin = "{str_replace('"', '\"', $LANG.btkreports_lutfen_bekleyin)}";
    BtkLang.ftp_test_basarili = "{str_replace('"', '\"', $LANG.btkreports_ftp_test_basarili)}";
    BtkLang.ftp_test_basarisiz = "{str_replace('"', '\"', $LANG.btkreports_ftp_test_basarisiz)}";
    var btkModuleLink = "{$modulelink}";
    var btkCsrfToken = "{$csrfToken}";
</script>
{* Modüle özel JavaScript dosyasını dahil et - bu en sonda olmalı *}
<script type="text/javascript" src="../modules/addons/btkreports/assets/js/btk_admin_scripts.js?v={$version}"></script>