{* WHMCS BTK Raporları Modülü - Ayarlar Sayfası *}

{include file="./shared/alert_messages.tpl"} {* Ortak uyarı/bilgi mesajları şablonunu dahil et *}

<div class="btk-admin-page-container">
    <div class="btk-admin-page-header">
        <div class="btk-header-left">
            {if file_exists($modulepath|cat:'/logo.png')}
                <img src="{$modulelink|replace:'addonmodules.php?module=btkreports':''}/modules/addons/btkreports/logo.png" alt="{$LANG.btk_module_name} Logo" class="btk-header-logo">
            {/if}
            <h2>{$LANG.btk_config_title}</h2>
        </div>
        <div class="btk-header-right">
            <span class="btk-version-info">v{$version}</span>
        </div>
    </div>

    {include file="./shared/admin_header_menu.tpl" active_tab="config"} {* Ortak navigasyon menüsünü dahil et ve aktif sekmeyi belirt *}

    <form method="post" action="{$modulelink}&action=config" id="btkConfigForm" style="margin-top: 20px;">
        <input type="hidden" name="token" value="{$csrfToken}" />
        <input type="hidden" name="save" value="true" />

        <div class="btk-tabs-container">
            <ul class="nav nav-pills btk-inner-nav-pills">
                <li class="active"><a href="#tab_operator_info" data-toggle="tab"><i class="fas fa-user-tie icon-spacer"></i>{$LANG.btk_tab_operator_info}</a></li>
                <li><a href="#tab_ftp_settings" data-toggle="tab"><i class="fas fa-server icon-spacer"></i>{$LANG.btk_tab_ftp_settings}</a></li>
                <li><a href="#tab_reporting_settings" data-toggle="tab"><i class="far fa-calendar-alt icon-spacer"></i>{$LANG.btk_tab_reporting_settings}</a></li>
                <li><a href="#tab_auth_types" data-toggle="tab"><i class="fas fa-check-double icon-spacer"></i>{$LANG.btk_tab_auth_types}</a></li>
                <li><a href="#tab_other_settings" data-toggle="tab"><i class="fas fa-sliders-h icon-spacer"></i>{$LANG.btk_tab_other_settings}</a></li>
            </ul>

            <div class="tab-content btk-tab-content">
                {* Operatör Bilgileri Sekmesi *}
                <div class="tab-pane active" id="tab_operator_info">
                    <div class="panel panel-default no-margin">
                        <div class="panel-heading">
                            <h3 class="panel-title">{$LANG.btk_tab_operator_info}</h3>
                        </div>
                        <div class="panel-body">
                            <div class="form-group">
                                <label for="operator_kodu">{$LANG.btk_operator_code} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_operator_code_desc|escape:'html'}"></i></label>
                                <input type="text" name="operator_kodu" id="operator_kodu" value="{$settings.operator_kodu|escape:'html'}" class="form-control" style="max-width: 200px;">
                            </div>
                            <div class="form-group">
                                <label for="operator_adi">{$LANG.btk_operator_name} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_operator_name_desc|escape:'html'}"></i></label>
                                <input type="text" name="operator_adi" id="operator_adi" value="{$settings.operator_adi|escape:'html'}" class="form-control" style="max-width: 400px;">
                            </div>
                            <div class="form-group">
                                <label for="operator_unvani">{$LANG.btk_operator_title_ufficial} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_operator_title_ufficial_desc|escape:'html'}"></i></label>
                                <input type="text" name="operator_unvani" id="operator_unvani" value="{$settings.operator_unvani|escape:'html'}" class="form-control">
                            </div>
                        </div>
                    </div>
                </div>

                {* FTP Ayarları Sekmesi *}
                <div class="tab-pane" id="tab_ftp_settings">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="panel panel-default no-margin">
                                <div class="panel-heading">
                                    <h3 class="panel-title">{$LANG.btk_main_ftp_settings_title}</h3>
                                </div>
                                <div class="panel-body">
                                    <div class="form-group">
                                        <label for="ftp_ana_host">{$LANG.btk_ftp_host} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_ftp_host_desc|escape:'html'}"></i></label>
                                        <input type="text" name="ftp_ana_host" id="ftp_ana_host" value="{$settings.ftp_ana_host|escape:'html'}" class="form-control">
                                    </div>
                                    <div class="form-group">
                                        <label for="ftp_ana_port">{$LANG.btk_ftp_port} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_ftp_port_desc|escape:'html'}"></i></label>
                                        <input type="text" name="ftp_ana_port" id="ftp_ana_port" value="{$settings.ftp_ana_port|escape:'html'}" class="form-control" style="max-width: 100px;">
                                    </div>
                                    <div class="form-group">
                                        <label for="ftp_ana_kullanici">{$LANG.btk_ftp_username} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_ftp_username_desc|escape:'html'}"></i></label>
                                        <input type="text" name="ftp_ana_kullanici" id="ftp_ana_kullanici" value="{$settings.ftp_ana_kullanici|escape:'html'}" class="form-control" autocomplete="off">
                                    </div>
                                    <div class="form-group">
                                        <label for="ftp_ana_sifre">{$LANG.btk_ftp_password} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_ftp_password_desc|escape:'html'}"></i></label>
                                        <div class="input-group">
                                            <input type="password" name="ftp_ana_sifre" id="ftp_ana_sifre" value="{$settings.ftp_ana_sifre|escape:'html'}" class="form-control" autocomplete="new-password">
                                            <span class="input-group-btn">
                                                <button class="btn btn-default btk-show-password" type="button"><i class="fas fa-eye"></i></button>
                                            </span>
                                        </div>
                                        {if $settings.ftp_ana_sifre && $settings.ftp_ana_sifre != ""}
                                            <small class="text-muted">Mevcut şifreyi değiştirmek için yeni şifreyi giriniz. Boş bırakırsanız mevcut şifre korunur.</small>
                                        {/if}
                                    </div>
                                    <div class="form-group">
                                        <label>{$LANG.btk_ftp_passive_mode} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_ftp_passive_mode_desc|escape:'html'}"></i></label>
                                        <div>
                                            <label class="btk-switch">
                                                <input type="checkbox" name="ftp_ana_pasif_mod" value="1" {if $settings.ftp_ana_pasif_mod == '1'}checked{/if}>
                                                <span class="btk-slider round"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="ftp_ana_rehber_klasor">{$LANG.btk_ftp_rehber_folder} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_ftp_rehber_folder_desc|escape:'html'}"></i></label>
                                        <input type="text" name="ftp_ana_rehber_klasor" id="ftp_ana_rehber_klasor" value="{$settings.ftp_ana_rehber_klasor|escape:'html'}" class="form-control">
                                    </div>
                                    <div class="form-group">
                                        <label for="ftp_ana_hareket_klasor">{$LANG.btk_ftp_hareket_folder} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_ftp_hareket_folder_desc|escape:'html'}"></i></label>
                                        <input type="text" name="ftp_ana_hareket_klasor" id="ftp_ana_hareket_klasor" value="{$settings.ftp_ana_hareket_klasor|escape:'html'}" class="form-control">
                                    </div>
                                    <div class="form-group">
                                        <label for="ftp_ana_personel_klasor">{$LANG.btk_ftp_personel_folder} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_ftp_personel_folder_desc|escape:'html'}"></i></label>
                                        <input type="text" name="ftp_ana_personel_klasor" id="ftp_ana_personel_klasor" value="{$settings.ftp_ana_personel_klasor|escape:'html'}" class="form-control">
                                    </div>
                                    <a href="{$modulelink}&action=config&do=testftp&type=ana&token={$csrfToken}" class="btn btn-info btn-sm">
                                        <i class="fas fa-plug icon-spacer"></i>{$LANG.btk_button_test_connection} (Ana FTP)
                                    </a>
                                    <div id="ftpTestResultAnaConfig" class="btk-ftp-test-result" style="margin-top:10px;">
                                        {if isset($ftp_test_result_ana)}
                                            <div class="alert alert-{if $ftp_test_result_ana.connected && $ftp_test_result_ana.writable_rehber && $ftp_test_result_ana.writable_hareket && $ftp_test_result_ana.writable_personel}success{else}danger{/if}">
                                                {$ftp_test_result_ana.message}
                                                {if $ftp_test_result_ana.error_detail}<br><small>{$ftp_test_result_ana.error_detail}</small>{/if}
                                                {if $ftp_test_result_ana.connected}
                                                    <br>Rehber: {if $ftp_test_result_ana.writable_rehber}<span class="text-success">Yazılabilir</span>{else}<span class="text-danger">Yazılamaz</span>{if $ftp_test_result_ana.error_rehber} ({$ftp_test_result_ana.error_rehber}){/if}{/if}
                                                    <br>Hareket: {if $ftp_test_result_ana.writable_hareket}<span class="text-success">Yazılabilir</span>{else}<span class="text-danger">Yazılamaz</span>{if $ftp_test_result_ana.error_hareket} ({$ftp_test_result_ana.error_hareket}){/if}{/if}
                                                    <br>Personel: {if $ftp_test_result_ana.writable_personel}<span class="text-success">Yazılabilir</span>{else}<span class="text-danger">Yazılamaz</span>{if $ftp_test_result_ana.error_personel} ({$ftp_test_result_ana.error_personel}){/if}{/if}
                                                {/if}
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>

{* FTP Ayarları Sekmesi - Devam *}
                        <div class="col-md-6">
                            <div class="panel panel-default no-margin">
                                <div class="panel-heading">
                                    <h3 class="panel-title">{$LANG.btk_backup_ftp_settings_title}</h3>
                                </div>
                                <div class="panel-body">
                                    <div class="form-group">
                                        <label>{$LANG.btk_use_backup_ftp} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_use_backup_ftp_desc|escape:'html'}"></i></label>
                                        <div>
                                            <label class="btk-switch">
                                                <input type="checkbox" name="yedek_ftp_kullan" id="yedek_ftp_kullan" value="1" {if $settings.yedek_ftp_kullan == '1'}checked{/if}>
                                                <span class="btk-slider round"></span>
                                            </label>
                                        </div>
                                    </div>

                                    <div id="yedekFtpDetails" {if $settings.yedek_ftp_kullan != '1'}style="display:none;"{/if}>
                                        <div class="form-group">
                                            <label for="ftp_yedek_host">{$LANG.btk_ftp_host} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_ftp_host_desc|escape:'html'}"></i></label>
                                            <input type="text" name="ftp_yedek_host" id="ftp_yedek_host" value="{$settings.ftp_yedek_host|escape:'html'}" class="form-control">
                                        </div>
                                        <div class="form-group">
                                            <label for="ftp_yedek_port">{$LANG.btk_ftp_port} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_ftp_port_desc|escape:'html'}"></i></label>
                                            <input type="text" name="ftp_yedek_port" id="ftp_yedek_port" value="{$settings.ftp_yedek_port|escape:'html'}" class="form-control" style="max-width: 100px;">
                                        </div>
                                        <div class="form-group">
                                            <label for="ftp_yedek_kullanici">{$LANG.btk_ftp_username} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_ftp_username_desc|escape:'html'}"></i></label>
                                            <input type="text" name="ftp_yedek_kullanici" id="ftp_yedek_kullanici" value="{$settings.ftp_yedek_kullanici|escape:'html'}" class="form-control" autocomplete="off">
                                        </div>
                                        <div class="form-group">
                                            <label for="ftp_yedek_sifre">{$LANG.btk_ftp_password} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_ftp_password_desc|escape:'html'}"></i></label>
                                            <div class="input-group">
                                                <input type="password" name="ftp_yedek_sifre" id="ftp_yedek_sifre" value="{$settings.ftp_yedek_sifre|escape:'html'}" class="form-control" autocomplete="new-password">
                                                <span class="input-group-btn">
                                                    <button class="btn btn-default btk-show-password" type="button"><i class="fas fa-eye"></i></button>
                                                </span>
                                            </div>
                                             {if $settings.ftp_yedek_sifre && $settings.ftp_yedek_sifre != ""}
                                                <small class="text-muted">Mevcut şifreyi değiştirmek için yeni şifreyi giriniz. Boş bırakırsanız mevcut şifre korunur.</small>
                                            {/if}
                                        </div>
                                        <div class="form-group">
                                            <label>{$LANG.btk_ftp_passive_mode} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_ftp_passive_mode_desc|escape:'html'}"></i></label>
                                            <div>
                                                <label class="btk-switch">
                                                    <input type="checkbox" name="ftp_yedek_pasif_mod" value="1" {if $settings.ftp_yedek_pasif_mod == '1'}checked{/if}>
                                                    <span class="btk-slider round"></span>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="ftp_yedek_rehber_klasor">{$LANG.btk_ftp_rehber_folder} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_ftp_rehber_folder_desc|escape:'html'}"></i></label>
                                            <input type="text" name="ftp_yedek_rehber_klasor" id="ftp_yedek_rehber_klasor" value="{$settings.ftp_yedek_rehber_klasor|escape:'html'}" class="form-control">
                                        </div>
                                        <div class="form-group">
                                            <label for="ftp_yedek_hareket_klasor">{$LANG.btk_ftp_hareket_folder} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_ftp_hareket_folder_desc|escape:'html'}"></i></label>
                                            <input type="text" name="ftp_yedek_hareket_klasor" id="ftp_yedek_hareket_klasor" value="{$settings.ftp_yedek_hareket_klasor|escape:'html'}" class="form-control">
                                        </div>
                                        <div class="form-group">
                                            <label for="ftp_yedek_personel_klasor">{$LANG.btk_ftp_personel_folder} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_ftp_personel_folder_desc|escape:'html'}"></i></label>
                                            <input type="text" name="ftp_yedek_personel_klasor" id="ftp_yedek_personel_klasor" value="{$settings.ftp_yedek_personel_klasor|escape:'html'}" class="form-control">
                                        </div>
                                        <a href="{$modulelink}&action=config&do=testftp&type=yedek&token={$csrfToken}" class="btn btn-info btn-sm">
                                            <i class="fas fa-plug icon-spacer"></i>{$LANG.btk_button_test_connection} (Yedek FTP)
                                        </a>
                                        <div id="ftpTestResultYedekConfig" class="btk-ftp-test-result" style="margin-top:10px;">
                                            {if isset($ftp_test_result_yedek)}
                                                <div class="alert alert-{if $ftp_test_result_yedek.connected && $ftp_test_result_yedek.writable_rehber && $ftp_test_result_yedek.writable_hareket && $ftp_test_result_yedek.writable_personel}success{else}danger{/if}">
                                                    {$ftp_test_result_yedek.message}
                                                    {if $ftp_test_result_yedek.error_detail}<br><small>{$ftp_test_result_yedek.error_detail}</small>{/if}
                                                    {if $ftp_test_result_yedek.connected}
                                                        <br>Rehber: {if $ftp_test_result_yedek.writable_rehber}<span class="text-success">Yazılabilir</span>{else}<span class="text-danger">Yazılamaz</span>{if $ftp_test_result_yedek.error_rehber} ({$ftp_test_result_yedek.error_rehber}){/if}{/if}
                                                        <br>Hareket: {if $ftp_test_result_yedek.writable_hareket}<span class="text-success">Yazılabilir</span>{else}<span class="text-danger">Yazılamaz</span>{if $ftp_test_result_yedek.error_hareket} ({$ftp_test_result_yedek.error_hareket}){/if}{/if}
                                                        <br>Personel: {if $ftp_test_result_yedek.writable_personel}<span class="text-success">Yazılabilir</span>{else}<span class="text-danger">Yazılamaz</span>{if $ftp_test_result_yedek.error_personel} ({$ftp_test_result_yedek.error_personel}){/if}{/if}
                                                    {/if}
                                                </div>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {* Raporlama Ayarları Sekmesi *}
                <div class="tab-pane" id="tab_reporting_settings">
                    <div class="panel panel-default no-margin">
                        <div class="panel-heading">
                            <h3 class="panel-title">{$LANG.btk_cron_settings_title}</h3>
                        </div>
                        <div class="panel-body">
                            <p>{$LANG.btk_cron_command_info_desc}</p>
                            <div class="input-group">
                                <input type="text" id="cronCommandText" class="form-control" value="php -q {$whmcs_path}/modules/addons/btkreports/cron/btkreports_cron.php" readonly>
                                <span class="input-group-btn">
                                    <button type="button" class="btn btn-default" onclick="copyToClipboard('#cronCommandText')" data-toggle="tooltip" title="Kopyala"><i class="far fa-copy"></i></button>
                                </span>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="cron_rehber_zamanlama">{$LANG.btk_cron_rehber_schedule} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_cron_rehber_schedule_desc|escape:'html'}"></i></label>
                                        <input type="text" name="cron_rehber_zamanlama" id="cron_rehber_zamanlama" value="{$settings.cron_rehber_zamanlama|escape:'html'}" class="form-control">
                                    </div>
                                    <div class="form-group">
                                        <label for="cron_personel_zamanlama_haziran">{$LANG.btk_cron_personel_schedule_june} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_cron_personel_schedule_june_desc|escape:'html'}"></i></label>
                                        <input type="text" name="cron_personel_zamanlama_haziran" id="cron_personel_zamanlama_haziran" value="{$settings.cron_personel_zamanlama_haziran|escape:'html'}" class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="cron_hareket_zamanlama">{$LANG.btk_cron_hareket_schedule} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_cron_hareket_schedule_desc|escape:'html'}"></i></label>
                                        <input type="text" name="cron_hareket_zamanlama" id="cron_hareket_zamanlama" value="{$settings.cron_hareket_zamanlama|escape:'html'}" class="form-control">
                                    </div>
                                    <div class="form-group">
                                        <label for="cron_personel_zamanlama_aralik">{$LANG.btk_cron_personel_schedule_december} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_cron_personel_schedule_december_desc|escape:'html'}"></i></label>
                                        <input type="text" name="cron_personel_zamanlama_aralik" id="cron_personel_zamanlama_aralik" value="{$settings.cron_personel_zamanlama_aralik|escape:'html'}" class="form-control">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

{* Raporlama Ayarları Sekmesi - Devam *}
                    <div class="panel panel-default no-margin">
                        <div class="panel-heading">
                            <h3 class="panel-title">{$LANG.btk_data_retention_title}</h3>
                        </div>
                        <div class="panel-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="hareket_canli_saklama_suresi_gun">{$LANG.btk_hareket_canli_retention} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_hareket_canli_retention_desc|escape:'html'}"></i></label>
                                        <input type="number" name="hareket_canli_saklama_suresi_gun" id="hareket_canli_saklama_suresi_gun" value="{$settings.hareket_canli_saklama_suresi_gun|escape:'html'}" class="form-control" min="1" style="max-width: 150px;">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="hareket_arsiv_saklama_suresi_gun">{$LANG.btk_hareket_arsiv_retention} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_hareket_arsiv_retention_desc|escape:'html'}"></i></label>
                                        <input type="number" name="hareket_arsiv_saklama_suresi_gun" id="hareket_arsiv_saklama_suresi_gun" value="{$settings.hareket_arsiv_saklama_suresi_gun|escape:'html'}" class="form-control" min="0" style="max-width: 150px;">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="panel panel-default no-margin">
                        <div class="panel-heading">
                            <h3 class="panel-title">{$LANG.btk_personnel_file_name_format_title}</h3>
                        </div>
                        <div class="panel-body">
                            <div class="form-group">
                                <label>{$LANG.btk_personnel_file_name_format_ana} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_personnel_file_name_format_ana_desc|escape:'html'}"></i></label>
                                <div>
                                    <label class="btk-switch">
                                        <input type="checkbox" name="personel_excel_ad_format_ana" value="1" {if $settings.personel_excel_ad_format_ana == '1'}checked{/if}>
                                        <span class="btk-slider round"></span>
                                    </label>
                                </div>
                            </div>
                            <div class="form-group" id="personelFormatYedekDiv" {if $settings.yedek_ftp_kullan != '1'}style="display:none;"{/if}>
                                <label>{$LANG.btk_personnel_file_name_format_yedek} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_personnel_file_name_format_yedek_desc|escape:'html'}"></i></label>
                                <div>
                                    <label class="btk-switch">
                                        <input type="checkbox" name="personel_excel_ad_format_yedek" value="1" {if $settings.personel_excel_ad_format_yedek == '1'}checked{/if}>
                                        <span class="btk-slider round"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {* Yetkilendirme Türleri Sekmesi *}
                <div class="tab-pane" id="tab_auth_types">
                    <div class="panel panel-default no-margin">
                        <div class="panel-heading">
                            <h3 class="panel-title">{$LANG.btk_tab_auth_types}</h3>
                        </div>
                        <div class="panel-body">
                            <p>{$LANG.btk_auth_types_desc}</p>
                            <div class="row">
                                {if $yetki_turleri}
                                    {assign var="col_count" value=0}
                                    {foreach from=$yetki_turleri item=yetki}
                                        {if $col_count % 2 == 0 && $col_count != 0} {* Daha iyi görünüm için 2 sütun *}
                                            </div><div class="row" style="margin-top:10px;">
                                        {/if}
                                        <div class="col-md-6">
                                            <div class="checkbox" style="margin-top: 0; margin-bottom: 5px;">
                                                <label class="btk-switch btk-switch-inline">
                                                    <input type="checkbox" name="yetki_turleri[{$yetki->id}]" value="1" {if $yetki->secili_mi == 1}checked{/if}>
                                                    <span class="btk-slider round"></span>
                                                    <span class="btk-switch-label">{$yetki->yetki_kodu|escape:'html'} - {$yetki->yetki_aciklama|escape:'html'}</span>
                                                </label>
                                            </div>
                                        </div>
                                        {assign var="col_count" value=$col_count+1}
                                    {/foreach}
                                {else}
                                    <div class="col-md-12">
                                        <p>{$LANG.btk_no_records_found}</p>
                                    </div>
                                {/if}
                            </div>
                            {if $yetki_turleri}
                            <hr style="margin-top:10px; margin-bottom:10px;">
                            <button type="button" class="btn btn-xs btn-default" id="selectAllAuthTypes">{$LANG.btk_auth_type_select_all}</button>
                            <button type="button" class="btn btn-xs btn-default" id="deselectAllAuthTypes">{$LANG.btk_auth_type_deselect_all}</button>
                            {/if}
                        </div>
                    </div>
                </div>

                {* Diğer Ayarlar Sekmesi *}
                <div class="tab-pane" id="tab_other_settings">
                    <div class="panel panel-default no-margin">
                        <div class="panel-heading">
                            <h3 class="panel-title">{$LANG.btk_other_settings_title}</h3>
                        </div>
                        <div class="panel-body">
                            <div class="form-group">
                                <label>{$LANG.btk_delete_db_on_deactivate} <i class="fas fa-info-circle btk-info-icon text-danger" data-toggle="tooltip" title="{$LANG.btk_delete_db_on_deactivate_desc|escape:'html'}"></i></label>
                                <div>
                                    <label class="btk-switch">
                                        <input type="checkbox" name="veritabani_sil_deactivate" value="1" {if $settings.veritabani_sil_deactivate == '1'}checked{/if}>
                                        <span class="btk-slider round"></span>
                                    </label>
                                </div>
                            </div>
                             <hr>
                            <div class="form-group">
                                <label>{$LANG.btk_nvi_tckn_validation} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_nvi_tckn_validation_desc|escape:'html'}"></i></label>
                                <div>
                                    <label class="btk-switch">
                                        <input type="checkbox" name="nvi_tckn_dogrulama_aktif" value="1" {if $settings.nvi_tckn_dogrulama_aktif == '1'}checked{/if}>
                                        <span class="btk-slider round"></span>
                                    </label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>{$LANG.btk_nvi_ykn_validation} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_nvi_ykn_validation_desc|escape:'html'}"></i></label>
                                <div>
                                    <label class="btk-switch">
                                        <input type="checkbox" name="nvi_ykn_dogrulama_aktif" value="1" {if $settings.nvi_ykn_dogrulama_aktif == '1'}checked{/if}>
                                        <span class="btk-slider round"></span>
                                    </label>
                                </div>
                            </div>
                             <div class="form-group">
                                <label>{$LANG.btk_adres_kodu_validation} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_adres_kodu_validation_desc|escape:'html'}"></i></label>
                                <div>
                                    <label class="btk-switch">
                                        <input type="checkbox" name="adres_kodu_dogrulama_aktif" value="1" {if $settings.adres_kodu_dogrulama_aktif == '1'}checked{/if} disabled> {* Şimdilik devre dışı *}
                                        <span class="btk-slider round"></span>
                                    </label>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group">
                                <label>{$LANG.btk_debug_mode} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_debug_mode_desc|escape:'html'}"></i></label>
                                <div>
                                    <label class="btk-switch">
                                        <input type="checkbox" name="debug_mode" value="1" {if $settings.debug_mode == '1'}checked{/if}>
                                        <span class="btk-slider round"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> {* <!-- ./tab-content --> *}
        </div> {* <!-- ./btk-tabs-container --> *}

        <div class="btn-container">
            <button type="submit" class="btn btn-primary btn-lg">
                <i class="fas fa-save icon-spacer"></i>{$LANG.btk_button_save_changes}
            </button>
        </div>
    </form>
</div>

{* Config Sayfası - JavaScript ve Smarty Değişken Notları *}

{*
    Bu şablonun JavaScript ve CSS kodları, merkezi dosyalara (`btk_admin_scripts.js` ve `btk_admin_style.css`) taşınmıştır.
    Eğer bu şablona özel anlık bir JS veya CSS gerekirse, idealde yine o merkezi dosyalara eklenmeli
    veya çok spesifik durumlar için burada `<script>` veya `<style>` etiketleri içinde dikkatlice kullanılmalıdır.
    Ancak genel prensip, TPL dosyalarını bunlardan arındırmaktır.

    Bir önceki gönderimlerde bu TPL içine eklenen JavaScript kodları (tooltip, yedek ftp göster/gizle,
    şifre göster/gizle, cron kopyala, yetki türü seç/kaldır, FTP test AJAX)
    artık `assets/js/btk_admin_scripts.js` dosyasına taşınmış varsayılmaktadır.
    Benzer şekilde, `<style>` etiketleri içindeki CSS kodları da
    `assets/css/btk_admin_style.css` dosyasına taşınmış varsayılmaktadır.

    Bu TPL dosyası sadece HTML yapısını ve Smarty değişkenlerini içermelidir.
*}

{* Gerekli Smarty Değişkenleri (btkreports.php -> btkreports_page_config() fonksiyonunda atanmalı):
   - $flash_message (opsiyonel, alert_messages.tpl tarafından kullanılır)
   - $modulepath: Modülün sunucudaki tam yolu (logo için)
   - $modulelink: Modülün ana URL'si
   - $version: Modül versiyonu
   - $LANG: Dil değişkenleri
   - $csrfToken: CSRF token
   - $settings: Ayar değerlerini içeren bir dizi (örn: $settings.operator_kodu)
   - $yetki_turleri: mod_btk_yetki_turleri tablosundan gelen yetki türlerinin listesi (object array)
   - $whmcs_path: WHMCS kök dizin yolu (cron komutu gösterimi için)
   - $ftp_test_result_ana (opsiyonel): Ana FTP testi sonucu (dizi: ['success'=>bool, 'message'=>string, 'writable_rehber'=>bool, ...])
   - $ftp_test_result_yedek (opsiyonel): Yedek FTP testi sonucu (aynı yapıda)
*}

{* TPL Dosyasının Sonu *}