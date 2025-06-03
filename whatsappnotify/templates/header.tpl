<link href="../modules/addons/whatsappnotify/assets/css/styles.css" rel="stylesheet" />
<nav class="navbar navbar-default" style="background: #394264;border-radius: 5px;">
    <div class="container-fluid">
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="navbar-collapse collapse in" id="mod_apu_bt_navbar_menu" aria-expanded="true" style="">
            <ul class="nav navbar-nav">
                <li class="{'WhatsAppDashboard'|wamactivemenu}"><a href="addonmodules.php?module=whatsappnotify">{$WALANG.home}</a></li>
                <li class="{'WhatsAppMass'|wamactivemenu}"><a href="addonmodules.php?module=whatsappnotify&controller=WhatsAppMass">{$WALANG.masssms}</a></li>
                <li class="{'WhatsAppLogs'|wamactivemenu}"><a href="addonmodules.php?module=whatsappnotify&controller=WhatsAppLogs">{$WALANG.logs}</a></li>
                <li class="{'WhatsAppManagement'|wamactivemenu}"><a href="addonmodules.php?module=whatsappnotify&controller=WhatsAppManagement">{$WALANG.management}</a></li>
                <li class="dropdown {'WhatsAppConfig'|wamactivemenu}">
                    <a class="dropdown-toggle" data-toggle="dropdown" href="#">{$WALANG.configurations}</a>
                    <ul class="dropdown-menu">
                        <li><a href="?module=whatsappnotify&controller=WhatsAppConfig">{$WALANG.globalconfigurations}</a></li>
                        <li><a href="?module=whatsappnotify&controller=WhatsAppConfig&action=MultiCountry">{$WALANG.multicountrysetup}</a></li>
                        <li><a href="?module=whatsappnotify&controller=WhatsAppSchedule">{$WALANG.ScheduleWHATSAPPsend}</a></li>
                    </ul>
                </li>
                <li class="{'WhatsAppClients'|wamactivemenu}"><a href="addonmodules.php?module=whatsappnotify&controller=WhatsAppClients">{$WALANG.clients}</a></li>
                <li class="{'WhatsAppAdmin'|wamactivemenu}"><a href="addonmodules.php?module=whatsappnotify&controller=WhatsAppAdmin">{$WALANG.adminnotifications}</a></li>
                <li class="{'WhatsAppHelp'|wamactivemenu}"><a href="addonmodules.php?module=whatsappnotify&controller=WhatsAppHelp">Help</a></li>
            </ul>
        </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
</nav>
{if $saved}
    <div class="alert alert-success">
        {$WALANG.savedsuccessfuly}
    </div>
{/if}