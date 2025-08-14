
function sanitize(inputString) {
const map = {
'&': '&amp;',
'<': '&lt;',
'>': '&gt;',
'"': '&quot;',
"'": '&#x27;',
"/": '&#x2F;',
'`': '&grave;'
};
const reg = /[&<>"'/`]/g;
    return inputString.replace(reg, (match)=>(map[match]));
}

kerio.waw.ui.activeHostsList = {
	k_init: function(k_objectName) {
		var
			k_tr = kerio.lib.k_tr,
			k_localNamespace = k_objectName + '_',
			k_shared = kerio.waw.shared,
			k_sharedMethods = k_shared.k_methods,
			k_isAuditor = k_sharedMethods.k_isAuditor(),
			AuthMethodType = k_shared.k_CONSTANTS.AuthMethodType,
			k_trAuthenticationMethod = [],
			k_columnCurrentDownload = 'currentDownload',
			k_columnCurrentUpload = 'currentUpload',
			k_columnTotalDownload = 'totalDownload',
			k_columnTotalUpload = 'totalUpload',
			k_trFirewall = k_tr('Firewall', 'common'),
			k_timeUnits = k_sharedMethods.k_getTimeUnitsTableString(),
			k_contextMenuCfg,
			k_grid, k_gridCfg,
			k_activityGrid, k_activityGridCfg,
			k_formConnections, k_formConnectionsCfg,
			k_formGeneral, k_formHistogram, k_formCfg,
			k_layout, k_layoutCfg,
			k_tabPage, k_tabPageCfg,
			k_formatNumberRenderer,
			k_getContent,
			k_renderFormattedTime,
			k_renderSortableTime,
			k_activityTypeRenderer,
			k_activityRenderer,
			k_onDisableRefreshHosts,
			k_onDisableRefreshConnections,
			k_resetPendingRequest;


		k_trAuthenticationMethod[AuthMethodType.AuthMethodWeb] = k_tr('Plain text', 'activeHostsList');
		k_trAuthenticationMethod[AuthMethodType.AuthMethodSslWeb] = k_tr('SSL', 'activeHostsList');
		k_trAuthenticationMethod[AuthMethodType.AuthMethodNtlm] = k_tr('NTLM', 'activeHostsList');
		k_trAuthenticationMethod[AuthMethodType.AuthMethodProxy] = k_tr('Proxy', 'activeHostsList');
		k_trAuthenticationMethod[AuthMethodType.AuthMethodAutomatic] = k_tr('Automatic', 'activeHostsList');
		k_trAuthenticationMethod[AuthMethodType.AuthMethodVpnClient] = k_tr('VPN Client', 'activeHostsList');
		k_trAuthenticationMethod[AuthMethodType.AuthMethodSso] = k_tr('Kerio Unity Sign-On', 'activeHostsList');
		k_trAuthenticationMethod[AuthMethodType.AuthMethodRadius] = k_tr('RADIUS', 'activeHostsList');

		// Bug 67934 - handle expired active hosts, create shared method for k_onError while loading content for tabs
		if (undefined === k_sharedMethods.k_onErrorActiveHostsDetails) {
			/**
			 * Handles expired hosts while accessing tabs with details - error 1002 (Invalid host ID) is retrieved in that case
			 *
			 * @param  k_response [Object]
			 * @return [true/undefined] true - skip internal error handling, undefined to continue with internal error handling
			 */
			k_sharedMethods.k_onErrorActiveHostsDetails = function(k_response) {
				var
					k_error,
					k_tr;

				if (false === k_response.k_isOk) {
					k_error = k_response.k_decoded.error;
					if (k_error && k_error.code && 1002 === k_error.code) {
						k_tr = kerio.lib.k_tr;
						kerio.lib.k_confirm({
							k_title: k_tr('Confirm Action', 'common'),
							k_msg: [
								k_tr('The requested host has already expired, its data are not available anymore.', 'activeHostsList'),
								'<br><br>',
								'<b>',
								k_tr('Do you want to refresh the list of active hosts?', 'activeHostsList'),
								'</b>'
							].join(''),
							k_callback: function(k_answer) {
								if ('yes' === k_answer) {
									this.k_forceRefresh = true;
									this.k_reloadData();
								}
							},
							k_scope: this.k_gridHosts
						});

						return true;
					}
				}
			};
		}

		/**
		 * Format megabytes
		 */
		k_formatNumberRenderer = function(k_value) {
			var
				kerio_web_SharedConstants = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants,
				k_formatedValue = kerio.waw.shared.k_methods.k_formatDataUnits({ k_value: k_value, k_units: kerio_web_SharedConstants.kerio_web_KiloBytes, k_outputUnits: kerio_web_SharedConstants.kerio_web_KiloBytes, k_isInTime: true, k_numberFormat: {k_decimalPlaces: 0}});

			return {
				k_data: k_formatedValue.k_formatedValue,
				k_dataTooltip: k_formatedValue.k_tooltipString
			};
		};

		/**
		 * Renders time in format HH:MM:SS
		 *
		 * @param  k_value        [Object] Data value
		 * @return [Object]       configuration for renderer (see WebLib 1.1 documentation)
		 */
		k_renderFormattedTime = function(k_value) {
			this.k_timeObject.sec = k_value;
			return {
				k_data: kerio.waw.shared.k_methods.k_formatTime(this.k_timeObject)
			};
		};

		/**
		 * time renderer, fills cell's value to be sortable
		 *
		 * @param  k_value [Mixed]
		 * @param  k_data  [Object]
		 * @return [Object]
		 */
		k_renderSortableTime = function(k_value, k_data) {
			var
				k_TIME_CONSTANTS = kerio.waw.shared.k_CONSTANTS.k_TIME_CONSTANTS,
				k_time = k_data.time;

			k_data.timeRenderer = k_time.hour * k_TIME_CONSTANTS.k_SECONDS_IN_HOUR + k_time.min * k_TIME_CONSTANTS.k_SECONDS_IN_MIN + k_time.sec;
			return {
				k_data: kerio.waw.shared.k_methods.k_formatTime(k_data.time)
			};
		}; //k_renderSortableTime()

		/**
		 * returns host's activity type name and icon
		 *
		 * @param  k_type [Number]
		 * @return [Object]
		 *              .k_data    [String] translated name of activity
		 *              .k_iconCls [String] CSS class with icon
		 */
		k_activityTypeRenderer = function(k_type) {
			var
				ActivityType = kerio.waw.shared.k_CONSTANTS.ActivityType,
				k_tr = kerio.lib.k_tr,
				k_name = '',
				k_icon = '';

			switch(k_type) {
				case ActivityType.ActivityTypeWeb: //actually not used yet
					k_name = k_tr('Web', 'activeHostsList');
					k_icon = 'web';
					break;
				case ActivityType.ActivityTypeWebSearch:
					k_name = k_tr('Search engine', 'activeHostsList');
					k_icon = 'webSearch';
					break;
				case ActivityType.ActivityTypeWebConnection: //this is for the 'www'
					k_name = k_tr('Web page', 'activeHostsList');
					k_icon = 'web';
					break;
				case ActivityType.ActivityTypeWebMultimedia:
					k_name = k_tr('Multimedia via web', 'activeHostsList');
					k_icon = 'webMultimedia';
					break;
				case ActivityType.ActivityTypeMultimedia:
					k_name = k_tr('Multimedia', 'activeHostsList');
					k_icon = 'multimedia';
					break;
				case ActivityType.ActivityTypeHTTPConnection:
					k_name = k_tr('HTTP connection', 'activeHostsList');
					k_icon = 'httpConn';
					break;
				case ActivityType.ActivityTypeDownload:
					k_name = k_tr('Download', 'activeHostsList');
					k_icon = 'download';
					break;
				case ActivityType.ActivityTypeUpload:
					k_name = k_tr('Upload', 'activeHostsList');
					k_icon = 'upload';
					break;
				case ActivityType.ActivityTypeMail:
					k_name = k_tr('Email', 'activeHostsList');
					k_icon = 'mail';
					break;
				case ActivityType.ActivityTypeMailConnection: //for user there is no difference from mail
					k_name = k_tr('Email', 'activeHostsList');
					k_icon = 'mail';
					break;
				case ActivityType.ActivityTypeP2p:
					k_name = k_tr('Active P2P', 'activeHostsList');
					k_icon = 'p2p';
					break;
				case ActivityType.ActivityTypeP2pAttempt:
					k_name = k_tr('Blocked P2P', 'activeHostsList');
					k_icon = 'p2pAttempt';
					break;
				case ActivityType.ActivityTypeRemoteAccess: //this is for SSH, Telnet etc.
					k_name = k_tr('Remote access', 'activeHostsList');
					k_icon = 'remoteAccess';
					break;
				case ActivityType.ActivityTypeVpn: //Kerio VPN, IPsec, etc.
					k_name = k_tr('VPN', 'activeHostsList');
					k_icon = 'vpn';
					break;
				case ActivityType.ActivityTypeInstantMessaging:
					k_name = k_tr('Instant messaging', 'activeHostsList');
					k_icon = 'im';
					break;
				case ActivityType.ActivityTypeHugeConnection:
					k_name = k_tr('Large data transfer', 'activeHostsList');
					k_icon = 'hugeConn';
					break;
				case ActivityType.ActivityTypeSip:
					k_name = k_tr('SIP VoIP session', 'activeHostsList');
					k_icon = 'sip';
					break;
				case ActivityType.ActivityTypeSocialNetwork:
					k_name = k_tr('Social network', 'activeHostsList');
					k_icon = 'socialNetwork';
					break;
				default:
					kerio.lib.k_reportError('Unknown Activity type "%1".'.replace('%1', k_type), 'renderer', 'k_activityTypeRenderer');
			} //switch type

			return {
				k_data: k_name,
				k_iconCls: 'activityIcon ' + k_icon
			};
		}; //k_activityTypeRenderer()

		/**
		 * returns host's activity description with optional URL link
		 *
		 * @param  k_value [reserved]
		 * @param  k_data  [Object]
		 *              .type         [Number] activity type
		 *              .description  [Object] translatable message
		 *              .url          [String] (optional)
		 * @return [Object]
		 *              .k_data    [String] translated description as HTML link
		 */
		k_activityRenderer = function(k_value, k_data) {
			var
				k_name = '',
				k_tooltip = '',
				k_url;

				if (k_data.description) {
					k_name = kerio.waw.shared.k_methods.k_translateErrorMessage(k_data.description);
					k_name = k_name.trim();
					k_tooltip = k_name;
				}

				if (k_data.url) {
					 //Bug 66071 - make sure no quotes nor apostrophes are in the string that will be used to generate HTML/JS code
					 //Note: server name cannot (shouldn't) contain quote or apostrophe so it can be only in params that can be safely encoded to %XX characters
					 //      and if not and server name will contain quote/apostrophe it's still better that the link will lead to "Server not found" that causing webassist
					k_url = k_data.url.replace(this.k_quotationRegExp, '%22').replace(this.k_apostropheRegExp, '%27');

					k_tooltip += '<br><br>' + kerio.lib.k_htmlEncode(k_data.url);

					k_name = '<a class="selectable link textLink" xhref="' + k_url + '" onclick="window.open(\'' + k_url + '\'); return false;">' + k_name + '</a>';
}
return  kerio.waw.k_hacks.k_renderHtmlWithTooltip(  { k_data: k_name,
k_dataTooltip: k_tooltip,
k_isSecure: true
}  )  ;
}; 
k_getContent = function() {
var
k_id = this.k_selectedHostId;
if (!k_id) { return;
}
if (!this.k_isDetailsVisible()) {
return; }
if (this.k_isIPadCompatible && !this._k_iPadTabActivated) { this.k_tabPage.k_setActiveTab('k_tabGeneral');
this._k_iPadTabActivated = true;
}
if (undefined !== this.k_selectedTab.k_loadData) {
this.k_selectedTab.k_loadData(k_id);
}
this.k_formConnections.k_grid.k_setPageSize(0, false); if (false === this.k_formGeneral.k_isFormatted && this.k_formGeneral === this.k_selectedTab) {
this.k_formGeneral.k_isFormatted = true;
this.k_formGeneral.k_extWidget.doLayout();
}
};

k_onDisableRefreshHosts = function(k_disabled) {
this.k_layout.k_autoRefreshGui.k_setDisabled(k_disabled);
};

k_onDisableRefreshConnections = function(k_disabled) {
this.k_parentForm.k_gridHosts.k_disableRefreshGui(k_disabled);
};

k_resetPendingRequest = function() {
this._k_requestPending = false;
};
k_contextMenuCfg = {
k_items: [
{
k_id: 'k_viewUser',
k_caption: k_tr('View in Users', 'contextMenu'),
k_isDisabled: true,

k_onClick: function(k_menu) {
var
k_grid = k_menu.k_relatedWidget,
k_selection = k_grid.k_selectionStatus,
k_domainsDataStore;
if (0 >= k_selection.k_selectedRowsCount) {
return;
}
kerio.waw.shared.k_data.k_get('k_domains');
k_domainsDataStore = kerio.waw.shared.k_data.k_getStore('k_domains');
if (!k_domainsDataStore.k_isLoaded()) {
kerio.waw.shared.k_data.k_registerObserver(k_domainsDataStore, k_grid.k_viewUser, k_grid);
return;
}
k_grid.k_viewUser();
}
},
{
k_id: 'k_userQuota',
k_caption: k_tr('View in Statistics', 'activeHostsList'),
k_isDisabled: true,

k_onClick: function(k_menu) {
var
k_selection = k_menu.k_relatedWidget.k_selectionStatus;
if (0 >= k_selection.k_selectedRowsCount) {
return;
}
kerio.waw.status.k_currentScreen.k_switchPage('userStatistics', {k_userId: k_selection.k_rows[0].k_data.user.id});
}
}
] }; if (!k_isAuditor) {
k_contextMenuCfg.k_items = k_contextMenuCfg.k_items.concat(
{
k_id: 'k_dhcpReservation',
k_caption: k_tr('Make DHCP Reservation by MAC', 'activeHostsList'),
k_isDisabled: true,

k_onClick: function(k_menu) {
var
k_grid = k_menu.k_relatedWidget,
k_selection = k_grid.k_selectionStatus;
if (1 !== k_selection.k_selectedRowsCount) {
return;
}
k_grid.k_getDhcpLeaseForRow(k_selection.k_rows[0].k_data);
}
},
{
k_id: 'k_autologin',
k_caption: k_tr('Login User Automatically by MAC', 'activeHostsList'),
k_isDisabled: true,

k_onClick: function(k_menu) {
var
k_grid = k_menu.k_relatedWidget,
k_selection = k_grid.k_selectionStatus;
if (1 !== k_selection.k_selectedRowsCount) {
return;
}
k_grid.k_getUserForAutologin(k_selection.k_rows[0].k_data);
}
},
{
k_id: 'k_logout',
k_caption: k_tr('Logout User', 'activeHostsList'),
k_isDisabled: true,

k_onClick: function(k_menu, k_item) {
var
k_grid = k_menu.k_relatedWidget,
k_rows = k_grid.k_selectionStatus.k_rows,
k_ids = [],
k_i;
for (k_i = 0; k_i < k_rows.length; k_i++) {
k_ids.push(k_rows[k_i].k_data.id);
}
k_grid.k_logoutUser(k_ids);
}
},
'-',
{
k_id: 'k_logoutAll',
k_caption: k_tr('Logout All Users', 'activeHostsList'),

k_onClick: function(k_menu, k_item) {
k_menu.k_relatedWidget.k_logoutUser([]);
}
}
); } k_gridCfg = {
k_type: 'ActiveHosts',
k_contextMenuCfg: k_contextMenuCfg,
k_loadMask: false,
k_onSetAutoRefreshInterval: k_sharedMethods.k_onSetAutoRefreshInterval,
k_onDisableRefresh: k_onDisableRefreshHosts,
k_columns: {
k_autoExpandColumn: false,
k_items: [
{k_isDataOnly: true,   k_columnId: 'id'} ,
{k_isDataOnly: true,   k_columnId: 'type'} ,
{k_isDataOnly: true,   k_columnId: k_columnCurrentDownload} ,
{k_isDataOnly: true,   k_columnId: k_columnCurrentUpload} ,
{k_isDataOnly: true,   k_columnId: k_columnTotalDownload} ,
{k_isDataOnly: true,   k_columnId: k_columnTotalUpload} ,
{k_caption: k_tr('Hostname',            'activeHostsList'),       k_columnId: 'hostname', k_width: 180,

k_renderer: function(k_value, k_data) {
var
k_ACTIVE_HOST_TYPE = kerio.waw.shared.k_CONSTANTS.ActiveHostType,
k_iconCls = 'hostIcon';
switch (k_data.type) {
case k_ACTIVE_HOST_TYPE.ActiveHostFirevall:
k_iconCls += ' hostFirewall';
break;
case k_ACTIVE_HOST_TYPE.ActiveHostVpnClient:
k_iconCls += ' hostVpnClient';
break;
case k_ACTIVE_HOST_TYPE.ActiveHostHost:
k_iconCls += ' hostHost';
break;
case k_ACTIVE_HOST_TYPE.ActiveHostGuest:
k_iconCls += ' hostGuest';
break;
}
return {
k_data: this.k_formatHostname(k_data),
k_iconCls: k_iconCls
};
}
},
{k_caption: k_tr('User',                'common'),                k_columnId: 'user', k_width: 180,

k_renderer: function(k_value, k_data) {
var
k_name = this.k_formatUsername(k_data);
return {
k_data: k_name,
k_iconCls: '' === k_name ? '' : 'userIcon'
};
}
},
{
k_caption: [k_tr('Current Rx',   'activeHostsList'),' [',k_timeUnits, ']'].join(''),
k_columnId: 'currentDownload',
k_align: 'right',
k_renderer: k_formatNumberRenderer
},
{
k_caption: [k_tr('Current Tx',   'activeHostsList'),' [',k_timeUnits, ']'].join(''),
k_columnId: 'currentUpload',
k_align: 'right',
k_renderer: k_formatNumberRenderer
} ,
{k_caption: k_tr('MAC Address',         'activeHostsList'),        k_columnId: 'macAddress',      k_width: 130, k_isHidden: true,

k_renderer: function(k_value, k_data) {
return {
k_data: this.k_formatMacAddress(k_value)
};
}
} ,
{k_caption: k_tr('IPv4 Address',        'activeHostsList'),        k_columnId: 'ip',              k_isHidden: true,

k_renderer: function(k_value, k_data) {
return {
k_data: this.k_formatIpAddress(k_data)
};
}
} ,
{k_caption: k_tr('IPv4 Address Status', 'activeHostsList'),  k_columnId: 'ipAddressFromDHCP', k_width: 150, k_isHidden: true,

k_renderer: function(k_value, k_data) {
var
k_ACTIVE_HOST_TYPE = kerio.waw.shared.k_CONSTANTS.ActiveHostType,
k_tr = kerio.lib.k_tr,
k_name;
if (k_data.ipAddressFromDHCP) {
k_name = k_tr('DHCP', 'activeHostsList');
}
else if (k_ACTIVE_HOST_TYPE.ActiveHostVpnClient === k_data.type) {
k_name = k_tr('VPN', 'activeHostsList');
}
else {
k_name = k_tr('Static', 'activeHostsList');
}
return {
k_data: k_name
};
}
},
{k_caption: k_tr('IPv6 Address', 'common'), k_width: 300,    k_columnId: 'ip6Addresses',      k_isHidden: true,
k_renderer: function(k_value, k_data) {
var
k_ipv6Addresses = this.k_formatIpv6Address(k_data);
return {
k_data: k_ipv6Addresses,
k_dataTooltip: k_ipv6Addresses
};
}
} ,
{k_caption: k_tr('Login Time', 'activeHostsList'),   k_columnId: 'loginTime',  k_width: 125, k_isHidden: true,

k_renderer: function(k_value, k_data) {
return {
k_data: this.k_formatLoginTime(k_data)
};
}
} ,
{k_caption: k_tr('Login Duration',      'activeHostsList'),        k_columnId: 'loginDuration',  k_isHidden: true,
k_renderer: k_renderFormattedTime
} ,
{k_caption: k_tr('Start Time',          'activeHostsList'),        k_columnId: 'startTime', k_width: 125,  k_isHidden: true,

k_renderer: function(k_value) {
return {
k_data: kerio.waw.shared.k_methods.k_formatDateTime(k_value)
};
}
} ,
{k_caption: k_tr('Inactivity Time',     'activeHostsList'),        k_columnId: 'inactivityTime',  k_isHidden: true,
k_renderer: k_renderFormattedTime
} ,
{k_caption: k_tr('Authentication Type', 'activeHostsList'),        k_columnId: 'authMethod', k_width: 180,  k_isHidden: true,

k_renderer: function(k_value, k_data) {
return {
k_data: this.k_formatAuthMethod(k_data)
};
}
} ,
{k_caption: k_tr('Total Rx [MB]',       'activeHostsList'),        k_columnId: 'totalDownload', k_align: 'right', k_isHidden: true,
k_renderer: kerio.waw.shared.k_methods.k_renderers.k_renderMBColumn
} ,
{k_caption: k_tr('Total Tx [MB]',       'activeHostsList'),        k_columnId: 'totalUpload', k_align:   'right', k_isHidden: true,
k_renderer: kerio.waw.shared.k_methods.k_renderers.k_renderMBColumn
} ,
{k_caption: k_tr('Connections',         'activeHostsList'),        k_columnId: 'connections',  k_align: 'right', k_isHidden: true,

k_renderer: function(k_value) {
if (0 === k_value) {
return {
k_data: ' '
};
}
return {
k_data: k_value
};
} }
]
}, k_filters: {
k_combining: k_shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Or,
k_onBeforeFilterChange: k_sharedMethods.k_onBeforeFilterForMacAddresses
},
k_onLoad: function() {
if (!this.k_dhcpLoaded) {
kerio.waw.requests.k_sendBatch([
{
k_jsonRpc: {
method: 'Dhcp.getConfig'
}
},
{
k_jsonRpc: {
method: 'Dhcp.get',
params: {
query: {
start:0,
limit:-1
}
}
}
}
],
{
k_scope: this,
k_mask: false, k_callback: function(k_responses, k_isOk) {
var
k_scopes,
k_scopesCnt,
k_scopeIds,
k_i;
if (k_isOk) {
k_scopes = k_responses[1].list;
k_scopesCnt = k_scopes.length;
k_scopeIds = [];
if (0 === k_scopesCnt) {
this.k_isDhcpEnabled = false;
return;
}
for (k_i = 0; k_i < k_scopesCnt; k_i++) {
k_scopeIds.push(k_scopes[k_i].id);
}
this.k_dhcpLoaded = true;
this.k_isDhcpEnabled = k_responses[0].config.enabled;
this.k_dhcpScopes = k_scopeIds;
}
}
});
}
}
};
k_grid = new kerio.waw.shared.k_widgets.K_AutorefreshGrid(k_localNamespace + 'grid', k_gridCfg);
k_activityGridCfg = {
k_loadMask: false,
k_columns: {
k_sorting: {
k_columnId: 'timeRenderer',
k_isRemoteSort: false
},
k_items: [
{
k_columnId: 'id',
k_isDataOnly: true
},
{
k_columnId: 'time',
k_isDataOnly: true
},
{
k_columnId: 'timeRenderer',
k_caption: k_tr('Active since', 'activeHostsList'),
k_renderer: k_renderSortableTime
},
{
k_columnId: 'type',
k_caption: k_tr('Event Type', 'activeHostsList'),
k_width: 150,
k_renderer: k_activityTypeRenderer
},
{
k_columnId: 'description',
k_isSortable: false,
k_caption: k_tr('Description', 'activeHostsList'),
k_renderer: k_activityRenderer
},
{
k_columnId: 'url',
k_isDataOnly: true
}
]
},
k_remoteData: {
k_isAutoLoaded: false,
k_root: 'list',
k_isQueryValueSent: false,
k_jsonRpc: {
method: 'ActiveHosts.getActivityList',
params: {
id: ''
}
},
k_onError: k_sharedMethods.k_onErrorActiveHostsDetails },

k_onLoadException: k_resetPendingRequest,

k_onLoad: function() {
this._k_requestPending = false;
this.k_resortRows();
}
};
k_activityGrid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'activityGrid', k_activityGridCfg);
k_formConnectionsCfg = {
k_type: 'ActiveHosts',
k_isMainSearch: false,
k_gridCfg: {
k_widgetType: 'ActiveHosts',
k_onDisableRefresh: k_onDisableRefreshConnections,

k_onLoadException: k_resetPendingRequest,

k_onLoad: k_resetPendingRequest,
k_isMainSearch: false
}
};
k_formConnections = new k_shared.k_widgets.K_ConnectionsPane(k_localNamespace + 'connectionsForm', k_formConnectionsCfg);
k_formCfg = {
k_labelWidth: 120,
k_className: 'selectable',
k_items: [
{
k_type: 'k_display',
k_id: 'k_textSelectHost',
k_isLabelHidden: true,
k_value: k_tr('Select a host to view its details', 'activeHostsList')
},
{
k_type: 'k_display',
k_id: 'k_textHostNotFound',
k_isLabelHidden: true,
k_value: k_tr('There is no data for such host.', 'activeHostsList'),
k_isVisible: false
},
{
k_type: 'k_fieldset',
k_id: 'k_fieldsetHostInfo',
k_itemClassName: 'selectable',
k_caption: k_tr('Host information', 'activeHostsList'),
k_isVisible: false,
k_items: [
{
k_type: 'k_columns',
k_items: [
{
k_type: 'k_container',
k_width: '50%',
k_items: [
{
k_type: 'k_display',
k_id: 'hostname',
k_isSecure: true,
k_itemClassName: 'selectable',
k_caption: k_tr('Host:', 'activeHostsList'),
k_value: ''
},
{
k_type: 'k_display',
k_id: 'user',
k_isSecure: true,
k_itemClassName: 'selectable',
k_caption: k_tr('User:', 'common'),
k_value: ''
},
{
k_type: 'k_display',
k_id: 'loginTime',
k_itemClassName: 'selectable',
k_caption: k_tr('Login time:', 'activeHostsList'),
k_value: ''
},
{
k_type: 'k_display',
k_id: 'inactivityTime',
k_itemClassName: 'selectable',
k_caption: k_tr('Inactivity time:', 'activeHostsList'),
k_value: ''
}
]
},
{
k_type: 'k_container',
k_width: '50%',
k_items: [
{
k_type: 'k_display',
k_id: 'ip',
k_itemClassName: 'selectable',
k_caption: k_tr('IPv4 address:', 'activeHostsList'),
k_value: ''
},
{
k_type: 'k_display',
k_id: 'ip6Addresses',
k_isSecure: true,
k_itemClassName: 'selectable',
k_caption: k_tr('IPv6 address:', 'activeHostsList'),
k_value: ''
},
{
k_type: 'k_display',
k_id: 'authMethod',
k_itemClassName: 'selectable',
k_caption: k_tr('Authentication type:', 'activeHostsList'),
k_value: ''
},
{
k_type: 'k_display',
k_id: 'macAddress',
k_itemClassName: 'selectable',
k_caption: k_tr('MAC Address:', 'activeHostsList'),
k_value: ''
}
]
}
]
}
]
},
{
k_type: 'k_fieldset',
k_id: 'k_fieldsetTrafficInfo',
k_itemClassName: 'selectable',
k_caption: k_tr('Traffic information', 'activeHostsList'),
k_isVisible: false,
k_items: [
{
k_type: 'k_columns',
k_items: [
{
k_type: 'k_container',
k_width: '50%',
k_items: [
{
k_type: 'k_display',
k_id: k_columnTotalDownload,
k_itemClassName: 'selectable',
k_caption: k_tr('Download:', 'activeHostsList'),
k_value: '',
k_isSecure: true
},
{
k_type: 'k_display',
k_id: k_columnTotalUpload,
k_itemClassName: 'selectable',
k_caption: k_tr('Upload:', 'activeHostsList'),
k_value: '',
k_isSecure: true
},
{
k_type: 'k_display',
k_id: 'connections',
k_itemClassName: 'selectable',
k_caption: k_tr('Connections:', 'activeHostsList'),
k_value: ''
}
]
},
{
k_type: 'k_container',
k_width: '50%',
k_items: [
{
k_type: 'k_display',
k_id: k_columnCurrentDownload,
k_itemClassName: 'selectable',
k_caption: k_tr('Current download:', 'activeHostsList'),
k_value: '',
k_isSecure: true
},
{
k_type: 'k_display',
k_id: k_columnCurrentUpload,
k_itemClassName: 'selectable',
k_caption: k_tr('Current upload:', 'activeHostsList'),
k_value: '',
k_isSecure: true
}
]
}
]
}
]
}
]
};
if (kerio.lib.k_isIPadCompatible) {
this.k_modifyForIPad(k_formCfg);
}
k_formGeneral = new kerio.lib.K_Form(k_localNamespace + 'k_formGeneral', k_formCfg);
k_formHistogram = new kerio.waw.shared.k_widgets.K_HistogramPane(k_localNamespace + 'histogram', {
k_manager: 'ActiveHosts',
k_promptToSelect: k_tr('Select a host to view the histogram', 'activeHostsList'),
k_onErrorLoadingHistogram: function(k_response) {
if (false === k_response.k_isOk && k_response.k_decoded && k_response.k_decoded.result) {
return kerio.waw.shared.k_methods.k_onErrorActiveHostsDetails.apply(this, [{k_isOk: false, k_decoded: k_response.k_decoded.result[1]}]);
}
},
k_relatedGrid: k_grid,

k_getDataForCaption: function() {
var
k_dataForCaption,
k_user, k_hostname,
k_data,
k_tr = kerio.lib.k_tr,
k_selectedRow;
if (0 === this._k_relatedGrid.k_selectionStatus.k_selectedRowsCount) {
return this._k_dataForCaption;
}
k_selectedRow = this._k_relatedGrid.k_selectionStatus.k_rows[0];
k_data = k_selectedRow.k_data;
k_user = k_data.user.name + ('' !== k_data.user.domainName ? '@' + k_data.user.domainName : '');
k_hostname = this._k_relatedGrid.k_formatHostname(k_data);
if ('' !== k_user) {
k_dataForCaption = k_tr('User %1 from %2', 'activeHostsList', {k_args: [k_user, k_hostname]});
}
else {
k_dataForCaption = k_tr('Host %1', 'activeHostsList', {k_args: [k_hostname]});
}
this._k_dataForCaption = k_dataForCaption;
return k_dataForCaption;
}
});
k_tabPageCfg = {
k_className: 'tabsInLayout selectable',
k_items: [
{
k_id: 'k_tabGeneral',
k_caption: k_tr('General', 'common'),
k_content: k_formGeneral
},
{
k_id: 'k_tabActivity',
k_caption: k_tr('Activity', 'activeHostsList'),
k_content: k_activityGrid,
k_isDisabled: true
},
{
k_id: 'k_tabConnections',
k_caption: k_tr('Connections', 'activeHostsList'),
k_content: k_formConnections,
k_isDisabled: true
},
{
k_id: 'k_tabHistogram',
k_caption: k_tr('Histogram', 'activeHostsList'),
k_content: k_formHistogram,
k_isDisabled: true
}
],

k_onTabChange: function(k_tabPage, k_currentTabId) {
var
k_layout = k_tabPage.k_layout;
k_layout.k_selectedTab = k_tabPage.k_getTabContent(k_currentTabId);
k_layout.k_getContent.call(k_layout);
}
};
k_tabPage = new kerio.lib.K_TabPage(k_localNamespace + 'k_tabPage', k_tabPageCfg);
k_layoutCfg = {
k_className: 'activeItemsList',
k_detailsVisibilityProperty: k_grid.k_id + '.' + 'showDetails',
k_isVertical: true,
k_mainPaneContent: k_grid,
k_detailsPaneContent: k_tabPage,
k_callbackDetailsVisible: k_getContent,

k_beforeApplyParams: function() {
var
k_sorting = kerio.waw.status.k_currentScreen.k_getSwitchPageParam('k_sortBy'),
k_paramIp = kerio.waw.status.k_currentScreen.k_getSwitchPageParam('k_ip');
if (k_sorting) { this.k_grid._k_dataStore.k_extWidget.sortInfo = { field: k_sorting,
direction: (kerio.waw.status.k_currentScreen.k_getSwitchPageParam('k_reverse') ? 'DESC' :  'ASC')
};
}
if (k_paramIp) {
this.k_preselectIp = k_paramIp;
}
this.k_grid.k_reloadData();
if (null === this.k_selectedTab) {
this.k_tabPage.k_setActiveTab(0);
this.k_selectedTab = this.k_formGeneral;
}
this.k_setDetailsVisible();
},
k_afterApplyParams: function() {
if (this.k_preselectIp) {
this.k_preselectRow.defer(500, this);
}
},
k_iPad: {
k_onBeforeDetails: function(k_show) {
if (k_show && 0 === this.k_grid.k_selectionStatus.k_selectedRowsCount) {
return kerio.lib.k_tr('Please select a host to show the details.', 'activeHostsList');
}
return true;
}
}
};
k_layout = new kerio.waw.shared.k_widgets.K_SplittedLayout(k_objectName, k_layoutCfg);
k_layout.k_addReferences({
k_getContent: k_getContent,
k_histogram: k_formHistogram,
k_formGeneral: k_formGeneral,
k_formConnections: k_formConnections,
k_grid: k_grid,
k_activityGrid: k_activityGrid,
k_selectedTab: null,
k_preselectIp: null
});
this.k_addControllers(k_layout);
k_layout.k_addReferences({
k_tabPage: k_tabPage,
k_selectedHostId: ''
});
k_grid.k_addReferences({
k_layout: k_layout,
k_trFirewall: k_trFirewall,
ActiveHostFirevall: k_shared.k_CONSTANTS.ActiveHostType.ActiveHostFirevall,
k_columnCurrentDownload: k_columnCurrentDownload,
k_columnCurrentUpload: k_columnCurrentUpload,
k_columnTotalDownload: k_columnTotalDownload,
k_columnTotalUpload: k_columnTotalUpload,
k_trAuthenticationMethod: k_trAuthenticationMethod,
k_formatNumber: k_sharedMethods.k_formatNumber,
k_formatMacAddress: k_sharedMethods.k_formatMacAddress,
k_dhcpLoaded: false,
k_isDhcpEnabled: false,
k_dhcpScopes: [],
k_autologinParams: {},
k_timeObject: {
hour: 0,
min: 0,
sec: 0
},
k_logoutUserRequest: {
k_jsonRpc: {
method: 'ActiveHosts.logout'
},
k_callback: k_grid.k_logoutUserCallback,
k_scope: k_grid
},
k_macFilterCondition: {
comparator: k_shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Like,
fieldName: 'macAddress',
value: ''
}
});
k_activityGrid.k_addReferences({
_k_requestPending: false,
k_gridHosts: k_grid,
k_apostropheRegExp: new RegExp('\'', 'g'),
k_quotationRegExp: new RegExp('"', 'g')
});
k_tabPage.k_addReferences({
k_layout: k_layout
});
k_formGeneral.k_addReferences({
k_grid: k_grid,
k_columnCurrentDownload: k_columnCurrentDownload,
k_columnCurrentUpload: k_columnCurrentUpload,
k_columnTotalDownload: k_columnTotalDownload,
k_columnTotalUpload: k_columnTotalUpload,
k_trFirewall: k_trFirewall,
k_trAuthenticationMethod: k_trAuthenticationMethod,
k_isFormatted: false
});
k_formConnections.k_addReferences({
k_gridHosts: k_grid
});
k_formHistogram.k_addReferences({
k_trFirewall: k_trFirewall
});
kerio.lib.k_registerObserver(k_grid, k_layout, [k_grid.k_eventTypes.k_SELECTION_CHANGED]);
kerio.waw.k_hacks.k_fixGridOnLoadError(k_activityGrid);
return k_layout;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_update = function(k_sender) {
var
k_selection,
k_invalidSelection,
k_rowData;
if (k_sender && k_sender.k_isInstanceOf('K_Grid')) {
k_selection = k_sender.k_selectionStatus;
k_invalidSelection = 0 === k_selection.k_selectedRowsCount;
this.k_selectedHostId = '';
if (!k_invalidSelection) {
k_rowData = k_selection.k_rows[0].k_data;
this.k_selectedHostId = k_rowData.id;
this.k_showDetails();
this.k_getContent();
}
k_sender.k_disableUserActions(k_invalidSelection, k_rowData);
}
}; 
k_kerioWidget.k_setAutoRefreshInterval = function(k_interval, k_startDeferred, k_avoidUserSettings) {
this.k_grid.k_handleAutorefresh(k_interval, k_startDeferred, k_avoidUserSettings);
};

k_kerioWidget.k_showDetails = function(k_isVisible) {
k_isVisible = false !== k_isVisible;
this.k_tabPage.k_setDisabledTab(['k_tabActivity', 'k_tabConnections', 'k_tabHistogram'], !k_isVisible);
this.k_formGeneral.k_setVisible(['k_textSelectHost'], !k_isVisible);
this.k_formGeneral.k_setVisible(['k_textHostNotFound'], false);
this.k_formGeneral.k_setVisible(['k_fieldsetHostInfo', 'k_fieldsetTrafficInfo'], k_isVisible);
};

k_kerioWidget.k_grid.k_logoutUser = function(k_id) {
this.k_disableRefreshGui(true);
this.k_runAutoRefresh(false);
this.k_logoutUserRequest.k_jsonRpc.params =  { ids: k_id };
kerio.lib.k_ajax.k_request(this.k_logoutUserRequest);
};

k_kerioWidget.k_grid.k_logoutUserCallback = function() {
this.k_reloadData();
};

k_kerioWidget.k_grid.k_getDhcpLeaseForRow = function(k_data) {
var
k_sharedConstants = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants,
k_ipAddress = k_data.ip,
k_macAddress = kerio.waw.shared.k_methods.k_removeMacAddressDelimiters(k_data.macAddress);
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Dhcp.getLeases',
params: {
scopeIds: this.k_dhcpScopes,
query: {
conditions: [
{
fieldName: 'ipAddress',
comparator: k_sharedConstants.kerio_web_Like,
value: k_ipAddress
},
{
fieldName: 'macAddress',
comparator: k_sharedConstants.kerio_web_Like,
value: k_macAddress
}
],
combining: k_sharedConstants.kerio_web_Or,
start:0,
limit:-1
}
}
},
k_scope: this,
k_callbackParams: {
k_ipAddress: k_ipAddress,
k_macAddress: k_macAddress
},
k_callback: this.k_createDhcpReservation
});
};

k_kerioWidget.k_grid.k_createDhcpReservation = function (k_response, k_isOk, k_params) {
var
DhcpLeaseType = kerio.waw.shared.k_CONSTANTS.DhcpLeaseType,
k_tr = kerio.lib.k_tr,
k_leases,
k_leasesCnt,
k_lease,
k_matchIp,
k_matchMac;
if (!k_isOk) {
kerio.lib.k_alert({
k_title: k_tr('Error', 'common'),
k_msg: k_tr('The search request for the DHCP lease failed, please set the reservation manually.', 'activeHostsList'),
k_icon: 'error'
});
return;
}
k_leases = k_response.k_decoded.list;
k_leasesCnt = k_leases.length;
if (1 !== k_leasesCnt) {
kerio.lib.k_alert({
k_title: k_tr('Error', 'common'),
k_msg: k_tr('No lease or more leases have been found for this IP address and MAC address, please set the reservation manually.', 'activeHostsList'),
k_icon: 'error'
});
return;
}
else if (1 === k_leasesCnt) {
k_lease = k_leases[0];
k_matchIp = k_params.k_ipAddress === k_lease.ipAddress;
k_matchMac = k_params.k_macAddress === k_lease.macAddress;
if (k_matchIp && k_matchMac) {
if (DhcpLeaseType.DhcpTypeLease === k_lease.type) {
kerio.waw.requests.k_sendBatch([{
k_jsonRpc: {
method: 'Dhcp.createLeases',
params: {
leases: [k_lease]
}
}
},
{
k_jsonRpc: {
method: 'Dhcp.apply'
}
}],
{
k_scope: this,
k_callback: function (k_responses, k_isOk) {
var k_tr = kerio.lib.k_tr;
if (k_isOk) {
kerio.lib.k_alert({
k_title: k_tr('Information', 'common'),
k_msg: k_tr('The reservation has been created.', 'activeHostsList'),
k_icon: 'info'
});
}
else {
kerio.lib.k_alert({
k_title: k_tr('Error', 'common'),
k_msg: k_tr('The transfer between lease and reservation failed, please set the reservation manually.', 'activeHostsList'),
k_icon: 'error'
});
}
}
});
}
else {
kerio.lib.k_alert({
k_title: k_tr('Warning', 'common'),
k_msg: k_tr('This reservation already exists.', 'activeHostsList', {k_args: [k_lease.macAddress]}),
k_icon: 'warning'
});
}
}
else {
kerio.lib.k_alert({
k_title: k_tr('Error', 'common'),
k_msg: k_tr("The hosts DHCP lease doesn't match the IP address or MAC address, please set the reservation manually.", 'activeHostsList'),
k_icon: 'error'
});
}
}
};

k_kerioWidget.k_grid.k_getUserForAutologin = function(k_data) {
var
k_macAddress = kerio.waw.shared.k_methods.k_removeMacAddressDelimiters(k_data.macAddress);
this.k_autologinParams = {
k_macAddress: k_macAddress,
k_userData: k_data.user
};
this.k_onWarningErrorCallback = this.k_getUserDataForAutologin;
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Users.checkWarnings',
params: {
user: {
id: k_data.user.id,
autoLogin: {
macAddresses: {
enabled: true,
value: [
k_macAddress
]
}
}
}
}
},

k_onError: kerio.waw.shared.k_methods.k_onUserWarningError,
k_scope: this,
k_callback: this.k_getUserDataForAutologin
});
};

k_kerioWidget.k_grid.k_getUserDataForAutologin = function (k_response) {
var
k_params = this.k_autologinParams,
k_sharedConstants = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants,
k_userData = k_params.k_userData,
k_domainName = k_userData.domainName,
k_domainsDataStore,
k_domainsList,
k_domainId,
k_cnt, k_i;
if (k_response && k_response.k_decoded.errors && 0 < k_response.k_decoded.errors.length) {
return;
}
if (undefined === k_domainName || '' === k_domainName) {
k_domainId = 'local';
}
else {
kerio.waw.shared.k_data.k_get('k_domains');
k_domainsDataStore = kerio.waw.shared.k_data.k_getStore('k_domains');
if (!k_domainsDataStore.k_isLoaded()) {
kerio.waw.shared.k_data.k_registerObserver(k_domainsDataStore, this.k_getUserDataForAutologin, this);
return;
}
k_domainsList = k_domainsDataStore.k_domains.k_list;
k_cnt = k_domainsList.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_domainName === k_domainsList[k_i].name) {
k_domainId = k_domainsList[k_i].id;
break;
}
}
}
this.k_autologinParams.k_domainId = k_domainId;
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
method: 'Users.get',
params: {
domainId: k_domainId,
query: {
conditions: [
{
fieldName: 'id',
comparator: k_sharedConstants.kerio_web_Like,
value: k_userData.id
}
],
combining: k_sharedConstants.kerio_web_And,
start:0,
limit:-1
}
}
},
k_scope: this,
k_callback: this.k_setAutologinForUser
});
};

k_kerioWidget.k_grid.k_setAutologinForUser = function (k_response, k_isOk) {
var
k_params = this.k_autologinParams,
k_tr = kerio.lib.k_tr,
k_errorMessage,
k_userList,
k_userData;
k_errorMessage = {
k_title: k_tr('Error', 'common'),
k_msg: k_tr('The automatic login setting failed. You must set  it manually.', 'activeHostsList'),
k_icon: 'error'
};
if (!k_isOk) {
return;
}
k_userList = k_response.k_decoded.list;
if (1 !== k_userList.length) {
kerio.lib.k_alert(k_errorMessage);
return;
}
k_userData = k_response.k_decoded.list[0];
k_userData.autoLogin.macAddresses.enabled = true;
if (-1 !== k_userData.autoLogin.macAddresses.value.indexOf(k_params.k_macAddress)) {
kerio.lib.k_alert({
k_title: k_tr('Info', 'common'),
k_msg: k_tr('This MAC address has already been set for this user.', 'activeHostsList'),
k_icon: 'info'
});
return;
}
k_userData.autoLogin.macAddresses.value.push(k_params.k_macAddress);
kerio.waw.requests.k_sendBatch({
k_jsonRpc: {
method: 'Users.set',
params: {
userIds: [k_params.k_userData.id],
domainId: k_params.k_domainId,
details: k_userData
}
},
k_scope: this,
k_callbackParams: {
k_errorMessage: k_errorMessage,
k_userName: kerio.waw.shared.k_methods.k_createReferencedUserName(k_params.k_userData).k_userName,
k_macAddress: k_params.k_macAddress
},
k_callback: function(k_response, k_isOk, k_params) {
if (!k_isOk) {
kerio.lib.k_alert(k_params.k_errorMessage);
return;
}
var k_tr = kerio.lib.k_tr;
kerio.lib.k_alert({
k_title: k_tr('Info', 'common'),
k_msg: k_tr('The MAC address "%1" has been added as an automatic login option for user "%2".', 'activeHostsList', {
k_args: [kerio.waw.shared.k_methods.k_formatMacAddress(k_params.k_macAddress), k_params.k_userName]
}),
k_icon: 'info'
});
}
});
};

k_kerioWidget.k_grid.k_disableUserActions = function(k_disable, k_data) {
var
k_isUserLogged = !k_disable && '' !== k_data.user.name,
k_isMacAddress = !k_disable && '' !== k_data.macAddress,
k_isIpAddress = !k_disable && '' !== k_data.ip;
this.k_contextMenu.k_enableItem('k_userQuota', k_isUserLogged);
this.k_contextMenu.k_enableItem('k_viewUser', k_isUserLogged);
if (!this.k_isAuditor) {
this.k_contextMenu.k_enableItem('k_autologin', k_isUserLogged && k_isMacAddress);
this.k_contextMenu.k_enableItem('k_dhcpReservation', k_isMacAddress && k_isIpAddress && this.k_isDhcpEnabled && k_data.ipAddressFromDHCP);
this.k_contextMenu.k_enableItem('k_logout', k_isUserLogged);
}
};

k_kerioWidget.k_grid.k_generateFixedSpanWithTooltip = function(k_content, k_tooltip) {
var
k_html;
if (undefined === k_tooltip) {
k_tooltip = k_content;
}
k_html = [
'<span class="ellipsis" ',
kerio.lib.k_buildTooltip(k_tooltip),
'>',
k_content,
'</span>'
].join('');
return k_html;
};

k_kerioWidget.k_grid.k_formatHostname = function(k_data) {
var
k_hostname;
if ('' !== k_data.hostname) {
k_hostname = k_data.hostname;
} else if (this.ActiveHostFirevall === k_data.type) {
k_hostname = this.k_trFirewall;
} else {
k_hostname = k_data.ip;
}
return sanitize(k_hostname);
};

k_kerioWidget.k_grid.k_formatIpAddress = function(k_data) {
if (this.ActiveHostFirevall === k_data.type) {
return this.k_trFirewall;
}
return k_data.ip;
};

k_kerioWidget.k_grid.k_formatIpv6Address = function(k_data) {
var
k_ipv6Addresses;
if (this.ActiveHostFirevall === k_data.type) {
return this.k_trFirewall;
}
k_ipv6Addresses = k_data.ip6Addresses || [];
return k_ipv6Addresses.join(', ');
};

k_kerioWidget.k_grid.k_formatAuthMethod = function(k_data) {
var
k_authMethod = k_data.authMethod,
k_text = this.k_trAuthenticationMethod[k_authMethod];
if (kerio.waw.shared.k_CONSTANTS.AuthMethodType.AuthMethodNone === k_authMethod || undefined === k_text) {
return ' ';
}
return k_text;
};

k_kerioWidget.k_grid.k_formatLoginTime = function(k_data) {
var k_loginTime = k_data.loginTime;
if (0 === k_loginTime.date.year) { return ' ';
}
return kerio.waw.shared.k_methods.k_formatDateTime(k_loginTime);
};

k_kerioWidget.k_grid.k_formatUsername = function(k_data) {
var
k_user = k_data.user,
k_name = k_user.name;
if ('' !== k_name) {
k_name += ('' === k_user.domainName) ? '' : ('@' + k_user.domainName);
}
return k_name;
};

k_kerioWidget.k_formGeneral.k_loadData = function() {
var
kerio_web_SharedConstants = kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants,
k_formatDataUnits = kerio.waw.shared.k_methods.k_formatDataUnits,
k_grid = this.k_grid,
k_timeObject = k_grid.k_timeObject,
k_gridData,
k_data,
k_ip6Addresses,
k_hostname,
k_user;
if (0 === k_grid.k_selectionStatus.k_selectedRowsCount) {
return;
}
k_gridData = k_grid.k_selectionStatus.k_rows[0].k_data;
k_timeObject.sec = k_gridData.inactivityTime;
k_ip6Addresses = k_grid.k_formatIpv6Address(k_gridData);
k_ip6Addresses = k_grid.k_generateFixedSpanWithTooltip(k_ip6Addresses);
k_hostname = k_grid.k_formatHostname(k_gridData);
k_hostname = k_grid.k_generateFixedSpanWithTooltip(k_hostname);
k_user = k_grid.k_formatUsername(k_gridData);
k_user = k_grid.k_generateFixedSpanWithTooltip(k_user);
k_data = {
hostname:       k_hostname,
ip:             k_grid.k_formatIpAddress(k_gridData),
ip6Addresses:   k_ip6Addresses,
loginTime:      k_grid.k_formatLoginTime(k_gridData),
inactivityTime: kerio.waw.shared.k_methods.k_formatTime(k_timeObject),
user:           k_user,
authMethod:     k_grid.k_formatAuthMethod(k_gridData),
connections:    k_gridData.connections,
macAddress:     k_grid.k_formatMacAddress(k_gridData.macAddress)
};
k_data[this.k_columnTotalDownload]   = k_formatDataUnits({k_value: k_gridData[this.k_columnTotalDownload], k_units: kerio_web_SharedConstants.kerio_web_KiloBytes,k_outputUnits: kerio_web_SharedConstants.kerio_web_MegaBytes, k_numberFormat: {k_decimalPlaces: 0}}).k_stringWithBuildInTooltip;
k_data[this.k_columnTotalUpload]     = k_formatDataUnits({k_value: k_gridData[this.k_columnTotalUpload], k_units: kerio_web_SharedConstants.kerio_web_KiloBytes,k_outputUnits: kerio_web_SharedConstants.kerio_web_MegaBytes, k_numberFormat: {k_decimalPlaces: 0}}).k_stringWithBuildInTooltip;
k_data[this.k_columnCurrentDownload] = k_formatDataUnits({k_value: k_gridData[this.k_columnCurrentDownload], k_units: kerio_web_SharedConstants.kerio_web_KiloBytes,k_outputUnits: kerio_web_SharedConstants.kerio_web_KiloBytes, k_isInTime: true, k_numberFormat: {k_decimalPlaces: 0}}).k_stringWithBuildInTooltip;
k_data[this.k_columnCurrentUpload]   = k_formatDataUnits({k_value: k_gridData[this.k_columnCurrentUpload], k_units: kerio_web_SharedConstants.kerio_web_KiloBytes,k_outputUnits: kerio_web_SharedConstants.kerio_web_KiloBytes, k_isInTime: true, k_numberFormat: {k_decimalPlaces: 0}}).k_stringWithBuildInTooltip;
this.k_setData(k_data);
};

k_kerioWidget.k_activityGrid.k_loadData = function(k_id) {
if (!this._k_requestPending) {
this.k_reloadData({id: k_id});
}
this._k_requestPending = true;
};

k_kerioWidget.k_onActivate = function() {
var
k_autorefresh = this.k_grid.k_getSavedAutoRefreshInterval();
this.k_grid.k_handleAutorefresh(k_autorefresh, true, true);
if (this.k_histogram.k_charts.k_canvas) {
this.k_histogram.k_charts.k_canvas.k_bypassDomRestore();
}
};

k_kerioWidget.k_onDeactivate = function() {
this.k_grid.k_initAutoRefreshTask(0);
this.k_formConnections.k_grid._k_requestPending = false; if (this.k_histogram.k_charts.k_canvas) {
this.k_histogram.k_charts.k_canvas.k_bypassDomRelease();
}
};

k_kerioWidget.k_activityGrid.k_onLoadError = function() {
this._k_requestPending = false;
};

k_kerioWidget.k_grid.k_onBeforeLoad = function(k_grid, k_conditions, k_params) {
if (true === k_params.refresh) { this.k_layout.k_formConnections.k_grid.k_forceRefresh = true;  }
};

k_kerioWidget.k_preselectRow = function() {
var
k_grid = this.k_grid,
k_row = k_grid.k_findRow('ip', this.k_preselectIp),
k_rowFound = -1 !== k_row;
k_grid.k_selectRows(k_row);
this.k_showDetails(k_rowFound); if (!k_rowFound) {
this.k_formGeneral.k_setVisible(['k_textSelectHost'], false);
this.k_formGeneral.k_setVisible(['k_textHostNotFound'], true);
}
this.k_preselectIp = null;
};

k_kerioWidget.k_grid.k_viewUser = function() {
var
k_data = this.k_selectionStatus.k_rows[0].k_data.user; kerio.waw.shared.k_methods.k_goToUsers(k_data.domainName, k_data.id);
};
}, 
k_modifyForIPad: function(k_formCfg) {
var
k_fieldset, k_fieldsets,
k_row, k_rows,
k_columns,
k_i, k_j;
k_fieldsets = k_formCfg.k_items;
for (k_i = 0; k_i < k_fieldsets.length; k_i++) {
k_fieldset = k_fieldsets[k_i];
k_rows = k_fieldset.k_items;
if ('k_fieldset' !== k_fieldset.k_type || !k_rows) {
continue;
}
for (k_j = 0; k_j < k_rows.length; k_j++) {
k_row = k_rows[k_j];
k_columns = k_row.k_items;
if (('k_row' !== k_row.k_type && 'k_columns' !== k_row.k_type)|| !k_columns) {
continue;
}
k_rows = k_rows.slice(0,k_j).concat(k_columns, k_rows.slice(k_j + 1));
k_j += k_columns.length - 1;
} k_fieldset.k_items = k_rows;
} }
}; 