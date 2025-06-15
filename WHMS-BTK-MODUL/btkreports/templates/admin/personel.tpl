{* WHMCS BTK Raporları Modülü - Personel Yönetimi Sayfası *}

{include file="./shared/alert_messages.tpl"} {* Ortak uyarı/bilgi mesajları şablonunu dahil et *}

<div class="btk-admin-page-container">
    <div class="btk-admin-page-header">
        <div class="btk-header-left">
            {if file_exists($modulepath|cat:'/logo.png')}
                <img src="{$modulelink|replace:'addonmodules.php?module=btkreports':''}/modules/addons/btkreports/logo.png" alt="{$LANG.btk_module_name} Logo" class="btk-header-logo">
            {/if}
            <h2>{$LANG.btk_personnel_title}</h2>
        </div>
        <div class="btk-header-right">
            <span class="btk-version-info">v{$version}</span>
        </div>
    </div>

    {include file="./shared/admin_header_menu.tpl" active_tab="personnel"} {* Ortak navigasyon menüsünü dahil et *}

    <p style="margin-top: 20px;">{$LANG.btk_personnel_list_desc}</p>

    {* Yeni Personel Ekleme / WHMCS Adminlerini Çekme Butonları *}
    <div class="btk-page-actions">
        <button type="button" class="btn btn-info" data-toggle="modal" data-target="#modalFetchWhmcsAdmins">
            <i class="fas fa-user-shield icon-spacer"></i>{$LANG.btk_button_manual_fetch_personnel}
        </button>
        {* Manuel Yeni Personel Ekleme butonu ileride eklenebilir:
        <a href="{$modulelink}&action=personnel&subaction=add" class="btn btn-success">
            <i class="fas fa-plus-circle icon-spacer"></i>{$LANG.btk_personnel_add_new_personnel}
        </a>
        *}
    </div>
    <br>

    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-users-cog icon-spacer"></i>{$LANG.btk_personnel_list_title}</h3>
        </div>
        <div class="panel-body">
            {if $personeller}
                <table class="table table-striped table-bordered table-hover dataTable">
                    <thead>
                        <tr>
                            <th>{$LANG.btk_personnel_id}</th>
                            <th>{$LANG.btk_personnel_fullname}</th>
                            <th>{$LANG.btk_personnel_email}</th>
                            <th>{$LANG.btk_personnel_job_title}</th>
                            <th>{$LANG.btk_personnel_department}</th>
                            <th>{$LANG.btk_personnel_tckn}</th>
                            <th class="text-center">{$LANG.btk_personnel_include_in_btk_list_short}</th>
                            <th class="text-center" width="100">{$LANG.action}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foreach from=$personeller item=personel}
                            <tr>
                                <td>{$personel->id}</td>
                                <td>{$personel->firstname|escape:'html'} {$personel->lastname|escape:'html'}</td>
                                <td>{$personel->email|escape:'html'}</td>
                                <td>{$personel->unvan_gorev|escape:'html'|default:'-'}</td>
                                <td>{$personel->departman_adi|escape:'html'|default:'-'}</td>
                                <td>{$personel->tc_kimlik_no|escape:'html'|default:'-'}</td>
                                <td class="text-center">
                                    {if $personel->btk_listesine_eklensin == 1}
                                        <span class="label label-success">{$LANG.yes}</span>
                                    {else}
                                        <span class="label label-danger">{$LANG.no}</span>
                                    {/if}
                                </td>
                                <td class="text-center">
                                    <a href="{$modulelink}&action=personnel&subaction=edit&id={$personel->id}" class="btn btn-xs btn-primary" data-toggle="tooltip" title="{$LANG.btk_button_edit}">
                                        <i class="fas fa-pencil-alt"></i>
                                    </a>
                                    {* Silme butonu eklenebilir, ancak dikkatli olunmalı *}
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

    {* WHMCS Adminlerini Çekme Modal'ı *}
    <div class="modal fade" id="modalFetchWhmcsAdmins" tabindex="-1" role="dialog" aria-labelledby="modalFetchWhmcsAdminsLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <form method="post" action="{$modulelink}&action=personnel&subaction=fetchwhmcs">
                    <input type="hidden" name="token" value="{$csrfToken}" />
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                        <h4 class="modal-title" id="modalFetchWhmcsAdminsLabel">{$LANG.btk_button_manual_fetch_personnel}</h4>
                    </div>
                    <div class="modal-body">
                        <p>{$LANG.btk_personnel_whmcs_admins_not_in_btk_list}:</p>
                        {if $whmcs_admins_not_in_list}
                            <ul class="list-group">
                                {foreach from=$whmcs_admins_not_in_list item=admin}
                                    <li class="list-group-item">
                                        <label class="btk-switch btk-switch-inline">
                                            <input type="checkbox" name="admin_ids[]" value="{$admin->id}" checked>
                                            <span class="btk-slider round"></span>
                                            <span class="btk-switch-label">{$admin->firstname|escape:'html'} {$admin->lastname|escape:'html'} ({$admin->email|escape:'html'})</span>
                                        </label>
                                    </li>
                                {/foreach}
                            </ul>
                        {else}
                            <div class="alert alert-info">{$LANG.btk_personnel_no_new_admins_to_add}</div>
                        {/if}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">{$LANG.btk_button_cancel}</button>
                        {if $whmcs_admins_not_in_list}
                            <button type="submit" class="btn btn-primary">{$LANG.btk_personnel_add_selected_to_btk}</button>
                        {/if}
                    </div>
                </form>
            </div>
        </div>
    </div>

    {* Personel Düzenleme Formu (subaction=edit olduğunda gösterilir) *}
    {if $subaction == 'edit'}
        <div class="panel panel-default" id="editPersonnelPanel">
            <div class="panel-heading">
                <h3 class="panel-title">
                    <i class="fas fa-user-edit icon-spacer"></i>
                    {$LANG.btk_personnel_edit_personnel}
                    {if $edit_personel.firstname} - {$edit_personel.firstname|escape:'html'} {$edit_personel.lastname|escape:'html'}{/if}
                </h3>
            </div>
            <form method="post" action="{$modulelink}&action=personnel&subaction=save" class="form-horizontal" id="personnelEditForm">
                <input type="hidden" name="token" value="{$csrfToken}" />
                <input type="hidden" name="personel_id" value="{$edit_personel.id|default:0}" />
                <input type="hidden" name="admin_id" value="{$edit_personel.admin_id|default:0}" />

                <div class="panel-body">
                    <h4><i class="fas fa-id-card icon-spacer"></i>Kişisel Bilgiler (WHMCS'ten Gelen)</h4>
                    <div class="form-group">
                        <label class="col-sm-3 control-label">{$LANG.btk_personnel_firstname}</label>
                        <div class="col-sm-7 form-control-static">{$edit_personel.firstname|escape:'html'}</div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-3 control-label">{$LANG.btk_personnel_lastname}</label>
                        <div class="col-sm-7 form-control-static">{$edit_personel.lastname|escape:'html'}</div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-3 control-label">{$LANG.btk_personnel_email}</label>
                        <div class="col-sm-7 form-control-static">{$edit_personel.email|escape:'html'}</div>
                    </div>

                    <hr>
                    <h4><i class="fas fa-file-signature icon-spacer"></i>BTK İçin Gerekli Ek Bilgiler</h4>

                    <div class="form-group">
                        <label for="firma_unvani_edit" class="col-sm-3 control-label">{$LANG.btk_personnel_company_title}</label>
                        <div class="col-sm-7">
                            <input type="text" name="firma_unvani" id="firma_unvani_edit" value="{$edit_personel.firma_unvani|default:$settings.operator_unvani|escape:'html'}" class="form-control">
                             <small class="text-muted">Varsayılan olarak modül ayarlarındaki operatör unvanı kullanılır.</small>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="tc_kimlik_no_edit" class="col-sm-3 control-label">{$LANG.btk_personnel_tckn} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_personnel_info_tckn_validation|escape:'html'}"></i></label>
                        <div class="col-sm-4">
                            <input type="text" name="tc_kimlik_no" id="tc_kimlik_no_edit" value="{$edit_personel.tc_kimlik_no|escape:'html'}" class="form-control" maxlength="11">
                        </div>
                        <div class="col-sm-3" id="tcknValidationResultEdit" style="padding-top: 7px;"></div>
                    </div>

                    <div class="form-group">
                        <label for="uyruk_iso_kodu_edit" class="col-sm-3 control-label">{$LANG.btk_nationality} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_personnel_info_nationality|escape:'html'}"></i></label>
                        <div class="col-sm-5">
                            <select name="uyruk_iso_kodu" id="uyruk_iso_kodu_edit" class="form-control select-select2">
                                {foreach from=$ulkeler item=ulke}
                                    <option value="{$ulke->iso_kodu}" {if $edit_personel.uyruk_iso_kodu == $ulke->iso_kodu || (!$edit_personel.uyruk_iso_kodu && $ulke->iso_kodu == 'TUR')}selected{/if}>
                                        {$ulke->ulke_adi_tr|escape:'html'} ({$ulke->iso_kodu|escape:'html'})
                                    </option>
                                {/foreach}
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="unvan_gorev_edit" class="col-sm-3 control-label">{$LANG.btk_personnel_job_title}</label>
                        <div class="col-sm-7">
                            <input type="text" name="unvan_gorev" id="unvan_gorev_edit" value="{$edit_personel.unvan_gorev|escape:'html'}" class="form-control">
                        </div>
                    </div>

{* Personel Düzenleme Formu (subaction=edit olduğunda gösterilir) - BTK İçin Gerekli Ek Bilgiler - Devam *}

                    <div class="form-group">
                        <label for="departman_id_edit" class="col-sm-3 control-label">{$LANG.btk_personnel_department}</label>
                        <div class="col-sm-5">
                            <select name="departman_id" id="departman_id_edit" class="form-control select-select2">
                                <option value="">-- {$LANG.please_select} --</option>
                                {foreach from=$departmanlar item=departman}
                                    <option value="{$departman->id}" {if $edit_personel.departman_id == $departman->id}selected{/if}>
                                        {$departman->departman_adi|escape:'html'}
                                    </option>
                                {/foreach}
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="mobil_telefonu_edit" class="col-sm-3 control-label">{$LANG.btk_personnel_mobile_phone}</label>
                        <div class="col-sm-4">
                            <input type="text" name="mobil_telefonu" id="mobil_telefonu_edit" value="{$edit_personel.mobil_telefonu|escape:'html'}" class="form-control" placeholder="5xxxxxxxxx">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="sabit_telefonu_edit" class="col-sm-3 control-label">{$LANG.btk_personnel_work_phone}</label>
                        <div class="col-sm-4">
                            <input type="text" name="sabit_telefonu" id="sabit_telefonu_edit" value="{$edit_personel.sabit_telefonu|escape:'html'}" class="form-control" placeholder="212xxxxxxx">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-3 control-label">{$LANG.btk_personnel_include_in_btk_list} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_personnel_info_btk_list|escape:'html'}"></i></label>
                        <div class="col-sm-7">
                            <label class="btk-switch">
                                <input type="checkbox" name="btk_listesine_eklensin" value="1" {if $edit_personel.btk_listesine_eklensin|default:1 == 1}checked{/if}>
                                <span class="btk-slider round"></span>
                            </label>
                        </div>
                    </div>

                    <hr>
                    <h4><i class="fas fa-briefcase icon-spacer"></i>İnsan Kaynakları Bilgileri (Operasyonel)</h4>

                    <div class="form-group">
                        <label for="ev_adresi_edit" class="col-sm-3 control-label">{$LANG.btk_personnel_home_address}</label>
                        <div class="col-sm-7">
                            <textarea name="ev_adresi" id="ev_adresi_edit" class="form-control" rows="3">{$edit_personel.ev_adresi|escape:'html'}</textarea>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="acil_durum_kisi_adi_edit" class="col-sm-3 control-label">{$LANG.btk_personnel_emergency_contact_name}</label>
                        <div class="col-sm-7">
                            <input type="text" name="acil_durum_kisi_adi" id="acil_durum_kisi_adi_edit" value="{$edit_personel.acil_durum_kisi_adi|escape:'html'}" class="form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="acil_durum_kisi_telefonu_edit" class="col-sm-3 control-label">{$LANG.btk_personnel_emergency_contact_phone}</label>
                        <div class="col-sm-4">
                            <input type="text" name="acil_durum_kisi_telefonu" id="acil_durum_kisi_telefonu_edit" value="{$edit_personel.acil_durum_kisi_telefonu|escape:'html'}" class="form-control">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="ise_baslama_tarihi_edit" class="col-sm-3 control-label">{$LANG.btk_personnel_start_date}</label>
                        <div class="col-sm-3">
                            <input type="text" name="ise_baslama_tarihi" id="ise_baslama_tarihi_edit" value="{$edit_personel.ise_baslama_tarihi|date_format:'%Y-%m-%d'}" class="form-control date-picker" placeholder="YYYY-AA-GG">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="isten_ayrilma_tarihi_edit" class="col-sm-3 control-label">{$LANG.btk_personnel_end_date} <i class="fas fa-info-circle btk-info-icon" data-toggle="tooltip" title="{$LANG.btk_personnel_info_end_date|escape:'html'}"></i></label>
                        <div class="col-sm-3">
                            <input type="text" name="isten_ayrilma_tarihi" id="isten_ayrilma_tarihi_edit" value="{if $edit_personel.isten_ayrilma_tarihi && $edit_personel.isten_ayrilma_tarihi != '0000-00-00'}{$edit_personel.isten_ayrilma_tarihi|date_format:'%Y-%m-%d'}{/if}" class="form-control date-picker" placeholder="YYYY-AA-GG">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="is_birakma_nedeni_edit" class="col-sm-3 control-label">{$LANG.btk_personnel_leave_reason}</label>
                        <div class="col-sm-7">
                            <textarea name="is_birakma_nedeni" id="is_birakma_nedeni_edit" class="form-control" rows="2">{$edit_personel.is_birakma_nedeni|escape:'html'}</textarea>
                        </div>
                    </div>

{* Personel Düzenleme Formu (subaction=edit olduğunda gösterilir) - İnsan Kaynakları Bilgileri ve Görev Bölgesi - Devam *}

                    <hr>
                    <h4><i class="fas fa-map-marker-alt icon-spacer"></i>Görev Bölgesi (Teknik Ekip İçin Opsiyonel)</h4>
                     <div class="form-group">
                        <label for="gorev_bolgesi_il_id_edit" class="col-sm-3 control-label">{$LANG.btk_personnel_duty_region_province}</label>
                        <div class="col-sm-5">
                            <select name="gorev_bolgesi_il_id" id="gorev_bolgesi_il_id_edit" class="form-control select-select2">
                                <option value="">-- {$LANG.please_select} --</option>
                                {foreach from=$iller item=il}
                                    <option value="{$il->id}" {if $edit_personel.gorev_bolgesi_il_id == $il->id}selected{/if}>
                                        {$il->il_adi|escape:'html'}
                                    </option>
                                {/foreach}
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="gorev_bolgesi_ilce_id_edit" class="col-sm-3 control-label">{$LANG.btk_personnel_duty_region_district}</label>
                        <div class="col-sm-5">
                            <select name="gorev_bolgesi_ilce_id" id="gorev_bolgesi_ilce_id_edit" class="form-control select-select2" {if !$edit_personel.gorev_bolgesi_il_id && !$gorev_ilceleri_edit}disabled{/if}>
                                <option value="">-- {$LANG.please_select} --</option>
                                {if $gorev_ilceleri_edit}
                                    {foreach from=$gorev_ilceleri_edit item=ilce}
                                        <option value="{$ilce->id}" {if $edit_personel.gorev_bolgesi_ilce_id == $ilce->id}selected{/if}>
                                            {$ilce->ilce_adi|escape:'html'}
                                        </option>
                                    {/foreach}
                                {/if}
                            </select>
                             <small class="text-muted">İl seçimi yapıldıktan sonra ilçeler listelenecektir.</small>
                        </div>
                    </div>

                </div> {*<!-- ./panel-body -->*}

                <div class="panel-footer text-right">
                    <a href="{$modulelink}&action=personnel" class="btn btn-default">{$LANG.btk_button_cancel}</a>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save icon-spacer"></i>{$LANG.btk_button_save_changes}
                    </button>
                </div>
            </form>
        </div>
    {/if} {*<!-- subaction edit sonu -->*}
</div> {*<!-- ./btk-admin-page-container -->*}


{* Bu şablon için gerekli JavaScript kodları btk_admin_scripts.js dosyasına taşınmıştır.
   (Flash mesajı, Tooltip, DataTables, Select2, Silme onayı, AJAX ile ilçe yükleme, TCKN doğrulama placeholder)
*}

{* Gerekli Smarty Değişkenleri (btkreports.php -> personel action'ında atanmalı):
   - $flash_message (opsiyonel)
   - $modulepath, $modulelink, $version, $LANG, $csrfToken (standart)
   - $settings.operator_unvani (Firma unvanı için varsayılan değer)
   - $personeller: mod_btk_personel tablosundan gelen personel listesi (join ile admin ve departman adları dahil)
   - $subaction: 'edit' veya boş (şimdilik 'add' manuel için düşünülmüyor)
   - $edit_personel: Düzenlenecek personel için veriler (array/object)
   - $whmcs_admins_not_in_list: Henüz BTK listesine eklenmemiş WHMCS adminleri
   - $ulkeler: mod_btk_ref_ulkeler tablosundan gelen ülke listesi
   - $departmanlar: mod_btk_personel_departmanlari tablosundan gelen departman listesi
   - $iller: mod_btk_adres_il tablosundan gelen il listesi (görev bölgesi için)
   - $gorev_ilceleri_edit: (Düzenleme formu için) Kayıtlı ile ait ilçeler (AJAX ile de yüklenir)
*}