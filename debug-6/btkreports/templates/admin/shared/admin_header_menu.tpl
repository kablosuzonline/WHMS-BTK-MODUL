{*
    WHMCS BTK Raporlama Modülü - Admin Üst Menü Şablonu
    modules/addons/btkreports/templates/admin/shared/admin_header_menu.tpl
    Sürüm: 6.5
*}

<div class="btk-module-nav-container" style="margin-bottom: 25px;">
    <ul class="nav nav-tabs btk-module-nav">
        {if !empty($btkModuleMenuItems)}
            {foreach $btkModuleMenuItems as $actionKey => $menuItem}
                <li role="presentation" {if $currentModulePageAction == $actionKey}class="active"{/if}>
                    <a href="{$modulelink}&action={$actionKey}">
                        {if !empty($menuItem.icon)}<i class="{$menuItem.icon|escape:'html'}"></i> {/if}
                        {$menuItem.label|escape:'html'}
                    </a>
                </li>
            {/foreach}
        {else}
            <li role="presentation" class="active">
                <a href="{$modulelink}&action=index">
                    <i class="fas fa-exclamation-triangle"></i> {$LANG.menuItemsNotLoaded|default:'Menü Yüklenemedi'}
                </a>
            </li>
        {/if}
    </ul>
</div>
<div class="clearfix"></div>