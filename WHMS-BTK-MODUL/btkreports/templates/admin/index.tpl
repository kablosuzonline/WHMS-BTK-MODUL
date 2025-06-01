{* WHMCS BTK Raporlama Modülü - Ana Sayfa (index.tpl) - V3.0.0 - Tam Sürüm *}

{if $successmessage}
    <div class="alert alert-success text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-check-circle"></i> {$successmessage}
    </div>
{/if}
{if $errormessage}
    <div class="alert alert-danger text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-times-circle"></i> {$errormessage}
    </div>
{/if}
{if $infomessage}
    <div class="alert alert-info text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-info-circle"></i> {$infomessage}
    </div>
{/if}

<div class="btk-dashboard">
    <div class="row">
        <div class="col-md-8">
            <h4><i class="fas fa-tachometer-alt"></i> {$_LANG.btk_dashboard_welcome|default:"BTK Raporlama Modülü Kontrol Paneli"}</h4>
            <p>{$_LANG.btk_dashboard_desc|default:"Bu arayüz üzerinden BTK raporlama süreçlerinizi yönetebilir, ayarlarınızı yapılandırabilir ve oluşturulan raporları takip edebilirsiniz."}</p>
        </div>
        <div class="col-md-4 text-right">
            <p class="text-muted" style="margin-bottom: 5px;">{$_LANG.btk_version|default:"Versiyon"}: {$btkModuleVersion}</p>
            {if $lastCronRunTime}
                <p class="text-muted" data-toggle="tooltip" title="btkreports_cron.php dosyasının son başarılı çalışma zamanı." style="margin-bottom: 0;">{$_LANG.btk_last_cron_run|default:"Son Cron Çalışması"}: {$lastCronRunTime|btk_datetime_format} ({$lastCronRunTimeFromNow})</p>
            {else}
                <p class="text-warning" style="margin-bottom: 0;"><i class="fas fa-exclamation-triangle"></i> {$_LANG.btk_cron_not_run_yet|default:"Cron henüz çalışmamış veya loglanmamış."}</p>
            {/if}
        </div>
    </div>
    <hr>

    <div class="row" style="margin-bottom: 20px;">
        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12" style="margin-bottom:15px;">
            <a href="{$modulelink}&action=config" class="btn btn-block btn-default" style="padding: 20px; height: 120px; display: flex; flex-direction: column; justify-content: center; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,.1);">
                <i class="fas fa-cogs fa-3x"></i><br>
                <span style="margin-top: 5px;">{$_LANG.btk_settings_title|default:"Modül Ayarları"}</span>
            </a>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12" style="margin-bottom:15px;">
            <a href="{$modulelink}&action=productgroupmap" class="btn btn-block btn-default" style="padding: 20px; height: 120px; display: flex; flex-direction: column; justify-content: center; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,.1);">
                <i class="fas fa-sitemap fa-3x"></i><br>
                <span style="margin-top: 5px;">{$_LANG.btk_product_group_mapping_title|default:"Ürün Grubu Eşleştirme"}</span>
            </a>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12" style="margin-bottom:15px;">
            <a href="{$modulelink}&action=personel" class="btn btn-block btn-default" style="padding: 20px; height: 120px; display: flex; flex-direction: column; justify-content: center; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,.1);">
                <i class="fas fa-users-cog fa-3x"></i><br>
                <span style="margin-top: 5px;">{$_LANG.btk_personnel_management_title|default:"Personel Yönetimi"}</span>
            </a>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12" style="margin-bottom:15px;">
            <a href="{$modulelink}&action=generate_reports" class="btn btn-block btn-default" style="padding: 20px; height: 120px; display: flex; flex-direction: column; justify-content: center; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,.1);">
                <i class="fas fa-file-export fa-3x"></i><br>
                <span style="margin-top: 5px;">{$_LANG.btk_generate_reports_title|default:"Manuel Rapor Oluştur"}</span>
            </a>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12" style="margin-bottom:15px;">
            <a href="{$modulelink}&action=view_logs" class="btn btn-block btn-default" style="padding: 20px; height: 120px; display: flex; flex-direction: column; justify-content: center; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,.1);">
                <i class="fas fa-clipboard-list fa-3x"></i><br>
                <span style="margin-top: 5px;">{$_LANG.btk_view_logs_title|default:"İşlem Logları"}</span>
            </a>
        </div>
    </div>

    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-history"></i> {$_LANG.btk_last_generated_reports_title|default:"Son Oluşturulan Rapor Dosyaları (En Fazla 10)"}</h3>
        </div>
        <div class="panel-body">
            {if $lastGeneratedFiles && $lastGeneratedFiles|@count > 0}
                <div class="table-responsive">
                    <table class="table table-striped table-condensed table-hover">
                        <thead>
                            <tr>
                                <th>{$_LANG.btk_filename|default:"Dosya Adı"}</th>
                                <th>{$_LANG.btk_file_type|default:"Dosya Tipi"}</th>
                                <th>{$_LANG.btk_yetki_type_short|default:"Yetki Tipi"}</th>
                                <th>{$_LANG.btk_creation_time|default:"Oluşturulma Zamanı"}</th>
                                <th>{$_LANG.btk_btk_ftp_status|default:"BTK FTP Durumu"}</th>
                                <th>{$_LANG.btk_backup_ftp_status|default:"Yedek FTP Durumu"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foreach from=$lastGeneratedFiles item=file}
                                <tr>
                                    <td>{$file->dosya_tam_adi}</td>
                                    <td>{$file->dosya_tipi|replace:'_':' '|ucwords}</td>
                                    <td>{$file->yetki_tipi_kodu}</td>
                                    <td>{$file->olusturulma_zamani|btk_datetime_format}</td>
                                    <td>
                                        <span class="label label-{if $file->btk_ftp_yukleme_durumu == 'Basarili'}success{elseif $file->btk_ftp_yukleme_durumu == 'Basarisiz'}danger{elseif $file->btk_ftp_yukleme_durumu == 'Bekliyor'}warning{else}default{/if}">
                                            {$file->btk_ftp_yukleme_durumu}
                                        </span>
                                        {if $file->btk_ftp_hata_mesaji}
                                            <i class="fas fa-info-circle text-danger" data-toggle="tooltip" data-placement="top" title="{$file->btk_ftp_hata_mesaji|escape:'html'}"></i>
                                        {/if}
                                    </td>
                                    <td>
                                        {if $file->yedek_ftp_yukleme_durumu != 'Kullanilmiyor' && $file->yedek_ftp_yukleme_durumu != 'Not_used'}
                                            <span class="label label-{if $file->yedek_ftp_yukleme_durumu == 'Basarili'}success{elseif $file->yedek_ftp_yukleme_durumu == 'Basarisiz'}danger{elseif $file->yedek_ftp_yukleme_durumu == 'Bekliyor'}warning{else}default{/if}">
                                                {$file->yedek_ftp_yukleme_durumu}
                                            </span>
                                             {if $file->yedek_ftp_hata_mesaji}
                                                <i class="fas fa-info-circle text-danger" data-toggle="tooltip" data-placement="top" title="{$file->yedek_ftp_hata_mesaji|escape:'html'}"></i>
                                            {/if}
                                        {else}
                                            <span class="text-muted">{$_LANG.btk_not_in_use|default:"Kullanılmıyor"}</span>
                                        {/if}
                                    </td>
                                </tr>
                            {/foreach}
                        </tbody>
                    </table>
                </div>
            {else}
                <p class="text-center">{$_LANG.btk_no_reports_generated_yet|default:"Henüz oluşturulmuş bir rapor dosyası bulunmamaktadır."}</p>
            {/if}
        </div>
    </div>

    <div class="panel panel-default">
         <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-broadcast-tower"></i> {$_LANG.btk_ftp_connection_status_title|default:"FTP Bağlantı Durumu"}</h3>
        </div>
        <div class="panel-body">
            {if $ftpCheckResult}
                <p><strong>{$_LANG.btk_main_btk_ftp_server|default:"Ana BTK FTP Sunucusu"}:</strong>
                    {if $ftpCheckResult.btk_ftp.status == 'success'}
                        <span class="label label-success"><i class="fas fa-check-circle"></i> {$_LANG.btk_connection_successful|default:"Bağlantı Başarılı"}</span> {if $ftpCheckResult.btk_ftp.message && $ftpCheckResult.btk_ftp.message != 'Bağlantı başarılı.'}({$ftpCheckResult.btk_ftp.message}){/if}
                    {else}
                        <span class="label label-danger"><i class="fas fa-times-circle"></i> {$_LANG.btk_connection_failed|default:"Bağlantı Başarısız"}</span> ({$ftpCheckResult.btk_ftp.message})
                    {/if}
                </p>
                {if $use_yedek_ftp == '1'}
                <p><strong>{$_LANG.btk_backup_ftp_server|default:"Yedek FTP Sunucusu"}:</strong>
                    {if $ftpCheckResult.yedek_ftp.status == 'success'}
                        <span class="label label-success"><i class="fas fa-check-circle"></i> {$_LANG.btk_connection_successful|default:"Bağlantı Başarılı"}</span> {if $ftpCheckResult.yedek_ftp.message && $ftpCheckResult.yedek_ftp.message != 'Bağlantı başarılı.'}({$ftpCheckResult.yedek_ftp.message}){/if}
                    {else}
                        <span class="label label-danger"><i class="fas fa-times-circle"></i> {$_LANG.btk_connection_failed|default:"Bağlantı Başarısız"}</span> ({$ftpCheckResult.yedek_ftp.message})
                    {/if}
                </p>
                {else}
                 <p><strong>{$_LANG.btk_backup_ftp_server|default:"Yedek FTP Sunucusu"}:</strong> <span class="text-muted">{$_LANG.btk_not_in_use|default:"Kullanılmıyor"}</span></p>
                {/if}
                 <p><small><a href="{$modulelink}&action=config#ftpAyarlari">{$_LANG.btk_configure_settings_link|default:"FTP Ayarlarını Düzenle"}</a></small></p>
            {else}
                <p class="text-center">{$_LANG.btk_ftp_settings_not_configured|default:"FTP ayarları henüz yapılandırılmamış veya test edilemedi."} <a href="{$modulelink}&action=config#ftpAyarlari">{$_LANG.btk_configure_settings_link|default:"Ayarları Yapılandır"}</a></p>
            {/if}
        </div>
    </div>

    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-info-circle"></i> {$_LANG.btk_module_info_help_title|default:"Modül Bilgileri ve Yardım"}</h3>
        </div>
        <div class="panel-body">
            <p>{$_LANG.btk_module_info_p1|default:"Bu modül, BTK'nın yasal zorunlulukları gereği periyodik olarak iletilmesi gereken abone, hareket ve personel bilgilerini raporlamak üzere geliştirilmiştir."}</p>
            <ul>
                <li>{$_LANG.btk_module_info_li_settings|default:"<strong>Ayarlar:</strong> Modülün çalışması için gerekli operatör, FTP ve zamanlama ayarlarını yapılandırın."}</li>
                <li><strong><a href="{$modulelink}&action=productgroupmap">{$_LANG.btk_product_group_mapping_title|default:"Ürün Grubu Eşleştirme"}</a>:</strong> {$_LANG.btk_module_info_li_productmap|default:"WHMCS ürün gruplarınızı BTK Yetki ve Hizmet Tipleri ile eşleştirin."}</li>
                <li>{$_LANG.btk_module_info_li_personnel|default:"<strong>Personel Yönetimi:</strong> BTK'ya bildirilecek personel listenizi güncel tutun."}</li>
                <li>{$_LANG.btk_module_info_li_manual_report|default:"<strong>Manuel Rapor Oluşturma:</strong> İhtiyaç duyduğunuzda raporları elle oluşturup FTP'ye gönderebilirsiniz."}</li>
                <li>{$_LANG.btk_module_info_li_logs|default:"<strong>İşlem Logları:</strong> Modülün yaptığı tüm işlemleri (rapor oluşturma, FTP yükleme, hatalar vb.) buradan takip edebilirsiniz."}</li>
            </ul>
            <p>{$_LANG.btk_module_info_docs_link|default:"Detaylı bilgi ve yardım için modül dokümantasyonuna başvurunuz."}</p>
        </div>
    </div>
</div>
<script type="text/javascript">
$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});
</script>