<tr><td class="fieldlabel" width="250">{$hook->name}</td>
    <td class="fieldlabel" width="150">
        {if $hook->class != 'client_2fa'}
            <div>
                <input type="checkbox" {if $data.status}checked="checked"{/if} value="1" data-switch-set="size" data-switch-value="small" name="hooks[{$hook->class}]">
            </div>
        {else}
            <div style="display: none">
                <input type="checkbox" {if $data.status}checked="checked"{/if} value="1" data-switch-set="size" data-switch-value="small" name="hooks[{$hook->class}]">                
            </div> 
            <a href="configtwofa.php" class="btn btn-primary" target="_blank">{$WALANG.configurations}</a>            
        {/if}
    </td>
    <td class="fieldarea">
        <div class="col-lg-12" style="padding: 0px;">
            <div class="form-group">
                {foreach from=$langs item=lang}
                    <div class="translatable-field lang-{$lang}" style="display: {if $dlang == $lang}block;{else}none;{/if}">
                        <div class="col-lg-9" style="margin-right: 0px;padding-right: 0px;padding-left: 0px;">
                            <textarea id="{$hook->class}{$lang}" name="messages[{$hook->class}][{$lang|strtolower}]" class="form-control">{$data['langs'][$lang]}</textarea>
                        </div>
                        <div class="col-lg-1" style="padding-left: 0px;">
                            <button type="button" class="btn btn-default dropdown-toggle" tabindex="-1" data-toggle="dropdown" aria-expanded="false">
                                {$lang|ucfirst}
                                <i class="icon-caret-down"></i>
                            </button>
                            <ul class="dropdown-menu">
                                {foreach from=$langs item=wslang}
                                    <li><a href="javascript:hideOtherLanguage('{$wslang|strtolower}');" tabindex="-1"></a></li><li><a href="javascript:hideOtherLanguage('{$wslang|strtolower}');" tabindex="-1">{$wslang|ucfirst}</a></li>
                                    {/foreach}
                            </ul>
                        </div>
                    </div>
                {/foreach}
            </div>
        </div>
        <span style="padding: 3px;margin: 5px;font-size: smaller;">{$hook->description}</span>
        {if $showdlt}
            {foreach from=$langs item=lang}
                <input placeholder="DLT Template ID" type="text" name="dlts[{$hook->class}][{$lang|strtolower}]" value="{if $dltitems[strtolower($lang)]}{$dltitems[strtolower($lang)]}{/if}" class="form-control input-200 translatable-field lang-{$lang}" style="display: {if $dlang == $lang}block;{else}none;{/if}">
            {/foreach}
        {/if}
    </td>
</tr> 
