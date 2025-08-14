
kerio.waw.ui.dhcpReservationEditor = {

k_init: function(k_objectName) {
var
k_LABEL_WIDTH = 200, k_isAuditor = kerio.waw.shared.k_methods.k_isAuditor(),
k_localNamespace = k_objectName + '_',
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_isItemAdd = 'dhcpReservationEditorAdd' === k_objectName || 'dhcpReservationEditorAddSimple' === k_objectName,
k_isViewLease = 'dhcpReservationEditorViewLease' === k_objectName || 'dhcpReservationEditorViewLeaseSimple' === k_objectName,
k_isAdvancedMode = 'dhcpReservationEditorAddSimple' !== k_objectName && 'dhcpReservationEditorEditSimple' !== k_objectName
&& 'dhcpReservationEditorViewLeaseSimple' !== k_objectName && 'dhcpReservationEditorViewReservationSimple' !== k_objectName,
k_optionsGrid,
k_formCfg,
k_form,
k_dialogTitle,
k_dialogCfg,
k_dialog;
if (k_isAdvancedMode) {
k_optionsGrid = new kerio.waw.shared.k_widgets.K_DhcpOptionsGrid(k_localNamespace + 'optionsGrid', { k_isLease: true});
}
k_formCfg =  {
k_isReadOnly: k_isAuditor,
k_items: [
{
k_id: 'name',
k_caption: k_tr('Name:', 'common'),
k_maxLength: 127,
k_validator: {
k_allowBlank: false
}
},
{
k_type: 'k_fieldset',
k_className: 'marginTop',
k_height: 103,
k_caption: k_tr('Lease definition', 'dhcpReservationEditor'),
k_items: [
{ k_type: 'k_row',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'macDefined',
k_option: k_tr('MAC address:', 'dhcpReservationEditor'),
k_value: true,
k_isChecked: true,
k_isLabelHidden: true,
k_width: k_LABEL_WIDTH, 
k_onChange: function(k_form) {
k_form.k_switchReservationType.apply(this, arguments);
} },
{
k_id: 'macAddress',
k_isLabelHidden: true,
k_maxLength: kerio.waw.shared.k_CONSTANTS.k_MAX_LENGTH.k_MAC_ADDRESS,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isMacAddress'
}
}
]},{ k_type: 'k_row',
k_items: [
{
k_type: 'k_radio',
k_groupId: 'macDefined',
k_option: k_tr('Hostname:', 'dhcpReservationEditor'),
k_value: false,
k_isChecked: false,
k_isLabelHidden: true,
k_width: k_LABEL_WIDTH, 
k_onChange: function(k_form) {
k_form.k_switchReservationType.apply(this, arguments);
} },
{
k_id: 'hostName',
k_isLabelHidden: true,
k_maxLength: 63,
k_isDisabled: true, k_validator: {
k_allowBlank: false,
k_functionName: 'k_hasNoSpaces'
}
}
]},{ k_type: 'k_row',
k_labelWidth: k_LABEL_WIDTH,
k_items: [
{
k_id: 'ipAddress',
k_caption: k_isViewLease ? k_tr('Leased address:', 'dhcpReservationEditor') : k_tr('Reserved address:', 'dhcpReservationEditor'),
k_maxLength: 15,
k_validator: {
k_allowBlank: false,
k_functionName: 'k_isIpAddress',
k_inputFilter: kerio.waw.shared.k_DEFINITIONS.k_ipv4.k_allowedChars
},
k_onChange: kerio.waw.shared.k_methods.k_allowOnlyIpv4Chars
}
]
}
] } ]};if (k_isAdvancedMode) {
k_formCfg.k_items.push({
k_id: 'k_fieldsetOptions',
k_type: 'k_fieldset',
k_caption: k_tr('DHCP options', 'dhcpReservationEditor'),
k_minHeight: 160,
k_content: k_optionsGrid
});
}
k_form = new k_lib.K_Form(k_localNamespace + 'k_form', k_formCfg);
if (k_isItemAdd) {
k_dialogTitle = k_tr('Add Lease Reservation', 'dhcpReservationEditor');
} else {
if (k_isAuditor) {
if (k_isViewLease) {
k_dialogTitle = k_tr('View Lease', 'dhcpReservationEditor');
}
else {
k_dialogTitle = k_tr('View Lease Reservation', 'dhcpReservationEditor');
}
}
else {
k_dialogTitle = k_tr('Edit Lease Reservation', 'dhcpReservationEditor');
}
}
k_dialogCfg = {
k_title: k_dialogTitle,
k_isReadOnly: k_isAuditor,
k_content: k_form,
k_width: 525,
k_height: (k_isAdvancedMode ? 500 : 235),
k_defaultItem: 'name',

k_onOkClick: function() {
this.k_dialog.k_saveData();
}
};k_dialogCfg = kerio.waw.shared.k_DEFINITIONS.k_get('K_SimpleDialog', k_dialogCfg);
k_dialog = new k_lib.K_Dialog(k_objectName, k_dialogCfg);
k_dialog.k_addReferences({
k_form: k_form,
k_optionsGrid: k_isAdvancedMode ? k_optionsGrid : {},
k_isItemAdd: k_isItemAdd,
k_relatedGrid: {},
k_dataStore: {},
k_currentScope: {},
k_scopeData: {},
k_scopesList: [],
k_isAdvancedMode: k_isAdvancedMode,
k_formatMacAddress: kerio.waw.shared.k_methods.k_formatMacAddress,
_k_foundDuplicateHosts: [],
_k_foundDuplicateIps:   [],
_k_duplicateChecked: false,
_k_ipScopeChecked: false,
_k_ipChangeChecked: false,
_k_removeLeaseOnUpdate: false });
this.k_addControllers(k_dialog);
return k_dialog;
},
k_addControllers: function(k_kerioWidget) {

k_kerioWidget.k_optionsGrid.k_isLeaseOption = function(k_data) {
return (true === k_data.isLease);
};
k_kerioWidget.k_applyParams = function(k_params) {
var
k_data = k_params.k_data,
k_scopeData = k_params.k_scopeData,
k_options = [],
k_scopeOptions = k_scopeData.options,
k_leaseOptions; this.k_relatedGrid = k_params.k_relatedGrid;
this.k_scopeData = k_scopeData;
this.k_scopesList = k_params.k_scopesList;
if (k_data.id) {
k_data = kerio.lib.k_cloneObject(k_data); k_data.name = k_data.name || k_data.hostName || k_data.ipAddress || ''; this.k_dataStore = k_data;
this.k_origDataStore = kerio.lib.k_cloneObject(k_data);
k_data.macAddress = this.k_formatMacAddress(k_data.macAddress);
this.k_form.k_setData(k_data, true);
k_leaseOptions = k_data.options;
}
else {
this.k_dataStore = null;
}
if (this.k_isAdvancedMode) {
k_options.push(
{
k_options: k_scopeOptions,
k_isLease: false
}
); if (k_leaseOptions) {
k_options.push(
{
k_options: k_leaseOptions,
k_isLease: true
}
); }  this.k_optionsGrid.k_setData(k_options);
this.k_optionsGrid.k_startTracing();
}
kerio.waw.shared.k_data.k_cache({ k_dialog: this }); };
k_kerioWidget.k_testIpAddressInNet = function(k_scopeData, k_ipAddress) {
var
k_ipToBinary = kerio.waw.shared.k_methods.k_ipToBinary,
k_ipAddressBin = k_ipToBinary(k_ipAddress),
k_scopeMaskBin = k_ipToBinary(k_scopeData.ipMask),
k_scopeStartBin = k_ipToBinary(k_scopeData.ipStart),
k_scopeEndBin = k_ipToBinary(k_scopeData.ipEnd),
k_ipAddressAndMask = k_ipAddressBin & k_scopeMaskBin,
k_scopeStartAndMask = k_scopeStartBin & k_scopeMaskBin,
k_scopeEndAndMask = k_scopeEndBin & k_scopeMaskBin,
k_isInNet,
k_notEdges;
k_isInNet = k_ipAddressAndMask === k_scopeStartAndMask;
k_notEdges = (k_scopeStartAndMask !== k_ipAddressBin && k_scopeEndAndMask !== k_ipAddressBin)
&& ((k_scopeStartBin | ~k_scopeMaskBin) !== k_ipAddressBin && (k_scopeEndBin | ~k_scopeMaskBin) !== k_ipAddressBin);
return k_isInNet && k_notEdges;
};
k_kerioWidget.k_saveData = function() {
var
k_lib = kerio.lib,
k_tr = k_lib.k_tr,
k_shared = kerio.waw.shared,
k_methods = k_shared.k_methods,
k_form = this.k_form,
k_formData = k_form.k_getData(true),  k_data = this.k_dataStore,            k_scopesList = this.k_scopesList,
k_scope,
k_i, k_cnt;
for (k_i = 0, k_cnt = k_scopesList.length; k_i < k_cnt; k_i++) {
if (this.k_testIpAddressInNet(k_scopesList[k_i], k_formData.ipAddress)) {
k_scope = k_scopesList[k_i];
break;
}
}
if (!k_scope) {
k_lib.k_alert(
k_tr('Validation Warning', 'common'),
k_tr('Specified reservation is out of defined networks.', 'dhcpReservationEditor')
);
this.k_hideMask();k_methods.k_unmaskMainScreen();
k_form.k_getItem('ipAddress').k_markInvalid();
return;
}
this.k_currentScope = k_scope;
k_formData.macAddress = k_methods.k_removeMacAddressDelimiters(k_formData.macAddress);
if (k_data) {
k_methods.k_mergeObjects(k_formData, k_data);
if (kerio.waw.shared.k_CONSTANTS.DhcpLeaseType.DhcpTypeReservation === k_data.type
&& (!this.k_isAdvancedMode || true !== this.k_optionsGrid.k_isChanged())
&& kerio.waw.shared.k_methods.k_compare(k_data, this.k_origDataStore))
{ this.k_hide();
return;
}
}
else {
k_data = kerio.waw.shared.k_DEFINITIONS.k_get('k_predefinedDhcpReservation', k_formData);
}
if (this.k_isAdvancedMode) {
k_data.options = this.k_optionsGrid.k_findRowBy(this.k_optionsGrid.k_isLeaseOption, this.k_optionsGrid, 0, true);
}
if (!k_data.options || Array !== k_data.options.constructor) {
k_data.options = []; }
this.k_dataStore = k_data;
k_methods.k_unmaskMainScreen();
this._k_duplicateChecked = false;
this._k_ipScopeChecked = false;
this._k_ipChangeChecked = false;
this._k_sendData(); };
k_kerioWidget._k_sendData = function() {
var
k_requests,
k_data = this.k_dataStore;
if (!this._k_duplicateChecked) {
this.k_checkDuplicate();
return;
}
if (!this._k_ipScopeChecked) {
this.k_checkIpScope();
return;
}
if (!this._k_ipChangeChecked) {
this.k_checkIpChange();
return;
}
if (this.k_isItemAdd) {
k_requests = {
k_jsonRpc: {
method: 'Dhcp.createLeases',
params: {
leases: [k_data]
}
}
};
} else {
if (this._k_removeLeaseOnUpdate) { this._k_removeLeaseOnUpdate = false;
k_requests = [{
k_jsonRpc: {
method: 'Dhcp.removeLeases',
params: {
leaseIds: [k_data.id]
}
}
}, {
k_jsonRpc: {
method: 'Dhcp.createLeases',
params: {
leases: [k_data]
}
}
}];
}
else {
k_requests = {
k_jsonRpc: {
method: 'Dhcp.setLeases',
params: {
leaseIds: [k_data.id],
details: k_data
}
}
};
}
}
kerio.waw.requests.k_sendBatch(k_requests, {
k_callback: this._k_sendDataCallback,
k_scope:this
});
}; 
k_kerioWidget._k_sendDataCallback = function(k_response, k_success) {
if (k_success) {
this.k_relatedGrid.k_scopesGrid.k_getLeases(this.k_scopeData);
kerio.adm.k_framework.k_enableApplyReset();
this.k_hide();
}
};

k_kerioWidget.k_checkDuplicate = function() {
var
k_data = this.k_dataStore,
k_shared = kerio.waw.shared,
k_methods = k_shared.k_methods,
k_get = k_shared.k_DEFINITIONS.k_get,
k_hostConditions = [],
k_ipConditions = [],
k_idCondition;
if (k_data.macDefined) {
k_hostConditions.push(k_get('k_searchCondition', {
k_fieldName: 'macAddress',
k_value: k_data.macAddress,
k_match: true
}));
}
else {
k_hostConditions.push(k_get('k_searchCondition', {
k_fieldName: 'hostName',
k_value: k_data.hostName,
k_match: true
}));
}
k_ipConditions.push(k_get('k_searchCondition', {
k_fieldName: 'ipAddressPlain', k_value: k_data.ipAddress,
k_match: true
}));
if (!this.k_isItemAdd) { k_idCondition = {
k_fieldName: 'id',
k_value: k_data.id,
k_comparator: k_shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_NotEq
};
k_hostConditions.push(k_get('k_searchCondition', k_idCondition)); k_ipConditions.push(k_get('k_searchCondition', k_idCondition));
}
kerio.waw.requests.k_sendBatch([
{ k_jsonRpc: {
method: 'Dhcp.getLeases',
params: {
query: {
conditions: k_hostConditions,
combining: k_shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_And,
start: 0,
limit: -1,
orderBy: []
},
scopeIds: []
}
},
k_callback: function(k_response, k_success) {
this._k_foundDuplicateHosts = (k_success ? k_response.list : []);
},
k_scope: this
},
{
k_jsonRpc: {
method: 'Dhcp.getLeases',
params: {
query: {
conditions: k_ipConditions,
combining: k_shared.k_CONSTANTS.kerio_web_SharedConstants.kerio_web_And,
start: 0,
limit: -1,
orderBy: []
},
scopeIds: []
}
},
k_callback: function(k_response, k_success) {
this._k_foundDuplicateIps = (k_success ? k_response.list : []);
},
k_scope: this
}
], {
k_callback: this._k_checkDuplicateCallback,
k_scope: this
});
}; 
k_kerioWidget._k_checkDuplicateCallback = function(k_response, k_success) {
var
k_hosts = this._k_foundDuplicateHosts,
k_ips   = this._k_foundDuplicateIps,
k_data  = this.k_dataStore,
k_macDefined = k_data.macDefined,
k_checkField = (k_macDefined ? 'macAddress' : 'hostName'),
k_tr = kerio.lib.k_tr,
k_alert = kerio.lib.k_alert,
k_confirm = kerio.lib.k_confirm,
k_leaseCollision = false,
k_scope,
k_item,
k_i, k_cnt,
k_hostList;
if (!k_success) {
return;
}
this._k_duplicateChecked = true;
if (k_ips.length) {
k_item = k_ips[0]; if (kerio.waw.shared.k_CONSTANTS.DhcpLeaseType.DhcpTypeReservation === k_item.type) {
k_alert({
k_title: k_tr('Validation Warning', 'common'),
k_msg: k_tr('IP address %1 is already reserved for host %2.', 'dhcpReservationEditor', {
k_args: [
k_data.ipAddress,
(k_item.hostName && k_item.macAddress)
? ('"' + k_item.hostName + '" (' + this.k_formatMacAddress(k_item.macAddress) + ')')
: (k_item.hostName ? ('"' + k_item.hostName + '"') : this.k_formatMacAddress(k_item.macAddress))
]
})
+ '<br /><br /><b>'
+ k_tr('Please choose another IP address.', 'dhcpReservationEditor')
+ '</b>',
k_icon: 'warning'
});
return;
} if (k_data[k_checkField] !== k_item[k_checkField]) {
k_leaseCollision = k_tr('IP address %1 is already leased by host %2.', 'dhcpReservationEditor', {
k_args: [
k_data.ipAddress,
(k_item.hostName && k_item.macAddress)
? ('"' + k_item.hostName + '" (' + this.k_formatMacAddress(k_item.macAddress) + ')')
: (k_item.hostName ? ('"' + k_item.hostName + '"') : this.k_formatMacAddress(k_item.macAddress))
]
})
+ '<br /><br /><b>'
+ (this.k_isItemAdd
? k_tr('If you add this reservation, the existing lease will be overwritten. Do you want to continue?', 'dhcpReservationEditor')
: k_tr('If you change this reservation, the existing lease will be overwritten. Do you want to continue?', 'dhcpReservationEditor')
)
+ '</b>';
} }
if (k_hosts.length && (1 !== k_hosts.length || k_data.ipAddress !== k_hosts[0].ipAddress)) {
k_hostList = [];
k_cnt = k_hosts.length;
if (5 < k_cnt) {
k_cnt = 4;
}
for (k_i = 0; k_i < k_cnt; k_i++) {
if (k_data.ipAddress === k_hosts[k_i].ipAddress) {
continue; }
k_hostList.push(k_hosts[k_i].ipAddress);
} if (5 < k_cnt) {
k_cnt = k_hosts.length - k_cnt;
k_hostList.push(k_tr('…and %1 more', 'dhcpReservationEditor', { k_args: [k_cnt] }));
}
kerio.lib.k_confirm({
k_title: k_tr('Validation Warning', 'common'),
k_msg: (k_macDefined
? k_tr('MAC address %1 has already reserved or leased the following IP [address|addresses]: %2', 'dhcpReservationEditor', {
k_args: [
this.k_formatMacAddress(k_data.macAddress),
'<br />' + k_hostList.join('<br />')
],
k_pluralityBy: k_hostList.length,
k_isSecure: true
}
)
: k_tr('Host name %1 has already reserved or leased the following IP [address|addresses]: %2', 'dhcpReservationEditor', {
k_args: [
'"' + k_data.hostName + '"',
'<br />' + k_hostList.join('<br />')
],
k_pluralityBy: k_hostList.length,
k_isSecure: true
}
)
) + '<br /><br />'
+ (k_leaseCollision
? k_leaseCollision
: ('<b>' + (this.k_isItemAdd
? k_tr('Do you want to add this reservation?', 'dhcpReservationEditor') + '</b>'
: k_tr('Do you want to change this reservation?', 'dhcpReservationEditor') + '</b>'
)
)
),
k_callback: this._k_checkDuplicateConfirm,
k_scope: this
});
return;
}
if (k_leaseCollision) { k_confirm({
k_title: k_tr('Validation Warning', 'common'),
k_msg: k_leaseCollision,
k_callback: this._k_checkDuplicateConfirm,
k_scope: this
});
return;
}
this._k_sendData();
}; 
k_kerioWidget._k_checkDuplicateConfirm = function(k_answer) {
if ('yes' === k_answer) {
this._k_sendData();
}
}; 
k_kerioWidget.k_checkIpScope = function() {
var
k_tr = kerio.lib.k_tr,
k_alert = kerio.lib.k_alert,
k_confirm = kerio.lib.k_confirm,
k_scope;
this._k_ipScopeChecked = true;
k_scope = this.k_currentScope;
if (k_scope.id !== this.k_scopeData.id) {
if (this.k_isItemAdd) {
k_alert(
k_tr('Validation Warning', 'common'),
k_tr('Specified reservation is out of current network.', 'dhcpReservationEditor')
);
this.k_hideMask();kerio.waw.shared.k_methods.k_unmaskMainScreen();
this.k_form.k_getItem('ipAddress').k_markInvalid();
} else {
k_confirm({
k_title: k_tr('Confirm Action', 'common'),
k_msg: k_tr('This IP address belongs to the network %1 (%2 - %3).', 'dhcpReservationEditor', {k_args: [k_scope.name, k_scope.ipStart, k_scope.ipEnd]})
+ '<br><br><b>'
+ k_tr('Do you want to move the reservation into a different DHCP scope?', 'dhcpReservationEditor')
+ '</b>',
k_callback: this._k_checkIpScopeConfirm,
k_scope: this.k_form
});
}
return;
}
this._k_sendData();
}; 
k_kerioWidget._k_checkIpScopeConfirm = function(k_response) {
if ('no' === k_response) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
return;
}
this.k_parentWidget._k_sendData();
};

k_kerioWidget.k_checkIpChange = function() {
var
k_data = this.k_dataStore,
k_orig = this.k_origDataStore,
k_macDefined = k_data.macDefined,
k_hostChanged = false,
k_ipChanged = false,
k_tr = kerio.lib.k_tr,
k_confirm = kerio.lib.k_confirm,
k_leaseCollision = false;
this._k_ipChangeChecked = true;
if (k_orig && k_orig.leased) {
if (k_orig.ipAddress !== k_data.ipAddress) {
k_leaseCollision = k_tr('This reservation is already leased by the device.', 'dhcpReservationEditor');
k_ipChanged = true;
}
if (k_macDefined && k_orig.macAddress !== k_data.macAddress) {
k_leaseCollision = k_tr('This reservation is already leased by a device with MAC address "%1".', 'dhcpReservationEditor',
{k_args: [this.k_formatMacAddress(k_orig.macAddress)]});
k_hostChanged =  true;
}
else if (!k_macDefined && k_orig.hostName !== k_data.hostName) {
k_leaseCollision = k_tr('This reservation is already leased by the device "%1".', 'dhcpReservationEditor',
{k_args: [ kerio.lib.k_htmlEncode(k_orig.hostName)]});
k_hostChanged =  true;
}
if (k_ipChanged !== k_hostChanged) { k_confirm({
k_title: k_tr('Confirm Action', 'common'),
k_msg: k_leaseCollision +
'<br><br><b>' +
k_tr('In order to correctly reserve the IP address, the existing lease must be released.', 'dhcpReservationEditor') +
'</b><br><br>' +
k_tr('Do you want to continue?', 'common'),
k_callback: this._k_checkIpChangeConfirm,
k_scope: this.k_form
});
return;
}
}
this._k_sendData();
}; k_kerioWidget._k_checkIpChangeConfirm = function(k_response){
if ('no' === k_response) {
kerio.waw.shared.k_methods.k_unmaskMainScreen();
return;
}
this.k_parentWidget._k_removeLeaseOnUpdate = true;
this.k_parentWidget._k_sendData();
};

k_kerioWidget.k_resetOnClose = function() {
this.k_form.k_reset();
if (this.k_isAdvancedMode) {
this.k_optionsGrid.k_stopTracing();
this.k_optionsGrid.k_resetGrid();
}
};
k_kerioWidget.k_form.k_switchReservationType = function(k_form, k_element, k_macDefined) {
k_form.k_setDisabled('hostName', k_macDefined);
k_form.k_setDisabled('macAddress', !k_macDefined);
};
}};