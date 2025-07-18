{*
    WHMCS BTK Raporlama Modülü - Yönetici Paneli Üst Menü Şablonu
    Sürüm: 8.0.3 (Zirve)
    
    Bu şablon, modülün tüm sayfalarının en üstünde yer alan sekmeli menüyü oluşturur.
    btkreports.php dosyasından gönderilen $btkModuleMenuItems dizisini kullanarak
    dinamik olarak menü elemanlarını oluşturur ve aktif olan sayfayı işaretler.
*}

<div class="btk-module-nav-container">
    <ul class="nav nav-tabs btk-module-nav">
        {if !empty($btkModuleMenuItems)}
            {foreach $btkModuleMenuItems as $actionKey => $menuItem}
                <li role="presentation" {if $currentModulePageAction == $actionKey}class="active"{/if}>
                    <a href="{$modulelink}&action={$actionKey}">
                        {if !empty($menuItem.icon)}
                            <i class="{$menuItem.icon|escape:'html'}"></i> 
                        {/if}
                        {$menuItem.label|escape:'html'}
                    </a>
                </li>
            {/foreach}
        {else}
            {* Bir hata durumunda veya menü verisi gelmediğinde gösterilecek varsayılan durum *}
            <li role="presentation" class="active">
                <a href="{$modulelink}">
                    <i class="fas fa-exclamation-triangle"></i> {$LANG.menuItemsNotLoaded|default:'Menü Yüklenemedi'}
                </a>
            </li>
        {/if}
    </ul>
</div>

{* Float problemlerini önlemek için clearfix *}
<div class="clearfix"></div>