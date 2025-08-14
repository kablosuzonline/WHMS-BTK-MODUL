
kerio.waw.ui.interfaceList = {

k_init: function(k_objectName) {
var
k_localNamespace = k_objectName + '_',
k_interfacesRefreshTaskId = k_localNamespace + 'k_autorefresh',
k_tr = kerio.lib.k_tr,
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_WAW_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS,
k_WAW_METHODS = kerio.waw.shared.k_methods,
k_isLinux = k_WAW_METHODS.k_isLinux(),
k_OS_LINUX = k_WAW_CONSTANTS.k_SERVER.k_OS_LINUX,
k_OS_WINDOWS = k_WAW_CONSTANTS.k_SERVER.k_OS_WINDOWS,
k_isBoxEdition = k_WAW_METHODS.k_isBoxEdition(),
k_isWifiAvailable = k_WAW_METHODS.k_isWifiAvailable(),
k_isIpv6Available = k_WAW_METHODS.k_isIpv6Available(),
k_isAuditor = k_WAW_METHODS.k_isAuditor(),
k_toolbarButtons,
k_statusbar, k_statusbarCfg,
k_form, k_formCfg,
k_grid, k_gridCfg,
k_onApply, k_onReset,
InterfaceGroupType = k_WAW_CONSTANTS.InterfaceGroupType,
InterfaceType = k_WAW_CONSTANTS.InterfaceType,
k_BANDWIDTH_UNITS_MAPPED = k_WAW_DEFINITIONS.k_BANDWIDTH_UNITS_MAPPED,
ConnectivityType = k_WAW_CONSTANTS.ConnectivityType,
k_FAILOVER_ROLES_MAPPED = [],
k_emptyGroupData = [],
k_SUPPORTED_INTERFACE_GROUP_LIST = [ InterfaceGroupType.Internet, InterfaceGroupType.Trusted, InterfaceGroupType.Vpn, InterfaceGroupType.Guest, InterfaceGroupType.Other ],
k_COLUMN_ID_GROUP = 'group',
k_COLUMN_ID_TYPE = 'type',
k_COLUMN_IPv4_WIDTH = 100,
k_COLUMN_IPv6_WIDTH = 225,
k_INTERFACE_EDITOR_NAMES,
k_groupType,
k_connectivityComboData,
k_onButtonClick,
k_i, k_cnt,
k_baseWidget,
k_references,
k_isPortsSetDangerous,
k_openManagePortsEditor,
k_openManageWifiEditor,
k_contextChangeParameters,
k_additionalMenuItems;
k_WAW_CONSTANTS.WifiBandType.k_BAND_AN = 'WifiBandAN';
k_WAW_CONSTANTS.WifiBandType.k_BAND_BGN = 'WifiBandBGN';
k_WAW_CONSTANTS.k_INTERFACE_EDITOR_NAMES = {
k_ETHERNET: {
k_EDIT: 'interfaceEthernetEdit',
k_VIEW: 'interfaceEthernetView'
},
k_PPPOE: {
k_ADD: 'interfacePPPoEAdd',
k_EDIT: 'interfacePPPoEEdit',
k_VIEW: 'interfacePPPoEView'
},
k_PPTP: {
k_ADD: 'interfacePPTPAdd',
k_EDIT: 'interfacePPTPEdit',
k_VIEW: 'interfacePPTPView'
},
k_L2TP: {
k_ADD: 'interfaceL2TPAdd',
k_EDIT: 'interfaceL2TPEdit',
k_VIEW: 'interfaceL2TPView'
},
k_RAS: {
k_EDIT: 'interfaceRasEdit',
k_VIEW: 'interfaceRasView'
},
k_DIAL_IN: {
k_EDIT: 'interfaceDialInEdit',
k_VIEW: 'interfaceDialInView'
},
k_VPN_SERVER: {
k_EDIT: 'interfaceVpnServerEdit',
k_VIEW: 'interfaceVpnServerView'
},
k_VPN_TUNNEL: {
k_EDIT: 'interfaceVpnTunnelEdit',
k_VIEW: 'interfaceVpnTunnelView'
},
k_MULTI_IP: {
k_IPv4: {
k_EDIT: 'interfaceMultiIp4Edit',
k_VIEW: 'interfaceMultiIp4View'
},
k_IPv6: {
k_EDIT: 'interfaceMultiIp6Edit',
k_VIEW: 'interfaceMultiIp6View'
}
},
k_WIFI: {
k_ADD: 'interfaceWifiAdd',
k_EDIT: 'interfaceWifiEdit',
k_VIEW: 'interfaceWifiView'
}
};
k_INTERFACE_EDITOR_NAMES = k_WAW_CONSTANTS.k_INTERFACE_EDITOR_NAMES;
k_FAILOVER_ROLES_MAPPED[k_WAW_CONSTANTS.FailoverRoleType.None]      = '';
k_FAILOVER_ROLES_MAPPED[k_WAW_CONSTANTS.FailoverRoleType.Primary]   = k_tr('Primary', 'interfaceList');
k_FAILOVER_ROLES_MAPPED[k_WAW_CONSTANTS.FailoverRoleType.Secondary] = k_tr('Backup', 'interfaceList');
for (k_i = 0, k_cnt = k_SUPPORTED_INTERFACE_GROUP_LIST.length; k_i < k_cnt; k_i++) {
k_groupType = k_SUPPORTED_INTERFACE_GROUP_LIST[k_i];
if (InterfaceGroupType.Vpn === k_groupType) {
continue; }
k_emptyGroupData[k_groupType] = {};
k_emptyGroupData[k_groupType][k_COLUMN_ID_TYPE] = InterfaceType.k_EMPTY;
k_emptyGroupData[k_groupType][k_COLUMN_ID_GROUP] = k_groupType;
}
k_connectivityComboData = [ {
k_restrictions: { k_serverOs: [ k_OS_LINUX ] },
k_caption: k_tr('A Single Internet Link', 'interfaceList'),
k_value: ConnectivityType.Persistent
},
{
k_restrictions: { k_serverOs: [ k_OS_WINDOWS ] },
k_caption: k_tr('A Single Internet Link - Persistent', 'interfaceList'),
k_value: ConnectivityType.Persistent
},
{
k_restrictions: { k_serverOs: [ k_OS_WINDOWS ] },
k_caption: k_tr('A Single Internet Link - Dial on Demand', 'interfaceList'),
k_value: ConnectivityType.DialOnDemand
},
{
k_restrictions: { k_serverOs: [ k_OS_WINDOWS, k_OS_LINUX ] },
k_caption: k_tr('Multiple Internet Links - Failover', 'interfaceList'),
k_value: ConnectivityType.Failover
},
{
k_restrictions: { k_serverOs: [ k_OS_WINDOWS, k_OS_LINUX ] },
k_caption: k_tr('Multiple Internet Links - Load Balancing', 'interfaceList'),
k_value: ConnectivityType.LoadBalancing
}
];


k_onApply = function() {
var
k_grid = this.k_getParentWidget(),
k_data = k_grid.k_baseWidget.k_dataStore,
k_requests;
k_data.mode = k_grid.k_baseWidget.k_selectConnectivityType.k_getValue();
k_requests = [
{
k_jsonRpc: {
method: 'Interfaces.setConnectivityConfig',
params: {
config: k_data
}
}
}
];
if (k_grid.k_isRouteChangesPending) {
k_requests.push(
{
k_jsonRpc: {
method: 'VpnRoutes.apply'
}
}
);
k_grid.k_isRouteChangesPending = false;
}
k_requests.push({
k_jsonRpc: {
method: 'Interfaces.apply',
params: {
revertTimeout: 600
}
}
});
k_grid.k_baseWidget.k_batchSuccess = true; k_grid.k_pendingAutorefreshRequest = false; kerio.waw.requests.k_sendBatch(
k_requests,
{
k_callback: k_grid.k_applyResetCallback,
k_scope: k_grid,
k_callbackParams: {
k_isApply: true
},
k_requestOwner: k_grid
}
);
return false; };

k_onReset = function(k_button) {
var
k_grid = this.k_getParentWidget(),
k_requestOwner = null,
k_requests = [
{
method: 'Interfaces.reset'
}
];
if (k_grid.k_isRouteChangesPending) {
k_requests.push({ method: 'VpnRoutes.reset' });
k_grid.k_isRouteChangesPending = false;
}
if (false !== k_button.k_isFiredByEvent) {
kerio.waw.shared.k_methods.k_maskMainScreen();
k_requestOwner = undefined; }
k_grid.k_baseWidget.k_batchSuccess = true; k_grid.k_pendingAutorefreshRequest = false; kerio.waw.shared.k_methods.k_sendBatch({
k_requests: k_requests,
k_callback: k_grid.k_applyResetCallback,
k_scope: k_grid,
k_mask: false,
k_requestOwner: k_requestOwner
});
return false; };


k_onButtonClick = function(k_sender, k_item, k_event) {
var
k_isDblClick = k_sender.k_isInstanceOf('K_Grid'), k_grid = (k_isDblClick ? k_sender : k_sender.k_getParentWidget()),
InterfaceType = k_grid.InterfaceType,
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_INTERFACE_EDITOR_NAMES = k_CONSTANTS.k_INTERFACE_EDITOR_NAMES,
k_type = (k_isDblClick)
? (k_grid.k_baseWidget.k_isAuditor ? 'k_dblClickView' : 'k_dblClickEdit' )
: k_item.k_name,
k_isSelected = (k_grid.k_selectionStatus && 1 === k_grid.k_selectionStatus.k_selectedRowsCount),
k_isEditMode = false,
k_isAuditor = false,
k_sourceName = 'interfaceEditor',
k_editType,
k_objectName,
k_data;
switch (k_type) {
case 'k_btnAdd':          case 'k_btnAddVpnTunnel': k_sourceName = 'interfaceVpnTunnelEditor';
k_objectName = 'interfaceVpnAdd';
break;
case 'k_btnAddPPPoE':
k_objectName = 'interfacePPPoEAdd';
break;
case 'k_btnAddPPTP':
k_objectName = 'interfacePPTPAdd';
break;
case 'k_btnAddL2TP':
k_objectName = 'interfaceL2TPAdd';
break;
case 'k_btnView':
case 'k_dblClickView':
k_isAuditor = true;
case 'k_btnEdit':
case 'k_dblClickEdit':
if (!k_isSelected) {
kerio.lib.k_reportError('No item selected for editation', 'interfaceList', 'k_onButtonClick');
return;
}
k_isEditMode = true;
k_data = k_grid.k_selectionStatus.k_rows[0].k_data;
k_editType = k_data.type;
switch (k_editType) {
case InterfaceType.Ethernet:
if (k_data.flags && k_data.flags.wifi && !k_data.flags.virtualSwitch) {
k_objectName = (k_isAuditor ? k_INTERFACE_EDITOR_NAMES.k_WIFI.k_VIEW : k_INTERFACE_EDITOR_NAMES.k_WIFI.k_EDIT);
}
else {
k_objectName = (k_isAuditor ? k_INTERFACE_EDITOR_NAMES.k_ETHERNET.k_VIEW : k_INTERFACE_EDITOR_NAMES.k_ETHERNET.k_EDIT);
}
break;
case InterfaceType.Ras:
if (k_grid.k_isLinux) {
if (k_CONSTANTS.RasType.PPPoE === k_data.ras.rasType) {
k_objectName = (k_isAuditor ? k_INTERFACE_EDITOR_NAMES.k_PPPOE.k_VIEW : k_INTERFACE_EDITOR_NAMES.k_PPPOE.k_EDIT);
}
else {
k_objectName = (k_isAuditor ? k_INTERFACE_EDITOR_NAMES.k_PPTP.k_VIEW : k_INTERFACE_EDITOR_NAMES.k_PPTP.k_EDIT);
if (k_CONSTANTS.RasType.PPTP === k_data.ras.rasType) {
}
else {
k_objectName = (k_isAuditor ? k_INTERFACE_EDITOR_NAMES.k_L2TP.k_VIEW : k_INTERFACE_EDITOR_NAMES.k_L2TP.k_EDIT);
}
}
}
else { k_objectName = (k_isAuditor ? k_INTERFACE_EDITOR_NAMES.k_RAS.k_VIEW : k_INTERFACE_EDITOR_NAMES.k_RAS.k_EDIT);
}
break;
case InterfaceType.DialIn:
k_objectName = (k_isAuditor ? k_INTERFACE_EDITOR_NAMES.k_DIAL_IN.k_VIEW : k_INTERFACE_EDITOR_NAMES.k_DIAL_IN.k_EDIT);
break;
case InterfaceType.VpnServer:
k_sourceName = 'interfaceVpnServerEditor';
k_objectName = (k_isAuditor ? k_INTERFACE_EDITOR_NAMES.k_VPN_SERVER.k_VIEW : k_INTERFACE_EDITOR_NAMES.k_VPN_SERVER.k_EDIT);
break;
case InterfaceType.VpnTunnel:
k_sourceName = 'interfaceVpnTunnelEditor';
k_objectName = (k_isAuditor ? k_INTERFACE_EDITOR_NAMES.k_VPN_TUNNEL.k_VIEW : k_INTERFACE_EDITOR_NAMES.k_VPN_TUNNEL.k_EDIT);
break;
case InterfaceType.k_EMPTY:
return; }
break;
case 'k_btnRemove':
if (k_isSelected) {
k_grid.k_removeItem(k_grid.k_selectionStatus.k_rows[0].k_data.id);
}
return;
case 'k_btnDialHang':
if (k_isSelected) {
k_grid.k_dialHang();
}
return;
case 'k_btnWizard':
k_grid.k_runWizard(); return;
default:
kerio.lib.k_reportError('Internal error: Unsupported button ' + k_type, 'interfaceList', 'k_onButtonClick');
return;
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: k_sourceName,
k_objectName: k_objectName,
k_params: {
k_relatedGrid: k_grid,
k_isIpv6Blocked: k_grid.k_isIpv6Blocked,
k_kerioVpnCertificate: k_grid.k_kerioVpnCertificate,
k_kerioIpsecCertificate: k_grid.k_kerioIpsecCertificate,
k_data: (k_isEditMode)
? k_grid.k_selectionStatus.k_rows[0].k_data
: {} }
});
}; 
k_contextChangeParameters = function(k_menu, k_item) {
var
k_grid = k_menu.k_relatedWidget,
k_form = k_grid.k_parentWidget.k_form,
k_additionalMenuItems = k_grid.k_additionalMenuItems,
InterfaceType = k_grid.InterfaceType,
k_enable,
k_isVpnServer,
k_isVpnTunnel,
k_data;
if (0 === k_grid.k_selectionStatus.k_selectedRowsCount) {
return;
}
k_data = k_grid.k_selectionStatus.k_rows[0].k_data;
k_isVpnServer = InterfaceType.VpnServer === k_data.type;
k_isVpnTunnel = InterfaceType.VpnTunnel === k_data.type;
switch (k_item.k_name) {
case k_additionalMenuItems.k_setAsDialOnDemand:
k_data.connectivityParameters.onDemand = true;
break;
case k_additionalMenuItems.k_enable:
case k_additionalMenuItems.k_disable:
k_enable = k_additionalMenuItems.k_enable === k_item.k_name;
k_data.enabled = k_enable;
if (k_isVpnServer) {
k_data.server.ipsecVpnEnabled = k_enable;
k_data.server.kerioVpnEnabled = k_enable;
delete k_data.server.psk.value;
}
else {
if (k_isVpnTunnel) {
delete k_data.tunnel.psk.value;
}
}
break;
case k_additionalMenuItems.k_setAsPrimary:
k_data.connectivityParameters.failoverRole = k_grid.k_FAILOVER_ROLES.Primary;
break;
case k_additionalMenuItems.k_setAsSecondary:
k_data.connectivityParameters.failoverRole = k_grid.k_FAILOVER_ROLES.Secondary;
break;
case k_additionalMenuItems.k_configureSwitch:
k_form.k_openManagePortsEditor(k_form);
return;
case k_additionalMenuItems.k_configureWifi:
k_form.k_openManageWifiEditor(k_form);
return;
case k_additionalMenuItems.k_configurePort:
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'interfacePortEditor',
k_params: {
k_data: k_form.k_portListMapped[k_data.ports[0]],
k_rowIndex: null,
k_parentWidget: k_grid
}
});
return;
}
k_data = {
ids: [k_data.id],
details: k_data
};
kerio.waw.requests.k_sendInterfaceChange(k_data, false, k_grid);
};

k_isPortsSetDangerous = function(k_changes, k_interfaces) {
var
k_connectedInterface = kerio.waw.requests.k_connectedInterfaceId,
k_i, k_cnt,
k_iface,
k_isDangerous = false;
if (k_connectedInterface) { for (k_i = 0, k_cnt = k_interfaces.length; k_i < k_cnt; k_i++) {
if (k_connectedInterface === k_interfaces[k_i].id) {
k_iface = k_interfaces[k_i];
break;
}
}
if (k_iface) {
for (k_i = 0, k_cnt = k_changes.length; k_i < k_cnt; k_i++) {
if (-1 < k_iface.ports.indexOf(k_changes[k_i].id)) { k_isDangerous = true;
break; }
}
}
}
return k_isDangerous;
};

k_openManagePortsEditor = function(k_form) {
if (kerio.waw.status.k_currentScreen.k_isContentChanged()) {
kerio.waw.status.k_currentScreen.k_showContentChangedAlert();
return;
}
var
k_baseWidget;
if (k_form.k_baseWidget) {
k_baseWidget = k_form.k_baseWidget;
} else {
k_baseWidget = k_form;
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'interfaceManagePortsEditor',
k_params: {
k_callback: k_baseWidget.k_updatePortAssignment,
k_parentWidget: k_baseWidget,
k_portList: k_baseWidget.k_portList
}
});
};

k_openManageWifiEditor = function(k_form) {
var
k_baseWidget;
if (k_form.k_baseWidget) {
k_baseWidget = k_form.k_baseWidget;
} else {
k_baseWidget = k_form;
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: 'interfaceManageWifiEditor',
k_params: {
k_callback: k_baseWidget.k_updateWifiConfig,
k_parentWidget: k_baseWidget,
k_wifiConfig: kerio.lib.k_cloneObject(k_baseWidget.k_wifiConfig),
k_wifiCountries: k_baseWidget.k_wifiCountries
}
});
};
k_additionalMenuItems = {
k_enable: 'k_enable',
k_disable: 'k_disable',
k_setAsDialOnDemand: 'k_setAsDialOnDemand',
k_setAsPrimary: 'k_setAsPrimary',
k_setAsSecondary: 'k_setAsSecondary',
k_configurePort: 'k_configurePort',
k_configureSwitch: 'k_configureSwitch',
k_configureWifi: 'k_configureWifi'
};

k_toolbarButtons = [ {
k_restrictions: {
k_serverOs:  [ k_OS_WINDOWS ],
k_isAuditor: [ false ]
},
k_isVisibleInToolbar: true,
k_id: 'k_btnAdd',
k_caption: k_tr('Add VPN Tunnel…', 'interfaceList'),
k_onClick: k_onButtonClick
},
{
k_restrictions: {
k_serverOs:  [ k_OS_LINUX ],
k_isAuditor: [ false ]
},
k_isVisibleInToolbar: true,
k_id: 'k_btnAdd',
k_caption: k_tr('Add', 'common'),
k_isMenuButton: true, k_items: [
{
k_id: 'k_btnAddPPPoE',
k_iconCls: 'interfaceIcon interfaceRas',
k_caption: k_tr('PPPoE…', 'interfaceList'),
k_onClick: k_onButtonClick
},
{
k_id: 'k_btnAddPPTP',
k_iconCls: 'interfaceIcon interfaceRas',
k_caption: k_tr('PPTP…', 'interfaceList'),
k_onClick: k_onButtonClick
},
{
k_id: 'k_btnAddL2TP',
k_iconCls: 'interfaceIcon interfaceRas',
k_caption: k_tr('L2TP…', 'interfaceList'),
k_onClick: k_onButtonClick
},
{
k_id: 'k_btnAddVpnTunnel',
k_iconCls: 'groupIcon interfaceHeaderIcon groupVpn',
k_caption: k_tr('VPN Tunnel…', 'interfaceList'),
k_onClick: k_onButtonClick
}
]
},
{
k_restrictions: {
k_isAuditor: [ false ]
},
k_isVisibleInToolbar: true,
k_id: 'k_btnEdit',
k_caption: k_tr('Edit…', 'common'),
k_isDisabled: true,
k_onClick: k_onButtonClick
},
{
k_restrictions: {
k_isAuditor: [ true ]
},
k_isVisibleInToolbar: true,
k_id: 'k_btnView',
k_caption: k_tr('View…', 'common'),
k_isDisabled: true,
k_onClick: k_onButtonClick
},
{
k_restrictions: {
k_isAuditor: [ false ]
},
k_id: 'k_btnRemove',
k_caption: k_tr('Remove', 'common'),
k_onClick: k_onButtonClick
},
'-',
{
k_isVisibleInToolbar: true,
k_id: 'k_btnDialHang',
k_caption: k_tr('Dial', 'interfaceList'),
k_isDisabled: true,
k_onClick: k_onButtonClick
},
{
k_restrictions: {
k_isAuditor: [ false ]
},
k_id: k_additionalMenuItems.k_enable,
k_caption: k_tr('Enable', 'interfaceList'),
k_onClick: k_contextChangeParameters,
k_isHidden: true
},
{
k_restrictions: {
k_isAuditor: [ false ]
},
k_id: k_additionalMenuItems.k_disable,
k_caption: k_tr('Disable', 'interfaceList'),
k_onClick: k_contextChangeParameters,
k_isHidden: true
},
{
k_restrictions: {
k_isAuditor: [ false ]
},
k_id: k_additionalMenuItems.k_setAsDialOnDemand,
k_caption: k_tr('Set as dial-on-demand link', 'interfaceList'),
k_onClick: k_contextChangeParameters,
k_isHidden: true
},
{
k_restrictions: {
k_isAuditor: [ false ]
},
k_id: k_additionalMenuItems.k_setAsPrimary,
k_caption: k_tr('Set as primary link', 'interfaceList'),
k_onClick: k_contextChangeParameters,
k_isHidden: true
},
{
k_restrictions: {
k_isAuditor: [ false ]
},
k_id: k_additionalMenuItems.k_setAsSecondary,
k_caption: k_tr('Set as backup link', 'interfaceList'),
k_onClick: k_contextChangeParameters,
k_isHidden: true
},
{
k_restrictions: {
k_isAuditor: [ false ]
},
k_id: k_additionalMenuItems.k_configurePort,
k_caption: k_tr('Configure port…', 'interfaceList'),
k_onClick: k_contextChangeParameters,
k_isHidden: true
},
{
k_restrictions: {
k_isAuditor: [ false ]
},
k_id: k_additionalMenuItems.k_configureSwitch,
k_caption: k_tr('Manage Ports…', 'interfaceList'),
k_onClick: k_contextChangeParameters,
k_isHidden: true
},
{
k_restrictions: {
k_isAuditor: [ false ],
k_isWifiAvailable: [ true ]
},
k_id: k_additionalMenuItems.k_configureWifi,
k_caption: k_tr('WiFi…', 'interfaceList'),
k_onClick: k_contextChangeParameters,
k_isHidden: true
},
{
k_id: 'k_btnTrafficChart',
k_caption: k_tr('Show Traffic Chart', 'contextMenu'),
k_onClick: function(k_toolbar, k_item) {
kerio.waw.status.k_currentScreen.k_switchPage('trafficCharts', {
k_componentType: kerio.waw.shared.k_CONSTANTS.TrafficStatisticsType.TrafficStatisticsInterface,
k_componentId:   k_toolbar.k_parentWidget.k_selectionStatus.k_rows[0].k_data.id
});
}
},
'-',
{
k_restrictions: {
k_isAuditor: [ false ]
},
k_id: 'k_btnWizard',
k_caption: kerio.lib.k_tr('Configure in Wizard…', 'common'),
k_onClick: k_onButtonClick
}
]; if (!k_isAuditor) {
k_toolbarButtons.push(
{
k_type: 'K_APPLY_RESET',
k_onApply: k_onApply,
k_onReset: k_onReset
}
);
}

k_statusbarCfg = {
k_defaultConfig:  'k_noMessage',
k_configurations: {
k_noMessage: {
k_text: ''
},
k_warning: {
k_text: '',
k_iconCls: 'statusBarIcon ipVpnCollision'
},
k_invalidCertificate: {
k_text: k_tr('Some VPN interfaces use invalid or non-existing certificate.', 'interfaceList'),
k_iconCls: 'statusBarIcon ipVpnCollision'
},
k_collision: {
k_text: k_tr('There are two or more interfaces with the same IP address.', 'interfaceList'),
k_iconCls: 'statusBarIcon ipVpnCollision',
k_link: {
k_text: k_tr('Click here for details.', 'common'),
k_onClick: function() {
this.k_relatedWidget.k_showCollisionDetails(this._k_lastCollisionId);
}
}
},

k_llbWarning: {
k_text: k_tr('There is a compatibility problem with Windows 7 or Windows 2008 R2.', 'interfaceList'),
k_iconCls: 'statusBarIcon ipVpnCollision',
k_link: {
k_text: k_tr('Learn more…', 'interfaceList'),
k_onClick: function() {
window.open(kerio.waw.shared.k_CONSTANTS.k_LLB_INCOMPATIBILITY_URL);
}
}
}
}
};

k_statusbar = new kerio.lib.K_Statusbar(k_localNamespace + 'k_statusbar', k_statusbarCfg);
k_gridCfg = {
k_restrictBy: {
k_serverOs: (k_isLinux ? k_OS_LINUX : k_OS_WINDOWS),
k_isBoxEdition: k_isBoxEdition,
k_isWifiAvailable: k_isWifiAvailable,
k_isIpv6Available: k_isIpv6Available,
k_isAuditor: k_isAuditor
},
k_settingsId: (k_isIpv6Available ? 'interfacesIPv6Grid' : 'interfacesIPv4Grid'), k_isReadOnly: k_isAuditor,
k_selectionMode: 'k_single',
k_className: 'interfaceList',
k_onDblClick: k_onButtonClick,
k_toolbars: {
k_bottom: {
k_hasSharedMenu: true,
k_items: k_toolbarButtons,

k_update: function(k_sender, k_event) {
var
k_additionalMenuItems = k_sender.k_additionalMenuItems,
Failover = k_sender.ConnectivityType.Failover,
InterfaceType = k_sender.InterfaceType,
k_isAuditor = k_sender.k_isReadOnly(),
k_showItems = [],
k_i, k_cnt,
k_item,
k_items,
k_isSelected,
k_interfaceData,
k_flag;
if ( ! (k_sender instanceof kerio.lib.K_Grid) || kerio.lib.k_constants.k_EVENT.k_TYPES.k_SELECTION_CHANGED !== k_event.k_type) {
return;
}
for (k_item in k_additionalMenuItems) {
this.k_hideItem(k_item);
}
k_isSelected = (1 === k_sender.k_selectionStatus.k_selectedRowsCount);
k_interfaceData = (k_isSelected ? k_sender.k_selectionStatus.k_rows[0].k_data : {});
k_flag = k_interfaceData.flags || {};
if (k_isSelected && k_sender.InterfaceType.k_EMPTY === k_interfaceData.type) {
k_isSelected = false; }
if (k_isAuditor) {
k_items = k_sender.k_toolbars.k_bottom.k_items;
for (k_i in k_items) {
k_items[k_i].k_setReadOnly(false);
}
}
this.k_enableItem('k_btnEdit', k_isSelected);
this.k_enableItem('k_btnView', k_isSelected);
this.k_enableItem('k_btnRemove', k_isSelected && k_flag.deletable);
this.k_enableItem('k_btnTrafficChart', k_isSelected);
this.k_disableItem('k_btnDialHang', true);
this.k_setItemCaption('k_btnDialHang', k_sender.k_trDial);
if (!k_isSelected) {
return;
}
if (k_flag.dialable) {
this.k_enableItem('k_btnDialHang');
}
else if (k_flag.hangable) {
this.k_enableItem('k_btnDialHang');
this.k_setItemCaption('k_btnDialHang', k_sender.k_trHang);
} if (k_sender.InterfaceGroupType.Internet === k_interfaceData.group) {
if (Failover === k_sender.k_connectivityType && (InterfaceType.Ethernet === k_interfaceData.type || InterfaceType.Ras === k_interfaceData.type)) {
k_showItems.push(k_additionalMenuItems.k_setAsPrimary);
k_showItems.push(k_additionalMenuItems.k_setAsSecondary);
} else if (k_sender.ConnectivityType.DialOnDemand === k_sender.k_connectivityType && InterfaceType.Ras === k_interfaceData.type) {
k_showItems.push(k_additionalMenuItems.k_setAsDialOnDemand);
}
}
if ((k_sender.k_isLinux && InterfaceType.Ethernet === k_interfaceData.type)
|| InterfaceType.VpnServer === k_interfaceData.type
|| InterfaceType.VpnTunnel === k_interfaceData.type ) {
if (true === k_interfaceData.enabled) {
k_showItems.push(k_additionalMenuItems.k_disable);
} else {
k_showItems.push(k_additionalMenuItems.k_enable);
}
}
if (k_sender.k_isLinux && InterfaceType.Ethernet === k_interfaceData.type && !k_interfaceData.flags.vlan) {
if (k_interfaceData.flags.virtualSwitch) {
k_showItems.push(k_additionalMenuItems.k_configureSwitch);
} else {
if (k_sender.k_isWifiAvailable && k_interfaceData.flags.wifi) {
k_showItems.push(k_additionalMenuItems.k_configureWifi);
}
else {
if (0 === k_interfaceData.ports.length) {
k_showItems.push(k_additionalMenuItems.k_configureSwitch);
}
else {
k_showItems.push(k_additionalMenuItems.k_configurePort);
}
}
}
}
k_cnt = k_showItems.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
this.k_showItem(k_showItems[k_i]);
}
}
}
},
k_statusbar: k_statusbar,
k_rowRenderer: function(k_rowData) {
return (k_rowData.ras && k_rowData.ras.dead && k_rowData.flags.deletable ? 'deletable' : '');
},
k_columns: {
k_sorting: {
k_columnId: 'name'
},
k_grouping: {
k_columnId: k_COLUMN_ID_GROUP,
k_isMemberIndented: true
},
k_items: [
{k_columnId: k_COLUMN_ID_GROUP,  k_isKeptHidden: true, k_groupRenderer: k_WAW_METHODS.k_renderers.k_interfaceGroupNameRenderer}, {k_columnId: k_COLUMN_ID_TYPE         ,  k_isDataOnly: true},
{k_columnId: 'id'           ,  k_isDataOnly  : true},
{k_columnId: 'name'         ,  k_caption: k_tr('Name', 'common')                , k_width: 240,
k_colSpanIf: {
k_columnId: k_COLUMN_ID_TYPE,
k_columnValues: [InterfaceType.k_EMPTY]
},
k_renderer: k_WAW_METHODS.k_formatInterfaceName
},
{k_columnId: 'linkStatus'                  ,  k_caption: k_tr('Status', 'common'),
k_renderer: this.k_renderStatus },
{k_columnId: 'ip'                          ,  k_caption: k_tr('IPv4', 'interfaceList'),
k_width: k_COLUMN_IPv4_WIDTH,
k_renderer: this.k_renderIpv4Address
},
{k_columnId: 'subnetMask'                  ,  k_caption: k_tr('IPv4 Mask', 'common'),
k_width: k_COLUMN_IPv4_WIDTH,
k_isHidden: true,
k_renderer: this.k_renderIpv4ComplementaryAddress
},
{k_columnId: 'gateway'                     ,  k_caption: k_tr('IPv4 Gateway', 'common'),
k_width: k_COLUMN_IPv4_WIDTH,
k_isHidden: true,
k_renderer: this.k_renderIpv4ComplementaryAddress
},
{k_columnId: 'dnsServers'                  ,  k_caption: k_tr('IPv4 DNS', 'common'),
k_width: k_COLUMN_IPv4_WIDTH,
k_isHidden: true,
k_renderer: this.k_renderIpv4ComplementaryAddress
},
{k_columnId: 'ip6Addresses'                ,  k_caption: k_tr('IPv6', 'interfaceList'),
k_width: k_COLUMN_IPv6_WIDTH,
k_isKeptHidden: !k_isIpv6Available,
k_isHidden: !k_isIpv6Available, k_renderer: this.k_renderIpv6Address
},
{k_columnId: 'ip6prefixLength'             ,  k_caption: k_tr('IPv6 Prefix Length', 'interfaceList'),
k_isKeptHidden: !k_isIpv6Available,
k_isHidden: true,
k_renderer: this.k_renderIpv6PrefixLength
},
{k_columnId: 'ip6Gateway'                 ,  k_caption: k_tr('IPv6 Gateway', 'interfaceList'), k_width: k_COLUMN_IPv6_WIDTH,
k_isKeptHidden: !k_isIpv6Available,
k_isHidden: true,
k_renderer: this.k_renderIpv6ComplementaryAddress
},
{k_columnId: 'routedIp6PrefixAutodetected' ,  k_isDataOnly: true },
{k_columnId: 'routedIp6Prefix'             ,  k_isDataOnly: true },
{k_columnId: 'connectivityParameters'      ,  k_caption: k_tr('Connectivity', 'interfaceList'),
k_renderer: this.k_renderConnectivity
},
{k_columnId: 'details'                     ,  k_caption: k_tr('Details', 'common'), k_width: 240,
k_renderer: this.k_renderDetails
},
{k_columnId: 'mac'                         ,  k_caption: k_tr('MAC', 'interfaceList'), k_width: 120,
k_isHidden: true,
k_renderer: this.k_renderMacAddress
},
{k_columnId: 'systemName'                  ,  k_caption: k_tr('System Name', 'interfaceList'), k_width: 240,
k_isHidden: true,
k_renderer: kerio.waw.shared.k_methods.k_renderers.k_tooltipRenderer
},
{k_columnId: 'flags'               ,  k_isDataOnly: true},
{k_columnId: 'status'              ,  k_isDataOnly: true},  {k_columnId: 'dnsAutodetected'     ,  k_isDataOnly: true},
{k_columnId: 'gatewayAutodetected' ,  k_isDataOnly: true},
{k_columnId: 'enabled'             ,  k_isDataOnly: true},
{k_columnId: 'ip4Enabled'          ,  k_isDataOnly: true},
{k_columnId: 'ip6Enabled'          ,  k_isDataOnly: true},
{k_columnId: 'ip6Mode'             ,  k_isDataOnly: true},  {k_columnId: 'linkIp6Address'      ,  k_isDataOnly: true},
{k_columnId: 'ras'                 ,  k_isDataOnly: true},
{k_columnId: 'vpn'                 ,  k_isDataOnly: true},
{k_columnId: 'secondaryAddresses'  ,  k_isDataOnly: true},  {k_columnId: 'server'              ,  k_isDataOnly: true},
{k_columnId: 'tunnel'              ,  k_isDataOnly: true},
{k_columnId: 'ports'               ,  k_isDataOnly: true},  {k_columnId: 'mtuOverride'         ,  k_isDataOnly: true},  {k_columnId: 'stp'                 ,  k_isDataOnly: true},
{k_columnId: 'mode'                ,  k_isDataOnly: true},  {k_columnId: 'dhcpServerEnabled'   ,  k_isDataOnly: true},
{k_columnId: 'encap'               ,  k_isDataOnly: true},   {k_columnId: 'ssidId'              ,  k_isDataOnly: true}   ]
}, k_remoteData: {
k_isAutoLoaded: false,
k_root: 'list',
k_jsonRpc: {
method: 'Interfaces.get',
sortByGroup: true
}
},
k_onLoad: function(k_grid, k_params) {
var
k_sortDirection = k_grid.k_ASC,
k_data,
k_i, k_cnt;
if (k_params && k_params.params && k_params.params.query && k_params.params.query.orderBy && k_params.params.query.orderBy[0]) {
k_sortDirection = k_params.params.query.orderBy[0].direction;
}
this.k_completeInterfaceGroupList(k_sortDirection);
if (this.k_dragRequestPending) {
this.k_select(this.k_dragRequestPending);
this.k_dragRequestPending = null;
}
kerio.waw.shared.k_data.k_cache({
k_screen: this.k_form,
k_data: [],
k_dialogs: ['interfaceEditor', 'interfaceAdvancedEditor', 'interfaceVpnTunnelEditor', 'interfaceVpnServerEditor'] });
if (this.k_preselectRowId) { kerio.waw.shared.k_DEFINITIONS.k_preselectRowById.defer(500, k_grid);
}
k_data = k_grid.k_getData();
for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) {
if (k_grid.InterfaceType.VpnServer === k_data[k_i].type) {
k_grid.k_kerioIpsecCertificate = k_data[k_i].server.ipsecVpnCertificate;
k_grid.k_kerioVpnCertificate = k_data[k_i].server.kerioVpnCertificate;
break;
}
}
},
k_isDragDropRow: k_WAW_CONSTANTS.k_ALLOW_DRAG_AND_DROP,

k_onBeforeDrag: function(k_grid, k_data) {
if (undefined === k_data[0]) {
return false;
}
var
k_itemData = k_data[0], k_types = k_grid.InterfaceType,
k_type = k_itemData.type;
switch (k_type) {
case k_types.Ethernet: case k_types.Ras:
case k_types.k_RAS_PPPoE:
case k_types.k_RAS_PPTP:
case k_types.k_RAS_L2TP:
case k_types.DialIn:
return true;
default:
return false;
}
},

k_onDrag: function(k_grid, k_data, k_srcIndex, k_group, k_isCopy) {
k_data = k_data[0]; var
k_groups = kerio.waw.shared.k_CONSTANTS.InterfaceGroupType;
switch (k_group) {
case k_groups.Internet:
case k_groups.Trusted:
case k_groups.Guest:
case k_groups.Other:
return true;
default:
return false;
}
},

k_onDrop: function(k_grid, k_data, k_newGroup) {
k_data = k_data[0]; k_data.group = k_newGroup;
k_grid.k_dragRequestPending = k_data;
k_data = {
ids: [k_data.id],
details: k_data
};
kerio.waw.requests.k_sendInterfaceChange(k_data, null, k_grid); }
}; k_grid = new kerio.waw.shared.k_widgets.K_ContextMenuList(k_localNamespace + 'grid', k_gridCfg);
k_formCfg = {
k_restrictBy: {
k_serverOs: (k_isLinux ? k_OS_LINUX : k_OS_WINDOWS),
k_isBoxEdition: k_isBoxEdition,
k_isWifiAvailable: k_isWifiAvailable
},
k_items: [
{	k_type: 'k_fieldset',
k_height: 80,
k_caption: k_tr('Internet connectivity', 'interfaceList'),
k_isLabelHidden: true,
k_items: [
{	k_type: 'k_display',
k_value: k_tr('Select an option of how the firewall is connected to the Internet:', 'interfaceList')
},
{
k_type: 'k_row',
k_items: [
{	k_type: 'k_select',
k_id: 'k_connectivityType',
k_isDisabled: k_isAuditor,
k_width: 400,
k_isLabelHidden: true,
k_localData: k_connectivityComboData,
k_fieldDisplay: 'k_caption',
k_fieldValue: 'k_value',

k_onChange: function(k_form, k_element, k_value) {
kerio.adm.k_framework.k_enableApplyReset();
k_form.k_setVisible(['k_btnAdvanced'], k_value !== kerio.waw.shared.k_CONSTANTS.ConnectivityType.Persistent);
k_form.k_grid.k_connectivityType = k_value;
k_form.k_grid.k_refresh();
}
},
{
k_type: 'k_formButton',
k_id: 'k_btnAdvanced',
k_isHidden: true, k_caption: k_tr('Advanced…', 'common'),

k_onClick: function(k_form) {
var
k_dialogSource = 'interfaceAdvancedEditor',
k_dialogName = 'interfaceProbeEditor';
if (kerio.waw.shared.k_CONSTANTS.ConnectivityType.DialOnDemand === k_form.k_grid.k_connectivityType) {
k_dialogName = 'interfaceRulesEditor';
}
kerio.lib.k_ui.k_showDialog({
k_sourceName: k_dialogSource,
k_objectName: k_dialogName,
k_params: {
k_parent: k_form,
k_callback: k_form.k_advancedEditorCallback,
k_data: k_form.k_dataStore
}
});
}
},
{
k_type: 'k_formButton',
k_id: 'k_btnManagePorts',
k_className: 'k_btnPorts',
k_restrictions: {
k_serverOs:  [ k_OS_LINUX ]
},
k_caption: k_tr('Ports…', 'interfaceList'),
k_onClick: k_openManagePortsEditor
},
{
k_type: 'k_formButton',
k_id: 'k_btnManageWifi',
k_className: 'k_btnWifi',
k_restrictions: {
k_serverOs:  [ k_OS_LINUX ],
k_isWifiAvailable: [ true ]
},
k_caption: k_tr('WiFi…', 'interfaceList'),
k_onClick: k_openManageWifiEditor
}
]
}
]
},
{	k_type: 'k_container',
k_id: 'k_gridContainer',
k_content: k_grid
}
]
}; k_form = new kerio.lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
k_references = {
k_grid: k_grid,
k_toolbar: k_grid.k_toolbars.k_bottom,
k_selectConnectivityType: k_form.k_getItem('k_connectivityType'),
k_isAuditor: k_isAuditor,
k_isBoxEdition: k_isBoxEdition,
k_isLinux: k_isLinux,
k_isWifiAvailable: k_isWifiAvailable,
k_batchSuccess: true,
k_autorefreshTaskId: k_interfacesRefreshTaskId,
k_tasks: kerio.waw.shared.k_tasks,
k_portList: [],
k_portListMapped: [],
k_isPortsSetDangerous: k_isPortsSetDangerous,
k_openManagePortsEditor: k_openManagePortsEditor,
k_openManageWifiEditor: k_openManageWifiEditor,
k_wifiConfig: {},
k_wifiCountries: null
};
k_baseWidget = k_form; if (!k_isAuditor) {
k_references._k_applyResetToolbar = k_grid.k_toolbars.k_bottom; }
k_baseWidget.k_addReferences(k_references);
k_grid.k_addReferences({
k_baseWidget: k_baseWidget,
k_form: k_form,
k_isLinux: k_isLinux,
k_isIpv6Available: k_isIpv6Available,
k_isIpv6Blocked: false,
k_emptyGroupData: k_emptyGroupData,
k_COLUMN_ID_GROUP: k_COLUMN_ID_GROUP,
k_SUPPORTED_INTERFACE_GROUP_LIST: k_SUPPORTED_INTERFACE_GROUP_LIST,
k_selectConnectivityType: k_form.k_getItem('k_connectivityType'),
k_msgDialOnDemand: k_tr('Dial on Demand', 'interfaceList'),
k_BANDWIDTH_UNITS_MAPPED: k_BANDWIDTH_UNITS_MAPPED,
k_connectivityType: ConnectivityType.Persistent,
ConnectivityType: ConnectivityType,
InterfaceType: InterfaceType,
InterfaceModeLinkLocal: k_WAW_CONSTANTS.InterfaceModeType.InterfaceModeLinkLocal,
k_ASC: k_WAW_CONSTANTS.kerio_web_SharedConstants.kerio_web_Asc,
k_INTERFACE_STATUS_MAPPED: k_WAW_DEFINITIONS.k_INTERFACE_STATUS_MAPPED,
k_FAILOVER_ROLES_MAPPED: k_FAILOVER_ROLES_MAPPED,
k_FAILOVER_ROLES: k_WAW_CONSTANTS.FailoverRoleType,
InterfaceGroupType: k_WAW_CONSTANTS.InterfaceGroupType,
Internet: k_WAW_CONSTANTS.InterfaceGroupType.Internet,
k_formatIpAddress: k_WAW_METHODS.k_formatIpAddress,
k_SELECTION_CHANGED: kerio.lib.k_constants.k_EVENT.k_TYPES.k_SELECTION_CHANGED, k_warningMessages: {}, k_ipsecPeerIdConfig: {},
k_trNoPortsAssigned: k_tr('No ports are assigned to LAN Switch', 'interfaceList'),
k_trDial: k_tr('Dial', 'interfaceList'),
k_trHang: k_tr('Hang Up', 'interfaceList'),
k_trDisabledIpv4: k_tr('IPv4 disabled', 'interfaceList'), k_trDisabledIpv6: k_tr('IPv6 disabled', 'interfaceList'), k_trVpnNetwork: k_tr('VPN network:', 'interfaceList') + ' ',
k_trVpnAddress: k_tr('Current VPN server address:', 'interfaceList') + ' ',
k_isWifiAvailable: k_isWifiAvailable,
k_dragRequestPending: null,
k_autorefreshTaskId: k_interfacesRefreshTaskId,
k_tasks: kerio.waw.shared.k_tasks,
k_autorefreshStart: new Date(),
k_additionalMenuItems: k_additionalMenuItems,
k_dedicatedWarnings: {             k_llbWarning: 'k_llbWarning'  },
k_preselectRowId: null,
k_kerioVpnCertificate: null,
k_kerioIpsecCertificate: null
});
this.k_addControllers(k_baseWidget);
k_grid.k_prepareAutorefresh();
return k_baseWidget;
}, 
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_applyParams = function () {
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
kerio.waw.shared.k_data.k_get('k_certificates');
this.k_loadData();
this.k_grid.k_preselectRowId = kerio.waw.status.k_currentScreen.k_getSwitchPageParam('k_id');
};

k_kerioWidget.k_onActivate = function() {
if (!this.k_tasks.k_isDefined(this.k_autorefreshTaskId)) {
this.k_grid.k_prepareAutorefresh(); }
if (!this.k_tasks.k_start(this.k_autorefreshTaskId)) {
this.k_tasks.k_resume(this.k_autorefreshTaskId);
}
};

k_kerioWidget.k_onDeactivate = function() {
this.k_tasks.k_stop(this.k_autorefreshTaskId);
};

k_kerioWidget.k_loadData = function() {
var
k_requests;
k_requests = [
{
k_jsonRpc: {
method: 'Interfaces.reset'
},
k_callback: this.k_resetStore, k_scope: this
},
{
k_jsonRpc: {
method: 'Interfaces.getConnectivityConfig'
},
k_callback: this.k_getConnectivityCallback,
k_scope: this
},
{
k_jsonRpc: {
method: 'Interfaces.getWarnings' },
k_callback: this.k_showLlbWarning,
k_scope: this
},
{
k_jsonRpc: {
method: 'Interfaces.checkIpCollision' },
k_callback: this.k_showCollisionWarning,
k_scope: this
},
{
k_jsonRpc: {
method: 'Interfaces.getIpsecPeerIdConfig'
},
k_callback: this.k_getIpsecPeerIdConfigCallback,
k_scope: this
},
{
k_jsonRpc: {
method: 'SecuritySettings.get'
},
k_callback: this.k_getBlockedIpv6,
k_scope: this
}
];
if (this.k_isLinux) {
k_requests.push({
k_jsonRpc: {
method: 'Ports.get'
},
k_callback: this.k_getPortsCallback,
k_scope: this
});
}
if (this.k_isWifiAvailable) {
k_requests.push({
k_jsonRpc: {
method: 'Interfaces.getWifiCountries'
},
k_callback: this.k_getWifiCountriesCallback,
k_scope: this
});
k_requests.push({
k_jsonRpc: {
method: 'Interfaces.getWifiConfig'
},
k_callback: this.k_getWifiConfigCallback,
k_scope: this
});
}
this.k_grid.k_pendingAutorefreshRequest = false; kerio.waw.requests.k_sendBatch(k_requests, {
k_callback: this.k_loadDataCallback, k_scope: this.k_grid
});
};

k_kerioWidget.k_resetStore = function() {
this.k_grid.k_warningMessages = {};
};

k_kerioWidget.k_getConnectivityCallback = function(k_data, k_success) {
if (!k_success) {
return;
}
k_data = k_data.config;
this.k_selectConnectivityType.k_setValue(k_data.mode);
this.k_dataStore = k_data;
};

k_kerioWidget.k_getIpsecPeerIdConfigCallback = function(k_data, k_success) {
var
k_certificateValues = [],
k_values = [],
k_value,
k_config,
k_i, k_cnt;
if (k_success && k_data.config) {
k_config = k_data.config;
k_values = k_config.certificateDnValues;
if (k_values) {
for (k_i = 0, k_cnt = k_values.length; k_i < k_cnt; k_i++) {
k_value = k_values[k_i];
k_certificateValues[k_value.certificate.id] = k_value.value;
}
}
k_config.k_certificateValues = k_certificateValues;
k_config.k_defaultLocalIdValue = k_config.defaultLocalIdValue;
k_config.k_defaultCipherIke = k_config.defaultCipherIke;
k_config.k_defaultCipherEsp = k_config.defaultCipherEsp;
this.k_grid.k_ipsecPeerIdConfig = k_config;
return;
}
this.k_grid.k_ipsecPeerIdConfig = {};
};

k_kerioWidget.k_getBlockedIpv6 = function(k_data, k_success) {
this.k_grid.k_isIpv6Blocked = (k_success && !this.k_grid.k_isLinux && k_data.config.miscSettings.ipv6.blockNative);
};
if (k_kerioWidget.k_isWifiAvailable) {

k_kerioWidget.k_getWifiCountriesCallback = function(k_data, k_success) {
var
WifiBandType = kerio.waw.shared.k_CONSTANTS.WifiBandType,
k_countries = k_data.countries,
k_countriesCnt = k_countries.length,
k_counryIdList = [],
k_countryModeList = {},
k_countryModelChannelList = {},
k_bandValues,
k_channelList,
k_channelListN,
k_autoChannelItem,
k_channelI, k_channelCnt, k_channelObject,
k_band,
k_channelListI, k_channelListCnt,
k_item,
k_countriesI,
k_itemCountry,
k_itemChannel;
if (!this.k_wifiCountries) {
k_bandValues = {};
k_bandValues[WifiBandType.WifiBandA] = {k_value: WifiBandType.WifiBandA, k_name: 'a (5 GHz)' };
k_bandValues[WifiBandType.k_BAND_AN] = {k_value: WifiBandType.k_BAND_AN, k_name: 'a/n (5 GHz)' };
k_bandValues[WifiBandType.WifiBandAC] = { k_value: WifiBandType.WifiBandAC, k_name: 'ac (5 GHz)' }; k_bandValues[WifiBandType.WifiBandBG] = {k_value: WifiBandType.WifiBandBG, k_name: 'b/g (2.4 GHz)' };
k_bandValues[WifiBandType.k_BAND_BGN] = {k_value: WifiBandType.k_BAND_BGN, k_name: 'b/g/n (2.4 GHz)' };
kerio.waw.shared.k_DEFINITIONS.k_bandValues = k_bandValues;
k_autoChannelItem = {k_value: 0, k_name: kerio.lib.k_tr('auto', 'interfaceManageWifiEditor')};
for (k_countriesI = 0; k_countriesI < k_countriesCnt; k_countriesI++) {
k_item = k_countries[k_countriesI];
k_itemCountry = k_item.country;
k_counryIdList.push(k_itemCountry);
k_channelObject = k_item.channels.sort(function(k_first, k_second) {
var
k_DEFINITIONS = kerio.waw.shared.k_DEFINITIONS;
return k_DEFINITIONS.k_bandValues[k_first.band].k_name.localeCompare(k_DEFINITIONS.k_bandValues[k_second.band].k_name);
});
k_channelCnt = k_channelObject.length;
k_countryModeList[k_itemCountry] = [];
k_countryModelChannelList[k_itemCountry] = {};
for (k_channelI = 0; k_channelI < k_channelCnt; k_channelI++) {
k_itemChannel = k_channelObject[k_channelI];
k_band = k_itemChannel.band;
if (k_bandValues[k_band]) {
k_countryModeList[k_itemCountry].push(k_bandValues[k_band]);
}
if (k_band !== WifiBandType.WifiBandAC && k_bandValues[k_band + 'N']) {
k_countryModeList[k_itemCountry].push(k_bandValues[k_bandValues[k_band + 'N'].k_value]);
}
k_channelList = [];
k_channelListN = [];
if (k_band !== WifiBandType.WifiBandAC) {
k_channelList.push(k_autoChannelItem);
k_channelListN.push(k_autoChannelItem);
}
k_channelListCnt = k_itemChannel.channels.length;
for (k_channelListI = 0; k_channelListI < k_channelListCnt; k_channelListI++) {
k_channelList.push({k_value: k_itemChannel.channels[k_channelListI].value, k_name: k_itemChannel.channels[k_channelListI].name});
k_channelListN.push({k_value: k_itemChannel.channels[k_channelListI].value, k_name: k_itemChannel.channels[k_channelListI].name80211n});
}
if (k_bandValues[k_band]) {
k_countryModelChannelList[k_itemCountry][k_band] = k_channelList;
}
if (k_band !== WifiBandType.WifiBandAC && k_bandValues[k_band + 'N']) {
k_countryModelChannelList[k_itemCountry][k_bandValues[k_band + 'N'].k_value] = k_channelListN;
}
}
}
this.k_wifiCountries = {
k_counryIdList: k_counryIdList,
k_countryModeList: k_countryModeList,
k_countryModelChannelList: k_countryModelChannelList
};
}
};
k_kerioWidget.k_getWifiConfigCallback = function(k_data, k_success) {
if (k_success) {
this.k_wifiConfig = k_data;
}
};
k_kerioWidget.k_updateWifiConfig = function(k_wifiConfig) {
this.k_wifiConfig = k_wifiConfig;
};
}
if (k_kerioWidget.k_isLinux) {

k_kerioWidget.k_getPortsCallback = function(k_data, k_success) {
var
k_ports = [],
k_portListMapped = [],
k_port,
k_i, k_cnt;
if (k_success) {
k_ports = k_data.list || [];
for (k_i = 0, k_cnt = k_ports.length; k_i < k_cnt; k_i++) {
k_port = k_ports[k_i];
k_portListMapped[k_port.id] = k_port;
}
}
this.k_portListMapped = k_portListMapped;
this.k_portList = k_ports;
};
}

k_kerioWidget.k_loadDataCallback = function(k_data, k_success) {
if (!k_success) {
return;
}
this.k_reloadData();
kerio.adm.k_framework.k_enableApplyReset(false);
this.k_autorefreshStart = new Date(); };

k_kerioWidget.k_advancedEditorCallback = function(k_data) {
kerio.waw.shared.k_methods.k_mergeObjects(k_data, this.k_dataStore);
};

k_kerioWidget.k_updatePortAssignment = function() {
this.k_applyParams.defer(1, this);
return true;
};


k_kerioWidget.k_grid.k_applyResetCallback = function(k_response, k_success, k_params) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
if (!this.k_baseWidget.k_batchSuccess || !kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
this.k_baseWidget.k_batchSuccess = k_success;
return;
}
kerio.waw.shared.k_methods.k_updateDataStore('k_outgoingInterfaces');
kerio.waw.shared.k_methods.k_updateDataStore('k_ethernetAndRasInterfaces');
kerio.waw.shared.k_methods.k_updateDataStore('k_internetInterfaces');
kerio.waw.shared.k_methods.k_updateDataStore('k_vpnTunnels');
kerio.waw.shared.k_methods.k_updateDataStore('k_dhcpScopesList');
if (this.k_isLinux) {
kerio.waw.shared.k_methods.k_updateDataStore('k_ethernetInterfaces');
}
this.k_baseWidget.k_batchSuccess = true;
kerio.adm.k_framework.k_enableApplyReset(false);
if (k_params && k_params.k_isApply) {
kerio.waw.shared.k_methods.k_productInfo.k_getWarnings({
k_callback: this.k_getWarningsCallback,
k_scope: this
});
}
else {
if (kerio.waw.shared.k_methods.k_processUserClick()) {
this.k_baseWidget.k_loadData();
}
}
};

k_kerioWidget.k_grid.k_findExistingGroups = function() {
var
k_index,
k_lastValue,
k_currentValue,
k_COLUMN_ID_GROUP = this.k_COLUMN_ID_GROUP,
k_gridData = this.k_getData(),
k_cntDataRecords = this.k_getRowsCount(),
k_foundValues = [];
if (0 === k_cntDataRecords) {
return k_foundValues;
}
k_lastValue = undefined; for (k_index = 0; k_index < k_cntDataRecords; k_index++) {
k_currentValue = k_gridData[k_index][k_COLUMN_ID_GROUP];
if (k_lastValue !== k_currentValue) {
k_lastValue = k_currentValue;
k_foundValues[k_lastValue] = {
k_value: k_lastValue,
k_index: k_index
};
}
}
return k_foundValues;
};

k_kerioWidget.k_grid.k_mergeEmptyGroups = function(k_emptyGroups, k_pendingEmptyGroups, k_groupIndex) {
k_pendingEmptyGroups = k_pendingEmptyGroups || [];
var
k_indexPendingGroup,
k_cntPendingGroup = k_pendingEmptyGroups.length;
if (0 === k_cntPendingGroup) {
return false;
}
for (k_indexPendingGroup = 0; k_indexPendingGroup < k_cntPendingGroup; k_indexPendingGroup++) {
k_emptyGroups.push({
k_index: k_groupIndex + k_indexPendingGroup,
k_groupType: k_pendingEmptyGroups[k_indexPendingGroup]
});
}
return true;
};

k_kerioWidget.k_grid.k_completeInterfaceGroupList = function(k_sortDirection) {
var
k_grid = this,
InterfaceGroupType = k_grid.InterfaceGroupType,
k_constGroupTypeVpn = InterfaceGroupType.Vpn,
k_SUPPORTED_INTERFACE_GROUP_LIST = k_grid.k_SUPPORTED_INTERFACE_GROUP_LIST,
k_emptyGroupData = k_grid.k_emptyGroupData,
k_emptyGroups = [],
k_pendingEmptyGroups = [],
k_currentGroup, k_currentGroupType,
k_indexEmptyGroup, k_cntEmptyGroup,
k_indexSupportedGroup, k_cntSupportedGroup,
k_existingGroups,
k_offset;
k_existingGroups = k_grid.k_findExistingGroups();
for (k_indexSupportedGroup = 0, k_cntSupportedGroup = k_SUPPORTED_INTERFACE_GROUP_LIST.length; k_indexSupportedGroup < k_cntSupportedGroup; k_indexSupportedGroup++) {
k_currentGroupType = k_SUPPORTED_INTERFACE_GROUP_LIST[k_indexSupportedGroup];
k_currentGroup = k_existingGroups[k_currentGroupType];
if (undefined !== k_currentGroup) {
if (k_grid.k_mergeEmptyGroups(k_emptyGroups, k_pendingEmptyGroups, k_currentGroup.k_index)) {
k_pendingEmptyGroups = [];
}
}
else {
k_pendingEmptyGroups.push(k_currentGroupType);
}
}
k_grid.k_mergeEmptyGroups(k_emptyGroups, k_pendingEmptyGroups, k_grid.k_getRowsCount() + k_emptyGroups.length);
k_offset = 0;
for (k_indexEmptyGroup = 0, k_cntEmptyGroup = k_emptyGroups.length; k_indexEmptyGroup < k_cntEmptyGroup; k_indexEmptyGroup++) {
k_currentGroup = k_emptyGroups[k_indexEmptyGroup];
k_currentGroupType = k_currentGroup.k_groupType;
if (k_constGroupTypeVpn === k_currentGroupType) {
k_offset++;
continue; }
k_grid.k_addRow(k_emptyGroupData[k_currentGroupType], k_currentGroup.k_index + k_indexEmptyGroup + k_offset);
}
};


k_kerioWidget.k_showLlbWarning = function(k_response, k_success) {
if (k_success) {
this.k_grid.k_warningMessages.k_llbWarning = (-1 < k_response.warnings.indexOf(kerio.waw.shared.k_CONSTANTS.NotificationType.k_LLB));
this.k_grid.k_showWarnings();
} };

k_kerioWidget.k_grid.k_getWarningsCallback = function(k_warnings) {
var
k_found = false,
NotificationLlb = kerio.waw.shared.k_CONSTANTS.NotificationType.k_LLB,
k_i, k_cnt;
if (k_warnings && k_warnings.length) {
for (k_i = 0, k_cnt = k_warnings.length; k_i < k_cnt; k_i++) {
if (NotificationLlb === k_warnings[k_i].type) {
k_warnings[0] = k_warnings[k_i]; k_warnings.splice(1);            k_found = true;
break;
}
}
}
if (!k_found) { if (kerio.waw.shared.k_methods.k_processUserClick()) {
this.k_baseWidget.k_loadData();
}
} return k_found; };

k_kerioWidget.k_grid.k_showCollisionWarning = function(k_response, k_success) {
if (!k_success) {
return;
}
var
k_VpnServer = 'VpnServer',
k_warningMessages = this.k_warningMessages,
k_collisions = k_response.collisions,
k_id,
k_i, k_cnt, k_collision;
for (k_i in k_warningMessages) {
if (0 === k_i.indexOf('k_collision')) { delete k_warningMessages[k_i];
}
} for (k_i = 0, k_cnt = k_collisions.length; k_i < k_cnt; k_i++) {
k_collision = k_collisions[k_i];
if (-1 < k_collision.indexOf(k_VpnServer)) { k_collision.remove(k_VpnServer);
k_id = 'k_collision' + '-' + k_VpnServer;
k_warningMessages[k_id] = k_warningMessages[k_id] || []; k_warningMessages[k_id] = k_warningMessages[k_id].concat(k_collision);
}
else {
k_id = 'k_collision' + '-' + k_collision.join('-');
k_warningMessages[k_id] = k_collision;
}
} this.k_showWarnings(k_id);
};

k_kerioWidget.k_grid.k_setWarning = function(k_id, k_result) {
if (k_result) {
this.k_warningMessages[k_id] = k_result.errorMessage;
this.k_showWarnings(k_id); }
else {
delete this.k_warningMessages[k_id];
this.k_showWarnings(); }
};

k_kerioWidget.k_grid.k_showWarnings = function(k_id) {
var
k_statusbar = this.k_statusbar,
k_messages = this.k_warningMessages,
k_dedicatedWarnings = this.k_dedicatedWarnings,
k_message;
if (!k_id || !k_messages[k_id]) {
for (k_id in k_messages) {
if (('string' === typeof k_messages[k_id] && '' !== k_messages[k_id])
|| (0 === k_id.indexOf('k_collision'))
|| ('object' === typeof k_messages[k_id] && 'string' === typeof k_messages[k_id].message)) {
break; }
}
}
k_message = k_messages[k_id];
if (0 === k_id.indexOf('k_collision')) {
k_statusbar._k_lastCollisionId = k_id;
k_statusbar.k_switchConfig('k_collision');
}
else if (k_dedicatedWarnings[k_id]) { if (k_message) {
k_statusbar.k_switchConfig(k_dedicatedWarnings[k_id]);
}
else {
k_statusbar.k_setVisible(false);
}
}
else if ('string' === typeof k_message){
k_statusbar.k_switchConfig('k_warning');
k_statusbar.k_setText(k_message);
}
else if (k_messages && (k_messages.code || k_messages.errorMessage || k_messages.message)) {
k_statusbar.k_switchConfig('k_warning');
k_statusbar.k_setText(kerio.waw.shared.k_methods.k_translateErrorMessage(k_message));
}
else { k_statusbar.k_setVisible(false);
}
};

k_kerioWidget.k_grid.k_showCollisionDetails = function(k_id) {
var
k_shared = kerio.waw.shared,
InterfaceType = k_shared.k_CONSTANTS.InterfaceType,
k_formatInterfaceName = k_shared.k_methods.k_formatInterfaceName,
k_details = this.k_warningMessages[k_id],
k_data = this.k_getData(),
k_names = [],
k_message = '',
k_isVpnServer = (-1 < k_id.indexOf('VpnServer')), k_ip,
k_i, k_j,
k_cnt,
k_interfaceCnt,
k_interfaceId,
k_interface;
for (k_i = 0, k_cnt = k_details.length; k_i < k_cnt; k_i++) {
k_interfaceId = k_details[k_i];
for (k_j = 0, k_interfaceCnt = k_data.length; k_j < k_interfaceCnt; k_j++) {
k_interface = k_data[k_j];
if (k_isVpnServer && InterfaceType.VpnServer === k_interface.type) { k_ip = k_interface.server.network + '/' + k_interface.server.mask;
}
if (k_interfaceId !== k_interface.id) {
continue;
}
k_names.push(k_formatInterfaceName(k_interface.name, k_interface).k_data);
if (!k_isVpnServer) { k_ip = k_interface.ip;
}
break; }
}
if (k_isVpnServer && !k_ip) { for (k_i = 0, k_cnt = k_data.length; k_i < k_cnt; k_i++) { if (InterfaceType.VpnServer === k_data[k_i].type) { k_ip = k_data[k_i].server.network + '/' + k_data[k_i].server.mask;
break; }
}
}
if (k_isVpnServer) {
k_message = kerio.lib.k_tr("Following interfaces' IP addresses collide with VPN server's network of %1:", 'interfaceList', { k_args: [k_ip] });
}
else {
k_message = kerio.lib.k_tr('The following interfaces use the same IP address.', 'interfaceList');
}
k_message += '<br><br>' + k_names.join('<br>');
kerio.lib.k_alert({
k_title: kerio.lib.k_tr('IP Address Collision', 'interfaceList'),
k_msg: k_message,
k_icon: 'warning'
});
};


k_kerioWidget.k_grid.k_dialHang = function() {
var
k_data,
k_flags,
k_oldLinkStatus,
k_action;
if (0 === this.k_selectionStatus.k_selectedRowsCount) {
return;
}
k_data = this.k_selectionStatus.k_rows[0].k_data;
k_flags = k_data.flags;
k_oldLinkStatus = k_data.linkStatus;
this.k_toolbars.k_bottom.k_disableItem('k_btnDialHang'); if (k_flags.dialable) {
k_action = 'dial';
}
else if (k_flags.hangable) {
k_action = 'hangup';
}
else {
return; }
kerio.waw.requests.k_sendBatch({
k_jsonRpc: {
method: 'Interfaces' + '.' + k_action,
params: {id: k_data.id}
},
k_scope: this,
k_callback: this.k_dialHangCallback,
k_callbackParams: {
k_linkStatus: k_oldLinkStatus,
k_rasId: k_data.id,
k_rasName: k_data.name
}
});
};

k_kerioWidget.k_grid.k_dialHangCallback = function() {
this.k_autorefreshStart = new Date(); };

k_kerioWidget.k_grid.k_runWizard = function() {
if (kerio.waw.status.k_currentScreen.k_isContentChanged()) {
kerio.waw.status.k_currentScreen.k_showContentChangedAlert();
return;
}
kerio.lib.k_ui.k_showDialog({k_sourceName: 'connectivityWizard', k_params: { k_parentGrid: this}});
};

k_kerioWidget.k_grid.k_removeItem = function(k_item) {
kerio.waw.requests.k_sendBatch({
k_jsonRpc: {
method: 'Interfaces.remove',
params: {
ids: [ k_item ]
}
},
k_callback: this.k_removeItemCallback,
k_scope: this
});
};

k_kerioWidget.k_grid.k_removeItemCallback = function(k_response, k_success) {
if (k_success && kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
this.k_removeSelectedRows();
kerio.adm.k_framework.k_enableApplyReset();
}
};

k_kerioWidget.k_grid.k_prepareAutorefresh = function() {
var k_taskId = this.k_autorefreshTaskId;
this.k_autorefreshRequest = [
{
k_jsonRpc: { method: 'Interfaces.reset' } },
{
k_jsonRpc: {
method: 'Interfaces.get',
params: {
sortByGroup: true,
query: {
start: 0,
limit: -1,
orderBy: [ {
columnName: 'name',
direction: this.k_ASC
}]
}
}
},
k_scope: this,
k_callbackParams: {
k_grid: this,
k_taskId: k_taskId
},
k_callback: this.k_autorefreshCallback
}
];
this.k_tasks.k_add({
k_id: k_taskId,
k_interval: 1000,
k_params: [ this, {} ], k_run: this.k_autorefresh
});
};

k_kerioWidget.k_grid.k_autorefresh = function(k_grid, k_store) {
var
k_autorefreshLength = Math.floor(((new Date()) - k_grid.k_autorefreshStart) / 1000),
k_refreshNow = false;
if ('k_admDesktop' !== kerio.waw.shared.k_methods._k_getMainScreen().k_id || kerio.adm.k_framework.k_isScreenChanged()) {                       return true;                                                          }
if (0 === k_grid.k_getRowsCount() || k_grid.k_isDragging()) {
return true; }
if (120 < k_autorefreshLength) { k_refreshNow = (0 === k_autorefreshLength % 30); }
else if (30 < k_autorefreshLength) { k_refreshNow = (0 === k_autorefreshLength % 10); }
else { k_refreshNow = (0 === k_autorefreshLength % 2); }
if (k_store.k_postpone) {
k_store.k_postpone = false;
k_refreshNow = true;
}
else if (!k_refreshNow) {
return true; }
if (kerio.waw.requests.k_isRequestPending()) {
k_store.k_postpone = true;
return true;
}
kerio.waw.requests.k_sendBatch(k_grid.k_autorefreshRequest, { k_mask: false, k_isSilent: true });
k_grid.k_pendingAutorefreshRequest = true;
return false; };

k_kerioWidget.k_grid.k_autorefreshCallback = function(k_response, k_success, k_params) {
var
k_grid = k_params.k_grid,
k_gridData = k_grid.k_getData(),
k_newData, k_newDataCnt,
k_i, k_j, k_gridDataCnt,
k_gridDataItem,
k_newDataItem;
if (k_success && k_grid.k_pendingAutorefreshRequest && !k_grid.k_isDragging()) {
k_newData = k_response.list;
k_gridDataCnt = k_gridData.length;

for (k_i = 0; k_i < k_gridDataCnt; k_i++) {
k_gridDataItem = k_gridData[k_i];
if (k_gridData[k_i].type === k_grid.InterfaceType.k_EMPTY) {
continue;
}
for (k_j = 0, k_newDataCnt = k_newData.length; k_j < k_newDataCnt; k_j++) {
k_newDataItem = k_newData[k_j];
if (k_gridDataItem.id === k_newDataItem.id) {
if (k_gridDataItem.group !== k_newDataItem.group) {
delete k_newDataItem.group; 
}
k_grid.k_updateRow(k_newDataItem, k_i);
k_newData.splice(k_j, 1); break; }
}
}
}
delete k_grid.k_pendingAutorefreshRequest;
this.k_tasks.k_resume(k_params.k_taskId, true);
};

k_kerioWidget.k_grid.k_select = function(k_rowData) {
this.k_selectRows(this.k_findRow('id', k_rowData.id));
};

}, 

k_renderIpv4Address: function(k_value, k_data) {
var
k_ip = '',
k_list = [],
k_WAW_METHODS,
k_i, k_cnt;
k_data = k_data || {};
if (this.InterfaceType.VpnServer === k_data.type) { k_WAW_METHODS = kerio.waw.shared.k_methods;
if (k_data.ip && k_data.status === kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_StoreStatusClean) {
k_ip = k_data.ip;      }
else if (k_data.server) {  if (k_WAW_METHODS.k_validateNetwork(k_data.server.network, k_data.server.mask)) {
k_ip = k_WAW_METHODS.k_parseIp(k_data.server.network);
k_ip[3] += 1;
k_ip = k_ip.join('.');
} }
k_list.push(this.k_trVpnNetwork + k_WAW_METHODS.k_formatIpAddress(k_data.server.network, k_data.server.mask));
k_list.push(this.k_trVpnAddress + (k_data.ip || ''));
}
else if (this.InterfaceType.VpnTunnel === k_data.type) {
k_ip = ''; }
else if (!k_data.ip4Enabled) {
k_ip = this.k_trDisabledIpv4;
}
else {
k_value = this.k_formatIpAddress(k_value);
k_ip = k_value;
k_list = [ k_value ];
if (k_data.secondaryAddresses) {
for (k_i = 0, k_cnt = k_data.secondaryAddresses.length; k_i < k_cnt; k_i++) {
k_list.push(this.k_formatIpAddress(k_data.secondaryAddresses[k_i].ip)); } }
}
return {
k_data: k_ip || '',
k_dataTooltip: k_list.join('<br>'),
k_isSecure: true
};
},

k_renderIpv6Address: function(k_value, k_data) {
var
k_ip = '',
k_list = [],
k_i, k_cnt;
if (k_data && (this.InterfaceType.VpnServer === k_data.type || this.InterfaceType.VpnTunnel === k_data.type)) {
}
else if (k_data && !k_data.ip6Enabled) {
k_ip = this.k_trDisabledIpv6;
}
else if (k_data && this.InterfaceModeLinkLocal === k_data.ip6Mode) {
k_value = this.k_formatIpAddress(k_data.linkIp6Address);
k_ip = k_value;
k_list = [k_value];
}
else if (k_value && Array === k_value.constructor) {
if (0 < k_value.length) {
k_ip = this.k_formatIpAddress(k_value[0].ip);           for (k_i = 0, k_cnt = k_value.length; k_i < k_cnt; k_i++) {
k_list.push(this.k_formatIpAddress(k_value[k_i]));  } } }
else {
k_ip = this.k_formatIpAddress(k_value.ip);
k_list = [ this.k_formatIpAddress(k_value) ];
}
return {
k_data: k_ip,
k_dataTooltip: k_list.join('<br>'),
k_isSecure: true
};
},

k_renderIpv4ComplementaryAddress: function(k_value, k_data) {
if (k_data && (!k_data.ip4Enabled || this.InterfaceType.VpnServer === k_data.type || this.InterfaceType.VpnTunnel === k_data.type)) {
k_value = ''; }
else {
k_value = this.k_formatIpAddress(k_value, false);
}
return {
k_data: k_value,
k_dataTooltip: k_value
};
},

k_renderIpv6ComplementaryAddress: function(k_value, k_data) {
if (k_data && (!k_data.ip6Enabled || this.InterfaceType.VpnServer === k_data.type || this.InterfaceType.VpnTunnel === k_data.type)) {
k_value = ''; }
else {
k_value = this.k_formatIpAddress(k_value, false);
}
return {
k_data: k_value,
k_dataTooltip: k_value
};
},

k_renderIpv6PrefixLength: function(k_value, k_data) {
if (k_data && (!k_data.ip6Enabled || !k_data.ip6Addresses || this.InterfaceType.VpnServer === k_data.type || this.InterfaceType.VpnTunnel === k_data.type)) {
k_value = ''; }
else {
k_value = k_data.ip6Addresses[0] || {};
k_value = k_value.prefixLength || '';
}
return {
k_data: k_value
};
},

k_renderDetails: function (k_value, k_rowData) {
if (undefined === k_value) {
return {
k_data: ''
};
}

var
k_shared = kerio.waw.shared,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_DELETED_CERTIFICATE = k_shared.k_DEFINITIONS.k_CERTIFICATE_GRID_TRANSLATIONS.k_DELETED,
k_iconCls = '',
k_renderer = false,
k_ipsecCertificate, k_vpnCertificate,
k_certificate,
k_message;
if (k_value.localizable && k_value.localizableMessage && k_value.localizableMessage.message) { k_message = kerio.waw.shared.k_methods.k_translateErrorMessage(k_value.localizableMessage);
} else {
k_message = k_value.fixedMessage;
}
if (kerio.waw.shared.k_methods.k_isSwitchEmpty(k_rowData)) {
return {
k_data: this.k_trNoPortsAssigned,
k_dataTooltip: this.k_trNoPortsAssigned
};
}
if (k_WAW_CONSTANTS.InterfaceType.VpnServer === k_rowData.type && k_rowData.enabled && (k_rowData.server.ipsecVpnEnabled || k_rowData.server.kerioVpnEnabled)) {
k_ipsecCertificate = kerio.waw.shared.k_methods.k_renderers.k_renderCertificate(k_rowData.server.ipsecVpnCertificate, true, true);
if ((k_ipsecCertificate && k_shared.k_DEFINITIONS.k_CERTIFICATE_GRID_TRANSLATIONS.k_DELETED !== k_ipsecCertificate.k_data) || !k_ipsecCertificate) {
k_vpnCertificate = kerio.waw.shared.k_methods.k_renderers.k_renderCertificate(k_rowData.server.kerioVpnCertificate, true, true);
if (k_shared.k_DEFINITIONS.k_CERTIFICATE_GRID_TRANSLATIONS.k_DELETED === k_vpnCertificate.k_data) {
k_renderer = k_vpnCertificate;
}
else {
k_renderer = k_ipsecCertificate || k_vpnCertificate;
}
}
else {
k_renderer = k_ipsecCertificate;
}
}
else if (k_WAW_CONSTANTS.InterfaceType.VpnTunnel === k_rowData.type && k_WAW_CONSTANTS.VpnType.VpnIpsec === k_rowData.tunnel.type && k_rowData.tunnel.certificate && !k_rowData.tunnel.psk.enabled) {
k_certificate = k_rowData.tunnel.certificate;
if ('' !== k_certificate.id) {
k_renderer = kerio.waw.shared.k_methods.k_renderers.k_renderCertificate(k_rowData.tunnel.certificate, true, true);
}
}
if (k_renderer && k_DELETED_CERTIFICATE === k_renderer.k_data) {
this.k_statusbar.k_switchConfig('k_invalidCertificate');
return k_renderer;
}
if (k_WAW_CONSTANTS.InterfaceType.VpnServer === k_rowData.type            && k_WAW_CONSTANTS.InterfaceStatusType.Down === k_rowData.linkStatus  && true === k_rowData.enabled ) {                                            if (!this.k_statusbar.k_isVisible()) { this.k_statusbar.k_switchConfig('k_warning'); this.k_statusbar.k_setText(k_message);
}
}
return {
k_data: k_message,
k_dataTooltip: k_message,
k_iconCls: k_iconCls
};
},

k_renderStatus: function (k_value) {
k_value = this.k_INTERFACE_STATUS_MAPPED[k_value];
return {
k_data: k_value,
k_dataTooltip: k_value
};
},

k_renderConnectivity: function (k_value, k_data) {
var
ConnectivityType = this.ConnectivityType,
k_connectivityType = this.k_connectivityType;
if ((k_data.group !== this.Internet) || (ConnectivityType.Persistent === k_connectivityType)
|| (undefined === k_value)) {
return { k_data: '' };
}
switch (k_connectivityType) {
case ConnectivityType.DialOnDemand:
return {
k_data: (k_value.onDemand ? this.k_msgDialOnDemand : '')
};
case ConnectivityType.Failover:
return {
k_data: this.k_FAILOVER_ROLES_MAPPED[k_value.failoverRole]
};
case ConnectivityType.LoadBalancing:
return { k_data: (k_value.loadBalancingWeight.enabled)
? kerio.lib.k_tr('Weight: %1', 'interfaceList',
{ k_args: [ k_value.loadBalancingWeight.value ]})
: ''
};
}
return { k_data: ''
};
},
k_renderMacAddress: function(k_value) {
k_value = kerio.waw.shared.k_methods.k_formatMacAddress(k_value);
return {
k_data: k_value,
k_dataTooltip: k_value
};
}
}; 