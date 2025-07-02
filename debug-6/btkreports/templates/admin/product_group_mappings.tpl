{*
    WHMCS BTK Raporlama Modülü - Ürün Grubu - BTK Yetki Eşleştirme Sayfası
    Dosya: templates/admin/product_group_mappings.tpl
    Sürüm: 6.5 - Eşleştirme Mantığı ve Tasarımı Düzeltildi
*}

{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}

<p>{$LANG.productGroupMappingsIntro}</p>
<p>{$LANG.productGroupMappingsHelpText}</p>

<form method="post" action="{$modulelink}&action=save_product_group_mappings">
    <input type="hidden" name="token" value="{$csrfToken}">

    <div class="tablebg">
        <table id="productGroupMappingTable" class="datatable" width="100%" border="0" cellspacing="1" cellpadding="3">
            <thead>
                <tr>
                    <th width="35%">{$LANG.productGroupNameHeader}</th>
                    <th width="35%">{$LANG.btkAuthTypeToMapHeader} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.btkAuthTypeToMapTooltip|escape}"></i></th>
                    <th width="30%">{$LANG.serviceHizmetTipiLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.serviceHizmetTipiTooltip|escape}"></i></th>
                </tr>
            </thead>
            <tbody>
                {if $productGroups}
                    {foreach from=$productGroups item=group}
                        <tr>
                            <td>
                                <strong>{$group.name}</strong>
                                {if $group.headline}<br><small>{$group.headline}</small>{/if}
                            </td>
                            <td>
                                <select name="mappings[{$group.id}][ana_btk_yetki_kodu]" class="form-control btk-ana-yetki-select">
                                    <option value="">{$LANG.selectBtkAuthTypeOption}</option>
                                    {if $activeBtkAuthTypes}
                                        {foreach from=$activeBtkAuthTypes item=authType}
                                            <option value="{$authType->yetki_kodu}" data-grup="{$authType->grup}" {if isset($currentMappings[$group.id]) && $currentMappings[$group.id].ana_btk_yetki_kodu == $authType->yetki_kodu}selected="selected"{/if}>
                                                {$authType->yetki_adi} ({$authType->yetki_kodu}) - [{$LANG.reportTypeAbbr}: {$authType->rapor_tipi_eki|default:'N/A'}]
                                            </option>
                                        {/foreach}
                                    {else}
                                        <option value="" disabled>{$LANG.noActiveAuthTypesForMapping}</option>
                                    {/if}
                                </select>
                            </td>
                            <td>
                                 <select name="mappings[{$group.id}][ek3_hizmet_tipi_kodu]" class="form-control btk-ek3-hizmet-tipi-select">
                                    <option value="">{$LANG.selectAnaYetkiFirst|default:'Önce Ana Yetki Türü Seçin'}</option>
                                     {if isset($currentMappings[$group.id]) && $currentMappings[$group.id].ana_btk_yetki_kodu}
                                         {assign var="selected_yetki_kodu" value=$currentMappings[$group.id].ana_btk_yetki_kodu}
                                         {assign var="selected_grup" value=""}
                                         {foreach from=$activeBtkAuthTypes item=authType}{if $authType->yetki_kodu == $selected_yetki_kodu}{$selected_grup = $authType->grup}{/if}{/foreach}
                                         
                                         {if $selected_grup}
                                            {foreach from=$allEk3HizmetTipleri item=ek3}
                                                {if $ek3.ana_yetki_grup == $selected_grup}
                                                     <option value="{$ek3.hizmet_tipi_kodu}" {if $currentMappings[$group.id].ek3_hizmet_tipi_kodu == $ek3.hizmet_tipi_kodu}selected="selected"{/if}>
                                                        {$ek3.hizmet_tipi_aciklamasi} ({$ek3.hizmet_tipi_kodu})
                                                     </option>
                                                {/if}
                                            {/foreach}
                                         {/if}
                                     {/if}
                                </select>
                            </td>
                        </tr>
                    {/foreach}
                {else}
                    <tr>
                        <td colspan="3" class="text-center">{$LANG.noProductGroupsFound}</td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>

    <div class="form-group text-center" style="margin-top: 20px;">
        <button type="submit" class="btn btn-success btn-lg"><i class="fas fa-save"></i> {$LANG.mappingsSaveSuccess|default:'Eşleştirmeleri Kaydet'}</button>
        <a href="{$modulelink}" class="btn btn-default btn-lg"><i class="fas fa-times"></i> {$LANG.cancelButton}</a>
    </div>
</form>

<script type="text/javascript">
    window.btkAllEk3HizmetTipleri = {$allEk3HizmetTipleriJson};
</script>