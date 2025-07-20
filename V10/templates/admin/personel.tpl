{*
    WHMCS BTK Raporlama Modülü - Personel Yönetimi Sayfası
    Sürüm: 10.0.6 (Nihai Tarih Düzeltmesi)
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
    <button type="button" class="btn btn-success" id="btnAddNewPersonel">
        <i class="fas fa-plus-circle"></i> {$LANG.addNewPersonelButton}
    </button>
</div>

<div class="tablebg">
    <table class="table table-striped" width="100%" border="0" cellspacing="1" cellpadding="3">
        <thead>
            <tr>
                <th>{$LANG.personelAdiSoyadiHeader}</th>
                <th>{$LANG.personelUnvanHeader}</th>
                <th>{$LANG.personelEpostaHeader}</th>
                <th class="text-center">{$LANG.personelBtkListesineEklensinHeader}</th>
                <th width="120" class="text-center">{$LANG.actionsHeader}</th>
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
                        <button type="button" class="btn btn-xs btn-info edit-personel-btn"
                                data-personel-id="{$personel.id}"
                                data-ad="{$personel.ad|escape}"
                                data-soyad="{$personel.soyad|escape}"
                                data-tckn="{$personel.tckn|escape}"
                                data-unvan="{$personel.unvan|escape}"
                                data-email="{$personel.email|escape}"
                                data-departman-id="{$personel.departman_id}"
                                data-ise-baslama-tarihi="{$personel.ise_baslama_tarihi}"
                                data-isten-ayrilma-tarihi="{$personel.isten_ayrilma_tarihi}"
                                data-acik-adres="{$personel.acik_adres|escape}"
                                data-acil-durum-kisi-adi="{$personel.acil_durum_kisi_adi|escape}"
                                data-acil-durum-kisi-gsm="{$personel.acil_durum_kisi_gsm|escape}"
                                data-btk-listesine-eklensin="{$personel.btk_listesine_eklensin}"
                                title="{$LANG.editButton}">
                            <i class="fas fa-edit"></i>
                        </button>
                         <a href="{$modulelink}&action=delete_personel&id={$personel.id}&{$csrfTokenName}={$csrfToken}" class="btn btn-xs btn-danger btn-delete-confirm" data-message="{$LANG.confirmDeletePersonelText|sprintf:"`$personel.ad` `$personel.soyad`"|escape:'javascript'}" title="{$LANG.deleteButton}">
                            <i class="fas fa-trash"></i>
                         </a>
                    </td>
                </tr>
            {foreachelse}
                <tr>
                    <td colspan="5" class="text-center">{$LANG.noPersonelFound}</td>
                </tr>
            {/foreach}
        </tbody>
    </table>
</div>
{$pagination_output}

<div class="modal fade" id="addEditPersonelModal" tabindex="-1" role="dialog" aria-labelledby="addEditPersonelModalLabel">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form method="post" action="{$modulelink}&action=save_single_personel" id="editPersonelForm">
                <input type="hidden" name="{$csrfTokenName}" value="{$csrfToken}">
                <input type="hidden" name="modal_personel_data[id]" id="personel_id_modal" value="0">

                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    <h4 class="modal-title" id="addEditPersonelModalLabel"></h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6"><div class="form-group"><label for="modal_ad" class="control-label required">Adı</label><input type="text" name="modal_personel_data[ad]" id="modal_ad" class="form-control" required></div></div>
                        <div class="col-md-6"><div class="form-group"><label for="modal_soyad" class="control-label required">Soyadı</label><input type="text" name="modal_personel_data[soyad]" id="modal_soyad" class="form-control" required></div></div>
                    </div>
                    <div class="row">
                        <div class="col-md-6"><div class="form-group"><label for="modal_tckn" class="control-label required">TC Kimlik No</label><input type="text" name="modal_personel_data[tckn]" id="modal_tckn" class="form-control" maxlength="11" required></div></div>
                        <div class="col-md-6"><div class="form-group"><label for="modal_unvan" class="control-label">Ünvan</label><input type="text" name="modal_personel_data[unvan]" id="modal_unvan" class="form-control"></div></div>
                    </div>
                    <div class="row">
                        <div class="col-md-6"><div class="form-group"><label for="modal_email" class="control-label required">E-posta</label><input type="email" name="modal_personel_data[email]" id="modal_email" class="form-control" required></div></div>
                        <div class="col-md-6"><div class="form-group"><label for="modal_departman_id" class="control-label">Çalıştığı Birim</label><select name="modal_personel_data[departman_id]" id="modal_departman_id" class="form-control"><option value="">{$LANG.selectOption}</option>{foreach from=$departmanlar item=dept}<option value="{$dept.id}">{$dept.departman_adi|escape}</option>{/foreach}</select></div></div>
                    </div>
                    <hr>
                    <h4>İK Bilgileri (Opsiyonel)</h4>
                    <div class="row">
                        <div class="col-md-6"><div class="form-group"><label for="modal_ise_baslama_tarihi">İşe Başlama Tarihi</label><input type="text" class="form-control date-picker" name="modal_personel_data[ise_baslama_tarihi]" id="modal_ise_baslama_tarihi"></div></div>
                        <div class="col-md-6"><div class="form-group"><label for="modal_isten_ayrilma_tarihi">İşten Ayrılma Tarihi</label><input type="text" class="form-control date-picker" name="modal_personel_data[isten_ayrilma_tarihi]" id="modal_isten_ayrilma_tarihi"></div></div>
                    </div>
                     <div class="form-group"><label for="modal_acik_adres">Açık Adres</label><textarea name="modal_personel_data[acik_adres]" id="modal_acik_adres" class="form-control" rows="2"></textarea></div>
                    <div class="row">
                        <div class="col-md-6"><div class="form-group"><label for="modal_acil_durum_kisi_adi">Acil Durum Kişisi</label><input type="text" name="modal_personel_data[acil_durum_kisi_adi]" id="modal_acil_durum_kisi_adi" class="form-control"></div></div>
                        <div class="col-md-6"><div class="form-group"><label for="modal_acil_durum_kisi_gsm">Acil Durum GSM</label><input type="text" name="modal_personel_data[acil_durum_kisi_gsm]" id="modal_acil_durum_kisi_gsm" class="form-control"></div></div>
                    </div>
                    <div class="form-group">
                        <div class="btk-switch">
                            <input type="checkbox" name="modal_personel_data[btk_listesine_eklensin]" id="modal_btk_listesine_eklensin" value="1">
                            <label for="modal_btk_listesine_eklensin" class="btk-slider round"></label>
                        </div>
                        <label for="modal_btk_listesine_eklensin" style="margin-left:5px;">BTK Rapor Listesine Dahil Et</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">{$LANG.closeButton}</button>
                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> {$LANG.saveChanges}</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script type="text/javascript">
$(document).ready(function() {
    
    $('.edit-personel-btn').on('click', function() {
        var button = $(this);
        var modal = $('#addEditPersonelModal');
        var form = modal.find('form');
        
        form[0].reset();
        modal.find('.modal-title').text('Personel Düzenle');
        
        form.find('#personel_id_modal').val(button.data('personel-id'));
        form.find('#modal_ad').val(button.data('ad'));
        form.find('#modal_soyad').val(button.data('soyad'));
        form.find('#modal_tckn').val(button.data('tckn'));
        form.find('#modal_unvan').val(button.data('unvan'));
        form.find('#modal_email').val(button.data('email'));
        form.find('#modal_departman_id').val(button.data('departman-id'));
        
        var iseBaslamaTarihi = button.data('ise-baslama-tarihi');
        if (iseBaslamaTarihi && iseBaslamaTarihi !== '0000-00-00') {
            form.find('#modal_ise_baslama_tarihi').val(iseBaslamaTarihi);
        } else {
            form.find('#modal_ise_baslama_tarihi').val('');
        }

        var istenAyrilmaTarihi = button.data('isten-ayrilma-tarihi');
        if (istenAyrilmaTarihi && istenAyrilmaTarihi !== '0000-00-00') {
            form.find('#modal_isten_ayrilma_tarihi').val(istenAyrilmaTarihi);
        } else {
            form.find('#modal_isten_ayrilma_tarihi').val('');
        }
        
        form.find('#modal_acik_adres').val(button.data('acik-adres'));
        form.find('#modal_acil_durum_kisi_adi').val(button.data('acil-durum-kisi-adi'));
        form.find('#modal_acil_durum_kisi_gsm').val(button.data('acil-durum-kisi-gsm'));
        form.find('#modal_btk_listesine_eklensin').prop('checked', button.data('btk-listesine-eklensin') == 1);
        
        modal.modal('show');
    });

    $('#btnAddNewPersonel').on('click', function() {
        var modal = $('#addEditPersonelModal');
        var form = modal.find('form');
        
        form[0].reset();
        modal.find('.modal-title').text('Yeni Personel Ekle');
        form.find('#personel_id_modal').val('0');
        form.find('#modal_btk_listesine_eklensin').prop('checked', true);

        modal.modal('show');
    });

    if ($.fn.datepicker) {
        $('.date-picker').datepicker({ dateFormat: 'yy-mm-dd' });
    }
});
</script>