// --- BÖLÜM 1 / 2 BAŞI - (iss_pop_management.tpl, POP Noktası Listesi ve Filtreleme/Ekleme Butonu)
{*
    WHMCS BTK Raporlama Modülü - ISS POP Noktası Yönetimi Sayfası
    Dosya: templates/admin/iss_pop_management.tpl
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

<p>{$LANG.issPopManagementIntro}</p>

<div class="text-right" style="margin-bottom: 15px;">
    <button type="button" class="btn btn-success" data-toggle="modal" data-target="#addEditPopModal" data-mode="add">
        <i class="fas fa-plus-circle"></i> {$LANG.addNewPopButton}
    </button>
</div>

<div class="tablebg">
    <table id="tblPopDefinitions" class="datatable" width="100%" border="0" cellspacing="1" cellpadding="3">
        <thead>
            <tr>
                <th>{$LANG.popKoduHeader}</th>
                <th>{$LANG.popAdiHeader}</th>
                <th>{$LANG.popTipiHeader}</th>
                <th>{$LANG.popIlIlceHeader}</th>
                <th>{$LANG.popYayinYapilanSsidHeader}</th>
                <th>{$LANG.popYonetimIpHeader}</th>
                <th>{$LANG.popDurumHeader}</th>
                <th width="120">{$LANG.actionsHeader}</th>
            </tr>
        </thead>
        <tbody>
            {if $popDefinitions}
                {foreach from=$popDefinitions item=pop}
                    <tr>
                        <td>{$pop->pop_kodu|escape}</td>
                        <td>{$pop->pop_adi|escape}</td>
                        <td>{$pop->pop_tipi|escape}</td>
                        <td>{$pop->il_adi|default:''}{if $pop->il_adi && $pop->ilce_adi} / {/if}{$pop->ilce_adi|default:''}</td>
                        <td>{$pop->yayin_yapilan_ssid|escape}</td>
                        <td>{$pop->yonetim_ip_adresi|escape}</td>
                        <td>
                            {if $pop->aktif_pasif_durum == 1}
                                <span class="label label-success">{$LANG.statusActive}</span>
                            {else}
                                <span class="label label-danger">{$LANG.statusPassive}</span>
                            {/if}
                        </td>
                        <td class="text-center">
                            <button type="button" class="btn btn-xs btn-info btn-edit-pop"
                                    data-pop-id="{$pop->id}"
                                    data-toggle="modal" data-target="#addEditPopModal" data-mode="edit">
                                <i class="fas fa-edit"></i> {$LANG.editButton}
                            </button>
                            <button type="button" class="btn btn-xs btn-danger btn-delete-pop"
                                    data-pop-id="{$pop->id}" data-pop-name="{$pop->pop_adi|escape}">
                                <i class="fas fa-trash"></i> {$LANG.deleteButton}
                            </button>
                        </td>
                    </tr>
                {/foreach}
            {else}
                <tr>
                    <td colspan="8" class="text-center">{$LANG.noPopDefinitionsFound}</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>
// --- BÖLÜM 1 / 2 SONU - (iss_pop_management.tpl, POP Noktası Listesi ve Filtreleme/Ekleme Butonu)

// --- BÖLÜM 2 / 2 BAŞI - (iss_pop_management.tpl, POP Ekleme/Düzenleme Modal Penceresi ve JavaScript)
{* POP Ekleme/Düzenleme Modal Penceresi *}
<div class="modal fade" id="addEditPopModal" tabindex="-1" role="dialog" aria-labelledby="addEditPopModalLabel">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form method="post" action="{$modulelink}&action=save_pop_definition" id="popDefinitionForm">
                <input type="hidden" name="token" value="{$csrfToken}">
                <input type="hidden" name="pop_id_modal" id="pop_id_modal" value="">

                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    <h4 class="modal-title" id="addEditPopModalLabel">{$LANG.addNewPopButton}</h4>
                </div>
                <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                    {* Temel POP Bilgileri *}
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="modal_pop_kodu">{$LANG.popKoduLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.popKoduTooltip|escape}"></i></label>
                                <input type="text" name="popdata[pop_kodu]" id="modal_pop_kodu" class="form-control">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="form-group">
                                <label for="modal_pop_adi">{$LANG.popAdiLabel} *</label>
                                <input type="text" name="popdata[pop_adi]" id="modal_pop_adi" class="form-control" required>
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
                                <label for="modal_btk_pop_bilgisi">{$LANG.btkPopBilgisiLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.btkPopBilgisiTooltip|escape}"></i></label>
                                <input type="text" name="popdata[btk_pop_bilgisi]" id="modal_btk_pop_bilgisi" class="form-control" placeholder="{$LANG.btkPopBilgisiPlaceholder|escape}">
                            </div>
                        </div>
                    </div>

                    {* Lokasyon Bilgileri *}
                    <hr><h4><i class="fas fa-map-marker-alt"></i> {$LANG.popLocationInfoTitle}</h4>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="modal_il_id">{$LANG.adresIlLabel} *</label>
                                <select name="popdata[il_id]" id="modal_il_id" class="form-control adres-il-select" data-target-ilce="modal_ilce_id" required>
                                    <option value="">{$LANG.selectIlOption}</option>
                                    {foreach from=$iller item=il}
                                        <option value="{$il->id}">{$il->il_adi|escape}</option>
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
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="modal_uavt_adres_kodu">{$LANG.popUavtAdresKoduLabel}</label>
                                <input type="text" name="popdata[uavt_adres_kodu]" id="modal_uavt_adres_kodu" class="form-control">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="modal_enlem">{$LANG.popEnlemLabel}</label>
                                <input type="text" name="popdata[enlem]" id="modal_enlem" class="form-control" placeholder="Örn: 39.9207700">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="modal_boylam">{$LANG.popBoylamLabel}</label>
                                <input type="text" name="popdata[boylam]" id="modal_boylam" class="form-control" placeholder="Örn: 32.8541100">
                            </div>
                        </div>
                    </div>

                    {* Teknik Detaylar *}
                    <hr><h4><i class="fas fa-network-wired"></i> {$LANG.popTechnicalInfoTitle}</h4>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_yayin_yapilan_ssid">{$LANG.popYayinYapilanSsidLabel}</label>
                                <input type="text" name="popdata[yayin_yapilan_ssid]" id="modal_yayin_yapilan_ssid" class="form-control">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="modal_yonetim_ip_adresi">{$LANG.popYonetimIpLabel}</label>
                                <input type="text" name="popdata[yonetim_ip_adresi]" id="modal_yonetim_ip_adresi" class="form-control" placeholder="IPv4 veya IPv6">
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="modal_ip_bloklari">{$LANG.popIpBloklariLabel}</label>
                        <textarea name="popdata[ip_bloklari]" id="modal_ip_bloklari" class="form-control" rows="2" placeholder="{$LANG.popIpBloklariPlaceholder|escape}"></textarea>
                    </div>
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

                    {* Diğer Bilgiler *}
                    <hr><h4><i class="fas fa-info"></i> {$LANG.popOtherInfoTitle}</h4>
                     <div class="form-group">
                        <label for="modal_aktif_pasif_durum">{$LANG.popDurumLabel}</label>
                        <div>
                            <input type="checkbox" name="popdata[aktif_pasif_durum]" id="modal_aktif_pasif_durum" class="btk-toggle" data-toggle="toggle" data-on="{$LANG.statusActive}" data-off="{$LANG.statusPassive}" checked>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="modal_notlar">{$LANG.popNotlarLabel}</label>
                        <textarea name="popdata[notlar]" id="modal_notlar" class="form-control" rows="3"></textarea>
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

<script type="text/javascript">
$(document).ready(function() {
    $('#tblPopDefinitions').DataTable({literal}{"language": {"url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Turkish.json"}, "order": [[ 1, "asc" ]] }{/literal});
    $('.btk-toggle').bootstrapToggle();
    $('[data-toggle="tooltip"]').tooltip();

    // Dinamik Adres Dropdownları (Modal için)
    // Bu fonksiyon btk_admin_scripts.js'e taşınabilir
    function populateModalDropdown(sourceElement, targetElementId, actionSuffix, parentIdValue, defaultOptionLangKey, selectedValue) {
        var targetElement = $('#' + targetElementId);
        var defaultOptionText = LANG[defaultOptionLangKey] || '{$LANG.selectOption|escape:"javascript"}';
        targetElement.html('<option value="">' + defaultOptionText + '</option>').prop('disabled', true);

        var nextSelect = targetElement.closest('.col-md-4').nextAll('.col-md-4').find('select.adres-select');
        while(nextSelect.length > 0) {
            var nextDefaultOptionKey = nextSelect.data('default-option-key') || 'selectOption';
            nextSelect.html('<option value="">' + (LANG[nextDefaultOptionKey] || '{$LANG.selectOption|escape:"javascript"}') + '</option>').prop('disabled', true);
            if (nextSelect.data('target-ilce') || nextSelect.data('target-mahalle')) {
                 nextSelect = nextSelect.closest('.col-md-4').nextAll('.col-md-4').find('select.adres-select');
            } else {
                nextSelect = $();
            }
        }

        if (parentIdValue) {
            targetElement.prop('disabled', false);
            targetElement.html('<option value="">{$LANG.loadingData|escape:"javascript"}</option>');
            $.post("{$modulelink}&ajax=1&action=get_adres_data_" + actionSuffix, {
                {literal}
                csrfToken: getWhmcsCSRFToken(),
                parent_id: parentIdValue
                {/literal}
            }, function(data) {
                targetElement.html('<option value="">' + defaultOptionText + '</option>');
                if (data.status === 'success' && data.items) {
                    $.each(data.items, function(key, item) {
                        var option = $('<option></option>').attr('value', item.id).text(item.name); // Adres tabloları için ID'yi value olarak sakla
                        if (selectedValue && item.id == selectedValue) { // ID ile karşılaştır
                            option.prop('selected', true);
                        }
                        targetElement.append(option);
                    });
                     if (selectedValue && targetElement.val() == selectedValue) {
                        targetElement.trigger('change'); // Bir sonraki dropdown'u tetikle
                    }
                } else {
                     targetElement.html('<option value="">' + (data.message || '{$LANG.noDataFound|escape:"javascript"}') + '</option>');
                }
            }, "json").fail(function() {
                 targetElement.html('<option value="">{$LANG.ajaxRequestFailed|escape:"javascript"}</option>');
            });
        } else {
            targetElement.html('<option value="">' + defaultOptionText + '</option>').prop('disabled', true);
        }
    }

    $('#modal_il_id').change(function() {
        var ilId = $(this).val(); // Bu artık il_id (int)
        var targetIlceId = $(this).data('target-ilce');
        // Düzenleme modunda, eğer il değişmediyse, kayıtlı ilçe seçili gelmeli
        var selectedIlceId = ($('#pop_id_modal').val() && $(this).data('original-il-id') == ilId) ? $(this).data('original-ilce-id') : null;
        populateModalDropdown($(this), targetIlceId, 'ilceler', ilId, 'selectIlceOption', selectedIlceId);
    });

    $('#modal_ilce_id').change(function() {
        var ilceId = $(this).val(); // Bu artık ilce_id (int)
        var targetMahalleId = $(this).data('target-mahalle');
        var selectedMahalleId = ($('#pop_id_modal').val() && $(this).data('original-ilce-id') == ilceId) ? $(this).data('original-mahalle-id') : null;
        populateModalDropdown($(this), targetMahalleId, 'mahalleler', ilceId, 'selectMahalleOption', selectedMahalleId);
    });


    // Modal Açma/Kapama ve Form Temizleme/Doldurma
    $('#addEditPopModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var mode = button.data('mode');
        var modal = $(this);
        var popId = button.data('pop-id');

        modal.find('#popDefinitionForm')[0].reset(); // Formu temizle
        modal.find('#pop_id_modal').val('');
        $('#modal_aktif_pasif_durum').bootstrapToggle('on'); // Varsayılan aktif
        // Adres dropdownlarını sıfırla
        $('#modal_ilce_id').html('<option value="">{$LANG.selectIlceOption}</option>').prop('disabled', true);
        $('#modal_mahalle_id').html('<option value="">{$LANG.selectMahalleOption}</option>').prop('disabled', true);


        if (mode === 'edit') {
            modal.find('.modal-title').text('{$LANG.editPopModalTitle}');
            modal.find('#pop_id_modal').val(popId);

            // AJAX ile POP detaylarını çek ve formu doldur
            $.post("{$modulelink}&ajax=1&action=get_pop_details", {
                {literal}
                csrfToken: getWhmcsCSRFToken(),
                pop_id: popId
                {/literal}
            }, function(data) {
                if (data.status === 'success' && data.pop) {
                    var p = data.pop;
                    $('#modal_pop_kodu').val(p.pop_kodu);
                    $('#modal_pop_adi').val(p.pop_adi);
                    $('#modal_yayin_yapilan_ssid').val(p.yayin_yapilan_ssid);
                    $('#modal_yonetim_ip_adresi').val(p.yonetim_ip_adresi);
                    $('#modal_ip_bloklari').val(p.ip_bloklari);
                    $('#modal_cihaz_turu').val(p.cihaz_turu);
                    $('#modal_cihaz_markasi').val(p.cihaz_markasi);
                    $('#modal_cihaz_modeli').val(p.cihaz_modeli);
                    $('#modal_pop_tipi').val(p.pop_tipi);
                    $('#modal_btk_pop_bilgisi').val(p.btk_pop_bilgisi);

                    if (p.il_id) {
                        $('#modal_il_id').val(p.il_id).data('original-il-id', p.il_id).data('original-ilce-id', p.ilce_id).data('original-mahalle-id', p.mahalle_id).trigger('change');
                        // populateModalDropdown tetiklenince ilçe ve mahalle de seçili gelecektir.
                    }

                    $('#modal_tam_adres_detay').val(p.tam_adres_detay);
                    $('#modal_uavt_adres_kodu').val(p.uavt_adres_kodu);
                    $('#modal_enlem').val(p.enlem);
                    $('#modal_boylam').val(p.boylam);
                    $('#modal_notlar').val(p.notlar);

                    if (p.aktif_pasif_durum == 1) {
                        $('#modal_aktif_pasif_durum').bootstrapToggle('on');
                    } else {
                        $('#modal_aktif_pasif_durum').bootstrapToggle('off');
                    }
                } else {
                    alert(data.message || '{$LANG.errorFetchingPopDetails}');
                    modal.modal('hide');
                }
            }, "json").fail(function() {
                alert('{$LANG.ajaxRequestFailed}');
                modal.modal('hide');
            });

        } else { // Add mode
            modal.find('.modal-title').text('{$LANG.addNewPopButton}');
            // İl dropdown'u için original-id'leri temizle
            $('#modal_il_id').removeData('original-il-id').removeData('original-ilce-id').removeData('original-mahalle-id');
        }
    });

    // POP Silme Onayı
    $('.btn-delete-pop').click(function() {
        var popId = $(this).data('pop-id');
        var popName = $(this).data('pop-name');
        if (confirm(LANG['confirmDeletePopText'].replace('%s', popName))) {
            // AJAX ile silme işlemi veya form post
             window.location.href = '{$modulelink}&action=delete_pop_definition&pop_id=' + popId + '&token={$csrfToken}';
        }
    });

});
</script>
// --- BÖLÜM 2 / 2 SONU - (iss_pop_management.tpl, POP Ekleme/Düzenleme Modal Penceresi ve JavaScript)