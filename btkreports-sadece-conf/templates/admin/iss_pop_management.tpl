{* WHMCS BTK Raporları Modülü - ISS POP Noktası Yönetimi Sayfası *}

{include file="./shared/alert_messages.tpl"} {* Ortak uyarı/bilgi mesajları şablonunu dahil et *}

<div class="btk-admin-page-container">
    <div class="btk-admin-page-header">
        <div class="btk-header-left">
            {if file_exists($modulepath|cat:'/logo.png')}
                <img src="{$modulelink|replace:'addonmodules.php?module=btkreports':''}/modules/addons/btkreports/logo.png" alt="{$LANG.btk_module_name} Logo" class="btk-header-logo">
            {/if}
            <h2>{$LANG.btk_iss_pop_management_title}</h2>
        </div>
        <div class="btk-header-right">
            <span class="btk-version-info">v{$version}</span>
        </div>
    </div>

    {include file="./shared/admin_header_menu.tpl" active_tab="isspop"} {* Ortak navigasyon menüsünü dahil et *}

    <p style="margin-top: 20px;">{$LANG.btk_pop_list_desc}</p>

    {if $subaction == 'edit' || $subaction == 'add'}
        {* POP Noktası Ekleme/Düzenleme Formu *}
        <div class="panel panel-default" id="editPopPanel">
            <div class="panel-heading">
                <h3 class="panel-title">
                    <i class="fas {if $subaction == 'edit'}fa-edit{else}fa-plus-square{/if} icon-spacer"></i>
                    {if $subaction == 'edit'}{$LANG.btk_pop_edit_pop}{else}{$LANG.btk_pop_add_new_pop}{/if}
                    {if $subaction == 'edit' && $edit_pop.pop_adi} - {$edit_pop.pop_adi|escape:'html'}{/if}
                </h3>
            </div>
            <form method="post" action="{$modulelink}&action=isspop&subaction=save" class="form-horizontal" id="popEditForm">
                <input type="hidden" name="token" value="{$csrfToken}" />
                <input type="hidden" name="pop_id" value="{$edit_pop.id|default:0}" />

                <div class="panel-body">
                    <div class="form-group">
                        <label for="pop_adi_edit" class="col-sm-3 control-label">{$LANG.btk_pop_name} *</label>
                        <div class="col-sm-7">
                            <input type="text" name="pop_adi" id="pop_adi_edit" value="{$edit_pop.pop_adi|escape:'html'}" class="form-control" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="pop_il_id_edit" class="col-sm-3 control-label">{$LANG.btk_pop_province}</label>
                        <div class="col-sm-5">
                            <select name="il_id" id="pop_il_id_edit" class="form-control select-select2">
                                <option value="">-- {$LANG.please_select} --</option>
                                {foreach from=$iller item=il}
                                    <option value="{$il->id}" {if $edit_pop.il_id == $il->id}selected{/if}>
                                        {$il->il_adi|escape:'html'}
                                    </option>
                                {/foreach}
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="pop_ilce_id_edit" class="col-sm-3 control-label">{$LANG.btk_pop_district}</label>
                        <div class="col-sm-5">
                            <select name="ilce_id" id="pop_ilce_id_edit" class="form-control select-select2" {if !$edit_pop.il_id && !$pop_ilceleri_edit}disabled{/if}>
                                <option value="">-- {$LANG.please_select} --</option>
                                {if $pop_ilceleri_edit}
                                    {foreach from=$pop_ilceleri_edit item=ilce}
                                        <option value="{$ilce->id}" {if $edit_pop.ilce_id == $ilce->id}selected{/if}>
                                            {$ilce->ilce_adi|escape:'html'}
                                        </option>
                                    {/foreach}
                                {/if}
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="pop_mahalle_id_edit" class="col-sm-3 control-label">{$LANG.btk_pop_neighbourhood}</label>
                        <div class="col-sm-5">
                            <select name="mahalle_id" id="pop_mahalle_id_edit" class="form-control select-select2" {if !$edit_pop.ilce_id && !$pop_mahalleleri_edit}disabled{/if}>
                                <option value="">-- {$LANG.please_select} --</option>
                                 {if $pop_mahalleleri_edit}
                                    {foreach from=$pop_mahalleleri_edit item=mahalle}
                                        <option value="{$mahalle->id}" {if $edit_pop.mahalle_id == $mahalle->id}selected{/if}>
                                            {$mahalle->mahalle_adi|escape:'html'}
                                        </option>
                                    {/foreach}
                                {/if}
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="adres_detay_edit" class="col-sm-3 control-label">{$LANG.btk_pop_address_detail}</label>
                        <div class="col-sm-7">
                            <textarea name="adres_detay" id="adres_detay_edit" class="form-control" rows="3">{$edit_pop.adres_detay|escape:'html'}</textarea>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="koordinatlar_edit" class="col-sm-3 control-label">{$LANG.btk_pop_coordinates}</label>
                        <div class="col-sm-5">
                            <input type="text" name="koordinatlar" id="koordinatlar_edit" value="{$edit_pop.koordinatlar|escape:'html'}" class="form-control" placeholder="örn: 40.7128, -74.0060">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="yayin_yapilan_ssid_edit" class="col-sm-3 control-label">{$LANG.btk_pop_ssid} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_pop_info_ssid|escape:'html'}"></i></label>
                        <div class="col-sm-5">
                            <input type="text" name="yayin_yapilan_ssid" id="yayin_yapilan_ssid_edit" value="{$edit_pop.yayin_yapilan_ssid|escape:'html'}" class="form-control">
                        </div>
                    </div>
                     <div class="form-group">
                        <label for="sunucu_bilgisi_edit" class="col-sm-3 control-label">{$LANG.btk_pop_server_info} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_pop_info_server_info|escape:'html'}"></i></label>
                        <div class="col-sm-5">
                            <input type="text" name="sunucu_bilgisi" id="sunucu_bilgisi_edit" value="{$edit_pop.sunucu_bilgisi|escape:'html'}" class="form-control" placeholder="WHMCS Sunucu Adı veya IP">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-3 control-label">{$LANG.btk_pop_is_active}</label>
                        <div class="col-sm-7">
                            <label class="btk-switch">
                                <input type="checkbox" name="aktif_mi" value="1" {if $edit_pop.aktif_mi|default:1 == 1}checked{/if}>
                                <span class="btk-slider round"></span>
                            </label>
                        </div>
                    </div>
                </div> {*<!-- ./panel-body -->*}

                <div class="panel-footer text-right">
                    <a href="{$modulelink}&action=isspop" class="btn btn-default">{$LANG.btk_button_cancel}</a>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save icon-spacer"></i>{$LANG.btk_button_save_changes}
                    </button>
                </div>
            </form>
        </div>
    {else}
        {* POP Noktası Listesi *}
        <div class="btk-page-actions">
            <a href="{$modulelink}&action=isspop&subaction=add" class="btn btn-success">
                <i class="fas fa-plus-circle icon-spacer"></i>{$LANG.btk_pop_add_new_pop}
            </a>
            {* Excel Import/Export butonları ileride eklenebilir *}
        </div>
        <br>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fas fa-broadcast-tower icon-spacer"></i>{$LANG.btk_pop_list_title}</h3>
            </div>
            <div class="panel-body">
                {if $pop_noktalari}
                    <table class="table table-striped table-bordered table-hover dataTable">
                        <thead>
                            <tr>
                                <th>{$LANG.btk_pop_id}</th>
                                <th>{$LANG.btk_pop_name}</th>
                                <th>{$LANG.btk_pop_province}</th>
                                <th>{$LANG.btk_pop_district}</th>
                                <th>{$LANG.btk_pop_ssid}</th>
                                <th class="text-center">{$LANG.btk_pop_is_active}</th>
                                <th class="text-center" width="100">{$LANG.action}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foreach from=$pop_noktalari item=pop}
                                <tr>
                                    <td>{$pop->id}</td>
                                    <td>{$pop->pop_adi|escape:'html'}</td>
                                    <td>{$pop->il_adi|escape:'html'|default:'-'}</td>
                                    <td>{$pop->ilce_adi|escape:'html'|default:'-'}</td>
                                    <td>{$pop->yayin_yapilan_ssid|escape:'html'|default:'-'}</td>
                                    <td class="text-center">
                                        {if $pop->aktif_mi == 1}
                                            <span class="label label-success">{$LANG.yes}</span>
                                        {else}
                                            <span class="label label-danger">{$LANG.no}</span>
                                        {/if}
                                    </td>
                                    <td class="text-center">
                                        <a href="{$modulelink}&action=isspop&subaction=edit&id={$pop->id}#editPopPanel" class="btn btn-xs btn-primary" data-toggle="tooltip" title="{$LANG.btk_button_edit}">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <a href="{$modulelink}&action=isspop&subaction=delete&id={$pop->id}&token={$csrfToken}"
                                           class="btn btn-xs btn-danger btk-confirm-delete"
                                           data-toggle="tooltip" title="{$LANG.btk_button_delete}"
                                           data-message="{$LANG.btk_confirm_delete_message|escape:'html'}">
                                            <i class="fas fa-trash"></i>
                                        </a>
                                    </td>
                                </tr>
                            {/foreach}
                        </tbody>
                    </table>
                {else}
                    <div class="alert alert-info text-center">
                        {$LANG.btk_no_records_found}
                    </div>
                {/if}
            </div>
        </div>
    {/if} {*<!-- subaction kontrolü sonu -->*}
</div>

{* Bu şablon için gerekli JavaScript kodları (Flash mesajı, Tooltip, DataTables, Select2, Silme onayı, AJAX ile ilçe/mahalle yükleme)
   btk_admin_scripts.js dosyasına taşınmıştır.
*}

{* Gerekli Smarty Değişkenleri (btkreports.php -> isspop action'ında atanmalı):
   - $flash_message (opsiyonel)
   - $modulepath, $modulelink, $version, $LANG, $csrfToken (standart)
   - $pop_noktalari: mod_btk_iss_pop_noktalari tablosundan gelen liste (join ile il, ilçe adları dahil)
   - $subaction: 'edit', 'add' veya boş
   - $edit_pop: Düzenlenecek veya yeni eklenecek POP noktası için veriler (array/object)
   - $iller: mod_btk_adres_il tablosundan gelen il listesi
   - $pop_ilceleri_edit: (Düzenleme/Ekleme formu için) Kayıtlı ile ait ilçeler (AJAX ile de yüklenir)
   - $pop_mahalleleri_edit: (Düzenleme/Ekleme formu için) Kayıtlı ilçeye ait mahalleler (AJAX ile de yüklenir)
*}