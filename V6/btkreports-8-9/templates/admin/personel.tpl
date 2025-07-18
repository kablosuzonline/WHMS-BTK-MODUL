{*
    WHMCS BTK Raporlama Modülü - Personel Yönetimi Sayfası
    Sürüm: 8.0.3 (Zirve)
*}

<div id="btk-personel-flash-message">
{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}
</div>

<p>{$LANG.personelIntroText}</p>

<div class="context-btn-container">
    <a href="{$modulelink}&action=export_personel_excel&{$csrfTokenName}={$csrfToken}" class="btn btn-default"><i class="fas fa-file-excel"></i> {$LANG.excelExportButton}</a>
    <button type="button" class="btn btn-success" data-toggle="modal" data-target="#editPersonelModal" data-mode="add">
        <i class="fas fa-plus-circle"></i> {$LANG.addNewPersonelButton}
    </button>
</div>

<div class="tablebg">
    <table id="tblPersonelList" class="datatable" width="100%" border="0" cellspacing="1" cellpadding="3">
        <thead>
            <tr>
                <th>{$LANG.personelAdiSoyadiHeader}</th>
                <th>{$LANG.personelUnvanHeader}</th>
                <th>{$LANG.personelEpostaHeader}</th>
                <th class="text-center">{$LANG.personelBtkListesineEklensinHeader}</th>
                <th width="120" class="no-sort text-center">{$LANG.actionsHeader}</th>
            </tr>
        </thead>
        <tbody>
            {foreach from=$personelListesi item=personel}
                <tr>
                    <td>{$personel.ad|escape} {$personel.soyad|escape}</td>
                    <td>{$personel.unvan|escape}</td>
                    <td>{$personel.email|escape}</td>
                    <td class="text-center">
                        {if $personel.btk_listesine_eklensin}
                            <span class="label label-success">{$LANG.yes}</span>
                        {else}
                            <span class="label label-default">{$LANG.no}</span>
                        {/if}
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-xs btn-info" data-personel-id="{$personel.id}" data-mode="edit" data-toggle="modal" data-target="#editPersonelModal" title="{$LANG.editButton}">
                            <i class="fas fa-edit"></i>
                        </button>
                         <a href="{$modulelink}&action=delete_personel&id={$personel.id}&{$csrfTokenName}={$csrfToken}" class="btn btn-xs btn-danger btn-delete-confirm" data-message="{$LANG.confirmDeletePersonelText|sprintf:"`$personel.ad` `$personel.soyad`"|escape:'javascript'}" title="{$LANG.deleteButton}">
                            <i class="fas fa-trash"></i>
                         </a>
                    </td>
                </tr>
            {/foreach}
        </tbody>
    </table>
</div>
{$pagination_output}

{* Personel Detaylı Düzenleme/Ekleme Modal Penceresi *}
<div class="modal fade" id="editPersonelModal" tabindex="-1" role="dialog" aria-labelledby="editPersonelModalLabel">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form method="post" action="{$modulelink}&action=save_single_personel" id="editPersonelForm">
                <input type="hidden" name="{$csrfTokenName}" value="{$csrfToken}">
                <input type="hidden" name="modal_personel_data[id]" id="personel_id_modal" value="">

                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    <h4 class="modal-title" id="editPersonelModalLabel"></h4>
                </div>
                <div class="modal-body">
                    <h4>BTK İçin Zorunlu Bilgiler</h4>
                    <hr>
                    <div class="row">
                        <div class="col-md-6"><div class="form-group"><label for="modal_ad" class="control-label required">Adı</label><input type="text" name="modal_personel_data[ad]" id="modal_ad" class="form-control" required></div></div>
                        <div class="col-md-6"><div class="form-group"><label for="modal_soyad" class="control-label required">Soyadı</label><input type="text" name="modal_personel_data[soyad]" id="modal_soyad" class="form-control" required></div></div>
                    </div>
                    <div class="row">
                        <div class="col-md-6"><div class="form-group"><label for="modal_tc_kimlik_no" class="control-label required">TC/Yabancı Kimlik No</label><input type="text" name="modal_personel_data[tckn]" id="modal_tc_kimlik_no" class="form-control" maxlength="11" required><span class="tckn-validation-status-modal help-block"></span></div></div>
                        <div class="col-md-6"><div class="form-group"><label for="modal_dogum_yili" class="control-label required">Doğum Yılı</label><input type="number" name="modal_personel_data[dogum_yili]" id="modal_dogum_yili" class="form-control" placeholder="Örn: 1985" required><small class="help-block">(TCKN Doğrulama için gereklidir)</small></div></div>
                    </div>
                     <div class="row">
                        <div class="col-md-6"><div class="form-group"><label for="modal_unvan" class="control-label required">Ünvan</label><input type="text" name="modal_personel_data[unvan]" id="modal_unvan" class="form-control" required></div></div>
                        <div class="col-md-6"><div class="form-group"><label for="modal_departman_id" class="control-label required">Çalıştığı Birim</label><select name="modal_personel_data[departman_id]" id="modal_departman_id" class="form-control" required><option value="">{$LANG.selectOption}</option>{foreach from=$departmanlar item=dept}<option value="{$dept.id}">{$dept.departman_adi|escape}</option>{/foreach}</select></div></div>
                    </div>
                     <div class="row">
                        <div class="col-md-6"><div class="form-group"><label for="modal_mobil_tel" class="control-label">Mobil Telefonu</label><input type="text" name="modal_personel_data[mobil_tel]" id="modal_mobil_tel" class="form-control" placeholder="905xxxxxxxxx"></div></div>
                        <div class="col-md-6"><div class="form-group"><label for="modal_email" class="control-label required">E-posta Adresi</label><input type="email" name="modal_personel_data[email]" id="modal_email" class="form-control" required></div></div>
                    </div>
                    <div class="form-group">
                        <label for="modal_btk_listesine_eklensin" class="control-label">Bu Personel BTK Listesine Eklensin mi?</label>
                        <div><div class="bootstrap-switch-wrapper"><input type="checkbox" name="modal_personel_data[btk_listesine_eklensin]" id="modal_btk_listesine_eklensin" value="1" class="bootstrap-switch"></div></div>
                    </div>

                    <h4 class="text-info" style="margin-top: 30px;">İsteğe Bağlı İK Bilgileri</h4>
                    <hr>
                    <div class="row">
                        <div class="col-md-6"><div class="form-group"><label for="modal_ise_baslama_tarihi" class="control-label">İşe Başlama Tarihi</label><input type="text" name="modal_personel_data[ise_baslama_tarihi]" id="modal_ise_baslama_tarihi" class="form-control date-picker"></div></div>
                        <div class="col-md-6"><div class="form-group"><label for="modal_isten_ayrilma_tarihi" class="control-label">İşten Ayrılma Tarihi</label><input type="text" name="modal_personel_data[isten_ayrilma_tarihi]" id="modal_isten_ayrilma_tarihi" class="form-control date-picker"></div></div>
                    </div>
                    <div class="form-group"><label for="modal_is_birakma_nedeni" class="control-label">İş Bırakma Nedeni</label><textarea name="modal_personel_data[is_birakma_nedeni]" id="modal_is_birakma_nedeni" class="form-control" rows="2"></textarea></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">{$LANG.closeButton}</button>
                    <button type="button" class="btn btn-info" id="validateNviButton">TCKN Doğrula</button>
                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> {$LANG.saveChanges}</button>
                </div>
            </form>
        </div>
    </div>
</div>