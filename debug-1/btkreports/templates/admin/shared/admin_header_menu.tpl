{*
    WHMCS BTK Raporlama Modülü - Admin Üst Menü Şablonu
    modules/addons/btkreports/templates/admin/shared/admin_header_menu.tpl
    Bu şablon, btkreports.php içindeki btkreports_output() fonksiyonu tarafından çağrılır.
*}

{* Modül logosu ve sayfa başlığı (opsiyonel olarak buraya da eklenebilir veya her sayfanın kendi .tpl'inde yönetilebilir) *}
{* Eğer her sayfanın kendi başlığı varsa, bu bölüm gereksiz olabilir. *}
{*
<div class="btk-admin-page-header">
    <div class="btk-page-title">
        <img src="{$logo_url}" alt="{$LANG.btkreports_addon_name|default:'BTK Modülü Logo'}" style="height: 36px; vertical-align: middle; margin-right: 12px;">
        {if isset($smarty.capture.btkPageTitle)}
            {$smarty.capture.btkPageTitle}
        {else}
            {$LANG.dashboardtitle|default:'BTK Raporlama'}
        {/if}
    </div>
</div>
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
            {* Menü öğeleri tanımlanmamışsa bir uyarı veya varsayılan bir link gösterilebilir *}
            <li role="presentation" class="active">
                <a href="{$modulelink}&action=index">
                    <i class="fas fa-exclamation-triangle"></i> {$LANG.menuItemsNotLoaded|default:'Menü Yüklenemedi'}
                </a>
            </li>
        {/if}
    </ul>
</div>
<div class="clearfix"></div>

{*
    Not: Bu menü şablonu, `btk_admin_style.css` dosyasındaki `.btk-module-nav-container` ve `.btk-module-nav`
    sınıfları için tanımlanan stilleri kullanacaktır.
    $logo_url ve $assets_url değişkenleri, btkreports_output() fonksiyonunda Smarty'ye atanmalıdır.
*}