
kerio.waw.ui.vpnClientsList = {

k_init: function(k_objectName) {
var
k_tr = kerio.lib.k_tr,
k_shared = kerio.waw.shared,
k_CONNECTION_STATES = k_shared.k_CONSTANTS.VpnClientState,
k_paneCfg,
k_states = [],
k_connectionsPane,
k_columns;
k_paneCfg ={
k_type: 'VpnClients',
k_gridCfg: {}
};
k_columns = {
k_sorting: {
k_columnId: 'userName'
},
k_items: [
{
k_columnId: 'id',
k_isDataOnly: true
},
{
k_columnId: 'userName',
k_caption: k_tr('Username', 'common'),
k_width: 180,

k_renderer: function(k_value) {
return {
k_data: k_value,
k_iconCls: 'userIcon'
};
}},
{
k_columnId: 'type',
k_caption: k_tr('Tunnel Type', 'vpnClientsList'),
k_width: 100,
k_renderer: function(k_value, k_data) {
var
k_tr = kerio.lib.k_tr,
k_iconCls,
k_text;
k_iconCls = 'interfaceIcon';
if (kerio.waw.shared.k_CONSTANTS.VpnType.VpnIpsec === k_value) {
k_text = k_tr('IPsec', 'common');
k_iconCls += ' interfaceIpsecTunnel';
}
else {
k_text = k_tr('Kerio VPN', 'common');
k_iconCls += ' interfaceVpnTunnel';
}
return {
k_data: k_text,
k_iconCls: k_iconCls
};
}
},
{
k_columnId: 'osCode',
k_isDataOnly: true
},
{
k_columnId: 'osName',
k_caption: k_tr('Operating System', 'vpnClientsList'),
k_width: 150,

k_renderer: function(k_value, k_data) {
var
OsCodeType =  this.OsCodeType,
k_iconCls = 'systemIcon ';
switch (k_data.osCode) {
case OsCodeType.OsWindows:
k_iconCls += 'windows';
break;
case OsCodeType.OsLinux:
k_iconCls += 'linux';
break;
case OsCodeType.OsMacos:
k_iconCls += 'macos';
break;
default:k_iconCls += 'unknown';
}
return {
k_data: k_value,
k_iconCls: k_iconCls
};
}
},
{
k_columnId: 'hostName',
k_caption: k_tr('Hostname', 'common'),
k_width: 170
},
{
k_columnId: 'clientIp',
k_caption: k_tr('Client IP', 'vpnClientsList')
},
{
k_columnId: 'loginTime',
k_caption: k_tr('Login Time', 'vpnClientsList'),
k_width: 80,

k_renderer: function(k_value, k_data) {
this.k_timeObject.sec = k_value;
return {
k_data: kerio.waw.shared.k_methods.k_formatElapsedTime(this.k_timeObject)
};
}
},
{
k_columnId: 'version',
k_caption: k_tr('Version', 'vpnClientsList'),
k_isHidden: true
},
{
k_columnId: 'ip',
k_caption: k_tr('IP Address', 'common'),
k_isHidden: true
},
{
k_columnId: 'state',
k_caption: k_tr('Status', 'common'),
k_isHidden: true,

k_renderer: function(k_value) {
return {
k_data: this.k_states[k_value]
};
}
}
]}; k_paneCfg.k_gridCfg.k_columns = k_columns;
k_connectionsPane = new k_shared.k_widgets.K_ConnectionsPane(k_objectName, k_paneCfg);
k_states[k_CONNECTION_STATES.VpnClientConnecting] = k_tr('Connecting', 'vpnClientsList');
k_states[k_CONNECTION_STATES.VpnClientAuthenticating] = k_tr('Authenticating', 'vpnClientsList');
k_states[k_CONNECTION_STATES.VpnClientAuthenticated] = k_tr('Authenticated', 'vpnClientsList');
k_states[k_CONNECTION_STATES.VpnClientConnected] = k_tr('Connected', 'vpnClientsList');
k_states[k_CONNECTION_STATES.VpnClientOther] = k_tr('Other', 'vpnClientsList');
k_connectionsPane.k_grid.k_addReferences({
k_states: k_states,
OsCodeType: k_shared.k_CONSTANTS.OsCodeType
});
this.k_addControllers(k_connectionsPane);
k_connectionsPane.k_grid.k_statusbar.k_setVisible(false);
return k_connectionsPane;
},
k_addControllers: function(k_kerioWidget){
k_kerioWidget.k_applyParams = function() {
if (kerio.waw.shared.k_methods.k_isApplyParamsCalledFromLeaveScreenCallback()) {
return;
}
this.k_grid.k_forceRefresh = true;
this.k_grid.k_reloadData();
kerio.waw.requests.k_sendBatch({
k_jsonRpc: {
method: 'Interfaces.get',
params: {
sortByGroup: true,
query: {
conditions: kerio.waw.shared.k_DEFINITIONS.k_get('k_searchCondition', [{
k_fieldName: 'type',
k_value: kerio.waw.shared.k_CONSTANTS.InterfaceType.VpnServer,
k_match: true
}])
}
}
},
k_callback: this.k_getVpnServerCallback,
k_scope: this
});
};

k_kerioWidget.k_getVpnServerCallback = function(k_response, k_success) {
var
k_vpnServer,
k_isRunning = true; if (k_success) {
k_vpnServer = k_response.list[0];
k_isRunning = (k_vpnServer && k_vpnServer.enabled && k_vpnServer.linkStatus === kerio.waw.shared.k_CONSTANTS.InterfaceStatusType.Up);
}
this.k_grid.k_statusbar.k_setVisible(!k_isRunning);
};
}};