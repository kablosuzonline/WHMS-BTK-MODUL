{* modules/addons/btkreports/templates/admin/personnel.tpl *}
{* BTK Personel Yönetimi Sayfası *}

{if $moduleMessage}
    <div class="alert alert-{if $moduleMessage.type == 'success'}success{else}danger{/if}" role="alert">
        {$moduleMessage.message}
    </div>
{/if}

{if $action_result_personnel}
    <div class="alert alert-{if $action_result_personnel.status == 'success'}success{else}danger{/if}">
        {$action_result_personnel.message}
    </div>
{/if}

{if $smarty.get.action_personnel == 'edit' || $smarty.get.action_personnel == 'add'}
    {* --- PERSONEL EKLEME/DÜZENLEME FORMU --- *}
    <h3>{if $smarty.get.edit_id}{$lang.edit_personnel_title}{else}{$lang.add_personnel_title}{/if}</h3>
    <form method="post" action="{$modulelink}&action=personnel&sub_action=save" class="form-horizontal" id="personnelForm">
        <input type="hidden" name="token" value="{$csrfToken}">
        <input type="hidden" name="personnel_id" value="{$edit_personnel_data.id|default:''}">

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">{$lang.personnel_form_operator_title_static}</h3>
            </div>
            <div class="panel-body">
                <p><strong>{$settings.operator_title_official|escape:'html'|default:$lang.operator_title_official_desc}</strong></p>
                <small class="text-muted">{$lang.personnel_form_operator_title_static_desc}</small>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Temel Personel Bilgileri</h3>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="whmcs_admin_id" class="col-sm-4 control-label">{$lang.personnel_form_whmcs_admin}</label>
                            <div class="col-sm-8">
                                <select name="whmcs_admin_id" id="whmcs_admin_id" class="form-control">
                                    <option value="0">{$lang.personnel_form_select_admin}</option>
                                    {foreach from=$whmcs_admins_for_select item=admin}
                                        <option value="{$admin.id}" {if $edit_personnel_data.admin_id == $admin.id}selected{/if}>
                                            {$admin.firstname} {$admin.lastname} ({$admin.username})
                                        </option>
                                    {/foreach}
                                </select>
                                <span class="help-block">{$lang.personnel_form_whmcs_admin_desc}</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="adi" class="col-sm-4 control-label">{$lang.personnel_form_name}*</label>
                            <div class="col-sm-8">
                                <input type="text" name="adi" id="adi" value="{$edit_personnel_data.adi|default:$smarty.post.adi|escape:'html'}" class="form-control" required>
                                <span class="help-block">{$lang.personnel_form_name_desc}</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="soyadi" class="col-sm-4 control-label">{$lang.personnel_form_surname}*</label>
                            <div class="col-sm-8">
                                <input type="text" name="soyadi" id="soyadi" value="{$edit_personnel_data.soyadi|default:$smarty.post.soyadi|escape:'html'}" class="form-control" required>
                                <span class="help-block">{$lang.personnel_form_surname_desc}</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="tc_kimlik_no" class="col-sm-4 control-label">{$lang.personnel_form_tckn}</label>
                            <div class="col-sm-7">
                                <input type="text" name="tc_kimlik_no" id="tc_kimlik_no" value="{$edit_personnel_data.tc_kimlik_no|default:$smarty.post.tc_kimlik_no|escape:'html'}" class="form-control" maxlength="11" pattern="[0-9]{11}">
                                <span class="help-block">{$lang.personnel_form_tckn_desc}</span>
                            </div>
                            <div class="col-sm-1" id="tckn_status_icon_personnel" style="padding-top: 8px;">
                                {if $edit_personnel_data.tckn_dogrulama_durumu === true}
                                    <i class="fas fa-check-circle text-success" data-toggle="tooltip" title="{$lang.personnel_tckn_verified}"></i>
                                {elseif $edit_personnel_data.tckn_dogrulama_durumu === false && $edit_personnel_data.tc_kimlik_no != ''}
                                    <i class="fas fa-times-circle text-danger" data-toggle="tooltip" title="{$lang.personnel_tckn_not_verified}"></i>
                                {else}
                                    {* <i class="fas fa-question-circle text-muted" data-toggle="tooltip" title="{$lang.personnel_tckn_pending_verification}"></i> *}
                                {/if}
                            </div>
                        </div>
                         <div class="form-group">
                            <label for="uyruk_ref_id" class="col-sm-4 control-label">{$lang.personnel_form_nationality}*</label>
                            <div class="col-sm-8">
                                <select name="uyruk_ref_id" id="uyruk_ref_id" class="form-control" required>
                                    <option value="">{$lang.select_option}</option>
                                    {foreach from=$nationalities_for_select item=nationality}
                                        <option value="{$nationality.id}" {if $edit_personnel_data.uyruk_ref_id == $nationality.id || $smarty.post.uyruk_ref_id == $nationality.id}selected{/if} data-iso3="{$nationality.iso_3166_1_alpha_3}">
                                            {$nationality.ulke_adi_tr|escape:'html'}
                                        </option>
                                    {/foreach}
                                </select>
                                 <span class="help-block">{$lang.personnel_form_nationality_desc}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="unvan_gorev" class="col-sm-4 control-label">{$lang.personnel_form_title_ görev}*</label>
                            <div class="col-sm-8">
                                <input type="text" name="unvan_gorev" id="unvan_gorev" value="{$edit_personnel_data.unvan_gorev|default:$smarty.post.unvan_gorev|escape:'html'}" class="form-control" required>
                                <span class="help-block">{$lang.personnel_form_title_ görev_desc}</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="calistigi_birim" class="col-sm-4 control-label">{$lang.personnel_form_department}*</label>
                            <div class="col-sm-8">
                                <input type="text" name="calistigi_birim" id="calistigi_birim" value="{$edit_personnel_data.calistigi_birim|default:$smarty.post.calistigi_birim|escape:'html'}" class="form-control" required>
                                 <span class="help-block">{$lang.personnel_form_department_desc}</span>
                            </div>
                        </div>
                         <div class="form-group">
                            <label for="mobil_telefonu" class="col-sm-4 control-label">{$lang.personnel_form_mobile_phone}*</label>
                            <div class="col-sm-8">
                                <input type="text" name="mobil_telefonu" id="mobil_telefonu" value="{$edit_personnel_data.mobil_telefonu|default:$smarty.post.mobil_telefonu|escape:'html'}" class="form-control" placeholder="5xxxxxxxxx" maxlength="10" pattern="[0-9]{10}" required>
                                 <span class="help-block">{$lang.personnel_form_mobile_phone_desc}</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="sabit_telefonu" class="col-sm-4 control-label">{$lang.personnel_form_fixed_phone}</label>
                            <div class="col-sm-8">
                                <input type="text" name="sabit_telefonu" id="sabit_telefonu" value="{$edit_personnel_data.sabit_telefonu|default:$smarty.post.sabit_telefonu|escape:'html'}" class="form-control" placeholder="212xxxxxxx" maxlength="10" pattern="[0-9]{10}">
                                <span class="help-block">{$lang.personnel_form_fixed_phone_desc}</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="eposta_adresi" class="col-sm-4 control-label">{$lang.personnel_form_email}*</label>
                            <div class="col-sm-8">
                                <input type="email" name="eposta_adresi" id="eposta_adresi" value="{$edit_personnel_data.eposta_adresi|default:$smarty.post.eposta_adresi|escape:'html'}" class="form-control" required>
                                <span class="help-block">{$lang.personnel_form_email_desc}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel panel-info">
            <div class="panel-heading">
                <h3 class="panel-title">{$lang.personnel_form_ik_section_title}</h3>
            </div>
            <div class="panel-body">
                 <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="ise_baslama_tarihi" class="col-sm-4 control-label">{$lang.personnel_form_start_date_ik}</label>
                            <div class="col-sm-8">
                                <input type="text" name="ise_baslama_tarihi" id="ise_baslama_tarihi" value="{$edit_personnel_data.ise_baslama_tarihi|default:$smarty.post.ise_baslama_tarihi|date_format:"%Y-%m-%d"}" class="form-control date-picker">
                                 <span class="help-block">{$lang.personnel_form_start_date_ik_desc}</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="isten_ayrilma_tarihi" class="col-sm-4 control-label">{$lang.personnel_form_end_date_ik}</label>
                            <div class="col-sm-8">
                                <input type="text" name="isten_ayrilma_tarihi" id="isten_ayrilma_tarihi" value="{$edit_personnel_data.isten_ayrilma_tarihi|default:$smarty.post.isten_ayrilma_tarihi|date_format:"%Y-%m-%d"}" class="form-control date-picker">
                                <span class="help-block">{$lang.personnel_form_end_date_ik_desc}</span>
                            </div>
                        </div>
                         <div class="form-group">
                            <label for="is_birakma_nedeni" class="col-sm-4 control-label">{$lang.personnel_form_reason_for_leaving_ik}</label>
                            <div class="col-sm-8">
                                <textarea name="is_birakma_nedeni" id="is_birakma_nedeni" class="form-control" rows="3">{$edit_personnel_data.is_birakma_nedeni|default:$smarty.post.is_birakma_nedeni|escape:'html'}</textarea>
                                <span class="help-block">{$lang.personnel_form_reason_for_leaving_ik_desc}</span>
                            </div>
                        </div>
                    </div>
                     <div class="col-md-6">
                        <div class="form-group">
                            <label for="ev_adresi_id_text" class="col-sm-4 control-label">{$lang.personnel_form_home_address}</label>
                            <div class="col-sm-8">
                                 {* Adres seçimi için ayrı bir modal veya bölüm gerekebilir. Şimdilik basit bir text alanı. *}
                                <textarea name="ev_adresi_text" id="ev_adresi_id_text" class="form-control" rows="2" placeholder="İl, İlçe, Mahalle, Açık Adres...">{$edit_personnel_data.ev_adresi_text|default:$smarty.post.ev_adresi_text|escape:'html'}</textarea>
                                <span class="help-block">{$lang.personnel_form_home_address_desc}</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="acil_durum_kontak_adi" class="col-sm-4 control-label">{$lang.personnel_form_emergency_contact_name}</label>
                            <div class="col-sm-8">
                                <input type="text" name="acil_durum_kontak_adi" id="acil_durum_kontak_adi" value="{$edit_personnel_data.acil_durum_kontak_adi|default:$smarty.post.acil_durum_kontak_adi|escape:'html'}" class="form-control">
                                <span class="help-block">{$lang.personnel_form_emergency_contact_name_desc}</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="acil_durum_kontak_telefonu" class="col-sm-4 control-label">{$lang.personnel_form_emergency_contact_phone}</label>
                            <div class="col-sm-8">
                                <input type="text" name="acil_durum_kontak_telefonu" id="acil_durum_kontak_telefonu" value="{$edit_personnel_data.acil_durum_kontak_telefonu|default:$smarty.post.acil_durum_kontak_telefonu|escape:'html'}" class="form-control" placeholder="5xxxxxxxxx" maxlength="10" pattern="[0-9]{10}">
                                <span class="help-block">{$lang.personnel_form_emergency_contact_phone_desc}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel panel-warning">
            <div class="panel-heading">
                <h3 class="panel-title">{$lang.personnel_form_btk_report_settings_title}</h3>
            </div>
            <div class="panel-body">
                 <div class="form-group">
                    <label for="btk_listesine_eklensin" class="col-sm-4 control-label">{$lang.personnel_form_include_in_btk_report} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.tooltip_personnel_btk_dahil|escape:'html'}"></i></label>
                    <div class="col-sm-8">
                        <label class="toggle-switch">
                            <input type="checkbox" name="btk_listesine_eklensin" id="btk_listesine_eklensin" value="1" {if $edit_personnel_data.btk_listesine_eklensin|default:true}checked{/if}>
                            <span class="slider round"></span>
                        </label>
                        <span class="help-block">{$lang.personnel_form_include_in_btk_report_desc}</span>
                    </div>
                </div>
                <div class="form-group">
                    <label for="is_active" class="col-sm-4 control-label">{$lang.personnel_form_is_active_ik}</label>
                    <div class="col-sm-8">
                        <label class="toggle-switch">
                            <input type="checkbox" name="is_active" id="is_active" value="1" {if $edit_personnel_data.is_active|default:true}checked{/if}>
                            <span class="slider round"></span>
                        </label>
                         <span class="help-block">{$lang.personnel_form_is_active_ik_desc}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group text-center">
            <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-save"></i> {$lang.save_changes}</button>
            <a href="{$modulelink}&action=personnel" class="btn btn-default btn-lg">{$lang.cancel}</a>
        </div>
    </form>

{else}
    {* --- PERSONEL LİSTELEME BÖLÜMÜ --- *}
    <div class="row" style="margin-bottom:15px;">
        <div class="col-md-6">
            <a href="{$modulelink}&action=personnel&sub_action=add" class="btn btn-success"><i class="fas fa-plus"></i> {$lang.add_manual_personnel}</a>
            <button type="button" class="btn btn-info" id="syncWhmcsAdminsBtn" data-loading-text="<i class='fas fa-spinner fa-spin'></i> {$lang.please_wait|escape:'html'}">
                <i class="fas fa-sync-alt"></i> {$lang.sync_with_whmcs_admins}
            </button>
        </div>
        <div class="col-md-6 text-right">
             <button type="button" class="btn btn-default" id="exportPersonnelExcelBtn" data-loading-text="<i class='fas fa-spinner fa-spin'></i> {$lang.please_wait|escape:'html'}">
                <i class="fas fa-file-excel"></i> {$lang.export_to_excel}
            </button>
        </div>
    </div>

    <form method="get" action="{$modulelink}">
        <input type="hidden" name="module" value="btkreports">
        <input type="hidden" name="action" value="personnel">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fas fa-filter"></i> {$lang.filter} {$lang.personnel_list}</h3>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-3">
                        <input type="text" name="search_name" value="{$smarty.get.search_name|escape:'html'}" placeholder="{$lang.personnel_name} / {$lang.personnel_surname}" class="form-control">
                    </div>
                    <div class="col-md-3">
                        <input type="text" name="search_tckn" value="{$smarty.get.search_tckn|escape:'html'}" placeholder="{$lang.personnel_tckn}" class="form-control">
                    </div>
                    <div class="col-md-2">
                        <select name="search_btk_include" class="form-control">
                            <option value="">-- {$lang.personnel_include_in_btk_report} ({$lang.all}) --</option>
                            <option value="1" {if $smarty.get.search_btk_include == '1'}selected{/if}>{$lang.yes}</option>
                            <option value="0" {if $smarty.get.search_btk_include == '0'}selected{/if}>{$lang.no}</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                         <select name="search_active" class="form-control">
                            <option value="">-- {$lang.personnel_is_active_ik} ({$lang.all}) --</option>
                            <option value="1" {if $smarty.get.search_active|default:'1' == '1'}selected{/if}>{$lang.active}</option>
                            <option value="0" {if $smarty.get.search_active == '0'}selected{/if}>{$lang.inactive}</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <button type="submit" class="btn btn-primary btn-block"><i class="fas fa-search"></i> {$lang.search}</button>
                        <a href="{$modulelink}&action=personnel" class="btn btn-default btn-block btn-sm" style="margin-top:5px;">{$lang.clear_filter}</a>
                    </div>
                </div>
            </div>
        </div>
    </form>

    <div class="table-responsive">
        <table class="table table-striped table-bordered table-hover" id="personnelTable">
            <thead>
                <tr>
                    <th>{$lang.personnel_id}</th>
                    <th>{$lang.personnel_name}</th>
                    <th>{$lang.personnel_surname}</th>
                    <th>{$lang.personnel_tckn}</th>
                    <th>{$lang.personnel_title_ görev}</th>
                    <th>{$lang.personnel_department}</th>
                    <th>{$lang.personnel_mobile_phone}</th>
                    <th>{$lang.personnel_email}</th>
                    <th class="text-center">{$lang.personnel_include_in_btk_report}</th>
                    <th class="text-center">{$lang.personnel_is_active_ik}</th>
                    <th width="100">{$lang.personnel_actions}</th>
                </tr>
            </thead>
            <tbody>
                {if $personnel_list}
                    {foreach from=$personnel_list item=person}
                        <tr>
                            <td>{$person.id}</td>
                            <td>{$person.adi|escape:'html'}</td>
                            <td>{$person.soyadi|escape:'html'}</td>
                            <td>
                                {$person.tc_kimlik_no|escape:'html'}
                                {if $person.tc_kimlik_no}
                                    {if $person.tckn_dogrulama_durumu === true}
                                        <i class="fas fa-check-circle text-success" data-toggle="tooltip" title="{$lang.personnel_tckn_verified}"></i>
                                    {elseif $person.tckn_dogrulama_durumu === false}
                                        <i class="fas fa-times-circle text-danger" data-toggle="tooltip" title="{$lang.personnel_tckn_not_verified}"></i>
                                    {else}
                                        <i class="fas fa-question-circle text-muted" data-toggle="tooltip" title="{$lang.personnel_tckn_pending_verification}"></i>
                                    {/if}
                                {/if}
                            </td>
                            <td>{$person.unvan_gorev|escape:'html'}</td>
                            <td>{$person.calistigi_birim|escape:'html'}</td>
                            <td>{$person.mobil_telefonu|escape:'html'}</td>
                            <td>{$person.eposta_adresi|escape:'html'}</td>
                            <td class="text-center">
                                {if $person.btk_listesine_eklensin}
                                    <span class="label label-success">{$lang.yes}</span>
                                {else}
                                    <span class="label label-danger">{$lang.no}</span>
                                {/if}
                            </td>
                            <td class="text-center">
                                {if $person.is_active}
                                    <span class="label label-success">{$lang.active}</span>
                                {else}
                                    <span class="label label-default">{$lang.inactive}</span>
                                {/if}
                            </td>
                            <td>
                                <a href="{$modulelink}&action=personnel&sub_action=edit&edit_id={$person.id}" class="btn btn-xs btn-info" data-toggle="tooltip" title="{$lang.edit}"><i class="fas fa-pencil-alt"></i></a>
                                <a href="{$modulelink}&action=personnel&sub_action=delete&delete_id={$person.id}&token={$csrfToken}" class="btn btn-xs btn-danger" onclick="return confirm('{$lang.confirm_delete_text|escape:'javascript'}');" data-toggle="tooltip" title="{$lang.delete}"><i class="fas fa-trash"></i></a>
                            </td>
                        </tr>
                    {/foreach}
                {else}
                    <tr>
                        <td colspan="11" class="text-center">{$lang.no_records_found}</td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>

    {* Sayfalama (Pagination) - Eğer PHP tarafında sayfalama varsa *}
    {if $pagination_output}
        <div class="text-center">
            {$pagination_output}
        </div>
    {/if}

{/if} {* Edit/Add veya Listeleme Sonu *}

<script type="text/javascript">
$(document).ready(function() {
    // WHMCS Adminlerinden Senkronize Et butonu
    $('#syncWhmcsAdminsBtn').click(function() {
        var btn = $(this);
        if (confirm('{$lang.sync_confirm_message|escape:'javascript'}')) {
            btn.button('loading');
            window.location.href = '{$modulelink}&action=personnel&sub_action=sync_admins&token={$csrfToken}';
        }
    });

    // Excel'e Aktar butonu
    $('#exportPersonnelExcelBtn').click(function() {
        var btn = $(this);
        // Gerekirse filtre parametrelerini de ekleyerek yönlendirme
        var currentUrlParams = new URLSearchParams(window.location.search);
        var exportUrl = '{$modulelink}&action=personnel&sub_action=export_excel&token={$csrfToken}';
        
        // Filtreleri de export linkine ekleyelim
        if (currentUrlParams.has('search_name')) exportUrl += '&search_name=' + encodeURIComponent(currentUrlParams.get('search_name'));
        if (currentUrlParams.has('search_tckn')) exportUrl += '&search_tckn=' + encodeURIComponent(currentUrlParams.get('search_tckn'));
        if (currentUrlParams.has('search_btk_include')) exportUrl += '&search_btk_include=' + encodeURIComponent(currentUrlParams.get('search_btk_include'));
        if (currentUrlParams.has('search_active')) exportUrl += '&search_active=' + encodeURIComponent(currentUrlParams.get('search_active'));

        btn.button('loading');
        // İndirme işlemi için doğrudan yönlendirme, AJAX gerekmeyebilir.
        // Ancak büyük dosyalarda kullanıcıya bilgi vermek için AJAX ile başlatılıp sonra dosya indirme tetiklenebilir.
        window.location.href = exportUrl;
        // Butonu kısa bir süre sonra normale döndür, çünkü dosya indirme işlemi tarayıcıda başlar.
        setTimeout(function(){ btn.button('reset'); }, 2000);
    });

    // Tarih seçicileri etkinleştir (WHMCS'in kendi datepicker'ını kullanabiliriz veya Bootstrap datepicker)
    // WHMCS genellikle jQuery UI Datepicker kullanır.
    if ($.fn.datepicker && typeof $.datepicker.regional['tr'] !== 'undefined') {
        $('.date-picker').datepicker({
            dateFormat: 'yy-mm-dd', // YYYY-AA-GG formatı
            monthNames: $.datepicker.regional['tr'].monthNames,
            dayNamesMin: $.datepicker.regional['tr'].dayNamesMin,
            firstDay: 1, // Pazartesi
            changeMonth: true,
            changeYear: true,
            yearRange: "-100:+10" // Geçmiş 100 yıl, gelecek 10 yıl
        });
    } else {
        // Fallback veya uyarı
        console.warn("jQuery UI Datepicker veya TR regional bulunamadı. Tarih alanları metin olarak kalacak.");
    }
});
</script>