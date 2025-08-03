      <!-- Main Header -->
      <header class="main-header">

        <!-- Logo -->
        <a href="index.php" class="logo">
          <!-- mini logo for sidebar mini 50x50 pixels -->
			<span class="logo-mini">
			  {if !empty($lara_options.settings.logo_mini_img)}
				<img src="{$lara_options.settings.logo_mini_img}"></img>
			  {else}
				{$lara_options.settings.logo_mini_txt|default:'WHM'}
			  {/if}
			</span>
		  <!-- logo for regular state and mobile devices -->
			<span class="logo-lg">
			  {if !empty($lara_options.settings.logo_lg_img)}
				<img src="{$lara_options.settings.logo_lg_img}"></img>
			  {else}
				{$lara_options.settings.logo_lg_txt|default:'WHMCS'}
			  {/if}
			</span>
        </a>

        <!-- Header Navbar -->
        <nav class="navbar navbar-static-top" role="navigation">
          <!-- Sidebar toggle button-->
          <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
            <span class="sr-only">Toggle navigation</span>
          </a>
          <!-- Navbar Right Menu -->
          <div class="navbar-custom-menu">

		  <ul class="nav navbar-nav">
			
				<li class="hidden-xs">
					<div style="width: 250px;">
						<div id="intelliSearchForm" >
							<form method="post" class="navbar-form" action="{routePath('admin-search-intellisearch')}">
								<input type="hidden" id="intelliSearchHideInactive" name="hide_inactive" value="1">
								<input type="hidden" id="intelliSearchExpand" name="more" value="">
								
								<div class="input-group" >
									<button class="btn btn-flat" type="button" id="btnIntelliSearchClose" style="float: left;">
										<i class="far fa-times closer"></i>
									</button>							
									<input type="text" name="searchterm" class="form-control" id="inputIntelliSearchValue" data-toggle="tooltip" data-placement="bottom" data-trigger="manual" data-title="You must enter at least 3 characters" placeholder="{$_ADMINLANG.searchPlaceholder}...">
									<span class="input-group-btn" >
										<button type="submit" class="btn btn-flat" style="margin-left: 0px;">
											<i class="fas fa-search loader"></i>
										</button>
									</span>
								</div>
							</form>
						</div>
					</div>
					{include file="$template/intellisearch-results.tpl"}

				</li>
				<li class="nav-vertical-separator hidden-xs"></li>
				{if {"lrchatwidget"|in_array:$lara_options.cuser.permissions}}
					{include file="$template/widgets/chat/chat_main_nav.tpl"}
					<li class="nav-vertical-separator"></li>
				{/if}
				
				<li class="lr_tooltip">
					 <span class="lr_tooltiptext">({$sidebarstats.orders.pending|default:'0'}) - {$_ADMINLANG.stats.pendingorders}</span>
					<a href="orders.php?status=Pending">
						<i class="fas fa-shopping-cart"></i>
						{if $sidebarstats.orders.pending > 0 } 
						<span class="label label-warning">{$sidebarstats.orders.pending}</span>
						{/if}						
					</a>
				</li>				
				
				<li class="lr_tooltip">
					 <span class="lr_tooltiptext">({$sidebarstats.invoices.overdue|default:'0'}) - {$_ADMINLANG.stats.overdueinvoices}</span>				
					<a href="invoices.php?status=Overdue">
						<i class="fas fa-dollar-sign"></i>
						{if $sidebarstats.invoices.overdue > 0 } 
						<span class="label label-warning">{$sidebarstats.invoices.overdue}</span>
						{/if}						
					</a>
				</li>

				<li class="lr_tooltip">
					 <span class="lr_tooltiptext">({$ticketsawaitingreply|default:'0'}) - {$_ADMINLANG.stats.ticketsawaitingreply}</span>				
					<a href="supporttickets.php">
						<i class="fas fa-ticket-alt"></i>
						{if $ticketsawaitingreply > 0 } 
						<span class="label label-warning">{$ticketsawaitingreply}</span>
						{/if}						
					</a>
				</li>
				<li class="nav-vertical-separator hidden-xs"></li>
				
        {if $showUpdateAvailable}
            <li class="lr_tooltip hidden-xs">
				<span class="lr_tooltiptext">{$_ADMINLANG.license.updateavailable}</span>
                <a href="update.php">
                    <i class="fas fa-download"></i>
                    <span class="label label-warning"><span class="fas fa-asterisk"></span></span>
                </a>
            </li>
        {/if}	

        {if in_array("Automation Status", $admin_perms)}
			{if !$isNewInstallation && ($isCronError || $isCronWarning)}
				<li class="lr_tooltip hidden-xs">
					 <span class="lr_tooltiptext">{$_ADMINLANG.utilities.automationStatus}</span>				
					<a href="automationstatus.php">
						<i class="fas fa-cogs"></i>
						<span class="label label-warning"><span class="fas fa-{if $isCronError}times{else}exclamation{/if}"></span></span>
					</a>
				</li>
			{/if}
		{/if}
		

			{if $hasSetupMenuAccess || in_array("Configure General Settings",$admin_perms) || in_array("Apps and Integrations",$admin_perms) || in_array("Configure Administrators",$admin_perms) || in_array("Health and Updates",$admin_perms) || in_array("Configure General Settings",$admin_perms) || in_array("View Activity Log",$admin_perms)}
			  <li class="dropdown hidden-xs">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown">
				  <i class="fas fa-wrench"></i>
				  <span class="label label-success"></span>
				</a>
				<ul class="dropdown-menu icons-list clearfix">
				
				{if $hasSetupMenuAccess}
					<li>
						<a id="Menu-Config-Setup" href="{routePath('admin-setup-index')}">
							<span class="icons-list-icon"><i class="fad fa-sliders-h"></i></span>
							<span class="icons-list-name">{$_ADMINLANG.setup.title}</span>
						</a>
					</li>
				{/if}
				{if in_array("Apps and Integrations",$admin_perms)}
				<li>
					<a id="Menu-Config-Apps-Integrations" href="{routePath('admin-apps-index')}">
						<span class="icons-list-icon"><i class="fad fa-cubes"></i></span>
						<span class="icons-list-name">{$_ADMINLANG.setup.appsAndIntegrations}</span>
					</a>
				</li>
				{/if}
				{if in_array("Configure Administrators",$admin_perms)}
					<li>
						<a id="Menu-Config-Admins" href="configadmins.php">
							<span class="icons-list-icon"><i class="fad fa-user-friends"></i></span>
							<span class="icons-list-name">{$_ADMINLANG.config.manageAdmins}</span>
						</a>
					</li>
				{/if}
				{if in_array("Health and Updates", $admin_perms)}
					<li>
						<a id="Menu-Config-HealthStatus" href="systemhealthandupdates.php">
							<span class="icons-list-icon"><i class="fad fa-heart-rate"></i></span>
							<span class="icons-list-name">{$_ADMINLANG.healthCheck.menuTitle}</span>
						</a>
					</li>
				{/if}
				{if in_array("Configure General Settings",$admin_perms)}
					<li>
						<a id="Menu-Config-SetupWizard" href="#" onclick="openSetupWizard();return false;">
							<span class="icons-list-icon"><i class="fad fa-magic"></i></span>
							<span class="icons-list-name">{$_ADMINLANG.help.setupWizard}</span>
						</a>
					</li>
				{/if}
				{if in_array("View Activity Log",$admin_perms)}
					<li>
						<a id="Menu-Config-SysLogs" href="systemactivitylog.php">
							<span class="icons-list-icon"><i class="fad fa-copy"></i></span>
							<span class="icons-list-name">{$_ADMINLANG.config.sysLogs}</span>
						</a>
					</li>
				{/if}
				
				</ul>
			  </li>
			{/if}

				  
				<li class="nav-vertical-separator"></li>
				<!-- User Account Menu -->
				<li class="dropdown user user-menu">
				  <a href="#" class="dropdown-toggle" data-toggle="dropdown">
					<img class="user-image" src="//www.gravatar.com/avatar.php?gravatar_id={$lara_adminemail_md5}" />
				  </a>
				  <ul class="dropdown-menu">
					<!-- User image -->
					<li class="user-header">
					  <img src="//www.gravatar.com/avatar.php?gravatar_id={$lara_adminemail_md5}" class="img-circle"  style="background-color: #ffffff;" />
					</li>
					<div class="box">
						<div class="box-body">
							<a href="index.php" class="btn btn-block btn-primary btn-social"><i class="fa fa-home "></i>{$_ADMINLANG.home.title}</a>
							<a href="../" class="btn btn-block btn-primary btn-social"><i class="fa fa-sign-in "></i>{$_ADMINLANG.global.clientarea}</a>
							<a a href="#" data-toggle="modal" data-target="#modalMyNotes" class="btn btn-block btn-primary btn-social"><i class="fa fa-files-o"></i>{$_ADMINLANG.global.mynotes}</a>
							<a href="myaccount.php" class="btn btn-block btn-primary btn-social"><i class="fa fa-wrench"></i>{$_ADMINLANG.global.myaccount}</a>
							<a id="logout" href="logout.php" class="btn btn-block btn-danger btn-social"><i class="fa fa-sign-out "></i>{$_ADMINLANG.global.logout}</a>
						</div>
					</div>
					<!-- Menu Body -->
					<!-- Menu Footer-->
				  </ul>
				</li>				
				<li class="nav-vertical-separator"></li>
			    <!-- Control Sidebar Toggle Button -->
				  {if ($sidebar eq "support") && $inticket}{assign var=sidebaractiveicon value="fa-ticket" nocache}{assign var=ticketTabStatus value="active" scope="global" nocache}
				  {elseif ($sidebar eq "addonmodules") && ($addon_module_sidebar) }{assign var=sidebaractiveicon value="fa-puzzle-piece" nocache}{assign var=addonmodulesTabStatus value="active" scope="global" nocache}
				  {else}{assign var=sidebaractiveicon value="fa-bars" nocache}{assign var=homeTabStatus value="active" scope="global" nocache}
				  {/if}	
				   <li>
					<a href="#" data-toggle="control-sidebar" ><i id="sidebar-menu-active-icon" class="fa {$sidebaractiveicon}"></i></a>
				  </li>
            </ul>
          </div>
        </nav>
      </header>