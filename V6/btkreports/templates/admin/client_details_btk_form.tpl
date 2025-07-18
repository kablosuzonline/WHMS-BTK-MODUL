    {* Kurumsal Müşteriler İçin Yetkili Bilgileri (Müşteri Tipi T-SIRKET veya T-KAMU ise gösterilir) *}
    <div id="kurumsalYetkiliBilgileri" {if !($btkData.musteri_tipi == 'T-SIRKET' || $btkData.musteri_tipi == 'T-KAMU')}style="display:none;"{/if}>
        <hr>
        <h4><i class="fas fa-user-shield"></i> {$LANG.kurumYetkilisiBilgileriTitle}</h4>
        <div class="row">
            <div class="col-md-4">
                <div class="form-group">
                    <label for="kurum_yetkili_adi">{$LANG.kurumYetkiliAdiLabel}</label>
                    <input type="text" name="btkdata[kurum_yetkili_adi]" id="kurum_yetkili_adi" value="{$btkData.kurum_yetkili_adi|escape}" class="form-control">
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label for="kurum_yetkili_soyadi">{$LANG.kurumYetkiliSoyadiLabel}</label>
                    <input type="text" name="btkdata[kurum_yetkili_soyadi]" id="kurum_yetkili_soyadi" value="{$btkData.kurum_yetkili_soyadi|escape}" class="form-control">
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label for="kurum_yetkili_tckimlik_no">{$LANG.kurumYetkiliTcKimlikNoLabel}</label>
                    <input type="text" name="btkdata[kurum_yetkili_tckimlik_no]" id="kurum_yetkili_tckimlik_no" value="{$btkData.kurum_yetkili_tckimlik_no|escape}" class="form-control" maxlength="11">
                    {* Burada da TCKN doğrulaması eklenebilir *}
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label for="kurum_yetkili_telefon">{$LANG.kurumYetkiliTelefonLabel}</label>
                    <input type="text" name="btkdata[kurum_yetkili_telefon]" id="kurum_yetkili_telefon" value="{$btkData.kurum_yetkili_telefon|escape}" class="form-control">
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label for="kurum_adres">{$LANG.kurumAdresLabel}</label>
                    <textarea name="btkdata[kurum_adres]" id="kurum_adres" class="form-control" rows="2">{$btkData.kurum_adres|escape}</textarea>
                </div>
            </div>
        </div>
    </div>

    <hr>
    <h4><i class="fas fa-id-card-alt"></i> {$LANG.aboneKimlikDetayTitle}</h4>
     <div class="row">
        <div class="col-md-3">
            <div class="form-group">
                <label for="abone_dogum_yeri">{$LANG.aboneDogumYeriLabel}</label>
                <input type="text" name="btkdata[abone_dogum_yeri]" id="abone_dogum_yeri" value="{$btkData.abone_dogum_yeri|escape}" class="form-control">
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="abone_anne_kizlik_soyadi">{$LANG.aboneAnneKizlikSoyadiLabel}</label>
                <input type="text" name="btkdata[abone_anne_kizlik_soyadi]" id="abone_anne_kizlik_soyadi" value="{$btkData.abone_anne_kizlik_soyadi|escape}" class="form-control">
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="abone_meslek">{$LANG.aboneMeslekLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.aboneMeslekTooltip|escape}"></i></label>
                <select name="btkdata[abone_meslek]" id="abone_meslek" class="form-control">
                    <option value="">{$LANG.selectOption}</option>
                    {foreach from=$meslekKodlari item=meslek} {* $meslekKodlari btkreports.php'den atanmalı *}
                        <option value="{$meslek->kod}" {if $btkData.abone_meslek == $meslek->kod}selected{/if}>{$meslek->kod} - {$meslek->meslek_adi|escape}</option>
                    {/foreach}
                </select>
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="abone_tarife">{$LANG.aboneTarifeLabel}</label>
                <input type="text" name="btkdata[abone_tarife]" id="abone_tarife" value="{$btkData.abone_tarife|escape}" class="form-control">
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            <div class="form-group">
                <label for="abone_kimlik_tipi">{$LANG.aboneKimlikTipiLabel} * <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.aboneKimlikTipiTooltip|escape}"></i></label>
                <select name="btkdata[abone_kimlik_tipi]" id="abone_kimlik_tipi" class="form-control" required>
                    <option value="">{$LANG.selectOption}</option>
                     {foreach from=$kimlikTipleri item=kimlik} {* $kimlikTipleri btkreports.php'den atanmalı *}
                        <option value="{$kimlik->belge_tip_kodu}" {if $btkData.abone_kimlik_tipi == $kimlik->belge_tip_kodu}selected{/if}>{$kimlik->belge_adi|escape} ({$kimlik->belge_tip_kodu})</option>
                    {/foreach}
                </select>
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="abone_kimlik_seri_no">{$LANG.aboneKimlikSeriNoLabel}</label>
                <input type="text" name="btkdata[abone_kimlik_seri_no]" id="abone_kimlik_seri_no" value="{$btkData.abone_kimlik_seri_no|escape}" class="form-control">
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="abone_kimlik_verildigi_yer">{$LANG.aboneKimlikVerildigiYerLabel}</label>
                <input type="text" name="btkdata[abone_kimlik_verildigi_yer]" id="abone_kimlik_verildigi_yer" value="{$btkData.abone_kimlik_verildigi_yer|escape}" class="form-control">
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="abone_kimlik_verildigi_tarih">{$LANG.aboneKimlikVerildigiTarihLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.dateFormatYYYYMMDDTooltip|escape}"></i></label>
                <input type="text" name="btkdata[abone_kimlik_verildigi_tarih]" id="abone_kimlik_verildigi_tarih" value="{$btkData.abone_kimlik_verildigi_tarih|escape}" class="form-control date-picker-yyyymmdd" placeholder="YYYYMMDD">
            </div>
        </div>
    </div>
     <div class="row">
        <div class="col-md-3">
            <div class="form-group">
                <label for="abone_kimlik_aidiyeti">{$LANG.aboneKimlikAidiyetiLabel} *</label>
                 <select name="btkdata[abone_kimlik_aidiyeti]" id="abone_kimlik_aidiyeti" class="form-control" required>
                    <option value="B" {if $btkData.abone_kimlik_aidiyeti == 'B' || !$btkData.abone_kimlik_aidiyeti}selected{/if}>{$LANG.kimlikAidiyetiBireysel}</option>
                    <option value="Y" {if $btkData.abone_kimlik_aidiyeti == 'Y'}selected{/if}>{$LANG.kimlikAidiyetiYetkili}</option>
                </select>
            </div>
        </div>
        {* Eski Kimlik Bilgileri: Cilt No, Kütük No, Sayfa No, İl, İlçe, Mahalle/Köy - Gerekirse eklenecek *}
    </div>


    <div class="form-group text-center" style="margin-top: 30px;">
        <button type="submit" class="btn btn-success btn-lg"><i class="fas fa-save"></i> {$LANG.saveBtkClientDetailsButton}</button>
        <a href="clientssummary.php?userid={$clientid}" class="btn btn-default btn-lg"><i class="fas fa-times"></i> {$LANG.cancelButton}</a>
    </div>
</form>

<script type="text/javascript">
$(document).ready(function() {
    // Tooltip, Date Picker ve Müşteri Tipi eventleri Bölüm 1'de tanımlanmıştı.
    // TCKN Doğrulama Bölüm 1'de tanımlanmıştı.

    // Dinamik Adres Dropdownları (Devamı ve iyileştirmesi)
    function populateDropdown(sourceElement, targetElementId, actionSuffix, parentIdValue, defaultOptionLangKey, selectedValue) {
        var targetElement = $('#' + targetElementId);
        var defaultOptionText = LANG[defaultOptionLangKey] || '{$LANG.selectOption|escape:"javascript"}';
        targetElement.html('<option value="">' + defaultOptionText + '</option>').prop('disabled', true);

        // Zincirleme olarak alt dropdownları da temizle (bu daha genel bir yaklaşım)
        var nextSelect = targetElement.closest('.col-md-4').nextAll('.col-md-4').find('select.adres-select');
        while(nextSelect.length > 0) {
            var nextDefaultOptionKey = nextSelect.data('default-option-key') || 'selectOption';
            nextSelect.html('<option value="">' + (LANG[nextDefaultOptionKey] || '{$LANG.selectOption|escape:"javascript"}') + '</option>').prop('disabled', true);
            if (nextSelect.data('target-ilce') || nextSelect.data('target-mahalle') || nextSelect.data('target-sokak')) {
                 nextSelect = nextSelect.closest('.col-md-4').nextAll('.col-md-4').find('select.adres-select');
            } else {
                nextSelect = $(); // Döngüden çık
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
                    // Eğer önceden seçili bir değer varsa ve yüklendiyse, bir sonraki dropdown'u tetikle
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

    $('.adres-il-select').change(function() {
        var ilId = $(this).find('option:selected').data('il-id');
        var ilAdi = $(this).val();
        var targetIlceId = $(this).data('target-ilce');
        var selectedIlce = (ilAdi === '{$btkData.abone_adres_yerlesim_il|escape:"javascript"}') ? '{$btkData.abone_adres_yerlesim_ilce|escape:"javascript"}' : null;
        populateDropdown($(this), targetIlceId, 'ilceler', ilId, 'selectIlceOption', selectedIlce);
    });

    $('.adres-ilce-select').change(function() {
        var ilceId = $(this).find('option:selected').data('ilce-id');
        var ilceAdi = $(this).val();
        var targetMahalleId = $(this).data('target-mahalle');

        // Yerleşim ve Tesis adresi için ayrı selected değerleri kontrol etmemiz gerekebilir.
        // Bu şablon müşteri yerleşim adresine odaklandığı için tek bir kontrol yapıyoruz.
        var selectedMahalle = (ilceAdi === '{$btkData.abone_adres_yerlesim_ilce|escape:"javascript"}') ? '{$btkData.abone_adres_yerlesim_mahalle|escape:"javascript"}' : null;
        populateDropdown($(this), targetMahalleId, 'mahalleler', ilceId, 'selectMahalleOption', selectedMahalle);
    });

    // Sayfa yüklendiğinde, eğer il seçiliyse, ilçeleri yükle
    if ($('#abone_adres_yerlesim_il').val() && '{$btkData.abone_adres_yerlesim_il|escape:"javascript"}') {
        $('#abone_adres_yerlesim_il').trigger('change');
    }
    // Diğer adres dropdownları için de benzer tetiklemeler eklenebilir (mahalle için sokak vb.)


    // Formu göndermeden önce TCKN doğrulaması uyarısı
    $('form[action*="save_client_btk_details"]').submit(function(e) {
        var tcknStatusIcon = $('#abone_tc_kimlik_no').closest('.form-group').find('.tckn-validation-status i');
        if (tcknStatusIcon.hasClass('fa-times-circle') || tcknStatusIcon.hasClass('fa-exclamation-triangle')) {
            if (!confirm('{$LANG.tcknNotValidatedWarningConfirm}')) {
                e.preventDefault();
                return false;
            }
        }
    });
});
</script>