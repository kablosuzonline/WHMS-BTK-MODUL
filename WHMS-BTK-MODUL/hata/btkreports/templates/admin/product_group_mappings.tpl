// --- BÖLÜM 1 / 1 BAŞI - (product_group_mappings.tpl, Ürün Grubu - BTK Yetki Eşleştirme Sayfası)
{*
    WHMCS BTK Raporlama Modülü - Ürün Grubu - BTK Yetki Eşleştirme Sayfası
    Dosya: templates/admin/product_group_mappings.tpl
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

<p>{$LANG.productGroupMappingsIntro}</p>
<p>{$LANG.productGroupMappingsHelpText}</p>

<form method="post" action="{$modulelink}&action=save_product_group_mappings">
    <input type="hidden" name="token" value="{$csrfToken}"> {* CSRF Token - btkreports.php'den atanmalı *}

    <div class="tablebg">
        <table class="datatable" width="100%" border="0" cellspacing="1" cellpadding="3">
            <thead>
                <tr>
                    <th width="40%">{$LANG.productGroupNameHeader}</th>
                    <th>{$LANG.btkAuthTypeToMapHeader} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.btkAuthTypeToMapTooltip|escape}"></i></th>
                </tr>
            </thead>
            <tbody>
                {if $productGroups}
                    {foreach from=$productGroups item=group}
                        <tr>
                            <td>
                                {$group.name}
                                {if $group.headline}<br><small>{$group.headline}</small>{/if}
                            </td>
                            <td>
                                <select name="mappings[{$group.id}]" class="form-control">
                                    <option value="">{$LANG.selectBtkAuthTypeOption}</option>
                                    {if $activeBtkAuthTypes}
                                        {foreach from=$activeBtkAuthTypes item=authType}
                                            <option value="{$authType->yetki_kodu}" {if isset($currentMappings[$group.id]) && $currentMappings[$group.id] == $authType->yetki_kodu}selected="selected"{/if}>
                                                {$authType->yetki_adi} ({$authType->yetki_kodu}) - [{$LANG.reportTypeAbbr}: {$authType->rapor_tipi_eki|default:'N/A'}]
                                            </option>
                                        {/foreach}
                                    {else}
                                        <option value="" disabled>{$LANG.noActiveAuthTypesForMapping}</option>
                                    {/if}
                                </select>
                            </td>
                        </tr>
                    {/foreach}
                {else}
                    <tr>
                        <td colspan="2" class="text-center">{$LANG.noProductGroupsFound}</td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>

    <div class="form-group text-center" style="margin-top: 20px;">
        <button type="submit" class="btn btn-success btn-lg"><i class="fas fa-save"></i> {$LANG.saveMappingsButton}</button>
        <a href="{$modulelink}" class="btn btn-default btn-lg"><i class="fas fa-times"></i> {$LANG.cancelButton}</a>
    </div>
</form>

<script type="text/javascript">
$(document).ready(function() {
    // Tooltip'leri etkinleştir
    $('[data-toggle="tooltip"]').tooltip();
});
</script>
// --- BÖLÜM 1 / 1 SONU - (product_group_mappings.tpl, Ürün Grubu - BTK Yetki Eşleştirme Sayfası)