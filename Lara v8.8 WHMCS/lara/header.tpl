<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="{$charset}">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
	<meta name="referrer" content="same-origin">

    <title>{$lara_options.settings.logo_lg_txt|default:'WHMCS'} - {$pagetitle}</title>

    <link href="//fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic" rel="stylesheet">
    <link href="templates/{$template}/css/all.min.css?v={$versionHash}" rel="stylesheet" />
	<link href="templates/{$template}/css/theme.min.css?v={$versionHash}" rel="stylesheet" />
	<link href="{\WHMCS\Utility\Environment\WebHelper::getBaseUrl()}/assets/css/fontawesome-all.min.css" rel="stylesheet" />
	<script type="text/javascript" src="templates/{$template}/js/vendor.min.js?v={$versionHash}"></script>
    <script type="text/javascript" src="templates/{$template}/js/scripts.min.js?v={$versionHash}"></script>	
	
	<script type="text/javascript">
		var adminBaseRoutePath = "{\WHMCS\Admin\AdminServiceProvider::getAdminRouteBase()}",
            whmcsBaseUrl = "{\WHMCS\Utility\Environment\WebHelper::getBaseUrl()}";
			
		function getlrFullPath(lrpath){
			return whmcsBaseUrl + adminBaseRoutePath + '/' + lrpath;
		}
	</script>

	{if empty($lara_options.cuser.permissions)}{$lara_options.cuser.permissions = []}{/if}	

	<!-- Lara Javascript -->
	<script type="text/javascript" src="templates/{$template}/dist/js/lara-main.js?larav={$lara_options.settings.version}"></script>
	
    <script type="text/javascript">
		$(function () {
			try {
				$("#inputIntelliSearchValue").focus(function() {
					$("#intelliSearchForm").removeAttr( 'style' );
				});
			} catch(err) {
				console.log(err.message);
			}
			
			setNavigation();
			$.AdminLTE.layout.fix();
		});

		function setNavigation() {
			var fullpath = $(location).attr("href");
			var path = fullpath.substr(fullpath.lastIndexOf('/') + 1);
			var newPath = $(location).attr('pathname')+$(location).attr('search'); 

			$(".sidebar-menu a").each(function () {
				var href = $(this).attr('href');
				if ((decodeURI(path) === href) || (decodeURI(newPath) === href)) {
					if($(this).attr('id')){
						$(this).parents('li').addClass('active');
					}
				}
			});
			
			try {
				if (newPath.includes("tldsync")){ $("#Menu-Setup").parents('li').removeClass("active"); }
			} catch(err) {
				console.log(err.message);
			}
		}	
	
        var datepickerformat = "{$datepickerformat}",
            csrfToken="{$csrfToken}";

        {if $jquerycode}
            $(document).ready(function(){ldelim}
                {$jquerycode}
            {rdelim});
        {/if}
        {if $jscode}
            {$jscode}
        {/if}
    </script>

    {$headoutput}

	<!-- Lara main CSS -->
    <link href="templates/{$template}/dist/css/lara-main.css?larav={$lara_options.settings.version}" rel="stylesheet" type="text/css" />
	
	<!-- Custom JavaScript and Style Sheets -->
	{if !empty($lara_custom_files.css) && $lara_custom_files.css === true}
	<link href="templates/{$template}/custom/custom.css" rel="stylesheet" type="text/css" />
	{/if}
	
	{if !empty($lara_custom_files.js) && $lara_custom_files.js === true}
	<script type="text/javascript" src="templates/{$template}/custom/custom.js" ></script>
	{/if}
	
  </head>
 
  <body class="{if $lara_current_skin} {$lara_current_skin} {else} skin-blue {/if} sidebar-mini {if {$minsidebar} || {$lara_lrsidebar eq 'expandonhover'}} sidebar-collapse {/if} {$lara_lrlayout} {$lara_lrsidebar} {if !empty($globalAdminWarningMsg)} has-warning-banner{/if}" data-phone-cc-input="{if !empty($phoneNumberInputStyle)}{$phoneNumberInputStyle}{/if}">
    
	<script type="text/javascript">
	{literal}
		if (typeof (Storage) !== "undefined") {	if (localStorage.getItem('controlsidebaropen') == 1){ $('body').addClass('control-sidebar-open');}}
	{/literal}
	</script>
  
  {$headeroutput}
  
    <div class="wrapper">
	
	{include file="$template/header-nav.tpl"}  
    {include file="$template/nav.tpl"}

    <!-- Content Wrapper. Contains page content -->
      <div class="content-wrapper" id="contentarea">
        <!-- Content Header (Page header) -->
		{if ($sidebar ne "home")}
        <section class="content-header">

            {if $helplink}
                <div style="float: right; background: #fff;padding: 2px;border-radius: 5px;">
                    <a href="http://docs.whmcs.com/{$helplink}" target="_blank">
                        <i class="far fa-question-circle fa-2x"></i>
                        {$_ADMINLANG.help.contextlink}
                    </a>
                </div>
            {/if}
			
	
          <h1>{$pagetitle}</h1>
        </section>
		{/if}

        <!-- Main content -->
        <section class="content">
		
		<div class="alert alert-warning global-admin-warning">
		     {$globalAdminWarningMsg}
		</div>		
		
		{include file="$template/widgets/lara_errors.tpl"}
