{* modules/addons/btkreports/templates/admin/index.tpl (Nihai Sürüm - Resim & FTP JS Düzeltmeleri v3) *}
<div id="btk_reports_module">
    <div class="btk-header-container">
        <div class="btk-module-title">
            <img src="{$admin_url}templates/blend/images/blend_header_logo.png" alt="WHMCS Logo" style="height: 30px; vertical-align: middle; margin-right: 10px;" 
                 onerror="this.style.display='none'; $(this).siblings('.fa-file-invoice.fallback-icon').css('display', 'inline-block');">
            <i class="fas fa-file-invoice fallback-icon" style="display:none; vertical-align: middle; margin-right: 8px; font-size:1.5em;"></i>
            {$_ADDONLANG.btkreports_modulename}
        </div>
        <div class="btk-header-info">
            <span id="ftpStatusIndicator" class="ftp-status">
                <i class="fas fa-sync fa-spin"></i> {$ftp_status_initial_message|default:($_ADDONLANG.btkreports_ftp_status_checking|default:'FTP durumu kontrol ediliyor...')}
            </span>
            &nbsp;|&nbsp;
            <span><i class="fas fa-info-circle"></i> {$_ADDONLANG.btkreports_module_version}: {$config_module_version}</span>
            &nbsp;|&nbsp;
            <a href="{$modulelink}&action=viewReadme" title="{$_ADDONLANG.btkreports_link_readme_desc|default:'Modül Kullanım Kılavuzu ve Güncelleme Notları'}">
                <i class="fas fa-question-circle"></i> {$_ADDONLANG.btkreports_link_readme|default:'Yardım'}
            </a>
        </div>
    </div>

    {if isset($successMessage) && $successMessage}
        <div class="alert alert-success text-center alert-dismissible" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <i class="fas fa-check-circle"></i> {$successMessage}
        </div>
    {/if}
    {if isset($errorMessage_index) && $errorMessage_index} 
        <div class="alert alert-danger text-center alert-dismissible" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <i class="fas fa-times-circle"></i> {$errorMessage_index}
        </div>
    {/if}
    {if isset($infoMessage) && $infoMessage}
        <div class="alert alert-info text-center" role="alert">
            <i class="fas fa-info-circle"></i> {$infoMessage}
        </div>
    {/if}

    <ul class="nav nav-tabs btk-nav-tabs" role="tablist" id="btkModuleTabs">
        <li role="presentation" class="{if $smarty.get.action == 'index' || $smarty.get.action == '' || !$smarty.get.action}active{/if}">
            <a href="{$modulelink}&action=index" aria-controls="home" role="tab">
                <i class="fas fa-home"></i> {$_ADDONLANG.btkreports_tab_home|default:'Ana Sayfa'}
            </a>
        </li>
        <li role="presentation" class="{if $smarty.get.action == 'config'}active{/if}">
            <a href="{$modulelink}&action=config" aria-controls="settings" role="tab">
                <i class="fas fa-cogs"></i> {$_ADDONLANG.btkreports_tab_settings|default:'Ayarlar'}
            </a>
        </li>
        <li role="presentation" class="{if $smarty.get.action == 'productGroupMappings'}active{/if}">
            <a href="{$modulelink}&action=productGroupMappings" aria-controls="mappings" role="tab">
                <i class="fas fa-link"></i> {$_ADDONLANG.btkreports_tab_product_mappings|default:'Ürün Eşleştirme'}
            </a>
        </li>
        <li role="presentation" class="{if $smarty.get.action == 'generate'}active{/if}">
            <a href="{$modulelink}&action=generate" aria-controls="generate" role="tab">
                <i class="fas fa-file-export"></i> {$_ADDONLANG.btkreports_tab_generate_report|default:'Rapor Oluştur'}
            </a>
        </li>
        <li role="presentation" class="{if $smarty.get.action == 'personelList' || $smarty.get.action == 'personelEdit'}active{/if}">
            <a href="{$modulelink}&action=personelList" aria-controls="personnel" role="tab">
                <i class="fas fa-users-cog"></i> {$_ADDONLANG.btkreports_tab_personnel|default:'Personel Yönetimi'}
            </a>
        </li>
        <li role="presentation" class="{if $smarty.get.action == 'logs'}active{/if}">
            <a href="{$modulelink}&action=logs" aria-controls="logs" role="tab">
                <i class="fas fa-clipboard-list"></i> {$_ADDONLANG.btkreports_tab_logs|default:'Loglar'}
            </a>
        </li>
    </ul>

    <div class="tab-content btk-tab-content" style="padding-top: 20px;">
        {if $smarty.get.action == 'index' || $smarty.get.action == '' || !$smarty.get.action}
            <div role="tabpanel" class="tab-pane active" id="home">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title"><i class="fas fa-tachometer-alt"></i> {$_ADDONLANG.btkreports_dashboard_title|default:'Modül Paneli'}</h3>
                    </div>
                    <div class="panel-body">
                        <p>{$_ADDONLANG.btkreports_welcome_desc|default:'BTK Abone Veri Raporlama modülüne hoş geldiniz. Lütfen yukarıdaki sekmelerden veya aşağıdaki hızlı bağlantılardan istediğiniz işlemi seçin.'}</p>
                        
                        <h4><i class="fas fa-info-circle"></i> {$_ADDONLANG.btkreports_module_status_title|default:'Modül Durumu'}</h4>
                        <table class="table table-striped">
                            <tbody>
                                <tr>
                                    <td width="200"><strong>{$_ADDONLANG.btkreports_operator_name|default:'Operatör Adı'}:</strong></td>
                                    <td>{$config->operator_name|default:($_ADDONLANG.btkreports_not_configured|default:'Ayarlanmadı')}</td>
                                </tr>
                                <tr>
                                    <td><strong>{$_ADDONLANG.btkreports_operator_code|default:'Operatör Kodu'}:</strong></td>
                                    <td>{$config->operator_code|default:($_ADDONLANG.btkreports_not_configured|default:'Ayarlanmadı')}</td>
                                </tr>
                                <tr>
                                    <td><strong>{$_ADDONLANG.btkreports_operator_unvani_short|default:'Operatör Unvanı'}:</strong></td>
                                    <td>{$config->operator_unvani|default:($_ADDONLANG.btkreports_not_configured|default:'Ayarlanmadı')}</td>
                                </tr>
                                <tr>
                                    <td><strong>{$_ADDONLANG.btkreports_active_auth_types|default:'Aktif Yetkilendirme Türleri'}:</strong></td>
                                    <td>
                                        {if $config->active_auth_types && is_array($config->active_auth_types) && count($config->active_auth_types) > 0}
                                            {foreach $config->active_auth_types as $auth_type_code}
                                                {assign var="auth_type_name" value=$auth_type_code} 
                                                {if isset($allYetkiTurleriForStatus)}
                                                    {foreach from=$allYetkiTurleriForStatus item=auth_item}
                                                        {if $auth_item->yetki_kodu == $auth_type_code}
                                                            {assign var="auth_type_name" value=$auth_item->yetki_adi}
                                                            {break}
                                                        {/if}
                                                    {/foreach}
                                                {/if}
                                                <span class="label label-info" style="margin-right: 5px;">{$auth_type_name}</span>
                                            {/foreach}
                                        {else}
                                            {$_ADDONLANG.btkreports_not_configured|default:'Ayarlanmadı'}
                                        {/if}
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>{$_ADDONLANG.btkreports_ftp_host_label|default:'FTP Sunucusu'}:</strong></td>
                                    <td>{$config->ftp_host|default:($_ADDONLANG.btkreports_not_configured|default:'Ayarlanmadı')}</td>
                                </tr>
                            </tbody>
                        </table>

                        <h4><i class="fas fa-link"></i> {$_ADDONLANG.btkreports_quick_links_title|default:'Hızlı Bağlantılar'}</h4>
                        <p>
                            <a href="{$modulelink}&action=config" class="btn btn-info"><i class="fas fa-cogs"></i> {$_ADDONLANG.btkreports_link_config|default:'Genel Ayarlar'}</a>
                            <a href="{$modulelink}&action=productGroupMappings" class="btn btn-info"><i class="fas fa-exchange-alt"></i> {$_ADDONLANG.btkreports_link_product_mappings|default:'Ürün Eşleştirme'}</a>
                            <a href="{$modulelink}&action=generate" class="btn btn-warning"><i class="fas fa-file-export"></i> {$_ADDONLANG.btkreports_link_generate|default:'Manuel Rapor Oluştur'}</a>
                             <a href="{$modulelink}&action=personelList" class="btn btn-primary"><i class="fas fa-users"></i> {$_ADDONLANG.btkreports_link_personnel|default:'Personel Yönetimi'}</a>
                            <a href="{$modulelink}&action=logs" class="btn btn-default"><i class="fas fa-history"></i> {$_ADDONLANG.btkreports_link_logs|default:'Logları Görüntüle'}</a>
                        </p>
                        <hr>
                         <p class="text-muted text-right" style="font-size:0.9em;">{$_ADDONLANG.btkreports_footer_text|default:'BTK Raporlama Modülü - Tüm Hakları Saklıdır.'}</p>
                    </div>
                </div>
            </div>
        {elseif $smarty.get.action == 'viewReadme'}
             <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-book-reader"></i> {$_ADDONLANG.btkreports_readme_title|default:'Modül Kullanım Kılavuzu'}</h3>
                </div>
                <div class="panel-body markdown-content">
                    {if $readme_content}
                        {$readme_content|escape:'html'|nl2br}
                    {else}
                        <p>{$_ADDONLANG.btkreports_readme_not_found|default:'README.md dosyası bulunamadı.'}</p>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</div>

<script type="text/javascript">
$(document).ready(function() {
    var currentActionFromUrl = '{$smarty.get.action|default:"index"}';
    $('#btkModuleTabs li').removeClass('active'); 
    $('#btkModuleTabs a[href*="action=' + currentActionFromUrl + '"]').closest('li').addClass('active');
    if ($('#btkModuleTabs li.active').length === 0 && (currentActionFromUrl === '' || currentActionFromUrl === 'index') ) { 
         $('#btkModuleTabs a[href*="action=index"]').closest('li').addClass('active');
    }

    function checkFtpStatus() {
        var statusIndicator = $('#ftpStatusIndicator');
        if (!statusIndicator.length) return; 
        var loadingText = '<i class="fas fa-sync fa-spin"></i> ' + (typeof btkLang !== 'undefined' && btkLang.btkreports_ftp_status_checking ? btkLang.btkreports_ftp_status_checking : 'FTP durumu kontrol ediliyor...');
        statusIndicator.html(loadingText).removeClass('ftp-status-active ftp-status-passive ftp-status-error ftp-status-not-configured');

        var ajaxData = {
            token: (typeof btkCsrfToken !== 'undefined' ? btkCsrfToken : ''), 
            action: 'getFtpStatus'
        };
        
        $.ajax({
            url: (typeof btkFullModuleLink !== 'undefined' && btkFullModuleLink ? btkFullModuleLink : 'addonmodules.php?module=btkreports'), 
            type: 'POST', 
            data: ajaxData,
            dataType: 'json',
            timeout: 20000, 
            success: function(response) {
                if (response && typeof response.message !== 'undefined') {
                    if (response.success) {
                        statusIndicator.html('<i class="fas fa-check-circle"></i> ' + response.message).addClass('ftp-status-active');
                    } else {
                         var notConfiguredMsg = (typeof btkLang !== 'undefined' && btkLang.btkreports_ftp_status_not_configured ? btkLang.btkreports_ftp_status_not_configured : 'Ayarlanmadı');
                         if (response.message.includes(notConfiguredMsg.substring(notConfiguredMsg.indexOf('(')+1, notConfiguredMsg.lastIndexOf(')'))) || response.message.toLowerCase().includes("not configured") || response.message.toLowerCase().includes("ayarlanmadı")) {
                             statusIndicator.html('<i class="fas fa-exclamation-triangle"></i> ' + response.message).addClass('ftp-status-not-configured');
                         } else {
                            statusIndicator.html('<i class="fas fa-times-circle"></i> ' + response.message).addClass('ftp-status-passive');
                         }
                    }
                } else {
                     statusIndicator.html('<i class="fas fa-question-circle"></i> ' + (typeof btkLang !== 'undefined' && btkLang.btkreports_ftp_error_unknown ? btkLang.btkreports_ftp_error_unknown : 'Bilinmeyen bir FTP yanıtı alındı.')).addClass('text-danger');
                }
            },
            error: function(xhr, status, error) {
                var errorMessage = (typeof btkLang !== 'undefined' && btkLang.btkreports_ftp_test_fail_ajax ? btkLang.btkreports_ftp_test_fail_ajax : 'FTP testinde AJAX hatası:') + ' ';
                if (status === 'timeout') {
                    errorMessage += (typeof btkLang !== 'undefined' && btkLang.btkreports_ftp_error_timeout ? btkLang.btkreports_ftp_error_timeout : 'Sunucu zaman aşımına uğradı.');
                } else {
                    var responseText = xhr.responseText || '';
                    var requestUrlForError = this.url; 
                    if (typeof this.data === 'string') {
                        requestUrlForError += (this.url.indexOf('?') > -1 ? '&' : '?') + this.data;
                    } else if (typeof this.data === 'object' && this.data !== null) {
                         requestUrlForError += (this.url.indexOf('?') > -1 ? '&' : '?') + $.param(this.data);
                    }

                    if (xhr.status === 404) {
                        errorMessage += '404 Not Found. İstenen URL bulunamadı. (URL: ' + requestUrlForError + ')';
                    } else if (xhr.status === 200 && error === 'parsererror') { 
                        errorMessage += '200 OK, ancak sunucu yanıtı JSON formatında değil. (URL: ' + requestUrlForError + ') Lütfen WHMCS Sistem Loglarını (mod_btk_logs) kontrol edin. Yanıtın başı: ' + responseText.substring(0, 200) + (responseText.length > 200 ? '...' : '');
                    } else if (xhr.status !== 0 && xhr.statusText && xhr.statusText !== 'error') {
                        errorMessage += xhr.status + ' ' + xhr.statusText;
                         if (responseText && responseText.toLowerCase().indexOf('<html') === -1 && responseText.length < 300 ) {
                             errorMessage += ' Detay: ' + responseText.substring(0,100) + (responseText.length > 100 ? '...' : '');
                         }
                    } else if (error) {
                         errorMessage += error;
                    } else {
                         errorMessage += ' (Bilinmeyen sunucu hatası.)';
                    }
                }
                statusIndicator.html('<i class="fas fa-exclamation-triangle"></i> ' + errorMessage).addClass('text-danger');
            }
        });
    }

    if ($('#ftpStatusIndicator').length && (currentActionFromUrl === 'index' || currentActionFromUrl === '')) {
        checkFtpStatus();
    }
});
</script>
</div>