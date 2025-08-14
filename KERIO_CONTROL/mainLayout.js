
kerio.waw.init = kerio.waw.init || {};

kerio.waw.init.k_initMainLayout = function (k_params) {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared = kerio.waw.shared,
k_CONSTANTS = k_shared.k_CONSTANTS,
k_WAW_METHODS = k_shared.k_methods,
k_WAW_DEFINITIONS = k_shared.k_DEFINITIONS,
k_LOGS = k_CONSTANTS.k_LOGS,
k_FUNCTION_LIST = k_LOGS.k_FUNCTION_LIST,
HttpLogType = k_CONSTANTS.HttpLogType,
k_DEBUG_SHOW_STATUS_PREFIX = k_LOGS.k_DEBUG_SHOW_STATUS_PREFIX,
k_HTTP_TYPE_PREFIX = k_LOGS.k_HTTP_TYPE_PREFIX,
k_TIME_UNITS_SETTINGS = k_CONSTANTS.k_TIME_UNITS_SETTINGS,
k_isAuditor = k_WAW_METHODS.k_isAuditor(),
k_usersSpeedSettings = kerio.waw.status.k_userSettings.k_get('timeUnits', k_TIME_UNITS_SETTINGS.k_BYTE_PER_SECOND),
k_captionPacketFormat = k_tr('Format of Logged Packets…', 'logs'),
k_captionDashboard = k_tr('Dashboard', 'menuTree'),
k_loggedUser = k_params.k_loggedUser,
k_USE_SOPHOS = k_CONSTANTS.k_SERVER.k_USE_SOPHOS,
k_onClickPacketFormat,
k_saveUserSpeedUnitSettings,
k_cfgMainLayout,
k_onClickLogMenu,
k_listItem,
k_showStatusItems,
k_i, k_cnt;

k_onClickLogMenu = function (k_toolbar, k_item) {
var
k_LOGS = kerio.waw.shared.k_CONSTANTS.k_LOGS,
k_id = k_item.k_name,
k_isDebugLog,
k_prefixId,
k_value,
k_params;
k_isDebugLog = (0 === k_id.indexOf(k_LOGS.k_DEBUG_SHOW_STATUS_PREFIX));
k_prefixId = (k_isDebugLog) ? k_LOGS.k_DEBUG_SHOW_STATUS_PREFIX : k_LOGS.k_HTTP_TYPE_PREFIX;
k_value = k_id.substr(k_prefixId.length);
k_params = (k_isDebugLog) ? {id: k_value} : {logType: k_value};
kerio.lib.k_ajax.k_request({
k_jsonRpc: {
'method': 'Logs' + '.' + (k_isDebugLog ? 'callStatusFunction' : 'setHttpLogType'),
'params': k_params
}
});
return false;
};
k_showStatusItems = [];
for (k_i = 0, k_cnt = k_FUNCTION_LIST.length; k_i < k_cnt; k_i++) {
k_listItem = k_FUNCTION_LIST[k_i];
k_showStatusItems.push({
k_id: k_DEBUG_SHOW_STATUS_PREFIX + k_listItem.id,
k_caption: k_listItem.name,
k_onClick: k_onClickLogMenu
});
}

k_onClickPacketFormat = function () {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'logsExpressionEditor',
k_objectName: 'packetFormatEditor'
});
return false;
};

k_saveUserSpeedUnitSettings = function (k_menu, k_menuItem, k_isForced) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_TIME_UNITS_SETTINGS = k_CONSTANTS.k_TIME_UNITS_SETTINGS,
k_framework = kerio.adm.k_framework,
k_isBytePerSecond = 'k_speedUnits' + '_' + k_TIME_UNITS_SETTINGS.k_BYTE_PER_SECOND === k_menuItem.k_name,
k_usersSpeedSettings = kerio.waw.status.k_userSettings.k_get('timeUnits', k_TIME_UNITS_SETTINGS.k_BYTE_PER_SECOND),
k_clickedValue = k_isBytePerSecond ? k_TIME_UNITS_SETTINGS.k_BYTE_PER_SECOND : k_TIME_UNITS_SETTINGS.k_BITE_PER_SECOND,
k_target;
if (k_clickedValue !== k_usersSpeedSettings) {
if (true !== k_isForced && !k_framework._k_onBeforeSwitchScreenHandler) {
k_target = {k_function: arguments.callee, k_arguments: arguments, k_scope: this};
if (false === k_framework._k_onBeforeLeaveScreen(k_target, k_framework._k_currentMenuItem)) {
return;
}
}
k_menuItem.k_menu.k_hide();
k_menuItem.k_menu.k_topMenu.k_hide();
kerio.waw.shared.k_methods.k_maskMainScreen();
kerio.waw.status.k_userSettings.k_set('timeUnits', k_clickedValue);
kerio.waw.status.k_userSettings.k_save({k_callback: kerio.adm.k_framework._k_callbackSetLanguage});
}
};
k_WAW_DEFINITIONS.k_PRODUCT_NAME = kerio.waw.shared.k_methods.k_isBoxEdition() ? 'Kerio Control Box' : 'Kerio Control';

k_getConfigurationNodes = function(k_captionDashboard, k_WAW_DEFINITIONS) {
var configurationNodes = [
{
k_caption: k_captionDashboard,
k_iconClass: 'treeIconDashboard',
k_id: k_WAW_DEFINITIONS.k_DASHBOARD_LIST_ID,
k_screenCfg: {
k_sourcePath: 'dashboard',
k_sourceName: 'dashboardList',
k_className: 'screenIconDashboard'
},
k_isSelected: true
},
{
k_caption: (kerio.waw.shared.k_methods.k_isWifiAvailable() ? k_tr('Interfaces and WiFi', 'menuTree') : k_tr('Interfaces', 'menuTree')),
k_iconClass: 'treeIconInterfaces', k_id: 'interfaces',
k_screenCfg: {
k_objectName: 'interfaceList',
k_sourceName: 'interfaceList',
k_className: 'screenIconInterfaces'
}
},
{
k_caption: k_tr('Traffic Rules', 'menuTree'),
k_iconClass: 'treeIconTrafficRules',
k_id: 'trafficRules',
k_screenCfg: {
k_objectName: 'trafficPolicyList',
k_sourceName: 'trafficPolicyList',
k_className: 'screenIconTrafficPolicy'
}
},
{
k_caption: k_tr('Intrusion Prevention', 'menuTree'),
k_iconClass: 'treeIconIntrusionPrevention',
k_id: 'intrusionPrevention',
k_screenCfg: {
k_objectName: 'intrusionPreventionList',
k_sourceName: 'intrusionPreventionList',
k_className: 'screenIconIntrusionPrevention'
}
},
{
k_caption: k_tr('Security Settings', 'menuTree'),
k_iconClass: 'treeIconSecuritySettings',
k_id: 'securitySettings',
k_screenCfg: {
k_objectName: 'securitySettingsList',
k_sourceName: 'securitySettingsList',
k_className: 'screenIconSecuritySettings'
}
},
{
k_caption: k_tr('Bandwidth Management and QoS', 'menuTree'),
k_iconClass: 'treeIconBandwidthManagement',
k_id: 'bandwidthManagement',
k_screenCfg: {
k_objectName: 'bandwidthManagementList',
k_sourceName: 'bandwidthManagementList',
k_className: 'screenIconBandwidthLimiter'
}
},
{
k_caption: k_tr('Content Filter', 'menuTree'),
k_iconClass: 'treeIconContentFilter',
k_id: 'contentFilter',
k_screenCfg: {
k_objectName: 'contentFilterList',
k_sourceName: 'contentFilterList',
k_className: 'screenIconContentFilter'
}
},
{
k_caption: k_tr('Proxy Server', 'menuTree'),
k_iconClass: 'treeIconProxyServer',
k_id: 'proxyServer',
k_screenCfg: {
k_objectName: 'proxyServerList',
k_sourceName: 'proxyServerList',
k_className: 'screenIconProxyServer'
}
},
{
k_caption: k_tr('Antivirus', 'menuTree'),
k_iconClass: 'treeIconAntivirusList',
k_id: 'antivirus',
k_screenCfg: {
k_objectName: 'antivirus',
k_sourceName: k_USE_SOPHOS ? 'antivirusListSophos' : 'antivirusList',
k_className: 'screenIconAntivirus'
}
},
{
k_caption: k_tr('DHCP Server', 'menuTree'),
k_iconClass: 'treeIconDhcpServer',
k_id: 'dhcpServer',
k_screenCfg: {
k_objectName: 'dhcpServerList',
k_sourceName: 'dhcpServerList',
k_className: 'screenIconDhcpServer'
}
},
{
k_caption: k_tr('IPv6 Router Advertisements', 'menuTree'),
k_iconClass: 'treeIconRouterAdvertisements',
k_id: 'ipv6RouterAdvertisements',
k_screenCfg: {
k_objectName: 'routerAdvertisementsList',
k_sourceName: 'routerAdvertisementsList',
k_className: 'screenIconRouterAdvertisements'
}
},
{
k_caption: k_tr('DNS', 'menuTree'), k_iconClass: 'treeIconDns', k_id: 'dns',
k_screenCfg: {
k_objectName: 'dnsList',
k_sourceName: 'dnsList',
k_className: 'screenIconDns'
}
},
{
k_caption: k_tr('Routing Table', 'menuTree'),
k_iconClass: 'treeIconRoutingTable',
k_id: 'routingTable',
k_screenCfg: {
k_objectName: 'routingTableList',
k_sourceName: 'routingTableList',
k_className: 'screenIconRoutingTable'
}
},
{
k_caption: k_tr('Accounting and Monitoring', 'menuTree'),
k_iconClass: 'treeIconAccounting',
k_id: 'accountingAndMonitoring',
k_screenCfg: {
k_objectName: 'accountingList',
k_sourceName: 'accountingList',
k_className: 'screenIconAccounting'
}
},
{
k_caption: k_tr('Remote Services', 'menuTree'),
k_iconClass: 'treeIconRemoteServices',
k_id: 'remoteServices',
k_screenCfg: {
k_objectName: 'remoteServicesList',
k_sourceName: 'remoteServicesList',
k_className: 'screenIconRemoteServices'
}
},
{
k_caption: k_tr('Advanced Options', 'menuTree'),
k_iconClass: 'treeIconAdvancedOptions',
k_id: 'advancedOptions',
k_class: 'lastItem',
k_screenCfg: {
k_objectName: 'advancedOptionsList',
k_sourceName: 'advancedOptionsList',
k_className: 'screenIconAdvancedOptions'
}
},
{
k_caption: k_tr('High Availability', 'highAvailabilityList'),
k_iconClass: 'treeIconActiveHosts',
k_id: 'highAvailability',
k_class: 'lastItem',
k_screenCfg: {
k_objectName: 'highAvailabilityList',
k_sourceName: 'highAvailabilityList',
k_className: 'screenIconActiveHosts'
}
},
{
k_caption: k_tr('Users and Groups', 'menuTree'),
k_class: 'titleNode',
k_id: 'usersAndGroups',
k_isExpanded: true,
k_nodes: [
{
k_caption: k_tr('Users', 'menuTree'), k_iconClass: 'treeIconUsers', k_id: 'users',
k_screenCfg: {k_objectName: 'userList', k_sourceName: 'userGroupList'}
},
{
k_caption: k_tr('Groups', 'menuTree'),
k_iconClass: 'treeIconGroups',
k_id: 'groups',
k_screenCfg: {k_objectName: 'groupList', k_sourceName: 'userGroupList'}
},
{
k_caption: k_tr('Domains and User Login', 'menuTree'),
k_iconClass: 'treeIconDomains',
k_class: 'lastItem',
k_id: 'domainsAndUserLogin',
k_screenCfg: {
k_objectName: 'domainsAuthenticationList',
k_sourceName: 'domainsAuthenticationList',
k_className: 'screenIconDomains'
}
}
] },
{
k_caption: k_tr('Definitions', 'menuTree'),
k_class: 'titleNode',
k_id: 'definitions',
k_isExpanded: true,
k_nodes: [
{
k_caption: k_tr('SSL Certificates', 'menuTree'),
k_iconClass: 'treeIconCertificates',
k_id: 'sslCertificates',
k_screenCfg: {
k_sourceName: 'certificateList',
k_initParams: {
k_isAuditor: kerio.waw.shared.k_methods.k_isAuditor(),
k_managerName: 'Certificates',
k_supportAuthorities: true,
k_supportActiveCertificate: false,
k_supportRename: true,
k_searchBy: 'QUICKSEARCH',
k_supportPkcsFormat: true,
k_onApply: function (k_toolbar) {
kerio.waw.shared.k_methods.k_apply('Certificates', k_toolbar.k_parentWidget, ['k_certificates', 'k_certificatesVpnServer', 'k_vpnTunnels', 'k_certificatesReverseProxyRule']);
return false;
},
k_onReset: function (k_toolbar) {
kerio.waw.shared.k_methods.k_reset('Certificates', k_toolbar.k_parentWidget);
return false;
}
}
}
},
{
k_caption: k_tr('IP Address Groups', 'menuTree'),
k_iconClass: 'treeIconIpGroups',
k_id: 'ipAddressGroups',
k_screenCfg: {k_objectName: 'addressGroupList', k_sourceName: 'definitionGroupList'}
},
{
k_caption: k_tr('URL Groups', 'menuTree'),
k_iconClass: 'treeIconUrlGroups',
k_id: 'urlGroups',
k_screenCfg: {
k_objectName: 'urlGroupList',
k_sourceName: 'definitionGroupList',
k_className: 'screenIconUrlGroups'
}
},
{
k_caption: k_tr('Time Ranges', 'menuTree'),
k_iconClass: 'treeIconTimeRanges',
k_id: 'timeRanges',
k_screenCfg: {k_objectName: 'timeRangeList', k_sourceName: 'definitionGroupList'}
},
{
k_caption: k_tr('Services', 'menuTree'),
k_iconClass: 'treeIconServices',
k_id: 'services',
k_screenCfg: {k_objectName: 'serviceList', k_sourceName: 'serviceList'}
}
] }
];
if (k_isAuditor) {
configurationNodes = configurationNodes.filter(function(element) {
return element.k_id !== 'highAvailability';
})
}
return configurationNodes;
};
k_cfgMainLayout = {
k_userRole: k_params.k_userRole,
k_uiNamespace: kerio.waw.ui,
k_menuTree: {
k_useTabs: true,
k_isRootSelectable: false,
k_isRootCollapsible: false,
k_title: {
k_caption: 'Kerio Control',
k_title: k_captionDashboard,
k_screenCfg: {
k_sourcePath: 'dashboard',
k_sourceName: 'dashboardList',
k_className: 'screenIconDashboard'
},
k_isSelected: false
},
k_width: 300,
k_nodes: [
{
k_caption: k_tr('Configuration', 'menuTree'),
k_iconClass: 'adm:configuration',
k_class: 'admConfiguration',
k_id: 'configuration',
k_isExpanded: true,
k_nodes: k_getConfigurationNodes(k_captionDashboard, k_WAW_DEFINITIONS)
},
{
k_caption: k_tr('Status', 'menuTree'),
k_iconClass: 'adm:status',
k_class: 'titleNode',
k_id: 'status',
k_isExpanded: true,
k_nodes: [
{
k_caption: k_tr('Active Hosts', 'menuTree'),
k_iconClass: 'treeIconActiveHosts',
k_id: 'activeHosts',
k_screenCfg: {
k_objectName: 'activeHostsList',
k_sourceName: 'activeHostsList',
k_className: 'screenIconActiveHosts'
}
},
{
k_caption: k_tr('Active Connections', 'menuTree'),
k_iconClass: 'treeIconConnections',
k_id: 'activeConnections',
k_screenCfg: {k_objectName: 'connectionsList', k_sourceName: 'connectionsList'}
},
{
k_caption: k_tr('VPN Clients', 'menuTree'),
k_iconClass: 'treeIconVpnClients',
k_id: 'vpnClients',
k_screenCfg: {
k_objectName: 'vpnClientsList',
k_sourceName: 'vpnClientsList',
k_className: 'screenIconVpnClients'
}
},
{
k_caption: k_tr('User Statistics', 'menuTree'),
k_iconClass: 'treeIconUserStatistics',
k_id: 'userStatistics',
k_screenCfg: {
k_objectName: 'userStatisticsList',
k_sourceName: 'userStatisticsList',
k_className: 'screenIconUserStatistics'
}
},
{
k_caption: k_tr('Traffic Charts', 'menuTree'),
k_iconClass: 'treeIconTrafficStatistics',
k_id: 'trafficCharts',
k_screenCfg: {
k_objectName: 'trafficStatisticsList',
k_sourceName: 'trafficStatisticsList',
k_className: 'screenIconTrafficStatistics'
}
},
{
k_caption: k_tr('Alert Messages', 'menuTree'),
k_iconClass: 'treeIconAlertMessages',
k_id: 'alertMessages',
k_screenCfg: {
k_objectName: 'alertMessagesList',
k_sourceName: 'alertMessagesList',
k_className: 'screenIconAlertMessages'
}
},
{
k_caption: k_tr('System Health', 'menuTree'),
k_iconClass: 'treeIconSystemHealth',
k_id: 'systemHealth',
k_screenCfg: {
k_objectName: 'systemHealthList',
k_sourceName: 'systemHealth',
k_className: 'screenIconSystemHealth'
}
},
{
k_caption: k_tr('IP Tools', 'menuTree'), k_iconClass: 'treeIconIpTools', k_id: 'ipTools',
k_screenCfg: {
k_objectName: 'ipToolsList',
k_sourceName: 'ipToolsList',
k_className: 'screenIconIpTools'
}
}
] },
{
k_caption: k_tr('Logs', 'menuTree'),
k_iconClass: 'adm:logs',
k_class: 'titleNode',
k_id: 'logs',
k_isExpanded: true,
k_nodes: [
{
k_iconClass: 'treeIconLogAlert', k_id: 'alertLog',
k_screenCfg: {
k_sourceName: 'logs',
k_objectName: 'alert',
k_className: 'screenIconLogAlert'
}
},
{
k_iconClass: 'treeIconLogHost', k_id: 'agentLog',
k_screenCfg: {k_sourceName: 'logs', k_objectName: 'gfiagent', k_className: 'screenIconLogHost'}
},
{
k_iconClass: 'treeIconLogConfig', k_id: 'configLog',
k_screenCfg: {k_sourceName: 'logs', k_objectName: 'config'} },
{
k_iconClass: 'treeIconLogConnection', k_id: 'connectionLog',
k_screenCfg: {
k_sourceName: 'logs',
k_objectName: 'connection',
k_className: 'screenIconLogConnection'
}
},
{
k_iconClass: 'treeIconLogDebug', k_id: 'debugLog',
k_screenCfg: {
k_sourceName: 'logs', k_objectName: 'debug',
k_initParams: {
k_contextMenu: {
k_items: [
{
k_index: 4,
k_id: 'k_logDebugPacketFormat',
k_caption: k_captionPacketFormat,
k_onClick: k_onClickPacketFormat
},
{
k_index: 5,
k_id: 'k_logDebugIpTraffic',
k_caption: k_tr('Packet Logging…', 'logs'),

k_onClick: function () {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'logsExpressionEditor',
k_objectName: 'ipTrafficEditor'
});
return false;
}
},
{
k_index: 6,
k_id: 'k_logDebugShowStatus',
k_caption: k_tr('Show Status', 'logs'),
k_items: k_showStatusItems
},
{
k_index: 7,
k_id: 'k_logDebugDumpExpression',
k_caption: k_tr('Packet Dump To File…', 'logs'),

k_onClick: function () {
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'packetDump'
});
return false;
}
}
]
}
}
}
},
{
k_iconClass: 'treeIconLogDial', k_id: 'dialLog',
k_screenCfg: {k_sourceName: 'logs', k_objectName: 'dial', k_className: 'screenIconLogDial'}
},
{
k_iconClass: 'treeIconLogError', k_id: 'errorLog',
k_screenCfg: {k_sourceName: 'logs', k_objectName: 'error'}
},
{
k_iconClass: 'treeIconLogFilter', k_id: 'filterLog',
k_screenCfg: {
k_sourceName: 'logs', k_objectName: 'filter', k_className: 'screenIconLogFilter',
k_initParams: {
k_contextMenu: {
k_items: [
{
k_index: 4,
k_id: 'k_logFilterPacketFormat',
k_caption: k_captionPacketFormat,
k_onClick: k_onClickPacketFormat
}
]
}
}
}
},
{
k_iconClass: 'treeIconLogHost', k_id: 'hostLog',
k_screenCfg: {k_sourceName: 'logs', k_objectName: 'host', k_className: 'screenIconLogHost'}
},
{
k_iconClass: 'treeIconLogHttp', k_id: 'httpLog',
k_screenCfg: {
k_sourceName: 'logs', k_objectName: 'http', k_className: 'screenIconLogHttp',
k_initParams: {
k_contextMenu: {
k_items: [
{
k_index: 3,
k_id: 'k_logHttpFormat',
k_caption: k_tr('Log Format', 'logs'),
k_items: [
{
k_id: k_HTTP_TYPE_PREFIX + HttpLogType.HttpLogApache,
k_caption: k_tr('Apache format', 'logs'),
k_radioGroup: 'k_radioLogFormat',
k_isChecked: HttpLogType.HttpLogApache === HttpLogType.k_CURRENT_TYPE,
k_isDisabled: k_isAuditor,
k_onClick: k_onClickLogMenu
},
{
k_id: k_HTTP_TYPE_PREFIX + HttpLogType.HttpLogSquid,
k_caption: k_tr('Squid format', 'logs'),
k_radioGroup: 'k_radioLogFormat',
k_isChecked: HttpLogType.HttpLogSquid === HttpLogType.k_CURRENT_TYPE,
k_isDisabled: k_isAuditor,
k_onClick: k_onClickLogMenu
}
]
}
]
}
}
}
},
{
k_iconClass: 'treeIconLogSecurity', k_id: 'securityLog',
k_screenCfg: {k_sourceName: 'logs', k_objectName: 'security'}
},
{
k_iconClass: 'treeIconLogWarning', k_id: 'warningLog',
k_screenCfg: {k_sourceName: 'logs', k_objectName: 'warning'}
},
{
k_iconClass: 'treeIconLogWeb', k_id: 'webLog',
k_screenCfg: {k_sourceName: 'logs', k_objectName: 'web', k_className: 'screenIconLogWeb'}
}
] }
] }, k_language: {
k_browserPref: k_params.k_browserPreferredLanguage,
k_supported: k_CONSTANTS.k_LANGUAGES.k_LIST,
k_current: k_params.k_currentLanguage,
k_textAutomatic: k_tr('Automatic', 'menuTree')
},
k_help: {
k_title: k_tr('Help', 'main'),
k_items: [{k_url: 'help/', k_caption: k_tr('Help', 'main')}]
},
k_customUserMenuItem: {
k_caption: k_tr('Change speed units', 'userSettings'),
k_items: [
{
k_id: 'k_speedUnits' + '_' + k_TIME_UNITS_SETTINGS.k_BYTE_PER_SECOND,
k_radioGroup: 'speedUnits',
k_caption: k_tr('Bytes per second [B/s]', 'userSettings'),
k_isChecked: k_TIME_UNITS_SETTINGS.k_BYTE_PER_SECOND === k_usersSpeedSettings
},
{
k_id: 'k_speedUnits' + '_' + k_TIME_UNITS_SETTINGS.k_BITE_PER_SECOND,
k_radioGroup: 'speedUnits',
k_caption: k_tr('Bits per second [b/s]', 'userSettings'),
k_isChecked: k_TIME_UNITS_SETTINGS.k_BITE_PER_SECOND === k_usersSpeedSettings
}
],
k_onClick: k_saveUserSpeedUnitSettings
},
k_logout: {
k_url: 'internal/logout'
},
k_userMenu: {
k_caption: k_loggedUser.k_fullName && '' !== k_loggedUser.k_fullName ? k_loggedUser.k_fullName : k_loggedUser.k_name,
k_title: k_lib.k_htmlEncode(k_loggedUser.k_domainName)
},
k_callResetOnLeaveScreen: true,
k_onHistoryChange: function () {
var
k_currentMenuItem = kerio.adm.k_framework.k_getCurrentMenuItem(),
k_title = '';
k_title = kerio.waw.shared.k_CONSTANTS.k_SERVER.k_HOST_NAME + ' - ' || '';
k_title = k_currentMenuItem.k_caption + ' - ' + 'Kerio Control Administration';
window.document.title = k_title;
}
}; kerio.waw.init.k_getTreeTranslations(k_cfgMainLayout.k_menuTree.k_nodes);
kerio.adm.k_framework.k_setKbMapping(kerio.waw.ui.k_helpMapping);
kerio.adm.k_framework.k_init(k_cfgMainLayout);
kerio.waw.status.k_currentScreen.k_onBeforeUnloadWeblib = window.onbeforeunload;
window.onbeforeunload = function () {
var
k_wawRequests = kerio.waw.requests;
if (k_wawRequests._k_isVeryDangerous) {
return; }
switch (k_wawRequests._k_connectionState) {
case k_wawRequests._k_CONNECTION_TRY:      case k_wawRequests._k_CONNECTION_RESTART:  case k_wawRequests._k_CONNECTION_CUTOFF:   return;
}
if (kerio.waw.status.k_currentScreen.k_isContentChanged()) {
return kerio.waw.status.k_currentScreen.k_onBeforeUnloadWeblib.apply(window, arguments);
}
else {
var worker = new Worker('onbeforeunload');
worker.onmessage = function(event) {
return kerio.waw.status.k_currentScreen.k_onBeforeUnloadWeblib.apply(window, arguments);
};
worker.postMessage('');
}
};
}; 
kerio.waw.init.k_getTreeTranslations = function (k_treeNodes) {
var
k_WAW_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_menuTreeNodes,
k_i, k_cnt,
k_node,
k_tr,
k_index;
if (!k_WAW_DEFINITIONS.k_MENU_TREE_NODES) {
k_WAW_DEFINITIONS.k_MENU_TREE_NODES = {};
}
k_menuTreeNodes = k_WAW_DEFINITIONS.k_MENU_TREE_NODES;
for (k_i = 0, k_cnt = k_treeNodes.length; k_i < k_cnt; k_i++) {
k_node = k_treeNodes[k_i];
if (k_node.k_screenCfg) {
if ('logs' === k_node.k_screenCfg.k_sourceName) {
k_tr = k_node.k_screenCfg.k_objectName;
if (k_tr.indexOf('gfi') == 0) {
k_tr = k_tr.substr(3);
}
k_tr = k_tr.substr(0, 1).toUpperCase() + k_tr.substr(1); }
else {
k_tr = k_node.k_caption;
}
k_index = k_node.k_screenCfg.k_objectName || k_node.k_id;
k_menuTreeNodes[k_index] = k_tr;
}
if (k_node.k_nodes && k_node.k_nodes.length) {
kerio.waw.init.k_getTreeTranslations(k_node.k_nodes);
}
}
};
