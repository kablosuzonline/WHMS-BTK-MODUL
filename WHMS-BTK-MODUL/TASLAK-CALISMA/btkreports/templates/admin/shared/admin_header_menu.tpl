{*
    WHMCS BTK Raporlama Modülü - Admin Üst Menü Şablonu
    modules/addons/btkreports/templates/admin/shared/admin_header_menu.tpl
*}
<div class="btk-module-nav-container">
    <ul class="nav nav-tabs btk-module-nav">
        {foreach $btkModuleMenuItems as $actionKey => $menuItem}
            <li role="presentation" {if $currentModulePageAction == $actionKey}class="active"{/if}>
                <a href="{$modulelink}&action={$actionKey}">
                    {if !empty($menuItem.icon)}<i class="{$menuItem.icon|escape}"></i> {/if}
                    {$menuItem.label|escape}
                </a>
            </li>
        {/foreach}
    </ul>
</div>
<div class="clearfix" style="margin-bottom: 20px;"></div>