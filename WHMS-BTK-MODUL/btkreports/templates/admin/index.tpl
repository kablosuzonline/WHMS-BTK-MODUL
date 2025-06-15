{* WHMCS BTK Raporları Modülü - Ana Sayfa *}

{include file="./shared/alert_messages.tpl"} {* Ortak uyarı/bilgi mesajları şablonunu dahil et *}

<div class="btk-admin-page-container">
    <div class="btk-admin-page-header">
        <div class="btk-header-left">
            {if file_exists($modulepath|cat:'/logo.png')}
                <img src="{$modulelink|replace:'addonmodules.php?module=btkreports':''}/modules/addons/btkreports/logo.png" alt="{$LANG.btk_module_name} Logo" class="btk-header-logo">
            {/if}
            <h2>{$LANG.btk_dashboard_title}</h2>
        </div>
        <div class="btk-header-right">
            <span class="btk-version-info">v{$version}</span>
        </div>
    </div>

    {include file="./shared/admin_header_menu.tpl" active_tab="dashboard"} {* Ortak navigasyon menüsünü dahil et ve aktif sekmeyi belirt *}

    <div class="btk-dashboard-welcome" style="margin-top: 20px;">
        <p>{$LANG.btk_dashboard_welcome_message} <strong>{$operator_name|escape:'html':'UTF-8'}</strong>.</p>
        <p>{$LANG.btk_dashboard_intro_text}</p>
    </div>

    <div class="row btk-dashboard-quick-actions">
        <div class="col-md-4 col-sm-6">
            <div class="panel panel-default btk-dashboard-panel">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-cogs icon-spacer"></i>{$LANG.btk_menu_config}</h3>
                </div>
                <div class="panel-body text-center">
                    <p>{$LANG.btk_dashboard_config_desc}</p>
                    <a href="{$modulelink}&action=config" class="btn btn-primary btn-block">
                        <i class="fas fa-arrow-right icon-spacer"></i>{$LANG.btk_go_to_config}
                    </a>
                </div>
            </div>
        </div>
        <div class="col-md-4 col-sm-6">
            <div class="panel panel-default btk-dashboard-panel">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-file-export icon-spacer"></i>{$LANG.btk_menu_generate_reports}</h3>
                </div>
                <div class="panel-body text-center">
                    <p>{$LANG.btk_dashboard_generate_desc}</p>
                    <a href="{$modulelink}&action=generatereport" class="btn btn-success btn-block">
                        <i class="fas fa-arrow-right icon-spacer"></i>{$LANG.btk_go_to_generate}
                    </a>
                </div>
            </div>
        </div>
        <div class="col-md-4 col-sm-6">
            <div class="panel panel-default btk-dashboard-panel">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-users icon-spacer"></i>{$LANG.btk_menu_personnel}</h3>
                </div>
                <div class="panel-body text-center">
                    <p>{$LANG.btk_personnel_list_desc|truncate:100:"..."}</p>
                    <a href="{$modulelink}&action=personnel" class="btn btn-info btn-block">
                        <i class="fas fa-arrow-right icon-spacer"></i>{$LANG.btk_menu_personnel}
                    </a>
                </div>
            </div>
        </div>
    </div>

    <div class="panel panel-default btk-dashboard-status-panel">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-network-wired icon-spacer"></i>{$LANG.btk_dashboard_ftp_status_title}</h3>
        </div>
        <div class="panel-body">
            <p>
                <strong>{$LANG.btk_main_ftp_server_status}:</strong>
                {if isset($main_ftp_status) && $main_ftp_status.connected}
                    <span class="label label-success"><i class="fas fa-check-circle icon-spacer"></i>{$LANG.btk_ftp_status_active}</span>
                    {if isset($main_ftp_status.writable_rehber) && $main_ftp_status.writable_rehber}
                         <span class="label label-success hint--bottom" aria-label="REHBER Klasörü"><i class="fas fa-folder-open icon-spacer"></i>{$LANG.btk_ftp_writable}</span>
                    {else}
                         <span class="label label-danger hint--bottom" aria-label="REHBER Klasörü"><i class="fas fa-folder icon-spacer"></i>{$LANG.btk_ftp_not_writable}{if $main_ftp_status.error_rehber} ({$main_ftp_status.error_rehber|escape:'html':'UTF-8'}){/if}</span>
                    {/if}
                    {if isset($main_ftp_status.writable_hareket) && $main_ftp_status.writable_hareket}
                         <span class="label label-success hint--bottom" aria-label="HAREKET Klasörü"><i class="fas fa-folder-open icon-spacer"></i>{$LANG.btk_ftp_writable}</span>
                    {else}
                         <span class="label label-danger hint--bottom" aria-label="HAREKET Klasörü"><i class="fas fa-folder icon-spacer"></i>{$LANG.btk_ftp_not_writable}{if $main_ftp_status.error_hareket} ({$main_ftp_status.error_hareket|escape:'html':'UTF-8'}){/if}</span>
                    {/if}
                    {if isset($main_ftp_status.writable_personel) && $main_ftp_status.writable_personel}
                         <span class="label label-success hint--bottom" aria-label="PERSONEL Klasörü"><i class="fas fa-folder-open icon-spacer"></i>{$LANG.btk_ftp_writable}</span>
                    {else}
                         <span class="label label-danger hint--bottom" aria-label="PERSONEL Klasörü"><i class="fas fa-folder icon-spacer"></i>{$LANG.btk_ftp_not_writable}{if $main_ftp_status.error_personel} ({$main_ftp_status.error_personel|escape:'html':'UTF-8'}){/if}</span>
                    {/if}
                {else}
                    <span class="label label-danger"><i class="fas fa-times-circle icon-spacer"></i>{$LANG.btk_ftp_status_passive}</span>
                    {if isset($main_ftp_status.error)} ({$main_ftp_status.error|escape:'html':'UTF-8'}){/if}
                {/if}
                <a href="{$modulelink}&action=config&do=testftp&type=ana&token={$csrfToken}" class="btn btn-xs btn-default pull-right"><i class="fas fa-sync-alt"></i> {$LANG.btk_button_test_connection}</a>
            </p>
            {if isset($settings.yedek_ftp_kullan) && $settings.yedek_ftp_kullan == '1'}
            <p>
                <strong>{$LANG.btk_backup_ftp_server_status}:</strong>
                {if isset($backup_ftp_status) && $backup_ftp_status.connected}
                    <span class="label label-success"><i class="fas fa-check-circle icon-spacer"></i>{$LANG.btk_ftp_status_active}</span>
                    {if isset($backup_ftp_status.writable_rehber) && $backup_ftp_status.writable_rehber}
                         <span class="label label-success hint--bottom" aria-label="REHBER Klasörü"><i class="fas fa-folder-open icon-spacer"></i>{$LANG.btk_ftp_writable}</span>
                    {else}
                         <span class="label label-danger hint--bottom" aria-label="REHBER Klasörü"><i class="fas fa-folder icon-spacer"></i>{$LANG.btk_ftp_not_writable}{if $backup_ftp_status.error_rehber} ({$backup_ftp_status.error_rehber|escape:'html':'UTF-8'}){/if}</span>
                    {/if}
                     {* Diğer klasörler için benzer kontroller eklenebilir: hareket, personel *}
                {else}
                    <span class="label label-danger"><i class="fas fa-times-circle icon-spacer"></i>{$LANG.btk_ftp_status_passive}</span>
                    {if isset($backup_ftp_status.error)} ({$backup_ftp_status.error|escape:'html':'UTF-8'}){/if}
                {/if}
                 <a href="{$modulelink}&action=config&do=testftp&type=yedek&token={$csrfToken}" class="btn btn-xs btn-default pull-right"><i class="fas fa-sync-alt"></i> {$LANG.btk_button_test_connection}</a>
            </p>
            {/if}
        </div>
    </div>

    <div class="btk-dashboard-readme text-center" style="margin-top: 20px;">
        <p><a href="{$module_readme_url|default:'#'}" target="_blank" class="btn btn-link">
            <i class="fas fa-book-open icon-spacer"></i>{$LANG.btk_readme_link_text}
        </a></p>
    </div>
</div>

{*
Gerekli Smarty Değişkenleri (btkreports.php -> output() fonksiyonunda 'index' action'ı için atanmalı):
- $flash_message (opsiyonel, alert_messages.tpl tarafından kullanılır)
- $modulepath: Modülün sunucudaki tam yolu (logo için)
- $modulelink: Modülün ana URL'si
- $version: Modül versiyonu
- $LANG: Dil değişkenleri
- $operator_name: Ayarlardan gelen operatör adı
- $main_ftp_status: Ana FTP sunucu bağlantı ve yazılabilirlik durumunu içeren dizi
  (örn: ['connected' => bool, 'error' => string, 'writable_rehber' => bool, 'error_rehber' => string, ...])
- $settings.yedek_ftp_kullan: Yedek FTP'nin aktif olup olmadığını belirten ayar
- $backup_ftp_status: Yedek FTP sunucu durumu (main_ftp_status ile aynı yapıda)
- $csrfToken: CSRF token (FTP test linkleri için)
- $module_readme_url: README.md dosyasının URL'si
*}