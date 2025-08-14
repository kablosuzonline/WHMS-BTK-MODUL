
kerio.waw.ui.tileActiveHosts = {
k_init: function(k_objectName, k_initParams) {
var
k_shared = kerio.waw.shared,
k_localNamespace = k_objectName + '_',
k_tr = kerio.lib.k_tr,
kerio_web_SharedConstants = k_shared.k_CONSTANTS.kerio_web_SharedConstants,
k_form, k_formCfg,
k_topDownloadersTable,
k_topUploadersTable;
if (!kerio.waw.shared.k_data.k_dashboardConnectivityData) {
kerio.waw.ui.tileConnectivity.k_initSharedHandler();
}
k_topDownloadersTable = new k_shared.k_widgets.K_CommonTable(
k_localNamespace + 'k_topDownloaders',
{
k_headers: [
{
k_caption: '',
k_width: '40%'
},
{
k_caption: '',
k_width: '30%'
},
{
k_caption: '',
k_colspan: 2,
k_width: '120px',
k_className: 'alignRight'
},
{
k_caption: ''
}
],
k_columnClasses: [
{
k_id: 2,
k_className: 'alignRight'
},
{
k_id: 3,
k_className: 'kbPerSec alignRight'
}
]
}
);
k_topUploadersTable = new k_shared.k_widgets.K_CommonTable(
k_localNamespace + 'k_topUploaders',
{
k_headers: [
{
k_caption: '',
k_width: '40%'
},
{
k_caption: '',
k_width: '30%'
},
{
k_caption: '',
k_colspan: 2,
k_width: '120px',
k_className: 'alignRight'
},
{
k_caption: ''
}
],
k_columnClasses: [
{
k_id: 2,
k_className: 'alignRight'
},
{
k_id: 3,
k_className: 'kbPerSec alignRight'
}
]
}
);
k_formCfg = {
k_className: 'activeHosts line',
k_labelWidth: 1,
k_isLabelHidden: true,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_row',
k_className: 'header',
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_width: 110,
k_value: k_tr('Download', 'tileActiveHosts'),
k_isLabelHidden: true
},
{
k_type: 'k_display',
k_isSecure: true,
k_value: '<a style="font-size: 9px;">' + k_tr('Show on Active Hosts', 'tileActiveHosts') + '</a>',
k_isLabelHidden: true,
k_onLinkClick: function(k_form) {
k_form.k_tile.k_extWidget.removeClass.defer(100, k_form.k_tile.k_extWidget, ['mouseover']);
kerio.waw.status.k_currentScreen.k_switchPage('activeHosts', { k_sortBy: 'currentDownload', k_reverse: true});
}
}
]
},
{
k_type: 'k_container',
k_height: 100,
k_content: k_topDownloadersTable
},
{
k_type: 'k_row',
k_style: 'padding-top: 15px',
k_className: 'header',
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_width: 110,
k_value: k_tr('Upload', 'tileActiveHosts'),
k_isLabelHidden: true
},
{
k_type: 'k_display',
k_isSecure: true,
k_value: '<a style="font-size: 9px;">' + k_tr('Show on Active Hosts', 'tileActiveHosts') + '</a>',
k_isLabelHidden: true,
k_onLinkClick: function(k_form) {
k_form.k_tile.k_extWidget.removeClass.defer(100, k_form.k_tile.k_extWidget, ['mouseover']);
kerio.waw.status.k_currentScreen.k_switchPage('activeHosts', { k_sortBy: 'currentUpload', k_reverse: true});
}
}
]
},
{
k_type: 'k_container',
k_height: 100,
k_content: k_topUploadersTable
}
],
k_tile: k_initParams.k_tile,
k_settings: {
k_items: [
{
k_caption: k_tr('Go to Active Hosts', 'tileActiveHosts'),
k_onClick: function() {
kerio.waw.status.k_currentScreen.k_switchPage('activeHosts');
}
}
]
},
k_initTile: function() {
kerio.waw.shared.k_data.k_dashboardConnectivityData.k_registerTile(this);
this.k_loadData();
},
k_loadData: function() {
kerio.waw.shared.k_data.k_dashboardConnectivityData.k_refreshData(); },
k_loadDataCallback: function(k_response, k_success) {
if (!k_success) {
return; }
var
k_encode = kerio.lib.k_htmlEncode,
kerio_web_SharedConstants = this.kerio_web_SharedConstants,
k_usedByteUnitMapped = this.k_usedByteUnitMapped,
k_createReferencedUserName = this.k_createReferencedUserName,
k_formatDataUnits = kerio.waw.shared.k_methods.k_formatDataUnits,
k_buildTooltip = kerio.lib.k_buildTooltip,
k_downloaders = k_response[0].list,
k_downloadersCnt = k_downloaders.length,
k_uploaders = k_response[1].list,
k_uploadersCnt = k_uploaders.length,
k_topDownloadersTable = this.k_topDownloadersTable,
k_topUploadersTable = this.k_topUploadersTable,
k_download,
k_upload,
k_i, k_item;
for (k_i = 0; k_i < k_downloadersCnt; k_i++) {
k_item = k_downloaders[k_i];
k_download = k_formatDataUnits({ k_value: k_item.currentDownload, k_units: kerio_web_SharedConstants.kerio_web_KiloBytes, k_outputUnits: kerio_web_SharedConstants.kerio_web_KiloBytes, k_isInTime: true, k_numberFormat: {k_decimalPlaces: 0}});
k_topDownloadersTable.k_appendRow(
[
k_encode(k_item.hostname),
k_item.user.id ? k_encode(k_createReferencedUserName(k_item.user).k_userName) : '',
['<span ',k_buildTooltip(k_download.k_tooltipString),'>',k_download.k_formatedValue,'</span>'].join(''),
['<span ',k_buildTooltip(k_download.k_tooltipString),'>',k_download.k_unitString,'</span>'].join(''),
''
]
);
}
k_topDownloadersTable.k_showData();
for (k_i = 0; k_i < k_uploadersCnt; k_i++) {
k_item = k_uploaders[k_i];
k_upload = k_formatDataUnits({ k_value: k_item.currentUpload, k_units: kerio_web_SharedConstants.kerio_web_KiloBytes, k_outputUnits: kerio_web_SharedConstants.kerio_web_KiloBytes, k_isInTime: true, k_numberFormat: {k_decimalPlaces: 0}});
k_topUploadersTable.k_appendRow(
[
k_encode(k_item.hostname),
k_item.user.id ? k_encode(k_createReferencedUserName(k_item.user).k_userName) : '',
['<span ',k_buildTooltip(k_upload.k_tooltipString),'>',k_upload.k_formatedValue,'</span>'].join(''),
['<span ',k_buildTooltip(k_upload.k_tooltipString),'>',k_upload.k_unitString,'</span>'].join(''),
''
]
);
}
k_topUploadersTable.k_showData();
}, 
k_onClose: function() {
kerio.waw.shared.k_data.k_dashboardConnectivityData.k_unregister(this);
}
};
k_form = new kerio.waw.ui.K_WawTileForm(k_objectName, k_formCfg);
k_form.k_addReferences({
k_topDownloadersTable: k_topDownloadersTable,
k_topUploadersTable: k_topUploadersTable,
kerio_web_SharedConstants: kerio_web_SharedConstants,
k_usedByteUnitMapped: k_shared.k_DEFINITIONS.k_BYTE_UNITS_MAPPED[kerio_web_SharedConstants.kerio_web_KiloBytes],
k_createReferencedUserName: k_shared.k_methods.k_createReferencedUserName,
k_formatNumber: k_shared.k_methods.k_formatNumber
});
k_form.k_addReferences({
_k_loadRequest: {
k_requests: [
{
k_jsonRpc: {
method: 'ActiveHosts.get',
params: {
refresh: true,
query: {
start: 0, limit: 3, orderBy: [
{columnName: 'currentDownload', direction: 'Desc'}
]
}
}
}
},
{
k_jsonRpc: {
method: 'ActiveHosts.get',
params: {
refresh: true,
query: {
start: 0, limit: 3, orderBy: [
{columnName: 'currentUpload', direction: 'Desc'}
]
}
}
}
}
],
k_options: {
k_scope: k_form,
k_callback: k_form.k_loadDataCallback,
k_mask: false
}
}
});
return k_form;
} };

kerio.waw.ui.tileConnectivity = {
k_init: function(k_objectName, k_initParams) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_localNamespace = k_objectName + '_',
k_tr = kerio.lib.k_tr,
k_connectivityTable,
k_form, k_formCfg;
if (!kerio.waw.shared.k_data.k_dashboardConnectivityData) {
this.k_initSharedHandler();
}
k_connectivityTable = new kerio.waw.shared.k_widgets.K_CommonTable(
k_localNamespace + 'k_connectivityTable',
{
k_headers: [
{
k_caption: '',
k_width: '25%'
},
{
k_caption: k_tr('Status', 'tileConnectivity'),
k_width: '25%'
},
{
k_caption: k_tr('Current Rx', 'tileConnectivity'),
k_colspan: 2,
k_width: '121px',
k_className: 'alignRight'
},
{
k_caption: ''
},
{
k_caption: k_tr('Current Tx', 'tileConnectivity'),
k_colspan: 2,
k_width: '121px',
k_className: 'alignRight'
},
{
k_caption: ''
}
],
k_columnClasses: [
{
k_id: 2,
k_className: 'alignRight'
},
{
k_id: 3,
k_className: 'kbPerSec alignRight'
},
{
k_id: 5,
k_className: 'alignRight'
},
{
k_id: 6,
k_className: 'kbPerSec alignRight'
}
]
}
);
k_formCfg = {
k_className: 'connectivity',
k_labelWidth: 1,
k_isLabelHidden: true,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_container',
k_id: 'k_connectivityTableContainer',
k_height: 100,
k_content: k_connectivityTable
},
{
k_id: 'noInterface',
k_type: 'k_display',
k_isLabelHidden: true,
k_isHidden: true,
k_value: k_tr('There is no interface in Internet Interfaces group.', 'tileConnectivity') + ' <a>' + k_tr('Go to Interfaces', 'tileConnectivity') + '</a>',
k_isSecure: true,
k_onLinkClick: function(k_form) {
k_form.k_tile.k_extWidget.removeClass.defer(100, k_form.k_tile.k_extWidget, ['mouseover']);
kerio.waw.status.k_currentScreen.k_switchPage('interfaces');
}
}
],
k_tile: k_initParams.k_tile,
k_initTile: function() {
kerio.waw.shared.k_data.k_dashboardConnectivityData.k_registerTile(this);
this.k_loadData();
},
k_loadData: function() {
kerio.waw.shared.k_data.k_dashboardConnectivityData.k_refreshData();
},
k_loadDataCallback: function(k_response, k_success) {
if (!k_success) {
return; }
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
InterfaceStatusType = this.InterfaceStatusType,
k_interfaceStatusMapped = this.k_interfaceStatusMapped,
k_tableData = [],
k_inactiveRows = {},
k_rowData = [],
k_widgetStatusOk = true,
k_list = k_response[0].list,
k_cnt = k_response[0].totalItems,
k_charts = k_response[1].list,
k_chartsMapped = {},
k_interfacesId = [],
k_batchQueries = [],
k_cntInterfaces,
k_i, k_item;
if (!this.k_getParentWidget().k_extWidget) {
return;
}
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_list[k_i];
k_interfacesId.push(k_item.id);
k_rowData = [];
k_rowData.push(kerio.lib.k_htmlEncode(k_item.name));
switch(k_item.linkStatus) {
case InterfaceStatusType.Down:
case InterfaceStatusType.Backup:
case InterfaceStatusType.CableDisconnected:
k_inactiveRows[k_i] = true;
case InterfaceStatusType.Up:
case InterfaceStatusType.Connecting:
case InterfaceStatusType.Disconnecting:
k_rowData.push(k_interfaceStatusMapped[k_item.linkStatus]);
break;
case InterfaceStatusType.Error:
k_widgetStatusOk = false;
k_rowData.push('<a class="error" onClick="kerio.waw.status.k_currentScreen.k_gotoNode(\'interfaces\')">' + k_interfaceStatusMapped[k_item.linkStatus] + '</a>');
break;
}
k_tableData.push(k_rowData);
}
this.k_getParentWidget().k_updateStatus(k_widgetStatusOk ? 'ok' : 'error');
if (k_interfacesId.length) {
for (k_i = 0, k_cnt = k_charts.length; k_i < k_cnt; k_i++) {
k_chartsMapped[k_charts[k_i].componentId] = k_charts[k_i].id;
}
this.k_noInterface.k_setVisible(false);
this.k_connectivityTableContainer.k_setVisible(true);
k_cntInterfaces = 0;
for (k_i = 0; k_i < k_interfacesId.length; k_i++) {
if (!Ext.isEmpty(k_chartsMapped[k_interfacesId[k_i]])) {
k_cntInterfaces++;
k_batchQueries.push({
k_jsonRpc: {
method: 'TrafficStatistics.getHistogram',
params: {
type: k_CONSTANTS.kerio_web_SharedConstants.kerio_web_HistogramTwoHours, id: k_chartsMapped[k_interfacesId[k_i]]
}
}
});
}
}
kerio.waw.requests.k_sendBatch(
k_batchQueries,
{
k_scope: this,
k_callback: this.k_loadTrafficDataCallback,
k_callbackParams: {
k_cntInterfaces: k_cntInterfaces,
k_tableData: k_tableData,
k_inactiveRows: k_inactiveRows
},
k_mask: false,
k_isSilent: true
}
);
kerio.waw.requests.k_sendNow();
}
else {
this.k_noInterface.k_setVisible(true);
this.k_connectivityTableContainer.k_setVisible(false);
}
},

k_onClose: function() {
kerio.waw.shared.k_data.k_dashboardConnectivityData.k_unregister(this);
}
};
k_form = new kerio.waw.ui.K_WawTileForm(k_objectName, k_formCfg);
k_form.k_addReferences({
k_interfaceStatusMapped: kerio.waw.shared.k_DEFINITIONS.k_INTERFACE_STATUS_MAPPED,
k_connectivityTable: k_connectivityTable,
k_usedByteUnitMapped: kerio.waw.shared.k_DEFINITIONS.k_BYTE_UNITS_MAPPED[k_CONSTANTS.kerio_web_SharedConstants.kerio_web_MegaBytes],
k_usedByteUnit: k_CONSTANTS.kerio_web_SharedConstants.kerio_web_KiloBytes,
InterfaceStatusType: k_CONSTANTS.InterfaceStatusType,
k_noInterface: k_form.k_getItem('noInterface'),
k_connectivityTableContainer: k_form.k_getItem('k_connectivityTableContainer'),
_k_loadRequest: {
k_requests: [
{
k_jsonRpc: {
method: 'Interfaces.get',
params: {
sortByGroup: true,
query: {
conditions: [
{
fieldName: 'group',
comparator: k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Eq,
value: k_CONSTANTS.InterfaceGroupType.Internet
}
],
combining: k_CONSTANTS.kerio_web_SharedConstants.kerio_web_And,
start: 0, limit: -1, orderBy: [
{columnName: 'name', direction: k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Asc}
]
}
}
}
},
{
k_jsonRpc: {
method: 'TrafficStatistics.get',
params: {
refresh: true,
query: {
conditions: [
{
fieldName: 'type',
comparator: k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Eq,
value: k_CONSTANTS.TrafficStatisticsType.TrafficStatisticsInterface
}
],
combining: k_CONSTANTS.kerio_web_SharedConstants.kerio_web_And,
start: 0,
limit: -1,
orderBy: [
{columnName: 'name', direction: k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Asc}
]
}
}
}
}
],
k_options: {
k_scope: k_form,
k_callback: k_form.k_loadDataCallback,
k_mask: false,
k_isSilent: true
}
}
});
this.k_addControllers(k_form);
return k_form;
},
k_initSharedHandler: function() {
var K_Constructor = kerio.waw.ui.tileTrafficChart.k_dashboartTrafficChart._k_constructor;
Ext.extend(K_Constructor, Ext.util.Observable, kerio.waw.ui.tileTrafficChart.k_dashboartTrafficChart);
K_Constructor = Ext.extend(K_Constructor, {

k_registerTile: function (k_tile) {
this.k_register(k_tile);
k_tile._k_loadRequest.k_options.k_callback = k_tile._k_loadRequest.k_options.k_callback.createSequence(
function() {
this._k_setPendingRequest(false);
}, this);
},

k_refreshData: function () {
this.fireEvent('k_loadData');
},

_k_loadData: function() {
if (this.k_isRequestPending()) {
return;
}
var
k_i, k_cnt,
k_tile;
this._k_sendTiles = []; for (k_i = 0, k_cnt = this._k_tiles.length; k_i < k_cnt; k_i++) {
k_tile = this._k_tiles[k_i];
this._k_sendTiles.push(this._k_tiles[k_i]);
if (k_cnt - 1 === k_i) {
this._k_setPendingRequest(kerio.waw.requests.k_sendBatch(k_tile._k_loadRequest.k_requests, k_tile._k_loadRequest.k_options));
} else {
kerio.waw.requests.k_sendBatch(k_tile._k_loadRequest.k_requests, k_tile._k_loadRequest.k_options);
}
}
}
});
kerio.waw.shared.k_data.k_dashboardConnectivityData = new K_Constructor();
},
k_addControllers: function (k_kerioWidget) {
k_kerioWidget.k_addReferences({
k_loadTrafficDataCallback: function(k_response, k_success, k_customParams) {
if (!k_success || k_customParams.k_cntInterfaces === 0) {
return; }
var
k_formatDataUnits = kerio.waw.shared.k_methods.k_formatDataUnits,
k_buildTooltip = kerio.lib.k_buildTooltip,
k_usedByteUnitMapped = this.k_usedByteUnitMapped,
k_usedByteUnit = this.k_usedByteUnit,
k_rowClass = '',
k_emptyValue = '',
k_tableData,
k_tableDataItem,
k_inactiveRows,
k_interfaceData,
k_histogram,
k_i, k_cnt, k_item,
k_actualData,
k_rx, k_tx,
k_rxString,
k_txString;
if (typeof k_response === 'object') {
k_response = [k_response];
}
if (1 === k_customParams.k_cntInterfaces) {
k_interfaceData = k_response;
}
else {
k_interfaceData = k_response[0];
}
k_cnt = k_interfaceData.length;
k_tableData = k_customParams.k_tableData;
k_inactiveRows = k_customParams.k_inactiveRows;
for (k_i = 0; k_i < k_cnt;  k_i++) {
k_histogram = k_interfaceData[k_i].hist;
k_item = k_histogram.data;
if (0 === k_item.length) {
k_rx = 0;
k_tx = 0;
}
else {
k_actualData = k_item[0];
k_rx = k_actualData.inbound;
k_tx = k_actualData.outbound;
}
k_tableDataItem = k_tableData[k_i];
if (k_tableDataItem) {
k_rxString = k_formatDataUnits({ k_value: k_rx, k_units: k_histogram.units, k_outputUnits: k_usedByteUnit, k_isInTime: true, k_numberFormat: {k_decimalPlaces: 0}});
k_tableDataItem.push(['<span ',k_buildTooltip(k_rxString.k_tooltipString),'>',k_rxString.k_formatedValue,'</span>'].join(''));
k_tableDataItem.push(['<span ',k_buildTooltip(k_rxString.k_tooltipString),'>',k_rxString.k_unitString,'</span>'].join(''));
k_tableDataItem.push(k_emptyValue);
k_txString = k_formatDataUnits({ k_value: k_tx, k_units: k_histogram.units, k_outputUnits: k_usedByteUnit, k_isInTime: true, k_numberFormat: {k_decimalPlaces: 0} });
k_tableDataItem.push(['<span ',k_buildTooltip(k_txString.k_tooltipString),'>',k_txString.k_formatedValue,'</span>'].join(''));
k_tableDataItem.push(['<span ',k_buildTooltip(k_txString.k_tooltipString),'>',k_txString.k_unitString,'</span>'].join(''));
k_tableDataItem.push(k_emptyValue);
k_rowClass = k_inactiveRows[k_i] ? 'inactive' : '';
this.k_connectivityTable.k_appendRow(k_tableDataItem, k_rowClass);
}
}
this.k_connectivityTable.k_showData();
}
});
} };

kerio.waw.ui.tileSystem = {
k_init: function(k_objectName, k_initParams) {
var
k_SERVER = kerio.waw.shared.k_CONSTANTS.k_SERVER,
k_PRODUCT_INFO = k_SERVER.k_PRODUCT_INFO,
k_WARNING_HIDE = 'hidden',
k_tr = kerio.lib.k_tr,
k_titleWidth = 150,
k_serialNumber = kerio.lib.k_getSharedConstants().kerio_web_SerialNumber,
k_serialNumberText = 'unknown' !== k_serialNumber ? ' (' + k_tr('Serial number:', 'tileSystem') + ' ' + k_serialNumber + ')' : '',
k_timeDisharmonyTooltip = k_tr('The time differs between Kerio Control and your OS. Please, verify that the Kerio Control time settings are correct.','systemStatus'),
k_form, k_formCfg;
k_formCfg = {
k_className: 'system line',
k_labelWidth: 1,
k_isLabelHidden: true,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_value: k_tr('System time:', 'systemStatus'),
k_width: k_titleWidth,
k_isLabelHidden: true
},
{
k_id: 'systemTime',
k_type: 'k_display',
k_isLabelHidden: true,
k_isSecure: true,
k_template: '{time}&nbsp;&nbsp;<span class="warning {warning}" ' + kerio.lib.k_buildTooltip(k_timeDisharmonyTooltip) + '>&nbsp; &nbsp; &nbsp;</span>',
k_value: {
time: k_tr('Loading…', 'common'),
warning: k_WARNING_HIDE
}
}
]
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_value: k_tr('Kerio Control:', 'systemStatus'),
k_width: k_titleWidth,
k_isLabelHidden: true
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_PRODUCT_INFO.versionString
}
]
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_value: k_tr('Hostname:', 'activeHostsList'),
k_width: k_titleWidth,
k_isLabelHidden: true
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_SERVER.k_HOST_NAME
}
]
}
],
k_tile: k_initParams.k_tile,
k_settings: {
k_items: [
{
k_caption: kerio.lib.k_tr('Go to Time settings', 'tileVpn'),
k_onClick: function(k_menu) {
kerio.waw.status.k_currentScreen.k_gotoNode('advancedOptions', 'k_systemCfgForm');
}
}
]
},
k_initTile: function() {
this.k_loadData();
},
k_loadData: function() {
var
k_unixTimestampToDate = kerio.waw.shared.k_methods.k_unixTimestampToDate,
k_requests = [];
this.k_REQUEST_TIME = 0;
k_requests.push({
k_jsonRpc: {
method: 'SystemConfig.getDateTime',
}
});
this.k_REQUEST_TIMEZONE = 1;
k_requests.push({
k_jsonRpc: {
method: 'SystemConfig.get',
}
});
this.k_REQUEST_ALL_TIMEZONES = 2;
k_requests.push({
k_jsonRpc: {
method: 'SystemConfig.getTimeZones',
params: {
currentDate: k_unixTimestampToDate((new Date()).getTime()/1000)
}
}
});
kerio.waw.requests.k_sendBatch(
k_requests,
{
k_scope: this,
k_callback: this.k_loadDataCallback,
k_mask: false
}
);
},
k_loadDataCallback: function(k_response, k_success) {
if (k_success) {
var k_running = kerio.waw.shared.k_tasks.k_suspend(this.k_ANIMATE_CLOCKS_TASK_ID);
kerio.waw.shared.k_methods.k_updateClientServerTimeOffset(k_response[this.k_REQUEST_TIME].config || {}, k_success);
this.k_checkTime(k_response[this.k_REQUEST_TIMEZONE], k_response[this.k_REQUEST_ALL_TIMEZONES]);
this.k_fillTime();
if (!k_running) {
kerio.waw.shared.k_tasks.k_start(this.k_ANIMATE_CLOCKS_TASK_ID);
}
else {
kerio.waw.shared.k_tasks.k_resume(this.k_ANIMATE_CLOCKS_TASK_ID);
}
}
},

k_onClose: function() {
kerio.waw.shared.k_tasks.k_remove(this.k_TIME_DISHARMONY_LIMIT, true);
}
};
if (k_PRODUCT_INFO.boxEdition) {
k_formCfg.k_items.push({
k_type: 'k_row',
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_value: k_tr('Hardware:', 'vpnClientsList'),
k_width: k_titleWidth,
k_isLabelHidden: true
},
{
k_type: 'k_display',
k_isLabelHidden: true,
k_value: k_PRODUCT_INFO.boxName + k_serialNumberText
}
]
});
}
k_form = new kerio.waw.ui.K_WawTileForm(k_objectName, k_formCfg);
k_form.k_addReferences({
k_TIME_DISHARMONY_LIMIT: 30, k_WARNING_SHOW: 'show',
k_WARNING_HIDE: k_WARNING_HIDE,
k_ANIMATE_CLOCKS_TASK_ID: 'k_animateClocksOnDashboard',
k_timeElement: k_form.k_getItem('systemTime'),
k_timeOffsetServerClient: undefined,
k_serverDateTime: undefined,
k_timeWarning: k_WARNING_HIDE
});
kerio.waw.shared.k_tasks.k_add({
k_id: k_form.k_ANIMATE_CLOCKS_TASK_ID,
k_interval: 500, k_scope: k_form,
k_run: function(){
var
k_timeOffset,
k_time;
k_timeOffset = (new Date()) - this.k_timeOffsetServerClient;
k_time = this.k_serverDateTime.add(Date.MILLI, k_timeOffset);
this.k_fillTime(k_time);
return true;
}
});
this.k_addControllers(k_form);
return k_form;
},
k_addControllers: function (k_kerioWidget) {
k_kerioWidget.k_addReferences({

k_fillTime: function(k_time) {
if (undefined === k_time) {
this.k_timeOffsetServerClient = new Date();
this.k_timeOffsetServerClient = this.k_timeOffsetServerClient.add(Date.MILLI, -1000);
this.k_serverDateTime = new Date(this.k_timeOffsetServerClient - (kerio.waw.shared.k_CONSTANTS.k_CLIENT_SERVER_OFFSET_SECONDS * 1000));
k_time = this.k_serverDateTime;
}
k_time = kerio.waw.shared.k_methods.k_formatTime({
hour: k_time.getHours(),
min: k_time.getMinutes(),
sec: k_time.getSeconds()
});
this.k_timeElement.k_setValue({time: k_time, warning: this.k_timeWarning}, true);
},

k_checkTime: function(k_serverSettingsResponse, k_timeZonesResponse) {
var
k_serverTimeZoneId = k_serverSettingsResponse.config.timeZoneId,
k_timeZones = k_timeZonesResponse.timeZones,
k_serverTimeZone,
k_serverTimeOffset,
k_clientTimeOffset,
k_cnt, k_i;
for (k_i = 0, k_cnt = k_timeZones.length; k_i < k_cnt; k_i++) {
if (k_serverTimeZoneId === k_timeZones[k_i].id) {
k_serverTimeZone = k_timeZones[k_i];
break;
}
}
k_serverTimeOffset = k_serverTimeZone.currentOffset;
k_clientTimeOffset = (new Date().getTimezoneOffset()) * 60;
k_timeDisharmony = kerio.waw.shared.k_CONSTANTS.k_CLIENT_SERVER_OFFSET_SECONDS + k_serverTimeOffset + k_clientTimeOffset;
this.k_timeWarning = this.k_TIME_DISHARMONY_LIMIT < Math.abs(k_timeDisharmony) ? this.k_WARNING_SHOW : this.k_WARNING_HIDE;
}
});
}
};

kerio.waw.ui.tileSystemHealth = {
k_init: function(k_objectName, k_initParams) {
var
k_localNamespace = k_objectName + '_',
k_tr = kerio.lib.k_tr,
k_graphPanel,
k_form, k_formCfg;
k_graphPanel = new kerio.lib.K_ContentPanel(k_localNamespace + 'k_graph', {
k_height: 350,
k_html: ''
});
k_formCfg = {
k_labelWidth: 80,
k_items: [
{
k_type: 'k_container',
k_className: 'selectable', k_items: [
{
k_id: 'ramCurrent',
k_type: 'k_display',
k_caption: '<div class="legend ram"></div>' + k_tr('RAM:', 'systemHealth'),
k_isSecure: true,
k_template: k_tr('{usage} of {total} used', 'systemHealth'),
k_templateValues: {
total: 0,
usage: 0
}
},
{
k_id: 'cpuCurrent',
k_type: 'k_display',
k_caption: '<div class="legend cpu"></div>' + k_tr('CPU:', 'systemHealth'),
k_value: 0 + '%'
},
{
k_type: 'k_display',
k_id: 'k_storageText',
k_caption: '<div class="legend"></div>' + k_tr('Disk:', 'systemHealth'),
k_isSecure: true,
k_template: k_tr('{usage} of {total} used{k_link}', 'systemHealth'),
k_templateValues: {
total: 0,
usage: 0,
k_link: ''
},
k_onLinkClick: function(k_form) {
k_form.k_tile.k_extWidget.removeClass.defer(100, k_form.k_tile.k_extWidget, ['mouseover']);
kerio.waw.status.k_currentScreen.k_gotoNode('systemHealth');
}
}
]
},
{
k_height: 225,
k_type: 'k_container',
k_id: 'k_graphContainer',
k_className: 'ext4Charts',
k_content: k_graphPanel
}
],
k_tile: k_initParams.k_tile,
k_isSelectable: false,
k_settings: {
k_items: [
{
k_id: 'k_goToSystemHealth',
k_caption: k_tr('Go to System Health', 'systemHealth'),
k_onClick: function(k_menu) {
kerio.waw.status.k_currentScreen.k_gotoNode('systemHealth');
}
}
]
},
k_initTile: function() {
this.k_loadData();
},
k_loadData: function() {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_startTime;
if (this._k_isClosed || !kerio.lib.K_TimeChart) {
return;
}
k_startTime = Math.floor(this.k_chartStartTime / 1000);
k_startTime -= k_WAW_CONSTANTS.k_DASHBOARD_CHARTS.k_SAFE_LENGTH; kerio.waw.requests.k_sendBatch(
[
{
k_jsonRpc: {
method: 'SystemHealth.getInc',
params: {
type: k_WAW_CONSTANTS.k_DASHBOARD_CHARTS.k_INTERVAL,
startSampleTime: k_startTime
}
}
}
],
{
k_scope: this,
k_callback: this.k_loadDataCallback,
k_mask: false,
k_isSilent: true
}
);
},
k_loadDataCallback: function(k_response, k_success) {
if (!k_success) {
return; }
var
k_MIN_DISK_FREE = 100 * 1024 * 1024, k_shared = kerio.waw.shared,
k_methods = k_shared.k_methods,
kerio_web_SharedConstants = k_shared.k_CONSTANTS.kerio_web_SharedConstants,
k_formatDataUnits = k_methods.k_formatDataUnits,
k_formatNumber = k_methods.k_formatNumber,
k_systemHealth = k_response.data || {},
k_chartStartTime = k_response.sampleTime,
k_tile = this.k_tile,
k_memoryTotal,
k_memoryUsage,
k_cpu,
k_diskUsage,
k_isError,
k_diskErrorLink = '';
k_tile.k_chartStartTime = k_chartStartTime;
if (!k_systemHealth.memory || 0 === k_systemHealth.memory.length) {
k_systemHealth.memory = [0];
}
if (!k_systemHealth.cpu || 0 === k_systemHealth.cpu.length) {
k_systemHealth.cpu = [0];
}
k_memoryTotal = k_formatDataUnits({ k_value: k_systemHealth.memoryTotal * 1024 }); k_memoryUsage = k_formatDataUnits({ k_value: k_systemHealth.memory[0] * k_memoryTotal.k_value / 100, k_units: k_memoryTotal.k_units }); k_cpu = k_systemHealth.cpu[0];
k_cpu = k_formatNumber(k_cpu);
k_diskUsage = k_systemHealth.diskTotal - k_systemHealth.diskFree;
if (k_MIN_DISK_FREE > k_systemHealth.diskFree) {
k_isError = true;
k_diskErrorLink = ' <a>' + kerio.lib.k_tr('Go to System Health', 'k_systemHealth') + '</a>';
this.k_storageText.k_addClassName('error');
}
else {
this.k_storageText.k_removeClassName('error');
}
this.k_setData({
k_storageText: {
total: k_formatDataUnits({ k_value: k_systemHealth.diskTotal, k_units: kerio_web_SharedConstants.kerio_web_Bytes }).k_string,
usage: k_formatDataUnits({ k_value: k_diskUsage, k_units: kerio_web_SharedConstants.kerio_web_Bytes }).k_string,
k_link: k_diskErrorLink
},
cpuCurrent: k_cpu + '%',
ramCurrent: {
usage: k_memoryUsage.k_string,
total: k_memoryTotal.k_string
}
});
this._k_drawGraph('k_cpu', {
k_time: (new Date() / 1000) - k_shared.k_CONSTANTS.k_CLIENT_SERVER_OFFSET_SECONDS,
k_cpu: k_systemHealth.cpu,
k_ram: k_systemHealth.memory,
k_memoryTotal: k_systemHealth.memoryTotal
});
if (!k_tile.k_extWidget) {
return;
}
k_tile.k_updateStatus(k_isError ? 'error' : '');
},

k_onDeactivate: function() {
if (this.k_chart) {
this.k_chart.k_bypassDomRelease();
}
},

k_onActivate: function() {
if (this.k_chart) {
if (!this.k_chart.k_bypassDomRestore()) {
this.k_chart.k_destroy(); this.k_chart = undefined; this.k_loadData();        }
}
}
}; k_form = new kerio.waw.ui.K_WawTileForm(k_objectName, k_formCfg);
k_form.k_addReferences({
k_DATE_TIME_FORMATS: kerio.waw.shared.k_CONSTANTS.k_DATE_TIME_FORMATS,
k_storageText: k_form.k_getItem('k_storageText'),
k_cpuCurrent: k_form.k_getItem('cpuCurrent'),
k_graphPanel: k_graphPanel,
k_chart: null,
k_chartStartTime: 0,
_k_translations: {
k_now: k_tr('Now', 'common')
}
});
this.k_addControllers(k_form);
return k_form;
}, k_addControllers: function (k_kerioWidget) {
k_kerioWidget.k_addReferences({

_k_drawGraph: function(k_type, k_data) {
var
k_tr = kerio.lib.k_tr,
k_canvasId = 'k_graphPanel',
k_chartCfg, k_chart;
k_data = k_data || [];
if (!this.k_chart) {
k_chartCfg = {
k_container: this[k_canvasId],
k_height: 100,
k_xAxis: {
k_fieldId: 'time',
k_renderer: function(k_value, k_data) {
if (!this.k_extWidget) {
return {k_data: ''};
}
if (k_value === k_data[0].time) {
return { k_data: this.k_relatedWidget._k_translations.k_now };
}
var
k_grid = this.k_relatedWidget,
k_date = new Date(k_value),
k_format = k_grid.k_DATE_TIME_FORMATS.k_TIME_SEC,
k_time = k_date.format(k_format);
return {
k_data: k_time
};
}
},
k_yAxis: {
k_minValue: 0,
k_maxValue: 100,
k_ticks: kerio.waw.shared.k_CONSTANTS.k_CHART_TICKS_COUNT.k_PERCENT,
k_renderer: function(k_value) {
k_value += '%';
return {
k_data: k_value
};
}
},
k_series: [
{
k_fieldId: 'cpu',
k_color: 2,
k_label: k_tr('CPU usage', 'systemHealth')
},
{
k_fieldId: 'ram',
k_color: 0,
k_fill: false,
k_label: k_tr('Memory usage', 'systemHealth')
}
]
};
k_chart = new kerio.lib.K_TimeChart(this.k_id + '_' + 'k_chart' + '_' + k_type, k_chartCfg);
k_chart.k_relatedWidget = this;
k_chart.k_memoryTotal = k_data.k_memoryTotal * 1024; this.k_chart = k_chart;
} k_data = this._k_processData(k_data.k_time, k_data);
k_chartCfg = {
k_unit: kerio.waw.shared.k_CONSTANTS.k_DASHBOARD_CHARTS.k_TICK_UNIT,
k_step: kerio.waw.shared.k_CONSTANTS.k_DASHBOARD_CHARTS.k_TICK_STEP,
k_maxValue: k_data.k_endTime,
k_minValue: k_data.k_startTime
};
this.k_chart.k_setTimeAxis(k_chartCfg);
this.k_chart.k_setData(k_data.k_data);
this.k_chart.k_syncSize();
}, 
_k_processData: function(k_endTime, k_data) {
var
k_shared = kerio.waw.shared,
k_DASHBOARD_CHARTS = k_shared.k_CONSTANTS.k_DASHBOARD_CHARTS,
k_dataCpu = k_data.k_cpu,
k_dataRam = k_data.k_ram,
k_out,
k_interval,
k_i, k_cnt;
k_endTime *= 1000; k_out = {
k_endTime: k_endTime,
k_startTime: k_endTime - k_DASHBOARD_CHARTS.k_LENGTH*1000, k_data: []
};
k_interval = k_DASHBOARD_CHARTS.k_SAMPLE_LENGTH * 1000; for (k_i = 0, k_cnt = k_dataCpu.length; k_i < k_cnt; k_i++) {
k_out.k_data.push({
time: k_endTime,
cpu: k_dataCpu[k_i],
ram: k_dataRam[k_i]
});
k_endTime -= k_interval; }
if (!k_out.k_data.length) { k_out.k_data.push({
time: k_out.k_endTime,
cpu: 0,
ram: 0
});
}
return k_out;
} });
} }; 
kerio.waw.ui.tileSystemStatus = {
k_init: function(k_objectName, k_initParams) {
var
k_UPDATE_ID = 'k_update',
k_ANTIVIRUS_ID = 'k_antivirus',
k_IPS_ID = 'k_ips',
k_KWF_ID = 'k_kwf',
k_APP_ID = 'k_app',
k_VALUE_FIELD_ID = 'k_value',
k_IPSEC_SERVER_ID = 'k_ipsecServer',
k_KVPN_SERVER_ID = 'k_kvpnServer',
k_APP_MANAGER_ID = 'k_appManagerKerio',
k_MY_KERIO_ID = 'k_myKerio',
k_tr = kerio.lib.k_tr,
k_notAvaibleText = k_tr('Not available in the unregistered trial', 'systemStatus'),
k_notAvaibleUpdates = k_tr('Working, but no updates available in the unregistred trial', 'systemStatus'),
k_unlicensedText = k_tr('Unlicensed', 'systemStatus'),
k_disabledText = k_tr('Disabled', 'systemStatus'),
k_workingText = k_tr('Working properly', 'systemStatus'),
k_shared = kerio.waw.shared,
k_emptyFn = k_shared.k_methods.k_emptyFunction,
k_USE_SOPHOS = k_shared.k_CONSTANTS.k_SERVER.k_USE_SOPHOS,
k_form, k_formCfg,
k_generateStatusRow,
k_onLinkClick;
k_onLinkClick = function(k_form, k_linkItem){
k_form.k_tile.k_extWidget.removeClass.defer(100, k_form.k_tile.k_extWidget, ['mouseover']);
switch (k_linkItem.k_name) {
case k_form.k_updateStatusElement.k_name:
kerio.waw.status.k_currentScreen.k_gotoNode('advancedOptions', 'k_updateForm');
break;
case k_form.k_antivirusStatusElement.k_name:
kerio.waw.status.k_currentScreen.k_gotoNode('antivirus', 'k_engineTab');
break;
case k_form.k_ipsStatusElement.k_name:
kerio.waw.status.k_currentScreen.k_gotoNode('intrusionPrevention');
break;
case k_form.k_kwfStatusElement.k_name:
kerio.waw.status.k_currentScreen.k_gotoNode('contentFilter', 'k_webFilter');
break;
case k_form.k_appStatusElement.k_name:
kerio.waw.status.k_currentScreen.k_gotoNode('contentFilter', 'k_webFilter');
break;
case k_form.k_appManagerStatusElement.k_name:
kerio.waw.status.k_currentScreen.k_gotoNode('remoteServices', 'appManagerForm');
break;
case k_form.k_myKerioStatusElement.k_name:
kerio.waw.status.k_currentScreen.k_gotoNode('remoteServices', 'myKerioForm');
}
};

k_generateStatusRow = function(k_id, k_title, k_onLinkClick, k_VALUE_FIELD_ID) {
var k_statusRow = {
k_type: 'k_row',
k_id: k_id,
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_value: k_title,
k_width: 150,
k_isLabelHidden: true
},
{
k_id: k_id + k_VALUE_FIELD_ID,
k_type: 'k_display',
k_isLabelHidden: true,
k_template: '{k_status} <a class="error">{k_link}</a><a>{k_blueLink}</a>',
k_value: {
k_status: '',
k_blueLink: '', k_link: ''
},
k_onLinkClick: k_onLinkClick
}
]
};
if (k_id === k_MY_KERIO_ID) {
k_statusRow.k_isVisible = !k_shared.k_CONSTANTS.k_MYKERIO_DISABLED;
k_statusRow.k_isDisabled = k_shared.k_CONSTANTS.k_MYKERIO_DISABLED;
}
return k_statusRow;
};
k_formCfg = {
k_className: 'systemStatus',
k_isLabelHidden: true,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_value: k_tr('Uptime:', 'systemStatus'),
k_width: 150,
k_isLabelHidden: true
},
{
k_id: 'k_uptime',
k_type: 'k_display',
k_isLabelHidden: true,
k_value: ''
}
]
},
k_generateStatusRow(k_UPDATE_ID, k_tr('Kerio Control:', 'systemStatus'), k_onLinkClick, k_VALUE_FIELD_ID),
k_generateStatusRow(k_ANTIVIRUS_ID, k_USE_SOPHOS ? k_tr('Antivirus:', 'systemStatus') : k_tr('Kerio Antivirus:', 'antivirusList'), k_onLinkClick, k_VALUE_FIELD_ID),
k_generateStatusRow(k_IPS_ID, k_tr('Intrusion Prevention:', 'systemStatus'), k_onLinkClick, k_VALUE_FIELD_ID),
k_generateStatusRow(k_APP_ID, k_tr('Application Awareness:', 'systemStatus'), k_onLinkClick, k_VALUE_FIELD_ID),
k_generateStatusRow(k_KWF_ID, k_tr('Kerio Control Web Filter:', 'systemStatus'), k_onLinkClick, k_VALUE_FIELD_ID),
k_generateStatusRow(k_IPSEC_SERVER_ID, k_tr('IPsec VPN Server:', 'systemStatus'), k_emptyFn, k_VALUE_FIELD_ID),
k_generateStatusRow(k_KVPN_SERVER_ID, k_tr('%1:', 'tileVpn', {k_args: ['Kerio VPN Server']}), k_emptyFn, k_VALUE_FIELD_ID),
k_generateStatusRow(k_MY_KERIO_ID, k_tr('%1:', 'tileVpn', {k_args: ['MyKerio']}), k_onLinkClick, k_VALUE_FIELD_ID),
k_generateStatusRow(k_APP_MANAGER_ID, k_tr('%1:', 'tileVpn', {k_args: ['AppManager']}), k_onLinkClick, k_VALUE_FIELD_ID)
],
k_tile: k_initParams.k_tile,
k_initTile: function() {
kerio.waw.requests.on('afterLicenseUpdate', this.k_loadData, this);
this.k_loadData();
},
k_loadData: function() {
var
k_requests = [];
this.k_PRODUCT_INFO_REQUEST = 0;
k_requests.push({
k_jsonRpc: {
method: 'ProductInfo.getUptime'
}
});
this.k_UPDATE_CHECKER_REQUEST = 1;
k_requests.push({
k_jsonRpc: {
method: 'UpdateChecker.getStatus'
}
});
this.k_ANTIVIRUS_GET_REQUEST = 2;
k_requests.push({
k_jsonRpc: {
method: 'Antivirus.get'
}
});
this.k_ANTIVIRUS_STATUS_REQUEST = 3;
k_requests.push({
k_jsonRpc: {
method: 'Antivirus.getUpdateStatus'
}
});
this.k_IPS_GET_REQUEST = 4;
k_requests.push({
k_jsonRpc: {
method: 'IntrusionPrevention.get'
}
});
this.k_IPS_STATUS_REQUEST = 5;
k_requests.push({
k_jsonRpc: {
method: 'IntrusionPrevention.getUpdateStatus'
}
});
this.k_HTTP_POLICY_REQUEST = 6;
k_requests.push({
k_jsonRpc: {
method: 'ContentFilter.getUrlFilterConfig'
}
});
this.k_INTERFACES_REQUEST = 7;
k_requests.push({
k_jsonRpc: {
method: 'Interfaces.get',
params: {
sortByGroup: true,
query: kerio.waw.shared.k_DEFINITIONS.k_interfaceVpnServerQuery
}
}
});
if (! kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED) {
this.k_MYKERIO_SETTING_REQUEST = 8;
k_requests.push({
k_jsonRpc: {
method: 'CentralManagement.get'
}
});
this.k_MYKERIO_STATUS_REQUEST = 9;
k_requests.push({
k_jsonRpc: {
method: 'CentralManagement.getStatus'
}
});
}
this.k_APP_MANAGER_STATUS_REQUEST = 10;
k_requests.push({
k_jsonRpc: {
method: 'CentralManagement.getAppManager',
params: {
extendedInfo: false
}
}
});
kerio.waw.requests.k_sendBatch(
k_requests,
{
k_scope: this,
k_callback: this.k_loadDataCallback,
k_mask: false
}
);
},
k_loadDataCallback: function(k_response, k_success) {
if (!k_success) {
return; }
var
k_form = this,
k_tr = kerio.lib.k_tr,
k_widgetStatusOk = true,
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
UrlFilterStatus = k_CONSTANTS.UrlFilterStatus,
k_USE_SOPHOS = k_CONSTANTS.k_SERVER.k_USE_SOPHOS,
k_isUnregistredTrial = kerio.waw.shared.k_methods.k_isTrial(false),
k_uptimeSeconds = k_response[this.k_PRODUCT_INFO_REQUEST].uptime,
k_formatElapsedTime = kerio.waw.shared.k_methods.k_formatElapsedTime,
k_updateStatus = k_response[this.k_UPDATE_CHECKER_REQUEST].status,
k_antivirusStatus = k_response[this.k_ANTIVIRUS_GET_REQUEST].config.antivirus,
k_antivirusUpdateStatus = k_response[this.k_ANTIVIRUS_STATUS_REQUEST].status,
AntivirusStatus = k_CONSTANTS.AntivirusStatus,
AntivirusUpdatePhases = k_CONSTANTS.AntivirusUpdatePhases,
k_avStatusText,
k_AV_STATUS_INACTIVE = 'inactive',
k_avStatus, k_ipsStatus = k_response[this.k_IPS_GET_REQUEST].config.enabled,
k_ipsUpdateStatus = k_response[this.k_IPS_STATUS_REQUEST].status,
k_IPS_PHASES = k_CONSTANTS.IntrusionPreventionUpdatePhases,
k_webFilter = k_response[this.k_HTTP_POLICY_REQUEST].config,
k_vpnServer = k_response[this.k_INTERFACES_REQUEST].list[0],
k_myKerioSettings = {},
k_myKerioStatus = {},
k_appManagerStatus = {},
k_appStatusSet = false,
k_vpnStatus;
if (! kerio.waw.shared.k_CONSTANTS.k_MYKERIO_DISABLED) {
k_myKerioSettings = k_response[this.k_MYKERIO_SETTING_REQUEST].config;
k_myKerioStatus = k_response[this.k_MYKERIO_STATUS_REQUEST].status;
}
k_appManagerStatus = k_response[this.k_APP_MANAGER_STATUS_REQUEST].status;
kerio.waw.shared.k_tasks.k_suspend(this.k_ANIMATE_CLOCKS_TASK_ID);
k_form.k_uptime.k_setValue(k_formatElapsedTime({hour:0, min:0, sec: k_uptimeSeconds}));
this.k_uptimeSeconds = k_uptimeSeconds;
kerio.waw.shared.k_tasks.k_resume(this.k_ANIMATE_CLOCKS_TASK_ID);
k_widgetStatusOk = k_form.k_setUpdateStatus(k_updateStatus);
if (k_USE_SOPHOS) {
switch (k_antivirusStatus.status) {
case AntivirusStatus.AntivirusOk:
k_avStatus = true;
if (k_isUnregistredTrial) {
k_avStatusText = k_form.k_notAvaibleUpdates;
}
else if (k_antivirusStatus.internalEnabled || k_antivirusStatus.externalEnabled) {
k_avStatusText = k_form.k_workingText;
}
else { k_avStatusText = k_tr('No antivirus is running.', 'systemStatus');
k_avStatus = k_AV_STATUS_INACTIVE;
}
break;
case AntivirusStatus.AntivirusNotActive:
if (k_antivirusStatus.internal.available || k_isUnregistredTrial) { k_avStatusText = k_form.k_disabledText;
}
else {
k_avStatusText = k_form.k_unlicensedText;
}
k_avStatus = k_AV_STATUS_INACTIVE;
break;
case AntivirusStatus.AntivirusInternalFailed:
k_avStatusText = k_tr('The internal antivirus has failed to start.', 'systemStatus');
k_avStatus = false;
break;
case AntivirusStatus.AntivirusExternalFailed:
k_avStatusText = k_tr('The external antivirus has failed to start.', 'systemStatus');
k_avStatus = false;
break;
case AntivirusStatus.AntivirusBothFailed:
k_avStatusText = k_tr('Both the internal and external antivirus have failed to start.', 'systemStatus');
k_avStatus = false;
break;
default:
k_avStatusText = k_tr('Checking status', 'systemStatus');
}
if(k_avStatus && AntivirusUpdatePhases.AntivirusUpdateFailed === k_antivirusUpdateStatus.phase && AntivirusStatus.AntivirusNotActive !== k_antivirusStatus.status) {
k_avStatusText = k_tr('Update failed.', 'systemStatus');
k_avStatus = false;
}
if (k_AV_STATUS_INACTIVE === k_avStatus || !k_antivirusStatus.internal.available) {
this.k_antivirusStatus.k_addClassName('inactive');
this.k_antivirusStatusElement.k_setValue({
k_link: '',
k_status: k_avStatusText
});
}
else if (k_avStatus) {
this.k_antivirusStatus.k_removeClassName('inactive');
this.k_antivirusStatusElement.k_setValue({
k_link: '',
k_status: k_avStatusText
});
}
else {
this.k_antivirusStatus.k_removeClassName('inactive');
this.k_antivirusStatusElement.k_setValue({
k_link: k_tr('Go to Antivirus', 'systemStatus'),
k_status: k_avStatusText
});
k_widgetStatusOk = false;
}
}
else {
if (k_isUnregistredTrial) {
this.k_antivirusStatus.k_addClassName('inactive');
this.k_antivirusStatusElement.k_setValue({
k_link: '',
k_status: k_form.k_notAvaibleText
});
k_widgetStatusOk = false;
}
else {
switch (k_antivirusStatus.status) {
case AntivirusStatus.AntivirusOk:
k_avStatus = true;
if (k_isUnregistredTrial) {
k_avStatusText = k_form.k_notAvaibleUpdates;
}
else if (k_antivirusStatus.internalEnabled || k_antivirusStatus.externalEnabled) {
k_avStatusText = k_form.k_workingText;
}
else { k_avStatusText = k_tr('No antivirus is running.', 'systemStatus');
k_avStatus = k_AV_STATUS_INACTIVE;
}
break;
case AntivirusStatus.AntivirusNotActive:
if (k_antivirusStatus.internal.available || k_isUnregistredTrial) { k_avStatusText = k_form.k_disabledText;
}
else {
k_avStatusText = k_form.k_unlicensedText;
}
k_avStatus = k_AV_STATUS_INACTIVE;
break;
case AntivirusStatus.AntivirusInternalFailed:
k_avStatusText = k_tr('The internal antivirus has failed to start.', 'systemStatus');
k_avStatus = false;
break;
case AntivirusStatus.AntivirusExternalFailed:
k_avStatusText = k_tr('The external antivirus has failed to start.', 'systemStatus');
k_avStatus = false;
break;
case AntivirusStatus.AntivirusBothFailed:
k_avStatusText = k_tr('Both the internal and external antivirus have failed to start.', 'systemStatus');
k_avStatus = false;
break;
case AntivirusStatus.AntivirusWaitingForInitialDb:
k_avStatusText = k_tr('Waiting for download of initial threat definitions database.', 'systemStatus');
k_avStatus = true;
break;
default:
k_avStatusText = k_tr('Checking status', 'systemStatus');
}
if(k_avStatus && AntivirusUpdatePhases.AntivirusUpdateFailed === k_antivirusUpdateStatus.phase && AntivirusStatus.AntivirusNotActive !== k_antivirusStatus.status) {
k_avStatusText = k_tr('Update failed.', 'systemStatus');
k_avStatus = false;
}
if (k_AV_STATUS_INACTIVE === k_avStatus || !k_antivirusStatus.internal.available) {
this.k_antivirusStatus.k_addClassName('inactive');
this.k_antivirusStatusElement.k_setValue({
k_link: '',
k_status: k_avStatusText
});
}
else if (k_avStatus) {
this.k_antivirusStatus.k_removeClassName('inactive');
this.k_antivirusStatusElement.k_setValue({
k_link: '',
k_status: k_avStatusText
});
}
else {
this.k_antivirusStatus.k_removeClassName('inactive');
this.k_antivirusStatusElement.k_setValue({
k_link: k_tr('Go to Antivirus', 'systemStatus'),
k_status: k_avStatusText
});
k_widgetStatusOk = false;
}
}
}
if (!k_ipsStatus) {
this.k_ipsStatus.k_addClassName('inactive');
this.k_ipsStatusElement.k_setValue({
k_link: '',
k_status: k_form.k_disabledText
});
}
else {
this.k_ipsStatus.k_removeClassName('inactive');
if (k_isUnregistredTrial) {
this.k_ipsStatusElement.k_setValue({
k_link: '',
k_status: k_form.k_notAvaibleUpdates
});
} else if (k_IPS_PHASES.IntrusionPreventionUpdateError === k_ipsUpdateStatus.phase) {
k_widgetStatusOk = false;
this.k_ipsStatusElement.k_setValue({
k_link: k_tr('Go to Intrusion Prevention', 'systemStatus'),
k_status: k_tr('Update failed.', 'systemStatus')
});
} else {
this.k_ipsStatusElement.k_setValue({
k_link: '',
k_status: k_form.k_workingText
});
}
}
if (k_isUnregistredTrial) {
this.k_kwfStatus.k_addClassName('inactive');
this.k_kwfStatusElement.k_setValue({
k_link: '',
k_status: k_form.k_notAvaibleText
});
k_appStatusSet = true;
this.k_appStatus.k_addClassName('inactive');
this.k_appStatusElement.k_setValue({
k_link: '',
k_status: k_form.k_notAvaibleText
});
}
else if (UrlFilterStatus.UrlFilterNotLicensed === k_webFilter.status) {
this.k_kwfStatus.k_addClassName('inactive');
this.k_kwfStatusElement.k_setValue({
k_link: '',
k_status: k_form.k_unlicensedText
});
k_appStatusSet = true;
this.k_appStatus.k_addClassName('inactive');
this.k_appStatusElement.k_setValue({
k_link: '',
k_status: k_form.k_unlicensedText
});
}
else if (UrlFilterStatus.UrlFilterNotActivated === k_webFilter.status && k_webFilter.enabled) {
this.k_kwfStatus.k_removeClassName('inactive');
k_widgetStatusOk = false;
this.k_kwfStatusElement.k_setValue({
k_link: k_tr('Go to Applications and Web Categories', 'systemStatus'),
k_status: k_tr('Not activated.', 'systemStatus')
});
}
else if (UrlFilterStatus.UrlFilterNotLicensed !== k_webFilter.status && !k_webFilter.enabled) {
this.k_kwfStatus.k_addClassName('inactive');
this.k_kwfStatusElement.k_setValue({
k_link: '',
k_status: k_form.k_disabledText
});
}
else if (UrlFilterStatus.UrlFilterActivated === k_webFilter.status && k_webFilter.enabled) {
this.k_kwfStatus.k_removeClassName('inactive');
this.k_kwfStatusElement.k_setValue({
k_link: '',
k_status: k_form.k_workingText
});
}
else if (UrlFilterStatus.UrlFilterActivating === k_webFilter.status && k_webFilter.enabled) {
this.k_kwfStatus.k_removeClassName('inactive');
this.k_kwfStatusElement.k_setValue({
k_link: '',
k_status: k_tr('Activating', 'systemStatus')
});
}
if (!k_appStatusSet) {
if (k_webFilter.appidEnabled) {
this.k_appStatus.k_removeClassName('inactive');
this.k_appStatusElement.k_setValue({
k_link: '',
k_status: k_form.k_workingText
});
}
else {
this.k_appStatus.k_addClassName('inactive');
this.k_appStatusElement.k_setValue({
k_link: '',
k_status: k_form.k_disabledText
});
}
}
if (k_vpnServer.server.ipsecVpnEnabled) {
this.k_ipsecServerStatusRow.k_removeClassName('inactive');
k_vpnStatus = k_form.k_workingText;
}
else {
this.k_ipsecServerStatusRow.k_addClassName('inactive');
k_vpnStatus = k_form.k_disabledText;
}
this.k_ipsecServerStatus.k_setValue({
k_status: k_vpnStatus
});
if (k_vpnServer.server.kerioVpnEnabled) {
this.k_kerioVpnServerStatusRow.k_removeClassName('inactive');
k_vpnStatus = k_form.k_workingText;
}
else {
this.k_kerioVpnServerStatusRow.k_addClassName('inactive');
k_vpnStatus = k_form.k_disabledText;
}
this.k_kerioVpnServerStatus.k_setValue({
k_status: k_vpnStatus
});
if (!k_myKerioSettings.enabled) {
this.k_myKerioStatus.k_addClassName('inactive');
this.k_myKerioStatusElement.k_setValue({
k_link: '',
k_status: k_form.k_disabledText
});
}
else {
this.k_myKerioStatus.k_removeClassName('inactive');
if (!k_myKerioStatus.connected) {
k_widgetStatusOk = false;
this.k_myKerioStatusElement.k_setValue({
k_link: k_tr('Go to %1','wlibCommon', {k_args: [k_tr('Remote Services', 'menuTree')]}),
k_status: k_tr('Disconnected.', 'systemStatus')
});
} else if (!k_myKerioStatus.paired) {
this.k_myKerioStatusElement.k_setValue({
k_link: k_tr('Go to %1','wlibCommon', {k_args: [k_tr('Remote Services', 'menuTree')]}),
k_status: k_tr('Not added.', 'systemStatus')
});
} else {
this.k_myKerioStatusElement.k_setValue({
k_link: '',
k_status: k_form.k_workingText
});
}
}
this.k_appManagerStatus.k_removeClassName('inactive');
if (k_appManagerStatus.status !== 'ApplianceRegistered') {
this.k_appManagerStatusElement.k_setValue({
k_link: '',
k_status: k_tr('Not added.', 'systemStatus')
});
} else if (!k_appManagerStatus.connectionStatus) {
k_widgetStatusOk = true;
this.k_appManagerStatusElement.k_setValue({
k_link: '',
k_status: k_tr('Disconnected.', 'systemStatus')
});
} else {
this.k_appManagerStatusElement.k_setValue({
k_link: '',
k_status: k_form.k_workingText
});
}
if (!this.k_getParentWidget().k_extWidget) {
return;
}
this.k_getParentWidget().k_updateStatus(k_widgetStatusOk ? 'ok' : 'error');
},
k_notifications: {
k_callback: function(k_notifications) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
NotificationType = k_CONSTANTS.NotificationType,
k_i, k_cnt, k_item;
k_cnt = k_notifications.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_notifications[k_i];
if (NotificationType.NotificationUpdate === k_item.type) {
this.k_setUpdateStatus({newVersion: true});
return;
}
}
}
},

k_onClose: function() {
kerio.waw.shared.k_tasks.k_remove(this.k_ANIMATE_CLOCKS_TASK_ID, true);
}
};
k_form = new kerio.waw.ui.K_WawTileForm(k_objectName, k_formCfg);
k_form.k_addReferences({
k_ANIMATE_CLOCKS_TASK_ID: 'k_animateUptime',
k_uptimeSeconds: 0,
k_uptime: k_form.k_getItem('k_uptime'),
k_updateStatusElement: k_form.k_getItem(k_UPDATE_ID + k_VALUE_FIELD_ID),
k_antivirusStatusElement: k_form.k_getItem(k_ANTIVIRUS_ID + k_VALUE_FIELD_ID),
k_antivirusStatus: k_form.k_getItem(k_ANTIVIRUS_ID),
k_ipsStatusElement: k_form.k_getItem(k_IPS_ID + k_VALUE_FIELD_ID),
k_ipsStatus: k_form.k_getItem(k_IPS_ID),
k_kwfStatusElement: k_form.k_getItem(k_KWF_ID + k_VALUE_FIELD_ID),
k_kwfStatus: k_form.k_getItem(k_KWF_ID),
k_appStatusElement: k_form.k_getItem(k_APP_ID + k_VALUE_FIELD_ID),
k_appStatus: k_form.k_getItem(k_APP_ID),
k_ipsecServerStatusRow: k_form.k_getItem(k_IPSEC_SERVER_ID),
k_ipsecServerStatus: k_form.k_getItem(k_IPSEC_SERVER_ID + k_VALUE_FIELD_ID),
k_kerioVpnServerStatusRow: k_form.k_getItem(k_KVPN_SERVER_ID),
k_kerioVpnServerStatus: k_form.k_getItem(k_KVPN_SERVER_ID + k_VALUE_FIELD_ID),
k_myKerioStatus: k_form.k_getItem(k_MY_KERIO_ID),
k_myKerioStatusElement: k_form.k_getItem(k_MY_KERIO_ID + k_VALUE_FIELD_ID),
k_appManagerStatus: k_form.k_getItem(k_APP_MANAGER_ID),
k_appManagerStatusElement: k_form.k_getItem(k_APP_MANAGER_ID + k_VALUE_FIELD_ID),
k_notAvaibleText: k_notAvaibleText,
k_notAvaibleUpdates: k_notAvaibleUpdates,
k_unlicensedText: k_unlicensedText,
k_disabledText: k_disabledText,
k_workingText: k_workingText,
k_PRODUCT_INFO_REQUEST: 0,
k_UPDATE_CHECKER_REQUEST: 1,
k_ANTIVIRUS_GET_REQUEST: 2,
k_ANTIVIRUS_STATUS_REQUEST: 3,
k_IPS_GET_REQUEST: 4,
k_IPS_STATUS_REQUEST: 5,
k_HTTP_POLICY_REQUEST: 6
});
kerio.waw.shared.k_tasks.k_add({
k_id: k_form.k_ANIMATE_CLOCKS_TASK_ID,
k_interval: 1000, k_scope: k_form,
k_run: function(){
var
k_formatElapsedTime = kerio.waw.shared.k_methods.k_formatElapsedTime;
this.k_uptimeSeconds++;
this.k_uptime.k_setValue(k_formatElapsedTime({hour:0, min:0, sec: this.k_uptimeSeconds}));
return true;
},
k_startNow: true,
k_startSuspended: true
});
this.k_addControllers(k_form);
return k_form;
}, k_addControllers: function (k_kerioWidget) {
k_kerioWidget.k_addReferences({

k_setUpdateStatus: function(k_status) {
var
k_STATUS_TYPES = kerio.waw.shared.k_CONSTANTS.UpdateStatus,
k_tr = kerio.lib.k_tr;
if (k_STATUS_TYPES.UpdateStatusCheckFailed === k_status.status || k_STATUS_TYPES.UpdateStatusUpgradeFailed === k_status.status) {
this.k_updateStatusElement.k_setValue({
k_link: k_tr('Go to Update Checker', 'systemStatus'),
k_blueLink: '',
k_status: k_tr('Update failed.', 'systemStatus')
});
return false;
}
else {
if(k_status.newVersion) {
this.k_updateStatusElement.k_setValue({
k_link: '',
k_blueLink: k_tr('Go to Update Checker', 'systemStatus'),
k_status: k_tr('Update available.', 'systemStatus')
});
}
else {
this.k_updateStatusElement.k_setValue({
k_link: '',
k_blueLink: '',
k_status: k_tr('Up to date', 'systemStatus')
});
}
return true;
}
}
});
} };

kerio.waw.ui.tileTrafficChart = {
k_init: function(k_objectName, k_initParams) {
var
k_tr = kerio.lib.k_tr,
k_localNamespace = k_objectName + '_',
k_graphPanel,
k_form, k_formCfg;
if (!kerio.waw.shared.k_data.k_dashboartTrafficChart) {
this.k_initSharedHandler();
}
k_graphPanel = new kerio.lib.K_ContentPanel(k_localNamespace + 'k_graph', {
k_height: 350,
k_html: ''
});
k_formCfg = {
k_labelWidth: 1,
k_isLabelHidden: true,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_container',
k_id: 'k_chartSelection',
k_isHidden: false,
k_items: [
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_display',
k_value: k_tr('Chart:', 'trafficStatisticsList'),
k_isSecure: true,
k_width: 70,
k_isLabelHidden: true
},
{
k_type: 'k_select',
k_id: 'k_select',
k_isLabelHidden: true,
k_fieldDisplay: 'name',
k_fieldValue: 'id',
k_fieldIconClassName: 'k_iconClass',
k_localData: []
}
]
},
{
k_type: 'k_row',
k_style: 'margin-top: 10px',
k_items: [
'->',
{
k_type: 'k_formButton',
k_id: 'k_button',
k_caption: k_tr('Show Chart', 'trafficStatisticsList'),
k_mask: false,
k_onClick: function(k_form) {
k_form.k_chartId = k_form.k_select.k_getValue();
k_form.k_chartName = k_form.k_select.k_getText();
k_form.k_tile.k_setTitle(kerio.lib.k_htmlEncode(k_form.k_chartName));
k_form.k_chartSelection.k_setVisible(false);
k_form.k_getItem('k_graphContainer').k_setVisible(true);
if (k_form.k_chart) {
k_form.k_chart.k_syncSize();
}
k_form.k_chartPane.k_setVisible(true);
k_form.k_tile.k_onContentChanged();
k_form.k_loadData();
}
}
]
}
]
},
{
k_type: 'k_container',
k_id: 'k_chart',
k_isHidden: true,
k_items: [
{
k_type: 'k_container',
k_height: 170,
k_id: 'k_graphContainer',
k_className: 'ext4Charts',
k_content: k_graphPanel
}
]
},
{
k_type: 'k_display',
k_id: 'k_noData',
k_isHidden: true,
k_value: k_tr('There are no data for this chart.', 'trafficStatisticsList') + ' ' + '<a id="k_selectChart">' + k_tr('Select another chart', 'trafficStatisticsList') + '</a>',
k_isSecure: true,
k_onLinkClick: this.k_selectChart
}
],
k_tile: k_initParams.k_tile,
k_isSelectable: false,
k_settings: {
k_items: [
{
k_id: 'k_backToSelectCharts',
k_caption: k_tr('Select chart', 'systemHealth'),
k_onClick: this.k_selectChart
},
{
k_caption: k_tr('Go to Traffic Charts', 'systemHealth'),
k_onClick: function() {
var
k_tile = this.k_getParentWidget();
kerio.waw.status.k_currentScreen.k_switchPage('trafficCharts', {k_trafficChartId: k_tile.k_content.k_chartId});
}
}
]
},
k_initTile: function() {
this.k_loadData();
},

k_loadData: function() {
var
k_WAW_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_startTime;
if (this._k_isClosed || !kerio.lib.K_TimeChart) {
return;
}
if (this.k_chartId) {
k_startTime = this.k_chartStartTime || Math.floor(new Date().getTime() * 0.001);
k_startTime -= k_WAW_CONSTANTS.k_DASHBOARD_CHARTS.k_SAFE_LENGTH; kerio.waw.shared.k_data.k_dashboartTrafficChart.k_requestData(this, {
type: k_WAW_CONSTANTS.k_DASHBOARD_CHARTS.k_INTERVAL,
startSampleTime: k_startTime,
id: this.k_chartId
});
}
else {
kerio.waw.shared.k_data.k_dashboartTrafficChart.k_getChartList(this, true); }
},

k_onDeactivate: function() {
if (this.k_chart) {
this.k_chart.k_bypassDomRelease();
}
},

k_onActivate: function() {
if (this.k_chart) {
if (!this.k_chart.k_bypassDomRestore()) {
this.k_chart.k_destroy(); this.k_chart = undefined; this.k_loadData();        }
}
},

k_onClose: function() {
kerio.waw.shared.k_data.k_dashboartTrafficChart.k_unregister(this);
}
};
k_form = new kerio.waw.ui.K_WawTileForm(k_objectName, k_formCfg);
k_form.k_addReferences({
k_DATE_TIME_FORMATS: kerio.waw.shared.k_CONSTANTS.k_DATE_TIME_FORMATS,
k_graphPanelChart: k_graphPanel,
k_chart: null,
_k_isInboundVisible: true,
_k_isOutboundVisible: true,
_k_samples: null,
_k_formatNumber: function(k_number, k_units) {
return kerio.waw.shared.k_methods.k_formatDataUnits({k_value: k_number, k_units: k_units, k_outputUnits: 'Bytes', k_isInTime: true}).k_string;
},
_k_translations: {
k_defaultTitle:  k_tr('Traffic Chart', 'dashboardList'),
k_now:           k_tr('Now', 'common')
},
k_chartId: null,
k_chartName: '',
k_chartStartTime: 0,
k_chartSelection: k_form.k_getItem('k_chartSelection'),
k_chartPane: k_form.k_getItem('k_chart'),
k_select: k_form.k_getItem('k_select'),
k_noData: k_form.k_getItem('k_noData')
}); k_form.k_select.k_extWidget.on('afterrender', this.k_onAfterRender, k_form.k_select.k_extWidget);
this.k_addControllers(k_form);
return k_form;
}, 
k_onAfterRender: function() {
(function(){
this.focus();
this.initList();
this.onTriggerClick();
}).defer(25, this);
},

k_addControllers: function (k_kerioWidget) {
k_kerioWidget.k_addReferences({

k_getUserSettings: function() {
return {
'chartId': this.k_content.k_chartId,
'chartName': this.k_content.k_chartName
};
},

k_setUserSettings: function(k_settings, k_keepListCollapsed) {
var
k_chartId = k_settings.chartId,
k_chartName = k_settings.chartName;
this.k_chartId = k_chartId;
if (k_chartId) {
if (!k_chartName || '' === k_chartName) {
k_chartName = this._k_translations.k_defaultTitle;
}
this.k_tile.k_setTitle(kerio.lib.k_htmlEncode(k_chartName));
this.k_chartSelection.k_setVisible(false);
this.k_chartPane.k_setVisible(true);
this.k_chartId = k_chartId;
this.k_chartName = k_chartName;
}
else {
this.k_tile.k_setTitle(this._k_translations.k_defaultTitle);
this.k_chartPane.k_setVisible(false);
this.k_chartSelection.k_setVisible(true);
if (this.k_select.k_extWidget.el && !this.k_select.k_extWidget.isExpanded() && true !== k_keepListCollapsed) {
this.k_select.k_extWidget.onTriggerClick();
}
this.k_chartID = undefined;
this.k_chartName = '';
}
this.k_noData.k_setVisible(false);
},

k_drawGraph: function(k_data, k_time) {
var
k_canvasId = 'k_graphPanelChart',
k_chartCfg, k_chart,
k_samples;
if (!k_data.data || !k_time) {
this.k_chartPane.k_setVisible(false);
this.k_noData.k_setVisible(true);
return;
}
this.k_chartPane.k_setVisible(true);
this.k_noData.k_setVisible(false);
k_data = this._k_processData(k_time, k_data);
k_samples = k_data;
this._k_samples = k_data;
this.k_data = k_data;
if (!this.k_chart) {
k_chartCfg = {
k_container: this[k_canvasId],
k_height: 100,
k_xAxis: {
k_fieldId: 'time',
k_renderer: function(k_value, k_data) {
if (!this.k_extWidget) {
return {k_data: ''};
}
if (k_value === k_data[0].time) {
return { k_data: this.k_relatedWidget._k_translations.k_now };
}
var
k_grid = this.k_relatedWidget,
k_date = new Date(k_value),
k_format = k_grid.k_DATE_TIME_FORMATS.k_TIME_SEC,
k_time = k_date.format(k_format);
return {
k_data: k_time
};
}
},
k_yAxis: {
k_minValue: 0,
k_maxValue: k_data.k_max,
k_ticks: kerio.waw.shared.k_CONSTANTS.k_CHART_TICKS_COUNT.k_TRAFFIC,
k_renderer: function (k_value) {
if (this.k_relatedWidget && this.k_relatedWidget.k_data) {
return kerio.waw.shared.k_methods.k_trafficChartRenderer(k_value, this.k_relatedWidget.k_data.k_max, this.k_relatedWidget.k_data.k_units);
}
return {
k_data: kerio.waw.shared.k_methods.k_formatDataUnits({
k_value: k_value,
k_isInTime: true,
k_units: kerio.waw.shared.k_DEFINITIONS.k_DATA_UNITS_ORDERED[0],
k_numberFormat: {
k_decimalPlaces: 0
}
}).k_string
};
}
},
k_series: [
{
k_fieldId: 'inbound',
k_color: 0,
k_label: this._k_getSerieLabel(true, 0, 0)
},
{
k_fieldId: 'outbound',
k_color: 1,
k_label: this._k_getSerieLabel(false, 0, 0)
}
],
k_legend: false
};
k_chartCfg.k_relatedWidget = this;
k_chart = new kerio.lib.K_TimeChart(this.k_id + '_' + 'k_timeChart', k_chartCfg);
k_chart.k_relatedWidget = this;
this.k_chart = k_chart;
} if (k_samples.k_units === kerio.waw.shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_Bytes && 10 > k_samples.k_max) {
k_samples.k_max = 10; }
this.k_chart.k_setAxes({
k_yMaxValue: k_samples.k_max
});
k_chartCfg = {
k_unit: kerio.waw.shared.k_CONSTANTS.k_DASHBOARD_CHARTS.k_TICK_UNIT,
k_step: kerio.waw.shared.k_CONSTANTS.k_DASHBOARD_CHARTS.k_TICK_STEP,
k_maxValue: k_data.k_endTime,
k_minValue: k_data.k_startTime
};
this.k_chart.k_setTimeAxis(k_chartCfg);
this.k_chart.k_setData(k_data.k_data);
this.k_chart.k_syncSize();
}, 
_k_processData: function(k_endTime, k_data) {
var
k_shared = kerio.waw.shared,
k_DASHBOARD_CHARTS = k_shared.k_CONSTANTS.k_DASHBOARD_CHARTS,
k_values = k_data.data,
k_out,
k_interval,
k_i, k_cnt;
k_endTime *= 1000; k_out = {
k_endTime: k_endTime,
k_startTime: k_endTime - k_DASHBOARD_CHARTS.k_LENGTH*1000, k_data: [],
k_max: k_data.totalMax,
k_units: k_data.totalUnits,
k_maxIn: k_data.maxIn,
k_maxOut: k_data.maxOut,
k_avgIn: k_data.averageIn,
k_avgOut: k_data.averageOut
};
k_interval = k_DASHBOARD_CHARTS.k_SAMPLE_LENGTH * 1000; for (k_i = 0, k_cnt = k_values.length; k_i < k_cnt; k_i++) {
k_out.k_data.push({
time: k_endTime,
inbound: k_values[k_i].inbound,
outbound: k_values[k_i].outbound
});
k_endTime -= k_interval; }
if (!k_out.k_data.length) {
k_out.k_data.push({
time: k_out.k_endTime,
inbound: 0,
outbound: 0
});
}
return k_out;
}, 
_k_getSerieLabel: function(k_incoming, k_avg, k_max, k_units) {
k_avg = this._k_formatNumber(k_avg, k_units);
k_max = this._k_formatNumber(k_max, k_units);
if (k_incoming) {
return kerio.lib.k_tr('Incoming', 'dashboard');
}
else {
return kerio.lib.k_tr('Outgoing', 'dashboard');
}
}
});
}, 
k_initSharedHandler: function() {
var K_Constructor = this.k_dashboartTrafficChart._k_constructor;
Ext.extend(K_Constructor, Ext.util.Observable, this.k_dashboartTrafficChart);
kerio.waw.shared.k_data.k_dashboartTrafficChart = new K_Constructor();
}, 
k_dashboartTrafficChart: {

_k_constructor: function() {
this.addEvents({
k_loadData: true
});
this._k_tiles = [];
this._k_requests = [];  this._k_sendTiles = []; this._k_loadPending = 0; this._k_chartList = [];
this._k_chartIds  = []; this.on('k_loadData', this._k_loadData, this, {
buffer: 100
});
},

k_getChartList: function(k_tile, k_forceRefresh) {
this.k_register(k_tile);
k_tile.k_select.k_setData(this._k_chartList, false, k_tile.k_select.k_getValue()); if (k_forceRefresh) {
this.fireEvent('k_loadData'); }
},

k_requestData: function(k_tile, k_params) {
var k_index = this.k_register(k_tile);
if (false === k_index) {
this.k_requestData.defer(100, this, [k_tile, k_params]); return;
}
this._k_requests[k_index] = {
k_jsonRpc: {
method: 'TrafficStatistics.getHistogramInc',
params: k_params
}
};
this.fireEvent('k_loadData'); },

k_register: function(k_tile) {
var k_index = this._k_tiles.indexOf(k_tile);
if (-1 === k_index) {
if (this.k_isRequestPending()) {                 return false;
}
k_index = this._k_tiles.length;
this._k_tiles.push(k_tile);
}
return k_index;
},

k_unregister: function(k_tile) {
var k_index = this._k_tiles.indexOf(k_tile);
if (-1 < k_index) {
this._k_tiles.splice(k_index, 1);
this._k_requests.splice(k_index, 1);
if (this.k_isRequestPending() && -1 < this._k_sendTiles.indexOf(k_tile)) { this._k_sendTiles[this._k_sendTiles.indexOf(k_tile)] = null;     }
this.fireEvent('k_loadData'); }
},

k_isRequestPending: function() {
return (this._k_loadPending && !kerio.waw.requests.k_isAborted(this._k_loadPending));
},

_k_setPendingRequest: function(k_request) {
if (k_request) {
this._k_loadPending = k_request || 0;
}
else {
this._k_loadPending = 0;
}
},

_k_loadData: function() {
if (this.k_isRequestPending()) {
return;
}
var
k_i, k_cnt,
k_requests = [];
this._k_sendTiles = []; for (k_i = 0, k_cnt = this._k_tiles.length; k_i < k_cnt; k_i++) {
if (!this._k_requests[k_i] || !this._k_tiles[k_i].k_chartId) {
continue; }
k_requests.push(this._k_requests[k_i]);
this._k_sendTiles.push(this._k_tiles[k_i]);
} k_requests.push({
k_jsonRpc: {
method: 'TrafficStatistics.get',
params: {
refresh: true, query: {
start: 0,
limit: kerio.waw.shared.k_CONSTANTS.k_DASHBOARD_CHARTS.k_MAX_TRAFFIC_CHARTS,
orderBy: [
{columnName: 'name', direction: 'Asc'}
]
}
}
},
k_callback: this._k_loadListCallback,
k_scope: this
});
this._k_setPendingRequest(kerio.waw.requests.k_sendBatch(k_requests, {
k_mask: false,
k_isSilent: true,
k_callback: this._k_loadDataCallback,
k_scope: this
}));
},

k_getMaxY: kerio.waw.shared.k_methods.k_charts.k_getMaxY,

_k_loadDataCallback: function(k_response, k_success) {
var
k_shared = kerio.waw.shared,
k_UNITS = k_shared.k_DEFINITIONS.k_DATA_UNITS_ORDERED,
k_requests = this._k_requests,
k_tiles = this._k_sendTiles,
k_getMaxY = this.k_getMaxY,
k_isValidData = true,
k_chartStartTime,
k_i, k_cnt,
k_data,
k_tile,
k_chart;
this._k_setPendingRequest(false); if (!k_success || 0 === k_requests.length || !(k_response instanceof Array)) { return;
}
k_response.pop(); for (k_i = 0, k_cnt = k_response.length; k_i < k_cnt; k_i++) {
k_data = k_response[k_i].hist;
k_chartStartTime = k_response[k_i].sampleTime;
k_data.totalMax = k_getMaxY([k_data.maxIn, k_data.maxOut]);
k_data.totalUnits = k_data.units;
if (0 === k_UNITS.indexOf(k_data.units) && k_data.totalMax < 16) {
k_data.totalMax = 16; }
k_tile = k_tiles[k_i];
k_tile.k_chartStartTime = k_chartStartTime;
k_chart = this._k_chartList[this._k_chartIds.indexOf(k_tile.k_chartId)]; if (!k_tile || k_tile._k_isClosed) {
continue; }
if (!k_chart) { if (this._k_chartList.length) {
k_tile.k_setUserSettings({}, true); k_isValidData = false;
} }
else { if (k_tile.k_chartName !== k_chart.name) {
k_tile.k_chartName = k_chart.name;
k_tile.k_tile.k_setTitle(kerio.lib.k_htmlEncode(k_chart.name));
k_tile.k_tile.k_onContentChanged();
}
}
if (k_isValidData) {
k_tile.k_drawGraph(k_data, (new Date() / 1000) - k_shared.k_CONSTANTS.k_CLIENT_SERVER_OFFSET_SECONDS);
}
}
k_shared.k_methods.k_unmaskMainScreen();
},

_k_loadListCallback: function(k_response, k_success) {
if (!k_success) {
return;
}
var
TrafficStatisticsType = kerio.waw.shared.k_CONSTANTS.TrafficStatisticsType,
k_charts = k_response.list,
k_cnt = k_response.totalItems,
k_rendererData,
k_i, k_item;
this._k_chartIds = [];
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_charts[k_i];
this._k_chartIds.push(k_item.id);
switch(k_item.type) {
case TrafficStatisticsType.TrafficStatisticsInterface:
k_rendererData = kerio.waw.shared.k_methods.k_formatInterfaceName(k_item, {
type: k_item.interfaceType,
enabled: true
});
k_item.k_iconClass = k_rendererData.k_iconCls;
break;
case TrafficStatisticsType.TrafficStatisticsTrafficRule:
k_item.k_iconClass = 'smallIcon trafficRules';
break;
case TrafficStatisticsType.TrafficStatisticsBandwidthRule:
k_item.k_iconClass = 'smallIcon bandwidthManagement';
break;
default:
k_item.k_iconClass = '';
}
}
this._k_chartList = k_charts;
for (k_i = 0, k_cnt = this._k_tiles.length; k_i < k_cnt; k_i++) {
this.k_getChartList(this._k_tiles[k_i]);
} }
},

k_selectChart: function(k_form) {
if (!k_form || 'function' !== typeof k_form.k_setUserSettings) {
k_form = this.k_getParentWidget().k_content; }
k_form.k_setUserSettings({});
}
}; 
kerio.waw.ui.tileLicense = {
k_init: function(k_objectName, k_initParams) {
var
k_tr = kerio.lib.k_tr,
k_form, k_formCfg,
k_titleWidth = 200;
k_formCfg = {
k_className: 'systemStatus',
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_row',
k_items: [
{
k_id: 'licenseCaption',
k_type: 'k_display',
k_isSecure: true,
k_value: k_tr('License Number:', 'tileLicense'),
k_width: k_titleWidth,
k_isLabelHidden: true
},
{
k_id: 'license',
k_type: 'k_display',
k_isSecure: true,
k_isLabelHidden: true,
k_value: '',
k_onLinkClick: function(k_form, k_item) {
kerio.waw.shared.k_methods.k_gotoRegister(k_form, k_item, 'k_gotoRegister');
}
}
]
},
{
k_type: 'k_row',
k_id: 'k_companyRow',
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_value: k_tr('Company:', 'tileLicense'),
k_width: k_titleWidth,
k_isLabelHidden: true
},
{
k_id: 'company',
k_type: 'k_display',
k_isLabelHidden: true,
k_value: ''
}
]
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_value: k_tr('Licensed users:', 'tileLicense'),
k_width: k_titleWidth,
k_isLabelHidden: true
},
{
k_id: 'usersDevices',
k_type: 'k_display',
k_isLabelHidden: true,
k_value: ''
}
]
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_display',
k_id: 'k_productExpiraction',
k_isSecure: true,
k_template: '{k_text}',
k_value: {
k_text: k_tr('Product expiration:', 'tileLicense')
},
k_width: k_titleWidth,
k_isLabelHidden: true
},
{
k_id: 'licenseExpired',
k_type: 'k_display',
k_isLabelHidden: true,
k_value: ''
}
]
},
{
k_type: 'k_row',
k_id: 'k_softwareMaintenenceRow',
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_value: k_tr('Software Maintenance expiration:', 'tileLicense'),
k_width: k_titleWidth,
k_isLabelHidden: true
},
{
k_id: 'softwareMainteneceExpired',
k_type: 'k_display',
k_isLabelHidden: true,
k_value: ''
}
]
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_value: k_tr('Active users / devices:', 'tileLicense'),
k_width: k_titleWidth,
k_isLabelHidden: true
},
{
k_id: 'activeUsersDevices',
k_type: 'k_display',
k_isLabelHidden: true,
k_value: ''
}
]
},
{
k_type: 'k_row',
k_id: 'k_antivirusRow',
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_value: k_tr('Antivirus:', 'tileLicense'),
k_width: k_titleWidth,
k_isLabelHidden: true
},
{
k_id: 'antivirus',
k_type: 'k_display',
k_isLabelHidden: true,
k_value: ''
}
]
},
{
k_type: 'k_row',
k_id: 'k_kwfRow',
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_value: k_tr('Kerio Control Web Filter:', 'tileLicense'),
k_width: k_titleWidth,
k_isLabelHidden: true
},
{
k_id: 'kwf',
k_type: 'k_display',
k_isLabelHidden: true,
k_value: ''
}
]
}
],
k_tile: k_initParams.k_tile,
k_initTile: function() {
kerio.waw.requests.on('afterLicenseUpdate', this.k_loadDataCallback, this);
this.k_loadData();
},
k_loadData: function() {
kerio.waw.requests.k_updateLicense();
},
k_loadDataCallback: function() {
kerio.waw.requests.k_sendBatch(this._k_loadRequest.k_requests, this._k_loadRequest.k_options);
},
k_notifications: {
k_callback: function(k_notifications) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
NotificationType = k_CONSTANTS.NotificationType,
k_licenseNotification = false,
k_subscriptionNotification = false,
k_parentWidget,
k_i, k_cnt,
k_item;
k_cnt = k_notifications.length;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_notifications[k_i];
switch(k_item.type) {
case NotificationType.NotificationSubWillExpire:
this.k_softwareMainteneceExpired.k_addClassName('error');
k_subscriptionNotification = true;
break;
case NotificationType.NotificationSubExpired:
this.k_softwareMainteneceExpired.k_addClassName('error');
k_subscriptionNotification = true;
break;
case NotificationType.NotificationLicWillExpire:
this.k_licenseExpired.k_addClassName('error');
k_licenseNotification = true;
break;
case NotificationType.NotificationLicExpired:
this.k_licenseExpired.k_addClassName('error');
k_licenseNotification = true;
break;
}
}
if (false === k_subscriptionNotification) {
this.k_softwareMainteneceExpired.k_removeClassName('error');
}
if (false === k_licenseNotification) {
this.k_licenseExpired.k_removeClassName('error');
}
k_parentWidget = this.k_getParentWidget();
if (k_parentWidget) {
if (!k_parentWidget.k_extWidget) {
return;
}
k_parentWidget.k_updateStatus(k_subscriptionNotification || k_licenseNotification ? 'error' : 'ok');
}
}
}
};
k_form = new kerio.waw.ui.K_WawTileForm(k_objectName, k_formCfg);
kerio.lib.k_widgets.dashboardList.k_extWidget.on('k_licenseUpdate',

function(k_dashboard) {
var
k_columnIndex,
k_cntColumns,
k_columnItems,
k_column,
k_tile,
k_i, k_cnt;
for (k_columnIndex = 0, k_cntColumns = k_dashboard._k_getColumnCount(); k_columnIndex < k_cntColumns; k_columnIndex++) {
k_column = k_dashboard._k_getColumn(k_columnIndex);
k_columnItems = k_column.k_items;
for (k_i = 0, k_cnt = k_columnItems.length; k_i < k_cnt; k_i++) {
k_tile = k_columnItems[k_i]._kx.k_owner;
if ('tileLicense' === k_tile.k_type && k_tile.k_extWidget.rendered) {
k_tile.k_content.k_loadData();
return;
}
}
}
}
);
k_form.k_addReferences({
k_kwfRow: k_form.k_getItem('k_kwfRow'),
k_antivirusRow: k_form.k_getItem('k_antivirusRow'),
k_softwareMaintenenceRow: k_form.k_getItem('k_softwareMaintenenceRow'),
k_companyRow: k_form.k_getItem('k_companyRow'),
k_licenseExpired: k_form.k_getItem('licenseExpired'),
k_softwareMainteneceExpired: k_form.k_getItem('softwareMainteneceExpired'),
k_productExpiraction: k_form.k_getItem('k_productExpiraction'),
k_isAuditor: kerio.waw.shared.k_methods.k_isAuditor(),
k_licenseCapitonFullText: k_tr('License Number:', 'tileLicense'),
k_licenseCapitonTrialText: k_tr('Trial Number:', 'tileLicense'),
k_inactiveteRow: function(k_row) {
k_row.k_addClassName('inactive');
},
k_activeteRow: function(k_row) {
k_row.k_removeClassName('inactive');
},

k_getExpirationText: function(k_license, k_licenseType) {
var
k_tr = kerio.lib.k_tr,
k_ENGINE_CONSTANTS = kerio.lib.k_getSharedConstants(),
kerio_web_License = k_ENGINE_CONSTANTS.kerio_web_License,
k_RS_TRIAL_EXPIRED = k_ENGINE_CONSTANTS.kerio_web_rsTrialExpired,
k_i, k_cnt,
k_expiration,
k_expirationDate;
if (k_license.expirations) {
for (k_i = 0, k_cnt = k_license.expirations.length; k_i < k_cnt; k_i++) {
k_expiration = k_license.expirations[k_i];
if (k_expiration.date) {  k_expirationDate = new Date((k_expiration.date + new Date().getTimezoneOffset() * 60) * 1000);
k_expirationDate = k_expirationDate.format('Y-m-d');
}
if (k_licenseType === k_expiration.type) {
if (k_expiration.isUnlimited) {
return k_tr('Never', 'wlibSplashScreen');
}
if (0 >= k_expiration.remainingDays) {
if (k_RS_TRIAL_EXPIRED === k_license.regType) {
return kerio_web_License === k_licenseType ? k_tr('Trial expired', 'wlibSplashScreen') : k_tr('Never', 'wlibSplashScreen');
}
else {
return k_tr('%1 (expired)', 'wlibSplashScreen', {k_args: [k_expirationDate]});
}
}
else if (k_expiration.date) {
return k_expirationDate;
}
}
}
}
return '';
}, k_setTileData: function(k_response, k_success) {
if (!k_success || !this.k_canPerformAction()) {
return;
}
var
k_methods = kerio.waw.shared.k_methods,
k_tr = kerio.lib.k_tr,
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_license = k_CONSTANTS.k_SERVER.k_LICENSE,
k_webFilter = k_response[this._k_HTTP_POLICY_REQUEST].config,
k_webFilterText = '',
k_antivirus = k_response[this._k_ANTIVIRUS_REQUEST].config ? k_response[this._k_ANTIVIRUS_REQUEST].config.antivirus : {},
k_antivirusText = '',
kerio_web_SharedConstants = k_CONSTANTS.kerio_web_SharedConstants,
k_activeUsersDevices = k_response[this._k_PRODUCT_INFO_REQUEST],
k_activeUsersDevicesText = '',
k_data = {},
k_isUnregistredTrial = k_methods.k_isTrial(false),
k_isRegistredTrial = k_methods.k_isTrial(true),
k_licensedText = k_tr('Licensed', 'tileLicense'),
k_unlicensedText = k_tr('Unlicensed', 'tileLicense'),
k_licenseCaption = this.k_licenseCapitonFullText,
k_licenseText = k_license.Id,
k_users,
k_softwareMainteneceExpired,
k_licenseExpired;
k_licenseExpired = this.k_getExpirationText(k_license, kerio_web_SharedConstants.kerio_web_License);
if (k_isUnregistredTrial) {
k_licenseText = k_tr('Unregistered trial version.', 'tileLicense');
if (!this.k_isAuditor) {
k_licenseText += ' <a>' + k_tr('Register…', 'tileLicense') + '</a>';
}
k_softwareMainteneceExpired = k_unlicensedText;
this.k_inactiveteRow(this.k_softwareMaintenenceRow);
}
else if (k_isRegistredTrial) {
k_licenseCaption = this.k_licenseCapitonTrialText;
k_softwareMainteneceExpired = k_licenseExpired;
this.k_activeteRow(this.k_softwareMaintenenceRow);
}
else {
k_softwareMainteneceExpired = this.k_getExpirationText(k_license, kerio_web_SharedConstants.kerio_web_Subscription);
this.k_activeteRow(this.k_softwareMaintenenceRow);
}
if (0 === k_license.users) { k_users = k_tr('Unlimited', 'tileLicense');
}
else {
k_users = k_license.users;
}
if (k_isUnregistredTrial || (k_antivirus.internal.available && !k_antivirus.internal.expired)) {
k_antivirusText = k_licensedText;
this.k_activeteRow(this.k_antivirusRow);
} else {
k_antivirusText = k_unlicensedText;
this.k_inactiveteRow(this.k_antivirusRow);
}
if (k_CONSTANTS.UrlFilterStatus.UrlFilterNotLicensed === k_webFilter.status) {
k_webFilterText = k_unlicensedText;
this.k_inactiveteRow(this.k_kwfRow);
}
else {
this.k_activeteRow(this.k_kwfRow);
k_webFilterText = k_licensedText;
}
this.k_companyRow.k_setVisible(k_license.company);
k_activeUsersDevicesText = k_tr('%1 / %2', 'tileLicense', { k_args: [k_activeUsersDevices.accounts,k_activeUsersDevices.devices]});
k_data = {
licenseCaption: k_licenseCaption,
license: k_licenseText,
company: k_license.company,
usersDevices: k_users,
licenseExpired: k_licenseExpired,
softwareMainteneceExpired: k_softwareMainteneceExpired,
activeUsersDevices: k_activeUsersDevicesText,
antivirus: k_antivirusText,
kwf: k_webFilterText
};
this.k_setData(k_data);
this.k_notificationsCallback.call(this, kerio.waw.requests.k_getNotifications());
}
});
k_form.k_addReferences({
_k_HTTP_POLICY_REQUEST: 0,
_k_ANTIVIRUS_REQUEST: 1,
_k_PRODUCT_INFO_REQUEST: 2,
_k_loadRequest: {
k_requests: [
{
k_jsonRpc: {
method: 'ContentFilter.getUrlFilterConfig'
}
},
{
k_jsonRpc: {
method: 'Antivirus.get'
}
},
{
k_jsonRpc: {
method: 'ProductInfo.getUsedDevicesCount'
}
}
],
k_options: {
k_scope: k_form,
k_callback: k_form.k_setTileData,
k_mask: false
}
}
});
return k_form;
} };

kerio.waw.ui.tileVpn = {
k_init: function(k_objectName, k_initParams) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
InterfaceStatusType = k_CONSTANTS.InterfaceStatusType,
k_localNamespace = k_objectName + '_',
k_tr = kerio.lib.k_tr,
k_interfaceStatusMapped = [],
k_vpnTunnelsTable,
k_form, k_formCfg,
k_goToInterfaces;
k_vpnTunnelsTable = new kerio.waw.shared.k_widgets.K_CommonTable(
k_localNamespace + 'k_vpnTunnelsTable',
{
k_headers: [
{
k_caption: k_tr('Name', 'common')
},
{
k_caption: k_tr('Status', 'tileConnectivity')
}
],
k_columnClasses: [
]
}
);
k_goToInterfaces = function(k_form) {
k_form.k_tile.k_extWidget.removeClass.defer(100, k_form.k_tile.k_extWidget, ['mouseover']);
kerio.waw.status.k_currentScreen.k_gotoNode('interfaces');
};
k_formCfg = {
k_className: 'vpn line',
k_labelWidth: 1,
k_isLabelHidden: true,
k_items: [
{
k_type: 'k_row',
k_id: 'k_vpnServerRow',
k_className: 'k_vpnServerRow',
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_width: 99,
k_value: k_tr('VPN Server:', 'tileVpn')
},
{
k_type: 'k_display',
k_id: 'vpnServer',
k_isLabelHidden: true,
k_isSecure: true,
k_value: '',
k_onLinkClick: function(k_form, k_item, k_linkId) {
if ('interfaces' === k_linkId)  {
k_form.k_goToInterfaces(k_form, k_item, k_linkId);
}
else {
k_form.k_tile.k_extWidget.removeClass.defer(100, k_form.k_tile.k_extWidget, ['mouseover']);
kerio.waw.status.k_currentScreen.k_gotoNode('vpnClients');
}
}
}
]
},
{
k_type: 'k_container',
k_id: 'k_vpnTunnelsTableContainer',
k_height: 100,
k_content: k_vpnTunnelsTable
}
],
k_tile: k_initParams.k_tile,
k_settings: {
k_items: [
{
k_caption: kerio.lib.k_tr('Go to Interfaces', 'tileVpn'),
k_onClick: function(k_menu) {
kerio.waw.status.k_currentScreen.k_gotoNode('interfaces');
}
},
{
k_caption: kerio.lib.k_tr('Go to VPN Clients', 'tileVpn'),
k_onClick: function(k_menu) {
kerio.waw.status.k_currentScreen.k_gotoNode('vpnClients');
}
}
]
},
k_initTile: function() {
this.k_loadData();
},
k_loadData: function() {
kerio.waw.requests.k_sendBatch(this._k_loadRequest.k_request, this._k_loadRequest.k_options);
},
k_loadDataCallback: function(k_response, k_success) {
if (!k_success) {
return; }
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
k_VPN_SERVER_TYPE = k_CONSTANTS.InterfaceType.VpnServer,
k_VPN_TUNNEL_TYPE = k_CONSTANTS.InterfaceType.VpnTunnel,
InterfaceStatusType = k_CONSTANTS.InterfaceStatusType,
k_tr = kerio.lib.k_tr,
k_disableText = k_tr('Disabled', 'tileVpn'),
k_linkToInterfaces = ' <a class="error" id="interfaces">' + k_tr('Go to Interfaces', 'tileVpn') + '</a>',
k_linkToVpnclients = ' <a>' + k_tr('Show in the VPN Clients list', 'tileVpn') + '</a>',
k_list = k_response.list,
k_cnt = k_response.totalItems,
k_isOk = true,
k_isVpnServer = false,
k_data = {},
k_rowClass = '',
k_vpnTunnelsCnt = 0,
k_i,
k_item,
k_statusText;
for (k_i = 0; k_i < k_cnt; k_i++) {
k_item = k_list[k_i];
switch(k_item.type) {
case k_VPN_SERVER_TYPE:
k_isVpnServer = true;
k_statusText = k_item.details;
if (k_statusText.localizable && k_statusText.localizableMessage && k_statusText.localizableMessage.message) {
k_data.vpnServer = kerio.waw.shared.k_methods.k_translateErrorMessage(k_statusText.localizableMessage);
if (0 < k_statusText.localizableMessage.positionalParameters.length) {
k_data.vpnServer += "0" !== k_statusText.localizableMessage.positionalParameters[0] ? k_linkToVpnclients : '';
this.k_vpnServerRow.k_removeClassName('inactive');
}
else {
if(false === k_item.enabled) {
this.k_vpnServerRow.k_addClassName('inactive');
}
else {
k_isOk = false;
this.k_vpnServerRow.k_removeClassName('inactive');
}
k_data.vpnServer += k_linkToInterfaces;
}
} else {
k_data.vpnServer = k_statusText.fixedMessage;
}
break;
case k_VPN_TUNNEL_TYPE:
k_statusText = this.k_interfaceStatusMapped[k_item.linkStatus];
k_rowClass = 'active';
if (false === k_item.enabled) {
k_statusText = k_disableText;
k_rowClass = 'inactive';
}
else if (InterfaceStatusType.Down === k_item.linkStatus
|| InterfaceStatusType.Error === k_item.linkStatus
|| InterfaceStatusType.CableDisconnected === k_item.linkStatus
) {
k_rowClass = 'inactive';
}
this.k_vpnTunnelsTable.k_appendRow([k_tr('%1:', 'tileVpn', {k_args: [k_item.name]}), k_statusText], k_rowClass);
k_vpnTunnelsCnt++;
break;
}
}
if (false === k_isVpnServer) {
k_data.vpnServer = k_tr('VPN Server is not available', 'tileVpn');
}
this.k_vpnTunnelsTableContainer.k_setVisible(0 !== k_vpnTunnelsCnt);
this.k_setData(k_data);
this.k_vpnTunnelsTable.k_showData();
if (!this.k_getParentWidget().k_extWidget) {
return;
}
this.k_getParentWidget().k_updateStatus(k_isOk ? 'ok' : 'error');
}
};
k_form = new kerio.waw.ui.K_WawTileForm(k_objectName, k_formCfg);
k_interfaceStatusMapped[InterfaceStatusType.Up] = k_tr('Up', 'interfaceList');
k_interfaceStatusMapped[InterfaceStatusType.Down] = k_tr('Down', 'interfaceList');
k_interfaceStatusMapped[InterfaceStatusType.Backup] = k_tr('Backup', 'interfaceList');
k_interfaceStatusMapped[InterfaceStatusType.Error] = k_tr('Connectivity problem', 'interfaceList');
k_interfaceStatusMapped[InterfaceStatusType.Connecting] = k_tr('Connecting', 'interfaceList');
k_interfaceStatusMapped[InterfaceStatusType.Disconnecting] = k_tr('Disconnecting', 'interfaceList');
k_interfaceStatusMapped[InterfaceStatusType.CableDisconnected] = k_tr('Cable disconnected', 'interfaceList');
k_form.k_addReferences({
k_interfaceStatusMapped: k_interfaceStatusMapped,
k_vpnTunnelsTable: k_vpnTunnelsTable,
k_vpnServerRow: k_form.k_getItem('k_vpnServerRow'),
k_vpnTunnelsTableContainer: k_form.k_getItem('k_vpnTunnelsTableContainer'),
k_goToInterfaces: k_goToInterfaces,
_k_loadRequest: {
k_request: [
{
k_jsonRpc: {
method: 'Interfaces.get',
params: {
sortByGroup: true,
query: {
start: 0, limit: -1, orderBy: [
{columnName: 'name', direction: 'Asc'}
]
}
}
}
}
],
k_options: {
k_scope: k_form,
k_callback: k_form.k_loadDataCallback,
k_mask: false,
k_isSilent: true
}
}
});
return k_form;
}
};

kerio.waw.ui.tileHighAvailabilityList = {
k_init: function (k_objectName, k_initParams) {
var
k_CONSTANTS = kerio.waw.shared.k_CONSTANTS,
InterfaceStatusType = k_CONSTANTS.InterfaceStatusType,
k_localNamespace = k_objectName + '_',
k_tr = kerio.lib.k_tr,
k_form, k_formCfg,
k_titleWidth = 250,
k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor();
getTileSettingsItems = function () {
if (k_isAuditor) {
return [];
}
return [
{
k_caption: kerio.lib.k_tr('Go to High Availability', 'highAvailabilityList'),
k_onClick: function (k_menu) {
kerio.waw.status.k_currentScreen.k_gotoNode('highAvailability');
}
}
];
};
k_formCfg = {
k_labelWidth: 1,
k_isLabelHidden: true,
k_useStructuredData: true,
k_items: [
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_value: k_tr('Status:', 'highAvailabilityList'),
k_width: k_titleWidth,
k_isLabelHidden: true
},
{
k_icon: 'img/dots.png?v=8629',
k_className: 'ha_status statusGrey',
k_type: 'k_display',
k_width: k_titleWidth,
k_id: 'status',
k_value: {
k_info: "",
},
k_template: '<i class="icon"></i>{k_info}'
}
]
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_display',
k_isSecure: true,
k_value: k_tr('Health Check:', 'highAvailabilityList'),
k_width: k_titleWidth,
k_isLabelHidden: true
},
{
k_icon: 'img/dots.png?v=8629',
k_className: 'ha_status statusGrey',
k_type: 'k_display',
k_id: 'healthCheck',
k_width: k_titleWidth,
k_value: {
k_info: "",
},
k_template: '<i class="icon"></i>{k_info}'
}
]
},
{
k_type: 'k_row',
k_items: [
{
k_type: 'k_display',
k_className: 'haExtraText',
k_isSecure: true,
k_value: '',
k_id: 'healthCheckExtraTxt',
k_width: 2 * k_titleWidth,
k_isLabelHidden: true
}
]
}
],
k_tile: k_initParams.k_tile,
k_settings: {
k_items: getTileSettingsItems()
},
k_initTile: function () {
},
k_loadData: function () {
},
k_loadDataCallback: function (k_response, k_success) {
},

k_onClose: function () {
kerio.waw.shared.k_tasks.k_remove(k_form.k_TILE_CHECK_HA_STATUS_TASK, true);
},
k_onActivate: function () {
kerio.waw.ui.tileHighAvailabilityList.startHaTask(k_form);
},
k_onDeactivate: function () {
kerio.waw.shared.k_tasks.k_remove(k_form.k_TILE_CHECK_HA_STATUS_TASK, true);
}
};
k_form = new kerio.waw.ui.K_WawTileForm(k_objectName, k_formCfg);
k_form.k_addReferences({
k_TILE_CHECK_HA_STATUS_TASK: 'k_tile_checkHAStatusTask',
k_HA_TASK_INTERVAL: 3000,
mockPointer: 0,
mockPointerHealth: 0,
k_WARNING_KERIO_SLAVE: k_tr('Kerio Control Slave is the active device. Configuration sync is not active, ' +
'and any changes done on the Slave will not be synchronized with the Master.', 'highAvailabilityList'),
k_ENABLED_ACTIVE_PASSIVE: k_tr('Enabled - Active/Passive', 'highAvailabilityList')
});
this.startHaTask(k_form);
return k_form;
},
startHaTask: function (k_form) {
if (!kerio.waw.shared.k_tasks.k_isDefined(k_form.k_TILE_CHECK_HA_STATUS_TASK)) {
kerio.waw.shared.k_tasks.k_add({
k_id: k_form.k_TILE_CHECK_HA_STATUS_TASK,
k_scope: this,
k_interval: 3000,
k_run: function () {
kerio.lib.k_ajax.k_request({
k_requestOwner: null, k_jsonRpc: {
method: 'HighAvailability.getStatus',
params: {
sortByGroup: true,
query: {
start: 0,
limit: -1
}
}
},
k_onError: function () {
return true;
},
k_callback: function (k_response) {
var statusReport = k_response.k_decoded;
if( typeof statusReport.status == "undefined" ||
typeof statusReport.status.status == "undefined" ||
typeof statusReport.status.health == "undefined" ) {
return;
}
var k_statusElement = k_form.k_getItem('status');
var k_healthElement = k_form.k_getItem('healthCheck');
var k_healthExtraTxtElement = k_form.k_getItem('healthCheckExtraTxt');
var statusCls="";
switch(statusReport.status.status) {
case kerio.waw.shared.k_CONSTANTS.HAStatus.HADisabled:
statusCls = "statusGrey";
break;
case kerio.waw.shared.k_CONSTANTS.HAStatus.HAEnabledGreen:
statusCls="statusGreen";
break;
case kerio.waw.shared.k_CONSTANTS.HAStatus.HAEnabledYellow:
statusCls="statusYellow";
break;
}
var healthWarningTxt="";
var healthCls="";
switch(statusReport.status.health) {
case kerio.waw.shared.k_CONSTANTS.HAHealth.HAHealthDisabled:
healthCls="statusGrey";
break;
case kerio.waw.shared.k_CONSTANTS.HAHealth.HAHealthSlaveDown:
healthCls="statusYellow";
break;
case kerio.waw.shared.k_CONSTANTS.HAHealth.HAHealthMasterDown:
healthCls="statusRed";
healthWarningTxt=k_form.k_WARNING_KERIO_SLAVE;
break;
case kerio.waw.shared.k_CONSTANTS.HAHealth.HAHealthOk:
healthCls="statusGreen";
break;
case kerio.waw.shared.k_CONSTANTS.HAHealth.HAHealthHasProblem:
healthCls="statusYellow";
break;
case kerio.waw.shared.k_CONSTANTS.HAHealth.HAHealthPeerDown:
healthCls="statusRed";
break;
}
k_statusElement.k_removeClassName(['statusGrey', 'statusYellow',
'statusRed', 'statusGreen']);
k_statusElement.k_addClassName(statusCls);
k_healthElement.k_removeClassName(['statusGrey', 'statusYellow',
'statusRed', 'statusGreen']);
k_healthElement.k_addClassName(healthCls);
k_statusElement.k_setValue({k_info: statusReport.status.daemonText});
k_healthElement.k_setValue({k_info: statusReport.status.statusText});
if(!healthWarningTxt)
k_healthExtraTxtElement.k_setVisible(false);
else{
k_healthExtraTxtElement.k_setVisible(true);
k_healthExtraTxtElement.k_setValue(healthWarningTxt);
}
},
k_scope: this
});
}
});
}
kerio.waw.shared.k_tasks.k_start(k_form.k_TILE_CHECK_HA_STATUS_TASK);
}
};