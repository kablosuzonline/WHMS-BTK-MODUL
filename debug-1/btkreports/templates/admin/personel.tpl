{*
    WHMCS BTK Raporlama Modülü - Personel Yönetimi Sayfası
    Dosya: templates/admin/personel.tpl
*}

{if $flashMessage}
    {if $flashMessage.type == 'success'}
        <div class="alert alert-success text-center" role="alert">
            <i class="fas fa-check-circle"></i> {$flashMessage.message}
        </div>
    {elseif $flashMessage.type == 'error'}
        <div class="alert alert-danger text-center" role="alert">
            <i class="fas fa-exclamation-circle"></i> {$flashMessage.message}
        </div>
    {else}
        <div class="alert alert-info text-center" role="alert">
            <i class="fas fa-info-circle"></i> {$flashMessage.message}
        </div>
    {/if}
{/if}

<p>{$LANG.personelIntroText}</p>
<p>{$LANG.personelHelpText}</p>

{* Yeni personel ekleme butonu veya WHMCS adminlerinden senkronize etme butonu eklenebilir.
   Şimdilik WHMCS adminleri ile senkronizasyonun hook ve _activate ile yapıldığını varsayıyoruz.
   Eksik bilgiler bu listeden düzenlenecek.
*}

<form method="post" action="{$modulelink}&action=save_personel_list">
    <input type="hidden" name="token" value="{$csrfToken}"> {* CSRF Token - btkreports.php'den atanmalı *}

    <div class="tablebg">
        <table id="tblPersonelList" class="datatable" width="100%" border="0" cellspacing="1" cellpadding="3">
            <thead>
                <tr>
                    <th>{$LANG.personelAdiHeader}</th>
                    <th>{$LANG.personelSoyadiHeader}</th>
                    <th>{$LANG.personelTcKimlikNoHeader}</th>
                    <th>{$LANG.personelUnvanHeader}</th>
                    <th>{$LANG.personelCalistigiBirimHeader}</th>
                    <th>{$LANG.personelEpostaHeader}</th>
                    <th>{$LANG.personelBtkListesineEklensinHeader} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.personelBtkListesineEklensinTooltip|escape}"></i></th>
                    <th width="100">{$LANG.actionsHeader}</th>
                </tr>
            </thead>
            <tbody>
                {if $personelListesi}
                    {foreach from=$personelListesi item=personel}
                        <tr data-personel-id="{$personel->id}">
                            <td>{$personel->adi|escape}</td>
                            <td>{$personel->soyadi|escape}</td>
                            <td>
                                <input type="text" name="personel_data[{$personel->id}][tc_kimlik_no]" value="{$personel->tc_kimlik_no|escape}" class="form-control input-sm tckn-input" maxlength="11" placeholder="{$LANG.personelTcKimlikNoPlaceholder}">
                                <span class="tckn-validation-status" data-admin-id="{$personel->admin_id}"></span>
                            </td>
                            <td><input type="text" name="personel_data[{$personel->id}][unvan]" value="{$personel->unvan|escape}" class="form-control input-sm" placeholder="{$LANG.personelUnvanPlaceholder}"></td>
                            <td><input type="text" name="personel_data[{$personel->id}][calistigi_birim]" value="{$personel->calistigi_birim|escape}" class="form-control input-sm" placeholder="{$LANG.personelCalistigiBirimPlaceholder}"></td>
                            <td>{$personel->eposta_adresi|escape}</td>
                            <td class="text-center">
                                <input type="hidden" name="personel_data[{$personel->id}][btk_listesine_eklensin_hidden]" value="0"> {* Checkbox işaretlenmezse 0 gönderilmesi için *}
                                <input type="checkbox" name="personel_data[{$personel->id}][btk_listesine_eklensin]" value="1" class="btk-toggle" data-toggle="toggle" data-size="mini" {if $personel->btk_listesine_eklensin == 1}checked{/if}>
                            </td>
                            <td class="text-center">
                                <button type="button" class="btn btn-xs btn-info btn-edit-personel" data-personel-id="{$personel->id}" data-toggle="modal" data-target="#editPersonelModal">
                                    <i class="fas fa-edit"></i> {$LANG.editButton}
                                </button>
                                 {* Silme butonu genellikle personel WHMCS admininden silinince otomatik senkronize olmalı.
                                    Burada modüle özel bir silme gerekiyorsa eklenebilir, ancak dikkatli olunmalı.
                                 <button type="button" class="btn btn-xs btn-danger btn-delete-personel" data-personel-id="{$personel->id}">
                                    <i class="fas fa-trash"></i> {$LANG.deleteButton}
                                </button>
                                 *}
                            </td>
                        </tr>
                    {/foreach}
                {else}
                    <tr>
                        <td colspan="8" class="text-center">{$LANG.noPersonelFound}</td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>

    <div class="form-group text-center" style="margin-top: 20px;">
        <button type="submit" class="btn btn-success btn-lg"><i class="fas fa-save"></i> {$LANG.savePersonelChangesButton}</button>
        <a href="{$modulelink}" class="btn btn-default btn-lg"><i class="fas fa-times"></i> {$LANG.cancelButton}</a>
    </div>
</form>
// --- BÖLÜM 1 / 2 SONU - (personel.tpl, Personel Listesi ve Filtreleme)

// --- BÖLÜM 2 / 2 BAŞI - (personel.tpl, Personel Düzenleme Modal Penceresi)
{* Personel Detaylı Düzenleme Modal Penceresi *}
<div class="modal fade" id="editPersonelModal" tabindex="-1" role="dialog" aria-labelledby="editPersonelModalLabel">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form method="post" action="{$modulelink}&action=save_single_personel" id="editPersonelForm">
                <input type="hidden" name="token" value="{$csrfToken}">
                <input type="hidden" name="personel_id_modal" id="personel_id_modal" value="">
                <input type="hidden" name="admin_id_modal" id="admin_id_modal" value="">


                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    <h4 class="modal-title" id="editPersonelModalLabel">{$LANG.editPersonelModalTitle} (<span id="modalPersonelName"></span>)</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_adi">{$LANG.personelAdiLabel}</label>
                                <input type="text" name="modal_personel_data[adi]" id="modal_adi" class="form-control" readonly>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_soyadi">{$LANG.personelSoyadiLabel}</label>
                                <input type="text" name="modal_personel_data[soyadi]" id="modal_soyadi" class="form-control" readonly>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_tc_kimlik_no">{$LANG.personelTcKimlikNoLabel} *</label>
                                <input type="text" name="modal_personel_data[tc_kimlik_no]" id="modal_tc_kimlik_no" class="form-control tckn-input-modal" maxlength="11" required>
                                <span class="tckn-validation-status-modal"></span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_eposta_adresi">{$LANG.personelEpostaLabel}</label>
                                <input type="email" name="modal_personel_data[eposta_adresi]" id="modal_eposta_adresi" class="form-control" readonly>
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
                                <label for="modal_calistigi_birim">{$LANG.personelCalistigiBirimLabel} *</label>
                                <input type="text" name="modal_personel_data[calistigi_birim]" id="modal_calistigi_birim" class="form-control" required>
                            </div>
                        </div>
                    </div>
                     <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_mobil_telefonu">{$LANG.personelMobilTelefonuLabel}</label>
                                <input type="text" name="modal_personel_data[mobil_telefonu]" id="modal_mobil_telefonu" class="form-control" placeholder="5xxxxxxxxx">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_sabit_telefonu">{$LANG.personelSabitTelefonuLabel}</label>
                                <input type="text" name="modal_personel_data[sabit_telefonu]" id="modal_sabit_telefonu" class="form-control" placeholder="212xxxxxxx">
                            </div>
                        </div>
                    </div>
                    <hr>
                    <h5>{$LANG.personelIkInfoHeader} (BTK Raporu İçin Gerekli Değil)</h5>
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
                        <textarea name="modal_personel_data[acil_durum_kisisi]" id="modal_acil_durum_kisisi" class="form-control" rows="2"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="modal_is_birakma_nedeni">{$LANG.personelIsBirakmaNedeniLabel}</label>
                        <textarea name="modal_personel_data[is_birakma_nedeni]" id="modal_is_birakma_nedeni" class="form-control" rows="2"></textarea>
                    </div>
                    <hr>
                    <div class="form-group">
                        <label>{$LANG.personelBtkListesineEklensinLabelModal}</label>
                        <div>
                             <input type="checkbox" name="modal_personel_data[btk_listesine_eklensin]" id="modal_btk_listesine_eklensin" class="btk-toggle" data-toggle="toggle" data-on="{$LANG.yes}" data-off="{$LANG.no}">
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

<script type="text/javascript">
$(document).ready(function() {
    $('#tblPersonelList').DataTable({literal}{"language": {"url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Turkish.json"}}{/literal});
    $('.btk-toggle').bootstrapToggle();
    $('[data-toggle="tooltip"]').tooltip();

    // Tarih seçicileri etkinleştir (flatpickr veya bootstrap-datepicker)
    $(".date-picker").flatpickr({
        dateFormat: "Y-m-d",
        allowInput: true
    });

    // TCKN Doğrulama (Liste üzerinde anlık - opsiyonel)
    // Bu, NVI'ye çok fazla istek gönderebilir, dikkatli kullanılmalı veya sadece modal içinde yapılmalı.
    /*
    $('.tckn-input').on('blur', function() {
        var tckn = $(this).val();
        var statusSpan = $(this).closest('td').find('.tckn-validation-status');
        var adminId = statusSpan.data('admin-id'); // İlgili adminin adını soyadını vs. de alıp NVI'ye gönderebiliriz.
        if (tckn.length === 11) {
            statusSpan.html('<i class="fas fa-spinner fa-spin text-info"></i>');
            // AJAX ile btkreports.php'ye TCKN doğrulama isteği gönder
            // $.post(...);
        } else if (tckn.length > 0) {
            statusSpan.html('<i class="fas fa-times-circle text-danger" title="TCKN 11 haneli olmalıdır"></i>');
        } else {
            statusSpan.html('');
        }
    });
    */

    // Personel Düzenleme Modalını Doldurma
    $('.btn-edit-personel').click(function() {
        var personelId = $(this).data('personel-id');
        $('#personel_id_modal').val(personelId);
        $('#modalPersonelName').text(''); // Önce temizle
        $('.tckn-validation-status-modal').html('');

        // AJAX ile personel detaylarını çek
        $.post("{$modulelink}&ajax=1&action=get_personel_details", {
            {literal}
            csrfToken: getWhmcsCSRFToken(),
            personel_id: personelId
            {/literal}
        }, function(data) {
            if (data.status === 'success' && data.personel) {
                var p = data.personel;
                $('#modalPersonelName').text(p.adi + ' ' + p.soyadi);
                $('#admin_id_modal').val(p.admin_id);
                $('#modal_adi').val(p.adi);
                $('#modal_soyadi').val(p.soyadi);
                $('#modal_tc_kimlik_no').val(p.tc_kimlik_no);
                $('#modal_eposta_adresi').val(p.eposta_adresi);
                $('#modal_unvan').val(p.unvan);
                $('#modal_calistigi_birim').val(p.calistigi_birim);
                $('#modal_mobil_telefonu').val(p.mobil_telefonu);
                $('#modal_sabit_telefonu').val(p.sabit_telefonu);
                $('#modal_ise_baslama_tarihi').val(p.ise_baslama_tarihi_formatted); // YYYY-MM-DD formatında
                $('#modal_isten_ayrilma_tarihi').val(p.isten_ayrilma_tarihi_formatted); // YYYY-MM-DD formatında
                $('#modal_ev_adresi').val(p.ev_adresi);
                $('#modal_acil_durum_kisisi').val(p.acil_durum_kisisi);
                $('#modal_is_birakma_nedeni').val(p.is_birakma_nedeni);

                if (p.btk_listesine_eklensin == 1) {
                    $('#modal_btk_listesine_eklensin').bootstrapToggle('on');
                } else {
                    $('#modal_btk_listesine_eklensin').bootstrapToggle('off');
                }
                $('#editPersonelModal').modal('show');
            } else {
                alert(data.message || '{$LANG.errorFetchingPersonelDetails}');
            }
        }, "json").fail(function() {
            alert('{$LANG.ajaxRequestFailed}');
        });
    });

    // Modal TCKN Doğrulama
    $('.tckn-input-modal').on('blur', function() {
        var tckn = $(this).val();
        var statusSpan = $('.tckn-validation-status-modal');
        // Modal içindeki Ad, Soyad, Doğum Yılı gibi bilgileri de alıp NVI'ye göndermek daha doğru olur.
        var ad = $('#modal_adi').val();
        var soyad = $('#modal_soyadi').val();
        // Doğum yılı için ayrı bir alan eklenebilir veya TCKN servisi sadece TCKN ile çalışıyorsa o kullanılır.

        if (tckn.length === 11) {
            statusSpan.html('<i class="fas fa-spinner fa-spin text-info"></i>');
            $.post("{$modulelink}&ajax=1&action=validate_tckn_personel", {
                {literal}
                csrfToken: getWhmcsCSRFToken(),
                tckn: tckn,
                ad: ad, // NVI servisi gerektiriyorsa
                soyad: soyad // NVI servisi gerektiriyorsa
                // dogum_yili: ... // NVI servisi gerektiriyorsa
                {/literal}
            }, function(data) {
                if (data.status === 'success' && data.isValid) {
                    statusSpan.html('<i class="fas fa-check-circle text-success" title="' + (data.message || '{$LANG.tcknValid}') + '"></i>');
                } else {
                    statusSpan.html('<i class="fas fa-times-circle text-danger" title="' + (data.message || '{$LANG.tcknInvalid}') + '"></i>');
                }
            }, "json").fail(function() {
                statusSpan.html('<i class="fas fa-exclamation-triangle text-warning" title="{$LANG.tcknValidationFailedAjax}"></i>');
            });
        } else if (tckn.length > 0) {
            statusSpan.html('<i class="fas fa-times-circle text-danger" title="{$LANG.tcknMustBe11Digits}"></i>');
        } else {
            statusSpan.html('');
        }
    });


    // Modal Kaydetme Formu
    $('#editPersonelForm').submit(function(e) {
        var tcknStatusIcon = $('.tckn-validation-status-modal').find('i');
        if (tcknStatusIcon.hasClass('fa-times-circle') || tcknStatusIcon.hasClass('fa-exclamation-triangle')) {
            if (!confirm('{$LANG.tcknNotValidatedWarningConfirm}')) {
                e.preventDefault();
                return false;
            }
        }
        // Form submit ediliyor... (AJAX ile yapılabilir veya normal post)
    });

});
</script>