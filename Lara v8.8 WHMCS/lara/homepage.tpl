
<div class="clearfix"></div>

{$infobox}


{foreach from=$addons_html item=addon_html}
    <div class="addon-html-output-container">
        {$addon_html}
    </div>
{/foreach}

<div class="lr-home-widgets-fixed" data-laracontainer="fixed">

{foreach $lara_options.cuser.sorted_widgets as $wID => $widget }
	{if {$widget->getId()|strtolower == "badges"} && {{${"lara_badges_state"}} ne "closed"}}
	<div data-larawidget="badges">
		{$widget->render()}
	</div>
		{break}
	{/if}
{/foreach}

{if empty($lara_options.cuser.permissions)}{$lara_options.cuser.permissions = []}{/if}
{foreach $lara_options.cuser.sorted_widgets as $wID => $widget }
	{if {in_array("lrgawidget_perm_ga",$lara_options.cuser.permissions)} && {$widget->getId()|strtolower == "laragoogleanalyticswidget"} && {{${"lara_laragoogleanalyticswidget_state"}} ne "closed"}}
	<div data-larawidget="laragoogleanalyticswidget">
		{$widget->render()}
	</div>
		{break}
	{/if}
{/foreach}
</div>
<div class="lara-tablet-size-detector"></div>
<div class="lr-home-widgets-container" data-laracontainer="flex">
    <div class="lr-dashboard-panel-sizer"></div>
    {assign var=widgetsIcons value=["overview"       => "fas fa-chart-line",
									"automation"     => "fas fa-cogs",
									"support"        => "fas fa-phone-square",
									"billing"        => "fas fa-dollar-sign",
									"staff"          => "fas fa-users",
									"todo"           => "fas fa-list-ol",
									"clientactivity" => "fas fa-sign-in-alt",
									"networkstatus"  => "fas fa-sitemap",
									"health"         => "fas fa-medkit",
									"activity"       => "far fa-file-alt"]}

    {foreach $lara_options.cuser.sorted_widgets as $wID => $widget name=counter}
		{if {$widget->getId()|strtolower != "badges"} && {$widget->getId()|strtolower != "laragoogleanalyticswidget"} && {{${"lara_`$widget->getId()|strtolower`_state"}} ne "closed"}}
		{assign var=cWidgetColumnSize value=$lara_options.cuser.widgets_sizes[$widget->getId()|strtolower]|default:$widget->getColumnSize()}

        <div id="panel{$widget->getId()}" class="lr-dashboard-panel-item lr-dashboard-panel-item-columns-{$cWidgetColumnSize}" data-larawidget="{$widget->getId()|strtolower}" data-item-id="{$wID}" data-item-columns="{$cWidgetColumnSize}">
            {if $widget->showWrapper()}
                <div class="panel panel-default lr-panel-default widget-{$widget->getId()|strtolower}" data-widget="{$widget->getId()}">
                    <div class="panel-heading">
                        <div class="widget-tools">
							<span class="lara-show-resize">
						    <a href="#" class="lrgawidget-compress" data-lrwidgetools='compress' style="display:none"><i class="far fa-minus-square"></i></a>						
							<a href="#" class="lrgawidget-expand" data-lrwidgetools='expand' style="display:none"><i class="far fa-plus-square"></i></a>
							</span>
                            <a href="#" class="widget-refresh"><i class="fas fa-sync"></i></a>
							<a href="#" class="lrgawidget-close" data-lrwidgetools='remove'><i class="fas fa-times"></i></a>
                        </div>
                        <h3 class="panel-title"><i class="{$widgetsIcons[$widget->getId()|strtolower]|default:'fas fa-puzzle-piece'}"></i>{$widget->getTitle()}</h3>
                    </div>
                    <div class="panel-body">
            {/if}

            {$widget->render()}

            {if $widget->showWrapper()}
                    </div>
                </div>
            {/if}
        </div>
		{/if}
    {/foreach}
</div>	
<script type="text/javascript" src="templates/{$template}/dist/js/lara-homepage.js?larav={$lara_options.settings.version}"></script>

{$generateInvoices}
{$creditCardCapture}
