{* modules/addons/btkreports/templates/admin/personel.tpl (v1.0.22) *}

{if $action eq 'personelList' || $action eq 'syncPersonelSuccess' || $action eq 'syncPersonelError' || $action eq 'deletePersonelSuccess' || $action eq 'deletePersonelError'}
    {* Personel Listeleme Sayfası *}
    <div class="btk-header-container" style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
        <div class="btk-module-title">
            <i class="fas fa-users-cog" style="font-size: 1.5em; margin-right: 8px; vertical-align: middle;"></i>
            <h2 style="display: inline-block; vertical-align: middle; margin-top: 0; margin-bottom: 0;">{$_ADDONLANG.btkreports_tab_personnel}</h2>
        </div>
        <div class="context-buttons">
            <a href="{$modulelink}&action=syncPersonel&token={$csrfToken}" id="syncPersonelButton" class="btn btn-info btn-sm" data-loading-text="<i class='fas fa-sync fa-spin'></i> {$_ADDONLANG.btkreports_personnel_sync_inprogress|default:'Senkronize Ediliyor...'}">
                <i class="fas fa-sync"></i> {$_ADDONLANG.btkreports_personnel_sync_from_admins|default:'WHMCS Yöneticilerinden Senkronize Et'}
            </a>
            <a href="{$modulelink}&action=personelEdit" class="btn btn-success btn-sm">
                <i class="fas fa-plus-circle"></i> {$_ADDONLANG.btkreports_personnel_add_new_manual|default:'Manuel Yeni Personel Ekle'}
            </a>
        </div>
    </div>

    {if isset($syncResultMsg)}
        <div class="alert {if $syncSuccess}alert-success{else}alert-danger{/if} text-center alert-dismissible" role="alert">
             <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            {$syncResultMsg}
        </div>
    {/if}
    {if isset($deleteResultMsg)}
        <div class="alert {if $deleteSuccess}alert-success{else}alert-danger{/if} text-center alert-dismissible" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            {$deleteResultMsg}
        </div>
    {/if}
    {if isset($saveResultSuccess) && $saveResultSuccess}
         <div class="alert alert-success text-center alert-dismissible" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            {$_ADDONLANG.btkreports_personnel_save_success}
        </div>
    {/if}
     {if isset($saveResultError) && $saveResultError}
         <div class="alert alert-danger text-center alert-dismissible" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            {$saveResultError} {* PHP'den gelen tam hata mesajı *}
        </div>
    {/if}


    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-list"></i> {$_ADDONLANG.btkreports_personnel_list_title|default:'Personel Listesi'}</h3>
        </div>
        <div class="panel-body">
            <p>{$_ADDONLANG.btkreports_personnel_list_desc|default:'BTK raporlaması için yönetilecek personel listesi aşağıdadır. WHMCS yöneticileri ile senkronize edilir ve ek bilgiler manuel olarak girilebilir.'}</p>

            {if $personelListesi && count($personelListesi) > 0}
                <div class="table-responsive">
                    <table class="table datatable table-striped" width="100%" id="tablePersonelList">
                        <thead>
                            <tr>
                                <th>{$_ADDONLANG.btkreports_personnel_admin_id|default:'Admin ID'}</th>
                                <th>{$_ADDONLANG.btkreports_personnel_adi|default:'Adı'}</th>
                                <th>{$_ADDONLANG.btkreports_personnel_soyadi|default:'Soyadı'}</th>
                                <th>{$_ADDONLANG.btkreports_personnel_eposta|default:'E-posta'}</th>
                                <th>{$_ADDONLANG.btkreports_personnel_tckn|default:'TCKN'}</th>
                                <th>{$_ADDONLANG.btkreports_personnel_unvan|default:'Ünvan (BTK)'}</th>
                                <th>{$_ADDONLANG.btkreports_personnel_calistigi_birim|default:'Birim (BTK)'}</th>
                                <th class="text-center">{$_ADDONLANG.btkreports_personnel_btk_listesine_eklensin|default:'BTK Raporuna Dahil'}</th>
                                <th class="text-center" style="width: 100px;">{$_ADDONLANG.btkreports_actions|default:'İşlemler'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foreach from=$personelListesi item=personel}
                                <tr>
                                    <td>{$personel->admin_id|default:$_ADDONLANG.btkreports_personnel_manual_entry|default:'Manuel'}</td>
                                    <td>{$personel->adi|escape:'html'}</td>
                                    <td>{$personel->soyadi|escape:'html'}</td>
                                    <td>{$personel->e_posta_adresi|escape:'html'}</td>
                                    <td>{$personel->tc_kimlik_no|default:("<span class='text-muted'>N/A</span>")}</td>
                                    <td>{$personel->unvan|default:("<span class='text-muted'>N/A</span>")|escape:'html'}</td>
                                    <td>{$personel->calistigi_birim|default:("<span class='text-muted'>N/A</span>")|escape:'html'}</td>
                                    <td class="text-center">
                                        {if $personel->btk_listesine_eklensin}
                                            <span class="label label-success">{$_ADDONLANG.btkreports_yes|default:'Evet'}</span>
                                        {else}
                                            <span class="label label-danger">{$_ADDONLANG.btkreports_no|default:'Hayır'}</span>
                                        {/if}
                                    </td>
                                    <td class="text-center">
                                        <a href="{$modulelink}&action=personelEdit&pid={$personel->id}" class="btn btn-xs btn-info" title="{$_ADDONLANG.btkreports_edit}"><i class="fas fa-pencil-alt"></i></a>
                                        {if !$personel->admin_id} {* Sadece manuel eklenenler için silme butonu *}
                                            <a href="{$modulelink}&action=deletePersonel&pid={$personel->id}&token={$csrfToken}" 
                                               class="btn btn-xs btn-danger" 
                                               onclick="return confirm('{$_ADDONLANG.btkreports_personnel_delete_confirm_manual|escape:'javascript'}');" 
                                               title="{$_ADDONLANG.btkreports_delete}">
                                               <i class="fas fa-trash"></i>
                                            </a>
                                        {/if}
                                    </td>
                                </tr>
                            {/foreach}
                        </tbody>
                    </table>
                </div>
            {else}
                <div class="alert alert-info text-center">
                    <i class="fas fa-info-circle"></i> {$_ADDONLANG.btkreports_personnel_no_records|default:'Yönetilecek personel kaydı bulunamadı. WHMCS yöneticileri ile senkronize etmeyi deneyin veya manuel yeni personel ekleyin.'}
                </div>
            {/if}
        </div>
    </div>
    <hr>
    <div class="panel panel-info">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-file-excel"></i> {$_ADDONLANG.btkreports_personnel_report_generation|default:'Personel Raporu Oluşturma'}</h3>
        </div>
        <div class="panel-body text-center">
            <p>{$_ADDONLANG.btkreports_personnel_manual_info|default:'Personel listesi her yılın Haziran ve Aralık aylarının son günü otomatik olarak FTP\'ye yüklenir. Buradan manuel olarak da tetikleyebilirsiniz.'}</p>
            <button type="button" id="generatePersonelReportButton" class="btn btn-success btn-lg" data-loading-text="<i class='fas fa-spinner fa-spin'></i> {$_ADDONLANG.btkreports_generating_report|default:'Rapor Oluşturuluyor...'}">
                <i class="fas fa-cogs"></i> {$_ADDONLANG.btkreports_personnel_generate_excel_button|default:'Personel Listesi Excel Oluştur ve FTP\'ye Yükle'}
            </button>
            <div id="generatePersonelReportStatus" style="margin-top:15px;"></div>
        </div>
    </div>

{elseif $action == 'personelEdit'}
    {* Personel Ekleme/Düzenleme Formu *}
    <div class="btk-header-container" style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
         <div class="btk-module-title">
            <i class="fas fa-user-edit" style="font-size: 1.5em; margin-right: 8px; vertical-align: middle;"></i>
            <h2 style="display: inline-block; vertical-align: middle; margin-top: 0; margin-bottom: 0;">
                {if isset($personelData->id) && $personelData->id}{$_ADDONLANG.btkreports_personnel_edit|default:'Personel Düzenle'}{else}{$_ADDONLANG.btkreports_personnel_add_new_manual|default:'Manuel Yeni Personel Ekle'}{/if}
                {if isset($personelData->admin_id) && $personelData->admin_id} (WHMCS Admin ID: {$personelData->admin_id}){/if}
            </h2>
        </div>
        <div class="context-buttons">
            <a href="{$modulelink}&action=personelList" class="btn btn-default btn-sm"><i class="fas fa-arrow-left"></i> {$_ADDONLANG.btkreports_go_back_to_list|default:'Personel Listesine Dön'}</a>
        </div>
    </div>

    {if isset($validation_errors) && count($validation_errors) > 0}
        <div class="alert alert-danger">
            <strong>{$_ADDONLANG.btkreports_error|default:'Hata!'}:</strong> {$_ADDONLANG.btkreports_personnel_validation_header|default:'Lütfen aşağıdaki hataları düzeltin:'}
            <ul>
                {foreach from=$validation_errors item=error}
                    <li>{$error}</li>
                {/foreach}
            </ul>
        </div>
    {/if}
    
    <form method="post" action="{$modulelink}&action=savePersonelData" class="form-horizontal" role="form">
        <input type="hidden" name="token" value="{$csrfToken}">
        <input type="hidden" name="pid" value="{$personelData->id|default:''}">
        <input type="hidden" name="admin_id_hidden" value="{$personelData->admin_id|default:''}">

        <div class="panel panel-primary">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fas fa-id-card"></i> {$_ADDONLANG.btkreports_personnel_btk_required_info|default:'BTK İçin Zorunlu Bilgiler'}</h3>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="firma_adi" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_personnel_firma_adi}</label>
                            <div class="col-sm-8">
                                <input type="text" name="firma_adi" id="firma_adi" class="form-control" value="{$personelData->firma_adi|default:$config->operator_unvani|escape:'html'}" readonly>
                                <p class="help-block">({$_ADDONLANG.btkreports_personnel_from_config|default:'Modül ayarlarındaki Operatör Unvanından alınır'})</p>
                            </div>
                        </div>
                         <div class="form-group">
                            <label for="adi" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_personnel_adi} <span class="text-danger">*</span></label>
                            <div class="col-sm-8">
                                <input type="text" name="adi" id="adi" class="form-control" value="{$personelData->adi|escape:'html'}" {if $personelData->admin_id}readonly{else}required{/if}>
                                {if $personelData->admin_id}<p class="help-block">({$_ADDONLANG.btkreports_personnel_from_whmcs|default:'WHMCS Yöneticisinden alınır'})</p>{/if}
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="soyadi" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_personnel_soyadi} <span class="text-danger">*</span></label>
                            <div class="col-sm-8">
                                <input type="text" name="soyadi" id="soyadi" class="form-control" value="{$personelData->soyadi|escape:'html'}" {if $personelData->admin_id}readonly{else}required{/if}>
                                 {if $personelData->admin_id}<p class="help-block">({$_ADDONLANG.btkreports_personnel_from_whmcs|default:'WHMCS Yöneticisinden alınır'})</p>{/if}
                            </div>
                        </div>
                         <div class="form-group">
                            <label for="e_posta_adresi" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_personnel_eposta} <span class="text-danger">*</span></label>
                            <div class="col-sm-8">
                                <input type="email" name="e_posta_adresi" id="e_posta_adresi" class="form-control" value="{$personelData->e_posta_adresi|escape:'html'}" {if $personelData->admin_id}readonly{else}required{/if}>
                                {if $personelData->admin_id}<p class="help-block">({$_ADDONLANG.btkreports_personnel_from_whmcs|default:'WHMCS Yöneticisinden alınır'})</p>{/if}
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="tc_kimlik_no_personel" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_personnel_tckn} <span class="text-danger">*</span></label>
                            <div class="col-sm-8">
                                <input type="text" name="tc_kimlik_no" id="tc_kimlik_no_personel" class="form-control" value="{$personelData->tc_kimlik_no|escape:'html'}" maxlength="11" pattern="\d{11}" title="{$_ADDONLANG.btkreports_personnel_tckn_tooltip|default:'11 haneli T.C. Kimlik Numarası'}" required>
                                 {* TODO: NVI Doğrulama butonu eklenebilir. *}
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="unvan" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_personnel_unvan} <span class="text-danger">*</span></label>
                            <div class="col-sm-8">
                                <input type="text" name="unvan" id="unvan" class="form-control" value="{$personelData->unvan|escape:'html'}" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="calistigi_birim" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_personnel_calistigi_birim} <span class="text-danger">*</span></label>
                            <div class="col-sm-8">
                                <input type="text" name="calistigi_birim" id="calistigi_birim" class="form-control" value="{$personelData->calistigi_birim|escape:'html'}" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="mobil_telefonu_personel" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_personnel_mobil_telefonu} <span class="text-danger">*</span></label>
                            <div class="col-sm-8">
                                <input type="text" name="mobil_telefonu" id="mobil_telefonu_personel" class="form-control" value="{$personelData->mobil_telefonu|escape:'html'}" placeholder="{$_ADDONLANG.btkreports_personnel_phone_placeholder|default:'5xxxxxxxxx'}" maxlength="10" pattern="\d{10}" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="sabit_telefonu_personel" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_personnel_sabit_telefonu}</label>
                            <div class="col-sm-8">
                                <input type="text" name="sabit_telefonu" id="sabit_telefonu_personel" class="form-control" value="{$personelData->sabit_telefonu|escape:'html'}" placeholder="{$_ADDONLANG.btkreports_personnel_phone_placeholder_fixed|default:'212xxxxxxx'}" maxlength="10" pattern="\d{10}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel panel-info">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fas fa-briefcase"></i> {$_ADDONLANG.btkreports_personnel_ik_info|default:'İK Bilgileri (Opsiyonel - Dahili Kullanım İçin)'}</h3>
            </div>
            <div class="panel-body">
                 <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="ise_baslama_tarihi" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_personnel_ise_baslama_tarihi}</label>
                            <div class="col-sm-8">
                                <input type="text" name="ise_baslama_tarihi" id="ise_baslama_tarihi" class="form-control date-picker" value="{$personelData->ise_baslama_tarihi|escape:'html'}" placeholder="YYYY-AA-GG">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="isten_ayrilma_tarihi" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_personnel_isten_ayrilma_tarihi}</label>
                            <div class="col-sm-8">
                                <input type="text" name="isten_ayrilma_tarihi" id="isten_ayrilma_tarihi" class="form-control date-picker" value="{$personelData->isten_ayrilma_tarihi|escape:'html'}" placeholder="YYYY-AA-GG">
                            </div>
                        </div>
                         <div class="form-group">
                            <label for="is_birakma_nedeni" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_personnel_is_birakma_nedeni}</label>
                            <div class="col-sm-8">
                                <textarea name="is_birakma_nedeni" id="is_birakma_nedeni" class="form-control" rows="3">{$personelData->is_birakma_nedeni|escape:'html'}</textarea>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="col-sm-4 control-label">{$_ADDONLANG.btkreports_personnel_ev_adresi}</label>
                            <div class="col-sm-8">
                                <p class="form-control-static">{$_ADDONLANG.btkreports_personnel_address_todo|default:'Ev adresi girişi için adres modülü entegrasyonu (client_details.tpl benzeri) eklenecektir.'}</p>
                                <input type="hidden" name="ev_adresi_id" value="{$personelData->ev_adresi_id|default:''}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="acil_durum_kisi_iletisim" class="col-sm-4 control-label">{$_ADDONLANG.btkreports_personnel_acil_durum_kisi}</label>
                            <div class="col-sm-8">
                                <textarea name="acil_durum_kisi_iletisim" id="acil_durum_kisi_iletisim" class="form-control" rows="3" placeholder="{$_ADDONLANG.btkreports_personnel_acil_durum_kisi_placeholder|default:'Ad Soyad, Telefon, Yakınlık Derecesi...'}">{$personelData->acil_durum_kisi_iletisim|escape:'html'}</textarea>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
        
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fas fa-flag"></i> {$_ADDONLANG.btkreports_personnel_report_settings|default:'BTK Rapor Ayarları'}</h3>
            </div>
            <div class="panel-body">
                <div class="form-group">
                    <label for="btk_listesine_eklensin" class="col-sm-3 control-label">{$_ADDONLANG.btkreports_personnel_btk_listesine_eklensin}</label>
                    <div class="col-sm-9">
                        <label class="checkbox-inline">
                            <input type="checkbox" name="btk_listesine_eklensin" id="btk_listesine_eklensin" value="1" {if $personelData->btk_listesine_eklensin == '1' || (!isset($personelData->id) && !$personelData->admin_id)}checked{/if}>
                        </label>
                        <p class="help-block">{$_ADDONLANG.btkreports_personnel_btk_listesine_eklensin_desc}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group text-center" style="margin-top: 20px; margin-bottom: 20px;">
            <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-save"></i> {$_ADDONLANG.btkreports_save_changes}</button>
            <a href="{$modulelink}&action=personelList" class="btn btn-default btn-lg" style="margin-left: 10px;">{$_ADDONLANG.btkreports_go_back}</a>
        </div>
    </form>

{else}
    <div class="alert alert-info text-center">
        <i class="fas fa-info-circle"></i> {$_ADDONLANG.btkreports_personnel_select_action|default:'Lütfen personel listesinden bir işlem seçin veya yeni personel ekleyin.'}
    </div>
{/if}

{* Bu script, personel.tpl'e özel JavaScript kodlarını içerir. *}
{* index.tpl'deki genel script'ten ayrı tutulabilir veya btk_admin_scripts.js'e eklenebilir. *}
<script type="text/javascript">
    $(document).ready(function() {
        // Senkronizasyon butonu
        $('#syncPersonelButton').on('click', function() {
            var btn = $(this);
            btn.button('loading'); 
            // Token'ı URL'ye eklemek GET istekleri için daha yaygındır,
            // ancak POST action'ı varsa form submit veya AJAX POST daha güvenli olabilir.
            // Şimdilik URL ile gönderiyoruz, btkreports.php'de GET ile de alınabilir.
            window.location.href = '{$modulelink}&action=syncPersonel&token={$csrfToken}';
        });

        // Personel raporu oluşturma butonu
        $('#generatePersonelReportButton').on('click', function() {
            var btn = $(this);
            var statusDiv = $('#generatePersonelReportStatus');
            btn.button('loading');
            statusDiv.html('<i class="fas fa-spinner fa-spin"></i> {$_ADDONLANG.btkreports_generating_report|escape:"javascript"}');

            $.ajax({
                url: '{$modulelink}&action=generatePersonelReport&token={$csrfToken}', // CSRF Token
                type: 'POST', 
                dataType: 'json',
                success: function(response) {
                    if (response && response.success) {
                        statusDiv.html('<div class="alert alert-success text-center"><i class="fas fa-check-circle"></i> ' + response.message + '</div>');
                    } else {
                        statusDiv.html('<div class="alert alert-danger text-center"><i class="fas fa-times-circle"></i> ' + (response.message || 'Bilinmeyen bir hata oluştu.') + '</div>');
                    }
                },
                error: function() {
                    statusDiv.html('<div class="alert alert-danger text-center"><i class="fas fa-exclamation-triangle"></i> Rapor oluşturulurken sunucu hatası oluştu.</div>');
                },
                complete: function() {
                    btn.button('reset');
                }
            });
        });

        // Tarih alanları için datepicker (WHMCS admin teması jQuery UI içeriyorsa)
        if (typeof $.fn.datepicker === 'function') {
            $('.date-picker').datepicker({
                dateFormat: 'yy-mm-dd', // WHMCS ve MySQL ile uyumlu format
                changeMonth: true,
                changeYear: true,
                yearRange: "-100:+10" // Geçmiş ve gelecek için geniş bir aralık
            });
        }
        // Sayısal alanlar için sadece sayı girişi (Personel Formu)
        $('#tc_kimlik_no_personel, #mobil_telefonu_personel, #sabit_telefonu_personel').on('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });

        // WHMCS datatable'ı tabloya uygula
        if ($.fn.dataTable) {
            $('#tablePersonelList').DataTable({
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Turkish.json" // Türkçe dil dosyası
                },
                "order": [[ 0, "desc" ]] // Varsayılan sıralama (örneğin Admin ID'ye göre)
            });
        }
    });
</script>