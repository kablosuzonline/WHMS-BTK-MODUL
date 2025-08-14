
kerio.waw.ui.highAvailabilityList = {
k_init: function (k_objectName) {
var
k_tr = kerio.lib.k_tr,
k_localNamespace = k_objectName + '_',
k_shared = kerio.waw.shared,
k_WAW_CONSTANTS = k_shared.k_CONSTANTS,
k_WAW_DEFINITIONS = k_shared.k_DEFINITIONS,
k_isAuditor = k_shared.k_methods.k_isAuditor(),
k_toolbar,
k_toolbarCfg,
k_form,
k_formCfg,
k_virtualIpsGrid,
k_virtualIpsGridCfg,
k_checkTableConsistency;
k_virtualIpsGridCfg = {
k_id: 'virtualIpGrid',
k_isStateful: false,
k_className: 'gridWithSimpleTextAbove',
k_selectionMode: 'k_none',
k_isReadOnly: k_isAuditor,
k_columns: {
k_sorting: {
k_columnId: 'interfaceName'
},
k_items: [
{
k_columnId: 'interfaceName',
k_width: 150,
k_caption: k_tr('Name', 'common'),

k_renderer: function(k_value) {
var
k_shared = kerio.waw.shared,
k_rendererData = k_shared.k_methods.k_formatInterfaceName(
'',
{
'type':  k_shared.k_CONSTANTS.InterfaceType.Ethernet,
'enabled': true});
return {
k_iconCls: k_rendererData.k_iconCls,
k_data: k_value
};
},
k_editor: {
k_type: 'k_checkbox',
k_columnId: 'interfaceEnabled',

k_onChange: function(k_page, k_item, k_selectedValue) {
k_checkTableConsistency();
kerio.adm.k_framework.k_enableApplyReset();
}

}
},
{
k_type: 'k_fieldset',
k_columnId: 'systemName',
k_caption: k_tr('Interface Sys.Name', 'highAvailabilityList'),
k_width: 50
},
{
k_type: 'k_fieldset',
k_columnId: 'ipAddressV4',
k_caption: k_tr('IPv4 Address', 'highAvailabilityList'),
k_width: 100
},
{
k_type: 'k_fieldset',
k_columnId: 'ipAddressV6',
k_caption: k_tr('IPv6 Address', 'common'),
k_width: 100
},
{
k_type: 'k_fieldset',
k_columnId: 'virtualIpV4',
k_caption: k_tr('Virtual IPv4', 'highAvailabilityList'),
k_editor: {
k_type: 'k_text',
k_maxLength: 15,
k_validator: {
k_functionName: 'k_isIpAddress',
k_allowBlank: true,
k_inputFilter: k_WAW_DEFINITIONS.k_ipv4.k_allowedChars
},
k_onChange: function(k_form, k_element, k_value) {
k_shared.k_methods.k_allowOnlyIpv4Chars(k_form, k_element, k_value);
kerio.adm.k_framework.k_enableApplyReset(k_element.k_isValid());
}
},
k_width: 100,
k_renderer: function(k_value, k_data) {
var value = k_data.virtualIpV4;
var k_className = "";
if(!k_data.virtualIpV4 && k_data.interfaceEnabled){
k_className = 'inactive-virtual-ip';
value = k_tr('Double click to add virtual IP', 'highAvailabilityList');
}
if (value == "0.0.0.0")
value = "";
return {
k_data: value,
k_className: k_className
};
}
},
{
k_type: 'k_fieldset',
k_columnId: 'virtualIpV6',
k_caption: k_tr('Virtual IPv6', 'highAvailabilityList'),
k_editor: {
k_type: 'k_text',
k_maxLength: 39,
k_validator: {
k_allowBlank: true,
k_functionName: 'k_isIpv6Address',
k_inputFilter: k_WAW_DEFINITIONS.k_ipv6.k_allowedChars
},
k_onChange: function(k_form, k_element, k_value) {
k_shared.k_methods.k_allowOnlyIpv6Chars(k_form, k_element, k_value);
kerio.adm.k_framework.k_enableApplyReset(k_element.k_isValid());
}
},
k_renderer: function(k_value, k_data) {
var value = k_data.virtualIpV6;
var k_className = "";
if(value == "::"){
value = ""
}
return {
k_data: value,
};
},
k_width: 100
}
]
}, k_toolbars: {}
}; k_virtualIpsGrid = new kerio.adm.k_widgets.K_BasicList(k_localNamespace + 'virtualIpsGrid', k_virtualIpsGridCfg);


k_toolbarCfg = {
k_type: 'k_applyResetOnly',

k_onApply: function (k_toolbar) {
var
k_form = k_toolbar.k_relatedWidget;
if (!k_form.k_isValid()) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
return false;
}
k_form.k_sendData();
return false;
}, 
k_onReset: function (k_toolbar) {
k_toolbar.k_relatedWidget.k_applyParams();
}
}; k_toolbar = new kerio.adm.k_widgets.K_ActionToolbar(k_localNamespace + 'k_toolbar', k_toolbarCfg);
disableHaFields = function(value) {
k_form.k_setDisabled(['instanceMode', 'syncInterfaceName', 'deviceName', 'sharedSecret'], value);
k_virtualIpsGrid.k_setDisabled(value);
};
k_formCfg = {
k_onChange: kerio.adm.k_framework.k_enableApplyReset,
k_toolbars: k_isAuditor ? undefined : {k_bottom: k_toolbar},
k_items: [
{
k_type: 'k_fieldset',
k_height: 90,
k_caption: k_tr('High Availability', 'highAvailabilityList'),
k_labelWidth: 120,
k_items: [
{
k_icon: 'img/dots.png?v=8629',
k_className: 'ha_status statusGrey',
k_type: 'k_display',
k_id: 'status',
k_value: {
k_info: "",
},
k_template: '<i class="icon"></i>{k_info}',
k_caption: k_tr('Status:', 'highAvailabilityList'),
},
{
k_icon: 'img/dots.png?v=8629',
k_className: 'ha_status statusGrey',
k_type: 'k_display',
k_id: 'healthCheck',
k_value: {
k_info: "",
},
k_template: '<i class="icon"></i>{k_info}',
k_caption: k_tr('Health Check:', 'highAvailabilityList'),
},
{
k_type: 'k_display',
k_className: 'haExtraText',
k_isSecure: true,
k_value: '',
k_id: 'healthCheckExtraTxt',
k_isLabelHidden: true
}
]
},
{
k_type: 'k_fieldset',
k_caption: k_tr('Settings', 'highAvailabilityList'),
k_isResizeableVertically: true,
k_labelWidth: 120,
k_items: [
{
k_type: 'k_select',
k_id: 'haMode',
k_caption: k_tr('High Availability', 'highAvailabilityList') + ":",
k_width: 300,
k_localData: [
{'k_name': k_tr('Disabled', 'highAvailabilityList'), 'k_id': "haDisabled"},
{'k_name': k_tr('Active/Passive', 'highAvailabilityList'), 'k_id': "haActivePassive"}
],
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id',
k_value: 'disabled',
k_onChange: function(k_page, k_item, k_selectedValue){
if (k_selectedValue === 'haDisabled') {
disableHaFields(true);
} else {
disableHaFields(false);
}
}
},
{
k_type: 'k_select',
k_id: 'instanceMode',
k_isDisabled: false,
k_caption: k_tr('Instance Mode:', 'highAvailabilityList'),
k_width: 300,
k_localData: [
{'k_name': k_tr('Master', 'highAvailabilityList'), 'k_id': "haMaster"},
{'k_name': k_tr('Slave', 'highAvailabilityList'), 'k_id': "haSlave"}
],
k_fieldDisplay: 'k_name',
k_fieldValue: 'k_id'
},
{
k_type: 'k_select',
k_id: 'syncInterfaceName',
k_isDisabled: false,
k_caption: k_tr('Sync/Status Interface:', 'highAvailabilityList'),
k_width: 300,
k_localData: [],
k_fieldIconClassName: 'k_iconClass',
k_fieldDisplay: 'k_value',
k_fieldValue: 'k_id',
k_onChange: function(k_page, k_item, k_selectedValue) {
k_checkTableConsistency();
}
},
{
k_id: 'deviceName',
k_isDisabled: false,
k_caption: k_tr('Device Name:', 'highAvailabilityList'),
k_maxLength: 100,
k_width: 300,
k_checkByteLength: true,
k_emptyText: k_tr('At least 6 characters long', 'highAvailabilityList'),
k_validator: {
k_allowBlank: false,
k_functionName: 'k_devNameMinLength',
k_invalidText: k_tr('Device name must be at least 6 characters long',
'highAvailabilityList'),
},
k_onChange: function(k_form, k_element, k_value) {
kerio.adm.k_framework.k_enableApplyReset(k_element.k_isValid());
}
},
{
k_id: 'sharedSecret',
k_isDisabled: false,
k_caption: k_tr('Shared Secret:', 'highAvailabilityList'),
k_maxLength: 19,
k_width: 300,
k_isPasswordField: true,
k_checkByteLength: true,
k_emptyText: '**********',
k_validator: {
k_allowBlank: false,
k_functionName: 'k_shaSecMinLength',
k_invalidText: k_tr('Shared secret must be at least 10 characters long',
'highAvailabilityList'),
},
k_onChange: function(k_form, k_element, k_value) {
kerio.adm.k_framework.k_enableApplyReset(k_element.k_isValid());
}
},
{
k_type: 'k_display',
k_className: 'haTableText',
k_isSecure: true,
k_style: 'k_padding-top: 8px;',
k_value: k_tr('Select the Interfaces that will have High Availability and for each enter Virtual IP Addresses', 'highAvailabilityList'),
k_id: 'haTableTextId',
k_isLabelHidden: true
},
{
k_id:'virtualIpGridContainer',
k_type: 'k_container',
k_minHeight: 120,
k_content: k_virtualIpsGrid
},
{
k_type: 'k_display',
k_className: 'haExtraText',
k_height: 20,
k_isSecure: true,
k_value: '',
k_id: 'inconsistencyWarning',
k_isLabelHidden: true
}
]
}
]
}; k_form = new kerio.lib.K_Form(k_objectName, k_formCfg);
k_checkTableConsistency= function () {
var formData= k_form.k_getData(true);
var gridData= k_virtualIpsGrid.k_getData();
var warningText="";
for(var i=0;i<gridData.length;i++){
if(gridData[i].interfaceEnabled===true && gridData[i].systemName===formData.syncInterfaceName) {
warningText=k_form.k_SYNC_INTERFACE_USED;
break;
}
}
k_form.k_getItem('inconsistencyWarning').k_setValue(warningText);
};
this.k_addControllers(k_form, k_virtualIpsGrid, k_checkTableConsistency);
k_form.k_addReferences({
k_loadDataRequestCfg: {
k_jsonRpc: {
method: 'HighAvailability.get'
},
k_callback: k_form.k_loadDataCallback,
k_scope: k_form
},
k_saveRequestCfg: {
k_requests: [],
k_callback: k_form.k_sendDataCallback,
k_scope: k_form
},
k_setDataRequestCfg: {
method: 'HighAvailability.set',
params: {}
},
k_CHECK_HA_STATUS_TASK: 'k_checkHAStatusTask',
k_HA_TASK_INTERVAL: 3000,
mockPointer: 0,
mockPointerHealth: 0,
k_WARNING_KERIO_SLAVE: k_tr('Kerio Control Slave is the active device. Configuration sync is not active ' +
'and any changes done on the Slave will not be synchronized with the Master.', 'highAvailabilityList'),
k_ENABLED_ACTIVE_PASSIVE: k_tr('Enabled - Active/Passive', 'highAvailabilityList'),
k_SYNC_INTERFACE_USED: k_tr('The Sync/Status Interface cannot be set as a High Available interface. Please select another interface.', 'highAvailabilityList')
});
k_form.startHaTask=this.startHaTask;;
return k_form;
},
startHaTask: function (k_form) {
if (!kerio.waw.shared.k_tasks.k_isDefined(k_form.k_CHECK_HA_STATUS_TASK)) {
kerio.waw.shared.k_tasks.k_add({
k_id: k_form.k_CHECK_HA_STATUS_TASK,
k_scope: this,
k_interval: k_form.k_HA_TASK_INTERVAL,
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
k_statusElement.k_setValue({k_info: kerio.lib.k_tr(statusReport.status.daemonText, 'serverMessage')});
var statusText = kerio.lib.k_tr(statusReport.status.statusText, 'serverMessage');
if (!Ext.isEmpty(statusReport.status.statusDetail)) {
statusText += " (" + kerio.lib.k_tr(statusReport.status.statusDetail, 'serverMessage') + ")";
}
k_healthElement.k_setValue({k_info: statusText});
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
kerio.waw.shared.k_tasks.k_start(k_form.k_CHECK_HA_STATUS_TASK);
},

k_addControllers: function (k_kerioWidget, k_virtualIpsGrid, k_checkTableConsistency) {
k_kerioWidget.k_onDeactivate = function() {
kerio.waw.shared.k_tasks.k_remove(k_kerioWidget.k_CHECK_HA_STATUS_TASK);
};
k_kerioWidget.k_onActivate = function() {
k_kerioWidget.startHaTask(k_kerioWidget);
};
k_kerioWidget.k_applyParams = function () {
this.k_loadData();
};
k_kerioWidget.k_loadData = function (k_refresh) {
kerio.waw.shared.k_methods.k_maskMainScreen(this);
kerio.lib.k_ajax.k_request(this.k_loadDataRequestCfg);
};
k_kerioWidget.k_loadDataCallback = function (k_response, k_success) {
kerio.waw.shared.k_methods.k_unmaskMainScreen(this);
if (!k_success || !k_response.k_decoded.config) {
return;
}
kerio.lib.k_ajax.k_request({
k_requestOwner: null, k_jsonRpc: {
method: 'Interfaces.get',
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
var list = k_response.k_decoded.list;
var selectData = [];
var tableData = [];
for (var idx in list) {
if (list[idx].type != "Ethernet")
continue
selectData.push({
'k_iconClass': 'interfaceIcon interfaceEthernetPppoe',
'k_value': list[idx].name,
'k_id': list[idx].systemName
});
tableData.push({
interfaceEnabled: false,
interfaceName: list[idx].name,
systemName: list[idx].systemName,
ipAddressV4: list[idx].ip,
ipAddressV6: function (listItem) {
let ret=[];
if(!listItem || !listItem.ip6Addresses)
return "";
for(var i=0;i<listItem.ip6Addresses.length;i++) {
debugger;
if(listItem.ip6Addresses[i] && listItem.ip6Addresses[i].ip)
ret.push(listItem.ip6Addresses[i].ip);
}
return ret.join(", ");
}(list[idx]),
virtualIpV4: '',
virtualIpV6: ''
});
}
k_kerioWidget.k_getItem('syncInterfaceName').k_setData(selectData);
kerio.lib.k_ajax.k_request({
k_requestOwner: null, k_jsonRpc: {
method: 'HighAvailability.get',
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
virtualIpList= k_response.k_decoded.config.virtualInterfaceList;
var isInHash= function () {
}
for(var i in tableData) {
for(var v in virtualIpList ) {
if(tableData[i].systemName==virtualIpList[v].interfaceName) {
tableData[i].interfaceEnabled=true;
tableData[i].virtualIpV4=virtualIpList[v].virtualIpV4;
tableData[i].virtualIpV6=virtualIpList[v].virtualIpV6;
break;
}
}
}
k_virtualIpsGrid.k_setData(tableData);
this.k_setData(k_response.k_decoded.config, true);
kerio.adm.k_framework.k_enableApplyReset(false);
k_checkTableConsistency();
if (k_kerioWidget.k_items.haMode._k_originalValue == 'haDisabled') {
disableHaFields(true);
}
},
k_scope: this
});
},
k_scope: this
});
};
k_kerioWidget.k_sendData = function () {
var k_requests = [];

var config = this.k_getData(true);
var gridData = this.k_getItem('virtualIpGridContainer')._k_childWidgets[0].k_getData();
config.sharedSecretChanged = '' !== this.k_getItem('sharedSecret').k_getValue();
config.virtualInterfaceList=[];
for(var i=0; i<gridData.length; i++) {
if(gridData[i].interfaceEnabled===true) {
config.virtualInterfaceList.push({
name: gridData[i].interfaceName,
interfaceName: gridData[i].systemName,
ipAddressV4: gridData[i].ipAddressV4,
ipAddressV6: gridData[i].ipAddressV6,
virtualIpV4: gridData[i].virtualIpV4,
virtualIpV6: gridData[i].virtualIpV6
});
}
}
this.k_setDataRequestCfg.params = {config: config};
k_requests.push(this.k_setDataRequestCfg);
this.k_saveRequestCfg.k_requests = k_requests;
kerio.waw.shared.k_methods.k_sendBatch(this.k_saveRequestCfg);
};
k_kerioWidget.k_sendDataCallback = function (k_response, k_success) {
if (!k_success || !kerio.waw.shared.k_methods.k_responseIsOk(k_response)) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
return;
}
this.k_loadData(true);
kerio.adm.k_framework.k_enableApplyReset(false);
};
} }; 