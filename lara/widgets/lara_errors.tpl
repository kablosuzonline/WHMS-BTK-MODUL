		{if {!in_array("Addon Modules",$admin_perms)} || {!{$addon_modules.lara_addon}}}
			<div class="callout callout-danger">
				<h4>Alert !</h4>
				The theme cannot communicate with the "<b>Lara Theme Settings</b>" addon module, which is used to save user's settings, and must be accessible for the theme to work.
				<br>While trying to communicate with module, we recorded the following errors :<br><br>
				
				{if !in_array("Addon Modules",$admin_perms)}
				<ul class="fa-ul">
					<li><i class="fa-li fa fa-warning"></i>Your admin group doesn't have <b>"Addon Modules"</b> Permission.</li>
				  {if in_array("Configure Admin Roles",$admin_perms)}
					<li><i class="fa-li fa fa-check-square"></i>Go to <a href="configadminroles.php">Administrator Roles</a>, edit your admin group, select <b>"Addon Modules"</b>, then click <b>Save Changes</b>.</li>
				  {else}
					<li><i class="fa-li fa fa-check-square"></i>Contact an administratior to enable <b>"Addon Modules"</b> permission to your admin group.</li>
				  {/if}
				</ul>
				{/if}
				
				{if !{$addon_modules.lara_addon}}
				<ul class="fa-ul">
					<li><i class="fa-li fa fa-warning"></i><b>Lara Theme Settings</b> addon module is either de-activated or your admin group doesn't have permission to use it.</li>
				 {if in_array("Configure Addon Modules",$admin_perms)}
					<li><i class="fa-li fa fa-check-square"></i>Go to <a href="configaddonmods.php">Addon Modules Configuration</a>, <b>Activate</b> the module (if not active), then click <b>Configure</b>, select you admin group and click <b>Save Changes</b>.</li>
				 {else}
					<li><i class="fa-li fa fa-check-square"></i>Contact an administratior to <b>activate</b> the module and permit access to your admin group.</li>
				 {/if}
				 </ul>
				{/if}

			</div>
		{else}

			{if {$lara_options.errors}}
			<div class="callout callout-danger">
				<h4>Fatal Error</h4>
				<ul class="fa-ul">
				{foreach from=$lara_options.errors item=laraerror}
					<li><i class="fa-li fa fa-warning"></i>{$laraerror}</li>
				{/foreach}
				</ul>	
			</div>			
			{/if}

			{if {!$lara_features_alert} && {$sidebar eq "home"} && {in_array("Configure Admin Roles",$admin_perms)} && {!in_array("lrgawidget_perm_ga",$lara_options.cuser.permissions)} && {!in_array("lrchatwidget",$lara_options.cuser.permissions)}}
			<div class="callout callout-success">
				<button type="button" class="close" data-lrdismiss="features_alert" >×</button>
				<h4><i class="fa fa-lightbulb-o"></i> Tip</h4>
				<ul class="fa-ul">
					<li><i class="fa-li fa fa-warning"></i>Some of the theme features (i.e, <b>Google Analytics</b>, <b>Staff Chat</b> ..etc.) are not activated for your admin group.</li>
					<li><i class="fa-li fa fa-check-square"></i>Go to <a href="addonmodules.php?module=lara_addon">Lara Theme Settings</a>, click on <b>"Permissions"</b>, select your admin group and enable those features, then click <b>Save</b>.</li>
				</ul>	
			</div>			
			{/if}
			
			{if {!$lara_lrateus_alert} && {$pagetitle eq "Lara Theme Settings"} && {in_array("Configure Admin Roles",$admin_perms)}}
			<div class="callout callout-info">
				<button type="button" class="close" data-lrdismiss="lrateus_alert" >×</button>
				<h4><i class="far fa-thumbs-up"></i> Do you like the theme ?</h4>
				<ul class="fa-ul">
					<li><i class="fa-li far fa-star"></i>If you have a free moment, and want to help us spread the word and boost our motivation, please do us a <b>BIG</b> favour and review the theme on <a href="https://marketplace.whmcs.com/product/1046#reviews" target="_blank">WHMCS MarketPlace</a> .. Thanks in advance !</li>
					<li>&nbsp;</li>
					<li><i class="fa-li fas fa-info-circle"></i> This notice is only shown to Full Administrators.</li>
				</ul>	
			</div>			
			{/if}			

		{/if}	