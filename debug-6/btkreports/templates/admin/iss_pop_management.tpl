{*
    WHMCS BTK Raporlama Modülü - ISS POP Noktası Yönetimi Sayfası
    Dosya: templates/admin/iss_pop_management.tpl
    Sürüm: 6.5 - DataTables Syntax Hatası Düzeltilmiş
*}

{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}

<p>{$LANG.issPopManagementIntro}</p>

<div class="text-right" style="margin-bottom: 15px;">
    <button type="button" class="btn btn-success btn-edit-pop" data-mode="add" data-toggle="modal" data-target="#addEditPopModal">
        <i class="fas fa-plus-circle"></i> {$LANG.addNewPopButton}
    </button>
</div>

<div class="tablebg">
    <table id="tblPopDefinitions" class="datatable" width="100%" border="0" cellspacing="1" cellpadding="3">
        <thead>
            <tr>
                <th>{$LANG.popAdiHeader}</th>
                <th>{$LANG.popYayinYapilanSsidHeader}</th>
                <th>{$LANG.popTipiHeader}</th>
                <th>{$LANG.popIlIlceHeader}</th>
                <th>{$LANG.popDurumHeader}</th>
                <th width="120" class="no-sort">{$LANG.actionsHeader}</th>
            </tr>
        </thead>
        <tbody>
            {if $popDefinitions}
                {foreach from=$popDefinitions item=pop}
                    <tr>
                        <td>{$pop.pop_adi|escape}</td>
                        <td>{$pop.yayin_yapilan_ssid|escape}</td>
                        <td>{$pop.pop_tipi|escape}</td>
                        <td>{$pop.il_adi|default:''}{if $pop.il_adi && $pop.ilce_adi} / {/if}{$pop.ilce_adi|default:''}</td>
                        <td>
                            {if $pop.aktif_pasif_durum == 1}
                                <span class="label label-success">{$LANG.statusActive}</span>
                            {else}
                                <span class="label label-danger">{$LANG.statusPassive}</span>
                            {/if}
                        </td>
                        <td class="text-center">
                            <button type="button" class="btn btn-xs btn-info btn-edit-pop"
                                    data-pop-id="{$pop.id}"
                                    data-mode="edit"
                                    data-toggle="modal" data-target="#addEditPopModal">
                                <i class="fas fa-edit"></i> {$LANG.editButton}
                            </button>
                            <a href="{$modulelink}&action=delete_pop_definition&pop_id={$pop.id}&token={$csrfToken}" class="btn btn-xs btn-danger btn-delete-confirm" data-message="{$LANG.confirmDeletePopText|sprintf:$pop.pop_adi|escape:'javascript'}">
                                <i class="fas fa-trash"></i> {$LANG.deleteButton}
                            </a>
                        </td>
                    </tr>
                {/foreach}
            {else}
                <tr>
                    <td colspan="6" class="text-center">{$LANG.noPopDefinitionsFound}</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>

{* POP Ekleme/Düzenleme Modal Penceresi *}
<div class="modal fade" id="addEditPopModal" tabindex="-1" role="dialog" aria-labelledby="addEditPopModalLabel">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form method="post" action="{$modulelink}&action=save_pop_definition" id="popDefinitionForm">
                <input type="hidden" name="token" value="{$csrfToken}">
                <input type="hidden" name="pop_id_modal" id="pop_id_modal" value="">

                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    <h4 class="modal-title" id="addEditPopModalLabel"></h4>
                </div>
                <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_pop_adi">{$LANG.popAdiLabel} *</label>
                                <input type="text" name="popdata[pop_adi]" id="modal_pop_adi" class="form-control" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_yayin_yapilan_ssid">{$LANG.popYayinYapilanSsidLabel} *</label>
                                <input type="text" name="popdata[yayin_yapilan_ssid]" id="modal_yayin_yapilan_ssid" class="form-control" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                         <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_pop_tipi">{$LANG.popTipiLabel}</label>
                                <input type="text" name="popdata[pop_tipi]" id="modal_pop_tipi" class="form-control" placeholder="{$LANG.popTipiPlaceholder|escape}">
                            </div>
                        </div>
                         <div class="col-md-6">
                             <div class="form-group">
                                 <label for="modal_ip_adresi">{$LANG.popYonetimIpHeader}</label>
                                 <input type="text" name="popdata[ip_adresi]" id="modal_ip_adresi" class="form-control" placeholder="IPv4 veya IPv6">
                             </div>
                         </div>
                    </div>

                    <hr><h4><i class="fas fa-map-marker-alt"></i> {$LANG.popLocationInfoTitle}</h4>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="modal_il_id">{$LANG.adresIlLabel} *</label>
                                <select name="popdata[il_id]" id="modal_il_id" class="form-control adres-il-select" data-target-ilce="modal_ilce_id" required>
                                    <option value="">{$LANG.selectIlOption}</option>
                                    {foreach from=$iller item=il}
                                        <option value="{$il.id}">{$il.il_adi|escape}</option>
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="modal_ilce_id">{$LANG.adresIlceLabel} *</label>
                                <select name="popdata[ilce_id]" id="modal_ilce_id" class="form-control adres-ilce-select" data-target-mahalle="modal_mahalle_id" required>
                                    <option value="">{$LANG.selectIlceOption}</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="modal_mahalle_id">{$LANG.adresMahalleLabel}</label>
                                <select name="popdata[mahalle_id]" id="modal_mahalle_id" class="form-control adres-mahalle-select">
                                     <option value="">{$LANG.selectMahalleOption}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="modal_tam_adres_detay">{$LANG.popTamAdresDetayLabel}</label>
                        <textarea name="popdata[tam_adres_detay]" id="modal_tam_adres_detay" class="form-control" rows="2"></textarea>
                    </div>
                     <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_enlem">{$LANG.popEnlemLabel}</label>
                                <input type="text" name="popdata[enlem]" id="modal_enlem" class="form-control" placeholder="Örn: 39.9207700">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_boylam">{$LANG.popBoylamLabel}</label>
                                <input type="text" name="popdata[boylam]" id="modal_boylam" class="form-control" placeholder="Örn: 32.8541100">
                            </div>
                        </div>
                    </div>

                    <hr><h4><i class="fas fa-network-wired"></i> {$LANG.popTechnicalInfoTitle}</h4>
                     <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="modal_cihaz_turu">{$LANG.popCihazTuruLabel}</label>
                                <input type="text" name="popdata[cihaz_turu]" id="modal_cihaz_turu" class="form-control">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="modal_cihaz_markasi">{$LANG.popCihazMarkasiLabel}</label>
                                <input type="text" name="popdata[cihaz_markasi]" id="modal_cihaz_markasi" class="form-control">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="modal_cihaz_modeli">{$LANG.popCihazModeliLabel}</label>
                                <input type="text" name="popdata[cihaz_modeli]" id="modal_cihaz_modeli" class="form-control">
                            </div>
                        </div>
                    </div>

                    <hr><h4><i class="fas fa-info"></i> {$LANG.popOtherInfoTitle}</h4>
                     <div class="form-group">
                        <label for="modal_aktif_pasif_durum_toggle">{$LANG.popDurumLabel}</label>
                        <div>
                            <label class="btk-switch" for="modal_aktif_pasif_durum_toggle">
                                <input type="checkbox" name="popdata[aktif_pasif_durum]" id="modal_aktif_pasif_durum_toggle" value="1" checked>
                                <span class="btk-slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">{$LANG.closeButton}</button>
                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> {$LANG.saveButton}</button>
                </div>
            </form>
        </div>
    </div>
</div>