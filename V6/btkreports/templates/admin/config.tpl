{*
    WHMCS BTK Raporlama Modülü - Genel Ayarlar Şablonu
    modules/addons/btkreports/templates/admin/config.tpl
    (Nihai Sürüm - btk_page_config() ile tam uyumlu)
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$setting_version_placeholder}" rel="stylesheet">

{* Sayfa başlığı ve menü admin_header_menu.tpl tarafından sağlanıyor. Flash mesajlar da orada. *}

<form method="post" action="{$modulelink}&action=save_config" id="btkConfigForm">
    <input type="hidden" name="token" value="{$csrfToken}">

    {* --- Operatör ve Genel Ayarlar --- *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-user-cog"></i> {$LANG.generalSettings|default:'Operatör ve Genel Ayarlar'}</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="operator_code" class="required">{$LANG.operatorCode|default:'Operatör Kodu'}</label>
                        <i class="fas fa-info-circle btk-tooltip" title="{$LANG.operatorCodeDesc|escape:'html'|default:'BTK tarafından size bildirilen 3 haneli operatör kodu (Örn: 701). Bu alan zorunludur.'}"></i>
                        <input type="text" name="operator_code" id="operator_code" value="{if isset($form_data.operator_code)}{$form_data.operator_code|escape:'html'}{else}{$settings.operator_code|escape:'html'}{/if}" class="form-control" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="operator_name" class="required">{$LANG.operatorName|default:'Operatör Adı'}</label>
                        <i class="fas fa-info-circle btk-tooltip" title="{$LANG.operatorNameDesc|escape:'html'|default:'BTK tarafından size bildirilen işletmeci adı (Örn: IZMARBILISIM). Dosya adlarında kullanılır. Bu alan zorunludur.'}"></i>
                        <input type="text" name="operator_name" id="operator_name" value="{if isset($form_data.operator_name)}{$form_data.operator_name|escape:'html'}{else}{$settings.operator_name|escape:'html'}{/if}" class="form-control" required>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="operator_title">{$LANG.operatorTitle|default:'Operatör Resmi Ünvanı'}</label>
                <i class="fas fa-info-circle btk-tooltip" title="{$LANG.operatorTitleDesc|escape:'html'|default:'Şirketinizin Ticaret Sicilinde kayıtlı tam resmi ünvanı. Sadece Personel Listesi raporunda kullanılır.'}"></i>
                <input type="text" name="operator_title" id="operator_title" value="{if isset($form_data.operator_title)}{$form_data.operator_title|escape:'html'}{else}{$settings.operator_title|escape:'html'}{/if}" class="form-control">
            </div>
             <div class="form-group">
                <label for="surum_notlari_link">{$LANG.surumNotlariLinkText|default:'Sürüm Notları Linki'}</label>
                 <i class="fas fa-info-circle btk-tooltip" title="{$LANG.surumNotlariLinkDesc|escape:'html'|default:'Modül ana sayfasında gösterilecek sürüm notları TXT/MD dosyasının URL\'si. Örn: ../modules/addons/btkreports/README.md'}"></i>
                <input type="text" name="surum_notlari_link" id="surum_notlari_link" value="{if isset($form_data.surum_notlari_link)}{$form_data.surum_notlari_link|escape:'html'}{else}{$settings.surum_notlari_link|default:'../modules/addons/btkreports/README.md'|escape:'html'}{/if}" class="form-control">
            </div>
            <div class="form-group">
                <label for="admin_records_per_page">{$LANG.adminRecordsPerPage|default:'Listeleme Başına Kayıt Sayısı'}</label>
                 <i class="fas fa-info-circle btk-tooltip" title="{$LANG.adminRecordsPerPageDesc|escape:'html'|default:'Personel, POP vb. listeleme sayfalarında sayfa başına gösterilecek kayıt sayısı.'}"></i>
                <input type="number" name="admin_records_per_page" id="admin_records_per_page" value="{if isset($form_data.admin_records_per_page)}{$form_data.admin_records_per_page|escape:'html'}{else}{$settings.admin_records_per_page|default:20}{/if}" class="form-control" min="5" max="200">
            </div>
             <div class="form-group">
                <label for="log_records_per_page_config">{$LANG.logRecordsPerPage|default:'Log Sayfası Kayıt Sayısı'}</label>
                 <i class="fas fa-info-circle btk-tooltip" title="{$LANG.logRecordsPerPageDesc|escape:'html'|default:'Log Görüntüleme sayfasında sayfa başına gösterilecek kayıt sayısı.'}"></i>
                <input type="number" name="log_records_per_page" id="log_records_per_page_config" value="{if isset($form_data.log_records_per_page)}{$form_data.log_records_per_page|escape:'html'}{else}{$settings.log_records_per_page|default:50}{/if}" class="form-control" min="10" max="500">
            </div>
        </div>
    </div>

    {* --- Ana BTK FTP Sunucu Ayarları --- *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-server"></i> {$LANG.mainFtpSettings|default:'Ana BTK FTP Sunucu Ayarları'}</h3>
        </div>
        <div class="panel-body">
            <input type="hidden" id="main_ftp_pass_is_set_placeholder_hidden_input" value="{$settings.main_ftp_pass_is_set|default:'0'}">
            <div class="row">
                <div class="col-md-6 form-group"><label for="main_ftp_host">{$LANG.ftpHost}</label><input type="text" name="main_ftp_host" id="main_ftp_host" value="{if isset($form_data.main_ftp_host)}{$form_data.main_ftp_host|escape:'html'}{else}{$settings.main_ftp_host|escape:'html'}{/if}" class="form-control"></div>
                <div class="col-md-6 form-group"><label for="main_ftp_user">{$LANG.ftpUser}</label><input type="text" name="main_ftp_user" id="main_ftp_user" value="{if isset($form_data.main_ftp_user)}{$form_data.main_ftp_user|escape:'html'}{else}{$settings.main_ftp_user|escape:'html'}{/if}" class="form-control"></div>
            </div>
            <div class="row">
                <div class="col-md-5 form-group"><label for="main_ftp_pass">{$LANG.ftpPassPlaceholder}</label><input type="password" name="main_ftp_pass" id="main_ftp_pass" value="{$settings.main_ftp_pass|escape:'html'}" class="form-control" autocomplete="new-password"></div>
                <div class="col-md-2 form-group"><label for="main_ftp_port">{$LANG.ftpPort}</label><input type="number" name="main_ftp_port" id="main_ftp_port" value="{if isset($form_data.main_ftp_port)}{$form_data.main_ftp_port|escape:'html'}{else}{$settings.main_ftp_port|default:21}{/if}" class="form-control"></div>
                <div class="col-md-3 form-group" style="padding-top: 25px;">
                    <label class="btk-switch" for="main_ftp_ssl_toggle_config">
                        <input type="checkbox" name="main_ftp_ssl" id="main_ftp_ssl_toggle_config" value="1" {if (isset($form_data.main_ftp_ssl) && ($form_data.main_ftp_ssl === 'on' || $form_data.main_ftp_ssl === '1')) || (!isset($form_data.main_ftp_ssl) && $settings.main_ftp_ssl == '1')}checked{/if}>
                        <span class="btk-slider round"></span>
                    </label>
                    <label for="main_ftp_ssl_toggle_config" style="display:inline; font-weight:normal;">{$LANG.ftpSSL}</label> <i class="fas fa-info-circle btk-tooltip" title="{$LANG.ftpSSLDesc|escape:'html'}"></i>
                </div>
                <div class="col-md-2 form-group" style="padding-top: 20px;">
                     <button type="button" class="btn btn-info btn-sm btn-block btk-ftp-test-btn" data-ftp-type="main">
                        <i class="fas fa-plug"></i> {$LANG.testFtpConnection|default:'Test Et'}
                     </button>
                </div>
            </div>
            <div id="main_ftp_test_result" class="help-block bottom-margin-10"></div>
            <div class="row">
                <div class="col-md-4 form-group"><label for="main_ftp_rehber_path">{$LANG.ftpRehberPath}</label><input type="text" name="main_ftp_rehber_path" id="main_ftp_rehber_path" value="{if isset($form_data.main_ftp_rehber_path)}{$form_data.main_ftp_rehber_path|escape:'html'}{else}{$settings.main_ftp_rehber_path|default:'/REHBER/'|escape:'html'}{/if}" class="form-control"></div>
                <div class="col-md-4 form-group"><label for="main_ftp_hareket_path">{$LANG.ftpHareketPath}</label><input type="text" name="main_ftp_hareket_path" id="main_ftp_hareket_path" value="{if isset($form_data.main_ftp_hareket_path)}{$form_data.main_ftp_hareket_path|escape:'html'}{else}{$settings.main_ftp_hareket_path|default:'/HAREKET/'|escape:'html'}{/if}" class="form-control"></div>
                <div class="col-md-4 form-group"><label for="main_ftp_personel_path">{$LANG.ftpPersonelPath}</label><input type="text" name="main_ftp_personel_path" id="main_ftp_personel_path" value="{if isset($form_data.main_ftp_personel_path)}{$form_data.main_ftp_personel_path|escape:'html'}{else}{$settings.main_ftp_personel_path|default:'/PERSONEL/'|escape:'html'}{/if}" class="form-control"></div>
            </div>
            <div class="form-group">
                <label class="btk-switch" for="personel_filename_add_year_month_main_toggle">
                    <input type="checkbox" name="personel_filename_add_year_month_main" id="personel_filename_add_year_month_main_toggle" value="1" {if (isset($form_data.personel_filename_add_year_month_main) && ($form_data.personel_filename_add_year_month_main === 'on' || $form_data.personel_filename_add_year_month_main === '1')) || (!isset($form_data.personel_filename_add_year_month_main) && $settings.personel_filename_add_year_month_main == '1')}checked{/if}>
                    <span class="btk-slider round"></span>
                </label>
                <label for="personel_filename_add_year_month_main_toggle" style="display:inline; font-weight:normal;">{$LANG.personelFilenameAddYearMonth} (Ana FTP)</label>
                <i class="fas fa-info-circle btk-tooltip" title="{$LANG.personelFilenameAddYearMonthDesc|escape:'html'}"></i>
            </div>
        </div>
    </div>

    {* --- Yedek FTP Sunucu Ayarları --- *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title">
                <label class="btk-switch btk-switch-panel-title" for="backup_ftp_enabled_toggle_config">
                    <input type="checkbox" name="backup_ftp_enabled" id="backup_ftp_enabled_toggle_config" value="1" {if (isset($form_data.backup_ftp_enabled) && ($form_data.backup_ftp_enabled === 'on' || $form_data.backup_ftp_enabled === '1')) || (!isset($form_data.backup_ftp_enabled) && $settings.backup_ftp_enabled == '1')}checked{/if}>
                    <span class="btk-slider round"></span>
                </label>
                <label for="backup_ftp_enabled_toggle_config" style="display:inline; font-weight:inherit; color:inherit; cursor:pointer;">
                    <i class="fas fa-archive"></i> {$LANG.backupFtpSettings|default:'Yedek FTP Sunucu Ayarları'} <small>({$LANG.optional|default:'Opsiyonel'})</small>
                </label>
            </h3>
        </div>
        <div class="panel-body" id="backup_ftp_details_config" {if !((isset($form_data.backup_ftp_enabled) && ($form_data.backup_ftp_enabled === 'on' || $form_data.backup_ftp_enabled === '1')) || (!isset($form_data.backup_ftp_enabled) && $settings.backup_ftp_enabled == '1'))}style="display:none;"{/if}>
            <input type="hidden" id="backup_ftp_pass_is_set_placeholder_hidden_input" value="{$settings.backup_ftp_pass_is_set|default:'0'}">
            <div class="row">
                <div class="col-md-6 form-group"><label for="backup_ftp_host">{$LANG.ftpHost}</label><input type="text" name="backup_ftp_host" id="backup_ftp_host" value="{if isset($form_data.backup_ftp_host)}{$form_data.backup_ftp_host|escape:'html'}{else}{$settings.backup_ftp_host|escape:'html'}{/if}" class="form-control"></div>
                <div class="col-md-6 form-group"><label for="backup_ftp_user">{$LANG.ftpUser}</label><input type="text" name="backup_ftp_user" id="backup_ftp_user" value="{if isset($form_data.backup_ftp_user)}{$form_data.backup_ftp_user|escape:'html'}{else}{$settings.backup_ftp_user|escape:'html'}{/if}" class="form-control"></div>
            </div>
            <div class="row">
                <div class="col-md-5 form-group"><label for="backup_ftp_pass">{$LANG.ftpPassPlaceholder}</label><input type="password" name="backup_ftp_pass" id="backup_ftp_pass" value="{$settings.backup_ftp_pass|escape:'html'}" class="form-control" autocomplete="new-password"></div>
                <div class="col-md-2 form-group"><label for="backup_ftp_port">{$LANG.ftpPort}</label><input type="number" name="backup_ftp_port" id="backup_ftp_port" value="{if isset($form_data.backup_ftp_port)}{$form_data.backup_ftp_port|escape:'html'}{else}{$settings.backup_ftp_port|default:21}{/if}" class="form-control"></div>
                <div class="col-md-3 form-group" style="padding-top: 25px;">
                    <label class="btk-switch" for="backup_ftp_ssl_toggle_config">
                        <input type="checkbox" name="backup_ftp_ssl" id="backup_ftp_ssl_toggle_config" value="1" {if (isset($form_data.backup_ftp_ssl) && ($form_data.backup_ftp_ssl === 'on' || $form_data.backup_ftp_ssl === '1')) || (!isset($form_data.backup_ftp_ssl) && $settings.backup_ftp_ssl == '1')}checked{/if}>
                        <span class="btk-slider round"></span>
                    </label>
                    <label for="backup_ftp_ssl_toggle_config" style="display:inline; font-weight:normal;">{$LANG.ftpSSL}</label>
                </div>
                <div class="col-md-2 form-group" style="padding-top: 20px;">
                     <button type="button" class="btn btn-info btn-sm btn-block btk-ftp-test-btn" data-ftp-type="backup" {if !((isset($form_data.backup_ftp_enabled) && ($form_data.backup_ftp_enabled === 'on' || $form_data.backup_ftp_enabled === '1')) || (!isset($form_data.backup_ftp_enabled) && $settings.backup_ftp_enabled == '1'))}disabled{/if}>
                        <i class="fas fa-plug"></i> {$LANG.testFtpConnection|default:'Test Et'}
                     </button>
                </div>
            </div>
            <div id="backup_ftp_test_result" class="help-block bottom-margin-10"></div>
            <div class="row">
                <div class="col-md-4 form-group"><label for="backup_ftp_rehber_path">{$LANG.ftpRehberPath}</label><input type="text" name="backup_ftp_rehber_path" id="backup_ftp_rehber_path" value="{if isset($form_data.backup_ftp_rehber_path)}{$form_data.backup_ftp_rehber_path|escape:'html'}{else}{$settings.backup_ftp_rehber_path|default:'/REHBER_YEDEK/'|escape:'html'}{/if}" class="form-control"></div>
                <div class="col-md-4 form-group"><label for="backup_ftp_hareket_path">{$LANG.ftpHareketPath}</label><input type="text" name="backup_ftp_hareket_path" id="backup_ftp_hareket_path" value="{if isset($form_data.backup_ftp_hareket_path)}{$form_data.backup_ftp_hareket_path|escape:'html'}{else}{$settings.main_ftp_hareket_path|default:'/HAREKET_YEDEK/'|escape:'html'}{/if}" class="form-control"></div>
                <div class="col-md-4 form-group"><label for="backup_ftp_personel_path">{$LANG.ftpPersonelPath}</label><input type="text" name="backup_ftp_personel_path" id="backup_ftp_personel_path" value="{if isset($form_data.backup_ftp_personel_path)}{$form_data.backup_ftp_personel_path|escape:'html'}{else}{$settings.backup_ftp_personel_path|default:'/PERSONEL_YEDEK/'|escape:'html'}{/if}" class="form-control"></div>
            </div>
            <div class="form-group">
                <label class="btk-switch" for="personel_filename_add_year_month_backup_toggle">
                    <input type="checkbox" name="personel_filename_add_year_month_backup" id="personel_filename_add_year_month_backup_toggle" value="1" {if (isset($form_data.personel_filename_add_year_month_backup) && ($form_data.personel_filename_add_year_month_backup === 'on' || $form_data.personel_filename_add_year_month_backup === '1')) || (!isset($form_data.personel_filename_add_year_month_backup) && $settings.personel_filename_add_year_month_backup == '1') || ($settings.backup_ftp_enabled != '1' && $settings.personel_filename_add_year_month_backup != '0') }checked{/if}>
                    <span class="btk-slider round"></span>
                </label>
                <label for="personel_filename_add_year_month_backup_toggle" style="display:inline; font-weight:normal;">{$LANG.personelFilenameAddYearMonth} (Yedek FTP)</label>
                <i class="fas fa-info-circle btk-tooltip" title="{$LANG.personelFilenameAddYearMonthDesc|escape:'html'}"></i>
            </div>
        </div>
    </div>

    {* --- BTK Yetkilendirme Seçenekleri --- *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-user-shield"></i> {$LANG.btkYetkilendirmeSecenekleri|default:'BTK Yetkilendirme Seçenekleri'}</h3>
        </div>
        <div class="panel-body">
            <p>{$LANG.btkYetkilendirmeDesc|default:'Sahip olduğunuz ve raporlama yapacağınız BTK yetki türlerini seçin. Bu seçim, "Ürün Grubu Eşleştirme" sayfasındaki seçenekleri ve oluşturulacak raporların "Tip" bölümünü etkileyecektir.'}</p>
            <div class="row btk-yetki-list">
                {assign var="col_count" value=0}
                {foreach from=$yetki_turleri item=yt}
                    {if $col_count > 0 && $col_count % 2 == 0}
                        </div><div class="row btk-yetki-list" style="margin-top:0; margin-bottom:0;">
                    {/if}
                    <div class="col-md-6">
                        <div class="btk-yetki-item form-group">
                            <label class="btk-switch" for="yetki_{$yt.kod|escape:'url'}">
                                <input type="checkbox" name="yetkiler[{$yt.kod|escape:'html'}]" id="yetki_{$yt.kod|escape:'url'}" value="on" {if $yt.aktif == 1}checked{/if}>
                                <span class="btk-slider round"></span>
                            </label>
                            <label for="yetki_{$yt.kod|escape:'url'}" style="font-weight:normal; display:inline; margin-left:5px; cursor:pointer;">
                                <span class="btk-yetki-name">{$yt.ad|escape:'html'} ({$yt.kod|escape:'html'}{if $yt.grup} - {$yt.grup|escape:'html'}{/if})</span>
                                {assign var="tooltip_lang_key" value="yetki_"|cat:($yt.kod|lower)|cat:"_desc"}
                                <i class="fas fa-info-circle btk-tooltip" title="{if isset($LANG[$tooltip_lang_key])}{$LANG[$tooltip_lang_key]|escape:'html'}{else}{$LANG.yetkiDefaultDesc|escape:'html'}{/if}"></i>
                            </label>
                        </div>
                    </div>
                    {assign var="col_count" value=$col_count+1}
                {/foreach}
                 {if $col_count > 0 && $col_count % 2 != 0}
                     <div class="col-md-6"></div>
                 {/if}
            </div>
             {if $col_count > 0 }</div>{/if} 
             {if !$yetki_turleri|@count}<p>{$LANG.noAuthTypesForSelection|default:'Listelenecek aktif edilebilir yetki türü bulunamadı.'}</p>{/if}
        </div>
    </div>

    {* --- Otomatik Raporlama (Cron Job) Ayarları --- *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-clock"></i> {$LANG.cronSettings|default:'Otomatik Raporlama Ayarları'}</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-4 form-group">
                    <label for="rehber_cron_schedule">{$LANG.rehberCronSchedule|default:'ABONE REHBER Cron'}</label>
                    <i class="fas fa-info-circle btk-tooltip" title="{$LANG.cronScheduleDesc|escape:'html'|default:'Standart cron ifadesi formatında giriniz. Örn: \'0 10 1 * *\' (Her ayın 1\'inde saat 10:00)'}"></i>
                    <input type="text" name="rehber_cron_schedule" id="rehber_cron_schedule" value="{if isset($form_data.rehber_cron_schedule)}{$form_data.rehber_cron_schedule|escape:'html'}{else}{$settings.rehber_cron_schedule|default:'0 10 1 * *'}{/if}" class="form-control">
                </div>
                <div class="col-md-4 form-group">
                    <label for="hareket_cron_schedule">{$LANG.hareketCronSchedule|default:'ABONE HAREKET Cron'}</label>
                     <i class="fas fa-info-circle btk-tooltip" title="{$LANG.cronScheduleDesc|escape:'html'}"></i>
                    <input type="text" name="hareket_cron_schedule" id="hareket_cron_schedule" value="{if isset($form_data.hareket_cron_schedule)}{$form_data.hareket_cron_schedule|escape:'html'}{else}{$settings.hareket_cron_schedule|default:'0 1 * * *'}{/if}" class="form-control">
                </div>
                <div class="col-md-4 form-group">
                    <label for="personel_cron_schedule">{$LANG.personelCronSchedule|default:'PERSONEL LİSTESİ Cron'}</label>
                     <i class="fas fa-info-circle btk-tooltip" title="{$LANG.cronScheduleDesc|escape:'html'}"></i>
                    <input type="text" name="personel_cron_schedule" id="personel_cron_schedule" value="{if isset($form_data.personel_cron_schedule)}{$form_data.personel_cron_schedule|escape:'html'}{else}{$settings.personel_cron_schedule|default:'0 16 L 6,12 *'}{/if}" class="form-control">
                </div>
            </div>
        </div>
    </div>
    
    {* --- Diğer Ayarlar --- *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-sliders-h"></i> {$LANG.otherSettings|default:'Diğer Ayarlar'}</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-4 form-group">
                    <label class="btk-switch" for="send_empty_reports_toggle_config">
                        <input type="checkbox" name="send_empty_reports" id="send_empty_reports_toggle_config" value="1" {if (isset($form_data.send_empty_reports) && ($form_data.send_empty_reports === 'on' || $form_data.send_empty_reports === '1')) || (!isset($form_data.send_empty_reports) && $settings.send_empty_reports == '1')}checked{/if}>
                        <span class="btk-slider round"></span>
                    </label>
                    <label for="send_empty_reports_toggle_config" style="display:inline; font-weight:normal;">{$LANG.sendEmptyReports|default:'Boş Dosya Gönder'}</label>
                    <i class="fas fa-info-circle btk-tooltip" title="{$LANG.sendEmptyReportsDesc|escape:'html'}"></i>
                </div>
                 <div class="col-md-4 form-group">
                    <label class="btk-switch" for="debug_mode_toggle_config">
                        <input type="checkbox" name="debug_mode" id="debug_mode_toggle_config" value="1" {if (isset($form_data.debug_mode) && ($form_data.debug_mode === 'on' || $form_data.debug_mode === '1')) || (!isset($form_data.debug_mode) && $settings.debug_mode == '1')}checked{/if}>
                        <span class="btk-slider round"></span>
                    </label>
                    <label for="debug_mode_toggle_config" style="display:inline; font-weight:normal;">{$LANG.debugMode|default:'Hata Ayıklama Modu'}</label>
                    <i class="fas fa-info-circle btk-tooltip" title="{$LANG.debugModeDesc|escape:'html'}"></i>
                </div>
                <div class="col-md-4 form-group">
                    <label class="btk-switch" for="delete_data_on_deactivate_toggle_config">
                        <input type="checkbox" name="delete_data_on_deactivate" id="delete_data_on_deactivate_toggle_config" value="1" {if (isset($form_data.delete_data_on_deactivate) && ($form_data.delete_data_on_deactivate === 'on' || $form_data.delete_data_on_deactivate === '1')) || (!isset($form_data.delete_data_on_deactivate) && $settings.delete_data_on_deactivate == '1')}checked{/if}>
                        <span class="btk-slider round"></span>
                    </label>
                    <label for="delete_data_on_deactivate_toggle_config" style="display:inline; font-weight:normal;">{$LANG.deleteDataOnDeactivate|default:'Kaldırınca Verileri Sil'}</label>
                    <i class="fas fa-info-circle btk-tooltip" title="{$LANG.deleteDataOnDeactivateDesc|escape:'html'}"></i>
                </div>
            </div>
             <div class="row top-margin-10">
                <div class="col-md-4 form-group">
                    <label for="hareket_live_table_days">{$LANG.hareketLiveTableDays|default:'Hareket Canlı Saklama (Gün)'}</label>
                    <i class="fas fa-info-circle btk-tooltip" title="{$LANG.hareketLiveTableDaysDesc|escape:'html'}"></i>
                    <input type="number" name="hareket_live_table_days" id="hareket_live_table_days" value="{if isset($form_data.hareket_live_table_days)}{$form_data.hareket_live_table_days|escape:'html'}{else}{$settings.hareket_live_table_days|default:7}{/if}" class="form-control" min="1">
                </div>
                <div class="col-md-4 form-group">
                    <label for="hareket_archive_table_days">{$LANG.hareketArchiveTableDays|default:'Hareket Arşiv Saklama (Gün)'}</label>
                    <i class="fas fa-info-circle btk-tooltip" title="{$LANG.hareketArchiveTableDaysDesc|escape:'html'}"></i>
                    <input type="number" name="hareket_archive_table_days" id="hareket_archive_table_days" value="{if isset($form_data.hareket_archive_table_days)}{$form_data.hareket_archive_table_days|escape:'html'}{else}{$settings.hareket_archive_table_days|default:180}{/if}" class="form-control" min="1">
                </div>
                 <div class="col-md-4 form-group">
                    <label for="log_records_per_page_config">{$LANG.logRecordsPerPage|default:'Log Sayfası Kayıt Sayısı'}</label>
                     <i class="fas fa-info-circle btk-tooltip" title="{$LANG.logRecordsPerPageDesc|escape:'html'|default:'Log Görüntüleme sayfasında sayfa başına gösterilecek kayıt sayısı.'}"></i>
                    <input type="number" name="log_records_per_page" id="log_records_per_page_config" value="{if isset($form_data.log_records_per_page)}{$form_data.log_records_per_page|escape:'html'}{else}{$settings.log_records_per_page|default:50}{/if}" class="form-control" min="10" max="500">
                </div>
            </div>
            <div class="form-group top-margin-10">
                 <label class="btk-switch" for="show_btk_info_if_empty_clientarea_toggle_config">
                    <input type="checkbox" name="show_btk_info_if_empty_clientarea" id="show_btk_info_if_empty_clientarea_toggle_config" value="1" {if (isset($form_data.show_btk_info_if_empty_clientarea) && ($form_data.show_btk_info_if_empty_clientarea === 'on' || $form_data.show_btk_info_if_empty_clientarea === '1')) || (!isset($form_data.show_btk_info_if_empty_clientarea) && $settings.show_btk_info_if_empty_clientarea == '1')}checked{/if}>
                    <span class="btk-slider round"></span>
                </label>
                <label for="show_btk_info_if_empty_clientarea_toggle_config" style="display:inline; font-weight:normal;">{$LANG.showBtkInfoIfEmptyClientArea|default:'Müşteri Panelinde BTK Bilgisi Boşsa Bile Göster'}</label>
                <i class="fas fa-info-circle btk-tooltip" title="{$LANG.showBtkInfoIfEmptyClientAreaDesc|escape:'html'|default:'Eğer müşterinin veya hizmetin BTK verileri henüz girilmemişse, müşteri panelinde ilgili BTK bilgi blokları yine de gösterilsin mi? İşaretlenmezse, sadece veri varsa gösterilir.'}"></i>
            </div>
        </div>
    </div>

    <div class="text-center top-margin-20 bottom-margin-20">
        <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-save"></i> {$LANG.saveChanges}</button>
        <a href="{$modulelink}" class="btn btn-default btn-lg">{$LANG.cancel}</a>
    </div>
</form>

<script type="text/javascript">
// Bu script bloğu, bt_admin_scripts.js'ye taşınmayacak ve sadece bu sayfada çalışacak.
// Hata ayıklaması ve uyumluluk için bu yöntem daha güvenilir.
$(document).ready(function() {
    var modulelink_js = '{$modulelink|escape:"javascript"}';
    var csrfToken_js = '{$csrfToken|escape:"javascript"}';
    var LANG_js = {
        ftpPassPlaceholder: '{$LANG.ftpPassPlaceholder|escape:"javascript"|default:"Değiştirmek istemiyorsanız dokunmayın"}',
        testingConnection: '{$LANG.testingConnection|escape:"javascript"|default:"Bağlantı test ediliyor..."}',
        ftpTestAjaxError: '{$LANG.ftpTestAjaxError|escape:"javascript"|default:"Sunucuya ulaşılamadı veya bir test hatası oluştu."}'
    };

    String.prototype.escapeHTML = function () {
        var p = document.createElement("p");
        p.appendChild(document.createTextNode(this));
        return p.innerHTML;
    };

    $('#backup_ftp_enabled_toggle_config').on('change', function() {
        var backupDetails = $('#backup_ftp_details_config');
        var backupTestBtn = $('#btkConfigForm button[data-ftp-type="backup"]');
        if($(this).is(":checked")) {
            backupDetails.slideDown('fast');
            backupTestBtn.prop('disabled', false);
        } else {
            backupDetails.slideUp('fast');
            backupTestBtn.prop('disabled', true);
            $('#backup_ftp_test_result').html('');
        }
    }).trigger('change');

    if (typeof $.fn.tooltip == 'function') {
        $('#btkConfigForm .btk-tooltip').tooltip({ placement: 'top', container: 'body', html: true });
    }

    $('#btkConfigForm input[type="password"]').each(function() {
        var $this = $(this);
        var isSetHiddenInputId = '#' + $this.attr('id') + '_is_set_placeholder_hidden_input';
        var isSet = ($(isSetHiddenInputId).length > 0 && $(isSetHiddenInputId).val() === '1');
        $this.attr('placeholder', LANG_js.ftpPassPlaceholder);
        if (isSet && ($this.val() === '' || $this.val() === '********')) {
            $this.val('********');
        } else if (!isSet && $this.val() === '********'){
             $this.val('');
        }
        $this.focus(function() { if ($(this).val() === '********') { $(this).val(''); } })
          .blur(function() { 
              if ($(this).val() === '') {
                  var currentIsSet = ($('#' + $(this).attr('id') + '_is_set_placeholder_hidden_input').val() === '1');
                  if (currentIsSet) { $(this).val('********'); } 
              } 
          });
    });

    $('.btk-ftp-test-btn').click(function(e) {
        e.preventDefault();
        var ftpType = $(this).data('ftp-type');
        var resultContainer = $('#' + ftpType + '_ftp_test_result');
        var button = $(this);
        resultContainer.removeClass('text-success text-danger').html('<i class="fas fa-spinner fa-spin"></i> ' + LANG_js.testingConnection);
        button.prop('disabled', true);
        
        var ftpPassVal = $('#' + ftpType + '_ftp_pass').val();
        
        $.ajax({
            url: modulelink_js, 
            type: 'POST',
            data: { 
                btk_ajax_action: 'test_ftp_connection', 
                ftp_type: ftpType, 
                host: $('#' + ftpType + '_ftp_host').val(), 
                user: $('#' + ftpType + '_ftp_user').val(), 
                pass: ftpPassVal,
                port: $('#' + ftpType + '_ftp_port').val(), 
                ssl: $('#' + ftpType + '_ftp_ssl_toggle_config').is(':checked') ? '1' : '0', 
                token: csrfToken_js 
            },
            dataType: 'json',
            success: function(response) {
                if (response && response.status === 'success') {
                    resultContainer.addClass('text-success').html('<i class="fas fa-check-circle"></i> ' + response.message.escapeHTML());
                } else {
                    resultContainer.addClass('text-danger').html('<i class="fas fa-times-circle"></i> ' + (response.message ? response.message.escapeHTML() : 'Bilinmeyen Hata'));
                }
            },
            error: function(xhr, status, error) {
                console.error("FTP Test AJAX Hatası:", { status: status, error: error, responseText: xhr.responseText });
                var userErrorMessage = LANG_js.ftpTestAjaxError + ' (' + status + ')';
                if(xhr.responseText && xhr.responseText.includes("Encryption")) {
                    userErrorMessage += " - Şifreleme Sınıfı Hatası.";
                }
                resultContainer.addClass('text-danger').html('<i class="fas fa-exclamation-triangle"></i> ' + userErrorMessage);
            },
            complete: function() {
                button.prop('disabled', false);
            }
        });
    });
});
</script>