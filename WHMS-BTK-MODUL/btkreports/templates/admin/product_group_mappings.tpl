{* WHMCS BTK Raporları Modülü - Ürün Grubu - BTK Yetki Türü Eşleştirme Sayfası *}

{include file="./shared/alert_messages.tpl"} {* Ortak uyarı/bilgi mesajları şablonunu dahil et *}

<div class="btk-admin-page-container">
    <div class="btk-admin-page-header">
        <div class="btk-header-left">
            {if file_exists($modulepath|cat:'/logo.png')}
                <img src="{$modulelink|replace:'addonmodules.php?module=btkreports':''}/modules/addons/btkreports/logo.png" alt="{$LANG.btk_module_name} Logo" class="btk-header-logo">
            {/if}
            <h2>{$LANG.btk_product_mapping_page_title}</h2>
        </div>
        <div class="btk-header-right">
            <span class="btk-version-info">v{$version}</span>
        </div>
    </div>

    {include file="./shared/admin_header_menu.tpl" active_tab="productmapping"} {* Ortak navigasyon menüsünü dahil et *}

    <p style="margin-top: 20px;">{$LANG.btk_product_mapping_page_desc}</p>

    <form method="post" action="{$modulelink}&action=productmapping&subaction=save" id="productMappingForm">
        <input type="hidden" name="token" value="{$csrfToken}" />

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fas fa-link icon-spacer"></i>{$LANG.btk_product_mapping_page_title}</h3>
            </div>
            <div class="panel-body">
                {if $product_groups_with_mappings}
                    <div class="table-responsive">
                        <table class="table table-striped table-hover btk-table-middle-align">
                            <thead>
                                <tr>
                                    <th width="10%">{$LANG.btk_product_group_id}</th>
                                    <th>{$LANG.btk_product_group_name}</th>
                                    <th width="40%">{$LANG.btk_assigned_auth_type}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {foreach from=$product_groups_with_mappings item=group_map}
                                    <tr>
                                        <td>{$group_map.gid}</td>
                                        <td>{$group_map.group_name|escape:'html'}</td>
                                        <td>
                                            <select name="mapping[{$group_map.gid}]" class="form-control input-sm select-select2-basic-nomsearch">
                                                <option value="0">-- {$LANG.btk_no_auth_type_assigned} --</option>
                                                {if $yetki_turleri_aktif}
                                                    {foreach from=$yetki_turleri_aktif item=yetki}
                                                        <option value="{$yetki->id}" {if $group_map.btk_yetki_turu_id == $yetki->id}selected{/if}>
                                                            {$yetki->yetki_kodu|escape:'html'} - {$yetki->yetki_aciklama|escape:'html'}
                                                        </option>
                                                    {/foreach}
                                                {/if}
                                            </select>
                                        </td>
                                    </tr>
                                {/foreach}
                            </tbody>
                        </table>
                    </div>
                {else}
                    <div class="alert alert-info text-center">
                        {$LANG.btk_no_records_found}
                        {if !$yetki_turleri_aktif}
                            <br><small>Lütfen önce Ayarlar > Yetkilendirme Türleri sekmesinden en az bir yetki türünü aktif ediniz.</small>
                        {else if !$product_groups_with_mappings && $yetki_turleri_aktif}
                            <br><small>WHMCS sisteminizde tanımlı herhangi bir ürün grubu bulunamadı.</small>
                        {/if}
                    </div>
                {/if}
            </div>
            {if $product_groups_with_mappings && $yetki_turleri_aktif}
                <div class="panel-footer text-right">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save icon-spacer"></i>{$LANG.btk_button_save_changes}
                    </button>
                </div>
            {/if}
        </div>
    </form>
</div>

{* Bu şablon için gerekli JavaScript kodları (Flash mesajı, Select2) btk_admin_scripts.js dosyasına taşınmıştır. *}

{* Gerekli Smarty Değişkenleri (btkreports.php -> productmapping action'ında atanmalı):
   - $flash_message (opsiyonel)
   - $modulepath, $modulelink, $version, $LANG, $csrfToken (standart)
   - $product_groups_with_mappings: WHMCS ürün gruplarını ve mevcut eşleştirmelerini içeren bir dizi.
     Her eleman: ['gid' => WHMCS tblproductgroups.id, 'group_name' => WHMCS tblproductgroups.name, 'btk_yetki_turu_id' => mod_btk_product_group_mappings.btk_yetki_turu_id (varsa)]
   - $yetki_turleri_aktif: mod_btk_yetki_turleri tablosundan 'secili_mi=1' olan aktif yetki türlerinin listesi.
*}