          <div class="tab-pane active" id="control-sidebar-ticket-tab">
  
            <ul class="control-sidebar-menu">
              <li>
                <a href="#">
                  <i class="menu-icon fa fa-ticket bg-red "></i>
                  <div class="menu-info">
                    <h4 class="control-sidebar-subheading">{$_ADMINLANG.support.ticketinfo}</h4>
                    <p><div class="progress progress-xxs"><div class="progress-bar progress-bar-danger" style="width: 100%"></div></div></p>
                  </div>
                </a>
              </li>
            </ul>
			
            <div class="form-group">
			    <label>{$_ADMINLANG.fields.owner}</label>
				<p>
					{if $userid}
						<i class="fa fa-user"></i>&nbsp;&nbsp;<a href="clientssummary.php?userid={$userid}"{if $clientgroupcolour} style="background-color:{$clientgroupcolour}"{/if} target="_blank">
						  {$clientname}
						</a>
						{if $contactid} 
						  (<i class="fa fa-user"></i>&nbsp;&nbsp;<a href="clientscontacts.php?userid={$userid}&contactid={$contactid}"{if $clientgroupcolour} style="background-color:{$clientgroupcolour}"{/if} target="_blank">{$contactname}</a>)
						{/if}
					{else}
					     <i class="fa fa-user"></i>&nbsp;&nbsp;<a href="{$SCRIPT_NAME}?email={$email|urlencode}">{$name}</a><br />
						 <i class="fa fa-envelope-o"></i>&nbsp;&nbsp;{$email}
					{/if}
				</p>
			</div>
			
            <div class="form-group">
			    <label>{$_ADMINLANG.fields.requestor}</label>
				<p>
					{$requestor.name}
					<span class="label requestor-type-{$requestor.type_normalised}" style="margin: 5px;">
						{if $requestor.type_normalised eq 'operator'}
							{lang key='support.requestor.operator'}
						{elseif $requestor.type_normalised eq 'owner'}
							{lang key='support.requestor.owner'}
						{elseif $requestor.type_normalised eq 'authorizeduser'}
							{lang key='support.requestor.authorizeduser'}
						{elseif $requestor.type_normalised eq 'registereduser'}
							{lang key='support.requestor.registereduser'}
						{elseif $requestor.type_normalised eq 'subaccount'}
							{lang key='support.requestor.subaccount'}
						{elseif $requestor.type_normalised eq 'guest'}
							{lang key='support.requestor.guest'}
						{/if}
					</span>
					<br>
					<small>{$requestor.email}</small>
				</p>
			</div>			
			
			<div class="form-group">
				<label>{$_ADMINLANG.support.staffparticipants}</label>
				<p>
					{foreach from=$staffinvolved item=staffname}
						<i class="fa fa-user"></i>&nbsp;&nbsp;{$staffname}<br />
					{foreachelse}
						- No Replies Yet
					{/foreach}
				</p>
			</div>
			
			<div class="form-group">
				<label>{$_ADMINLANG.support.department}</label>
				<input type="hidden" id="currentdeptid" value="{$deptid}" />
				<select id="deptid" data-update-type="deptid" class="form-control input-sm sidebar-ticket-ajax">
					{foreach from=$departments item=department}
						<option value="{$department.id}"{if $department.id eq $deptid} selected{/if}>{$department.name}</option>
					{/foreach}
				</select>
			</div>
			
			
			<div class="form-group">
			<label>{$_ADMINLANG.support.assignedto}</label>
				<div class="input-group">
					<span class="input-group-addon input-sm"><a href="#" onclick="$('#flagto').val({$adminid});$('#flagto').trigger('change');return false"><i class="fa fa-arrow-circle-right"></i></a></span>
					<input type="hidden" id="currentflagto" value="{$flag}" />
					<select id="flagto" data-update-type="flagto" class="form-control input-sm select-assignto sidebar-ticket-ajax">					
						<option value="0">{$_ADMINLANG.global.none}</option>
						{foreach from=$staff item=staffmember}
							<option value="{$staffmember.id}"{if $staffmember.id eq $flag} selected{/if}>{$staffmember.name}</option>
						{/foreach}
					</select>
				</div>
			</div>
			
			
			<div class="form-group">
				<label>{$_ADMINLANG.support.priority}</label>
				<input type="hidden" id="currentpriority" value="{$priority}" />
				<select id="priority" data-update-type="priority" class="form-control input-sm sidebar-ticket-ajax">				
					<option value="High"{if $priority eq "High"} selected{/if}>{$_ADMINLANG.status.high}</option>
					<option value="Medium"{if $priority eq "Medium"} selected{/if}>{$_ADMINLANG.status.medium}</option>
					<option value="Low"{if $priority eq "Low"} selected{/if}>{$_ADMINLANG.status.low}</option>
				</select>
			</div>


            <div class="form-group">
				<label>{$_ADMINLANG.support.tags}</label>
				<input id="ticketTags" value="{$tags|implode:','}" class="form-control selectize-tags" placeholder="{lang key='support.addTag'}" />
			</div>
			
			{foreach $sidebaroutput as $output}
				<div>
					{$output}
				</div>
			{/foreach}			
			
			<div class="form-group watch-ticket">
			    <br />
				{if $watchingTicket}
					<button class="btn btn-danger btn-block btn-sm" id="watch-ticket" type="button" data-admin-full-name="{$adminFullName}" data-admin-id="{$adminid}" data-ticket-id="{$ticketid}" data-type="unwatch">
						{lang key="support.unwatchTicket"}
					</button>
				{else}
					<button class="btn btn-success btn-block btn-sm" id="watch-ticket" type="button" data-admin-full-name="{$adminFullName}" data-admin-id="{$adminid}" data-ticket-id="{$ticketid}" data-type="watch">
						{lang key="support.watchTicket"}
					</button>
				{/if}
			</div>


            <ul class="control-sidebar-menu" >
              <li>
                <a href="#">
                  <i class="menu-icon fa  fa-binoculars bg-red "></i>
                  <div class="menu-info">
                    <h4 class="control-sidebar-subheading">{$_ADMINLANG.support.ticketWatchers}</h4>
                    <p><div class="progress progress-xxs"><div class="progress-bar progress-bar-danger" style="width: 100%"></div></div></p>
					<br />
					<span class="ticketWatchersulcustom">
						<ul id="ticketWatchers">
							{foreach $ticketWatchers as $k => $ticketWatcher}
								<li id="ticket-watcher-{$k}">{$ticketWatcher}</li>
							{/foreach}
							<li id="ticket-watcher-0"{if $ticketWatchers} class="hidden"{/if}>{$_ADMINLANG.global.none}</li>
						</ul>
					</span>
                  </div>
                </a>
              </li>
            </ul>

            <ul class="control-sidebar-menu" >
              <li>
                <a href="#">
                  <i class="menu-icon far fa-envelope bg-red "></i>
                  <div class="menu-info">
                    <h4 class="control-sidebar-subheading">{lang key="support.ccrecipients"}</h4>
                    <p><div class="progress progress-xxs"><div class="progress-bar progress-bar-danger" style="width: 100%"></div></div></p>
					<br />
					<span class="ticketWatchersulcustom">
						<ul id="ticketCcRecipients">
							{foreach $ticketCc as $k => $cc}
								<li id="ticket-cc-{$k}">{$cc}</li>
							{/foreach}
							<li id="ticket-cc-0"{if $ticketCc} class="hidden"{/if}>{lang key="global.none"}</li>
						</ul>
					</span>
                  </div>
                </a>
              </li>
            </ul>			

		</div>
