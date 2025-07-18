{*
    WHMCS BTK Raporlama Modülü - Hizmet Detayları BTK Bilgi Formu
    Dosya: templates/admin/service_details_btk_form.tpl
    Bu şablon, WHMCS hizmet detayları sayfasına bir sekme olarak veya
    uygun bir alana hook (AdminServiceEdit) ile enjekte edilecek BTK'ya özel alanları içerir.
    Özellikle TESİS ADRESİ bilgilerine odaklanır.
*}

{if $btkServiceValidationErrorMessages}
    <div class="alert alert-danger">
        <strong>{$LANG.validationErrorsOccurred}:</strong>
        <ul>
            {foreach from=$btkServiceValidationErrorMessages item=message}
                <li>{$message}</li>
            {/foreach}
        </ul>
    </div>
{/if}

<form method="post" action="{$modulelink}&action=save_service_btk_details&id={$serviceid}&userid={$clientid}"> {* serviceid ve userid WHMCS'den gelir *}
    <input type="hidden" name="token" value="{$csrfToken}">
    <input type="hidden" name="btk_rehber_id" value="{$btkServiceData.id|default:''}"> {* Eğer mevcut bir kayıt varsa ID'si *}
    <input type="hidden" name="service_id_hidden" value="{$serviceid}">
    <input type="hidden" name="client_id_hidden" value="{$clientid}">

    {* Temel Hizmet Bilgileri (BTK için gerekli) *}
    <h4><i class="fas fa-concierge-bell"></i> {$LANG.serviceBtkInfoTitle}</h4>
    <div class="row">
        <div class="col-md-4">
            <div class="form-group">
                <label for="service_hat_no">{$LANG.serviceHatNoLabel} * <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.serviceHatNoTooltip|escape}"></i></label>
                <input type="text" name="btkservicedata[hat_no]" id="service_hat_no" value="{$btkServiceData.hat_no|default:$whmcsServicedata.dedicatedip|default:$whmcsServicedata.domain|escape}" class="form-control" required>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label for="service_hizmet_tipi">{$LANG.serviceHizmetTipiLabel} * <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.serviceHizmetTipiTooltip|escape}"></i></label>
                <select name="btkservicedata[hizmet_tipi]" id="service_hizmet_tipi" class="form-control" required>
                    <option value="">{$LANG.selectOption}</option>
                    {foreach from=$hizmetTipleri item=hizmet} {* $hizmetTipleri btkreports.php'den (EK-3) atanmalı *}
                        <option value="{$hizmet->hizmet_kodu}" {if $btkServiceData.hizmet_tipi == $hizmet->hizmet_kodu}selected{/if}>{$hizmet->hizmet_adi|escape} ({$hizmet->hizmet_kodu})</option>
                    {/foreach}
                </select>
            </div>
        </div>
        <div class="col-md-4">
             <div class="form-group">
                <label for="service_abone_tarife">{$LANG.serviceAboneTarifeLabel}</label>
                <input type="text" name="btkservicedata[abone_tarife]" id="service_abone_tarife" value="{$btkServiceData.abone_tarife|default:$whmcsServicedata.package_name|escape}" class="form-control">
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-4">
            <div class="form-group">
                <label for="service_abone_baslangic">{$LANG.serviceAboneBaslangicLabel} * <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.dateFormatYYYYMMDDHHMMSSTooltip|escape}"></i></label>
                <input type="text" name="btkservicedata[abone_baslangic]" id="service_abone_baslangic" value="{$btkServiceData.abone_baslangic|default:$whmcsServicedata.regdate|date_format:"%Y%m%d%H%M%S"|escape}" class="form-control datetime-picker" placeholder="YYYYMMDDHHMMSS" required>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label for="service_statik_ip">{$LANG.serviceStatikIpLabel}</label>
                <input type="text" name="btkservicedata[statik_ip]" id="service_statik_ip" value="{$btkServiceData.statik_ip|default:$whmcsServicedata.dedicatedip|escape}" class="form-control" placeholder="Örn: 192.168.1.100">
            </div>
        </div>
    </div>
    {* İSS veya AİH'e özel alanlar burada koşullu olarak gösterilebilir (Hizmet Tipine göre) *}
    {* Örn: iss_hiz_profili, iss_kullanici_adi, iss_pop_bilgisi *}
    {* Örn: aih_hiz_profil, aih_hizmet_saglayici, aih_pop_bilgi, vs. *}

    <hr>
    <h4><i class="fas fa-map-marked-alt"></i> {$LANG.serviceTesisAdresiTitle} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.serviceTesisAdresiTooltip|escape}"></i></h4>
    <div class="form-group">
        <label>
            <input type="checkbox" name="tesis_adresi_yerlesimle_ayni" id="tesis_adresi_yerlesimle_ayni" {if $tesisAdresiYerlesimleAyni}checked{/if}>
            {$LANG.tesisAdresiYerlesimleAyniLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.tesisAdresiYerlesimleAyniTooltip|escape}"></i>
        </label>
    </div>

    <div id="tesisAdresiFormAlani" {if $tesisAdresiYerlesimleAyni}style="display:none;"{/if}>
        <div class="row">
            <div class="col-md-4">
                <div class="form-group">
                    <label for="abone_adres_tesis_il">{$LANG.adresIlLabel} *</label>
                    <select name="btkservicedata[abone_adres_tesis_il]" id="abone_adres_tesis_il" class="form-control adres-il-select" data-target-ilce="abone_adres_tesis_ilce" {if !$tesisAdresiYerlesimleAyni}required{/if}>
                        <option value="">{$LANG.selectIlOption}</option>
                        {foreach from=$iller item=il}
                            <option value="{$il->il_adi|escape}" data-il-id="{$il->id}" {if $btkServiceData.abone_adres_tesis_il == $il->il_adi}selected{/if}>{$il->il_adi|escape}</option>
                        {/foreach}
                    </select>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label for="abone_adres_tesis_ilce">{$LANG.adresIlceLabel} *</label>
                    <select name="btkservicedata[abone_adres_tesis_ilce]" id="abone_adres_tesis_ilce" class="form-control adres-ilce-select" data-target-mahalle="abone_adres_tesis_mahalle" {if !$tesisAdresiYerlesimleAyni}required{/if}>
                        <option value="">{$LANG.selectIlceOption}</option>
                         {if $tesis_ilceler}
                             {foreach from=$tesis_ilceler item=ilce}
                                <option value="{$ilce->ilce_adi|escape}" data-ilce-id="{$ilce->id}" {if $btkServiceData.abone_adres_tesis_ilce == $ilce->ilce_adi}selected{/if}>{$ilce->ilce_adi|escape}</option>
                            {/foreach}
                        {/if}
                    </select>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label for="abone_adres_tesis_mahalle">{$LANG.adresMahalleLabel} *</label>
                    <select name="btkservicedata[abone_adres_tesis_mahalle]" id="abone_adres_tesis_mahalle" class="form-control adres-mahalle-select" {if !$tesisAdresiYerlesimleAyni}required{/if}>
                         <option value="">{$LANG.selectMahalleOption}</option>
                         {if $tesis_mahalleler}
                             {foreach from=$tesis_mahalleler item=mahalle}
                                <option value="{$mahalle->mahalle_adi|escape}" data-mahalle-id="{$mahalle->id}" {if $btkServiceData.abone_adres_tesis_mahalle == $mahalle->mahalle_adi}selected{/if}>{$mahalle->mahalle_adi|escape}</option>
                            {/foreach}
                        {/if}
                    </select>
                </div>
            </div>
        </div>
         <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label for="abone_adres_tesis_cadde">{$LANG.adresCaddeSokakLabel}</label>
                    <input type="text" name="btkservicedata[abone_adres_tesis_cadde]" id="abone_adres_tesis_cadde" value="{$btkServiceData.abone_adres_tesis_cadde|escape}" class="form-control">
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <label for="abone_adres_tesis_dis_kapi_no">{$LANG.adresDisKapiNoLabel}</label>
                    <input type="text" name="btkservicedata[abone_adres_tesis_dis_kapi_no]" id="abone_adres_tesis_dis_kapi_no" value="{$btkServiceData.abone_adres_tesis_dis_kapi_no|escape}" class="form-control">
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <label for="abone_adres_tesis_ic_kapi_no">{$LANG.adresIcKapiNoLabel}</label>
                    <input type="text" name="btkservicedata[abone_adres_tesis_ic_kapi_no]" id="abone_adres_tesis_ic_kapi_no" value="{$btkServiceData.abone_adres_tesis_ic_kapi_no|escape}" class="form-control">
                </div>
            </div>
        </div>
        {* Posta Kodu, Adres Kodu (UAVT) tesis adresi için de eklenecek *}
    </div>

    <div class="form-group text-center" style="margin-top: 30px;">
        <button type="submit" class="btn btn-success btn-lg"><i class="fas fa-save"></i> {$LANG.saveBtkServiceDetailsButton}</button>
        <a href="clientsservices.php?userid={$clientid}&id={$serviceid}" class="btn btn-default btn-lg"><i class="fas fa-times"></i> {$LANG.cancelButton}</a>
    </div>
</form>

<script type="text/javascript">
$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();

    $(".datetime-picker").flatpickr({
        enableTime: true,
        dateFormat: "YmdHis", // YYYYMMDDHHMMSS formatı
        time_24hr: true,
        allowInput: true,
        locale: "tr"
    });

    // Tesis Adresi Yerleşimle Aynı checkbox'ı
    $('#tesis_adresi_yerlesimle_ayni').change(function() {
        if ($(this).is(':checked')) {
            $('#tesisAdresiFormAlani').slideUp();
            // Tesis adresi alanlarını required olmaktan çıkar
            $('#tesisAdresiFormAlani').find('select, input[type="text"]').prop('required', false);
            // İsteğe bağlı olarak yerleşim adresi bilgilerini tesis adresi alanlarına kopyalayabiliriz (ancak bu sunucu tarafında yapılmalı)
        } else {
            $('#tesisAdresiFormAlani').slideDown();
            // Tesis adresi alanlarını tekrar required yap (önceki required durumlarına göre)
            $('#abone_adres_tesis_il, #abone_adres_tesis_ilce, #abone_adres_tesis_mahalle').prop('required', true);
        }
    }).trigger('change'); // Sayfa yüklendiğinde de durumu kontrol et


    // Dinamik Adres Dropdownları (client_details_btk_form.tpl'deki gibi)
    // Bu fonksiyonlar BtkHelper veya btk_admin_scripts.js içinde merkezi olabilir.
    // Şimdilik tekrar yazıyoruz, refactor edilebilir.
    function populateDropdownService(sourceElement, targetElementId, actionSuffix, parentIdValue, defaultOptionLangKey, selectedValue) {
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
                        var option = $('<option></option>').attr('value', item.name).attr('data-id', item.id).text(item.name);
                        if (selectedValue && item.name == selectedValue) {
                            option.prop('selected', true);
                        }
                        targetElement.append(option);
                    });
                    if (selectedValue && targetElement.val() === selectedValue) {
                        targetElement.trigger('change');
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

    $('#abone_adres_tesis_il').change(function() {
        var ilId = $(this).find('option:selected').data('il-id');
        var ilAdi = $(this).val();
        var targetIlceId = $(this).data('target-ilce');
        var selectedIlce = (ilAdi === '{$btkServiceData.abone_adres_tesis_il|escape:"javascript"}') ? '{$btkServiceData.abone_adres_tesis_ilce|escape:"javascript"}' : null;
        populateDropdownService($(this), targetIlceId, 'ilceler', ilId, 'selectIlceOption', selectedIlce);
    });

    $('#abone_adres_tesis_ilce').change(function() {
        var ilceId = $(this).find('option:selected').data('ilce-id');
        var ilceAdi = $(this).val();
        var targetMahalleId = $(this).data('target-mahalle');
        var selectedMahalle = (ilceAdi === '{$btkServiceData.abone_adres_tesis_ilce|escape:"javascript"}') ? '{$btkServiceData.abone_adres_tesis_mahalle|escape:"javascript"}' : null;
        populateDropdownService($(this), targetMahalleId, 'mahalleler', ilceId, 'selectMahalleOption', selectedMahalle);
    });

    // Sayfa yüklendiğinde, eğer tesis ili seçiliyse, ilçeleri yükle
    if ($('#abone_adres_tesis_il').val() && '{$btkServiceData.abone_adres_tesis_il|escape:"javascript"}') {
        $('#abone_adres_tesis_il').trigger('change');
    }

});
</script>