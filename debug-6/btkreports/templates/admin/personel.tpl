{*
    WHMCS BTK Raporlama Modülü - Personel Yönetimi Sayfası
    Dosya: templates/admin/personel.tpl
    Sürüm: 6.5 - CSRF, Modal ve DataTables Hataları Düzeltilmiş
*}

{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}

<p>{$LANG.personelIntroText}</p>

<div class="text-right" style="margin-bottom: 15px;">
    <a href="{$modulelink}&action=export_personel_excel&token={$csrfToken}" class="btn btn-default"><i class="fas fa-file-excel"></i> {$LANG.excelExportButton|default:'Excel Olarak Dışa Aktar'}</a>
    <button type="button" class="btn btn-success btn-edit-personel" data-mode="add" data-toggle="modal" data-target="#editPersonelModal">
        <i class="fas fa-plus-circle"></i> {$LANG.addNewPersonelButton}
    </button>
</div>

<div class="tablebg">
    <table id="tblPersonelList" class="datatable" width="100%" border="0" cellspacing="1" cellpadding="3">
        <thead>
            <tr>
                <th>{$LANG.personelAdiHeader}</th>
                <th>{$LANG.personelSoyadiHeader}</th>
                <th>{$LANG.personelUnvanHeader}</th>
                <th>{$LANG.personelEpostaHeader}</th>
                <th class="text-center">{$LANG.personelBtkListesineEklensinHeader}</th>
                <th width="120" class="no-sort">{$LANG.actionsHeader}</th>
            </tr>
        </thead>
        <tbody>
            {if $personelListesi}
                {foreach from=$personelListesi item=personel}
                    <tr>
                        <td>{$personel.ad|escape}</td>
                        <td>{$personel.soyad|escape}</td>
                        <td>{$personel.unvan|escape}</td>
                        <td>{$personel.email|escape}</td>
                        <td class="text-center">
                            {if $personel.btk_listesine_eklensin}
                                <span class="label label-success">{$LANG.yes}</span>
                            {else}
                                <span class="label label-danger">{$LANG.no}</span>
                            {/if}
                        </td>
                        <td class="text-center">
                            <button type="button" class="btn btn-xs btn-info btn-edit-personel" data-personel-id="{$personel.id}" data-mode="edit" data-toggle="modal" data-target="#editPersonelModal">
                                <i class="fas fa-edit"></i> {$LANG.editButton}
                            </button>
                             <a href="{$modulelink}&action=delete_personel&id={$personel.id}&token={$csrfToken}" class="btn btn-xs btn-danger btn-delete-confirm" data-message="{$LANG.confirmDeletePersonelText|sprintf:$personel.ad|escape:'javascript'|cat:' '|cat:$personel.soyad|escape:'javascript'}">
                                <i class="fas fa-trash"></i> {$LANG.deleteButton}
                             </a>
                        </td>
                    </tr>
                {/foreach}
            {else}
                <tr>
                    <td colspan="6" class="text-center">{$LANG.noPersonelFound}</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>

{* Personel Detaylı Düzenleme/Ekleme Modal Penceresi *}
<div class="modal fade" id="editPersonelModal" tabindex="-1" role="dialog" aria-labelledby="editPersonelModalLabel">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form method="post" action="{$modulelink}&action=save_single_personel" id="editPersonelForm">
                <input type="hidden" name="token" value="{$csrfToken}">
                <input type="hidden" name="modal_personel_data[personel_id]" id="personel_id_modal" value="">

                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    <h4 class="modal-title" id="editPersonelModalLabel"></h4>
                </div>
                <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_ad">{$LANG.personelAdiLabel} *</label>
                                <input type="text" name="modal_personel_data[ad]" id="modal_ad" class="form-control" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_soyad">{$LANG.personelSoyadiLabel} *</label>
                                <input type="text" name="modal_personel_data[soyad]" id="modal_soyad" class="form-control" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_tc_kimlik_no">{$LANG.personelTcKimlikNoHeader} *</label>
                                <input type="text" name="modal_personel_data[tckn]" id="modal_tc_kimlik_no" class="form-control" maxlength="11" required>
                                <span class="tckn-validation-status-modal"></span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_email">{$LANG.personelEpostaHeader} *</label>
                                <input type="email" name="modal_personel_data[email]" id="modal_email" class="form-control" required>
                            </div>
                        </div>
                    </div>
                     <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_unvan">{$LANG.personelUnvanLabel} *</label>
                                <input type="text" name="modal_personel_data[unvan]" id="modal_unvan" class="form-control" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_departman_id">{$LANG.personelCalistigiBirimHeader} *</label>
                                <select name="modal_personel_data[departman_id]" id="modal_departman_id" class="form-control" required>
                                    <option value="">{$LANG.selectOption}</option>
                                    {foreach from=$departmanlar item=dept}
                                        <option value="{$dept.id}">{$dept.departman_adi}</option>
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                    </div>
                     <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_mobil_tel">{$LANG.personelMobilTelefonuLabel}</label>
                                <input type="text" name="modal_personel_data[mobil_tel]" id="modal_mobil_tel" class="form-control" placeholder="5xxxxxxxxx">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_sabit_tel">{$LANG.personelSabitTelefonuLabel}</label>
                                <input type="text" name="modal_personel_data[sabit_tel]" id="modal_sabit_tel" class="form-control" placeholder="212xxxxxxx">
                            </div>
                        </div>
                    </div>
                    <hr>
                    <h5>{$LANG.personelIkInfoHeader}</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_ise_baslama_tarihi">{$LANG.personelIseBaslamaTarihiLabel}</label>
                                <input type="text" name="modal_personel_data[ise_baslama_tarihi]" id="modal_ise_baslama_tarihi" class="form-control date-picker">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_isten_ayrilma_tarihi">{$LANG.personelIstenAyrilmaTarihiLabel}</label>
                                <input type="text" name="modal_personel_data[isten_ayrilma_tarihi]" id="modal_isten_ayrilma_tarihi" class="form-control date-picker">
                            </div>
                        </div>
                    </div>
                     <div class="form-group">
                        <label for="modal_ev_adresi">{$LANG.personelEvAdresiLabel}</label>
                        <textarea name="modal_personel_data[ev_adresi]" id="modal_ev_adresi" class="form-control" rows="2"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="modal_acil_durum_kisisi">{$LANG.personelAcilDurumKisisiLabel}</label>
                        <textarea name="modal_personel_data[acil_durum_kisi_iletisim]" id="modal_acil_durum_kisisi" class="form-control" rows="2"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="modal_is_birakma_nedeni">{$LANG.personelIsBirakmaNedeniLabel}</label>
                        <textarea name="modal_personel_data[is_birakma_nedeni]" id="modal_is_birakma_nedeni" class="form-control" rows="2"></textarea>
                    </div>
                    <hr>
                    <div class="form-group">
                        <label>{$LANG.personelBtkListesineEklensinLabelModal}</label>
                        <div>
                             <label class="btk-switch" for="modal_btk_listesine_eklensin_toggle">
                                <input type="checkbox" name="modal_personel_data[btk_listesine_eklensin]" id="modal_btk_listesine_eklensin_toggle" value="1">
                                <span class="btk-slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">{$LANG.closeButton}</button>
                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> {$LANG.saveChangesButton}</button>
                </div>
            </form>
        </div>
    </div>
</div>