{* modules/addons/btkreports/templates/admin/product_group_mappings.tpl *}
{* WHMCS Ürün/Hizmet - BTK Yetki Türü Eşleştirme Sayfası *}

{if $moduleMessage}
    <div class="alert alert-{if $moduleMessage.type == 'success'}success{else}danger{/if}" role="alert">
        {$moduleMessage.message}
    </div>
{/if}

{if $action_result_mapping}
    <div class="alert alert-{if $action_result_mapping.status == 'success'}success{else}danger{/if}">
        {$action_result_mapping.message}
    </div>
{/if}

<form method="post" action="{$modulelink}&action=product_mapping&sub_action=save_mappings" id="productMappingForm">
    <input type="hidden" name="token" value="{$csrfToken}">
    <input type="hidden" name="selected_gid" value="{$selected_gid|default:''}"> {* Hangi grubun eşleştirmesi yapılıyorsa *}

    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-link"></i> {$lang.product_mapping_title}</h3>
        </div>
        <div class="panel-body">
            <p>{$lang.product_mapping_description}</p>

            <div class="row" style="margin-bottom: 20px;">
                <div class="col-md-6">
                    <form method="get" action="{$modulelink}" id="selectProductGroupForm">
                        <input type="hidden" name="module" value="btkreports">
                        <input type="hidden" name="action" value="product_mapping">
                        <div class="form-group">
                            <label for="gid">{$lang.product_group_label}</label>
                            <select name="gid" id="gid" class="form-control" onchange="this.form.submit()">
                                <option value="">{$lang.select_product_group}</option>
                                {if $product_groups}
                                    {foreach from=$product_groups item=group}
                                        <option value="{$group.id}" {if $selected_gid == $group.id}selected{/if}>
                                            {$group.name|escape:'html'} ({$group.product_count} {$lang.records})
                                        </option>
                                    {/foreach}
                                {else}
                                    <option value="" disabled>{$lang.no_records_found} (Ürün Grupları)</option>
                                {/if}
                            </select>
                        </div>
                    </form>
                </div>
            </div>

            {if $selected_gid && $products_in_group}
                <h4>'{$selected_group_name|escape:'html'}' {$lang.product_group_label} İçin Eşleştirmeler:</h4>
                <div class="table-responsive">
                    <table class="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th width="50%">{$lang.product_name_header} (ID)</th>
                                <th>{$lang.assigned_btk_yetki_turu_header}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foreach from=$products_in_group item=product}
                                <tr>
                                    <td>{$product.name|escape:'html'} (ID: {$product.id})</td>
                                    <td>
                                        <select name="product_yetki[{$product.id}]" class="form-control">
                                            <option value="">-- {$lang.select_option} --</option>
                                            {if $yetki_turleri_for_select}
                                                {foreach from=$yetki_turleri_for_select item=yetki}
                                                    <option value="{$yetki->id}" {if isset($current_mappings[$product.id]) && $current_mappings[$product.id] == $yetki->id}selected{/if}>
                                                        {$yetki->yetki_adi|escape:'html'} ({$yetki->yetki_kodu_kisa|escape:'html'})
                                                    </option>
                                                {/foreach}
                                            {else}
                                                 <option value="" disabled>{$lang.no_records_found} (Yetki Türleri)</option>
                                            {/if}
                                        </select>
                                    </td>
                                </tr>
                            {/foreach}
                        </tbody>
                    </table>
                </div>
                <div class="form-group text-center" style="margin-top: 20px;">
                    <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-save"></i> {$lang.save_mapping_button}</button>
                </div>
            {elseif $selected_gid}
                 <div class="alert alert-info">{$lang.no_mapping_found}</div>
            {else}
                <div class="alert alert-info">{$lang.select_product_group}</div>
            {/if}
        </div>
    </div>
</form>

<script type="text/javascript">
$(document).ready(function() {
    // Gerekirse özel JS eklenebilir.
    // Örneğin, seçili ürün grubu değiştiğinde formu otomatik submit etmek için
    // $('#gid').change(function() {
    //     $('#selectProductGroupForm').submit();
    // });
    // Ancak onchange="this.form.submit()" zaten select elementine eklendi.
});
</script>