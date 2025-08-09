{*
    WHMCS BTK Raporlama Modülü - Yönetici Paneli Üst Menü Şablonu
    Sürüm: 20.0.0 (Operasyon PHOENIX)
*}

<div class="btk-module-nav-container">
    <ul class="nav nav-tabs btk-module-nav">
        {foreach $btkModuleMenuItems as $action => $menuItem}
            <li{if $action eq $currentModulePageAction} class="active"{/if}>
                <a href="{$modulelink}&action={$action}">
                    <i class="{$menuItem.icon}"></i> {$menuItem.label}
                </a>
            </li>
        {/foreach}
    </ul>
</div>

{* Bu script, sayfa ilk yüklendiğinde flash mesajının birkaç saniye sonra kaybolmasını sağlar *}
<script type="text/javascript">
    $(document).ready(function() {
        setTimeout(function() {
            $('#btkReportsModuleContainer .alert').slideUp('slow');
        }, 5000); // 5 saniye sonra kaybol
    });
</script>