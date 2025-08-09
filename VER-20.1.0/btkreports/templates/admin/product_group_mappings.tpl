{*
    WHMCS BTK Raporlama Modülü - Ürün Grubu Eşleştirme Şablonu
    Sürüm: 20.0.0 (Operasyon PHOENIX)
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$module_version}" rel="stylesheet">

<div id="btk-mappings-flash-message">
{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}
</div>

<p>{$LANG.productGroupMappingsIntro}</p>
<div class="alert alert-info">
    <i class="fas fa-info-circle"></i> {$LANG.productGroupMappingsHelpText}
</div>

{if empty($activeBtkAuthTypes)}
    <div class="alert alert-warning text-center">{$LANG.noActiveAuthTypesForMapping}</div>
{else}
<form method="post" action="{$modulelink}&action=save_product_group_mappings">
    <input type="hidden" name="{$csrfTokenName}" value="{$csrfToken}">
    
    <div class="table-responsive">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>WHMCS Ürün Grubu</th>
                    <th>{$LANG.btkAuthTypeToMapHeader} <i class="fas fa-question-circle btk-tooltip" data-toggle="tooltip" title="{$LANG.btkAuthTypeToMapTooltip|escape}"></i></th>
                    <th>Hizmet Tipi (EK-3) <i class="fas fa-question-circle btk-tooltip" data-toggle="tooltip" title="{$LANG.serviceHizmetTipiTooltip|escape}"></i></th>
                </tr>
            </thead>
            <tbody>
                {foreach from=$productGroups item=group}
                    <tr>
                        <td>
                            <strong>{$group.name|escape}</strong>
                            {if $group.headline}<br><small>{$group.headline|escape}</small>{/if}
                        </td>
                        <td>
                            <select name="mappings[{$group.id}][ana_btk_yetki_kodu]" class="form-control ana-yetki-select" data-gid="{$group.id}">
                                <option value="">{$LANG.selectBtkAuthTypeOption}</option>
                                {foreach from=$activeBtkAuthTypes item=yetki}
                                    <option value="{$yetki.yetki_kodu}" data-grup="{$yetki.grup}" {if $currentMappings[$group.id].ana_btk_yetki_kodu == $yetki.yetki_kodu}selected{/if}>
                                        {$yetki.yetki_adi} ({$yetki.grup})
                                    </option>
                                {/foreach}
                            </select>
                        </td>
                        <td>
                            <select name="mappings[{$group.id}][ek3_hizmet_tipi_kodu]" id="ek3_select_{$group.id}" class="form-control ek3-hizmet-tipi-select" data-selected-value="{$currentMappings[$group.id].ek3_hizmet_tipi_kodu|escape}">
                                <option value="">{$LANG.selectAnaYetkiFirst}</option>
                            </select>
                        </td>
                    </tr>
                {foreachelse}
                    <tr>
                        <td colspan="3" class="text-center">{$LANG.noProductGroupsFound}</td>
                    </tr>
                {/foreach}
            </tbody>
        </table>
    </div>

    <div class="text-center" style="margin-top: 20px;">
        <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-save"></i> {$LANG.saveChanges}</button>
    </div>
</form>
{/if}

<script type="text/javascript">
$(document).ready(function() {
    var allEk3HizmetTipleri = {$allEk3HizmetTipleriJson};

    function updateEk3Dropdown(selectElement) {
        var $select = $(selectElement);
        var gid = $select.data('gid');
        var $ek3Select = $('#ek3_select_' + gid);
        var selectedGrup = $select.find('option:selected').data('grup');
        var previouslySelected = $ek3Select.data('selected-value');

        $ek3Select.empty().append($('<option>', {
            value: '',
            text: '{$LANG.selectOption|escape:"javascript"}'
        }));

        if (selectedGrup) {
            var filteredHizmetler = allEk3HizmetTipleri.filter(function(hizmet) {
                return hizmet.ana_yetki_grup === selectedGrup;
            });

            if (filteredHizmetler.length > 0) {
                 $.each(filteredHizmetler, function(index, hizmet) {
                    $ek3Select.append($('<option>', {
                        value: hizmet.hizmet_tipi_kodu,
                        text: hizmet.hizmet_tipi_aciklamasi + ' (' + hizmet.hizmet_tipi_kodu + ')'
                    }));
                });
            } else {
                 $ek3Select.html('<option value="">{$LANG.noEk3ForSelectedAuth|escape:"javascript"}</option>');
            }
           
            // Önceden kaydedilmiş değeri tekrar seç
            if (previouslySelected) {
                $ek3Select.val(previouslySelected);
            }

        } else {
            $ek3Select.html('<option value="">{$LANG.selectAnaYetkiFirst|escape:"javascript"}</option>');
        }
    }

    // Sayfa yüklendiğinde mevcut tüm dropdown'ları doldur
    $('.ana-yetki-select').each(function() {
        updateEk3Dropdown(this);
    });

    // Ana yetki seçimi değiştiğinde ilgili hizmet tipi dropdown'ını güncelle
    $('.ana-yetki-select').on('change', function() {
        // Seçim değiştiğinde, önceden seçili değeri sıfırla ki yanlış kalmasın
        $('#ek3_select_' + $(this).data('gid')).data('selected-value', '');
        updateEk3Dropdown(this);
    });

    // Tooltip'leri etkinleştir
    $('[data-toggle="tooltip"]').tooltip();
});
</script>