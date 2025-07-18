{*
    WHMCS BTK Raporlama Modülü - Ürün Grubu - BTK Yetki Eşleştirme Sayfası
    Sürüm: 8.0.8 (Gerçek Eşleştirme)
*}

<div id="btk-mappings-flash-message">
{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}
</div>

<p>{$LANG.productGroupMappingsIntro}</p>
<p class="help-block">{$LANG.productGroupMappingsHelpText}</p>

{if $errorMessage}
    <div class="alert alert-danger">{$errorMessage}</div>
{/if}

<form method="post" action="{$modulelink}&action=save_product_group_mappings">
    <input type="hidden" name="{$csrfTokenName}" value="{$csrfToken}">

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
                {foreach from=$productGroups item=group}
                    <tr>
                        <td>
                            <strong>{$group.name|escape}</strong>
                            {if $group.headline}<br><small class="text-muted">{$group.headline|escape}</small>{/if}
                        </td>
                        <td>
                            <select name="mappings[{$group.id}][ana_btk_yetki_kodu]" class="form-control btk-ana-yetki-select" data-preselected-ek3="{$currentMappings[$group.id]['ek3_hizmet_tipi_kodu']|default:''}">
                                <option value="">{$LANG.selectBtkAuthTypeOption}</option>
                                {if $activeBtkAuthTypes}
                                    {foreach from=$activeBtkAuthTypes item=authType}
                                        <option value="{$authType.yetki_kodu}" data-grup="{$authType.grup}" {if isset($currentMappings[$group.id]) && $currentMappings[$group.id].ana_btk_yetki_kodu == $authType.yetki_kodu}selected="selected"{/if}>
                                            {$authType.yetki_adi} ({$authType.grup|default:'N/A'})
                                        </option>
                                    {/foreach}
                                {else}
                                    <option value="" disabled>{$LANG.noActiveAuthTypesForMapping}</option>
                                {/if}
                            </select>
                        </td>
                        <td>
                            {* Bu bölüm artık tamamen JavaScript tarafından yönetilecektir. *}
                            {* Başlangıçta boş ve disabled olarak gelir. *}
                             <select name="mappings[{$group.id}][ek3_hizmet_tipi_kodu]" class="form-control btk-ek3-hizmet-tipi-select" disabled>
                                <option value="">{$LANG.selectAnaYetkiFirst}</option>
                            </select>
                        </td>
                    </tr>
                {/foreach}
            </tbody>
        </table>
    </div>

    <div class="form-group text-center" style="margin-top: 20px;">
        <button type="submit" class="btn btn-success btn-lg"><i class="fas fa-save"></i> {$LANG.saveChanges}</button>
    </div>
</form>

{* Bu script bloğu, btk_admin_scripts.js dosyasının doğru çalışması için gerekli veriyi global window nesnesine atar. *}
<script type="text/javascript">
    if (typeof window.btkAllEk3HizmetTipleri === 'undefined') {
        window.btkAllEk3HizmetTipleri = {$allEk3HizmetTipleriJson|default:'[]'};
    }
</script>