{* modules/addons/btkreports/templates/admin/pop_management.tpl *}
{* ISS POP Noktası Yönetimi Sayfası *}

{if $moduleMessage}
    <div class="alert alert-{if $moduleMessage.type == 'success'}success{else}danger{/if}" role="alert">
        {$moduleMessage.message}
    </div>
{/if}

{if $action_result_pop}
    <div class="alert alert-{if $action_result_pop.status == 'success'}success{else}danger{/if}">
        {$action_result_pop.message}
    </div>
{/if}

{if $smarty.get.action_pop == 'edit' || $smarty.get.action_pop == 'add'}
    {* --- POP NOKTASI EKLEME/DÜZENLEME FORMU --- *}
    <h3>{if $smarty.get.edit_id}{$lang.edit_pop_point_title}{else}{$lang.add_pop_point_title}{/if}</h3>
    <form method="post" action="{$modulelink}&action=pop_management&sub_action=save" class="form-horizontal" id="popManagementForm">
        <input type="hidden" name="token" value="{$csrfToken}">
        <input type="hidden" name="pop_id" value="{$edit_pop_data.id|default:''}">

        <div class="panel panel-default">
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="pop_adi" class="col-sm-4 control-label">{$lang.pop_form_name}*</label>
                            <div class="col-sm-8">
                                <input type="text" name="pop_adi" id="pop_adi" value="{$edit_pop_data.pop_adi|default:$smarty.post.pop_adi|escape:'html'}" class="form-control" required>
                                <span class="help-block">{$lang.pop_form_name_desc}</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="yayin_yapilan_ssid" class="col-sm-4 control-label">{$lang.pop_form_ssid}</label>
                            <div class="col-sm-8">
                                <input type="text" name="yayin_yapilan_ssid" id="yayin_yapilan_ssid" value="{$edit_pop_data.yayin_yapilan_ssid|default:$smarty.post.yayin_yapilan_ssid|escape:'html'}" class="form-control">
                                <span class="help-block">{$lang.pop_form_ssid_desc}</span>
                            </div>
                        </div>
                         <div class="form-group">
                            <label for="koordinatlar" class="col-sm-4 control-label">{$lang.pop_form_coordinates}</label>
                            <div class="col-sm-8">
                                <input type="text" name="koordinatlar" id="koordinatlar" value="{$edit_pop_data.koordinatlar|default:$smarty.post.koordinatlar|escape:'html'}" class="form-control" placeholder="örn: 41.0123,28.9765">
                                <span class="help-block">{$lang.pop_form_coordinates_desc}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="adres_il_ref_kodu_pop" class="col-sm-4 control-label">{$lang.pop_form_address_il}*</label>
                            <div class="col-sm-8">
                                <select name="adres_il_ref_kodu_pop" id="adres_il_ref_kodu_pop" class="form-control select-il" required>
                                    <option value="">{$lang.select_option}</option>
                                    {foreach from=$iller_for_select item=il}
                                        <option value="{$il.il_kodu}" {if $edit_pop_data.adres_il_ref_kodu == $il.il_kodu || $smarty.post.adres_il_ref_kodu_pop == $il.il_kodu}selected{/if}>
                                            {$il.il_adi|escape:'html'}
                                        </option>
                                    {/foreach}
                                </select>
                                <span class="help-block">{$lang.pop_form_address_il_desc}</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="adres_ilce_ref_kodu_pop" class="col-sm-4 control-label">{$lang.pop_form_address_ilce}*</label>
                            <div class="col-sm-8">
                                <select name="adres_ilce_ref_kodu_pop" id="adres_ilce_ref_kodu_pop" class="form-control select-ilce" required data-selected="{$edit_pop_data.adres_ilce_ref_kodu|default:$smarty.post.adres_ilce_ref_kodu_pop}">
                                    <option value="">{$lang.select_option}</option>
                                    {* İl seçimine göre AJAX ile doldurulacak *}
                                </select>
                                <span class="help-block">{$lang.pop_form_address_ilce_desc}</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="adres_mahalle_ref_kodu_pop" class="col-sm-4 control-label">{$lang.pop_form_address_mahalle}</label>
                            <div class="col-sm-8">
                                <select name="adres_mahalle_ref_kodu_pop" id="adres_mahalle_ref_kodu_pop" class="form-control select-mahalle" data-selected="{$edit_pop_data.adres_mahalle_ref_kodu|default:$smarty.post.adres_mahalle_ref_kodu_pop}">
                                    <option value="">{$lang.select_option}</option>
                                    {* İlçe seçimine göre AJAX ile doldurulacak *}
                                </select>
                                <span class="help-block">{$lang.pop_form_address_mahalle_desc}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="adres_acik_pop" class="col-sm-2 control-label">{$lang.pop_form_address_full}</label>
                    <div class="col-sm-10">
                        <textarea name="adres_acik_pop" id="adres_acik_pop" class="form-control" rows="3">{$edit_pop_data.adres_acik|default:$smarty.post.adres_acik_pop|escape:'html'}</textarea>
                        <span class="help-block">{$lang.pop_form_address_full_desc}</span>
                    </div>
                </div>
                 <div class="form-group">
                    <label for="aktif_pop" class="col-sm-2 control-label">{$lang.pop_form_is_active}</label>
                    <div class="col-sm-10">
                        <label class="toggle-switch">
                            <input type="checkbox" name="aktif_pop" id="aktif_pop" value="1" {if $edit_pop_data.aktif|default:true}checked{/if}>
                            <span class="slider round"></span>
                        </label>
                        <span class="help-block">{$lang.pop_form_is_active_desc}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group text-center">
            <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-save"></i> {$lang.save_changes}</button>
            <a href="{$modulelink}&action=pop_management" class="btn btn-default btn-lg">{$lang.cancel}</a>
        </div>
    </form>

{else}
    {* --- POP NOKTASI LİSTELEME BÖLÜMÜ --- *}
    <div class="row" style="margin-bottom:15px;">
        <div class="col-md-6">
            <a href="{$modulelink}&action=pop_management&sub_action=add" class="btn btn-success"><i class="fas fa-plus"></i> {$lang.add_new_pop_point}</a>
        </div>
        <div class="col-md-6 text-right">
             <button type="button" class="btn btn-default" data-toggle="modal" data-target="#importPopExcelModal">
                <i class="fas fa-file-excel"></i> {$lang.pop_import_from_excel_btn}
            </button>
             <button type="button" class="btn btn-default" id="exportPopExcelBtn" data-loading-text="<i class='fas fa-spinner fa-spin'></i> {$lang.please_wait|escape:'html'}">
                <i class="fas fa-file-excel"></i> {$lang.pop_export_to_excel_btn}
            </button>
        </div>
    </div>

    {* Excel İçe Aktarma Modal'ı *}
    <div class="modal fade" id="importPopExcelModal" tabindex="-1" role="dialog" aria-labelledby="importPopExcelModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <form method="post" action="{$modulelink}&action=pop_management&sub_action=import_excel" enctype="multipart/form-data">
                    <input type="hidden" name="token" value="{$csrfToken}">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                        <h4 class="modal-title" id="importPopExcelModalLabel">{$lang.pop_import_from_excel_btn}</h4>
                    </div>
                    <div class="modal-body">
                        <p>Lütfen POP noktası verilerini içeren Excel (.xlsx) dosyasını seçin. Dosya formatı şu sütunları içermelidir: POP Adı, SSID (Opsiyonel), İl, İlçe, Mahalle/Köy (Opsiyonel), Açık Adres (Opsiyonel), Koordinatlar (Opsiyonel), Aktif (1 veya 0).</p>
                        <div class="form-group">
                            <label for="excel_file_pop">{$lang.pop_import_select_file}</label>
                            <input type="file" name="excel_file_pop" id="excel_file_pop" class="form-control" accept=".xlsx" required>
                        </div>
                        <p><a href="{$modulePath}samples/pop_noktalari_ornek.xlsx" target="_blank">Örnek Excel Şablonunu İndir</a></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">{$lang.cancel}</button>
                        <button type="submit" class="btn btn-primary">{$lang.import_from_excel}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>


    <form method="get" action="{$modulelink}">
        <input type="hidden" name="module" value="btkreports">
        <input type="hidden" name="action" value="pop_management">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fas fa-filter"></i> {$lang.filter} {$lang.pop_point_list}</h3>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-3">
                        <input type="text" name="search_pop_name" value="{$smarty.get.search_pop_name|escape:'html'}" placeholder="{$lang.pop_name} / {$lang.pop_ssid}" class="form-control">
                    </div>
                    <div class="col-md-3">
                         <select name="search_pop_il" id="search_pop_il" class="form-control select-il">
                            <option value="">-- {$lang.pop_address_il} ({$lang.all}) --</option>
                            {foreach from=$iller_for_select item=il}
                                <option value="{$il.il_kodu}" {if $smarty.get.search_pop_il == $il.il_kodu}selected{/if}>
                                    {$il.il_adi|escape:'html'}
                                </option>
                            {/foreach}
                        </select>
                    </div>
                     <div class="col-md-3">
                        <select name="search_pop_ilce" id="search_pop_ilce" class="form-control select-ilce" data-selected="{$smarty.get.search_pop_ilce}">
                            <option value="">-- {$lang.pop_address_ilce} ({$lang.all}) --</option>
                            {* İl seçimine göre AJAX ile doldurulacak *}
                        </select>
                    </div>
                    <div class="col-md-1">
                         <select name="search_pop_active" class="form-control">
                            <option value="">{$lang.all}</option>
                            <option value="1" {if $smarty.get.search_pop_active|default:'1' == '1'}selected{/if}>{$lang.active}</option>
                            <option value="0" {if $smarty.get.search_pop_active == '0'}selected{/if}>{$lang.inactive}</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <button type="submit" class="btn btn-primary btn-block"><i class="fas fa-search"></i> {$lang.search}</button>
                         <a href="{$modulelink}&action=pop_management" class="btn btn-default btn-block btn-sm" style="margin-top:5px;">{$lang.clear_filter}</a>
                    </div>
                </div>
            </div>
        </div>
    </form>

    <div class="table-responsive">
        <table class="table table-striped table-bordered table-hover" id="popTable">
            <thead>
                <tr>
                    <th>{$lang.pop_id}</th>
                    <th>{$lang.pop_name}</th>
                    <th>{$lang.pop_ssid}</th>
                    <th>{$lang.pop_address_il}</th>
                    <th>{$lang.pop_address_ilce}</th>
                    <th>{$lang.pop_address_mahalle}</th>
                    <th class="text-center">{$lang.pop_is_active}</th>
                    <th width="100">{$lang.pop_actions}</th>
                </tr>
            </thead>
            <tbody>
                {if $pop_list}
                    {foreach from=$pop_list item=pop}
                        <tr>
                            <td>{$pop.id}</td>
                            <td>{$pop.pop_adi|escape:'html'}</td>
                            <td>{$pop.yayin_yapilan_ssid|escape:'html'}</td>
                            <td>{$pop.il_adi|default:$pop.adres_il_ref_kodu|escape:'html'}</td>
                            <td>{$pop.ilce_adi|default:$pop.adres_ilce_ref_kodu|escape:'html'}</td>
                            <td>{$pop.mahalle_adi|default:$pop.adres_mahalle_ref_kodu|escape:'html'}</td>
                            <td class="text-center">
                                {if $pop.aktif}
                                    <span class="label label-success">{$lang.yes}</span>
                                {else}
                                    <span class="label label-danger">{$lang.no}</span>
                                {/if}
                            </td>
                            <td>
                                <a href="{$modulelink}&action=pop_management&sub_action=edit&edit_id={$pop.id}" class="btn btn-xs btn-info" data-toggle="tooltip" title="{$lang.edit}"><i class="fas fa-pencil-alt"></i></a>
                                <a href="{$modulelink}&action=pop_management&sub_action=delete&delete_id={$pop.id}&token={$csrfToken}" class="btn btn-xs btn-danger" onclick="return confirm('{$lang.confirm_delete_text|escape:'javascript'}');" data-toggle="tooltip" title="{$lang.delete}"><i class="fas fa-trash"></i></a>
                            </td>
                        </tr>
                    {/foreach}
                {else}
                    <tr>
                        <td colspan="8" class="text-center">{$lang.no_records_found}</td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>

    {* Sayfalama (Pagination) - Eğer PHP tarafında sayfalama varsa *}
    {if $pagination_output_pop}
        <div class="text-center">
            {$pagination_output_pop}
        </div>
    {/if}

{/if} {* Edit/Add veya Listeleme Sonu *}

<script type="text/javascript">
$(document).ready(function() {
    // Dinamik İl-İlçe-Mahalle dropdown'ları için
    // Bu script daha önce adres yönetimi için de konuşulmuştu, merkezi bir JS dosyasına taşınabilir.
    // Şimdilik buraya ekliyorum, pop ve adresler için ortak kullanılabilir.

    function populateDropdown(sourceElementId, targetElementId, targetType, moduleLink, csrfToken, selectedValue) {
        var sourceValue = $('#' + sourceElementId).val();
        var target = $('#' + targetElementId);
        target.empty().append($('<option></option>').attr('value', '').text('{$lang.select_option|escape:"javascript"}'));

        if (sourceValue && sourceValue !== '') {
            target.prop('disabled', true).html('<option>{$lang.please_wait|escape:"javascript"}</option>');
            $.ajax({
                url: moduleLink + '&action=get_address_data&ajax=1', // Bu action btkreports.php'de oluşturulacak
                type: 'POST',
                data: {
                    type: targetType, // 'ilce' or 'mahalle'
                    parent_id: sourceValue,
                    token: csrfToken
                },
                dataType: 'json',
                success: function(data) {
                    target.empty().append($('<option></option>').attr('value', '').text('{$lang.select_option|escape:"javascript"}'));
                    if (data && data.success && data.items) {
                        $.each(data.items, function(key, entry) {
                            var option = $('<option></option>').attr('value', entry.id).text(entry.name);
                            if (selectedValue && entry.id == selectedValue) {
                                option.prop('selected', true);
                            }
                            target.append(option);
                        });
                    } else {
                        console.error("Error fetching " + targetType + ": ", data.message);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error("AJAX Error for " + targetType + ": ", textStatus, errorThrown);
                    target.empty().append($('<option></option>').attr('value', '').text('{$lang.error_unexpected|escape:"javascript"}'));
                },
                complete: function() {
                    target.prop('disabled', false);
                    // Eğer düzenleme modunda önceden seçili değer varsa onu tekrar seç
                    if (selectedValue) {
                         target.val(selectedValue).trigger('change'); // Mahalle için gerekirse change trigger edilebilir
                    }
                }
            });
        }
    }

    // POP Formu için İlçe dropdown'ını doldur
    $('#adres_il_ref_kodu_pop').change(function() {
        populateDropdown('adres_il_ref_kodu_pop', 'adres_ilce_ref_kodu_pop', 'ilce', '{$modulelink}', '{$csrfToken}', $('#adres_ilce_ref_kodu_pop').data('selected'));
        // İl değiştiğinde mahalle listesini de sıfırla
        $('#adres_mahalle_ref_kodu_pop').empty().append($('<option></option>').attr('value', '').text('{$lang.select_option|escape:"javascript"}'));
    }).trigger('change'); // Sayfa yüklendiğinde de çalıştır (eğer il seçili geliyorsa)

    // POP Formu için Mahalle dropdown'ını doldur
    $('#adres_ilce_ref_kodu_pop').change(function() {
        populateDropdown('adres_ilce_ref_kodu_pop', 'adres_mahalle_ref_kodu_pop', 'mahalle', '{$modulelink}', '{$csrfToken}', $('#adres_mahalle_ref_kodu_pop').data('selected'));
    });
     // Eğer düzenleme modunda ilçe önceden seçili geliyorsa, mahalleleri yüklemesi için ilçe change'ini tetikle
    if ($('#adres_ilce_ref_kodu_pop').data('selected') && $('#adres_ilce_ref_kodu_pop').val() == $('#adres_ilce_ref_kodu_pop').data('selected')) {
        $('#adres_ilce_ref_kodu_pop').trigger('change');
    }


    // POP Filtreleme için İlçe dropdown'ını doldur
    $('#search_pop_il').change(function() {
        populateDropdown('search_pop_il', 'search_pop_ilce', 'ilce', '{$modulelink}', '{$csrfToken}', $('#search_pop_ilce').data('selected'));
    }).trigger('change');


    // Excel'e Aktar butonu
    $('#exportPopExcelBtn').click(function() {
        var btn = $(this);
        var currentUrlParams = new URLSearchParams(window.location.search);
        var exportUrl = '{$modulelink}&action=pop_management&sub_action=export_excel&token={$csrfToken}';
        
        if (currentUrlParams.has('search_pop_name')) exportUrl += '&search_pop_name=' + encodeURIComponent(currentUrlParams.get('search_pop_name'));
        if (currentUrlParams.has('search_pop_il')) exportUrl += '&search_pop_il=' + encodeURIComponent(currentUrlParams.get('search_pop_il'));
        if (currentUrlParams.has('search_pop_ilce')) exportUrl += '&search_pop_ilce=' + encodeURIComponent(currentUrlParams.get('search_pop_ilce'));
        if (currentUrlParams.has('search_pop_active')) exportUrl += '&search_pop_active=' + encodeURIComponent(currentUrlParams.get('search_pop_active'));

        btn.button('loading');
        window.location.href = exportUrl;
        setTimeout(function(){ btn.button('reset'); }, 2000);
    });

});
</script>