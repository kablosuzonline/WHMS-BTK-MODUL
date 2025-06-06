{*
 * WHMCS BTK Raporlama Modülü - Ayarlar Sayfası Şablonu
 * Version: 6.0.3 (Son Tasarım Uygulaması)
*}

{* Sayfa Üstü WHMCS Admin Alanı Navigasyonu *}
<div class="context-bar">
    <div class="breadcrumbs">
        <a href="index.php">WHMCS Admin</a>
        <i class="far fa-angle-right"></i>
        <a href="addonmodules.php">Eklenti Modülleri</a>
        <i class="far fa-angle-right"></i>
        <a href="{$modulelink}">{$LANG.btkreports_modul_adi}</a>
        <i class="far fa-angle-right"></i>
        {$LANG.btkreports_ayarlar}
    </div>
</div>

{* Genel Modül Başlığı *}
<div class="btk-module-header">
    <i class="fas fa-cogs"></i> {$LANG.btkreports_ayarlar}
    <span class="version-text">v{$version}</span>
</div>

{* Modül İçi Sekme Navigasyonu *}
<ul class="nav nav-tabs admin-tabs btk-nav-tabs-override" role="tablist" id="btkModuleTabs">
    <li><a href="{$modulelink}&action=dashboard" data-action="dashboard">{$LANG.btkreports_anasayfa}</a></li>
    <li class="active"><a href="{$modulelink}&action=config" data-action="config">{$LANG.btkreports_ayarlar}</a></li>
    <li><a href="{$modulelink}&action=productgroupmap" data-action="productgroupmap">{$LANG.btkreports_urun_grup_eslestirme}</a></li>
    <li><a href="{$modulelink}&action=personel" data-action="personel">{$LANG.btkreports_personel_yonetimi}</a></li>
    <li><a href="{$modulelink}&action=generatereports" data-action="generatereports">{$LANG.btkreports_rapor_secimi_ve_islem}</a></li>
    <li><a href="{$modulelink}&action=viewlogs" data-action="viewlogs">{$LANG.btkreports_gunluk_kayitlari}</a></li>
</ul>

<div class="tab-content admin-tabs btk-tab-content-override">
    <div role="tabpanel" class="tab-pane active" id="config_content_tab">

        {if $successmessage}
            <div class="alert alert-success text-center btk-global-alert" role="alert">
                <i class="fas fa-check-circle"></i> {$successmessage}
            </div>
        {/if}
        {if $errormessage}
            <div class="alert alert-danger text-center btk-global-alert" role="alert">
                <i class="fas fa-exclamation-circle"></i> {$errormessage}
            </div>
        {/if}

        <form method="post" action="{$modulelink}&action=config" class="form-horizontal btk-config-form" role="form">
            <input type="hidden" name="token" value="{$csrfToken}" />

            {* ----- Operatör & Ana FTP Ayarları Bölümü ----- *}
            <div class="btk-section-container">
                <div class="btk-section-title-bar">
                    <i class="fas fa-user-cog"></i> {$LANG.btkreports_config_operator_ftp_ayarlari}
                </div>
                <div class="btk-section-content">
                    {* Operatör Bilgileri *}
                    <div class="form-group row">
                        <label for="operator_adi" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_operator_adi_label}</label>
                        <div class="col-sm-7">
                            <input type="text" name="operator_adi" id="operator_adi" class="form-control" value="{$currentConfig.operator_adi|escape}" />
                            <p class="help-block">{$LANG.btkreports_operator_adi_aciklama}</p>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="operator_kodu" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_operator_kodu_label}</label>
                        <div class="col-sm-3">
                            <input type="text" name="operator_kodu" id="operator_kodu" class="form-control" value="{$currentConfig.operator_kodu|escape}" maxlength="3" />
                            <p class="help-block">{$LANG.btkreports_operator_kodu_aciklama}</p>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="operator_unvani" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_operator_unvani_label}</label>
                        <div class="col-sm-7">
                            <input type="text" name="operator_unvani" id="operator_unvani" class="form-control" value="{$currentConfig.operator_unvani|escape}" />
                            <p class="help-block">{$LANG.btkreports_operator_unvani_aciklama}</p>
                        </div>
                    </div>

                    <h5 class="btk-inner-section-title"><i class="fas fa-server"></i> {$LANG.btkreports_ana_ftp_sunucusu_bilgileri}</h5>
                    <div class="form-group row"><label for="ftp_host" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_ftp_adresi_label}</label><div class="col-sm-5"><input type="text" name="ftp_host" id="ftp_host" class="form-control" value="{$currentConfig.ftp_host|escape}" /></div></div>
                    <div class="form-group row"><label for="ftp_port" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_ftp_port_label}</label><div class="col-sm-2"><input type="number" name="ftp_port" id="ftp_port" class="form-control" value="{$currentConfig.ftp_port|default:21}" /><small class="help-block">{$LANG.btkreports_ftp_port_aciklama}</small></div></div>
                    <div class="form-group row"><label for="ftp_username" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_ftp_kullanici_adi_label}</label><div class="col-sm-4"><input type="text" name="ftp_username" id="ftp_username" class="form-control" value="{$currentConfig.ftp_username|escape}" /></div></div>
                    <div class="form-group row"><label for="ftp_password" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_ftp_sifre_label}</label><div class="col-sm-4"><input type="password" name="ftp_password" id="ftp_password" class="form-control" value="" autocomplete="new-password" /><small class="help-block">{$currentConfig.ftp_password_decrypted_placeholder}</small></div></div>
                    <div class="form-group row"><label for="ftp_path_rehber" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_ftp_rehber_dosya_yolu_label}</label><div class="col-sm-6"><input type="text" name="ftp_path_rehber" id="ftp_path_rehber" class="form-control" value="{$currentConfig.ftp_path_rehber|default:'/'|escape}" /><small class="help-block">{$LANG.btkreports_ftp_rehber_dosya_yolu_aciklama}</small></div></div>
                    <div class="form-group row"><label for="ftp_path_hareket" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_ftp_hareket_dosya_yolu_label}</label><div class="col-sm-6"><input type="text" name="ftp_path_hareket" id="ftp_path_hareket" class="form-control" value="{$currentConfig.ftp_path_hareket|default:'/'|escape}" /><small class="help-block">{$LANG.btkreports_ftp_hareket_dosya_yolu_aciklama}</small></div></div>
                    <div class="form-group row"><label for="ftp_path_personel" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_ftp_personel_dosya_yolu_label}</label><div class="col-sm-6"><input type="text" name="ftp_path_personel" id="ftp_path_personel" class="form-control" value="{$currentConfig.ftp_path_personel|default:'/'|escape}" /><small class="help-block">{$LANG.btkreports_ftp_personel_dosya_yolu_aciklama}</small></div></div>
                    <div class="form-group row">
                        <label for="ftp_use_ssl_toggle" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_ftp_use_ssl_label}</label>
                        <div class="col-sm-7"><div class="checkbox-btk"><input type="checkbox" name="ftp_use_ssl_toggle" id="ftp_use_ssl_toggle" value="1" {if $currentConfig.ftp_use_ssl}checked{/if}><label for="ftp_use_ssl_toggle"></label></div></div>
                    </div>
                    <div class="form-group row">
                        <label for="ftp_passive_mode_toggle" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_ftp_passive_mode_label}</label>
                        <div class="col-sm-7"><div class="checkbox-btk"><input type="checkbox" name="ftp_passive_mode_toggle" id="ftp_passive_mode_toggle" value="1" {if $currentConfig.ftp_passive_mode|default:true}checked{/if}><label for="ftp_passive_mode_toggle"></label></div></div>
                    </div>
                    <div class="form-group row">
                        <div class="col-sm-3"></div>
                        <div class="col-sm-7">
                            <button type="button" id="testFtpAna" class="btn btn-info btn-sm btk-test-btn-config" data-resultdiv="ftpTestResultAna"><i class="fas fa-plug"></i> {$LANG.btkreports_test_et} (Ana)</button>
                            <div id="ftpTestResultAna" class="alert" style="display:none;"></div>
                        </div>
                    </div>
                </div>
            </div>

            {* ----- Yedek FTP Ayarları Bölümü ----- *}
            <div class="btk-section-container">
                <div class="btk-section-title-bar">
                     <i class="fas fa-archive"></i> {$LANG.btkreports_yedek_ftp_sunucusu_bilgileri}
                </div>
                <div class="btk-section-content">
                    <div class="form-group row">
                        <label for="ftp_yedek_aktif_toggle" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_yedek_ftp_kullan_label}</label>
                        <div class="col-sm-7"><div class="checkbox-btk"><input type="checkbox" name="ftp_yedek_aktif_toggle" id="ftp_yedek_aktif_toggle" value="1" {if $currentConfig.ftp_yedek_aktif}checked{/if}><label for="ftp_yedek_aktif_toggle"></label></div></div>
                    </div>
                    <div class="btk-yedek-ftp-fields {if !$currentConfig.ftp_yedek_aktif}btk-hidden{/if}" {if !$currentConfig.ftp_yedek_aktif}style="display:none;"{/if}>
                        <div class="form-group row"><label for="ftp_host_yedek" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_ftp_adresi_label}</label><div class="col-sm-5"><input type="text" name="ftp_host_yedek" id="ftp_host_yedek" class="form-control" value="{$currentConfig.ftp_host_yedek|escape}" /></div></div>
                        <div class="form-group row"><label for="ftp_port_yedek" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_ftp_port_label}</label><div class="col-sm-2"><input type="number" name="ftp_port_yedek" id="ftp_port_yedek" class="form-control" value="{$currentConfig.ftp_port_yedek|default:21}" /></div></div>
                        <div class="form-group row"><label for="ftp_username_yedek" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_ftp_kullanici_adi_label}</label><div class="col-sm-4"><input type="text" name="ftp_username_yedek" id="ftp_username_yedek" class="form-control" value="{$currentConfig.ftp_username_yedek|escape}" /></div></div>
                        <div class="form-group row"><label for="ftp_password_yedek" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_ftp_sifre_label}</label><div class="col-sm-4"><input type="password" name="ftp_password_yedek" id="ftp_password_yedek" class="form-control" value="" autocomplete="new-password" /><small class="help-block">{$currentConfig.ftp_password_yedek_decrypted_placeholder}</small></div></div>
                        <div class="form-group row"><label for="ftp_path_rehber_yedek" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_ftp_rehber_dosya_yolu_label}</label><div class="col-sm-6"><input type="text" name="ftp_path_rehber_yedek" id="ftp_path_rehber_yedek" class="form-control" value="{$currentConfig.ftp_path_rehber_yedek|default:'/'|escape}" /></div></div>
                        <div class="form-group row"><label for="ftp_path_hareket_yedek" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_ftp_hareket_dosya_yolu_label}</label><div class="col-sm-6"><input type="text" name="ftp_path_hareket_yedek" id="ftp_path_hareket_yedek" class="form-control" value="{$currentConfig.ftp_path_hareket_yedek|default:'/'|escape}" /></div></div>
                        <div class="form-group row"><label for="ftp_path_personel_yedek" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_ftp_personel_dosya_yolu_label}</label><div class="col-sm-6"><input type="text" name="ftp_path_personel_yedek" id="ftp_path_personel_yedek" class="form-control" value="{$currentConfig.ftp_path_personel_yedek|default:'/'|escape}" /></div></div>
                        <div class="form-group row"><label for="ftp_use_ssl_yedek_toggle" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_ftp_use_ssl_label}</label><div class="col-sm-7"><div class="checkbox-btk"><input type="checkbox" name="ftp_use_ssl_yedek_toggle" id="ftp_use_ssl_yedek_toggle" value="1" {if $currentConfig.ftp_use_ssl_yedek}checked{/if}><label for="ftp_use_ssl_yedek_toggle"></label></div></div></div>
                        <div class="form-group row"><label for="ftp_passive_mode_yedek_toggle" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_ftp_passive_mode_label}</label><div class="col-sm-7"><div class="checkbox-btk"><input type="checkbox" name="ftp_passive_mode_yedek_toggle" id="ftp_passive_mode_yedek_toggle" value="1" {if $currentConfig.ftp_passive_mode_yedek|default:true}checked{/if}><label for="ftp_passive_mode_yedek_toggle"></label></div></div></div>
                        <div class="form-group row"><div class="col-sm-3"></div><div class="col-sm-7"><button type="button" id="testFtpYedek" class="btn btn-info btn-sm btk-test-btn-config" data-resultdiv="ftpTestResultYedek"><i class="fas fa-plug"></i> {$LANG.btkreports_test_et} (Yedek)</button><div id="ftpTestResultYedek" class="alert" style="display:none;"></div></div></div>
                    </div>
                </div>
            </div>

            {* ----- BTK Yetkilendirme Seçenekleri Bölümü ----- *}
            <div class="btk-section-container">
                <div class="btk-section-title-bar">
                    <i class="fas fa-user-shield"></i> {$LANG.btkreports_config_btk_yetkilendirme_secenekleri}
                </div>
                <div class="btk-section-content">
                    <p class="help-block" style="margin-bottom:15px;">{$LANG.btkreports_btk_yetkilendirme_aciklama}</p>
                    <div class="row">
                        {assign var="col_md_width" value=6}
                        {assign var="item_count" value=0}
                        {foreach from=$btkYetkiTurleri key=kod item=isim name=yetkilerloop}
                            {if $item_count % 2 == 0}<div class="col-md-{$col_md_width} btk-yetki-column">{/if}
                                <div class="form-group-btk-yetki">
                                    <div class="checkbox-btk">
                                        <input type="checkbox" name="secilen_yetki_turleri[]" value="{$kod}" id="yetki_{$kod}" {if $currentConfig.secilen_yetki_turleri_array && $kod|in_array:$currentConfig.secilen_yetki_turleri_array}checked{/if}>
                                        <label for="yetki_{$kod}"></label>
                                    </div>
                                    <label for="yetki_{$kod}" class="btk-yetki-label-text">{$isim|escape} ({$kod|escape})</label>
                                    <a href="#" class="btk-info-icon" data-toggle="tooltip" data-placement="right" title="{$LANG['btk_yetki_info_'|cat:$kod]|default:($isim|escape|cat:' yetki türü hakkında kısa bilgi.')}"><i class="fas fa-info-circle"></i></a>
                                </div>
                            {if ($item_count % 2 != 0 && $item_count < ($btkYetkiTurleri|@count -1)) || $smarty.foreach.yetkilerloop.last}</div>{/if}
                            {assign var="item_count" value=$item_count+1}
                        {/foreach}
                        {if $item_count % 2 != 0}</div>{/if} {* Tek sayıda eleman kalırsa son sütunu kapat *}
                    </div>
                </div>
            </div>

            {* ----- Cron Ayarları Bölümü ----- *}
            <div class="btk-section-container">
                <div class="btk-section-title-bar">
                     <i class="far fa-clock"></i> {$LANG.btkreports_config_cron_ayarlari}
                </div>
                <div class="btk-section-content">
                    <h5 class="btk-inner-section-title">{$LANG.btkreports_cron_rehber_label} <small class="text-muted">({$LANG.btkreports_cron_rehber_varsayilan})</small></h5>
                    <div class="form-group row"><label for="cron_rehber_ay" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_cron_gun_ay_label}</label><div class="col-sm-2"><input type="text" name="cron_rehber_ay" id="cron_rehber_ay" class="form-control" value="{$currentConfig.cron_rehber_ay|default:'1'}" /></div><small class="help-block col-sm-7">{$LANG.btk_cron_ornek_gunay|default:"Örn: 1 (Her ayın 1'i)"}</small></div>
                    {* <div class="form-group row"><label for="cron_rehber_gun_hafta" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_cron_gun_hafta_label}</label><div class="col-sm-2"><input type="text" name="cron_rehber_gun_hafta" id="cron_rehber_gun_hafta" class="form-control" value="{$currentConfig.cron_rehber_gun_hafta|default:'*'}" /></div><small class="help-block col-sm-7">{$LANG.btk_cron_rehber_gun_hafta_aciklama|default:"Rehber için ayın günü kullanılır, burası '*' (her gün) kalabilir."}</small></div> *}
                    <div class="form-group row"><label for="cron_rehber_saat" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_cron_saat_label}</label><div class="col-sm-2"><input type="text" name="cron_rehber_saat" id="cron_rehber_saat" class="form-control" value="{$currentConfig.cron_rehber_saat|default:'10'}" /></div></div>
                    <div class="form-group row"><label for="cron_rehber_dakika" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_cron_dakika_label}</label><div class="col-sm-2"><input type="text" name="cron_rehber_dakika" id="cron_rehber_dakika" class="form-control" value="{$currentConfig.cron_rehber_dakika|default:'00'}" /></div></div>
                    <hr class="btk-hr-muted"/>
                    <h5 class="btk-inner-section-title">{$LANG.btkreports_cron_hareket_label} <small class="text-muted">({$LANG.btkreports_cron_hareket_varsayilan})</small></h5>
                    <div class="form-group row"><label for="cron_hareket_gun_hafta" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_cron_gun_hafta_label}</label><div class="col-sm-2"><input type="text" name="cron_hareket_gun_hafta" id="cron_hareket_gun_hafta" class="form-control" value="{$currentConfig.cron_hareket_gun_hafta|default:'*'}" /></div><small class="help-block col-sm-7">{$LANG.btk_cron_ornek_gunhafta|default:"Örn: * (Her gün) veya 0-6 (Pazar-Ctesi)"}</small></div>
                    <div class="form-group row"><label for="cron_hareket_saat" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_cron_saat_label}</label><div class="col-sm-2"><input type="text" name="cron_hareket_saat" id="cron_hareket_saat" class="form-control" value="{$currentConfig.cron_hareket_saat|default:'01'}" /></div></div>
                    <div class="form-group row"><label for="cron_hareket_dakika" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_cron_dakika_label}</label><div class="col-sm-2"><input type="text" name="cron_hareket_dakika" id="cron_hareket_dakika" class="form-control" value="{$currentConfig.cron_hareket_dakika|default:'00'}" /></div></div>
                     <hr class="btk-hr-muted"/>
                    <h5 class="btk-inner-section-title">{$LANG.btkreports_cron_personel_label} <small class="text-muted">({$LANG.btkreports_cron_personel_varsayilan})</small></h5>
                    <div class="form-group row"><label for="cron_personel_ay" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_cron_ay_label}</label><div class="col-sm-2"><input type="text" name="cron_personel_ay" id="cron_personel_ay" class="form-control" value="{$currentConfig.cron_personel_ay|default:'6,12'}" /></div><small class="help-block col-sm-7">{$LANG.btk_cron_ornek_ay_personel|default:"Örn: 6,12 (Haziran, Aralık)"}</small></div>
                    <div class="form-group row"><label for="cron_personel_gun_ay" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_cron_gun_ay_label}</label><div class="col-sm-2"><input type="text" name="cron_personel_gun_ay" id="cron_personel_gun_ay" class="form-control" value="{$currentConfig.cron_personel_gun_ay|default:'L'}" /></div><small class="help-block col-sm-7">{$LANG.btk_cron_ornek_gunay_personel|default:"Örn: L (Ayın son günü)"}</small></div>
                    <div class="form-group row"><label for="cron_personel_saat" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_cron_saat_label}</label><div class="col-sm-2"><input type="text" name="cron_personel_saat" id="cron_personel_saat" class="form-control" value="{$currentConfig.cron_personel_saat|default:'16'}" /></div></div>
                    <div class="form-group row"><label for="cron_personel_dakika" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_cron_dakika_label}</label><div class="col-sm-2"><input type="text" name="cron_personel_dakika" id="cron_personel_dakika" class="form-control" value="{$currentConfig.cron_personel_dakika|default:'00'}" /></div></div>
                </div>
            </div>

            {* ----- Diğer Ayarlar Bölümü ----- *}
            <div class="btk-section-container">
                 <div class="btk-section-title-bar">
                    <i class="fas fa-sliders-h"></i> {$LANG.btkreports_config_diger_ayarlar}
                </div>
                <div class="btk-section-content">
                    <div class="form-group row">
                        <label for="canli_hareket_saklama_gun" class="col-sm-3 control-label text-sm-right">{$LANG.btk_canli_hareket_saklama_gun|default:'Canlı Hareket Saklama Süresi (Gün)'}</label>
                        <div class="col-sm-2"><input type="number" name="canli_hareket_saklama_gun" id="canli_hareket_saklama_gun" class="form-control" value="{$currentConfig.canli_hareket_saklama_gun|default:7}" min="1" /></div>
                        <small class="help-block col-sm-7">{$LANG.btk_canli_hareket_saklama_aciklama|default:'Canlı hareket tablosundaki veriler kaç gün sonra arşive taşınsın?'}</small>
                    </div>
                    <div class="form-group row">
                        <label for="arsiv_hareket_saklama_gun" class="col-sm-3 control-label text-sm-right">{$LANG.btk_arsiv_hareket_saklama_gun|default:'Arşiv Hareket Saklama Süresi (Gün)'}</label>
                        <div class="col-sm-2"><input type="number" name="arsiv_hareket_saklama_gun" id="arsiv_hareket_saklama_gun" class="form-control" value="{$currentConfig.arsiv_hareket_saklama_gun|default:180}" min="0" /></div>
                        <small class="help-block col-sm-7">{$LANG.btk_arsiv_hareket_saklama_aciklama|default:'Arşivlenen hareketler kaç gün sonra (isteğe bağlı) silinsin? (0 = Hiç silme)'}</small>
                    </div>
                    <div class="form-group row">
                        <label for="admin_password_confirm_timeout" class="col-sm-3 control-label text-sm-right">{$LANG.btk_admin_sifre_onay_sure|default:'Admin Şifre Onay Süresi (Dakika)'}</label>
                        <div class="col-sm-2"><input type="number" name="admin_password_confirm_timeout" id="admin_password_confirm_timeout" class="form-control" value="{$currentConfig.admin_password_confirm_timeout|default:15}" min="1" /></div>
                        <small class="help-block col-sm-7">{$LANG.btk_admin_sifre_onay_aciklama|default:'Hassas işlemler için girilen admin şifresinin ne kadar süre geçerli olacağı.'}</small>
                    </div>

                    <hr class="btk-hr-muted"/>
                    <div class="form-group row"><label for="bos_dosya_gonder_toggle" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_bos_dosya_gonder_label}</label><div class="col-sm-7"><div class="checkbox-btk"><input type="checkbox" name="bos_dosya_gonder_toggle" id="bos_dosya_gonder_toggle" value="1" {if $currentConfig.bos_dosya_gonder}checked{/if}><label for="bos_dosya_gonder_toggle"></label></div><span class="help-block btk-switch-description">{$LANG.btkreports_bos_dosya_gonder_aciklama}</span></div></div>
                    <div class="form-group row"><label for="sil_tablolar_kaldirirken_toggle" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_sil_tablolar_kaldirirken_label}</label><div class="col-sm-7"><div class="checkbox-btk"><input type="checkbox" name="sil_tablolar_kaldirirken_toggle" id="sil_tablolar_kaldirirken_toggle" value="1" {if $currentConfig.sil_tablolar_kaldirirken}checked{/if}><label for="sil_tablolar_kaldirirken_toggle"></label></div><span class="help-block btk-switch-description btk-config-uyari">{$LANG.btkreports_sil_tablolar_kaldirirken_aciklama}</span></div></div>
                    <div class="form-group row"><label for="nvi_tc_dogrulama_aktif_toggle" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_nvi_tc_dogrulama_aktif_label}</label><div class="col-sm-7"><div class="checkbox-btk"><input type="checkbox" name="nvi_tc_dogrulama_aktif_toggle" id="nvi_tc_dogrulama_aktif_toggle" value="1" {if $currentConfig.nvi_tc_dogrulama_aktif|default:true}checked{/if}><label for="nvi_tc_dogrulama_aktif_toggle"></label></div></div></div>
                    <div class="form-group row"><label for="nvi_yabanci_dogrulama_aktif_toggle" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_nvi_yabanci_dogrulama_aktif_label}</label><div class="col-sm-7"><div class="checkbox-btk"><input type="checkbox" name="nvi_yabanci_dogrulama_aktif_toggle" id="nvi_yabanci_dogrulama_aktif_toggle" value="1" {if $currentConfig.nvi_yabanci_dogrulama_aktif|default:true}checked{/if}><label for="nvi_yabanci_dogrulama_aktif_toggle"></label></div></div></div>
                    <div class="form-group row">
                        <label for="log_level" class="col-sm-3 control-label text-sm-right">{$LANG.btkreports_log_level_label}</label>
                        <div class="col-sm-4">
                            <select name="log_level" id="log_level" class="form-control">
                                <option value="DEBUG" {if $currentConfig.log_level eq 'DEBUG'}selected{/if}>DEBUG (En Detaylı)</option>
                                <option value="INFO" {if ($currentConfig.log_level eq 'INFO' || !$currentConfig.log_level) && $currentConfig.log_level ne ""}selected{elseif !$currentConfig.log_level}selected{/if}>INFO (Normal)</option>
                                <option value="WARNING" {if $currentConfig.log_level eq 'WARNING'}selected{/if}>WARNING (Uyarılar)</option>
                                <option value="ERROR" {if $currentConfig.log_level eq 'ERROR'}selected{/if}>ERROR (Sadece Hatalar)</option>
                            </select><small class="help-block">{$LANG.btkreports_log_level_aciklama}</small>
                        </div>
                    </div>
               </div>
            </div>

            <div class="btn-container">
                <button type="submit" name="save_config" class="btn btn-primary btn-lg">
                    <i class="fas fa-save"></i> {$LANG.btkreports_kaydet}
                </button>
                <a href="{$modulelink}&action=dashboard" class="btn btn-default btn-lg" style="margin-left: 10px;">{$LANG.cancel|default:'İptal'}</a>
            </div>
        </form>
    </div>
</div>

{* Global JS Değişkenleri ve JS Dosyasının Yüklenmesi (Bir öncekiyle aynı) *}
<script type="text/javascript">
    if (typeof BtkLang === 'undefined') { var BtkLang = {}; }
    BtkLang.test_ediliyor = "{str_replace('"', '\\"', $LANG.btkreports_test_ediliyor)}";
    BtkLang.lutfen_bekleyin = "{str_replace('"', '\\"', $LANG.btkreports_lutfen_bekleyin)}";
    BtkLang.ftp_test_basarili = "{str_replace('"', '\\"', $LANG.btkreports_ftp_test_basarili)}";
    BtkLang.ftp_test_basarisiz = "{str_replace('"', '\\"', $LANG.btkreports_ftp_test_basarisiz)}";
    BtkLang.btkreports_aktif = "{str_replace('"', '\\"', $LANG.btkreports_aktif)}";
    BtkLang.btkreports_pasif = "{str_replace('"', '\\"', $LANG.btkreports_pasif)}";
    BtkLang.btk_initial_data_loading = "{str_replace('"', '\\"', ($LANG.btk_initial_data_loading|default:'Başlangıç verileri yükleniyor...'))}";
    BtkLang.btk_initial_data_error_generic = "{str_replace('"', '\\"', ($LANG.btk_initial_data_error_generic|default:'Veri yüklenirken bir hata oluştu.'))}";
    var btkModuleLink = "{$modulelink|escape:'javascript'}";
    var btkCsrfToken = "{$csrfToken|escape:'javascript'}";
</script>
<script type="text/javascript" src="../modules/addons/btkreports/assets/js/btk_admin_scripts.js?v={$version}"></script>